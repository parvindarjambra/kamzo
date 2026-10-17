import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../models/service_item.dart';
import '../models/booking_request_model.dart';
import 'payment_screen.dart';

/// Screen 8: Booking Confirmation Screen
/// Review booking summary (service type, fault description, location, flat Rs. 200 visit fee),
/// policy disclosure, and proceeds to advance payment verification.
class BookingConfirmationScreen extends ConsumerStatefulWidget {
  final ServiceItem? service;
  final String? problemDescription;
  final String? address;
  final String? city;
  final double? latitude;
  final double? longitude;
  final String? requestType;

  const BookingConfirmationScreen({
    super.key,
    this.service,
    this.problemDescription,
    this.address,
    this.city,
    this.latitude,
    this.longitude,
    this.requestType,
  });

  @override
  ConsumerState<BookingConfirmationScreen> createState() =>
      _BookingConfirmationScreenState();
}

class _BookingConfirmationScreenState extends ConsumerState<BookingConfirmationScreen> {
  late ServiceItem _service;
  late String _problemDescription;
  late String _address;
  late String _city;
  late String _requestType;
  final double _visitFee = 200.0;

  @override
  void initState() {
    super.initState();
    _service = widget.service ?? ServiceItem.defaultServices.first;
    _problemDescription =
        widget.problemDescription ?? 'Inspection & diagnostics required';
    _address = widget.address ?? 'Gulberg III, Lahore, Pakistan';
    _city = widget.city ?? 'Lahore';
    _requestType = widget.requestType ?? 'Urgent Dispatch';
  }

  void _onConfirmBooking() {
    final now = DateTime.now();
    final bookingNumber =
        'KMZ-${now.year}${now.month.toString().padLeft(2, '0')}${now.day.toString().padLeft(2, '0')}-${(now.millisecondsSinceEpoch % 10000).toString().padLeft(4, '0')}';

    final newBooking = CustomerBooking(
      id: 'bk_${now.millisecondsSinceEpoch}',
      bookingNumber: bookingNumber,
      service: _service,
      problemDescription: _problemDescription,
      address: _address,
      city: _city,
      latitude: widget.latitude ?? 31.5204,
      longitude: widget.longitude ?? 74.3587,
      visitFee: _visitFee,
      requestType: _requestType,
      scheduledAt: now,
      status: 'requested',
      createdAt: now,
    );

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => PaymentScreen(booking: newBooking),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0.5,
        title: const Text(
          'Booking Summary',
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
              // Top Service Card
              _buildServiceSummaryCard(),
              const SizedBox(height: 18),

              // Problem Description Card
              _buildProblemDescriptionCard(),
              const SizedBox(height: 18),

              // Service Address Card
              _buildAddressCard(),
              const SizedBox(height: 18),

              // Pricing Breakdown Card
              _buildPricingCard(),
              const SizedBox(height: 18),

              // Terms & Information Card
              _buildTermsNoticeCard(),
              const SizedBox(height: 28),

              // Confirm Booking Button
              SizedBox(
                height: AppColors.buttonHeight,
                child: ElevatedButton(
                  onPressed: _onConfirmBooking,
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
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Proceed to Pay Visit Fee (Rs. 200)',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 15.5,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward_rounded, size: 20),
                    ],
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

  Widget _buildServiceSummaryCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: AppColors.lightGreen,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Center(
              child: Text(
                _service.emoji,
                style: const TextStyle(fontSize: 26),
              ),
            ),
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
                      _service.name,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 16.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.charcoal,
                      ),
                    ),
                    Text(
                      _service.urduName,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: AppColors.accent,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(
                      Icons.electric_bolt_rounded,
                      size: 14,
                      color: AppColors.warning,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      _requestType,
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: AppColors.gray,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProblemDescriptionCard() {
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
            children: const [
              Icon(Icons.report_problem_outlined, size: 18, color: AppColors.primary),
              SizedBox(width: 8),
              Text(
                'Reported Problem',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.charcoal,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              _problemDescription,
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 13,
                color: AppColors.charcoal,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAddressCard() {
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
            children: const [
              Icon(Icons.pin_drop_rounded, size: 18, color: AppColors.primary),
              SizedBox(width: 8),
              Text(
                'Service Location',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.charcoal,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            _address,
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppColors.charcoal,
              height: 1.35,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPricingCard() {
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
          const Text(
            'Charges Breakdown',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: AppColors.charcoal,
            ),
          ),
          const SizedBox(height: 12),
          _buildPriceRow(
            label: 'Technician Visit & Inspection Fee',
            amount: 'Rs. 200',
            isBold: true,
            isGreen: true,
          ),
          const SizedBox(height: 8),
          _buildPriceRow(
            label: 'Labor & Repair Charges',
            amount: 'Agreed on-site',
            isSecondary: true,
          ),
          const SizedBox(height: 8),
          _buildPriceRow(
            label: 'Replacement Parts (if required)',
            amount: 'As per market receipt',
            isSecondary: true,
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 10),
            child: Divider(color: AppColors.border),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text(
                'Payable Now (Advance Verification)',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: AppColors.charcoal,
                ),
              ),
              Text(
                'Rs. 200',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRow({
    required String label,
    required String amount,
    bool isBold = false,
    bool isGreen = false,
    bool isSecondary = false,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            label,
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 12.5,
              fontWeight: isBold ? FontWeight.w600 : FontWeight.w400,
              color: isSecondary ? AppColors.gray : AppColors.charcoal,
            ),
          ),
        ),
        Text(
          amount,
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 13,
            fontWeight: isBold ? FontWeight.w700 : FontWeight.w500,
            color: isGreen
                ? AppColors.primary
                : isSecondary
                    ? AppColors.gray
                    : AppColors.charcoal,
          ),
        ),
      ],
    );
  }

  Widget _buildTermsNoticeCard() {
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
          Icon(
            Icons.shield_outlined,
            color: AppColors.primary,
            size: 20,
          ),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              'Advance Rs. 200 visit fee guarantees technician dispatch & filters non-serious requests. Labor and parts are paid in cash directly to the worker upon completion.',
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
