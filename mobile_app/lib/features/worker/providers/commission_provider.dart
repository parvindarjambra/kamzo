import 'dart:io';
import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/utils/supabase_client.dart';

/// Commission item model representing platform fee owed by a worker for cash-on-delivery jobs
class CommissionModel extends Equatable {
  final String id;
  final String workerId;
  final String? bookingId;
  final double amount;
  final double rate;
  final String status; // 'pending', 'paid', 'collected', 'disputed', 'waived'
  final String? paymentMethod;
  final String? paymentReference;
  final String? screenshotUrl;
  final DateTime? dueDate;
  final DateTime? paidAt;
  final DateTime createdAt;

  // Joined booking information
  final String? bookingNumber;
  final String? serviceName;
  final double? bookingAmount;

  const CommissionModel({
    required this.id,
    required this.workerId,
    this.bookingId,
    required this.amount,
    this.rate = 10.0,
    this.status = CommissionStatus.pending,
    this.paymentMethod,
    this.paymentReference,
    this.screenshotUrl,
    this.dueDate,
    this.paidAt,
    required this.createdAt,
    this.bookingNumber,
    this.serviceName,
    this.bookingAmount,
  });

  bool get isPending => status == CommissionStatus.pending;
  bool get isPaid => status == 'paid' || status == CommissionStatus.collected;
  bool get isDisputed => status == CommissionStatus.disputed;

  String get formattedAmount => Formatters.formatCurrency(amount);

  factory CommissionModel.fromJson(Map<String, dynamic> json) {
    final booking = json['booking'] as Map<String, dynamic>?;
    final service = booking?['service'] as Map<String, dynamic>?;

    return CommissionModel(
      id: json['id'] as String,
      workerId: json['worker_id'] as String? ?? '',
      bookingId: json['booking_id'] as String?,
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      rate: (json['rate'] as num?)?.toDouble() ?? 10.0,
      status: json['status'] as String? ?? CommissionStatus.pending,
      paymentMethod: json['payment_method'] as String?,
      paymentReference: json['payment_reference'] as String?,
      screenshotUrl: json['screenshot_url'] as String?,
      dueDate: json['due_date'] != null
          ? DateTime.tryParse(json['due_date'] as String)
          : null,
      paidAt: json['paid_at'] != null
          ? DateTime.tryParse(json['paid_at'] as String)
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
      bookingNumber: booking?['booking_number'] as String?,
      serviceName: service?['name_english'] as String?,
      bookingAmount: (booking?['total_amount'] as num?)?.toDouble(),
    );
  }

  @override
  List<Object?> get props => [
        id,
        workerId,
        bookingId,
        amount,
        rate,
        status,
        paymentMethod,
        paymentReference,
        screenshotUrl,
        dueDate,
        paidAt,
        createdAt,
        bookingNumber,
        serviceName,
        bookingAmount,
      ];
}

/// State representation for worker platform commissions
class CommissionState {
  final List<CommissionModel> commissions;
  final double totalDue;
  final double totalPaid;
  final double totalPending;
  final bool isLoading;
  final bool isSubmitting;
  final bool hasMore;
  final int currentPage;
  final String? error;

  const CommissionState({
    this.commissions = const [],
    this.totalDue = 0.0,
    this.totalPaid = 0.0,
    this.totalPending = 0.0,
    this.isLoading = false,
    this.isSubmitting = false,
    this.hasMore = true,
    this.currentPage = 1,
    this.error,
  });

