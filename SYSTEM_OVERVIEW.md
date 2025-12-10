# FinSync AI - Complete System Overview

## 🎯 Challenge Compliance

This solution fully implements the **Tata Capital NBFC Agentic AI Challenge** requirements with the following architecture:

### Master Agent Orchestration ✓
The Master Agent coordinates the entire loan sales process from initial contact to sanction letter generation.

### Worker Agents ✓
1. **Sales Agent** - Negotiates terms, discusses needs, amount, tenure, interest rates
2. **Verification Agent** - Confirms KYC details from CRM database
3. **Underwriting Agent** - Fetches credit score, validates eligibility
4. **Sanction Letter Generator** - Creates automated sanction letter

---

## 📊 System Architecture

### Backend (Port 5000)
```
Express.js + MongoDB + Groq AI (llama-3.3-70b-versatile)
├── CRM Server (MongoDB collection: customers)
├── Credit Bureau API (MongoDB collection: creditScores)
├── Offer Mart Server (MongoDB collection: offers)
└── Groq Chat Proxy (AI orchestration)
```

### Frontend (Port 3000)
```
React 18 + TypeScript + Vite + Tailwind CSS
├── Premium Dark Theme (Apple/Stripe/Linear inspired)
├── Multi-Agent Chat Interface
└── Real-time API Integration
```

---

## 🔄 Customer Journey Flows

### Flow 1: Existing Customer (Happy Path)
**Example**: Phone number `9999109506`

1. **Customer enters phone/email** → `9999109506`
2. **Verification Agent** queries CRM database
3. **System Response**:
   ```
   Welcome back, Arshad Khan! I've pulled up your profile from our CRM system.
   
   Your Details:
   - Customer ID: C011
   - Phone: +91-9999109506
   - Credit Score: 805/900 (Fetched from Credit Bureau)
   - Pre-approved Personal Loan Limit: ₹7,50,000
   - Monthly Income: ₹1,75,000
   - Current Interest Rate: 10.5% per annum
   ```

4. **Sales Agent** engages customer
5. **Customer requests loan** → "I need 3 lakh rupees"
6. **Underwriting Agent** evaluates:
   - Fetches credit score from bureau: 805
   - Checks pre-approved limit: ₹7,50,000
   - Requested: ₹3,00,000 ≤ ₹7,50,000 ✓
   - **Decision**: INSTANT_APPROVED

7. **Sanction Letter Generator** creates PDF-like sanction letter
8. **Master Agent** presents offer and next steps

---

### Flow 2: New Prospect (Not in Database)
**Example**: Phone number `9191919191`

1. **Customer enters phone** → `9191919191`
2. **Verification Agent** queries CRM database
3. **No match found** → Prospect flow initiated
4. **System Response**:
   ```
   Thank you for reaching out! I see you're a new customer.
   
   To provide you with the best loan offers, I'll need to collect 
   some basic information for KYC verification:
   
   1. Full Name
   2. PAN Card Number
   3. Date of Birth (DD/MM/YYYY)
   4. Current Employment Status (Salaried/Self-Employed)
   5. Monthly Income
   6. Current Address
   
   We'll also need to fetch your credit score from the bureau to 
   determine your eligibility and pre-approved limit.
   
   Could you please start by sharing your full name?
   ```

5. **Verification Agent** collects KYC details
6. **System** would typically:
   - Validate PAN/Aadhaar
   - Fetch credit score from bureau
   - Create customer profile in CRM
   - Calculate pre-approved limit
   - Proceed to sales conversation

**Note**: Currently the system handles prospect registration but doesn't persist new customers. This can be extended with a POST endpoint to create new customers in the database.

---

### Flow 3: Conditional Approval (Requires Documents)
**Example**: Customer C003 (Amit Patel)

1. **Customer identified**: Pre-approved ₹3L, Credit: 780
2. **Requests**: ₹5 lakh (exceeds pre-approved)
3. **Underwriting Agent** evaluates:
   - ₹5L > ₹3L (pre-approved) but ≤ ₹6L (2× pre-approved)
   - Credit score: 780 ≥ 700 ✓
   - EMI calculation shows affordability
   - **Decision**: CONDITIONAL_APPROVED

4. **System Response**:
   ```
   Our Underwriting Agent has reviewed your application:
   
   Amount exceeds pre-approved limit but within acceptable risk
   
   Required Documents:
   • Latest 3 months salary slips required
   • Bank statement for last 6 months required
   • Employment verification letter required
   
   Please type "upload salary slip" to proceed with document submission.
   ```

