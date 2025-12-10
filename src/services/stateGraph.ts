// LangGraph-style state machine for conversation flow
export type ConversationState = 
  | 'INITIAL'
  | 'GREETING'
  | 'IDENTIFICATION'
  | 'KYC_COLLECTION'
  | 'LOAN_INQUIRY'
  | 'AMOUNT_DISCUSSION'
  | 'ELIGIBILITY_CHECK'
  | 'UNDERWRITING'
  | 'CONDITIONAL_APPROVAL'
  | 'DOCUMENT_UPLOAD'
  | 'FINAL_APPROVAL'
  | 'REJECTION'
  | 'SANCTION_LETTER'
  | 'FAREWELL';

export type AgentType = 'MASTER' | 'SALES' | 'VERIFICATION' | 'UNDERWRITING' | 'SANCTION';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface StateTransition {
  from: ConversationState;
  to: ConversationState;
  condition: (context: any) => boolean;
  agent: AgentType;
  parallelTasks?: string[];
}

export interface StateNode {
  state: ConversationState;
  agent: AgentType;
  transitions: StateTransition[];
  parallelExecutable: boolean;
  requiredData?: string[];
}

// Define the state graph
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const STATE_GRAPH = new Map<ConversationState, StateNode>([
  ['INITIAL', {
    state: 'INITIAL',
    agent: 'MASTER',
    parallelExecutable: false,
    transitions: [
      {
        from: 'INITIAL',
        to: 'GREETING',
        condition: (ctx) => ctx.messages.length === 0,
        agent: 'SALES'
      }
    ]
  }],
  ['GREETING', {
    state: 'GREETING',
    agent: 'SALES',
    parallelExecutable: false,
    transitions: [
      {
        from: 'GREETING',
        to: 'IDENTIFICATION',
        condition: (ctx) => ctx.messages.length > 0 && !ctx.customer,
        agent: 'VERIFICATION',
        parallelTasks: ['checkPhone', 'checkEmail']
      }
    ]
  }],
  ['IDENTIFICATION', {
    state: 'IDENTIFICATION',
    agent: 'VERIFICATION',
    parallelExecutable: true,
    requiredData: ['phone', 'email'],
    transitions: [
      {
        from: 'IDENTIFICATION',
        to: 'KYC_COLLECTION',
        condition: (ctx) => !ctx.customer && ctx.hasContactInfo,
        agent: 'VERIFICATION'
      },
      {
        from: 'IDENTIFICATION',
        to: 'LOAN_INQUIRY',
        condition: (ctx) => ctx.customer !== null,
        agent: 'SALES',
        parallelTasks: ['fetchCreditScore', 'fetchExistingLoans']
      }
    ]
  }],
  ['KYC_COLLECTION', {
    state: 'KYC_COLLECTION',
    agent: 'VERIFICATION',
    parallelExecutable: false,
    requiredData: ['name', 'dob', 'pan', 'address', 'employer', 'income', 'existingEMIs'],
    transitions: [
      {
        from: 'KYC_COLLECTION',
        to: 'LOAN_INQUIRY',
        condition: (ctx) => ctx.prospectData?.existingEMIs !== undefined,
        agent: 'SALES'
      }
    ]
  }],
  ['LOAN_INQUIRY', {
    state: 'LOAN_INQUIRY',
    agent: 'SALES',
    parallelExecutable: false,
    transitions: [
      {
        from: 'LOAN_INQUIRY',
        to: 'AMOUNT_DISCUSSION',
        condition: (ctx) => ctx.loanPurpose !== null,
        agent: 'SALES'
      }
    ]
  }],
  ['AMOUNT_DISCUSSION', {
    state: 'AMOUNT_DISCUSSION',
    agent: 'SALES',
    parallelExecutable: false,
    transitions: [
      {
        from: 'AMOUNT_DISCUSSION',
        to: 'ELIGIBILITY_CHECK',
        condition: (ctx) => ctx.requestedAmount > 0 && ctx.tenure > 0,
        agent: 'UNDERWRITING'
      }
    ]
  }],
  ['ELIGIBILITY_CHECK', {
    state: 'ELIGIBILITY_CHECK',
    agent: 'UNDERWRITING',
    parallelExecutable: true,
    transitions: [
      {
        from: 'ELIGIBILITY_CHECK',
        to: 'UNDERWRITING',
        condition: (ctx) => ctx.eligibilityPassed === true,
        agent: 'UNDERWRITING',
        parallelTasks: ['calculateEMI', 'checkAffordability', 'assessRisk']
      },
      {
        from: 'ELIGIBILITY_CHECK',
        to: 'REJECTION',
        condition: (ctx) => ctx.eligibilityPassed === false,
        agent: 'UNDERWRITING'
      }
    ]
  }],
  ['UNDERWRITING', {
    state: 'UNDERWRITING',
    agent: 'UNDERWRITING',
    parallelExecutable: true,
    transitions: [
      {
        from: 'UNDERWRITING',
        to: 'FINAL_APPROVAL',
        condition: (ctx) => ctx.decision === 'Instant Approval',
        agent: 'SANCTION'
      },
      {
        from: 'UNDERWRITING',
        to: 'CONDITIONAL_APPROVAL',
        condition: (ctx) => ctx.decision === 'Conditional Approval',
        agent: 'UNDERWRITING'
      },
      {
        from: 'UNDERWRITING',
        to: 'REJECTION',
        condition: (ctx) => ctx.decision === 'Reject',
        agent: 'UNDERWRITING'
      }
    ]
  }],
  ['CONDITIONAL_APPROVAL', {
    state: 'CONDITIONAL_APPROVAL',
    agent: 'UNDERWRITING',
    parallelExecutable: false,
    transitions: [
      {
        from: 'CONDITIONAL_APPROVAL',
        to: 'DOCUMENT_UPLOAD',
        condition: (ctx) => ctx.awaitingDocument === true,
        agent: 'VERIFICATION'
      }
    ]
  }],
  ['DOCUMENT_UPLOAD', {
    state: 'DOCUMENT_UPLOAD',
    agent: 'VERIFICATION',
    parallelExecutable: false,
    transitions: [
      {
        from: 'DOCUMENT_UPLOAD',
        to: 'FINAL_APPROVAL',
        condition: (ctx) => ctx.documentVerified === true && ctx.finalDecision === 'Approved',
        agent: 'SANCTION'
      },
      {
        from: 'DOCUMENT_UPLOAD',
        to: 'REJECTION',
        condition: (ctx) => ctx.documentVerified === true && ctx.finalDecision === 'Reject',
        agent: 'UNDERWRITING'
      }
    ]
  }],
  ['FINAL_APPROVAL', {
    state: 'FINAL_APPROVAL',
    agent: 'SANCTION',
    parallelExecutable: false,
    transitions: [
      {
        from: 'FINAL_APPROVAL',
        to: 'SANCTION_LETTER',
        condition: (ctx) => ctx.sanctionLetterGenerated === true,
        agent: 'SANCTION'
      }
    ]
  }],
  ['SANCTION_LETTER', {
    state: 'SANCTION_LETTER',
    agent: 'SANCTION',
    parallelExecutable: true,
    transitions: [
      {
        from: 'SANCTION_LETTER',
        to: 'FAREWELL',
        condition: (ctx) => ctx.letterDelivered === true,
        agent: 'SALES',
        parallelTasks: ['generatePDF', 'sendEmail', 'logTransaction']
      }
    ]
  }],
  ['REJECTION', {
    state: 'REJECTION',
    agent: 'UNDERWRITING',
    parallelExecutable: false,
    transitions: [
      {
        from: 'REJECTION',
        to: 'FAREWELL',
        condition: () => true,
        agent: 'SALES'
      }
    ]
  }],
  ['FAREWELL', {
    state: 'FAREWELL',
    agent: 'SALES',
    parallelExecutable: false,
    transitions: []
  }]
]);

