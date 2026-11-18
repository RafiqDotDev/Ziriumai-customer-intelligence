import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  Guest,
  Order,
  Outlet,
  MenuItem,
  HistoricalCampaign,
  PendingCampaign,
  OutletId,
} from "./types";
import { getSeededData } from "./seed";
import { INITIAL_PENDING_CAMPAIGNS } from "./campaigns";
import { generateLiveIncomingOrder } from "./realtime-stream";
import {
  getSupabaseClient,
  getSupabaseConfig,
  testSupabaseConnection,
  syncSeedDataToSupabase,
  fetchReadOnlyDataFromSupabase,
  testSupabaseReadOnlyIntegrity,
} from "./supabase";

interface DemoContextType {
  selectedOutletId: string; // "all" | OutletId
  setSelectedOutletId: (id: string) => void;
  currencySymbol: string;
  stopAllSending: boolean;
  toggleStopAllSending: () => void;
  guests: Guest[];
  orders: Order[];
  outlets: Outlet[];
  menuItems: MenuItem[];
  historicalCampaigns: HistoricalCampaign[];
  pendingCampaigns: PendingCampaign[];
  nightlyUpdateState: {
    isRunning: boolean;
    step: number; // 0: idle, 1: Read, 2: Match, 3: Predict, 4: Suggest, 5: Done
    stepName: string;
    progress: number;
    log: string;
    newSuggestionAdded: boolean;
  };
  presenterMode: boolean;
  togglePresenterMode: () => void;
  tourStep: number | null;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  skipTour: () => void;
  simulateStopReply: (guestId: string) => void;
  approveCampaign: (campaignId: string) => Promise<void>;
  rejectCampaign: (campaignId: string) => void;
  runNightlyUpdate: () => Promise<void>;
  resetDemo: () => void;
  freshSuggestionGuest?: Guest;

  // Realtime Live Stream & Supabase
  isLiveStreaming: boolean;
  toggleLiveStream: () => void;
  recentLiveOrders: Order[];
  latestLiveAlert: string | null;
  clearLatestLiveAlert: () => void;
  supabaseStatus: "unconfigured" | "connecting" | "connected" | "error";
  isLoadedFromSupabase: boolean;
  isReadOnlyEnforced: boolean;
  checkSupabaseConnection: () => Promise<boolean>;
  checkReadOnlyIntegrity: () => Promise<boolean>;
  syncDataToSupabase: (
    onProgress?: (step: string, pct: number) => void
  ) => Promise<{ success: boolean; message: string }>;
}

const DemoContext = createContext<DemoContextType | null>(null);

const STORAGE_KEY_STATE = "zirium_demo_state_v1";

