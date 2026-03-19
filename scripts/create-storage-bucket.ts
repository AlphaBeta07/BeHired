/**
 * Run this script once to create the Supabase storage bucket for resume uploads.
 * Usage: npx tsx scripts/create-storage-bucket.ts
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
);

async function run() {
  // Create the bucket
  const { data, error } = await supabase.storage.createBucket("behired-uploads", {
    public: true,
    allowedMimeTypes: ["application/pdf"],
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  });

  if (error) {
    if (error.message?.includes("already exists") || error.message?.includes("Duplicate")) {
      console.log("✅ Bucket 'behired-uploads' already exists.");
    } else {
      console.error("❌ Failed to create bucket:", error.message);
    }
  } else {
    console.log("✅ Bucket 'behired-uploads' created successfully:", data);
  }

  // Set bucket policy to public read
  const { error: policyError } = await supabase.storage.updateBucket("behired-uploads", {
    public: true,
  });
  if (policyError) {
    console.warn("⚠️ Could not update bucket policy:", policyError.message);
  } else {
    console.log("✅ Bucket set to public.");
  }
}

run().catch(console.error);
