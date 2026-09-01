import os
import sys
import json
import urllib.request
import ssl
from image_linter import lint_html_images

API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"

def publish_prototype(title: str, slug: str, html_content: str, lead_id: str = ""):
    """Validates HTML markup and image authenticity before publishing to production CDN."""
    # 1. Image Authenticity & Blacklist Verification
    is_image_valid, image_errors = lint_html_images(html_content)
    if not is_image_valid:
        print("\n❌ PROTOTYPE REJECTED BY IMAGE LINTER:")
        for err in image_errors:
            print(f"  - {err}")
        print("Build halted to prevent non-clinical/bad imagery from publishing.")
        return None

    # 2. Publish to Production Endpoint
    payload = {
        "title": title,
        "customSlug": slug,
        "htmlContent": html_content,
        "leadId": lead_id
    }
    
    headers = {
        "Content-Type": "application/json",
        "mo-x-api-key": API_KEY
    }
    
    ssl_context = ssl._create_unverified_context()
    req = urllib.request.Request(
        f"{API_URL}/publish-prototype",
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, context=ssl_context) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            print(f"✓ Prototype Published Successfully: {res_data.get('previewUrl')}")
            return res_data
    except Exception as e:
        print(f"❌ Error publishing prototype: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 mox_designer.py <title> <customSlug> <html_file_path> [lead_id]")
        sys.exit(1)
        
    p_title = sys.argv[1]
    p_slug = sys.argv[2]
    p_file = sys.argv[3]
    p_lead_id = sys.argv[4] if len(sys.argv) > 4 else ""
    
    if not os.path.exists(p_file):
        print(f"Error: File not found: {p_file}")
        sys.exit(1)
        
    with open(p_file, "r", encoding="utf-8") as f:
        content = f.read()
        
    publish_prototype(p_title, p_slug, content, p_lead_id)
