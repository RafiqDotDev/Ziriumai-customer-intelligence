import React from "react";
import { FaqAccordion } from "@/components/guide/FaqAccordion";
import {
  ShieldCheck,
  Lock,
  Database,
  Brain,
  XCircle,
  AlertOctagon,
  EyeOff,
  FileCheck,
  UserCheck,
} from "lucide-react";

export default function PrivacyPage() {
  const PILLARS = [
    {
      title: "You Own 100% of the Data & Accounts",
      icon: Database,
      badge: "Full Ownership",
      description:
        "All customer profiles, order histories, and communications reside in private cloud storage registered in your restaurant's legal name. We do not hold your data hostage.",
    },
    {
      title: "Strictly Read-Only POS Boundary",
      icon: Lock,
      badge: "Zero Write Scopes",
      description:
        "Our POS integration connects with read-only credentials. Zirium cannot modify menu prices, alter open tickets, change table maps, or touch credit card transactions.",
    },
    {
      title: "Zero AI Training on Private Data",
      icon: Brain,
      badge: "No Public LLM Training",
      description:
        "Your customer data is never used to train public AI models. When generating message wording, our system passes only the diner's first name and favorite dish—never phone numbers, addresses, or order amounts.",
    },
    {
      title: "Never Sold or Shared",
      icon: EyeOff,
      badge: "Strict Confidentiality",
      description:
        "We do not monetize, aggregate, cross-sell, or share your restaurant's guest list with third-party advertisers or competing food brands under any circumstance.",
    },
    {
      title: "Consent Explicitly Logged",
      icon: UserCheck,
      badge: "Consent Audit Trail",
      description:
        "Every single marketing contact has a timestamped opt-in record tracing back to table QR codes, checkout forms, or wifi logins. Diners without verified consent are excluded automatically.",
    },
    {
      title: "Instant & Permanent Opt-Outs",
      icon: XCircle,
      badge: "Automated STOP Processing",
      description:
        "When a guest replies 'STOP' to any SMS or WhatsApp message, our system immediately flips their profile to 'opted_out' within milliseconds and permanently suppresses them from future outreach.",
    },
    {
      title: "Emergency 'Stop All Sending' Kill Switch",
      icon: AlertOctagon,
      badge: "Owner Control",
      description:
        "You hold a global red kill switch button accessible 24/7 on the dashboard. In any unexpected event, clicking it instantly freezes all outbound queues across all outlets.",
    },
    {
      title: "Regulatory Compliance Built-In",
      icon: FileCheck,
      badge: "A2P 10DLC & TCPA Ready",
      description:
        "Full support for quiet hours (blocking all promotional texts between 22:00 and 08:00), frequency caps (maximum 1 message per 7 days per diner), and carrier registration protocols.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2EEF5] shadow-2xs">
        <h1 className="text-xl lg:text-2xl font-black tracking-tight text-[#0F2A3A]">
          Privacy, Security & Control Architecture
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5A7384]">
          Your customer data belongs to you. We never sell, share, or train public AI on it.
        </p>
      </div>

      {/* Main Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[#E2EEF5] bg-white shadow-2xs hover:shadow-xs transition-shadow space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF6FC] text-[#0E7C9B]">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[10px] font-bold">
                  {pillar.badge}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#0F2A3A]">
                {pillar.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Owner Control Manifesto */}
      <div className="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-50 to-[#EAF6FC] p-6 lg:p-8 shadow-xs text-center space-y-3">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-[#0E7C9B] text-white mx-auto shadow-sm">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-[#0F2A3A]">
          The Core Zirium Principle: Owner Approves Everything
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
          AI does the heavy lifting of reading receipts, detecting rhythms, and drafting friendly suggestions. But no message ever reaches a customer without your explicit click on "Approve and send".
        </p>
      </div>

      {/* Common Questions Section (From Service Guide Page 9) */}
      <div className="rounded-3xl border border-[#E2EEF5] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0E7C9B]">
            Service Guide · Section 10
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
            Common Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Frequently asked questions about POS integration, data privacy, billing slowdown, and contract terms.
          </p>
        </div>

        <FaqAccordion />
      </div>
    </div>
  );
}
