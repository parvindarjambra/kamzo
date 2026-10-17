import 'dart:async';
import 'dart:io';
import 'package:equatable/equatable.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/storage_service.dart';
import '../../../core/utils/supabase_client.dart';

/// Single chat message representation
class ChatMessage extends Equatable {
  final String id;
  final String conversationId;
  final String senderId;
  final String messageType; // 'text', 'image', 'location', 'system'
  final String? content;
  final String? imageUrl;
  final double? locationLat;
  final double? locationLng;
  final bool isRead;
  final DateTime createdAt;

  const ChatMessage({
    required this.id,
    required this.conversationId,
    required this.senderId,
    this.messageType = 'text',
    this.content,
    this.imageUrl,
    this.locationLat,
    this.locationLng,
    this.isRead = false,
    required this.createdAt,
  });

  bool get isText => messageType == 'text';
  bool get isImage => messageType == 'image';
  bool get isLocation => messageType == 'location';
  bool get isSystem => messageType == 'system';

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] as String,
      conversationId: json['room_id'] as String? ??
          json['conversation_id'] as String? ??
          '',
      senderId: json['sender_id'] as String? ?? '',
      messageType: json['message_type'] as String? ?? 'text',
      content: json['content'] as String?,
      imageUrl: json['image_url'] as String?,
      locationLat: (json['location_lat'] as num?)?.toDouble() ??
          (json['latitude'] as num?)?.toDouble(),
      locationLng: (json['location_lng'] as num?)?.toDouble() ??
          (json['longitude'] as num?)?.toDouble(),
      isRead: json['is_read'] as bool? ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'room_id': conversationId,
      'sender_id': senderId,
      'message_type': messageType,
      'content': content,
      'image_url': imageUrl,
      'location_lat': locationLat,
      'location_lng': locationLng,
      'is_read': isRead,
      'created_at': createdAt.toIso8601String(),
    };
  }

  @override
  List<Object?> get props => [
        id,
        conversationId,
        senderId,
        messageType,
        content,
        imageUrl,
        locationLat,
        locationLng,
        isRead,
        createdAt,
      ];
}

/// State representation for active in-app chat
class ChatState {
  final List<ChatMessage> messages;
  final bool isLoading;
  final bool isSending;
  final bool isConversationLocked;
  final String? activeConversationId;
  final String? bookingId;
  final String? error;

  const ChatState({
    this.messages = const [],
    this.isLoading = false,
    this.isSending = false,
    this.isConversationLocked = false,
    this.activeConversationId,
    this.bookingId,
    this.error,
  });

