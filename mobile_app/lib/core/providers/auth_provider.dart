import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../constants/app_constants.dart';
import '../models/profile_model.dart';
import '../utils/supabase_client.dart';

/// State of authentication and user profile
class AuthStateModel {
  final User? user;
  final ProfileModel? profile;
  final bool isLoading;
  final String? errorMessage;

  const AuthStateModel({
    this.user,
    this.profile,
    this.isLoading = false,
    this.errorMessage,
  });

  bool get isAuthenticated => user != null;
  bool get isCustomer => profile?.isCustomer ?? (user != null);
  bool get isWorker => profile?.isWorker ?? false;
  bool get isAdmin => profile?.isAdmin ?? false;

  AuthStateModel copyWith({
    User? user,
    ProfileModel? profile,
    bool? isLoading,
    String? errorMessage,
  }) {
    return AuthStateModel(
      user: user ?? this.user,
      profile: profile ?? this.profile,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}

/// AuthNotifier listening to Supabase auth events and fetching user profiles
class AuthNotifier extends StateNotifier<AuthStateModel> with ChangeNotifier {
  StreamSubscription<AuthState>? _authSubscription;

  AuthNotifier() : super(const AuthStateModel(isLoading: true)) {
    _initialize();
  }

  void _initialize() {
    final currentSession = supabase.auth.currentSession;
    if (currentSession != null) {
      state = state.copyWith(user: currentSession.user);
      _fetchProfile(currentSession.user.id);
    } else {
      state = const AuthStateModel(isLoading: false);
      notifyListeners();
    }

    _authSubscription = supabase.auth.onAuthStateChange.listen((data) async {
      final session = data.session;
      if (session != null) {
        state = state.copyWith(user: session.user);
        await _fetchProfile(session.user.id);
      } else {
        state = const AuthStateModel(isLoading: false);
        notifyListeners();
      }
    });
  }

  Future<void> _fetchProfile(String userId) async {
    try {
      final response = await supabase
          .from(SupabaseTables.profiles)
          .select()
          .eq('id', userId)
          .maybeSingle();

      if (response != null) {
        final profile = ProfileModel.fromJson(response);
        state = state.copyWith(profile: profile, isLoading: false);
      } else {
        state = state.copyWith(isLoading: false);
      }
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    } finally {
      notifyListeners();
    }
  }

  Future<void> signOut() async {
    try {
      await supabase.auth.signOut();
      state = const AuthStateModel(isLoading: false);
      notifyListeners();
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
    }
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    super.dispose();
  }
}

/// Global provider for Auth state
final authNotifierProvider =
    StateNotifierProvider<AuthNotifier, AuthStateModel>((ref) {
  return AuthNotifier();
});
