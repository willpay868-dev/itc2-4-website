/**
 * Real Estate AI Factory - Complete Production System
 * Integrates: Pace Morby scoring, Financial analysis, Stripe subscriptions, Gemini AI
 */

const { Firestore } = require('@google-cloud/firestore');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Stripe = require('stripe');

// Initialize services
const db = new Firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Collections
const PROPERTIES_COLLECTION = 'properties';
const SUBSCRIBERS_COLLECTION = 'subscribers';

/**
 * Main request handler for Cloud Functions
 */
exports.handleRequest = async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  const path = req.path || '/';

  try {
    // Route handling
    switch (path) {
      case '/':
        return res.json({
          status: 'online',
          system: 'Real Estate AI Factory',
          version: '1.0.0',
          endpoints: [
            '/test - Test database connection',
            '/scrape - Scrape and add properties',
            '/analyze - Run Pace Morby scoring',
            '/financial-analysis - Calculate NOI, Cap Rate, ROI',
            '/properties - List all properties',
            '/hot-deals - Get deals scoring 80+',
            '/daily-briefing - 60-minute workflow briefing',
            '/gemini-analyze - Deep AI strategy analysis',
            '/roi-calculator - Calculate ROI for any deal',
            '/subscribers - View active subscribers',
            '/create-checkout - Create Stripe checkout session',
            '/stripe-webhook - Stripe webhook handler'
          ]
        });

      case '/test':
        return await testDatabase(req, res);

      case '/scrape':
        return await scrapeProperties(req, res);

      case '/analyze':
        return await analyzeProperties(req, res);

      case '/financial-analysis':
        return await financialAnalysis(req, res);

      case '/properties':
        return await listProperties(req, res);

      case '/hot-deals':
        return await getHotDeals(req, res);

      case '/daily-briefing':
        return await getDailyBriefing(req, res);

      case '/gemini-analyze':
        return await geminiAnalyze(req, res);

      case '/roi-calculator':
        return await roiCalculator(req, res);

      case '/subscribers':
        return await listSubscribers(req, res);

      case '/create-checkout':
        return await createCheckoutSession(req, res);

      case '/stripe-webhook':
        return await handleStripeWebhook(req, res);

      default:
        return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Test database connection
 */
async function testDatabase(req, res) {
  try {
    const testDoc = await db.collection('_test').doc('connection').set({
      status: 'connected',
      timestamp: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: 'Database connected successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Scrape and add sample properties
 * In production, replace with actual MLS data feed
 */
async function scrapeProperties(req, res) {
  const sampleProperties = [
    {
      address: '1706 N 25th St, Philadelphia, PA 19121',
      zipCode: '19121',
      price: 460000,
      units: 5,
      monthlyRent: 5500,
      daysOnMarket: 45,
      opportunityZone: false,
      images: ['https://example.com/property1.jpg'],
      description: '5-unit multi-family in Temple area',
      scraped: new Date().toISOString()
    },
    {
      address: '2145 N Broad St, Philadelphia, PA 19122',
      zipCode: '19122',
      price: 385000,
      units: 4,
      monthlyRent: 4200,
      daysOnMarket: 210,
      opportunityZone: true,
      images: ['https://example.com/property2.jpg'],
      description: '4-unit building in Opportunity Zone',
      scraped: new Date().toISOString()
    },
    {
      address: '312 S 15th St, Philadelphia, PA 19102',
      zipCode: '19102',
      price: 850000,
      units: 3,
      monthlyRent: 7500,
      daysOnMarket: 15,
      opportunityZone: false,
      images: ['https://example.com/property3.jpg'],
      description: 'Center City triplex',
      scraped: new Date().toISOString()
    },
    {
      address: '4521 Frankford Ave, Philadelphia, PA 19124',
      zipCode: '19124',
      price: 295000,
      units: 6,
      monthlyRent: 4800,
      daysOnMarket: 120,
      opportunityZone: false,
      images: ['https://example.com/property4.jpg'],
      description: '6-unit in Frankford',
      scraped: new Date().toISOString()
    },
    {
      address: '1523 W Susquehanna Ave, Philadelphia, PA 19121',
      zipCode: '19121',
      price: 340000,
      units: 4,
      monthlyRent: 4000,
      daysOnMarket: 95,
      opportunityZone: true,
      images: ['https://example.com/property5.jpg'],
      description: '4-unit with cash flow potential',
      scraped: new Date().toISOString()
    }
  ];

  const batch = db.batch();
  let added = 0;

  for (const property of sampleProperties) {
    const docRef = db.collection(PROPERTIES_COLLECTION).doc();
    batch.set(docRef, {
      ...property,
      id: docRef.id,
      aiScore: null,
      analyzed: false
    });
    added++;
  }

  await batch.commit();

  return res.json({
    success: true,
    message: `Added ${added} properties to database`,
    properties: sampleProperties.length,
    timestamp: new Date().toISOString()
  });
}

/**
 * Pace Morby Creative Finance Scoring Algorithm
 */
function calculatePaceMorbyScore(property) {
  let score = 50; // Base score
  const breakdown = {
    base: 50,
    motivation: 0,
    cashFlow: 0,
    pricePerUnit: 0,
    special: 0
  };

  // MOTIVATION SCORING (Days on Market)
  if (property.daysOnMarket >= 180) {
    breakdown.motivation = 25;
    score += 25;
  } else if (property.daysOnMarket >= 90) {
    breakdown.motivation = 20;
    score += 20;
  } else if (property.daysOnMarket >= 60) {
    breakdown.motivation = 15;
    score += 15;
  } else if (property.daysOnMarket >= 30) {
    breakdown.motivation = 10;
    score += 10;
  }

  // CASH FLOW SCORING
  const monthlyCashFlow = calculateMonthlyCashFlow(property);
  if (monthlyCashFlow >= 1000) {
    breakdown.cashFlow = 20;
    score += 20;
  } else if (monthlyCashFlow >= 500) {
    breakdown.cashFlow = 10;
    score += 10;
  } else if (monthlyCashFlow < 0) {
    breakdown.cashFlow = -20;
    score -= 20;
  }

  // PRICE PER UNIT SCORING
  const pricePerUnit = property.price / property.units;
  if (pricePerUnit < 100000) {
    breakdown.pricePerUnit = 15;
    score += 15;
  } else if (pricePerUnit < 120000) {
    breakdown.pricePerUnit = 10;
    score += 10;
  }

  // SPECIAL FACTORS
  if (property.opportunityZone) {
    breakdown.special += 20;
    score += 20;
  }

  if (property.zipCode === '19122') { // Temple area
    breakdown.special += 10;
    score += 10;
  }

  if (property.units >= 5) {
    breakdown.special += 10;
    score += 10;
  } else if (property.units >= 3) {
    breakdown.special += 5;
    score += 5;
  }

  // Determine verdict
  let verdict = '❌ Pass';
  if (score >= 80) verdict = '🔥 HOT DEAL';
  else if (score >= 60) verdict = '✅ Good';
  else if (score >= 40) verdict = '⚠️ Review';

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown,
    verdict,
    monthlyCashFlow,
    pricePerUnit
  };
}

/**
 * Calculate monthly cash flow
 */
function calculateMonthlyCashFlow(property) {
  const monthlyIncome = property.monthlyRent;
  const monthlyExpenses = monthlyIncome * 0.50; // 50% rule
  const downPayment = property.price * 0.20; // 20% down
  const loanAmount = property.price * 0.80;
  const monthlyMortgage = (loanAmount * 0.06) / 12; // 6% interest approximation

  return monthlyIncome - monthlyExpenses - monthlyMortgage;
}

/**
 * Analyze all properties with Pace Morby scoring
 */
async function analyzeProperties(req, res) {
  const propertiesSnapshot = await db.collection(PROPERTIES_COLLECTION).get();

  if (propertiesSnapshot.empty) {
    return res.json({ message: 'No properties to analyze. Run /scrape first.' });
  }

  const batch = db.batch();
  let analyzed = 0;
  const results = [];

  propertiesSnapshot.forEach((doc) => {
    const property = doc.data();
    const analysis = calculatePaceMorbyScore(property);

    batch.update(doc.ref, {
      aiScore: analysis.score,
      scoreBreakdown: analysis.breakdown,
      verdict: analysis.verdict,
      monthlyCashFlow: analysis.monthlyCashFlow,
      pricePerUnit: analysis.pricePerUnit,
      analyzed: true,
      analyzedAt: new Date().toISOString()
    });

    results.push({
      address: property.address,
      score: analysis.score,
      verdict: analysis.verdict
    });

    analyzed++;
  });

  await batch.commit();

  // Sort by score
  results.sort((a, b) => b.score - a.score);

  return res.json({
    success: true,
    analyzed,
    topDeals: results.slice(0, 5),
    allResults: results,
    timestamp: new Date().toISOString()
  });
}

/**
 * Financial Analysis: NOI, Cap Rate, ROI, Cash-on-Cash Return
 */
async function financialAnalysis(req, res) {
  const propertiesSnapshot = await db.collection(PROPERTIES_COLLECTION)
    .orderBy('aiScore', 'desc')
    .limit(10)
    .get();

  if (propertiesSnapshot.empty) {
    return res.json({ message: 'No properties found. Run /scrape and /analyze first.' });
  }

  const analyses = [];

  propertiesSnapshot.forEach((doc) => {
    const property = doc.data();
    const financials = calculateDetailedFinancials(property);

    analyses.push({
      address: property.address,
      aiScore: property.aiScore,
      verdict: property.verdict,
      financials,
      recommendation: getRecommendation(financials)
    });
  });

  return res.json({
    success: true,
    count: analyses.length,
    analyses,
    timestamp: new Date().toISOString()
  });
}

/**
 * Calculate detailed financials
 */
function calculateDetailedFinancials(property) {
  const monthlyGrossIncome = property.monthlyRent;
  const annualGrossIncome = monthlyGrossIncome * 12;

  // 50% rule for expenses
  const operatingExpenses = annualGrossIncome * 0.50;
  const noi = annualGrossIncome - operatingExpenses;

  // Mortgage calculations (20% down, 6% interest, 30-year)
  const downPayment = property.price * 0.20;
  const loanAmount = property.price * 0.80;
  const monthlyInterestRate = 0.06 / 12;
  const numberOfPayments = 30 * 12;
  const monthlyMortgage = loanAmount *
    (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  const annualDebtService = monthlyMortgage * 12;
  const annualCashFlow = noi - annualDebtService;
  const monthlyCashFlow = annualCashFlow / 12;

  // Metrics
  const capRate = (noi / property.price) * 100;
  const cashOnCashReturn = (annualCashFlow / downPayment) * 100;
  const roi = (annualCashFlow / downPayment) * 100;
  const grossRentMultiplier = property.price / annualGrossIncome;

  return {
    monthlyGrossIncome,
    annualGrossIncome,
    operatingExpenses,
    noi,
    monthlyMortgage: Math.round(monthlyMortgage),
    annualDebtService: Math.round(annualDebtService),
    annualCashFlow: Math.round(annualCashFlow),
    monthlyCashFlow: Math.round(monthlyCashFlow),
    capRate: capRate.toFixed(2) + '%',
    cashOnCashReturn: cashOnCashReturn.toFixed(2) + '%',
    roi: roi.toFixed(2) + '%',
    grossRentMultiplier: grossRentMultiplier.toFixed(2),
    downPaymentRequired: downPayment
  };
}

/**
 * Get investment recommendation
 */
function getRecommendation(financials) {
  const capRate = parseFloat(financials.capRate);
  const cashOnCash = parseFloat(financials.cashOnCashReturn);

  if (capRate >= 10 && cashOnCash >= 12) {
    return '🔥 Excellent Deal - Move Fast!';
  } else if (capRate >= 8 && cashOnCash >= 10) {
    return '✅ Good ROI - Strong Opportunity';
  } else if (capRate >= 6 && cashOnCash >= 8) {
    return '⚠️ Acceptable - Review Terms';
  } else {
    return '❌ Below Target - Pass or Negotiate';
  }
}

/**
 * List all properties
 */
async function listProperties(req, res) {
  const propertiesSnapshot = await db.collection(PROPERTIES_COLLECTION)
    .orderBy('aiScore', 'desc')
    .get();

  const properties = [];
  propertiesSnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() });
  });

  return res.json({
    success: true,
    count: properties.length,
    properties,
    timestamp: new Date().toISOString()
  });
}

/**
 * Get hot deals (score >= 80)
 */
async function getHotDeals(req, res) {
  const propertiesSnapshot = await db.collection(PROPERTIES_COLLECTION)
    .where('aiScore', '>=', 80)
    .orderBy('aiScore', 'desc')
    .get();

  const hotDeals = [];
  propertiesSnapshot.forEach((doc) => {
    const property = doc.data();
    hotDeals.push({
      address: property.address,
      price: property.price,
      units: property.units,
      monthlyRent: property.monthlyRent,
      aiScore: property.aiScore,
      verdict: property.verdict,
      monthlyCashFlow: property.monthlyCashFlow,
      pricePerUnit: property.pricePerUnit
    });
  });

  return res.json({
    success: true,
    count: hotDeals.length,
    hotDeals,
    message: hotDeals.length === 0 ? 'No hot deals found. Lower threshold or add more properties.' : null,
    timestamp: new Date().toISOString()
  });
}

/**
 * Daily 60-minute briefing
 */
async function getDailyBriefing(req, res) {
  const propertiesSnapshot = await db.collection(PROPERTIES_COLLECTION)
    .orderBy('aiScore', 'desc')
    .limit(5)
    .get();

  const topDeals = [];
  propertiesSnapshot.forEach((doc) => {
    const property = doc.data();
    const financials = calculateDetailedFinancials(property);

    topDeals.push({
      address: property.address,
      aiScore: property.aiScore,
      verdict: property.verdict,
      price: property.price,
      units: property.units,
      monthlyCashFlow: property.monthlyCashFlow,
      capRate: financials.capRate,
      roi: financials.roi,
      actionItem: generateActionItem(property)
    });
  });

  const briefing = {
    date: new Date().toISOString().split('T')[0],
    totalDeals: (await db.collection(PROPERTIES_COLLECTION).count().get()).data().count,
    topDeals,
    workflow: {
      '9:00 AM (2 min)': 'Review this briefing',
      '9:02 AM (10 min)': 'GET /financial-analysis for detailed numbers',
      '9:12 AM (15 min)': 'GET /gemini-analyze for creative strategies',
      '9:27 AM (3 min)': 'GET /hot-deals to filter 80+ scoring properties',
      '9:30 AM (20 min)': 'Draft offers, send SMS, schedule visits',
      '9:50 AM (10 min)': 'Update pipeline in dashboard'
    }
  };

  return res.json(briefing);
}

/**
 * Generate action item for property
 */
function generateActionItem(property) {
  if (property.aiScore >= 85) {
    return `🔥 URGENT: Contact seller TODAY. ${property.daysOnMarket} days on market = motivated.`;
  } else if (property.aiScore >= 75) {
    return `📞 Call seller this week. Opportunity Zone benefits available.`;
  } else if (property.aiScore >= 65) {
    return `📧 Send offer letter. Good cash flow potential.`;
  } else {
    return `📊 Review comps and neighborhood trends before proceeding.`;
  }
}

/**
 * Gemini AI deep analysis
 */
async function geminiAnalyze(req, res) {
  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      message: 'Gemini API key not configured. Set GEMINI_API_KEY environment variable.'
    });
  }

  const propertiesSnapshot = await db.collection(PROPERTIES_COLLECTION)
    .orderBy('aiScore', 'desc')
    .limit(3)
    .get();

  if (propertiesSnapshot.empty) {
    return res.json({ message: 'No properties to analyze.' });
  }

  const properties = [];
  propertiesSnapshot.forEach((doc) => {
    properties.push(doc.data());
  });

  const prompt = `You are a Pace Morby-trained real estate investor specializing in creative finance strategies (Subject-To, Seller Financing, Lease Options).

Analyze these top 3 deals and provide specific action plans:

${properties.map((p, i) => `
Deal ${i + 1}:
Address: ${p.address}
Price: $${p.price.toLocaleString()}
Units: ${p.units}
Monthly Rent: $${p.monthlyRent.toLocaleString()}
Days on Market: ${p.daysOnMarket}
AI Score: ${p.aiScore}
Cash Flow: $${p.monthlyCashFlow}/month
${p.opportunityZone ? '✅ Opportunity Zone' : ''}
`).join('\n')}

For each deal, provide:
1. **Best Creative Finance Strategy** (Subject-To, Seller Finance, or Lease Option)
2. **Specific Offer Structure** (numbers, terms, seller benefits)
3. **Talking Points** for the seller conversation
4. **Exit Strategy** (BRRRR, flip, hold long-term)

Format your response as actionable bullet points.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    return res.json({
      success: true,
      properties: properties.length,
      aiAnalysis: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.json({
      error: 'Gemini API error',
      message: error.message
    });
  }
}

/**
 * ROI Calculator
 */
function roiCalculator(req, res) {
  const { price, rent, down } = req.query;

  if (!price || !rent) {
    return res.status(400).json({
      error: 'Missing parameters. Required: price, rent. Optional: down (default 0.20)'
    });
  }

  const propertyPrice = parseFloat(price);
  const monthlyRent = parseFloat(rent);
  const downPaymentPercent = down ? parseFloat(down) : 0.20;

  const property = {
    price: propertyPrice,
    monthlyRent: monthlyRent,
    units: 1 // Assumed for calculator
  };

  const financials = calculateDetailedFinancials({
    ...property,
    price: propertyPrice
  });

  return res.json({
    input: {
      price: propertyPrice,
      monthlyRent: monthlyRent,
      downPaymentPercent: (downPaymentPercent * 100) + '%'
    },
    financials,
    recommendation: getRecommendation(financials)
  });
}

/**
 * List active subscribers
 */
async function listSubscribers(req, res) {
  const subscribersSnapshot = await db.collection(SUBSCRIBERS_COLLECTION)
    .where('status', '==', 'active')
    .get();

  const subscribers = [];
  subscribersSnapshot.forEach((doc) => {
    subscribers.push({ id: doc.id, ...doc.data() });
  });

  return res.json({
    success: true,
    totalActive: subscribers.length,
    subscribers,
    timestamp: new Date().toISOString()
  });
}

/**
 * Create Stripe checkout session
 */
async function createCheckoutSession(req, res) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    return res.status(400).json({
      error: 'Stripe not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.'
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: 'https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://yourdomain.com/cancel',
    });

    return res.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Handle Stripe webhooks
 */
async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await db.collection(SUBSCRIBERS_COLLECTION).doc(subscription.id).set({
        stripeCustomerId: subscription.customer,
        status: subscription.status,
        planId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        createdAt: new Date().toISOString()
      }, { merge: true });
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await db.collection(SUBSCRIBERS_COLLECTION).doc(deletedSubscription.id).update({
        status: 'canceled',
        canceledAt: new Date().toISOString()
      });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return res.json({ received: true });
}
