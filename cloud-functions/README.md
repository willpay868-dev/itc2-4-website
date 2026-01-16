# 🏭 Real Estate AI Factory

**Complete Production System** for automated real estate deal analysis, featuring:

- ✅ **Pace Morby Creative Finance Scoring** - Algorithmic deal evaluation
- ✅ **Financial Analysis Engine** - NOI, Cap Rate, Cash-on-Cash, ROI
- ✅ **Stripe Subscription System** - Monetize your deal flow
- ✅ **Gemini AI Integration** - Deep strategy analysis
- ✅ **Automated Workflow** - 60-minute daily power play
- ✅ **Cloud Scheduler** - Auto-scraping every 6 hours

---

## 🚀 Quick Start

### Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed ([Install Guide](https://cloud.google.com/sdk/install))
3. **Node.js 20+** installed
4. **Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))
5. **Stripe Account** (optional, for subscriptions)

### Deployment (5 Minutes)

```bash
cd cloud-functions

# 1. Run deployment script
./deploy.sh

# 2. Follow prompts to enter:
#    - Google Cloud Project ID
#    - Gemini API Key
#    - Stripe credentials (optional)

# 3. Get your function URL
gcloud functions describe real-estate-ai-factory \
  --region=us-central1 --gen2 \
  --format="value(serviceConfig.uri)"

# 4. Test it
curl YOUR_FUNCTION_URL/
```

### Setup Automated Scraping (Optional)

```bash
# Automatically scrape and analyze properties every 6 hours
./setup-cron.sh
```

---

## 📊 API Endpoints

### Core Analysis

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API status and available endpoints |
| `/test` | GET | Test database connection |
| `/scrape` | POST | Scrape and add properties |
| `/analyze` | POST | Run Pace Morby scoring on all properties |
| `/financial-analysis` | GET | Detailed financial metrics (NOI, Cap Rate, etc.) |
| `/properties` | GET | List all properties, sorted by score |
| `/hot-deals` | GET | Only deals scoring 80+ |

### AI & Workflow

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/daily-briefing` | GET | 60-minute workflow with top 5 deals |
| `/gemini-analyze` | GET | Deep AI strategy using Gemini |
| `/roi-calculator` | GET | Calculate ROI for any deal |

### Subscriptions (Stripe)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/subscribers` | GET | List active subscribers |
| `/create-checkout` | POST | Create Stripe checkout session |
| `/stripe-webhook` | POST | Handle Stripe webhook events |

---

## 🎯 The 60-Minute Daily Workflow

### Automated (Morning)

```
6:00 AM → Cloud Scheduler triggers /scrape
6:05 AM → Cloud Scheduler triggers /analyze
6:10 AM → All properties scored and ranked
```

### Your Active Time (9:00-10:00 AM)

```
9:00 AM (2 min)  → GET /daily-briefing
9:02 AM (10 min) → GET /financial-analysis
9:12 AM (15 min) → GET /gemini-analyze
9:27 AM (3 min)  → GET /hot-deals
9:30 AM (20 min) → Draft offers, send messages
9:50 AM (10 min) → Update pipeline
```

**Total: 60 minutes of focused work, 5-10 qualified offers sent.**

---

## 🔥 Pace Morby Scoring Algorithm

Our AI scoring system evaluates deals on a 0-100 scale:

### Score Breakdown

```javascript
Base Score:                       50 points

MOTIVATION (Days on Market):
  180+ days:                     +25
  90-179 days:                   +20
  60-89 days:                    +15
  30-59 days:                    +10

CASH FLOW:
  $1000+ monthly:                +20
  $500-999 monthly:              +10
  Negative:                      -20

PRICE PER UNIT:
  Under $100k/unit:              +15
  $100k-120k/unit:               +10

SPECIAL FACTORS:
  Opportunity Zone:              +20
  Temple area (19122):           +10
  5+ units:                      +10
  3-4 units:                     +5
```

### Verdict Scale

- **80-100** 🔥 HOT DEAL - Move fast!
- **60-79** ✅ Good - Strong opportunity
- **40-59** ⚠️ Review - Consider carefully
- **0-39** ❌ Pass - Not worth pursuing

---

## 💰 Financial Analysis Metrics

### Calculated Metrics

1. **NOI (Net Operating Income)**
   - Gross Income - Operating Expenses (50% rule)

2. **Cap Rate**
   - (NOI / Purchase Price) × 100
   - Target: 8%+

3. **Cash-on-Cash Return**
   - (Annual Cash Flow / Down Payment) × 100
   - Target: 10%+

4. **ROI (Return on Investment)**
   - Total returns including appreciation
   - Target: 12%+

5. **Gross Rent Multiplier**
   - Purchase Price / Annual Gross Income
   - Target: < 15

### Example Output

```json
{
  "address": "1706 N 25th St",
  "financials": {
    "monthlyGrossIncome": 5500,
    "annualGrossIncome": 66000,
    "noi": 33000,
    "annualCashFlow": 13680,
    "monthlyCashFlow": 1140,
    "capRate": "7.17%",
    "cashOnCashReturn": "9.92%",
    "roi": "14.12%",
    "downPaymentRequired": 138000
  },
  "recommendation": "✅ Good ROI"
}
```

---

## 🤖 Gemini AI Integration

### Deep Strategy Analysis

