import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

// Riverpod state provider for worker availability
final workerOnlineStatusProvider = StateProvider<bool>((ref) => true);

class WorkerHomeScreen extends ConsumerStatefulWidget {
  const WorkerHomeScreen({super.key});

  @override
  ConsumerState<WorkerHomeScreen> createState() => _WorkerHomeScreenState();
}

class _WorkerHomeScreenState extends ConsumerState<WorkerHomeScreen> {
  int _currentNavIndex = 0;

  // Mock Active Job data
  final Map<String, dynamic>? _activeJob = {
    'id': 'KZ-8821',
    'service': 'AC Repair',
    'sub_service': 'Split AC Cooling Issue & Gas Refill',
    'customer_name': 'Tariq Mehmood',
    'location': 'Block 13-D, Gulshan-e-Iqbal, Karachi',
    'distance': '2.4 km away',
    'status': 'on_the_way',
    'time': 'Started 15 mins ago',
    'visit_fee': 500,
  };

  // Mock New Job Requests
  final List<Map<String, dynamic>> _newJobRequests = [
    {
      'id': 'KZ-9042',
      'service': 'Plumber',
      'category_icon': Icons.plumbing,
      'problem_summary': 'Water leakage from kitchen sink pipe causing flooding under cabinets.',
      'customer_name': 'Bilal Ahmed',
      'location': 'DHA Phase 5, Karachi',
      'distance': '3.8 km away',
      'time_ago': '4 mins ago',
      'visit_fee': 500,
      'is_fee_paid': true,
      'urgency': 'Urgent',
    },
    {
      'id': 'KZ-9045',
      'service': 'Electrician',
      'category_icon': Icons.bolt,
      'problem_summary': 'Circuit breaker tripping repeatedly when inverter AC is switched on.',
      'customer_name': 'Sobia Khan',
      'location': 'Gulistan-e-Jauhar Block 7, Karachi',
      'distance': '1.9 km away',
      'time_ago': '12 mins ago',
      'visit_fee': 500,
      'is_fee_paid': true,
      'urgency': 'Standard',
    },
    {
      'id': 'KZ-9049',
      'service': 'Mechanic',
      'category_icon': Icons.car_repair,
      'problem_summary': 'Car battery dead and engine won\'t crank, jump-start or battery check needed.',
      'customer_name': 'Hamza Sheikh',
      'location': 'Clifton Block 2, Karachi',
      'distance': '5.2 km away',
      'time_ago': '25 mins ago',
      'visit_fee': 700,
      'is_fee_paid': true,
      'urgency': 'Urgent',
    },
  ];

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

  String _getLevelName(int level) {
    switch (level) {
      case 1:
        return 'Level 1 (New)';
      case 2:
        return 'Level 2 (Active)';
      case 3:
        return 'Level 3 (Trusted)';
      case 4:
        return 'Level 4 (Expert)';
      default:
        return 'Level 1';
    }
  }

  void _onBottomNavTapped(int index) {
    setState(() => _currentNavIndex = index);
    switch (index) {
      case 0:
        // Already on home
        break;
      case 1:
        context.push('/worker/jobs');
        break;
      case 2:
        context.push('/worker/commission');
        break;
      case 3:
        context.push('/worker/profile');
        break;
    }
  }

