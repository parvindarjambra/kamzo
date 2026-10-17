import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_colors.dart';
import '../models/service_item.dart';
import '../models/booking_request_model.dart';
import 'final_bill_screen.dart';

/// Screen 10: Booking Tracking Screen
/// Live 7-step timeline stepper tracking the technician's journey:
/// Requested -> Payment Verified -> Accepted -> On The Way -> Arrived -> In Progress -> Completed.
/// Includes worker profile card with direct phone dialer, active pulsing animations,
/// chat access, and embedded final bill confirmation.
class BookingTrackingScreen extends ConsumerStatefulWidget {
  final CustomerBooking? booking;

  const BookingTrackingScreen({
    super.key,
    this.booking,
  });

  @override
  ConsumerState<BookingTrackingScreen> createState() => _BookingTrackingScreenState();
}

class _BookingTrackingScreenState extends ConsumerState<BookingTrackingScreen>
    with SingleTickerProviderStateMixin {
  late CustomerBooking _booking;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  // 7-step lifecycle timeline
  final List<String> _orderedStatuses = const [
    'requested',
    'payment_verified',
    'accepted',
    'on_the_way',
    'arrived',
    'in_progress',
    'completed',
  ];

  final Map<String, _StatusInfo> _statusDetails = const {
    'requested': _StatusInfo('Requested', Icons.receipt_long_rounded, 'Order placed by customer'),
    'payment_verified': _StatusInfo('Payment Verified', Icons.verified_rounded, 'Advance Rs. 200 approved'),
    'accepted': _StatusInfo('Accepted', Icons.person_add_alt_1_rounded, 'Technician assigned'),
    'on_the_way': _StatusInfo('On The Way', Icons.directions_bike_rounded, 'Technician heading to your address'),
    'arrived': _StatusInfo('Arrived', Icons.location_on_rounded, 'Technician reached doorstep'),
    'in_progress': _StatusInfo('In Progress', Icons.build_circle_rounded, 'Repair work in progress'),
    'completed': _StatusInfo('Completed', Icons.check_circle_rounded, 'Job done & confirmed'),
  };

  @override
  void initState() {
    super.initState();
    _booking = widget.booking ?? _createDefaultMockBooking();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.9, end: 1.15).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  CustomerBooking _createDefaultMockBooking() {
    final now = DateTime.now();
    return CustomerBooking(
      id: 'bk_mock_1',
      bookingNumber: 'KMZ-20241114-0001',
      service: const ServiceItem(
        id: 'electrician',
        name: 'Electrician',
        urduName: 'الیکٹریشن',
        shortDesc: 'Wiring & Short Circuit',
        fullDesc: 'Licensed electrician for domestic circuits and breakers.',
        emoji: '⚡',
        iconData: Icons.bolt_rounded,
        commonIssues: [],
      ),
      problemDescription: 'Main circuit breaker trips repeatedly when AC starts.',
      address: 'House # 42, Street 8, Block G, Gulberg III',
      city: 'Lahore',
      scheduledAt: now,
      status: 'on_the_way',
      createdAt: now.subtract(const Duration(minutes: 25)),
      workerName: 'Muhammad Tariq',
      workerPhone: '+923001234567',
      workerRating: 4.9,
      workerTotalJobs: 142,
      laborCharges: 1200.0,
      partsCharges: 450.0,
      totalBillAmount: 1650.0,
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  int _getStatusIndex(String status) {
    final idx = _orderedStatuses.indexOf(status.toLowerCase());
    return idx == -1 ? 0 : idx;
  }

  void _copyBookingNumber() {
    Clipboard.setData(ClipboardData(text: _booking.bookingNumber));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Booking number copied to clipboard!'),
        backgroundColor: AppColors.primary,
        duration: Duration(seconds: 2),
      ),
    );
  }

  Future<void> _callWorker(String phone) async {
    final Uri launchUri = Uri(scheme: 'tel', path: phone);
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not open dialer for $phone')),
        );
      }
    }
  }

  void _onChatPressed() {
    final isVerified = _getStatusIndex(_booking.status) >= 1;
    if (!isVerified) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Chat will be available as soon as visit payment is verified.'),
        ),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Connecting to ${_booking.workerName ?? "Technician"}...'),
        backgroundColor: AppColors.primary,
      ),
    );
  }

  void _onConfirmBill() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => FinalBillScreen(booking: _booking),
      ),
    );
  }

  void _showCancelDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        ),
        title: const Text(
          'Cancel Booking?',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.w700,
            color: AppColors.charcoal,
          ),
        ),
        content: const Text(
          'Are you sure you want to cancel this booking? If advance visit fee was paid, our support team will review refund eligibility.',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 13,
            color: AppColors.gray,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Keep Booking', style: TextStyle(fontFamily: 'Poppins')),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() {
                _booking = _booking.copyWith(status: 'cancelled');
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Booking has been cancelled.'),
                  backgroundColor: AppColors.error,
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text(
              'Yes, Cancel',
              style: TextStyle(fontFamily: 'Poppins', color: AppColors.white),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentStepIdx = _getStatusIndex(_booking.status);
    final hasWorkerAssigned = currentStepIdx >= 2 && _booking.workerName != null;
    final canCancel = currentStepIdx <= 1 && _booking.status != 'cancelled';
    final hasBillReady = (currentStepIdx >= 5 || _booking.totalBillAmount != null) &&
        _booking.status != 'cancelled';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0.5,
        title: const Text(
          'Track Service',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.charcoal,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.charcoal),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Top Booking Reference Banner
              _buildBookingRefBanner(),
              const SizedBox(height: 16),

              // Live Status Badge with Pulse Indicator
              _buildLiveStatusIndicator(currentStepIdx),
              const SizedBox(height: 18),

              // Worker Profile Card (if accepted)
              if (hasWorkerAssigned) ...[
                _buildWorkerProfileCard(),
                const SizedBox(height: 18),
              ],

              // Final Bill Card (if in progress or completed)
              if (hasBillReady) ...[
                _buildFinalBillNoticeCard(),
                const SizedBox(height: 18),
              ],

              // Timeline Stepper Card
              _buildTimelineCard(currentStepIdx),
              const SizedBox(height: 20),

              // Actions (Chat + Cancel)
              Row(
                children: [
                  Expanded(
                    child: SizedBox(
                      height: AppColors.buttonHeight,
                      child: ElevatedButton.icon(
                        onPressed: _onChatPressed,
                        icon: const Icon(Icons.chat_outlined, size: 20),
                        label: const Text(
                          'Chat with Worker',
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 14.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: AppColors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                              AppColors.cardBorderRadius,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),

              if (canCancel) ...[
                const SizedBox(height: 14),
                Center(
                  child: TextButton(
                    onPressed: _showCancelDialog,
                    child: const Text(
                      'Cancel This Booking',
                      style: TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 13.5,
                        fontWeight: FontWeight.w600,
                        color: AppColors.error,
                      ),
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBookingRefBanner() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'BOOKING REFERENCE',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.gray,
                  letterSpacing: 0.8,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                _booking.bookingNumber,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.charcoal,
                ),
              ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.copy_rounded, color: AppColors.primary, size: 20),
            onPressed: _copyBookingNumber,
            tooltip: 'Copy Booking ID',
          ),
        ],
      ),
    );
  }

  Widget _buildLiveStatusIndicator(int currentStepIdx) {
    final currentStatusKey = _orderedStatuses[currentStepIdx];
    final info = _statusDetails[currentStatusKey] ??
        const _StatusInfo('Status', Icons.info_outline, '');

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.lightGreen.withOpacity(0.5),
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.greenTint),
      ),
      child: Row(
        children: [
          ScaleTransition(
            scale: _pulseAnimation,
            child: Container(
              width: 44,
              height: 44,
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Icon(info.icon, color: AppColors.white, size: 22),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      info.title,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 15.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppColors.accent,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ),
                Text(
                  info.subtitle,
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    color: AppColors.charcoal,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWorkerProfileCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 10,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          // Worker Avatar with Verified Badge
          Stack(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: AppColors.lightGreen,
                child: const Icon(
                  Icons.person_rounded,
                  size: 34,
                  color: AppColors.primary,
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: const BoxDecoration(
                    color: AppColors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.verified_rounded,
                    color: AppColors.primary,
                    size: 16,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 14),

          // Worker Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _booking.workerName ?? 'Assigned Expert',
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: AppColors.charcoal,
                  ),
                ),
                Text(
                  '${_booking.service.name} Specialist',
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    color: AppColors.gray,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.star_rounded, size: 16, color: AppColors.starGold),
                    const SizedBox(width: 4),
                    Text(
                      '${_booking.workerRating ?? 4.9} (${_booking.workerTotalJobs ?? 120}+ jobs)',
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 11.5,
                        fontWeight: FontWeight.w600,
                        color: AppColors.charcoal,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Direct Phone Call Button
          if (_booking.workerPhone != null)
            IconButton.filled(
              onPressed: () => _callWorker(_booking.workerPhone!),
              icon: const Icon(Icons.phone_rounded, color: AppColors.white, size: 20),
              style: IconButton.styleFrom(
                backgroundColor: AppColors.accent,
                padding: const EdgeInsets.all(12),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildFinalBillNoticeCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.accent, width: 1.5),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0C000000),
            blurRadius: 10,
            offset: Offset(0, 3),
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
                'Worker Final Bill Submitted',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.charcoal,
                ),
              ),
              Text(
                'Rs. ${_booking.totalBillAmount?.toStringAsFixed(0) ?? "1,650"}',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'Labor & parts charges have been finalized by technician.',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 12,
              color: AppColors.gray,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: _onConfirmBill,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text(
                    'Review & Pay Bill',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: AppColors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineCard(int currentStepIdx) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Service Progress Stepper',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: AppColors.charcoal,
            ),
          ),
          const SizedBox(height: 16),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _orderedStatuses.length,
            itemBuilder: (context, index) {
              final statusKey = _orderedStatuses[index];
              final info = _statusDetails[statusKey]!;
              final isDone = index <= currentStepIdx;
              final isCurrent = index == currentStepIdx;
              final isLast = index == _orderedStatuses.length - 1;

              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Indicator Column with vertical connecting line
                  Column(
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isDone ? AppColors.primary : AppColors.border,
                          border: isCurrent
                              ? Border.all(color: AppColors.accent, width: 2.5)
                              : null,
                        ),
                        child: Center(
                          child: Icon(
                            isDone ? Icons.check_rounded : info.icon,
                            size: 15,
                            color: isDone ? AppColors.white : AppColors.gray,
                          ),
                        ),
                      ),
                      if (!isLast)
                        Container(
                          width: 2.5,
                          height: 38,
                          color: index < currentStepIdx
                              ? AppColors.primary
                              : AppColors.border,
                        ),
                    ],
                  ),
                  const SizedBox(width: 14),

                  // Text Information
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(top: 2.0, bottom: 20.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            info.title,
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 13.5,
                              fontWeight: isCurrent ? FontWeight.w800 : FontWeight.w600,
                              color: isDone ? AppColors.charcoal : AppColors.gray,
                            ),
                          ),
                          Text(
                            info.subtitle,
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 11,
                              color: isCurrent ? AppColors.accent : AppColors.gray,
                              fontWeight: isCurrent ? FontWeight.w600 : FontWeight.w400,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _StatusInfo {
  final String title;
  final IconData icon;
  final String subtitle;
  const _StatusInfo(this.title, this.icon, this.subtitle);
}
