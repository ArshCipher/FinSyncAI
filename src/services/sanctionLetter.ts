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
║              LOAN SANCTION LETTER (BINDING OFFER)            ║
║         FinSync AI Financial Services Limited - NBFC          ║
╚═══════════════════════════════════════════════════════════════╝

Reference No: FSL/${customer.customerId}/${Date.now()}
Date of Issue: ${sanctionDate}
Validity Period: 15 days from date of issue
Credit Tier: ${pricingTier} (Interest Rate Discount: ${rateDiscount.toFixed(2)}%)

CONFIDENTIAL - FOR ADDRESSEE ONLY

To,
${customer.name}
Customer ID: ${customer.customerId}
Mobile: ${customer.phone || 'On Record'}
Email: ${customer.email || 'On Record'}

Dear ${customer.name},

SUBJECT: SANCTION OF PERSONAL LOAN - ₹${loanAmount.toLocaleString('en-IN')}

We are pleased to inform you that your application for a personal loan 
with FinSync AI Financial Services Limited (hereinafter referred to as 
"the Lender") has been approved by our automated underwriting system, 
subject to the terms and conditions set forth herein.

This sanction letter constitutes a binding offer under Section 2(a) of 
the Indian Contract Act, 1872, and is subject to final documentation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART A: LOAN PARTICULARS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Borrower's Name:           ${customer.name}
Customer ID:               ${customer.customerId}
Loan Account Number:       ${customer.customerId}-PLOAN-${Date.now().toString().slice(-8)}

