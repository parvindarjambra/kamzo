import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';
import '../../features/splash/splash_screen.dart';
import '../../features/onboarding/onboarding_screen.dart';
import '../../features/auth/auth_screens.dart';
import '../../features/customer/customer_screens.dart';
import '../../features/worker/worker_screens.dart';

/// Provider exposing the configured GoRouter instance with role-based navigation.
final appRouterProvider = Provider<GoRouter>((ref) {
  final authNotifier = ref.read(authNotifierProvider.notifier);

  return GoRouter(
    initialLocation: '/',
    refreshListenable: authNotifier,
    redirect: (BuildContext context, GoRouterState state) {
      final authState = ref.read(authNotifierProvider);
      final isLoggedIn = authState.isAuthenticated;
      final isAuthLoading = authState.isLoading;
      final currentLoc = state.matchedLocation;

      // Let splash screen complete initial check
      if (currentLoc == '/') {
        return null;
      }

      final isAuthRoute = currentLoc.startsWith('/auth') || currentLoc == '/onboarding';

      if (!isLoggedIn) {
        // If not logged in and not on auth/onboarding routes, redirect to login
        if (!isAuthRoute && !isAuthLoading) {
          return '/auth/login';
        }
        return null;
      }

      // If logged in and on an auth or onboarding page, redirect to appropriate home
      if (isAuthRoute) {
        if (authState.isWorker) {
          return '/worker/home';
        } else {
          return '/customer/home';
        }
      }

      // Prevent customer from accessing worker routes
      if (currentLoc.startsWith('/worker') && !authState.isWorker && !authState.isAdmin) {
        return '/customer/home';
      }

      // Prevent worker from accessing customer booking creation directly
      if (currentLoc == '/customer/booking/new' && authState.isWorker) {
        return '/worker/home';
      }

      return null;
    },
    routes: [
      // ----------------------------------------------------
      // Core & Onboarding Routes
      // ----------------------------------------------------
      GoRoute(
        path: '/',
        name: 'splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/onboarding',
        name: 'onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),

      // ----------------------------------------------------
      // Auth Routes
      // ----------------------------------------------------
      GoRoute(
        path: '/auth/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/auth/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/auth/register-worker',
        name: 'register_worker',
        builder: (context, state) => const RegisterWorkerScreen(),
      ),

      // ----------------------------------------------------
      // Customer Routes
      // ----------------------------------------------------
      GoRoute(
        path: '/customer/home',
        name: 'customer_home',
        builder: (context, state) => const CustomerHomeScreen(),
      ),
      GoRoute(
        path: '/customer/service/:serviceId',
        name: 'customer_service_detail',
        builder: (context, state) {
          final serviceId = state.pathParameters['serviceId'] ?? '';
          return ServiceDetailScreen(serviceId: serviceId);
        },
      ),
      GoRoute(
        path: '/customer/booking/new',
        name: 'customer_booking_new',
        builder: (context, state) => const NewBookingScreen(),
      ),
      GoRoute(
        path: '/customer/booking/:bookingId',
        name: 'customer_booking_detail',
        builder: (context, state) {
          final bookingId = state.pathParameters['bookingId'] ?? '';
          return BookingDetailScreen(bookingId: bookingId);
        },
      ),
      GoRoute(
        path: '/customer/booking/:bookingId/payment',
        name: 'customer_booking_payment',
        builder: (context, state) {
          final bookingId = state.pathParameters['bookingId'] ?? '';
          return CustomerPaymentScreen(bookingId: bookingId);
        },
      ),
      GoRoute(
        path: '/customer/booking/:bookingId/chat',
        name: 'customer_booking_chat',
        builder: (context, state) {
          final bookingId = state.pathParameters['bookingId'] ?? '';
          return CustomerChatScreen(bookingId: bookingId);
        },
      ),
      GoRoute(
        path: '/customer/profile',
        name: 'customer_profile',
        builder: (context, state) => const CustomerProfileScreen(),
      ),
      GoRoute(
        path: '/customer/history',
        name: 'customer_history',
        builder: (context, state) => const BookingHistoryScreen(),
      ),

      // ----------------------------------------------------
      // Worker Routes
      // ----------------------------------------------------
      GoRoute(
        path: '/worker/home',
        name: 'worker_home',
        builder: (context, state) => const WorkerHomeScreen(),
      ),
      GoRoute(
        path: '/worker/jobs',
        name: 'worker_jobs',
        builder: (context, state) => const WorkerJobsScreen(),
      ),
      GoRoute(
        path: '/worker/job/:bookingId',
        name: 'worker_job_detail',
        builder: (context, state) {
          final bookingId = state.pathParameters['bookingId'] ?? '';
          return WorkerJobDetailScreen(bookingId: bookingId);
        },
      ),
      GoRoute(
        path: '/worker/job/:bookingId/chat',
        name: 'worker_job_chat',
        builder: (context, state) {
          final bookingId = state.pathParameters['bookingId'] ?? '';
          return WorkerChatScreen(bookingId: bookingId);
        },
      ),
      GoRoute(
        path: '/worker/profile',
        name: 'worker_profile',
        builder: (context, state) => const WorkerProfileScreen(),
      ),
      GoRoute(
        path: '/worker/commission',
        name: 'worker_commission',
        builder: (context, state) => const WorkerCommissionScreen(),
      ),
      GoRoute(
        path: '/worker/levels',
        name: 'worker_levels',
        builder: (context, state) => const WorkerLevelsScreen(),
      ),
      GoRoute(
        path: '/worker/bonuses',
        name: 'worker_bonuses',
        builder: (context, state) => const WorkerBonusesScreen(),
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(title: const Text('Page Not Found')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: AppColors.error),
            const SizedBox(height: 16),
            Text('No route defined for ${state.matchedLocation}'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    ),
  );
});
