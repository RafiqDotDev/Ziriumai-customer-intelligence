# Zirium AI — "Customer Intelligence Service" Client Demo

A polished, click-through client demonstration web application for restaurant operators, presenting the autonomous **"Customer Intelligence Service" by Zirium AI**.

All data is generated in-memory with a deterministic seeded pseudo-random engine (**Mulberry32, seed 42**) simulating ~1,800 guests, ~14,000 orders across 3 outlets, and realistic multi-channel identity merges. Zero backend, zero real API credentials, zero internet dependency.

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ (tested up to Node 25)
- npm 9+

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev

# 3. Open in your browser
http://localhost:5173
```

### Production Build & Verification
```bash
# Typecheck
npm run typecheck

# Production build
npm run build

# Run production server
npm run start
```

---

## ☁️ Deploying to Vercel (Zero Environment Variables)

The application is completely self-contained with no database or external API dependencies:
1. Push this repository to GitHub or GitLab.
2. In your [Vercel Dashboard](https://vercel.com), click **"Add New Project"** and import this repository.
3. Keep the default build settings:
   - **Framework Preset:** Vite / React Router
   - **Build Command:** `npm run build`
   - **Output Directory:** `build/client` (or default Vite output)
   - **Environment Variables:** None required! (Leave completely blank)
4. Click **Deploy**. Your demo will be live globally in under 60 seconds.

---

## 🎙️ 10-Minute Client Presentation Flow

Use this structured talk-track during client pitch meetings:

1. **Home (`/`): The Nightly Ingestion Rhythm (2 mins)**
   - *"Every night at 3:00 AM, Zirium AI connects read-only to your POS. It analyzes all closed checks, recalculates each guest's personal visit cycle, and flags who is falling behind."*
   - Click the **"Run Nightly Update"** button to trigger the 5-step animated sequence (`Read orders` $\to$ `Match guests` $\to$ `Predict rhythms` $\to$ `Suggest actions` $\to$ `Done`).
   - Notice how a fresh milestone recommendation (*"VIP Biryani Loyalty"*) is generated live.
   - Point out the **"At risk this week"** list: *"Usually orders every 14 days, it has been 31"*.

2. **Guest Profile (`/guests/:id`): Single Identity Across Channels (2 mins)**
   - Click an at-risk guest (e.g. Tariq Khan).
   - Show the **"Merged from N channels"** badge: demonstrate how counter walk-in receipts, online app orders, and phone orders with varying formats (`0300...` vs `+92 300...`) are unified into one single profile.
   - Point to the **"Why was this guest flagged?"** card and the top 5 favourite dishes breakdown.
   - Click **"Suggest Message"** to showcase AI wording tailored to their favorite dish.

3. **Campaign Approvals (`/campaigns`): Owner in Full Control (2 mins)**
   - Explain: *"Nothing ever sends automatically. You approve every message before dispatch."*
   - Inspect recipient counts: note how the system automatically excludes guests without consent, guests who opted out, and guests contacted in the last 7 days.
   - Highlight the **10% Held-Back Group**: *"10% of eligible diners are deliberately not contacted so we can honestly prove extra revenue."*
   - Click **"Draft wording with AI"** and note the privacy guarantee: the AI model sees only first name and favorite dish—never full records or phone numbers.
   - Click **"Approve and send"** to watch the real-time simulated delivery counter.

4. **Safety & Kill Switch Demo: Instant Compliance (1 min)**
   - In the top bar, click the red **"Stop All Sending"** button.
   - Show how the entire application enters an emergency freeze with a persistent banner, immediately disabling all approve actions.
   - Click **"Resume Sending"** to restore normal operation.
   - Return to a guest profile and click **"Simulate STOP Reply"**: watch their consent flip to opted-out instantly.

5. **Results & Honest Measurement (`/results`): The 10% Holdout (1.5 mins)**
   - Show the campaign performance cards: compare the order rate of the 90% messaged cohort vs the 10% uncontacted control group.
   - Walk through the math:
     $$\text{Uplift} = \text{OrderRate}_{\text{messaged}} - \text{OrderRate}_{\text{held-back}}$$
     $$\text{Extra Orders Created} = \text{Uplift} \times N_{\text{messaged}}$$
   - Point out that this proves the campaign genuinely generated +200+ incremental orders and \$10k+ in extra revenue that wouldn't have occurred otherwise.

6. **Connect Your Data (`/connect`): Zero Risk, 100% Read-Only (1 min)**
   - Walk through the 5 POS integration options (Cloud API, Partner API, Read Replica, Webhook, Daily CSV).
   - Emphasize the **Read-Only Security Guarantee**: *"We can only read and copy closed receipts. We cannot alter menu prices, modify tickets, delete items, or access card payments."*

7. **Cost Estimator (`/costs`): Direct Carrier Pricing (0.5 mins)**
   - Move the sliders (SMS, WhatsApp, Email, Outlets) or select the **Small**, **Medium**, or **Medium + WhatsApp** presets.
   - Show the itemized breakdown ($24 cloud, $25 Supabase Pro, $0.0125/SMS, $0.0685/WhatsApp).
   - Conclude: *"All accounts are registered in your restaurant's name and billed directly to you with zero hidden markups. Setup and support are tailored to your scale."*

---

## ⌨️ Interactive Controls & Shortcuts
- **Guided Tour:** Click **"Guided Tour"** in the top bar or sidebar to launch the 7-step guided overlay with highlights.
- **Presenter Mode:** Press the `P` key on your keyboard (or click "Presenter (P)" in the top bar) to enlarge KPI fonts and hide secondary clutter for video calls.
- **Reset Demo:** Click **"Reset Demo Data"** in the sidebar at any time to clear local storage overrides and restore the initial seeded state.
- **Outlet Filter:** Use the top bar outlet dropdown to filter metrics for *All Outlets*, *Downtown Flagship*, *University Road*, or *Airport Mall Plaza*.

---

## ⚡ Real-Time Live Order Stream (Start / Stop)

In the top bar, you will see the **Live Stream Controller**:
- Click **"Start Stream"**: Immediately triggers an authentic incoming POS stream (new orders every 3.8s across Dine-In, Delivery, and Pickup).
- Watch new orders pop in with real-time toast alerts, updating revenue, guest rhythms, and order counts.
- Click **"LIVE FEED" / "Stop Stream"**: Immediately pauses the incoming stream.
- Click the **"N New"** pill to open the floating **Live Order Feed Drawer** and inspect recently generated order tickets.

---

## 🗄️ Supabase Cloud Integration & Database Sync

To sync your restaurant dataset into a live Supabase PostgreSQL database:

### 1. Run the Database Schema
1. Open your Supabase project's [SQL Editor](https://supabase.com/dashboard/project/_/sql).
2. Copy the contents of `supabase/schema.sql`.
3. Paste and click **Run**. This provisions `outlets`, `menu_items`, `guests`, `orders`, and `campaigns`, along with RLS policies and **Realtime Publication** channels.

### 2. Connect & Sync from the Web UI
1. Click the **"Supabase"** button in the top bar (or go to `/connect` and click **"Configure Supabase Sync"**).
2. Enter your **Supabase Project URL** and **Anon / Public API Key**.
3. Click **"Test Connection"**, then click **"Sync All Seed Data to Supabase"**.
4. Watch the animated progress bar batch-load your outlets, menu items, guests, and orders directly into your Supabase database!

### 3. Realtime WebSockets
When connected to Supabase and the live stream is active:
- Each incoming order is inserted directly into the Supabase `orders` table.
- React Router listens to Supabase's WebSocket channel (`postgres_changes`) and automatically reflects new rows without manual polling.

---

## 🛠️ Tech Stack & Design System
- **Framework:** React Router v7 (`@react-router/dev` & `@react-router/node`) + React 19 + Vite
- **Language:** TypeScript 5.9 (Strict mode)
- **Styling:** Tailwind CSS v4 + Inter typography + Custom Design Tokens:
  - Primary Teal: `#0E7C9B`
  - Accent Sky: `#3EC6F2`
  - Ink Navy: `#0F2A3A`
  - Soft Background: `#EAF6FC`
  - Rounded cards: `rounded-2xl`, `rounded-3xl`
