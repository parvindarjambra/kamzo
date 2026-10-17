import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class WorkerLevelsScreen extends ConsumerStatefulWidget {
  const WorkerLevelsScreen({super.key});

  @override
  ConsumerState<WorkerLevelsScreen> createState() => _WorkerLevelsScreenState();
}

class _WorkerLevelsScreenState extends ConsumerState<WorkerLevelsScreen> {
  final int _currentLevel = 3; // Level 3: Trusted
  final int _completedJobs = 42;
  final int _nextLevelThreshold = 60;
  final double _currentRating = 4.8;
  final double _minRatingRequired = 4.5;

  Color _getLevelColor(int level) {
    switch (level) {
      case 1:
        return AppColors.level1Gray;
      case 2:
        return AppColors.level2Blue;
      case 3:
        return AppColors.level3Green;
      case 4:
        return AppColors.level4Gold;
      default:
        return AppColors.level1Gray;
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentColor = _getLevelColor(_currentLevel);
    final progress = (_completedJobs - 30) / (_nextLevelThreshold - 30); // 12 / 30 = 0.40

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
          'Worker Levels & Tiers',
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
            // Current Level Hero Card
            _buildCurrentLevelHero(currentColor, progress),

            const SizedBox(height: 20),

            // Level Benefits & Privileges
            _buildLevelBenefitsCard(),

            const SizedBox(height: 20),

            // All Levels Overview
            const Text(
              'KAMZO Partner Tiers',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: AppColors.charcoal,
              ),
            ),
            const SizedBox(height: 10),
            _buildAllLevelsList(),

            const SizedBox(height: 20),

            // Tips to Level Up
            _buildTipsToLevelUpCard(),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrentLevelHero(Color color, double progress) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.35),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.25),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.shield, color: Colors.white, size: 14),
                    SizedBox(width: 4),
                    Text(
                      'CURRENT STATUS',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.workspace_premium, color: Colors.white, size: 36),
            ],
          ),
          const SizedBox(height: 14),
          const Text(
            'Level 3: Trusted Worker',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Top tier service provider in Karachi. Prioritized by customer dispatch system.',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 13,
              color: Colors.white70,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 18),
          // Progress bar
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Progress to Level 4 (Expert): $_completedJobs / $_nextLevelThreshold jobs',
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    '${(progress * 100).toInt()}%',
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: progress.clamp(0.0, 1.0),
                  backgroundColor: Colors.white.withOpacity(0.3),
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                  minHeight: 8,
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  const Icon(Icons.star, color: Colors.white, size: 15),
                  const SizedBox(width: 4),
                  Text(
                    'Rating: $_currentRating / 5.0 (Requirement: >= $_minRatingRequired)',
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 11,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLevelBenefitsCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.stars_rounded, color: AppColors.primaryGreen, size: 22),
              SizedBox(width: 8),
              Text(
                'Your Level 3 Privileges',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: AppColors.charcoal,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildBenefitItem('Priority Booking Queue: Receive jobs 30 seconds before Level 1/2 workers.'),
          _buildBenefitItem('"Trusted Partner" badge shown on customer search and booking confirmation.'),
          _buildBenefitItem('Eligible for higher-value commercial & emergency repair service requests.'),
          _buildBenefitItem('Dedicated KAMZO partner helpline with instant WhatsApp support.'),
        ],
      ),
    );
  }

  Widget _buildBenefitItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.check_circle_outline, color: AppColors.primaryGreen, size: 16),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                color: AppColors.charcoal,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAllLevelsList() {
    final levels = [
      {
        'level': 1,
        'title': 'Level 1: New Worker',
        'jobs': '0 - 9 Jobs',
        'desc': 'Standard job dispatch, basic profile verification, customer reviews enabled.',
        'color': AppColors.level1Gray,
        'badge': 'Starter',
      },
      {
        'level': 2,
        'title': 'Level 2: Active Worker',
        'jobs': '10 - 29 Jobs',
        'desc': 'Rating >= 4.0 required. Faster lead notifications and weekly bonus eligibility.',
        'color': AppColors.level2Blue,
        'badge': 'Active',
      },
      {
        'level': 3,
        'title': 'Level 3: Trusted Worker',
        'jobs': '30 - 59 Jobs',
        'desc': 'Rating >= 4.5 required. Priority routing, premium badge, higher customer trust.',
        'color': AppColors.level3Green,
        'badge': 'Current Tier',
      },
      {
        'level': 4,
        'title': 'Level 4: Expert Master',
        'jobs': '60+ Jobs',
        'desc': 'Rating >= 4.7 required. Top dispatch priority, lowest platform commission rates, VIP rewards.',
        'color': AppColors.level4Gold,
        'badge': 'Master Elite',
      },
    ];

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: levels.length,
      separatorBuilder: (ctx, i) => const SizedBox(height: 10),
      itemBuilder: (ctx, i) {
        final item = levels[i];
        final levelNum = item['level'] as int;
        final isCurrent = levelNum == _currentLevel;
        final color = item['color'] as Color;

        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isCurrent ? AppColors.lightGreenBg.withOpacity(0.6) : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isCurrent ? AppColors.primaryGreen : AppColors.border,
              width: isCurrent ? 2 : 1,
            ),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.shield, color: color, size: 24),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          item['title'] as String,
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: isCurrent ? AppColors.primaryGreen : AppColors.charcoal,
                          ),
                        ),
                        if (isCurrent)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.primaryGreen,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Text(
                              'CURRENT',
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Requirement: ${item['jobs']}',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: color,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item['desc'] as String,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        color: AppColors.gray,
                        height: 1.3,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTipsToLevelUpCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.tips_and_updates_outlined, color: Color(0xFFF57F17), size: 22),
              SizedBox(width: 8),
              Text(
                'How to Reach Level 4 Quickly',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: AppColors.charcoal,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildTipRow('Maintain a 4.7+ Rating', 'Always be polite, explain the repair to the customer, and clean up the work area before leaving.'),
          _buildTipRow('Fast Response Times', 'Accept incoming job requests within 60 seconds to increase your acceptance score.'),
          _buildTipRow('Clear Commission Regularly', 'Workers with zero overdue commission get highest priority on new customer leads.'),
        ],
      ),
    );
  }

  Widget _buildTipRow(String title, String desc) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '• $title',
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: AppColors.charcoal,
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 12, top: 2),
            child: Text(
              desc,
              style: const TextStyle(fontFamily: 'Poppins', fontSize: 12, color: AppColors.gray, height: 1.3),
            ),
          ),
        ],
      ),
    );
  }
}
