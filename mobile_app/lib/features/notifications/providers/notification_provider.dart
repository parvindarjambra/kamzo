import 'dart:async';
import 'package:equatable/equatable.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/services/notification_service.dart';
import '../../../core/utils/supabase_client.dart';

/// App notification model
class AppNotification extends Equatable {
  final String id;
  final String userId;
  final String title;
  final String body;
  final String type;
  final Map<String, dynamic> data;
  final bool isRead;
  final DateTime createdAt;

  const AppNotification({
    required this.id,
    required this.userId,
    required this.title,
    required this.body,
    this.type = NotificationType.systemAnnouncement,
    this.data = const {},
    this.isRead = false,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] as String,
      userId: json['user_id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      body: json['body'] as String? ?? json['message'] as String? ?? '',
      type: json['type'] as String? ?? NotificationType.systemAnnouncement,
      data: json['data'] is Map<String, dynamic>
          ? json['data'] as Map<String, dynamic>
          : {},
      isRead: json['is_read'] as bool? ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'title': title,
      'body': body,
      'type': type,
      'data': data,
      'is_read': isRead,
      'created_at': createdAt.toIso8601String(),
    };
  }

  AppNotification copyWith({
    String? id,
    String? userId,
    String? title,
    String? body,
    String? type,
    Map<String, dynamic>? data,
    bool? isRead,
    DateTime? createdAt,
  }) {
    return AppNotification(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      body: body ?? this.body,
      type: type ?? this.type,
      data: data ?? this.data,
      isRead: isRead ?? this.isRead,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  List<Object?> get props => [id, userId, title, body, type, data, isRead, createdAt];
}

/// State representation for user notifications
class NotificationState {
  final List<AppNotification> notifications;
  final int unreadCount;
  final bool isLoading;
  final bool hasMore;
  final int currentPage;
  final String? error;

  const NotificationState({
    this.notifications = const [],
    this.unreadCount = 0,
    this.isLoading = false,
    this.hasMore = true,
    this.currentPage = 1,
    this.error,
  });

  NotificationState copyWith({
    List<AppNotification>? notifications,
    int? unreadCount,
    bool? isLoading,
    bool? hasMore,
    int? currentPage,
    String? error,
    bool clearError = false,
  }) {
    return NotificationState(
      notifications: notifications ?? this.notifications,
      unreadCount: unreadCount ?? this.unreadCount,
      isLoading: isLoading ?? this.isLoading,
      hasMore: hasMore ?? this.hasMore,
      currentPage: currentPage ?? this.currentPage,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Riverpod provider for NotificationNotifier
final notificationProvider =
    StateNotifierProvider<NotificationNotifier, NotificationState>((ref) {
  final notificationService = ref.watch(notificationServiceProvider);
  return NotificationNotifier(
    supabase: supabase,
    notificationService: notificationService,
  );
});

/// NotificationNotifier manages push notifications, local notifications,
/// real-time delivery, and unread badge counters.
class NotificationNotifier extends StateNotifier<NotificationState> {
  final SupabaseClient _client;
  final NotificationService _notificationService;
  StreamSubscription<RemoteMessage>? _fcmSubscription;
  RealtimeChannel? _realtimeChannel;

  NotificationNotifier({
    SupabaseClient? supabase,
    NotificationService? notificationService,
  })  : _client = supabase ?? Supabase.instance.client,
        _notificationService = notificationService ?? NotificationService(),
        super(const NotificationState()) {
    _initFCM();
    fetchNotifications(refresh: true);
    _initRealtimeSubscription();
  }

  String? get _currentUserId => _client.auth.currentUser?.id;

  /// Initializes FCM message listener and foreground notification display
  void _initFCM() {
    _fcmSubscription = FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      handleForegroundFCM(message);
    });
  }

  /// Sets up Supabase Realtime channel for instant in-app alerts
  void _initRealtimeSubscription() {
    final userId = _currentUserId;
    if (userId == null) return;

    _realtimeChannel?.unsubscribe();

    _realtimeChannel = _client
        .channel('user_notifications_$userId')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: SupabaseTables.notifications,
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'user_id',
            value: userId,
          ),
          callback: (payload) {
            final record = payload.newRecord;
            if (record.isNotEmpty) {
              final newNotification = AppNotification.fromJson(record);
              if (!state.notifications.any((n) => n.id == newNotification.id)) {
                state = state.copyWith(
                  notifications: [newNotification, ...state.notifications],
                  unreadCount: state.unreadCount + 1,
                );
              }
            }
          },
        )
        .subscribe();
  }

  /// Processes foreground FCM message, shows local heads-up banner, and updates state
  Future<void> handleForegroundFCM(RemoteMessage message) async {
    final title = message.notification?.title ??
        message.data['title'] ??
        'KAMZO Notification';
    final body = message.notification?.body ??
        message.data['body'] ??
        '';

    // Show local notification with high priority
    await _notificationService.showLocalNotification(
      title: title,
      body: body,
      data: message.data,
    );

    // Refresh notifications list to pull database-backed record
    await fetchNotifications(refresh: true);
  }

  /// Fetches paginated notifications for current user
  Future<List<AppNotification>> fetchNotifications({
    bool refresh = false,
    int page = 1,
    int limit = 20,
  }) async {
    final userId = _currentUserId;
    if (userId == null) return [];

    state = state.copyWith(
      isLoading: true,
      currentPage: refresh ? 1 : page,
      clearError: true,
    );

    try {
      final targetPage = refresh ? 1 : page;
      final from = (targetPage - 1) * limit;
      final to = from + limit - 1;

      final response = await _client
          .from(SupabaseTables.notifications)
          .select()
          .eq('user_id', userId)
          .order('created_at', ascending: false)
          .range(from, to);

      final List<AppNotification> loaded = (response as List)
          .map((item) => AppNotification.fromJson(item as Map<String, dynamic>))
          .toList();

      final updatedList =
          refresh ? loaded : [...state.notifications, ...loaded];

      // Calculate unread count
      final unreadCount =
          updatedList.where((item) => !item.isRead).length;

      final hasMore = loaded.length >= limit;

      state = state.copyWith(
        notifications: updatedList,
        unreadCount: unreadCount,
        isLoading: false,
        hasMore: hasMore,
        currentPage: targetPage,
      );

      return loaded;
    } catch (e) {
      debugPrint('fetchNotifications error: $e');
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to fetch notifications: $e',
      );
      return [];
    }
  }