- **Charts:** Recharts (Donut segments, Horizontal bar charts, Comparison bar charts)
- **Icons:** Lucide React

---

## 📋 List of Design Decisions & Simplifications
1. **Seeded Pseudo-Random Generation:** Implemented using Mulberry32 (seed 42) in `lib/seed.ts` rather than a live PostgreSQL database to guarantee zero configuration, 100% reproducible metrics on every run, and instantaneous loading without network calls.
2. **Simulated Outbound Delivery:** Sending campaigns simulates delivery progress over 1.8 seconds via an animated progress bar and counter, updating client-side state in React Context + `localStorage`.
3. **Hardcoded AI Wording Variations:** Simulated AI message drafting uses three pre-templated chef and customer engagement scripts filled dynamically with `{firstName}` and `{favouriteDish}`, demonstrating data minimization without requiring an OpenAI or Anthropic API key.
4. **Deterministic Holdout Assignment:** A deterministic string hash of `guestId:campaignId % 100 < 10` is used to consistently assign exactly 10% of any eligible cohort to the uncontacted control group.
5. **Print Stylesheet:** The Data Readiness Report (`/readiness`) utilizes dedicated `@media print` CSS so clicking "Download & Print PDF" cleanly formats as an executive audit summary without sidebar or navigation artifacts.
