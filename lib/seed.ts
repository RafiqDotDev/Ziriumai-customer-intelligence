import type {
  Outlet,
  MenuItem,
  Order,
  Guest,
  HistoricalCampaign,
  MergedIdentity,
  Channel,
  OrderType,
  ConsentStatus,
  OutletId,
} from "./types";
import { computeGuestMetricsAndPredictions } from "./predict";

// --- Seeded PRNG: Mulberry32 ---
export function createPRNG(seed: number = 42) {
  let s = seed >>> 0;
  return function () {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fixed Outlets
export const OUTLETS: Outlet[] = [
  {
    id: "downtown",
    name: "Downtown Flagship",
    timeZone: "America/New_York (EST)",
    address: "142 Grand Avenue, Downtown",
  },
  {
    id: "university-rd",
    name: "University Road",
    timeZone: "America/New_York (EST)",
    address: "88 College Boulevard",
  },
  {
    id: "airport-mall",
    name: "Airport Mall Plaza",
    timeZone: "America/New_York (EST)",
    address: "Terminal Concourse 2, Airport Mall",
  },
];

// 45 Menu Items across 7 Categories
export const MENU_ITEMS: MenuItem[] = [
  // Starters (6)
  { id: "m1", name: "Crispy Samosa Chaat", category: "Starters", price: 8.5 },
  { id: "m2", name: "Paneer Tikka Bites", category: "Starters", price: 11.0 },
  { id: "m3", name: "Lahori Fried Fish", category: "Starters", price: 14.5 },
  { id: "m4", name: "Garlic Butter Wings", category: "Starters", price: 12.0 },
  { id: "m5", name: "Dahi Puri Shots", category: "Starters", price: 9.0 },
  { id: "m6", name: "Vegetable Spring Rolls", category: "Starters", price: 8.0 },

  // Mains (8)
  { id: "m7", name: "Butter Chicken Supreme", category: "Mains", price: 18.5 },
  { id: "m8", name: "Mutton Rogan Josh", category: "Mains", price: 21.0 },
  { id: "m9", name: "Chicken Tikka Masala", category: "Mains", price: 17.5 },
  { id: "m10", name: "Dal Makhani Slow-Cooked", category: "Mains", price: 14.0 },
  { id: "m11", name: "Palak Paneer", category: "Mains", price: 15.5 },
  { id: "m12", name: "Chicken Karahi Special", category: "Mains", price: 19.5 },
  { id: "m13", name: "Beef Nihari with Ginger", category: "Mains", price: 22.0 },
  { id: "m14", name: "Yellow Dal Tadka", category: "Mains", price: 13.0 },

  // Biryani/Rice (6)
  { id: "m15", name: "Special Dum Biryani Chicken", category: "Biryani/Rice", price: 16.5 },
  { id: "m16", name: "Hyderabadi Goat Biryani", category: "Biryani/Rice", price: 20.5 },
  { id: "m17", name: "Royal Beef Biryani", category: "Biryani/Rice", price: 19.0 },
  { id: "m18", name: "Zaffron Vegetable Pulao", category: "Biryani/Rice", price: 13.5 },
  { id: "m19", name: "Egg Dum Biryani", category: "Biryani/Rice", price: 14.0 },
  { id: "m20", name: "Jeera Steamed Basmati", category: "Biryani/Rice", price: 6.0 },

  // BBQ (7)
  { id: "m21", name: "Seekh Kebab Skewers", category: "BBQ", price: 16.0 },
  { id: "m22", name: "Chicken Malai Boti", category: "BBQ", price: 17.0 },
  { id: "m23", name: "Tandoori Chicken Half", category: "BBQ", price: 15.5 },
  { id: "m24", name: "Bihari Beef Boti", category: "BBQ", price: 18.5 },
  { id: "m25", name: "Charcoal Grilled Lamb Chops", category: "BBQ", price: 26.0 },
  { id: "m26", name: "Reshmi Kebab Melt", category: "BBQ", price: 16.5 },
  { id: "m27", name: "Smoky Tandoori Prawns", category: "BBQ", price: 23.0 },

  // Breads (6)
  { id: "m28", name: "Garlic Butter Naan", category: "Breads", price: 4.5 },
  { id: "m29", name: "Cheese & Herb Stuffed Naan", category: "Breads", price: 6.5 },
  { id: "m30", name: "Tandoori Roti", category: "Breads", price: 3.0 },
  { id: "m31", name: "Peshawari Sweet Naan", category: "Breads", price: 6.0 },
  { id: "m32", name: "Crispy Laccha Paratha", category: "Breads", price: 4.5 },
  { id: "m33", name: "Rogani Sesame Naan", category: "Breads", price: 5.0 },

  // Desserts (6)
  { id: "m34", name: "Warm Gulab Jamun (2 pcs)", category: "Desserts", price: 6.5 },
  { id: "m35", name: "Ras Malai Saffron Milk", category: "Desserts", price: 7.5 },
  { id: "m36", name: "Matka Kulfi on a Stick", category: "Desserts", price: 5.5 },
  { id: "m37", name: "Gajar Ka Halwa", category: "Desserts", price: 7.0 },
  { id: "m38", name: "Shahi Tukray Slices", category: "Desserts", price: 8.0 },
  { id: "m39", name: "Kashmiri Chai Kheer", category: "Desserts", price: 6.5 },

  // Drinks (6)
  { id: "m40", name: "Mango Lassi Frappe", category: "Drinks", price: 5.5 },
  { id: "m41", name: "Mint Margarita Cooler", category: "Drinks", price: 6.0 },
  { id: "m42", name: "Karak Masala Chai", category: "Drinks", price: 4.0 },
  { id: "m43", name: "Sweet Salted Lassi", category: "Drinks", price: 5.0 },
  { id: "m44", name: "Fresh Lime Soda", category: "Drinks", price: 4.5 },
  { id: "m45", name: "Rooh Afza Milk Chill", category: "Drinks", price: 5.0 },
];

const FIRST_NAMES = [
  "Tariq", "Ayesha", "Zayn", "Fatima", "Bilal", "Sara", "Hamza", "Mariam",
  "Usman", "Hina", "Ali", "Zahra", "Farhan", "Sana", "Imran", "Nadia",
  "Omer", "Khadija", "Salman", "Amna", "Marcus", "Elena", "Liam", "Sophia",
  "Mateo", "Chloe", "David", "Priya", "Lucas", "Maya", "Noah", "Emma"
];

const LAST_NAMES = [
  "Khan", "Malik", "Sheikh", "Ahmed", "Chaudhry", "Rehman", "Mirza", "Qureshi",
  "Baig", "Siddiqui", "Vance", "Chen", "Patel", "Miller", "Rossi", "Garcia"
];

// 3 Pre-built Historical Campaigns
export const HISTORICAL_CAMPAIGNS: HistoricalCampaign[] = [
  {
    id: "hist-1",
    name: "First to second visit",
    channel: "sms",
    sentDate: "2026-10-12",
    messagedCount: 220,
    heldBackCount: 24,
    messagedOrderRate: 0.214, // 21.4%
    heldBackOrderRate: 0.125, // 12.5%
    averageOrderValue: 42.5,
    costPerMessage: 0.0125,
    targetSegment: "New Guests (<30 days)",
  },
  {
    id: "hist-2",
    name: "Win-back lapsed diners",
    channel: "whatsapp",
    sentDate: "2026-10-24",
    messagedCount: 310,
    heldBackCount: 34,
    messagedOrderRate: 0.187, // 18.7%
    heldBackOrderRate: 0.091, // 9.1%
    averageOrderValue: 56.0,
    costPerMessage: 0.0685,
    targetSegment: "Late & Lapsed Diners",
  },
  {
    id: "hist-3",
    name: "Favourite dish reminder",
    channel: "email",
    sentDate: "2026-11-02",
    messagedCount: 640,
    heldBackCount: 70,
    messagedOrderRate: 0.142, // 14.2%
    heldBackOrderRate: 0.100, // 10.0%
    averageOrderValue: 48.0,
    costPerMessage: 0.0001,
    targetSegment: "Regulars Approaching Cycle",
  },
];

// Global cached generated data
let cachedDataset: {
  guests: Guest[];
  orders: Order[];
  outlets: Outlet[];
  menuItems: MenuItem[];
  historicalCampaigns: HistoricalCampaign[];
} | null = null;

export function getSeededData(forceFresh: boolean = false) {
  if (cachedDataset && !forceFresh) {
    return cachedDataset;
  }

  const rand = createPRNG(42);

  // Helper random functions
  function randInt(min: number, max: number) {
    return Math.floor(rand() * (max - min + 1)) + min;
  }
  function randChoice<T>(arr: T[]): T {
    return arr[Math.floor(rand() * arr.length)];
  }

  const outlets = OUTLETS;
  const menuItems = MENU_ITEMS;
  const historicalCampaigns = HISTORICAL_CAMPAIGNS;

  const totalGuestsCount = 1800;
  const referenceTime = new Date("2026-11-18T12:00:00Z").getTime();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;

  // 1. Generate Raw Guests
  interface TempGuest {
    id: string;
    name: string;
    phoneFormatted: string;
    phoneVariations: string[];
    email: string;
    preferredOutletId: OutletId;
    baseRhythmDays: number;
    favDishIndex: number;
    favDishWeight: number;
    consent: {
      sms: ConsentStatus;
      whatsapp: ConsentStatus;
      email: ConsentStatus;
      recordedAt: string;
      source: string;
    };
    mergedFrom: MergedIdentity[];
    targetSegmentCategory: "New" | "Regular" | "Late" | "Lapsed";
  }

  const tempGuests: TempGuest[] = [];

  for (let i = 0; i < totalGuestsCount; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[Math.floor(i / FIRST_NAMES.length) % LAST_NAMES.length];
    const name = `${firstName} ${lastName}`;
    const id = `gst_${(i + 1).toString().padStart(4, "0")}`;

    // Phone numbers: realistic fake formats
    // e.g. 0300-1234567 or +92 300 0001234
    const prefix = 300 + (i % 50);
    const suffix = (100000 + i * 17) % 900000;
    const basePhone = `+92 ${prefix} 0${suffix}`;
    const localPhone = `0${prefix}-${suffix}`;

    // Preferred outlet
    const outletRoll = rand();
    const preferredOutletId: OutletId =
      outletRoll < 0.45 ? "downtown" : outletRoll < 0.75 ? "university-rd" : "airport-mall";

    // Guest rhythm: 7 to 45 days
    const baseRhythmDays = randInt(7, 45);

    // Favourite dish
    const favDishIndex = randInt(0, menuItems.length - 1);
    const favDishWeight = 0.4 + rand() * 0.2; // 40% to 60%

    // Target distribution: New 12%, Regular 48%, Late 18%, Lapsed 22%
    const segRoll = rand();
    let targetSegmentCategory: "New" | "Regular" | "Late" | "Lapsed";
    if (segRoll < 0.12) {
      targetSegmentCategory = "New";
    } else if (segRoll < 0.60) {
      targetSegmentCategory = "Regular";
    } else if (segRoll < 0.78) {
      targetSegmentCategory = "Late";
    } else {
      targetSegmentCategory = "Lapsed";
    }

    // Consent: ~62% marketing consent, ~8% opted out, 30% unspecified
    const consentRoll = rand();
    let smsConsent: ConsentStatus = "unspecified";
    let waConsent: ConsentStatus = "unspecified";
    let emailConsent: ConsentStatus = "unspecified";
    let consentSource = "checkout form";

    if (consentRoll < 0.62) {
      smsConsent = "opted_in";
      waConsent = rand() > 0.3 ? "opted_in" : "unspecified";
      emailConsent = rand() > 0.4 ? "opted_in" : "unspecified";
      consentSource = randChoice(["checkout form", "table QR code", "wifi portal", "online loyalty"]);
    } else if (consentRoll < 0.70) {
      smsConsent = "opted_out";
      waConsent = "opted_out";
      emailConsent = "opted_out";
      consentSource = "STOP reply via SMS";
    }

    // Merged identities showcase: ~50 guests have multi-channel merges
    const mergedFrom: MergedIdentity[] = [];
    const isMergedGuest = i < 55; // Ensure at least 40+ guests

    if (isMergedGuest) {
      mergedFrom.push({
        channel: "counter",
        originalIdentifier: localPhone,
        capturedAt: "2026-03-15",
        outletId: preferredOutletId,
      });
      mergedFrom.push({
        channel: "online",
        originalIdentifier: basePhone,
        capturedAt: "2026-06-20",
        outletId: preferredOutletId,
      });
      if (i % 2 === 0) {
        mergedFrom.push({
          channel: "phone",
          originalIdentifier: `0${prefix}${suffix}`,
          capturedAt: "2026-08-04",
          outletId: preferredOutletId,
        });
      }
    }

    tempGuests.push({
      id,
      name,
      phoneFormatted: basePhone,
      phoneVariations: [basePhone, localPhone],
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.org`,
      preferredOutletId,
      baseRhythmDays,
      favDishIndex,
      favDishWeight,
      consent: {
        sms: smsConsent,
        whatsapp: waConsent,
        email: emailConsent,
        recordedAt: "2026-04-10",
        source: consentSource,
      },
      mergedFrom,
      targetSegmentCategory,
    });
  }

  // 2. Generate Orders for each guest
  const allOrders: Order[] = [];
  const guestOrdersMap = new Map<string, Order[]>();

  tempGuests.forEach((guest) => {
    guestOrdersMap.set(guest.id, []);

    let numOrders = 1;
    let daysSinceLast = 10;

    if (guest.targetSegmentCategory === "New") {
      numOrders = 1;
      daysSinceLast = randInt(2, 28);
    } else if (guest.targetSegmentCategory === "Regular") {
      numOrders = randInt(6, 26);
      daysSinceLast = Math.max(1, Math.round(guest.baseRhythmDays * (0.2 + rand() * 0.9)));
    } else if (guest.targetSegmentCategory === "Late") {
      numOrders = randInt(4, 20);
      daysSinceLast = Math.round(guest.baseRhythmDays * (1.6 + rand() * 0.9)); // > 1.5x
    } else {
      // Lapsed
      numOrders = randInt(2, 16);
      daysSinceLast = Math.max(92, Math.round(guest.baseRhythmDays * (3.1 + rand() * 1.5))); // > 3x or > 90d
    }

    const lastOrderTime = referenceTime - daysSinceLast * 86400000;
    const timestamps: number[] = [lastOrderTime];

    // Build historical timestamps backwards
    let currentT = lastOrderTime;
    for (let k = 1; k < numOrders; k++) {
      const gap = Math.max(3, Math.round(guest.baseRhythmDays * (0.7 + rand() * 0.6)));
      currentT -= gap * 86400000;
      if (currentT < referenceTime - oneYearMs) break;
      timestamps.unshift(currentT);
    }

    // Create Order records
    timestamps.forEach((orderTs, idx) => {
      const d = new Date(orderTs);
      const dayOfWeek = d.getUTCDay();

      // Realistic hour distribution: lunch (12-14) or dinner (19-22)
      const isLunch = rand() < 0.45;
      const hour = isLunch ? randInt(12, 14) : randInt(18, 22);
      d.setUTCHours(hour, randInt(0, 59));

      // Channel: Counter 50%, Online 35%, Phone 15%
      const chanRoll = rand();
      const channel: Channel =
        chanRoll < 0.5 ? "counter" : chanRoll < 0.85 ? "online" : "phone";

      let orderType: OrderType = "dine-in";
      if (channel === "counter") {
        orderType = rand() < 0.8 ? "dine-in" : "pickup";
      } else if (channel === "online") {
        orderType = rand() < 0.75 ? "delivery" : "pickup";
      } else {
        orderType = rand() < 0.6 ? "pickup" : "delivery";
      }

      // Outlet: 85% preferred outlet, 15% other outlet
      const outletId: OutletId =
        rand() < 0.85 ? guest.preferredOutletId : randChoice(outlets).id;

      // Select items: 40-60% chance favorite dish is included
      const items = [];
      const favDish = menuItems[guest.favDishIndex];
      if (rand() < guest.favDishWeight) {
        items.push({
          menuItemId: favDish.id,
          name: favDish.name,
          quantity: randInt(1, 2),
          price: favDish.price,
        });
      }

      // Add 1 to 3 complementary items
      const extraCount = randInt(1, 3);
      for (let e = 0; e < extraCount; e++) {
        const item = randChoice(menuItems);
        if (!items.some((i) => i.menuItemId === item.id)) {
          items.push({
            menuItemId: item.id,
            name: item.name,
            quantity: randInt(1, 2),
            price: item.price,
          });
        }
      }

      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const total = Math.round(subtotal * 1.08 * 100) / 100; // with tax

      const order: Order = {
        id: `ord_${guest.id}_${idx + 1}`,
        guestId: guest.id,
        outletId,
        channel,
        orderType,
        items,
        subtotal,
        total,
        timestamp: d.toISOString(),
        dayOfWeek,
        hour,
      };

      allOrders.push(order);
      guestOrdersMap.get(guest.id)!.push(order);
    });
  });

  // 3. Add unlinked orders (~25% of all orders have no guest link, representing anonymous counter walk-ins)
  const linkedOrdersCount = allOrders.length;
  const unlinkedTargetCount = Math.round(linkedOrdersCount * 0.33); // approx 25% of total (1/(1+3))

  for (let u = 0; u < unlinkedTargetCount; u++) {
    const randomTimeOffset = rand() * oneYearMs;
    const d = new Date(referenceTime - randomTimeOffset);
    const hour = rand() < 0.5 ? randInt(12, 14) : randInt(18, 22);
    d.setUTCHours(hour, randInt(0, 59));

    const item = randChoice(menuItems);
    const items = [
      {
        menuItemId: item.id,
        name: item.name,
        quantity: 1,
        price: item.price,
      },
    ];

    allOrders.push({
      id: `ord_anon_${u + 1}`,
      guestId: undefined, // unlinked!
      outletId: randChoice(outlets).id,
      channel: "counter",
      orderType: rand() < 0.7 ? "dine-in" : "pickup",
      items,
      subtotal: item.price,
      total: Math.round(item.price * 1.08 * 100) / 100,
      timestamp: d.toISOString(),
      dayOfWeek: d.getUTCDay(),
      hour,
    });
  }

  // 4. Compute full Guest objects from orders
  const finalGuests: Guest[] = tempGuests.map((g) => {
    const orders = guestOrdersMap.get(g.id) || [];
    const metrics = computeGuestMetricsAndPredictions(orders, "2026-11-18T12:00:00Z");

    const totalOrders = orders.length;
    const totalSpend = orders.reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue =
      totalOrders > 0 ? Math.round((totalSpend / totalOrders) * 100) / 100 : 0;

    const sortedOrders = [...orders].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const firstVisitDate = sortedOrders[0]?.timestamp || "2026-01-01T12:00:00Z";
    const lastVisitDate = sortedOrders[sortedOrders.length - 1]?.timestamp || "2026-11-01T12:00:00Z";

    return {
      id: g.id,
      name: g.name,
      primaryPhone: g.phoneFormatted,
      email: g.email,
      preferredOutletId: g.preferredOutletId,
      firstVisitDate,
      lastVisitDate,
      totalOrders,
      totalSpend: Math.round(totalSpend * 100) / 100,
      averageOrderValue,
      usualGapDays: metrics.usualGapDays,
      daysSinceLastOrder: metrics.daysSinceLastOrder,
      predictedNextVisitDate: metrics.predictedNextVisitDate,
      segment: metrics.segment,
      discoveredType: metrics.discoveredType,
      favouriteDish: metrics.favouriteDish,
      favouriteDishesTop5: metrics.favouriteDishesTop5,
      consent: g.consent,
      mergedFrom: g.mergedFrom,
      flaggedReason: metrics.flaggedReason,
    };
  });

  cachedDataset = {
    guests: finalGuests,
    orders: allOrders,
    outlets,
    menuItems,
    historicalCampaigns,
  };

  return cachedDataset;
}
