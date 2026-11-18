import React, { useState } from "react";
import { useDemoStore } from "@/lib/store";
import { formatCurrency, maskPhone } from "@/lib/utils";
import {
  Radio,
  Play,
  Square,
  Activity,
  Database,
  X,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
  Store,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LiveStreamWidget() {
  const {
    isLiveStreaming,
    toggleLiveStream,
    recentLiveOrders,
    supabaseStatus,
    currencySymbol,
  } = useDemoStore();

  const [feedDrawerOpen, setFeedDrawerOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Live / Paused State Pill */}
        <button
          onClick={toggleLiveStream}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all shadow-2xs",
            isLiveStreaming
              ? "bg-emerald-500 text-white hover:bg-emerald-600 ring-2 ring-emerald-300/40 animate-pulse"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
          )}
          title={isLiveStreaming ? "Stop incoming live POS order stream" : "Start incoming live POS order stream"}
        >
          {isLiveStreaming ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="hidden sm:inline">LIVE FEED</span>
              <span className="sm:hidden">LIVE</span>
              <Square className="h-3 w-3 fill-current ml-0.5" />
            </>
          ) : (
            <>
              <Play className="h-3 w-3 fill-current text-[#0E7C9B]" />
              <span className="hidden sm:inline text-slate-800">Start Stream</span>
              <span className="sm:hidden text-slate-800">Stream</span>
            </>
          )}
        </button>

        {/* Live Orders Counter / Drawer Trigger */}
        {recentLiveOrders.length > 0 && (
          <button
            onClick={() => setFeedDrawerOpen((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded-xl bg-[#EAF6FC] border border-[#3EC6F2]/40 px-2 sm:px-2.5 py-1.5 text-[11px] font-bold text-[#0E7C9B] hover:bg-[#3EC6F2]/15 transition-colors"
            title="View recent live orders"
          >
            <Activity className="h-3.5 w-3.5 text-[#3EC6F2]" />
            <span>{recentLiveOrders.length} New</span>
            {feedDrawerOpen ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {/* Floating Live Orders Drawer */}
      {feedDrawerOpen && recentLiveOrders.length > 0 && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-40 w-[92vw] sm:w-96 rounded-2xl bg-white shadow-2xl border border-teal-200 p-4 animate-in slide-in-from-bottom-5 duration-200 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <h4 className="text-xs font-bold text-slate-900">
                Live POS Ingestion Stream
              </h4>
              <span className="rounded bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-1.5 py-0.2">
                {supabaseStatus === "connected" ? "SUPABASE LIVE" : "IN-MEMORY LIVE"}
              </span>
            </div>
            <button
              onClick={() => setFeedDrawerOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2 space-y-2">
            {recentLiveOrders.map((ord) => (
              <div key={ord.id} className="pt-2 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">
                    {ord.items[0]?.name || "Special Dish"}
                  </span>
                  <span className="font-black text-emerald-700">
                    {formatCurrency(ord.total, currencySymbol)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="capitalize">
                    {ord.channel} • {ord.orderType}
                  </span>
                  <span>{new Date(ord.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              {isLiveStreaming ? "Incoming stream active..." : "Stream paused."}
            </span>
            <button
              onClick={toggleLiveStream}
              className="text-xs font-bold text-[#0E7C9B] hover:underline"
            >
              {isLiveStreaming ? "Pause Stream" : "Resume Stream"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
