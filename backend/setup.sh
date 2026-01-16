#!/bin/bash

# Real Estate AI Agent System - Setup Script

echo "🚀 Setting up Real Estate AI Agent System..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create config directory if it doesn't exist
mkdir -p config

# Copy example files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys"
fi

if [ ! -f config/config.json ]; then
    echo "📝 Creating config.json from example..."
    cp config/config.example.json config/config.json
    echo "✅ Config file created"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env and add your API keys"
echo "2. If using Google Sheets, add credentials.json to config/"
echo "3. Run: python main.py"
echo ""
