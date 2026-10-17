import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/utils/formatters.dart';
import '../../../core/utils/supabase_client.dart';

/// Worker bonus reward model representing earned or pending bonuses
class WorkerBonus extends Equatable {
  final String id;
  final String workerId;
  final String? ruleId;
  final String title;
  final double amount;
  final String status; // 'pending', 'eligible', 'credited', 'expired'
  final String? period;
  final DateTime? awardedAt;
  final DateTime createdAt;

  const WorkerBonus({
    required this.id,
    required this.workerId,
    this.ruleId,
    required this.title,
    required this.amount,
    this.status = BonusStatus.pending,
    this.period,
    this.awardedAt,
    required this.createdAt,
  });

  bool get isCredited => status == BonusStatus.credited;
  bool get isEligible => status == BonusStatus.eligible;
  bool get isPending => status == BonusStatus.pending;

  String get formattedAmount => Formatters.formatCurrency(amount);

  factory WorkerBonus.fromJson(Map<String, dynamic> json) {
    return WorkerBonus(
      id: json['id'] as String,
      workerId: json['worker_id'] as String? ?? '',
      ruleId: json['rule_id'] as String? ?? json['bonus_rule_id'] as String?,
      title: json['title'] as String? ?? 'Performance Bonus',
      amount: (json['amount'] as num?)?.toDouble() ??
          (json['bonus_amount'] as num?)?.toDouble() ??
          0.0,
      status: json['status'] as String? ?? BonusStatus.pending,
      period: json['period'] as String?,
      awardedAt: json['awarded_at'] != null
          ? DateTime.tryParse(json['awarded_at'] as String)
          : null,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
    );
  }

  @override
  List<Object?> get props => [id, workerId, ruleId, title, amount, status, period, awardedAt, createdAt];
}

/// Active bonus incentive rule configured by KAMZO admin
class BonusRule extends Equatable {
  final String id;
  final String title;
  final String? description;
  final int requiredJobs;
  final double rewardAmount;
  final String tier; // 'all', 'bronze', 'silver', 'gold', 'platinum'
  final bool isActive;

  const BonusRule({
    required this.id,
    required this.title,
    this.description,
    required this.requiredJobs,
    required this.rewardAmount,
    this.tier = 'all',
    this.isActive = true,
  });

  String get formattedReward => Formatters.formatCurrency(rewardAmount);

  factory BonusRule.fromJson(Map<String, dynamic> json) {
    return BonusRule(
      id: json['id'] as String,
      title: json['title'] as String? ?? 'Monthly Goal',
      description: json['description'] as String?,
      requiredJobs: json['required_jobs'] as int? ?? 10,
      rewardAmount: (json['reward_amount'] as num?)?.toDouble() ?? 0.0,
      tier: json['tier'] as String? ?? 'all',
      isActive: json['is_active'] as bool? ?? true,
    );
  }

  @override
  List<Object?> get props => [id, title, description, requiredJobs, rewardAmount, tier, isActive];
}

/// State representation for worker bonus rewards and monthly progress
class BonusState {
  final List<WorkerBonus> bonuses;
  final List<BonusRule> rules;
  final int completedJobsThisMonth;
  final int targetJobs;
  final double projectedBonus;
  final bool isLoading;
  final String? error;

  const BonusState({
    this.bonuses = const [],
    this.rules = const [],
    this.completedJobsThisMonth = 0,
    this.targetJobs = 0,
    this.projectedBonus = 0.0,
    this.isLoading = false,
    this.error,
  });

  double get progressPercentage {
    if (targetJobs <= 0) return 0.0;
    final ratio = completedJobsThisMonth / targetJobs;
    return ratio > 1.0 ? 1.0 : ratio;
  }

  int get jobsRemaining => (targetJobs - completedJobsThisMonth).clamp(0, 9999);

