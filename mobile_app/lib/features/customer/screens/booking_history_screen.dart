import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/constants/app_routes.dart';
import '../models/booking_request_model.dart';
import '../models/service_item.dart';
import 'booking_tracking_screen.dart';

/// Screen 13: Booking History Screen
/// Lists customer past and current bookings with tab filtering (All, Active, Completed, Cancelled),
/// status indicators, empty state representation, and tap-through to live tracking.
class BookingHistoryScreen extends ConsumerStatefulWidget {
  const BookingHistoryScreen({super.key});

  @override
  ConsumerState<BookingHistoryScreen> createState() => _BookingHistoryScreenState();
}

class _BookingHistoryScreenState extends ConsumerState<BookingHistoryScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ScrollController _scrollController = ScrollController();
  bool _isLoadingMore = false;
  late List<CustomerBooking> _bookings;

  final List<String> _tabs = const ['All', 'Active', 'Completed', 'Cancelled'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _bookings = _generateMockBookings();

    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
              _scrollController.position.maxScrollExtent - 100 &&
          !_isLoadingMore) {
        _loadMoreBookings();
      }
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _loadMoreBookings() {
    setState(() => _isLoadingMore = true);
    Future.delayed(const Duration(milliseconds: 900), () {
      if (!mounted) return;
      setState(() => _isLoadingMore = false);
    });
  }

  List<CustomerBooking> _generateMockBookings() {
    final now = DateTime.now();
    return [
      CustomerBooking(
        id: 'bk_1',
        bookingNumber: 'KMZ-20241114-0012',
        service: ServiceItem.defaultServices[3], // Electrician
        problemDescription: 'Main circuit breaker tripping repeatedly when AC turns on.',
        address: 'House 42, Street 8, Sector G, Lahore',
        city: 'Lahore',
        scheduledAt: now,
        status: 'on_the_way',
        createdAt: now.subtract(const Duration(minutes: 30)),
        workerName: 'Muhammad Tariq',
        workerPhone: '+923001234567',
        workerRating: 4.9,
        workerTotalJobs: 142,
        laborCharges: 1200.0,
        partsCharges: 450.0,
        totalBillAmount: 1650.0,
      ),
      CustomerBooking(
        id: 'bk_2',
        bookingNumber: 'KMZ-20241112-0005',
        service: ServiceItem.defaultServices[1], // AC Repair
        problemDescription: 'Split AC master chemical cleaning and R410 gas refilling.',
        address: 'Apartment 3B, Askari 11, Lahore',
        city: 'Lahore',
        scheduledAt: now.subtract(const Duration(days: 2)),
        status: 'completed',
        createdAt: now.subtract(const Duration(days: 2, hours: 4)),
        workerName: 'Khurram Shehzad',
        workerPhone: '+923214567890',
        workerRating: 4.8,
        workerTotalJobs: 98,
        laborCharges: 2500.0,
        partsCharges: 1800.0,
        totalBillAmount: 4300.0,
        billConfirmed: true,
      ),
      CustomerBooking(
        id: 'bk_3',
        bookingNumber: 'KMZ-20241105-0019',
        service: ServiceItem.defaultServices[2], // Plumber
        problemDescription: 'Water motor pump impeller replacement and bathroom pipe leak.',
        address: 'House 19, DHA Phase 4, Lahore',
        city: 'Lahore',
        scheduledAt: now.subtract(const Duration(days: 9)),
        status: 'completed',
        createdAt: now.subtract(const Duration(days: 9, hours: 3)),
        workerName: 'Rashid Minhas',
        workerPhone: '+923331122334',
        workerRating: 4.7,
        workerTotalJobs: 110,
        laborCharges: 1800.0,
        partsCharges: 650.0,
        totalBillAmount: 2450.0,
        billConfirmed: true,
      ),
      CustomerBooking(
        id: 'bk_4',
        bookingNumber: 'KMZ-20241028-0003',
        service: ServiceItem.defaultServices[0], // Mechanic
        problemDescription: 'Car engine overheating near Ring Road exchange.',
        address: 'Ring Road interchange, Lahore',
        city: 'Lahore',
        scheduledAt: now.subtract(const Duration(days: 17)),
        status: 'cancelled',
        createdAt: now.subtract(const Duration(days: 17, hours: 2)),
        workerName: null,
      ),
    ];
  }

  List<CustomerBooking> _getFilteredBookings(int tabIndex) {
    switch (tabIndex) {
      case 1: // Active
        return _bookings.where((b) =>
            b.status != 'completed' && b.status != 'cancelled').toList();
      case 2: // Completed
        return _bookings.where((b) => b.status == 'completed').toList();
      case 3: // Cancelled
        return _bookings.where((b) => b.status == 'cancelled').toList();
      case 0: // All
      default:
        return _bookings;
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return AppColors.primary;
      case 'on_the_way':
      case 'in_progress':
      case 'arrived':
        return AppColors.warning;
      case 'payment_verified':
      case 'accepted':
      case 'requested':
        return AppColors.accent;
      case 'cancelled':
      default:
        return AppColors.error;
    }
  }

  String _formatStatusLabel(String status) {
    switch (status.toLowerCase()) {
      case 'on_the_way':
        return 'On The Way';
      case 'in_progress':
        return 'In Progress';
      case 'payment_verified':
        return 'Payment Verified';
      default:
        return status[0].toUpperCase() + status.substring(1);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0.5,
        title: const Text(
          'My Bookings',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.charcoal,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.charcoal),
          onPressed: () {
            if (Navigator.of(context).canPop()) {
              Navigator.of(context).pop();
            } else {
              context.go(AppRoutes.customerHome);
            }
          },
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.gray,
          indicatorColor: AppColors.primary,
          indicatorWeight: 3,
          labelStyle: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 13,
            fontWeight: FontWeight.w700,
          ),
          unselectedLabelStyle: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 13,
            fontWeight: FontWeight.w500,
          ),
          tabs: _tabs.map((tab) => Tab(text: tab)).toList(),
          onTap: (_) => setState(() {}),
        ),
      ),
      body: SafeArea(
        child: TabBarView(
          controller: _tabController,
          children: List.generate(_tabs.length, (index) {
            final filtered = _getFilteredBookings(index);
            if (filtered.isEmpty) {
              return _buildEmptyState(_tabs[index]);
            }
            return _buildBookingsList(filtered);
          }),
        ),
      ),
    );
  }

  Widget _buildBookingsList(List<CustomerBooking> list) {
    final dateFormat = DateFormat('dd MMM yyyy, hh:mm a');

    return RefreshIndicator(
      color: AppColors.primary,
      onRefresh: () async {
        await Future.delayed(const Duration(milliseconds: 600));
        setState(() {});
      },
      child: ListView.builder(
        controller: _scrollController,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        itemCount: list.length + (_isLoadingMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == list.length) {
            return const Padding(
              padding: EdgeInsets.symmetric(vertical: 20),
              child: Center(
                child: CircularProgressIndicator(color: AppColors.primary),
              ),
            );
          }

          final booking = list[index];
          final statusColor = _getStatusColor(booking.status);

          return Container(
            margin: const EdgeInsets.only(bottom: 14),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
              border: Border.all(color: AppColors.border),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x06000000),
                  blurRadius: 8,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (ctx) => BookingTrackingScreen(booking: booking),
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header Row: Service Emoji + Name and Status Badge
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  color: AppColors.lightGreen,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Center(
                                  child: Text(
                                    booking.service.emoji,
                                    style: const TextStyle(fontSize: 20),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    booking.service.name,
                                    style: const TextStyle(
                                      fontFamily: 'Poppins',
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.charcoal,
                                    ),
                                  ),
                                  Text(
                                    booking.bookingNumber,
                                    style: const TextStyle(
                                      fontFamily: 'Poppins',
                                      fontSize: 11,
                                      color: AppColors.gray,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: statusColor.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              _formatStatusLabel(booking.status),
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 11.5,
                                fontWeight: FontWeight.w700,
                                color: statusColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Problem snippet
                      Text(
                        booking.problemDescription,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 12.5,
                          color: AppColors.charcoal,
                        ),
                      ),
                      const Divider(height: 20, color: AppColors.border),

                      // Bottom Metadata Row: Worker + Date + Amount
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(
                                Icons.calendar_today_rounded,
                                size: 14,
                                color: AppColors.gray,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                dateFormat.format(booking.scheduledAt),
                                style: const TextStyle(
                                  fontFamily: 'Poppins',
                                  fontSize: 11,
                                  color: AppColors.gray,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            booking.totalBillAmount != null
                                ? 'Rs. ${booking.totalBillAmount!.toStringAsFixed(0)}'
                                : 'Visit: Rs. 200',
                            style: const TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 13.5,
                              fontWeight: FontWeight.w700,
                              color: AppColors.primary,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState(String tabName) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppColors.lightGreen.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.assignment_outlined,
                size: 50,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'No $tabName Bookings Found',
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 17,
                fontWeight: FontWeight.w700,
                color: AppColors.charcoal,
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              'Need help with AC repair, electrical wiring, plumbing, or car maintenance?',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12.5,
                color: AppColors.gray,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go(AppRoutes.customerHome),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Book a Service Now',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
