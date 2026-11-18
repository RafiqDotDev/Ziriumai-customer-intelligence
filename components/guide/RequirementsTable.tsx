import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function RequirementsTable() {
  const REQUIREMENTS = [
    {
      what: "Orders: order number, date and time, guest, status, outlet",
      why: "Builds guest profiles and every prediction",
      level: "Required",
      levelBadge: "bg-red-100 text-red-800 border-red-200",
    },
    {
      what: "Items on each order: item name, quantity",
      why: "Favourite dishes and dish suggestions",
      level: "Required",
      levelBadge: "bg-red-100 text-red-800 border-red-200",
    },
    {
      what: "Menu and outlet list, with time zone",
      why: "Correct timing and accurate suggestions",
      level: "Required",
      levelBadge: "bg-red-100 text-red-800 border-red-200",
    },
    {
      what: "Guest phone number (and email if you have it)",
      why: "Sending messages, and recognising the same guest across channels",
      level: "Required for messaging",
      levelBadge: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      what: "Marketing consent and opt-out records",
      why: "We only message guests who agreed",
      level: "Required for messaging",
      levelBadge: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      what: "Order totals, discounts and offer codes",
      why: "Revenue results and which guests respond to offers",
      level: "Recommended, with your approval",
      levelBadge: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      what: "Item categories, order channel, delivery or pickup",
      why: "Guest types and smarter suggestions",
      level: "Recommended",
      levelBadge: "bg-slate-100 text-slate-800 border-slate-200",
    },
    {
      what: "One contact person, plus your POS developer if it is custom",
      why: "Approvals, access and questions",
      level: "Required",
      levelBadge: "bg-red-100 text-red-800 border-red-200",
    },
  ];

  return (
    <div className="rounded-3xl border border-[#D1E7F2] bg-white overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-[#E2EEF5]">
        <h4 className="text-sm sm:text-base font-bold text-[#0F2A3A]">
          What We Need From You (POS Data Requirements)
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          If something is missing, we still start. The Data Readiness Report highlights what is missing and how to collect it.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#EAF6FC]/70 border-b border-[#D1E7F2] text-[10px] font-bold uppercase tracking-wider text-[#0E7C9B]">
            <tr>
              <th className="py-3 px-4 sm:px-6">What We Need</th>
              <th className="py-3 px-4 sm:px-6">Why</th>
              <th className="py-3 px-4 sm:px-6 text-right">Requirement Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {REQUIREMENTS.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#0F2A3A]">
                  {row.what}
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-slate-600">
                  {row.why}
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${row.levelBadge}`}
                  >
                    {row.level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
