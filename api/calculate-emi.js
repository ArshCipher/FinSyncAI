// Vercel Serverless Function for EMI Calculation
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
    const { principal, annualRate, tenureMonths } = req.body;

    if (!principal || !annualRate || !tenureMonths) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    const totalAmount = emi * tenureMonths;
    const totalInterest = totalAmount - principal;

    return res.status(200).json({
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal,
      tenure: tenureMonths,
      interestRate: annualRate
    });
  } catch (error) {
    console.error('EMI Calculation Error:', error);
    return res.status(500).json({ 
      error: 'EMI calculation failed',
      message: error.message 
    });
  }
}
