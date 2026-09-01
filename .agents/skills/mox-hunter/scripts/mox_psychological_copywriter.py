#!/usr/bin/env python3
"""
mox_psychological_copywriter.py - Psychological Outreach & 1-Click WhatsApp Engine
Author: MoX Hunter R2 + Antigravity Flow
Version: 1.0.0

CORE PSYCHOLOGICAL PHILOSOPHY:
1. NEVER BLAME OR JUDGE: Always externalize technical flaws as third-party theme/update glitches.
2. HIGH-STATUS VALIDATION FIRST: Praise their verified reputation, legacy years, or 4.9★+ reviews to lower defensive walls.
3. THE 2026 MOBILE REALITY: Frame mobile optimization as essential for capturing the 85%+ modern mobile patient traffic.
4. ZERO-PRESSURE GIFT: Offer the live prototype as a free gift with zero obligation or sales push.
5. AIRY LINE BREAKS: 1-to-2 sentence blocks with clean whitespace for effortless 5-second mobile reading.
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
    website = lead.get("website", "").lower()
    status = (lead.get("diagnosis") or "").lower()

    if "dns" in notes or "dead" in notes or "unconfigured" in notes or "hissam" in name:
        return "VIP_PRESTIGE_EXCLUSIVITY"
    elif "uk" in notes or "harley" in notes or "gdc" in notes or "kensington" in name:
        return "HARLEY_STREET_LEGACY"
    elif "decent" in notes or "modern website" in notes or "seo" in notes:
        return "TECHNICAL_SEO_ADVISORY"
    elif "broken" in notes or "footer" in notes or "cncclinic" in website or "care n cure" in name:
        return "TECH_GLITCH_EXTERNALIZATION"
    else:
        return "FRIENDLY_NEIGHBOR_HEADS_UP"

def generate_psychological_outreach(lead: dict) -> dict:
    name = lead.get("name", "Doctor & Clinical Team")
    city = lead.get("city", "Islamabad")
    phone = lead.get("phone") or lead.get("mobile", "")
    preview_url = lead.get("previewUrl") or (f"https://mox.infni-t.online/preview/{lead.get('prototypeId')}" if lead.get("prototypeId") else "https://mox.infni-t.online")
    rating = lead.get("rating", "4.9★")
    website = lead.get("website", "your website")
    notes = lead.get("insights") or lead.get("notes") or ""

    # Sanitize phone for WhatsApp (+92 format)
    digits = re.sub(r"\D", "", phone)
    if digits.startswith("0"):
        clean_phone = "92" + digits[1:]
    elif not digits.startswith("92") and len(digits) == 10:
        clean_phone = "92" + digits
    else:
        clean_phone = digits

    trigger = select_psychological_trigger(lead)

    if trigger == "TECH_GLITCH_EXTERNALIZATION":
        email_subject = f"Quick live prototype for {name} (F-7 Markaz)"
        email_body = (
            f"Hi Dr. & {name} Team,\n\n"
            f"Huge respect for building such an exceptional practice in {city} with {rating} patient reviews.\n\n"
            f"I was checking out {website} earlier and noticed a small tech glitch—looks like a recent update caused some footer and mobile layout shifts that might make booking tricky for patients on their phones.\n\n"
            f"With most patients booking on mobile in 2026, I wanted to help out and drafted a clean, fully responsive 10-section interactive prototype for your clinic ($0 cost, no catch):\n\n"
            f"👉 Live Preview: {preview_url}\n\n"
            f"If you'd like to use these fixes on your live site, happy to hand over the code anytime. If not, feel free to keep the design with my compliments!\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )
        wa_text = (
            f"Hi Dr. & {name} Team! 👋\n\n"
            f"Huge respect for building such an exceptional practice in {city} with {rating} patient reviews!\n\n"
            f"I was checking out {website} earlier and noticed a small tech glitch—looks like a recent update caused some footer and mobile layout shifts that might make booking tricky on phones.\n\n"
            f"With most patients booking on mobile in 2026, I put together a clean 10-section interactive prototype fixing those layout issues ($0 cost, no catch):\n\n"
            f"👉 {preview_url}\n\n"
            f"If you'd like to use these fixes on your live site, happy to help anytime. If not, feel free to keep the design with my compliments!\n\n"
            f"AbdulRahman-T | MoX Hunter Studio"
        )

    elif trigger == "VIP_PRESTIGE_EXCLUSIVITY":
        email_subject = f"Private aesthetic web architecture for {name}"
        email_body = (
            f"Hi Dr. & {name} Associates,\n\n"
            f"Your flawless {rating} rating in Beverly Centre, Blue Area sets the gold standard for aesthetic dentistry and VIP patient privacy in {city}.\n\n"
            f"Quick heads-up: noticed your primary domain ({website}) seems to have an unconfigured DNS record on mobile, which might lead high-ticket diplomatic patients to assume the clinic is offline.\n\n"
            f"To protect your brand reputation, our team crafted an exclusive 10-section Dark Velvet & Champagne Gold prototype matching your aesthetic caliber ($0 cost):\n\n"
            f"👉 Live Preview: {preview_url}\n\n"
            f"If you'd like to restore your live web face with this modern layout, let me know. If you're already handling it, no worries at all!\n\n"
            f"Warm regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )
        wa_text = (
            f"Hi Dr. & {name} Team! 👋\n\n"
            f"Your flawless {rating} rating in Beverly Centre sets the gold standard for aesthetic dentistry in {city}.\n\n"
            f"Quick friendly heads-up: noticed your website ({website}) seems to have a domain DNS glitch right now.\n\n"
            f"Our team crafted an exclusive 10-section Dark Velvet & Champagne Gold prototype for your clinic ($0 cost, no catch):\n\n"
            f"👉 {preview_url}\n\n"
            f"If you'd like to launch it with your live domain, let me know. If not, feel free to keep the design!\n\n"
            f"AbdulRahman-T | MoX Hunter Studio"
        )

    elif trigger == "HARLEY_STREET_LEGACY":
        email_subject = f"Harley Street standard web portal for {name}"
        email_body = (
            f"Hi Dr. & {name} Team,\n\n"
            f"Congratulations on celebrating over 10 years of Harley Street surgical standards serving {city}'s diplomatic and expat community.\n\n"
            f"To match your Swiss Straumann® implantology and British GDC clinical standards in 2026, I designed a complimentary 10-section Royal British surgical prototype matching your navy branding:\n\n"
            f"👉 Live Preview: {preview_url}\n\n"
            f"Zero cost or obligation—if this aligns with your vision for 2026, we can connect your domain in 24 hours.\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )
        wa_text = (
            f"Hi Dr. & {name} Team! 👋\n\n"
            f"Congratulations on celebrating 10+ years of Harley Street surgical standards in {city}!\n\n"
            f"To match your Swiss implantology and GDC clinical standards, I designed a complimentary 10-section Royal British surgical prototype for your practice:\n\n"
            f"👉 {preview_url}\n\n"
            f"Zero obligation—if you'd like to connect your domain, let me know. Keep up the great work!\n\n"
            f"AbdulRahman-T | MoX Hunter Studio"
        )

    elif trigger == "TECHNICAL_SEO_ADVISORY":
        email_subject = f"Technical Performance & Local SEO Audit for {name}"
        email_body = (
            f"Hi {name} Clinical Faculty,\n\n"
            f"Loved seeing your established multi-specialty setup in {city} with {rating} reviews—your facility is top-notch.\n\n"
            f"We ran a quick technical health check on {website} and noticed your site is functional, but has a few silent mobile speed and local schema gaps that keep you from ranking #1 for high-ticket patient searches in Islamabad.\n\n"
            f"We prepared a brief, 3-point technical optimization report to help your team fix these ranking leaks ($0 cost, zero pitch).\n\n"
            f"Would you be open to me sharing the 3 technical suggestions with your web team?\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )
        wa_text = (
            f"Hi {name} Team! 👋\n\n"
            f"Loved seeing your established multi-specialty setup in {city} with {rating} reviews!\n\n"
            f"We ran a quick technical check on {website} and noticed a few silent mobile speed & local SEO opportunities that could help you capture more high-ticket patient searches in Islamabad.\n\n"
            f"We put together a brief 3-point technical optimization note ($0 cost). Let me know if you'd like me to send it over!\n\n"
            f"AbdulRahman-T | MoX Hunter Studio"
        )

    else:
        email_subject = f"Quick live prototype for {name} ({city})"
        email_body = (
            f"Hi {name} Team,\n\n"
            f"Saw your {rating} reputation across verified patient reviews in {city}—stellar work!\n\n"
            f"Noticed your current mobile page has a few layout shifts that make booking tricky for patients on their phones.\n\n"
            f"I went ahead and drafted a clean, modern 10-section interactive prototype specifically for your practice ($0 cost, no catch):\n\n"
            f"👉 Live Preview: {preview_url}\n\n"
            f"If you like the design, we can connect your domain in 15 minutes; if not, feel free to keep the preview link with our compliments!\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )
        wa_text = (
            f"Hi {name} Team! 👋 Saw your {rating} patient reviews in {city}—stellar work!\n\n"
            f"Noticed your current mobile layout has a few display shifts on phones. I put together a clean 10-section interactive prototype for your practice ($0 cost):\n\n"
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
    test_lead = {
        "id": "8Zr3wNzElLivUIkJS4aA",
        "name": "Care N Cure Dental Clinic",
        "city": "F-7 Markaz, Islamabad",
        "phone": "+92 345 5131289",
        "website": "cncclinic.pk",
        "rating": "4.9★",
        "insights": "Top-rated F-7 Markaz clinic. Website has broken footer and distorted mobile sections."
    }
    res = generate_psychological_outreach(test_lead)
    print("=== Psychological Outreach Engine Output ===")
    print(json.dumps(res, indent=2))
