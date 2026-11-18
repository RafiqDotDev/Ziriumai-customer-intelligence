import React, { useState } from "react";
import { ChevronDown, HelpCircle, CheckCircle2 } from "lucide-react";

export function FaqAccordion() {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1, 2]); // open first few by default

  const FAQS = [
    {
      q: "Will you change anything in my POS?",
      a: "No. Access is strictly read-only, so we can look at and copy the data but cannot change, delete, or add anything. We never touch menu prices, open tickets, or staff settings.",
    },
    {
      q: "Will it slow down my billing system?",
      a: "It should not. We read data once a night (typically at 03:00 AM), and where possible from a read-replica copy rather than your live POS database.",
    },
    {
      q: "Who owns the data and the accounts?",
      a: "You do. The cloud hosting, database, and messaging provider accounts are created in your restaurant's business name and billed directly to you. The data stays yours permanently.",
    },
    {
      q: "What if I want to stop?",
      a: "You withdraw our access at any time with one click, and we return or permanently delete your data upon request. Because the accounts are in your name, nothing is locked in.",
    },
    {
      q: "What if my POS is custom-built, or has no API?",
      a: "That is exactly what Step 1 is for. We study it together with you and your software developer. If direct access is not available, an automated regular file export (CSV/Excel) works reliably.",
    },
    {
      q: "What if I do not have guests' phone numbers?",
      a: "The insights still work for all guests who are identified. Our Data Readiness Report tells you what share of orders are linked to a guest, and we suggest simple methods to collect numbers, such as at receipt checkout or via table QR codes.",
    },
    {
      q: "Do I have to send messages?",
      a: "No. Many restaurant owners start by using only the intelligence and guest rhythm insights. Promotional messages are sent only after you explicitly review and approve them, and only to guests who gave marketing consent.",
    },
    {
      q: "How will I know it works?",
      a: "Honest measurement: each campaign randomly withholds a small 10% held-back group of guests unmessaged. The difference in order rates between the messaged diners and the held-back control group proves the net extra orders the campaign truly created.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndices.includes(idx);
        return (
          <div
            key={idx}
            className="rounded-2xl border border-[#D1E7F2] bg-white transition-all overflow-hidden shadow-2xs hover:border-[#0E7C9B]"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-50/70"
            >
              <div className="flex items-center gap-3 pr-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EAF6FC] text-[#0E7C9B] text-xs font-bold">
                  {idx + 1}
                </span>
                <h5 className="text-xs sm:text-sm font-bold text-[#0F2A3A]">
                  {faq.q}
                </h5>
              </div>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#0E7C9B] transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
