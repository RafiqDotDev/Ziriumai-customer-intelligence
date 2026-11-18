import React, { useState } from "react";
import { Link } from "react-router";
import {
  Sparkles,
  Printer,
  Download,
  ShieldCheck,
  Lock,
  ArrowRight,
  Database,
  Users,
  CheckCircle2,
  Calendar,
  DollarSign,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Figure1NightlyLoop } from "@/components/guide/Figure1NightlyLoop";
import { Figure2ConnectionFlow } from "@/components/guide/Figure2ConnectionFlow";
import { RequirementsTable } from "@/components/guide/RequirementsTable";
import { FaqAccordion } from "@/components/guide/FaqAccordion";

export default function ServiceGuidePage() {
  const [activeSection, setActiveSection] = useState<string>("01");

  const SECTIONS = [
    { id: "01", label: "01 Overview" },
    { id: "02", label: "02 The Process" },
    { id: "03", label: "03 Data Access" },
    { id: "04", label: "04 Requirements" },
    { id: "05", label: "05 Dashboard" },
    { id: "06", label: "06 Messaging" },
    { id: "07", label: "07 Privacy" },
    { id: "08", label: "08 Investment" },
    { id: "09", label: "09 Costs" },
    { id: "10", label: "10 Questions" },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Cover Header Banner */}
      <div className="rounded-3xl border border-[#D1E7F2] bg-gradient-to-br from-[#EAF6FC] via-white to-[#F0F9FD] p-6 sm:p-10 shadow-sm relative overflow-hidden print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#D1E7F2]/80">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0E7C9B] to-[#3EC6F2] text-white shadow-md">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F2A3A]">
                Zirium AI
              </span>
              <span className="ml-2 rounded-sm bg-[#3EC6F2]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#0E7C9B]">
                SERVICE GUIDE
              </span>
              <p className="text-xs text-[#5A7384]">Prepared by Zirium AI · November 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden self-end sm:self-auto">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0E7C9B] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0B647D] transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 max-w-2xl">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#0F2A3A] leading-tight">
            How Your Customer Intelligence Service Works
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            A plain-language guide to how the service works, how you give us access to your data, and what it costs.
          </p>
        </div>
      </div>

      {/* Sticky Section Quick Navigation Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md py-2.5 px-3 rounded-2xl border border-[#E2EEF5] shadow-2xs overflow-x-auto flex items-center gap-1.5 scrollbar-none print:hidden">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeSection === sec.id
                ? "bg-[#0E7C9B] text-white shadow-xs"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 01 / OVERVIEW */}
      {/* ========================================================================= */}
      <section id="section-01" className="scroll-mt-32 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#0E7C9B] uppercase">
            01 / Overview
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-[#E2EEF5] p-6 sm:p-8 shadow-2xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
            What this is
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            This is a service we build specifically for your restaurant, not an off-the-shelf software product. We connect to the order data your system already records and turn it into a clear picture of your guests: who your regulars are, who is drifting away, and what to say to bring them back.
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            The paid tools the system uses, such as message sending and cloud hosting, are listed with monthly estimates in the cost section at the end.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 / THE PROCESS */}
      {/* ========================================================================= */}
      <section id="section-02" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#0E7C9B] uppercase">
            02 / The Process
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-[#E2EEF5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
              How it works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Every night the system reads your new orders, works out which guests need attention, and prepares suggestions for you. Nothing is sent until you approve it.
            </p>
          </div>

          {/* 6 Steps List */}
          <div className="space-y-3">
            {[
              {
                num: "1",
                title: "Read:",
                desc: "new orders, items and guest details are copied from your POS, read-only. We never change anything in it.",
              },
              {
                num: "2",
                title: "One profile per guest:",
                desc: "the same person ordering at the counter, online or by phone becomes a single guest.",
              },
              {
                num: "3",
                title: "Predict:",
                desc: "the system learns each guest's usual rhythm, who is running late, who is likely to stop coming, and which dish they love.",
              },
              {
                num: "4",
                title: "Suggest:",
                desc: 'you get a short list of actions with plain reasons, for example "Usually orders every 14 days, it has been 31. Suggest a win-back message about their favourite dish."',
              },
              {
                num: "5",
                title: "You approve, then we send:",
                desc: "messages go only to guests who agreed to receive them.",
              },
              {
                num: "6",
                title: "Measure:",
                desc: "a small random group is deliberately not contacted. Comparing it with the messaged group shows the extra orders the campaign really created, and the results make the next suggestions better.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-[#0E7C9B] transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0E7C9B] text-white text-xs font-black">
                  {step.num}
                </div>
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed pt-1">
                  <strong>{step.title}</strong> {step.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Figure 1 Component */}
          <Figure1NightlyLoop />

          <p className="text-xs text-slate-500 italic">
            The feedback loop is what makes the service improve over time: every campaign teaches the system who responds and who does not.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03 / DATA ACCESS */}
      {/* ========================================================================= */}
      <section id="section-03" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#0E7C9B] uppercase">
            03 / Data Access
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-[#E2EEF5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
              How you give us access to your data
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed">
              You never hand over your system. You give us read-only access to your order data, you stay in control of it, and you can withdraw the access at any time.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0E7C9B]">
              What read-only means:
            </h3>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-700 space-y-1">
              <li>We can read and copy orders, items and guest details.</li>
              <li>We cannot change, delete or add anything in your POS, take payments, or touch your menu and prices.</li>
              <li>Access is limited to the data we need, and you can switch it off whenever you like.</li>
            </ul>
          </div>

          <p className="text-xs sm:text-sm text-slate-700">
            <strong>Step 1 is always the same:</strong> we study your POS first. We look at how your system records orders and what it allows, then choose the safest way to connect. The right way depends on what you use.
          </p>

          {/* Figure 2 Component */}
          <Figure2ConnectionFlow />

          {/* 5 Situations Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-[#0F2A3A]">
              Connection Situations & Actions
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF6FC]/70 border-b border-[#D1E7F2] text-[10px] font-bold uppercase tracking-wider text-[#0E7C9B]">
                  <tr>
                    <th className="p-3.5">Your Situation</th>
                    <th className="p-3.5">How Access Works</th>
                    <th className="p-3.5">What You Do</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">
                      Standard POS with an open API (Square, Clover)
                    </td>
                    <td className="p-3.5 text-slate-600">
                      You approve a read-only permission inside your own POS account, and our connection starts. You can revoke it from the same place.
                    </td>
                    <td className="p-3.5 font-semibold text-[#0E7C9B]">Log in and approve access</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">
                      Standard POS with a restricted API (Toast, for example)
                    </td>
                    <td className="p-3.5 text-slate-600">
                      We request integration access from the vendor. Meanwhile we can start from the POS's own report exports.
                    </td>
                    <td className="p-3.5 font-semibold text-[#0E7C9B]">
                      Allow us to contact vendor, or send scheduled reports
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">
                      You already keep orders in a database
                    </td>
                    <td className="p-3.5 text-slate-600">
                      Your developer creates a read-only user, ideally on a copy so your live system is untouched.
                    </td>
                    <td className="p-3.5 font-semibold text-[#0E7C9B]">
                      Ask your developer or IT contact to set this up
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">
                      Custom-built POS
                    </td>
                    <td className="p-3.5 text-slate-600">
                      We meet its developer, study how orders are stored, then agree the safest route: read-only database access, a regular export, or a small export feature the developer adds. We then build a connector for it.
                    </td>
                    <td className="p-3.5 font-semibold text-[#0E7C9B]">
                      Introduce us to developer and approve route
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">
                      No technical access possible
                    </td>
                    <td className="p-3.5 text-slate-600">
                      You send a CSV or Excel export in our template on a regular schedule.
                    </td>
                    <td className="p-3.5 font-semibold text-[#0E7C9B]">
                      Send the file, for example weekly
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong>After access is granted:</strong> we load your past orders once (12 to 24 months is ideal), check the data quality, then keep it up to date every night. You get a short <strong>Data Readiness Report</strong> that says what your data can and cannot support, before anything else is built.
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 / REQUIREMENTS */}
      {/* ========================================================================= */}
      <section id="section-04" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#0E7C9B] uppercase">
            04 / Requirements
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-[#E2EEF5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
              What we need from you
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              We need your order data, at least 12 months of it if available, and a few accounts opened in your name.
            </p>
          </div>

          <RequirementsTable />

          <div className="p-4 rounded-2xl bg-[#EAF6FC] border border-[#3EC6F2]/40 text-xs sm:text-sm text-[#0F2A3A] space-y-2">
            <h4 className="font-bold text-[#0E7C9B]">Accounts opened in your name:</h4>
            <p className="text-slate-700 leading-relaxed">
              For the paid tools in the cost section (message sending and cloud hosting), the accounts are created in your business name and billed directly to you. This way you own the system and its data, and you see every charge.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 / YOUR DASHBOARD */}
      {/* ========================================================================= */}
      <section id="section-05" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#0E7C9B] uppercase">
            05 / Your Dashboard
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-[#E2EEF5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
              What you see and control
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              You get a web dashboard that works on a phone and a laptop. You decide every action; the system only suggests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#0E7C9B]">Home:</span> guests at risk this week, campaigns waiting for your approval, and recent results.
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#0E7C9B]">Guest groups:</span> new, regular, late and lapsed guests, plus guest types the system discovers (weekday lunch regulars, weekend diners).
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#0E7C9B]">Guest profile:</span> visit history, favourite dishes, predicted next visit, and the plain reason a guest was flagged.
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-[#0E7C9B]">Campaign approvals:</span> a preview of who will receive the message and exactly what it says. You approve or reject.
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 md:col-span-2">
              <span className="font-bold text-[#0E7C9B]">Results:</span> extra orders each campaign created, compared with the held-back group.
            </div>
          </div>

          {/* Three Ready Campaigns Table */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Three Campaigns Ready to Run
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF6FC]/70 border-b border-[#D1E7F2] text-[10px] font-bold uppercase tracking-wider text-[#0E7C9B]">
                  <tr>
                    <th className="p-3.5">Campaign</th>
                    <th className="p-3.5">Who Receives It</th>
                    <th className="p-3.5">Goal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">First to second visit</td>
                    <td className="p-3.5 text-slate-600">Guests who have ordered once</td>
                    <td className="p-3.5 font-medium text-emerald-700">Turn first-timers into regulars</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">Win-back</td>
                    <td className="p-3.5 text-slate-600">Regulars who are late or have stopped coming</td>
                    <td className="p-3.5 font-medium text-emerald-700">Bring them back before they are lost</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">Favourite dish reminder</td>
                    <td className="p-3.5 text-slate-600">Guests who used to order a dish often but stopped</td>
                    <td className="p-3.5 font-medium text-emerald-700">Restart visits with something they already love</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06 / MESSAGING */}
      {/* ========================================================================= */}
      <section id="section-06" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#0E7C9B] uppercase">
            06 / Messaging
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-[#E2EEF5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
              How messages are sent
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              We can send on three channels. You choose which to use, and you can start with one.
            </p>
          </div>

          {/* Channels Comparison Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF6FC]/70 border-b border-[#D1E7F2] text-[10px] font-bold uppercase tracking-wider text-[#0E7C9B]">
                  <tr>
                    <th className="p-3.5">Channel</th>
                    <th className="p-3.5">Best For</th>
                    <th className="p-3.5">How It Works</th>
                    <th className="p-3.5 text-right">You Pay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">SMS</td>
                    <td className="p-3.5 text-slate-600">Short reminders, reaches guests without WhatsApp</td>
                    <td className="p-3.5 text-slate-600">Sent through a messaging provider. Business & templates registered first.</td>
                    <td className="p-3.5 text-right font-semibold text-slate-800">A small fee per message</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">WhatsApp</td>
                    <td className="p-3.5 text-slate-600">Win-back and favourite dish messages with photos, buttons, replies</td>
                    <td className="p-3.5 text-slate-600">Official WhatsApp Business Platform. Marketing templates approved by Meta; opt-in required.</td>
                    <td className="p-3.5 text-right font-semibold text-slate-800">Fee per delivered msg (Meta + provider)</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-[#0F2A3A]">Email</td>
                    <td className="p-3.5 text-slate-600">Newsletters, birthdays, catering and event menus</td>
                    <td className="p-3.5 text-slate-600">Sent from your own domain with proper authentication; every email has unsubscribe link.</td>
                    <td className="p-3.5 text-right font-semibold text-slate-800">Very low cost per email</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Safety Rules */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>Safety rules built into every channel:</span>
            </h4>
            <ul className="list-disc pl-5 text-xs text-emerald-950 space-y-1.5">
              <li>Only guests with recorded permission for that channel are contacted.</li>
              <li>Opt-outs are honoured immediately and permanently.</li>
              <li>Limits on how often one guest can be messaged, and no sending at unsuitable hours.</li>
              <li>Your approval before every campaign, and a stop button that halts all sending at once.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07 / PRIVACY */}
      {/* ========================================================================= */}
      <section id="section-07" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#0E7C9B] uppercase">
            07 / Privacy
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-[#E2EEF5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
              Your data and privacy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your data stays yours, and it is used only to run your own service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-[#0F2A3A]">Ownership:</h4>
              <p className="text-slate-600 leading-relaxed">
                The data and the accounts are in your name. If we stop working together, you keep them.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-[#0F2A3A]">Where it lives:</h4>
              <p className="text-slate-600 leading-relaxed">
                In a cloud account set up for you, in a region we agree with you, encrypted and with access limited by role.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-[#0F2A3A]">Read-only and minimal:</h4>
              <p className="text-slate-600 leading-relaxed">
                We read only the data the service needs, and nothing is changed in your POS.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-[#0F2A3A]">Never sold or shared:</h4>
              <p className="text-slate-600 leading-relaxed">
                Your guests' details are not sold, shared with third parties, or used to train public AI models.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-[#0F2A3A]">AI is used lightly:</h4>
              <p className="text-slate-600 leading-relaxed">
                It helps draft message wording, using only a first name and a dish. It does not see phone numbers or full records, and it never decides who gets contacted.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <h4 className="font-bold text-[#0F2A3A]">Guest consent:</h4>
              <p className="text-slate-600 leading-relaxed">
                Marketing goes only to guests who agreed to it. We record when and how consent was given.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08 / INVESTMENT & 09 / RUNNING COSTS */}
      {/* ========================================================================= */}
      <section id="section-08" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#0E7C9B] uppercase">
            08 / Investment & 09 / Running Costs
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-[#E2EEF5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
              One-time setup cost
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              You pay a one-time fee to Zirium AI for designing, connecting and setting up the service for your restaurant. It covers our work only. The paid tools the service uses are billed separately by their providers.
            </p>
          </div>

          {/* One-time table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EAF6FC]/70 border-b border-[#D1E7F2] text-[10px] font-bold uppercase tracking-wider text-[#0E7C9B]">
                <tr>
                  <th className="p-3.5">Item</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5 text-right">Paid To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5 font-bold text-[#0F2A3A]">
                    Setup of the service for your restaurant: POS study, connection, data loading, guest profiles, predictions, dashboard, first campaign and training
                  </td>
                  <td className="p-3.5 text-slate-700 font-semibold">[amount, to be agreed]</td>
                  <td className="p-3.5 text-right text-slate-600">Zirium AI, once</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#0F2A3A]">
                    SMS business registration
                  </td>
                  <td className="p-3.5 text-slate-700">
                    About US$20 once (brand US$4.50 plus campaign vetting US$15)
                  </td>
                  <td className="p-3.5 text-right text-slate-600">The messaging provider</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-[#0F2A3A]">
                    Support after handover
                  </td>
                  <td className="p-3.5 text-slate-700 font-semibold">[to be agreed]</td>
                  <td className="p-3.5 text-right text-slate-600">Zirium AI</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Monthly running costs banner */}
          <div id="section-09" className="scroll-mt-32 pt-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
              Monthly running costs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Beyond the one-time fee, the service uses a few paid tools that are billed monthly. For a restaurant sending a moderate number of messages, we estimate roughly:
            </p>

            <div className="my-4 rounded-3xl bg-[#0F2A3A] text-white p-6 sm:p-8 text-center space-y-1 shadow-md">
              <span className="text-xs uppercase tracking-widest text-[#3EC6F2] font-black">
                Estimated Monthly Range
              </span>
              <div className="text-3xl sm:text-5xl font-black text-white">
                US$70 to US$195 per month
              </div>
              <p className="text-xs text-slate-300">
                depending mostly on how many messages you send and which channels you use
              </p>
            </div>
          </div>

          {/* Fixed Monthly Breakdown Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#0F2A3A]">
              Fixed monthly running costs
            </h3>
            <p className="text-xs text-slate-500">
              These are the same whether you send 100 messages or 10,000. All accounts are in your name and billed directly to you.
            </p>

            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF6FC]/70 border-b border-[#D1E7F2] text-[10px] font-bold uppercase tracking-wider text-[#0E7C9B]">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3">What It Does</th>
                    <th className="p-3 text-right">Estimated Per Month</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">Cloud server (2 vCPU, 4 GB)</td>
                    <td className="p-3 text-slate-600">Runs the nightly updates, predictions, dashboard and message sending</td>
                    <td className="p-3 text-right font-semibold text-slate-800">US$24</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">Managed database (Supabase Pro plan)</td>
                    <td className="p-3 text-slate-600">Stores your data securely, with daily backups</td>
                    <td className="p-3 text-right font-semibold text-slate-800">US$25</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">Server backups</td>
                    <td className="p-3 text-slate-600">Daily copy of the server</td>
                    <td className="p-3 text-right font-semibold text-slate-800">About US$5</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">AI message drafting (Claude Haiku 5.5)</td>
                    <td className="p-3 text-slate-600">
                      Writes wording options for you to approve; at US$0.10/M input & US$0.50/M output tokens, a thousand drafts cost well under US$1
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-800">US$1 to US$5</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">SMS sender number & campaign fee</td>
                    <td className="p-3 text-slate-600">
                      A business number plus the monthly message-campaign registration fee; only if you use SMS
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-800">US$3 to US$11</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">Scheduling, model tracking & monitoring</td>
                    <td className="p-3 text-slate-600">Open-source tools that we run ourselves</td>
                    <td className="p-3 text-right font-semibold text-emerald-700">US$0</td>
                  </tr>
                  <tr className="bg-slate-50/80 font-bold">
                    <td className="p-3 text-[#0F2A3A]">Fixed total</td>
                    <td className="p-3 text-slate-500">—</td>
                    <td className="p-3 text-right text-[#0E7C9B]">About US$59 to US$70</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Per Message Table */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-[#0F2A3A]">
              Cost per message (varies with how much you send)
            </h3>

            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF6FC]/70 border-b border-[#D1E7F2] text-[10px] font-bold uppercase tracking-wider text-[#0E7C9B]">
                  <tr>
                    <th className="p-3">Channel</th>
                    <th className="p-3">Cost Per Message</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">SMS</td>
                    <td className="p-3 font-semibold text-slate-800">About US$0.012 to US$0.013</td>
                    <td className="p-3 text-slate-600">
                      US$0.0083 provider rate plus a US$0.0035 to US$0.005 carrier fee, per 160-char message
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">WhatsApp marketing message</td>
                    <td className="p-3 font-semibold text-slate-800">
                      Meta fee + US$0.005 provider fee. Example total: US$0.0685
                    </td>
                    <td className="p-3 text-slate-600">Meta sets this fee and may change it</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">Email</td>
                    <td className="p-3 font-semibold text-slate-800">About US$0.0001 (US$0.10 per 1,000)</td>
                    <td className="p-3 text-slate-600">No extra monthly fee at this volume</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* What a Month Could Look Like (3 Presets) */}
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-bold text-[#0F2A3A]">
              What a month could look like (3 Real Scenarios)
            </h3>

            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAF6FC]/70 border-b border-[#D1E7F2] text-[10px] font-bold uppercase tracking-wider text-[#0E7C9B]">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3">Small: One Outlet</th>
                    <th className="p-3">Medium: Several Outlets</th>
                    <th className="p-3">Medium, Adding WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">Messages per month</td>
                    <td className="p-3 text-slate-700">1,000 SMS, 3,000 emails</td>
                    <td className="p-3 text-slate-700">4,000 SMS, 10,000 emails</td>
                    <td className="p-3 text-slate-700">4,000 SMS, 10,000 emails, 1,000 WhatsApp</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">Messaging cost</td>
                    <td className="p-3 text-slate-700">About US$12 to US$14</td>
                    <td className="p-3 text-slate-700">About US$48 to US$54</td>
                    <td className="p-3 text-slate-700">About US$117 to US$123</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-[#0F2A3A]">Fixed costs</td>
                    <td className="p-3 text-slate-700">US$59 to US$70</td>
                    <td className="p-3 text-slate-700">US$59 to US$70</td>
                    <td className="p-3 text-slate-700">US$59 to US$70</td>
                  </tr>
                  <tr className="bg-teal-50/70 font-bold">
                    <td className="p-3 text-[#0F2A3A]">Estimated total</td>
                    <td className="p-3 text-[#0E7C9B]">US$70 to US$85</td>
                    <td className="p-3 text-[#0E7C9B]">US$105 to US$125</td>
                    <td className="p-3 text-[#0E7C9B]">US$175 to US$195</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1">
            <p>
              The WhatsApp column uses the example rate above. Add roughly <strong>10% as a buffer</strong> for price changes and overages. You control the biggest cost yourself: messaging fewer, better-chosen guests lowers the bill, which is exactly what the predictions are for.
            </p>
            <p className="text-[11px] text-slate-500 pt-1">
              <em>Price sources:</em> Twilio SMS pricing · Twilio WhatsApp pricing · Twilio A2P 10DLC fees · Amazon SES pricing · Supabase pricing · Claude API pricing · DigitalOcean Droplet pricing guide (checked 18 November 2026).
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10 / QUESTIONS */}
      {/* ========================================================================= */}
      <section id="section-10" className="scroll-mt-32 space-y-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black tracking-widest text-[#0E7C9B] uppercase">
            10 / Questions
          </span>
        </div>
        <div className="bg-white rounded-3xl border border-[#E2EEF5] p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F2A3A]">
              Common questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Straightforward answers to the most common questions from restaurant operators.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* Footer Signature */}
      <div className="text-center pt-8 border-t border-[#E2EEF5] text-xs text-slate-500 space-y-1">
        <div className="font-bold text-[#0F2A3A]">Zirium AI Customer Intelligence Service</div>
        <p>Prepared by Zirium AI · November 2026</p>
      </div>
    </div>
  );
}
