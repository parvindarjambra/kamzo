import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_colors.dart';

class WorkerCommissionScreen extends ConsumerStatefulWidget {
  const WorkerCommissionScreen({super.key});

  @override
  ConsumerState<WorkerCommissionScreen> createState() => _WorkerCommissionScreenState();
}

class _WorkerCommissionScreenState extends ConsumerState<WorkerCommissionScreen> {
  final NumberFormat _currencyFormatter = NumberFormat('#,##0', 'en_US');

  // Summary figures
  final double _totalEarned = 48500;
  final double _commissionDue = 1850;
  final double _commissionPaid = 3000;

  // Mock list of commissions
  final List<Map<String, dynamic>> _commissionList = [
    {
      'id': 'KZ-8821',
      'service': 'AC Gas Refill & Servicing',
      'job_amount': 3500,
      'commission_percent': 10,
      'commission_due': 350,
      'status': 'Pending',
      'status_color': AppColors.warning,
      'date': '14 Oct 2026',
    },
    {
      'id': 'KZ-8812',
      'service': 'Electric Breaker Wiring',
      'job_amount': 2500,
      'commission_percent': 10,
      'commission_due': 250,
      'status': 'Pending',
      'status_color': AppColors.warning,
      'date': '13 Oct 2026',
    },
    {
      'id': 'KZ-8750',
      'service': 'Plumbing Pipeline Repair',
      'job_amount': 4500,
      'commission_percent': 10,
      'commission_due': 450,
      'status': 'Pending',
      'status_color': AppColors.warning,
      'date': '12 Oct 2026',
    },
    {
      'id': 'KZ-8690',
      'service': 'Water Motor Overhaul',
      'job_amount': 8000,
      'commission_percent': 10,
      'commission_due': 800,
      'status': 'Pending',
      'status_color': AppColors.warning,
      'date': '11 Oct 2026',
    },
    {
      'id': 'KZ-8520',
      'service': 'AC Condenser Fan Replacement',
      'job_amount': 5000,
      'commission_percent': 10,
      'commission_due': 500,
      'status': 'Paid',
      'status_color': AppColors.success,
      'date': '05 Oct 2026',
    },
    {
      'id': 'KZ-8410',
      'service': 'Full Home Electrical Inspection',
      'job_amount': 12000,
      'commission_percent': 10,
      'commission_due': 1200,
      'status': 'Paid',
      'status_color': AppColors.success,
      'date': '01 Oct 2026',
    },
    {
      'id': 'KZ-8302',
      'service': 'Bathroom Mixer Tap Fixing',
      'job_amount': 1300,
      'commission_percent': 10,
      'commission_due': 130,
      'status': 'Paid',
      'status_color': AppColors.success,
      'date': '28 Sep 2026',
    },
  ];

