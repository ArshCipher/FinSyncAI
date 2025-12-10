// Vercel Serverless Function for Loan Offers
import { connectToDatabase } from './mongodb.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const offers = await db.collection('offers').find({}).toArray();
    return res.status(200).json(offers);
  } catch (error) {
    console.error('Offers Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch offers',
      message: error.message 
    });
  }
}
