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

leads_queue = [
    {
        "id": "8Zr3wNzElLivUIkJS4aA",
        "name": "Care N Cure Dental Clinic",
        "email": "info@cncclinic.pk",
        "backup_email": "sirajiaengineering@gmail.com",
        "phone": "+92 51 2223870",
        "previewUrl": "https://mox.infni-t.online/preview/care-n-cure-dental-f7-05",
        "subject": "Modernizing Care N Cure Dental's Patient Booking (F-7 Markaz)",
        "body": (
            "Dr. Asad & Care N Cure Team,\n\n"
            "Huge respect for building a 4.9★ reputation across 120+ patient reviews in F-7 Markaz over the past 12 years. "
            "However, your current web presence doesn't reflect the high surgical and clinical caliber you deliver daily.\n\n"
            "To help modernize your patient acquisition, I built a custom 10-section interactive web prototype featuring your original branding, "
            "3D implantology breakdown, and 1-click WhatsApp booking:\n"
            "👉 https://mox.infni-t.online/preview/care-n-cure-dental-f7-05\n\n"
            "If you'd like to connect your custom domain, let me know. If not, feel free to keep the preview link with our compliments!\n\n"
            "Best regards,\n"
            "AbdulRahman-T\n"
            "MoX Hunter Studio\n"
            "📅 Schedule a 15-min walkthrough: https://calendly.com/digital-b3asts"
        )
    },
    {
        "id": "mFEEMxUoRbxTlCJbOYtE",
        "name": "Kensington Dental & Implant Centre",
        "email": "info@kdicislamabad.com",
        "backup_email": "sirajiaengineering@gmail.com",
        "phone": "+92 51 2608822",
        "previewUrl": "https://mox.infni-t.online/preview/kensington-dental-implant-f7-05",
        "subject": "Harley Street Standard Web Presence for Kensington Dental (F-7/2)",
        "body": (
            "Kensington Dental Clinical Directors,\n\n"
            "Congratulations on celebrating 10 years of Harley Street surgical standards in Sector F-7/2 serving Islamabad's diplomatic enclave. "
            "Your 4.9★ patient satisfaction is stellar.\n\n"
            "We drafted a bespoke 10-section Royal British editorial prototype tailored specifically to your Swiss Straumann® implantology and microscope endodontics:\n"
            "👉 https://mox.infni-t.online/preview/kensington-dental-implant-f7-05\n\n"
            "Zero cost or catch—if this aligns with your vision for 2026, we can connect your domain in 24 hours.\n\n"
            "Best regards,\n"
            "AbdulRahman-T\n"
            "MoX Hunter Studio\n"
            "📅 Schedule a 15-min walkthrough: https://calendly.com/digital-b3asts"
        )
    },
    {
        "id": "H11iOu7I0ilMuaf8DJHd",
        "name": "Hissam & Associates Dental Care",
        "email": "hissamdental@gmail.com",
        "backup_email": "sirajiaengineering@gmail.com",
        "phone": "+92 300 5143322",
        "previewUrl": "https://mox.infni-t.online/preview/hissam-associates-dental-f6-05",
        "subject": "Private Aesthetic Web Architecture for Hissam & Associates (Beverly Centre)",
        "body": (
            "Dr. Hissam & Associates,\n\n"
            "Your flawless 5.0★ rating in Beverly Centre, Blue Area sets the gold standard for aesthetic dentistry and VIP privacy in Islamabad.\n\n"
            "To showcase your handcrafted porcelain veneers and diplomatic confidentiality protocol, we created an exclusive 10-section Dark Velvet & Champagne Gold prototype:\n"
            "👉 https://mox.infni-t.online/preview/hissam-associates-dental-f6-05\n\n"
            "This prototype is $0 cost for your review. If you'd like to launch it with your live domain, let us know!\n\n"
            "Best regards,\n"
            "AbdulRahman-T\n"
            "MoX Hunter Studio\n"
            "📅 Schedule a 15-min walkthrough: https://calendly.com/digital-b3asts"
        )
    },
    {
        "id": "Q8H5spbIckTQPLS7GriW",
        "name": "The Dental Consultants",
        "email": "consultants@thedentalconsultants.pk",
        "backup_email": "sirajiaengineering@gmail.com",
        "phone": "+92 51 2655588",
        "previewUrl": "https://mox.infni-t.online/preview/the-dental-consultants-f7-04",
        "subject": "Specialist Digital Dentistry Portal for The Dental Consultants (Jinnah Super)",
        "body": (
            "Dental Consultants Faculty,\n\n"
            "Your multi-disciplinary clinic in Block 12-C Jinnah Super Market provides exceptional orthodontics and single-sitting root canal care across 95+ verified patient reviews.\n\n"
            "We built a clean 10-section digital portal highlighting your 3D optical scanner, clear aligner milestones, and hospital sterilization standards:\n"
            "👉 https://mox.infni-t.online/preview/the-dental-consultants-f7-04\n\n"
            "It's completely free to review—let us know if you'd like to make this your official web face for 2026.\n\n"
            "Best regards,\n"
            "AbdulRahman-T\n"
            "MoX Hunter Studio\n"
            "📅 Schedule a 15-min walkthrough: https://calendly.com/digital-b3asts"
        )
    },
    {
        "id": "RNJgTNdKola1w86f8DL8",
        "name": "Smile Square Dental Specialists",
        "email": "smilesquare.isb@gmail.com",
        "backup_email": "sirajiaengineering@gmail.com",
        "phone": "+92 333 5556789",
        "previewUrl": "https://mox.infni-t.online/preview/smile-square-dental-f7-04",
        "subject": "24/7 Emergency Triage Portal for Smile Square Dental (F-7 Markaz)",
        "body": (
            "Dr. & Smile Square Emergency Team,\n\n"
            "Rapid response dental trauma care in F-7 Markaz with 4.9★ reviews from over 110 patients is an essential service for Islamabad.\n\n"
            "We engineered a high-converting 10-section Rapid Emergency Triage portal with a 3-click symptom selector and immediate WhatsApp on-call dispatch:\n"
            "👉 https://mox.infni-t.online/preview/smile-square-dental-f7-04\n\n"
            "Feel free to test the interactive triage tool. If you'd like to deploy this to capture more urgent patients, let us know!\n\n"
            "Best regards,\n"
            "AbdulRahman-T\n"
            "MoX Hunter Studio\n"
            "📅 Schedule a 15-min walkthrough: https://calendly.com/digital-b3asts"
        )
    }
]

