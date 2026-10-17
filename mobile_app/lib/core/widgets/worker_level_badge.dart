import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

/// Worker tier badge chip (Level 1: New, Level 2: Active, Level 3: Trusted, Level 4: Expert).
class WorkerLevelBadge extends StatelessWidget {
  final int level;
  final bool showLabel;
  final double fontSize;
  final EdgeInsetsGeometry padding;

  const WorkerLevelBadge({
    super.key,
    required this.level,
    this.showLabel = true,
    this.fontSize = 11.0,
    this.padding = const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
  });

  /// Factory constructor to support string representations ('1', '2', 'bronze', etc.)
  factory WorkerLevelBadge.fromString({
    Key? key,
    required String? levelString,
    bool showLabel = true,
    double fontSize = 11.0,
    EdgeInsetsGeometry padding = const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
  }) {
    int lvl = 1;
    if (levelString != null) {
      switch (levelString.toLowerCase()) {
        case '1':
        case 'bronze':
        case 'new':
          lvl = 1;
          break;
        case '2':
        case 'silver':
        case 'active':
          lvl = 2;
          break;
        case '3':
        case 'gold':
        case 'trusted':
          lvl = 3;
          break;
        case '4':
        case 'platinum':
        case 'expert':
          lvl = 4;
          break;
        default:
          lvl = int.tryParse(levelString) ?? 1;
      }
    }
    return WorkerLevelBadge(
      key: key,
      level: lvl,
      showLabel: showLabel,
      fontSize: fontSize,
      padding: padding,
    );
  }

  Color _getLevelColor(int lvl) {
    switch (lvl) {
      case 1:
        return AppColors.level1Gray; // Gray
      case 2:
        return AppColors.level2Blue; // Blue
      case 3:
        return AppColors.level3Green; // Pakistan Green
      case 4:
        return AppColors.level4Gold; // Amber/Gold
      default:
        return AppColors.level1Gray;
    }
  }

  String _getLevelLabel(int lvl) {
    switch (lvl) {
      case 1:
        return 'New';
      case 2:
        return 'Active';
      case 3:
        return 'Trusted';
      case 4:
        return 'Expert';
      default:
        return 'Level $lvl';
    }
  }

  IconData _getLevelIcon(int lvl) {
    switch (lvl) {
      case 1:
        return Icons.shield_outlined;
      case 2:
        return Icons.verified_user_outlined;
      case 3:
        return Icons.verified;
      case 4:
        return Icons.workspace_premium;
      default:
        return Icons.star;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getLevelColor(level);
    final label = _getLevelLabel(level);
    final icon = _getLevelIcon(level);

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withValues(alpha: 0.4),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: fontSize + 2,
            color: color,
          ),
          if (showLabel) ...[
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(
                color: color,
                fontSize: fontSize,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.2,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
