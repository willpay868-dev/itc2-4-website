"""Claude-powered agent for human-like empathetic messaging"""
import asyncio
from typing import Dict, Optional
import httpx


class OutreachAgent:
    """Claude-powered agent for human-like empathetic messaging"""

    def __init__(self, config: Dict):
        self.config = config
        self.api_key = config.get('api_key')
        self.model = config.get('model', 'claude-3-5-sonnet-20241022')
        self.temperature = config.get('temperature', 0.7)
        self.templates = self._load_templates()

    async def create_message(self, owner_name: str, address: str, roi_data: Dict) -> str:
        """
        Create personalized, empathetic outreach messages
        Claude excels at non-preambled, natural conversations
        """

        # Use Claude API if available
        if self.api_key and self.api_key != 'your_claude_api_key_here':
            claude_message = await self._claude_generate_message(owner_name, address, roi_data)
            if claude_message:
                return claude_message

        # Fallback to template-based generation
        return self._template_based_message(owner_name, address, roi_data)

    async def _claude_generate_message(self, owner_name: str, address: str, roi_data: Dict) -> Optional[str]:
        """Use Claude API to generate personalized outreach message"""
        try:
            # Extract key metrics
            cap_rate = roi_data.get('cap_rate', 0)
            estimated_value = roi_data.get('estimated_value', 0)
            recommendation = roi_data.get('recommendation', '')

            prompt = f"""You are a professional real estate investor reaching out to a property owner. Write a personalized, empathetic message to {owner_name} about their property at {address}.

Key details:
- Property estimated value: ${estimated_value:,.2f}
- Cap rate: {cap_rate:.2f}%
- Investment assessment: {recommendation}

Requirements:
1. Be warm and professional, not salesy
2. Show genuine interest in the property and neighborhood
3. Mention specific details about the area
4. Keep it concise (200-300 words)
5. End with a soft call-to-action
6. No preamble or meta-commentary - just the message itself
7. Sign as "Alex Rodriguez, Real Estate Investment Specialist"

Write the message now:"""

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "x-api-key": self.api_key,
                        "anthropic-version": "2023-06-01",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "max_tokens": 1024,
                        "temperature": self.temperature,
                        "messages": [
                            {"role": "user", "content": prompt}
                        ]
                    },
                    timeout=30.0
                )

                if response.status_code == 200:
                    result = response.json()
                    message = result['content'][0]['text']
                    return message.strip()
                else:
                    print(f"  Claude API error: {response.status_code}")
                    return None

        except Exception as e:
            print(f"  Error using Claude API: {e}")
            return None

    def _template_based_message(self, owner_name: str, address: str, roi_data: Dict) -> str:
        """Generate message using templates"""
        template = self._select_template(roi_data)

        # Extract location details
        address_parts = address.split(',')
        street = address_parts[0].strip() if address_parts else address
        neighborhood = address_parts[-1].strip() if len(address_parts) > 1 else "the area"

        message = f"""Hi {owner_name},

I hope this message finds you well. My name is Alex Rodriguez, and I was researching properties in {neighborhood} when I came across your property at {street}.

{self._personalize_content(roi_data)}

{template['body']}

{self._add_value_proposition(roi_data)}

Would you be open to a brief conversation about your plans for the property? I'm happy to share more detailed market analysis specific to your neighborhood.

Best regards,
Alex Rodriguez
Real Estate Investment Specialist
Phone: (555) 123-4567
Email: alex.rodriguez@realestateinvest.com
"""

        return message

    def _select_template(self, roi_data: Dict) -> Dict:
        """Select appropriate message template based on ROI analysis"""
        roi = roi_data.get('cap_rate', 0)

        if roi > 10:
            return {
                'body': "Based on my analysis, properties in this area are showing strong investment potential right now. The fundamentals look particularly solid.",
                'urgency': "high"
            }
        elif roi > 7:
            return {
                'body': "The local market trends suggest this could be an opportune time to discuss your property's potential. I've been tracking this neighborhood closely.",
                'urgency': "medium"
            }
        else:
            return {
                'body': "I'm conducting research on the neighborhood and would value your insights as a local property owner. Your perspective would be invaluable.",
                'urgency': "low"
            }

    def _personalize_content(self, roi_data: Dict) -> str:
        """Add personalized elements based on analysis"""
        if roi_data.get('risk_score', 5) < 3:
            return "What caught my attention was the stability this property seems to offer in the current market. The fundamentals are quite strong."
        elif roi_data.get('cap_rate', 0) > 8:
            return "I was particularly impressed by the income potential in this location. The numbers tell a compelling story."
        else:
            return "I noticed some interesting dynamics in the local market that made your property stand out in my research."

    def _add_value_proposition(self, roi_data: Dict) -> str:
        """Add value proposition based on analysis"""
        recommendation = roi_data.get('recommendation', '')

        if 'Strong Buy' in recommendation or 'Excellent' in recommendation:
            return "Given the current market conditions, there may be some unique opportunities worth exploring together."
        elif 'Good' in recommendation:
            return "I believe there are some interesting possibilities we could discuss that might benefit both of us."
        else:
            return "I'm always looking to connect with property owners in this area to better understand the market."

    def _load_templates(self) -> Dict:
        """Load message templates"""
        return {
            'default': {
                'subject': 'Interest in Your Property',
                'urgency': 'medium'
            },
            'high_value': {
                'subject': 'Investment Opportunity',
                'urgency': 'high'
            },
            'informational': {
                'subject': 'Market Research',
                'urgency': 'low'
            }
        }
