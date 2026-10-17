"use client";

import * as React from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Eye,
  ShieldAlert,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  X,
  AlertTriangle,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime, formatPKR } from "@/lib/utils";
import { Profile } from "@/types/database.types";
import { supabase } from "@/lib/supabase/client";

interface CustomerWithStats extends Profile {
  total_bookings: number;
  total_spent: number;
  last_booking_date?: string;
  city?: string;
}

const mockCustomers: CustomerWithStats[] = [];

export default function UsersPage() {
  const [users, setUsers] = React.useState<CustomerWithStats[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "suspended">("all");

  // Modals
  const [selectedUser, setSelectedUser] = React.useState<CustomerWithStats | null>(null);
  const [suspendModalUser, setSuspendModalUser] = React.useState<CustomerWithStats | null>(null);
  const [suspendReason, setSuspendReason] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filteredUsers = users.filter((u) => {
    if (statusFilter === "active" && u.is_suspended) return false;
    if (statusFilter === "suspended" && !u.is_suspended) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = u.full_name.toLowerCase().includes(q);
      const matchPhone = u.phone.includes(q);
      const matchEmail = (u.email || "").toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail) return false;
    }
    return true;
  });

  const handleSuspendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspendModalUser) return;
    if (!suspendReason.trim()) {
      alert("Please provide a suspension reason.");
      return;
    }

    try {
      await supabase
        .from("profiles")
        .update({
          is_suspended: true,
          suspension_reason: suspendReason,
        } as any)
        .eq("id", suspendModalUser.id);
    } catch (e) {
      console.warn("Supabase suspend update skipped or offline.");
    } finally {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === suspendModalUser.id
            ? { ...u, is_suspended: true, suspension_reason: suspendReason }
            : u
        )
      );
      showToast(`User ${suspendModalUser.full_name} suspended successfully.`);
      setSuspendModalUser(null);
      setSuspendReason("");
    }
  };

  const handleUnsuspend = async (user: CustomerWithStats) => {
    if (!confirm(`Reactivate customer account for ${user.full_name}?`)) return;

    try {
      await supabase
        .from("profiles")
        .update({
          is_suspended: false,
          suspension_reason: null,
        } as any)
        .eq("id", user.id);
    } catch (e) {
      console.warn("Supabase unsuspend update skipped or offline.");
    } finally {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, is_suspended: false, suspension_reason: null }
            : u
        )
      );
      showToast(`Account for ${user.full_name} has been reactivated.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B5E20] text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-700 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Customer Accounts
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Search, inspect, and manage registered consumer accounts across Pakistan.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {[
            { id: "all", label: "All Users" },
            { id: "active", label: "Active" },
            { id: "suspended", label: "Suspended" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === item.id
                  ? "bg-[#1B5E20] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">Bookings</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                    No customers found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#1B5E20] font-bold text-xs flex items-center justify-center shrink-0">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                            {user.full_name}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono">
                            ID: {user.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-mono text-gray-900">{user.phone}</div>
                      <div className="text-gray-400 text-[11px]">{user.email || "No email"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600">
                      {user.city || "Pakistan"}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-800 text-xs">
                      {user.total_bookings} orders
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 text-xs">
                      {formatPKR(user.total_spent)}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3.5 px-4">
                      {user.is_suspended ? (
                        <div>
                          <Badge variant="danger">Suspended</Badge>
                          {user.suspension_reason && (
                            <div className="text-[10px] text-rose-600 truncate max-w-[120px]" title={user.suspension_reason}>
                              {user.suspension_reason}
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
                          onClick={() => setSelectedUser(user)}
                          className="h-8 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1 text-[#1B5E20]" />
                          Profile
                        </Button>

                        {user.is_suspended ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUnsuspend(user)}
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
                              setSuspendModalUser(user);
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

      {/* User Detail Drawer / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1B5E20] text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {selectedUser.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {selectedUser.full_name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    Customer Account: {selectedUser.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone Number
                </span>
                <p className="font-semibold text-gray-900 mt-1 font-mono">
                  {selectedUser.phone}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </span>
                <p className="font-semibold text-gray-900 mt-1 truncate">
                  {selectedUser.email || "Not Provided"}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" /> Total Bookings
                </span>
                <p className="font-bold text-gray-900 mt-1 text-sm">
                  {selectedUser.total_bookings} Services
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <span className="text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Primary City
                </span>
                <p className="font-semibold text-gray-900 mt-1">
                  {selectedUser.city || "Islamabad"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-800 font-medium">Platform Lifetime Spend</p>
                <p className="text-xl font-extrabold text-[#1B5E20]">
                  {formatPKR(selectedUser.total_spent)}
                </p>
              </div>
              <div className="text-right text-xs text-emerald-700">
                <p>Status: {selectedUser.is_suspended ? "Suspended" : "Active & Verified"}</p>
                <p className="text-[11px] text-gray-500">Member since {formatDate(selectedUser.created_at)}</p>
              </div>
            </div>

            {selectedUser.is_suspended && selectedUser.suspension_reason && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-1">
                <p className="font-semibold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Account Suspended
                </p>
                <p className="text-rose-700">{selectedUser.suspension_reason}</p>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedUser(null)}
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Account Modal */}
      {suspendModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-base">
                  <ShieldAlert className="w-5 h-5" />
                  <h3>Suspend Customer Account</h3>
                </div>
                <p className="text-xs text-gray-500">
                  Customer: {suspendModalUser.full_name} ({suspendModalUser.phone})
                </p>
              </div>
              <button
                onClick={() => setSuspendModalUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSuspendSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for Account Suspension *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="State clear reasons such as abusive language towards technicians, fake bookings, or chargebacks..."
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
                  onClick={() => setSuspendModalUser(null)}
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
