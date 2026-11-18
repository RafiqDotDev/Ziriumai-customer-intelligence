import type { Order, Guest, MenuItem, OutletId, Channel, OrderType } from "./types";
import { MENU_ITEMS, OUTLETS } from "./seed";

let liveOrderCounter = 1000;

export function generateLiveIncomingOrder(
  guests: Guest[],
  menuItems: MenuItem[] = MENU_ITEMS
): { newOrder: Order; updatedGuest?: Guest; notificationMessage: string } {
  liveOrderCounter++;
  const orderId = `ord_live_${Date.now()}_${liveOrderCounter}`;
  const now = new Date();

  // 75% chance linked to an existing guest, 25% anonymous walk-in
  const isLinked = Math.random() < 0.75 && guests.length > 0;
  const guest = isLinked
    ? guests[Math.floor(Math.random() * Math.min(200, guests.length))]
    : undefined;

  // Channel: counter 50%, online 35%, phone 15%
  const chanRoll = Math.random();
  const channel: Channel =
    chanRoll < 0.5 ? "counter" : chanRoll < 0.85 ? "online" : "phone";

  let orderType: OrderType = "dine-in";
  if (channel === "counter") {
    orderType = Math.random() < 0.8 ? "dine-in" : "pickup";
  } else if (channel === "online") {
    orderType = Math.random() < 0.75 ? "delivery" : "pickup";
  } else {
    orderType = Math.random() < 0.6 ? "pickup" : "delivery";
  }

  const outletId: OutletId = guest
    ? guest.preferredOutletId
    : OUTLETS[Math.floor(Math.random() * OUTLETS.length)].id;

  // Items: 50% chance favorite dish included if guest exists
  const items = [];
  if (guest && Math.random() < 0.6) {
    const favItem =
      menuItems.find((m) => m.name === guest.favouriteDish) || menuItems[6];
    items.push({
      menuItemId: favItem.id,
      name: favItem.name,
      quantity: 1,
      price: favItem.price,
    });
  }

  // Add 1 to 2 items
  const extraCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < extraCount; i++) {
    const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
    if (!items.some((item) => item.menuItemId === randomItem.id)) {
      items.push({
        menuItemId: randomItem.id,
        name: randomItem.name,
        quantity: Math.floor(Math.random() * 2) + 1,
        price: randomItem.price,
      });
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.round(subtotal * 1.08 * 100) / 100;

  const newOrder: Order = {
    id: orderId,
    guestId: guest?.id,
    outletId,
    channel,
    orderType,
    items,
    subtotal,
    total,
    timestamp: now.toISOString(),
    dayOfWeek: now.getUTCDay(),
    hour: now.getUTCHours(),
  };

  // If linked, update guest's metrics
  let updatedGuest: Guest | undefined;
  if (guest) {
    const newTotalOrders = guest.totalOrders + 1;
    const newTotalSpend = Math.round((guest.totalSpend + total) * 100) / 100;
    const newAvgOrderValue = Math.round((newTotalSpend / newTotalOrders) * 100) / 100;

    updatedGuest = {
      ...guest,
      totalOrders: newTotalOrders,
      totalSpend: newTotalSpend,
      averageOrderValue: newAvgOrderValue,
      lastVisitDate: now.toISOString(),
      daysSinceLastOrder: 0, // Just visited right now!
      segment: guest.segment === "New" ? "Regular" : guest.segment === "Late" || guest.segment === "Lapsed" ? "Regular" : guest.segment,
      flaggedReason: `Just ordered live (${channel} ${orderType}). Rhythm refreshed.`,
    };
  }

  const guestLabel = guest ? guest.name : "Walk-in Guest";
  const notificationMessage = `Live Order: ${guestLabel} ordered ${items[0]?.name || "Meal"} ($${total.toFixed(2)}) via ${channel.toUpperCase()}`;

  return { newOrder, updatedGuest, notificationMessage };
}
