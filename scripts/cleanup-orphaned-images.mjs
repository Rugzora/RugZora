import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ .env.local me Supabase credentials nahi mile.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET = "product-images";

async function cleanup() {
  console.log("🔍 Scanning active database images...\n");

  const activeUrls = new Set();

  // 1. Fetch active images from 'products'
  const { data: products } = await supabase.from("products").select("images, image");
  if (products) {
    products.forEach((p) => {
      if (Array.isArray(p.images)) {
        p.images.forEach((url) => typeof url === "string" && activeUrls.add(url));
      }
      if (typeof p.image === "string") activeUrls.add(p.image);
    });
  }

  // 2. Fetch active images from 'site_content' (home, collections, legacy, about)
  const { data: contents } = await supabase.from("site_content").select("data");
  if (contents) {
    const extractUrls = (obj) => {
      if (!obj) return;
      if (typeof obj === "string" && obj.includes(BUCKET)) activeUrls.add(obj);
      else if (Array.isArray(obj)) obj.forEach(extractUrls);
      else if (typeof obj === "object") Object.values(obj).forEach(extractUrls);
    };
    contents.forEach((c) => extractUrls(c.data));
  }

  // Extract active filenames
  const activeFileNames = new Set();
  activeUrls.forEach((url) => {
    const clean = url.split("?")[0];
    const name = clean.split(`/${BUCKET}/`)[1];
    if (name) activeFileNames.add(name);
  });

  console.log(`✅ Active (in-use) images in website: ${activeFileNames.size}`);

  // 3. Fetch all files currently present in storage bucket
  const { data: storageFiles, error: listErr } = await supabase.storage.from(BUCKET).list("", { limit: 500 });
  if (listErr) {
    console.error("❌ Storage list error:", listErr.message);
    return;
  }

  console.log(`📦 Total files in Supabase Storage: ${storageFiles.length}`);

  // 4. Identify orphaned files
  const filesToDelete = storageFiles
    .filter((f) => !activeFileNames.has(f.name))
    .map((f) => f.name);

  console.log(`🗑️ Waste/Orphaned files to delete: ${filesToDelete.length}`);

  if (filesToDelete.length === 0) {
    console.log("\n🎉 Storage already completely clean!");
    return;
  }

  // 5. Delete in batches of 50
  for (let i = 0; i < filesToDelete.length; i += 50) {
    const batch = filesToDelete.slice(i, i + 50);
    const { error: delErr } = await supabase.storage.from(BUCKET).remove(batch);
    if (delErr) {
      console.error("Batch delete error:", delErr.message);
    } else {
      console.log(`Deleted batch ${i + 1} to ${i + batch.length}`);
    }
  }

  console.log("\n✨ Cleanup Complete! All unused duplicate/replaced images removed.");
}

cleanup();