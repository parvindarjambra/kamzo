import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/models/booking_model.dart';
import '../../../core/models/worker_profile_model.dart';
import '../../../core/utils/supabase_client.dart';

/// State representation for service workers
class WorkerState {
  final List<BookingModel> availableJobs;
  final List<BookingModel> activeJobs;
  final BookingModel? selectedJob;
  final WorkerProfileModel? profile;
  final Map<String, dynamic> stats;
  final bool isOnline;
  final bool isAvailable;
  final bool isLoading;
  final bool isSubmitting;
  final String? error;

  const WorkerState({
    this.availableJobs = const [],
    this.activeJobs = const [],
    this.selectedJob,
    this.profile,
    this.stats = const {},
    this.isOnline = false,
    this.isAvailable = true,
    this.isLoading = false,
    this.isSubmitting = false,
    this.error,
  });

  WorkerState copyWith({
    List<BookingModel>? availableJobs,
    List<BookingModel>? activeJobs,
    BookingModel? selectedJob,
    WorkerProfileModel? profile,
    Map<String, dynamic>? stats,
    bool? isOnline,
    bool? isAvailable,
    bool? isLoading,
    bool? isSubmitting,
    String? error,
    bool clearSelected = false,
    bool clearError = false,
  }) {
    return WorkerState(
      availableJobs: availableJobs ?? this.availableJobs,
      activeJobs: activeJobs ?? this.activeJobs,
      selectedJob:
          clearSelected ? null : (selectedJob ?? this.selectedJob),
      profile: profile ?? this.profile,
      stats: stats ?? this.stats,
      isOnline: isOnline ?? this.isOnline,
      isAvailable: isAvailable ?? this.isAvailable,
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Riverpod provider for WorkerNotifier
final workerProvider =
    StateNotifierProvider<WorkerNotifier, WorkerState>((ref) {
  return WorkerNotifier(supabase);
});

/// Future provider for worker's available marketplace jobs
final availableJobsProvider =
    FutureProvider.autoDispose<List<BookingModel>>((ref) async {
  final notifier = ref.watch(workerProvider.notifier);
  return await notifier.getAvailableJobs();
});

/// WorkerNotifier handles worker jobs, live requests, status transitions,
/// bills, stats, availability toggles, and GPS tracking.
class WorkerNotifier extends StateNotifier<WorkerState> {
  final SupabaseClient _client;
  RealtimeChannel? _jobsChannel;

  WorkerNotifier([SupabaseClient? client])
      : _client = client ?? supabase,
        super(const WorkerState()) {
    _initWorkerProfile();
  }

  String? get _currentUserId => _client.auth.currentUser?.id;

  /// Loads worker profile and starts realtime subscription
  Future<void> _initWorkerProfile() async {
    final workerId = _currentUserId;
    if (workerId == null) return;

    try {
      final response = await _client
          .from(SupabaseTables.workerProfiles)
          .select()
          .eq('user_id', workerId)
          .maybeSingle();

      if (response != null) {
        final profile = WorkerProfileModel.fromJson(response);
        state = state.copyWith(
          profile: profile,
          isOnline: profile.isOnline,
          isAvailable: profile.isAvailable,
        );
      }
    } catch (e) {
      debugPrint('Error loading worker profile: $e');
    }

    subscribeToNewJobs();
    getWorkerStats();
  }

  /// Realtime channel subscription for newly posted jobs
  void subscribeToNewJobs() {
    _jobsChannel?.unsubscribe();

    _jobsChannel = _client
        .channel('worker_new_jobs')
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: SupabaseTables.bookings,
          callback: (payload) {
            _handleJobsRealtimeUpdate(payload);
          },
        )
        .subscribe();
  }

  void _handleJobsRealtimeUpdate(PostgresChangePayload payload) {
    final record = payload.newRecord;
    if (record.isEmpty) return;

    final bookingId = record['id'] as String?;
    final workerId = record['worker_id'] as String?;
    final status = record['status'] as String?;

    if (bookingId == null) return;

    // If job was taken by someone else or cancelled, remove from available jobs
    if (workerId != null && workerId != _currentUserId) {
      state = state.copyWith(
        availableJobs:
            state.availableJobs.where((j) => j.id != bookingId).toList(),
      );
      return;
    }

    // If this is an assigned job for current worker
    if (workerId == _currentUserId) {
      _client
          .from(SupabaseTables.bookings)
          .select('*, service:services(*), customer:profiles!customer_id(*)')
          .eq('id', bookingId)
          .maybeSingle()
          .then((data) {
        if (data != null) {
          final updatedBooking = BookingModel.fromJson(data);
          final updatedActive = state.activeJobs.map((j) {
            return j.id == updatedBooking.id ? updatedBooking : j;
          }).toList();

          if (!updatedActive.any((j) => j.id == updatedBooking.id)) {
            updatedActive.insert(0, updatedBooking);
          }

          state = state.copyWith(
            activeJobs: updatedActive,
            selectedJob: state.selectedJob?.id == updatedBooking.id
                ? updatedBooking
                : state.selectedJob,
          );
        }
      });
      return;
    }

    // If it's a new or pending job available in the marketplace
    if ((status == BookingStatus.pending || status == 'requested') &&
        workerId == null) {
      getAvailableJobs();
    }
  }

  /// Fetches jobs matching worker's assigned services and geographical area
  Future<List<BookingModel>> getAvailableJobs() async {
    final workerId = _currentUserId;
    if (workerId == null) return [];

    state = state.copyWith(isLoading: true, clearError: true);

    try {
      // First get worker category IDs and city if available
      final workerProfile = state.profile ??
          await _client
              .from(SupabaseTables.workerProfiles)
              .select()
              .eq('user_id', workerId)
              .maybeSingle()
              .then((d) => d != null ? WorkerProfileModel.fromJson(d) : null);

      var query = _client
          .from(SupabaseTables.bookings)
          .select('*, service:services(*), customer:profiles!customer_id(*)')
          .filter('worker_id', 'is', null)
          .inFilter('status', [BookingStatus.pending, 'requested'])
          .order('created_at', ascending: false);

      final response = await query;
      final List<BookingModel> allAvailable = (response as List)
          .map((item) => BookingModel.fromJson(item as Map<String, dynamic>))
          .toList();

      // If worker has category specialties, prioritize matching ones
      List<BookingModel> filtered = allAvailable;
      if (workerProfile != null &&
          workerProfile.serviceCategoryIds.isNotEmpty) {
        final categoryIds = workerProfile.serviceCategoryIds.toSet();
        final matched = allAvailable.where((b) {
          return b.categoryId != null && categoryIds.contains(b.categoryId);
        }).toList();

        // If specific categories matched, return those; otherwise all available
        if (matched.isNotEmpty) {
          filtered = matched;
        }
      }

      state = state.copyWith(
        availableJobs: filtered,
        isLoading: false,
      );

      return filtered;
    } catch (e) {
      debugPrint('getAvailableJobs error: $e');
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to fetch available jobs: $e',
      );
      return [];
    }
  }

  /// Accept a service job request
  Future<bool> acceptJob(String bookingId) async {
    final workerId = _currentUserId;
    if (workerId == null) return false;

    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      final response = await _client
          .from(SupabaseTables.bookings)
          .update({
            'worker_id': workerId,
            'status': BookingStatus.accepted,
            'updated_at': DateTime.now().toIso8601String(),
          })
          .eq('id', bookingId)
          .select('*, service:services(*), customer:profiles!customer_id(*)')
          .single();

      final accepted = BookingModel.fromJson(response);

      state = state.copyWith(
        availableJobs:
            state.availableJobs.where((j) => j.id != bookingId).toList(),
        activeJobs: [accepted, ...state.activeJobs],
        selectedJob: accepted,
        isSubmitting: false,
      );

      return true;
    } catch (e) {
      debugPrint('acceptJob error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to accept job: $e',
      );
      return false;
    }
  }

