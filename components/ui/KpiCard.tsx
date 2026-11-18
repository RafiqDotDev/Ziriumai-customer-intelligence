import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  icon?: LucideIcon;
  variant?: "default" | "highlight" | "danger" | "warning";
  onClick?: () => void;
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  badge,
  trend,
  icon: Icon,
  variant = "default",
  onClick,
  className,
}: KpiCardProps) {
  const variantStyles = {
    default: "bg-white border-[#E2EEF5] text-[#0F2A3A]",
    highlight:
      "bg-gradient-to-br from-[#0E7C9B]/5 to-[#3EC6F2]/10 border-[#3EC6F2]/30 text-[#0F2A3A]",
    warning: "bg-amber-50/60 border-amber-200 text-amber-950",
    danger: "bg-red-50/60 border-red-200 text-red-950",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-3.5 sm:p-5 shadow-xs transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:-translate-y-0.5",
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-1 sm:gap-3">
        <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-[#5A7384] truncate">
          {title}
        </span>
        {Icon && (
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-[#EAF6FC] text-[#0E7C9B]">
            <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
        )}
      </div>

      <div className="mt-2 sm:mt-3 flex items-baseline gap-1.5 flex-wrap">
        <div className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0F2A3A] truncate">
          {value}
        </div>
        {badge && (
          <span className="inline-flex rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 text-[11px] sm:text-xs text-[#5A7384] flex-wrap leading-tight">
          {trend && (
            <span
              className={cn(
                "font-semibold shrink-0",
                trend.positive ? "text-emerald-600" : "text-amber-600",
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