export function DemoProvider({ children }: { children: React.ReactNode }) {
  // Initial seeded load
  const seeded = getSeededData();

  const [selectedOutletId, setSelectedOutletId] = useState<string>("all");
  const [currencySymbol] = useState<string>("$");
  const [stopAllSending, setStopAllSending] = useState<boolean>(false);
  const [guests, setGuests] = useState<Guest[]>(seeded.guests);
  const [orders, setOrders] = useState<Order[]>(seeded.orders);
  const [outlets] = useState<Outlet[]>(seeded.outlets);
  const [menuItems] = useState<MenuItem[]>(seeded.menuItems);
  const [historicalCampaigns, setHistoricalCampaigns] = useState<HistoricalCampaign[]>(
    seeded.historicalCampaigns
  );
  const [pendingCampaigns, setPendingCampaigns] = useState<PendingCampaign[]>(
    INITIAL_PENDING_CAMPAIGNS
  );

  const [nightlyUpdateState, setNightlyUpdateState] = useState({
    isRunning: false,
    step: 0,
    stepName: "",
    progress: 0,
    log: "",
    newSuggestionAdded: false,
  });

  const [presenterMode, setPresenterMode] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number | null>(null);

  // Realtime Stream State
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(false);
  const [recentLiveOrders, setRecentLiveOrders] = useState<Order[]>([]);
  const [latestLiveAlert, setLatestLiveAlert] = useState<string | null>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<
    "unconfigured" | "connecting" | "connected" | "error"
  >("unconfigured");
  const [isLoadedFromSupabase, setIsLoadedFromSupabase] = useState<boolean>(false);
  const [isReadOnlyEnforced, setIsReadOnlyEnforced] = useState<boolean>(true);

  // Check Supabase connection and read-only data on load
  const checkSupabaseConnection = async (): Promise<boolean> => {
    const config = getSupabaseConfig();
    if (!config) {
      setSupabaseStatus("unconfigured");
      return false;
    }
    setSupabaseStatus("connecting");
    const test = await testSupabaseConnection();
    if (test.success) {
      setSupabaseStatus("connected");

      // Load 100% read-only data from Supabase
      try {
        const remoteData = await fetchReadOnlyDataFromSupabase();
        if (remoteData && remoteData.guests.length > 0) {
          setGuests(remoteData.guests);
          setOrders(remoteData.orders);
          setIsLoadedFromSupabase(true);
        }
      } catch (e) {
        console.warn("Could not load read-only Supabase data:", e);
      }

      // Check read-only integrity
      try {
        const probe = await testSupabaseReadOnlyIntegrity();
        setIsReadOnlyEnforced(probe.isReadOnlyEnforced);
      } catch (e) {
        // default to true
      }

      return true;
    } else {
      setSupabaseStatus("error");
      return false;
    }
  };

  const checkReadOnlyIntegrity = async (): Promise<boolean> => {
    const probe = await testSupabaseReadOnlyIntegrity();
    setIsReadOnlyEnforced(probe.isReadOnlyEnforced);
    return probe.isReadOnlyEnforced;
  };

  useEffect(() => {
    checkSupabaseConnection();
  }, []);

  // Supabase Realtime Subscription
  useEffect(() => {
    if (supabaseStatus !== "connected") return;
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const channel = client
        .channel("zirium_orders_realtime_feed")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "orders" },
          (payload) => {
            const raw = payload.new as any;
            const newOrder: Order = {
              id: raw.id,
              guestId: raw.guest_id || undefined,
              outletId: raw.outlet_id,
              channel: raw.channel,
              orderType: raw.order_type,
              items: raw.items || [],
              subtotal: Number(raw.subtotal || 0),
              total: Number(raw.total || 0),
              timestamp: raw.timestamp || new Date().toISOString(),
              dayOfWeek: raw.day_of_week || new Date().getDay(),
              hour: raw.hour || new Date().getHours(),
            };

            setOrders((prev) => {
              if (prev.some((o) => o.id === newOrder.id)) return prev;
              return [newOrder, ...prev];
            });

            setRecentLiveOrders((prev) => {
              if (prev.some((o) => o.id === newOrder.id)) return prev;
              return [newOrder, ...prev].slice(0, 10);
            });
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch (e) {
      console.warn("Realtime subscription error:", e);
    }
  }, [supabaseStatus]);

  // Realtime Live Stream Interval (Start / Stop)
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      const { newOrder, updatedGuest, notificationMessage } = generateLiveIncomingOrder(
        guests,
        menuItems
      );

      // 1. Database is 100% Read-Only:
      // Live POS order stream runs entirely in-memory & local state to protect database immutability.
      // Zero mutation queries are dispatched to the cloud database.

      // 2. Append to local state
      setOrders((prev) => [newOrder, ...prev]);
      setRecentLiveOrders((prev) => [newOrder, ...prev].slice(0, 10));
      setLatestLiveAlert(notificationMessage);

      // Auto-clear notification after 4 seconds
      setTimeout(() => {
        setLatestLiveAlert((curr) => (curr === notificationMessage ? null : curr));
      }, 4000);

      if (updatedGuest) {
        setGuests((prev) =>
          prev.map((g) => (g.id === updatedGuest.id ? updatedGuest : g))
        );
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isLiveStreaming, guests, menuItems, supabaseStatus]);

  const toggleLiveStream = () => {
    setIsLiveStreaming((prev) => !prev);
  };

  const clearLatestLiveAlert = () => setLatestLiveAlert(null);

  // Sync to Supabase function
  const syncDataToSupabase = async (
    onProgress?: (step: string, pct: number) => void
  ) => {
    const res = await syncSeedDataToSupabase(
      {
        outlets,
        menuItems,
        guests,
        orders,
        pendingCampaigns,
      },
      onProgress
    );
    if (res.success) {
      setSupabaseStatus("connected");
    }
    return res;
  };

  // Restore from localStorage if present on client
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stopAllSending !== undefined) setStopAllSending(parsed.stopAllSending);
        if (parsed.selectedOutletId) setSelectedOutletId(parsed.selectedOutletId);
        if (parsed.guests) setGuests(parsed.guests);
        if (parsed.historicalCampaigns) setHistoricalCampaigns(parsed.historicalCampaigns);
        if (parsed.pendingCampaigns && Array.isArray(parsed.pendingCampaigns)) {
          // Re-hydrate status for initial campaigns while keeping functions intact
          const hydrated = INITIAL_PENDING_CAMPAIGNS.map((c) => {
            const savedC = parsed.pendingCampaigns.find((p: any) => p.id === c.id);
            if (!savedC) return c;
            return {
              ...c,
              status: savedC.status || c.status,
              approvedAt: savedC.approvedAt,
              sentCount: savedC.sentCount,
              heldBackCount: savedC.heldBackCount,
            };
          });

          // Also check for dynamic nightly campaigns like camp-fresh-nightly
          const freshSaved = parsed.pendingCampaigns.find(
            (p: any) => p.id === "camp-fresh-nightly"
          );
          if (freshSaved) {
            hydrated.unshift({
              id: "camp-fresh-nightly",
              name: "Fresh Nightly Action: VIP Biryani Loyalty",
              description:
                "Freshly generated from tonight's run: 34 guests reached their 5th visit anniversary.",
              channel: "sms",
              targetDescription:
                "Guests with 5+ visits who ordered in the past 14 days",
              targetFilter: (guest) =>
                guest.totalOrders >= 5 && guest.daysSinceLastOrder <= 14,
              goal: "Reward loyal milestone diners with an exclusive chef's complimentary tasting.",
              estimatedCostPerMessage: 0.0125,
              suggestedWording: [
                {
                  title: "5-Visit Milestone Celebration",
                  body: ({ firstName, favouriteDish }) =>
                    `Congratulations ${firstName}! You just celebrated 5 delicious meals with Spice Route Kitchen. To thank you, your next ${favouriteDish} comes with our compliments when you dine this week! Reply STOP to opt out.`,
                },
              ],
              status: freshSaved.status || "pending",
              approvedAt: freshSaved.approvedAt,
              sentCount: freshSaved.sentCount,
              heldBackCount: freshSaved.heldBackCount,
            });
          }

          setPendingCampaigns(hydrated);
        }
      }
    } catch (e) {
      console.warn("Failed to load demo state from localStorage", e);
    }
  }, []);

  // Sync mutations to localStorage
  const saveState = (updated: {
    stopAllSending?: boolean;
    selectedOutletId?: string;
    guests?: Guest[];
    historicalCampaigns?: HistoricalCampaign[];
    pendingCampaigns?: PendingCampaign[];
  }) => {
    try {
      if (typeof window === "undefined") return;
      const current = {
        stopAllSending: updated.stopAllSending !== undefined ? updated.stopAllSending : stopAllSending,
        selectedOutletId: updated.selectedOutletId || selectedOutletId,
        guests: updated.guests || guests,
        historicalCampaigns: updated.historicalCampaigns || historicalCampaigns,
        pendingCampaigns: (updated.pendingCampaigns || pendingCampaigns).map((c) => ({
          id: c.id,
          status: c.status,
          approvedAt: c.approvedAt,
          sentCount: c.sentCount,
          heldBackCount: c.heldBackCount,
        })),
      };
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(current));
    } catch (e) {
      console.warn("Failed to persist state", e);
    }
  };

  // Keyboard shortcut 'P' for Presenter mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "p" || e.key === "P") {
        setPresenterMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update body class for presenter mode
  useEffect(() => {
    if (presenterMode) {
      document.body.classList.add("presenter-mode");
    } else {
      document.body.classList.remove("presenter-mode");
    }
  }, [presenterMode]);

  const toggleStopAllSending = () => {
    const nextVal = !stopAllSending;
    setStopAllSending(nextVal);
    saveState({ stopAllSending: nextVal });
  };

  const togglePresenterMode = () => {
    setPresenterMode((prev) => !prev);
  };

  const startTour = () => setTourStep(1);
  const nextTourStep = () => setTourStep((prev) => (prev !== null && prev < 7 ? prev + 1 : null));
  const prevTourStep = () => setTourStep((prev) => (prev !== null && prev > 1 ? prev - 1 : 1));
  const skipTour = () => setTourStep(null);

  // Opt-out simulator (e.g. from guest profile)
  const simulateStopReply = (guestId: string) => {
    const updatedGuests = guests.map((g) => {
      if (g.id === guestId) {
        return {
          ...g,
          consent: {
            ...g.consent,
            sms: "opted_out" as const,
            whatsapp: "opted_out" as const,
            email: "opted_out" as const,
            source: "Simulated STOP reply via phone test",
          },
        };
      }
      return g;
    });

    setGuests(updatedGuests);
    saveState({ guests: updatedGuests });
  };

  // Campaign Approval simulation
  const approveCampaign = async (campaignId: string) => {
    if (stopAllSending) return;

    // 1. Mark as sending
    setPendingCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: "sending" } : c))
    );

    // Simulate sending delay
    await new Promise((res) => setTimeout(res, 1800));

    // 2. Mark as sent with counts
    setPendingCampaigns((prev) => {
      const updated = prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              status: "sent" as const,
              approvedAt: new Date().toISOString(),
              sentCount: 184,
              heldBackCount: 20,
            }
          : c
      );
      saveState({ pendingCampaigns: updated });
      return updated;
    });
  };

  const rejectCampaign = (campaignId: string) => {
    setPendingCampaigns((prev) => {
      const updated = prev.map((c) =>
        c.id === campaignId ? { ...c, status: "rejected" as const } : c
      );
      saveState({ pendingCampaigns: updated });
      return updated;
    });
  };

  // Run Nightly Update simulation: 5 steps
  const runNightlyUpdate = async () => {
    if (nightlyUpdateState.isRunning) return;

    const steps = [
      { step: 1, name: "1. Reading POS orders", progress: 20, log: "Connected read-only to 3 outlets: 142 new orders ingested." },
      { step: 2, name: "2. Matching guest profiles", progress: 40, log: "Identity resolution matched 3 orders across counter & phone." },
      { step: 3, name: "3. Predicting guest rhythms", progress: 65, log: "Recomputed median gap & visit risk for 1,800 guests." },
      { step: 4, name: "4. Suggesting timely actions", progress: 85, log: "Detected 4 guests at critical inflection point. Generated draft action." },
      { step: 5, name: "5. Nightly run completed", progress: 100, log: "Done. 1 new personalized campaign ready for owner approval." },
    ];

    setNightlyUpdateState({
      isRunning: true,
      step: 1,
      stepName: steps[0].name,
      progress: steps[0].progress,
      log: steps[0].log,
      newSuggestionAdded: false,
    });

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setNightlyUpdateState({
        isRunning: true,
        step: steps[i].step,
        stepName: steps[i].name,
        progress: steps[i].progress,
        log: steps[i].log,
        newSuggestionAdded: i === steps.length - 1,
      });
    }

    // Add a fresh suggested campaign if not already present
    setPendingCampaigns((prev) => {
      if (prev.some((p) => p.id === "camp-fresh-nightly")) return prev;
      const fresh: PendingCampaign = {
        id: "camp-fresh-nightly",
        name: "Fresh Nightly Action: VIP Biryani Loyalty",
        description: "Freshly generated from tonight's run: 34 guests reached their 5th visit anniversary.",
        channel: "sms",
        targetDescription: "Guests with 5+ visits who ordered in the past 14 days",
        targetFilter: (guest) => guest.totalOrders >= 5 && guest.daysSinceLastOrder <= 14,
        goal: "Reward loyal milestone diners with an exclusive chef's complimentary tasting.",
        estimatedCostPerMessage: 0.0125,
        suggestedWording: [
          {
            title: "5-Visit Milestone Celebration",
            body: ({ firstName, favouriteDish }) =>
              `Congratulations ${firstName}! You just celebrated 5 delicious meals with Spice Route Kitchen. To thank you, your next ${favouriteDish} comes with our compliments when you dine this week! Reply STOP to opt out.`,
          },
        ],
        status: "pending",
      };
      const updated = [fresh, ...prev];
      saveState({ pendingCampaigns: updated });
      return updated;
    });

    setTimeout(() => {
      setNightlyUpdateState((prev) => ({ ...prev, isRunning: false }));
    }, 2500);
  };

  // Reset Demo
  const resetDemo = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_STATE);
    }
    const fresh = getSeededData(true);
    setGuests(fresh.guests);
    setOrders(fresh.orders);
    setHistoricalCampaigns(fresh.historicalCampaigns);
    setPendingCampaigns(INITIAL_PENDING_CAMPAIGNS);
    setStopAllSending(false);
    setSelectedOutletId("all");
    setTourStep(null);
    setIsLiveStreaming(false);
    setRecentLiveOrders([]);
    setLatestLiveAlert(null);
    setNightlyUpdateState({
      isRunning: false,
      step: 0,
      stepName: "",
      progress: 0,
      log: "",
      newSuggestionAdded: false,
    });
  };

  return (
    <DemoContext.Provider
      value={{
        selectedOutletId,
        setSelectedOutletId: (id: string) => {
          setSelectedOutletId(id);
          saveState({ selectedOutletId: id });
        },
        currencySymbol,
        stopAllSending,
        toggleStopAllSending,
        guests,
        orders,
        outlets,
        menuItems,
        historicalCampaigns,
        pendingCampaigns,
        nightlyUpdateState,
        presenterMode,
        togglePresenterMode,
        tourStep,
        startTour,
        nextTourStep,
        prevTourStep,
        skipTour,
        simulateStopReply,
        approveCampaign,
        rejectCampaign,
        runNightlyUpdate,
        resetDemo,

        // Realtime & Supabase
        isLiveStreaming,
        toggleLiveStream,
        recentLiveOrders,
        latestLiveAlert,
        clearLatestLiveAlert,
        supabaseStatus,
        isLoadedFromSupabase,
        isReadOnlyEnforced,
        checkSupabaseConnection,
        checkReadOnlyIntegrity,
        syncDataToSupabase,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoStore() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemoStore must be used within a DemoProvider");
  }
  return context;
}
