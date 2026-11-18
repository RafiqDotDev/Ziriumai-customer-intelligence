import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Send,
  TrendingUp,
  MoreHorizontal,
  FileCheck2,
  PlugZap,
  Calculator,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  X,
  BookOpen,
} from "lucide-react";
import { useDemoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const location = useLocation();
  const { pendingCampaigns, resetDemo, startTour } = useDemoStore();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const pendingCount = pendingCampaigns.filter((c) => c.status === "pending").length;

  const PRIMARY_MOBILE_ITEMS = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/campaigns", label: "Approvals", icon: Send, badge: pendingCount },
    { href: "/results", label: "Results", icon: TrendingUp },
  ];

  const SECONDARY_ITEMS = [
    { href: "/guide", label: "Service Guide (PDF)", icon: BookOpen },
    { href: "/readiness", label: "Data Readiness", icon: FileCheck2 },
    { href: "/connect", label: "Connect Your Data", icon: PlugZap },
    { href: "/costs", label: "Cost Estimator", icon: Calculator },
    { href: "/privacy", label: "Privacy & Control", icon: ShieldCheck },
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-[#E2EEF5] bg-white/95 px-2 backdrop-blur-md shadow-lg">
        {PRIMARY_MOBILE_ITEMS.map((item) => {
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
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 text-[10px] font-semibold transition-colors relative",
                isActive ? "text-[#0E7C9B]" : "text-[#5A7384]"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-amber-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* More Menu Trigger */}
        <button
          onClick={() => setMoreMenuOpen(true)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 py-1 text-[10px] font-semibold transition-colors text-[#5A7384]",
            moreMenuOpen && "text-[#0E7C9B]"
          )}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>

      {/* More Sheet on Mobile */}
      {moreMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs lg:hidden">
          <div className="rounded-t-3xl bg-white p-5 shadow-2xl border-t border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">More Pages & Tools</span>
              <button
                onClick={() => setMoreMenuOpen(false)}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-4">
              {SECONDARY_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-3 text-xs font-semibold text-slate-800 hover:bg-[#EAF6FC]"
                  >
                    <Icon className="h-4 w-4 text-[#0E7C9B]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  startTour();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0E7C9B] px-3 py-2.5 text-xs font-bold text-white shadow-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>Start Client Tour</span>
              </button>

              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  resetDemo();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
