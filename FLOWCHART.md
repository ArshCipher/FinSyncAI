# FinSync AI - Complete Flow Chart
## EY Techathon 6.0 | Decision Flow & User Journey

---

## **🔄 MASTER CONVERSATION FLOW**

```
                            START
                              │
                              ↓
                    ┌─────────────────┐
                    │   USER ENTRY    │
                    │  (Landing Page) │
                    └─────────────────┘
                              │
                              ↓
                    ┌─────────────────┐
                    │   GREETING      │◄──────────────┐
                    │ "Welcome! Need  │               │
                    │  a loan?"       │               │
                    └─────────────────┘               │
                              │                       │
                              ↓                       │
                    ┌─────────────────┐               │
                    │ IDENTIFICATION  │               │
                    │ "Your phone?"   │               │
                    └─────────────────┘               │
                              │                       │
                              ↓                       │
                    ┌─────────────────┐               │
              ┌─────│  VERIFICATION   │               │
              │     │  (OTP/Database) │               │
              │     └─────────────────┘               │
              │               │                       │
              │               ↓                       │
              │     ┌─────────────────┐               │
              │  ┌──│ Customer Exists?│──┐            │
              │  │  └─────────────────┘  │            │
              │  │                       │            │
              │ YES                     NO            │
              │  │                       │            │
              │  ↓                       ↓            │
              │ ┌─────────────────┐   ┌─────────────────┐
              │ │ CRM RECOGNITION │   │   FULL KYC      │
              │ │ "Welcome back,  │   │ • PAN card      │
              │ │  {NAME}!"       │   │ • Aadhaar       │
              │ │ Show pre-       │   │ • Address       │
              │ │ approved limit  │   │ • Employment    │
              │ └─────────────────┘   │ • Income        │
              │         │             └─────────────────┘
              │         │                       │
              │         └───────────┬───────────┘
              │                     │
              │                     ↓
              │           ┌─────────────────┐
              │           │ CREDIT CHECK    │
              │           │ • API Call      │
              │           │ • Score: 0-900  │
              │           │ • History data  │
              │           └─────────────────┘
              │                     │
              │                     ↓
              │           ┌─────────────────┐
              │           │ LOAN DISCUSSION │
              │           │ "How much do    │
              │           │  you need?"     │
              │           └─────────────────┘
              │                     │
              │                     ↓
              │           ┌─────────────────┐
              │           │ TENURE SELECTION│
              │           │ "12-84 months?" │
              │           └─────────────────┘
              │                     │
              │                     ↓
              │           ┌─────────────────┐
              │           │ EMI CALCULATION │
              │           │ Display monthly │
              │           │ payment         │
              │           └─────────────────┘
              │                     │
              │                     ↓
              └──────────►┌─────────────────┐
                          │ UNDERWRITING    │
                          │ (Decision Tree) │
                          └─────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                ↓                   ↓                   ↓
      ┌───────────────────┐ ┌───────────────┐ ┌───────────────────┐
      │ INSTANT APPROVED  │ │ CONDITIONAL   │ │    REJECTED       │
      │                   │ │ APPROVED      │ │                   │
      │ Criteria:         │ │               │ │ Criteria:         │
      │ • Score ≥ 750     │ │ Criteria:     │ │ • Score < 700     │
      │ • Amount ≤        │ │ • Score ≥ 700 │ │ OR                │
      │   preApproved     │ │ • Amount >    │ │ • DTI > 50%       │
      │ • DTI ≤ 50%       │ │   preApproved │ │ OR                │
      │                   │ │   (but < 2×)  │ │ • Existing loan   │
      │                   │ │               │ │   defaults        │
      └───────────────────┘ └───────────────┘ └───────────────────┘
                │                   │                   │
                ↓                   ↓                   ↓
      ┌───────────────────┐ ┌───────────────┐ ┌───────────────────┐
      │ GENERATE          │ │ REQUEST       │ │ SHOW REMEDIATION  │
      │ SANCTION LETTER   │ │ DOCUMENTS     │ │                   │
      │                   │ │               │ │ Option 1:         │
      │ • jsPDF creation  │ │ "Upload:      │ │ Pay off debt      │
      │ • Legal format    │ │ • Salary slip │ │                   │
      │ • RBI T&Cs        │ │ • Bank stmt   │ │ Option 2:         │
      │ • CIN, APR        │ │ • ITR         │ │ Lower amount      │
      │ • Amortization    │ │               │ │                   │
      │                   │ │ GENERATE      │ │ Option 3:         │
      │                   │ │ PROVISIONAL   │ │ Improve score     │
      │                   │ │ PDF NOW!      │ │                   │
      └───────────────────┘ └───────────────┘ └───────────────────┘
                │                   │                   │
                │                   ↓                   ↓
                │         ┌───────────────────┐ ┌──────────────┐
                │         │ DOCUMENT UPLOAD   │ │ ALTERNATIVE  │
                │         │ (OCR Processing)  │ │ OFFER        │
                │         │                   │ │              │
                │         │ • Tesseract.js    │ │ "Would you   │
                │         │ • Extract income  │ │  like ₹2L    │
                │         │ • Verify details  │ │  instead?"   │
                │         └───────────────────┘ └──────────────┘
                │                   │                   │
                │                   ↓                   ↓
                │         ┌───────────────────┐ ┌──────────────┐
                │         │ RE-UNDERWRITING   │ │ USER CHOICE  │
                │         │ with verified     │ │              │
                │         │ income            │ │ Accept or    │
                │         │                   │ │ Exit         │
                │         └───────────────────┘ └──────────────┘
                │                   │                   │
                │                   ↓                   │
                │         ┌───────────────────┐         │
                │         │ FINAL APPROVAL    │         │
                │         │                   │         │
                │         │ • Adjusted amount │         │
                │         │ • Updated PDF     │         │
                │         └───────────────────┘         │
                │                   │                   │
                └───────────────────┴───────────────────┘
                                    │
                                    ↓
                          ┌───────────────────┐
                          │ SANCTION LETTER   │
                          │ DELIVERY          │
                          │                   │
                          │ • PDF Download    │
                          │ • Email (SMTP)    │
                          │ • Show details    │
                          └───────────────────┘
                                    │
                                    ↓
                          ┌───────────────────┐
                          │ ACCEPTANCE        │
                          │                   │
                          │ "Apply Now" or    │
                          │ "Review Later"    │
                          └───────────────────┘
                                    │
                                    ↓
                          ┌───────────────────┐
                          │ COMPLETION        │
                          │                   │
                          │ "Our team will    │
                          │  call you in      │
                          │  2 hours"         │
                          └───────────────────┘
                                    │
                                    ↓
                                  END
```

