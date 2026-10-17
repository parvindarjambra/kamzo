import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export type StatColorVariant = "blue" | "green" | "orange" | "purple" | "red" | "emerald";

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  badge?: {
    text: string | number;
    variant?: "danger" | "warning" | "success" | "info";
  };
  colorVariant?: StatColorVariant;
  className?: string;
  subtext?: string;
}

const colorMap: Record<StatColorVariant, { bg: string; iconBg: string; iconColor: string; ring: string }> = {
  blue: {
    bg: "hover:border-blue-200",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    ring: "focus-visible:ring-blue-500",
  },
  green: {
    bg: "hover:border-emerald-200",
    iconBg: "bg-emerald-50",
    iconColor: "text-[#1B5E20]",
    ring: "focus-visible:ring-emerald-500",
  },
  orange: {
    bg: "hover:border-amber-200",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    ring: "focus-visible:ring-amber-500",
  },
  purple: {
    bg: "hover:border-purple-200",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    ring: "focus-visible:ring-purple-500",
  },
  red: {
    bg: "hover:border-rose-200",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    ring: "focus-visible:ring-rose-500",
  },
  emerald: {
    bg: "hover:border-emerald-200",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    ring: "focus-visible:ring-emerald-500",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  badge,
  colorVariant = "green",
  className,
  subtext,
}: StatCardProps) {
  const styling = colorMap[colorVariant];

  return (
    <div
      className={cn(
        "relative rounded-xl border border-gray-200/80 bg-white p-5 shadow-card transition-all duration-200 hover:shadow-card-hover flex flex-col justify-between",
        styling.bg,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {label}
          </p>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mt-1">
            {value}
          </div>
        </div>

        <div className={cn("p-3 rounded-xl flex items-center justify-center shrink-0", styling.iconBg)}>
          <Icon className={cn("w-6 h-6", styling.iconColor)} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-gray-500">
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend.value}
              {trend.label && (
                <span className="text-gray-500 font-normal ml-1">
                  {trend.label}
                </span>
              )}
            </span>
          ) : subtext ? (
            <span>{subtext}</span>
          ) : (
            <span className="text-gray-400">Live platform metric</span>
          )}
        </div>

        {badge && (
          <Badge variant={badge.variant || "danger"} size="sm">
            {badge.text}
          </Badge>
        )}
      </div>
    </div>
  );
}
