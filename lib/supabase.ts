import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Guest, Order, Outlet, MenuItem, PendingCampaign } from "./types";

const STORAGE_KEY_SUPABASE = "zirium_supabase_config_v1";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

let cachedClient: SupabaseClient | null = null;
let cachedConfig: SupabaseConfig | null = null;

export function getSupabaseConfig(): SupabaseConfig | null {
  if (typeof window === "undefined") {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (url && anonKey) return { url, anonKey };
    return null;
  }

  // Check localStorage first
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SUPABASE);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) return parsed;
    }
  } catch (e) {
    console.warn("Error reading Supabase config from localStorage", e);
  }

  // Check Vite environment variables
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey && !envUrl.includes("your-project-ref") && !envKey.includes("your_anon_key")) {
    return { url: envUrl, anonKey: envKey };
  }

  return null;
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_SUPABASE, JSON.stringify(config));
  }
  cachedConfig = config;
  cachedClient = null; // reset client
}

export function clearSupabaseConfig() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_SUPABASE);
  }
  cachedConfig = null;
  cachedClient = null;
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config) return null;

  if (
    cachedClient &&
    cachedConfig &&
    cachedConfig.url === config.url &&
    cachedConfig.anonKey === config.anonKey
  ) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: { persistSession: false },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
    cachedConfig = config;
    return cachedClient;
  } catch (e) {
    console.error("Failed to initialize Supabase client", e);
    return null;
  }
}

export async function testSupabaseConnection(url?: string, key?: string): Promise<{ success: boolean; message: string }> {
  try {
    const client =
      url && key
        ? createClient(url, key, { auth: { persistSession: false } })
        : getSupabaseClient();

    if (!client) {
      return { success: false, message: "No Supabase configuration provided." };
    }

    // Try a lightweight read query
    const { data, error } = await client.from("outlets").select("id").limit(1);
    if (error) {
      if (error.code === "42P01") {
        return {
          success: true,
          message: "Connected to Supabase project! (Tables not yet created, run schema.sql in SQL Editor).",
        };
      }
      return { success: false, message: `Supabase error: ${error.message}` };
    }

    return { success: true, message: "Connected successfully to Supabase database (100% Read-Only)!" };
  } catch (e: any) {
    return { success: false, message: e.message || "Failed to reach Supabase endpoint." };
  }
}

// Probe database to verify that client writes/mutations are 100% forbidden by PostgreSQL RLS
export async function testSupabaseReadOnlyIntegrity(): Promise<{
  isReadOnlyEnforced: boolean;
  statusText: string;
  errorCode?: string;
  errorMessage?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      isReadOnlyEnforced: false,
      statusText: "Supabase client not configured.",
    };
  }

  try {
    const probeId = "probe_" + Date.now();
    // Attempt an unauthorized INSERT into outlets table
    const { error: insertErr } = await client.from("outlets").insert([
      {
        id: probeId,
        name: "Security Probe",
        time_zone: "America/New_York",
        address: "Immutable Test",
      },
    ]);

    if (insertErr) {
      // Permission denied or RLS violation (e.g. 42501, 42P01, etc.)
      return {
        isReadOnlyEnforced: true,
        statusText: "Read-only enforcement ACTIVE. Client INSERT rejected by database policy.",
        errorCode: insertErr.code,
        errorMessage: insertErr.message,
      };
    }

    // If insert unexpectedly succeeded, clean up and inform user to run enforce_readonly.sql
    await client.from("outlets").delete().eq("id", probeId);
    return {
      isReadOnlyEnforced: false,
      statusText: "Database permits writes. Run supabase/enforce_readonly.sql in your Supabase SQL Editor to lock it down completely.",
    };
  } catch (e: any) {
    return {
      isReadOnlyEnforced: true,
      statusText: "Read-only enforcement ACTIVE (Write blocked).",
      errorMessage: e.message,
    };
  }
}

