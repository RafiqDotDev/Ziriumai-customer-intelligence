import React from "react";
import { useDemoStore } from "@/lib/store";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Users,
  Send,
  TrendingUp,
  ShieldCheck,
  PlugZap,
  Calculator,
} from "lucide-react";
import { useNavigate } from "react-router";

export function GuidedTourModal() {
  const { tourStep, nextTourStep, prevTourStep, skipTour, guests } = useDemoStore();
  const navigate = useNavigate();

  if (tourStep === null) return null;

  const TOUR_STEPS = [
    {
      step: 1,
      title: "1. The Nightly Rhythm (Home)",
      route: "/",
      icon: Sparkles,
      tag: "Every Night at 03:00 AM",
      description:
        "Every night, Zirium AI connects read-only to your POS. It analyzes all orders, updates guest profiles, predicts who is at risk of churning, and presents high-priority actions for your morning coffee.",
      actionText: "Check At-Risk Diners",
    },
    {
      step: 2,
      title: "2. Discovered Guest Types (Groups)",
      route: "/groups",
      icon: Users,
      tag: "Autonomous Segmentation",
      description:
        "Guests are dynamically segmented into New, Regular, Late, and Lapsed groups, plus discovered lifestyle types like 'Weekday lunch regulars' and 'Weekend family diners'.",
      actionText: "View Diners & Filters",
    },
    {
      step: 3,
      title: "3. Identity Merge & Profile (Guest Detail)",
      route: `/guests/${guests[0]?.id || "gst_0001"}`,
      icon: CheckCircle2,
      tag: "Single Guest Record",
      description:
        "Whether someone orders dine-in at the counter, orders online, or calls in with slightly different phone formats ('0300...' vs '+92 300...'), Zirium merges them into one single profile with visit gap analytics.",
      actionText: "Inspect Identity Resolution",
    },
    {
      step: 4,
      title: "4. Owner-Approved Campaigns",
      route: "/campaigns",
      icon: Send,
      tag: "Owner in Full Control",
      description:
        "Nothing ever sends automatically without owner approval. Review recipients, preview phone mockups, and use AI wording assistance that sees only the guest's first name and favorite dish.",
      actionText: "Review Pending Campaigns",
    },
    {
      step: 5,
      title: "5. Safety Gates & Emergency Kill Switch",
      route: "/campaigns",
      icon: ShieldCheck,
      tag: "Privacy & Frequency Caps",
      description:
        "Before sending, four automated safety checks run: Consent verified, 7-day frequency cap, quiet hours (no night texts), and the 'Stop All Sending' global kill switch.",
      actionText: "Test Safety Gates",
    },
    {
      step: 6,
      title: "6. Honest Measurement: The 10% Holdout",
      route: "/results",
      icon: TrendingUp,
      tag: "Scientific Uplift ROI",
      description:
        "We randomly hold back 10% of eligible guests who are never contacted. By comparing the order rate of messaged guests vs uncontacted guests, we prove the exact extra orders and revenue created.",
      actionText: "Examine Holdout Proof",
    },
    {
      step: 7,
      title: "7. Read-Only Access & Transparent Costs",
      route: "/costs",
      icon: Calculator,
      tag: "No Surprises, Zero Risk",
      description:
        "Zirium uses strictly read-only POS access. Carrier accounts and cloud infrastructure belong directly to you with transparent direct billing. Adjust sliders to see your exact estimated monthly cost.",
      actionText: "Finish Tour",
    },
  ];

  const current = TOUR_STEPS[tourStep - 1] || TOUR_STEPS[0];
  const Icon = current.icon;

  const handleNext = () => {
    if (tourStep === TOUR_STEPS.length) {
      skipTour();
      navigate("/");
    } else {
      nextTourStep();
      const nextTarget = TOUR_STEPS[tourStep];
      if (nextTarget) {
        navigate(nextTarget.route);
      }
    }
  };

  const handlePrev = () => {
    if (tourStep > 1) {
      prevTourStep();
      const prevTarget = TOUR_STEPS[tourStep - 2];
      if (prevTarget) {
        navigate(prevTarget.route);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-[94%] sm:w-full max-w-lg rounded-3xl bg-white p-4 sm:p-6 shadow-2xl border border-[#3EC6F2]/30 relative text-left max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EAF6FC] text-[#0E7C9B] text-xs font-bold">
              {tourStep}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E7C9B]">
              10-Minute Presentation Tour ({tourStep} of {TOUR_STEPS.length})
            </span>
          </div>
          <button
            onClick={skipTour}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#3EC6F2]/15 px-2.5 py-0.5 text-xs font-semibold text-[#0E7C9B]">
            <Icon className="h-3.5 w-3.5" />
            <span>{current.tag}</span>
          </div>

          <h3 className="text-xl font-bold text-[#0F2A3A]">
            {current.title}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Step dots */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {TOUR_STEPS.map((s) => (
            <div
              key={s.step}
              className={`h-2 rounded-full transition-all ${
                s.step === tourStep
                  ? "w-6 bg-[#0E7C9B]"
                  : "w-2 bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Footer controls */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={skipTour}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Exit Tour
          </button>

          <div className="flex items-center gap-2">
            {tourStep > 1 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl bg-[#0E7C9B] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0B647D] transition-all"
            >
              <span>{tourStep === TOUR_STEPS.length ? "Done" : "Next Step"}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
