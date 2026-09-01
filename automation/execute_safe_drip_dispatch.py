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
CALENDLY_URL = "https://calendly.com/digital-b3asts"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
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
    """Sends email strictly and dynamically to the verified recipient email."""
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
    print(f"\n============================================================")
    print(f"🚀 INITIATING DYNAMIC OUTREACH ENGINE (ZERO TEST EMAIL FALLBACK)")
    print(f"Sender: abdulrahmant.official@gmail.com")
    print(f"Active CRM Leads: {len(leads)}")
    print(f"Randomized Interval: {min_jitter_sec//60} to {max_jitter_sec//60} mins between dispatches")
    print(f"============================================================\n")

    for i, lead in enumerate(leads, 1):
        name = lead.get("name")
        email = lead.get("email", "").strip()
        phone = lead.get("phone", "") or lead.get("mobile", "")
        proto_slug = lead.get("prototypeId", "")
        preview_url = f"https://mox.infni-t.online/preview/{proto_slug}" if proto_slug else ""
        lead_id = lead.get("id")

        subject = f"Modernizing {name}'s Digital Patient Booking Portal"
        body = (
            f"Hi {name} Clinical Team,\n\n"
            f"Noticed your established practice and clinical reputation in Islamabad. "
            f"We went ahead and designed a custom 10-section interactive web prototype specifically for your clinic ($0 cost, no catch):\n"
            f"👉 {preview_url}\n\n"
            f"If you'd like to connect your custom domain, let us know. If not, feel free to keep the preview link with our compliments!\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio\n"
            f"📅 Schedule a 15-min walkthrough: {CALENDLY_URL}"
        )

        print(f"[{datetime.now().strftime('%H:%M:%S')}] [{i}/{len(leads)}] Target: {name}")
        
        # Strictly check verified business email
        if email and validate_email_address(email):
            print(f"  ✉️ Verified Business Email Found: {email}")
            res = send_via_composio_cli(email, subject, body)
            if res.get("successful", True):
                print(f"  ✓ Dispatched to {email} via Composio Gmail (From: abdulrahmant.official@gmail.com)")
                update_crm_status(lead_id, preview_url, subject, body, channel="email")
            else:
                print(f"  ⚠️ Email dispatch notice: {res.get('error')}")
        else:
            print(f"  💬 No verified email listed on GMB/Website ➔ Routed to 1-Click WhatsApp Direct Line: {phone}")
            update_crm_status(lead_id, preview_url, subject, body, channel="whatsapp")

        # Jitter delay if not last lead
        if i < len(leads):
            delay = random.randint(min_jitter_sec, max_jitter_sec)
            delay_mins = round(delay / 60, 2)
            print(f"⏳ Humanized Jitter Delay: Waiting {delay_mins} mins ({delay}s) before next contact...\n")
            sys.stdout.flush()
            time.sleep(delay)

    print(f"\n============================================================")
    print(f"🎉 ALL LEADS PROCESSED DYNAMICALLY WITH ZERO DUMMY/TEST ROUTING!")
    print(f"============================================================\n")

if __name__ == "__main__":
    run_dynamic_drip_sequence(min_jitter_sec=180, max_jitter_sec=420)
