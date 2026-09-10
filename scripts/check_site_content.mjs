import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qjpjltaiazwybhsmnkve.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcGpsdGFpYXp3eWJoc21ua3ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MzE1MjQsImV4cCI6MjEwMjUwNzUyNH0.2BiNade49az4aGj2keveLF78kQLLk3VG2Rql5GubQWw";

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from("site_content").select("*");
  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Rows count:", data.length);
  console.log("Sample row:", JSON.stringify(data, null, 2));
}

check();
