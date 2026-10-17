import 'package:supabase_flutter/supabase_flutter.dart';

/// Global access to the initialized Supabase client instance.
SupabaseClient get supabase => Supabase.instance.client;

/// Helper extensions for convenient auth & database access.
extension SupabaseClientX on SupabaseClient {
  /// Current authenticated user (null if not logged in).
  User? get currentUser => auth.currentUser;

  /// Current authenticated user ID (null if not logged in).
  String? get currentUserId => auth.currentUser?.id;

  /// Check whether user is currently authenticated.
  bool get isAuthenticated => auth.currentUser != null;

  /// Stream of Supabase Auth state changes.
  Stream<AuthState> get onAuthStateChange => auth.onAuthStateChange;
}
