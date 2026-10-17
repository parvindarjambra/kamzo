import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart' as sb;
import '../../../core/constants/app_constants.dart';
import '../../../core/utils/supabase_client.dart';
import 'auth_state.dart';

/// Riverpod provider for AuthNotifier state
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(supabase);
});

/// Convenience provider for current user ID
final currentUserIdProvider = Provider<String?>((ref) {
  return ref.watch(authProvider).userId;
});

/// Convenience provider for current user role ('customer', 'worker', 'admin')
final userRoleProvider = Provider<String?>((ref) {
  return ref.watch(authProvider).role;
});

/// AuthNotifier manages authentication state, Supabase auth operations,
/// user profile fetching, and role determination for KAMZO.
class AuthNotifier extends StateNotifier<AuthState> {
  final sb.SupabaseClient _client;
  StreamSubscription<sb.AuthState>? _authSubscription;

  AuthNotifier([sb.SupabaseClient? client])
      : _client = client ?? supabase,
        super(AuthState.initial()) {
    _initializeAuthListener();
  }

  /// Sets up reactive listener for Supabase authentication events
  void _initializeAuthListener() {
    // Check initial session
    final currentSession = _client.auth.currentSession;
    if (currentSession != null && currentSession.user.id.isNotEmpty) {
      state = state.copyWith(
        isLoading: true,
        isAuthenticated: true,
        userId: currentSession.user.id,
      );
      getCurrentProfile();
    }

    _authSubscription = _client.auth.onAuthStateChange.listen(
      (data) async {
        final sb.AuthChangeEvent event = data.event;
        final sb.Session? session = data.session;

        switch (event) {
          case sb.AuthChangeEvent.signedIn:
          case sb.AuthChangeEvent.tokenRefreshed:
          case sb.AuthChangeEvent.userUpdated:
            if (session?.user != null) {
              final userId = session!.user.id;
              state = state.copyWith(
                isAuthenticated: true,
                userId: userId,
                isLoading: false,
                clearError: true,
              );
              await getCurrentProfile();
            }
            break;
          case sb.AuthChangeEvent.signedOut:
            state = AuthState.unauthenticated();
            break;
          case sb.AuthChangeEvent.passwordRecovery:
          case sb.AuthChangeEvent.mfaChallengeVerified:
          case sb.AuthChangeEvent.initialSession:
            if (session?.user != null) {
              state = state.copyWith(
                isAuthenticated: true,
                userId: session!.user.id,
              );
              await getCurrentProfile();
            }
            break;
        }
      },
      onError: (error) {
        debugPrint('Auth listener error: $error');
        state = state.copyWith(
          isLoading: false,
          error: error.toString(),
        );
      },
    );
  }

  /// Sign in with either Email or Pakistani Mobile Number and password
  Future<bool> signIn(String phoneOrEmail, String password) async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final input = phoneOrEmail.trim();
      sb.AuthResponse response;

      if (input.contains('@')) {
        // Email sign-in
        response = await _client.auth.signInWithPassword(
          email: input,
          password: password,
        );
      } else {
        // Phone sign-in: Normalize phone number with Pakistani country code
        String formattedPhone = input.replaceAll(RegExp(r'[\s\-]'), '');
        if (formattedPhone.startsWith('03')) {
          formattedPhone = '+92${formattedPhone.substring(1)}';
        } else if (formattedPhone.startsWith('923')) {
          formattedPhone = '+$formattedPhone';
        } else if (!formattedPhone.startsWith('+')) {
          formattedPhone = '+92$formattedPhone';
        }

        response = await _client.auth.signInWithPassword(
          phone: formattedPhone,
          password: password,
        );
      }

