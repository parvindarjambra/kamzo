import 'package:go_router/go_router.dart';
import '../../features/auth/screens/worker_register_screen.dart';
import '../../features/chat/screens/chat_screen.dart';
import '../../features/notifications/screens/notifications_screen.dart';
import '../../features/worker/screens/job_detail_screen.dart';
import '../../features/worker/screens/submit_final_bill_screen.dart';
import '../../features/worker/screens/worker_bonuses_screen.dart';
import '../../features/worker/screens/worker_commission_screen.dart';
import '../../features/worker/screens/worker_home_screen.dart';
import '../../features/worker/screens/worker_jobs_screen.dart';
import '../../features/worker/screens/worker_levels_screen.dart';
import '../../features/worker/screens/worker_profile_screen.dart';

final workerRoutes = [
  GoRoute(
    path: '/worker/register',
    builder: (context, state) => const WorkerRegisterScreen(),
  ),
  GoRoute(
    path: '/worker/home',
    builder: (context, state) => const WorkerHomeScreen(),
  ),
  GoRoute(
    path: '/worker/jobs',
    builder: (context, state) => const WorkerJobsScreen(),
  ),
  GoRoute(
    path: '/worker/job-detail',
    builder: (context, state) {
      final extra = state.extra;
      final jobId = extra is String ? extra : null;
      return JobDetailScreen(jobId: jobId);
    },
  ),
  GoRoute(
    path: '/worker/submit-bill',
    builder: (context, state) {
      final extra = state.extra;
      final bookingId = extra is String ? extra : null;
      return SubmitFinalBillScreen(bookingId: bookingId);
    },
  ),
  GoRoute(
    path: '/worker/commission',
    builder: (context, state) => const WorkerCommissionScreen(),
  ),
  GoRoute(
    path: '/worker/profile',
    builder: (context, state) => const WorkerProfileScreen(),
  ),
  GoRoute(
    path: '/worker/levels',
    builder: (context, state) => const WorkerLevelsScreen(),
  ),
  GoRoute(
    path: '/worker/bonuses',
    builder: (context, state) => const WorkerBonusesScreen(),
  ),
  GoRoute(
    path: '/chat',
    builder: (context, state) {
      final extra = state.extra;
      if (extra is Map<String, dynamic>) {
        return ChatScreen(
          bookingId: extra['booking_id'],
          otherName: extra['other_name'],
          otherPhone: extra['other_phone'],
          isPaymentVerified: extra['is_paid'] ?? true,
        );
      }
      return const ChatScreen();
    },
  ),
  GoRoute(
    path: '/notifications',
    builder: (context, state) => const NotificationsScreen(),
  ),
];
