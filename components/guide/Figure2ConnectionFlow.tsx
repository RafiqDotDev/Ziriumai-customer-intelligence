import React from "react";
import { Search, Cloud, Database, Cpu, FileSpreadsheet, ArrowRight, Layers, Lock } from "lucide-react";

export function Figure2ConnectionFlow() {
  const PATHS = [
    {
      title: "Standard POS",
      subtitle: "Official API, read-only access",
      example: "Square, Clover, Lightspeed",
      icon: Cloud,
      color: "text-sky-600 bg-sky-50 border-sky-200",
    },
    {
      title: "Restaurant database",
      subtitle: "Read-only database user",
      example: "PostgreSQL, MySQL, Supabase",
      icon: Database,
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    {
      title: "Custom-built POS",
      subtitle: "Custom connector built for it",
      example: "In-house systems, proprietary APIs",
      icon: Cpu,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      title: "No access possible",
      subtitle: "Scheduled CSV or Excel export",
      example: "Legacy cash registers, offline terminals",
      icon: FileSpreadsheet,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  return (
    <div className="rounded-3xl border border-[#D1E7F2] bg-gradient-to-b from-[#F3FAFD] to-white p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-[#E2EEF5]">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0E7C9B]">
            Data Architecture
          </span>
          <h4 className="text-sm sm:text-base font-bold text-[#0F2A3A]">
            Figure 2 · The ways we can connect to your POS
          </h4>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-300">
          <Lock className="h-3 w-3" />
          <span>Read-Only Boundary Guaranteed</span>
        </div>
      </div>

      {/* Responsive Workflow Layout */}
      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 justify-between">
        {/* Step 1: Study POS */}
        <div className="w-full lg:w-48 shrink-0 rounded-2xl bg-white border-2 border-[#0E7C9B] p-4 text-center shadow-xs flex flex-col items-center justify-center space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6FC] text-[#0E7C9B]">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0E7C9B]">
              Step 1
            </span>
            <h5 className="text-xs sm:text-sm font-bold text-[#0F2A3A]">
              Study your POS
            </h5>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Review receipt schema & connection options
            </p>
          </div>
        </div>

        {/* Arrow to Paths */}
        <div className="hidden lg:flex items-center text-[#0E7C9B]">
          <ArrowRight className="h-5 w-5" />
        </div>

        {/* 4 Connection Options Stacked */}
        <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PATHS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#D1E7F2] shadow-2xs hover:border-[#0E7C9B] transition-colors"
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${p.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h6 className="text-xs font-bold text-[#0F2A3A] truncate">{p.title}</h6>
                  <p className="text-[11px] font-medium text-slate-600 truncate">{p.subtitle}</p>
                  <span className="text-[9px] text-slate-400 block truncate">e.g. {p.example}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrow to Unified Standard Model */}
        <div className="hidden lg:flex items-center text-[#0E7C9B]">
          <ArrowRight className="h-5 w-5" />
        </div>

        {/* Final Target: Standard Data Model */}
        <div className="w-full lg:w-48 shrink-0 rounded-2xl bg-[#0F2A3A] text-white p-4 text-center shadow-md flex flex-col items-center justify-center space-y-2 border border-slate-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-[#3EC6F2]">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#3EC6F2]">
              Output
            </span>
            <h5 className="text-xs sm:text-sm font-bold text-white">
              Our standard data model
            </h5>
            <p className="text-[10px] text-slate-300 mt-0.5">
              Normalised profiles, visits & predictions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
