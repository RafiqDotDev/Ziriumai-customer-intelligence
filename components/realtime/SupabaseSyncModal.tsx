import React, { useState } from "react";
import { useDemoStore } from "@/lib/store";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
} from "@/lib/supabase";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  X,
  ExternalLink,
  Copy,
  Check,
  Lock,
} from "lucide-react";

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupabaseSyncModal({ isOpen, onClose }: SupabaseSyncModalProps) {
  const {
    syncDataToSupabase,
    supabaseStatus,
    checkSupabaseConnection,
    isReadOnlyEnforced,
    checkReadOnlyIntegrity,
  } = useDemoStore();

  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig?.url || "");
  const [anonKey, setAnonKey] = useState(currentConfig?.anonKey || "");
  const [testingConn, setTestingConn] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ step: "", pct: 0 });
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedLockdownSql, setCopiedLockdownSql] = useState(false);
  const [probingReadOnly, setProbingReadOnly] = useState(false);
  const [probeMessage, setProbeMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProbeReadOnly = async () => {
    setProbingReadOnly(true);
    setProbeMessage(null);
    const enforced = await checkReadOnlyIntegrity();
    setProbeMessage(
      enforced
        ? "✓ Verified: Database is 100% Read-Only! All write/update attempts are rejected by PostgreSQL RLS."
        : "⚠️ Database currently accepts writes. Run 'enforce_readonly.sql' in Supabase SQL Editor to make it immutable."
    );
    setProbingReadOnly(false);
  };

  const handleCopyLockdown = () => {
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
    setCopiedLockdownSql(true);
    setTimeout(() => setCopiedLockdownSql(false), 2500);
  };

  const handleTestConnection = async () => {
    setTestingConn(true);
    setTestResult(null);
    saveSupabaseConfig({ url, anonKey });
    const res = await testSupabaseConnection(url, anonKey);
    setTestResult(res);
    setTestingConn(false);
    checkSupabaseConnection();
  };

  const handleSyncData = async () => {
    if (!url || !anonKey) {
      alert("Please provide your Supabase URL and Anon Key first.");
      return;
    }
    saveSupabaseConfig({ url, anonKey });
    setIsSyncing(true);
    setSyncResult(null);

    const res = await syncDataToSupabase((step, pct) => {
      setSyncProgress({ step, pct });
    });

    setSyncResult(res);
    setIsSyncing(false);
  };

  const handleClear = () => {
    clearSupabaseConfig();
    setUrl("");
    setAnonKey("");
    setTestResult(null);
    setSyncResult(null);
    checkSupabaseConnection();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-[94%] sm:w-full max-w-xl rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-teal-200 text-left my-6 max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#0E7C9B]">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F2A3A]">
                Supabase Database Synchronization
              </h3>
              <p className="text-xs text-slate-500">
                Send all seed data & live orders to your Supabase PostgreSQL cloud database.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Indicator Pill */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-600 font-medium">Connection Status:</span>
          {supabaseStatus === "connected" ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" /> Connected & Realtime Active
            </span>
          ) : supabaseStatus === "connecting" ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Verifying Connection...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-bold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full">
              Unconfigured (Running In-Memory)
            </span>
          )}
        </div>

        {/* Schema Requirement Notice */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
          <div className="font-bold flex items-center justify-between">
            <span>Database Tables Required:</span>
            <a
              href="https://supabase.com/dashboard/project/_/sql"
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 underline flex items-center gap-1 font-semibold hover:text-blue-900"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <p className="text-[11px] text-blue-800 leading-relaxed">
            Ensure you have run the schema in <code>supabase/schema.sql</code> in your Supabase SQL Editor before syncing.
          </p>
        </div>

        {/* Credentials Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value.trim())}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-mono focus:border-[#0E7C9B] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Supabase Anon / Public API Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value.trim())}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-mono focus:border-[#0E7C9B] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 underline text-[11px]"
            >
              Clear credentials
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testingConn || !url || !anonKey}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              {testingConn && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Test Connection</span>
            </button>
          </div>

          {testResult && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Sync Progress Bar */}
        {isSyncing && (
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#0E7C9B]">
              <span>{syncProgress.step}</span>
              <span>{syncProgress.pct}%</span>
            </div>
            <div className="w-full bg-teal-200/60 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E7C9B] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress.pct}%` }}
              />
            </div>
          </div>
        )}

        {syncResult && (
          <div
            className={`p-3 rounded-xl text-xs ${
              syncResult.success
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            <strong>{syncResult.success ? "Sync Completed!" : "Sync Failed:"}</strong>{" "}
            {syncResult.message}
          </div>
        )}

        {/* 100% Read-Only Lockdown Section */}
        <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#0E7C9B]" />
              <h4 className="text-xs font-bold text-[#0F2A3A]">
                100% Read-Only Security Policy
              </h4>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                isReadOnlyEnforced
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {isReadOnlyEnforced ? "Strict Read-Only" : "Write Policy Active"}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Ensure no mutations can occur against your database. Run <code>enforce_readonly.sql</code> in your Supabase SQL Editor to permanently revoke all INSERT, UPDATE, and DELETE rights from API keys.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopyLockdown}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
            >
              {copiedLockdownSql ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied SQL!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy enforce_readonly.sql</span>
                </>
              )}
            </button>

            <button
              onClick={handleProbeReadOnly}
              disabled={probingReadOnly}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-300 bg-teal-100/70 px-2.5 py-1.5 text-xs font-bold text-teal-900 hover:bg-teal-200/80 transition-all disabled:opacity-50"
            >
              {probingReadOnly && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Verify Immutability Probe</span>
            </button>
          </div>

          {probeMessage && (
            <div className="p-2.5 rounded-xl bg-white border border-teal-200 text-[11px] text-slate-800 font-medium">
              {probeMessage}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>

          <button
            onClick={handleSyncData}
            disabled={isSyncing || !url || !anonKey}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C9B] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0B647D] disabled:opacity-50 transition-all"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Syncing Database...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-[#3EC6F2]" />
                <span>Sync All Seed Data to Supabase</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
