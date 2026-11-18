import React from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Send,
  TrendingUp,
  FileCheck2,
  PlugZap,
  Calculator,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Lock,
  BookOpen,
} from "lucide-react";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/groups", label: "Guest Groups", icon: Users },
  { href: "/campaigns", label: "Campaign Approvals", icon: Send },
  { href: "/results", label: "Results & Uplift", icon: TrendingUp },
  { href: "/readiness", label: "Data Readiness", icon: FileCheck2 },
  { href: "/connect", label: "Connect Your Data", icon: PlugZap },
  { href: "/costs", label: "Cost Estimator", icon: Calculator },
  { href: "/privacy", label: "Privacy & Control", icon: ShieldCheck },
  { href: "/guide", label: "Service Guide", icon: BookOpen },
];

export function Sidebar() {
  const location = useLocation();
  const { resetDemo, startTour, pendingCampaigns } = useDemoStore();

  const pendingCount = pendingCampaigns.filter(
    (c) => c.status === "pending",
  ).length;

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-[#E2EEF5] bg-white p-4 shadow-2xs shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Top: Brand Header */}
      <div>
        <Link to="/" className="flex items-center gap-3 px-2 py-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0E7C9B] to-[#3EC6F2] text-white shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[#0F2A3A]">
                Zirium AI
              </span>
              <span className="rounded-sm bg-[#3EC6F2]/20 px-1 py-0.5 text-[9px] font-bold text-[#0E7C9B]">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-[#5A7384]">
              Customer Intelligence
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-[#0E7C9B] text-white shadow-xs"
                    : "text-[#4B6372] hover:bg-[#EAF6FC] hover:text-[#0E7C9B]",
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-white" : "text-[#5A7384]",
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.href === "/campaigns" && pendingCount > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold",
                      isActive
                        ? "bg-white text-[#0E7C9B]"
                        : "bg-amber-100 text-amber-800",
                    )}
                  >
                    {pendingCount}
                  </span>
                )}

                {item.href === "/guide" && (
                  <span
                    className={cn(
                      "rounded-sm px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider",
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-[#EAF6FC] text-[#0E7C9B] border border-[#3EC6F2]/40",
                    )}
                  >
                    Guide
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="space-y-3 pt-4 border-t border-[#E2EEF5]">
        {/* Read-Only POS indicator */}
        <div className="rounded-xl bg-[#EAF6FC] p-3 text-[11px] text-[#0F2A3A] border border-[#D1E7F2]">
          <div className="flex items-center gap-1.5 font-bold text-[#0E7C9B]">
            <Lock className="h-3.5 w-3.5" />
            <span>POS Access: Read-Only</span>
          </div>
          <p className="mt-1 text-[10px] text-[#5A7384] leading-relaxed">
            Cannot alter orders, prices, or take payments. Owner approves all
            actions.
          </p>
        </div>

        {/* Start Guided Tour */}
        <button
          onClick={startTour}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0E7C9B]/10 to-[#3EC6F2]/10 border border-[#3EC6F2]/30 px-3 py-2 text-xs font-bold text-[#0E7C9B] hover:bg-[#3EC6F2]/20 transition-all shadow-2xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#3EC6F2]" />
          <span>10-Min Client Tour</span>
        </button>

        {/* Reset Demo Button */}

        <div className="text-center text-[10px] text-[#5A7384]">
          Presented by ZiriumAI
        </div>
      </div>
    </aside>
  );
}
