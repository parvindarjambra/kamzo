import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Service selection card widget.
/// Styled with a white card container, Pakistan green circular icon badge, subtle elevation,
/// and rounded corners (16px).
class ServiceCard extends StatelessWidget {
  /// Icon representation: can be an [IconData], an emoji [String], an image URL [String], or a custom [Widget].
  final dynamic icon;
  final String serviceName;
  final String? description;
  final VoidCallback? onTap;
  final String? priceText;
  final bool isSelected;

  const ServiceCard({
    super.key,
    required this.icon,
    required this.serviceName,
    this.description,
    this.onTap,
    this.priceText,
    this.isSelected = false,
  });

  Widget _buildIcon() {
    if (icon is IconData) {
      return Icon(icon as IconData, color: AppColors.primaryGreen, size: 26);
    }

    if (icon is String) {
      final str = icon as String;
      if (str.startsWith('http://') || str.startsWith('https://')) {
        return ClipOval(
          child: CachedNetworkImage(
            imageUrl: str,
            width: 32,
            height: 32,
            fit: BoxFit.cover,
            placeholder: (_, __) => const SizedBox(
              width: 18,
              height: 18,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: AppColors.primaryGreen,
              ),
            ),
            errorWidget: (_, __, ___) => const Icon(
              Icons.handyman_outlined,
              color: AppColors.primaryGreen,
              size: 26,
            ),
          ),
        );
      }

      // Plain string or emoji
      return Text(
        str,
        style: const TextStyle(fontSize: 24),
      );
    }

    if (icon is Widget) {
      return icon as Widget;
    }

    return const Icon(
      Icons.home_repair_service,
      color: AppColors.primaryGreen,
      size: 26,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.cardBackground,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected
                  ? AppColors.primaryGreen
                  : AppColors.border.withValues(alpha: 0.7),
              width: isSelected ? 2 : 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Green Circular Icon Container
              Container(
                width: 54,
                height: 54,
                decoration: BoxDecoration(
                  color: AppColors.lightGreenBg,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.primaryGreen.withValues(alpha: 0.15),
                    width: 1,
                  ),
                ),
                alignment: Alignment.center,
                child: _buildIcon(),
              ),
              const SizedBox(width: 16),

              // Title and Description
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      serviceName,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.charcoal,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (description != null && description!.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        description!,
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.gray,
                          height: 1.25,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                    if (priceText != null && priceText!.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Text(
                        priceText!,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.primaryGreen,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(width: 8),

              // Trailing arrow
              const Icon(
                Icons.chevron_right,
                color: AppColors.subtleGray,
                size: 22,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
