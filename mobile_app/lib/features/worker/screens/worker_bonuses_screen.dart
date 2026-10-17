import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';

class WorkerBonusesScreen extends ConsumerStatefulWidget {
  const WorkerBonusesScreen({super.key});

  @override
  ConsumerState<WorkerBonusesScreen> createState() => _WorkerBonusesScreenState();
}

class _WorkerBonusesScreenState extends ConsumerState<WorkerBonusesScreen> {
  final int _currentMonthJobs = 14;
  final int _nextTierJobs = 20; // Aiming for Silver tier
  final NumberFormat _currencyFormatter = NumberFormat('#,##0', 'en_US');

  // Bonus Tiers Definition
  final List<Map<String, dynamic>> _tiers = [
    {
      'icon': '🥉',
      'title': 'Bronze Tier',
      'jobs_required': 10,
      'reward': 500,
      'unlocked': true,
      'color': const Color(0xFFCD7F32),
    },
    {
      'icon': '🥈',
      'title': 'Silver Tier',
      'jobs_required': 20,
      'reward': 1200,
      'unlocked': false,
      'color': const Color(0xFF9E9E9E),
    },
    {
      'icon': '🥇',
      'title': 'Gold Tier',
      'jobs_required': 35,
      'reward': 2500,
      'unlocked': false,
      'color': const Color(0xFFFFB300),
    },
    {
      'icon': '👑',
      'title': 'Diamond Crown Tier',
      'jobs_required': 50,
      'reward': 4000,
      'unlocked': false,
      'color': const Color(0xFF7B1FA2),
    },
  ];

  // Mock Claimed Bonuses History
  final List<Map<String, dynamic>> _claimedBonuses = [
    {
      'id': 'BON-1092',
      'month': 'October 2026',
      'tier': 'Bronze Tier (10 Jobs)',
      'amount': 500,
      'date': '12 Oct 2026',
      'status': 'Eligible',
      'status_color': AppColors.info,
    },
    {
      'id': 'BON-0941',
      'month': 'September 2026',
      'tier': 'Gold Tier (35 Jobs)',
      'amount': 2500,
      'date': '01 Oct 2026',
      'status': 'Paid',
      'status_color': AppColors.success,
    },
    {
      'id': 'BON-0812',
      'month': 'August 2026',
      'tier': 'Silver Tier (20 Jobs)',
      'amount': 1200,
      'date': '01 Sep 2026',
      'status': 'Paid',
      'status_color': AppColors.success,
    },
    {
      'id': 'BON-0701',
      'month': 'July 2026',
      'tier': 'Bronze Tier (10 Jobs)',
      'amount': 500,
      'date': '01 Aug 2026',
      'status': 'Paid',
      'status_color': AppColors.success,
    },
  ];

