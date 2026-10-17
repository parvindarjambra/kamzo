import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/theme/app_colors.dart';
import '../models/booking_request_model.dart';
import 'booking_tracking_screen.dart';

/// Screen 9: Payment Screen
/// Enables payment of the Rs. 200 advance visit fee through JazzCash, Easypaisa,
/// or Bank Transfer with copy-to-clipboard, transaction ID input, and receipt screenshot upload.
class PaymentScreen extends ConsumerStatefulWidget {
  final CustomerBooking? booking;

  const PaymentScreen({
    super.key,
    this.booking,
  });

  @override
  ConsumerState<PaymentScreen> createState() => _PaymentScreenState();
}

enum PaymentMethod { jazzCash, easypaisa, bankTransfer }

class _PaymentScreenState extends ConsumerState<PaymentScreen> {
  PaymentMethod _selectedMethod = PaymentMethod.jazzCash;
  final TextEditingController _tidController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  XFile? _selectedImage;
  bool _isSubmitting = false;

  // Pakistani Payment Account Details
  final Map<PaymentMethod, Map<String, String>> _accountDetails = {
    PaymentMethod.jazzCash: {
      'title': 'KAMZO SERVICES (PVT) LTD',
      'accountNumber': '0301 2345678',
      'type': 'JazzCash Mobile Account / Till',
      'note': 'Send Rs. 200 to this JazzCash number via JazzCash app or *786#',
    },
    PaymentMethod.easypaisa: {
      'title': 'KAMZO SERVICES (PVT) LTD',
      'accountNumber': '0345 9876543',
      'type': 'Easypaisa Mobile Wallet',
      'note': 'Send Rs. 200 to this Easypaisa account via Easypaisa app',
    },
    PaymentMethod.bankTransfer: {
      'bankName': 'Meezan Bank Limited',
      'title': 'KAMZO SERVICES (PRIVATE) LIMITED',
      'accountNumber': '0102 0304 0506 07',
      'iban': 'PK36MEZN0001234567890123',
      'branch': 'Gulberg Branch, Lahore',
      'note': 'Transfer Rs. 200 via 1Link, Raast, or your online banking app',
    },
  };

  @override
  void dispose() {
    _tidController.dispose();
    super.dispose();
  }

