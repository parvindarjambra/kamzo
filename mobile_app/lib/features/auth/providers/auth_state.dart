import '../../../core/models/profile_model.dart';

/// State representation for authentication and current active user profile.
class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final String? userId;
  final String? role; // 'customer', 'worker', 'admin'
  final Map<String, dynamic>? profile;
  final String? error;

  const AuthState({
    this.isLoading = false,
    this.isAuthenticated = false,
    this.userId,
    this.role,
    this.profile,
    this.error,
  });

  /// Initial unauthenticated state
  factory AuthState.initial() => const AuthState();

  /// Loading state
  factory AuthState.loading() => const AuthState(isLoading: true);

  /// Authenticated state helper
  factory AuthState.authenticated({
    required String userId,
    required String role,
    Map<String, dynamic>? profile,
  }) {
    return AuthState(
      isLoading: false,
      isAuthenticated: true,
      userId: userId,
      role: role,
      profile: profile,
    );
  }

  /// Unauthenticated state helper
  factory AuthState.unauthenticated({String? error}) {
    return AuthState(
      isLoading: false,
      isAuthenticated: false,
      error: error,
    );
  }

  bool get isCustomer => role == 'customer';
  bool get isWorker => role == 'worker';
  bool get isAdmin => role == 'admin';
  bool get hasError => error != null && error!.isNotEmpty;

  /// Typed helper to retrieve parsed [ProfileModel] from the raw JSON profile map.
  ProfileModel? get profileModel =>
      profile != null ? ProfileModel.fromJson(profile!) : null;

  AuthState copyWith({
    bool? isLoading,
    bool? isAuthenticated,
    String? userId,
    String? role,
    Map<String, dynamic>? profile,
    String? error,
    bool clearError = false,
    bool clearProfile = false,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      userId: userId ?? this.userId,
      role: role ?? this.role,
      profile: clearProfile ? null : (profile ?? this.profile),
      error: clearError ? null : (error ?? this.error),
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthState &&
          runtimeType == other.runtimeType &&
          isLoading == other.isLoading &&
          isAuthenticated == other.isAuthenticated &&
          userId == other.userId &&
          role == other.role &&
          error == other.error;

  @override
  int get hashCode =>
      isLoading.hashCode ^
      isAuthenticated.hashCode ^
      userId.hashCode ^
      role.hashCode ^
      error.hashCode;

  @override
  String toString() {
    return 'AuthState(isLoading: $isLoading, isAuthenticated: $isAuthenticated, userId: $userId, role: $role, error: $error)';
  }
}