  /// Reject a job request with reason
  Future<bool> rejectJob(String bookingId, String reason) async {
    final workerId = _currentUserId;
    if (workerId == null) return false;

    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      await _client.from(SupabaseTables.bookings).update({
        'status': BookingStatus.rejected,
        'cancellation_reason': reason,
        'cancel_initiator': 'worker',
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('id', bookingId);

      state = state.copyWith(
        availableJobs:
            state.availableJobs.where((j) => j.id != bookingId).toList(),
        activeJobs:
            state.activeJobs.where((j) => j.id != bookingId).toList(),
        isSubmitting: false,
      );

      return true;
    } catch (e) {
      debugPrint('rejectJob error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to decline job: $e',
      );
      return false;
    }
  }

  /// Progress the status of an ongoing booking ('on_the_way', 'arrived', 'in_progress', 'completed')
  Future<bool> updateJobStatus(String bookingId, String newStatus) async {
    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      final updateData = <String, dynamic>{
        'status': newStatus,
        'updated_at': DateTime.now().toIso8601String(),
      };

      if (newStatus == BookingStatus.completed) {
        updateData['completed_at'] = DateTime.now().toIso8601String();
      }

      final response = await _client
          .from(SupabaseTables.bookings)
          .update(updateData)
          .eq('id', bookingId)
          .select('*, service:services(*), customer:profiles!customer_id(*)')
          .single();

      final updated = BookingModel.fromJson(response);

      // If completed, update worker stats counter
      if (newStatus == BookingStatus.completed && _currentUserId != null) {
        try {
          await _client.rpc('increment_worker_completed_jobs', params: {
            'worker_id': _currentUserId!,
          });
        } catch (_) {
          // Fallback manual increment
          if (state.profile != null) {
            await _client.from(SupabaseTables.workerProfiles).update({
              'completed_jobs_count': state.profile!.completedJobsCount + 1,
              'updated_at': DateTime.now().toIso8601String(),
            }).eq('user_id', _currentUserId!);
          }
        }
      }

      final updatedActive = state.activeJobs.map((j) {
        return j.id == updated.id ? updated : j;
      }).toList();

      state = state.copyWith(
        activeJobs: updatedActive,
        selectedJob: updated,
        isSubmitting: false,
      );

      return true;
    } catch (e) {
      debugPrint('updateJobStatus error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to update job status: $e',
      );
      return false;
    }
  }

