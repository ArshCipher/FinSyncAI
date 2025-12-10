// EMI Affordability Calculator with Smart Suggestions
export interface AffordabilityAnalysis {
  canAfford: boolean;
  requestedAmount: number;
  requestedEMI: number;
  maxAffordableAmount: number;
  maxAffordableEMI: number;
  monthlyIncome: number;
  existingEMIs: number;
  availableIncome: number;
  emiToIncomeRatio: number;
  maxSafeRatio: number;
  suggestions: string[];
  alternativeOptions: LoanOption[];
}

export interface LoanOption {
  amount: number;
  tenure: number;
  emi: number;
  interestRate: number;
  totalInterest: number;
  totalPayment: number;
  savings?: number;
}

export class EMIAffordabilityCalculator {
  private readonly MAX_EMI_RATIO = 0.50; // 50% of monthly income
  private readonly RECOMMENDED_RATIO = 0.40; // 40% recommended for comfort

  calculateAffordability(
    monthlyIncome: number,
    existingEMIs: number,
    requestedAmount: number,
    interestRate: number,
    tenure: number
  ): AffordabilityAnalysis {
    const requestedEMI = this.calculateEMI(requestedAmount, interestRate, tenure);
    const totalEMI = existingEMIs + requestedEMI;
    const emiToIncomeRatio = totalEMI / monthlyIncome;
    
    const availableIncome = monthlyIncome - existingEMIs;
    const maxSafeEMI = (monthlyIncome * this.MAX_EMI_RATIO) - existingEMIs;
    const maxAffordableAmount = this.calculateMaxLoanAmount(maxSafeEMI, interestRate, tenure);
    
    const canAfford = emiToIncomeRatio <= this.MAX_EMI_RATIO;
    
    const suggestions: string[] = [];
    const alternativeOptions: LoanOption[] = [];

    if (!canAfford) {
      // Generate suggestions for unaffordable loans
      suggestions.push(
        `Your requested EMI of ₹${requestedEMI.toLocaleString('en-IN')} exceeds your affordability limit.`
      );
      suggestions.push(
        `Maximum recommended EMI: ₹${maxSafeEMI.toLocaleString('en-IN')} (50% of income after existing EMIs)`
      );
      suggestions.push(
        `Maximum affordable loan amount: ₹${Math.floor(maxAffordableAmount).toLocaleString('en-IN')}`
      );

      // Generate alternative options
      alternativeOptions.push(
        ...this.generateAlternatives(maxAffordableAmount, interestRate, tenure)
      );

    } else if (emiToIncomeRatio > this.RECOMMENDED_RATIO) {
      // Warn about high EMI ratio
      suggestions.push(
        `⚠️ Your EMI-to-income ratio is ${(emiToIncomeRatio * 100).toFixed(1)}%, which is above our recommended 40% threshold.`
      );
      suggestions.push(
        `While approved, consider reducing the loan amount to ₹${Math.floor(maxAffordableAmount * 0.8).toLocaleString('en-IN')} for better financial flexibility.`
      );
      
      // Show more comfortable alternatives
      alternativeOptions.push(
        ...this.generateAlternatives(maxAffordableAmount * 0.8, interestRate, tenure)
      );

    } else {
      // Customer is comfortably within limits
      suggestions.push(
        `✅ Great! Your EMI is ${(emiToIncomeRatio * 100).toFixed(1)}% of your income - well within safe limits.`
      );
      suggestions.push(
        `You have room to borrow up to ₹${Math.floor(maxAffordableAmount).toLocaleString('en-IN')} if needed.`
      );
    }

    return {
      canAfford,
      requestedAmount,
      requestedEMI,
      maxAffordableAmount,
      maxAffordableEMI: maxSafeEMI,
      monthlyIncome,
      existingEMIs,
      availableIncome,
      emiToIncomeRatio,
      maxSafeRatio: this.MAX_EMI_RATIO,
      suggestions,
      alternativeOptions
    };
  }

  private generateAlternatives(
    baseAmount: number,
    interestRate: number,
    baseTenure: number
  ): LoanOption[] {
    const alternatives: LoanOption[] = [];

    // Option 1: Reduced amount, same tenure
    const reducedAmount = Math.floor(baseAmount * 0.9);
    alternatives.push(this.createLoanOption(reducedAmount, baseTenure, interestRate));

    // Option 2: Same amount, longer tenure (if possible)
    if (baseTenure < 60) {
      const longerTenure = Math.min(60, baseTenure + 12);
      alternatives.push(this.createLoanOption(baseAmount, longerTenure, interestRate));
    }

    // Option 3: 80% amount, original tenure
    const amount80 = Math.floor(baseAmount * 0.8);
    alternatives.push(this.createLoanOption(amount80, baseTenure, interestRate));

    // Sort by EMI amount
    return alternatives
      .sort((a, b) => a.emi - b.emi)
      .slice(0, 3); // Return top 3 options
  }

  private createLoanOption(
    amount: number,
    tenure: number,
    interestRate: number
  ): LoanOption {
    const emi = this.calculateEMI(amount, interestRate, tenure);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - amount;

    return {
      amount: Math.floor(amount),
      tenure,
      emi: Math.ceil(emi),
      interestRate,
      totalInterest: Math.ceil(totalInterest),
      totalPayment: Math.ceil(totalPayment)
    };
  }

  calculateEMI(principal: number, annualRate: number, tenureMonths: number): number {
    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return emi;
  }

  private calculateMaxLoanAmount(emi: number, annualRate: number, tenure: number): number {
    const monthlyRate = annualRate / 12 / 100;
    const amount = (emi * (Math.pow(1 + monthlyRate, tenure) - 1)) / 
                   (monthlyRate * Math.pow(1 + monthlyRate, tenure));
    return amount;
  }

  formatAffordabilityMessage(analysis: AffordabilityAnalysis): string {
    let message = `\n📊 EMI AFFORDABILITY ANALYSIS\n${'━'.repeat(50)}\n\n`;
    
    message += `Monthly Income: ₹${analysis.monthlyIncome.toLocaleString('en-IN')}\n`;
    message += `Existing EMIs: ₹${analysis.existingEMIs.toLocaleString('en-IN')}\n`;
    message += `Available Income: ₹${analysis.availableIncome.toLocaleString('en-IN')}\n\n`;
    
    message += `Requested Loan: ₹${analysis.requestedAmount.toLocaleString('en-IN')}\n`;
    message += `Requested EMI: ₹${analysis.requestedEMI.toLocaleString('en-IN')}\n`;
    message += `EMI-to-Income Ratio: ${(analysis.emiToIncomeRatio * 100).toFixed(1)}%\n\n`;
    
    message += `${analysis.suggestions.join('\n\n')}\n`;

    if (analysis.alternativeOptions.length > 0) {
      message += `\n\n💡 ALTERNATIVE LOAN OPTIONS:\n${'━'.repeat(50)}\n`;
      analysis.alternativeOptions.forEach((option, idx) => {
        message += `\nOption ${idx + 1}:\n`;
        message += `  Amount: ₹${option.amount.toLocaleString('en-IN')}\n`;
        message += `  Tenure: ${option.tenure} months (${Math.round(option.tenure/12)} years)\n`;
        message += `  EMI: ₹${option.emi.toLocaleString('en-IN')}\n`;
        message += `  Total Interest: ₹${option.totalInterest.toLocaleString('en-IN')}\n`;
      });
    }

    return message;
  }
}
