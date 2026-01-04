"""DeepSeek-powered agent for mathematical ROI analysis"""
import asyncio
from typing import Dict, Optional
import httpx


class ROIAnalysisAgent:
    """DeepSeek-powered agent for complex ROI calculations"""

    def __init__(self, config: Dict):
        self.config = config
        self.api_key = config.get('api_key')
        self.base_url = config.get('base_url', 'https://api.deepseek.com')
        self.model = config.get('model', 'deepseek-chat')

    async def analyze_property(self, address: str, property_data: Dict) -> Dict:
        """
        Perform complex ROI calculations using DeepSeek
        Includes:
        - Net Operating Income (NOI) projection
        - Cap rate calculation
        - Cash-on-cash return
        - Internal Rate of Return (IRR)
        - Risk assessment
        """

        # Extract property details
        purchase_price = self._estimate_value(property_data)
        monthly_rent = self._estimate_rent(purchase_price)

        # Use DeepSeek for advanced analysis if API key is available
        if self.api_key and self.api_key != 'your_deepseek_api_key_here':
            advanced_analysis = await self._deepseek_analysis(address, purchase_price, monthly_rent)
            if advanced_analysis:
                return advanced_analysis

        # Fallback to manual calculations
        analysis = {
            'address': address,
            'estimated_value': purchase_price,
            'monthly_rent_estimate': monthly_rent,
            'annual_rent': monthly_rent * 12,
            'vacancy_rate': 0.05,  # 5%
            'operating_expenses_rate': 0.35,  # 35%
            'cap_rate': self._calculate_cap_rate(purchase_price, monthly_rent),
            'cash_on_cash_return': self._calculate_cash_on_cash(purchase_price, monthly_rent),
            'five_year_irr': self._calculate_irr(purchase_price, monthly_rent),
            'noi': self._calculate_noi(monthly_rent),
            'risk_score': self._calculate_risk_score(property_data),
            'recommendation': self._generate_recommendation(purchase_price, monthly_rent)
        }

        return analysis

    async def _deepseek_analysis(self, address: str, purchase_price: float, monthly_rent: float) -> Optional[Dict]:
        """Use DeepSeek API for advanced financial analysis"""
        try:
            prompt = f"""Analyze this real estate investment opportunity and provide detailed ROI calculations:

Property: {address}
Estimated Purchase Price: ${purchase_price:,.2f}
Estimated Monthly Rent: ${monthly_rent:,.2f}

Calculate and provide:
1. Cap Rate (Capitalization Rate)
2. Cash-on-Cash Return (assuming 20% down payment)
3. Net Operating Income (NOI) - assume 5% vacancy and 35% operating expenses
4. 5-Year IRR projection (assuming 3% annual appreciation)
5. Risk Score (1-10 scale)
6. Investment Recommendation

Provide your response in JSON format with the following structure:
{{
  "cap_rate": <number>,
  "cash_on_cash_return": <number>,
  "noi": <number>,
  "five_year_irr": <number>,
  "risk_score": <number>,
  "recommendation": "<string>",
  "analysis_details": "<string>"
}}
"""

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "user", "content": prompt}
                        ],
                        "temperature": 0.1,  # Low temperature for consistent calculations
                        "max_tokens": 2000
                    },
                    timeout=30.0
                )

                if response.status_code == 200:
                    result = response.json()
                    content = result['choices'][0]['message']['content']

                    # Try to parse JSON from response
                    import json
                    import re

                    # Extract JSON from markdown code blocks if present
                    json_match = re.search(r'```json\s*(.*?)\s*```', content, re.DOTALL)
                    if json_match:
                        content = json_match.group(1)
                    else:
                        # Try to find JSON object
                        json_match = re.search(r'\{.*\}', content, re.DOTALL)
                        if json_match:
                            content = json_match.group(0)

                    analysis = json.loads(content)

                    # Add property details
                    analysis['address'] = address
                    analysis['estimated_value'] = purchase_price
                    analysis['monthly_rent_estimate'] = monthly_rent
                    analysis['annual_rent'] = monthly_rent * 12
                    analysis['vacancy_rate'] = 0.05
                    analysis['operating_expenses_rate'] = 0.35

                    return analysis

                else:
                    print(f"  DeepSeek API error: {response.status_code}")
                    return None

        except Exception as e:
            print(f"  Error using DeepSeek API: {e}")
            return None

    def _estimate_value(self, property_data: Dict) -> float:
        """Complex property valuation using comps and algorithms"""
        # Base value - in production would use actual market data
        base_value = 300000

        # Location-based adjustments
        location_multipliers = {
            'Manhattan': 2.5,
            'Brooklyn': 1.8,
            'Queens': 1.4,
            'Bronx': 1.0,
            'Staten Island': 1.2
        }

        address = property_data.get('address', '')
        multiplier = 1.2  # Default

        for location, mult in location_multipliers.items():
            if location in address:
                multiplier = mult
                break

        return base_value * multiplier

    def _estimate_rent(self, purchase_price: float) -> float:
        """Estimate monthly rent based on property value"""
        # Rule of thumb: 0.8% to 1.1% of property value per month
        rent_percentage = 0.009  # 0.9% average
        return purchase_price * rent_percentage

    def _calculate_noi(self, monthly_rent: float) -> float:
        """Calculate Net Operating Income"""
        annual_rent = monthly_rent * 12
        vacancy_loss = annual_rent * 0.05  # 5% vacancy
        effective_rent = annual_rent - vacancy_loss
        operating_expenses = effective_rent * 0.35  # 35% expenses
        return effective_rent - operating_expenses

    def _calculate_cap_rate(self, value: float, monthly_rent: float) -> float:
        """Capitalization rate calculation"""
        noi = self._calculate_noi(monthly_rent)
        return (noi / value) * 100 if value > 0 else 0

    def _calculate_cash_on_cash(self, value: float, monthly_rent: float) -> float:
        """Cash-on-cash return (assuming 20% down payment)"""
        down_payment = value * 0.20
        annual_cashflow = self._calculate_noi(monthly_rent)

        # Subtract mortgage payments (simplified)
        loan_amount = value * 0.80
        annual_mortgage = loan_amount * 0.06  # Approximate 6% annual cost
        net_cashflow = annual_cashflow - annual_mortgage

        return (net_cashflow / down_payment) * 100 if down_payment > 0 else 0

    def _calculate_irr(self, investment: float, monthly_cashflow: float) -> float:
        """5-year IRR calculation (simplified)"""
        # Simplified IRR - in production would use numpy_financial
        annual_cashflow = self._calculate_noi(monthly_cashflow)
        appreciation_rate = 0.03  # 3% annual appreciation
        future_value = investment * ((1 + appreciation_rate) ** 5)

        total_return = (annual_cashflow * 5) + (future_value - investment)
        roi = (total_return / investment) * 100
        annualized_return = roi / 5

        return annualized_return

    def _calculate_risk_score(self, property_data: Dict) -> int:
        """Calculate risk score (1-10, where 10 is highest risk)"""
        # Simplified risk assessment
        base_risk = 5

        address = property_data.get('address', '')

        # Location-based risk adjustments
        if 'Manhattan' in address:
            base_risk -= 1  # Lower risk
        elif 'Brooklyn' in address:
            base_risk -= 0.5
        elif 'Bronx' in address:
            base_risk += 1  # Higher risk

        return max(1, min(10, int(base_risk)))

    def _generate_recommendation(self, purchase_price: float, monthly_rent: float) -> str:
        """Generate investment recommendation"""
        cap_rate = self._calculate_cap_rate(purchase_price, monthly_rent)

        if cap_rate >= 8:
            return "Strong Buy - Excellent ROI potential"
        elif cap_rate >= 6:
            return "Buy - Good investment opportunity"
        elif cap_rate >= 4:
            return "Hold - Consider other factors"
        else:
            return "Pass - Below market expectations"
