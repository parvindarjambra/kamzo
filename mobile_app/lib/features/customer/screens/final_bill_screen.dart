import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../models/service_item.dart';
import '../models/booking_request_model.dart';
import 'review_screen.dart';

/// Screen 11: Final Bill Screen
/// Detailed bill breakdown submitted by the technician upon task completion.
/// Highlights cash-to-worker payment model, itemized breakdown, and dispute mechanism.
class FinalBillScreen extends ConsumerStatefulWidget {
  final CustomerBooking? booking;

  const FinalBillScreen({
    super.key,
    this.booking,
  });

  @override
  ConsumerState<FinalBillScreen> createState() => _FinalBillScreenState();
}

class _FinalBillScreenState extends ConsumerState<FinalBillScreen> {
  late CustomerBooking _booking;
  final TextEditingController _disputeReasonController = TextEditingController();
  bool _isConfirming = false;

  @override
  void initState() {
    super.initState();
    _booking = widget.booking ?? _createDefaultBooking();
  }

  @override
  void dispose() {
    _disputeReasonController.dispose();
    super.dispose();
  }

  CustomerBooking _createDefaultBooking() {
    return CustomerBooking(
      id: 'bk_bill_default',
      bookingNumber: 'KMZ-20241114-0001',
      service: const ServiceItem(
        id: 'electrician',
        name: 'Electrician',
        urduName: 'الیکٹریشن',
        shortDesc: 'Wiring & Short Circuit',
        fullDesc: 'Electrical repairs',
        emoji: '⚡',
        iconData: Icons.bolt_rounded,
        commonIssues: [],
      ),
      problemDescription: 'Main circuit breaker trips repeatedly when AC starts.',
      address: 'House # 42, Street 8, Block G, Gulberg III, Lahore',
      city: 'Lahore',
      scheduledAt: DateTime.now(),
      status: 'in_progress',
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
      workerName: 'Muhammad Tariq',
      workerPhone: '+923001234567',
      workerRating: 4.9,
      laborCharges: 1200.0,
      partsCharges: 450.0,
      totalBillAmount: 1650.0,
    );
  }

