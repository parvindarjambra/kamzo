import 'service_item.dart';

/// Represents a customer booking request and lifecycle state
class CustomerBooking {
  final String id;
  final String bookingNumber;
  final ServiceItem service;
  final String problemDescription;
  final String address;
  final String city;
  final double latitude;
  final double longitude;
  final double visitFee;
  final String requestType; // 'Urgent' or 'Scheduled'
  final DateTime scheduledAt;
  final String status; // 'requested', 'payment_verified', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'completed', 'cancelled'
  final DateTime createdAt;
  final String? workerName;
  final String? workerPhone;
  final double? workerRating;
  final int? workerTotalJobs;
  final String? workerPhotoUrl;
  final double? laborCharges;
  final double? partsCharges;
  final double? totalBillAmount;
  final bool billConfirmed;
  final String? paymentMethod;
  final String? paymentTransactionId;

  const CustomerBooking({
    required this.id,
    required this.bookingNumber,
    required this.service,
    required this.problemDescription,
    required this.address,
    required this.city,
    this.latitude = 31.5204, // Default Lahore
    this.longitude = 74.3587,
    this.visitFee = 200.0,
    this.requestType = 'Urgent Dispatch',
    required this.scheduledAt,
    this.status = 'requested',
    required this.createdAt,
    this.workerName,
    this.workerPhone,
    this.workerRating,
    this.workerTotalJobs,
    this.workerPhotoUrl,
    this.laborCharges,
    this.partsCharges,
    this.totalBillAmount,
    this.billConfirmed = false,
    this.paymentMethod,
    this.paymentTransactionId,
  });

  CustomerBooking copyWith({
    String? id,
    String? bookingNumber,
    ServiceItem? service,
    String? problemDescription,
    String? address,
    String? city,
    double? latitude,
    double? longitude,
    double? visitFee,
    String? requestType,
    DateTime? scheduledAt,
    String? status,
    DateTime? createdAt,
    String? workerName,
    String? workerPhone,
    double? workerRating,
    int? workerTotalJobs,
    String? workerPhotoUrl,
    double? laborCharges,
    double? partsCharges,
    double? totalBillAmount,
    bool? billConfirmed,
    String? paymentMethod,
    String? paymentTransactionId,
  }) {
    return CustomerBooking(
      id: id ?? this.id,
      bookingNumber: bookingNumber ?? this.bookingNumber,
      service: service ?? this.service,
      problemDescription: problemDescription ?? this.problemDescription,
      address: address ?? this.address,
      city: city ?? this.city,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      visitFee: visitFee ?? this.visitFee,
      requestType: requestType ?? this.requestType,
      scheduledAt: scheduledAt ?? this.scheduledAt,
      status: status ?? this.status,
      createdAt: createdAt ?? this.createdAt,
      workerName: workerName ?? this.workerName,
      workerPhone: workerPhone ?? this.workerPhone,
      workerRating: workerRating ?? this.workerRating,
      workerTotalJobs: workerTotalJobs ?? this.workerTotalJobs,
      workerPhotoUrl: workerPhotoUrl ?? this.workerPhotoUrl,
      laborCharges: laborCharges ?? this.laborCharges,
      partsCharges: partsCharges ?? this.partsCharges,
      totalBillAmount: totalBillAmount ?? this.totalBillAmount,
      billConfirmed: billConfirmed ?? this.billConfirmed,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      paymentTransactionId: paymentTransactionId ?? this.paymentTransactionId,
    );
  }
}
