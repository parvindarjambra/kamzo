import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../utils/formatters.dart';

/// Status badge widget displaying colorful pill tags for booking statuses.
class BookingStatusBadge extends StatelessWidget {
  final String status;
  final double fontSize;
  final EdgeInsetsGeometry padding;

  const BookingStatusBadge({
    super.key,
    required this.status,
    this.fontSize = 12.0,
    this.padding = const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
  });

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'requested':
      case 'pending':
        return Colors.grey.shade700;
      case 'payment_pending':
        return Colors.orange.shade800;
      case 'payment_verified':
      case 'accepted':
      case 'worker_assigned':
        return const Color(0xFF1976D2); // Blue
      case 'on_the_way':
        return const Color(0xFF00796B); // Teal
      case 'arrived':
        return const Color(0xFF6A1B9A); // Purple
      case 'in_progress':
        return const Color(0xFFF57F17); // Amber/Yellow-dark
      case 'awaiting_confirmation':
        return const Color(0xFFE65100); // Deep Orange
      case 'completed':
        return AppColors.primaryGreen; // Pakistan Green
      case 'cancelled':
        return const Color(0xFFD32F2F); // Red
      case 'disputed':
        return const Color(0xFFC2185B); // Dark Ruby/Red
      case 'rejected':
        return const Color(0xFFB71C1C); // Crimson
      default:
        return AppColors.gray;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getStatusColor(status);
    final text = Formatters.formatBookingStatus(status);

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: color.withValues(alpha: 0.35),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 7,
            height: 7,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            text,
            style: TextStyle(
              color: color,
              fontSize: fontSize,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
