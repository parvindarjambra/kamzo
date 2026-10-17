import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_colors.dart';

class ChatScreen extends ConsumerStatefulWidget {
  final String? bookingId;
  final String? otherName;
  final String? otherPhone;
  final bool? isPaymentVerified;

  const ChatScreen({
    super.key,
    this.bookingId,
    this.otherName,
    this.otherPhone,
    this.isPaymentVerified,
  });

  @override
  ConsumerState<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends ConsumerState<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final ImagePicker _picker = ImagePicker();

  bool _isLocked = false;
  late final String _currentBookingId;
  late final String _partyName;
  late final String _partyPhone;

  RealtimeChannel? _chatChannel;

  // Mock initial chat messages
  final List<Map<String, dynamic>> _messages = [
    {
      'id': '1',
      'sender_id': 'other',
      'text': 'Assalam-o-Alaikum, are you on your way to Gulshan-e-Iqbal?',
      'type': 'text',
      'timestamp': '02:16 PM',
      'is_read': true,
    },
    {
      'id': '2',
      'sender_id': 'me',
      'text': 'Walaikum Assalam, jee bilkul! I have left the workshop and am navigating towards your location.',
      'type': 'text',
      'timestamp': '02:18 PM',
      'is_read': true,
    },
    {
      'id': '3',
      'sender_id': 'other',
      'type': 'location',
      'text': 'Shared Location: House 42-B, Block 13-D, Near Disco Bakery',
      'lat': 24.9180,
      'lng': 67.0971,
      'timestamp': '02:19 PM',
      'is_read': true,
    },
    {
      'id': '4',
      'sender_id': 'other',
      'type': 'image',
      'text': 'Here is the photo of the AC outdoor unit and refrigerant valve.',
      'image_url': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
      'timestamp': '02:20 PM',
      'is_read': true,
    },
    {
      'id': '5',
      'sender_id': 'me',
      'text': 'Got it! I see the issue. I have brought R410a gas cylinder and testing gauge with me.',
      'type': 'text',
      'timestamp': '02:21 PM',
      'is_read': true,
    },
  ];

  @override
  void initState() {
    super.initState();
    _currentBookingId = widget.bookingId ?? 'KZ-8821';
    _partyName = widget.otherName ?? 'Tariq Mehmood';
    _partyPhone = widget.otherPhone ?? '03009234567';
    _isLocked = !(widget.isPaymentVerified ?? true);

    _initSupabaseRealtime();
  }

