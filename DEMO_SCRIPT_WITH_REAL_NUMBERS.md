# 🎬 FinSync AI Demo Video Script - MongoDB Atlas Production Database
## EY Techathon 6.0 | Live Demo on Railway

> **✅ DATABASE STATUS**: All 11 customers seeded to MongoDB Atlas  
> **✅ RAILWAY DEPLOYMENT**: https://finsync-ai-mneen.up.railway.app  
> **⚠️ REQUIRED**: Set `MONGODB_URI` environment variable in Railway dashboard (see RAILWAY_SETUP.md)

---

## **📊 ACTUAL DATABASE CUSTOMERS (MongoDB Atlas Cloud)**

| **Name** | **Phone** | **Credit Score** | **Pre-Approved Limit** | **Monthly Income** | **Use Case** |
|----------|-----------|------------------|------------------------|-------------------|--------------|
| **Rajesh Kumar** | `+91-9876543210` | 820 | ₹5,00,000 | ₹1,50,000 | ✅ Instant Approval (existing) |
| **Priya Sharma** | `+91-9876543211` | 850 | ₹10,00,000 | ₹2,00,000 | ✅ **BEST for Demo 1** (highest limit) |
| **Amit Patel** | `+91-9876543212` | 780 | ₹3,00,000 | ₹1,20,000 | ✅ Conditional Approval (self-employed) |
| **Sneha Reddy** | `+91-9876543213` | 795 | ₹8,00,000 | ₹1,80,000 | ✅ Instant Approval |
| **Vikram Singh** | `+91-9876543214` | 680 | ₹2,00,000 | ₹90,000 | ⚠️ **Rejection Demo** (low score) |
| **Ananya Iyer** | `+91-9876543215` | 810 | ₹15,00,000 | ₹2,50,000 | ✅ Premium customer |
| **Karan Malhotra** | `+91-9876543216` | 745 | ₹6,00,000 | ₹1,60,000 | ✅ Conditional (self-employed) |
| **Divya Nair** | `+91-9876543217` | 770 | ₹4,00,000 | ₹1,40,000 | ✅ Standard approval |
| **Rohit Verma** | `+91-9876543218` | 725 | ₹3,50,000 | ₹1,10,000 | ✅ Conditional (borderline) |
| **Meera Desai** | `+91-9876543219` | 760 | ₹2,50,000 | ₹95,000 | ✅ Standard approval |
| **Arshad Khan** | `+91-9999109506` | 800 | ₹7,50,000 | ₹1,75,000 | ✅ Your test account |

---

## **🎯 DEMO 1: EXISTING CUSTOMER - INSTANT APPROVAL (45 seconds)**

### **Character**: Priya Sharma (BEST option - ₹10L limit, 850 credit score)

**Phone**: `+91-9876543211` (or just `9876543211` without country code)

### **Conversation Script**:

```
👤 User: Hi

🤖 AI: [Greeting] "Welcome! I'm your FinSync AI loan advisor. May I have your phone number?"

👤 User: 9876543211

🤖 AI: [CRM Recognition - instant!] 
"Welcome back, Priya Sharma! 🎉 
You're pre-approved for ₹10,00,000 at 10.5% (Premium Rate - Excellent Credit: 850). 
How much do you need today?"

👤 User: 2 lakhs

🤖 AI: [Instant calculation]
"Great choice! For ₹2,00,000, let me calculate your options.
What tenure would you prefer? (12-84 months available)"

👤 User: 24 months

🤖 AI: [EMI calculation + Instant Approval]
"Perfect! Here's your instant approval:

💰 Loan Amount: ₹2,00,000
⏱️ Tenure: 24 months
💳 EMI: ₹9,240/month
📊 Interest Rate: 10.5% p.a.
✅ Status: INSTANT APPROVED

Your sanction letter is ready! Download PDF below or receive via email."

[PDF DOWNLOAD BUTTON APPEARS]

👤 User: [Click "Download PDF"]
```

