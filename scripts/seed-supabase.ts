import { getSeededData } from "../lib/seed";
import { syncSeedDataToSupabase, getSupabaseConfig, testSupabaseConnection } from "../lib/supabase";

async function main() {
  console.log("=== Zirium AI: Supabase Data Sync Utility ===");

  const config = getSupabaseConfig();
  if (!config) {
    console.error("Error: Supabase credentials not found.");
    console.log("Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env or via the in-app modal.");
    process.exit(1);
  }

  console.log(`Checking connection to: ${config.url}...`);
  const conn = await testSupabaseConnection();
  if (!conn.success) {
    console.error(`Connection failed: ${conn.message}`);
    process.exit(1);
  }
  console.log(`✓ ${conn.message}`);

  console.log("Generating deterministic seed dataset...");
  const dataset = getSeededData();

  console.log(`Starting batched sync to Supabase...`);
  const result = await syncSeedDataToSupabase(dataset, (step, pct) => {
    console.log(`[${pct}%] ${step}`);
  });

  if (result.success) {
    console.log(`\n🎉 SUCCESS: ${result.message}`);
  } else {
    console.error(`\n❌ FAILED: ${result.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
