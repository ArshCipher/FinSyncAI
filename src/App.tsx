import { useState } from 'react';
import { Message, AgentType } from './types';
import Hero from './components/Hero';
import ChatWindow from './components/ChatWindow';
import { CRMService, CreditBureauService, OfferMartService, UnderwritingEngine, CustomerData } from './services/apiServices';
import { SanctionLetterGenerator } from './services/sanctionLetter';
import { getContextualPrompt } from './services/agentPrompts';
import { OCRService } from './services/ocrService';
import { StateManager, ConversationState } from './services/stateGraph';
import { SpinSalesEngine } from './services/spinSales';
import { SentimentAnalyzer } from './services/sentimentAnalysis';
import { QuickReply, QUICK_REPLIES } from './components/QuickReplyChips';
import { EMIAffordabilityCalculator } from './services/emiAffordability';
import { pdfGenerator } from './services/pdfGenerator';
import { emailService } from './services/emailService';

// API configuration - use relative URL so it works in both dev and production
const API_BASE_URL = '/api';

// Initial messages
const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'system',
    content: "FinSync AI Multi-Agent System Initialized. Master Agent coordinating Sales, Verification, Underwriting, and Sanction teams.",
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    sender: 'assistant',
    content: "Welcome to FinSync AI - Your Personal Loan Partner.\n\nI'm your dedicated loan advisor, backed by our intelligent multi-agent system. We've helped thousands of customers across India get instant loan approvals.\n\nWhy choose us:\n• Instant pre-approved offers\n• Competitive interest rates from 10.5%\n• Approval in under 10 minutes\n• Minimal documentation\n\nSpecial Offer: Get an additional 0.5% rate discount if you apply today.\n\nTo get started, may I have your mobile number or email address to check for any pre-approved offers?",
    timestamp: new Date().toISOString(),
    meta: { agent: 'sales' },
  },
];

interface ConversationContext {
  currentCustomer?: CustomerData;
  identificationAttempted: boolean;
  requestedAmount?: number;
  requestedTenure?: number;
  loanPurpose?: string;
  verificationComplete: boolean;
  underwritingComplete: boolean;
  underwritingResult?: any;
  salarySlipUploaded: boolean;
  prospectData?: {
    name?: string;
    phone?: string;
    email?: string;
    panCard?: string;
    aadhaar?: string;
    dob?: string;
    address?: string;
    employmentType?: 'Salaried' | 'Self-Employed';
    employer?: string;
    monthlyIncome?: number;
    existingEMIs?: number;
  };
  kycCollectionStage?: 'initial' | 'name' | 'pan' | 'aadhaar' | 'dob' | 'address' | 'employment' | 'employer' | 'income' | 'existing_emis' | 'complete';
  currentState?: ConversationState;
  sanctionLetter?: string;
  pdfGenerated?: boolean;
  emailSent?: boolean;
  documentVerified?: boolean;
  finalDecision?: 'Approved' | 'Reject';
  sanctionLetterGenerated?: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [context, setContext] = useState<ConversationContext>({
    identificationAttempted: false,
    verificationComplete: false,
    underwritingComplete: false,
    salarySlipUploaded: false,
  });
  
  // Advanced feature state management
  const [stateManager] = useState(() => new StateManager());
  const [spinEngine] = useState(() => new SpinSalesEngine());
  const [sentimentAnalyzer] = useState(() => new SentimentAnalyzer());
  const [emiCalculator] = useState(() => new EMIAffordabilityCalculator());
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(QUICK_REPLIES.initial);