---

## **🎯 UNDERWRITING DECISION TREE (Detailed Logic)**

```
                     ┌─────────────────────────┐
                     │  UNDERWRITING ENGINE    │
                     │  Input: Customer Data   │
                     └─────────────────────────┘
                                 │
                                 ↓
                  ┌──────────────────────────┐
            ┌─────│ Credit Score Available? │─────┐
            │     └──────────────────────────┘     │
           YES                                    NO
            │                                      │
            ↓                                      ↓
  ┌──────────────────┐                  ┌──────────────────┐
  │ Check Score      │                  │ MANUAL REVIEW    │
  │ Threshold        │                  │ Fallback mode    │
  └──────────────────┘                  │ → Human          │
            │                            │   underwriter    │
            ↓                            └──────────────────┘
  ┌──────────────────┐
  │ Score ≥ 750?     │
  └──────────────────┘
         │     │
        YES   NO
         │     │
         │     ↓
         │   ┌──────────────────┐
         │   │ Score ≥ 700?     │
         │   └──────────────────┘
         │        │        │
         │       YES      NO
         │        │        │
         │        │        ↓
         │        │   ┌──────────────────┐
         │        │   │ Score < 700      │
         │        │   │ → HIGH RISK      │
         │        │   └──────────────────┘
         │        │             │
         │        │             ↓
         │        │   ┌──────────────────────┐
         │        │   │ Calculate DTI Ratio  │
         │        │   │ DTI = (Total EMIs /  │
         │        │   │        Net Income)   │
         │        │   └──────────────────────┘
         │        │             │
         │        │             ↓
         │        │   ┌──────────────────┐
         │        │   │ DTI ≤ 50%?       │
         │        │   └──────────────────┘
         │        │        │        │
         │        │       YES      NO
         │        │        │        │
         │        │        │        ↓
         │        │        │   ┌──────────────────┐
         │        │        │   │ REJECT           │
         │        │        │   │ Reason: High DTI │
         │        │        │   │ Remediation:     │
         │        │        │   │ Pay off ₹XX debt│
         │        │        │   └──────────────────┘
         │        │        │
         │        │        ↓
         │        │   ┌──────────────────┐
         │        │   │ Check loan       │
         │        │   │ amount           │
         │        │   └──────────────────┘
         │        │        │
         │        │        ↓
         │        │   ┌──────────────────┐
         │        │   │ Amount ≤ ₹2L?    │
         │        │   └──────────────────┘
         │        │        │        │
         │        │       YES      NO
         │        │        │        │
         │        │        ↓        ↓
         │        │   ┌────────┐  ┌────────┐
         │        │   │APPROVE │  │REJECT  │
         │        │   │with    │  │with    │
         │        │   │caution │  │remedy  │
         │        │   └────────┘  └────────┘
         │        │
         │        ↓
         │   ┌──────────────────────┐
         │   │ CONDITIONAL PATH     │
         │   │ (Score 700-749)      │
         │   └──────────────────────┘
         │             │
         │             ↓
         │   ┌──────────────────────┐
         │   │ Amount ≤             │
         │   │ preApprovedLimit?    │
         │   └──────────────────────┘
         │        │            │
         │       YES          NO
         │        │            │
         │        ↓            ↓
         │   ┌────────┐  ┌──────────────────┐
         │   │INSTANT │  │ Amount ≤ 2×      │
         │   │APPROVE │  │ preApproved?     │
         │   └────────┘  └──────────────────┘
         │                    │        │
         │                   YES      NO
         │                    │        │
         │                    ↓        ↓
         │            ┌──────────┐  ┌────────┐
         │            │REQUEST   │  │REJECT  │
         │            │DOCUMENTS │  │Amount  │
         │            │→ COND.   │  │too high│
         │            │APPROVAL  │  └────────┘
         │            └──────────┘
         │
         ↓
  ┌──────────────────────┐
  │ INSTANT PATH         │
  │ (Score ≥ 750)        │
  └──────────────────────┘
            │
            ↓
  ┌──────────────────────┐
  │ Amount ≤             │
  │ preApprovedLimit?    │
  └──────────────────────┘
         │        │
        YES      NO
         │        │
         ↓        ↓
  ┌──────────┐  ┌──────────────────┐
  │ Calculate│  │ Same as 700-749  │
  │ DTI      │  │ conditional logic│
  └──────────┘  └──────────────────┘
         │
         ↓
  ┌──────────────────┐
  │ DTI ≤ 50%?       │
  └──────────────────┘
         │        │
        YES      NO
         │        │
         ↓        ↓
  ┌──────────┐  ┌────────┐
  │ INSTANT  │  │REJECT  │
  │ APPROVED │  │High DTI│
  └──────────┘  └────────┘
```

