import { MongoClient } from "mongodb";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uri = "mongodb://box-website:Qwaszx%40123@127.0.0.1:27017/box-website?authSource=box-website";

// Read defaultHomeData
async function run() {
  const defaultDataModule = await import("../src/lib/defaultHomeData.ts");
  const DEFAULT_HOME_DATA = defaultDataModule.DEFAULT_HOME_DATA;

  // 1. Write to local cache
  const cachePath = path.resolve(__dirname, "..", "data", "home_sections_cache.json");
  await writeFile(cachePath, JSON.stringify(DEFAULT_HOME_DATA, null, 2), "utf-8");
  console.log("Written default data to local cache:", cachePath);

  // 2. Try seeding to MongoDB
  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });
    await client.connect();
    console.log("Connected to MongoDB!");
    const db = client.db("box-website");
    const collection = db.collection("home_sections");

    for (const [key, val] of Object.entries(DEFAULT_HOME_DATA)) {
      await collection.updateOne(
        { sectionId: key },
        { $set: { ...val, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    }
    console.log("Successfully seeded all 14 sections to MongoDB collection 'home_sections'!");
    await client.close();
  } catch (err) {
    console.log("MongoDB was not reachable directly for seeding (will sync on demand):", err.message);
  }
}

run();
