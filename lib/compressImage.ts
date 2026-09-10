import imageCompression from "browser-image-compression";

export async function compressAndConvertToWebP(file: File): Promise<File> {
  if (file.type === "image/svg+xml") {
    return file;
  }

  const options = {
    maxSizeMB: 0.9,          // Crisp, luxury headroom preserving intricate braided yarn loops & relief (max 900KB)
    maxWidthOrHeight: 2048,  // Ultra-crisp for 2K, 4K & Retina screens
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.92,    // 92% WebP maintains razor-sharp thread clarity without blur
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    return new File([compressedBlob], `${baseName}.webp`, {
      type: "image/webp",
    });
  } catch (error) {
    console.error("Compression error:", error);
    return file;
  }
}