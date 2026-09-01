import json
import urllib.request
import ssl
import sys

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
}

leads_to_ingest = [
    {
        "name": "Care N Cure Dental Clinic",
        "company": "Care N Cure Dental Clinic",
        "industry": "Cosmetic Dentistry & Implantology",
        "niche": "Cosmetic Dentistry",
        "city": "F-7 Markaz, Islamabad",
        "phone": "+92 51 2223870",
        "website": "cncclinic.pk",
        "rating": 4.9,
        "score": 96,
        "status": "Qualified",
        "insights": "Top-rated F-7 Markaz clinic operating since 2013. Website cncclinic.pk is completely timed out/offline. Prime target for 2-paragraph courtesy alert + bespoke mobile prototype."
    },
    {
        "name": "Hissam & Associates Dental Care",
        "company": "Hissam & Associates Dental Care",
        "industry": "Cosmetic Dentistry & Orthodontics",
        "niche": "Cosmetic Dentistry",
        "city": "Beverly Centre, Blue Area / F-6, Islamabad",
        "phone": "+92 300 5143322",
        "website": "hissamdental.com",
        "rating": 5.0,
        "score": 98,
        "status": "Qualified",
        "insights": "Prestigious 5.0★ clinic in Beverly Centre, Blue Area. Domain hissamdental.com has dead DNS / unconfigured nameservers. Losing high-net-worth diplomatic & corporate patient inquiries."
    },
    {
        "name": "The Dental Consultants",
        "company": "The Dental Consultants",
        "industry": "Cosmetic Dentistry & Orthodontics",
        "niche": "Cosmetic Dentistry",
        "city": "Jinnah Super Market, F-7 Markaz, Islamabad",
        "phone": "+92 51 2655588",
        "website": "thedentalconsultants.pk",
        "rating": 4.8,
        "score": 92,
        "status": "Qualified",
        "insights": "Elite Jinnah Super Market clinic. Domain throws HTTP 403 Forbidden server error. In dire need of a clean modern clinical layout."
    },
    {
        "name": "Smile Square Dental Specialists",
        "company": "Smile Square Dental Specialists",
        "industry": "24/7 Emergency & Cosmetic Dentistry",
        "niche": "Cosmetic Dentistry",
        "city": "F-7 Markaz, Islamabad",
        "phone": "+92 333 5556789",
        "website": "smilesquareislamabad.com",
        "rating": 4.9,
        "score": 94,
        "status": "Qualified",
        "insights": "24/7 emergency dental care and FCPS specialist practice in F-7. Website has persistent server read timeouts on mobile devices."
    },
    {
        "name": "Kensington Dental & Implant Centre",
        "company": "Kensington Dental & Implant Centre",
        "industry": "Dental Implants & Smile Restoration",
        "niche": "Cosmetic Dentistry",
        "city": "F-7/2, Islamabad",
        "phone": "+92 51 2608822",
        "website": "kdicislamabad.com",
        "rating": 4.9,
        "score": 90,
        "status": "Qualified",
        "insights": "High-end implant studio in F-7/2. Live domain but lacks interactive consultation booking and modern mobile speed."
    }
]

created_leads = []

for l in leads_to_ingest:
    req = urllib.request.Request(f"{API_URL}/leads", data=json.dumps(l).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, context=ssl_context) as res:
            resp_data = json.loads(res.read())
            l["id"] = resp_data.get("id")
            created_leads.append(l)
            print(f"Created Lead: {l['name']} (ID: {l['id']})")
    except Exception as e:
        print(f"Failed to create lead {l['name']}: {e}")

# Save to flow state orchestrator
with open("/Volumes/WORK/ABX-2 (CODE AND PROJECTS)/Antigravity Projects-02/The Anti-Gravity Automations/MoX Hunter R2 + Antigravity Flow/scratch/flow_state.json", "w") as f:
    json.dump({
        "current_stage": "GATE_1_WAITING_HUMAN_APPROVAL",
        "scope": {
            "targetCity": "Islamabad (F-6, F-7 Markaz, Blue Area)",
            "nicheStrategy": "Cosmetic Dentistry & Aesthetic Dental Clinics",
            "batchSize": len(created_leads),
            "timestamp": "2026-08-28T02:40:00+05:00"
        },
        "leads": created_leads,
        "gate1_approved": False,
        "gate2_approved": False
    }, f, indent=2)

print("\nIngestion complete and flow state updated to GATE_1_WAITING_HUMAN_APPROVAL.")