  ChatState copyWith({
    List<ChatMessage>? messages,
    bool? isLoading,
    bool? isSending,
    bool? isConversationLocked,
    String? activeConversationId,
    String? bookingId,
    String? error,
    bool clearError = false,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      isSending: isSending ?? this.isSending,
      isConversationLocked:
          isConversationLocked ?? this.isConversationLocked,
      activeConversationId:
          activeConversationId ?? this.activeConversationId,
      bookingId: bookingId ?? this.bookingId,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Riverpod provider for ChatNotifier
final chatProvider = StateNotifierProvider<ChatNotifier, ChatState>((ref) {
  final storage = ref.watch(storageServiceProvider);
  return ChatNotifier(supabase: supabase, storageService: storage);
});

/// ChatNotifier manages conversation threads, real-time message syncing,
/// attachments, read receipts, and lock restrictions.
class ChatNotifier extends StateNotifier<ChatState> {
  final SupabaseClient _client;
  final StorageService _storageService;
  RealtimeChannel? _messagesSubscription;

  ChatNotifier({
    SupabaseClient? supabase,
    StorageService? storageService,
  })  : _client = supabase ?? Supabase.instance.client,
        _storageService = storageService ?? StorageService(supabase),
        super(const ChatState());

  String? get _currentUserId => _client.auth.currentUser?.id;

  /// Retrieves an existing conversation room for a booking or creates a new one
  Future<String?> getOrCreateConversation(String bookingId) async {
    state = state.copyWith(
      isLoading: true,
      bookingId: bookingId,
      clearError: true,
    );

    try {
      // 1. Try to find existing chat room
      final existingRoom = await _client
          .from(SupabaseTables.chatRooms)
          .select()
          .eq('booking_id', bookingId)
          .maybeSingle();

      String conversationId;
      bool isLocked = false;

      if (existingRoom != null) {
        conversationId = existingRoom['id'] as String;
        isLocked = existingRoom['is_locked'] as bool? ?? false;
      } else {
        // 2. Fetch booking details to populate customer and worker IDs
        final bookingData = await _client
            .from(SupabaseTables.bookings)
            .select('customer_id, worker_id, status')
            .eq('id', bookingId)
            .maybeSingle();

        if (bookingData == null) {
          throw Exception('Booking record not found for id: $bookingId');
        }

        final customerId = bookingData['customer_id'] as String;
        final workerId = bookingData['worker_id'] as String?;
        final status = bookingData['status'] as String? ?? '';

        if (status == BookingStatus.completed || status == BookingStatus.cancelled) {
          isLocked = true;
        }

        // Create new chat room
        final newRoom = await _client
            .from(SupabaseTables.chatRooms)
            .insert({
              'booking_id': bookingId,
              'customer_id': customerId,
              'worker_id': workerId,
              'is_locked': isLocked,
              'created_at': DateTime.now().toIso8601String(),
              'updated_at': DateTime.now().toIso8601String(),
            })
            .select()
            .single();

        conversationId = newRoom['id'] as String;
      }

      state = state.copyWith(
        activeConversationId: conversationId,
        isConversationLocked: isLocked,
      );

      // Subscribe to real-time incoming messages for this room
      subscribeToMessages(conversationId);

      // Load existing message history
      await _loadMessageHistory(conversationId);

      return conversationId;
    } catch (e) {
      debugPrint('getOrCreateConversation error: $e');
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to initialize conversation: $e',
      );
      return null;
    }
  }

  /// Loads message history for conversation room
  Future<void> _loadMessageHistory(String conversationId) async {
    try {
      final response = await _client
          .from(SupabaseTables.chatMessages)
          .select()
          .or('room_id.eq.$conversationId,conversation_id.eq.$conversationId')
          .order('created_at', ascending: true);

      final List<ChatMessage> loaded = (response as List)
          .map((item) => ChatMessage.fromJson(item as Map<String, dynamic>))
          .toList();

      state = state.copyWith(
        messages: loaded,
        isLoading: false,
      );

      // Mark unread messages as read
      await markMessagesRead(conversationId);
    } catch (e) {
      debugPrint('Error loading message history: $e');
      state = state.copyWith(isLoading: false);
    }
  }

  /// Listens to new messages in the room via Supabase Realtime channel
  void subscribeToMessages(String conversationId) {
    _messagesSubscription?.unsubscribe();

    _messagesSubscription = _client
        .channel('chat_room_$conversationId')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: SupabaseTables.chatMessages,
          callback: (payload) {
            final newRecord = payload.newRecord;
            if (newRecord.isNotEmpty) {
              final msg = ChatMessage.fromJson(newRecord);
              if (msg.conversationId == conversationId ||
                  payload.newRecord['room_id'] == conversationId) {
                // Avoid duplicates
                if (!state.messages.any((m) => m.id == msg.id)) {
                  state = state.copyWith(
                    messages: [...state.messages, msg],
                  );

                  // If sent by other participant, mark as read
                  if (msg.senderId != _currentUserId) {
                    markMessagesRead(conversationId);
                  }
                }
              }
            }
          },
        )
        .subscribe();
  }

  /// Sends a message (text, photo image, or location coordinates)
  Future<bool> sendMessage({
    required String conversationId,
    String messageType = 'text',
    String? content,
    String? imageUrl,
    double? locationLat,
    double? locationLng,
  }) async {
    final senderId = _currentUserId;
    if (senderId == null) {
      state = state.copyWith(error: 'User not authenticated');
      return false;
    }

    if (state.isConversationLocked) {
      state = state.copyWith(
        error: 'This conversation has been closed and locked.',
      );
      return false;
    }

    state = state.copyWith(isSending: true, clearError: true);

    try {
      final now = DateTime.now();
      final messagePayload = {
        'room_id': conversationId,
        'conversation_id': conversationId,
        'sender_id': senderId,
        'message_type': messageType,
        'content': content,
        'image_url': imageUrl,
        'location_lat': locationLat,
        'location_lng': locationLng,
        'is_read': false,
        'created_at': now.toIso8601String(),
      };

      final response = await _client
          .from(SupabaseTables.chatMessages)
          .insert(messagePayload)
          .select()
          .single();

      final sentMessage = ChatMessage.fromJson(response);

      if (!state.messages.any((m) => m.id == sentMessage.id)) {
        state = state.copyWith(
          messages: [...state.messages, sentMessage],
          isSending: false,
        );
      } else {
        state = state.copyWith(isSending: false);
      }

      // Update room updated_at
      await _client.from(SupabaseTables.chatRooms).update({
        'updated_at': now.toIso8601String(),
      }).eq('id', conversationId);

      return true;
    } catch (e) {
      debugPrint('sendMessage error: $e');
      state = state.copyWith(
        isSending: false,
        error: 'Failed to send message: $e',
      );
      return false;
    }
  }

  /// Marks all unread messages received from the counterpart as read
  Future<void> markMessagesRead(String conversationId) async {
    final userId = _currentUserId;
    if (userId == null) return;

    try {
      await _client
          .from(SupabaseTables.chatMessages)
          .update({'is_read': true})
          .eq('room_id', conversationId)
          .neq('sender_id', userId)
          .eq('is_read', false);
    } catch (e) {
      debugPrint('markMessagesRead error: $e');
    }
  }

  /// Uploads chat image attachment to Supabase Storage and returns the public URL
  Future<String?> uploadImage(File file) async {
    try {
      return await _storageService.uploadImage(
        bucket: AppConstants.bookingAttachmentsBucket,
        file: file,
        path: 'chat/${DateTime.now().millisecondsSinceEpoch}',
      );
    } catch (e) {
      debugPrint('chat uploadImage error: $e');
      state = state.copyWith(error: 'Failed to upload image: $e');
      return null;
    }
  }

  @override
  void dispose() {
    _messagesSubscription?.unsubscribe();
    super.dispose();
  }
}
