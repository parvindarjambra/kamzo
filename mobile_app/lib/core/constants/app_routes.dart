class AppRoutes {
  AppRoutes._();

  // Auth routes
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';

  // Customer routes
  static const String customerHome = '/customer/home';
  static const String serviceSelection = '/customer/service-selection';
  static const String locationSelection = '/customer/location-selection';
  static const String bookingConfirmation = '/customer/booking-confirmation';
  static const String payment = '/customer/payment';
  static const String bookingTracking = '/customer/booking-tracking';
  static const String finalBill = '/customer/final-bill';
  static const String review = '/customer/review';
  static const String bookingHistory = '/customer/booking-history';
  static const String profile = '/customer/profile';

  // Worker routes
  static const String workerRegister = '/worker/register';
}
