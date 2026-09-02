#!/usr/bin/env python3
"""
mox_psychological_copywriter.py - Psychological Outreach & 1-Click WhatsApp Engine
Author: MoX Hunter R2 + Antigravity Flow
Version: 1.1.0

CORE PSYCHOLOGICAL PHILOSOPHY:
1. FOCUS ON OUTCOMES & REVENUE: Never mention technical counts like "10-section". Focus on 24/7 mobile booking, instant quote calculators, and capturing Google traffic.
2. NEVER BLAME OR JUDGE: Externalize technical flaws as third-party theme/update glitches or lack of Google search capture.
3. HIGH-STATUS VALIDATION FIRST: Praise their verified reputation, 5.0★ rating, or craftsmanship to lower defensive walls.
4. THE 2026 MOBILE REALITY: Frame mobile optimization as essential for capturing the 85%+ modern clients searching on smartphones.
5. ZERO-PRESSURE GIFT: Offer the bespoke live prototype as a free gift with zero obligation.
6. AIRY MOBILE SPACING: 1-to-2 sentence blocks with clean whitespace for effortless 5-second mobile reading.
"""

import sys
import json
import re
import urllib.parse

def select_psychological_trigger(lead: dict) -> str:
    """
    Analyzes lead context, notes, and website health to choose the optimal psychological angle.
    """
    notes = (lead.get("insights") or lead.get("notes") or "").lower()
    name = lead.get("name", "").lower()
    website = (lead.get("website") or "").lower()
    niche = (lead.get("niche") or "").lower()

    if not website or website == "none" or "no website" in notes or "facebook only" in notes:
        if "epoxy" in niche or "epoxy" in name or "flooring" in niche:
            return "HIGH_TICKET_PORTFOLIO_CONVERSION"
        else:
            return "ZERO_WEBSITE_SEARCH_CAPTURE"
    elif "dns" in notes or "dead" in notes or "unconfigured" in notes or "hissam" in name:
        return "VIP_PRESTIGE_EXCLUSIVITY"
    elif "uk" in notes or "harley" in notes or "gdc" in notes or "kensington" in name:
        return "HARLEY_STREET_LEGACY"
    elif "decent" in notes or "modern website" in notes or "seo" in notes:
        return "TECHNICAL_SEO_ADVISORY"
    elif "broken" in notes or "footer" in notes or "cncclinic" in website or "care n cure" in name:
        return "TECH_GLITCH_EXTERNALIZATION"
    else:
        return "ZERO_WEBSITE_SEARCH_CAPTURE"

def format_clean_phone(phone: str) -> str:
    """Formats phone into international digits-only (supports US +1 and PK +92)."""
    digits = re.sub(r"\D", "", phone or "")
    if digits.startswith("1") and len(digits) == 11:
        return digits
    elif len(digits) == 10 and not digits.startswith("0"):
        return "1" + digits # US default
    elif digits.startswith("0") and len(digits) == 11:
        return "92" + digits[1:] # PK local format
    elif digits.startswith("92"):
        return digits
    return digits

