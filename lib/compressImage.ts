import imageCompression from "browser-image-compression";

export async function compressAndConvertToWebP(file: File): Promise<File> {
  if (file.type === "image/svg+xml") {
    return file;
  }

  const options = {
    maxSizeMB: 0.24,         // 1.2MB हटाकर 0.28MB (280KB) करें
    maxWidthOrHeight: 1700,  // 1800px (ज़ूम के लिए काफ़ी शार्प)
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.78,    // 82% क्वालिटी
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