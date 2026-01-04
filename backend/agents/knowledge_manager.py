"""NotebookLM-style knowledge base for queryable lead intelligence"""
from typing import Dict, List, Any
from datetime import datetime
import json


class KnowledgeManager:
    """NotebookLM-style knowledge base for queryable lead intelligence"""

    def __init__(self, config: Dict):
        self.config = config
        self.leads_db = []
        self.conversations = []

    def add_lead(self, lead: Any):
        """Add lead to knowledge base with rich context"""
        lead_entry = {
            'lead': lead,
            'timestamp': datetime.now().isoformat(),
            'embeddings': self._create_embeddings(lead),
            'tags': self._generate_tags(lead),
            'relationships': self._find_relationships(lead)
        }
        self.leads_db.append(lead_entry)

    def query(self, query: str) -> List[Dict]:
        """Query the knowledge base using semantic search"""
        results = []

        # Simple keyword search (in production: use vector similarity)
        query_lower = query.lower()
        keywords = query_lower.split()

        for entry in self.leads_db:
            lead = entry['lead']

            # Search across multiple fields
            search_fields = [
                lead.address,
                lead.owner,
                lead.status.value,
                lead.source or '',
                str(lead.estimated_value or ''),
                json.dumps(lead.roi_analysis or {})
            ]

            search_text = ' '.join(search_fields).lower()

            # Calculate simple relevance score
            score = 0
            for keyword in keywords:
                if keyword in search_text:
                    score += 1

            # Check for high ROI
            if 'high' in query_lower and 'roi' in query_lower:
                cap_rate = lead.roi_analysis.get('cap_rate', 0) if lead.roi_analysis else 0
                if cap_rate >= 7:
                    score += 2

            if score > 0:
                results.append({
                    'address': lead.address,
                    'owner': lead.owner,
                    'status': lead.status.value,
                    'estimated_value': lead.estimated_value,
                    'cap_rate': lead.roi_analysis.get('cap_rate', 0) if lead.roi_analysis else 0,
                    'confidence': min(1.0, score / len(keywords)),
                    'related_leads': entry['relationships'],
                    'tags': entry['tags']
                })

        # Sort by confidence
        results.sort(key=lambda x: x['confidence'], reverse=True)

        return results

    def get_insights(self) -> Dict:
        """Generate insights from the knowledge base"""
        insights = {
            'hot_zones': self._identify_hot_zones(),
            'owner_patterns': self._identify_owner_patterns(),
            'successful_outreach_templates': self._analyze_successful_outreach(),
            'market_trends': self._detect_market_trends()
        }
        return insights

    def _create_embeddings(self, lead: Any) -> List[float]:
        """Create vector embeddings for semantic search"""
        # Placeholder - in production use embedding model
        # Could use OpenAI embeddings, sentence-transformers, etc.
        return []

    def _generate_tags(self, lead: Any) -> List[str]:
        """Generate tags for categorization"""
        tags = [lead.status.value]

        if lead.estimated_value:
            if lead.estimated_value > 500000:
                tags.append("premium")
            elif lead.estimated_value < 250000:
                tags.append("affordable")

        if lead.roi_analysis:
            cap_rate = lead.roi_analysis.get('cap_rate', 0)
            if cap_rate > 8:
                tags.append("high_roi")
            elif cap_rate < 4:
                tags.append("low_roi")

            risk_score = lead.roi_analysis.get('risk_score', 5)
            if risk_score < 4:
                tags.append("low_risk")
            elif risk_score > 7:
                tags.append("high_risk")

        # Location-based tags
        if lead.address:
            if 'Manhattan' in lead.address:
                tags.append("manhattan")
            elif 'Brooklyn' in lead.address:
                tags.append("brooklyn")
            elif 'Queens' in lead.address:
                tags.append("queens")

        return tags

    def _find_relationships(self, lead: Any) -> List[str]:
        """Find related leads based on location, owner, or other factors"""
        relationships = []

        for entry in self.leads_db:
            existing_lead = entry['lead']

            # Same owner
            if existing_lead.owner == lead.owner:
                relationships.append(f"same_owner:{existing_lead.address}")

            # Same neighborhood
            if lead.address and existing_lead.address:
                lead_parts = lead.address.split(',')
                existing_parts = existing_lead.address.split(',')

                if len(lead_parts) > 1 and len(existing_parts) > 1:
                    if lead_parts[-1].strip() == existing_parts[-1].strip():
                        relationships.append(f"same_area:{existing_lead.address}")

        return relationships

    def _identify_hot_zones(self) -> List[Dict]:
        """Identify areas with high investment potential"""
        zone_data = {}

        for entry in self.leads_db:
            lead = entry['lead']
            if not lead.address:
                continue

            # Extract neighborhood
            parts = lead.address.split(',')
            neighborhood = parts[-1].strip() if len(parts) > 1 else "Unknown"

            if neighborhood not in zone_data:
                zone_data[neighborhood] = {
                    'count': 0,
                    'total_value': 0,
                    'avg_cap_rate': 0,
                    'cap_rates': []
                }

            zone_data[neighborhood]['count'] += 1

            if lead.estimated_value:
                zone_data[neighborhood]['total_value'] += lead.estimated_value

            if lead.roi_analysis and 'cap_rate' in lead.roi_analysis:
                zone_data[neighborhood]['cap_rates'].append(lead.roi_analysis['cap_rate'])

        # Calculate averages
        hot_zones = []
        for zone, data in zone_data.items():
            if data['cap_rates']:
                avg_cap_rate = sum(data['cap_rates']) / len(data['cap_rates'])
                hot_zones.append({
                    'zone': zone,
                    'lead_count': data['count'],
                    'avg_cap_rate': avg_cap_rate,
                    'total_value': data['total_value']
                })

        # Sort by avg cap rate
        hot_zones.sort(key=lambda x: x['avg_cap_rate'], reverse=True)

        return hot_zones[:5]  # Top 5 zones

    def _identify_owner_patterns(self) -> Dict:
        """Identify patterns in owner behavior"""
        owner_counts = {}

        for entry in self.leads_db:
            lead = entry['lead']
            owner = lead.owner

            if owner not in owner_counts:
                owner_counts[owner] = 0
            owner_counts[owner] += 1

        # Find owners with multiple properties
        multi_property_owners = {
            owner: count
            for owner, count in owner_counts.items()
            if count > 1
        }

        return {
            'total_unique_owners': len(owner_counts),
            'multi_property_owners': multi_property_owners
        }

    def _analyze_successful_outreach(self) -> List[str]:
        """Analyze successful outreach patterns"""
        # Placeholder - in production would track response rates
        return [
            "Messages mentioning specific neighborhood insights have higher response rates",
            "Shorter messages (< 200 words) perform better",
            "Personalization increases engagement by 35%"
        ]

    def _detect_market_trends(self) -> Dict:
        """Detect market trends from lead data"""
        if not self.leads_db:
            return {}

        total_value = sum(
            entry['lead'].estimated_value
            for entry in self.leads_db
            if entry['lead'].estimated_value
        )

        avg_value = total_value / len(self.leads_db) if self.leads_db else 0

        cap_rates = [
            entry['lead'].roi_analysis.get('cap_rate', 0)
            for entry in self.leads_db
            if entry['lead'].roi_analysis
        ]

        avg_cap_rate = sum(cap_rates) / len(cap_rates) if cap_rates else 0

        return {
            'total_leads': len(self.leads_db),
            'avg_property_value': avg_value,
            'avg_cap_rate': avg_cap_rate,
            'market_sentiment': 'bullish' if avg_cap_rate > 7 else 'neutral' if avg_cap_rate > 5 else 'bearish'
        }
