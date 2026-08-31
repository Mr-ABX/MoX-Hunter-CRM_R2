#!/usr/bin/env python3
"""
mox_copywriter.py - DIC Cold Outreach & 1-Click WhatsApp Direct Link Generator
Generates ultra-short, non-salesy outreach copy and pre-filled WhatsApp URLs.
"""

import sys
import json
import urllib.parse

def generate_outreach_assets(lead: dict):
    """
    Generates ultra-short, open-ended 3-sentence outreach email + 1-Click WhatsApp direct link.
    """
    name = lead.get("name", "Business")
    city = lead.get("city", "Islamabad")
    phone = lead.get("phone", "")
    preview_url = lead.get("previewUrl") or lead.get("prototypeUrl", "https://mox.infni-t.online")
    rating = lead.get("rating", "4.9★")
    diagnosis = lead.get("diagnosis", "outdated")
    website = lead.get("website", "")
    legacy_years = lead.get("legacyYears", "10+")

    # Format Phone for WhatsApp
    clean_phone = "".join(filter(str.isdigit, phone))
    if clean_phone.startswith("0"):
        clean_phone = "92" + clean_phone[1:]
    elif not clean_phone.startswith("92") and len(clean_phone) == 10:
        clean_phone = "92" + clean_phone

    # 1. Ultra-Short Email Draft (DIC Framework)
    if "dead" in diagnosis.lower() or "dns" in diagnosis.lower():
        subject = f"Quick heads-up regarding {website}"
        body = (
            f"Hi {name} Team,\n\n"
            f"Was checking your practice in {city} after seeing your {rating} reviews—exceptional work!\n\n"
            f"Quick heads-up: noticed your website ({website}) is currently returning a dead DNS error on phones. "
            f"Wanted to let you know in case you're losing new patient inquiries.\n\n"
            f"Put together a free modern prototype for your team in the meantime ($0 cost, no catch):\n"
            f"👉 {preview_url}\n\n"
            f"If you're already fixing the domain, please disregard! If you ever want to use the new layout, happy to help out.\n\n"
            f"Best,\nAbdulRahman-T"
        )
    elif "uk" in lead.get("notes", "").lower() or "kensington" in name.lower():
        subject = f"UK Standard Presentation / {name}"
        body = (
            f"Hi {name} Team,\n\n"
            f"Saw your {rating} rating in {city}—{legacy_years} years of providing UK Standard Clinical Care is remarkable!\n\n"
            f"Noticed your current web layout doesn't quite reflect the high-end British Harley Street standard you provide. "
            f"Put together a bespoke prototype highlighting your legacy and implantology suite ($0 cost):\n"
            f"👉 {preview_url}\n\n"
            f"Zero pressure—if you like the layout, happy to connect your domain. Keep up the top work!\n\n"
            f"Best,\nAbdulRahman-T"
        )
    else:
        subject = f"Quick heads-up / {name} ({city})"
        body = (
            f"Hey {name} Team,\n\n"
            f"Saw your {rating} reviews in {city}—awesome reputation!\n\n"
            f"Just noticed your website layout has a few mobile formatting bugs on phones. "
            f"Went ahead and put together a fresh clinical prototype for your practice ($0 cost, no catch):\n"
            f"👉 {preview_url}\n\n"
            f"If your team is already redesigning it, no worries at all! If you like the layout, happy to help connect it.\n\n"
            f"Best,\nAbdulRahman-T"
        )

    # 2. 1-Click WhatsApp Message
    wa_text = (
        f"Hi {name} Team! 👋 Saw your {rating} reviews in {city}—top tier work!\n\n"
        f"Quick heads-up: noticed your website has a few mobile viewport bugs on phones. "
        f"Put together a free bespoke prototype for your practice:\n\n"
        f"👉 {preview_url}\n\n"
        f"If you like the layout, happy to help connect your domain. Keep up the great work!\n\n"
        f"Best,\nAbdulRahman-T"
    )

    wa_url = f"https://wa.me/{clean_phone}?text={urllib.parse.quote(wa_text)}"

    return {
        "email": {
            "subject": subject,
            "body": body
        },
        "whatsapp": {
            "clean_phone": clean_phone,
            "message": wa_text,
            "direct_url": wa_url
        }
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sample_lead = {
            "name": "Care N Cure Dental Clinic",
            "city": "F-7 Markaz, Islamabad",
            "phone": "+92 51 2223870",
            "previewUrl": "https://mox.infni-t.online/preview/care-n-cure-dental-f7-02",
            "rating": "4.9★",
            "website": "cncclinic.pk"
        }
        res = generate_outreach_assets(sample_lead)
        print(json.dumps(res, indent=2))
    else:
        with open(sys.argv[1]) as f:
            lead_data = json.load(f)
            print(json.dumps(generate_outreach_assets(lead_data), indent=2))
