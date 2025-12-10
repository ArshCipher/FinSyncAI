// Vercel Serverless Function for Customer CRM
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
    const { type, value } = req.query;

    let customer = null;

    if (type === 'phone') {
      customer = await db.collection('customers').findOne({ phone: value });
    } else if (type === 'email') {
      customer = await db.collection('customers').findOne({ email: value });
    } else if (type === 'id') {
      customer = await db.collection('customers').findOne({ customerId: value });
    } else {
      return res.status(400).json({ error: 'Invalid query type' });
    }

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    return res.status(200).json(customer);
  } catch (error) {
    console.error('Database Error:', error);
    return res.status(500).json({ 
      error: 'Database query failed',
      message: error.message 
    });
  }
}
