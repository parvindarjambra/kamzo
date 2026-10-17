import 'package:equatable/equatable.dart';
import '../constants/app_constants.dart';

/// Service model representing available home services (Electrician, AC Repair, Plumbing, etc.)
class ServiceModel extends Equatable {
  final String id;
  final String categoryId;
  final String? categoryName;
  final String nameEnglish;
  final String? nameUrdu;
  final String slug;
  final String? description;
  final double basePrice;
  final String priceType; // 'fixed', 'hourly', 'starting_at', 'inspection_fee'
  final int durationMinutes;
  final String? iconUrl;
  final String? imageUrl;
  final bool isActive;
  final bool isFeatured;
  final int sortOrder;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  const ServiceModel({
    required this.id,
    required this.categoryId,
    this.categoryName,
    required this.nameEnglish,
    this.nameUrdu,
    required this.slug,
    this.description,
    required this.basePrice,
    this.priceType = 'fixed',
    this.durationMinutes = 60,
    this.iconUrl,
    this.imageUrl,
    this.isActive = true,
    this.isFeatured = false,
    this.sortOrder = 0,
    this.createdAt,
    this.updatedAt,
  });

  /// Formatted PKR price e.g. "Rs. 1,500" or "Rs. 800 / hr"
  String get formattedPrice {
    final formattedNumber = basePrice.toStringAsFixed(basePrice.truncateToDouble() == basePrice ? 0 : 2);
    switch (priceType) {
      case 'hourly':
        return '${AppConstants.currencySymbol} $formattedNumber / hr';
      case 'starting_at':
        return 'From ${AppConstants.currencySymbol} $formattedNumber';
      case 'inspection_fee':
        return '${AppConstants.currencySymbol} $formattedNumber (Inspection)';
      default:
        return '${AppConstants.currencySymbol} $formattedNumber';
    }
  }

  /// Formatted duration string
  String get displayDuration {
    if (durationMinutes < 60) {
      return '$durationMinutes mins';
    } else {
      final hours = durationMinutes ~/ 60;
      final mins = durationMinutes % 60;
      return mins > 0 ? '$hours hr $mins mins' : '$hours hr';
    }
  }

  factory ServiceModel.fromJson(Map<String, dynamic> json) {
    return ServiceModel(
      id: json['id'] as String,
      categoryId: json['category_id'] as String,
      categoryName: json['category_name'] as String?,
      nameEnglish: json['name_english'] as String? ?? json['name'] as String? ?? '',
      nameUrdu: json['name_urdu'] as String?,
      slug: json['slug'] as String? ?? '',
      description: json['description'] as String?,
      basePrice: (json['base_price'] as num?)?.toDouble() ?? 0.0,
      priceType: json['price_type'] as String? ?? 'fixed',
      durationMinutes: json['duration_minutes'] as int? ?? 60,
      iconUrl: json['icon_url'] as String?,
      imageUrl: json['image_url'] as String?,
      isActive: json['is_active'] as bool? ?? true,
      isFeatured: json['is_featured'] as bool? ?? false,
      sortOrder: json['sort_order'] as int? ?? 0,
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
      'category_id': categoryId,
      'category_name': categoryName,
      'name_english': nameEnglish,
      'name_urdu': nameUrdu,
      'slug': slug,
      'description': description,
      'base_price': basePrice,
      'price_type': priceType,
      'duration_minutes': durationMinutes,
      'icon_url': iconUrl,
      'image_url': imageUrl,
      'is_active': isActive,
      'is_featured': isFeatured,
      'sort_order': sortOrder,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  ServiceModel copyWith({
    String? id,
    String? categoryId,
    String? categoryName,
    String? nameEnglish,
    String? nameUrdu,
    String? slug,
    String? description,
    double? basePrice,
    String? priceType,
    int? durationMinutes,
    String? iconUrl,
    String? imageUrl,
    bool? isActive,
    bool? isFeatured,
    int? sortOrder,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ServiceModel(
      id: id ?? this.id,
      categoryId: categoryId ?? this.categoryId,
      categoryName: categoryName ?? this.categoryName,
      nameEnglish: nameEnglish ?? this.nameEnglish,
      nameUrdu: nameUrdu ?? this.nameUrdu,
      slug: slug ?? this.slug,
      description: description ?? this.description,
      basePrice: basePrice ?? this.basePrice,
      priceType: priceType ?? this.priceType,
      durationMinutes: durationMinutes ?? this.durationMinutes,
      iconUrl: iconUrl ?? this.iconUrl,
      imageUrl: imageUrl ?? this.imageUrl,
      isActive: isActive ?? this.isActive,
      isFeatured: isFeatured ?? this.isFeatured,
      sortOrder: sortOrder ?? this.sortOrder,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [
        id,
        categoryId,
        categoryName,
        nameEnglish,
        nameUrdu,
        slug,
        description,
        basePrice,
        priceType,
        durationMinutes,
        iconUrl,
        imageUrl,
        isActive,
        isFeatured,
        sortOrder,
        createdAt,
        updatedAt,
      ];
}
