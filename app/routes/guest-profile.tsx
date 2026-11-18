import React, { useState } from "react";
import { useParams, Link } from "react-router";
import { useDemoStore } from "@/lib/store";
import { SegmentBadge } from "@/components/ui/SegmentBadge";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { maskPhone, formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Utensils,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Send,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  DollarSign,
  TrendingUp,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function GuestProfilePage() {
  const { id } = useParams<{ id: string }>();
  const {
    guests,
    orders,
    simulateStopReply,
    currencySymbol,
    pendingCampaigns,
  } = useDemoStore();

  const [mergePopoverOpen, setMergePopoverOpen] = useState(false);
  const [draftModalOpen, setDraftModalOpen] = useState(false);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  const guest = guests.find((g) => g.id === id) || guests[0];
  const guestOrders = orders.filter((o) => o.guestId === guest?.id);

  if (!guest) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Guest not found</h2>
        <Link to="/groups" className="text-xs font-bold text-[#0E7C9B] underline mt-2 block">
          Back to Groups
        </Link>
      </div>
    );
  }

  // Ratio of days overdue
  const rhythmRatio = Math.round((guest.daysSinceLastOrder / guest.usualGapDays) * 10) / 10;
  const isOverdue = guest.daysSinceLastOrder > guest.usualGapDays * 1.5;

  // Next visit formatted
  const nextVisitFormatted = new Date(guest.predictedNextVisitDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Top 5 dishes data for chart
  const dishData = guest.favouriteDishesTop5.map((d) => ({
    name: d.name.length > 20 ? d.name.slice(0, 18) + "…" : d.name,
    fullName: d.name,
    percentage: d.percentage,
    count: d.count,
  }));

  // AI draft templates for this guest
  const firstName = guest.name.split(" ")[0];
  const draftTemplates = [
    {
      title: "Friendly Rhythm Win-back",
      channel: "sms" as const,
      body: `Hi ${firstName}! It's been ${guest.daysSinceLastOrder} days since your last feast with us at Spice Route Kitchen. We miss you! Enjoy a complimentary dessert when you order your favourite ${guest.favouriteDish} this week. Reply STOP to opt out.`,
    },
    {
      title: "VIP Weekend Table Offer",
      channel: "whatsapp" as const,
      body: `Hey ${firstName} 👋 Craving your favourite ${guest.favouriteDish}? We have reserved an exclusive \$8 voucher for your table at Spice Route Kitchen this weekend. Tap to view your pass: spice.route/vip/${guest.id}`,
    },
    {
      title: "Chef's Personal Note",
      channel: "email" as const,
      body: `Dear ${firstName},\n\nChef Tariq noticed you haven't dropped by recently. Our fragrant ${guest.favouriteDish} is simmering to perfection. Join us this week and our team will treat your table to freshly baked Rogani Naan on the house.\n\nWarm regards,\nSpice Route Kitchen`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back button & Subtitle */}
      <div>
        <Link
          to="/groups"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7C9B] hover:text-[#0B647D] mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Guest Directory</span>
        </Link>
        <div className="bg-white p-5 rounded-2xl border border-[#E2EEF5] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#0F2A3A]">
                {guest.name}
              </h1>
              <SegmentBadge segment={guest.segment} />
              <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                ID: {guest.id}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-[#5A7384]">
              Single view of a guest across counter, online, and phone orders.
            </p>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setDraftModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E7C9B] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0B647D] transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#3EC6F2]" />
              <span>Suggest Message</span>
            </button>

            {/* Simulate STOP reply opt-out */}
            {guest.consent.sms !== "opted_out" ? (
              <button
                onClick={() => simulateStopReply(guest.id)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
                title="Test safety rule: instantly revoke marketing consent"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Simulate STOP Reply</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-3 py-2 text-xs font-bold text-red-800 border border-red-200">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Consent Revoked (Opted Out)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profile Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Contact & Merged Identities */}
        <div className="rounded-2xl border border-[#E2EEF5] bg-white p-4 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A7384]">
            Unified Contact
          </span>
          <div className="text-sm font-bold text-[#0F2A3A]">
            {maskPhone(guest.primaryPhone)}
          </div>
          <div className="text-xs text-slate-500 truncate">{guest.email}</div>

          {/* Merged Identity badge */}
          {guest.mergedFrom.length > 0 ? (
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setMergePopoverOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2 py-1 text-xs font-bold text-[#0E7C9B] border border-teal-200 hover:bg-teal-100 transition-colors"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Merged from {guest.mergedFrom.length} channels</span>
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400">Single channel profile</div>
          )}
        </div>

        {/* Card 2: Rhythm & Gap */}
        <div className="rounded-2xl border border-[#E2EEF5] bg-white p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A7384]">
            Usual Rhythm vs Current Gap
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F2A3A]">
              {guest.daysSinceLastOrder}d
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / usual {guest.usualGapDays}d cycle
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
            <div
              className={`h-2 rounded-full ${
                isOverdue ? "bg-amber-500" : "bg-[#0E7C9B]"
              }`}
              style={{ width: `${Math.min(100, (guest.daysSinceLastOrder / (guest.usualGapDays * 2)) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 pt-1">
            Status:{" "}
            <strong className={isOverdue ? "text-amber-700" : "text-emerald-700"}>
              {isOverdue ? `${rhythmRatio}x Overdue` : "On schedule"}
            </strong>
          </p>
        </div>

        {/* Card 3: Spend & Lifetime Visits */}
        <div className="rounded-2xl border border-[#E2EEF5] bg-white p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A7384]">
            Total Spend & Visits
          </span>
          <div className="text-2xl font-bold text-[#0F2A3A]">
            {formatCurrency(guest.totalSpend, currencySymbol)}
          </div>
          <div className="text-xs text-slate-500">
            {guest.totalOrders} recorded orders • avg{" "}
            {formatCurrency(guest.averageOrderValue, currencySymbol)}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Discovered: {guest.discoveredType}
          </div>
        </div>

        {/* Card 4: Channel Consent Matrix */}
        <div className="rounded-2xl border border-[#E2EEF5] bg-white p-4 shadow-2xs space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A7384]">
            Marketing Consent Status
          </span>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">SMS Channel:</span>
              <span
                className={`font-bold ${
                  guest.consent.sms === "opted_in"
                    ? "text-emerald-700"
                    : guest.consent.sms === "opted_out"
                    ? "text-red-600"
                    : "text-slate-400"
                }`}
              >
                {guest.consent.sms.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">WhatsApp:</span>
              <span
                className={`font-bold ${
                  guest.consent.whatsapp === "opted_in"
                    ? "text-emerald-700"
                    : guest.consent.whatsapp === "opted_out"
                    ? "text-red-600"
                    : "text-slate-400"
                }`}
              >
                {guest.consent.whatsapp.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Email:</span>
              <span
                className={`font-bold ${
                  guest.consent.email === "opted_in"
                    ? "text-emerald-700"
                    : guest.consent.email === "opted_out"
                    ? "text-red-600"
                    : "text-slate-400"
                }`}
              >
                {guest.consent.email.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400">
            Source: {guest.consent.source || "checkout form"}
          </div>
        </div>
      </div>

      {/* "Why was this guest flagged?" Box */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950">
              Why Was This Guest Flagged?
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-amber-900 leading-relaxed">
              {guest.flaggedReason}
            </p>
            <div className="mt-2 text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Predicted next visit date: {nextVisitFormatted}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Favourite Dishes Bar Chart + Visit Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favourite Dishes Chart */}
        <div className="rounded-2xl border border-[#E2EEF5] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F2A3A]">
                Top Favourite Dishes
              </h3>
              <p className="text-xs text-[#5A7384]">
                Weighted by frequency and order recency
              </p>
            </div>
            <span className="text-xs font-bold text-[#0E7C9B] bg-[#EAF6FC] px-2.5 py-1 rounded-lg">
              #1: {guest.favouriteDish}
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dishData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" unit="%" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value}% of orders (${item.payload.count} times)`,
                    item.payload.fullName,
                  ]}
                />
                <Bar dataKey="percentage" fill="#0E7C9B" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visit Rhythms & Key Insights */}
        <div className="rounded-2xl border border-[#E2EEF5] bg-white p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#0F2A3A]">
            Diner Rhythm Intelligence
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-600 font-medium">First recorded visit:</span>
              <span className="font-bold text-slate-900">
                {new Date(guest.firstVisitDate).toLocaleDateString()}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-600 font-medium">Most recent visit:</span>
              <span className="font-bold text-slate-900">
                {new Date(guest.lastVisitDate).toLocaleDateString()} ({guest.daysSinceLastOrder} days ago)
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-600 font-medium">Discovered diner profile:</span>
              <span className="font-bold text-[#0E7C9B]">
                {guest.discoveredType}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
              <span className="text-slate-600 font-medium">Rhythm confidence score:</span>
              <span className="font-bold text-emerald-700">
                High ({guest.totalOrders} visits recorded)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order History Table */}
      <div className="rounded-2xl border border-[#E2EEF5] bg-white shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F2A3A]">
              Complete Order History ({guestOrders.length} Orders)
            </h3>
            <p className="text-xs text-[#5A7384]">
              Ingested read-only from POS counter receipts, online app, and phone logs.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Channel & Type</th>
                <th className="py-3 px-4">Outlet</th>
                <th className="py-3 px-4">Items Ordered</th>
                <th className="py-3 px-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guestOrders.map((order) => {
                const dateFormatted = new Date(order.timestamp).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                });

                return (
                  <tr key={order.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      <div>{order.id}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{dateFormatted}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize font-semibold text-slate-700">
                        {order.channel}
                      </span>{" "}
                      <span className="text-[10px] text-slate-400">({order.orderType})</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 capitalize">
                      {order.outletId.replace("-", " ")}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="space-y-0.5">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <span className="font-bold text-slate-900">{i.quantity}x</span>
                            <span>{i.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(order.total, currencySymbol)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Merged Identity Popover / Modal */}
      {mergePopoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-xs">
          <div className="w-[94%] sm:w-full max-w-lg rounded-3xl bg-white p-4 sm:p-6 shadow-2xl border border-teal-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-50 text-[#0E7C9B]">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Identity Resolution Showcase
                  </h3>
                  <p className="text-xs text-slate-500">
                    Merged across {guest.mergedFrom.length} channel touchpoints
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMergePopoverOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              In real restaurant environments, guests order under different phone number formats, at physical counters, or on delivery apps. Zirium AI's identity engine links them into one single profile:
            </p>

            <div className="mt-4 space-y-2.5">
              {guest.mergedFrom.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[#0E7C9B] block">
                      Channel: {m.channel}
                    </span>
                    <span className="font-mono text-slate-800">
                      Identifier: {m.originalIdentifier}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <div>{m.capturedAt}</div>
                    <div className="capitalize">{m.outletId}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setMergePopoverOpen(false)}
                className="rounded-xl bg-[#0E7C9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B647D]"
              >
                Close Showcase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggest Message Modal */}
      {draftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
          <div className="w-[94%] sm:w-full max-w-2xl rounded-3xl bg-white p-4 sm:p-6 shadow-2xl border border-slate-200 text-left my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#3EC6F2]" />
                <h3 className="text-base font-bold text-[#0F2A3A]">
                  AI Message Suggestions for {guest.name}
                </h3>
              </div>
              <button
                onClick={() => setDraftModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Privacy notice */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
              <span>
                <strong>Privacy Guaranteed:</strong> The AI generator sees only the first name (
                <code>{firstName}</code>) and favourite dish (<code>{guest.favouriteDish}</code>). It never sees phone numbers, order histories, or customer records.
              </span>
            </div>

            {/* Template selector buttons */}
            <div className="mt-4 flex gap-2">
              {draftTemplates.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTemplateIndex(idx)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    selectedTemplateIndex === idx
                      ? "bg-[#0E7C9B] text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>

            {/* Phone Mockup preview */}
            <div className="mt-6 flex justify-center">
              <PhoneMockup
                channel={draftTemplates[selectedTemplateIndex].channel}
                recipientName={guest.name}
                body={draftTemplates[selectedTemplateIndex].body}
              />
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Ready for inclusion in owner-approved campaigns.
              </span>
              <button
                onClick={() => setDraftModalOpen(false)}
                className="rounded-xl bg-[#0E7C9B] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B647D]"
              >
                Done Previewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