### **What to Highlight**:
- ✅ **Instant CRM recognition** (no KYC needed)
- ✅ **Credit score 850 shown** (builds trust)
- ✅ **₹10L pre-approved limit** (premium customer)
- ✅ **EMI calculation in real-time**
- ✅ **PDF generated immediately**
- ✅ **Total time: ~30-40 seconds**

**Action**: 
1. Open the downloaded PDF (2-3 seconds)
2. Show sanction letter with legal terms, CIN, APR
3. Zoom in on "Priya Sharma" (real name, not placeholder!)

---

## **🎯 DEMO 2: CONDITIONAL APPROVAL with OCR (90 seconds)**

### **Character**: Amit Patel (Self-employed, ₹3L pre-approved, score 780)

**Phone**: `+91-9876543212` (or `9876543212`)

### **Why Amit?**
- Credit score 780 (good but not instant for high amounts)
- Self-employed = needs income verification
- ₹3L pre-approved but can request more
- **NEW**: Gets provisional PDF at conditional approval, then final PDF after OCR
- Perfect for showing conditional → immediate PDF → OCR → final approval flow

### **Conversation Script**:

```
[Click "Start New Application" or refresh page]

👤 User: Hi

🤖 AI: "Welcome! Need a personal loan? I'm FinSync AI. What brings you here today?"

👤 User: I need 5 lakhs for business expansion

🤖 AI: [SPIN Selling - builds urgency]
"Business expansion is crucial! Delayed investment could mean lost market share.
Let's get you approved today. Your phone number?"

👤 User: 9876543212

🤖 AI: [OTP simulation] "6-digit OTP sent to +91-9876543212. Please confirm."

👤 User: 123456

🤖 AI: "Thanks! What's your PAN card number?"

👤 User: CDEFG3456H

🤖 AI: [Quick KYC] "Employment type? (Salaried/Self-Employed)"

👤 User: Self-Employed

🤖 AI: "Monthly income?"

👤 User: 120000

🤖 AI: "Current address? (City is enough)"

👤 User: Ahmedabad

🤖 AI: [Credit Check - shows processing]
"Checking your credit profile with CIBIL...

✅ Credit Score: 780/900 (Good!)
✅ Pre-approved limit: ₹3,00,000 at 11.5%

You've requested ₹5,00,000 (1.67× your pre-approved limit)."

🤖 AI: [CONDITIONAL APPROVAL - PROVISIONAL PDF GENERATED IMMEDIATELY!]
"CONDITIONAL APPROVAL! ✅

I can approve ₹5,00,000, but I need to verify your income for this amount.

Your provisional sanction letter is ready! You can download it now.

📝 SANCTION LETTER HIGHLIGHTS:
• Provisional Amount: ₹5,00,000
• Interest Rate: 11.5% p.a.
• Subject to income verification
• Valid for 15 days

To proceed to final approval, please upload:
• Latest 3 months bank statement OR
• Latest ITR with computation OR  
• Recent salary slip (for self-employed: business financials)

[PDF DOWNLOAD BUTTON APPEARS - Provisional Letter]
[FILE UPLOAD BUTTON APPEARS]"

👤 User: [Click file upload, select salary slip/ITR image]

🤖 AI: [OCR Processing - show progress]
"📄 Analyzing your document...

✅ Document Type: Bank Statement
✅ Account Holder: Amit Patel  
✅ Average Monthly Credit: ₹1,18,500
✅ Business Income: Verified
✅ Existing EMIs: ₹25,000/month

Affordability Check:
• Proposed EMI (₹5L @ 11.5% / 36 months): ₹16,420
• EMI as % of Income: 13.8% ✅
• Total Obligations: 34.9% of income ✅ (< 50% threshold)"

🤖 AI: [RE-UNDERWRITING - Final Decision]
"FINAL APPROVAL GRANTED! ✅

After document verification:

💰 Approved Amount: ₹4,50,000 (adjusted for risk profile)
⏱️ Tenure: 36 months  
💳 EMI: ₹14,778/month
📊 Interest Rate: 11.5% p.a.
✅ Processing Fee: ₹6,750 (1.5%)

Your updated final sanction letter is ready!

📝 DOWNLOAD YOUR PDF with:
✓ RBI-compliant terms & conditions
✓ Complete amortization schedule (36 months)  
✓ Prepayment & foreclosure clauses
✓ Grievance redressal (3-level escalation)
✓ CIN: U65999MH2024PLC123456
✓ NBFC Registration: N-14.03299

[DOWNLOAD UPDATED PDF BUTTON]

Our team will call you within 2 hours to complete disbursement."
```

