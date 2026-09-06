import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Service Role Key agar ho toh sabse best, warna public anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: .env.local me Supabase URL ya Key nahi mili.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = "product-images";

// 🌟 URL se image download karke sharp se WebP me convert karega (85% high visual quality)
async function processAndUploadWebP(imageUrl) {
  try {
    if (!imageUrl || typeof imageUrl !== "string" || !imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // Agar image pehle se .webp hai toh skip karein
    if (imageUrl.endsWith(".webp") || imageUrl.includes(".webp?")) {
      console.log(`⏩ Already WebP, skipping: ${imageUrl.split("/").pop()}`);
      return imageUrl;
    }

    console.log(`📥 Downloading & Optimizing: ${imageUrl.split("/").pop()}...`);

    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    // 🌟 High quality WebP conversion without visible degradation
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 2200, withoutEnlargement: true }) // 4K/Retina displays ke liye sharp rahega
      .webp({ quality: 85, effort: 5 }) // 85% high visual fidelity
      .toBuffer();

    const originalName = imageUrl.split("/").pop().split("?")[0];
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const newFileName = `migrated-${Date.now()}-${baseName}.webp`;

    console.log(`⬆ Uploading optimized WebP: ${newFileName}...`);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(newFileName, optimizedBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(newFileName);

    console.log(`✅ Converted successfully to: ${publicData.publicUrl}`);
    return publicData.publicUrl;
  } catch (err) {
    console.warn(`⚠️ Optimization failed for ${imageUrl}:`, err.message);
    return imageUrl; // Fallback to original
  }
}

// 🌟 Recursive function jo poore JSON object me se purani images dhoondhkar nayi WebP URL se replace karegi
async function replaceUrlsInObject(obj) {
  if (!obj) return obj;
  if (typeof obj === "string") {
    if (obj.startsWith("http") && (obj.includes(".jpg") || obj.includes(".jpeg") || obj.includes(".png"))) {
      return await processAndUploadWebP(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArr = [];
    for (const item of obj) {
      newArr.push(await replaceUrlsInObject(item));
    }
    return newArr;
  }

  if (typeof obj === "object") {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = await replaceUrlsInObject(value);
    }
    return newObj;
  }

  return obj;
}

async function runMigration() {
  console.log("🚀 Starting Bulk Image Migration to WebP...\n");

  // 1. Optimize Products Images
  console.log("📦 Checking 'products' table...");
  const { data: products, error: prodErr } = await supabase.from("products").select("*");
  if (!prodErr && products) {
    for (const prod of products) {
      let updated = false;
      let newImages = [];

      if (Array.isArray(prod.images)) {
        for (const imgUrl of prod.images) {
          const webpUrl = await processAndUploadWebP(imgUrl);
          newImages.push(webpUrl);
          if (webpUrl !== imgUrl) updated = true;
        }
      }

      if (updated) {
        await supabase
          .from("products")
          .update({ images: newImages })
          .eq("id", prod.id);
        console.log(`✨ Product "${prod.name}" updated with WebP images!`);
      }
    }
  }

  // 2. Optimize Site Content Images (Home, Legacy, About, etc.)
  console.log("\n📄 Checking 'site_content' table...");
  const { data: contentRows, error: contentErr } = await supabase.from("site_content").select("*");
  if (!contentErr && contentRows) {
    for (const row of contentRows) {
      console.log(`🔍 Processing page: ${row.id}...`);
      const updatedData = await replaceUrlsInObject(row.data);
      await supabase
        .from("site_content")
        .update({ data: updatedData, updated_at: new Date().toISOString() })
        .eq("id", row.id);
      console.log(`✨ Page "${row.id}" content updated to WebP!`);
    }
  }

  console.log("\n🎉 ALL IMAGES MIGRATED TO WEBP SUCCESSFULLY! Visually sharp & ultra-fast loading.");
}

runMigration();