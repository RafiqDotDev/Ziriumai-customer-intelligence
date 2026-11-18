import React, { useState, useMemo } from "react";
import { Link } from "react-router";
import { useDemoStore } from "@/lib/store";
import { SegmentBadge } from "@/components/ui/SegmentBadge";
import { maskPhone } from "@/lib/utils";
import {
  Users,
  Search,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Utensils,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import type { Segment, DiscoveredGuestType } from "@/lib/types";

export default function GroupsPage() {
  const { guests, selectedOutletId } = useDemoStore();

  const [activeTab, setActiveTab] = useState<string>("Regular");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<
    "name" | "totalOrders" | "daysSinceLastOrder" | "usualGapDays" | "totalSpend"
  >("daysSinceLastOrder");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Tab definitions
  const TABS = [
    {
      id: "Regular",
      label: "Regular Diners",
      type: "segment",
      definition: "Consistent guests ordering within their typical cycle rhythm.",
    },
    {
      id: "Late",
      label: "Late (Due Visit)",
      type: "segment",
      definition: "Guests whose interval since last order exceeds 1.5x their median gap.",
    },
    {
      id: "Lapsed",
      label: "Lapsed (At Risk)",
      type: "segment",
      definition: "Overdue by >3x their usual gap or >90 days without an order.",
    },
    {
      id: "New",
      label: "New (<30 Days)",
      type: "segment",
      definition: "Single visit recorded within the past 30 days. High opportunity for 2nd visit.",
    },
    {
      id: "Weekday lunch regulars",
      label: "Weekday Lunch",
      type: "discovered",
      definition: "Discovered pattern: Counter & dine-in guests ordering Monday–Friday between 11 AM – 3 PM.",
    },
    {
      id: "Weekend family diners",
      label: "Weekend Diners",
      type: "discovered",
      definition: "Discovered pattern: High basket sizes during Friday evening through Sunday dinner.",
    },
    {
      id: "Late-night delivery",
      label: "Late-Night Delivery",
      type: "discovered",
      definition: "Discovered pattern: Guests ordering after 9 PM or delivery orders late at night.",
    },
    {
      id: "Online-only orderers",
      label: "Online-Only",
      type: "discovered",
      definition: "Discovered pattern: 80%+ orders placed via web and app platforms.",
    },
  ];

  // Outlet-filtered list
  const outletFiltered = useMemo(() => {
    return selectedOutletId === "all"
      ? guests
      : guests.filter((g) => g.preferredOutletId === selectedOutletId);
  }, [guests, selectedOutletId]);

  // Tab filtered list
  const tabFiltered = useMemo(() => {
    return outletFiltered.filter((g) => {
      if (
        activeTab === "New" ||
        activeTab === "Regular" ||
        activeTab === "Late" ||
        activeTab === "Lapsed"
      ) {
        return g.segment === activeTab;
      }
      return g.discoveredType === activeTab;
    });
  }, [outletFiltered, activeTab]);

  // Search filtered list
  const searched = useMemo(() => {
    if (!searchQuery.trim()) return tabFiltered;
    const q = searchQuery.toLowerCase();
    return tabFiltered.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.favouriteDish.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q) ||
        g.primaryPhone.includes(q)
    );
  }, [tabFiltered, searchQuery]);

  // Sorted list
  const sorted = useMemo(() => {
    return [...searched].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }
      return sortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [searched, sortField, sortDirection]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const currentTabMeta = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Title */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2EEF5] shadow-2xs">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-[#0F2A3A]">
          Guest Groups & Segments
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#5A7384]">
          Understand your diners by their actual visit habits, not guess-work. Grouped into lifecycle segments and discovered types.
        </p>
      </div>

      {/* Tabs list (horizontal scroll on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none -mx-1 px-1">
        {TABS.map((tab) => {
          const count = outletFiltered.filter((g) => {
            if (
              tab.id === "New" ||
              tab.id === "Regular" ||
              tab.id === "Late" ||
              tab.id === "Lapsed"
            ) {
              return g.segment === tab.id;
            }
            return g.discoveredType === tab.id;
          }).length;

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isActive
                  ? "bg-[#0E7C9B] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Context Card + Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E2EEF5] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#0F2A3A]">
              {currentTabMeta.label}
            </span>
            <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-bold">
              {sorted.length} guests
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[#5A7384]">
            {currentTabMeta.definition}
          </p>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, dish, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0E7C9B] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Mobile Card List (shown on <768px) */}
      <div className="md:hidden space-y-2.5">
        {sorted.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
            No guests found matching this search or segment.
          </div>
        ) : (
          sorted.slice(0, 40).map((guest) => {
            const isSmsOptedIn = guest.consent.sms === "opted_in";
            const isOptedOut =
              guest.consent.sms === "opted_out" ||
              guest.consent.whatsapp === "opted_out";

            return (
              <div
                key={guest.id}
                className="bg-white p-3.5 rounded-2xl border border-[#E2EEF5] shadow-2xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/guests/${guest.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-[#0E7C9B]"
                      >
                        {guest.name}
                      </Link>
                      <SegmentBadge segment={guest.segment} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {maskPhone(guest.primaryPhone)}
                    </div>
                  </div>

                  <Link
                    to={`/guests/${guest.id}`}
                    className="shrink-0 rounded-lg bg-[#EAF6FC] text-[#0E7C9B] px-2.5 py-1 text-xs font-bold border border-[#3EC6F2]/30 flex items-center gap-1"
                  >
                    <span>Profile</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl text-slate-600">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Rhythm & Gap
                    </span>
                    <span
                      className={`font-bold ${
                        guest.daysSinceLastOrder > guest.usualGapDays * 1.5
                          ? "text-amber-700"
                          : "text-slate-800"
                      }`}
                    >
                      {guest.daysSinceLastOrder}d ago (cycle: ~{guest.usualGapDays}d)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Visits & Consent
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-semibold text-slate-800">
                        {guest.totalOrders} visits
                      </span>
                      <span>•</span>
                      {isOptedOut ? (
                        <span className="text-red-700 font-bold text-[10px]">
                          Opt-Out
                        </span>
                      ) : isSmsOptedIn ? (
                        <span className="text-emerald-700 font-bold text-[10px]">
                          Opt-In
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">None</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#0E7C9B] truncate">
                  <Utensils className="h-3 w-3 shrink-0" />
                  <span className="truncate">Favourite: {guest.favouriteDish}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Dense Table (shown on >=768px) */}
      <div className="hidden md:block bg-white rounded-2xl border border-[#E2EEF5] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th
                  onClick={() => handleSort("name")}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Guest Name</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("totalOrders")}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Visits</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("daysSinceLastOrder")}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Last Order</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("usualGapDays")}
                  className="py-3 px-4 cursor-pointer hover:text-slate-800"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Usual Rhythm</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Predicted Next Visit</th>
                <th className="py-3 px-4">Favourite Dish</th>
                <th className="py-3 px-4">Consent Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No guests found matching this search or segment.
                  </td>
                </tr>
              ) : (
                sorted.slice(0, 50).map((guest) => {
                  const isSmsOptedIn = guest.consent.sms === "opted_in";
                  const isOptedOut =
                    guest.consent.sms === "opted_out" ||
                    guest.consent.whatsapp === "opted_out";

                  const nextVisitFormatted = new Date(
                    guest.predictedNextVisitDate
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={guest.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/guests/${guest.id}`}
                            className="hover:text-[#0E7C9B] hover:underline"
                          >
                            {guest.name}
                          </Link>
                          {guest.mergedFrom.length > 0 && (
                            <span
                              className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-mono"
                              title={`Merged across ${guest.mergedFrom.length} channels`}
                            >
                              Merged
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {maskPhone(guest.primaryPhone)}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-700">
                        {guest.totalOrders} visits
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            guest.daysSinceLastOrder > guest.usualGapDays * 1.5
                              ? "text-amber-700 font-bold"
                              : "text-slate-700"
                          }`}
                        >
                          {guest.daysSinceLastOrder} days ago
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        Every ~{guest.usualGapDays} days
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-800">
                        {nextVisitFormatted}
                      </td>

                      <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate">
                        <span className="inline-flex items-center gap-1">
                          <Utensils className="h-3 w-3 text-[#0E7C9B] shrink-0" />
                          <span className="truncate">{guest.favouriteDish}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {isOptedOut ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700 border border-red-200">
                            <XCircle className="h-3 w-3" /> Opted Out
                          </span>
                        ) : isSmsOptedIn ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" /> Opted In
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                            <HelpCircle className="h-3 w-3" /> Unspecified
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/guests/${guest.id}`}
                          className="inline-flex rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-[#EAF6FC] hover:text-[#0E7C9B] hover:border-[#3EC6F2] transition-colors"
                        >
                          Profile &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {sorted.length > 50 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
            Showing top 50 of {sorted.length} guests in this segment.
          </div>
        )}
      </div>
    </div>
  );
}
