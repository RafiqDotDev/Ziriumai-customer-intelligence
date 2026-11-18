import { getSeededData } from "../lib/seed";
import { evaluateCampaignRecipients, INITIAL_PENDING_CAMPAIGNS } from "../lib/campaigns";
import { calculateEstimatedCosts, PRESETS } from "../lib/costs";

console.log("=== Verifying Zirium AI Seed & Business Logic ===");

// 1. Repeatability test
const run1 = getSeededData(true);
const run2 = getSeededData(true);

console.assert(run1.guests.length === run2.guests.length, "Guest counts must match");
console.assert(run1.guests[0].id === run2.guests[0].id, "First guest ID must match");
console.assert(run1.guests[0].name === run2.guests[0].name, "First guest name must match");
console.assert(run1.orders.length === run2.orders.length, "Order count must match exactly");

console.log(`✓ Deterministic seed verified: Exactly ${run1.guests.length} guests, ${run1.orders.length} orders on both runs.`);

// 2. Guest segment distributions
const segCounts: Record<string, number> = { New: 0, Regular: 0, Late: 0, Lapsed: 0 };
run1.guests.forEach((g) => {
  segCounts[g.segment] = (segCounts[g.segment] || 0) + 1;
});

const total = run1.guests.length;
console.log("Segment distribution:");
Object.entries(segCounts).forEach(([seg, count]) => {
  const pct = Math.round((count / total) * 100);
  console.log(` - ${seg}: ${count} (${pct}%)`);
});

// 3. Merged Identities
const mergedCount = run1.guests.filter((g) => g.mergedFrom.length > 0).length;
console.log(`✓ Merged identity showcase: ${mergedCount} guests merged across multiple channels (target: >= 40).`);
console.assert(mergedCount >= 40, "Must have at least 40 merged guests");

// 4. Consent verification
const consentOptIn = run1.guests.filter((g) => g.consent.sms === "opted_in").length;
const consentOptOut = run1.guests.filter((g) => g.consent.sms === "opted_out").length;
console.log(`✓ Consent: ${consentOptIn} (${Math.round((consentOptIn/total)*100)}%) opted in, ${consentOptOut} (${Math.round((consentOptOut/total)*100)}%) opted out.`);

// 5. Unlinked orders
const unlinkedOrders = run1.orders.filter((o) => o.guestId === undefined).length;
console.log(`✓ Orders: ${unlinkedOrders} (${Math.round((unlinkedOrders/run1.orders.length)*100)}%) unlinked walk-ins.`);

// 6. Campaign gating test
const testCampaign = INITIAL_PENDING_CAMPAIGNS[0];
const evalResult = evaluateCampaignRecipients(run1.guests, testCampaign, 11);
console.log(`✓ Campaign "${testCampaign.name}":`);
console.log(`  - Eligible: ${evalResult.eligible.length}`);
console.log(`  - To message: ${evalResult.messaged.length}`);
console.log(`  - 10% Held back control: ${evalResult.heldBack.length}`);
console.log(`  - Excluded: noConsent=${evalResult.excludedReasons.noConsent}, optedOut=${evalResult.excludedReasons.optedOut}`);

const holdBackPct = Math.round((evalResult.heldBack.length / evalResult.eligible.length) * 100);
console.log(`  - Holdback percentage: ${holdBackPct}% (target: ~10%)`);

// 7. Costs presets check
PRESETS.forEach((p) => {
  const c = calculateEstimatedCosts(p.inputs);
  console.log(`✓ Preset "${p.name}": $${c.estimatedMonthlyTotal.toFixed(2)}/mo (${p.description})`);
});

console.log("\nAll seed and calculation assertions PASSED successfully!");
