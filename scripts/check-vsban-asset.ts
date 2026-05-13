import { createClient } from "@sanity/client";
import { config } from "dotenv";
config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.NEXT_PUBLIC_SANITY_EDIT_TOKEN!,
  apiVersion: "2024-04-01",
  useCdn: false,
});

async function main() {
  // Search for VSBAN Banana Roast image asset by original filename
  const assets = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename match "VSBAN*"]{_id, originalFilename, url}'
  );
  console.log("VSBAN assets:", JSON.stringify(assets, null, 2));

  // Also check the other banana roast image
  const bananaAssets = await client.fetch(
    '*[_type == "sanity.imageAsset" && originalFilename match "*Banana*Roast*"]{_id, originalFilename, url}'
  );
  console.log("\nBanana Roast assets:", JSON.stringify(bananaAssets, null, 2));
}
main().catch(console.error);
