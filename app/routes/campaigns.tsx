import React, { useState } from "react";
import { useDemoStore } from "@/lib/store";
import { evaluateCampaignRecipients } from "@/lib/campaigns";
import { PhoneMockup } from "@/components/ui/PhoneMockup";
import { maskPhone, formatCurrency } from "@/lib/utils";
import type { PendingCampaign } from "@/lib/types";
import {
  Send,
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertOctagon,
  Percent,
  Check,
  X,
  Loader2,
  Eye,
  Info,
  Calendar,
} from "lucide-react";

export default function CampaignsPage() {
  const {
    guests,
    pendingCampaigns,
    approveCampaign,
    rejectCampaign,
    stopAllSending,
    currencySymbol,
  } = useDemoStore();

  const [activeReviewCampaign, setActiveReviewCampaign] = useState<PendingCampaign | null>(
    pendingCampaigns[0] || null
  );
  const [selectedWordingIndex, setSelectedWordingIndex] = useState(0);
  const [isSendingSimulated, setIsSendingSimulated] = useState(false);
  const [deliveredCount, setDeliveredCount] = useState(0);

  // Evaluate recipients for the actively reviewed campaign
  const recipientEvaluation = activeReviewCampaign
    ? evaluateCampaignRecipients(guests, activeReviewCampaign, 11) // 11 AM safe demo time
    : null;

  const handleApprove = async (campaignId: string) => {
    if (stopAllSending || !recipientEvaluation) return;

    setIsSendingSimulated(true);
    setDeliveredCount(0);

    const totalToDeliver = recipientEvaluation.messaged.length;
    const increment = Math.max(1, Math.floor(totalToDeliver / 10));

    // Live progress counter animation
    for (let c = 0; c <= totalToDeliver; c += increment) {
      await new Promise((res) => setTimeout(res, 120));
      setDeliveredCount(Math.min(c, totalToDeliver));
    }
    setDeliveredCount(totalToDeliver);

    await approveCampaign(campaignId);
    setIsSendingSimulated(false);
  };

  const sampleGuest = recipientEvaluation?.messaged[0] || guests[0] || {
    name: "Tariq Khan",
    favouriteDish: "Butter Chicken Supreme",
    primaryPhone: "+92 300 0123456",
  };

  const sampleFirstName = sampleGuest.name.split(" ")[0] || "Friend";
  const wordingList = activeReviewCampaign?.suggestedWording || [];
  const safeIndex =
    selectedWordingIndex >= 0 && selectedWordingIndex < wordingList.length
      ? selectedWordingIndex
      : 0;
  const wordingItem = wordingList[safeIndex];

  let currentWording = "Friendly message preview...";
  if (wordingItem) {
    if (typeof wordingItem.body === "function") {
      try {
        currentWording = wordingItem.body({
          firstName: sampleFirstName,
          favouriteDish: sampleGuest.favouriteDish || "favorite dish",
        });
      } catch (e) {
        currentWording = `Hi ${sampleFirstName}! Craving your favourite ${sampleGuest.favouriteDish}? Enjoy a special treat on us at Spice Route Kitchen this week. Reply STOP to opt out.`;
      }
    } else if (typeof (wordingItem as any).body === "string") {
      currentWording = (wordingItem as any).body
        .replace(/{firstName}/g, sampleFirstName)
        .replace(/{favouriteDish}/g, sampleGuest.favouriteDish || "favorite dish");
    } else {
      currentWording = `Hi ${sampleFirstName}! Craving your favourite ${sampleGuest.favouriteDish}? Enjoy a special treat on us at Spice Route Kitchen this week. Reply STOP to opt out.`;
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2EEF5] shadow-2xs">
        <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#0F2A3A]">
          Campaign Approvals & Control
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5A7384]">
          You approve every message before it sends. We hold back 10% to measure real results.
        </p>
      </div>

      {/* Stop All Sending Warning Banner if Active */}
      {stopAllSending && (
        <div className="rounded-2xl bg-red-50 p-4 border border-red-300 text-red-900 flex items-center gap-3">
          <AlertOctagon className="h-6 w-6 text-red-600 shrink-0" />
          <div className="text-xs sm:text-sm">
            <strong>Kill switch active:</strong> Approvals are currently disabled because "Stop All Sending" is switched ON. Click the green "Resume Sending" button in the top bar to enable approvals.
          </div>
        </div>
      )}

      {/* Campaign Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pendingCampaigns.map((camp) => {
          const isSelected = activeReviewCampaign?.id === camp.id;
          const isPending = camp.status === "pending";
          const isSent = camp.status === "sent";

          return (
            <div
              key={camp.id}
              onClick={() => {
                setActiveReviewCampaign(camp);
                setSelectedWordingIndex(0);
              }}
              className={`rounded-2xl p-5 border cursor-pointer transition-all duration-200 relative ${
                isSelected
                  ? "bg-white border-[#0E7C9B] shadow-md ring-2 ring-[#0E7C9B]/20"
                  : "bg-white/80 border-[#E2EEF5] hover:bg-white hover:border-[#3EC6F2]/60 shadow-2xs"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E7C9B] bg-[#EAF6FC] px-2 py-0.5 rounded-full">
                  Via {camp.channel.toUpperCase()}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isPending
                      ? "bg-amber-100 text-amber-800"
                      : isSent
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {camp.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#0F2A3A] mb-1">
                {camp.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                {camp.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Est. Cost: ~{formatCurrency(camp.estimatedCostPerMessage, currencySymbol)}/msg
                </span>
                <span className="font-bold text-[#0E7C9B] flex items-center gap-1 text-xs">
                  {isSelected ? "Active Review" : "Select & Review"} &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Review Screen for Selected Campaign */}
      {activeReviewCampaign && recipientEvaluation && (
        <div className="rounded-3xl border border-[#E2EEF5] bg-white p-6 shadow-xs space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#0F2A3A]">
                  Reviewing: {activeReviewCampaign.name}
                </h2>
                <span className="text-xs uppercase font-bold text-[#0E7C9B] bg-[#EAF6FC] px-2 py-0.5 rounded-md">
                  {activeReviewCampaign.channel.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target: {activeReviewCampaign.targetDescription}
              </p>
            </div>

            {/* Status Indicator */}
            {activeReviewCampaign.status === "sent" ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Sent ({activeReviewCampaign.sentCount} delivered • results in 14 days)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => rejectCampaign(activeReviewCampaign.id)}
                  disabled={stopAllSending || isSendingSimulated}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(activeReviewCampaign.id)}
                  disabled={stopAllSending || isSendingSimulated}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C9B] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0B647D] disabled:opacity-50 transition-all"
                >
                  {isSendingSimulated ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending ({deliveredCount}/{recipientEvaluation.messaged.length})...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Approve and Send</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Sending Progress Bar if actively sending */}
          {isSendingSimulated && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl animate-in fade-in">
              <div className="flex justify-between text-xs font-bold text-[#0E7C9B] mb-2">
                <span>Dispatching Simulated Outbound Messages...</span>
                <span>{deliveredCount} / {recipientEvaluation.messaged.length}</span>
              </div>
              <div className="w-full bg-teal-200/60 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-[#0E7C9B] h-3 rounded-full transition-all duration-150"
                  style={{
                    width: `${(deliveredCount / recipientEvaluation.messaged.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Split Content: Left = Recipient Preview & Safety Gates, Right = Phone Mockup & AI Drafting */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col (7/12) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Recipient Breakdown Counts */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                <div className="p-2 sm:p-3 bg-[#EAF6FC] rounded-2xl border border-[#D1E7F2]">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase text-[#5A7384] block truncate">
                    Eligible to Send
                  </span>
                  <div className="text-lg sm:text-xl font-bold text-[#0E7C9B] mt-0.5">
                    {recipientEvaluation.messaged.length}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate">Will receive message</span>
                </div>

                <div className="p-2 sm:p-3 bg-purple-50 rounded-2xl border border-purple-200">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase text-purple-800 block truncate">
                    10% Held Back
                  </span>
                  <div className="text-lg sm:text-xl font-bold text-purple-900 mt-0.5">
                    {recipientEvaluation.heldBack.length}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-purple-700 block truncate">Control group</span>
                </div>

                <div className="p-2 sm:p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-500 block truncate">
                    Excluded
                  </span>
                  <div className="text-lg sm:text-xl font-bold text-slate-700 mt-0.5">
                    {recipientEvaluation.excludedReasons.noConsent +
                      recipientEvaluation.excludedReasons.optedOut +
                      recipientEvaluation.excludedReasons.frequencyCap}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">Consent / cap</span>
                </div>
              </div>

              {/* Exclusion breakdown card */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-semibold text-slate-800">Gating Exclusion Audit:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2 text-[11px] text-slate-600">
                  <div>
                    No channel consent:{" "}
                    <strong>{recipientEvaluation.excludedReasons.noConsent}</strong>
                  </div>
                  <div>
                    Opted-out diners:{" "}
                    <strong className="text-red-700">
                      {recipientEvaluation.excludedReasons.optedOut}
                    </strong>
                  </div>
                  <div>
                    Frequency cap (7d):{" "}
                    <strong>{recipientEvaluation.excludedReasons.frequencyCap}</strong>
                  </div>
                </div>
              </div>

              {/* Held-back group explainer */}
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-800 shrink-0">
                  <Percent className="h-4 w-4" />
                </div>
                <div className="text-xs text-purple-950">
                  <div className="font-bold">
                    Why 10% are held back ({recipientEvaluation.heldBack.length} guests):
                  </div>
                  <p className="mt-0.5 text-purple-900 leading-relaxed">
                    By deliberately withholding messages from a randomly selected 10% control group, we mathematically isolate how many diners returned <em>because</em> of the campaign vs how many would have come anyway.
                  </p>
                </div>
              </div>

              {/* Safety Checks Panel */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  <span>Automated Safety & Compliance Pre-Flight Checks</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Marketing consent verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>7-Day Frequency cap respected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Quiet hours (22:00-08:00) respected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Kill switch active and ready</span>
                  </div>
                </div>
              </div>

              {/* Recipient sample list table */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 flex justify-between">
                  <span>First 10 Selected Recipients (Preview)</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Phone numbers masked for presentation
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 bg-white">
                        <th className="py-2 px-3">Guest Name</th>
                        <th className="py-2 px-3">Phone</th>
                        <th className="py-2 px-3">Favourite Dish</th>
                        <th className="py-2 px-3">Cohort</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      {recipientEvaluation.eligible.slice(0, 10).map((g) => {
                        const isHeld = recipientEvaluation.heldBack.some((h) => h.id === g.id);
                        return (
                          <tr key={g.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold text-slate-800">
                              {g.name}
                            </td>
                            <td className="py-2 px-3 font-mono text-slate-500">
                              {maskPhone(g.primaryPhone)}
                            </td>
                            <td className="py-2 px-3 text-slate-600">
                              {g.favouriteDish}
                            </td>
                            <td className="py-2 px-3">
                              {isHeld ? (
                                <span className="rounded bg-purple-100 text-purple-800 px-1.5 py-0.5 text-[9px] font-bold">
                                  Held-Back (10%)
                                </span>
                              ) : (
                                <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-bold">
                                  To Contact
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Col (5/12): Phone Mockup & AI Drafting */}
            <div className="lg:col-span-5 space-y-4">
              {/* AI Wording Assistant Box */}
              <div className="rounded-2xl border border-[#3EC6F2]/30 bg-[#EAF6FC]/50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0E7C9B]">
                    <Sparkles className="h-4 w-4 text-[#3EC6F2]" />
                    <span>Draft Wording with AI</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">
                    3 Variations
                  </span>
                </div>

                {/* Privacy Badge */}
                <div className="text-[11px] text-[#4B6372] leading-tight">
                  <em>Note:</em> The AI sees only a first name and a favourite dish, never phone numbers or full records.
                </div>

                {/* Wording selector chips */}
                <div className="space-y-1.5 pt-1">
                  {activeReviewCampaign.suggestedWording.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedWordingIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all ${
                        selectedWordingIndex === idx
                          ? "bg-[#0E7C9B] text-white shadow-xs font-bold"
                          : "bg-white border border-[#D1E7F2] text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {w.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Mockup preview */}
              <div className="pt-2 flex justify-center">
                <PhoneMockup
                  channel={activeReviewCampaign.channel}
                  recipientName={sampleGuest.name}
                  body={currentWording}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
