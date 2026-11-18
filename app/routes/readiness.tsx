import React from "react";
import { useDemoStore } from "@/lib/store";
import { RequirementsTable } from "@/components/guide/RequirementsTable";
import {
  FileCheck2,
  Printer,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Database,
  Phone,
  Calendar,
  Sparkles,
  Download,
} from "lucide-react";

export default function ReadinessPage() {
  const { guests, orders } = useDemoStore();

  const totalOrders = orders.length;
  const linkedOrders = orders.filter((o) => o.guestId !== undefined).length;
  const linkedPercent = Math.round((linkedOrders / totalOrders) * 100);

  const totalGuests = guests.length;
  const guestsWithPhone = guests.filter((g) => g.primaryPhone).length;
  const phonePercent = Math.round((guestsWithPhone / totalGuests) * 100);

  const guestsWithConsent = guests.filter((g) => g.consent.sms === "opted_in").length;
  const consentPercent = Math.round((guestsWithConsent / totalGuests) * 100);

  const guestsWithEmail = guests.filter((g) => g.email).length;
  const emailPercent = Math.round((guestsWithEmail / totalGuests) * 100);

  const CHECKLIST_ITEMS = [
    {
      id: "history",
      name: "Historical Depth",
      metric: "12 Months Available",
      target: "Minimum 3 months required",
      status: "good" as const,
      limits: "None. Enables full seasonal rhythm calculation and churn prediction.",
      fix: "Maintain automated nightly ingest to preserve continuous history.",
    },
    {
      id: "linking",
      name: "Guest-to-Order Link Rate",
      metric: `${linkedPercent}% Linked (${linkedOrders.toLocaleString()} of ${totalOrders.toLocaleString()} orders)`,
      target: ">70% recommended",
      status: "good" as const,
      limits: "Remaining 25% are unlinked counter walk-ins without guest identifiers.",
      fix: "Prompt for phone number on receipt checkout or offer digital receipt via QR code at tables.",
    },
    {
      id: "phone",
      name: "Phone Number Capture",
      metric: `${phonePercent}% of Profiled Guests`,
      target: ">85% recommended",
      status: "good" as const,
      limits: "Guests without phone numbers cannot receive SMS or WhatsApp reminders.",
      fix: "Ensure phone field is required during online and telephone takeout ordering.",
    },
    {
      id: "consent",
      name: "Marketing Consent Capture",
      metric: `${consentPercent}% Opted-In (8% Opted-Out, 30% Unspecified)`,
      target: ">50% required for ROI",
      status: "good" as const,
      limits: "Guests with 'Unspecified' status cannot receive promotional campaigns.",
      fix: "Add an explicit marketing consent checkbox to wifi login and counter checkout flow.",
    },
    {
      id: "email",
      name: "Email Address Coverage",
      metric: `${emailPercent}% of Profiled Guests`,
      target: ">40% optional",
      status: "limited" as const,
      limits: "Email reminders are limited to online orderers; counter walk-ins usually lack email.",
      fix: "Invite diners to receive e-invoices or weekly chef newsletters via email at checkout.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Print Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2EEF5] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#0F2A3A]">
            POS Data Readiness Report
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#5A7384]">
            An audit of your restaurant's data hygiene before going live.
          </p>
        </div>

        <div className="no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C9B] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0B647D] transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Download & Print PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Container */}
      <div className="print-page bg-white rounded-3xl border border-[#E2EEF5] p-6 lg:p-8 shadow-xs space-y-6">
        {/* Scorecard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7C9B]">
                Spice Route Kitchen (All 3 Outlets)
              </span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                Audit Status: Pass
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Overall Readiness Score: 88 / 100 (Grade A)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited on 18 Nov 2026 • Suitable for autonomous predictive retention
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <div className="text-2xl font-black text-emerald-700">88%</div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase">
                Hygiene Index
              </span>
            </div>
          </div>
        </div>

        {/* Audit Dimensions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Orders Analyzed
            </span>
            <div className="text-xl font-black text-slate-900 mt-1">
              {totalOrders.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">12 month baseline</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Guest Link Rate
            </span>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {linkedPercent}%
            </div>
            <span className="text-[10px] text-slate-400">Linked to profile</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Phone Availability
            </span>
            <div className="text-xl font-black text-[#0E7C9B] mt-1">
              {phonePercent}%
            </div>
            <span className="text-[10px] text-slate-400">Valid numbers</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase text-slate-500">
              Marketing Opt-In
            </span>
            <div className="text-xl font-black text-[#0E7C9B] mt-1">
              {consentPercent}%
            </div>
            <span className="text-[10px] text-slate-400">Recorded consent</span>
          </div>
        </div>

        {/* Checklist Details Table */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-slate-900">
            Detailed Dimension Audit
          </h3>

          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item) => {
              const isGood = item.status === "good";
              const isLimited = item.status === "limited";

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      {isGood ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : isLimited ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      )}
                      <span className="font-bold text-slate-900 text-sm">
                        {item.name}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full self-start sm:self-auto ${
                        isGood
                          ? "bg-emerald-100 text-emerald-800"
                          : isLimited
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-slate-700 font-semibold">
                    Current Metric: <span className="text-[#0E7C9B]">{item.metric}</span> •{" "}
                    <span className="text-slate-500 font-normal">{item.target}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600 pt-1">
                    <div>
                      <strong className="text-slate-800">What it impacts:</strong>{" "}
                      {item.limits}
                    </div>
                    <div>
                      <strong className="text-slate-800">Remediation action:</strong>{" "}
                      {item.fix}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Data Requirements from Zirium Service Guide */}
        <div className="pt-2">
          <RequirementsTable />
        </div>

        {/* Audit Sign-Off Box */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Generated by <strong>Zirium AI Customer Intelligence Ingestion Engine</strong>.
          </div>
          <div className="text-[11px]">
            Data Source: Read-only POS replica database.
          </div>
        </div>
      </div>
    </div>
  );
}
