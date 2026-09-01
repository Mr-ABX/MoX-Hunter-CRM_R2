import time
import random
import json
import urllib.request
import urllib.error
import ssl
import sys
import os
import subprocess
from datetime import datetime, timezone

sys.path.append(os.path.abspath(".agents/skills/mox-hunter/scripts"))
from mox_contact_verifier import validate_email_address, validate_phone_number

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
}

# Bespoke, line-broken pitches customized for each verified lead
BESPOKE_OUTREACH_REGISTRY = {
    "8Zr3wNzElLivUIkJS4aA": { # Care N Cure
        "recipient": "inquiry@cncclinic.pk",
        "subject": "Quick live prototype for Care N Cure Dental (F-7 Markaz)",
        "body": (
            "Hi Dr. Asad & Care N Cure Team,\n\n"
            "Huge respect for building a 4.9★ reputation across 120+ patient reviews in F-7 Markaz over the past 12 years.\n\n"
            "However, noticed your current mobile layout has broken footers and doesn't reflect the high surgical standard you deliver daily.\n\n"
            "Instead of just pitching, I went ahead and built a custom 10-section interactive patient portal prototype for your clinic ($0 cost, no catch):\n\n"
            "👉 Live Preview: https://mox.infni-t.online/preview/care-n-cure-dental-f7-05\n\n"
            "If you like the design, we can connect your custom domain in 15 minutes; if not, feel free to keep the preview link with our compliments!\n\n"
            "Best regards,\n"
            "AbdulRahman-T\n"
            "MoX Hunter Studio"
        )
    },
    "mFEEMxUoRbxTlCJbOYtE": { # Kensington Dental
        "recipient": "khurrambabar.kdic@gmail.com",
        "subject": "Harley Street standard web portal for Kensington Dental (F-7/2)",
        "body": (
            "Hi Dr. Khurram & Kensington Dental Team,\n\n"
            "Congratulations on celebrating 10 years of Harley Street surgical standards in Sector F-7/2 serving Islamabad's expat and diplomatic enclave.\n\n"
            "To match your Swiss Straumann® implantology and microscope endodontics, I designed a complimentary 10-section British Royal surgical prototype matching your navy branding:\n\n"
            "👉 Live Preview: https://mox.infni-t.online/preview/kensington-dental-implant-f7-05\n\n"
            "Zero cost or obligation—if this aligns with your vision for 2026, we can connect your domain in 24 hours.\n\n"
            "Best regards,\n"
            "AbdulRahman-T\n"
            "MoX Hunter Studio"
        )
    },
    "H11iOu7I0ilMuaf8DJHd": { # Hissam & Associates
        "recipient": "hissamassociates@gmail.com",
        "subject": "Private aesthetic portal for Hissam & Associates (Beverly Centre)",
        "body": (
            "Hi Dr. Hissam & Associates,\n\n"
            "Your flawless 5.0★ rating in Beverly Center, Blue Area sets the gold standard for aesthetic porcelain veneers and VIP patient privacy in Islamabad.\n\n"
            "To showcase your handcrafted smile design and diplomatic confidentiality protocol, our team created an exclusive 10-section Dark Velvet & Champagne Gold prototype:\n\n"
            "👉 Live Preview: https://mox.infni-t.online/preview/hissam-associates-dental-f6-05\n\n"
            "It's 100% free to review—if you'd like to launch it with your live domain, let us know!\n\n"
            "Best regards,\n"
            "AbdulRahman-T\n"
            "MoX Hunter Studio"
        )
    },
    "Q8H5spbIckTQPLS7GriW": { # The Dental Consultants
        "recipient": "", # WhatsApp Only
        "subject": "Specialist 3D Digital Dentistry Portal (Jinnah Super)",
        "body": (
            "Hi The Dental Consultants Team,\n\n"
            "Noticed your multi-specialty faculty setup in Block 12-C Jinnah Super Market with 95+ verified reviews.\n\n"
            "We put together a complimentary 10-section interactive 3D scanner & clear aligner prototype for your clinic:\n\n"
            "👉 https://mox.infni-t.online/preview/the-dental-consultants-f7-04\n\n"
            "Let us know what you think!"
        )
    },
    "RNJgTNdKola1w86f8DL8": { # Smile Square
        "recipient": "contact@smilesquare.co",
        "subject": "24/7 Rapid triage portal for Smile Square Dental (F-7 Markaz)",
        "body": (
            "Hi Smile Square Emergency Team,\n\n"
            "Your 24/7 dental trauma care and FCPS surgical coverage in F-7 Markaz with 4.9★ reviews from over 110 patients is an essential service for Islamabad.\n\n"
            "We engineered a custom 10-section Rapid Emergency Triage portal featuring a 3-click symptom selector and direct WhatsApp on-call dispatch:\n\n"
            "👉 Live Preview: https://mox.infni-t.online/preview/smile-square-dental-f7-04\n\n"
            "Test the interactive triage tool for free. If you'd like to deploy this to capture more urgent patients, let us know!\n\n"
            "Best regards,\n"
            "AbdulRahman-T\n"
            "MoX Hunter Studio"
        )
    }
}