  /// Worker submits the final itemized or adjusted bill for customer confirmation
  Future<bool> submitFinalBill(
    String bookingId,
    double amount,
    String description,
  ) async {
    state = state.copyWith(isSubmitting: true, clearError: true);

    try {
      final commissionRate = state.profile?.currentCommissionRate ?? 10.0;
      final commissionAmount = amount * (commissionRate / 100.0);

      final updatePayload = {
        'total_amount': amount,
        'commission_rate': commissionRate,
        'commission_amount': commissionAmount,
        'customer_notes': description,
        'status': 'awaiting_confirmation',
        'updated_at': DateTime.now().toIso8601String(),
      };

      final response = await _client
          .from(SupabaseTables.bookings)
          .update(updatePayload)
          .eq('id', bookingId)
          .select('*, service:services(*), customer:profiles!customer_id(*)')
          .single();

      final updated = BookingModel.fromJson(response);

      state = state.copyWith(
        activeJobs: state.activeJobs.map((j) => j.id == updated.id ? updated : j).toList(),
        selectedJob: updated,
        isSubmitting: false,
      );

      return true;
    } catch (e) {
      debugPrint('submitFinalBill error: $e');
      state = state.copyWith(
        isSubmitting: false,
        error: 'Failed to submit final bill: $e',
      );
      return false;
    }
  }

  /// Fetches worker dashboard statistics (earnings, reviews, completed count)
  Future<Map<String, dynamic>> getWorkerStats() async {
    final workerId = _currentUserId;
    if (workerId == null) return {};

    try {
      final profileData = await _client
          .from(SupabaseTables.workerProfiles)
          .select()
          .eq('user_id', workerId)
          .maybeSingle();

      double totalEarnings = 0.0;
      int completedThisMonth = 0;

      final now = DateTime.now();
      final startOfMonth = DateTime(now.year, now.month, 1).toIso8601String();

      final completedBookings = await _client
          .from(SupabaseTables.bookings)
          .select('total_amount, completed_at')
          .eq('worker_id', workerId)
          .eq('status', BookingStatus.completed);

      for (var b in completedBookings) {
        final amount = (b['total_amount'] as num?)?.toDouble() ?? 0.0;
        totalEarnings += amount;

        final completedAt = b['completed_at'] as String?;
        if (completedAt != null && completedAt.compareTo(startOfMonth) >= 0) {
          completedThisMonth++;
        }
      }

      final stats = <String, dynamic>{
        'rating': (profileData?['rating'] as num?)?.toDouble() ?? 5.0,
        'total_reviews': profileData?['total_reviews'] as int? ?? 0,
        'completed_jobs_count':
            profileData?['completed_jobs_count'] as int? ?? completedBookings.length,
        'completed_this_month': completedThisMonth,
        'total_earnings': totalEarnings,
        'wallet_balance':
            (profileData?['wallet_balance'] as num?)?.toDouble() ?? 0.0,
        'pending_commission':
            (profileData?['pending_commission'] as num?)?.toDouble() ?? 0.0,
        'level': profileData?['level'] as String? ?? 'bronze',
        'is_available': profileData?['is_available'] as bool? ?? true,
      };

      state = state.copyWith(stats: stats);
      return stats;
    } catch (e) {
      debugPrint('getWorkerStats error: $e');
      return {};
    }
  }

  /// Toggles worker online availability
  Future<bool> toggleAvailability() async {
    final workerId = _currentUserId;
    if (workerId == null) return false;

    final newStatus = !state.isAvailable;

    try {
      await _client.from(SupabaseTables.workerProfiles).update({
        'is_available': newStatus,
        'is_online': newStatus,
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('user_id', workerId);

      state = state.copyWith(
        isAvailable: newStatus,
        isOnline: newStatus,
        profile: state.profile?.copyWith(
          isAvailable: newStatus,
          isOnline: newStatus,
        ),
      );

      return true;
    } catch (e) {
      debugPrint('toggleAvailability error: $e');
      return false;
    }
  }

  /// Update worker GPS coordinates
  Future<void> updateLocation(double lat, double lng) async {
    final workerId = _currentUserId;
    if (workerId == null) return;

    try {
      await _client.from(SupabaseTables.workerProfiles).update({
        'current_location_latitude': lat,
        'current_location_longitude': lng,
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('user_id', workerId);

      await _client.from(SupabaseTables.workerLocations).insert({
        'worker_id': workerId,
        'latitude': lat,
        'longitude': lng,
        'created_at': DateTime.now().toIso8601String(),
      });
    } catch (e) {
      debugPrint('updateLocation error: $e');
    }
  }

  @override
  void dispose() {
    _jobsChannel?.unsubscribe();
    super.dispose();
  }
}
