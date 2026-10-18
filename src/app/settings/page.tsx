"use client";

import * as React from "react";
import {
  Settings,
  DollarSign,
  Percent,
  CreditCard,
  Award,
  Save,
  CheckCircle,
  AlertCircle,
  Building,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  // 1. Visit Fee Settings
  const [visitFee, setVisitFee] = React.useState<number>(0);
  const [isSavingVisitFee, setIsSavingVisitFee] = React.useState(false);

  // 2. Commission Settings
  const [commissionRate, setCommissionRate] = React.useState<number>(10);
  const [isSavingCommission, setIsSavingCommission] = React.useState(false);

  // 3. Payment Accounts Settings
  const [paymentAccounts, setPaymentAccounts] = React.useState({
    jazzcashNumber: "0319 7318425",
    jazzcashTitle: "KAMZO Services / Parvindar",
    easypaisaNumber: "0319 7318425",
    easypaisaTitle: "KAMZO Services / Parvindar",
    bankName: "Allied Bank / Meezan Bank",
    bankTitle: "KAMZO Marketplace",
    bankIban: "PK36MEZN0001234567890123",
  });
  const [isSavingAccounts, setIsSavingAccounts] = React.useState(false);

  // 4. Worker Level Thresholds
  const [workerLevels, setWorkerLevels] = React.useState([
    {
      level: 1,
      name: "Level 1 (New)",
      minJobs: 0,
      discount: 0,
      isReadOnly: true,
      description: "Default starting tier for recently registered workers.",
    },
    {
      level: 2,
      name: "Level 2 (Active)",
      minJobs: 25,
      discount: 2,
      isReadOnly: false,
      description: "Unlocked after sustained initial service completions.",
    },
    {
      level: 3,
      name: "Level 3 (Trusted)",
      minJobs: 75,
      discount: 5,
      isReadOnly: false,
      description: "Priority dispatching and reduced platform commission.",
    },
    {
      level: 4,
      name: "Level 4 (Expert)",
      minJobs: 200,
      discount: 8,
      isReadOnly: false,
      description: "Elite top-rated tier with highest platform visibility.",
    },
  ]);
  const [isSavingLevels, setIsSavingLevels] = React.useState(false);

  // Toast feedback
  const [toast, setToast] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load existing settings from Supabase / localStorage on mount
  React.useEffect(() => {
    // 1. Check localStorage first for instant hydration
    try {
      const savedFee = localStorage.getItem("kamzo_visit_fee");
      if (savedFee !== null) setVisitFee(Number(savedFee));
      const savedComm = localStorage.getItem("kamzo_commission_rate");
      if (savedComm !== null) setCommissionRate(Number(savedComm));
      const savedAccs = localStorage.getItem("kamzo_payment_accounts");
      if (savedAccs !== null) setPaymentAccounts(JSON.parse(savedAccs));
      const savedLevels = localStorage.getItem("kamzo_worker_levels");
      if (savedLevels !== null) setWorkerLevels(JSON.parse(savedLevels));
    } catch (_) {}

    // 2. Sync from backend API (/api/settings) and Supabase
    async function loadRemoteSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.settings) {
            if (typeof json.settings.visit_fee === "number") {
              setVisitFee(json.settings.visit_fee);
              try { localStorage.setItem("kamzo_visit_fee", json.settings.visit_fee.toString()); } catch (_) {}
            }
            if (typeof json.settings.commission_rate === "number") {
              setCommissionRate(json.settings.commission_rate);
              try { localStorage.setItem("kamzo_commission_rate", json.settings.commission_rate.toString()); } catch (_) {}
            }
            if (json.settings.payment_accounts) {
              setPaymentAccounts((prev) => ({ ...prev, ...json.settings.payment_accounts }));
              try { localStorage.setItem("kamzo_payment_accounts", JSON.stringify(json.settings.payment_accounts)); } catch (_) {}
            }
          }
        }
      } catch (err) {
        console.warn("API settings sync skipped:", err);
      }

      try {
        const { data, error } = await supabase.from("admin_settings").select("key, value");
        if (!error && data && data.length > 0) {
          data.forEach((row: { key: string; value: string }) => {
            if (row.key === "visit_fee") {
              const parsed = Number(row.value);
              if (!isNaN(parsed)) {
                setVisitFee(parsed);
                try { localStorage.setItem("kamzo_visit_fee", parsed.toString()); } catch (_) {}
              }
            } else if (row.key === "commission_rate") {
              const parsed = Number(row.value);
              if (!isNaN(parsed)) {
                setCommissionRate(parsed);
                try { localStorage.setItem("kamzo_commission_rate", parsed.toString()); } catch (_) {}
              }
            } else if (row.key === "payment_accounts") {
              try {
                setPaymentAccounts(JSON.parse(row.value));
                localStorage.setItem("kamzo_payment_accounts", row.value);
              } catch (_) {}
            } else if (row.key === "worker_levels") {
              try {
                setWorkerLevels(JSON.parse(row.value));
                localStorage.setItem("kamzo_worker_levels", row.value);
              } catch (_) {}
            }
          });
        }
      } catch (err) {
        console.warn("Supabase admin_settings sync skipped:", err);
      }
    }
    loadRemoteSettings();
  }, []);

  // Handlers
  const handleSaveVisitFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (visitFee < 0) {
      showToast("Visit fee cannot be negative.", "error");
      return;
    }
    setIsSavingVisitFee(true);
    try {
      localStorage.setItem("kamzo_visit_fee", visitFee.toString());
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visit_fee: visitFee }),
      });
      await supabase
        .from("admin_settings")
        .upsert(
          { key: "visit_fee", value: visitFee.toString(), description: "Standard visit fee charged to customers" } as any,
          { onConflict: "key" }
        );
    } catch (e) {
      console.warn("Supabase settings write skipped or offline.");
    } finally {
      setIsSavingVisitFee(false);
      showToast(
        visitFee === 0
          ? "Visit fee set to Rs. 0 (Free Visit / Diagnostic)!"
          : `Default visit fee updated to ${formatPKR(visitFee)}!`
      );
    }
  };

  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCommission(true);
    try {
      localStorage.setItem("kamzo_commission_rate", commissionRate.toString());
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commission_rate: commissionRate }),
      });
      await supabase
        .from("admin_settings")
        .upsert(
          { key: "commission_rate", value: commissionRate.toString(), description: "Platform revenue share percentage" } as any,
          { onConflict: "key" }
        );
    } catch (e) {
      console.warn("Supabase settings write skipped or offline.");
    } finally {
      setIsSavingCommission(false);
      showToast(`Commission percentage updated to ${commissionRate}%!`);
    }
  };

  const handleSaveAccounts = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAccounts(true);
    try {
      localStorage.setItem("kamzo_payment_accounts", JSON.stringify(paymentAccounts));
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_accounts: paymentAccounts }),
      });
      await supabase
        .from("admin_settings")
        .upsert(
          { key: "payment_accounts", value: JSON.stringify(paymentAccounts), description: "Deposit credentials shown to users" } as any,
          { onConflict: "key" }
        );
    } catch (e) {
      console.warn("Supabase settings write skipped or offline.");
    } finally {
      setIsSavingAccounts(false);
      showToast("Settlement accounts updated successfully!");
    }
  };

  const handleSaveLevels = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLevels(true);
    try {
      await supabase
        .from("admin_settings")
        .upsert(
          { key: "worker_levels", value: JSON.stringify(workerLevels), description: "Worker level requirements and perks" } as any,
          { onConflict: "key" }
        );
    } catch (e) {
      console.warn("Supabase settings write skipped or offline.");
    } finally {
      setIsSavingLevels(false);
      showToast("Worker level thresholds saved successfully!");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 transition-all ${
            toast.type === "success"
              ? "bg-[#1B5E20] text-white border-emerald-700"
              : "bg-rose-700 text-white border-rose-800"
          }`}
        >
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Platform Configuration & Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Adjust visit fee rates, marketplace commission shares, corporate bank accounts, and worker advancement thresholds.
        </p>
      </div>

      {/* SECTION 1: Visit Fee & Commission Rate (Two Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visit Fee */}
        <Card
          title="Visit Inspection Fee"
          subtitle="Fixed initial dispatch fee charged to customers before quotation"
        >
          <CardContent className="pt-4">
            <form onSubmit={handleSaveVisitFee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Visit Fee Amount (PKR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={visitFee}
                    onChange={(e) => setVisitFee(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 text-sm font-bold text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Minimum allowed: <strong>Rs. 0</strong> (Free visit/diagnostic). Default: <strong>Rs. 200</strong>.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSavingVisitFee}
                  className="bg-[#1B5E20] hover:bg-[#144717]"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  Save Visit Fee
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Commission Percentage */}
        <Card
          title="Platform Commission Rate"
          subtitle="Percentage deducted from worker earnings per completed booking"
        >
          <CardContent className="pt-4">
            <form onSubmit={handleSaveCommission} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Commission Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    step={1}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full pl-4 pr-10 py-2.5 text-sm font-bold text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xs">
                    %
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  Standard platform commission: <strong>10%</strong>. Higher tiers receive automatic discounts.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSavingCommission}
                  className="bg-[#1B5E20] hover:bg-[#144717]"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  Save Commission
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2: Official Payment Accounts */}
      <Card
        title="Official Collection Accounts"
        subtitle="Credentials displayed inside customer & worker apps for direct mobile wallet & IBAN deposits"
      >
        <CardContent className="pt-4">
          <form onSubmit={handleSaveAccounts} className="space-y-6">
            {/* JazzCash Section */}
            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-rose-600" />
                <h4 className="font-bold text-rose-950 text-sm">JazzCash Merchant Account</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    JazzCash Account Number
                  </label>
                  <input
                    type="text"
                    value={paymentAccounts.jazzcashNumber}
                    onChange={(e) =>
                      setPaymentAccounts({ ...paymentAccounts, jazzcashNumber: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    JazzCash Account Title
                  </label>
                  <input
                    type="text"
                    value={paymentAccounts.jazzcashTitle}
                    onChange={(e) =>
                      setPaymentAccounts({ ...paymentAccounts, jazzcashTitle: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
              </div>
            </div>

            {/* Easypaisa Section */}
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 space-y-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-emerald-950 text-sm">Easypaisa Merchant Account</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Easypaisa Account Number
                  </label>
                  <input
                    type="text"
                    value={paymentAccounts.easypaisaNumber}
                    onChange={(e) =>
                      setPaymentAccounts({ ...paymentAccounts, easypaisaNumber: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Easypaisa Account Title
                  </label>
                  <input
                    type="text"
                    value={paymentAccounts.easypaisaTitle}
                    onChange={(e) =>
                      setPaymentAccounts({ ...paymentAccounts, easypaisaTitle: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
              </div>
            </div>

            {/* Bank Transfer Section */}
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 space-y-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-blue-950 text-sm">Corporate Bank Account (IBAN)</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={paymentAccounts.bankName}
                    onChange={(e) =>
                      setPaymentAccounts({ ...paymentAccounts, bankName: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Account Title
                  </label>
                  <input
                    type="text"
                    value={paymentAccounts.bankTitle}
                    onChange={(e) =>
                      setPaymentAccounts({ ...paymentAccounts, bankTitle: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    IBAN (24 Characters)
                  </label>
                  <input
                    type="text"
                    value={paymentAccounts.bankIban}
                    onChange={(e) =>
                      setPaymentAccounts({ ...paymentAccounts, bankIban: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 bg-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSavingAccounts}
                className="bg-[#1B5E20] hover:bg-[#144717] px-6"
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save Collection Accounts
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* SECTION 3: Worker Level Thresholds */}
      <Card
        title="Worker Level Advancement Thresholds"
        subtitle="Automatic tier elevation criteria and commission reductions for loyal service providers"
      >
        <CardContent className="pt-4">
          <form onSubmit={handleSaveLevels} className="space-y-4">
            <div className="divide-y divide-gray-100">
              {workerLevels.map((lvl, index) => (
                <div
                  key={lvl.level}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{lvl.name}</span>
                      {lvl.isReadOnly ? (
                        <Badge variant="default" size="sm">Baseline</Badge>
                      ) : (
                        <Badge variant="success" size="sm">Configurable</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{lvl.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                        Min. Jobs Required
                      </label>
                      <input
                        type="number"
                        min={0}
                        disabled={lvl.isReadOnly}
                        value={lvl.minJobs}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setWorkerLevels((prev) =>
                            prev.map((item, i) => (i === index ? { ...item, minJobs: val } : item))
                          );
                        }}
                        className="w-24 p-2 text-xs font-mono font-semibold rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">
                        Commission Discount
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          max={20}
                          disabled={lvl.isReadOnly}
                          value={lvl.discount}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setWorkerLevels((prev) =>
                              prev.map((item, i) => (i === index ? { ...item, discount: val } : item))
                            );
                          }}
                          className="w-24 p-2 pr-6 text-xs font-mono font-semibold rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1B5E20]"
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSavingLevels}
                className="bg-[#1B5E20] hover:bg-[#144717] px-6"
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save Level Thresholds
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