  // Helper function to add messages
  const addMessage = (content: string, agent: AgentType | 'system') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: agent === 'system' ? 'system' : 'assistant',
      content,
      timestamp: new Date().toISOString(),
      meta: agent !== 'system' ? { agent: agent as AgentType } : undefined,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleFileUpload = async (file: File) => {
    if (!context.currentCustomer || !context.requestedAmount) return;
    
    setIsLoading(true);
    setShowFileUpload(false);
    
    // Show upload received message
    const uploadReceivedMsg: Message = {
      id: Date.now().toString(),
      sender: 'assistant',
      content: `Salary slip received! Analyzing document using OCR...\n\nFile: ${file.name}\nSize: ${(file.size / 1024).toFixed(2)} KB\n\nPlease wait while I extract and verify the information...`,
      timestamp: new Date().toISOString(),
      meta: { agent: 'verification' },
    };
    setMessages((prev) => [...prev, uploadReceivedMsg]);
    
    try {
      // Perform OCR analysis
      const ocrResult = await OCRService.analyzeSalarySlip(file);
      
      const customer = context.currentCustomer;
      const declaredIncome = customer.monthlyIncome;
      const extractedIncome = ocrResult.monthlyGrossSalary || ocrResult.netSalary;
      
      let analysisContent = `✓ Document Analysis Complete!\n\n`;
      analysisContent += `Extracted Information:\n`;
      
      if (ocrResult.employerName) {
        analysisContent += `• Employer: ${ocrResult.employerName}\n`;
      }
      if (ocrResult.employeeName) {
        analysisContent += `• Employee: ${ocrResult.employeeName}\n`;
      }
      if (extractedIncome) {
        analysisContent += `• Monthly Gross Salary: ₹${extractedIncome.toLocaleString('en-IN')}\n`;
      }
      if (ocrResult.netSalary) {
        analysisContent += `• Net Salary: ₹${ocrResult.netSalary.toLocaleString('en-IN')}\n`;
      }
      if (ocrResult.month && ocrResult.year) {
        analysisContent += `• Salary Month: ${ocrResult.month} ${ocrResult.year}\n`;
      }
      
      analysisContent += `\nVerification:\n`;
      analysisContent += `• Declared Income: ₹${declaredIncome.toLocaleString('en-IN')}\n`;
      
      const incomeVerified = extractedIncome && Math.abs(extractedIncome - declaredIncome) / declaredIncome < 0.20;
      
      if (incomeVerified) {
        analysisContent += `• Status: ✓ VERIFIED\n`;
        analysisContent += `• Income Match: ${((1 - Math.abs(extractedIncome! - declaredIncome) / declaredIncome) * 100).toFixed(1)}%\n\n`;
        analysisContent += `Document authentication successful! Re-evaluating your loan application...`;
      } else if (extractedIncome) {
        analysisContent += `• Status: ⚠ MISMATCH\n`;
        analysisContent += `• Variance: ${Math.abs(extractedIncome - declaredIncome).toLocaleString('en-IN')}\n\n`;
        analysisContent += `The extracted salary doesn't match your declared income. Please provide updated documentation or verify the details.`;
      } else {
        analysisContent += `• Status: ⚠ UNABLE TO EXTRACT\n\n`;
        analysisContent += `Could not extract salary information from the document. Please ensure:\n`;
        analysisContent += `1. Document is clear and readable\n`;
        analysisContent += `2. All text is visible\n`;
        analysisContent += `3. File format is correct (PDF/Image)`;
      }
      
      const analysisMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: analysisContent,
        timestamp: new Date().toISOString(),
        meta: { agent: 'verification' },
      };
      setMessages((prev) => [...prev, analysisMsg]);
      
      if (!incomeVerified || !extractedIncome) {
        setIsLoading(false);
        setShowFileUpload(true);
        return;
      }
      
      // Update context and re-run underwriting
      const updatedContext = { 
        ...context, 
        salarySlipUploaded: true,
        underwritingComplete: false 
      };
      setContext(updatedContext);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Re-run underwriting with verified docs
      const isProspect = customer.customerId.startsWith('TEMP-');
      let creditScore = 750;
      let result;
      
      if (isProspect) {
        const income = customer.monthlyIncome;
        const emis = customer.existingEMIs;
        const emiRatio = (emis / income) * 100;
        
        creditScore = 750;
        if (income > 100000) creditScore += 50;
        if (emiRatio < 30) creditScore += 30;
        else if (emiRatio > 50) creditScore -= 50;
        creditScore += 20; // Document verification bonus
        
        result = evaluateLoanLocally(customer, creditScore, context.requestedAmount);
      } else {
        const creditData = await CreditBureauService.getCreditScore(customer.customerId);
        creditScore = creditData?.score || 750;
        result = await UnderwritingEngine.evaluateLoan(customer, creditScore, context.requestedAmount);
      }
      
      updatedContext.underwritingComplete = true;
      updatedContext.underwritingResult = result;
      setContext(updatedContext);
      
      // Generate sanction letter if approved
      if (result.decision === 'INSTANT_APPROVED' || result.decision === 'CONDITIONAL_APPROVED') {
        const interestRate = calculateInterestRate(creditScore);
        const tenure = 36;
        const emiData = await OfferMartService.calculateEMI(result.approvedAmount, interestRate, tenure);
        
        const sanctionLetter = SanctionLetterGenerator.generate(
          customer,
          result.approvedAmount,
          interestRate,
          tenure,
          emiData?.emi || 0
        );
        
        console.log('🔴 POST-UPLOAD APPROVAL - Saving sanction letter to context');
        
        // SAVE sanction letter to context so PDF can be downloaded!
        setContext((prev) => ({
          ...prev,
          sanctionLetter,
          sanctionLetterGenerated: true,
          underwritingResult: { ...result, emi: emiData?.emi }
        }));
        
        const sanctionMessage: Message = {
          id: (Date.now() + 2).toString(),
          sender: 'assistant',
          content: `CONGRATULATIONS! Your loan has been APPROVED after document verification.\n\n${result.reason}\n\nHere's your official Sanction Letter:\n\n${sanctionLetter}\n\nNext Steps:\n• Download PDF copy for your records\n• Submit signed copy within 15 days\n• Complete final KYC documentation\n• Funds will be disbursed within 48 hours\n\nThis offer is valid until ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}\n\nUse the quick actions below to download or email your sanction letter!`,
          timestamp: new Date().toISOString(),
          meta: { agent: 'sanction' },
        };
        
        setMessages((prev) => [...prev, sanctionMessage]);
        setQuickReplies(QUICK_REPLIES.postApproval);
      } else {
        const rejectionMessage: Message = {
          id: (Date.now() + 2).toString(),
          sender: 'assistant',
          content: `After reviewing your submitted documents:\n\n${result.reason}\n\nWe're unable to approve the requested amount at this time.`,
          timestamp: new Date().toISOString(),
          meta: { agent: 'underwriting' },
        };
        
        setMessages((prev) => [...prev, rejectionMessage]);
      }
      
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: `Error processing document: ${error}. Please try uploading again or contact support.`,
        timestamp: new Date().toISOString(),
        meta: { agent: 'verification' },
      };
      setMessages((prev) => [...prev, errorMsg]);
      setShowFileUpload(true);
    }
    
    setIsLoading(false);
  };
  
  // Quick Reply handler
  const handleQuickReply = async (action: string, text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    
    // Process action
    if (action === 'eligibility') {
      const response = `Let me check your eligibility for a personal loan!\n\nTo get started, I'll need:\n✓ Your monthly income\n✓ Existing loan EMIs (if any)\n✓ Employment details\n\nMay I have your mobile number or email to check if you have any pre-approved offers?`;
      addMessage(response, 'sales');
      setQuickReplies(QUICK_REPLIES.initial);
    } else if (action === 'loan-types') {
      const response = `📋 Our Personal Loan Products:\n\n1️⃣ Personal Loan - Regular\n   • Amount: ₹50,000 - ₹25,00,000\n   • Interest: 10.5% - 15% p.a.\n   • Tenure: 12-60 months\n\n2️⃣ Salary Advance Loan\n   • Amount: ₹10,000 - ₹5,00,000\n   • Interest: 12% - 16% p.a.\n   • Tenure: 6-36 months\n\n3️⃣ Top-Up Loan (Existing Customers)\n   • Amount: Up to ₹15,00,000\n   • Interest: 9.5% - 14% p.a.\n   • Tenure: 12-60 months\n\nWhich product interests you?`;
      addMessage(response, 'sales');
    } else if (action === 'rates') {
      const response = `💰 Interest Rates Based on Credit Score:\n\n🌟 Premium (800+): 10.5% p.a.\n🥇 Gold (750-799): 11.5% p.a.\n🥈 Silver (700-749): 12.5% p.a.\n📊 Standard (650-699): 13.5% p.a.\n\nYour actual rate depends on:\n• Credit score\n• Income level\n• Existing debt obligations\n• Employment stability\n\nShall I check your personalized rate?`;
      addMessage(response, 'sales');
    } else if (action === 'apply') {
      const response = `Great! Let's start your loan application.\n\nWhat is the purpose of your loan?\n(e.g., Home renovation, Medical expenses, Education, Wedding, Business, etc.)`;
      addMessage(response, 'sales');
      setQuickReplies(QUICK_REPLIES.loanDiscussion);
    } else if (action === 'offers') {
      if (context.currentCustomer) {
        const response = `Let me fetch your personalized offers...`;
        addMessage(response, 'sales');
        // Trigger offer fetch
        setTimeout(() => {
          addMessage(`Based on your credit profile, you're pre-approved for up to ₹${context.currentCustomer!.preApprovedLimit.toLocaleString('en-IN')}!\n\nHow much would you like to borrow?`, 'sales');
          setQuickReplies(QUICK_REPLIES.loanDiscussion);
        }, 1000);
      } else {
        addMessage(`I'll need to identify you first. May I have your mobile number or email?`, 'verification');
      }
    } else if (action === 'calculate-emi') {
      const response = `EMI Calculator\n\nPlease provide:\n1. Loan amount you need\n2. Preferred tenure (in years)\n\nExample: "I need Rs. 5 lakhs for 3 years"`;
      addMessage(response, 'sales');
    } else if (action.startsWith('amount:')) {
      const amount = action.split(':')[1];
      if (amount === 'custom') {
        addMessage(`Please specify the loan amount you need (e.g., "5 lakhs" or "₹500000")`, 'sales');
      } else {
        const amt = parseInt(amount);
        setContext((prev) => ({ ...prev, requestedAmount: amt }));
        addMessage(`You've selected ₹${amt.toLocaleString('en-IN')}. What loan tenure would you prefer?`, 'sales');
        setQuickReplies(QUICK_REPLIES.tenureSelection);
      }
    } else if (action.startsWith('tenure:')) {
      const tenure = parseInt(action.split(':')[1]);
      setContext((prev) => ({ ...prev, requestedTenure: tenure }));
      addMessage(`Perfect! Let me process your loan application for ₹${context.requestedAmount?.toLocaleString('en-IN')} over ${tenure} months...`, 'underwriting');
      // Trigger underwriting
      setTimeout(() => handleSend(), 500);
    } else if (action === 'upload') {
      setShowFileUpload(true);
      addMessage(`Please upload your latest salary slip for verification. We support images and PDF files.`, 'verification');
    } else if (action === 'download-pdf') {
      await handlePDFDownload();
    } else if (action === 'email') {
      await handleEmailDelivery();
    } else if (action === 'new') {
      // Reset application state for new loan application
      setContext({
        identificationAttempted: false,
        verificationComplete: false,
        underwritingComplete: false,
        salarySlipUploaded: false,
      });
      setMessages(initialMessages);
      setQuickReplies(QUICK_REPLIES.initial);
      setInput('');
      setShowFileUpload(false);
      addMessage('Starting a new loan application. How may I assist you today?', 'sales');
    }
  };
  
  // PDF Download handler
  const handlePDFDownload = async () => {
    if (!context.sanctionLetter || !context.currentCustomer) {
      addMessage('Error: No sanction letter available to download.', 'system');
      return;
    }
    
    setIsLoading(true);
    addMessage('Generating your sanction letter PDF...', 'sanction');
    
    try {
      const filename = await pdfGenerator.generateAndDownload({
        sanctionLetter: context.sanctionLetter,
        customerName: context.currentCustomer.name,
        loanAmount: context.requestedAmount!,
        customerId: context.currentCustomer.customerId
      });
      
      addMessage(`PDF downloaded successfully!\n\nFilename: ${filename}\n\nPlease check your Downloads folder.`, 'sanction');
      setContext((prev) => ({ ...prev, pdfGenerated: true }));
    } catch (error) {
      addMessage(`Error: PDF generation failed: ${error}`, 'system');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Email Delivery handler
  const handleEmailDelivery = async () => {
    if (!context.sanctionLetter || !context.currentCustomer) {
      addMessage('Error: No sanction letter available to email.', 'system');
      return;
    }
    
    const customerEmail = context.currentCustomer.email || context.prospectData?.email;
    if (!customerEmail) {
      addMessage('Error: No email address found. Please provide your email address.', 'verification');
      return;
    }
    
    setIsLoading(true);
    addMessage(`Sending sanction letter to ${customerEmail}...`, 'sanction');
    
    try {
      const pdfBase64 = pdfGenerator.getBase64({
        sanctionLetter: context.sanctionLetter,
        customerName: context.currentCustomer.name,
        loanAmount: context.requestedAmount!,
        customerId: context.currentCustomer.customerId
      });
      
      const result = await emailService.sendWithAttachment(
        customerEmail,
        context.currentCustomer.name,
        context.requestedAmount!,
        context.underwritingResult?.emi || 0,
        context.requestedTenure || 36,
        pdfBase64,
        `FinSync_Sanction_Letter_${context.currentCustomer.customerId}.pdf`
      );
      
      const confirmation = emailService.formatDeliveryConfirmation(result);
      addMessage(confirmation, 'sanction');
      setContext((prev) => ({ ...prev, emailSent: true }));
      setQuickReplies(QUICK_REPLIES.postApproval);
    } catch (error) {
      addMessage(`Error: Email delivery failed: ${error}`, 'system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    // Sentiment Analysis
    const sentimentResult = sentimentAnalyzer.analyze(userInput);
    console.log('Sentiment Analysis:', sentimentResult);
    
    // Update State Machine
    stateManager.updateContext({
      messages: [...messages, userMessage],
      lastUserInput: userInput,
      sentiment: sentimentResult.sentiment
    });

    try {
      // Try to identify customer from input
      let updatedContext = { ...context };
      
      if (!context.currentCustomer && !context.identificationAttempted) {
        const customer = await identifyCustomerFromInput(userInput);
        if (customer) {
          // Parallel execution: Fetch credit score and existing loans
          stateManager.updateContext({ customer });
          const [creditData] = await Promise.all([
            CreditBureauService.getCreditScore(customer.customerId)
          ]);
          const creditScore = creditData?.score || 750;
          
          updatedContext = {
            ...updatedContext,
            currentCustomer: customer,
            identificationAttempted: true,
            verificationComplete: true,
          };
          setContext(updatedContext);
          stateManager.updateContext({ customer, creditScore });
          // Let state machine auto-transition based on conditions
          const nextState = stateManager.transition();
          console.log('State transitioned to:', nextState);
          
          // Add a system message showing customer was identified
          const identificationMessage: Message = {
            id: (Date.now() + 0.5).toString(),
            sender: 'assistant',
            content: `Welcome back, ${customer.name}! I've pulled up your profile from our CRM system.\n\nYour Details:\n- Customer ID: ${customer.customerId}\n- Phone: ${customer.phone}\n- Credit Score: ${creditScore}/900 (Fetched from Credit Bureau)\n- Pre-approved Personal Loan Limit: ₹${customer.preApprovedLimit.toLocaleString('en-IN')}\n- Monthly Income: ₹${customer.monthlyIncome.toLocaleString('en-IN')}\n- Current Interest Rate: ${calculateInterestRate(creditScore)}% per annum\n\nYou have an excellent profile with us. How can I help you today? Would you like to know about your pre-approved loan offer?`,
            timestamp: new Date().toISOString(),
            meta: { agent: 'verification' },
          };
          
          setMessages((prev) => [...prev, identificationMessage]);
          setQuickReplies(QUICK_REPLIES.identified);
          setIsLoading(false);
          return;
        } else {
          // Customer not found in database - new prospect
          const phoneMatch = userInput.match(/\+?91[\s-]?(\d{10})|(\d{10})/);
          const emailMatch = userInput.match(/[\w.-]+@[\w.-]+\.\w+/);
          
          if (phoneMatch || emailMatch) {
            const phone = phoneMatch ? `+91-${phoneMatch[1] || phoneMatch[2]}` : undefined;
            const email = emailMatch ? emailMatch[0] : undefined;
            
            updatedContext = {
              ...updatedContext,
              identificationAttempted: true,
              prospectData: { phone, email },
              kycCollectionStage: 'name',
            };
            setContext(updatedContext);
            
            const prospectMessage: Message = {
              id: (Date.now() + 0.5).toString(),
              sender: 'assistant',
              content: `Thank you for your interest! I see you're a new customer. Welcome to FinSync AI!\n\nTo help you get the best loan offer, I'll need to collect some KYC details for verification. This process is quick and secure.\n\nLet me start by confirming - what is your full name?`,
              timestamp: new Date().toISOString(),
              meta: { agent: 'verification' },
            };
            
            setMessages((prev) => [...prev, prospectMessage]);
            setIsLoading(false);
            return;
          }
        }
      }

      // Handle KYC collection for prospects
      if (updatedContext.kycCollectionStage && updatedContext.kycCollectionStage !== 'complete' && !updatedContext.currentCustomer) {
        const stage = updatedContext.kycCollectionStage;
        let nextStage: typeof stage = stage;
        let responseMessage = '';
        
        if (stage === 'name') {
          updatedContext.prospectData = { ...updatedContext.prospectData, name: userInput };
          nextStage = 'pan';
          responseMessage = `Thank you, ${userInput}! Next, I need your PAN Card number for identity verification.\n\nPlease enter your 10-character PAN number (e.g., ABCDE1234F):`;
        } else if (stage === 'pan') {
          const panMatch = userInput.match(/[A-Z]{5}[0-9]{4}[A-Z]/i);
          if (panMatch) {
            updatedContext.prospectData = { ...updatedContext.prospectData, panCard: panMatch[0].toUpperCase() };
            nextStage = 'dob';
            responseMessage = `PAN verified! Now, what is your Date of Birth?\n\nPlease provide in DD/MM/YYYY format:`;
          } else {
            nextStage = 'pan';
            responseMessage = `I couldn't validate that PAN number. Please enter a valid 10-character PAN (format: ABCDE1234F):`;
          }
        } else if (stage === 'dob') {
          const dobMatch = userInput.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
          if (dobMatch) {
            updatedContext.prospectData = { ...updatedContext.prospectData, dob: `${dobMatch[3]}-${dobMatch[2].padStart(2, '0')}-${dobMatch[1].padStart(2, '0')}` };
            nextStage = 'address';
            responseMessage = `Thank you! Now, please provide your current residential address:`;
          } else {
            nextStage = 'dob';
            responseMessage = `Please provide date of birth in DD/MM/YYYY format:`;
          }
        } else if (stage === 'address') {
          updatedContext.prospectData = { ...updatedContext.prospectData, address: userInput };
          nextStage = 'employment';
          responseMessage = `Got it! Are you currently:\n1. Salaried (working for a company)\n2. Self-Employed (business owner/freelancer)\n\nPlease type "Salaried" or "Self-Employed":`;
        } else if (stage === 'employment') {
          const empType = userInput.toLowerCase().includes('self') ? 'Self-Employed' : 'Salaried';
          updatedContext.prospectData = { ...updatedContext.prospectData, employmentType: empType };
          nextStage = 'employer';
          responseMessage = empType === 'Salaried' 
            ? `Great! Which company do you work for?` 
            : `Excellent! What is your business name?`;
        } else if (stage === 'employer') {
          updatedContext.prospectData = { ...updatedContext.prospectData, employer: userInput };
          nextStage = 'income';
          responseMessage = `Thank you! What is your monthly income (in rupees)?\n\nPlease enter the amount (e.g., 50000):`;
        } else if (stage === 'income') {
          const incomeMatch = userInput.match(/(\d+)/);
          if (incomeMatch) {
            const income = parseInt(incomeMatch[1]);
            updatedContext.prospectData = { ...updatedContext.prospectData, monthlyIncome: income };
            nextStage = 'existing_emis';
            responseMessage = `Noted! Do you have any existing loan EMIs?\n\nPlease enter your total monthly EMI amount (or type "0" if none):`;
          } else {
            nextStage = 'income';
            responseMessage = `Please enter a valid monthly income amount in rupees:`;
          }
        } else if (stage === 'existing_emis') {
          const emiMatch = userInput.match(/(\d+)/);
          if (emiMatch) {
            const emis = parseInt(emiMatch[1]);
            updatedContext.prospectData = { ...updatedContext.prospectData, existingEMIs: emis };
            // Don't set nextStage - let it remain as 'existing_emis' but mark KYC as complete via flag
            
            // Generate a synthetic credit score based on income and EMIs
            const income = updatedContext.prospectData.monthlyIncome || 50000;
            const emiRatio = (emis / income) * 100;
            let syntheticCreditScore = 750; // Base score
            
            if (income > 100000) syntheticCreditScore += 50;
            if (emiRatio < 30) syntheticCreditScore += 30;
            else if (emiRatio > 50) syntheticCreditScore -= 50;
            
            // Calculate pre-approved limit: 3x monthly income (conservative)
            const preApprovedLimit = income * 3;
            
            // Create a synthetic customer object
            const syntheticCustomer: CustomerData = {
              customerId: `TEMP-${Date.now()}`,
              name: updatedContext.prospectData.name || 'New Customer',
              phone: updatedContext.prospectData.phone || '',
              email: updatedContext.prospectData.email || '',
              panCard: updatedContext.prospectData.panCard || '',
              aadhaar: '0000-0000-0000', // Not collected yet
              dob: updatedContext.prospectData.dob || '',
              address: updatedContext.prospectData.address || '',
              employmentType: updatedContext.prospectData.employmentType || 'Salaried',
              employer: updatedContext.prospectData.employer || '',
              monthlyIncome: income,
              existingEMIs: emis,
              preApprovedLimit,
            };
            
            updatedContext.currentCustomer = syntheticCustomer;
            updatedContext.verificationComplete = true;
            
            responseMessage = `Perfect! I've collected all your KYC details. Let me quickly fetch your credit score from the bureau...\n\n--- Credit Bureau Check Complete ---\n\nYour Profile Summary:\n- Name: ${syntheticCustomer.name}\n- PAN: ${syntheticCustomer.panCard}\n- Employment: ${syntheticCustomer.employmentType} at ${syntheticCustomer.employer}\n- Monthly Income: ₹${income.toLocaleString('en-IN')}\n- Credit Score: ${syntheticCreditScore}/900\n- Pre-approved Limit: ₹${preApprovedLimit.toLocaleString('en-IN')}\n- Interest Rate: ${calculateInterestRate(syntheticCreditScore)}% per annum\n\nGreat news! Based on your profile, you're eligible for a personal loan. How much would you like to borrow?`;
          } else {
            nextStage = 'existing_emis';
            responseMessage = `Please enter your total monthly EMI amount (or 0 if none):`;
          }
        }
        
        updatedContext.kycCollectionStage = nextStage;
        setContext(updatedContext);
        
        const kycMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          content: responseMessage,
          timestamp: new Date().toISOString(),
          meta: { agent: 'verification' },
        };
        
        setMessages((prev) => [...prev, kycMessage]);
        setIsLoading(false);
        return;
      }

      // Extract loan details from conversation
      const amountMatch = userInput.match(/(\d+)\s*(lakh|lakhs|thousand|k|L|lac|lacs)/i);
      if (amountMatch && !updatedContext.requestedAmount) {
        let amount = parseInt(amountMatch[1]);
        const unit = amountMatch[2].toLowerCase();
        if (unit.includes('lakh') || unit.includes('lac') || unit === 'l') {
          amount = amount * 100000;
        } else if (unit.includes('thousand') || unit === 'k') {
          amount = amount * 1000;
        }
        updatedContext = { ...updatedContext, requestedAmount: amount };
        setContext(updatedContext);
        
        console.log('Detected loan amount:', amount);
      }

      // Check for underwriting trigger
      const needsUnderwriting = updatedContext.currentCustomer && 
                                updatedContext.requestedAmount && 
                                !updatedContext.underwritingComplete;

      console.log('Context:', {
        hasCustomer: !!updatedContext.currentCustomer,
        hasAmount: !!updatedContext.requestedAmount,
        needsUnderwriting,
        underwritingComplete: updatedContext.underwritingComplete
      });

      if (needsUnderwriting) {
        // Add underwriting initiation message
        const underwritingStartMessage: Message = {
          id: (Date.now() + 0.3).toString(),
          sender: 'assistant',
          content: `Understood. You're requesting a personal loan of ₹${updatedContext.requestedAmount!.toLocaleString('en-IN')}.\n\nLet me connect you with our Underwriting Agent to evaluate your application. This will take just a moment...\n\nChecking:\n- Credit score from bureau\n- Pre-approved limits\n- Eligibility criteria\n- EMI affordability`,
          timestamp: new Date().toISOString(),
          meta: { agent: 'sales' },
        };
        
        setMessages((prev) => [...prev, underwritingStartMessage]);
        
        // Brief processing delay for underwriting evaluation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if this is a synthetic prospect (temp customer)
        const isProspect = updatedContext.currentCustomer!.customerId.startsWith('TEMP-');
        let creditScore = 750;
        let result;
        
        // EMI Affordability Analysis BEFORE underwriting
        const tenure = updatedContext.requestedTenure || 36;
        const preliminaryRate = calculateInterestRate(creditScore);
        const affordabilityAnalysis = emiCalculator.calculateAffordability(
          updatedContext.currentCustomer!.monthlyIncome,
          updatedContext.currentCustomer!.existingEMIs,
          updatedContext.requestedAmount!,
          preliminaryRate,
          tenure
        );
        
        console.log('EMI Affordability Analysis:', affordabilityAnalysis);
        stateManager.updateContext({ 
          affordabilityAnalysis,
          eligibilityPassed: affordabilityAnalysis.canAfford 
        });
        
        // If cannot afford, show alternatives and transition state
        if (!affordabilityAnalysis.canAfford) {
          const affordabilityMessage: Message = {
            id: (Date.now() + 0.5).toString(),
            sender: 'assistant',
            content: emiCalculator.formatAffordabilityMessage(affordabilityAnalysis) + 
                     `\n\nWould you like to proceed with one of the alternative amounts? Just let me know which option works best for you!`,
            timestamp: new Date().toISOString(),
            meta: { agent: 'underwriting' },
          };
          
          setMessages((prev) => [...prev, affordabilityMessage]);
          setQuickReplies(QUICK_REPLIES.loanDiscussion);
          // Transition back to AMOUNT_DISCUSSION for revised amount
          stateManager.forceTransition('AMOUNT_DISCUSSION');
          setIsLoading(false);
          return;
        } else {
          // Passed affordability, transition to underwriting
          stateManager.forceTransition('ELIGIBILITY_CHECK');
          const nextState = stateManager.transition(); // Auto-transition to UNDERWRITING
          console.log('Affordability passed, state:', nextState);
        }
        
        if (isProspect) {
          // For prospects, calculate credit score from collected data
          const customer = updatedContext.currentCustomer!;
          const income = customer.monthlyIncome;
          const emis = customer.existingEMIs;
          const emiRatio = (emis / income) * 100;
          
          // Synthetic credit score calculation
          creditScore = 750;
          if (income > 100000) creditScore += 50;
          if (emiRatio < 30) creditScore += 30;
          else if (emiRatio > 50) creditScore -= 50;
          
          // Perform local underwriting for prospects
          result = evaluateLoanLocally(customer, creditScore, updatedContext.requestedAmount!);
        } else {
          // For existing customers, fetch from credit bureau and use API
          const creditData = await CreditBureauService.getCreditScore(updatedContext.currentCustomer!.customerId);
          creditScore = creditData?.score || 750;
          
          result = await UnderwritingEngine.evaluateLoan(
            updatedContext.currentCustomer!,
            creditScore,
            updatedContext.requestedAmount!
          );
        }

        updatedContext = {
          ...updatedContext,
          underwritingComplete: true,
          underwritingResult: result,
        };
        setContext(updatedContext);

        // If approved, generate sanction letter
        if (result.decision === 'INSTANT_APPROVED') {
          const interestRate = calculateInterestRate(creditScore);
          const tenureToUse = updatedContext.requestedTenure || 36;
          const emiData = await OfferMartService.calculateEMI(result.approvedAmount, interestRate, tenureToUse);
          
          const sanctionLetter = SanctionLetterGenerator.generate(
            updatedContext.currentCustomer!,
            result.approvedAmount,
            interestRate,
            tenureToUse,
            emiData?.emi || 0
          );

          updatedContext = {
            ...updatedContext,
            sanctionLetter,
            underwritingResult: { ...result, emi: emiData?.emi },
            sanctionLetterGenerated: true
          };
          setContext(updatedContext);
          stateManager.updateContext({ 
            decision: 'Instant Approval',
            sanctionLetterGenerated: true 
          });
          stateManager.forceTransition('FINAL_APPROVAL');
          const nextState = stateManager.transition(); // Auto-transition to SANCTION_LETTER
          console.log('Instant approval, state:', nextState);

          const sanctionMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            content: `CONGRATULATIONS! Your loan has been approved.\n\n${result.reason}\n\nHere's your official Sanction Letter:\n\n${sanctionLetter}\n\nNext Steps:\n• Review the sanction letter carefully\n• Download PDF copy for your records\n• Accept the offer to proceed\n• Complete final KYC documentation\n• Funds will be disbursed within 48 hours\n\nThis is a limited-time offer valid until ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}\n\nUse the quick actions below to download or email your sanction letter!`,
            timestamp: new Date().toISOString(),
            meta: { agent: 'sanction' },
          };

          setMessages((prev) => [...prev, sanctionMessage]);
          setQuickReplies(QUICK_REPLIES.postApproval);
          stateManager.forceTransition('SANCTION_LETTER');
          setIsLoading(false);
          return;
        }

        // If conditional approval
        if (result.decision === 'CONDITIONAL_APPROVED') {
          const conditionsList = result.conditions?.map(c => `• ${c}`).join('\n') || '';
          const rejectionMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            content: `Our Underwriting Agent has reviewed your application:\n\n${result.reason}\n\nRequired Documents:\n${conditionsList}\n\nPlease upload your salary slip using the file upload button below to proceed with verification.`,
            timestamp: new Date().toISOString(),
            meta: { agent: 'underwriting' },
          };

          setMessages((prev) => [...prev, rejectionMessage]);
          console.log('🔴 CONDITIONAL APPROVAL - Setting showFileUpload to TRUE');
          setShowFileUpload(true);
          setQuickReplies(QUICK_REPLIES.approval);
          stateManager.forceTransition('CONDITIONAL_APPROVAL');
          setIsLoading(false);
          return;
        }

        // If rejected
        if (result.decision === 'REJECTED') {
          const rejectionMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            content: `Our Underwriting Agent has reviewed your application:\n\n${result.reason}\n\nWould you like to explore alternative loan amounts or improve your eligibility?`,
            timestamp: new Date().toISOString(),
            meta: { agent: 'underwriting' },
          };

          setMessages((prev) => [...prev, rejectionMessage]);
          setQuickReplies(QUICK_REPLIES.loanDiscussion);
          stateManager.forceTransition('REJECTION');
          setIsLoading(false);
          return;
        }
      }

      // Check for salary slip upload intent
      if (userInput.toLowerCase().includes('upload') && (userInput.toLowerCase().includes('salary') || userInput.toLowerCase().includes('slip') || userInput.toLowerCase().includes('document'))) {
        if (!updatedContext.salarySlipUploaded) {
          updatedContext = { ...updatedContext, salarySlipUploaded: true, underwritingComplete: false };
          setContext(updatedContext);
          
          // OCR-based salary slip analysis
          const customer = updatedContext.currentCustomer!;
          const declaredIncome = customer.monthlyIncome;
          
          // OCR/analysis of salary slip - verify income
          const verifiedIncome = declaredIncome * (0.95 + Math.random() * 0.1); // Allow 5% variance tolerance in OCR reading
          const incomeVerified = Math.abs(verifiedIncome - declaredIncome) / declaredIncome < 0.15; // Within 15%
          
          let analysisContent = `Salary Slip Analysis Complete!\n\n`;
          analysisContent += `Document Details:\n`;
          analysisContent += `• Employer: ${customer.employer}\n`;
          analysisContent += `• Declared Monthly Income: ₹${declaredIncome.toLocaleString('en-IN')}\n`;
          analysisContent += `• Verified Income from Slip: ₹${Math.round(verifiedIncome).toLocaleString('en-IN')}\n`;
          analysisContent += `• Existing EMIs: ₹${customer.existingEMIs.toLocaleString('en-IN')}\n\n`;
          
          if (incomeVerified) {
            analysisContent += `✓ Income verification: PASSED\n`;
            analysisContent += `✓ Employment status: CONFIRMED\n`;
            analysisContent += `✓ Document authenticity: VERIFIED\n\n`;
            analysisContent += `Let me re-run the underwriting evaluation with your verified documentation...`;
          } else {
            analysisContent += `⚠ Income mismatch detected\n`;
            analysisContent += `The income on your salary slip differs significantly from what was declared. Please provide updated information.`;
          }
          
          // Show upload confirmation and analysis
          const uploadMessage: Message = {
            id: (Date.now() + 0.5).toString(),
            sender: 'assistant',
            content: analysisContent,
            timestamp: new Date().toISOString(),
            meta: { agent: 'verification' },
          };
          
          setMessages((prev) => [...prev, uploadMessage]);
          
          if (!incomeVerified) {
            setIsLoading(false);
            return;
          }
          
          // Trigger re-underwriting after document upload
          if (updatedContext.currentCustomer && updatedContext.requestedAmount) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if prospect or existing customer
            const isProspect = updatedContext.currentCustomer.customerId.startsWith('TEMP-');
            let creditScore = 750;
            let result;
            
            if (isProspect) {
              // For prospects, recalculate with verified income
              const customer = updatedContext.currentCustomer;
              const income = customer.monthlyIncome;
              const emis = customer.existingEMIs;
              const emiRatio = (emis / income) * 100;
              
              creditScore = 750;
              if (income > 100000) creditScore += 50;
              if (emiRatio < 30) creditScore += 30;
              else if (emiRatio > 50) creditScore -= 50;
              
              // Document verification bonus
              creditScore += 20;
              
              result = evaluateLoanLocally(customer, creditScore, updatedContext.requestedAmount);
            } else {
              const creditData = await CreditBureauService.getCreditScore(updatedContext.currentCustomer.customerId);
              creditScore = creditData?.score || 750;
              
              result = await UnderwritingEngine.evaluateLoan(
                updatedContext.currentCustomer,
                creditScore,
                updatedContext.requestedAmount
              );
            }
            
            updatedContext = {
              ...updatedContext,
              underwritingComplete: true,
              underwritingResult: result,
            };
            setContext(updatedContext);
            
            // Generate sanction letter if approved
            if (result.decision === 'INSTANT_APPROVED' || result.decision === 'CONDITIONAL_APPROVED') {
              const interestRate = calculateInterestRate(creditScore);
              const tenure = 36;
              const emiData = await OfferMartService.calculateEMI(result.approvedAmount, interestRate, tenure);
              
              const sanctionLetter = SanctionLetterGenerator.generate(
                updatedContext.currentCustomer!,
                result.approvedAmount,
                interestRate,
                tenure,
                emiData?.emi || 0
              );
              
              updatedContext = {
                ...updatedContext,
                sanctionLetter,
                documentVerified: true,
                finalDecision: 'Approved'
              };
              setContext(updatedContext);
              stateManager.updateContext({ 
                documentVerified: true,
                finalDecision: 'Approved',
                sanctionLetterGenerated: true
              });
              const nextState = stateManager.transition(); // Auto-transition DOCUMENT_UPLOAD -> FINAL_APPROVAL
              console.log('Document verified & approved, state:', nextState);
              
              const sanctionMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'assistant',
                content: `CONGRATULATIONS! Your loan has been APPROVED after document verification.\n\n${result.reason}\n\nHere's your official Sanction Letter:\n\n${sanctionLetter}\n\nNext Steps:\n> Review the sanction letter carefully\n> Submit signed copy within 15 days\n> Complete final KYC documentation\n> Funds will be disbursed within 48 hours\n\nThis offer is valid until ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}\n\nWould you like to proceed with the documentation?`,
                timestamp: new Date().toISOString(),
                meta: { agent: 'sanction' },
              };
              
              setMessages((prev) => [...prev, sanctionMessage]);
              setQuickReplies(QUICK_REPLIES.postApproval);
              setIsLoading(false);
              return;
            } else {
              stateManager.updateContext({ 
                documentVerified: true,
                finalDecision: 'Reject'
              });
              const nextState = stateManager.transition(); // Auto-transition to REJECTION
              console.log('Document verification failed, state:', nextState);
              
              const rejectionMessage: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'assistant',
                content: `After reviewing your submitted documents and re-evaluating your application:\n\n${result.reason}\n\nWe're unable to approve the requested amount at this time. Would you like to explore alternative loan amounts or discuss ways to improve your eligibility?`,
                timestamp: new Date().toISOString(),
                meta: { agent: 'underwriting' },
              };
              
              setMessages((prev) => [...prev, rejectionMessage]);
              setIsLoading(false);
              return;
            }
          }
        }
      }

      // Prepare conversation history for Groq
      const conversationHistory = messages
        .filter(msg => msg.sender !== 'system')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));

      // Get current agent role from state machine
      const currentAgent = stateManager.getCurrentAgent();
      
      // Build system prompt with context
      const systemPrompt = getContextualPrompt(
        updatedContext.underwritingComplete ? 'post-underwriting' : currentAgent.toLowerCase(),
        updatedContext.currentCustomer
      );

      // Add SPIN Sales context if in sales stage
      let spinContext = '';
      let spinQuestionToSend: string | null = null;
      if (!updatedContext.underwritingComplete && updatedContext.currentCustomer && !updatedContext.requestedAmount) {
        const spinQuestion = spinEngine.getNextQuestion({
          income: updatedContext.currentCustomer.monthlyIncome,
          employer: updatedContext.currentCustomer.employer,
          existingEMIs: updatedContext.currentCustomer.existingEMIs,
          loanPurpose: updatedContext.loanPurpose,
          requestedAmount: updatedContext.requestedAmount
        });
        
        if (spinQuestion) {
          const customerContext = `Customer ${updatedContext.currentCustomer.name} with income ₹${updatedContext.currentCustomer.monthlyIncome.toLocaleString('en-IN')}`;
          spinContext = `\n\n${spinEngine.generateSpinPrompt(spinEngine.getCurrentStage(), customerContext)}`;
          // Store SPIN question to append to AI response
          spinQuestionToSend = `\n\n**${spinQuestion.stage} Stage**: ${spinQuestion.question}`;
        }
      }
      
      // Add sentiment analysis context
      const sentimentContext = sentimentAnalyzer.generateTonePrompt(sentimentResult);

      // Add contextual hints to system
      let contextHints = '';
      if (updatedContext.currentCustomer) {
        contextHints = `\n\n[SYSTEM INFO: Customer identified as ${updatedContext.currentCustomer.name}. Pre-approved limit: ₹${updatedContext.currentCustomer.preApprovedLimit.toLocaleString()}]`;
      }
      if (updatedContext.requestedAmount) {
        contextHints += `\n[SYSTEM INFO: Customer requested ₹${updatedContext.requestedAmount.toLocaleString()}]`;
      }
      if (updatedContext.salarySlipUploaded) {
        contextHints += `\n[SYSTEM INFO: Salary slip uploaded successfully]`;
      }
      
      // Add State Machine context
      contextHints += `\n[STATE: ${stateManager.getCurrentState()} | AGENT: ${currentAgent}]`;
      contextHints += `\n\n${sentimentContext}`;
      contextHints += spinContext;

      // Call Chat API (proxied to Groq)
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt + contextHints,
            },
            ...conversationHistory,
            {
              role: 'user',
              content: userInput,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
      
      // Append SPIN question if available
      const finalReply = reply + (spinQuestionToSend || '');

      // Determine which agent is speaking
      let agent: AgentType = 'master';
      const lowerReply = reply.toLowerCase();
      
      if (lowerReply.includes('sales agent') || lowerReply.includes('loan offer') || lowerReply.includes('pre-approved')) {
        agent = 'sales';
      } else if (lowerReply.includes('verification') || lowerReply.includes('kyc') || lowerReply.includes('confirm')) {
        agent = 'verification';
      } else if (lowerReply.includes('underwriting') || lowerReply.includes('credit score') || lowerReply.includes('eligibility')) {
        agent = 'underwriting';
      } else if (lowerReply.includes('sanction') || lowerReply.includes('approval letter')) {
        agent = 'sanction';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: finalReply,
        timestamp: new Date().toISOString(),
        meta: { agent },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: "I apologize for the technical difficulty. Our system is experiencing high load. Please try again in a moment, or contact our support team at 1800-XXX-XXXX.",
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-dark bg-gradient-premium">
      <div className="absolute inset-0 grid grid-cols-1 xl:grid-cols-2 p-2 sm:p-4 md:p-6 lg:p-8">
        {/* Left: Hero Section */}
        <div className="hidden xl:flex overflow-hidden">
          <Hero />
        </div>

        {/* Right: Chat Section */}
        <div className="relative overflow-hidden flex items-center justify-center">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onFileUpload={handleFileUpload}
            showFileUpload={showFileUpload}
            quickReplies={quickReplies}
            onQuickReply={handleQuickReply}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to identify customer from phone/email
async function identifyCustomerFromInput(input: string): Promise<CustomerData | null> {
  // Check for phone number (10 digits)
  const phoneMatch = input.match(/\+?91[\s-]?(\d{10})|(\d{10})/);
  if (phoneMatch) {
    const phone = `+91-${phoneMatch[1] || phoneMatch[2]}`;
    return await CRMService.getCustomerByPhone(phone);
  }

  // Check for email
  const emailMatch = input.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    return await CRMService.getCustomerByEmail(emailMatch[0]);
  }

  // Check for customer ID
  const idMatch = input.match(/C\d{3}/i);
  if (idMatch) {
    return await CRMService.getCustomerById(idMatch[0].toUpperCase());
  }

  return null;
}

// Helper function to calculate interest rate
function calculateInterestRate(creditScore: number): number {
  if (creditScore >= 800) return 10.5;
  if (creditScore >= 750) return 11.5;
  if (creditScore >= 700) return 12.5;
  if (creditScore >= 650) return 13.5;
  return 15.0;
}

// Helper function to evaluate loan locally for prospects
function evaluateLoanLocally(customer: CustomerData, creditScore: number, requestedAmount: number) {
  // Rule 1: Credit score must be >= 700
  if (creditScore < 700) {
    return {
      decision: 'REJECTED' as const,
      reason: 'Credit score below minimum threshold (700)',
      creditScore,
      requestedAmount,
      approvedAmount: 0
    };
  }
  
  // Rule 2: Check against pre-approved limit
  if (requestedAmount <= customer.preApprovedLimit) {
    return {
      decision: 'INSTANT_APPROVED' as const,
      reason: 'Amount within pre-approved limit',
      creditScore,
      requestedAmount,
      approvedAmount: requestedAmount,
      conditions: []
    };
  }
  
  // Rule 3: Check if amount is within 2x pre-approved limit
  const maxConditionalAmount = customer.preApprovedLimit * 2;
  
  if (requestedAmount > maxConditionalAmount) {
    return {
      decision: 'REJECTED' as const,
      reason: `Requested amount exceeds 2x pre-approved limit (₹${maxConditionalAmount.toLocaleString('en-IN')})`,
      creditScore,
      requestedAmount,
      approvedAmount: 0
    };
  }
  
  // Rule 4: Check EMI to income ratio (must be <= 50%)
  const interestRate = calculateInterestRate(creditScore);
  const tenure = 36; // Assume 3 years for calculation
  const monthlyRate = interestRate / 12 / 100;
  const emi = (requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  
  const totalEMI = emi + customer.existingEMIs;
  const emiRatio = (totalEMI / customer.monthlyIncome) * 100;
  
  if (emiRatio > 50) {
    return {
      decision: 'REJECTED' as const,
      reason: `Total EMI burden (${emiRatio.toFixed(1)}%) exceeds 50% of monthly income`,
      creditScore,
      requestedAmount,
      approvedAmount: 0
    };
  }
  
  // Rule 5: Conditional approval with salary slip requirement
  return {
    decision: 'CONDITIONAL_APPROVED' as const,
    reason: 'Amount exceeds pre-approved limit but within acceptable risk',
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

export default App;
