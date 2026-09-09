import imageCompression from "browser-image-compression";

export async function compressAndConvertToWebP(file: File): Promise<File> {
  if (file.type === "image/svg+xml") {
    return file;
  }

  const options = {
    maxSizeMB: 0.65,         // High fidelity: crisp threads without heavy bloat
    maxWidthOrHeight: 2000,  // Sharp for 2K & Retina displays
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.88,    // 88% WebP preserves fine carpet weave details
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