# 🧪 Testing Guide - FinSync AI Multi-Agent System

## ✅ Requirements Met

### Business Context ✓
- ✅ Large-scale NBFC operating across India
- ✅ Offers personal loans, home loans, auto loans
- ✅ Objective: Increase revenue through web-based chatbot
- ✅ AI-driven conversational approach

### Master Agent ✓
- ✅ Chats with customers from digital ads/marketing emails
- ✅ Understands needs and convinces customers
- ✅ Orchestrates multiple Worker Agents
- ✅ Manages conversation flow
- ✅ Starts and ends conversations

### Worker Agents ✓
1. **Sales Agent** ✓
   - Negotiates loan terms
   - Discusses needs, amount, tenure, rates

2. **Verification Agent** ✓
   - Confirms KYC details
   - Uses dummy CRM server

3. **Underwriting Agent** ✓
   - Fetches credit score (out of 900)
   - Validates eligibility with exact rules:
     * Instant approval if amount ≤ pre-approved limit
     * Conditional if amount ≤ 2× limit (needs salary slip, EMI ≤ 50% salary)
     * Rejects if amount > 2× limit or credit score < 700

4. **Sanction Letter Generator** ✓
   - Generates automated sanction letter
   - Full PDF-ready format with all details

### Data & Systems ✓
- ✅ 10 synthetic customers with complete profiles
- ✅ Mock Offer Mart server (pre-approved limits)
- ✅ Mock CRM server (KYC data)
- ✅ Mock Credit Bureau API (credit scores)
- ✅ Simulated salary slip upload

---

## 🧑‍💼 Test Customer Database

### Customer 1: Rajesh Kumar (High Approval - Instant)
- **ID**: C001
- **Phone**: +91-9876543210
- **Email**: rajesh.kumar@email.com
- **City**: Mumbai
- **Credit Score**: 780/900 (Very Good)
- **Pre-approved Limit**: ₹5,00,000
- **Monthly Income**: ₹80,000
- **Current Loans**: Home Loan (₹25,000 EMI)
- **Test**: Request ₹3,00,000 → Should get instant approval

### Customer 2: Priya Sharma (Excellent Credit)
- **ID**: C002
- **Phone**: +91-9876543211
- **Email**: priya.sharma@email.com
- **City**: Bangalore
- **Credit Score**: 820/900 (Excellent)
- **Pre-approved Limit**: ₹8,00,000
- **Monthly Income**: ₹1,20,000
- **No current loans**
- **Test**: Request ₹7,00,000 → Should get instant approval

### Customer 3: Amit Patel (Conditional Approval)
- **ID**: C003
- **Phone**: +91-9876543212
- **Email**: amit.patel@email.com
- **City**: Ahmedabad
- **Credit Score**: 750/900 (Very Good)
- **Pre-approved Limit**: ₹6,00,000
- **Monthly Income**: ₹95,000
- **Test**: Request ₹10,00,000 → Needs salary slip, check EMI < 50% income

### Customer 4: Sneha Reddy (Existing Customer)
- **ID**: C004
- **Phone**: +91-9876543213
- **Email**: sneha.reddy@email.com
- **City**: Hyderabad
- **Credit Score**: 795/900 (Very Good)
- **Pre-approved Limit**: ₹7,00,000
- **Monthly Income**: ₹1,10,000
- **Current Loans**: Personal Loan (₹8,000 EMI)

### Customer 5: Vikram Singh (Low Credit Score)
- **ID**: C005
- **Phone**: +91-9876543214
- **Email**: vikram.singh@email.com
- **City**: Delhi
- **Credit Score**: 680/900 (Poor)
- **Pre-approved Limit**: ₹3,00,000
- **Monthly Income**: ₹65,000
- **Test**: Should get rejected due to credit score < 700

### Customer 6: Anjali Mehta (High Value)
- **ID**: C006
- **Phone**: +91-9876543215
- **Email**: anjali.mehta@email.com
- **City**: Pune
- **Credit Score**: 810/900 (Excellent)
- **Pre-approved Limit**: ₹9,00,000
- **Monthly Income**: ₹1,50,000
- **Multiple current loans** (Home + Auto)

### Customer 7: Karthik Iyer (Young Professional)
- **ID**: C007
- **Phone**: +91-9876543216
- **Email**: karthik.iyer@email.com
- **City**: Chennai
- **Credit Score**: 720/900 (Good)
- **Pre-approved Limit**: ₹4,00,000
- **Monthly Income**: ₹70,000

### Customer 8: Deepa Nair (Self-Employed)
- **ID**: C008
- **Phone**: +91-9876543217
- **Email**: deepa.nair@email.com
- **City**: Kochi
- **Credit Score**: 765/900 (Very Good)
- **Pre-approved Limit**: ₹5,50,000
- **Monthly Income**: ₹88,000
- **Employment**: Self-employed