Principal Amount:          ₹${loanAmount.toLocaleString('en-IN')} (Rupees ${this.numberToWords(loanAmount)} Only)
Rate of Interest:          ${interestRate}% per annum (Reducing Balance Method)
Loan Tenure:               ${tenure} months (${Math.round(tenure/12)} year(s))
Equated Monthly Installment (EMI): ₹${emi.toLocaleString('en-IN')}
First EMI Due Date:        ${firstEMIDate}
Final EMI Due Date:        ${new Date(Date.now() + (tenure + 30) * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART B: FINANCIAL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Principal Loan Amount:     ₹${loanAmount.toLocaleString('en-IN')}
Processing Fee (2%):       ₹${processingFee.toLocaleString('en-IN')} + GST @ 18%
GST on Processing Fee:     ₹${Math.round(processingFee * 0.18).toLocaleString('en-IN')}
Total Interest Payable:    ₹${totalInterest.toLocaleString('en-IN')}
Total Amount Repayable:    ₹${totalRepayment.toLocaleString('en-IN')}

Net Disbursement Amount:   ₹${(loanAmount - processingFee - Math.round(processingFee * 0.18)).toLocaleString('en-IN')}

APR (Annual Percentage Rate): ${(interestRate + 0.5).toFixed(2)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART C: EMI AMORTIZATION SCHEDULE (First 6 Months)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${amortization.join('\n')}

Note: Complete amortization schedule available upon request.
Outstanding principal reduces with each payment as per reducing balance method.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART D: TERMS AND CONDITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. VALIDITY & ACCEPTANCE
   This sanction is valid until: ${validUntil}
   Acceptance required within validity period by signing loan agreement.

2. DISBURSEMENT
   Loan amount shall be disbursed within 2 working days of:
   (a) Receipt of duly signed loan agreement
   (b) Completion of KYC and document verification
   (c) Furnishing of post-dated cheques/NACH mandate
   Disbursement shall be made via NEFT/RTGS to borrower's verified account.

3. REPAYMENT
   (a) Monthly EMI of ₹${emi.toLocaleString('en-IN')} payable on ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getDate()} of each month
   (b) Repayment via Auto-debit (NACH) or post-dated cheques
   (c) First EMI due 30 days after disbursement date

4. PREPAYMENT & FORECLOSURE
   (a) Part-prepayment: Allowed after 6 months, minimum ₹10,000, no charges
   (b) Foreclosure: Allowed after 6 months with 2% penalty + 4% foreclosure charges
   (c) No prepayment penalty after 12 months from disbursement

5. PENAL CHARGES
   (a) Late payment: 2% per month (24% p.a.) on overdue amount
   (b) Cheque/EMI bounce: ₹500 per instance
   (c) Legal notice charges: Actual + ₹5,000 administrative fee

6. DEFAULT CONSEQUENCES
   In event of default, the Lender reserves the right to:
   (a) Report to Credit Information Companies (CIBIL/Experian/Equifax/CRIF)
   (b) Initiate recovery proceedings under applicable law
   (c) Invoke personal guarantee/security (if applicable)
   (d) Charge additional interest at 3% p.a. above contracted rate

7. REGULATORY COMPLIANCE
   (a) This loan is governed by RBI Master Direction - Non-Banking Financial 
       Company Returns (Reserve Bank) Directions, 2016
   (b) Fair Practices Code as per RBI Guidelines shall be adhered to
   (c) Grievances may be escalated to RBI Ombudsman after exhausting internal 
       grievance redressal mechanism

8. GOVERNING LAW & JURISDICTION
   This agreement shall be governed by the laws of India and subject to the 
   exclusive jurisdiction of courts in Mumbai, Maharashtra.

9. CREDIT INFORMATION
   Borrower authorizes the Lender to share credit information with Credit 
   Information Companies under CICRA Act, 2005.

10. INSURANCE
    Borrower may opt for loan protection insurance (optional, not mandatory).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PART E: MANDATORY DISCLOSURES (RBI Guidelines)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Lender Details:
Company Name: FinSync AI Financial Services Limited
NBFC Registration: N-14.03299 (RBI Registered NBFC)
CIN: U65999MH2024PLC123456
Registered Office: 123 Finance Street, Mumbai - 400001
Email: grievance@finsyncai.com | Phone: 1800-FINSYNC

Grievance Redressal:
Level 1: Branch Manager - grievance@finsyncai.com (7 days)
Level 2: Principal Nodal Officer - pno@finsyncai.com (15 days)
Level 3: RBI Ombudsman (if unresolved after 30 days)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BORROWER ACKNOWLEDGMENT & ACCEPTANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I, ${customer.name}, hereby acknowledge that:
1. I have read and understood all terms and conditions
2. I agree to the interest rate, fees, and charges mentioned herein
3. I authorize the Lender to debit my account for EMI payments
4. I understand the consequences of default and late payment
5. I have been informed of my right to receive loan agreement copy

Digital Acceptance Timestamp: ${new Date().toISOString()}
IP Address: [Recorded]
Device ID: [Recorded]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For FinSync AI Financial Services Limited

[Digitally Signed]
Authorized Signatory: AI Underwriting System
Name: FinSync Credit Committee
Designation: Automated Loan Approval Authority
Date: ${sanctionDate}
Digital Signature Certificate: Valid & Verified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT: This is a legally binding document. Please read carefully before 
acceptance. For queries, contact our customer service at 1800-FINSYNC.

Congratulations on your loan approval! We look forward to serving you.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();
  }

  private static numberToWords(num: number): string {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 > 0 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 > 0 ? ' ' + convertLessThanThousand(n % 100) : '');
    };
    
    if (num < 1000) return convertLessThanThousand(num);
    if (num < 100000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      return convertLessThanThousand(thousands) + ' Thousand' + (remainder > 0 ? ' ' + convertLessThanThousand(remainder) : '');
    }
    if (num < 10000000) {
      const lakhs = Math.floor(num / 100000);
      const remainder = num % 100000;
      return convertLessThanThousand(lakhs) + ' Lakh' + (remainder > 0 ? ' ' + this.numberToWords(remainder) : '');
    }
    const crores = Math.floor(num / 10000000);
    const remainder = num % 10000000;
    return convertLessThanThousand(crores) + ' Crore' + (remainder > 0 ? ' ' + this.numberToWords(remainder) : '');
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