  void _acceptJob(Map<String, dynamic> job) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          'Accept Job Request?',
          style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold),
        ),
        content: Text(
          'Are you sure you want to accept booking #${job['id']} for ${job['service']} at ${job['location']}? Visit fee of Rs. ${job['visit_fee']} is already guaranteed.',
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
                _newJobRequests.removeWhere((item) => item['id'] == job['id']);
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: AppColors.primaryGreen,
                  content: Text('Job #${job['id']} accepted! Navigate to customer.'),
                ),
              );
              context.push('/worker/job-detail', extra: job['id']);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryGreen,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Confirm Accept', style: TextStyle(fontFamily: 'Poppins')),
          ),
        ],
      ),
    );
  }

  void _rejectJob(Map<String, dynamic> job) {
    setState(() {
      _newJobRequests.removeWhere((item) => item['id'] == job['id']);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Job #${job['id']} passed.'),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isOnline = ref.watch(workerOnlineStatusProvider);
    const workerName = 'Muhammad Usman';
    const workerLevel = 3; // Level 3: Trusted
    final levelColor = _getLevelColor(workerLevel);

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.lightGreenBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text(
                'KAMZO',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.w900,
                  fontSize: 18,
                  color: AppColors.primaryGreen,
                  letterSpacing: 1.1,
                ),
              ),
            ),
            const SizedBox(width: 8),
            const Text(
              'Worker',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.w600,
                fontSize: 16,
                color: AppColors.charcoal,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(Icons.notifications_outlined, color: AppColors.charcoal, size: 26),
                Positioned(
                  right: -2,
                  top: -2,
                  child: Container(
                    width: 10,
                    height: 10,
                    decoration: const BoxDecoration(
                      color: AppColors.error,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
            onPressed: () => context.push('/notifications'),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 14, left: 4),
            child: InkWell(
              borderRadius: BorderRadius.circular(20),
              onTap: () => context.push('/worker/profile'),
              child: CircleAvatar(
                radius: 18,
                backgroundColor: AppColors.lightGreenBg,
                child: const Icon(Icons.person, color: AppColors.primaryGreen, size: 22),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Welcome & Online Toggle Header
            _buildWelcomeHeader(workerName, isOnline),

            const SizedBox(height: 16),

            // Worker Level and Stats Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: _buildStatsGrid(workerLevel, levelColor),
            ),

            const SizedBox(height: 16),

            // Active Job Banner (if exists)
            if (_activeJob != null)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: _buildActiveJobBanner(_activeJob!),
              ),

            const SizedBox(height: 20),

            // New Job Requests Section Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Text(
                        'New Job Requests',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppColors.charcoal,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.primaryGreen,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '${_newJobRequests.length}',
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  TextButton(
                    onPressed: () => context.push('/worker/jobs'),
                    child: const Text(
                      'View All',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontWeight: FontWeight.w600,
                        color: AppColors.primaryGreen,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 8),

            // Job Requests Cards List
            if (!isOnline)
              _buildOfflineWarningBanner()
            else if (_newJobRequests.isEmpty)
              _buildNoJobsState()
            else
              ListView.separated(
                physics: const NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                itemCount: _newJobRequests.length,
                separatorBuilder: (ctx, i) => const SizedBox(height: 14),
                itemBuilder: (ctx, index) {
                  return _buildJobRequestCard(_newJobRequests[index]);
                },
              ),

            const SizedBox(height: 24),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentNavIndex,
        onTap: _onBottomNavTapped,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppColors.primaryGreen,
        unselectedItemColor: AppColors.gray,
        selectedLabelStyle: const TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 12),
        unselectedLabelStyle: const TextStyle(fontFamily: 'Poppins', fontSize: 12),
        backgroundColor: Colors.white,
        elevation: 12,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.work_outline),
            activeIcon: Icon(Icons.work),
            label: 'Jobs',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet_outlined),
            activeIcon: Icon(Icons.account_balance_wallet),
            label: 'Commission',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeHeader(String name, bool isOnline) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppColors.border, width: 0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Assalam-o-Alaikum, 👋',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 13,
                        color: AppColors.gray,
                      ),
                    ),
                    Text(
                      name,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppColors.charcoal,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              // Prominent Online/Offline Switch
              _buildAvailabilityToggle(isOnline),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAvailabilityToggle(bool isOnline) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: isOnline ? AppColors.lightGreenBg : const Color(0xFFF0F0F0),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: isOnline ? AppColors.primaryGreen.withOpacity(0.5) : AppColors.border,
          width: 1.5,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isOnline ? AppColors.success : AppColors.gray,
              boxShadow: isOnline
                  ? [
                      BoxShadow(
                        color: AppColors.success.withOpacity(0.5),
                        blurRadius: 6,
                        spreadRadius: 1,
                      ),
                    ]
                  : null,
            ),
          ),
          const SizedBox(width: 8),
          Text(
            isOnline ? 'Online' : 'Offline',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: isOnline ? AppColors.primaryGreen : AppColors.charcoal,
            ),
          ),
          const SizedBox(width: 4),
          Transform.scale(
            scale: 0.8,
            child: Switch(
              value: isOnline,
              activeColor: AppColors.primaryGreen,
              activeTrackColor: AppColors.primaryGreen.withOpacity(0.3),
              inactiveThumbColor: AppColors.gray,
              inactiveTrackColor: Colors.grey.shade300,
              onChanged: (val) {
                ref.read(workerOnlineStatusProvider.notifier).state = val;
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    duration: const Duration(milliseconds: 1200),
                    backgroundColor: val ? AppColors.primaryGreen : AppColors.charcoal,
                    content: Text(val ? 'You are now ONLINE and ready for jobs.' : 'You are OFFLINE.'),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid(int level, Color levelColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('42', 'Completed', Icons.task_alt, AppColors.primaryGreen),
          _buildDivider(),
          _buildStatItem('4.8 ★', 'Rating', Icons.star, const Color(0xFFF57F17)),
          _buildDivider(),
          _buildStatItem('Rs. 32.5k', 'This Month', Icons.payments_outlined, AppColors.primaryGreen),
          _buildDivider(),
          InkWell(
            onTap: () => context.push('/worker/levels'),
            borderRadius: BorderRadius.circular(10),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: levelColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: levelColor.withOpacity(0.4)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.shield, color: levelColor, size: 14),
                      const SizedBox(width: 4),
                      Text(
                        'Lvl $level',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                          color: levelColor,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Trusted',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 11,
                    color: AppColors.gray,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(
      height: 36,
      width: 1,
      color: AppColors.border,
    );
  }

  Widget _buildStatItem(String value, String label, IconData icon, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            fontSize: 15,
            color: color == const Color(0xFFF57F17) ? AppColors.charcoal : color,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 11,
            color: AppColors.gray,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildActiveJobBanner(Map<String, dynamic> job) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primaryGreen,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primaryGreen.withOpacity(0.3),
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
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.directions_run, color: Colors.white, size: 14),
                    SizedBox(width: 4),
                    Text(
                      'ACTIVE ONGOING JOB',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                '#${job['id']}',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  color: Colors.white70,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            job['sub_service'],
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.person, color: Colors.white70, size: 14),
              const SizedBox(width: 4),
              Text(
                job['customer_name'],
                style: const TextStyle(fontFamily: 'Poppins', color: Colors.white, fontSize: 13),
              ),
              const SizedBox(width: 12),
              const Icon(Icons.near_me, color: Colors.white70, size: 14),
              const SizedBox(width: 4),
              Text(
                job['distance'],
                style: const TextStyle(fontFamily: 'Poppins', color: Colors.white70, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () => context.push('/worker/job-detail', extra: job['id']),
                  icon: const Icon(Icons.open_in_new, size: 18),
                  label: const Text('View Job Details', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.primaryGreen,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              IconButton(
                onPressed: () => context.push('/chat', extra: {'booking_id': job['id'], 'other_name': job['customer_name']}),
                icon: const Icon(Icons.chat_bubble_outline, color: Colors.white),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.white.withOpacity(0.2),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildJobRequestCard(Map<String, dynamic> job) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Card Header: Category & Visit Fee Badge
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.lightGreenBg,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(job['category_icon'] as IconData, color: AppColors.primaryGreen, size: 20),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          job['service'],
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                            color: AppColors.charcoal,
                          ),
                        ),
                        Text(
                          '${job['customer_name']} • ${job['time_ago']}',
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 12,
                            color: AppColors.gray,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                // Visit Fee Paid Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.lightGreenBg,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: AppColors.primaryGreen.withOpacity(0.3)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle, color: AppColors.primaryGreen, size: 14),
                      const SizedBox(width: 4),
                      Text(
                        'Fee Rs. ${job['visit_fee']} PAID',
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppColors.primaryGreen,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Problem Description
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: Text(
              job['problem_summary'],
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 13,
                color: AppColors.charcoal,
                height: 1.35,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),

          // Location & Distance Row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: Row(
              children: [
                const Icon(Icons.location_on_outlined, color: AppColors.gray, size: 16),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    job['location'],
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      color: AppColors.gray,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F5F5),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    job['distance'],
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: AppColors.charcoal,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 16, color: AppColors.divider),

          // Accept / Reject Actions
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
            child: Row(
              children: [
                Expanded(
                  flex: 1,
                  child: SizedBox(
                    height: 44,
                    child: OutlinedButton(
                      onPressed: () => _rejectJob(job),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: AppColors.border),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text(
                        'Decline',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                          color: AppColors.gray,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: SizedBox(
                    height: 44,
                    child: ElevatedButton(
                      onPressed: () => _acceptJob(job),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryGreen,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: const Text(
                        'Accept Job',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOfflineWarningBanner() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          const Icon(Icons.cloud_off_outlined, size: 48, color: AppColors.gray),
          const SizedBox(height: 12),
          const Text(
            'You Are Currently Offline',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: AppColors.charcoal,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Switch your status to Online using the toggle at the top to receive new job requests from nearby customers.',
            style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.gray),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () {
              ref.read(workerOnlineStatusProvider.notifier).state = true;
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryGreen,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Go Online Now', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Widget _buildNoJobsState() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: const Column(
        children: [
          Icon(Icons.check_circle_outline, size: 48, color: AppColors.primaryGreen),
          SizedBox(height: 12),
          Text(
            'No Pending Requests',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 16,
              color: AppColors.charcoal,
            ),
          ),
          SizedBox(height: 6),
          Text(
            'Keep your app active. New requests from customers within your service radius will appear here instantly.',
            style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.gray),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
