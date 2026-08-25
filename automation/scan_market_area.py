import json
import urllib.request
import urllib.error
import ssl
import sys
from typing import Dict, Any, List

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
}

# 4 High-Ticket Vertical Matrix
HIGH_TICKET_VERTICALS = [
    {
        "vertical": "Aesthetic & Dental Healthcare",
        "niches": ["Cosmetic Dentistry & Smile Studio", "Aesthetic Dermatology & MedSpa", "Hair Restoration Clinic"],
        "typical_deal_size": "$500 – $2,500"
    },
    {
        "vertical": "Architecture & Premium Trades",
        "niches": ["Luxury Interior Design & Architecture", "Custom Home Remodeling", "Commercial Solar EPC Contractors"],
        "typical_deal_size": "$600 – $3,000"
    },
    {
        "vertical": "Professional & Corporate Services",
        "niches": ["Corporate & Immigration Law Firm", "Wealth Management Advisory", "Commercial Real Estate Brokerage"],
        "typical_deal_size": "$800 – $4,000"
    },
    {
        "vertical": "Luxury Automotive & Concierge",
        "niches": ["Luxury Auto PPF & Graphene Studio", "Mobile Concierge Detailing", "Private Event & Wedding Venue"],
        "typical_deal_size": "$400 – $1,500"
    }
]

def fetch_existing_crm_domains() -> List[str]:
    """Fetches all existing leads from CRM to prevent duplicate outreach."""
    existing = []
    try:
        req = urllib.request.Request(f"{API_URL}/leads", headers=headers)
        with urllib.request.urlopen(req, context=ssl_context) as res:
            data = json.loads(res.read())
            leads = data.get("leads", [])
            for l in leads:
                name = (l.get("name") or l.get("company") or "").lower().strip()
                web = (l.get("website") or "").lower().strip()
                if name: existing.append(name)
                if web: existing.append(web)
    except Exception as e:
        print(f"Error fetching existing CRM leads: {e}")
    return existing

def generate_area_strategy(city: str, area: str = "") -> Dict[str, Any]:
    """
    Generates a diversified multi-niche hunt strategy for any given target city.
    """
    existing_crm = fetch_existing_crm_domains()
    
    return {
        "targetCity": city,
        "targetArea": area or "Metropolitan Commercial Corridors",
        "recommendedVerticals": HIGH_TICKET_VERTICALS,
        "existingCrmLeadsCount": len(existing_crm),
        "scanningRule": "Rotate across 4 distinct high-ticket verticals to prevent market saturation and secure diverse paying clients."
    }

if __name__ == "__main__":
    strategy = generate_area_strategy("Islamabad", "F-7, F-8 & Blue Area")
    print("=== MoX CMA Diversified Area Strategy ===")
    print(json.dumps(strategy, indent=2))
