"use client";

import * as React from "react";
import {
  Gift,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  X,
  Check,
  Ban,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPKR, formatDate } from "@/lib/utils";
import { BonusRule, WorkerBonus, BonusPeriod, BonusStatus } from "@/types/database.types";
import { supabase } from "@/lib/supabase/client";

interface EligibleWorkerItem {
  id: string;
  worker_id: string;
  worker_name: string;
  worker_phone: string;
  completed_jobs: number;
  rule_title: string;
  bonus_amount: number;
  period: string;
  status: BonusStatus;
}

interface BonusHistoryItem {
  id: string;
  worker_name: string;
  worker_phone: string;
  amount: number;
  rule_title: string;
  paid_at: string;
  reference: string;
  status: "paid" | "rejected";
}

const initialRules: BonusRule[] = [
  {
    id: "br-1",
    title: "Weekly Sprint Starter",
    min_jobs: 10,
    bonus_amount: 1500,
    period: "weekly",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "br-2",
    title: "Weekly Pro Performer",
    min_jobs: 25,
    bonus_amount: 4000,
    period: "weekly",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "br-3",
    title: "Monthly Champion Bonus",
    min_jobs: 80,
    bonus_amount: 15000,
    period: "monthly",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "br-4",
    title: "Eid Special Rush Milestone",
    min_jobs: 15,
    bonus_amount: 3000,
    period: "weekly",
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const initialEligibleWorkers: EligibleWorkerItem[] = [
  {
    id: "wb-101",
    worker_id: "w-1",
    worker_name: "Tariq Mahmood",
    worker_phone: "0321-7654321",
    completed_jobs: 27,
    rule_title: "Weekly Pro Performer",
    bonus_amount: 4000,
    period: "Oct 7 - Oct 14, 2026",
    status: "eligible",
  },
  {
    id: "wb-102",
    worker_id: "w-2",
    worker_name: "Kamran Ali",
    worker_phone: "0345-1112223",
    completed_jobs: 12,
    rule_title: "Weekly Sprint Starter",
    bonus_amount: 1500,
    period: "Oct 7 - Oct 14, 2026",
    status: "eligible",
  },
  {
    id: "wb-103",
    worker_id: "w-3",
    worker_name: "Zafar Iqbal",
    worker_phone: "0304-9998877",
    completed_jobs: 11,
    rule_title: "Weekly Sprint Starter",
    bonus_amount: 1500,
    period: "Oct 7 - Oct 14, 2026",
    status: "approved",
  },
];

const initialHistory: BonusHistoryItem[] = [
  {
    id: "hist-1",
    worker_name: "Sajid Rasheed",
    worker_phone: "0301-6677889",
    amount: 15000,
    rule_title: "Monthly Champion Bonus",
    paid_at: "2026-09-30",
    reference: "BON-SEP-9812",
    status: "paid",
  },
  {
    id: "hist-2",
    worker_name: "Rashid Minhas",
    worker_phone: "0342-3344556",
    amount: 4000,
    rule_title: "Weekly Pro Performer",
    paid_at: "2026-10-01",
    reference: "BON-OCT-1120",
    status: "paid",
  },
  {
    id: "hist-3",
    worker_name: "Imran Qureshi",
    worker_phone: "0300-4443322",
    amount: 1500,
    rule_title: "Weekly Sprint Starter",
    paid_at: "2026-10-02",
    reference: "N/A",
    status: "rejected",
  },
];

export default function BonusesPage() {
  const [rules, setRules] = React.useState<BonusRule[]>(initialRules);
  const [eligibleWorkers, setEligibleWorkers] = React.useState<EligibleWorkerItem[]>(initialEligibleWorkers);
  const [history, setHistory] = React.useState<BonusHistoryItem[]>(initialHistory);

  // New Rule Modal State
  const [isAddRuleOpen, setIsAddRuleOpen] = React.useState(false);
  const [ruleTitle, setRuleTitle] = React.useState("");
  const [minJobs, setMinJobs] = React.useState<number>(10);
  const [bonusAmount, setBonusAmount] = React.useState<number>(2000);
  const [period, setPeriod] = React.useState<BonusPeriod>("weekly");

  // Notification Toast
  const [toast, setToast] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleTitle.trim()) return;

    const newRule: BonusRule = {
      id: `br-${Date.now()}`,
      title: ruleTitle,
      min_jobs: minJobs,
      bonus_amount: bonusAmount,
      period,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setRules([newRule, ...rules]);
    setIsAddRuleOpen(false);
    setRuleTitle("");
    setMinJobs(10);
    setBonusAmount(2000);
    showToast(`Bonus rule "${newRule.title}" created successfully!`);
  };

  const toggleRuleActive = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, is_active: !r.is_active } : r))
    );
    showToast("Rule status updated.");
  };

  const handleApprove = (id: string) => {
    setEligibleWorkers((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: "approved" as BonusStatus } : w))
    );
    showToast("Worker bonus approved for payout!");
  };

  const handlePay = (worker: EligibleWorkerItem) => {
    if (!confirm(`Confirm payout of ${formatPKR(worker.bonus_amount)} to ${worker.worker_name}?`)) {
      return;
    }

    setEligibleWorkers((prev) => prev.filter((w) => w.id !== worker.id));
    setHistory([
      {
        id: `hist-${Date.now()}`,
        worker_name: worker.worker_name,
        worker_phone: worker.worker_phone,
        amount: worker.bonus_amount,
        rule_title: worker.rule_title,
        paid_at: new Date().toISOString().split("T")[0],
        reference: `BON-TX-${Math.floor(100000 + Math.random() * 900000)}`,
        status: "paid",
      },
      ...history,
    ]);
    showToast(`Bonus of ${formatPKR(worker.bonus_amount)} paid to ${worker.worker_name}!`);
  };

  const handleReject = (worker: EligibleWorkerItem) => {
    const reason = prompt("Enter reason for rejecting this bonus payout (e.g. quality issues, customer dispute):");
    if (reason === null) return;

    setEligibleWorkers((prev) => prev.filter((w) => w.id !== worker.id));
    setHistory([
      {
        id: `hist-${Date.now()}`,
        worker_name: worker.worker_name,
        worker_phone: worker.worker_phone,
        amount: worker.bonus_amount,
        rule_title: worker.rule_title,
        paid_at: new Date().toISOString().split("T")[0],
        reference: reason || "Disqualified",
        status: "rejected",
      },
      ...history,
    ]);
    showToast(`Bonus for ${worker.worker_name} marked as rejected.`, "error" as any);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B5E20] text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-700 text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Worker Bonus & Incentive Program
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Motivate service providers with tiered weekly sprints, job volume bonuses, and automated payouts.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAddRuleOpen(true)}
          className="gap-2 bg-[#1B5E20] hover:bg-[#144717]"
        >
          <Plus className="w-4 h-4" />
          Create Bonus Rule
        </Button>
      </div>

      {/* SECTION 1: Bonus Rules */}
      <Card
        title="Active Bonus Rules & Thresholds"
        subtitle="Automatic incentive triggers based on verified completed jobs"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Rule Title</th>
                <th className="py-3.5 px-4">Min. Jobs Required</th>
                <th className="py-3.5 px-4">Bonus Payout</th>
                <th className="py-3.5 px-4">Frequency</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-5 font-semibold text-gray-900 text-xs sm:text-sm">
                    {rule.title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-medium text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {rule.min_jobs} completed jobs
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#1B5E20] text-xs sm:text-sm">
                    {formatPKR(rule.bonus_amount)}
                  </td>
                  <td className="py-3.5 px-4 capitalize text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {rule.period}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {rule.is_active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="default">Paused</Badge>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Button
                      variant={rule.is_active ? "outline" : "primary"}
                      size="sm"
                      onClick={() => toggleRuleActive(rule.id)}
                      className="h-7 text-xs"
                    >
                      {rule.is_active ? "Pause Rule" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 2: Eligible Workers */}
      <Card
        title="Workers Eligible for Bonus"
        subtitle="Workers who have fulfilled target requirements in the current evaluation cycle"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-5">Worker Name</th>
                <th className="py-3.5 px-4">Jobs Completed</th>
                <th className="py-3.5 px-4">Triggered Rule</th>
                <th className="py-3.5 px-4">Bonus Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {eligibleWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                    No workers currently pending bonus review.
                  </td>
                </tr>
              ) : (
                eligibleWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                        {worker.worker_name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {worker.worker_phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-700">
                      {worker.completed_jobs} jobs
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-700">
                      {worker.rule_title}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900 text-xs sm:text-sm">
                      {formatPKR(worker.bonus_amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      {worker.status === "eligible" ? (
                        <Badge variant="warning">Eligible (Review)</Badge>
                      ) : worker.status === "approved" ? (
                        <Badge variant="info">Approved for Pay</Badge>
                      ) : (
                        <Badge variant="default">{worker.status}</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {worker.status === "eligible" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(worker.id)}
                            className="h-8 text-xs border-emerald-600 text-[#1B5E20] hover:bg-emerald-50"
                          >
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handlePay(worker)}
                          className="h-8 text-xs bg-[#1B5E20] hover:bg-[#144717]"
                        >
                          <DollarSign className="w-3.5 h-3.5 mr-1" />
                          Pay Now
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(worker)}
                          className="h-8 text-xs"
                        >
                          <Ban className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* SECTION 3: Bonus History */}
      <Card
        title="Bonus Disbursement History"
        subtitle="Audit log of released worker incentives and wallet credit memos"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
              <tr>
                <th className="py-3 px-5">Reference #</th>
                <th className="py-3 px-4">Worker</th>
                <th className="py-3 px-4">Incentive Tier</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Disbursed Date</th>
                <th className="py-3 px-5 text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="py-3 px-5 font-mono text-xs font-medium text-gray-700">
                    {item.reference}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                      {item.worker_name}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono ml-2">
                      {item.worker_phone}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-600">
                    {item.rule_title}
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900 text-xs sm:text-sm">
                    {formatPKR(item.amount)}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {formatDate(item.paid_at)}
                  </td>
                  <td className="py-3 px-5 text-right">
                    {item.status === "paid" ? (
                      <Badge variant="success">Paid Out</Badge>
                    ) : (
                      <Badge variant="danger">Disqualified</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Add New Bonus Rule */}
      {isAddRuleOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center gap-2 text-[#1B5E20] font-bold text-base">
                <Gift className="w-5 h-5" />
                <h3>Create New Bonus Rule</h3>
              </div>
              <button
                onClick={() => setIsAddRuleOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Rule Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramadan Super Dispatch Bonus"
                  value={ruleTitle}
                  onChange={(e) => setRuleTitle(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Min Completed Jobs *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={minJobs}
                    onChange={(e) => setMinJobs(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bonus Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    required
                    value={bonusAmount}
                    onChange={(e) => setBonusAmount(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Evaluation Period *
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as BonusPeriod)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                >
                  <option value="weekly">Weekly Cycle (Mon - Sun)</option>
                  <option value="monthly">Monthly Cycle (1st - End of Month)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddRuleOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-[#1B5E20] hover:bg-[#144717]"
                >
                  Save & Enable Rule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
