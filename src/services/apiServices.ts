// API-based services for NBFC loan system

export interface CustomerData {
  customerId: string;
  name: string;
  phone: string;
  email: string;
  panCard: string;
  aadhaar: string;
  dob: string;
  address: string;
  employmentType: 'Salaried' | 'Self-Employed';
  employer: string;
  monthlyIncome: number;
  existingEMIs: number;
  preApprovedLimit: number;
}

export interface CreditScore {
  customerId: string;
  score: number;
  lastUpdated: Date;
}

export interface UnderwritingResult {
  decision: 'INSTANT_APPROVED' | 'CONDITIONAL_APPROVED' | 'REJECTED';
  reason: string;
  creditScore: number;
  requestedAmount: number;
  approvedAmount: number;
  conditions?: string[];
}

export interface LoanOffer {
  productId: string;
  productName: string;
  minAmount: number;
  maxAmount: number;
  minTenure: number;
  maxTenure: number;
  processingFee: number;
  minCreditScore: number;
}

// Use relative URL for production, localhost for development
const API_BASE_URL = import.meta.env.PROD 
  ? '/api'  // Production (Railway) - use relative path
  : 'http://localhost:5000/api';  // Development - use localhost

// CRM Service - Customer Lookup
export const CRMService = {
  getCustomerByPhone: async (phone: string): Promise<CustomerData | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/phone/${encodeURIComponent(phone)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching customer by phone:', error);
      return null;
    }
  },
  
  getCustomerByEmail: async (email: string): Promise<CustomerData | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/email/${encodeURIComponent(email)}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching customer by email:', error);
      return null;
    }
  },
  
  getCustomerById: async (customerId: string): Promise<CustomerData | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers/id/${customerId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching customer by ID:', error);
      return null;
    }
  },
};

// Credit Bureau Service
export const CreditBureauService = {
  getCreditScore: async (customerId: string): Promise<CreditScore | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/credit-score/${customerId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching credit score:', error);
      return null;
    }
  },
};

// Offer Mart Service
export const OfferMartService = {
  getAllOffers: async (): Promise<LoanOffer[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/offers`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching offers:', error);
      return [];
    }
  },
  
  calculateEMI: async (principal: number, annualRate: number, tenureMonths: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/calculate-emi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ principal, annualRate, tenureMonths }),
      });
      if (!response.ok) throw new Error('EMI calculation failed');
      return await response.json();
    } catch (error) {
      console.error('Error calculating EMI:', error);
      return null;
    }
  },
};

// Underwriting Engine
export const UnderwritingEngine = {
  evaluateLoan: async (customer: CustomerData, creditScore: number, requestedAmount: number): Promise<UnderwritingResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/underwrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer.customerId, requestedAmount }),
      });
      if (!response.ok) throw new Error('Underwriting failed');
      return await response.json();
    } catch (error) {
      console.error('Error evaluating loan:', error);
      return {
        decision: 'REJECTED',
        reason: 'Underwriting service unavailable',
        creditScore,
        requestedAmount,
        approvedAmount: 0,
      };
    }
  },
};
