import os
import json
import asyncio
from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from enum import Enum
from datetime import datetime

from agents.sourcing_agent import LeadSourcingAgent
from agents.roi_agent import ROIAnalysisAgent
from agents.outreach_agent import OutreachAgent
from agents.knowledge_manager import KnowledgeManager
from utils.sheets_logger import GoogleSheetsLogger
from utils.config_loader import load_config


class LeadStatus(Enum):
    NEW = "New"
    QUALIFIED = "Qualified"
    CONTACTED = "Contacted"
    NEGOTIATING = "Negotiating"
    CLOSED = "Closed"


@dataclass
class Lead:
    address: str
    owner: str
    status: LeadStatus
    estimated_value: Optional[float] = None
    roi_analysis: Optional[Dict] = None
    outreach_message: Optional[str] = None
    source: Optional[str] = None
    timestamp: str = None

    def __post_init__(self):
        if not self.timestamp:
            self.timestamp = datetime.now().isoformat()


class RealEstateAIAgentSystem:
    """
    Multi-AI Agent System for Real Estate Lead Management
    Each agent specializes in a specific task using the best-suited AI model
    """

    def __init__(self, config_path: str = None):
        self.config = load_config(config_path)
        self.leads_pipeline = []

        # Initialize specialized agents
        self.sourcing_agent = LeadSourcingAgent(self.config.get('gemini', {}))
        self.roi_agent = ROIAnalysisAgent(self.config.get('deepseek', {}))
        self.outreach_agent = OutreachAgent(self.config.get('claude', {}))
        self.knowledge_agent = KnowledgeManager(self.config.get('notebooklm', {}))

        # Initialize Google Sheets logger
        self.sheet_logger = GoogleSheetsLogger(
            sheet_id=self.config.get('google_sheet_id'),
            credentials_path=self.config.get('credentials_path', 'config/credentials.json')
        )

    async def run_pipeline(self, sources: List[str], batch_size: int = None):
        """
        Run the complete lead management pipeline:
        1. Source leads (Gemini)
        2. Analyze ROI (DeepSeek)
        3. Generate outreach (Claude)
        4. Store in knowledge base (NotebookLM)
        5. Log to spreadsheet
        """
        if batch_size is None:
            batch_size = self.config.get('batch_size', 10)

        print("🚀 Starting Real Estate AI Pipeline...")

        # Step 1: Source leads using Gemini
        print("🔍 Sourcing leads with Gemini...")
        raw_leads = await self.sourcing_agent.scan_sources(sources)

        if not raw_leads:
            print("⚠️  No leads found from sources")
            return []

        processed_leads = []

        for i, lead_data in enumerate(raw_leads[:batch_size]):
            print(f"\n📝 Processing lead {i+1}/{min(len(raw_leads), batch_size)}")

            try:
                # Step 2: Analyze ROI with DeepSeek
                print("  📊 Analyzing ROI with DeepSeek...")
                roi_analysis = await self.roi_agent.analyze_property(
                    address=lead_data['address'],
                    property_data=lead_data
                )

                # Step 3: Create outreach message with Claude
                print("  ✍️  Crafting outreach with Claude...")
                outreach_message = await self.outreach_agent.create_message(
                    owner_name=lead_data['owner'],
                    address=lead_data['address'],
                    roi_data=roi_analysis
                )

                # Create lead object
                lead = Lead(
                    address=lead_data['address'],
                    owner=lead_data['owner'],
                    status=LeadStatus.NEW,
                    estimated_value=roi_analysis.get('estimated_value'),
                    roi_analysis=roi_analysis,
                    outreach_message=outreach_message,
                    source=lead_data.get('source')
                )

                # Step 4: Add to knowledge base
                print("  🧠 Adding to knowledge base...")
                self.knowledge_agent.add_lead(lead)

                # Step 5: Log to Google Sheets
                print("  📋 Logging to Google Sheets...")
                self.sheet_logger.log_lead(lead)

                processed_leads.append(lead)
                self.leads_pipeline.append(lead)

            except Exception as e:
                print(f"  ❌ Error processing lead: {e}")
                continue

            # Rate limiting
            await asyncio.sleep(self.config.get('rate_limit_delay', 1))

        print(f"\n✅ Pipeline complete! Processed {len(processed_leads)} leads.")
        return processed_leads

    def query_knowledge_base(self, query: str) -> List[Dict]:
        """Query the knowledge base for insights"""
        return self.knowledge_agent.query(query)

    def generate_report(self) -> Dict:
        """Generate a pipeline report"""
        return {
            "total_leads": len(self.leads_pipeline),
            "by_status": self._aggregate_by_status(),
            "estimated_portfolio_value": sum(
                lead.estimated_value for lead in self.leads_pipeline
                if lead.estimated_value
            ),
            "avg_roi": self._calculate_avg_roi()
        }

    def _aggregate_by_status(self) -> Dict[str, int]:
        """Aggregate leads by status"""
        status_counts = {}
        for lead in self.leads_pipeline:
            status = lead.status.value
            status_counts[status] = status_counts.get(status, 0) + 1
        return status_counts

    def _calculate_avg_roi(self) -> float:
        """Calculate average ROI across all leads"""
        rois = [
            lead.roi_analysis.get('cap_rate', 0)
            for lead in self.leads_pipeline
            if lead.roi_analysis and 'cap_rate' in lead.roi_analysis
        ]
        return sum(rois) / len(rois) if rois else 0.0


async def main():
    """Main execution function"""
    # Initialize the AI agent system
    ai_system = RealEstateAIAgentSystem()

    # Get sources from config or use defaults
    sources = ai_system.config.get('sources', [
        "https://www.zillow.com/homes/New-York_rb/"
    ])

    # Run the complete pipeline
    processed_leads = await ai_system.run_pipeline(sources, batch_size=5)

    # Query the knowledge base
    if processed_leads:
        print("\n🧠 Querying Knowledge Base...")
        results = ai_system.query_knowledge_base("high ROI properties")

        for result in results[:3]:
            print(f"  - {result['address']}: ${result.get('estimated_value', 0):,.0f}")

    # Generate report
    print("\n📈 Pipeline Report:")
    report = ai_system.generate_report()
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
