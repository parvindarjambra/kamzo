import 'package:equatable/equatable.dart';
import '../constants/app_constants.dart';

/// Worker profile model representing `worker_profiles` table.
class WorkerProfileModel extends Equatable {
  final String id;
  final String userId;
  final List<String> serviceCategoryIds;
  final int experienceYears;
  final String? bio;
  final double rating;
  final int totalReviews;
  final int completedJobsCount;
  final double acceptanceRate;
  final String level; // 'bronze', 'silver', 'gold', 'platinum'
  final double currentCommissionRate; // percentage, e.g. 10.0
  final bool isOnline;
  final bool isAvailable;
  final double? currentLocationLatitude;
  final double? currentLocationLongitude;
  final String? policeVerificationUrl;
  final String verificationStatus; // 'pending', 'approved', 'rejected'
  final String? rejectionReason;
  final double walletBalance;
  final double pendingCommission;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const WorkerProfileModel({
    required this.id,
    required this.userId,
    this.serviceCategoryIds = const [],
    this.experienceYears = 1,
    this.bio,
    this.rating = 5.0,
    this.totalReviews = 0,
    this.completedJobsCount = 0,
    this.acceptanceRate = 100.0,
    this.level = WorkerLevel.bronze,
    this.currentCommissionRate = 10.0,
    this.isOnline = false,
    this.isAvailable = true,
    this.currentLocationLatitude,
    this.currentLocationLongitude,
    this.policeVerificationUrl,
    this.verificationStatus = 'pending',
    this.rejectionReason,
    this.walletBalance = 0.0,
    this.pendingCommission = 0.0,
    this.createdAt,
    this.updatedAt,
  });

  bool get isApproved => verificationStatus == 'approved';
  bool get isPendingVerification => verificationStatus == 'pending';
  bool get isRejected => verificationStatus == 'rejected';

  String get levelLabel => WorkerLevel.label(level);

  String get displayRating => rating.toStringAsFixed(1);

  String get formattedWalletBalance =>
      '${AppConstants.currencySymbol} ${walletBalance.toStringAsFixed(0)}';

  String get formattedPendingCommission =>
      '${AppConstants.currencySymbol} ${pendingCommission.toStringAsFixed(0)}';

  factory WorkerProfileModel.fromJson(Map<String, dynamic> json) {
    List<String> parseCategoryIds(dynamic raw) {
      if (raw is List) {
        return raw.map((e) => e.toString()).toList();
      }
      return [];
    }

    return WorkerProfileModel(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      serviceCategoryIds: parseCategoryIds(json['service_category_ids']),
      experienceYears: json['experience_years'] as int? ?? 1,
      bio: json['bio'] as String?,
      rating: (json['rating'] as num?)?.toDouble() ?? 5.0,
      totalReviews: json['total_reviews'] as int? ?? 0,
      completedJobsCount: json['completed_jobs_count'] as int? ?? 0,
      acceptanceRate: (json['acceptance_rate'] as num?)?.toDouble() ?? 100.0,
      level: json['level'] as String? ?? WorkerLevel.bronze,
      currentCommissionRate:
          (json['current_commission_rate'] as num?)?.toDouble() ?? 10.0,
      isOnline: json['is_online'] as bool? ?? false,
      isAvailable: json['is_available'] as bool? ?? true,
      currentLocationLatitude:
          (json['current_location_latitude'] as num?)?.toDouble(),
      currentLocationLongitude:
          (json['current_location_longitude'] as num?)?.toDouble(),
      policeVerificationUrl: json['police_verification_url'] as String?,
      verificationStatus: json['verification_status'] as String? ?? 'pending',
      rejectionReason: json['rejection_reason'] as String?,
      walletBalance: (json['wallet_balance'] as num?)?.toDouble() ?? 0.0,
      pendingCommission:
          (json['pending_commission'] as num?)?.toDouble() ?? 0.0,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'] as String)
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'service_category_ids': serviceCategoryIds,
      'experience_years': experienceYears,
      'bio': bio,
      'rating': rating,
      'total_reviews': totalReviews,
      'completed_jobs_count': completedJobsCount,
      'acceptance_rate': acceptanceRate,
      'level': level,
      'current_commission_rate': currentCommissionRate,
      'is_online': isOnline,
      'is_available': isAvailable,
      'current_location_latitude': currentLocationLatitude,
      'current_location_longitude': currentLocationLongitude,
      'police_verification_url': policeVerificationUrl,
      'verification_status': verificationStatus,
      'rejection_reason': rejectionReason,
      'wallet_balance': walletBalance,
      'pending_commission': pendingCommission,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  WorkerProfileModel copyWith({
    String? id,
    String? userId,
    List<String>? serviceCategoryIds,
    int? experienceYears,
    String? bio,
    double? rating,
    int? totalReviews,
    int? completedJobsCount,
    double? acceptanceRate,
    String? level,
    double? currentCommissionRate,
    bool? isOnline,
    bool? isAvailable,
    double? currentLocationLatitude,
    double? currentLocationLongitude,
    String? policeVerificationUrl,
    String? verificationStatus,
    String? rejectionReason,
    double? walletBalance,
    double? pendingCommission,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return WorkerProfileModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      serviceCategoryIds: serviceCategoryIds ?? this.serviceCategoryIds,
      experienceYears: experienceYears ?? this.experienceYears,
      bio: bio ?? this.bio,
      rating: rating ?? this.rating,
      totalReviews: totalReviews ?? this.totalReviews,
      completedJobsCount: completedJobsCount ?? this.completedJobsCount,
      acceptanceRate: acceptanceRate ?? this.acceptanceRate,
      level: level ?? this.level,
      currentCommissionRate:
          currentCommissionRate ?? this.currentCommissionRate,
      isOnline: isOnline ?? this.isOnline,
      isAvailable: isAvailable ?? this.isAvailable,
      currentLocationLatitude:
          currentLocationLatitude ?? this.currentLocationLatitude,
      currentLocationLongitude:
          currentLocationLongitude ?? this.currentLocationLongitude,
      policeVerificationUrl:
          policeVerificationUrl ?? this.policeVerificationUrl,
      verificationStatus: verificationStatus ?? this.verificationStatus,
      rejectionReason: rejectionReason ?? this.rejectionReason,
      walletBalance: walletBalance ?? this.walletBalance,
      pendingCommission: pendingCommission ?? this.pendingCommission,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        userId,
        serviceCategoryIds,
        experienceYears,
        bio,
        rating,
        totalReviews,
        completedJobsCount,
        acceptanceRate,
        level,
        currentCommissionRate,
        isOnline,
        isAvailable,
        currentLocationLatitude,
        currentLocationLongitude,
        policeVerificationUrl,
        verificationStatus,
        rejectionReason,
        walletBalance,
        pendingCommission,
        createdAt,
        updatedAt,
      ];
}
