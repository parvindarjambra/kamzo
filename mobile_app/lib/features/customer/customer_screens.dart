import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_constants.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/supabase_client.dart';

// ==========================================
// 1. CUSTOMER HOME SCREEN
// ==========================================
class CustomerHomeScreen extends ConsumerWidget {
  const CustomerHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.profile;

    final categories = [
      {'name': 'AC Repair', 'icon': Icons.ac_unit, 'id': 'ac-repair'},
      {'name': 'Electrician', 'icon': Icons.bolt, 'id': 'electrician'},
      {'name': 'Plumber', 'icon': Icons.plumbing, 'id': 'plumber'},
      {'name': 'Cleaning', 'icon': Icons.cleaning_services, 'id': 'cleaning'},
      {'name': 'Painter', 'icon': Icons.format_paint, 'id': 'painter'},
      {'name': 'Appliances', 'icon': Icons.kitchen, 'id': 'appliances'},
    ];

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'KAMZO',
              style: TextStyle(
                fontFamily: AppTheme.fontFamily,
                fontWeight: FontWeight.bold,
                fontSize: 20,
                color: AppColors.primary,
                letterSpacing: 1.2,
              ),
            ),
            Row(
              children: [
                const Icon(Icons.location_on, size: 14, color: AppColors.primary),
                const SizedBox(width: 4),
                Text(
                  user?.city ?? 'Lahore, Pakistan',
                  style: const TextStyle(fontSize: 12, color: AppColors.grayDark),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.person_outline),
            onPressed: () => context.go('/customer/profile'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Search electrician, AC repair, plumber...',
                  prefixIcon: const Icon(Icons.search),
                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  fillColor: AppColors.surfaceVariant,
                ),
              ),
            ),

            // Promotional Banner
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.primary, AppColors.secondary],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(AppTheme.cardRadius),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.2),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'Special Launch Offer',
                        style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Get Verified Home Pros',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Safe, standardized pricing & 100% satisfaction guarantee.',
                      style: TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: AppColors.primary,
                        minimumSize: const Size(120, 38),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                      ),
                      onPressed: () => context.go('/customer/booking/new'),
                      child: const Text('Book a Pro'),
                    ),
                  ],
                ),
              ),
            ),

            // Categories Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text(
                    'Popular Services',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.charcoal),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              physics: const NeverScrollableScrollButton(),
              shrinkWrap: true,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 3,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 0.95,
              ),
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final cat = categories[index];
                return GestureDetector(
                  onTap: () => context.go('/customer/service/${cat['id']}'),
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.border.withOpacity(0.5)),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: const BoxDecoration(
                            color: AppColors.lightGreen,
                            shape: BoxShape.circle,
                          ),
                          child: Icon(cat['icon'] as IconData, color: AppColors.primary, size: 28),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          cat['name'] as String,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.charcoal,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),

            const SizedBox(height: 24),

            // Quick Actions / Booking history
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Card(
                elevation: 0,
                color: AppColors.lightGreen.withOpacity(0.5),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                  side: const BorderSide(color: AppColors.greenTint),
                ),
                child: ListTile(
                  leading: const Icon(Icons.history, color: AppColors.primary),
                  title: const Text(
                    'My Bookings & History',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                  subtitle: const Text('Track pending, active, or completed jobs'),
                  trailing: const Icon(Icons.chevron_right, color: AppColors.primary),
                  onPressed: () => context.go('/customer/history'),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        onTap: (index) {
          if (index == 0) context.go('/customer/home');
          if (index == 1) context.go('/customer/history');
          if (index == 2) context.go('/customer/profile');
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today_outlined), activeIcon: Icon(Icons.calendar_today), label: 'Bookings'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

// ==========================================
// 2. SERVICE DETAIL SCREEN
// ==========================================
class ServiceDetailScreen extends StatelessWidget {
  final String serviceId;

  const ServiceDetailScreen({super.key, required this.serviceId});

  @override
  Widget build(BuildContext context) {
    final title = serviceId.replaceAll('-', ' ').toUpperCase();

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(title),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 200,
              width: double.infinity,
              color: AppColors.lightGreen,
              child: Center(
                child: Icon(Icons.handyman_outlined, size: 80, color: AppColors.primary),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: const TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: AppColors.charcoal,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.lightGreen,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'PKR 1,500',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Estimated Duration: 60 - 90 Minutes',
                    style: TextStyle(color: AppColors.gray, fontSize: 13),
                  ),
                  const Divider(height: 32),
                  const Text(
                    'Service Inclusions',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    '• Comprehensive fault inspection\n'
                    '• Professional certified technician with valid CNIC\n'
                    '• 7-day post-service warranty\n'
                    '• Standardized rates with invoice receipt',
                    style: TextStyle(height: 1.6, fontSize: 14, color: AppColors.charcoal),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Customer Reviews',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: const [
                      Icon(Icons.star, color: AppColors.accentGold, size: 20),
                      SizedBox(width: 4),
                      Text(
                        '4.8 (124 ratings across Pakistan)',
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: ElevatedButton(
            onPressed: () => context.go('/customer/booking/new'),
            child: const Text('Proceed to Book'),
          ),
        ),
      ),
    );
  }
}

// ==========================================
// 3. NEW BOOKING SCREEN
// ==========================================
class NewBookingScreen extends ConsumerStatefulWidget {
  const NewBookingScreen({super.key});

  @override
  ConsumerState<NewBookingScreen> createState() => _NewBookingScreenState();
}

class _NewBookingScreenState extends ConsumerState<NewBookingScreen> {
  final _addressController =
      TextEditingController(text: 'House 42, Street 5, Model Town');
  final _notesController = TextEditingController();
  DateTime _selectedDate = DateTime.now().add(const Duration(hours: 2));
  String _selectedPaymentMethod = PaymentMethod.cashOnDelivery;
  bool _isLoading = false;

  @override
  void dispose() {
    _addressController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _submitBooking() async {
    setState(() => _isLoading = true);
    final user = supabase.auth.currentUser;

    try {
      final res = await supabase.from(SupabaseTables.bookings).insert({
        'customer_id': user?.id ?? 'guest-customer-id',
        'service_id': 'general-home-service',
        'status': BookingStatus.pending,
        'scheduled_at': _selectedDate.toIso8601String(),
        'total_amount': 1500.0,
        'commission_rate': 10.0,
        'commission_amount': 150.0,
        'payment_method': _selectedPaymentMethod,
        'payment_status': PaymentStatus.pending,
        'customer_address': _addressController.text,
        'customer_notes': _notesController.text,
      }).select().maybeSingle();

      if (mounted) {
        final bookingId = res?['id'] ?? 'demo-booking-101';
        context.go('/customer/booking/$bookingId');
      }
    } catch (e) {
      if (mounted) {
        // Fallback for offline/test scenario
        context.go('/customer/booking/demo-booking-101');
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Schedule Service')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Service Address in Pakistan',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _addressController,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.location_on_outlined),
                hintText: 'Enter complete street address, house no, area',
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Preferred Date & Time',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            ListTile(
              tileColor: AppColors.surface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: AppColors.border),
              ),
              leading: const Icon(Icons.access_time, color: AppColors.primary),
              title: Text(
                '${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year} at ${_selectedDate.hour}:${_selectedDate.minute.toString().padLeft(2, '0')}',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
              trailing: const Text('Change', style: TextStyle(color: AppColors.primary)),
              onTap: () async {
                final d = await showDatePicker(
                  context: context,
                  initialDate: _selectedDate,
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 30)),
                );
                if (d != null && mounted) {
                  setState(() => _selectedDate = d);
                }
              },
            ),
            const SizedBox(height: 20),

            const Text(
              'Payment Method',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedPaymentMethod,
              decoration: const InputDecoration(
                prefixIcon: Icon(Icons.payments_outlined),
              ),
              items: [
                DropdownMenuItem(
                  value: PaymentMethod.cashOnDelivery,
                  child: Text(PaymentMethod.label(PaymentMethod.cashOnDelivery)),
                ),
                DropdownMenuItem(
                  value: PaymentMethod.jazzCash,
                  child: Text(PaymentMethod.label(PaymentMethod.jazzCash)),
                ),
                DropdownMenuItem(
                  value: PaymentMethod.easyPaisa,
                  child: Text(PaymentMethod.label(PaymentMethod.easyPaisa)),
                ),
                DropdownMenuItem(
                  value: PaymentMethod.bankTransfer,
                  child: Text(PaymentMethod.label(PaymentMethod.bankTransfer)),
                ),
              ],
              onChanged: (v) {
                if (v != null) setState(() => _selectedPaymentMethod = v);
              },
            ),
            const SizedBox(height: 20),

            const Text(
              'Special Instructions / Problem Description',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _notesController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'e.g. Bring extra ladder, check master bedroom AC...',
              ),
            ),
            const SizedBox(height: 32),

            ElevatedButton(
              onPressed: _isLoading ? null : _submitBooking,
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Confirm & Book Now'),
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 4. BOOKING DETAIL SCREEN
// ==========================================
class BookingDetailScreen extends StatelessWidget {
  final String bookingId;

  const BookingDetailScreen({super.key, required this.bookingId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: Text('Booking #$bookingId')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
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
                children: [
                  const Icon(Icons.check_circle_outline, color: AppColors.primary, size: 36),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Booking Received',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryDark,
                          ),
                        ),
                        Text(
                          'Finding nearby verified technician in your area.',
                          style: TextStyle(fontSize: 13, color: AppColors.primary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text(
              'Technician Information',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Card(
              margin: EdgeInsets.zero,
              child: ListTile(
                leading: CircleAvatar(
                  backgroundColor: AppColors.primary,
                  child: const Text('MK', style: TextStyle(color: Colors.white)),
                ),
                title: const Text('Muhammad Kashif', style: TextStyle(fontWeight: FontWeight.bold)),
                subtitle: const Text('Certified Electrician • Rating 4.9 ★'),
                trailing: IconButton(
                  icon: const Icon(Icons.chat_bubble_outline, color: AppColors.primary),
                  onPressed: () => context.go('/customer/booking/$bookingId/chat'),
                ),
              ),
            ),
            const SizedBox(height: 24),

            const Text('Payment Summary', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Service Fee'),
                      Text('Rs. 1,500', style: TextStyle(fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Platform / Inspection'),
                      Text('Rs. 0 (Free)', style: TextStyle(fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const Divider(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Total Amount', style: TextStyle(fontWeight: FontWeight.bold)),
                      Text(
                        'Rs. 1,500',
                        style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary, fontSize: 16),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => context.go('/customer/booking/$bookingId/payment'),
                    child: const Text('Pay Online'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => context.go('/customer/booking/$bookingId/chat'),
                    child: const Text('Open Chat'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 5. PAYMENT SCREEN
// ==========================================
class CustomerPaymentScreen extends StatelessWidget {
  final String bookingId;

  const CustomerPaymentScreen({super.key, required this.bookingId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('Payment Checkout')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Payment Option (Pakistan)',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Card(
              child: ListTile(
                leading: const Icon(Icons.phone_android, color: Colors.red),
                title: const Text('JazzCash Mobile Account'),
                subtitle: const Text('Pay using your JazzCash wallet PIN'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Connecting to JazzCash gateway...')),
                  );
                },
              ),
            ),
            Card(
              child: ListTile(
                leading: const Icon(Icons.account_balance_wallet, color: Colors.green),
                title: const Text('Easypaisa Wallet'),
                subtitle: const Text('Pay directly via Easypaisa OTP'),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Connecting to Easypaisa gateway...')),
                  );
                },
              ),
            ),
            Card(
              child: ListTile(
                leading: const Icon(Icons.money, color: AppColors.primary),
                title: const Text('Cash on Delivery (COD)'),
                subtitle: const Text('Pay the technician in cash after job completion'),
                trailing: const Icon(Icons.check, color: AppColors.primary),
                onTap: () => context.pop(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// 6. CUSTOMER CHAT SCREEN
// ==========================================
class CustomerChatScreen extends StatefulWidget {
  final String bookingId;

  const CustomerChatScreen({super.key, required this.bookingId});

  @override
  State<CustomerChatScreen> createState() => _CustomerChatScreenState();
}

class _CustomerChatScreenState extends State<CustomerChatScreen> {
  final _msgController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'isMe': false,
      'text': 'Assalam-o-Alaikum! I have accepted your booking and am on the way.',
      'time': '10:30 AM',
    },
    {
      'isMe': true,
      'text': 'Walaikum Assalam. Please call me when you reach the gate.',
      'time': '10:32 AM',
    },
  ];

  void _sendMessage() {
    final text = _msgController.text.trim();
    if (text.isEmpty) return;
    setState(() {
      _messages.add({
        'isMe': true,
        'text': text,
        'time': 'Just now',
      });
      _msgController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Worker Support Chat', style: TextStyle(fontSize: 16)),
            Text(
              'Booking #${widget.bookingId}',
              style: const TextStyle(fontSize: 11, color: AppColors.gray),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final m = _messages[index];
                final isMe = m['isMe'] as bool;
                return Align(
                  alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 4),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: isMe ? AppColors.primary : Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment:
                          isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                      children: [
                        Text(
                          m['text'] as String,
                          style: TextStyle(
                            color: isMe ? Colors.white : AppColors.charcoal,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          m['time'] as String,
                          style: TextStyle(
                            color: isMe ? Colors.white70 : AppColors.gray,
                            fontSize: 10,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            color: Colors.white,
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _msgController,
                      decoration: const InputDecoration(
                        hintText: 'Type your message...',
                        border: InputBorder.none,
                        enabledBorder: InputBorder.none,
                        focusedBorder: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(horizontal: 8),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send, color: AppColors.primary),
                    onPressed: _sendMessage,
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
// 7. CUSTOMER PROFILE SCREEN
// ==========================================
class CustomerProfileScreen extends ConsumerWidget {
  const CustomerProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final user = authState.profile;

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: const Text('My Profile')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            CircleAvatar(
              radius: 44,
              backgroundColor: AppColors.lightGreen,
              child: Text(
                (user?.fullName.isNotEmpty ?? false)
                    ? user!.fullName[0].toUpperCase()
                    : 'K',
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              user?.fullName ?? 'Valued Customer',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            Text(
              user?.email ?? 'customer@kamzo.pk',
              style: const TextStyle(color: AppColors.gray, fontSize: 14),
            ),
            const SizedBox(height: 24),

            ListTile(
              leading: const Icon(Icons.phone_outlined, color: AppColors.primary),
              title: const Text('Phone Number'),
              subtitle: Text(user?.phone ?? '+92 300 1234567'),
            ),
            ListTile(
              leading: const Icon(Icons.location_city_outlined, color: AppColors.primary),
              title: const Text('Default City'),
              subtitle: Text(user?.city ?? 'Lahore'),
            ),
            ListTile(
              leading: const Icon(Icons.history, color: AppColors.primary),
              title: const Text('Service History'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/customer/history'),
            ),
            ListTile(
              leading: const Icon(Icons.swap_horiz, color: AppColors.primary),
              title: const Text('Switch to Worker Mode'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () => context.go('/worker/home'),
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
// 8. BOOKING HISTORY SCREEN
// ==========================================
class BookingHistoryScreen extends StatelessWidget {
  const BookingHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: const Text('My Bookings'),
          bottom: const TabBar(
            indicatorColor: AppColors.primary,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.gray,
            tabs: [
              Tab(text: 'Active'),
              Tab(text: 'Completed'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.ac_unit, color: AppColors.primary),
                    title: const Text('AC Master Service'),
                    subtitle: const Text('Scheduled Today at 3:00 PM • Cash'),
                    trailing: const Text(
                      'Confirmed',
                      style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
                    ),
                    onTap: () => context.go('/customer/booking/demo-booking-101'),
                  ),
                ),
              ],
            ),
            ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.bolt, color: AppColors.primary),
                    title: const Text('Ceiling Fan Installation'),
                    subtitle: const Text('Completed on 10 Oct 2026 • Rs. 800'),
                    trailing: const Icon(Icons.check_circle, color: AppColors.success),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
