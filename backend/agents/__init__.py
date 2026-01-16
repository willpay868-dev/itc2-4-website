"""AI Agents for Real Estate Lead Management"""

from .sourcing_agent import LeadSourcingAgent
from .roi_agent import ROIAnalysisAgent
from .outreach_agent import OutreachAgent
from .knowledge_manager import KnowledgeManager

# Optional advanced features
try:
    from .web_scraper_agent import WebScraperAgent
    __all__ = [
        'LeadSourcingAgent',
        'ROIAnalysisAgent',
        'OutreachAgent',
        'KnowledgeManager',
        'WebScraperAgent'
    ]
except ImportError:
    __all__ = [
        'LeadSourcingAgent',
        'ROIAnalysisAgent',
        'OutreachAgent',
        'KnowledgeManager'
    ]
