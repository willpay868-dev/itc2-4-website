# Real Estate AI Agent System

A multi-agent AI system for real estate lead management, utilizing specialized AI models for different tasks in the lead generation and outreach pipeline.

## 🌟 Features

- **Lead Sourcing** (Gemini): Automatically scan websites, Google Drive, and documents for property leads
- **ROI Analysis** (DeepSeek): Perform complex financial calculations including cap rate, IRR, and risk assessment
- **Outreach Generation** (Claude): Create personalized, empathetic messages to property owners
- **Knowledge Management** (NotebookLM): Queryable knowledge base for lead intelligence
- **Google Sheets Integration**: Automatic logging of all leads and analysis

## 🏗️ Architecture

```
backend/
├── agents/                    # Specialized AI agents
│   ├── sourcing_agent.py     # Gemini-powered lead sourcing
│   ├── roi_agent.py          # DeepSeek-powered financial analysis
│   ├── outreach_agent.py     # Claude-powered message generation
│   └── knowledge_manager.py  # Knowledge base management
├── utils/                     # Utility modules
│   ├── config_loader.py      # Configuration management
│   └── sheets_logger.py      # Google Sheets integration
├── config/                    # Configuration files
│   └── config.example.json   # Example configuration
├── main.py                    # Main pipeline orchestrator
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 📋 Prerequisites

- Python 3.8+
- API keys for:
  - Gemini (optional)
  - DeepSeek (optional)
  - Claude (optional)
- Google Cloud Service Account (for Google Sheets)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
CLAUDE_API_KEY=your_claude_api_key_here

# Google Sheets Configuration
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CREDENTIALS_PATH=./config/credentials.json

# Application Settings
BATCH_SIZE=10
RATE_LIMIT_DELAY=1
```

### 3. Configure the System

Create `config/config.json` from the example:

```bash
cp config/config.example.json config/config.json
```

The config file uses environment variable substitution, so you don't need to edit it directly if you've set up your `.env` file correctly.

### 4. Set Up Google Sheets (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API and Google Drive API
4. Create a Service Account and download the JSON credentials
5. Save the credentials as `config/credentials.json`
6. Create a Google Sheet and share it with the service account email
7. Copy the Sheet ID from the URL and add it to your `.env` file

Sheet URL format: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### 5. Run the System

```bash
python main.py
```

## 🔧 Configuration

### Environment Variables

#### For Linux/Mac:
```bash
export DEEPSEEK_API_KEY="your_actual_api_key_here"
export DEEPSEEK_BASE_URL="https://api.deepseek.com"
export CLAUDE_API_KEY="your_claude_api_key_here"
```

#### For Windows (PowerShell):
```powershell
$env:DEEPSEEK_API_KEY="your_actual_api_key_here"
$env:DEEPSEEK_BASE_URL="https://api.deepseek.com"
$env:CLAUDE_API_KEY="your_claude_api_key_here"
```

#### For Windows (Command Prompt):
```cmd
set DEEPSEEK_API_KEY=your_actual_api_key_here
set DEEPSEEK_BASE_URL=https://api.deepseek.com
set CLAUDE_API_KEY=your_claude_api_key_here
```

### Data Sources

Edit `config/config.json` to add your sources:

```json
{
  "sources": [
    "https://www.zillow.com/homes/",
    "https://www.redfin.com/",
    "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
    "path/to/property_listings.pdf"
  ]
}
```

## 📊 Usage Examples

### Basic Pipeline Run

```python
import asyncio
from main import RealEstateAIAgentSystem

async def main():
    ai_system = RealEstateAIAgentSystem()

    sources = [
        "https://www.zillow.com/homes/New-York_rb/"
    ]

    # Process 5 leads
    leads = await ai_system.run_pipeline(sources, batch_size=5)

    # Generate report
    report = ai_system.generate_report()
    print(report)

asyncio.run(main())
```

### Query Knowledge Base

```python
# Query for high ROI properties
results = ai_system.query_knowledge_base("high ROI properties")

for result in results:
    print(f"{result['address']}: Cap Rate {result['cap_rate']:.2f}%")
```

### Get Market Insights

```python
insights = ai_system.knowledge_agent.get_insights()
print("Hot Zones:", insights['hot_zones'])
print("Market Trends:", insights['market_trends'])
```

## 🤖 AI Agents

### Lead Sourcing Agent (Gemini)
- Scans websites for property listings
- Extracts structured data from documents
- Integrates with Google Drive

### ROI Analysis Agent (DeepSeek)
- Calculates cap rate, NOI, cash-on-cash return
- Projects 5-year IRR
- Provides risk assessment
- Generates investment recommendations

### Outreach Agent (Claude)
- Creates personalized messages
- Adapts tone based on property analysis
- Generates empathetic, non-salesy outreach

### Knowledge Manager
- Stores all lead data with metadata
- Enables semantic search across leads
- Identifies patterns and trends
- Generates market insights

## 📈 Google Sheets Integration

The system automatically logs data to three sheets:

1. **Leads**: All lead information
2. **ROI Analysis**: Financial metrics
3. **Outreach Log**: Generated messages

## 🧪 Testing

The system includes fallback mechanisms:
- Sample data generation when web scraping fails
- Template-based messages when AI APIs are unavailable
- Manual calculations when DeepSeek is not configured

This allows you to test the system even without all API keys configured.

## 🔒 Security Notes

- Never commit `.env` or `config/credentials.json`
- Keep API keys secure and rotate regularly
- Use service accounts with minimal required permissions
- Review data before sending outreach messages

## 🐛 Troubleshooting

### "gspread not installed"
```bash
pip install gspread google-auth
```

### "Error initializing Google Sheets"
- Verify credentials.json exists and is valid
- Ensure the sheet is shared with the service account email
- Check that Google Sheets API is enabled in Google Cloud Console

### "DeepSeek API error"
- Verify your API key is correct
- Check you have sufficient API credits
- Ensure DEEPSEEK_BASE_URL is set to `https://api.deepseek.com`

### Web scraping returns no results
- The system will use sample data for testing
- In production, configure proper web scraping with Gemini API
- Some sites may block scraping - use official APIs when available

## 📝 License

This project is for educational and authorized business use only.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues or questions, please open an issue on GitHub.
