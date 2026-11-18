import type { Order, Segment, DiscoveredGuestType } from "./types";

export interface PredictionResult {
  usualGapDays: number;
  daysSinceLastOrder: number;
  segment: Segment;
  discoveredType: DiscoveredGuestType;
  favouriteDish: string;
  favouriteDishesTop5: { name: string; count: number; percentage: number }[];
  predictedNextVisitDate: string;
  flaggedReason: string;
}

export function computeGuestMetricsAndPredictions(
  guestOrders: Order[],
  referenceDateStr: string = "2026-11-18T12:00:00Z"
): PredictionResult {
  const referenceDate = new Date(referenceDateStr);

  if (guestOrders.length === 0) {
    return {
      usualGapDays: 14,
      daysSinceLastOrder: 30,
      segment: "New",
      discoveredType: "Weekday lunch regulars",
      favouriteDish: "Chicken Biryani",
      favouriteDishesTop5: [],
      predictedNextVisitDate: new Date(referenceDate.getTime() + 14 * 86400000).toISOString(),
      flaggedReason: "New guest with no order history.",
    };
  }

  // Sort orders ascending
  const sorted = [...guestOrders].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const lastOrder = sorted[sorted.length - 1];
  const lastOrderDate = new Date(lastOrder.timestamp);
  const diffMs = referenceDate.getTime() - lastOrderDate.getTime();
  const daysSinceLastOrder = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

  // Calculate gaps between consecutive orders
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].timestamp).getTime();
    const curr = new Date(sorted[i].timestamp).getTime();
    const gapDays = Math.max(1, Math.round((curr - prev) / (1000 * 60 * 60 * 24)));
    gaps.push(gapDays);
  }

  // Calculate median gap
  let usualGapDays = 14;
  if (gaps.length > 0) {
    gaps.sort((a, b) => a - b);
    const mid = Math.floor(gaps.length / 2);
    usualGapDays = gaps.length % 2 !== 0 ? gaps[mid] : Math.round((gaps[mid - 1] + gaps[mid]) / 2);
    usualGapDays = Math.max(7, Math.min(60, usualGapDays));
  } else {
    // Single order
    usualGapDays = 14;
  }

  // Segment classification
  // New (1 order, <30 days), Regular, Late (>1.5x median gap), Lapsed (>3x gap or >90 days)
  let segment: Segment = "Regular";
  if (sorted.length === 1 && daysSinceLastOrder <= 30) {
    segment = "New";
  } else if (daysSinceLastOrder > 3 * usualGapDays || daysSinceLastOrder > 90) {
    segment = "Lapsed";
  } else if (daysSinceLastOrder > 1.5 * usualGapDays) {
    segment = "Late";
  } else {
    segment = "Regular";
  }

  // Next visit prediction date
  const nextVisitTime = lastOrderDate.getTime() + usualGapDays * 86400000;
  const predictedNextVisitDate = new Date(nextVisitTime).toISOString();

  // Favourite dish calculation: weighted by frequency and recency
  // More recent orders give higher weight
  const itemScores: Record<string, { count: number; score: number }> = {};
  sorted.forEach((order, index) => {
    // Recency weight: from 1.0 (oldest) to 2.0 (newest)
    const recencyWeight = 1.0 + (index / Math.max(1, sorted.length - 1));
    order.items.forEach((item) => {
      if (!itemScores[item.name]) {
        itemScores[item.name] = { count: 0, score: 0 };
      }
      itemScores[item.name].count += item.quantity;
      itemScores[item.name].score += item.quantity * recencyWeight;
    });
  });

  const sortedItems = Object.entries(itemScores).sort(
    (a, b) => b[1].score - a[1].score
  );

  const totalItemCount = Object.values(itemScores).reduce((sum, item) => sum + item.count, 0) || 1;
  const favouriteDish = sortedItems[0]?.[0] || "Special Chicken Biryani";

  const favouriteDishesTop5 = sortedItems.slice(0, 5).map(([name, data]) => ({
    name,
    count: data.count,
    percentage: Math.round((data.count / totalItemCount) * 100),
  }));

  // Discovered guest types assignment:
  // "Weekday lunch regulars", "Weekend family diners", "Late-night delivery", "Online-only orderers"
  let weekdayLunchCount = 0;
  let weekendDinnerCount = 0;
  let lateNightDeliveryCount = 0;
  let onlineOnlyCount = 0;

  sorted.forEach((o) => {
    if (o.channel === "online") onlineOnlyCount++;
    const isWeekend = o.dayOfWeek === 0 || o.dayOfWeek === 6 || o.dayOfWeek === 5; // Fri evening/Sat/Sun
    if (!isWeekend && o.hour >= 11 && o.hour <= 15) {
      weekdayLunchCount++;
    }
    if (isWeekend && o.hour >= 18 && o.hour <= 22) {
      weekendDinnerCount++;
    }
    if (o.hour >= 21 || o.hour <= 3 || (o.orderType === "delivery" && o.hour >= 20)) {
      lateNightDeliveryCount++;
    }
  });

  let discoveredType: DiscoveredGuestType = "Weekday lunch regulars";
  const total = sorted.length;
  if (onlineOnlyCount / total >= 0.8) {
    discoveredType = "Online-only orderers";
  } else if (lateNightDeliveryCount / total >= 0.4) {
    discoveredType = "Late-night delivery";
  } else if (weekendDinnerCount >= weekdayLunchCount) {
    discoveredType = "Weekend family diners";
  } else {
    discoveredType = "Weekday lunch regulars";
  }

  // Plain-English flagged reason
  let flaggedReason = "";
  if (segment === "Late") {
    flaggedReason = `Usually orders every ${usualGapDays} days, but it has been ${daysSinceLastOrder} days (${Math.round((daysSinceLastOrder / usualGapDays) * 10) / 10}x normal gap). Suggest a friendly reminder featuring their favourite ${favouriteDish}.`;
  } else if (segment === "Lapsed") {
    flaggedReason = `Has not ordered in ${daysSinceLastOrder} days (typical rhythm was every ${usualGapDays} days). At high risk of churn. Needs a high-impact win-back offer.`;
  } else if (segment === "New") {
    flaggedReason = `First visited ${daysSinceLastOrder} days ago. Perfect window for a welcome reward to encourage a 2nd visit before rhythm fades.`;
  } else {
    flaggedReason = `Consistent active diner ordering every ~${usualGapDays} days (last visit was ${daysSinceLastOrder} days ago). In great standing.`;
  }

  return {
    usualGapDays,
    daysSinceLastOrder,
    segment,
    discoveredType,
    favouriteDish,
    favouriteDishesTop5,
    predictedNextVisitDate,
    flaggedReason,
  };
}
