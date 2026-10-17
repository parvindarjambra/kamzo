import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

class NotificationsScreen extends ConsumerStatefulWidget {
  const NotificationsScreen({super.key});

  @override
  ConsumerState<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends ConsumerState<NotificationsScreen> {
  // Mock list of notifications grouped by date
  List<Map<String, dynamic>> _notifications = [
    {
      'id': '1',
      'title': 'New Job Request #KZ-9042',
      'body': 'Bilal Ahmed requested emergency Plumber service in DHA Phase 5. Visit fee Rs. 500 is verified.',
      'type': 'booking',
      'time': '10 mins ago',
      'group': 'Today',
      'is_read': false,
      'route': '/worker/job-detail',
      'extra': 'KZ-9042',
    },
    {
      'id': '2',
      'title': 'Advance Visit Fee Confirmed',
      'body': 'Customer Tariq Mehmood paid Rs. 500 advance visit fee for AC Repair #KZ-8821.',
      'type': 'payment',
      'time': '2 hours ago',
      'group': 'Today',
      'is_read': false,
      'route': '/worker/job-detail',
      'extra': 'KZ-8821',
    },
    {
      'id': '3',
      'title': 'New Message from Customer',
      'body': 'Tariq Mehmood: "Here is the photo of the AC outdoor unit and refrigerant valve."',
      'type': 'message',
      'time': '3 hours ago',
      'group': 'Today',
      'is_read': false,
      'route': '/chat',
      'extra': {'booking_id': 'KZ-8821', 'other_name': 'Tariq Mehmood'},
    },
    {
      'id': '4',
      'title': 'Cash Bonus Unlocked! 🎉',
      'body': 'Bronze Tier completed! You earned Rs. 500 cash reward for completing 10 jobs this month.',
      'type': 'bonus',
      'time': 'Yesterday, 6:00 PM',
      'group': 'Yesterday',
      'is_read': true,
      'route': '/worker/bonuses',
    },
    {
      'id': '5',
      'title': 'Level Up: Level 3 Trusted Partner 🛡️',
      'body': 'Congratulations! You completed 30 jobs with a 4.8 rating and unlocked priority dispatch queue.',
      'type': 'level',
      'time': '2 days ago',
      'group': 'Earlier',
      'is_read': true,
      'route': '/worker/levels',
    },
    {
      'id': '6',
      'title': 'Commission Verification Approved',
      'body': 'Your JazzCash commission payment of Rs. 1,200 for Booking #KZ-8410 has been approved.',
      'type': 'payment',
      'time': '5 days ago',
      'group': 'Earlier',
      'is_read': true,
      'route': '/worker/commission',
    },
  ];

  void _markAllAsRead() {
    setState(() {
      for (var n in _notifications) {
        n['is_read'] = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        backgroundColor: AppColors.primaryGreen,
        content: Text('All notifications marked as read.'),
        duration: Duration(seconds: 1),
      ),
    );
  }

  void _clearAllNotifications() {
    setState(() {
      _notifications.clear();
    });
  }

  IconData _getIconForType(String type) {
    switch (type) {
      case 'booking':
        return Icons.work_outline;
      case 'payment':
        return Icons.payments_outlined;
      case 'message':
        return Icons.chat_bubble_outline;
      case 'level':
        return Icons.military_tech_outlined;
      case 'bonus':
        return Icons.card_giftcard_outlined;
      default:
        return Icons.notifications_none;
    }
  }

  Color _getColorForType(String type) {
    switch (type) {
      case 'booking':
        return AppColors.primaryGreen;
      case 'payment':
        return AppColors.accentGreen;
      case 'message':
        return AppColors.info;
      case 'level':
        return const Color(0xFF7B1FA2);
      case 'bonus':
        return const Color(0xFFF57F17);
      default:
        return AppColors.primaryGreen;
    }
  }

  @override
  Widget build(BuildContext context) {
    final hasUnread = _notifications.any((n) => n['is_read'] == false);

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.charcoal, size: 20),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Notifications',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: AppColors.charcoal,
            fontSize: 18,
          ),
        ),
        actions: [
          if (hasUnread)
            TextButton(
              onPressed: _markAllAsRead,
              child: const Text(
                'Mark all read',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                  color: AppColors.primaryGreen,
                ),
              ),
            ),
          if (_notifications.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.delete_sweep_outlined, color: AppColors.gray),
              tooltip: 'Clear All',
              onPressed: _clearAllNotifications,
            ),
        ],
      ),
      body: _notifications.isEmpty ? _buildEmptyState() : _buildGroupedList(),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(22),
              decoration: const BoxDecoration(
                color: AppColors.lightGreenBg,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.notifications_off_outlined, size: 52, color: AppColors.primaryGreen),
            ),
            const SizedBox(height: 18),
            const Text(
              'No Notifications',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: AppColors.charcoal,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'You\'re completely caught up! We will alert you when you receive new jobs, customer messages, or cash bonuses.',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 13,
                color: AppColors.gray,
                height: 1.4,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGroupedList() {
    // Group items by 'Today', 'Yesterday', 'Earlier'
    final groups = ['Today', 'Yesterday', 'Earlier'];

    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 12),
      itemCount: groups.length,
      itemBuilder: (ctx, gIndex) {
        final groupName = groups[gIndex];
        final groupItems = _notifications.where((n) => n['group'] == groupName).toList();

        if (groupItems.isEmpty) return const SizedBox.shrink();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                groupName,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: AppColors.gray,
                  letterSpacing: 0.5,
                ),
              ),
            ),
            ...groupItems.map((item) => _buildNotificationTile(item)),
          ],
        );
      },
    );
  }

  Widget _buildNotificationTile(Map<String, dynamic> item) {
    final isRead = item['is_read'] as bool;
    final typeColor = _getColorForType(item['type'] as String);
    final icon = _getIconForType(item['type'] as String);

    return InkWell(
      onTap: () {
        setState(() {
          item['is_read'] = true;
        });
        if (item['route'] != null) {
          if (item['extra'] != null) {
            context.push(item['route'], extra: item['extra']);
          } else {
            context.push(item['route']);
          }
        }
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: isRead ? Colors.white : AppColors.lightGreenBg.withOpacity(0.35),
          border: const Border(bottom: BorderSide(color: AppColors.divider, width: 0.8)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon Container
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: typeColor.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: typeColor, size: 22),
            ),
            const SizedBox(width: 14),
            // Title & Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          item['title'] as String,
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontWeight: isRead ? FontWeight.w600 : FontWeight.bold,
                            fontSize: 14,
                            color: AppColors.charcoal,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      Text(
                        item['time'] as String,
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 11,
                          color: AppColors.gray,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item['body'] as String,
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      color: isRead ? AppColors.gray : AppColors.charcoal.withOpacity(0.9),
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
            if (!isRead) ...[
              const SizedBox(width: 8),
              Container(
                margin: const EdgeInsets.only(top: 6),
                width: 9,
                height: 9,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.primaryGreen,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
