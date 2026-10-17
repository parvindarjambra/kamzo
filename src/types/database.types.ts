export type UserRole = "customer" | "worker" | "admin";

export type BookingStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected";

export type PaymentType = "visit_fee" | "final_bill" | "commission";

export type PaymentMethod = "jazzcash" | "easypaisa" | "bank_transfer" | "cash";

export type PaymentStatus = "pending" | "submitted" | "verified" | "rejected";

export type CommissionStatus = "unpaid" | "pending_verification" | "paid";

export type BonusPeriod = "weekly" | "monthly";

export type BonusStatus = "eligible" | "approved" | "paid" | "rejected";

export type NotificationAudience = "all" | "users" | "workers" | "specific";

export type NotificationType = "info" | "alert" | "promotion" | "system" | "booking";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  email?: string | null;
  avatar_url?: string | null;
  is_suspended: boolean;
  suspension_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkerLevel {
  id: string;
  level_number: number;
  name: string;
  min_jobs: number;
  commission_discount_percent: number;
  badge_color: string;
  created_at: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  cnic_number?: string | null;
  cnic_front_url?: string | null;
  cnic_back_url?: string | null;
  is_verified: boolean;
  verification_date?: string | null;
  level_id?: string | null;
  completed_jobs_count: number;
  rating: number;
  total_reviews: number;
  services_offered: string[];
  is_available: boolean;
  commission_balance: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  profile?: Profile;
  level?: WorkerLevel;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  base_price: number;
  icon_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  worker_id?: string | null;
  service_id: string;
  status: BookingStatus;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  visit_fee: number;
  estimated_quote?: number | null;
  final_amount?: number | null;
  cancellation_reason?: string | null;
  scheduled_at: string;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  customer?: Profile;
  worker?: Profile;
  worker_profile?: WorkerProfile;
  service?: Service;
  payments?: Payment[];
}

export interface PaymentProof {
  id: string;
  payment_id: string;
  proof_image_url: string;
  submitted_at: string;
  notes?: string | null;
}

export interface Payment {
  id: string;
  booking_id?: string | null;
  payer_id: string;
  amount: number;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  reference_number?: string | null;
  transaction_id?: string | null;
  verified_at?: string | null;
  verified_by?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  booking?: Booking;
  payer?: Profile;
  proofs?: PaymentProof[];
}

export interface Commission {
  id: string;
  booking_id: string;
  worker_id: string;
  job_amount: number;
  commission_percentage: number;
  commission_amount: number;
  status: CommissionStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  booking?: Booking;
  worker?: Profile;
}

export interface CommissionPayment {
  id: string;
  commission_id?: string | null;
  worker_id: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number?: string | null;
  proof_image_url?: string | null;
  status: PaymentStatus;
  verified_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  // Joined fields
  worker?: Profile;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  // Joined fields
  reviewer?: Profile;
  reviewee?: Profile;
}

export interface BonusRule {
  id: string;
  title: string;
  min_jobs: number;
  bonus_amount: number;
  period: BonusPeriod;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkerBonus {
  id: string;
  rule_id: string;
  worker_id: string;
  completed_jobs: number;
  bonus_amount: number;
  period_start: string;
  period_end: string;
  status: BonusStatus;
  approved_at?: string | null;
  paid_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  // Joined fields
  rule?: BonusRule;
  worker?: Profile;
  worker_profile?: WorkerProfile;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  audience: NotificationAudience;
  recipient_id?: string | null;
  type?: NotificationType;
  status: "sent" | "pending" | "failed";
  read_at?: string | null;
  created_at: string;
  // Joined fields
  recipient?: Profile;
}

export interface AdminSetting {
  id: string;
  key: string;
  value: string;
  description?: string | null;
  updated_at: string;
  updated_by?: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
      worker_profiles: {
        Row: WorkerProfile;
        Insert: Omit<WorkerProfile, "created_at" | "updated_at">;
        Update: Partial<Omit<WorkerProfile, "id">>;
      };
      worker_levels: {
        Row: WorkerLevel;
        Insert: Omit<WorkerLevel, "id" | "created_at">;
        Update: Partial<Omit<WorkerLevel, "id">>;
      };
      services: {
        Row: Service;
        Insert: Omit<Service, "id" | "created_at">;
        Update: Partial<Omit<Service, "id">>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Booking, "id">>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Payment, "id">>;
      };
      payment_proofs: {
        Row: PaymentProof;
        Insert: Omit<PaymentProof, "id">;
        Update: Partial<Omit<PaymentProof, "id">>;
      };
      commissions: {
        Row: Commission;
        Insert: Omit<Commission, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Commission, "id">>;
      };
      commission_payments: {
        Row: CommissionPayment;
        Insert: Omit<CommissionPayment, "id" | "created_at">;
        Update: Partial<Omit<CommissionPayment, "id">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at">;
        Update: Partial<Omit<Review, "id">>;
      };
      bonus_rules: {
        Row: BonusRule;
        Insert: Omit<BonusRule, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BonusRule, "id">>;
      };
      worker_bonuses: {
        Row: WorkerBonus;
        Insert: Omit<WorkerBonus, "id" | "created_at">;
        Update: Partial<Omit<WorkerBonus, "id">>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, "id" | "created_at">;
        Update: Partial<Omit<Notification, "id">>;
      };
      admin_settings: {
        Row: AdminSetting;
        Insert: Omit<AdminSetting, "id" | "updated_at">;
        Update: Partial<Omit<AdminSetting, "id">>;
      };
    };
  };
}