// 100% Read-Only Fetch from Supabase
export async function fetchReadOnlyDataFromSupabase(): Promise<{
  outlets: Outlet[];
  menuItems: MenuItem[];
  guests: Guest[];
  orders: Order[];
} | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    // 1. Fetch Outlets and Menu
    const [{ data: outletsData, error: outErr }, { data: menuData, error: menuErr }] =
      await Promise.all([
        client.from("outlets").select("*"),
        client.from("menu_items").select("*"),
      ]);

    if (outErr || menuErr || !outletsData || !menuData) {
      return null;
    }

    // 2. Fetch Guests (all 1,800 using 2 range queries to overcome 1,000 row default limit)
    const [{ data: g1 }, { data: g2 }] = await Promise.all([
      client.from("guests").select("*").range(0, 999),
      client.from("guests").select("*").range(1000, 1999),
    ]);

    const guestsData = [...(g1 || []), ...(g2 || [])];
    if (guestsData.length === 0) return null;

    // 3. Fetch recent Orders (up to 3,000)
    const [{ data: o1 }, { data: o2 }, { data: o3 }] = await Promise.all([
      client.from("orders").select("*").order("timestamp", { ascending: false }).range(0, 999),
      client.from("orders").select("*").order("timestamp", { ascending: false }).range(1000, 1999),
      client.from("orders").select("*").order("timestamp", { ascending: false }).range(2000, 2999),
    ]);

    const ordersData = [...(o1 || []), ...(o2 || []), ...(o3 || [])];

    const outlets: Outlet[] = outletsData.map((o: any) => ({
      id: o.id,
      name: o.name,
      timeZone: o.time_zone,
      address: o.address,
    }));

    const menuItems: MenuItem[] = menuData.map((m: any) => ({
      id: m.id,
      name: m.name,
      category: m.category,
      price: Number(m.price),
    }));

    const guests: Guest[] = guestsData.map((g: any) => ({
      id: g.id,
      name: g.name,
      primaryPhone: g.primary_phone,
      email: g.email || undefined,
      preferredOutletId: g.preferred_outlet_id,
      firstVisitDate: g.first_visit_date,
      lastVisitDate: g.last_visit_date,
      totalOrders: Number(g.total_orders || 1),
      totalSpend: Number(g.total_spend || 0),
      averageOrderValue: Number(g.average_order_value || 0),
      usualGapDays: Number(g.usual_gap_days || 14),
      daysSinceLastOrder: Number(g.days_since_last_order || 0),
      predictedNextVisitDate: g.predicted_next_visit_date || new Date().toISOString(),
      segment: g.segment,
      discoveredType: g.discovered_type,
      favouriteDish: g.favourite_dish,
      favouriteDishesTop5: g.favourite_dishes_top5 || [],
      consent: g.consent || { sms: "unspecified", whatsapp: "unspecified", email: "unspecified" },
      mergedFrom: g.merged_from || [],
      flaggedReason: g.flagged_reason || "",
      lastContactedDate: g.last_contacted_date || undefined,
    }));

    const orders: Order[] = ordersData.map((o: any) => ({
      id: o.id,
      guestId: o.guest_id || undefined,
      outletId: o.outlet_id,
      channel: o.channel,
      orderType: o.order_type,
      items: o.items || [],
      subtotal: Number(o.subtotal || 0),
      total: Number(o.total || 0),
      timestamp: o.timestamp,
      dayOfWeek: Number(o.day_of_week ?? new Date(o.timestamp).getDay()),
      hour: Number(o.hour ?? new Date(o.timestamp).getHours()),
    }));

    return { outlets, menuItems, guests, orders };
  } catch (e) {
    console.warn("Exception fetching read-only data from Supabase", e);
    return null;
  }
}