  void _initSupabaseRealtime() {
    try {
      final supabase = Supabase.instance.client;
      _chatChannel = supabase.channel('chat:$_currentBookingId');
      _chatChannel?.onPostgresChanges(
        event: PostgresChangeEvent.insert,
        schema: 'public',
        table: 'messages',
        filter: PostgresChangeFilter(
          type: PostgresChangeFilterType.eq,
          column: 'booking_id',
          value: _currentBookingId,
        ),
        callback: (payload) {
          final newRecord = payload.newRecord;
          if (mounted && newRecord.isNotEmpty) {
            setState(() {
              _messages.add({
                'id': newRecord['id'] ?? UniqueKey().toString(),
                'sender_id': newRecord['sender_id'] == supabase.auth.currentUser?.id ? 'me' : 'other',
                'text': newRecord['content'] ?? '',
                'type': newRecord['message_type'] ?? 'text',
                'image_url': newRecord['media_url'],
                'timestamp': 'Just now',
                'is_read': false,
              });
            });
            _scrollToBottom();
          }
        },
      ).subscribe();
    } catch (_) {
      // Safe fallback if Supabase is offline or unconfigured
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _chatChannel?.unsubscribe();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage({String type = 'text', String? mediaUrl, double? lat, double? lng, String? customText}) {
    final text = customText ?? _messageController.text.trim();
    if (text.isEmpty && mediaUrl == null && lat == null) return;

    final newMessage = {
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'sender_id': 'me',
      'text': text,
      'type': type,
      'image_url': mediaUrl,
      'lat': lat,
      'lng': lng,
      'timestamp': 'Just now',
      'is_read': false,
    };

    setState(() {
      _messages.add(newMessage);
      _messageController.clear();
    });

    _scrollToBottom();

    try {
      final supabase = Supabase.instance.client;
      final userId = supabase.auth.currentUser?.id;
      supabase.from('messages').insert({
        'booking_id': _currentBookingId,
        'sender_id': userId,
        'content': text,
        'message_type': type,
        'media_url': mediaUrl,
      });
    } catch (_) {}
  }

  Future<void> _pickImage() async {
    final picked = await _picker.pickImage(source: ImageSource.gallery, imageQuality: 80);
    if (picked != null) {
      _sendMessage(
        type: 'image',
        customText: 'Photo attachment',
        mediaUrl: picked.path,
      );
    }
  }

  void _shareLocation() {
    _sendMessage(
      type: 'location',
      customText: 'Shared current location: 24.9180° N, 67.0971° E',
      lat: 24.9180,
      lng: 67.0971,
    );
  }

  Future<void> _makeCall() async {
    final url = Uri.parse('tel:$_partyPhone');
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url);
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFECE5DD).withOpacity(0.35),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.charcoal, size: 20),
          onPressed: () => context.pop(),
        ),
        titleSpacing: 0,
        title: Row(
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: AppColors.lightGreenBg,
              child: Text(
                _partyName.isNotEmpty ? _partyName.substring(0, 1) : 'K',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: AppColors.primaryGreen,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _partyName,
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: AppColors.charcoal,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Row(
                    children: [
                      Container(
                        width: 7,
                        height: 7,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.success,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Text(
                        'Online • Booking #KZ-8821',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 11,
                          color: AppColors.gray,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone, color: AppColors.primaryGreen),
            onPressed: _isLocked ? null : _makeCall,
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: SafeArea(
        child: _isLocked ? _buildLockedState() : _buildChatContent(),
      ),
    );
  }

  Widget _buildLockedState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF3E0),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFFFB74D), width: 2),
              ),
              child: const Icon(Icons.lock_outline, size: 54, color: AppColors.warning),
            ),
            const SizedBox(height: 24),
            const Text(
              'Chat Currently Locked',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.charcoal,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 10),
            const Text(
              'Chat and direct contact information will be unlocked automatically once the advance visit fee payment is verified.',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 13,
                color: AppColors.gray,
                height: 1.45,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.pop(),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryGreen,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('Back to Booking Details', style: TextStyle(fontFamily: 'Poppins')),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChatContent() {
    return Column(
      children: [
        // Safety / Payment Notice Banner
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          color: AppColors.lightGreenBg,
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.shield_outlined, color: AppColors.primaryGreen, size: 16),
              SizedBox(width: 6),
              Text(
                'Visit Fee verified. Keep all discussions on KAMZO for warranty protection.',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 11,
                  color: AppColors.primaryGreen,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),

        // Messages List
        Expanded(
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            itemCount: _messages.length,
            itemBuilder: (ctx, index) {
              final msg = _messages[index];
              final isMe = msg['sender_id'] == 'me';
              return _buildMessageBubble(msg, isMe);
            },
          ),
        ),

        // Message Input Bar
        _buildInputBar(),
      ],
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> msg, bool isMe) {
    final type = msg['type'] as String;

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isMe ? AppColors.primaryGreen : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isMe ? 16 : 4),
            bottomRight: Radius.circular(isMe ? 4 : 16),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 4,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (type == 'image') ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Container(
                  height: 160,
                  width: double.infinity,
                  color: AppColors.lightGray,
                  child: msg['image_url'] != null && msg['image_url'].toString().startsWith('http')
                      ? Image.network(
                          msg['image_url'],
                          fit: BoxFit.cover,
                          errorBuilder: (ctx, err, stack) => const Icon(Icons.broken_image, size: 40),
                        )
                      : const Icon(Icons.image, size: 50, color: AppColors.gray),
                ),
              ),
              const SizedBox(height: 8),
            ],
            if (type == 'location') ...[
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: isMe ? Colors.white.withOpacity(0.15) : AppColors.lightGreenBg,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.map_rounded,
                      color: isMe ? Colors.white : AppColors.primaryGreen,
                      size: 24,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        msg['text'] ?? 'Shared Pin Location',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: isMe ? Colors.white : AppColors.charcoal,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 6),
            ] else ...[
              Text(
                msg['text'] ?? '',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 13,
                  color: isMe ? Colors.white : AppColors.charcoal,
                  height: 1.35,
                ),
              ),
            ],
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  msg['timestamp'] ?? '',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 10,
                    color: isMe ? Colors.white70 : AppColors.gray,
                  ),
                ),
                if (isMe) ...[
                  const SizedBox(width: 4),
                  Icon(
                    msg['is_read'] == true ? Icons.done_all : Icons.done,
                    size: 14,
                    color: msg['is_read'] == true ? Colors.lightBlueAccent : Colors.white70,
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputBar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.border, width: 0.5)),
      ),
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.add_photo_alternate_outlined, color: AppColors.primaryGreen, size: 24),
            onPressed: _pickImage,
          ),
          IconButton(
            icon: const Icon(Icons.location_on_outlined, color: AppColors.primaryGreen, size: 24),
            onPressed: _shareLocation,
          ),
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              decoration: BoxDecoration(
                color: const Color(0xFFF5F5F5),
                borderRadius: BorderRadius.circular(24),
              ),
              child: TextField(
                controller: _messageController,
                textInputAction: TextInputAction.send,
                onSubmitted: (_) => _sendMessage(),
                decoration: const InputDecoration(
                  hintText: 'Type a message...',
                  hintStyle: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: AppColors.gray),
                  border: InputBorder.none,
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            decoration: const BoxDecoration(
              color: AppColors.primaryGreen,
              shape: BoxShape.circle,
            ),
            child: IconButton(
              icon: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
              onPressed: () => _sendMessage(),
            ),
          ),
        ],
      ),
    );
  }
}
