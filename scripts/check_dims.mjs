import sharp from "sharp"; // if sharp exists, or check metadata

async function checkDimensions() {
  const urls = [
    "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788943952358-by1mq.webp",
    "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788943970432-1evm0.webp",
    "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788943987531-can4b.webp",
    "https://qjpjltaiazwybhsmnkve.supabase.co/storage/v1/object/public/product-images/site-1788943979805-ty4t3.webp"
  ];

  for (let i = 0; i < urls.length; i++) {
    const res = await fetch(urls[i]);
    const buf = Buffer.from(await res.arrayBuffer());
    // check basic webp header or size
    console.log(`Image ${i+1}: length ${buf.length} bytes`);
  }
}

checkDimensions();