### Customer 9: Rohit Malhotra (Premium)
- **ID**: C009
- **Phone**: +91-9876543218
- **Email**: rohit.malhotra@email.com
- **City**: Jaipur
- **Credit Score**: 850/900 (Excellent)
- **Pre-approved Limit**: ₹10,00,000
- **Monthly Income**: ₹1,40,000
- **Test**: Request ₹15,00,000 → Should get conditional/rejection

### Customer 10: Pooja Desai
- **ID**: C010
- **Phone**: +91-9876543219
- **Email**: pooja.desai@email.com
- **City**: Surat
- **Credit Score**: 740/900 (Good)
- **Pre-approved Limit**: ₹4,50,000
- **Monthly Income**: ₹75,000

---

## 🧪 Test Scenarios

### Scenario 1: Instant Approval (Happy Path)
```
User: Hi, my phone is 9876543210
Bot: [Identifies Rajesh Kumar, shows pre-approved offer]
User: I need 3 lakh rupees for my daughter's education
Bot: [Sales agent discusses terms]
Bot: [Verification agent confirms KYC]
Bot: [Underwriting agent approves instantly]
Bot: [Generates sanction letter]
```

### Scenario 2: Conditional Approval with Salary Slip
```
User: My email is amit.patel@email.com
Bot: [Identifies Amit Patel]
User: I want 10 lakh loan
Bot: [Sales negotiation]
Bot: [Underwriting says need salary slip]
User: upload salary slip
Bot: [Simulates upload, re-evaluates]
Bot: [Approves or adjusts amount based on EMI]
```

### Scenario 3: Rejection - Credit Score
```
User: 9876543214
Bot: [Identifies Vikram Singh]
User: I need 5 lakh
Bot: [Verification]
Bot: [Underwriting rejects due to credit score < 700]
Bot: [Suggests improvement steps]
```

### Scenario 4: Rejection - Amount Too High
```
User: C009
Bot: [Identifies Rohit]
User: I need 25 lakh
Bot: [Sales tries to negotiate down]
Bot: [Underwriting rejects - exceeds 2× pre-approved]
Bot: [Suggests maximum eligible amount]
```

### Scenario 5: New Customer Flow
```
User: I'm interested in a personal loan
Bot: [Sales pitch, asks for identification]
User: My phone is 9876543211
Bot: [Identifies Priya Sharma]
Bot: [Shows pre-approved offer with urgency]
User: Sounds good, I need 5 lakhs
Bot: [Complete flow through to sanction]
```

---

## 🎯 Key Features to Test

### 1. Customer Identification
- ✅ Phone number recognition
- ✅ Email recognition
- ✅ Customer ID recognition
- ✅ Profile loading from CRM

### 2. Sales Persuasion
- ✅ Personalized offers
- ✅ Urgency creation (limited time)
- ✅ Benefit highlighting
- ✅ Objection handling

### 3. Verification
- ✅ KYC confirmation
- ✅ Address verification
- ✅ Existing loan check

### 4. Underwriting Rules
- ✅ Credit score validation (≥700)
- ✅ Pre-approved limit check
- ✅ 2× limit rule
- ✅ EMI < 50% income rule
- ✅ Salary slip requirement

### 5. Sanction Letter
- ✅ Professional format
- ✅ All loan details included
- ✅ EMI breakdown
- ✅ Terms & conditions
- ✅ Validity period

### 6. Multi-Agent Coordination
- ✅ Smooth handoffs between agents
- ✅ Clear agent identification
- ✅ Context maintenance
- ✅ Workflow orchestration

---

## 📊 Expected Interest Rates (Based on Credit Score)

| Credit Score | Interest Rate | Rating |
|--------------|---------------|--------|
| 800+ | 10.5% | Excellent |
| 750-799 | 11.5% | Very Good |
| 700-749 | 12.5% | Good |
| 650-699 | 13.5% | Fair |
| <650 | 15.0% | Poor |

---

## 🚀 Quick Start Testing

1. **Open the app**: http://localhost:3000
2. **Start with any phone/email** from the list above
3. **Request a loan amount**
4. **Follow the conversation flow**
5. **Observe agent switches** (tags show which agent is active)

---

## 💡 Tips for Demo

1. Use **Priya Sharma** (C002) for smooth instant approval demo
2. Use **Vikram Singh** (C005) to show rejection handling
3. Use **Amit Patel** (C003) to demonstrate salary slip workflow
4. Mention amounts in "lakhs" for better recognition (e.g., "5 lakhs" or "5L")
5. Watch for agent tags to see multi-agent orchestration in action

---

**All requirements met! Ready for demo! 🎉**
