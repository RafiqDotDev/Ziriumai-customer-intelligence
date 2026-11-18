import React, { useState } from "react";
import { calculateEstimatedCosts, PRESETS, UNIT_RATES } from "@/lib/costs";
import { formatCurrency } from "@/lib/utils";
import {
  Calculator,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function CostsPage() {
  const [outletsCount, setOutletsCount] = useState<number>(3);
  const [smsCount, setSmsCount] = useState<number>(4000);
  const [whatsAppCount, setWhatsAppCount] = useState<number>(1000);
  const [emailCount, setEmailCount] = useState<number>(10000);
  const [includeBuffer, setIncludeBuffer] = useState<boolean>(false);

  const breakdown = calculateEstimatedCosts({
    outletsCount,
    smsCount,
    whatsAppCount,
    emailCount,
    includeBuffer,
  });

  const applyPreset = (presetIndex: number) => {
    const p = PRESETS[presetIndex];
    if (p) {
      setOutletsCount(p.inputs.outletsCount);
      setSmsCount(p.inputs.smsCount);
      setWhatsAppCount(p.inputs.whatsAppCount);
      setEmailCount(p.inputs.emailCount);
      setIncludeBuffer(p.inputs.includeBuffer);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2EEF5] shadow-2xs">
        <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#0F2A3A]">
          Direct Infrastructure Cost Estimator
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5A7384]">
          Transparent estimates based on direct carrier rates. You own the accounts.
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 mr-1">Quick Presets:</span>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(idx)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-[#EAF6FC] hover:text-[#0E7C9B] hover:border-[#3EC6F2] transition-colors shadow-2xs"
          >
            {preset.name} ({preset.description})
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Controls (Left) and Live Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sliders (7/12) */}
        <div className="lg:col-span-7 rounded-3xl border border-[#E2EEF5] bg-white p-4 sm:p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#0F2A3A] pb-3 border-b border-slate-100">
            Monthly Volume Parameters
          </h2>

          {/* Slider 1: Outlets */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Number of Restaurant Outlets</span>
              <span className="font-bold text-[#0E7C9B]">{outletsCount} Locations</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={outletsCount}
              onChange={(e) => setOutletsCount(Number(e.target.value))}
              className="w-full accent-[#0E7C9B] h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 Outlet</span>
              <span>10 Outlets</span>
            </div>
          </div>

          {/* Slider 2: SMS per month */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Monthly SMS Volume</span>
              <span className="font-bold text-[#0E7C9B]">{smsCount.toLocaleString()} SMS</span>
            </div>
            <input
              type="range"
              min={0}
              max={20000}
              step={500}
              value={smsCount}
              onChange={(e) => setSmsCount(Number(e.target.value))}
              className="w-full accent-[#0E7C9B] h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 SMS</span>
              <span>Rate: ${UNIT_RATES.smsRate}/msg</span>
              <span>20,000 SMS</span>
            </div>
          </div>

          {/* Slider 3: WhatsApp per month */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Monthly WhatsApp Marketing Volume</span>
              <span className="font-bold text-[#0E7C9B]">
                {whatsAppCount.toLocaleString()} WhatsApp
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={250}
              value={whatsAppCount}
              onChange={(e) => setWhatsAppCount(Number(e.target.value))}
              className="w-full accent-[#0E7C9B] h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 msgs</span>
              <span>Rate: ${UNIT_RATES.whatsAppRate}/msg</span>
              <span>10,000 msgs</span>
            </div>
          </div>

          {/* Slider 4: Emails per month */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Monthly Email Volume</span>
              <span className="font-bold text-[#0E7C9B]">
                {emailCount.toLocaleString()} Emails
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50000}
              step={1000}
              value={emailCount}
              onChange={(e) => setEmailCount(Number(e.target.value))}
              className="w-full accent-[#0E7C9B] h-2 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 emails</span>
              <span>Rate: ${UNIT_RATES.emailRate}/email ($1 per 10k)</span>
              <span>50,000 emails</span>
            </div>
          </div>

          {/* Contingency Buffer Switch */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Include 10% Contingency Buffer
              </div>
              <div className="text-[11px] text-slate-500">
                Recommended to account for carrier price variations and extra weekend spikes.
              </div>
            </div>
            <button
              onClick={() => setIncludeBuffer((prev) => !prev)}
              className="p-1 text-[#0E7C9B]"
            >
              {includeBuffer ? (
                <ToggleRight className="h-8 w-8 text-[#0E7C9B]" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Itemized Breakdown Card (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-[#3EC6F2]/30 bg-gradient-to-br from-white to-[#EAF6FC] p-4 sm:p-6 shadow-xs space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A7384]">
                Total Estimated Monthly Cost
              </span>
              <div className="text-3xl lg:text-4xl font-black text-[#0F2A3A] mt-1">
                ${breakdown.estimatedMonthlyTotal.toFixed(2)}
                <span className="text-sm font-normal text-slate-500"> / month</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Direct carrier & cloud charges. No hidden markups.
              </p>
            </div>

            {/* Itemized Table */}
            <div className="space-y-2 pt-3 border-t border-slate-200 text-xs">
              <div className="font-bold text-slate-800">
                Fixed Infrastructure: ${breakdown.fixed.totalFixed.toFixed(2)}/mo
              </div>
              <div className="space-y-1 text-slate-600 pl-2">
                <div className="flex justify-between">
                  <span>Cloud Compute Server:</span>
                  <span>${breakdown.fixed.cloudServer.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Supabase Pro Database:</span>
                  <span>${breakdown.fixed.databaseSupabase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Encrypted Backups Storage:</span>
                  <span>${breakdown.fixed.backupsStorage.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Rhythm & Wording Token Budget:</span>
                  <span>${breakdown.fixed.aiDrafting.toFixed(2)}</span>
                </div>
                {breakdown.fixed.smsRegulatoryNumberFee > 0 && (
                  <div className="flex justify-between">
                    <span>SMS Brand/10DLC Toll-Free Fee:</span>
                    <span>${breakdown.fixed.smsRegulatoryNumberFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="font-bold text-slate-800 pt-2">
                Variable Usage Messages: ${breakdown.variable.totalVariable.toFixed(2)}/mo
              </div>
              <div className="space-y-1 text-slate-600 pl-2">
                <div className="flex justify-between">
                  <span>SMS ({smsCount.toLocaleString()} @ $0.0125):</span>
                  <span>${breakdown.variable.smsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>WhatsApp ({whatsAppCount.toLocaleString()} @ $0.0685):</span>
                  <span>${breakdown.variable.whatsAppTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email ({emailCount.toLocaleString()} @ $0.0001):</span>
                  <span>${breakdown.variable.emailTotal.toFixed(2)}</span>
                </div>
              </div>

              {includeBuffer && (
                <div className="flex justify-between pt-2 text-[#0E7C9B] font-bold">
                  <span>10% Contingency Buffer:</span>
                  <span>+${breakdown.bufferAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* One-time fee note */}
            {breakdown.oneTime.smsRegistrationA2P > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>One-Time Regulatory Fee:</strong> ~$20 for A2P 10DLC brand carrier verification (billed once by the telecom registry).
              </div>
            )}

            {/* Service & Setup Fee Note */}
            <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-700 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Zirium Setup & Integration Fee:</span>
                <span className="text-[#0E7C9B]">To be agreed</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Monthly Dedicated SLA Support:</span>
                <span className="text-[#0E7C9B]">To be agreed</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 leading-relaxed">
              Estimates in US dollars. Providers can change carrier prices. All developer accounts (Twilio, Meta WhatsApp, Supabase) are registered in your restaurant's name and billed directly to you.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
