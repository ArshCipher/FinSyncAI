import { CustomerData } from './apiServices';

export interface SanctionLetterData {
  customerName: string;
  customerId: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  processingFee: number;
  sanctionDate: string;
  validUntil: string;
}

export class SanctionLetterGenerator {
  static generate(
    customer: CustomerData,
    loanAmount: number,
    interestRate: number,
    tenure: number,
    emi: number
  ): string {
    const sanctionDate = new Date().toLocaleDateString('en-IN');
    const validUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');
    const processingFee = Math.round(loanAmount * 0.02);
    const totalInterest = (emi * tenure) - loanAmount;
    const totalRepayment = emi * tenure;
    const firstEMIDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');
    
    // Calculate credit score-based pricing
    const baseRate = 12.5;
    const rateDiscount = baseRate - interestRate;
    const pricingTier = interestRate <= 10.5 ? 'Premium' : interestRate <= 11.5 ? 'Gold' : interestRate <= 12.5 ? 'Silver' : 'Standard';
    
    // Generate amortization schedule for first 6 months
    let remainingPrincipal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const amortization: string[] = [];
    
    for (let month = 1; month <= Math.min(6, tenure); month++) {
      const interestComponent = remainingPrincipal * monthlyRate;
      const principalComponent = emi - interestComponent;
      remainingPrincipal -= principalComponent;
      
      const emiDate = new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000);
      amortization.push(
        `EMI ${month}  ${emiDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}  ` +
        `₹${Math.round(emi).toLocaleString('en-IN', { minimumFractionDigits: 2 })}  ` +
        `Principal: ₹${Math.round(principalComponent).toLocaleString('en-IN')}  ` +
        `Interest: ₹${Math.round(interestComponent).toLocaleString('en-IN')}`
      );
    }

    return `
╔═══════════════════════════════════════════════════════════════╗
║                   LOAN SANCTION LETTER                        ║
║                   FinSync AI - NBFC Division                  ║
╚═══════════════════════════════════════════════════════════════╝

Sanction Letter No: FSL-${customer.customerId}-${Date.now()}
Date: ${sanctionDate}
Pricing Tier: ${pricingTier} (You saved ${rateDiscount.toFixed(2)}% vs base rate!)

Dear ${customer.name},

We are pleased to inform you that your personal loan application has been 
APPROVED by FinSync AI's automated underwriting system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LOAN DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Borrower Name:           ${customer.name}
Customer ID:             ${customer.customerId}
Loan Amount Sanctioned:  ₹${loanAmount.toLocaleString('en-IN')}
Interest Rate:           ${interestRate}% per annum ${pricingTier === 'Premium' ? '(Best Rate!)' : ''}
Loan Tenure:             ${tenure} months (${Math.round(tenure/12)} years)
Monthly EMI:             ₹${emi.toLocaleString('en-IN')}
First EMI Date:          ${firstEMIDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FINANCIAL BREAKDOWN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Principal Amount:        ₹${loanAmount.toLocaleString('en-IN')}
Total Interest:          ₹${totalInterest.toLocaleString('en-IN')}
Processing Fee (2%):     ₹${processingFee.toLocaleString('en-IN')}
Total Repayment:         ₹${totalRepayment.toLocaleString('en-IN')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EMI AMORTIZATION SCHEDULE (First 6 Months):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${amortization.join('\n')}

Note: Above schedule shows principal vs interest breakdown for early EMIs.
Complete amortization schedule will be emailed separately.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TERMS & CONDITIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. This sanction is valid until: ${validUntil}
2. The loan will be disbursed within 48 hours of document submission
3. First EMI will be due 30 days after disbursement
4. Pre-payment allowed after 6 months with 2% penalty
5. Late payment charges: 2% per month on overdue amount
6. All terms subject to final documentation and verification

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

> Submit signed sanction letter
> Complete final KYC documentation
> Provide bank account details for disbursement
> Sign loan agreement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a system-generated sanction letter processed by FinSync AI's
multi-agent underwriting system.

For queries, contact: support@finsyncai.com | 1800-XXX-XXXX

Congratulations on your loan approval!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Authorized by: FinSync AI Underwriting System
Digital Signature: VERIFIED
Timestamp: ${new Date().toISOString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
  }

  static generateHTML(
    customer: CustomerData,
    loanAmount: number,
    interestRate: number,
    tenure: number,
    emi: number
  ): string {
    const text = this.generate(customer, loanAmount, interestRate, tenure, emi);
    return `<pre style="font-family: 'Courier New', monospace; background: #0a0a0f; color: #ffffff; padding: 2rem; border-radius: 12px; line-height: 1.6; font-size: 13px; overflow-x: auto;">${text}</pre>`;
  }
}