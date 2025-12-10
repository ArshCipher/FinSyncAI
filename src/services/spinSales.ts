// SPIN Selling Methodology Implementation
export type SpinStage = 'SITUATION' | 'PROBLEM' | 'IMPLICATION' | 'NEED_PAYOFF';

export interface SpinQuestion {
  stage: SpinStage;
  question: string;
  context: string;
}

export class SpinSalesEngine {
  private currentStage: SpinStage = 'SITUATION';
  private collectedData: Record<string, any> = {};

  // Situation Questions - gather facts about customer's current situation
  private situationQuestions: SpinQuestion[] = [
    {
      stage: 'SITUATION',
      question: "To better understand your needs, could you tell me about your current financial situation? Do you have any existing loans or EMIs?",
      context: "Understanding baseline financial status"
    },
    {
      stage: 'SITUATION',
      question: "What is your current monthly income and employment status?",
      context: "Assessing income stability"
    },
    {
      stage: 'SITUATION',
      question: "How long have you been with your current employer?",
      context: "Evaluating job stability"
    }
  ];

  // Problem Questions - identify difficulties or dissatisfactions
  private problemQuestions: SpinQuestion[] = [
    {
      stage: 'PROBLEM',
      question: "What specific need or goal is prompting you to consider a personal loan right now?",
      context: "Identifying pain point"
    },
    {
      stage: 'PROBLEM',
      question: "Have you explored other financing options? What challenges did you face?",
      context: "Understanding previous barriers"
    },
    {
      stage: 'PROBLEM',
      question: "Is there a time constraint or urgency for this funding?",
      context: "Assessing urgency level"
    }
  ];

  // Implication Questions - explore consequences of the problem
  private implicationQuestions: SpinQuestion[] = [
    {
      stage: 'IMPLICATION',
      question: "If you don't get this funding in time, how would that affect your plans?",
      context: "Highlighting consequences"
    },
    {
      stage: 'IMPLICATION',
      question: "How much would a delay or inability to get this loan cost you - financially or in terms of opportunities?",
      context: "Quantifying impact"
    },
    {
      stage: 'IMPLICATION',
      question: "Beyond the immediate need, what other areas of your life would benefit from having this financial flexibility?",
      context: "Expanding problem awareness"
    }
  ];

  // Need-Payoff Questions - focus on value of solution
  private needPayoffQuestions: SpinQuestion[] = [
    {
      stage: 'NEED_PAYOFF',
      question: "How would having instant loan approval with competitive rates help your situation?",
      context: "Building solution value"
    },
    {
      stage: 'NEED_PAYOFF',
      question: "If you could get this loan approved within minutes with minimal documentation, how valuable would that be to you?",
      context: "Emphasizing speed benefit"
    },
    {
      stage: 'NEED_PAYOFF',
      question: "What would it mean for you to have flexible repayment options and no hidden charges?",
      context: "Highlighting transparency"
    }
  ];

  getCurrentStage(): SpinStage {
    return this.currentStage;
  }

  getNextQuestion(context: Record<string, any>): SpinQuestion | null {
    this.collectedData = { ...this.collectedData, ...context };

    switch (this.currentStage) {
      case 'SITUATION':
        if (this.hasSituationData()) {
          this.currentStage = 'PROBLEM';
          return this.getRandomQuestion(this.problemQuestions);
        }
        return this.getRandomQuestion(this.situationQuestions);

      case 'PROBLEM':
        if (this.hasProblemData()) {
          this.currentStage = 'IMPLICATION';
          return this.getRandomQuestion(this.implicationQuestions);
        }
        return this.getRandomQuestion(this.problemQuestions);

      case 'IMPLICATION':
        if (this.hasImplicationData()) {
          this.currentStage = 'NEED_PAYOFF';
          return this.getRandomQuestion(this.needPayoffQuestions);
        }
        return this.getRandomQuestion(this.implicationQuestions);

      case 'NEED_PAYOFF':
        // SPIN cycle complete, move to closing
        return null;

      default:
        return null;
    }
  }

  private hasSituationData(): boolean {
    return !!(
      this.collectedData.income &&
      this.collectedData.employer &&
      this.collectedData.existingEMIs !== undefined
    );
  }

  private hasProblemData(): boolean {
    return !!(
      this.collectedData.loanPurpose &&
      this.collectedData.requestedAmount
    );
  }

  private hasImplicationData(): boolean {
    return !!(
      this.collectedData.urgency !== undefined ||
      this.collectedData.consequencesDiscussed === true
    );
  }

  private getRandomQuestion(questions: SpinQuestion[]): SpinQuestion {
    return questions[Math.floor(Math.random() * questions.length)];
  }

  generateSpinPrompt(stage: SpinStage, customerContext: string): string {
    const stageDescriptions = {
      SITUATION: "You are in the SITUATION stage. Ask factual questions to understand the customer's current financial state. Be conversational and gather basic information about income, employment, and existing loans.",
      PROBLEM: "You are in the PROBLEM stage. Now that you know their situation, identify their specific pain points or needs. Ask about what's driving them to seek a loan, what challenges they face, and what they're trying to achieve.",
      IMPLICATION: "You are in the IMPLICATION stage. Help the customer understand the consequences of not solving their problem. Ask questions that make them realize the cost of inaction or delay in getting financing.",
      NEED_PAYOFF: "You are in the NEED_PAYOFF stage. Focus on the value of your solution. Ask questions that get the customer to tell you why your instant approval process, competitive rates, and transparent terms are valuable to them."
    };

    return `${stageDescriptions[stage]}

Customer Context: ${customerContext}

Guidelines:
- Ask one question at a time
- Listen actively to their response before moving forward
- Use their language and concerns to frame your questions
- Build trust through genuine interest in their situation
- Smoothly guide them toward seeing the value of your loan product`;
  }

  reset(): void {
    this.currentStage = 'SITUATION';
    this.collectedData = {};
  }

  getProgress(): { stage: SpinStage; completionPercent: number } {
    const stageProgress = {
      'SITUATION': 25,
      'PROBLEM': 50,
      'IMPLICATION': 75,
      'NEED_PAYOFF': 100
    };
    return {
      stage: this.currentStage,
      completionPercent: stageProgress[this.currentStage]
    };
  }
}