---

## **📄 DOCUMENT UPLOAD & OCR FLOW**

```
          ┌─────────────────────┐
          │ CONDITIONAL         │
          │ APPROVAL GIVEN      │
          │ (Provisional PDF)   │
          └─────────────────────┘
                    │
                    ↓
          ┌─────────────────────┐
          │ DOCUMENT UPLOAD UI  │
          │ • File picker       │
          │ • Image preview     │
          │ • Upload button     │
          └─────────────────────┘
                    │
                    ↓
          ┌─────────────────────┐
          │ User selects image  │
          │ (Salary slip, ITR,  │
          │  Bank statement)    │
          └─────────────────────┘
                    │
                    ↓
          ┌─────────────────────┐
          │ TESSERACT.JS OCR    │
          │ (Client-side)       │
          │                     │
          │ Processing...       │
          │ [Progress bar]      │
          └─────────────────────┘
                    │
                    ↓
          ┌─────────────────────┐
    ┌─────│ Text extracted?     │─────┐
    │     └─────────────────────┘     │
   YES                               NO
    │                                 │
    ↓                                 ↓
┌─────────────────────┐     ┌─────────────────────┐
│ PARSE SALARY DATA   │     │ OCR FAILED          │
│                     │     │                     │
│ Extract:            │     │ "Image unclear.     │
│ • Name              │     │  Try:               │
│ • Monthly gross     │     │  • Better lighting  │
│ • Net income        │     │  • Clear photo      │
│ • Employer          │     │  • Different angle" │
│ • Pay period        │     │                     │
└─────────────────────┘     │ [Retry button]      │
          │                 └─────────────────────┘
          ↓                           │
┌─────────────────────┐               │
│ VALIDATION          │               │
│                     │               │
│ Check:              │               │
│ • Name matches PAN? │               │
│ • Income realistic? │               │
│ • Format valid?     │               │
└─────────────────────┘               │
          │                           │
          ↓                           │
┌─────────────────────┐               │
│ Validation passed?  │               │
└─────────────────────┘               │
     │            │                   │
    YES          NO                   │
     │            │                   │
     │            ↓                   │
     │  ┌─────────────────────┐      │
     │  │ REQUEST RE-UPLOAD   │      │
     │  │ "Details don't      │      │
     │  │  match. Please      │      │
     │  │  upload correct     │      │
     │  │  document"          │      │
     │  └─────────────────────┘      │
     │            │                   │
     │            └───────────────────┘
     │
     ↓
┌─────────────────────┐
│ AFFORDABILITY CHECK │
│                     │
│ Calculate:          │
│ • New EMI for loan  │
│ • Total EMI burden  │
│ • DTI ratio         │
│ • EMI as % of net   │
└─────────────────────┘
          │
          ↓
┌─────────────────────┐
│ EMI ≤ 50% of income?│
└─────────────────────┘
     │            │
    YES          NO
     │            │
     ↓            ↓
┌──────────┐  ┌──────────┐
│ RE-RUN   │  │ ADJUST   │
│ UNDER-   │  │ LOAN     │
│ WRITING  │  │ AMOUNT   │
│          │  │ DOWN     │
│ → FINAL  │  │          │
│ APPROVAL │  │ → RETRY  │
└──────────┘  └──────────┘
     │
     ↓
┌─────────────────────┐
│ GENERATE FINAL PDF  │
│ (Updated sanction   │
│  letter with        │
│  verified income)   │
└─────────────────────┘
     │
     ↓
┌─────────────────────┐
│ DELIVER TO USER     │
│ • Download button   │
│ • Email attachment  │
└─────────────────────┘
```

