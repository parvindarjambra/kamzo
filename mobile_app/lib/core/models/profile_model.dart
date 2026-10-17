import 'package:equatable/equatable.dart';

/// User profile model representing Supabase `profiles` table.
class ProfileModel extends Equatable {
  final String id;
  final String email;
  final String? phone;
  final String fullName;
  final String? avatarUrl;
  final String role; // 'customer', 'worker', 'admin'
  final String? city;
  final String? address;
  final String? cnicNumber;
  final String? cnicFrontUrl;
  final String? cnicBackUrl;
  final bool isVerified;
  final bool isActive;
  final String? fcmToken;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const ProfileModel({
    required this.id,
    required this.email,
    this.phone,
    required this.fullName,
    this.avatarUrl,
    this.role = 'customer',
    this.city,
    this.address,
    this.cnicNumber,
    this.cnicFrontUrl,
    this.cnicBackUrl,
    this.isVerified = false,
    this.isActive = true,
    this.fcmToken,
    this.createdAt,
    this.updatedAt,
  });

  bool get isCustomer => role == 'customer';
  bool get isWorker => role == 'worker';
  bool get isAdmin => role == 'admin';

  factory ProfileModel.fromJson(Map<String, dynamic> json) {
    return ProfileModel(
      id: json['id'] as String,
      email: json['email'] as String? ?? '',
      phone: json['phone'] as String?,
      fullName: json['full_name'] as String? ?? json['name'] as String? ?? '',
      avatarUrl: json['avatar_url'] as String?,
      role: json['role'] as String? ?? 'customer',
      city: json['city'] as String?,
      address: json['address'] as String?,
      cnicNumber: json['cnic_number'] as String?,
      cnicFrontUrl: json['cnic_front_url'] as String?,
      cnicBackUrl: json['cnic_back_url'] as String?,
      isVerified: json['is_verified'] as bool? ?? false,
      isActive: json['is_active'] as bool? ?? true,
      fcmToken: json['fcm_token'] as String?,
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
      'email': email,
      'phone': phone,
      'full_name': fullName,
      'avatar_url': avatarUrl,
      'role': role,
      'city': city,
      'address': address,
      'cnic_number': cnicNumber,
      'cnic_front_url': cnicFrontUrl,
      'cnic_back_url': cnicBackUrl,
      'is_verified': isVerified,
      'is_active': isActive,
      'fcm_token': fcmToken,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  ProfileModel copyWith({
    String? id,
    String? email,
    String? phone,
    String? fullName,
    String? avatarUrl,
    String? role,
    String? city,
    String? address,
    String? cnicNumber,
    String? cnicFrontUrl,
    String? cnicBackUrl,
    bool? isVerified,
    bool? isActive,
    String? fcmToken,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ProfileModel(
      id: id ?? this.id,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      fullName: fullName ?? this.fullName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      role: role ?? this.role,
      city: city ?? this.city,
      address: address ?? this.address,
      cnicNumber: cnicNumber ?? this.cnicNumber,
      cnicFrontUrl: cnicFrontUrl ?? this.cnicFrontUrl,
      cnicBackUrl: cnicBackUrl ?? this.cnicBackUrl,
      isVerified: isVerified ?? this.isVerified,
      isActive: isActive ?? this.isActive,
      fcmToken: fcmToken ?? this.fcmToken,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        email,
        phone,
        fullName,
        avatarUrl,
        role,
        city,
        address,
        cnicNumber,
        cnicFrontUrl,
        cnicBackUrl,
        isVerified,
        isActive,
        fcmToken,
        createdAt,
        updatedAt,
      ];
}
