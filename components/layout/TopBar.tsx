import React, { useState } from "react";
import { Link } from "react-router";
import { useDemoStore } from "@/lib/store";
import {
  AlertOctagon,
  Store,
  Clock,
  ShieldAlert,
  Play,
  CheckCircle2,
  Tv,
  Sparkles,
  ChevronDown,
  Database,
  Radio,
  X,
  Lock,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveStreamWidget } from "@/components/realtime/LiveStreamWidget";
import { SupabaseSyncModal } from "@/components/realtime/SupabaseSyncModal";

export function TopBar() {
  const {
    selectedOutletId,
    setSelectedOutletId,
    outlets,
    stopAllSending,
    toggleStopAllSending,
    presenterMode,
    togglePresenterMode,
    startTour,
    latestLiveAlert,
    clearLatestLiveAlert,
    supabaseStatus,
  } = useDemoStore();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex min-h-16 w-full items-center justify-between border-b border-[#E2EEF5] bg-white/95 px-3 sm:px-6 backdrop-blur-md shadow-2xs gap-2 py-2">
        {/* Left: Restaurant Brand & Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0E7C9B] text-white shadow-xs">
            <Store className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xs sm:text-base font-bold tracking-tight text-[#0F2A3A] truncate">
                Spice Route Kitchen
              </h1>
              <span className="inline-flex items-center rounded-full bg-amber-100/90 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-800 border border-amber-300">
                DEMO DATA
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#5A7384]">
              <Clock className="h-3 w-3 text-[#0E7C9B]" />
              <span>Simulated Time: 11:15 AM EST</span>
            </div>
          </div>

          {/* Outlet Selector Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedOutletId}
              onChange={(e) => setSelectedOutletId(e.target.value)}
              className="appearance-none rounded-xl border border-[#D1E7F2] bg-[#EAF6FC]/60 py-1.5 pl-2.5 pr-7 text-[11px] sm:text-xs font-semibold text-[#0F2A3A] transition-colors hover:border-[#0E7C9B] focus:border-[#0E7C9B] focus:outline-hidden max-w-[125px] sm:max-w-[180px] truncate"
            >
              <option value="all">All Outlets (3)</option>
              {outlets.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-[#5A7384]" />
          </div>
        </div>

        {/* Center/Right Controls: Live Stream, Supabase, Tour, Presenter & Stop Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Live POS Stream Controller (Start/Stop) */}
          <LiveStreamWidget />

          <Link
            to="/guide"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#3EC6F2]/40 bg-[#EAF6FC] px-2.5 py-1.5 text-xs font-semibold text-[#0E7C9B] hover:bg-[#3EC6F2]/15 transition-all shadow-2xs"
            title="Open official Service Guide"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#0E7C9B]" />
            <span className="hidden md:inline">Service Guide</span>
          </Link>

          <button
            onClick={togglePresenterMode}
            className={cn(
              "hidden md:inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all",
              presenterMode
                ? "border-[#0E7C9B] bg-[#0E7C9B] text-white"
                : "border-[#D1E7F2] bg-white text-[#5A7384] hover:bg-slate-50",
            )}
            title="Toggle Presenter Mode (Shortcut: P)"
          >
            <Tv className="h-3.5 w-3.5" />
            <span>{presenterMode ? "Presenter ON" : "Presenter"}</span>
          </button>
        </div>
      </header>

      {/* Live Order Incoming Ticker Alert (Pops in dynamically) */}
      {latestLiveAlert && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-3 sm:px-4 py-2 shadow-md flex items-center justify-between text-xs font-semibold animate-in slide-in-from-top-2 duration-200 sticky top-16 z-28">
          <div className="flex items-center gap-2 truncate">
            <Radio className="h-4 w-4 animate-pulse shrink-0" />
            <span className="truncate">{latestLiveAlert}</span>
          </div>
          <button
            onClick={clearLatestLiveAlert}
            className="p-1 text-emerald-200 hover:text-white shrink-0 ml-2"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Emergency Active Banner */}
      {stopAllSending && (
        <div className="bg-red-600 text-white px-3 sm:px-4 py-2.5 shadow-md flex items-center justify-between text-xs sm:text-sm font-semibold sticky top-16 z-25 gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 animate-bounce" />
            <span className="leading-tight">
              KILL SWITCH ACTIVE: Outbound message campaigns halted across all 3
              outlets.
            </span>
          </div>
          <button
            onClick={toggleStopAllSending}
            className="shrink-0 bg-white text-red-700 px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-red-50 flex items-center gap-1"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Resume</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-red-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Activate "Stop All Sending" Kill Switch?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              This will immediately halt all pending approvals, freeze automated
              messages, and enforce a system-wide freeze across all 3 outlets.
              No guest will receive any SMS, WhatsApp, or Email.
            </p>
            <div className="mt-6 flex items-center justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleStopAllSending();
                  setConfirmModalOpen(false);
                }}
                className="rounded-xl bg-red-600 px-3.5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-red-700"
              >
                Yes, Stop All Sending
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supabase Sync Modal */}
      <SupabaseSyncModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </>
  );
}
