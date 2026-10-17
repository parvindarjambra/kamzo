"use client";

import * as React from "react";
import {
  HardHat,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Star,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Award,
  Phone,
  CreditCard,
  Wrench,
  X,
  Check,
  Calendar,
  AlertTriangle,
  UserX,
  UserCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR, formatDate } from "@/lib/utils";
import { WorkerProfile, Profile } from "@/types/database.types";
import { supabase } from "@/lib/supabase/client";

interface WorkerRecord {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  cnic_number: string;
  cnic_front_url: string;
  cnic_back_url: string;
  is_verified: boolean;
  is_suspended: boolean;
  suspension_reason?: string | null;
  level_name: "Level 1 (New)" | "Level 2 (Active)" | "Level 3 (Trusted)" | "Level 4 (Expert)";
  completed_jobs_count: number;
  rating: number;
  total_reviews: number;
  services_offered: string[];
  commission_balance: number;
  created_at: string;
  city: string;
}

const mockWorkers: WorkerRecord[] = [
  {
    id: "wp-1",
    user_id: "u-w1",
    name: "Tariq Mahmood",
    phone: "0321-7654321",
    cnic_number: "35201-1928374-1",
    cnic_front_url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80",
    cnic_back_url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=600&q=80",
    is_verified: true,
    is_suspended: false,
    level_name: "Level 4 (Expert)",
    completed_jobs_count: 312,
    rating: 4.9,
    total_reviews: 284,
    services_offered: ["AC Repair", "HVAC Maintenance", "Refrigerator"],
    commission_balance: 1450,
    created_at: "2025-11-10T08:00:00Z",
    city: "Lahore",
  },
  {
    id: "wp-2",
    user_id: "u-w2",
    name: "Kamran Ali",
    phone: "0345-1112223",
    cnic_number: "42101-8849201-3",
    cnic_front_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=600&q=80",
    cnic_back_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=600&q=80",
    is_verified: true,
    is_suspended: false,
    level_name: "Level 3 (Trusted)",
    completed_jobs_count: 148,
    rating: 4.8,
    total_reviews: 130,
    services_offered: ["Electrician", "UPS & Solar Wiring", "Ceiling Fan"],
    commission_balance: 620,
    created_at: "2026-01-15T09:30:00Z",
    city: "Karachi",
  },
  {
    id: "wp-3",
    user_id: "u-w3",
    name: "Zafar Iqbal",
    phone: "0304-9998877",
    cnic_number: "61101-4455667-5",
    cnic_front_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    cnic_back_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    is_verified: false,
    is_suspended: false,
    level_name: "Level 1 (New)",
    completed_jobs_count: 8,
    rating: 4.6,
    total_reviews: 7,
    services_offered: ["Plumber", "Water Motor Repair"],
    commission_balance: 0,
    created_at: "2026-09-01T14:00:00Z",
    city: "Islamabad",
  },
  {
    id: "wp-4",
    user_id: "u-w4",
    name: "Sajid Rasheed",
    phone: "0301-6677889",
    cnic_number: "35202-9900112-7",
    cnic_front_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    cnic_back_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    is_verified: true,
    is_suspended: false,
    level_name: "Level 3 (Trusted)",
    completed_jobs_count: 195,
    rating: 4.9,
    total_reviews: 180,
    services_offered: ["Deep Cleaning", "Sofa & Carpet Wash"],
    commission_balance: 890,
    created_at: "2026-02-18T10:00:00Z",
    city: "Lahore",
  },
  {
    id: "wp-5",
    user_id: "u-w5",
    name: "Rashid Minhas",
    phone: "0342-3344556",
    cnic_number: "37405-7722119-9",
    cnic_front_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    cnic_back_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    is_verified: true,
    is_suspended: true,
    suspension_reason: "Customer complaint regarding off-platform fee solicitation and misconduct.",
    level_name: "Level 2 (Active)",
    completed_jobs_count: 42,
    rating: 3.7,
    total_reviews: 35,
    services_offered: ["Carpentry", "Door Locksmith"],
    commission_balance: 2400,
    created_at: "2026-04-10T11:20:00Z",
    city: "Rawalpindi",
  },
];

