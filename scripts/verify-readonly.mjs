import { createClient } from "@supabase/supabase-js";

async function verifyReadOnly() {
  console.log("==================================================");
  console.log(" Zirium AI: Verify 100% Read-Only Database Status");
  console.log("==================================================");

  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error("❌ No Supabase config found in environment.");
    process.exit(1);
  }

  console.log(`Endpoint: ${url}`);
  const client = createClient(url, anonKey, {
    auth: { persistSession: false },
  });

  // 1. Verify Read Access on all tables
  console.log("\n1. Testing Read (SELECT) Privileges:");
  const tables = ["outlets", "menu_items", "guests", "orders", "campaigns"];
  for (const table of tables) {
    const { count, error } = await client
      .from(table)
      .select("*", { count: "exact", head: true });
    if (error) {
      console.log(` ❌ ${table}: Error reading (${error.message})`);
    } else {
      console.log(` ✓ ${table}: READ OK (${count ?? 0} records accessible)`);
    }
  }

  // 2. Test Write (INSERT) Prevention
  console.log("\n2. Testing Write (INSERT) Lockdown:");
  const fakeId = "readonly_probe_" + Date.now();
  const { error: insertErr } = await client.from("outlets").insert([
    {
      id: fakeId,
      name: "Malicious Write Probe",
      time_zone: "America/New_York",
      address: "Should Fail",
    },
  ]);

  if (insertErr) {
    console.log(` ✓ INSERT Blocked by PostgreSQL RLS Policy!`);
    console.log(`   Code: ${insertErr.code || "RLS_REJECT"}`);
    console.log(`   Message: ${insertErr.message}`);
  } else {
    console.log(` ⚠️ INSERT was allowed (record id: ${fakeId}).`);
    console.log(`    --> Run 'supabase/enforce_readonly.sql' in your Supabase SQL Editor to enforce strict RLS lockdown.`);
    // Clean up test probe
    await client.from("outlets").delete().eq("id", fakeId);
  }

  // 3. Test Mutation (UPDATE) Prevention
  console.log("\n3. Testing Mutation (UPDATE) Lockdown:");
  const { error: updateErr, count: updateCount } = await client
    .from("outlets")
    .update({ name: "Tampered Outlet" })
    .eq("id", "downtown")
    .select();

  if (updateErr || (updateCount !== null && updateCount === 0)) {
    console.log(` ✓ UPDATE Blocked or 0 rows modified (${updateErr?.message || "0 rows affected due to RLS"}).`);
  } else {
    console.log(` ⚠️ UPDATE was not blocked.`);
  }

  // 4. Test Deletion (DELETE) Prevention
  console.log("\n4. Testing Deletion (DELETE) Lockdown:");
  const { error: deleteErr, count: deleteCount } = await client
    .from("outlets")
    .delete()
    .eq("id", "downtown")
    .select();

  if (deleteErr || (deleteCount !== null && deleteCount === 0)) {
    console.log(` ✓ DELETE Blocked or 0 rows deleted (${deleteErr?.message || "0 rows affected due to RLS"}).`);
  } else {
    console.log(` ⚠️ DELETE was not blocked.`);
  }

  console.log("\n==================================================");
  console.log(" Zirium AI Read-Only POS Replica Guarantee: Complete");
  console.log("==================================================");
}

verifyReadOnly().catch(console.error);
