// Free Credit Score Estimation Algorithm
// Based on financial indicators and industry standards

export class CreditScoreEstimator {
  /**
   * Estimate credit score based on available financial data
   * Returns score between 300-900 (Indian credit score range)
   */
  static estimate(params) {
    const {
      monthlyIncome,
      existingEMIs,
      employmentType,
      aadhaar, // For identity verification
      panCard, // For tax compliance check
      age,
      yearsAtCurrentJob = 2,
    } = params;

    let score = 500; // Base score (neutral)

    // 1. Income Factor (max +150 points)
    if (monthlyIncome >= 150000) score += 150;
    else if (monthlyIncome >= 100000) score += 120;
    else if (monthlyIncome >= 75000) score += 100;
    else if (monthlyIncome >= 50000) score += 80;
    else if (monthlyIncome >= 30000) score += 50;
    else if (monthlyIncome >= 20000) score += 30;

    // 2. EMI-to-Income Ratio (max +100 points or -100 points)
    const emiRatio = (existingEMIs / monthlyIncome) * 100;
    if (emiRatio === 0) score += 100; // No existing loans
    else if (emiRatio < 20) score += 80;
    else if (emiRatio < 30) score += 50;
    else if (emiRatio < 40) score += 20;
    else if (emiRatio < 50) score -= 20;
    else if (emiRatio < 60) score -= 50;
    else score -= 100; // Over-leveraged

    // 3. Employment Stability (max +80 points)
    if (employmentType === 'Salaried') {
      score += 50; // Salaried jobs are more stable
      if (yearsAtCurrentJob >= 5) score += 30;
      else if (yearsAtCurrentJob >= 3) score += 20;
      else if (yearsAtCurrentJob >= 1) score += 10;
    } else if (employmentType === 'Self-Employed') {
      score += 30; // Self-employed considered riskier
      if (yearsAtCurrentJob >= 5) score += 20;
      else if (yearsAtCurrentJob >= 3) score += 10;
    }

    // 4. Age Factor (max +50 points)
    if (age >= 35 && age <= 50) score += 50; // Prime earning age
    else if (age >= 30 && age < 35) score += 40;
    else if (age >= 25 && age < 30) score += 30;
    else if (age >= 50 && age < 60) score += 35;
    else if (age >= 21 && age < 25) score += 20;

    // 5. Identity Verification (max +50 points)
    if (aadhaar && panCard) {
      score += 50; // Both documents verified
    } else if (aadhaar || panCard) {
      score += 25; // One document verified
    }

    // 6. Add randomness to simulate real-world variation (±20 points)
    const randomVariation = Math.floor(Math.random() * 41) - 20;
    score += randomVariation;

    // Clamp score between 300 and 900
    score = Math.max(300, Math.min(900, score));

    return {
      score: Math.round(score),
      rating: this.getRating(score),
      factors: this.getFactorBreakdown(params),
      confidence: this.calculateConfidence(params),
    };
  }

  static getRating(score) {
    if (score >= 800) return 'Excellent';
    if (score >= 750) return 'Very Good';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 550) return 'Average';
    return 'Poor';
  }

  static getFactorBreakdown(params) {
    const { monthlyIncome, existingEMIs, employmentType } = params;
    const emiRatio = (existingEMIs / monthlyIncome) * 100;

    return {
      income: monthlyIncome >= 50000 ? 'Strong' : monthlyIncome >= 30000 ? 'Moderate' : 'Low',
      debtRatio: emiRatio < 30 ? 'Healthy' : emiRatio < 50 ? 'Moderate' : 'High Risk',
      employment: employmentType === 'Salaried' ? 'Stable' : 'Variable',
      verification: params.aadhaar && params.panCard ? 'Complete' : 'Partial',
    };
  }

  static calculateConfidence(params) {
    let confidence = 70; // Base confidence

    // Higher confidence if more data available
    if (params.aadhaar && params.panCard) confidence += 15;
    if (params.age) confidence += 5;
    if (params.yearsAtCurrentJob) confidence += 10;

    return Math.min(100, confidence);
  }

  /**
   * Simulate credit bureau API response format
   */
  static generateBureauResponse(params) {
    const estimation = this.estimate(params);
    
    return {
      customerId: params.customerId || `TEMP-${Date.now()}`,
      score: estimation.score,
      rating: estimation.rating,
      lastUpdated: new Date().toISOString(),
      bureau: 'Synthetic Estimator',
      confidence: estimation.confidence,
      factors: estimation.factors,
      recommendations: this.getRecommendations(estimation.score, params),
    };
  }

  static getRecommendations(score, params) {
    const recommendations = [];

    if (score < 700) {
      const emiRatio = (params.existingEMIs / params.monthlyIncome) * 100;
      
      if (emiRatio > 40) {
        recommendations.push('Reduce existing loan burden to improve credit score');
      }
      
      if (params.monthlyIncome < 30000) {
        recommendations.push('Consider increasing income sources');
      }
      
      recommendations.push('Start with smaller loan amounts to build credit history');
    }

    if (score >= 700 && score < 750) {
      recommendations.push('Maintain current EMI payments to improve score further');
      recommendations.push('You qualify for standard loan products');
    }

    if (score >= 750) {
      recommendations.push('Excellent credit profile - eligible for premium rates');
      recommendations.push('Pre-approved for higher loan limits');
    }

    return recommendations;
  }
}

// Free alternative: Use government APIs (if available)
export class GovernmentDataIntegration {
  /**
   * These are placeholder integrations for free government APIs
   * In production, you would need to register with these services
   */
  
  // DigiLocker API (Free for verified government documents)
  static async verifyAadhaar(aadhaarNumber) {
    // In production: https://digilocker.gov.in/
    // Requires: Government approval, API key (free for approved apps)
    
    return {
      verified: true,
      maskedAadhaar: `XXXX-XXXX-${aadhaarNumber.slice(-4)}`,
      name: 'Retrieved from DigiLocker',
    };
  }

  // Income Tax Department API (Free for PAN verification)
  static async verifyPAN(panNumber) {
    // In production: https://www.incometax.gov.in/
    // Requires: TIN-NSDL registration (free)
    
    return {
      verified: true,
      panNumber: panNumber.toUpperCase(),
      status: 'Active',
    };
  }

  // EPFO API (Free for employment verification)
  static async verifyEmployment(uanNumber) {
    // In production: https://unifiedportal-mem.epfindia.gov.in/
    // Requires: EPFO registration (free)
    
    return {
      verified: true,
      employmentStatus: 'Active',
      lastContribution: new Date(),
    };
  }
}

export default CreditScoreEstimator;
