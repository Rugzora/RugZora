import imageCompression from "browser-image-compression";

/**
 * Automaticaly compresses and converts any file (PNG, JPG, HEIC) to WebP
 * High fidelity compression without noticeable quality loss.
 */
export async function compressAndConvertToWebP(file: File): Promise<File> {
  // Agar file pehle se SVG hai toh compression skip karein
  if (file.type === "image/svg+xml") {
    return file;
  }

  const options = {
    maxSizeMB: 0.8,              // Max size target ~800KB (luxurious texture details preserve rahenge)
    maxWidthOrHeight: 2000,      // Max dimension 2000px (4K/Retina displays ke liye perfect)
    useWebWorker: true,          // Background thread me process hoga, browser UI freeze nahi hoga
    fileType: "image/webp",      // Auto-convert to next-gen WebP
    initialQuality: 0.85,        // 85% high visual fidelity (no visible quality loss)
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    
    // File name ko .webp extension ke saath clean karein
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const webpFile = new File([compressedBlob], `${baseName}.webp`, {
      type: "image/webp",
    });

    return webpFile;
  } catch (error) {
    console.warn("Client compression failed, fallback to original file:", error);
    return file;
  }
}