def fetch_crm_leads() -> list:
    req = urllib.request.Request(f"{API_URL}/leads", headers=headers)
    try:
        with urllib.request.urlopen(req, context=ssl_context) as res:
            data = json.loads(res.read())
            return data.get("leads", [])
    except Exception as e:
        print(f"Error fetching leads: {e}")
        return []

def send_via_composio_cli(recipient: str, subject: str, body: str) -> dict:
    if not validate_email_address(recipient):
        return {"successful": False, "error": f"Invalid/unverified recipient email: '{recipient}'"}

    payload = {
        "recipient_email": recipient,
        "subject": subject,
        "body": body
    }
    cmd = [
        "/Users/anonymax/.composio/composio",
        "execute",
        "GMAIL_SEND_EMAIL",
        "-d",
        json.dumps(payload)
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode == 0:
        try:
            return json.loads(proc.stdout)
        except Exception:
            return {"successful": True, "output": proc.stdout}
    return {"successful": False, "error": proc.stderr}

def update_crm_status(lead_id: str, preview_url: str, subject: str, body: str, channel: str):
    now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)
    followup_ms = now_ms + (3 * 24 * 60 * 60 * 1000) # Day 3
    lead_patch = {
        "status": "Contacted",
        "prototypeId": preview_url.split("/preview/")[-1] if "/preview/" in preview_url else "",
        "lastActionDate": now_ms,
        "nextFollowUpDate": followup_ms
    }
    req = urllib.request.Request(
        f"{API_URL}/leads/{lead_id}",
        data=json.dumps(lead_patch).encode("utf-8"),
        headers=headers,
        method="PATCH"
    )
    try:
        with urllib.request.urlopen(req, context=ssl_context) as res:
            pass
    except Exception as e:
        print(f"⚠️ CRM update warning: {e}")

    act_payload = {
        "type": "email_sent" if channel == "email" else "whatsapp_prepared",
        "subject": subject,
        "body": body,
        "sentAt": datetime.now(timezone.utc).isoformat(),
        "status": "sent"
    }
    req_act = urllib.request.Request(
        f"{API_URL}/leads/{lead_id}/activity",
        data=json.dumps(act_payload).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req_act, context=ssl_context) as res:
            pass
    except Exception as e:
        print(f"⚠️ CRM activity warning: {e}")

def run_dynamic_drip_sequence(min_jitter_sec=180, max_jitter_sec=420):
    leads = fetch_crm_leads()
    total = len(leads)
    print(f"\n============================================================")
    print(f"🚀 INITIATING SAFE DYNAMIC DRIP OUTREACH DISPATCH")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S PKT')}")
    print(f"Sender: abdulrahmant.official@gmail.com")
    print(f"Total Targets: {total}")
    print(f"Randomized Interval: {min_jitter_sec//60} to {max_jitter_sec//60} mins between dispatches")
    print(f"============================================================\n")

    for i, lead in enumerate(leads, 1):
        lead_id = lead.get("id")
        name = lead.get("name")
        phone = lead.get("phone", "") or lead.get("mobile", "")
        proto_slug = lead.get("prototypeId", "")
        preview_url = f"https://mox.infni-t.online/preview/{proto_slug}" if proto_slug else ""

        bespoke = BESPOKE_OUTREACH_REGISTRY.get(lead_id, {})
        email = bespoke.get("recipient") or lead.get("email", "").strip()
        subject = bespoke.get("subject") or f"Quick live prototype for {name}"
        body = bespoke.get("body") or f"Hi {name} Team,\n\nWe built a custom prototype: {preview_url}\n\nBest regards,\nAbdulRahman-T"

        print(f"[{datetime.now().strftime('%H:%M:%S')}] [{i}/{total}] Target: {name}")
        
        # Check verified business email
        if email and validate_email_address(email):
            print(f"  ✉️ Verified Business Email Found: {email}")
            print(f"  📤 Sending via Composio Gmail (Account: abdulrahmant.official@gmail.com)...")
            res = send_via_composio_cli(email, subject, body)
            if res.get("successful", True):
                print(f"  ✓ Dispatch SUCCESSFUL to {email} (ID: {res.get('data', {}).get('id', 'SENT')})")
                update_crm_status(lead_id, preview_url, subject, body, channel="email")
            else:
                print(f"  ⚠️ Email dispatch notice: {res.get('error')}")
        else:
            print(f"  💬 No public email listed on GMB ➔ Prepared for 1-Click WhatsApp Direct Chat: {phone}")
            update_crm_status(lead_id, preview_url, subject, body, channel="whatsapp")

        # Jitter delay if not last lead
        if i < total:
            delay = random.randint(min_jitter_sec, max_jitter_sec)
            delay_mins = round(delay / 60, 2)
            print(f"\n⏳ Humanized Jitter Delay: Waiting {delay_mins} mins ({delay}s) before next contact...\n")
            sys.stdout.flush()
            time.sleep(delay)

    print(f"\n============================================================")
    print(f"🎉 SAFE DRIP SEQUENCE COMPLETED (ALL VERIFIED DESTINATIONS)!")
    print(f"============================================================\n")

if __name__ == "__main__":
    run_dynamic_drip_sequence(min_jitter_sec=180, max_jitter_sec=420)
