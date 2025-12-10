// Vercel Serverless Function for Underwriting
import { connectToDatabase } from './mongodb.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { customerId, requestedAmount } = req.body;

    if (!customerId || !requestedAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get customer and credit score
    const customer = await db.collection('customers').findOne({ customerId });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    let creditData = await db.collection('creditScores').findOne({ customerId });
    const creditScore = creditData?.score || 750;

    // Underwriting Logic
    if (creditScore < 700) {
      return res.status(200).json({
        decision: 'REJECTED',
        reason: 'Credit score below minimum threshold (700)',
        creditScore,
        requestedAmount,
        approvedAmount: 0
      });
    }

    // Instant approval if within pre-approved limit
    if (requestedAmount <= customer.preApprovedLimit) {
      return res.status(200).json({
        decision: 'INSTANT_APPROVED',
        reason: 'Application approved! Amount is within your pre-approved limit.',
        creditScore,
        requestedAmount,
        approvedAmount: requestedAmount
      });
    }

    // Conditional approval if within 2x limit
    if (requestedAmount <= customer.preApprovedLimit * 2) {
      return res.status(200).json({
        decision: 'CONDITIONAL_APPROVED',
        reason: 'Application conditionally approved. Please submit salary slip for verification.',
        creditScore,
        requestedAmount,
        approvedAmount: requestedAmount,
        conditions: [
          'Latest 3 months salary slips required',
          'Bank statement for last 6 months',
          'Employment verification letter'
        ]
      });
    }

    // Reject if too high
    return res.status(200).json({
      decision: 'REJECTED',
      reason: `Requested amount exceeds maximum eligible limit of ₹${(customer.preApprovedLimit * 2).toLocaleString('en-IN')}`,
      creditScore,
      requestedAmount,
      approvedAmount: 0
    });
  } catch (error) {
    console.error('Underwriting Error:', error);
    return res.status(500).json({ 
      error: 'Underwriting failed',
      message: error.message 
    });
  }
}