  void _claimBonus(Map<String, dynamic> bonus) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Claim Cash Bonus', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold)),
        content: Text(
          'Transfer Rs. ${bonus['amount']} to your registered JazzCash / Easypaisa mobile account?',
          style: const TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.gray),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(fontFamily: 'Poppins', color: AppColors.gray)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() {
                bonus['status'] = 'Approved';
                bonus['status_color'] = AppColors.primaryGreen;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: AppColors.primaryGreen,
                  content: Text('Bonus of Rs. ${bonus['amount']} request submitted! Payout will arrive today.'),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryGreen,
              foregroundColor: Colors.white,
            ),
            child: const Text('Claim Now', style: TextStyle(fontFamily: 'Poppins')),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final progress = _currentMonthJobs / _nextTierJobs; // 14 / 20 = 0.70

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.charcoal, size: 20),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Monthly Cash Bonuses',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: AppColors.charcoal,
            fontSize: 17,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Month Progress Card
            _buildMonthProgressCard(progress),

            const SizedBox(height: 20),

            // Motivational Banner
            _buildMotivationalBanner(),

            const SizedBox(height: 20),

            // Bonus Tiers Header
            const Text(
              'Monthly Target Tiers',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.charcoal,
              ),
            ),
            const SizedBox(height: 10),

            // Bonus Tiers Cards
            _buildTiersList(),

            const SizedBox(height: 24),

            // Claimed History Header
            const Text(
              'Bonus Payout History',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.charcoal,
              ),
            ),
            const SizedBox(height: 10),

            // Claimed History List
            _buildHistoryList(),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthProgressCard(double progress) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'October 2026 Target',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: AppColors.charcoal,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.lightGreenBg,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'Active Cycle',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryGreen,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: '$_currentMonthJobs ',
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 28,
                        fontWeight: FontWeight.w900,
                        color: AppColors.primaryGreen,
                      ),
                    ),
                    const TextSpan(
                      text: 'Jobs Completed',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        color: AppColors.gray,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                '${_nextTierJobs - _currentMonthJobs} more for Silver',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFFF57F17),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress.clamp(0.0, 1.0),
              backgroundColor: AppColors.lightGray,
              valueColor: const AlwaysStoppedAnimation<Color>(AppColors.primaryGreen),
              minHeight: 10,
            ),
          ),
          const SizedBox(height: 12),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Bronze Unlocked (Rs. 500)',
                style: TextStyle(fontFamily: 'Poppins', fontSize: 11, color: AppColors.primaryGreen, fontWeight: FontWeight.bold),
              ),
              Text(
                'Silver Target (Rs. 1,200)',
                style: TextStyle(fontFamily: 'Poppins', fontSize: 11, color: AppColors.gray),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMotivationalBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.lightGreenBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primaryGreen.withOpacity(0.3)),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.workspace_premium, color: AppColors.primaryGreen, size: 28),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Mehnat Ka Phal! (Earn Big With Every Job)',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: AppColors.primaryGreen,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'KAMZO rewards top performers with direct cash bonuses paid into your wallet at the end of each month. No lottery, pure reward for honest work!',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    color: AppColors.charcoal,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTiersList() {
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _tiers.length,
      separatorBuilder: (ctx, i) => const SizedBox(height: 10),
      itemBuilder: (ctx, i) {
        final tier = _tiers[i];
        final isUnlocked = _currentMonthJobs >= (tier['jobs_required'] as int);

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isUnlocked ? AppColors.primaryGreen : AppColors.border,
              width: isUnlocked ? 2 : 1,
            ),
          ),
          child: Row(
            children: [
              Text(
                tier['icon'] as String,
                style: const TextStyle(fontSize: 32),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      tier['title'] as String,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: AppColors.charcoal,
                      ),
                    ),
                    Text(
                      'Complete ${tier['jobs_required']} jobs in a calendar month',
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 11,
                        color: AppColors.gray,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'Rs. ${_currencyFormatter.format(tier['reward'])}',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: isUnlocked ? AppColors.primaryGreen : AppColors.charcoal,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: isUnlocked ? AppColors.lightGreenBg : AppColors.lightGray,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      isUnlocked ? 'Unlocked ✓' : 'Locked',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: isUnlocked ? AppColors.primaryGreen : AppColors.gray,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHistoryList() {
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _claimedBonuses.length,
      separatorBuilder: (ctx, i) => const SizedBox(height: 10),
      itemBuilder: (ctx, i) {
        final bonus = _claimedBonuses[i];
        final statusColor = bonus['status_color'] as Color;
        final isEligible = bonus['status'] == 'Eligible';

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      bonus['tier'] as String,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: AppColors.charcoal,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${bonus['month']} • ${bonus['date']}',
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 11,
                        color: AppColors.gray,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'Rs. ${_currencyFormatter.format(bonus['amount'])}',
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: AppColors.primaryGreen,
                    ),
                  ),
                  const SizedBox(height: 4),
                  if (isEligible)
                    InkWell(
                      onTap: () => _claimBonus(bonus),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primaryGreen,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'Claim Payout',
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    )
                  else
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: statusColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        bonus['status'] as String,
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: statusColor,
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
