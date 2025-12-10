// Vercel Serverless Function for Credit Score
import { connectToDatabase } from './mongodb.js';

// Free Credit Score Estimator
function estimateCreditScore(customer) {
  const { monthlyIncome, existingEMIs, employmentType, aadhaar, panCard, dob } = customer;
  
  let score = 500; // Base score
  
  // Income Factor
  if (monthlyIncome >= 150000) score += 150;
  else if (monthlyIncome >= 100000) score += 120;
  else if (monthlyIncome >= 75000) score += 100;
  else if (monthlyIncome >= 50000) score += 80;
  else if (monthlyIncome >= 30000) score += 50;
  
  // EMI Ratio
  const emiRatio = (existingEMIs / monthlyIncome) * 100;
  if (emiRatio === 0) score += 100;
  else if (emiRatio < 20) score += 80;
  else if (emiRatio < 30) score += 50;
  else if (emiRatio < 40) score += 20;
  else if (emiRatio < 50) score -= 20;
  else score -= 100;
  
  // Employment
  if (employmentType === 'Salaried') score += 50;
  else score += 30;
  
  // Age
  if (dob) {
    const age = Math.floor((new Date() - new Date(dob)) / 31557600000);
    if (age >= 35 && age <= 50) score += 50;
    else if (age >= 30 && age < 35) score += 40;
    else if (age >= 25 && age < 30) score += 30;
  }
  
  // Documents
  if (aadhaar && panCard) score += 50;
  
  // Random variation
  score += Math.floor(Math.random() * 41) - 20;
  
  // Clamp
  score = Math.max(300, Math.min(900, Math.round(score)));
  
  return {
    customerId: customer.customerId,
    score,
    lastUpdated: new Date().toISOString(),
    bureau: 'Synthetic Estimator',
    confidence: 85
  };
}

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
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID required' });
    }

    // Try to get from database first
    let creditScore = await db.collection('creditScores').findOne({ customerId });

    // If not found, estimate it
    if (!creditScore) {
      const customer = await db.collection('customers').findOne({ customerId });
      
      if (customer) {
        creditScore = estimateCreditScore(customer);
      } else {
        return res.status(404).json({ error: 'Customer not found' });
      }
    }

    return res.status(200).json(creditScore);
  } catch (error) {
    console.error('Credit Score Error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch credit score',
      message: error.message 
    });
  }
}
