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

def ingest_manual_lead(lead_data: Dict[str, Any]) -> Dict[str, Any]:
    """Ingests or updates a manual lead in the live CRM."""
    req = urllib.request.Request(
        f"{API_URL}/leads", 
        data=json.dumps(lead_data).encode('utf-8'), 
        headers=headers, 
        method='POST'
    )
    with urllib.request.urlopen(req, context=ssl_context) as res:
        return json.loads(res.read().decode('utf-8'))

def generate_courtesy_pitch(lead: Dict[str, Any]) -> Dict[str, str]:
    """
    Generates a helpful, zero-pressure 'Helpful Neighbor' broken link notification.
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

    # Email Draft
    email_subject = f"Quick heads-up regarding {domain} / {name}"
    email_body = f"""Hi {name} Team,

Was checking out your business after seeing your {rating}★ reviews{f' in {city}' if city else ''}—your work looks exceptional!

Just wanted to give you a quick heads-up: I noticed your website ({domain}) is currently returning a server/DNS error and isn't loading on mobile. Wanted to mention it in case you're missing out on new customer inquiries.

If your team is already looking into it, please disregard! But if you ever need a hand diagnosing the issue or want to explore a clean, modern mobile layout, I'd be happy to put together a free prototype for your brand—zero strings attached.

Wishing you continued success,
AbdulRahman-T
MoX Hunter Studio"""

    # WhatsApp Draft & URL
    wa_text = f"""Hi {name} Team! 👋 Saw your incredible {rating}★ reviews{f' in {city}' if city else ''}—top-tier work!

Just wanted to give you a quick, friendly heads-up: noticed your website ({domain}) is currently down/not loading on mobile. Wanted to let you know in case it's affecting customer inquiries.

If your team is already fixing it, all good! If you ever need a hand diagnosing it or want to see a clean mobile prototype for your brand, happy to help out for free. Keep up the awesome work!

Best,
AbdulRahman-T"""

    wa_url = f"https://wa.me/{phone}?text={urllib.parse.quote(wa_text)}" if phone else ""

    return {
        "emailSubject": email_subject,
        "emailBody": email_body,
        "whatsappText": wa_text,
        "whatsappUrl": wa_url
    }

if __name__ == "__main__":
    sample_lead = {
        "name": "Prestige Car Detailing",
        "company": "Prestige Car Detailing",
        "website": "prestigepro.pk",
        "city": "DHA Phase 5, Lahore",
        "phone": "+92 300 1234567",
        "rating": 4.9,
        "industry": "Luxury Auto Detailing & PPF"
    }
    
    pitch = generate_courtesy_pitch(sample_lead)
    print("=== COURTESY ADVISOR GENERATED PITCH ===")
    print(json.dumps(pitch, indent=2))
