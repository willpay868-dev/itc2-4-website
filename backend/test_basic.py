#!/usr/bin/env python3
"""
Basic test script to verify the Real Estate AI Agent System setup
This will test the system with sample data without requiring API keys
"""
import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from main import RealEstateAIAgentSystem, LeadStatus


async def test_basic_functionality():
    """Test basic system functionality with sample data"""

    print("=" * 60)
    print("Real Estate AI Agent System - Basic Test")
    print("=" * 60)

    # Initialize system
    print("\n1. Initializing AI Agent System...")
    try:
        ai_system = RealEstateAIAgentSystem()
        print("   ✅ System initialized successfully")
    except Exception as e:
        print(f"   ❌ Error initializing system: {e}")
        return False

    # Test lead sourcing
    print("\n2. Testing Lead Sourcing Agent...")
    try:
        sources = ["https://www.zillow.com/homes/"]
        leads = await ai_system.sourcing_agent.scan_sources(sources)
        print(f"   ✅ Found {len(leads)} sample leads")

        if leads:
            print(f"   Example lead: {leads[0]['address']}")
    except Exception as e:
        print(f"   ❌ Error in lead sourcing: {e}")
        return False

    # Test ROI analysis
    print("\n3. Testing ROI Analysis Agent...")
    try:
        test_lead = {
            'address': '123 Main St, Brooklyn, NY 11201',
            'owner': 'Test Owner'
        }

        roi_analysis = await ai_system.roi_agent.analyze_property(
            address=test_lead['address'],
            property_data=test_lead
        )

        print(f"   ✅ ROI Analysis complete")
        print(f"   - Estimated Value: ${roi_analysis['estimated_value']:,.2f}")
        print(f"   - Cap Rate: {roi_analysis['cap_rate']:.2f}%")
        print(f"   - Recommendation: {roi_analysis['recommendation']}")
    except Exception as e:
        print(f"   ❌ Error in ROI analysis: {e}")
        return False

    # Test outreach generation
    print("\n4. Testing Outreach Agent...")
    try:
        message = await ai_system.outreach_agent.create_message(
            owner_name='Test Owner',
            address=test_lead['address'],
            roi_data=roi_analysis
        )

        print(f"   ✅ Outreach message generated ({len(message)} chars)")
        print(f"   Preview: {message[:100]}...")
    except Exception as e:
        print(f"   ❌ Error generating outreach: {e}")
        return False

    # Test knowledge manager
    print("\n5. Testing Knowledge Manager...")
    try:
        from main import Lead

        test_lead_obj = Lead(
            address=test_lead['address'],
            owner=test_lead['owner'],
            status=LeadStatus.NEW,
            estimated_value=roi_analysis['estimated_value'],
            roi_analysis=roi_analysis,
            outreach_message=message
        )

        ai_system.knowledge_agent.add_lead(test_lead_obj)
        print(f"   ✅ Lead added to knowledge base")

        # Query the knowledge base
        results = ai_system.knowledge_agent.query("Brooklyn")
        print(f"   ✅ Knowledge base query successful ({len(results)} results)")
    except Exception as e:
        print(f"   ❌ Error in knowledge manager: {e}")
        return False

    # Test report generation
    print("\n6. Testing Report Generation...")
    try:
        ai_system.leads_pipeline.append(test_lead_obj)
        report = ai_system.generate_report()

        print(f"   ✅ Report generated")
        print(f"   - Total Leads: {report['total_leads']}")
        print(f"   - Estimated Portfolio Value: ${report['estimated_portfolio_value']:,.2f}")
        print(f"   - Average ROI: {report['avg_roi']:.2f}%")
    except Exception as e:
        print(f"   ❌ Error generating report: {e}")
        return False

    print("\n" + "=" * 60)
    print("✅ All basic tests passed!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Configure your API keys in .env")
    print("2. Set up Google Sheets integration (optional)")
    print("3. Run: python main.py")
    print()

    return True


async def test_with_sample_pipeline():
    """Test the complete pipeline with sample data"""

    print("\n" + "=" * 60)
    print("Testing Complete Pipeline")
    print("=" * 60)

    ai_system = RealEstateAIAgentSystem()

    # Use sample sources
    sources = ["https://www.zillow.com/homes/"]

    print("\nRunning pipeline with 3 sample leads...")
    leads = await ai_system.run_pipeline(sources, batch_size=3)

    print(f"\n✅ Pipeline completed with {len(leads)} leads")

    if leads:
        print("\nSample Results:")
        for i, lead in enumerate(leads, 1):
            print(f"\n{i}. {lead.address}")
            print(f"   Owner: {lead.owner}")
            print(f"   Value: ${lead.estimated_value:,.2f}")
            if lead.roi_analysis:
                print(f"   Cap Rate: {lead.roi_analysis.get('cap_rate', 0):.2f}%")

    return True


if __name__ == "__main__":
    print("\nChoose test mode:")
    print("1. Basic component tests")
    print("2. Full pipeline test")
    print("3. Both")

    choice = input("\nEnter choice (1-3) [default: 1]: ").strip() or "1"

    async def run_tests():
        if choice in ["1", "3"]:
            await test_basic_functionality()

        if choice in ["2", "3"]:
            await test_with_sample_pipeline()

    asyncio.run(run_tests())