export class StateManager {
  private currentState: ConversationState = 'INITIAL';
  private context: any = {};

  constructor(initialContext: any = {}) {
    this.context = { ...initialContext, messages: [] };
  }

  getCurrentState(): ConversationState {
    return this.currentState;
  }

  getCurrentAgent(): AgentType {
    return STATE_GRAPH.get(this.currentState)?.agent || 'MASTER';
  }

  updateContext(updates: any): void {
    this.context = { ...this.context, ...updates };
  }

  getContext(): any {
    return this.context;
  }

  canExecuteParallel(): boolean {
    return STATE_GRAPH.get(this.currentState)?.parallelExecutable || false;
  }

  getParallelTasks(): string[] {
    const node = STATE_GRAPH.get(this.currentState);
    if (!node) return [];
    
    const validTransition = node.transitions.find(t => t.condition(this.context));
    return validTransition?.parallelTasks || [];
  }

  transition(): ConversationState {
    const currentNode = STATE_GRAPH.get(this.currentState);
    if (!currentNode) return this.currentState;

    for (const transition of currentNode.transitions) {
      if (transition.condition(this.context)) {
        this.currentState = transition.to;
        console.log(`[StateGraph] Transitioned: ${transition.from} → ${transition.to} (Agent: ${transition.agent})`);
        return this.currentState;
      }
    }

    return this.currentState;
  }

  forceTransition(newState: ConversationState): void {
    console.log(`[StateGraph] Force transition: ${this.currentState} → ${newState}`);
    this.currentState = newState;
  }

  getRequiredData(): string[] {
    return STATE_GRAPH.get(this.currentState)?.requiredData || [];
  }

  isTerminalState(): boolean {
    return this.currentState === 'FAREWELL' || this.currentState === 'REJECTION';
  }
}