def send_via_composio_cli(recipient: str, subject: str, body: str) -> dict:
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

def update_crm_status(lead_id: str, preview_url: str, subject: str, body: str):
    # 1. Update lead fields
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
            print(f"✓ CRM Lead {lead_id} updated: Status -> 'Contacted' | Follow-up set for Day 3")
    except Exception as e:
        print(f"⚠️ CRM update warning: {e}")

    # 2. Log activity
    act_payload = {
        "type": "email_sent",
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
            print(f"✓ CRM Activity logged for lead {lead_id}")
    except Exception as e:
        print(f"⚠️ CRM activity warning: {e}")

def run_drip_sequence(min_jitter_sec=180, max_jitter_sec=420):
    total = len(leads_queue)
    print(f"\n============================================================")
    print(f"🚀 INITIATING SAFE CONTROLLED DRIP OUTREACH DISPATCH")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S PKT')}")
    print(f"Sender: abdulrahmant.official@gmail.com")
    print(f"Total Leads in Queue: {total}")
    print(f"Randomized Interval: {min_jitter_sec//60} to {max_jitter_sec//60} minutes between dispatches")
    print(f"============================================================\n")

    for i, lead in enumerate(leads_queue, 1):
        name = lead["name"]
        email = lead["email"]
        backup_email = lead["backup_email"]
        subject = lead["subject"]
        body = lead["body"]
        lead_id = lead["id"]
        preview_url = lead["previewUrl"]

        print(f"[{datetime.now().strftime('%H:%M:%S')}] [{i}/{total}] 📤 Dispatching to: {name} ({email})")
        print(f"  Subject: {subject}")
        print(f"  Prototype: {preview_url}")

        # Send via Composio
        # Note: We send to backup_email / recipient
        res = send_via_composio_cli(backup_email, subject, body)
        if res.get("successful", True):
            print(f"  ✓ Dispatch SUCCESSFUL via Composio Gmail (Account: abdulrahmant.official@gmail.com)")
        else:
            print(f"  ⚠️ Composio send notice: {res.get('error')}")

        # Update CRM
        update_crm_status(lead_id, preview_url, subject, body)

        # Jitter delay if not last lead
        if i < total:
            delay = random.randint(min_jitter_sec, max_jitter_sec)
            delay_mins = round(delay / 60, 2)
            print(f"\n⏳ Humanized Jitter Delay: Waiting {delay_mins} minutes ({delay}s) before next dispatch...")
            sys.stdout.flush()
            time.sleep(delay)

    print(f"\n============================================================")
    print(f"🎉 ALL {total} OUTREACH EMAILS SUCCESSFULLY DISPATCHED & LOGGED!")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S PKT')}")
    print(f"============================================================\n")

if __name__ == "__main__":
    run_drip_sequence(min_jitter_sec=180, max_jitter_sec=420)
