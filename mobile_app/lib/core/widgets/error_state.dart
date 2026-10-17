import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Error state widget displayed when network requests or data queries fail.
class ErrorStateWidget extends StatelessWidget {
  final IconData icon;
  final String message;
  final String? title;
  final VoidCallback? onRetry;
  final String retryText;

  const ErrorStateWidget({
    super.key,
    this.icon = Icons.error_outline_rounded,
    required this.message,
    this.title = 'Something went wrong',
    this.onRetry,
    this.retryText = 'Try Again',
  });

  /// Factory constructor for network connectivity issues
  factory ErrorStateWidget.network({
    Key? key,
    String message = 'Unable to connect to the server. Please check your internet connection.',
    VoidCallback? onRetry,
  }) {
    return ErrorStateWidget(
      key: key,
      icon: Icons.wifi_off_rounded,
      title: 'Connection Error',
      message: message,
      onRetry: onRetry,
      retryText: 'Retry Connection',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        const EdgeInsets.symmetric(horizontal: 32.0, vertical: 24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: AppColors.error,
                size: 40,
              ),
            ),
            const SizedBox(height: 20),
            if (title != null) ...[
              Text(
                title!,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppColors.charcoal,
                ),
              ),
              const SizedBox(height: 8),
            ],
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.gray,
                height: 1.4,
              ),
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh, size: 18),
                label: Text(
                  retryText,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryGreen,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
