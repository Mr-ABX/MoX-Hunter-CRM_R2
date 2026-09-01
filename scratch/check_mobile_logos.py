import urllib.request
import urllib.error
import ssl
import re

ssl_ctx = ssl._create_unverified_context()

targets = {
    "Care N Cure": "https://cncclinic.pk",
    "Smile Square": "https://smilesquareislamabad.com",
    "Kensington Dental": "https://kdicislamabad.com",
    "The Dental Consultants": "https://thedentalconsultants.pk",
    "Hissam": "https://hissamdental.com"
}

for name, url in targets.items():
    print(f"\n--- Checking {name} ({url}) ---")
    try:
        req = urllib.request.Request(
            url, 
            headers={"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1"}
        )
        with urllib.request.urlopen(req, context=ssl_ctx, timeout=8) as res:
            content = res.read().decode("utf-8", errors="ignore")
            print(f"Status: HTTP {res.status} | Length: {len(content)} bytes")
            logos = re.findall(r'<img[^>]+src=["\']([^"\']*(?:logo|brand|header)[^"\']*)["\']', content, re.IGNORECASE)
            print(f"Found Logo candidates: {logos[:2]}")
            # check viewport meta tag
            has_viewport = "viewport" in content.lower()
            print(f"Has Mobile Viewport Tag: {has_viewport}")
    except Exception as e:
        print(f"Error checking {url}: {e}")
