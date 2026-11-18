import React, { useState } from "react";
import { SupabaseSyncModal } from "@/components/realtime/SupabaseSyncModal";
import { useDemoStore } from "@/lib/store";
import { Figure2ConnectionFlow } from "@/components/guide/Figure2ConnectionFlow";
import {
  PlugZap,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Database,
  Cloud,
  FileSpreadsheet,
  Cpu,
  KeyRound,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function ConnectPage() {
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const { supabaseStatus, isReadOnlyEnforced, checkReadOnlyIntegrity } = useDemoStore();
  const [testingProbe, setTestingProbe] = useState(false);
  const [probeResult, setProbeResult] = useState<{ isReadOnlyEnforced: boolean; statusText: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleTestProbe = async () => {
    setTestingProbe(true);
    setProbeResult(null);
    const enforced = await checkReadOnlyIntegrity();
    setProbeResult({
      isReadOnlyEnforced: enforced,
      statusText: enforced
        ? "✓ Verified! PostgreSQL RLS policy blocked unauthorized client writes. The database is strictly 100% read-only."
        : "⚠️ Supabase currently permits writes. Please run the SQL lockdown script in your Supabase SQL Editor to enforce strict read-only mode.",
    });
    setTestingProbe(false);
  };

  const handleCopySql = () => {
    const sql = `-- Zirium AI: Enforce 100% Completely Read-Only POS Database
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.outlets, public.menu_items, public.guests, public.orders, public.campaigns FROM anon, authenticated;
GRANT SELECT ON public.outlets, public.menu_items, public.guests, public.orders, public.campaigns TO anon, authenticated;
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Strict Read-Only Outlets" ON public.outlets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Strict Read-Only Menu Items" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Strict Read-Only Guests" ON public.guests FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Strict Read-Only Orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Strict Read-Only Campaigns" ON public.campaigns FOR SELECT TO anon, authenticated USING (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const OPTIONS = [
    {
      title: "1. Standard Cloud POS with Open API",
      subtitle: "e.g. Toast, Square, Clover, Lightspeed, Revel",
      icon: Cloud,
      badge: "Fastest (10 mins)",
      howItWorks:
        "We connect directly using your POS provider's official developer API using read-only scopes. Every night at 03:00 AM, a secure cron job fetches the day's closed receipts.",
      whatOwnerDoes:
        "Generate a read-only API token in your POS management portal (or grant OAuth access with 1 click).",
      readOnlyGuarantee:
        "Scope requested: 'orders.read', 'customers.read'. Zero write or payment permissions requested.",
      steps: [
        "Login to your POS Admin Dashboard",
        "Navigate to Integrations / API Credentials",
        "Issue a Read-Only Token and paste it into Zirium",
        "Nightly sync starts automatically",
      ],
    },
    {
      title: "2. Restricted / Partner-Gated API",
      subtitle: "e.g. Micros Simphony, Aloha Cloud, proprietary chains",
      icon: KeyRound,
      badge: "Partner Request",
      howItWorks:
        "Some POS vendors gate API keys behind an approval form. We provide you with a pre-written authorization letter for your account rep.",
      whatOwnerDoes:
        "Forward our short authorization template to your POS account representative requesting read-only data extraction.",
      readOnlyGuarantee:
        "Strictly extracts closed historical checks. Does not touch live kitchen tickets, register drawers, or staff shifts.",
      steps: [
        "Receive pre-filled POS integration request template",
        "Forward to your vendor account executive",
        "Vendor provisions read-only reporting credentials",
        "Connection verified via sandbox handshake",
      ],
    },
    {
      title: "3. Direct Database Read Replica",
      subtitle: "PostgreSQL, MySQL, SQL Server, Supabase",
      icon: Database,
      badge: "High Performance",
      howItWorks:
        "If you host your own database, you create a restricted database user with `SELECT` privileges only on a dedicated read-replica instance.",
      whatOwnerDoes:
        "Run a 2-line SQL script that grants `SELECT ON orders, order_items` to a dedicated `zirium_readonly` user.",
      readOnlyGuarantee:
        "PostgreSQL role enforces `REVOKE INSERT, UPDATE, DELETE, TRUNCATE FROM zirium_readonly;`. Cannot mutate a single byte of data.",
      steps: [
        "Create dedicated read-only database user",
        "Whitelist Zirium's static egress IP addresses",
        "Enter replica connection string with SSL enforce",
        "Nightly queries run off replica without impacting POS transactions",
      ],
    },
    {
      title: "4. Custom-Built POS / Webhook",
      subtitle: "In-house proprietary software, custom web systems",
      icon: Cpu,
      badge: "Custom Engineering",
      howItWorks:
        "Your developer configures an automated webhook or nightly script that pushes closed order JSON to a secure Zirium ingestion endpoint.",
      whatOwnerDoes:
        "Provide our OpenAPI spec to your software developer or agency partner.",
      readOnlyGuarantee:
        "Your system pushes data outward. Zirium holds no credentials to your internal servers.",
      steps: [
        "Download Zirium's JSON receipt schema",
        "Add an end-of-day webhook trigger to your POS closure script",
        "Payloads are signed with HMAC SHA-256 for integrity",
        "Ingested into client guest profiles instantaneously",
      ],
    },
    {
      title: "5. No Technical Access / Daily CSV",
      subtitle: "Legacy desktop POS without API, local cash registers",
      icon: FileSpreadsheet,
      badge: "Zero Integration Required",
      howItWorks:
        "Most legacy POS terminals can schedule a daily CSV or Excel report export to a shared Dropbox, Google Drive folder, or SFTP inbox.",
      whatOwnerDoes:
        "Configure your POS end-of-day report to automatically export the daily sales breakdown to a secure folder.",
      readOnlyGuarantee:
        "Files are parsed in a secure sandbox. Zero software installed on your physical cash registers.",
      steps: [
        "Select your automated daily report in your POS terminal",
        "Designate a local watch folder or cloud sync drop",
        "Zirium parses the files every night at 03:00 AM",
        "Identities automatically merged across dates",
      ],
    },
  ];

  const current = OPTIONS[selectedOption];
  const CurrentIcon = current.icon;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2EEF5] shadow-2xs">
        <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#0F2A3A]">
          Connect Your Restaurant Data
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5A7384]">
          How we connect to your POS without touching orders, payments, or prices. Choose your setup below.
        </p>
      </div>

      {/* Prominent Read-Only Guarantee Box */}
      <div className="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-50 to-[#EAF6FC] p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E7C9B] text-white shrink-0 shadow-sm">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#0F2A3A]">
                The Zirium Read-Only Security Guarantee
              </h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                100% Read-Only
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              We can <strong>read and copy</strong> closed order receipts. We <strong>cannot</strong> change orders, delete records, add items, modify prices, alter table layouts, or touch customer payment card data. You can revoke access at any second with one click.
            </p>
          </div>
        </div>

        {/* Live Database Read-Only Lockdown Controls */}
        <div className="pt-4 border-t border-teal-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/80 p-4 rounded-2xl border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F2A3A]">
                Database Access Policy Status:
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  isReadOnlyEnforced
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>{isReadOnlyEnforced ? "100% Read-Only Enforced" : "Write Policy Active"}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              PostgreSQL Row Level Security (RLS) revokes all client INSERT, UPDATE, and DELETE operations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopySql}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-all"
              title="Copy SQL Lockdown Script to execute in Supabase SQL editor"
            >
              {copiedSql ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied SQL!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Lockdown SQL</span>
                </>
              )}
            </button>

            <button
              onClick={handleTestProbe}
              disabled={testingProbe}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0E7C9B] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0B647D] shadow-2xs transition-all disabled:opacity-50"
            >
              {testingProbe && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Verify Immutability Probe</span>
            </button>
          </div>
        </div>

        {probeResult && (
          <div
            className={`p-3 rounded-2xl text-xs font-medium border flex items-center gap-2 ${
              probeResult.isReadOnlyEnforced
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {probeResult.isReadOnlyEnforced ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
            )}
            <span>{probeResult.statusText}</span>
          </div>
        )}
      </div>

      {/* Figure 2: The ways we can connect to your POS */}
      <Figure2ConnectionFlow />

      {/* Integration Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {OPTIONS.map((opt, idx) => {
          const Icon = opt.icon;
          const isSelected = selectedOption === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-white border-[#0E7C9B] shadow-md ring-2 ring-[#0E7C9B]/20"
                  : "bg-white/80 border-[#E2EEF5] hover:bg-white hover:border-[#3EC6F2]/50 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                    isSelected
                      ? "bg-[#0E7C9B] text-white"
                      : "bg-[#EAF6FC] text-[#0E7C9B]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  {opt.badge}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 line-clamp-2">
                {opt.title}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {opt.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Option Detail Sheet */}
      <div className="rounded-3xl border border-[#E2EEF5] bg-white p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0F2A3A]">
                {current.title}
              </h3>
              <span className="text-xs text-slate-500">({current.subtitle})</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Read-only connection configuration flow
            </p>
          </div>

          <span className="rounded-xl bg-[#EAF6FC] text-[#0E7C9B] px-3 py-1.5 text-xs font-bold border border-[#D1E7F2] self-start sm:self-auto">
            {current.badge}
          </span>
        </div>

        {/* 2-Column: Details and Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7C9B]">
                How Access Works
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {current.howItWorks}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                What the Restaurant Owner Does
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {current.whatOwnerDoes}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span>Scope & Isolation Verification</span>
              </div>
              <p className="text-xs text-emerald-800">
                {current.readOnlyGuarantee}
              </p>
            </div>
          </div>

          {/* Steps Flow */}
          <div className="rounded-2xl border border-slate-200 p-5 space-y-4 bg-slate-50/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Setup Steps
            </h4>

            <div className="space-y-3">
              {current.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E7C9B] text-white text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="text-xs sm:text-sm text-slate-800 font-medium">
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
              <span>Need assistance? Our deployment engineer coordinates directly with your POS vendor.</span>
              <button
                onClick={() => setSupabaseModalOpen(true)}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#0E7C9B] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0B647D] transition-all"
              >
                <Database className="h-3.5 w-3.5" />
                <span>Configure Supabase Sync</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Sync Modal */}
      <SupabaseSyncModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
}
