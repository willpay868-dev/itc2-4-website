#!/bin/bash

# Real Estate AI Factory - Deployment Script
echo "🏭 Deploying Real Estate AI Factory to Google Cloud..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Install from: https://cloud.google.com/sdk/install"
    exit 1
fi

# Set your project ID
read -p "Enter your Google Cloud Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID is required"
    exit 1
fi

# Set the project
gcloud config set project $PROJECT_ID

echo ""
echo "📦 Step 1: Creating secrets..."

# Create secrets for environment variables
echo "Enter your Gemini API Key:"
read -s GEMINI_KEY
echo -n "$GEMINI_KEY" | gcloud secrets create gemini-api-key --data-file=- --replication-policy="automatic" 2>/dev/null || \
echo -n "$GEMINI_KEY" | gcloud secrets versions add gemini-api-key --data-file=-

echo ""
echo "Enter your Stripe Secret Key (sk_...):"
read -s STRIPE_KEY
echo -n "$STRIPE_KEY" | gcloud secrets create stripe-secret-key --data-file=- --replication-policy="automatic" 2>/dev/null || \
echo -n "$STRIPE_KEY" | gcloud secrets versions add stripe-secret-key --data-file=-

echo ""
echo "Enter your Stripe Webhook Secret (whsec_...):"
read -s WEBHOOK_SECRET
echo -n "$WEBHOOK_SECRET" | gcloud secrets create stripe-webhook-secret --data-file=- --replication-policy="automatic" 2>/dev/null || \
echo -n "$WEBHOOK_SECRET" | gcloud secrets versions add stripe-webhook-secret --data-file=-

echo ""
echo "Enter your Stripe Price ID (price_...):"
read PRICE_ID
echo -n "$PRICE_ID" | gcloud secrets create stripe-price-id --data-file=- --replication-policy="automatic" 2>/dev/null || \
echo -n "$PRICE_ID" | gcloud secrets versions add stripe-price-id --data-file=-

echo ""
echo "✅ Secrets created successfully"

echo ""
echo "🚀 Step 2: Deploying Cloud Function..."

gcloud functions deploy real-estate-ai-factory \
  --gen2 \
  --runtime=nodejs20 \
  --region=us-central1 \
  --source=. \
  --entry-point=handleRequest \
  --trigger-http \
  --allow-unauthenticated \
  --timeout=540s \
  --memory=1GB \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest,STRIPE_SECRET_KEY=stripe-secret-key:latest,STRIPE_WEBHOOK_SECRET=stripe-webhook-secret:latest,STRIPE_PRICE_ID=stripe-price-id:latest"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📍 Your function URL:"
    gcloud functions describe real-estate-ai-factory --region=us-central1 --gen2 --format="value(serviceConfig.uri)"
    echo ""
    echo "📋 Next steps:"
    echo "1. Test the API: curl YOUR_FUNCTION_URL/"
    echo "2. Add sample properties: curl YOUR_FUNCTION_URL/scrape"
    echo "3. Run analysis: curl YOUR_FUNCTION_URL/analyze"
    echo "4. Set up cron jobs (see setup-cron.sh)"
    echo ""
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
