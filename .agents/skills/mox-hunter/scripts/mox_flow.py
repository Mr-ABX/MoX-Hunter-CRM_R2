#!/usr/bin/env python3
"""
mox_flow.py - Unified Master CLI Orchestrator for MoX Hunter
Coordinates Scrapers, Verifiers, Designers, Copywriters, and CRM Drip Dispatch.
"""

import sys
import os
import argparse
import json

from mox_scraper import scrape_brand_assets
from mox_verifier import verify_lead_url
from mox_copywriter import generate_outreach_assets

def show_status():
    print("\n🚀 MoX Hunter Master Flow Orchestrator CLI")
    print("------------------------------------------")
    print("Active Workspace: MoX Hunter R2 + Antigravity Flow")
    print("Target Engine: 70/30 Dual-Engine Strategy (Local WhatsApp + Global Cold Email)")
    print("Prototypes CDN: https://mox.infni-t.online/preview/")
    print("CRM Backend: https://mo-x.vercel.app/api/mcp")
    print("Status: Operational & Ready\n")

def main():
    parser = argparse.ArgumentParser(description="MoX Hunter Master CLI Flow Engine")
    parser.add_argument("--action", choices=["status", "verify", "scrape", "copy"], default="status")
    parser.add_argument("--url", help="Target website URL")
    parser.add_argument("--name", help="Target business name")
    parser.add_argument("--phone", help="Target phone number")
    parser.add_argument("--city", help="Target city")
    
    args = parser.parse_args()
    
    if args.action == "status":
        show_status()
    elif args.action == "verify":
        if not args.url:
            print("Error: --url is required for verify action.")
            sys.exit(1)
        res = verify_lead_url(args.url)
        print(json.dumps(res, indent=2))
    elif args.action == "scrape":
        if not args.url:
            print("Error: --url is required for scrape action.")
            sys.exit(1)
        res = scrape_brand_assets(args.url, args.name or "")
        print(json.dumps(res, indent=2))
    elif args.action == "copy":
        lead = {
            "name": args.name or "Business",
            "city": args.city or "Islamabad",
            "phone": args.phone or "+92512223870",
            "website": args.url or "",
            "previewUrl": "https://mox.infni-t.online/preview/care-n-cure-dental-f7-02"
        }
        res = generate_outreach_assets(lead)
        print(json.dumps(res, indent=2))

if __name__ == "__main__":
    main()