---

## **🔀 STATE MACHINE TRANSITIONS**

| **Current State** | **User Action** | **Agent Action** | **Next State** | **Validation** |
|-------------------|----------------|------------------|----------------|----------------|
| `GREETING` | Any message | Welcome + intro | `IDENTIFICATION` | None |
| `IDENTIFICATION` | Provides phone | Validate format | `VERIFICATION` | Regex: /^\+?91[6-9]\d{9}$/ |
| `VERIFICATION` | OTP entered | Check database | `KYC` or `CREDIT_CHECK` | OTP match or customer exists |
| `KYC` | PAN provided | Store + validate | `EMPLOYMENT` | Regex: /^[A-Z]{5}\d{4}[A-Z]$/ |
| `EMPLOYMENT` | Salaried/Self | Store employment | `INCOME` | Enum validation |
| `INCOME` | Amount in ₹ | Validate range | `ADDRESS` | Min ₹10K, Max ₹10L |
| `ADDRESS` | City/State | Store location | `CREDIT_CHECK` | Non-empty string |
| `CREDIT_CHECK` | - | API call to bureau | `LOAN_DISCUSSION` | Score 300-900 |
| `LOAN_DISCUSSION` | Loan amount | Extract + validate | `TENURE` | Min ₹25K, Max ₹50L |
| `TENURE` | Months (12-84) | Calculate EMI | `UNDERWRITING` | 12 ≤ tenure ≤ 84 |
| `UNDERWRITING` | - | Decision rules | `INSTANT`/`COND`/`REJECT` | Logic tree |
| `INSTANT_APPROVED` | - | Generate PDF | `SANCTION_LETTER` | None |
| `CONDITIONAL_APPROVED` | - | Request docs + PDF | `DOCUMENT_UPLOAD` | None |
| `DOCUMENT_UPLOAD` | Upload file | OCR processing | `FINAL_APPROVAL` | File size < 5MB |
| `FINAL_APPROVAL` | - | Re-underwrite + PDF | `SANCTION_LETTER` | Income verified |
| `REJECTED` | Choose option | Show alternatives | `LOAN_DISCUSSION` or `END` | User choice |
| `SANCTION_LETTER` | Download/Email | Deliver PDF | `ACCEPTANCE` | None |
| `ACCEPTANCE` | Apply Now | Store application | `COMPLETION` | None |
| `COMPLETION` | - | Thank you message | `END` | None |

---

## **⚡ PARALLEL PROCESSING FLOWS**

```
USER ENTERS PHONE
        │
        ↓
┌───────────────────────────────────────┐
│  PARALLEL EXECUTION (Saves 3.2s!)    │
├───────────────────────────────────────┤
│                                       │
│  Thread 1:              Thread 2:    │
│  ┌──────────────┐      ┌──────────┐  │
│  │ CRM LOOKUP   │      │ CREDIT   │  │
│  │              │      │ CHECK    │  │
│  │ MongoDB      │      │          │  │
│  │ query:       │      │ API call:│  │
│  │ customers.   │      │ /score   │  │
│  │ findOne()    │      │          │  │
│  │              │      │          │  │
│  │ 82ms         │      │ 156ms    │  │
│  └──────────────┘      └──────────┘  │
│         │                    │        │
│         └──────────┬─────────┘        │
│                    ↓                  │
│         ┌─────────────────┐           │
│         │ MERGE RESULTS   │           │
│         │ Total: 156ms    │           │
│         │ (not 238ms!)    │           │
│         └─────────────────┘           │
└───────────────────────────────────────┘
```

---

**Flow Chart Version**: 1.0 (December 2024)  
**Decision Points**: 18 major nodes  
**Average Flow Time**: 2 minutes (instant) to 4 minutes (conditional)  
**Success Paths**: 3 (Instant, Conditional, Alternative)  
**Failure Paths**: 1 (Rejection with remediation)