5. **Customer** types "upload salary slip"
6. **System** simulates document upload
7. **Underwriting re-runs** with document flag
8. **Approval** granted with sanction letter

---

### Flow 4: Rejection (Low Credit Score)
**Example**: Customer C005 (Vikram Singh)

1. **Customer identified**: Pre-approved ₹2L, Credit: 680
2. **Requests**: ₹2.5 lakh
3. **Underwriting Agent** evaluates:
   - Credit score: 680 < 700 (minimum threshold) ✗
   - **Decision**: REJECTED

4. **System Response**:
   ```
   Our Underwriting Agent has reviewed your application:
   
   Credit score below minimum threshold (700)
   
   Would you like to explore alternative loan amounts or 
   improve your eligibility?
   ```

---

### Flow 5: Rejection (Amount Too High)
**Example**: Customer C005 requests ₹5L

1. **Monthly Income**: ₹90,000
2. **Max Allowed**: ₹1,80,000 (2× monthly income)
3. **Requested**: ₹5,00,000
4. **Underwriting Agent**:
   - ₹5L > ₹1.8L ✗
   - **Decision**: REJECTED

5. **System Response**:
   ```
   Requested amount exceeds 2x monthly income (₹1,80,000)
   ```

---

## 🧪 Test Scenarios

### Scenario 1: Instant Approval
```
Phone: 9999109506 (Arshad Khan)
Credit: 805, Pre-approved: ₹7.5L
Request: ₹3 lakh
Result: INSTANT_APPROVED → Sanction Letter
```

### Scenario 2: Conditional Approval
```
Phone: 9876543212 (Amit Patel)
Credit: 780, Pre-approved: ₹3L
Request: ₹5 lakh
Result: CONDITIONAL_APPROVED → Upload Salary Slip → Approved
```

### Scenario 3: Credit Rejection
```
Phone: 9876543214 (Vikram Singh)
Credit: 680, Pre-approved: ₹2L
Request: ₹2.5 lakh
Result: REJECTED (Credit score < 700)
```

### Scenario 4: Amount Rejection
```
Phone: 9876543214 (Vikram Singh)
Income: ₹90,000
Request: ₹5 lakh
Result: REJECTED (Amount > 2× income)
```

### Scenario 5: New Prospect
```
Phone: 9191919191 (Not in database)
Result: KYC collection flow initiated
```

---

## 🤖 Agentic AI Implementation

### Master Agent
- **Entry Point**: All customer messages first go to Master Agent
- **Orchestration**: Decides which Worker Agent to invoke
- **Context Management**: Maintains conversation state
- **Coordination**: Hands off tasks and consolidates results

### Worker Agents (Identified by Agent Tags)

#### Sales Agent (Purple Tag)
- Engages customers
- Discusses loan needs
- Explains offers and terms
- Handles objections
- Closes conversations

#### Verification Agent (Blue Tag)
- Queries CRM database
- Confirms customer identity
- Validates KYC details
- Handles new prospect registration

#### Underwriting Agent (Orange Tag)
- Fetches credit score from bureau
- Applies eligibility rules
- Calculates EMI affordability
- Makes approval/rejection decisions
- Requests additional documents

#### Sanction Agent (Green Tag)
- Generates formal sanction letter
- Includes all loan terms
- Presents next steps
- Provides validity period

---

## 📋 Underwriting Rules (Backend Implementation)

```javascript
1. Credit Score Check
   IF creditScore < 700 → REJECT

2. Pre-Approved Limit Check
   IF requestedAmount ≤ preApprovedLimit → INSTANT_APPROVE

3. Income Multiple Check
   IF requestedAmount > (monthlyIncome × 2) → REJECT

4. EMI Affordability Check
   totalEMI = newEMI + existingEMIs
   IF (totalEMI / monthlyIncome) > 50% → REJECT

5. Conditional Approval
   IF preApprovedLimit < requestedAmount ≤ (preApprovedLimit × 2)
   AND creditScore ≥ 700
   AND emiRatio ≤ 50%
   → CONDITIONAL_APPROVE (require documents)
```

---

## 🗄️ Database Collections