  CommissionState copyWith({
    List<CommissionModel>? commissions,
    double? totalDue,
    double? totalPaid,
    double? totalPending,
    bool? isLoading,
    bool? isSubmitting,
    bool? hasMore,
    int? currentPage,
    String? error,
    bool clearError = false,
  }) {
    return CommissionState(
      commissions: commissions ?? this.commissions,
      totalDue: totalDue ?? this.totalDue,
      totalPaid: totalPaid ?? this.totalPaid,
      totalPending: totalPending ?? this.totalPending,
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      hasMore: hasMore ?? this.hasMore,
      currentPage: currentPage ?? this.currentPage,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Riverpod provider for CommissionNotifier
final commissionProvider =
    StateNotifierProvider<CommissionNotifier, CommissionState>((ref) {
  final storage = ref.watch(storageServiceProvider);
  return CommissionNotifier(supabase: supabase, storageService: storage);
});

/// CommissionNotifier manages worker platform fees, payment submissions,
/// and summary balances for JazzCash/Easypaisa payments.
class CommissionNotifier extends StateNotifier<CommissionState> {
  final SupabaseClient _client;
  final StorageService _storageService;

  CommissionNotifier({
    SupabaseClient? supabase,
    StorageService? storageService,
  })  : _client = supabase ?? Supabase.instance.client,
        _storageService = storageService ?? StorageService(supabase),
        super(const CommissionState()) {
    getMyCommissions();
    getCommissionSummary();
  }

  String? get _currentUserId => _client.auth.currentUser?.id;

  /// Fetches paginated commission list for the logged-in worker
  Future<List<CommissionModel>> getMyCommissions({
    bool refresh = false,
    int page = 1,
    int limit = 20,
    String? status,
  }) async {
    final workerId = _currentUserId;
    if (workerId == null) return [];

    state = state.copyWith(
      isLoading: true,
      currentPage: refresh ? 1 : page,
      clearError: true,
    );

    try {
      final targetPage = refresh ? 1 : page;
      final from = (targetPage - 1) * limit;
      final to = from + limit - 1;

      var query = _client
          .from(SupabaseTables.commissions)
          .select('*, booking:bookings(id, booking_number, total_amount, service:services(name_english))')
          .eq('worker_id', workerId)
          .order('created_at', ascending: false);

      if (status != null && status.isNotEmpty) {
        query = query.eq('status', status);
      }

      final response = await query.range(from, to);

      final List<CommissionModel> loaded = (response as List)
          .map((item) => CommissionModel.fromJson(item as Map<String, dynamic>))
          .toList();

      final updatedList = refresh ? loaded : [...state.commissions, ...loaded];
      final hasMore = loaded.length >= limit;

      state = state.copyWith(
        commissions: updatedList,
        isLoading: false,
        hasMore: hasMore,
        currentPage: targetPage,
      );

      return loaded;
    } catch (e) {
      debugPrint('getMyCommissions error: $e');
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to load commissions: $e',
      );
      return [];
    }
  }

  /// Submits proof of commission payment (screenshot + bank/JazzCash transaction ID)
  Future<bool> submitCommissionPayment(
    String commissionId,
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
          screenshotUrl = await _storageService.uploadCommissionScreenshot(file);
        } else {
          screenshotUrl = screenshotPath;
        }
      }

      final now = DateTime.now();
      final updatePayload = {
        'payment_method': paymentMethod,
        'payment_reference': reference,
        if (screenshotUrl != null) 'screenshot_url': screenshotUrl,
        'status': CommissionStatus.pending,
        'paid_at': now.toIso8601String(),
        'updated_at': now.toIso8601String(),
      };

      await _client
          .from(SupabaseTables.commissions)
          .update(updatePayload)
          .eq('id', commissionId);

      await getMyCommissions(refresh: true);
      await getCommissionSummary();

      state = state.copyWith(isSubmitting: false);
      return true;
    } catch (e) {
      debugPrint('submitCommissionPayment error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to submit commission payment: $e',
      );
      return false;
    }
  }

  /// Calculates total commission due, collected/paid, and pending review
  Future<Map<String, double>> getCommissionSummary() async {
    final workerId = _currentUserId;
    if (workerId == null) {
      return {'totalDue': 0.0, 'totalPaid': 0.0, 'totalPending': 0.0};
    }

    try {
      final records = await _client
          .from(SupabaseTables.commissions)
          .select('amount, status, payment_reference')
          .eq('worker_id', workerId);

      double due = 0.0;
      double paid = 0.0;
      double pending = 0.0;

      for (var r in records) {
        final amount = (r['amount'] as num?)?.toDouble() ?? 0.0;
        final status = r['status'] as String? ?? 'pending';
        final hasRef = (r['payment_reference'] as String?)?.isNotEmpty ?? false;

        if (status == 'paid' || status == CommissionStatus.collected) {
          paid += amount;
        } else if (hasRef) {
          // Submitted by worker, waiting for admin approval
          pending += amount;
        } else {
          // Owed to platform
          due += amount;
        }
      }

      state = state.copyWith(
        totalDue: due,
        totalPaid: paid,
        totalPending: pending,
      );

      return {'totalDue': due, 'totalPaid': paid, 'totalPending': pending};
    } catch (e) {
      debugPrint('getCommissionSummary error: $e');
      return {'totalDue': 0.0, 'totalPaid': 0.0, 'totalPending': 0.0};
    }
  }
}