  BonusState copyWith({
    List<WorkerBonus>? bonuses,
    List<BonusRule>? rules,
    int? completedJobsThisMonth,
    int? targetJobs,
    double? projectedBonus,
    bool? isLoading,
    String? error,
    bool clearError = false,
  }) {
    return BonusState(
      bonuses: bonuses ?? this.bonuses,
      rules: rules ?? this.rules,
      completedJobsThisMonth:
          completedJobsThisMonth ?? this.completedJobsThisMonth,
      targetJobs: targetJobs ?? this.targetJobs,
      projectedBonus: projectedBonus ?? this.projectedBonus,
      isLoading: isLoading ?? this.isLoading,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Riverpod provider for BonusNotifier
final bonusProvider = StateNotifierProvider<BonusNotifier, BonusState>((ref) {
  return BonusNotifier(supabase);
});

/// BonusNotifier manages monthly milestone incentives, bonus history, and progress calculations.
class BonusNotifier extends StateNotifier<BonusState> {
  final SupabaseClient _client;

  BonusNotifier([SupabaseClient? client])
      : _client = client ?? supabase,
        super(const BonusState()) {
    loadAllBonusData();
  }

  String? get _currentUserId => _client.auth.currentUser?.id;

  /// Loads rules, bonuses, and progress in parallel
  Future<void> loadAllBonusData() async {
    state = state.copyWith(isLoading: true, clearError: true);
    await Future.wait([
      getMyBonuses(),
      getBonusRules(),
    ]);
    await getCurrentMonthProgress();
    state = state.copyWith(isLoading: false);
  }

  /// Fetches worker's earned and awarded bonuses
  Future<List<WorkerBonus>> getMyBonuses() async {
    final workerId = _currentUserId;
    if (workerId == null) return [];

    try {
      final response = await _client
          .from(SupabaseTables.workerBonuses)
          .select()
          .eq('worker_id', workerId)
          .order('created_at', ascending: false);

      final List<WorkerBonus> list = (response as List)
          .map((b) => WorkerBonus.fromJson(b as Map<String, dynamic>))
          .toList();

      state = state.copyWith(bonuses: list);
      return list;
    } catch (e) {
      debugPrint('getMyBonuses error: $e');
      return [];
    }
  }

  /// Fetches active platform incentive rules
  Future<List<BonusRule>> getBonusRules() async {
    try {
      final response = await _client
          .from('bonus_rules')
          .select()
          .eq('is_active', true)
          .order('required_jobs', ascending: true);

      final List<BonusRule> list = (response as List)
          .map((r) => BonusRule.fromJson(r as Map<String, dynamic>))
          .toList();

      state = state.copyWith(rules: list);
      return list;
    } catch (e) {
      debugPrint('getBonusRules error: $e');
      return [];
    }
  }

  /// Calculates completed jobs in current calendar month against active bonus targets
  Future<void> getCurrentMonthProgress() async {
    final workerId = _currentUserId;
    if (workerId == null) return;

    try {
      final now = DateTime.now();
      final startOfMonth = DateTime(now.year, now.month, 1).toIso8601String();

      // Query bookings completed this month
      final completedBookings = await _client
          .from(SupabaseTables.bookings)
          .select('id, total_amount')
          .eq('worker_id', workerId)
          .eq('status', BookingStatus.completed)
          .gte('completed_at', startOfMonth);

      final completedCount = completedBookings.length;

      // Determine next milestone rule
      final rules = state.rules;
      int target = 20; // Default fallback milestone
      double projected = 0.0;

      if (rules.isNotEmpty) {
        // Find next rule that hasn't been achieved yet
        final nextRule = rules.firstWhere(
          (r) => r.requiredJobs > completedCount,
          orElse: () => rules.last,
        );

        target = nextRule.requiredJobs;

        // Sum up rewards for all rules already achieved this month
        final achievedRules =
            rules.where((r) => completedCount >= r.requiredJobs);
        for (var rule in achievedRules) {
          projected += rule.rewardAmount;
        }

        // If at or above top tier, projected includes the highest tier reward
        if (completedCount >= nextRule.requiredJobs) {
          projected = nextRule.rewardAmount;
        }
      }

      state = state.copyWith(
        completedJobsThisMonth: completedCount,
        targetJobs: target,
        projectedBonus: projected,
      );
    } catch (e) {
      debugPrint('getCurrentMonthProgress error: $e');
    }
  }
}
