import json
import urllib.request
import urllib.error
import ssl
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"
CALENDLY_URL = "https://calendly.com/digital-b3asts"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
}

def generate_tracking_pixel(lead_id: str) -> str:
    """Generates an invisible 1x1 tracking pixel to track email opens."""
    return f'<img src="https://mox.infni-t.online/api/mcp/track/open?leadId={lead_id}" width="1" height="1" style="display:none;" alt="" />'

def generate_followup_message(lead: Dict[str, Any], step: int) -> Dict[str, str]:
    """
    Generates a natural, conversational, non-AI sounding follow-up email.
    """
    name = lead.get("name") or lead.get("company", "there")
    city = lead.get("city", "your area")
    preview_url = lead.get("previewUrl", "")
    lead_id = lead.get("id", "")
    tracking_pixel = generate_tracking_pixel(lead_id)

    if step == 1:
        # Day 3 - Quick casual bump
        subject = f"Re: Quick live prototype for {name}"
        body = (
            f"Hey {name} Team,\n\n"
            f"Quick check in case this got lost in the shuffle earlier this week. "
            f"Did you get a chance to test the live mobile prototype on your phone?\n\n"
            f"👉 {preview_url}\n\n"
            f"Either way, hope you guys are having a great and productive week!\n\n"
            f"Best regards,\nAbdulRahman-T\nMoX Hunter Studio"
        )
    elif step == 2:
        # Day 6 - Micro-value add
        subject = f"Added instant booking widget for {name}"
        body = (
            f"Hi {name},\n\n"
            f"Was checking through your studio's reviews again and added an instant WhatsApp booking button + package selector right onto your preview page:\n\n"
            f"👉 {preview_url}\n\n"
            f"Thought this would make it seamless for evening mobile visitors in {city} to reserve slots directly.\n\n"
            f"If you'd like to brainstorm a few more ideas or connect your domain, feel free to grab a quick 15-min chat here: {CALENDLY_URL}\n\n"
            f"Best,\nAbdulRahman-T"
        )
    else:
        # Day 10 - Graceful breakup / polite close
        subject = f"Leaving the prototype active for {name}"
        body = (
            f"Hey {name},\n\n"
            f"Assuming you're all set on your web setup right now, so I won't crowd your inbox any further!\n\n"
            f"I'll leave the live prototype active here in case you or your team ever want to reference or build off the layout later:\n"
            f"👉 {preview_url}\n\n"
            f"Wishing you continued success and growth in {city}!\n\n"
            f"Best regards,\nAbdulRahman-T\nMoX Hunter Studio"
        )

    return {
        "step": step,
        "subject": subject,
        "body": body,
        "html": f'<div style="font-family: Arial, sans-serif; font-size: 15px; color: #1a1a1a; line-height: 1.6;">{body.replace(chr(10), "<br>")}</div>{tracking_pixel}'
    }

def scan_followup_candidates() -> List[Dict[str, Any]]:
    """
    Scans CRM leads to identify prospects due for Follow-Up #1, #2, or #3.
    """
    candidates = []
    try:
        req = urllib.request.Request(f"{API_URL}/leads", headers=headers)
        with urllib.request.urlopen(req, context=ssl_context) as res:
            data = json.loads(res.read())
            leads = data.get("leads", [])

        now = datetime.now(timezone.utc)
        for lead in leads:
            status = lead.get("status")
            if status in ["Outreach Sent", "Contacted"]:
                activities = lead.get("activities", [])
                email_activities = [a for a in activities if a.get("type") in ["email_sent", "followup_sent"]]
                
                followup_count = len([a for a in email_activities if a.get("type") == "followup_sent"])
                
                if email_activities:
                    last_sent_str = email_activities[-1].get("sentAt")
                    try:
                        # Parse ISO datetime
                        last_sent = datetime.fromisoformat(last_sent_str.replace("Z", "+00:00"))
                        days_elapsed = (now - last_sent).days
                    except Exception:
                        days_elapsed = 3 # default for testing

                    next_step = None
                    if followup_count == 0 and days_elapsed >= 3:
                        next_step = 1
                    elif followup_count == 1 and days_elapsed >= 3:
                        next_step = 2
                    elif followup_count == 2 and days_elapsed >= 4:
                        next_step = 3

                    if next_step:
                        followup_draft = generate_followup_message(lead, next_step)
                        candidates.append({
                            "leadId": lead.get("id"),
                            "businessName": lead.get("name") or lead.get("company"),
                            "recipient": lead.get("email") or lead.get("outreachRecipient"),
                            "daysElapsed": days_elapsed,
                            "followupStep": next_step,
                            "draft": followup_draft
                        })
    except Exception as e:
        print(f"Error scanning follow-ups: {e}")

    return candidates

if __name__ == "__main__":
    candidates = scan_followup_candidates()
    print(f"Found {len(candidates)} follow-up candidates.")
    print(json.dumps(candidates, indent=2))
