import imageCompression from "browser-image-compression";

export async function compressAndConvertToWebP(file: File): Promise<File> {
  if (file.type === "image/svg+xml") {
    return file;
  }

  const options = {
    maxSizeMB: 1.2,              // 🌟 1.2MB tak allow karein (rug ke barik dhage sharp rahenge)
    maxWidthOrHeight: 2400,      // 🌟 2400px (4K/Retina displays par crisp texture ke liye)
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.90,        // 🌟 90% High Visual Fidelity (zero blurriness)
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    return new File([compressedBlob], `${baseName}.webp`, {
      type: "image/webp",
    });
  } catch (error) {
    console.warn("Compression fallback to original:", error);
    return file;
  }
}