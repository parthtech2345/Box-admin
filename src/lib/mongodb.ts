import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://box-website:Qwaszx%40123@127.0.0.1:27017/box-website?authSource=box-website";
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDb(): Promise<Db | null> {
  try {
    const mongoClient = await getMongoClient();
    return mongoClient.db("box-website");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return null;
  }
}