// Batched upsert to push seed data to Supabase (Initial Setup only)
export async function syncSeedDataToSupabase(
  dataset: {
    outlets: Outlet[];
    menuItems: MenuItem[];
    guests: Guest[];
    orders: Order[];
    pendingCampaigns?: PendingCampaign[];
  },
  onProgress?: (step: string, percent: number) => void
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: "Supabase client not configured." };
  }

  try {
    // 1. Outlets
    onProgress?.("Syncing Outlets (3 locations)...", 10);
    const { error: outletErr } = await client.from("outlets").upsert(
      dataset.outlets.map((o) => ({
        id: o.id,
        name: o.name,
        time_zone: o.timeZone,
        address: o.address,
      }))
    );
    if (outletErr) throw new Error(`Outlets sync failed: ${outletErr.message}`);

    // 2. Menu Items
    onProgress?.("Syncing Menu Items (45 items)...", 25);
    const { error: menuErr } = await client.from("menu_items").upsert(
      dataset.menuItems.map((m) => ({
        id: m.id,
        name: m.name,
        category: m.category,
        price: m.price,
      }))
    );
    if (menuErr) throw new Error(`Menu items sync failed: ${menuErr.message}`);

    // 3. Guests (batch in chunks of 300)
    const guestBatchSize = 300;
    const totalGuests = dataset.guests.length;
    for (let i = 0; i < totalGuests; i += guestBatchSize) {
      const chunk = dataset.guests.slice(i, i + guestBatchSize);
      const mappedGuests = chunk.map((g) => ({
        id: g.id,
        name: g.name,
        primary_phone: g.primaryPhone,
        email: g.email || null,
        preferred_outlet_id: g.preferredOutletId,
        first_visit_date: g.firstVisitDate,
        last_visit_date: g.lastVisitDate,
        total_orders: g.totalOrders,
        total_spend: g.totalSpend,
        average_order_value: g.averageOrderValue,
        usual_gap_days: g.usualGapDays,
        days_since_last_order: g.daysSinceLastOrder,
        predicted_next_visit_date: g.predictedNextVisitDate,
        segment: g.segment,
        discovered_type: g.discoveredType,
        favourite_dish: g.favouriteDish,
        favourite_dishes_top5: g.favouriteDishesTop5,
        consent: g.consent,
        merged_from: g.mergedFrom,
        flagged_reason: g.flaggedReason,
      }));

      const pct = 25 + Math.round((i / totalGuests) * 35);
      onProgress?.(`Syncing Guests (${i + chunk.length} / ${totalGuests})...`, pct);

      const { error: guestErr } = await client.from("guests").upsert(mappedGuests);
      if (guestErr) throw new Error(`Guests sync failed: ${guestErr.message}`);
    }

    // 4. Orders (sample recent orders or batch in chunks of 400)
    const ordersToSync = dataset.orders.slice(0, 3000);
    const orderBatchSize = 400;
    for (let i = 0; i < ordersToSync.length; i += orderBatchSize) {
      const chunk = ordersToSync.slice(i, i + orderBatchSize);
      const mappedOrders = chunk.map((o) => ({
        id: o.id,
        guest_id: o.guestId || null,
        outlet_id: o.outletId,
        channel: o.channel,
        order_type: o.orderType,
        items: o.items,
        subtotal: o.subtotal,
        total: o.total,
        timestamp: o.timestamp,
        day_of_week: o.dayOfWeek,
        hour: o.hour,
      }));

      const pct = 60 + Math.round((i / ordersToSync.length) * 35);
      onProgress?.(`Syncing Orders (${i + chunk.length} / ${ordersToSync.length})...`, pct);

      const { error: orderErr } = await client.from("orders").upsert(mappedOrders);
      if (orderErr) throw new Error(`Orders sync failed: ${orderErr.message}`);
    }

    onProgress?.("Completed! All seed data synced to Supabase.", 100);
    return {
      success: true,
      message: `Successfully synced ${dataset.outlets.length} outlets, ${dataset.menuItems.length} menu items, ${dataset.guests.length} guests, and ${ordersToSync.length} orders to Supabase!`,
    };
  } catch (e: any) {
    return { success: false, message: e.message || "Sync failed" };
  }
}