### **What to Highlight**:
- ✅ **SPIN selling** (urgency: "lost market share")
- ✅ **6 conversational inputs** vs 47-field form
- ✅ **Real-time credit check** (780 score displayed)
- ✅ **PDF generated at conditional stage** ← NEW!
- ✅ **OCR extraction** (show income breakdown)
- ✅ **Affordability calculation** (EMI % of income)
- ✅ **Risk-adjusted approval** (₹5L requested → ₹4.5L approved)
- ✅ **Updated PDF after verification**
- ✅ **Total time: ~2-3 minutes**

**Pro Tip**: Use a mock bank statement image with "Amit Patel" and monthly credits showing ₹1,18,500

---

## **🎯 DEMO 3: REJECTION with REMEDIATION (30 seconds)**

### **Character**: Vikram Singh (Low credit score 680, high existing EMIs)

**Phone**: `+91-9876543214` (or `9876543214`)

### **Why Vikram?**
- Credit score 680 (below 700 threshold for instant approval)
- Existing EMIs ₹35,000 (high debt burden)
- Monthly income ₹90,000 (DTI ratio will be high)
- Perfect for showing **explainable rejection**

### **Conversation Script**:

```
[Refresh or start new]

👤 User: Hi

🤖 AI: "Welcome! Need a loan? Your phone?"

👤 User: 9876543214

🤖 AI: [Quick KYC collection]
"Thanks! PAN card number?"

👤 User: EFGHI5678J

🤖 AI: "How much do you need?"

👤 User: 4 lakhs

🤖 AI: "Monthly income?"

👤 User: 90000

🤖 AI: [Credit Check]
"Checking your credit profile...

Credit Score: 680/900
Existing EMIs: ₹35,000/month
Requested Amount: ₹4,00,000

Evaluating your application..."

🤖 AI: [REJECTION with REMEDIATION]
"❌ Unable to approve ₹4,00,000

**Reason:** Your debt-to-income ratio is **64.8%** (above our 50% threshold).

**Current Situation:**
• Monthly Income: ₹90,000
• Existing EMIs: ₹35,000  
• Proposed New EMI: ₹13,320
• Total EMI Burden: ₹48,320 (64.8% of income) ❌

**Path to Approval:** ✅

Option 1: **Pay off existing debt**
→ Clear ₹1,80,000 existing debt (reduces EMI by ₹15,000)
→ New DTI: 42.6% ✅ → **Re-apply for ₹4L approval**

Option 2: **Request lower amount**
→ ₹2,00,000 loan (EMI ₹6,660)  
→ Total DTI: 46.3% ✅ → **Instant approval possible**

Option 3: **Improve credit score**
→ Current: 680 | Target: 720+
→ Pay bills on time for 3 months
→ Dispute errors on credit report
→ **Re-apply with better terms**

Would you like to explore Option 2 (₹2L approval) now?"
```

### **What to Highlight**:
- ✅ **Transparent rejection reason** (not "application denied")
- ✅ **Exact DTI calculation shown** (64.8%)
- ✅ **Explainable AI** (cites RBI-compliant 50% threshold)
- ✅ **3 actionable remediation paths** (not dead-end)
- ✅ **Alternative offer** (₹2L instead of ₹4L)
- ✅ **Regulatory compliance** (RBI audit-ready explanation)

