import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/models/booking_model.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/utils/supabase_client.dart';

/// State representation for customer booking management
class CustomerBookingState {
  final List<BookingModel> bookings;
  final BookingModel? selectedBooking;
  final bool isLoading;
  final bool isSubmitting;
  final bool hasMore;
  final int currentPage;
  final String? error;

  const CustomerBookingState({
    this.bookings = const [],
    this.selectedBooking,
    this.isLoading = false,
    this.isSubmitting = false,
    this.hasMore = true,
    this.currentPage = 1,
    this.error,
  });

  CustomerBookingState copyWith({
    List<BookingModel>? bookings,
    BookingModel? selectedBooking,
    bool? isLoading,
    bool? isSubmitting,
    bool? hasMore,
    int? currentPage,
    String? error,
    bool clearSelected = false,
    bool clearError = false,
  }) {
    return CustomerBookingState(
      bookings: bookings ?? this.bookings,
      selectedBooking:
          clearSelected ? null : (selectedBooking ?? this.selectedBooking),
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      hasMore: hasMore ?? this.hasMore,
      currentPage: currentPage ?? this.currentPage,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// StateNotifierProvider for Customer Bookings
final customerBookingProvider =
    StateNotifierProvider<BookingNotifier, CustomerBookingState>((ref) {
  final storage = ref.watch(storageServiceProvider);
  return BookingNotifier(supabase: supabase, storageService: storage);
});

/// Future provider for convenient initial customer bookings fetching
final customerBookingsListProvider =
    FutureProvider.autoDispose<List<BookingModel>>((ref) async {
  final notifier = ref.watch(customerBookingProvider.notifier);
  return await notifier.getMyBookings(refresh: true);
});

/// BookingNotifier manages customer service requests, tracking, payments, and ratings.
class BookingNotifier extends StateNotifier<CustomerBookingState> {
  final SupabaseClient _client;
  final StorageService _storageService;
  RealtimeChannel? _realtimeSubscription;

  BookingNotifier({
    SupabaseClient? supabase,
    StorageService? storageService,
  })  : _client = supabase ?? Supabase.instance.client,
        _storageService = storageService ?? StorageService(supabase),
        super(const CustomerBookingState()) {
    _initRealtimeSubscription();
  }

  String? get _currentUserId => _client.auth.currentUser?.id;

  /// Initializes Supabase Realtime listener on bookings table for the logged-in customer.
  void _initRealtimeSubscription() {
    final customerId = _currentUserId;
    if (customerId == null) return;

    _realtimeSubscription?.unsubscribe();

    _realtimeSubscription = _client
        .channel('customer_bookings_$customerId')
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: SupabaseTables.bookings,
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'customer_id',
            value: customerId,
          ),
          callback: (payload) {
            _handleRealtimeBookingChange(payload);
          },
        )
        .subscribe();
  }

  void _handleRealtimeBookingChange(PostgresChangePayload payload) {
    try {
      final record = payload.newRecord;
      if (record.isEmpty) return;

      final updatedBookingId = record['id'] as String?;
      if (updatedBookingId == null) return;

      // Re-fetch this individual booking with joins to keep UI consistent
      getBookingDetail(updatedBookingId).then((updatedDetail) {
        if (updatedDetail != null) {
          final updatedList = state.bookings.map((b) {
            return b.id == updatedDetail.id ? updatedDetail : b;
          }).toList();

          if (!updatedList.any((b) => b.id == updatedDetail.id)) {
            updatedList.insert(0, updatedDetail);
          }

          state = state.copyWith(
            bookings: updatedList,
            selectedBooking: state.selectedBooking?.id == updatedDetail.id
                ? updatedDetail
                : state.selectedBooking,
          );
        }
      });
    } catch (e) {
      debugPrint('Realtime customer booking parse error: $e');
    }
  }

  /// Create a new service booking request
  Future<BookingModel?> createBooking({
    required String serviceId,
    required String problemDescription,
    required String address,
    double? latitude,
    double? longitude,
    DateTime? scheduledAt,
    String paymentMethod = PaymentMethod.cashOnDelivery,
    String? categoryId,
  }) async {
    final customerId = _currentUserId;
    if (customerId == null) {
      state = state.copyWith(error: 'User not authenticated');
      return null;
    }

    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      // Lookup service price for total calculation
      double servicePrice = 0.0;
      try {
        final serviceData = await _client
            .from(SupabaseTables.services)
            .select('base_price, category_id')
            .eq('id', serviceId)
            .maybeSingle();

        if (serviceData != null) {
          servicePrice =
              (serviceData['base_price'] as num?)?.toDouble() ?? 0.0;
          categoryId ??= serviceData['category_id'] as String?;
        }
      } catch (_) {}

      final now = DateTime.now();
      final scheduledDate = scheduledAt ?? now.add(const Duration(hours: 2));

      final bookingPayload = {
        'customer_id': customerId,
        'service_id': serviceId,
        'category_id': categoryId,
        'status': BookingStatus.pending,
        'scheduled_at': scheduledDate.toIso8601String(),
        'total_amount': servicePrice,
        'commission_rate': 10.0,
        'commission_amount': servicePrice * 0.10,
        'payment_method': paymentMethod,
        'payment_status': PaymentStatus.pending,
        'customer_address': address,
        'customer_latitude': latitude,
        'customer_longitude': longitude,
        'customer_notes': problemDescription,
        'created_at': now.toIso8601String(),
        'updated_at': now.toIso8601String(),
      };

      final response = await _client
          .from(SupabaseTables.bookings)
          .insert(bookingPayload)
          .select('*, service:services(*), worker:profiles!worker_id(*)')
          .single();

      final createdBooking = BookingModel.fromJson(response);

      state = state.copyWith(
        bookings: [createdBooking, ...state.bookings],
        selectedBooking: createdBooking,
        isSubmitting: false,
      );

      return createdBooking;
    } catch (e) {
      debugPrint('createBooking error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to create booking: $e',
      );
      return null;
    }
  }

