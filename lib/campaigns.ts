import type { Guest, PendingCampaign } from "./types";

// Deterministic string hash for holdout assignment
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// 10% holdout assignment
export function isGuestHeldBack(guestId: string, campaignId: string): boolean {
  const hash = hashString(`${guestId}:${campaignId}`);
  return hash % 100 < 10; // Exactly 10%
}

// Eligibility evaluation
export interface EligibilityResult {
  eligible: Guest[];
  heldBack: Guest[];
  messaged: Guest[];
  excludedReasons: {
    noConsent: number;
    optedOut: number;
    frequencyCap: number; // contacted within 7 days
    quietHours: number;
  };
  totalEvaluated: number;
}

export function evaluateCampaignRecipients(
  allGuests: Guest[],
  campaign: PendingCampaign,
  currentHour: number = 11 // Default 11:00 AM (safe demo time)
): EligibilityResult {
  const channel = campaign.channel;
  const isQuietHours = currentHour >= 22 || currentHour < 8;

  let noConsent = 0;
  let optedOut = 0;
  let frequencyCap = 0;
  let quietHoursCount = 0;

  const eligibleGuests: Guest[] = [];

  allGuests.forEach((guest) => {
    // 1. Check if guest matches the audience target filter
    if (!campaign.targetFilter(guest)) {
      return;
    }

    // 2. Consent check
    const consent = guest.consent[channel];
    if (consent === "opted_out") {
      optedOut++;
      return;
    }
    if (consent !== "opted_in") {
      noConsent++;
      return;
    }

    // 3. Frequency cap (contacted within last 7 days)
    if (guest.lastContactedDate) {
      const contactedTime = new Date(guest.lastContactedDate).getTime();
      const now = new Date("2026-11-18T12:00:00Z").getTime();
      const diffDays = (now - contactedTime) / (1000 * 60 * 60 * 24);
      if (diffDays < 7) {
        frequencyCap++;
        return;
      }
    }

    // 4. Quiet hours check
    if (isQuietHours) {
      quietHoursCount++;
      return;
    }

    eligibleGuests.push(guest);
  });

  const messaged: Guest[] = [];
  const heldBack: Guest[] = [];

  eligibleGuests.forEach((g) => {
    if (isGuestHeldBack(g.id, campaign.id)) {
      heldBack.push(g);
    } else {
      messaged.push(g);
    }
  });

  return {
    eligible: eligibleGuests,
    heldBack,
    messaged,
    excludedReasons: {
      noConsent,
      optedOut,
      frequencyCap,
      quietHours: quietHoursCount,
    },
    totalEvaluated: allGuests.filter((g) => campaign.targetFilter(g)).length,
  };
}

// Initial Pending Campaigns
export const INITIAL_PENDING_CAMPAIGNS: PendingCampaign[] = [
  {
    id: "camp-welcome",
    name: "First to second visit welcome",
    description: "Encourage single-visit new guests to return before their rhythm fades.",
    channel: "sms",
    targetDescription: "New guests (1 visit in last 30 days) with SMS consent",
    targetFilter: (guest) => guest.segment === "New",
    goal: "Turn first-time diners into regulars within their first month.",
    estimatedCostPerMessage: 0.0125,
    suggestedWording: [
      {
        title: "Friendly Welcome & Dessert Treat",
        body: ({ firstName, favouriteDish }) =>
          `Hi ${firstName}! Thank you for dining with us at Spice Route Kitchen. We loved serving you! Show this text on your next visit for a complimentary dessert alongside your favourite ${favouriteDish}. Reply STOP to unsubscribe.`,
      },
      {
        title: "Chef's Greeting",
        body: ({ firstName, favouriteDish }) =>
          `Hello ${firstName}, Chef Tariq here from Spice Route Kitchen. Hope you enjoyed the ${favouriteDish}! Come back this week and enjoy 15% off your table. Show this SMS at counter. Reply STOP to opt out.`,
      },
      {
        title: "Simple Rhythm Prompt",
        body: ({ firstName, favouriteDish }) =>
          `Spice Route Kitchen: We loved having you, ${firstName}! Planning lunch or dinner this week? Pair your ${favouriteDish} with our fresh Garlic Butter Naan on us. Reply STOP to opt out.`,
      },
    ],
    status: "pending",
  },
  {
    id: "camp-winback",
    name: "Win-back overdue diners",
    description: "Re-engage guests whose gap since last order is >1.5x their normal cycle.",
    channel: "whatsapp",
    targetDescription: "Late & Lapsed diners with WhatsApp consent",
    targetFilter: (guest) => guest.segment === "Late" || guest.segment === "Lapsed",
    goal: "Recover at-risk guests before they lapse permanently into churn.",
    estimatedCostPerMessage: 0.0685,
    suggestedWording: [
      {
        title: "We miss you + Favourite Dish",
        body: ({ firstName, favouriteDish }) =>
          `Hi ${firstName} 👋 It's been a little while since your last visit to Spice Route Kitchen! We've got your favourite ${favouriteDish} simmering and ready. Here is an exclusive \$10 voucher for your next order this weekend. Click to view: spice.route/offer?code=WELCOMEBACK`,
      },
      {
        title: "Weekend Table Reservation",
        body: ({ firstName, favouriteDish }) =>
          `Hey ${firstName}, craving that authentic spice? We noticed you haven't dropped by recently. Book a table at Spice Route Kitchen this Friday and receive complimentary appetizers with your ${favouriteDish}!`,
      },
      {
        title: "VIP Diner Perk",
        body: ({ firstName, favouriteDish }) =>
          `Hello ${firstName}! As one of our valued guests, we'd love to welcome you back. Enjoy free delivery on your next online order or a VIP table reservation. Your ${favouriteDish} is waiting!`,
      },
    ],
    status: "pending",
  },
  {
    id: "camp-favourite-dish",
    name: "Favourite dish weekend reminder",
    description: "Reach regular guests approaching their usual rhythm before the weekend rush.",
    channel: "email",
    targetDescription: "Regular diners predicted to visit in the next 5 days",
    targetFilter: (guest) => guest.segment === "Regular" && guest.daysSinceLastOrder >= guest.usualGapDays * 0.8,
    goal: "Lock in regular weekend dinner reservations.",
    estimatedCostPerMessage: 0.0001,
    suggestedWording: [
      {
        title: "Weekend Gastronomy Feature",
        body: ({ firstName, favouriteDish }) =>
          `Dear ${firstName},\n\nYour usual table at Spice Route Kitchen is calling! Our master chefs are preparing our signature ${favouriteDish} with fresh aromatic spices this weekend.\n\nReserve your table now to enjoy complimentary Karak Masala Chai after dinner.\n\nWarm regards,\nThe Spice Route Kitchen Family`,
      },
      {
        title: "Fresh Weekend Specials",
        body: ({ firstName, favouriteDish }) =>
          `Hello ${firstName},\n\nLooking for the perfect weekend comfort meal? Treat yourself and your loved ones to our authentic ${favouriteDish}. Order online for fast priority delivery or join us for a warm dining experience.\n\nSee our seasonal weekend specials at spiceroutekitchen.com`,
      },
      {
        title: "Exclusive Chef's Pairing",
        body: ({ firstName, favouriteDish }) =>
          `Hi ${firstName},\n\nElevate your dinner this week: Pair your favourite ${favouriteDish} with our sizzling Charcoal Lamb Chops. Use code SPICEWEEKEND for complimentary drinks on orders over \$40.`,
      },
    ],
    status: "pending",
  },
];