---

## **🎯 OPTIONAL DEMO 4: NEW CUSTOMER INSTANT APPROVAL (if time permits)**

### **Character**: Arshad Khan (Your account! - 800 score, ₹7.5L limit)

**Phone**: `+91-9999109506`

### **Quick Script**:

```
👤 User: I need 1 lakh urgently

[Complete quick KYC]

🤖 AI: [Credit check]
"Excellent! Credit Score: 800/900
Pre-approved: ₹7,50,000

INSTANT APPROVED! ₹1,00,000 @ 11% for 24 months
EMI: ₹4,625/month

Your sanction letter is ready!"
```

**Total time**: ~35 seconds

---

## **📋 DEMO PREPARATION CHECKLIST**

### **CRITICAL: Before Recording, Verify MongoDB Atlas Setup**:

⚠️ **Railway Environment Variable** (MUST BE SET):
   - Go to Railway dashboard → FinSyncAI project → Variables tab
   - Add: `MONGODB_URI` = `mongodb+srv://testadmin:root123@cluster0.ynktkwu.mongodb.net/finsync?retryWrites=true&w=majority&appName=Cluster0`
   - Click **Deploy** and wait ~45 seconds for restart
   - 📝 **See RAILWAY_SETUP.md for detailed instructions**

✅ **Verify Atlas Data is Accessible**:
   - Open: https://finsync-ai-mneen.up.railway.app
   - Test with Priya's phone: `9876543211`
   - **Expected**: "Welcome back, Priya Sharma! You're pre-approved for ₹10,00,000..."
   - **If fails**: Check Railway logs, verify MONGODB_URI is set

### **Before Recording**:

✅ **Test all phone numbers on live site** (Railway + MongoDB Atlas):
   - `9876543211` (Priya - Demo 1) ← START HERE
   - `9876543212` (Amit - Demo 2)
   - `9876543214` (Vikram - Demo 3)
   - `9999109506` (Arshad - Your account)

✅ **Prepare income verification document**:
   - Create mock bank statement with "Amit Patel"
   - Show monthly credits: ₹1,18,500
   - Save as JPG/PNG (Tesseract will extract text)

✅ **Browser setup**:
   - Fresh incognito window
   - Clear localStorage (if testing multiple times)
   - Zoom 100%
   - Close unnecessary tabs

✅ **Verify Railway deployment is live**:
   - Check: https://finsync-ai-mneen.up.railway.app
   - Ensure MongoDB Atlas connection is active
   - Test one customer manually before recording

---

## **⏱️ TIMING BREAKDOWN**

| **Section** | **Duration** | **Cumulative** |
|------------|-------------|----------------|
| Intro | 15 sec | 0:15 |
| Demo 1: Priya (Instant) | 40 sec | 0:55 |
| Demo 2: Amit (Conditional + OCR) | 90 sec | 2:25 |
| Demo 3: Vikram (Rejection) | 30 sec | 2:55 |
| Demo 4: Arshad (Optional) | 35 sec | 3:30 |
| Closing + PDF showcase | 20 sec | 3:50 |
| **TOTAL** | | **~4 minutes** |

---

## **🚨 CRITICAL NOTES**

### **Phone Number Format**:
Railway backend expects phone numbers **with country code** in database (`+91-9876543210`), but users can enter:
- ✅ `9876543211` (frontend adds +91)
- ✅ `+91-9876543211` (direct)
- ✅ `+919876543211` (no hyphen)

### **Customer ID Mapping**:
- Priya = `C002` (customerId in database)
- Amit = `C003`
- Vikram = `C005`
- Arshad = `C011`

### **Credit Score Thresholds** (in your underwriting engine):
- **≥ 750**: Instant approval (no docs needed)
- **700-749**: Conditional approval (needs income verification)
- **< 700**: Likely rejection (unless amount is very low)

