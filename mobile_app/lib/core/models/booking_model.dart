import 'package:equatable/equatable.dart';
import '../constants/app_constants.dart';
import 'profile_model.dart';
import 'service_model.dart';

/// Booking model representing customer service requests and worker assignments.
class BookingModel extends Equatable {
  final String id;
  final String? bookingNumber;
  final String customerId;
  final String? workerId;
  final String serviceId;
  final String? categoryId;
  final String status;
  final DateTime scheduledAt;
  final DateTime? completedAt;
  final double totalAmount;
  final double commissionRate;
  final double commissionAmount;
  final String paymentMethod;
  final String paymentStatus;
  final String customerAddress;
  final String? customerCity;
  final double? customerLatitude;
  final double? customerLongitude;
  final String? customerNotes;
  final String? cancellationReason;
  final String? cancelInitiator; // 'customer', 'worker', 'admin'
  final DateTime? createdAt;
  final DateTime? updatedAt;

  // Joined relations (optional)
  final ProfileModel? customer;
  final ProfileModel? worker;
  final ServiceModel? service;

  const BookingModel({
    required this.id,
    this.bookingNumber,
    required this.customerId,
    this.workerId,
    required this.serviceId,
    this.categoryId,
    this.status = BookingStatus.pending,
    required this.scheduledAt,
    this.completedAt,
    required this.totalAmount,
    this.commissionRate = 10.0,
    this.commissionAmount = 0.0,
    this.paymentMethod = PaymentMethod.cashOnDelivery,
    this.paymentStatus = PaymentStatus.pending,
    required this.customerAddress,
    this.customerCity,
    this.customerLatitude,
    this.customerLongitude,
    this.customerNotes,
    this.cancellationReason,
    this.cancelInitiator,
    this.createdAt,
    this.updatedAt,
    this.customer,
    this.worker,
    this.service,
  });

  bool get isPending => status == BookingStatus.pending;
  bool get isAccepted => status == BookingStatus.accepted;
  bool get isWorkerAssigned => status == BookingStatus.workerAssigned;
  bool get isOnTheWay => status == BookingStatus.onTheWay;
  bool get isInProgress => status == BookingStatus.inProgress;
  bool get isCompleted => status == BookingStatus.completed;
  bool get isCancelled => status == BookingStatus.cancelled;
  bool get isRejected => status == BookingStatus.rejected;

  bool get isPaid => paymentStatus == PaymentStatus.paid;

  String get statusLabel => BookingStatus.label(status);
  String get paymentMethodLabel => PaymentMethod.label(paymentMethod);

  String get formattedTotalAmount =>
      '${AppConstants.currencySymbol} ${totalAmount.toStringAsFixed(totalAmount.truncateToDouble() == totalAmount ? 0 : 2)}';

