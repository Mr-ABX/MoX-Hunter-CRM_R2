import time
import random
import json
import urllib.request
import urllib.error
import ssl
import sys
import subprocess
from datetime import datetime, timezone

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"
CALENDLY_URL = "https://calendly.com/digital-b3asts"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
}

def send_gmail_via_composio(to: str, subject: str, body: str) -> dict:
    """Executes GMAIL_SEND_EMAIL via Composio CLI using authenticated account."""
    payload = {
        "recipient_email": to,
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
    else:
        return {"successful": False, "error": proc.stderr}

def drip_dispatch_queue(leads_to_contact: list, min_delay_sec: int = 180, max_delay_sec: int = 420, live_send: bool = True):
    """
    Executes controlled drip sending with 3-7 minute randomized intervals.
    Enforces the safe daily warm-up limit of 10-15 emails.
    """
    max_daily_limit = 15
    queue = leads_to_contact[:max_daily_limit]
    
    print(f"[{datetime.now().strftime('%H:%M:%S')}] 🚀 Initiating Safe Drip Dispatch Queue ({len(queue)} leads in queue)...")
    print(f"Verified Sender: abdulrahmant.official@gmail.com")
    print(f"Active Calendly: {CALENDLY_URL}")
    print(f"Safety Rules: Randomized {min_delay_sec//60}–{max_delay_sec//60} mins jitter between dispatches.")

    for index, lead in enumerate(queue, 1):
        lead_id = lead.get("id")
        recipient = lead.get("email") or lead.get("outreachRecipient")
        business_name = lead.get("name") or lead.get("company")
        preview_url = lead.get("previewUrl", "")
        subject = lead.get("outreachSubject") or f"Quick live prototype for {business_name}"
        
        email_body = lead.get("outreachBody") or (
            f"Hi {business_name} Team,\n\n"
            f"We went ahead and built a custom live landing page prototype specifically for your brand ($0 cost, no catch):\n\n"
            f"👉 View live preview: {preview_url}\n\n"
            f"If you'd like to walk through the preview together or chat about your mobile conversion strategy, grab a quick 15-min slot here:\n"
            f"📅 {CALENDLY_URL} (100% free, zero strings attached)\n\n"
            f"Best regards,\n"
            f"AbdulRahman-T\n"
            f"MoX Hunter Studio"
        )

        print(f"\n--- [{index}/{len(queue)}] Dispatching Outreach to {business_name} ({recipient}) ---")
        
        # 1. Live Send via Composio Gmail
        if live_send and recipient:
            res = send_gmail_via_composio(recipient, subject, email_body)
            if res.get("successful"):
                print(f"✓ Email dispatched from abdulrahmant.official@gmail.com (ID: {res.get('data', {}).get('id', 'SENT')})")
            else:
                print(f"⚠️ Dispatch issue: {res.get('error')}")

        # 2. Log activity to CRM and update status to 'Outreach Sent'
        activity_payload = {
            "type": "email_sent",
            "subject": subject,
            "body": email_body,
            "sentAt": datetime.now(timezone.utc).isoformat(),
            "status": "sent"
        }
        
        if lead_id:
            try:
                req = urllib.request.Request(
                    f"{API_URL}/leads/{lead_id}/activity",
                    data=json.dumps(activity_payload).encode("utf-8"),
                    headers=headers,
                    method="POST"
                )
                with urllib.request.urlopen(req, context=ssl_context) as res:
                    print(f"✓ CRM Activity Logged & Status updated to 'Outreach Sent'")
            except Exception as e:
                print(f"⚠️ Activity log error: {e}")

        # 3. Randomized Drip Delay before next email (if not last item)
        if index < len(queue):
            jitter = random.randint(min_delay_sec, max_delay_sec)
            jitter_mins = round(jitter / 60, 2)
            print(f"⏳ Cooling down for {jitter_mins} minutes ({jitter}s) to maintain natural sending cadence...")
            time.sleep(jitter)

    print(f"\n[{datetime.now().strftime('%H:%M:%S')}] ✅ Daily Drip Outreach Queue Completed.")

if __name__ == "__main__":
    test_queue = [{
        "id": "FmIYSd7nyr50Hug1JH4K",
        "name": "Prestige Car Detailing",
        "email": "sirajiaengineering@gmail.com",
        "previewUrl": "https://mox.infni-t.online/preview/prestige-car-detailing-01",
        "outreachSubject": "Quick live prototype for Prestige Car Detailing (DHA Phase 5)"
    }]
    # Run test without sleep for local verification
    drip_dispatch_queue(test_queue, min_delay_sec=1, max_delay_sec=2, live_send=False)