def generate_psychological_outreach(lead: dict) -> dict:
    name = lead.get("name", "Team")
    city = lead.get("city") or lead.get("market") or "Dallas, TX"
    phone = lead.get("phone") or lead.get("mobile", "")
    preview_url = lead.get("previewUrl") or (f"https://mox.infni-t.online/preview/{lead.get('prototypeId')}" if lead.get("prototypeId") else "https://mox.infni-t.online")
    rating = lead.get("rating", "5.0★")
    niche = lead.get("niche", "services")
    website = lead.get("website", "")
    clean_phone = format_clean_phone(phone)

    trigger = select_psychological_trigger(lead)

    if trigger == "ZERO_WEBSITE_SEARCH_CAPTURE": # e.g. Arroyo's, Australux, Stoked Out
        email_subject = f"Capturing Google search clients for {name} ({city})"
        email_body = (
            f"Hi {name} Team,\n\n"
            f"Huge respect for building such a flawless {rating} reputation across client reviews in {city}!\n\n"
            f"Noticed that while your social presence is strong, you don't have a dedicated website on Google Maps. "
            f"In 2026, over 85% of high-end clients search and book directly from their phones, meaning high-ticket jobs are quietly slipping to competitors.\n\n"
            f"To show how much more revenue you could capture, I put together a custom mobile booking & package pricing prototype for {name} ($0 cost, no catch):\n\n"
            f"👉 Live Preview: {preview_url}\n\n"
            f"If you'd like to launch this with your own domain, let me know. If not, feel free to keep the design with my compliments!\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )
        wa_text = (
            f"Hi {name} Team! 👋\n\n"
            f"Huge respect for building such a flawless {rating} reputation in {city}!\n\n"
            f"Noticed you don't have a dedicated website attached to your profile. With most high-paying clients searching on Google from their phones in 2026, you're likely missing direct appointment bookings.\n\n"
            f"To help out, I drafted a clean, custom mobile booking portal tailored for {name} ($0 cost, no catch):\n\n"
            f"👉 {preview_url}\n\n"
            f"If you'd like to connect your custom domain, let me know. If not, feel free to keep the preview link!\n\n"
            f"AbdulRahman-T | MoX Hunter Studio"
        )

    elif trigger == "HIGH_TICKET_PORTFOLIO_CONVERSION": # e.g. Epoxylize LLC
        email_subject = f"Interactive garage floor quote portal for {name}"
        email_body = (
            f"Hi {name} Team,\n\n"
            f"Your {rating} customer feedback and high-end metallic epoxy craftsmanship across {city} is top tier.\n\n"
            f"Because high-ticket residential flooring projects ($2,500–$8,000+) depend heavily on visual proof, having a dedicated 24/7 quote estimator helps close homeowners before they ever call competitors.\n\n"
            f"We designed a custom interactive before/after showroom and instant square-footage estimator for {name} ($0 cost):\n\n"
            f"👉 Live Preview: {preview_url}\n\n"
            f"Zero obligation—if you'd like to deploy this to capture more garage transformations, let me know!\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )
        wa_text = (
            f"Hi {name} Team! 👋\n\n"
            f"Your {rating} customer reviews and metallic epoxy work across {city} look incredible!\n\n"
            f"To help you capture more high-ticket garage transformations directly from mobile searches, we built a custom before/after showroom and instant quote portal for {name} ($0 cost):\n\n"
            f"👉 {preview_url}\n\n"
            f"If you'd like to use it for your brand, let me know. If not, feel free to keep the link with our compliments!\n\n"
            f"AbdulRahman-T | MoX Hunter Studio"
        )

    elif trigger == "TECH_GLITCH_EXTERNALIZATION": # e.g. Care N Cure
        email_subject = f"Quick live prototype for {name} ({city})"
        email_body = (
            f"Hi {name} Team,\n\n"
            f"Huge respect for building such an exceptional practice in {city} with {rating} patient reviews.\n\n"
            f"I was checking out {website} earlier and noticed a small tech glitch—looks like a recent update caused some footer and mobile layout shifts that might make booking tricky for patients on their phones.\n\n"
            f"With most patients booking on mobile in 2026, I wanted to help out and drafted a clean, fully responsive mobile prototype for your clinic ($0 cost, no catch):\n\n"
            f"👉 Live Preview: {preview_url}\n\n"
            f"If you'd like to use these fixes on your live site, happy to hand over the code anytime. If not, feel free to keep the design with my compliments!\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )
        wa_text = (
            f"Hi {name} Team! 👋\n\n"
            f"Huge respect for building such an exceptional practice in {city} with {rating} patient reviews!\n\n"
            f"I was checking out {website} earlier and noticed a small tech glitch—looks like a recent update caused some footer and mobile layout shifts that might make booking tricky on phones.\n\n"
            f"With most patients booking on mobile in 2026, I put together a clean, fully responsive mobile prototype fixing those layout issues ($0 cost, no catch):\n\n"
            f"👉 {preview_url}\n\n"
            f"If you'd like to use these fixes on your live site, happy to help anytime. If not, feel free to keep the design with my compliments!\n\n"
            f"AbdulRahman-T | MoX Hunter Studio"
        )

    else:
        email_subject = f"Quick live prototype for {name} ({city})"
        email_body = (
            f"Hi {name} Team,\n\n"
            f"Saw your {rating} reputation across verified customer reviews in {city}—stellar work!\n\n"
            f"In 2026, over 85% of high-end clients search and book directly from their phones. "
            f"I went ahead and drafted a clean, modern mobile booking prototype specifically for your business ($0 cost, no catch):\n\n"
            f"👉 Live Preview: {preview_url}\n\n"
            f"If you like the design, we can connect your domain in 15 minutes; if not, feel free to keep the preview link with our compliments!\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )
        wa_text = (
            f"Hi {name} Team! 👋 Saw your {rating} customer reviews in {city}—stellar work!\n\n"
            f"I put together a clean, modern mobile booking prototype for your business ($0 cost, no catch):\n\n"
            f"👉 {preview_url}\n\n"
            f"If you'd like to use it, let me know. If not, feel free to keep the link with my compliments!\n\n"
            f"AbdulRahman-T | MoX Hunter Studio"
        )

    wa_url = f"https://wa.me/{clean_phone}?text={urllib.parse.quote(wa_text)}" if clean_phone else ""

    return {
        "lead_id": lead.get("id"),
        "lead_name": name,
        "selected_trigger": trigger,
        "email": {
            "recipient": lead.get("email", ""),
            "subject": email_subject,
            "body": email_body
        },
        "whatsapp": {
            "phone": phone,
            "clean_phone": clean_phone,
            "message": wa_text,
            "direct_url": wa_url
        }
    }

if __name__ == "__main__":
    sample = {
        "name": "Arroyo's Mobile Detailing",
        "city": "Dallas, TX",
        "phone": "(469) 438-9476",
        "rating": "5.0★",
        "website": "",
        "niche": "Luxury Mobile Detailing",
        "notes": "5.0 rating on Facebook. No website on Google Maps."
    }
    print(json.dumps(generate_psychological_outreach(sample), indent=2))
