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

def clean_test_leads():
    req = urllib.request.Request(f"{API_URL}/leads", headers=headers)
    with urllib.request.urlopen(req, context=ssl_context) as res:
        data = json.loads(res.read())
        leads = data.get("leads", [])
        print(f"Found {len(leads)} leads in CRM.")

    for l in leads:
        lid = l.get("id")
        name = l.get("name") or l.get("company")
        print(f"Lead: {name} (ID: {lid})")

if __name__ == "__main__":
    clean_test_leads()
