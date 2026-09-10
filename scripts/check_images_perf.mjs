const urls = [
  "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788943952358-by1mq.webp",
  "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788943970432-1evm0.webp",
  "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788943987531-can4b.webp",
  "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788943979805-ty4t3.webp",
  "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788885350236-wdp51.webp"
];

async function checkImages() {
  for (const url of urls) {
    const start = Date.now();
    try {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      const elapsed = Date.now() - start;
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.status}, Size: ${(buf.byteLength / 1024).toFixed(1)} KB, Content-Type: ${res.headers.get("content-type")}, Time: ${elapsed}ms`);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  }
}

checkImages();
