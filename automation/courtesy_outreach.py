import json
import urllib.request
import urllib.error
import urllib.parse
import ssl
import sys
from typing import Dict, Any, Optional

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
}

def generate_courtesy_pitch(lead: Dict[str, Any], style: str = "ultra_short") -> Dict[str, str]:
    """
    Generates ultra-short, casual, zero-pressure broken link notifications.
    Styles: 'ultra_short' (2 micro-paragraphs), 'friendly_peer' (3 micro-paragraphs), 'whatsapp_quick' (2-line chat).
    """
    name = lead.get("name") or lead.get("company", "Team")
    city = lead.get("city", "")
    domain = lead.get("website", "").replace("https://", "").replace("http://", "").rstrip("/")
    rating = lead.get("rating", "4.9")
    phone = lead.get("phone", "").replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
    if phone.startswith("0"):
        phone = "92" + phone[1:]
    elif phone.startswith("+"):
        phone = phone[1:]

    city_clause = f" in {city}" if city else ""

    # Style 1: Ultra-Short Casual (2 Micro-Paragraphs — Best for Busy Owners)
    ultra_short_subject = f"Quick heads-up / {domain}"
    ultra_short_email = f"""Hey {name} Team,

Saw your {rating}★ reviews{city_clause}—awesome work!

Just noticed your site ({domain}) isn't opening on mobile right now. Wanted to give you a quick heads-up in case you're losing customer bookings.

If you're already fixing it, no worries at all! If you ever want a hand or a quick free mobile layout, happy to help out.

Best,
AbdulRahman-T"""

    # Style 2: Conversational Peer (3 Short Paragraphs)
    peer_subject = f"Heads up regarding {domain} / {name}"
    peer_email = f"""Hi {name},

Was checking out your business earlier today after seeing your great reviews{city_clause}.

Quick heads-up: I noticed {domain} is currently returning a server error and won't load on phones. Just wanted to let you know in case it's affecting your incoming calls.

If you're already on it, please disregard! If you ever need a hand or want to test a clean free mobile prototype, just let me know.

Wishing you continued success,
AbdulRahman-T"""

    # WhatsApp Quick (2-Line Natural Chat)
    wa_text = f"""Hey {name} Team! 👋 Saw your {rating}★ reviews{city_clause}—top work!

Quick heads-up: noticed your website ({domain}) seems down on mobile right now. Wanted to let you know in case you're missing new client leads.

If your team is already fixing it, all good! If you ever need a hand or want a free mobile preview for your brand, happy to help anytime.

Best,
AbdulRahman-T"""

    wa_url = f"https://wa.me/{phone}?text={urllib.parse.quote(wa_text)}" if phone else ""

    return {
        "ultraShortSubject": ultra_short_subject,
        "ultraShortEmail": ultra_short_email,
        "peerSubject": peer_subject,
        "peerEmail": peer_email,
        "whatsappQuickText": wa_text,
        "whatsappUrl": wa_url
    }

if __name__ == "__main__":
    sample_lead = {
        "name": "Prestige Car Detailing",
        "company": "Prestige Car Detailing",
        "website": "prestigepro.pk",
        "city": "DHA Lahore",
        "phone": "+92 300 1234567",
        "rating": 4.9
    }
    
    pitches = generate_courtesy_pitch(sample_lead)
    print("=== ULTRA-SHORT CASUAL COURTESY PITCHES ===")
    print(json.dumps(pitches, indent=2))