      if (response.user != null) {
        state = state.copyWith(
          isAuthenticated: true,
          userId: response.user!.id,
          isLoading: false,
          clearError: true,
        );
        await getCurrentProfile();
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          error: 'Sign in failed. Please check your credentials.',
        );
        return false;
      }
    } catch (e) {
      debugPrint('SignIn error: $e');
      state = state.copyWith(
        isLoading: false,
        error: _parseAuthError(e),
      );
      return false;
    }
  }

  /// Register a new account as either customer or worker
  Future<bool> signUp({
    required String email,
    required String password,
    required String fullName,
    required String phone,
    required String role,
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      // Normalize phone number
      String formattedPhone = phone.replaceAll(RegExp(r'[\s\-]'), '');
      if (formattedPhone.startsWith('03')) {
        formattedPhone = '+92${formattedPhone.substring(1)}';
      } else if (!formattedPhone.startsWith('+92') && !formattedPhone.startsWith('+')) {
        formattedPhone = '+92$formattedPhone';
      }

      final response = await _client.auth.signUp(
        email: email.trim(),
        password: password,
        data: {
          'full_name': fullName.trim(),
          'phone': formattedPhone,
          'role': role,
        },
      );

      final user = response.user;
      if (user != null) {
        // Upsert into public.profiles table
        await _client.from(SupabaseTables.profiles).upsert({
          'id': user.id,
          'email': email.trim(),
          'phone': formattedPhone,
          'full_name': fullName.trim(),
          'role': role,
          'is_active': true,
          'updated_at': DateTime.now().toIso8601String(),
        });

        // If worker role, create initial worker_profile row
        if (role == UserRoles.worker) {
          await _client.from(SupabaseTables.workerProfiles).upsert({
            'user_id': user.id,
            'level': WorkerLevel.bronze,
            'verification_status': 'pending',
            'is_online': false,
            'is_available': true,
            'rating': 5.0,
            'total_reviews': 0,
            'completed_jobs_count': 0,
            'current_commission_rate': 10.0,
            'updated_at': DateTime.now().toIso8601String(),
          });
        }

        state = state.copyWith(
          isAuthenticated: true,
          userId: user.id,
          role: role,
          isLoading: false,
          clearError: true,
        );

        await getCurrentProfile();
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          error: 'Sign up failed. Please try again.',
        );
        return false;
      }
    } catch (e) {
      debugPrint('SignUp error: $e');
      state = state.copyWith(
        isLoading: false,
        error: _parseAuthError(e),
      );
      return false;
    }
  }

  /// Sign out current session and reset local auth state
  Future<void> signOut() async {
    state = state.copyWith(isLoading: true);
    try {
      await _client.auth.signOut();
      state = AuthState.unauthenticated();
    } catch (e) {
      debugPrint('SignOut error: $e');
      state = AuthState.unauthenticated(error: e.toString());
    }
  }

  /// Updates Firebase Cloud Messaging (FCM) push token in user's profile
  Future<void> updateFcmToken(String token) async {
    final userId = state.userId ?? _client.auth.currentUser?.id;
    if (userId == null) return;

    try {
      await _client.from(SupabaseTables.profiles).update({
        'fcm_token': token,
        'updated_at': DateTime.now().toIso8601String(),
      }).eq('id', userId);

      if (state.profile != null) {
        final updatedMap = Map<String, dynamic>.from(state.profile!);
        updatedMap['fcm_token'] = token;
        state = state.copyWith(profile: updatedMap);
      }
    } catch (e) {
      debugPrint('Error updating FCM token: $e');
    }
  }

  /// Fetches latest profile record from `profiles` table and detects role
  Future<Map<String, dynamic>?> getCurrentProfile() async {
    final userId = state.userId ?? _client.auth.currentUser?.id;
    if (userId == null) return null;

    try {
      final response = await _client
          .from(SupabaseTables.profiles)
          .select()
          .eq('id', userId)
          .maybeSingle();

      if (response != null) {
        final profileMap = Map<String, dynamic>.from(response);
        final detectedRole = profileMap['role'] as String? ?? UserRoles.customer;

        state = state.copyWith(
          profile: profileMap,
          role: detectedRole,
          isAuthenticated: true,
          userId: userId,
          isLoading: false,
          clearError: true,
        );

        return profileMap;
      }
      return null;
    } catch (e) {
      debugPrint('Error fetching current profile: $e');
      state = state.copyWith(
        isLoading: false,
        error: 'Failed to load profile details.',
      );
      return null;
    }
  }

  String _parseAuthError(dynamic error) {
    if (error is sb.AuthException) {
      return error.message;
    }
    final str = error.toString();
    if (str.contains('Invalid login credentials')) {
      return 'Incorrect email/phone or password.';
    }
    if (str.contains('User already registered')) {
      return 'An account with this email or phone already exists.';
    }
    return str.replaceAll('Exception:', '').trim();
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    super.dispose();
  }
}
