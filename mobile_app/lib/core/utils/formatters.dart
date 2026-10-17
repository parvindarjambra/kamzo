import 'package:intl/intl.dart';
import '../constants/app_constants.dart';

/// Formatting utilities for currency, dates, times, booking status, and payment methods.
class Formatters {
  Formatters._();

  /// Formats numeric amounts to Pakistani Rupee representation, e.g. "Rs. 1,200" or "Rs. 1,250.50".
  static String formatCurrency(num? amount) {
    if (amount == null) return '${AppConstants.currencySymbol} 0';

    final formatter = NumberFormat('#,##0.##', 'en_US');
    return '${AppConstants.currencySymbol} ${formatter.format(amount)}';
  }

  /// Formats date to "14 Oct 2024" format.
  static String formatDate(DateTime? dateTime) {
    if (dateTime == null) return '';
    return DateFormat('d MMM yyyy').format(dateTime);
  }

  /// Formats time to "2:30 PM" format.
  static String formatTime(DateTime? dateTime) {
    if (dateTime == null) return '';
    return DateFormat('h:mm a').format(dateTime);
  }

  /// Formats date and time to "14 Oct 2024, 2:30 PM" format.
  static String formatDateTime(DateTime? dateTime) {
    if (dateTime == null) return '';
    return DateFormat('d MMM yyyy, h:mm a').format(dateTime);
  }

  /// Converts booking status key to human readable format.
  /// Supports: requested, pending, payment_pending, payment_verified, accepted,
  /// on_the_way, arrived, in_progress, awaiting_confirmation, completed, cancelled, disputed, rejected.
  static String formatBookingStatus(String? status) {
    if (status == null || status.isEmpty) return 'Unknown';

    switch (status.toLowerCase()) {
      case 'requested':
        return 'Requested';
      case 'pending':
        return 'Pending Approval';
      case 'payment_pending':
        return 'Payment Pending';
      case 'payment_verified':
        return 'Payment Verified';
      case 'accepted':
        return 'Accepted';
      case 'worker_assigned':
        return 'Worker Assigned';
      case 'on_the_way':
        return 'On the Way';
      case 'arrived':
        return 'Arrived';
      case 'in_progress':
        return 'In Progress';
      case 'awaiting_confirmation':
        return 'Awaiting Confirmation';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'disputed':
        return 'Disputed';
      case 'rejected':
        return 'Rejected';
      default:
        // Format snake_case to Title Case
        return status
            .split('_')
            .map((word) => word.isNotEmpty
                ? '${word[0].toUpperCase()}${word.substring(1).toLowerCase()}'
                : '')
            .join(' ');
    }
  }

  /// Converts payment method code to human-friendly display label.
  static String formatPaymentMethod(String? method) {
    if (method == null || method.isEmpty) return 'Cash on Delivery';

    switch (method.toLowerCase()) {
      case 'cash':
      case 'cod':
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      case 'jazzcash':
      case 'jazz_cash':
        return 'JazzCash';
      case 'easypaisa':
      case 'easy_paisa':
        return 'Easypaisa';
      case 'bank_transfer':
      case 'bank':
      case '1link':
        return 'Bank Transfer';
      case 'wallet':
        return 'KAMZO Wallet';
      case 'card':
      case 'debit_card':
      case 'credit_card':
        return 'Debit / Credit Card';
      default:
        return method
            .split('_')
            .map((word) => word.isNotEmpty
                ? '${word[0].toUpperCase()}${word.substring(1).toLowerCase()}'
                : '')
            .join(' ');
    }
  }

  /// Formats CNIC with hyphens: XXXXX-XXXXXXX-X
  static String formatCNIC(String? cnic) {
    if (cnic == null || cnic.isEmpty) return '';
    final digits = cnic.replaceAll(RegExp(r'\D'), '');
    if (digits.length != 13) return cnic;
    return '${digits.substring(0, 5)}-${digits.substring(5, 12)}-${digits.substring(12, 13)}';
  }

  /// Formats phone number into standard Pakistani format: +92 3XX XXXXXXX
  static String formatPhone(String? phone) {
    if (phone == null || phone.isEmpty) return '';
    var digits = phone.replaceAll(RegExp(r'\D'), '');
    if (digits.startsWith('92')) {
      digits = digits.substring(2);
    } else if (digits.startsWith('0')) {
      digits = digits.substring(1);
    }
    if (digits.length == 10) {
      return '+92 ${digits.substring(0, 3)} ${digits.substring(3)}';
    }
    return phone;
  }
}
