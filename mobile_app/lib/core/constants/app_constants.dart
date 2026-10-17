/// KAMZO Pakistan Service Marketplace App Constants
class AppConstants {
  // Application Info
  static const String appName = 'KAMZO';
  static const String appTagline = 'Pakistan\'s Premier Service Marketplace';
  static const String appVersion = '1.0.0+1';
  static const String currencyCode = 'PKR';
  static const String currencySymbol = 'Rs.';
  static const String defaultCountryCode = '+92';
  static const String supportPhone = '+92 300 0000000';
  static const String supportEmail = 'support@kamzo.pk';

  // Major Pakistan Cities Supported
  static const List<String> supportedCities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Quetta',
    'Gujranwala',
    'Sialkot',
    'Hyderabad',
    'Abbottabad',
  ];

  // Storage Buckets
  static const String avatarsBucket = 'avatars';
  static const String cnicBucket = 'cnic-documents';
  static const String serviceImagesBucket = 'service-images';
  static const String bookingAttachmentsBucket = 'booking-attachments';
  static const String workerCertificatesBucket = 'worker-certificates';
}

/// Supabase Database Table Names
class SupabaseTables {
  static const String profiles = 'profiles';
  static const String workerProfiles = 'worker_profiles';
  static const String serviceCategories = 'service_categories';
  static const String services = 'services';
  static const String bookings = 'bookings';
  static const String bookingItems = 'booking_items';
  static const String bookingStatusHistory = 'booking_status_history';
  static const String reviews = 'reviews';
  static const String chatRooms = 'chat_rooms';
  static const String chatMessages = 'chat_messages';
  static const String commissions = 'commissions';
  static const String workerLevels = 'worker_levels';
  static const String workerBonuses = 'worker_bonuses';
  static const String workerLocations = 'worker_locations';
  static const String notifications = 'notifications';
  static const String wallets = 'wallets';
  static const String walletTransactions = 'wallet_transactions';
  static const String payouts = 'payouts';
}

/// User Roles
class UserRoles {
  static const String customer = 'customer';
  static const String worker = 'worker';
  static const String admin = 'admin';
}

/// Booking Status Constants
class BookingStatus {
  static const String pending = 'pending';
  static const String accepted = 'accepted';
  static const String workerAssigned = 'worker_assigned';
  static const String onTheWay = 'on_the_way';
  static const String inProgress = 'in_progress';
  static const String completed = 'completed';
  static const String cancelled = 'cancelled';
  static const String rejected = 'rejected';

  static const List<String> all = [
    pending,
    accepted,
    workerAssigned,
    onTheWay,
    inProgress,
    completed,
    cancelled,
    rejected,
  ];

  static String label(String status) {
    switch (status) {
      case pending:
        return 'Pending Approval';
      case accepted:
        return 'Booking Confirmed';
      case workerAssigned:
        return 'Worker Assigned';
      case onTheWay:
        return 'Worker on the Way';
      case inProgress:
        return 'Work in Progress';
      case completed:
        return 'Completed';
      case cancelled:
        return 'Cancelled';
      case rejected:
        return 'Declined';
      default:
        return status;
    }
  }
}

/// Payment Methods in Pakistan
class PaymentMethod {
  static const String cashOnDelivery = 'cash';
  static const String jazzCash = 'jazzcash';
  static const String easyPaisa = 'easypaisa';
  static const String bankTransfer = 'bank_transfer';
  static const String wallet = 'wallet';
  static const String debitCreditCard = 'card';

  static const List<String> all = [
    cashOnDelivery,
    jazzCash,
    easyPaisa,
    bankTransfer,
    wallet,
    debitCreditCard,
  ];

  static String label(String method) {
    switch (method) {
      case cashOnDelivery:
        return 'Cash on Delivery (COD)';
      case jazzCash:
        return 'JazzCash Mobile Account';
      case easyPaisa:
        return 'Easypaisa Wallet';
      case bankTransfer:
        return 'Bank Transfer / 1Link';
      case wallet:
        return 'KAMZO Wallet';
      case debitCreditCard:
        return 'Debit / Credit Card';
      default:
        return method;
    }
  }
}

/// Payment Status
class PaymentStatus {
  static const String pending = 'pending';
  static const String paid = 'paid';
  static const String refunded = 'refunded';
  static const String failed = 'failed';
}

/// Commission Status for Worker Platform Fees
class CommissionStatus {
  static const String pending = 'pending';
  static const String collected = 'collected';
  static const String deducted = 'deducted';
  static const String waived = 'waived';
  static const String disputed = 'disputed';
}

/// Worker Tier Levels
class WorkerLevel {
  static const String bronze = 'bronze';
  static const String silver = 'silver';
  static const String gold = 'gold';
  static const String platinum = 'platinum';

  static const List<String> all = [bronze, silver, gold, platinum];

  static String label(String level) {
    switch (level) {
      case bronze:
        return 'Bronze Partner';
      case silver:
        return 'Silver Pro';
      case gold:
        return 'Gold Master';
      case platinum:
        return 'Platinum Elite';
      default:
        return level;
    }
  }
}

/// Bonus Status
class BonusStatus {
  static const String pending = 'pending';
  static const String eligible = 'eligible';
  static const String credited = 'credited';
  static const String expired = 'expired';
}

/// In-App & Push Notification Types
class NotificationType {
  static const String bookingCreated = 'booking_created';
  static const String bookingAccepted = 'booking_accepted';
  static const String bookingStatusUpdate = 'booking_status_update';
  static const String bookingCancelled = 'booking_cancelled';
  static const String chatMessage = 'chat_message';
  static const String paymentReceived = 'payment_received';
  static const String commissionDue = 'commission_due';
  static const String bonusAwarded = 'bonus_awarded';
  static const String levelUp = 'level_up';
  static const String systemAnnouncement = 'system_announcement';
}