  void _onConfirmAndPay() {
    setState(() => _isConfirming = true);

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      final completedBooking = _booking.copyWith(
        status: 'completed',
        billConfirmed: true,
      );

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (ctx) => ReviewScreen(booking: completedBooking),
        ),
      );
    });
  }

  void _showDisputeModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Row(
              children: [
                Icon(Icons.report_gmailerrorred_rounded, color: AppColors.error),
                SizedBox(width: 8),
                Text(
                  'Dispute Bill Amount',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 16.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.charcoal,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Text(
              'If the bill exceeds what was agreed or parts charges seem unfair, tell us why and KAMZO customer support will intervene immediately.',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                color: AppColors.gray,
              ),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: _disputeReasonController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Enter reason for dispute...',
                hintStyle: const TextStyle(fontFamily: 'Poppins', fontSize: 13),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
              ),
            ),
            const SizedBox(height: 18),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text(
                      'Dispute ticket raised. KAMZO admin will call you and worker shortly.',
                      style: TextStyle(fontFamily: 'Poppins'),
                    ),
                    backgroundColor: AppColors.warning,
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.error,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Submit Dispute',
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

  @override
  Widget build(BuildContext context) {
    final labor = _booking.laborCharges ?? 1200.0;
    final parts = _booking.partsCharges ?? 450.0;
    final totalPayableToWorker = labor + parts;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0.5,
        title: const Text(
          'Job Completion Bill',
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
              // Top Job Details Card
              _buildJobDetailsCard(),
              const SizedBox(height: 16),

              // Worker Info Card
              _buildWorkerCard(),
              const SizedBox(height: 16),

              // Itemized Bill Breakdown
              _buildBillBreakdownCard(labor, parts, totalPayableToWorker),
              const SizedBox(height: 16),

              // Cash Payment Notice
              _buildCashNoticeCard(),
              const SizedBox(height: 28),

              // Confirm & Pay Worker Button
              SizedBox(
                height: AppColors.buttonHeight,
                child: ElevatedButton(
                  onPressed: _isConfirming ? null : _onConfirmAndPay,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: AppColors.white,
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(
                        AppColors.cardBorderRadius,
                      ),
                    ),
                  ),
                  child: _isConfirming
                      ? const CircularProgressIndicator(color: AppColors.white)
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.check_circle_outline_rounded, size: 20),
                            const SizedBox(width: 8),
                            Text(
                              'Confirm & Pay Worker (Rs. ${totalPayableToWorker.toStringAsFixed(0)})',
                              style: const TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 14),

              // Dispute This Amount Button
              SizedBox(
                height: AppColors.buttonHeight,
                child: OutlinedButton.icon(
                  onPressed: _showDisputeModal,
                  icon: const Icon(Icons.report_problem_outlined, color: AppColors.error),
                  label: const Text(
                    'Dispute This Amount',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14.5,
                      fontWeight: FontWeight.w700,
                      color: AppColors.error,
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.error, width: 1.5),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(
                        AppColors.cardBorderRadius,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildJobDetailsCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Job: ${_booking.service.name}',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 15.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.charcoal,
                ),
              ),
              Text(
                _booking.service.emoji,
                style: const TextStyle(fontSize: 22),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Ref: ${_booking.bookingNumber}',
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppColors.gray,
            ),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              _booking.problemDescription,
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12.5,
                color: AppColors.charcoal,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWorkerCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: AppColors.lightGreen,
            child: const Icon(Icons.person, color: AppColors.primary, size: 28),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _booking.workerName ?? 'Muhammad Tariq',
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 14.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.charcoal,
                  ),
                ),
                Text(
                  'Verified ${_booking.service.name}',
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 11.5,
                    color: AppColors.gray,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.lightGreen,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Row(
              children: [
                Icon(Icons.star_rounded, size: 16, color: AppColors.starGold),
                SizedBox(width: 4),
                Text(
                  '4.9',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
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

  Widget _buildBillBreakdownCard(
      double labor, double parts, double totalPayable) {
    return Container(
      padding: const EdgeInsets.all(18),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Itemized Invoice Breakdown',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14.5,
              fontWeight: FontWeight.w700,
              color: AppColors.charcoal,
            ),
          ),
          const SizedBox(height: 14),

          // Visit fee note
          _buildRowItem('Advance Visit Fee (Paid Online)', 'Rs. 200', isPaid: true),
          const SizedBox(height: 8),

          // Labor charges
          _buildRowItem('Labor & Service Charges', 'Rs. ${labor.toStringAsFixed(0)}'),
          const SizedBox(height: 8),

          // Parts replacement
          _buildRowItem('Parts & Materials (Breaker 32A)', 'Rs. ${parts.toStringAsFixed(0)}'),
          const Divider(height: 24, color: AppColors.border),

          // Total Large Payable Amount
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Net Due to Worker',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.charcoal,
                    ),
                  ),
                  Text(
                    'Payable in Cash on Hand',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 11,
                      color: AppColors.gray,
                    ),
                  ),
                ],
              ),
              Text(
                'Rs. ${totalPayable.toStringAsFixed(0)}',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildRowItem(String title, String val, {bool isPaid = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Text(
              title,
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 13,
                color: isPaid ? AppColors.gray : AppColors.charcoal,
                decoration: isPaid ? TextDecoration.lineThrough : null,
              ),
            ),
            if (isPaid) ...[
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.lightGreen,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  'PAID',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 9.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ],
        ),
        Text(
          val,
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: isPaid ? AppColors.gray : AppColors.charcoal,
          ),
        ),
      ],
    );
  }

  Widget _buildCashNoticeCard() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.lightGreen.withOpacity(0.55),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.greenTint),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Icon(Icons.payments_outlined, color: AppColors.primary, size: 22),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              'Payment is made directly to the worker in cash. Please inspect the work and test the repair thoroughly before handing over payment.',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 11.5,
                fontWeight: FontWeight.w500,
                color: AppColors.primaryDark,
                height: 1.45,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
