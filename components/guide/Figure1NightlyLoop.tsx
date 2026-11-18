import React from "react";
import { ArrowRight, RotateCcw, Database, Users, Sparkles, CheckCircle2, Send, BarChart3 } from "lucide-react";

export function Figure1NightlyLoop() {
  return (
    <div className="rounded-3xl border border-[#D1E7F2] bg-gradient-to-b from-[#F3FAFD] to-white p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2EEF5]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0E7C9B]">
            Process Flow Diagram
          </span>
          <h4 className="text-sm sm:text-base font-bold text-[#0F2A3A]">
            Figure 1 · How the nightly loop works
          </h4>
        </div>
        <span className="rounded-full bg-[#EAF6FC] px-2.5 py-1 text-[11px] font-bold text-[#0E7C9B] border border-[#3EC6F2]/30">
          Automated Feedback Loop
        </span>
      </div>

      {/* Top Forward Flow Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
        {/* Step 1 */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#D1E7F2] shadow-2xs relative flex flex-col justify-between group hover:border-[#0E7C9B] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E7C9B] text-white text-[11px] font-black">
              1
            </span>
            <Database className="h-4 w-4 text-[#0E7C9B]" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#0F2A3A]">Your POS and online orders</h5>
            <p className="text-[10px] text-slate-500 mt-1">Read-only closed receipts copied nightly at 03:00 AM</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#D1E7F2] shadow-2xs relative flex flex-col justify-between group hover:border-[#0E7C9B] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E7C9B] text-white text-[11px] font-black">
              2
            </span>
            <Database className="h-4 w-4 text-[#3EC6F2]" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#0F2A3A]">Our secure data store</h5>
            <p className="text-[10px] text-slate-500 mt-1">Single profile per guest merged across counter & web</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-3.5 rounded-2xl bg-[#EAF6FC] border-2 border-[#0E7C9B] shadow-2xs relative flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E7C9B] text-white text-[11px] font-black">
              3
            </span>
            <Users className="h-4 w-4 text-[#0E7C9B]" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#0F2A3A]">Guest profiles and predictions</h5>
            <p className="text-[10px] text-slate-600 mt-1">Learns usual rhythm, favorite dish, and overdue days</p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#D1E7F2] shadow-2xs relative flex flex-col justify-between group hover:border-[#0E7C9B] transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E7C9B] text-white text-[11px] font-black">
              4
            </span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#0F2A3A]">Suggested actions</h5>
            <p className="text-[10px] text-slate-500 mt-1">Plain-English reason: "Usually orders every 14d, has been 31d"</p>
          </div>
        </div>
      </div>

      {/* Downward Transition */}
      <div className="flex items-center justify-end pr-8 sm:pr-16 text-[#0E7C9B]">
        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <span>Owner review required</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Bottom Approval & Feedback Loop Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        {/* Step 5: Review */}
        <div className="p-3.5 rounded-2xl bg-[#0F2A3A] text-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0F2A3A] text-[11px] font-black">
              5
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-white">You review and approve</h5>
            <p className="text-[10px] text-slate-300 mt-1">Owner approves wording, recipient preview, and channel. Zero auto-sends.</p>
          </div>
        </div>

        {/* Step 6: Dispatch */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#D1E7F2] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0E7C9B] text-white text-[11px] font-black">
              6
            </span>
            <Send className="h-4 w-4 text-[#0E7C9B]" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#0F2A3A]">Message sent to opted-in guests</h5>
            <p className="text-[10px] text-slate-500 mt-1">SMS, WhatsApp or Email. 10% randomly held back as control group.</p>
          </div>
        </div>

        {/* Step 7: Results & Feedback */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-300 shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-black">
              7
            </span>
            <BarChart3 className="h-4 w-4 text-emerald-700" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-emerald-950">Results vs held-back group</h5>
            <p className="text-[10px] text-emerald-800 mt-1">
              Honest measurement: Messaged order rate minus unmessaged rate = real uplift created.
            </p>
          </div>
        </div>
      </div>

      {/* Closed Feedback Loop Banner */}
      <div className="flex items-center gap-2 rounded-2xl bg-[#EAF6FC] p-3 text-xs font-semibold text-[#0E7C9B] border border-[#3EC6F2]/40">
        <RotateCcw className="h-4 w-4 shrink-0 text-[#0E7C9B] animate-spin" style={{ animationDuration: "12s" }} />
        <span>
          <strong>Learns from results:</strong> The feedback loop is what makes the service improve over time—every campaign outcome feeds back into the prediction engine to calibrate future rhythm triggers.
        </span>
      </div>
    </div>
  );
}
