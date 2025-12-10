// MongoDB Connection for Vercel Serverless Functions
import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db('eytech_banking');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
