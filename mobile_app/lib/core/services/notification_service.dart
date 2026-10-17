import 'dart:convert';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../theme/app_colors.dart';

/// Top-level background message handler required by Firebase Messaging
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  try {
    await Firebase.initializeApp();
  } catch (_) {
    // Already initialized
  }
  debugPrint('Handling background FCM message: ${message.messageId}');
}

/// Callback typedef for notification tap handling
typedef NotificationTapCallback = void Function(Map<String, dynamic> data);

/// Riverpod provider for NotificationService
final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService();
});

/// Firebase Cloud Messaging and local push notification service.
class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  NotificationTapCallback? _onNotificationTap;

  /// High importance notification channel for Android heads-up display.
  static const AndroidNotificationChannel _defaultChannel =
      AndroidNotificationChannel(
    'kamzo_high_importance_channel',
    'KAMZO Notifications',
    description: 'Notifications for bookings, messages, commissions, and updates',
    importance: Importance.max,
    playSound: true,
    enableVibration: true,
  );

  /// Sets up a custom listener for notification tap navigation.
  void setNotificationTapListener(NotificationTapCallback listener) {
    _onNotificationTap = listener;
  }

  /// Initializes FCM and local notification plugins.
  Future<void> initialize() async {
    await requestPermission();
    await setupLocalNotifications();

    // Set background message handler
    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

    // Foreground messages handler
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      handleForegroundMessage(message);
    });

    // App opened from background notification tap
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      handleNotificationTap(message.data);
    });

    // Check if app was opened from terminated state via notification
    final initialMessage = await _fcm.getInitialMessage();
    if (initialMessage != null) {
      handleNotificationTap(initialMessage.data);
    }
  }

  /// Requests user permission for push notifications (iOS/Android 13+).
  Future<bool> requestPermission() async {
    try {
      final settings = await _fcm.requestPermission(
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        criticalAlert: false,
        provisional: false,
        sound: true,
      );

      final isAuthorized =
          settings.authorizationStatus == AuthorizationStatus.authorized ||
              settings.authorizationStatus == AuthorizationStatus.provisional;
      return isAuthorized;
    } catch (e) {
      debugPrint('Error requesting notification permission: $e');
      return false;
    }
  }

  /// Retrieves the unique FCM device registration token.
  Future<String?> getFcmToken() async {
    try {
      return await _fcm.getToken();
    } catch (e) {
      debugPrint('Error fetching FCM token: $e');
      return null;
    }
  }

  /// Sets up Android and iOS local notifications plugin and notification channel.
  Future<void> setupLocalNotifications() async {
    const androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        if (response.payload != null && response.payload!.isNotEmpty) {
          try {
            final data = jsonDecode(response.payload!) as Map<String, dynamic>;
            handleNotificationTap(data);
          } catch (e) {
            debugPrint('Error parsing notification payload: $e');
          }
        }
      },
    );

    // Create high importance Android notification channel
    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(_defaultChannel);
  }

  /// Handles incoming FCM notification while app is in the foreground.
  Future<void> handleForegroundMessage(RemoteMessage message) async {
    final notification = message.notification;
    final title = notification?.title ?? message.data['title'] ?? 'KAMZO Update';
    final body = notification?.body ?? message.data['body'] ?? '';

    await showLocalNotification(
      title: title,
      body: body,
      data: message.data,
    );
  }

  /// Handles notification tap and executes navigation callbacks based on type.
  void handleNotificationTap(Map<String, dynamic> data) {
    debugPrint('Notification tapped with payload: $data');

    if (_onNotificationTap != null) {
      _onNotificationTap!(data);
      return;
    }

    final type = data['type'] as String?;
    final bookingId = data['booking_id'] as String?;
    final conversationId = data['conversation_id'] as String?;

    debugPrint('Default notification tap action: type=$type, bookingId=$bookingId, convId=$conversationId');
  }

  /// Displays an immediate local heads-up notification with KAMZO brand styling.
  Future<void> showLocalNotification({
    required String title,
    required String body,
    Map<String, dynamic>? data,
  }) async {
    final androidDetails = AndroidNotificationDetails(
      _defaultChannel.id,
      _defaultChannel.name,
      channelDescription: _defaultChannel.description,
      importance: Importance.max,
      priority: Priority.high,
      color: AppColors.primaryGreen,
      playSound: true,
      icon: '@mipmap/ic_launcher',
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    final details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    final notificationId = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    final payload = data != null ? jsonEncode(data) : null;

    await _localNotifications.show(
      notificationId,
      title,
      body,
      details,
      payload: payload,
    );
  }
}
