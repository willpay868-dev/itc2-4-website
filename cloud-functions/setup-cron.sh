#!/bin/bash

# Setup Cloud Scheduler jobs for automated scraping and analysis

echo "⏰ Setting up Cloud Scheduler jobs..."

read -p "Enter your Cloud Function URL: " FUNCTION_URL

if [ -z "$FUNCTION_URL" ]; then
    echo "❌ Function URL is required"
    exit 1
fi

# Create scheduler jobs
echo "Creating job: ai-factory-scrape (every 6 hours)..."
gcloud scheduler jobs create http ai-factory-scrape \
  --location=us-central1 \
  --schedule="0 */6 * * *" \
  --uri="${FUNCTION_URL}/scrape" \
  --http-method=POST \
  --description="Auto-scrape properties every 6 hours" \
  2>/dev/null || gcloud scheduler jobs update http ai-factory-scrape \
  --location=us-central1 \
  --schedule="0 */6 * * *" \
  --uri="${FUNCTION_URL}/scrape"

echo "Creating job: ai-factory-analyze (5 minutes after scraping)..."
gcloud scheduler jobs create http ai-factory-analyze \
  --location=us-central1 \
  --schedule="5 */6 * * *" \
  --uri="${FUNCTION_URL}/analyze" \
  --http-method=POST \
  --description="Auto-analyze properties 5 minutes after scraping" \
  2>/dev/null || gcloud scheduler jobs update http ai-factory-analyze \
  --location=us-central1 \
  --schedule="5 */6 * * *" \
  --uri="${FUNCTION_URL}/analyze"

echo ""
echo "✅ Cloud Scheduler jobs created successfully!"
echo ""
echo "Schedule:"
echo "  - Scrape: Every 6 hours (0, 6, 12, 18 UTC)"
echo "  - Analyze: 5 minutes after each scrape"
echo ""
echo "To view jobs:"
echo "  gcloud scheduler jobs list --location=us-central1"
echo ""
echo "To manually trigger:"
echo "  gcloud scheduler jobs run ai-factory-scrape --location=us-central1"
echo ""
