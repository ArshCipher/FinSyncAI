import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/finsync';

// MongoDB Atlas connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const client = new MongoClient(uri, options);

let db = null;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db('finsync');
    console.log('✓ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Don't throw - allow app to start without DB for demo
    console.warn('⚠ App running without database connection');
    return null;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

export async function closeDB() {
  await client.close();
}
