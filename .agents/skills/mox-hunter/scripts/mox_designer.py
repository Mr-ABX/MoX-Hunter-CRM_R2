#!/usr/bin/env python3
"""
mox_designer.py - Interactive Awwwards-Grade Prototype Engine for MoX Hunter
Synthesizes unique, responsive single-file landing pages with Tailwind CSS, 2-column forms,
and automatically publishes to the MCP endpoint.
"""

import sys
import os
import json
import urllib.request
import ssl

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"

def publish_prototype(title: str, custom_slug: str, html_content: str, lead_id: str = ""):
    """Publishes the HTML prototype to the MoX CDN endpoint."""
    payload = {
        "title": title,
        "customSlug": custom_slug,
        "htmlContent": html_content,
        "leadId": lead_id
    }
    
    headers = {
        "Content-Type": "application/json",
        "mo-x-api-key": API_KEY
    }
    
    req = urllib.request.Request(
        f"{API_URL}/publish-prototype",
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, context=ssl_context) as response:
            res_json = json.loads(response.read().decode('utf-8'))
            return res_json
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 mox_designer.py <title> <custom_slug> <html_file_path> [lead_id]")
        sys.exit(1)
        
    p_title = sys.argv[1]
    p_slug = sys.argv[2]
    p_file = sys.argv[3]
    p_lead_id = sys.argv[4] if len(sys.argv) > 4 else ""
    
    with open(p_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    res = publish_prototype(p_title, p_slug, content, p_lead_id)
    print(json.dumps(res, indent=2))
