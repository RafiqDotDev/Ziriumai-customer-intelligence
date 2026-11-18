import React from "react";
import { useDemoStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Figure1NightlyLoop } from "@/components/guide/Figure1NightlyLoop";
import {
  TrendingUp,
  Percent,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  HelpCircle,
  BarChart2,
  Users,
  Target,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function ResultsPage() {
  const { historicalCampaigns, currencySymbol } = useDemoStore();

  // Aggregate metrics across all campaigns
  const aggregateMetrics = historicalCampaigns.reduce(
    (acc, camp) => {
      const uplift = Math.max(0, camp.messagedOrderRate - camp.heldBackOrderRate);
      const extraOrders = Math.round(uplift * camp.messagedCount);
      const extraRevenue = Math.round(extraOrders * camp.averageOrderValue);
      const cost = Math.round(camp.messagedCount * camp.costPerMessage * 100) / 100;

      acc.totalMessaged += camp.messagedCount;
      acc.totalHeldBack += camp.heldBackCount;
      acc.totalExtraOrders += extraOrders;
      acc.totalExtraRevenue += extraRevenue;
      acc.totalCost += cost;
      return acc;
    },
    {
      totalMessaged: 0,
      totalHeldBack: 0,
      totalExtraOrders: 0,
      totalExtraRevenue: 0,
      totalCost: 0,
    }
  );

  const aggregateROI =
    aggregateMetrics.totalCost > 0
      ? Math.round(
          ((aggregateMetrics.totalExtraRevenue - aggregateMetrics.totalCost) /
            aggregateMetrics.totalCost) *
            10
        ) / 10
      : 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2EEF5] shadow-2xs">
        <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#0F2A3A]">
          Campaign Results & True Uplift
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5A7384]">
          Because a random group wasn't contacted, this shows orders the campaign truly created.
        </p>
      </div>

      {/* Aggregate KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0E7C9B]/5 to-[#3EC6F2]/15 border border-[#3EC6F2]/30 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A7384]">
            Total Extra Orders Created
          </span>
          <div className="text-2xl lg:text-3xl font-black text-[#0F2A3A] mt-2">
            +{aggregateMetrics.totalExtraOrders}
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 inline-flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> Proven incremental orders
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EEF5] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A7384]">
            Incremental Revenue
          </span>
          <div className="text-2xl lg:text-3xl font-black text-[#0F2A3A] mt-2">
            {formatCurrency(aggregateMetrics.totalExtraRevenue, currencySymbol)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Net of what regulars would have spent
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EEF5] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A7384]">
            Total Messaging Cost
          </span>
          <div className="text-2xl lg:text-3xl font-black text-[#0F2A3A] mt-2">
            {formatCurrency(aggregateMetrics.totalCost, currencySymbol)}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Across SMS, WhatsApp, & Email
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            Net Campaign ROI
          </span>
          <div className="text-2xl lg:text-3xl font-black text-emerald-700 mt-2">
            {aggregateROI}x
          </div>
          <span className="text-xs text-emerald-800 font-medium mt-1 block">
            Return per dollar of message spend
          </span>
        </div>
      </div>

      {/* Explainer: How We Measure (The 10% Holdout Diagram) */}
      <div className="rounded-3xl border border-[#3EC6F2]/30 bg-gradient-to-r from-white to-[#EAF6FC] p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0E7C9B] text-white">
            <Target className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-[#0F2A3A]">
            How We Measure: The Randomized Control Holdout
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          Traditional marketing agencies claim credit for <em>every</em> guest who orders after an email, even if they were going to order anyway. Zirium AI solves this by keeping an uncontacted 10% control group for every campaign.
        </p>

        {/* Visual Flow diagram */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold text-[#0E7C9B] uppercase">Step 1: 100% Eligible</div>
            <p className="text-xs text-slate-600 mt-1">
              Guest cohort identified (e.g. 500 at-risk diners).
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="text-xs font-bold text-purple-700 uppercase">
              Step 2: 90% vs 10% Split
            </div>
            <p className="text-xs text-slate-600 mt-1">
              450 receive message • 50 uncontacted holdout control.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-300 shadow-2xs">
            <div className="text-xs font-bold text-emerald-700 uppercase">
              Step 3: True Incremental Uplift
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Uplift = Messaged Rate minus Held-back Rate.
            </p>
          </div>
        </div>
      </div>

      {/* Individual Campaign Cards with Charts */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-[#0F2A3A]">
          Completed Campaign Performance Cards
        </h2>

        {historicalCampaigns.map((camp) => {
          const uplift = Math.max(0, camp.messagedOrderRate - camp.heldBackOrderRate);
          const upliftPercentagePoints = Math.round(uplift * 1000) / 10;
          const extraOrders = Math.round(uplift * camp.messagedCount);
          const incrementalRevenue = Math.round(extraOrders * camp.averageOrderValue);
          const messagingCost = Math.round(camp.messagedCount * camp.costPerMessage * 100) / 100;
          const roi =
            messagingCost > 0
              ? Math.round(((incrementalRevenue - messagingCost) / messagingCost) * 10) / 10
              : 0;

          // Chart data
          const chartData = [
            {
              cohort: "90% Messaged Cohort",
              rate: Math.round(camp.messagedOrderRate * 1000) / 10,
              fill: "#0E7C9B",
            },
            {
              cohort: "10% Held-back Control",
              rate: Math.round(camp.heldBackOrderRate * 1000) / 10,
              fill: "#9333EA",
            },
          ];

          return (
            <div
              key={camp.id}
              className="rounded-3xl border border-[#E2EEF5] bg-white p-6 shadow-xs space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#0F2A3A]">
                      {camp.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold text-[#0E7C9B] bg-[#EAF6FC] px-2 py-0.5 rounded-full">
                      Via {camp.channel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target: {camp.targetSegment} • Sent on {camp.sentDate}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      True Uplift
                    </span>
                    <span className="text-lg font-black text-emerald-600">
                      +{upliftPercentagePoints}% pts
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid: 2 columns (Chart + Metrics breakdown) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                {/* Chart */}
                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Order Rate Comparison (Messaged vs Held-Back)
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="cohort" tick={{ fontSize: 11 }} />
                        <YAxis unit="%" domain={[0, 30]} />
                        <Tooltip formatter={(val: any) => [`${val}% order rate`, "Re-order Rate"]} />
                        <Bar dataKey="rate" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Recipients Messaged:</span>
                    <strong className="text-base text-slate-900 font-bold">
                      {camp.messagedCount}
                    </strong>
                    <span className="text-[10px] text-purple-700 block">
                      ({camp.heldBackCount} held back)
                    </span>
                  </div>

                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                    <span className="text-emerald-800 block text-[11px]">Extra Orders:</span>
                    <strong className="text-base text-emerald-700 font-bold">
                      +{extraOrders} orders
                    </strong>
                    <span className="text-[10px] text-emerald-600 block">
                      Proven by gap
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block text-[11px]">Messaging Cost:</span>
                    <strong className="text-base text-slate-900 font-bold">
                      {formatCurrency(messagingCost, currencySymbol)}
                    </strong>
                    <span className="text-[10px] text-slate-400 block">
                      Carrier unit billing
                    </span>
                  </div>

                  <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100">
                    <span className="text-teal-800 block text-[11px]">Revenue Created:</span>
                    <strong className="text-base text-[#0E7C9B] font-bold">
                      {formatCurrency(incrementalRevenue, currencySymbol)}
                    </strong>
                    <span className="text-[10px] text-teal-600 block">
                      Net ROI: {roi}x
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How We Measure & Closed-Loop Learning Diagram (Figure 1 from Service Guide) */}
      <div className="pt-2">
        <Figure1NightlyLoop />
      </div>
    </div>
  );
}