  void _showPayCommissionSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _PayCommissionModal(
        amountDue: _commissionDue,
        onPaymentSubmitted: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              backgroundColor: AppColors.primaryGreen,
              content: Text('Payment proof submitted successfully! Verification takes 2-4 hours.'),
            ),
          );
        },
      ),
    );
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
          'Commission Management',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: AppColors.charcoal,
            fontSize: 17,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(bottom: 110),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Summary Cards
            _buildSummaryRow(),

            const SizedBox(height: 16),

            // Due Payment Action Card (if commission due > 0)
            if (_commissionDue > 0)
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: _buildDueAlertCard(),
              ),

            const SizedBox(height: 20),

            // Section Header
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Commission History & Logs',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: AppColors.charcoal,
                ),
              ),
            ),

            const SizedBox(height: 10),

            // Commission List
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _commissionList.length,
              separatorBuilder: (ctx, i) => const SizedBox(height: 12),
              itemBuilder: (ctx, i) {
                final item = _commissionList[i];
                return _buildCommissionCard(item);
              },
            ),
          ],
        ),
      ),
      bottomSheet: _commissionDue > 0 ? _buildStickyPayButton() : null,
    );
  }

  Widget _buildSummaryRow() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.white,
      child: Row(
        children: [
          Expanded(
            child: _buildMetricTile(
              label: 'Total Earned',
              value: 'Rs. ${_currencyFormatter.format(_totalEarned)}',
              icon: Icons.account_balance_wallet_outlined,
              color: AppColors.primaryGreen,
              bgColor: AppColors.lightGreenBg,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: _buildMetricTile(
              label: 'Commission Due',
              value: 'Rs. ${_currencyFormatter.format(_commissionDue)}',
              icon: Icons.pending_actions_outlined,
              color: AppColors.warning,
              bgColor: const Color(0xFFFFF3E0),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: _buildMetricTile(
              label: 'Paid to Date',
              value: 'Rs. ${_currencyFormatter.format(_commissionPaid)}',
              icon: Icons.check_circle_outline,
              color: AppColors.accentGreen,
              bgColor: AppColors.lightGreenBg,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile({
    required String label,
    required String value,
    required IconData icon,
    required Color color,
    required Color bgColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 13,
              color: color,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 10,
              fontWeight: FontWeight.w500,
              color: AppColors.charcoal,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildDueAlertCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8E1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFFFCC80)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: const BoxDecoration(
              color: Color(0xFFFFECB3),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.payment, color: Color(0xFFE65100), size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Pending Platform Commission',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: Color(0xFF5D4037),
                  ),
                ),
                Text(
                  'Pay Rs. ${_currencyFormatter.format(_commissionDue)} to keep receiving new job requests seamlessly.',
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    color: Color(0xFF795548),
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCommissionCard(Map<String, dynamic> item) {
    final isPaid = item['status'] == 'Paid';
    final Color badgeColor = isPaid ? AppColors.success : AppColors.warning;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Booking #${item['id']}',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: AppColors.gray,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: badgeColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  item['status'],
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                    color: badgeColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            item['service'],
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 14,
              color: AppColors.charcoal,
            ),
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Job Bill Amount',
                    style: TextStyle(fontFamily: 'Poppins', fontSize: 11, color: AppColors.gray),
                  ),
                  Text(
                    'Rs. ${_currencyFormatter.format(item['job_amount'])}',
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                      color: AppColors.charcoal,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Commission Rate',
                    style: TextStyle(fontFamily: 'Poppins', fontSize: 11, color: AppColors.gray),
                  ),
                  Text(
                    '${item['commission_percent']}%',
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                      color: AppColors.charcoal,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    'Commission Due',
                    style: TextStyle(fontFamily: 'Poppins', fontSize: 11, color: AppColors.gray),
                  ),
                  Text(
                    'Rs. ${_currencyFormatter.format(item['commission_due'])}',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: isPaid ? AppColors.charcoal : AppColors.error,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const Divider(height: 18, color: AppColors.divider),
          Text(
            'Date: ${item['date']}',
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 11,
              color: AppColors.gray,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStickyPayButton() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton.icon(
            onPressed: _showPayCommissionSheet,
            icon: const Icon(Icons.payment, size: 20),
            label: Text(
              'Pay Commission (Rs. ${_currencyFormatter.format(_commissionDue)})',
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.bold,
                fontSize: 15,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryGreen,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
          ),
        ),
      ),
    );
  }
}

// Bottom sheet modal for commission payment proof upload
class _PayCommissionModal extends StatefulWidget {
  final double amountDue;
  final VoidCallback onPaymentSubmitted;

  const _PayCommissionModal({
    required this.amountDue,
    required this.onPaymentSubmitted,
  });

  @override
  State<_PayCommissionModal> createState() => _PayCommissionModalState();
}

class _PayCommissionModalState extends State<_PayCommissionModal> {
  String _selectedMethod = 'JazzCash';
  final _tidController = TextEditingController();
  File? _screenshotFile;
  bool _isSubmitting = false;

  final ImagePicker _picker = ImagePicker();
  final NumberFormat _currencyFormatter = NumberFormat('#,##0', 'en_US');

  @override
  void dispose() {
    _tidController.dispose();
    super.dispose();
  }

  Future<void> _pickScreenshot() async {
    final picked = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 85,
    );
    if (picked != null) {
      setState(() {
        _screenshotFile = File(picked.path);
      });
    }
  }

  void _submitProof() async {
    if (_tidController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter the Transaction ID / Ref Number.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }
    if (_screenshotFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please upload a screenshot of your payment receipt.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(milliseconds: 900));

    if (!mounted) return;
    setState(() => _isSubmitting = false);
    Navigator.pop(context);
    widget.onPaymentSubmitted();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: EdgeInsets.only(
        top: 20,
        left: 20,
        right: 20,
        bottom: MediaQuery.of(context).viewInsets.bottom + 20,
      ),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 48,
                height: 5,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Pay Platform Commission',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                    color: AppColors.charcoal,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.lightGreenBg,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Total Amount Due:',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                      color: AppColors.charcoal,
                    ),
                  ),
                  Text(
                    'Rs. ${_currencyFormatter.format(widget.amountDue)}',
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: AppColors.primaryGreen,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Select Payment Method',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: AppColors.charcoal,
              ),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                _buildMethodChoice('JazzCash', 'JazzCash'),
                const SizedBox(width: 8),
                _buildMethodChoice('Easypaisa', 'Easypaisa'),
                const SizedBox(width: 8),
                _buildMethodChoice('Bank', 'Bank Transfer'),
              ],
            ),
            const SizedBox(height: 16),
            _buildAdminAccountDetails(),
            const SizedBox(height: 20),
            const Text(
              'Transaction ID / Reference Number *',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.w600,
                fontSize: 13,
                color: AppColors.charcoal,
              ),
            ),
            const SizedBox(height: 6),
            TextField(
              controller: _tidController,
              decoration: InputDecoration(
                hintText: 'e.g. 029384729184',
                hintStyle: const TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.gray),
                filled: true,
                fillColor: const Color(0xFFFAFAFA),
                prefixIcon: const Icon(Icons.receipt, color: AppColors.gray, size: 20),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.border),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: AppColors.primaryGreen, width: 2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Payment Screenshot Proof *',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.w600,
                fontSize: 13,
                color: AppColors.charcoal,
              ),
            ),
            const SizedBox(height: 6),
            InkWell(
              onTap: _pickScreenshot,
              borderRadius: BorderRadius.circular(12),
              child: Container(
                height: 100,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFFFAFAFA),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.border, style: BorderStyle.solid),
                ),
                child: _screenshotFile == null
                    ? const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.upload_file, color: AppColors.primaryGreen, size: 24),
                          SizedBox(width: 8),
                          Text(
                            'Upload Receipt / Screenshot',
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primaryGreen,
                            ),
                          ),
                        ],
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.check_circle, color: AppColors.success, size: 24),
                          const SizedBox(width: 8),
                          Text(
                            'Screenshot Attached (${_screenshotFile!.path.split(Platform.pathSeparator).last})',
                            style: const TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 12,
                              color: AppColors.charcoal,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitProof,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryGreen,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _isSubmitting
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        'Submit Payment Proof',
                        style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 15),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMethodChoice(String id, String label) {
    final isSelected = _selectedMethod == id;
    return Expanded(
      child: InkWell(
        onTap: () => setState(() => _selectedMethod = id),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.lightGreenBg : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? AppColors.primaryGreen : AppColors.border,
              width: isSelected ? 2 : 1,
            ),
          ),
          alignment: Alignment.center,
          child: Text(
            label,
            style: TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 12,
              color: isSelected ? AppColors.primaryGreen : AppColors.charcoal,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }

  Widget _buildAdminAccountDetails() {
    String title = '';
    String accountNum = '';
    String bankName = '';

    if (_selectedMethod == 'JazzCash') {
      title = 'KAMZO TECHNOLOGIES PVT LTD';
      accountNum = '0300-1122334';
      bankName = 'JazzCash Merchant Wallet';
    } else if (_selectedMethod == 'Easypaisa') {
      title = 'KAMZO TECHNOLOGIES';
      accountNum = '0345-9988776';
      bankName = 'Easypaisa Till / Merchant';
    } else {
      title = 'KAMZO TECHNOLOGIES PRIVATE LIMITED';
      accountNum = 'PK55MEZN0001234567890123';
      bankName = 'Meezan Bank Ltd (Clifton Branch)';
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF9F9F9),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                bankName,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: AppColors.charcoal,
                ),
              ),
              IconButton(
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                icon: const Icon(Icons.copy, size: 16, color: AppColors.primaryGreen),
                onPressed: () {
                  Clipboard.setData(ClipboardData(text: accountNum));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Account number copied to clipboard!')),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Account Title: $title',
            style: const TextStyle(fontFamily: 'Poppins', fontSize: 12, color: AppColors.gray),
          ),
          const SizedBox(height: 4),
          Row(
            children: [
              Text(
                'Number/IBAN: $accountNum',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: AppColors.charcoal,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