  /// Fetches customer bookings with pagination
  Future<List<BookingModel>> getMyBookings({
    bool refresh = false,
    int page = 1,
    int limit = 20,
  }) async {
    final customerId = _currentUserId;
    if (customerId == null) return [];

    if (refresh) {
      state = state.copyWith(isLoading: true, currentPage: 1, clearError: true);
    } else {
      state = state.copyWith(isLoading: true);
    }

    try {
      final targetPage = refresh ? 1 : page;
      final from = (targetPage - 1) * limit;
      final to = from + limit - 1;

      final response = await _client
          .from(SupabaseTables.bookings)
          .select('*, service:services(*), worker:profiles!worker_id(*)')
          .eq('customer_id', customerId)
          .order('created_at', ascending: false)
          .range(from, to);

      final List<BookingModel> loaded = (response as List)
          .map((item) => BookingModel.fromJson(item as Map<String, dynamic>))
          .toList();

      final updatedList = refresh ? loaded : [...state.bookings, ...loaded];
      final hasMore = loaded.length >= limit;

      state = state.copyWith(
        bookings: updatedList,
        isLoading: false,
        hasMore: hasMore,
        currentPage: targetPage,
      );

      return loaded;
    } catch (e) {
      debugPrint('getMyBookings error: $e');
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to load bookings: $e',
      );
      return [];
    }
  }

  /// Get detailed single booking record with service and worker relations
  Future<BookingModel?> getBookingDetail(String bookingId) async {
    try {
      final response = await _client
          .from(SupabaseTables.bookings)
          .select('*, service:services(*), worker:profiles!worker_id(*)')
          .eq('id', bookingId)
          .maybeSingle();

      if (response == null) return null;

      final detail = BookingModel.fromJson(response);
      state = state.copyWith(selectedBooking: detail);
      return detail;
    } catch (e) {
      debugPrint('getBookingDetail error: $e');
      return null;
    }
  }

  /// Submit digital payment (JazzCash, Easypaisa, Bank Transfer) with transaction ref and screenshot
  Future<bool> submitPayment(
    String bookingId,
    String paymentMethod,
    String reference,
    String screenshotPath,
  ) async {
    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      String? screenshotUrl;
      if (screenshotPath.isNotEmpty) {
        final file = File(screenshotPath);
        if (await file.exists()) {
          screenshotUrl = await _storageService.uploadPaymentProof(file);
        } else {
          screenshotUrl = screenshotPath;
        }
      }

      final updatePayload = {
        'payment_method': paymentMethod,
        'payment_status': 'payment_pending',
        'status': 'payment_pending',
        'payment_reference': reference,
        if (screenshotUrl != null) 'payment_proof_url': screenshotUrl,
        'updated_at': DateTime.now().toIso8601String(),
      };

      await _client
          .from(SupabaseTables.bookings)
          .update(updatePayload)
          .eq('id', bookingId);

      await getBookingDetail(bookingId);
      state = state.copyWith(isSubmitting: false);
      return true;
    } catch (e) {
      debugPrint('submitPayment error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to submit payment details: $e',
      );
      return false;
    }
  }

  /// Customer confirms final bill submitted by the worker
  Future<bool> confirmFinalBill(String bookingId) async {
    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      await _client.from(SupabaseTables.bookings).update({
        'status': BookingStatus.completed,
        'completed_at': DateTime.now().toIso8601String(),
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('id', bookingId);

      await getBookingDetail(bookingId);
      state = state.copyWith(isSubmitting: false);
      return true;
    } catch (e) {
      debugPrint('confirmFinalBill error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to confirm final bill: $e',
      );
      return false;
    }
  }

  /// Customer disputes the final bill
  Future<bool> disputeBill(String bookingId, String reason) async {
    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      await _client.from(SupabaseTables.bookings).update({
        'status': 'disputed',
        'cancellation_reason': 'Disputed bill: $reason',
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('id', bookingId);

      await getBookingDetail(bookingId);
      state = state.copyWith(isSubmitting: false);
      return true;
    } catch (e) {
      debugPrint('disputeBill error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to dispute bill: $e',
      );
      return false;
    }
  }

  /// Customer cancels their booking
  Future<bool> cancelBooking(String bookingId, String reason) async {
    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      await _client.from(SupabaseTables.bookings).update({
        'status': BookingStatus.cancelled,
        'cancellation_reason': reason,
        'cancel_initiator': 'customer',
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('id', bookingId);

      await getBookingDetail(bookingId);
      state = state.copyWith(isSubmitting: false);
      return true;
    } catch (e) {
      debugPrint('cancelBooking error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to cancel booking: $e',
      );
      return false;
    }
  }

  /// Customer rates and reviews worker upon job completion
  Future<bool> rateWorker(
    String bookingId,
    double rating,
    String comment,
  ) async {
    final customerId = _currentUserId;
    if (customerId == null) return false;

    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      final booking = state.selectedBooking ?? await getBookingDetail(bookingId);
      if (booking == null || booking.workerId == null) {
        state = state.copyWith(
          isSubmitting: false,
          error: 'Worker information not found for this booking.',
        );
        return false;
      }

      await _client.from(SupabaseTables.reviews).insert({
        'booking_id': bookingId,
        'reviewer_id': customerId,
        'worker_id': booking.workerId,
        'rating': rating,
        'comment': comment,
        'created_at': DateTime.now().toIso8601String(),
      });

      // Recalculate worker's aggregate rating
      try {
        final workerReviews = await _client
            .from(SupabaseTables.reviews)
            .select('rating')
            .eq('worker_id', booking.workerId!);

        if (workerReviews.isNotEmpty) {
          final totalReviews = workerReviews.length;
          final sumRating = workerReviews.fold<double>(
            0.0,
            (acc, curr) => acc + ((curr['rating'] as num?)?.toDouble() ?? 0.0),
          );
          final avgRating = sumRating / totalReviews;

          await _client.from(SupabaseTables.workerProfiles).update({
            'rating': double.parse(avgRating.toStringAsFixed(1)),
            'total_reviews': totalReviews,
            'updated_at': DateTime.now().toIso8601String(),
          }).eq('user_id', booking.workerId!);
        }
      } catch (_) {}

      state = state.copyWith(isSubmitting: false);
      return true;
    } catch (e) {
      debugPrint('rateWorker error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to submit review: $e',
      );
      return false;
    }
  }

  @override
  void dispose() {
    _realtimeSubscription?.unsubscribe();
    super.dispose();
  }
}
