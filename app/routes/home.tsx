import React, { useState } from "react";
import { Link } from "react-router";
import { useDemoStore } from "@/lib/store";
import { KpiCard } from "@/components/ui/KpiCard";
import { SegmentBadge } from "@/components/ui/SegmentBadge";
import {
  Users,
  AlertTriangle,
  Send,
  TrendingUp,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Utensils,
  ChevronRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

export default function HomePage() {
  const {
    guests,
    selectedOutletId,
    pendingCampaigns,
    historicalCampaigns,
    nightlyUpdateState,
    runNightlyUpdate,
  } = useDemoStore();

  // Filter guests if specific outlet selected
  const filteredGuests =
    selectedOutletId === "all"
      ? guests
      : guests.filter((g) => g.preferredOutletId === selectedOutletId);

  // Compute KPIs
  const activeGuestsCount = filteredGuests.filter((g) => g.segment !== "Lapsed").length;
  const atRiskGuests = filteredGuests.filter((g) => g.segment === "Late" || g.segment === "Lapsed");
  const pendingCount = pendingCampaigns.filter((c) => c.status === "pending").length;

  // Extra orders created from campaigns in the last 90 days
  const extraOrdersLast90Days = historicalCampaigns.reduce((sum, c) => {
    const uplift = Math.max(0, c.messagedOrderRate - c.heldBackOrderRate);
    return sum + Math.round(uplift * c.messagedCount);
  }, 0);

  // Top 8 at-risk guests
  const topAtRisk = atRiskGuests
    .sort((a, b) => b.daysSinceLastOrder / b.usualGapDays - a.daysSinceLastOrder / a.usualGapDays)
    .slice(0, 8);

  // Segment distribution data for Recharts Pie Chart
  const segmentCounts: Record<string, number> = {
    Regular: 0,
    Late: 0,
    Lapsed: 0,
    New: 0,
  };
  filteredGuests.forEach((g) => {
    segmentCounts[g.segment] = (segmentCounts[g.segment] || 0) + 1;
  });

  const pieData = [
    { name: "Regular Diners", value: segmentCounts.Regular, color: "#0E7C9B" },
    { name: "Late (Due Visit)", value: segmentCounts.Late, color: "#F59E0B" },
    { name: "Lapsed (At Risk)", value: segmentCounts.Lapsed, color: "#EF4444" },
    { name: "New (<30 Days)", value: segmentCounts.New, color: "#3EC6F2" },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Nightly Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2EEF5] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#0F2A3A]">
              Restaurant Intelligence Overview
            </h1>
            <span className="hidden sm:inline-flex rounded-full bg-[#EAF6FC] px-2.5 py-0.5 text-xs font-semibold text-[#0E7C9B]">
              Nightly Digest
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-[#5A7384]">
            Every night we read your orders and tell you who needs attention. Owner approves all actions.
          </p>
        </div>

        {/* Nightly Run Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={runNightlyUpdate}
            disabled={nightlyUpdateState.isRunning}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0E7C9B] to-[#0B647D] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {nightlyUpdateState.isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4 fill-current" />
            )}
            <span>
              {nightlyUpdateState.isRunning
                ? "Running Nightly Ingestion..."
                : "Run Nightly Update"}
            </span>
          </button>
        </div>
      </div>

      {/* Nightly Sequence Animation Banner if running or just completed */}
      {(nightlyUpdateState.isRunning || nightlyUpdateState.newSuggestionAdded) && (
        <div className="rounded-2xl border border-[#3EC6F2]/40 bg-white p-5 shadow-md animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF6FC] text-[#0E7C9B]">
                <Sparkles className="h-4 w-4 text-[#3EC6F2]" />
              </div>
              <span className="text-xs font-bold text-[#0F2A3A]">
                {nightlyUpdateState.stepName || "Nightly Sequence In Progress"}
              </span>
            </div>
            <span className="text-xs font-bold text-[#0E7C9B]">
              {nightlyUpdateState.progress}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#EAF6FC] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0E7C9B] to-[#3EC6F2] h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${nightlyUpdateState.progress}%` }}
            />
          </div>

          <p className="mt-2.5 text-xs text-[#5A7384] flex items-center gap-1.5 font-mono">
            <span>&gt;</span>
            <span>{nightlyUpdateState.log}</span>
          </p>

          {nightlyUpdateState.newSuggestionAdded && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
              <span className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Fresh Campaign Generated: "VIP Biryani Loyalty" ready for review!
              </span>
              <Link
                to="/campaigns"
                className="font-bold underline hover:text-emerald-950 inline-flex items-center gap-1"
              >
                Review Now <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiCard
          title="Active Guests"
          value={activeGuestsCount.toLocaleString()}
          subtitle="Ordered within rhythm"
          trend={{ value: "+4.2%", positive: true }}
          icon={Users}
        />
        <KpiCard
          title="At Risk This Week"
          value={atRiskGuests.length.toLocaleString()}
          subtitle="Exceeded usual rhythm"
          variant="warning"
          icon={AlertTriangle}
        />
        <KpiCard
          title="Pending Approval"
          value={pendingCount}
          subtitle="Owner approval required"
          badge={pendingCount > 0 ? "Action Ready" : undefined}
          icon={Send}
        />
        <KpiCard
          title="Extra Orders (90d)"
          value={`+${extraOrdersLast90Days}`}
          subtitle="Proven by 10% holdout group"
          variant="highlight"
          icon={TrendingUp}
        />
      </div>

      {/* Main Grid: At Risk Diners + Waiting Approval & Segment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: At Risk This Week Priority List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-[#E2EEF5] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-[#0F2A3A]">
                  Guests At Risk This Week
                </h2>
                <p className="text-xs text-[#5A7384]">
                  Guests whose days since last order exceeded their usual visit frequency.
                </p>
              </div>
              <Link
                to="/groups"
                className="text-xs font-bold text-[#0E7C9B] hover:text-[#0B647D] flex items-center gap-1"
              >
                <span>View all {atRiskGuests.length}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {topAtRisk.map((guest) => {
                const ratio = Math.round((guest.daysSinceLastOrder / guest.usualGapDays) * 10) / 10;
                return (
                  <div
                    key={guest.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2.5 rounded-xl transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/guests/${guest.id}`}
                          className="text-sm font-bold text-[#0F2A3A] hover:text-[#0E7C9B] hover:underline"
                        >
                          {guest.name}
                        </Link>
                        <SegmentBadge segment={guest.segment} size="sm" />
                        {guest.mergedFrom.length > 0 && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                            Merged ({guest.mergedFrom.length})
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600">
                        Usually orders every{" "}
                        <span className="font-semibold text-slate-900">
                          {guest.usualGapDays} days
                        </span>
                        , it has been{" "}
                        <span className="font-bold text-amber-700">
                          {guest.daysSinceLastOrder} days
                        </span>{" "}
                        ({ratio}x cycle).
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-[#0E7C9B]">
                        <Utensils className="h-3 w-3" />
                        <span>Favourite: {guest.favouriteDish}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <Link
                        to={`/guests/${guest.id}`}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#EAF6FC] hover:text-[#0E7C9B] hover:border-[#3EC6F2] transition-colors"
                      >
                        Inspect Profile
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Waiting for Approval & Segment Chart */}
        <div className="space-y-6">
          {/* Waiting for Approval Card */}
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/70 to-orange-50/40 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
                <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                  Waiting For Your Approval
                </h3>
              </div>
              <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-xs font-bold text-amber-900">
                {pendingCount} Ready
              </span>
            </div>

            <p className="text-xs text-amber-800 leading-relaxed">
              Every message requires your manual sign-off before dispatch. We hold back 10% as a control group to measure true uplift.
            </p>

            <div className="mt-4 space-y-2.5">
              {pendingCampaigns
                .filter((c) => c.status === "pending")
                .slice(0, 2)
                .map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {campaign.name}
                      </div>
                      <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        Via {campaign.channel.toUpperCase()}
                      </div>
                    </div>
                    <Link
                      to="/campaigns"
                      className="rounded-lg bg-[#0E7C9B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0B647D] shrink-0"
                    >
                      Review
                    </Link>
                  </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
              <span className="text-amber-800 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Consent & quiet hours active
              </span>
              <Link
                to="/campaigns"
                className="font-bold text-[#0E7C9B] hover:underline"
              >
                Open Approvals &rarr;
              </Link>
            </div>
          </div>

          {/* Segment Breakdown Donut Chart */}
          <div className="rounded-2xl border border-[#E2EEF5] bg-white p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-[#0F2A3A] mb-1">
              Guest Segment Distribution
            </h3>
            <p className="text-xs text-[#5A7384] mb-3">
              Total {filteredGuests.length.toLocaleString()} profiled guests
            </p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [
                      `${Number(value).toLocaleString()} guests (${Math.round(
                        (Number(value) / filteredGuests.length) * 100
                      )}%)`,
                      "Count",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-slate-600 font-medium">
                    {item.name}:{" "}
                    <strong className="text-slate-900">
                      {Math.round((item.value / filteredGuests.length) * 100)}%
                    </strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
