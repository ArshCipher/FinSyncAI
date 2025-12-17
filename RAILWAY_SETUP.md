# 🚀 Railway Environment Variable Setup

## **CRITICAL: Set this in Railway Dashboard**

1. Go to: https://railway.app/dashboard
2. Select your project: **FinSyncAI**
3. Go to: **Variables** tab
4. Add this variable:

```
MONGODB_URI=mongodb+srv://testadmin:root123@cluster0.ynktkwu.mongodb.net/finsync?retryWrites=true&w=majority&appName=Cluster0
```

5. Click **Deploy** to restart with new variable

---

## **✅ Verification**

Your MongoDB Atlas now contains:
- ✅ **11 customers** (Rajesh, Priya, Amit, Sneha, Vikram, Ananya, Karan, Divya, Rohit, Meera, Arshad)
- ✅ **11 credit scores** (680-850 range)
- ✅ **3 loan offers** (Premium, Standard, Basic)

## **Demo Phone Numbers** (all seeded in Atlas):

| Name | Phone | Credit Score | Pre-Approved Limit |
|------|-------|--------------|-------------------|
| **Priya Sharma** | `+91-9876543211` | 850 | ₹10,00,000 |
| **Amit Patel** | `+91-9876543212` | 780 | ₹3,00,000 |
| **Vikram Singh** | `+91-9876543214` | 680 | ₹2,00,000 |
| **Arshad Khan** | `+91-9999109506` | 800 | ₹7,50,000 |

All data is now **LIVE in Atlas** and will work on Railway once you set the environment variable!