export default function WorkersPage() {
  const [workers, setWorkers] = React.useState<WorkerRecord[]>(mockWorkers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<"all" | "verified" | "unverified" | "suspended">("all");

  // Modals state
  const [selectedWorker, setSelectedWorker] = React.useState<WorkerRecord | null>(null);
  const [suspendModalWorker, setSuspendModalWorker] = React.useState<WorkerRecord | null>(null);
  const [suspendReason, setSuspendReason] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredWorkers = workers.filter((w) => {
    if (filterType === "verified" && !w.is_verified) return false;
    if (filterType === "unverified" && w.is_verified) return false;
    if (filterType === "suspended" && !w.is_suspended) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = w.name.toLowerCase().includes(q);
      const matchPhone = w.phone.includes(q);
      const matchCnic = w.cnic_number.includes(q);
      const matchService = w.services_offered.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchPhone && !matchCnic && !matchService) return false;
    }
    return true;
  });

  const toggleVerification = async (workerId: string) => {
    const target = workers.find((w) => w.id === workerId);
    if (!target) return;

    const newVerifiedState = !target.is_verified;

    try {
      await supabase
        .from("worker_profiles")
        .update({
          is_verified: newVerifiedState,
          verification_date: newVerifiedState ? new Date().toISOString() : null,
        } as any)
        .eq("id", workerId);
    } catch (e) {
      console.warn("Supabase worker verification update skipped or offline.");
    } finally {
      setWorkers((prev) =>
        prev.map((w) => (w.id === workerId ? { ...w, is_verified: newVerifiedState } : w))
      );
      if (selectedWorker?.id === workerId) {
        setSelectedWorker((prev) => (prev ? { ...prev, is_verified: newVerifiedState } : null));
      }
      showToast(
        newVerifiedState
          ? `${target.name} has been officially Verified & Approved!`
          : `Verification revoked for ${target.name}.`
      );
    }
  };

  const handleSuspendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendModalWorker) return;
    if (!suspendReason.trim()) {
      alert("Please provide a suspension rationale.");
      return;
    }

    try {
      await supabase
        .from("profiles")
        .update({
          is_suspended: true,
          suspension_reason: suspendReason,
        } as any)
        .eq("id", suspendModalWorker.user_id);
    } catch (e) {
      console.warn("Supabase worker suspend skipped or offline.");
    } finally {
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === suspendModalWorker.id
            ? { ...w, is_suspended: true, suspension_reason: suspendReason }
            : w
        )
      );
      showToast(`Worker ${suspendModalWorker.name} has been suspended.`);
      setSuspendModalWorker(null);
      setSuspendReason("");
    }
  };

  const handleUnsuspend = async (worker: WorkerRecord) => {
    if (!confirm(`Re-enable service access for ${worker.name}?`)) return;

    try {
      await supabase
        .from("profiles")
        .update({
          is_suspended: false,
          suspension_reason: null,
        } as any)
        .eq("id", worker.user_id);
    } catch (e) {
      console.warn("Supabase worker unsuspend skipped or offline.");
    } finally {
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === worker.id ? { ...w, is_suspended: false, suspension_reason: null } : w
        )
      );
      showToast(`Account for ${worker.name} is now restored.`);
    }
  };

  const getLevelBadge = (level: string) => {
    if (level.includes("Expert")) return <Badge variant="purple">{level}</Badge>;
    if (level.includes("Trusted")) return <Badge variant="success">{level}</Badge>;
    if (level.includes("Active")) return <Badge variant="info">{level}</Badge>;
    return <Badge variant="default">{level}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B5E20] text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-700 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Worker Network & CNIC Verifications
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Review government CNIC documents, approve service skills, check commission status, and audit worker reliability.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by worker name, phone, CNIC, or trade..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: "all", label: "All Workers" },
            { id: "verified", label: "CNIC Verified" },
            { id: "unverified", label: "Pending Verification" },
            { id: "suspended", label: "Suspended" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                filterType === item.id
                  ? "bg-[#1B5E20] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Worker Name</th>
                <th className="py-3.5 px-4">Contact & City</th>
                <th className="py-3.5 px-4">Services / Trades</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Jobs & Rating</th>
                <th className="py-3.5 px-4">CNIC Verified</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    No service providers found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {w.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                            {w.name}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono">
                            CNIC: {w.cnic_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-mono text-gray-900">{w.phone}</div>
                      <div className="text-gray-400 text-[11px]">{w.city}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {w.services_offered.map((service, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getLevelBadge(w.level_name)}
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-semibold text-gray-900">
                        {w.completed_jobs_count} completed
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{w.rating.toFixed(1)}</span>
                        <span className="text-gray-400 font-normal">({w.total_reviews})</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {w.is_verified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Pending CNIC
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {w.is_suspended ? (
                        <div>
                          <Badge variant="danger">Suspended</Badge>
                          {w.suspension_reason && (
                            <div className="text-[10px] text-rose-600 truncate max-w-[120px]" title={w.suspension_reason}>
                              {w.suspension_reason}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedWorker(w)}
                          className="h-8 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[#1B5E20]" />
                          Profile
                        </Button>

                        {!w.is_verified ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => toggleVerification(w.id)}
                            className="h-8 text-xs bg-[#1B5E20] hover:bg-[#144717]"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                            Verify
                          </Button>
                        ) : null}

                        {w.is_suspended ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUnsuspend(w)}
                            className="h-8 text-xs bg-emerald-700 hover:bg-emerald-800"
                          >
                            <UserCheck className="w-3.5 h-3.5 mr-1" />
                            Unsuspend
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSuspendModalWorker(w);
                              setSuspendReason("");
                            }}
                            className="h-8 text-xs"
                          >
                            <UserX className="w-3.5 h-3.5 mr-1" />
                            Suspend
                          </Button>
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

      {/* Worker Detail Modal with CNIC Viewers */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#1B5E20] text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {selectedWorker.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {selectedWorker.name}
                    </h3>
                    {selectedWorker.is_verified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-mono">
                    ID: {selectedWorker.id} • CNIC: {selectedWorker.cnic_number}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400">Current Level</span>
                <p className="font-bold text-gray-900 mt-1">{selectedWorker.level_name}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400">Completed Jobs</span>
                <p className="font-bold text-emerald-700 mt-1 text-sm">
                  {selectedWorker.completed_jobs_count} Tasks
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400">Average Rating</span>
                <p className="font-bold text-amber-600 mt-1 text-sm flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {selectedWorker.rating.toFixed(1)} / 5.0
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400">Commission Due</span>
                <p className="font-bold text-rose-700 mt-1 text-sm">
                  {formatPKR(selectedWorker.commission_balance)}
                </p>
              </div>
            </div>

            {/* Services Offered */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Registered Skills & Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedWorker.services_offered.map((srv, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2.5 py-1 rounded-md font-medium"
                  >
                    ✓ {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* CNIC Documents Verification */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Government CNIC Verification
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Verify CNIC number {selectedWorker.cnic_number} against NADRA guidelines
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={selectedWorker.is_verified ? "outline" : "primary"}
                  onClick={() => toggleVerification(selectedWorker.id)}
                  className="h-8 text-xs"
                >
                  {selectedWorker.is_verified ? "Revoke Verification" : "Approve & Verify CNIC"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-gray-600">CNIC Front Side</p>
                  <div className="h-40 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedWorker.cnic_front_url}
                      alt="CNIC Front"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[11px] font-semibold text-gray-600">CNIC Back Side</p>
                  <div className="h-40 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={selectedWorker.cnic_back_url}
                      alt="CNIC Back"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedWorker(null)}
              >
                Close Modal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Worker Modal */}
      {suspendModalWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                  <ShieldAlert className="w-5 h-5" />
                  <h3>Suspend Service Provider</h3>
                </div>
                <p className="text-xs text-gray-500">
                  Worker: {suspendModalWorker.name} ({suspendModalWorker.phone})
                </p>
              </div>
              <button
                onClick={() => setSuspendModalWorker(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSuspendSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for Suspension *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify violation e.g. quality issues, excessive cancellations, or off-platform direct billing..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSuspendModalWorker(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="sm"
                >
                  Confirm Suspension
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