  void _copyToClipboard(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '$label copied to clipboard!',
          style: const TextStyle(fontFamily: 'Poppins'),
        ),
        backgroundColor: AppColors.primary,
        duration: const Duration(seconds: 2),
      ),
    );
  }

  Future<void> _pickScreenshot(ImageSource source) async {
    try {
      final picked = await _picker.pickImage(
        source: source,
        maxWidth: 1200,
        maxHeight: 1200,
        imageQuality: 85,
      );
      if (picked != null) {
        setState(() {
          _selectedImage = picked;
        });
      }
    } catch (e) {
      debugPrint('Image picking error: $e');
    }
  }

  void _showImagePickerModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Upload Payment Proof Screenshot',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: AppColors.charcoal,
                ),
              ),
              const SizedBox(height: 16),
              ListTile(
                leading: const Icon(Icons.photo_library_rounded, color: AppColors.primary),
                title: const Text('Choose from Gallery', style: TextStyle(fontFamily: 'Poppins')),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickScreenshot(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt_rounded, color: AppColors.primary),
                title: const Text('Take Photo', style: TextStyle(fontFamily: 'Poppins')),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickScreenshot(ImageSource.camera);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _onSubmitPayment() async {
    final tid = _tidController.text.trim();
    if (tid.isEmpty && _selectedImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Please provide either Transaction Reference ID or upload Screenshot.',
            style: TextStyle(fontFamily: 'Poppins'),
          ),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    // Simulate backend verification request submission
    await Future.delayed(const Duration(milliseconds: 1000));

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    final updatedBooking = (widget.booking ??
            CustomerBooking(
              id: 'bk_demo',
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
              problemDescription: 'Power trip & sparking',
              address: 'Gulberg III, Lahore',
              city: 'Lahore',
              scheduledAt: DateTime.now(),
              createdAt: DateTime.now(),
            ))
        .copyWith(
      paymentMethod: _selectedMethod.name,
      paymentTransactionId: tid.isNotEmpty ? tid : 'SCREENSHOT_UPLOADED',
      status: 'payment_verified',
      workerName: 'Muhammad Tariq',
      workerPhone: '+923001234567',
      workerRating: 4.9,
      workerTotalJobs: 142,
    );

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (ctx) => BookingTrackingScreen(booking: updatedBooking),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentDetails = _accountDetails[_selectedMethod]!;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0.5,
        title: const Text(
          'Pay Visit Fee',
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
              // Amount Header Banner
              _buildAmountHeaderCard(),
              const SizedBox(height: 20),

              // Payment Method Selection Tabs
              _buildMethodTabs(),
              const SizedBox(height: 18),

              // Account Details Card
              _buildAccountDetailsCard(currentDetails),
              const SizedBox(height: 20),

              // Transaction Reference ID Input
              _buildTransactionInput(),
              const SizedBox(height: 20),

              // Upload Payment Screenshot
              _buildScreenshotUploadArea(),
              const SizedBox(height: 20),

              // Important Note Banner
              _buildVerificationNotice(),
              const SizedBox(height: 28),

              // Submit Payment Button
              SizedBox(
                height: AppColors.buttonHeight,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _onSubmitPayment,
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
                  child: _isSubmitting
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(AppColors.white),
                          ),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.lock_rounded, size: 18),
                            SizedBox(width: 8),
                            Text(
                              'Submit Payment Proof',
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAmountHeaderCard() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 20),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 10,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        children: [
          const Text(
            'Technician Dispatch & Visit Fee',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppColors.gray,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Rs. 200',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 36,
              fontWeight: FontWeight.w900,
              color: AppColors.primary,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.lightGreen,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'Advance Required for Verification',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.primary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMethodTabs() {
    return Row(
      children: [
        _buildMethodTabItem(
          label: 'JazzCash',
          iconText: 'JC',
          method: PaymentMethod.jazzCash,
          accentColor: AppColors.jazzCashRed,
        ),
        const SizedBox(width: 8),
        _buildMethodTabItem(
          label: 'Easypaisa',
          iconText: 'EP',
          method: PaymentMethod.easypaisa,
          accentColor: AppColors.easypaisaGreen,
        ),
        const SizedBox(width: 8),
        _buildMethodTabItem(
          label: 'Bank Transfer',
          iconText: 'IBAN',
          method: PaymentMethod.bankTransfer,
          accentColor: AppColors.primary,
        ),
      ],
    );
  }

  Widget _buildMethodTabItem({
    required String label,
    required String iconText,
    required PaymentMethod method,
    required Color accentColor,
  }) {
    final isSelected = _selectedMethod == method;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() => _selectedMethod = method);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.white : AppColors.background,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? accentColor : AppColors.border,
              width: isSelected ? 2 : 1,
            ),
            boxShadow: isSelected
                ? [
                    BoxShadow(
                      color: accentColor.withOpacity(0.12),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ]
                : null,
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: isSelected ? accentColor.withOpacity(0.1) : AppColors.border.withOpacity(0.4),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  iconText,
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: isSelected ? accentColor : AppColors.gray,
                  ),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                label,
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 11.5,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                  color: isSelected ? AppColors.charcoal : AppColors.gray,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAccountDetailsCard(Map<String, String> details) {
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
                'Transfer Instructions',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 13.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.charcoal,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.lightGreen,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'Verified Business',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            details['note'] ?? 'Transfer Rs. 200 to above account',
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 11.5,
              color: AppColors.gray,
            ),
          ),
          const Divider(height: 24, color: AppColors.border),

          // Bank name if applicable
          if (details.containsKey('bankName')) ...[
            _buildDetailRow(
              title: 'Bank Name',
              value: details['bankName']!,
              showCopy: false,
            ),
            const SizedBox(height: 10),
          ],

          // Account Title
          _buildDetailRow(
            title: 'Account Title',
            value: details['title']!,
            showCopy: true,
          ),
          const SizedBox(height: 10),

          // Account Number
          _buildDetailRow(
            title: 'Account Number',
            value: details['accountNumber']!,
            showCopy: true,
            isHighlight: true,
          ),

          // IBAN if Bank Transfer
          if (details.containsKey('iban')) ...[
            const SizedBox(height: 10),
            _buildDetailRow(
              title: 'IBAN (Raast / 1Link)',
              value: details['iban']!,
              showCopy: true,
              isHighlight: true,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDetailRow({
    required String title,
    required String value,
    required bool showCopy,
    bool isHighlight = false,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 4,
          child: Text(
            title,
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: AppColors.gray,
            ),
          ),
        ),
        Expanded(
          flex: 6,
          child: Row(
            children: [
              Expanded(
                child: Text(
                  value,
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12.5,
                    fontWeight: isHighlight ? FontWeight.w700 : FontWeight.w600,
                    color: isHighlight ? AppColors.primary : AppColors.charcoal,
                  ),
                ),
              ),
              if (showCopy)
                InkWell(
                  onTap: () => _copyToClipboard(value.replaceAll(' ', ''), title),
                  child: const Padding(
                    padding: EdgeInsets.only(left: 6),
                    child: Icon(
                      Icons.copy_rounded,
                      size: 16,
                      color: AppColors.accent,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTransactionInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Transaction Reference / TID (ٹرانزیکشن نمبر)',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.charcoal,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _tidController,
          keyboardType: TextInputType.text,
          style: const TextStyle(
            fontFamily: 'Poppins',
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.charcoal,
          ),
          decoration: InputDecoration(
            hintText: 'e.g. 12-digit TID from SMS or App',
            hintStyle: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 13,
              color: AppColors.grayLight,
            ),
            prefixIcon: const Icon(Icons.tag_rounded, color: AppColors.accent),
            filled: true,
            fillColor: AppColors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
              borderSide: const BorderSide(color: AppColors.primary, width: 1.8),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildScreenshotUploadArea() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Upload Payment Screenshot (رسید)',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.charcoal,
          ),
        ),
        const SizedBox(height: 6),
        if (_selectedImage == null) ...[
          InkWell(
            onTap: _showImagePickerModal,
            borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 24),
              decoration: BoxDecoration(
                color: AppColors.white,
                borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
                border: Border.all(
                  color: AppColors.accent.withOpacity(0.6),
                  style: BorderStyle.solid,
                ),
              ),
              child: Column(
                children: const [
                  Icon(
                    Icons.cloud_upload_outlined,
                    size: 38,
                    color: AppColors.primary,
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Upload Payment Screenshot',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 13.5,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'JPG, PNG from banking/wallet app',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 11,
                      color: AppColors.gray,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ] else ...[
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.file(
                    File(_selectedImage!.path),
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Screenshot Attached',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.charcoal,
                        ),
                      ),
                      Text(
                        _selectedImage!.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 11,
                          color: AppColors.gray,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline_rounded, color: AppColors.error),
                  onPressed: () {
                    setState(() => _selectedImage = null);
                  },
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildVerificationNotice() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.lightGreen.withOpacity(0.6),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.greenTint),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Icon(Icons.timer_outlined, color: AppColors.primary, size: 20),
          SizedBox(width: 10),
          Expanded(
            child: Text(
              'Payment verified by KAMZO admin within minutes. Your assigned expert will be notified immediately.',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: AppColors.primaryDark,
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