  String get formattedCommissionAmount =>
      '${AppConstants.currencySymbol} ${commissionAmount.toStringAsFixed(commissionAmount.truncateToDouble() == commissionAmount ? 0 : 2)}';

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] as String,
      bookingNumber: json['booking_number'] as String?,
      customerId: json['customer_id'] as String,
      workerId: json['worker_id'] as String?,
      serviceId: json['service_id'] as String,
      categoryId: json['category_id'] as String?,
      status: json['status'] as String? ?? BookingStatus.pending,
      scheduledAt: json['scheduled_at'] != null
          ? DateTime.parse(json['scheduled_at'] as String)
          : DateTime.now(),
      completedAt: json['completed_at'] != null
          ? DateTime.tryParse(json['completed_at'] as String)
          : null,
      totalAmount: (json['total_amount'] as num?)?.toDouble() ?? 0.0,
      commissionRate: (json['commission_rate'] as num?)?.toDouble() ?? 10.0,
      commissionAmount: (json['commission_amount'] as num?)?.toDouble() ?? 0.0,
      paymentMethod:
          json['payment_method'] as String? ?? PaymentMethod.cashOnDelivery,
      paymentStatus:
          json['payment_status'] as String? ?? PaymentStatus.pending,
      customerAddress: json['customer_address'] as String? ?? '',
      customerCity: json['customer_city'] as String?,
      customerLatitude: (json['customer_latitude'] as num?)?.toDouble(),
      customerLongitude: (json['customer_longitude'] as num?)?.toDouble(),
      customerNotes: json['customer_notes'] as String?,
      cancellationReason: json['cancellation_reason'] as String?,
      cancelInitiator: json['cancel_initiator'] as String?,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'] as String)
          : null,
      updatedAt: json['updated_at'] != null
          ? DateTime.tryParse(json['updated_at'] as String)
          : null,
      customer: json['customer'] != null && json['customer'] is Map<String, dynamic>
          ? ProfileModel.fromJson(json['customer'] as Map<String, dynamic>)
          : null,
      worker: json['worker'] != null && json['worker'] is Map<String, dynamic>
          ? ProfileModel.fromJson(json['worker'] as Map<String, dynamic>)
          : null,
      service: json['service'] != null && json['service'] is Map<String, dynamic>
          ? ServiceModel.fromJson(json['service'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'booking_number': bookingNumber,
      'customer_id': customerId,
      'worker_id': workerId,
      'service_id': serviceId,
      'category_id': categoryId,
      'status': status,
      'scheduled_at': scheduledAt.toIso8601String(),
      'completed_at': completedAt?.toIso8601String(),
      'total_amount': totalAmount,
      'commission_rate': commissionRate,
      'commission_amount': commissionAmount,
      'payment_method': paymentMethod,
      'payment_status': paymentStatus,
      'customer_address': customerAddress,
      'customer_city': customerCity,
      'customer_latitude': customerLatitude,
      'customer_longitude': customerLongitude,
      'customer_notes': customerNotes,
      'cancellation_reason': cancellationReason,
      'cancel_initiator': cancelInitiator,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }

  BookingModel copyWith({
    String? id,
    String? bookingNumber,
    String? customerId,
    String? workerId,
    String? serviceId,
    String? categoryId,
    String? status,
    DateTime? scheduledAt,
    DateTime? completedAt,
    double? totalAmount,
    double? commissionRate,
    double? commissionAmount,
    String? paymentMethod,
    String? paymentStatus,
    String? customerAddress,
    String? customerCity,
    double? customerLatitude,
    double? customerLongitude,
    String? customerNotes,
    String? cancellationReason,
    String? cancelInitiator,
    DateTime? createdAt,
    DateTime? updatedAt,
    ProfileModel? customer,
    ProfileModel? worker,
    ServiceModel? service,
  }) {
    return BookingModel(
      id: id ?? this.id,
      bookingNumber: bookingNumber ?? this.bookingNumber,
      customerId: customerId ?? this.customerId,
      workerId: workerId ?? this.workerId,
      serviceId: serviceId ?? this.serviceId,
      categoryId: categoryId ?? this.categoryId,
      status: status ?? this.status,
      scheduledAt: scheduledAt ?? this.scheduledAt,
      completedAt: completedAt ?? this.completedAt,
      totalAmount: totalAmount ?? this.totalAmount,
      commissionRate: commissionRate ?? this.commissionRate,
      commissionAmount: commissionAmount ?? this.commissionAmount,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      customerAddress: customerAddress ?? this.customerAddress,
      customerCity: customerCity ?? this.customerCity,
      customerLatitude: customerLatitude ?? this.customerLatitude,
      customerLongitude: customerLongitude ?? this.customerLongitude,
      customerNotes: customerNotes ?? this.customerNotes,
      cancellationReason: cancellationReason ?? this.cancellationReason,
      cancelInitiator: cancelInitiator ?? this.cancelInitiator,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      customer: customer ?? this.customer,
      worker: worker ?? this.worker,
      service: service ?? this.service,
    );
  }

  @override
  List<Object?> get props => [
        id,
        bookingNumber,
        customerId,
        workerId,
        serviceId,
        categoryId,
        status,
        scheduledAt,
        completedAt,
        totalAmount,
        commissionRate,
        commissionAmount,
        paymentMethod,
        paymentStatus,
        customerAddress,
        customerCity,
        customerLatitude,
        customerLongitude,
        customerNotes,
        cancellationReason,
        cancelInitiator,
        createdAt,
        updatedAt,
        customer,
        worker,
        service,
      ];
}
