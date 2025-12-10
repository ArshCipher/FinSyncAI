import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, getDB } from './database.js';
import { seedDatabase } from './seed.js';
import { CreditScoreEstimator } from './creditScoreEstimator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database (non-blocking)
let dbConnected = false;
connectDB().then(async (db) => {
  if (db) {
    await seedDatabase();
    dbConnected = true;
    console.log('✓ Database ready');
  }
}).catch(err => {
  console.warn('⚠ Running without database');
});

// Health check (works without DB)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected'
  });
});

// Serve static files from dist folder (for Railway deployment)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../dist')));

// ============ CRM Service ============
app.get('/api/customers/phone/:phone', async (req, res) => {
  try {
    const db = getDB();
    const customer = await db.collection('customers').findOne({ 
      phone: req.params.phone 
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/email/:email', async (req, res) => {
  try {
    const db = getDB();
    const customer = await db.collection('customers').findOne({ 
      email: req.params.email 
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/id/:customerId', async (req, res) => {
  try {
    const db = getDB();
    const customer = await db.collection('customers').findOne({ 
      customerId: req.params.customerId 
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Credit Bureau Service ============
app.get('/api/credit-score/:customerId', async (req, res) => {
  try {
    const db = getDB();
    
    // Try to get from database first (existing customers)
    let creditScore = await db.collection('creditScores').findOne({ 
      customerId: req.params.customerId 
    });
    
    // If not found in DB, use free credit score estimator
    if (!creditScore) {
      // Get customer data to estimate score
      const customer = await db.collection('customers').findOne({
        customerId: req.params.customerId
      });
      
      if (customer) {
        // Calculate age from DOB
        const age = customer.dob ? 
          Math.floor((new Date() - new Date(customer.dob)) / 31557600000) : 30;
        
        // Use free estimator
        const estimation = CreditScoreEstimator.generateBureauResponse({
          customerId: customer.customerId,
          monthlyIncome: customer.monthlyIncome,
          existingEMIs: customer.existingEMIs,
          employmentType: customer.employmentType,
          aadhaar: customer.aadhaar,
          panCard: customer.panCard,
          age: age,
          yearsAtCurrentJob: 2, // Default assumption
        });
        
        creditScore = estimation;
      } else {
        return res.status(404).json({ error: 'Customer not found' });
      }
    }
    
    res.json(creditScore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Offer Mart Service ============
app.get('/api/offers', async (req, res) => {
  try {
    const db = getDB();
    const offers = await db.collection('offers').find({}).toArray();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/calculate-emi', (req, res) => {
  try {
    const { principal, annualRate, tenureMonths } = req.body;
    
    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    const totalAmount = emi * tenureMonths;
    const totalInterest = totalAmount - principal;
    
    res.json({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal,
      interestRate: annualRate,
      tenure: tenureMonths
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ Underwriting Service ============
app.post('/api/underwrite', async (req, res) => {
  try {
    const { customerId, requestedAmount } = req.body;
    
    const db = getDB();
    const customer = await db.collection('customers').findOne({ customerId });
    const creditData = await db.collection('creditScores').findOne({ customerId });
    
    if (!customer || !creditData) {
      return res.status(404).json({ error: 'Customer or credit data not found' });
    }
    
    const result = evaluateLoan(customer, creditData.score, requestedAmount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function evaluateLoan(customer, creditScore, requestedAmount) {
  // Rule 1: Credit score must be >= 700
  if (creditScore < 700) {
    return {
      decision: 'REJECTED',
      reason: 'Credit score below minimum threshold (700)',
      creditScore,
      requestedAmount,
      approvedAmount: 0
    };
  }
  
  // Rule 2: Instant approval if amount <= pre-approved limit
  if (requestedAmount <= customer.preApprovedLimit) {
    return {
      decision: 'INSTANT_APPROVED',
      reason: 'Amount within pre-approved limit',
      creditScore,
      requestedAmount,
      approvedAmount: requestedAmount,
      conditions: []
    };
  }
  
  // Rule 3: Reject if amount > 2x pre-approved limit
  const maxAllowedAmount = customer.preApprovedLimit * 2;
  
  if (requestedAmount > maxAllowedAmount) {
    return {
      decision: 'REJECTED',
      reason: `Requested amount exceeds 2× pre-approved limit (₹${maxAllowedAmount.toLocaleString('en-IN')})`,
      creditScore,
      requestedAmount,
      approvedAmount: 0
    };
  }
  
  // Rule 4: Conditional approval (amount is between pre-approved and 2x pre-approved)
  // Check EMI to income ratio (must be <= 50%)
  const interestRate = calculateInterestRate(creditScore);
  const tenure = 36; // Assume 3 years for calculation
  const monthlyRate = interestRate / 12 / 100;
  const emi = (requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  
  const totalEMI = emi + customer.existingEMIs;
  const emiRatio = (totalEMI / customer.monthlyIncome) * 100;
  
  if (emiRatio > 50) {
    return {
      decision: 'REJECTED',
      reason: `Total EMI burden (${emiRatio.toFixed(1)}%) exceeds 50% of monthly income`,
      creditScore,
      requestedAmount,
      approvedAmount: 0
    };
  }
  
  // Conditional approval with salary slip requirement
  return {
    decision: 'CONDITIONAL_APPROVED',
    reason: 'Amount exceeds pre-approved limit but within acceptable risk (≤ 2× pre-approved). Requires document verification.',
    creditScore,
    requestedAmount,
    approvedAmount: requestedAmount,
    conditions: [
      'Latest 3 months salary slips required',
      'Bank statement for last 6 months required',
      'Employment verification letter required'
    ]
  };
}

function calculateInterestRate(creditScore) {
  if (creditScore >= 800) return 10.5;
  if (creditScore >= 750) return 11.5;
  if (creditScore >= 700) return 12.5;
  if (creditScore >= 650) return 13.5;
  return 15.0;
}

// ============ Groq Chat Proxy ============
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, temperature, max_tokens } = req.body;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: temperature || 0.7,
        max_tokens: max_tokens || 1024,
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// All non-API routes serve index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✓ FinSync AI running on port ${PORT}`);
  console.log(`✓ Frontend: http://localhost:${PORT}`);
  console.log(`✓ API: http://localhost:${PORT}/api`);
  console.log(`✓ Health: http://localhost:${PORT}/api/health\n`);
});
