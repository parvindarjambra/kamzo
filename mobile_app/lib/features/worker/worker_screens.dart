import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_constants.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/supabase_client.dart';

// ==========================================
// 1. WORKER HOME SCREEN
// ==========================================
class WorkerHomeScreen extends ConsumerStatefulWidget {
  const WorkerHomeScreen({super.key});

  @override
  ConsumerState<WorkerHomeScreen> createState() => _WorkerHomeScreenState();
}

class _WorkerHomeScreenState extends ConsumerState<WorkerHomeScreen> {
  bool _isOnline = true;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.profile;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('KAMZO Partner', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            Text(
              user?.fullName ?? 'Service Specialist',
              style: const TextStyle(fontSize: 12, color: AppColors.gray),
            ),
          ],
        ),
        actions: [
          Row(
            children: [
              Text(
                _isOnline ? 'ONLINE' : 'OFFLINE',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: _isOnline ? AppColors.success : AppColors.gray,
                ),
              ),
              Switch(
                value: _isOnline,
                activeColor: AppColors.primary,
                onChanged: (val) {
                  setState(() => _isOnline = val);
                },
              ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: _isOnline
                      ? [AppColors.primary, AppColors.secondary]
                      : [AppColors.grayDark, AppColors.gray],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text('Today\'s Earnings', style: TextStyle(color: Colors.white70, fontSize: 13)),
                          SizedBox(height: 4),
                          Text(
                            'Rs. 4,500',
                            style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Silver Tier',
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                  const Divider(color: Colors.white24, height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: const [
                      _WorkerMetric(label: 'Jobs Today', value: '3'),
                      _WorkerMetric(label: 'Rating', value: '4.9 ★'),
                      _WorkerMetric(label: 'Acceptance', value: '96%'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Quick Actions
            Row(
              children: [
                Expanded(
                  child: _DashboardQuickTile(
                    title: 'Available Jobs',
                    count: '5 New',
                    icon: Icons.work_outline,
                    color: AppColors.primary,
                    onTap: () => context.go('/worker/jobs'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _DashboardQuickTile(
                    title: 'Commissions',
                    count: 'Rs. 450 Due',
                    icon: Icons.account_balance_wallet_outlined,
                    color: AppColors.secondary,
                    onTap: () => context.go('/worker/commission'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _DashboardQuickTile(
                    title: 'Tier Level',
                    count: 'Silver Pro',
                    icon: Icons.military_tech_outlined,
                    color: AppColors.accentGold,
                    onTap: () => context.go('/worker/levels'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _DashboardQuickTile(
                    title: 'Weekly Bonus',
                    count: '+Rs. 1,000',
                    icon: Icons.card_giftcard_outlined,
                    color: Colors.deepOrange,
                    onTap: () => context.go('/worker/bonuses'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Live incoming request
            const Text(
              'Nearest Job Alert',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.charcoal),
            ),
            const SizedBox(height: 12),
            Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('AC Master Deep Clean', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Text('Rs. 2,200', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 16)),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: const [
                        Icon(Icons.location_on, size: 16, color: AppColors.gray),
                        SizedBox(width: 4),
                        Text('Gulberg III, Lahore • 2.4 km away', style: TextStyle(color: AppColors.grayDark, fontSize: 13)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {},
                            child: const Text('Decline'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () => context.go('/worker/job/booking-pk-502'),
                            child: const Text('Accept Job'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        onTap: (i) {
          if (i == 0) context.go('/worker/home');
          if (i == 1) context.go('/worker/jobs');
          if (i == 2) context.go('/worker/profile');
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), activeIcon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.format_list_bulleted), activeIcon: Icon(Icons.list_alt), label: 'Jobs'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Partner Profile'),
        ],
      ),
    );
  }
}

class _WorkerMetric extends StatelessWidget {
  final String label;
  final String value;

  const _WorkerMetric({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11)),
      ],
    );
  }
}

class _DashboardQuickTile extends StatelessWidget {
  final String title;
  final String count;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _DashboardQuickTile({
    required this.title,
    required this.count,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(height: 12),
            Text(title, style: const TextStyle(fontSize: 13, color: AppColors.grayDark, fontWeight: FontWeight.w500)),
            const SizedBox(height: 4),
            Text(count, style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: color)),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 2. WORKER JOBS SCREEN
// ==========================================
class WorkerJobsScreen extends StatelessWidget {
  const WorkerJobsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final jobs = [
      {
        'id': 'booking-pk-502',
        'title': 'Ceiling Fan & Switch Replacement',
        'customer': 'Zahid Ahmed',
        'location': 'DHA Phase 5, Lahore',
        'distance': '1.8 km',
        'amount': 'Rs. 1,400',
      },
      {
        'id': 'booking-pk-503',
        'title': 'Kitchen Pipeline Leakage Fix',
        'customer': 'Mariam Farooq',
        'location': 'Johar Town, Lahore',
        'distance': '3.2 km',
        'amount': 'Rs. 2,000',
      },
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Available Service Jobs')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: jobs.length,
        itemBuilder: (context, i) {
          final j = jobs[i];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(j['title']!, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ),
                      Text(
                        j['amount']!,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primary),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text('Customer: ${j['customer']}'),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 16, color: AppColors.gray),
                      const SizedBox(width: 4),
                      Text('${j['location']} (${j['distance']})', style: const TextStyle(color: AppColors.gray)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.go('/worker/job/${j['id']}'),
                    child: const Text('Review & Accept'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

// ==========================================
// 3. WORKER JOB DETAIL SCREEN
// ==========================================
class WorkerJobDetailScreen extends StatelessWidget {
  final String bookingId;

  const WorkerJobDetailScreen({super.key, required this.bookingId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: Text('Job Detail #$bookingId')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.lightGreen,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: const [
                  Icon(Icons.navigation, color: AppColors.primary, size: 30),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Navigate to customer address. Press "I Have Arrived" upon reaching the premises.',
                      style: TextStyle(color: AppColors.primaryDark, fontSize: 13),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('Customer Contact', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Card(
              margin: EdgeInsets.zero,
              child: ListTile(
                leading: const CircleAvatar(
                  backgroundColor: AppColors.primary,
                  child: Icon(Icons.person, color: Colors.white),
                ),
                title: const Text('Customer in Lahore'),
                subtitle: const Text('Sector Y, Phase 3, DHA'),
                trailing: IconButton(
                  icon: const Icon(Icons.chat_bubble_outline, color: AppColors.primary),
                  onPressed: () => context.go('/worker/job/$bookingId/chat'),
                ),
              ),
            ),
            const SizedBox(height: 24),

            const Text('Job Financials', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: const [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [Text('Customer Total'), Text('Rs. 2,000', style: TextStyle(fontWeight: FontWeight.bold))],
                  ),
                  SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [Text('Platform Commission (10%)'), Text('- Rs. 200', style: TextStyle(color: AppColors.error))],
                  ),
                  Divider(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Your Net Earnings', style: TextStyle(fontWeight: FontWeight.bold)),
                      Text('Rs. 1,800', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary, fontSize: 16)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Status updated: On the way!')),
                );
              },
              child: const Text('Update Status: On The Way'),
            ),
            const SizedBox(height: 12),
            OutlinedButton(
              onPressed: () => context.go('/worker/job/$bookingId/chat'),
              child: const Text('Message Customer'),
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 4. WORKER CHAT SCREEN
// ==========================================
class WorkerChatScreen extends StatefulWidget {
  final String bookingId;

  const WorkerChatScreen({super.key, required this.bookingId});

  @override
  State<WorkerChatScreen> createState() => _WorkerChatScreenState();
}

class _WorkerChatScreenState extends State<WorkerChatScreen> {
  final _msgController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'isMe': true,
      'text': 'Assalam-o-Alaikum, I am outside your gate in 5 minutes.',
      'time': '11:00 AM',
    },
    {
      'isMe': false,
      'text': 'Walaikum Assalam, please ring bell #2.',
      'time': '11:01 AM',
    },
  ];

  void _send() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _messages.add({'isMe': true, 'text': text, 'time': 'Just now'});
      _msgController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Chat with Customer (#${widget.bookingId})')),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, i) {
                final m = _messages[i];
                final isMe = m['isMe'] as bool;
                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isMe ? AppColors.primary : AppColors.surfaceVariant,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      m['text'] as String,
                      style: TextStyle(color: isMe ? Colors.white : AppColors.charcoal),
                    ),
                  ),
                );
              },
            ),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _msgController,
                      decoration: const InputDecoration(
                        hintText: 'Type your message...',
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send, color: AppColors.primary),
                    onPressed: _send,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ==========================================
// 5. WORKER PROFILE SCREEN
// ==========================================
class WorkerProfileScreen extends ConsumerWidget {
  const WorkerProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.profile;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Partner Profile')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 40,
              backgroundColor: AppColors.primary,
              child: Icon(Icons.handyman, color: Colors.white, size: 40),
            ),
            const SizedBox(height: 12),
            Text(user?.fullName ?? 'Worker Partner', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.lightGreen,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text('CNIC Verified Partner ✓', style: TextStyle(color: AppColors.primary, fontSize: 12, fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 24),

            ListTile(
              leading: const Icon(Icons.account_balance_wallet_outlined, color: AppColors.primary),
              title: const Text('Commissions & Payouts'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/worker/commission'),
            ),
            ListTile(
              leading: const Icon(Icons.military_tech_outlined, color: AppColors.primary),
              title: const Text('Worker Level & Stats'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/worker/levels'),
            ),
            ListTile(
              leading: const Icon(Icons.card_giftcard_outlined, color: AppColors.primary),
              title: const Text('Bonuses & Rewards'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/worker/bonuses'),
            ),
            ListTile(
              leading: const Icon(Icons.swap_horiz, color: AppColors.primary),
              title: const Text('Switch to Customer Mode'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/customer/home'),
            ),
            const Divider(height: 32),

            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
              onPressed: () async {
                await ref.read(authNotifierProvider.notifier).signOut();
                if (context.mounted) context.go('/auth/login');
              },
              child: const Text('Sign Out'),
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 6. WORKER COMMISSION SCREEN
// ==========================================
class WorkerCommissionScreen extends StatelessWidget {
  const WorkerCommissionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Platform Commission')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('Current Commission Rate', style: TextStyle(color: AppColors.gray)),
                  SizedBox(height: 4),
                  Text('10.0%', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.primary)),
                  SizedBox(height: 8),
                  Text('Earn 90% of every customer booking. Reach Gold level to reduce to 8%.', style: TextStyle(fontSize: 13, color: AppColors.grayDark)),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text('Pending Commission Due: Rs. 450', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('Deposit your commission via JazzCash or Easypaisa to maintain an active account status.', style: TextStyle(color: AppColors.gray, fontSize: 13)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Opening Pakistan Payment Gateway...')),
                );
              },
              child: const Text('Pay Commission via JazzCash / Easypaisa'),
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 7. WORKER LEVELS SCREEN
// ==========================================
class WorkerLevelsScreen extends StatelessWidget {
  const WorkerLevelsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final levels = [
      {'name': 'Bronze', 'target': '0 - 15 jobs completed', 'comm': '12% platform fee', 'active': false},
      {'name': 'Silver Pro', 'target': '15 - 50 jobs • 4.5+ rating', 'comm': '10% platform fee', 'active': true},
      {'name': 'Gold Master', 'target': '50 - 150 jobs • 4.8+ rating', 'comm': '8% platform fee', 'active': false},
      {'name': 'Platinum Elite', 'target': '150+ jobs • 4.9+ rating', 'comm': '6% platform fee', 'active': false},
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Worker Tier Progression')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: levels.length,
        itemBuilder: (context, i) {
          final lvl = levels[i];
          final isActive = lvl['active'] as bool;
          return Card(
            color: isActive ? AppColors.lightGreen : Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(color: isActive ? AppColors.primary : AppColors.border),
            ),
            child: ListTile(
              leading: Icon(
                Icons.military_tech,
                color: isActive ? AppColors.primary : AppColors.gray,
                size: 36,
              ),
              title: Text(lvl['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('${lvl['target']}\n${lvl['comm']}'),
              trailing: isActive
                  ? const Chip(
                      label: Text('Current', style: TextStyle(color: Colors.white, fontSize: 11)),
                      backgroundColor: AppColors.primary,
                    )
                  : null,
            ),
          );
        },
      ),
    );
  }
}

// ==========================================
// 8. WORKER BONUSES SCREEN
// ==========================================
class WorkerBonusesScreen extends StatelessWidget {
  const WorkerBonusesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Incentives & Bonuses')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Weekly 10 Jobs Challenge', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('+Rs. 1,500', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text('Complete 10 5-star jobs this week to earn an instant cash bonus.', style: TextStyle(color: AppColors.gray)),
                  const SizedBox(height: 12),
                  const LinearProgressIndicator(value: 0.6, color: AppColors.primary, backgroundColor: AppColors.lightGreen),
                  const SizedBox(height: 6),
                  const Text('6 / 10 jobs completed', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Eid / Festive Peak Incentive', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('+Rs. 3,000', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary)),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text('Active during upcoming festive season in Pakistan.', style: TextStyle(color: AppColors.gray)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
