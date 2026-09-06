import { supabase } from "@/lib/supabase";

/**
 * Supabase Storage ke public URL me se file name nikaal kar
 * storage bucket se permanent delete karta hai.
 */
export async function deleteStorageImage(imageUrl: string, bucket = "product-images") {
  if (!imageUrl || typeof imageUrl !== "string") return;

  try {
    // Check karein ki image Supabase storage bucket ki hi hai ya nahi
    if (!imageUrl.includes(bucket)) return;

    // URL me se filename nikaalein (query params ko hatakar)
    const cleanUrl = imageUrl.split("?")[0];
    const fileName = cleanUrl.split(`/${bucket}/`)[1];

    if (!fileName) return;

    console.log(`🗑️ Deleting old image from Supabase: ${fileName}`);

    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    if (error) {
      console.warn("Storage deletion warning:", error.message);
    } else {
      console.log(`✅ Successfully deleted from storage: ${fileName}`);
    }
  } catch (err: any) {
    console.warn("Failed to delete old image:", err.message);
  }
}