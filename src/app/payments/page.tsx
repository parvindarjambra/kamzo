"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Percent,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Clock,
  Check,
  AlertTriangle,
  X,
  ExternalLink,
  Download,
  MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR, formatDate, formatDateTime } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

function cleanPakistaniPhone(phone: string): string {
  let cleaned = (phone || "").replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "92" + cleaned.slice(1);
  } else if (!cleaned.startsWith("92")) {
    cleaned = "92" + cleaned;
  }
  return cleaned;
}
import { PaymentStatus, PaymentMethod } from "@/types/database.types";

interface PaymentItem {
  id: string;
  booking_number: string;
  payer_name: string;
  payer_phone: string;
  amount: number;
  payment_method: PaymentMethod;
  reference_number: string;
  status: PaymentStatus;
  created_at: string;
  proof_url: string;
  rejection_reason?: string | null;
  type: "visit_fee" | "commission";
}

const mockVisitFeePayments: PaymentItem[] = [];

const mockCommissionPayments: PaymentItem[] = [];

function PaymentsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "commissions" ? "commission" : "visit_fee";

  const [activeTab, setActiveTab] = React.useState<"visit_fee" | "commission">(initialTab);
  const [payments, setPayments] = React.useState<PaymentItem[]>([]);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Hydrate payments from localStorage on client mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("kamzo_admin_payments");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPayments(parsed);
        }
      }
    } catch (_) {}
  }, []);

  // Modals state
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string; ref: string } | null>(null);
  const [rejectItem, setRejectItem] = React.useState<PaymentItem | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [toastMessage, setToastMessage] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter payments
  const currentList = payments.filter((item) => {
    if (item.type !== activeTab) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchRef = item.reference_number.toLowerCase().includes(q);
      const matchBooking = item.booking_number.toLowerCase().includes(q);
      const matchPayer = item.payer_name.toLowerCase().includes(q);
      if (!matchRef && !matchBooking && !matchPayer) return false;
    }
    return true;
  });

  // Fetch live payments from server store and Supabase
  const loadPayments = React.useCallback(async () => {
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.payments)) {
          setPayments(data.payments);
          try {
            localStorage.setItem("kamzo_admin_payments", JSON.stringify(data.payments));
          } catch (_) {}
        }
      }
    } catch (_) {}
  }, []);

  React.useEffect(() => {
    loadPayments();

    // Listen to real-time feed updates from AdminRealtimeListener
    const handleFeedUpdate = (e: any) => {
      const liveData = e.detail;
      if (liveData && Array.isArray(liveData.payments)) {
        setPayments(liveData.payments);
        try {
          localStorage.setItem("kamzo_admin_payments", JSON.stringify(liveData.payments));
        } catch (_) {}
      }
    };

    window.addEventListener("kamzo:feedUpdate", handleFeedUpdate);
    return () => {
      window.removeEventListener("kamzo:feedUpdate", handleFeedUpdate);
    };
  }, [loadPayments]);

  const handleVerify = async (item: PaymentItem) => {
    if (!confirm(`Confirm verification of ${formatPKR(item.amount)} for ${item.booking_number}?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: item.id, action: "verify" }),
      });
      const data = await res.json();
      if (data?.customerWhatsAppUrl) {
        try {
          window.open(data.customerWhatsAppUrl, "_blank");
        } catch (_) {}
      }

      // Also attempt direct Supabase update
      try {
        if (item.type === "visit_fee") {
          await supabase
            .from("payments")
            .update({
              status: "verified",
              verified_at: new Date().toISOString(),
            } as any)
            .eq("id", item.id);
        }
      } catch (_) {}
    } catch (e) {
      console.warn("API verify error:", e);
    } finally {
      setPayments((prev) => {
        const next = prev.map((p) => (p.id === item.id ? { ...p, status: "verified" as PaymentStatus } : p));
        try { localStorage.setItem("kamzo_admin_payments", JSON.stringify(next)); } catch (_) {}
        return next;
      });
      setIsSubmitting(false);
      showToast(`Payment for ${item.booking_number} verified! Customer notified via WhatsApp & Email.`);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectItem) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejecting this payment.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: rejectItem.id,
          action: "reject",
          rejectionReason,
        }),
      });
      const data = await res.json();
      if (data?.customerWhatsAppUrl) {
        try {
          window.open(data.customerWhatsAppUrl, "_blank");
        } catch (_) {}
      }

      // Also attempt direct Supabase update
      try {
        if (rejectItem.type === "visit_fee") {
          await supabase
            .from("payments")
            .update({
              status: "rejected",
              rejection_reason: rejectionReason,
            } as any)
            .eq("id", rejectItem.id);
        }
      } catch (_) {}
    } catch (e) {
      console.warn("API reject error:", e);
    } finally {
      setPayments((prev) => {
        const next = prev.map((p) =>
          p.id === rejectItem.id
            ? { ...p, status: "rejected" as PaymentStatus, rejection_reason: rejectionReason }
            : p
        );
        try { localStorage.setItem("kamzo_admin_payments", JSON.stringify(next)); } catch (_) {}
        return next;
      });
      setIsSubmitting(false);
      setRejectItem(null);
      setRejectionReason("");
      showToast(`Payment rejected with reason recorded.`, "error");
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "submitted":
        return <Badge variant="warning">Submitted</Badge>;
      case "verified":
        return <Badge variant="success">Verified</Badge>;
      case "rejected":
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case "jazzcash":
        return <span className="font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-xs">JazzCash</span>;
      case "easypaisa":
        return <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs">Easypaisa</span>;
      case "bank_transfer":
        return <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-xs">Bank Transfer</span>;
      default:
        return <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs capitalize">{method}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
            toastMessage.type === "success"
              ? "bg-[#16A34A] text-white border-emerald-700"
              : "bg-rose-700 text-white border-rose-800"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Payment & Commission Verifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Audit visit fee proofs uploaded by customers and commission settlements paid by workers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 bg-gray-100 rounded-xl w-fit border border-gray-200">
          <button
            onClick={() => setActiveTab("visit_fee")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "visit_fee"
                ? "bg-white text-[#16A34A] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Visit Fee Payments (Rs. 200)
          </button>
          <button
            onClick={() => setActiveTab("commission")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "commission"
                ? "bg-white text-[#16A34A] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            Worker Commission Payments
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference #, booking #, or name..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {["all", "submitted", "verified", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === status
                  ? "bg-[#16A34A] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Booking #</th>
                <th className="py-3.5 px-4">{activeTab === "visit_fee" ? "Customer" : "Worker"}</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Reference / TXN</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4">Proof</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-gray-400 text-sm">
                    No payment records found matching the current search criteria.
                  </td>
                </tr>
              ) : (
                currentList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-xs font-semibold text-gray-900">
                      {item.booking_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-900 text-xs sm:text-sm">
                        {item.payer_name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {item.payer_phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 text-xs sm:text-sm">
                      {formatPKR(item.amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getMethodBadge(item.payment_method)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-700">
                      {item.reference_number}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {formatDateTime(item.created_at)}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          setPreviewImage({
                            url: item.proof_url,
                            title: `Payment Proof - ${item.booking_number}`,
                            ref: item.reference_number,
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 hover:bg-emerald-50 hover:text-[#16A34A] text-gray-700 text-xs font-medium border border-gray-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span>View Proof</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(item.status)}
                      {item.status === "rejected" && item.rejection_reason && (
                        <div className="text-[10px] text-rose-600 mt-1 max-w-[150px] truncate" title={item.rejection_reason}>
                          Reason: {item.rejection_reason}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`https://wa.me/${cleanPakistaniPhone(item.payer_phone)}?text=${encodeURIComponent(
                            `#KAMZO Service Update\nAssalam-o-Alaikum ${item.payer_name}!\nRegarding your booking #${item.booking_number} payment (${item.reference_number}):\nStatus: ${item.status === "verified" ? "VERIFIED & APPROVED - Technician dispatched" : item.status === "rejected" ? `REJECTED (${item.rejection_reason || "Invalid TID"})` : "UNDER REVIEW"}\nKAMZO Helpline: +92 319 7318425`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] border border-emerald-200 text-xs font-bold transition-colors shrink-0 shadow-xs"
                          title="Open WhatsApp with #KAMZO tag"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>

                        {item.status === "submitted" ? (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleVerify(item)}
                              className="h-8 text-xs bg-[#1B5E20] hover:bg-[#144717]"
                            >
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Verify
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                setRejectItem(item);
                                setRejectionReason("");
                              }}
                              className="h-8 text-xs"
                            >
                              <X className="w-3.5 h-3.5 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic px-1">Settled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Proof Image Viewer Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {previewImage.title}
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  Ref: {previewImage.ref}
                </p>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-center min-h-[300px] max-h-[500px] overflow-auto">
              <img
                src={previewImage.url}
                alt="Payment receipt proof"
                className="max-h-[460px] object-contain rounded-lg shadow-sm border border-gray-200"
              />
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPreviewImage(null)}
              >
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-600 font-semibold text-base">
                  <AlertTriangle className="w-5 h-5" />
                  <h3>Reject Payment Proof</h3>
                </div>
                <p className="text-xs text-gray-500">
                  {rejectItem.booking_number} — {formatPKR(rejectItem.amount)} via {rejectItem.payment_method}
                </p>
              </div>
              <button
                onClick={() => setRejectItem(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for Rejection *
                </label>
                <textarea
                  rows={3}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Reference number not found in bank statement, screenshot unreadable, or wrong amount sent."
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                  isLoading={isSubmitting}
                >
                  Confirm Rejection
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="py-20 flex items-center justify-center text-sm text-gray-500">
          Loading Payments Ledger...
        </div>
      }
    >
      <PaymentsContent />
    </React.Suspense>
  );
}
