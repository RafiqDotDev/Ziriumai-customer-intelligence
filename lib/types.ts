export type OutletId = "downtown" | "university-rd" | "airport-mall";

export interface Outlet {
  id: OutletId;
  name: string;
  timeZone: string;
  address: string;
}

export type Channel = "counter" | "online" | "phone";
export type OrderType = "dine-in" | "pickup" | "delivery";

export type Segment = "New" | "Regular" | "Late" | "Lapsed";

export type DiscoveredGuestType =
  | "Weekday lunch regulars"
  | "Weekend family diners"
  | "Late-night delivery"
  | "Online-only orderers";

export type ConsentStatus = "opted_in" | "opted_out" | "unspecified";

export interface ChannelConsent {
  sms: ConsentStatus;
  whatsapp: ConsentStatus;
  email: ConsentStatus;
  recordedAt?: string;
  source?: string;
}

export interface MergedIdentity {
  channel: Channel;
  originalIdentifier: string; // e.g., "0300-1234567" or "dine-in counter receipt #402"
  capturedAt: string;
  outletId: OutletId;
}

export interface MenuItem {
  id: string;
  name: string;
  category:
    | "Starters"
    | "Mains"
    | "Biryani/Rice"
    | "BBQ"
    | "Breads"
    | "Desserts"
    | "Drinks";
  price: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  guestId?: string; // undefined if unlinked order (~25%)
  outletId: OutletId;
  channel: Channel;
  orderType: OrderType;
  items: OrderItem[];
  subtotal: number;
  total: number;
  timestamp: string; // ISO date string
  dayOfWeek: number; // 0-6 (0 = Sun, 6 = Sat)
  hour: number; // 0-23
}

export interface Guest {
  id: string;
  name: string;
  primaryPhone: string;
  email?: string;
  preferredOutletId: OutletId;
  firstVisitDate: string;
  lastVisitDate: string;
  totalOrders: number;
  totalSpend: number;
  averageOrderValue: number;
  usualGapDays: number; // median rhythm
  daysSinceLastOrder: number;
  predictedNextVisitDate: string;
  segment: Segment;
  discoveredType: DiscoveredGuestType;
  favouriteDish: string;
  favouriteDishesTop5: { name: string; count: number; percentage: number }[];
  consent: ChannelConsent;
  mergedFrom: MergedIdentity[];
  flaggedReason: string;
  lastContactedDate?: string;
}

export interface HistoricalCampaign {
  id: string;
  name: string;
  channel: "sms" | "whatsapp" | "email";
  sentDate: string;
  messagedCount: number;
  heldBackCount: number;
  messagedOrderRate: number; // e.g. 0.214 (21.4%)
  heldBackOrderRate: number; // e.g. 0.125 (12.5%)
  averageOrderValue: number;
  costPerMessage: number;
  targetSegment: string;
}

export interface PendingCampaign {
  id: string;
  name: string;
  description: string;
  channel: "sms" | "whatsapp" | "email";
  targetDescription: string;
  targetFilter: (guest: Guest) => boolean;
  goal: string;
  estimatedCostPerMessage: number;
  suggestedWording: {
    title: string;
    body: (guest: { firstName: string; favouriteDish: string }) => string;
  }[];
  status: "pending" | "sending" | "sent" | "rejected";
  approvedAt?: string;
  sentCount?: number;
  heldBackCount?: number;
}