The `/gemini-analyze` endpoint uses Google's Gemini AI to:

1. Analyze top 3 deals
2. Recommend creative finance strategies:
   - Subject-To
   - Seller Financing
   - Lease Options
3. Provide specific offer structures
4. Generate seller talking points
5. Suggest exit strategies

### Example Prompt

```
Analyze these top 3 deals and provide:
1. Best Creative Finance Strategy
2. Specific Offer Structure
3. Seller Talking Points
4. Exit Strategy (BRRRR, flip, hold)
```

---

## 💳 Stripe Subscription Setup

### 1. Create Product in Stripe Dashboard

```
1. Go to: https://dashboard.stripe.com/products
2. Click "Add product"
3. Name: "Real Estate Deal Flow Premium"
4. Price: $97/month (or your pricing)
5. Copy the Price ID (starts with price_...)
```

### 2. Configure Webhook

```
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: YOUR_FUNCTION_URL/stripe-webhook
4. Events:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
5. Copy webhook secret
```

### 3. Update Secrets

```bash
# Add your Stripe credentials
echo -n "YOUR_PRICE_ID" | gcloud secrets versions add stripe-price-id --data-file=-
echo -n "YOUR_WEBHOOK_SECRET" | gcloud secrets versions add stripe-webhook-secret --data-file=-
```

### 4. Test Subscription Flow

```bash
# Create checkout session
curl -X POST YOUR_FUNCTION_URL/create-checkout

# Returns:
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_..."
}

# Complete payment → Webhook triggers → Subscriber added
```

---

## 🔧 Local Development

### Setup

```bash
npm install

# Create .env file
cp .env.example .env

# Edit .env with your keys
nano .env
```

### Run Locally

```bash
# Terminal 1: Start Firebase emulator (optional)
firebase emulators:start

# Terminal 2: Run function locally
npm start
```

### Test Endpoints

```bash
# Test database
curl http://localhost:8080/test

# Add properties
curl http://localhost:8080/scrape

# Run analysis
curl http://localhost:8080/analyze
```

---

## 📈 Monitoring & Logs

### View Logs

```bash
# Recent logs
gcloud functions logs read real-estate-ai-factory \
  --region=us-central1 \
  --limit=100

# Follow logs in real-time
gcloud functions logs read real-estate-ai-factory \
  --region=us-central1 \
  --follow
```

### Monitor Performance

```bash
# Function metrics
gcloud functions describe real-estate-ai-factory \
  --region=us-central1 \
  --gen2
```

---

## 🎯 Integration Examples

### With NotebookLM

```bash
# Export hot deals
curl YOUR_FUNCTION_URL/hot-deals > hot-deals.json

# Upload to NotebookLM and ask:
"Which 3 deals should I pursue today and why?"
```

### With Claude Code

```bash
claude code "Fetch deals from YOUR_FUNCTION_URL/hot-deals
and create offer letters for the top 3 using
subject-to financing strategy"
```

### With Google Sheets (Apps Script)

```javascript
function updateDashboard() {
  const url = 'YOUR_FUNCTION_URL/daily-briefing';
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange('A1').setValue('Daily Briefing');

  // Write top deals
  data.topDeals.forEach((deal, i) => {
    sheet.getRange(i + 2, 1).setValue(deal.address);
    sheet.getRange(i + 2, 2).setValue(deal.aiScore);
    sheet.getRange(i + 2, 3).setValue(deal.capRate);
  });
}
```

---

## 🚨 Troubleshooting

### Function Not Deploying

```bash
# Check quotas
gcloud projects describe YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
```

### Firestore Permissions

```bash
# Grant function service account Firestore access
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com" \
  --role="roles/datastore.user"
```

### Secrets Not Found

```bash
# List secrets
gcloud secrets list

# Grant function access to secrets
gcloud secrets add-iam-policy-binding gemini-api-key \
  --member="serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `STRIPE_SECRET_KEY` | No | Stripe secret key (sk_...) |
| `STRIPE_WEBHOOK_SECRET` | No | Stripe webhook secret (whsec_...) |
| `STRIPE_PRICE_ID` | No | Stripe subscription price ID |
| `GOOGLE_CLOUD_PROJECT` | Auto | Set by Cloud Functions |

---

## 🎉 What You've Built

✅ **Automated Property Scraping** - Every 6 hours via Cloud Scheduler
✅ **AI-Powered Scoring** - Pace Morby creative finance algorithm
✅ **Financial Analysis** - NOI, Cap Rate, ROI, Cash-on-Cash
✅ **Subscription Payments** - Stripe integration for monetization
✅ **Deep AI Strategy** - Gemini AI for creative finance tactics
✅ **60-Minute Workflow** - Daily power play for maximum efficiency
✅ **Complete REST API** - Easy integration with any tool

**This is a production-ready Real Estate AI Factory!** 🏭🚀

---

## 📚 Learn More

- [Pace Morby's Creative Finance](https://www.pacemorby.com/)
- [Google Cloud Functions](https://cloud.google.com/functions)
- [Firestore Documentation](https://cloud.google.com/firestore/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Google Gemini AI](https://ai.google.dev/)

---

## 📧 Support

For issues or questions:
1. Check the troubleshooting section
2. View Cloud Functions logs
3. Open an issue on GitHub

---

**Built with ❤️ for real estate investors who want to scale their deal flow using AI**