  /// Marks a specific notification as read
  Future<void> markAsRead(String notificationId) async {
    try {
      await _client
          .from(SupabaseTables.notifications)
          .update({'is_read': true})
          .eq('id', notificationId);

      final updatedList = state.notifications.map((n) {
        return n.id == notificationId ? n.copyWith(isRead: true) : n;
      }).toList();

      final unreadCount =
          updatedList.where((item) => !item.isRead).length;

      state = state.copyWith(
        notifications: updatedList,
        unreadCount: unreadCount,
      );
    } catch (e) {
      debugPrint('markAsRead error: $e');
    }
  }

  /// Marks all current user notifications as read
  Future<void> markAllRead() async {
    final userId = _currentUserId;
    if (userId == null) return;

    try {
      await _client
          .from(SupabaseTables.notifications)
          .update({'is_read': true})
          .eq('user_id', userId)
          .eq('is_read', false);

      final updatedList = state.notifications.map((n) {
        return n.copyWith(isRead: true);
      }).toList();

      state = state.copyWith(
        notifications: updatedList,
        unreadCount: 0,
      );
    } catch (e) {
      debugPrint('markAllRead error: $e');
    }
  }

  @override
  void dispose() {
    _fcmSubscription?.cancel();
    _realtimeChannel?.unsubscribe();
    super.dispose();
  }
}
