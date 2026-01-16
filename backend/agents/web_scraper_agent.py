"""
Advanced Web Scraping Agent using Playwright
Adapted from ada_v2's web_agent for real estate property scraping
"""
import asyncio
import base64
from typing import Dict, List, Optional
from playwright.async_api import async_playwright, Page, Browser, BrowserContext


class WebScraperAgent:
    """Advanced web scraping agent using Playwright for property listings"""

    def __init__(self, config: Dict):
        self.config = config
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        self.screen_width = 1440
        self.screen_height = 900

    async def initialize(self):
        """Initialize the browser"""
        if not self.browser:
            playwright = await async_playwright().start()
            self.browser = await playwright.chromium.launch(
                headless=True,
                args=['--no-sandbox', '--disable-setuid-sandbox']
            )
            self.context = await self.browser.new_context(
                viewport={"width": self.screen_width, "height": self.screen_height},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            )
            self.page = await self.context.new_page()

    async def close(self):
        """Close the browser"""
        if self.browser:
            await self.browser.close()
            self.browser = None

    async def scrape_property_site(self, url: str, max_listings: int = 10) -> List[Dict]:
        """
        Scrape property listings from a website using intelligent extraction

        Args:
            url: The website URL to scrape
            max_listings: Maximum number of listings to extract

        Returns:
            List of property dictionaries
        """
        await self.initialize()

        try:
            print(f"  Navigating to {url}...")
            await self.page.goto(url, wait_until="networkidle", timeout=30000)

            # Wait for page to load
            await asyncio.sleep(2)

            # Extract property listings
            properties = await self._extract_properties(max_listings)

            return properties

        except Exception as e:
            print(f"  Error scraping {url}: {e}")
            return []

    async def _extract_properties(self, max_listings: int) -> List[Dict]:
        """Extract property data from the current page"""
        properties = []

        try:
            # Common selectors for property listing sites
            listing_selectors = [
                # Zillow
                'article.list-card',
                # Redfin
                'div.HomeCard',
                # Realtor.com
                'li.component_property-card',
                # Generic
                '[data-test*="property"]',
                '[class*="listing"]',
                '[class*="property-card"]'
            ]

            # Try each selector
            for selector in listing_selectors:
                listings = await self.page.query_selector_all(selector)

                if listings:
                    print(f"  Found {len(listings)} listings using selector: {selector}")

                    for listing in listings[:max_listings]:
                        try:
                            property_data = await self._extract_property_data(listing)
                            if property_data:
                                properties.append(property_data)
                        except Exception as e:
                            print(f"  Error extracting property: {e}")
                            continue

                    if properties:
                        break

            return properties

        except Exception as e:
            print(f"  Error in property extraction: {e}")
            return []

    async def _extract_property_data(self, element) -> Optional[Dict]:
        """Extract data from a single property listing element"""
        try:
            # Get all text content
            text_content = await element.text_content()

            # Try to extract address
            address_selectors = [
                '[data-test="property-card-addr"]',
                'address',
                '[class*="address"]',
                '[class*="street"]'
            ]

            address = None
            for selector in address_selectors:
                addr_elem = await element.query_selector(selector)
                if addr_elem:
                    address = await addr_elem.text_content()
                    address = address.strip()
                    break

            # If no address found via selector, try to extract from text
            if not address:
                import re
                # Look for address patterns in text
                addr_pattern = r'\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl)'
                match = re.search(addr_pattern, text_content, re.IGNORECASE)
                if match:
                    address = match.group()

            if not address:
                return None

            # Try to extract price
            price_selectors = [
                '[data-test="property-card-price"]',
                '[class*="price"]',
                '[class*="amount"]'
            ]

            price_text = None
            for selector in price_selectors:
                price_elem = await element.query_selector(selector)
                if price_elem:
                    price_text = await price_elem.text_content()
                    break

            # Extract price value
            price = None
            if price_text:
                import re
                price_match = re.search(r'\$?([\d,]+)', price_text.replace('$', ''))
                if price_match:
                    price = price_match.group(1).replace(',', '')

            # Get link
            link = None
            link_elem = await element.query_selector('a')
            if link_elem:
                link = await link_elem.get_attribute('href')

            return {
                'address': address,
                'owner': 'Owner Name Pending',  # Will be enriched later
                'price': price,
                'link': link,
                'source': self.page.url,
                'raw_text': text_content[:500]
            }

        except Exception as e:
            print(f"  Error extracting property data: {e}")
            return None

    async def search_properties(self, location: str, property_type: str = "homes") -> List[Dict]:
        """
        Search for properties in a specific location

        Args:
            location: City, state, or zip code
            property_type: Type of property (homes, condos, etc.)

        Returns:
            List of property dictionaries
        """
        # Use Zillow as default search engine
        search_url = f"https://www.zillow.com/homes/{location.replace(' ', '-')}_rb/"

        return await self.scrape_property_site(search_url)

    async def get_property_details(self, property_url: str) -> Dict:
        """
        Get detailed information about a specific property

        Args:
            property_url: URL of the property listing

        Returns:
            Dictionary with property details
        """
        await self.initialize()

        try:
            await self.page.goto(property_url, wait_until="networkidle", timeout=30000)
            await asyncio.sleep(2)

            # Extract detailed information
            details = {
                'url': property_url,
                'text': await self.page.text_content('body')
            }

            # Try to extract specific details
            selectors = {
                'price': '[data-test="property-price"]',
                'bedrooms': '[data-test="bed-info"]',
                'bathrooms': '[data-test="bath-info"]',
                'sqft': '[data-test="sqft-info"]',
                'description': '[data-test="description"]'
            }

            for key, selector in selectors.items():
                try:
                    elem = await self.page.query_selector(selector)
                    if elem:
                        details[key] = await elem.text_content()
                except:
                    pass

            return details

        except Exception as e:
            print(f"  Error getting property details: {e}")
            return {}

    async def screenshot(self) -> bytes:
        """Take a screenshot of the current page"""
        if self.page:
            return await self.page.screenshot(type="png")
        return b''

    async def scroll_page(self, direction: str = "down", magnitude: int = 800):
        """Scroll the page"""
        if self.page:
            dx, dy = 0, 0
            if direction == "down":
                dy = magnitude
            elif direction == "up":
                dy = -magnitude
            await self.page.mouse.wheel(dx, dy)
            await asyncio.sleep(1)

    async def execute_custom_script(self, script: str) -> any:
        """Execute custom JavaScript on the page"""
        if self.page:
            return await self.page.evaluate(script)
        return None


# Standalone testing
async def test_scraper():
    """Test the web scraper"""
    agent = WebScraperAgent({})

    # Test search
    properties = await agent.search_properties("New York, NY")

    print(f"\nFound {len(properties)} properties:")
    for prop in properties[:3]:
        print(f"  - {prop.get('address')}")
        print(f"    Price: ${prop.get('price', 'N/A')}")
        print(f"    Link: {prop.get('link', 'N/A')}")

    await agent.close()


if __name__ == "__main__":
    asyncio.run(test_scraper())