### customers (11 records: C001-C011)
```json
{
  "customerId": "C011",
  "name": "Arshad Khan",
  "phone": "+91-9999109506",
  "email": "arshad.khan@email.com",
  "panCard": "KLMNO1234P",
  "aadhaar": "1234-5678-9013",
  "dob": "1990-08-15",
  "address": "852 Lake View, Pune, Maharashtra 411001",
  "employmentType": "Salaried",
  "employer": "Digital Solutions Pvt Ltd",
  "monthlyIncome": 175000,
  "existingEMIs": 18000,
  "preApprovedLimit": 750000
}
```

### creditScores (11 records)
```json
{
  "customerId": "C011",
  "score": 805,
  "lastUpdated": "2025-12-10T..."
}
```

### offers (3 loan products)
```json
{
  "productId": "PL001",
  "productName": "Personal Loan - Premium",
  "minAmount": 100000,
  "maxAmount": 5000000,
  "minTenure": 12,
  "maxTenure": 84,
  "processingFee": 0.01,
  "minCreditScore": 750
}
```

---

## 🎨 UI/UX Features

### Premium Design
- **Dark Theme**: #050509 background with radial gradients
- **Glassmorphism**: Frosted glass effect on all cards
- **Typography**: Huge headings (96px), Inter font family
- **Animations**: Smooth fade-ins, gradient shifts, loading indicators
- **Color Accents**: Purple (#a855f7) + Cyan (#06b6d4)

### Chat Interface
- **MacOS-style Window**: Traffic lights (red/yellow/green)
- **Agent Tags**: Color-coded role indicators
- **Message Bubbles**: Glassmorphic with proper spacing
- **Typing Indicator**: Bouncing dots animation
- **Auto-scroll**: Smooth scroll to latest message
- **Monospace Formatting**: Sanction letters preserve formatting

---

## 🚀 Running the Application

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm

### Start MongoDB
```bash
mongod --dbpath C:\data\db
```

### Start Backend (Terminal 1)
```bash
cd server
npm install
npm start
```
**Running on**: http://localhost:5000

### Start Frontend (Terminal 2)
```bash
npm install
npm run dev
```
**Running on**: http://localhost:3000

---

## 🔑 API Endpoints

### CRM Service
```
GET /api/customers/phone/:phone
GET /api/customers/email/:email
GET /api/customers/id/:customerId
```

### Credit Bureau
```
GET /api/credit-score/:customerId
```

### Underwriting
```
POST /api/underwrite
Body: { customerId, requestedAmount }
Response: { decision, reason, creditScore, approvedAmount, conditions }
```

### AI Chat
```
POST /api/chat
Body: { messages, temperature, max_tokens }
Response: Groq API response
```

---

## 🎯 Challenge Requirements Checklist

✅ **Master Agent orchestrates conversation** - Implemented in App.tsx
✅ **Sales Agent negotiates terms** - AI-powered conversational flow
✅ **Verification Agent confirms KYC** - CRM database integration
✅ **Underwriting Agent evaluates eligibility** - Full business rules
✅ **Sanction Letter Generator creates PDF** - ASCII-art formatted letter
✅ **11 synthetic customers** - MongoDB with complete profiles
✅ **CRM Server** - MongoDB customers collection
✅ **Credit Bureau API** - MongoDB creditScores collection
✅ **Offer Mart Server** - MongoDB offers collection
✅ **Edge cases handled** - Rejection, conditional approval, new prospects
✅ **Conversational & persuasive** - AI-powered sales conversation
✅ **Realistic NBFC experience** - Professional tone, proper formatting

---

## 📞 Support

**Test Phone Numbers**:
- `9999109506` - Arshad Khan (Instant approval)
- `9876543210` - Rajesh Kumar (Instant approval)
- `9876543212` - Amit Patel (Conditional approval)
- `9876543214` - Vikram Singh (Rejection - low credit)

**Common Commands**:
- Enter phone number to identify customer
- "I need X lakh rupees" to request loan
- "upload salary slip" to submit documents
- Any natural conversation for AI sales interaction

---

## 🎓 Key Learnings

This solution demonstrates:
1. **Agentic AI Orchestration** - Master coordinating multiple specialized agents
2. **Real-time Database Integration** - MongoDB with async API calls
3. **Complex Business Logic** - NBFC underwriting rules implementation
4. **Premium UI/UX** - Apple/Stripe-inspired design system
5. **Multi-agent Workflow** - Sales → Verification → Underwriting → Sanction
6. **Edge Case Handling** - Rejections, conditional approvals, new prospects
7. **AI-powered Conversations** - Groq LLM with contextual prompts