### **Pre-Approved Limit Logic**:
- If `requestedAmount ≤ preApprovedLimit` AND `creditScore ≥ 750` → **INSTANT**
- If `requestedAmount > preApprovedLimit` AND `creditScore ≥ 700` → **CONDITIONAL**
- If `creditScore < 700` OR `DTI > 50%` → **REJECTED**

---

## **🎥 PRO RECORDING TIPS**

1. **Demo 1 (Priya) is your HOOK** - nail this in one take (40 seconds of pure magic)
2. **Demo 2 (Amit) is your SHOWSTOPPER** - OCR is what separates you from basic chatbots
3. **Demo 3 (Vikram) proves compliance** - explainable AI for RBI audits
4. **Always show PDF downloads** - open them on screen (2-3 seconds each)

**Narration Key Phrases**:
- "28 seconds vs 4.2 days" ← repeat this
- "No placeholders - real customer names from MongoDB Atlas"
- "RBI-compliant legal PDFs with CIN, APR disclosure"
- "Explainable AI - every decision has a reason"

---

## **✅ VALIDATION CHECKLIST**

Before recording demo video:

- [ ] **Railway MONGODB_URI environment variable is set** ← CRITICAL!
- [ ] **Tested Priya's phone on live URL** (confirms Atlas connection)
- [ ] Priya shows **real name** in responses (not [customer name])
- [ ] PDF downloads show **legal formatting** (CIN, APR, T&Cs)
- [ ] OCR shows **income extraction** (₹1,18,500 visible)
- [ ] Rejection shows **DTI calculation** (64.8% with remediation)
- [ ] All timestamps are **visible** (proves speed claims)
- [ ] GitHub repo link is **shown** (proves code depth)

---

---

## **🔧 TROUBLESHOOTING GUIDE**

### **Issue 1: "Customer not found" for Priya (9876543211)**

**Cause**: Railway doesn't have MONGODB_URI environment variable set

**Fix**:
1. Go to Railway dashboard: https://railway.app/dashboard
2. Select FinSyncAI project
3. Click **Variables** tab
4. Click **New Variable**
5. Set: `MONGODB_URI` = `mongodb+srv://testadmin:root123@cluster0.ynktkwu.mongodb.net/finsync?retryWrites=true&w=majority&appName=Cluster0`
6. Click **Deploy** 
7. Wait 45 seconds for Railway to restart
8. Test again with 9876543211

**Verify**: Check Railway logs for "✓ Connected to MongoDB"

---

### **Issue 2: PDF Download Button Not Appearing**

**Cause**: Recent code changes (commit 71d09d3) may not be deployed to Railway

**Fix**:
1. Check latest commit on Railway matches GitHub
2. If not, manually trigger redeploy in Railway dashboard
3. Ensure `sanctionLetterGenerated: true` is set in conversation state

**Expected**: PDF button appears for BOTH conditional and instant approvals now

---

### **Issue 3: OCR Not Extracting Income**

**Cause**: Image quality too low or text not readable

**Fix**:
1. Use high-resolution bank statement image (at least 1200px wide)
2. Ensure text is clear and not blurry
3. Try different lighting if using phone camera
4. Use mock statement from `server/mockDocuments/` folder (if created)

**Backup Plan**: Skip OCR demo if time is tight - focus on instant approval (Demo 1)

---

### **Issue 4: Live URL Not Responding**

**Cause**: Railway free tier may have cold start delays

**Fix**:
1. Open https://finsync-ai-mneen.up.railway.app in browser
2. Wait 10-15 seconds for initial load (cold start)
3. Refresh page once loaded
4. Keep tab open 5 minutes before recording (keeps server warm)

---

**Ready to record your winning demo! 🎬🏆**

Start with Priya (9876543211) - that instant approval will hook the judges in the first 40 seconds!
