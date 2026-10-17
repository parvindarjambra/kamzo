import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';

class WorkerJobsScreen extends ConsumerStatefulWidget {
  const WorkerJobsScreen({super.key});

  @override
  ConsumerState<WorkerJobsScreen> createState() => _WorkerJobsScreenState();
}

class _WorkerJobsScreenState extends ConsumerState<WorkerJobsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final NumberFormat _currencyFormatter = NumberFormat('#,##0', 'en_US');

  // Mock Jobs Data categorized by status
  final List<Map<String, dynamic>> _activeJobs = [
    {
      'id': 'KZ-8821',
      'service': 'AC Repair & Servicing',
      'customer_name': 'Tariq Mehmood',
      'location': 'Gulshan-e-Iqbal Block 13-D, Karachi',
      'date': 'Today, 02:15 PM',
      'amount': 3500,
      'status': 'In Progress',
      'status_color': AppColors.warning,
      'visit_fee': 500,
    },
    {
      'id': 'KZ-8824',
      'service': 'Plumbing Leak Fix',
      'customer_name': 'Dr. Arshad Farooq',
      'location': 'PECHS Block 6, Karachi',
      'date': 'Today, 04:30 PM',
      'amount': 1500,
      'status': 'On The Way',
      'status_color': AppColors.info,
      'visit_fee': 500,
    },
  ];

  final List<Map<String, dynamic>> _availableJobs = [
    {
      'id': 'KZ-9042',
      'service': 'Kitchen Sink Pipe Leakage',
      'customer_name': 'Bilal Ahmed',
      'location': 'DHA Phase 5, Karachi',
      'date': 'Requested 10 mins ago',
      'amount': 1200,
      'status': 'Available',
      'status_color': AppColors.accentGreen,
      'visit_fee': 500,
    },
    {
      'id': 'KZ-9045',
      'service': 'Breaker Tripping & Distribution Box',
      'customer_name': 'Sobia Khan',
      'location': 'Gulistan-e-Jauhar Block 7, Karachi',
      'date': 'Requested 25 mins ago',
      'amount': 2000,
      'status': 'Available',
      'status_color': AppColors.accentGreen,
      'visit_fee': 500,
    },
    {
      'id': 'KZ-9049',
      'service': 'Car Battery & Alternator Diagnostics',
      'customer_name': 'Hamza Sheikh',
      'location': 'Clifton Block 2, Karachi',
      'date': 'Requested 40 mins ago',
      'amount': 2500,
      'status': 'Available',
      'status_color': AppColors.accentGreen,
      'visit_fee': 700,
    },
  ];

  final List<Map<String, dynamic>> _completedJobs = [
    {
      'id': 'KZ-7790',
      'service': 'AC Gas Charge & Capacitor Replacement',
      'customer_name': 'Zubair Qureshi',
      'location': 'North Nazimabad Block H, Karachi',
      'date': 'Yesterday, 05:40 PM',
      'amount': 4200,
      'status': 'Completed',
      'status_color': AppColors.success,
      'visit_fee': 500,
      'rating': 5.0,
    },
    {
      'id': 'KZ-7651',
      'service': 'Master Bathroom Mixer Tap Replacement',
      'customer_name': 'Noman Siddiqui',
      'location': 'Bahria Town Precinct 10, Karachi',
      'date': '12 Oct 2026',
      'amount': 1800,
      'status': 'Completed',
      'status_color': AppColors.success,
      'visit_fee': 500,
      'rating': 4.8,
    },
    {
      'id': 'KZ-7503',
      'service': 'Submersible Water Pump Rewinding Check',
      'customer_name': 'Khurram Shahzad',
      'location': 'Federal B Area Block 14, Karachi',
      'date': '10 Oct 2026',
      'amount': 3000,
      'status': 'Completed',
      'status_color': AppColors.success,
      'visit_fee': 500,
      'rating': 5.0,
    },
  ];

  final List<Map<String, dynamic>> _cancelledJobs = [
    {
      'id': 'KZ-7410',
      'service': 'Split AC Outdoor Bracket Fixing',
      'customer_name': 'Farhan Latif',
      'location': 'DHA Phase 2, Karachi',
      'date': '08 Oct 2026',
      'amount': 1200,
      'status': 'Cancelled by Customer',
      'status_color': AppColors.error,
      'visit_fee': 500,
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.charcoal, size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/worker/home');
            }
          },
        ),
        title: const Text(
          'My Jobs',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: AppColors.charcoal,
            fontSize: 18,
          ),
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primaryGreen,
          unselectedLabelColor: AppColors.gray,
          indicatorColor: AppColors.primaryGreen,
          indicatorWeight: 3,
          labelStyle: const TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 13),
          unselectedLabelStyle: const TextStyle(fontFamily: 'Poppins', fontSize: 13),
          tabs: [
            Tab(text: 'Active (${_activeJobs.length})'),
            Tab(text: 'Available (${_availableJobs.length})'),
            Tab(text: 'Completed (${_completedJobs.length})'),
            Tab(text: 'Cancelled (${_cancelledJobs.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildJobsList(
            jobs: _activeJobs,
            emptyTitle: 'No Active Jobs',
            emptySubtitle: 'Accept job requests from the Available tab to start working.',
            tabType: 'active',
          ),
          _buildJobsList(
            jobs: _availableJobs,
            emptyTitle: 'No Available Jobs',
            emptySubtitle: 'There are currently no new booking requests in your locality. Check back soon!',
            tabType: 'available',
          ),
          _buildJobsList(
            jobs: _completedJobs,
            emptyTitle: 'No Completed Jobs Yet',
            emptySubtitle: 'Jobs you finish successfully with customers will appear here.',
            tabType: 'completed',
          ),
          _buildJobsList(
            jobs: _cancelledJobs,
            emptyTitle: 'No Cancelled Jobs',
            emptySubtitle: 'Good job! None of your scheduled tasks have been cancelled.',
            tabType: 'cancelled',
          ),
        ],
      ),
    );
  }

  Widget _buildJobsList({
    required List<Map<String, dynamic>> jobs,
    required String emptyTitle,
    required String emptySubtitle,
    required String tabType,
  }) {
    if (jobs.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: AppColors.lightGreenBg,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.work_history_outlined, size: 48, color: AppColors.primaryGreen),
              ),
              const SizedBox(height: 18),
              Text(
                emptyTitle,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 17,
                  color: AppColors.charcoal,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                emptySubtitle,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 13,
                  color: AppColors.gray,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: jobs.length,
      separatorBuilder: (ctx, i) => const SizedBox(height: 12),
      itemBuilder: (ctx, index) {
        final job = jobs[index];
        return _buildJobCard(job, tabType);
      },
    );
  }

  Widget _buildJobCard(Map<String, dynamic> job, String tabType) {
    final statusColor = job['status_color'] as Color;

    return InkWell(
      onTap: () {
        context.push('/worker/job-detail', extra: job['id']);
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Service name + Status badge
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '#${job['id']}',
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: AppColors.gray,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        job['service'],
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                          color: AppColors.charcoal,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: statusColor.withOpacity(0.3)),
                  ),
                  child: Text(
                    job['status'],
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

            const SizedBox(height: 10),

            // Customer Name & Location
            Row(
              children: [
                const Icon(Icons.person_outline, size: 16, color: AppColors.gray),
                const SizedBox(width: 6),
                Text(
                  job['customer_name'],
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.charcoal,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.location_on_outlined, size: 16, color: AppColors.gray),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    job['location'],
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      color: AppColors.gray,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),

            const Divider(height: 20, color: AppColors.divider),

            // Bottom Row: Date & Amount
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.access_time, size: 14, color: AppColors.gray),
                    const SizedBox(width: 4),
                    Text(
                      job['date'],
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 11,
                        color: AppColors.gray,
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    if (job['rating'] != null) ...[
                      const Icon(Icons.star, color: Color(0xFFF57F17), size: 16),
                      const SizedBox(width: 2),
                      Text(
                        '${job['rating']}  •  ',
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                          color: AppColors.charcoal,
                        ),
                      ),
                    ],
                    Text(
                      'Rs. ${_currencyFormatter.format(job['amount'])}',
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                        color: AppColors.primaryGreen,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
