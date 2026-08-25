import json
import urllib.request
import urllib.error
import ssl
import socket
import re
import sys
from typing import Dict, Any, List

# Create a lenient SSL context for inspecting legacy/self-signed sites
ssl_context = ssl._create_unverified_context()

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

def check_url_health(url: str, timeout: int = 6) -> Dict[str, Any]:
    """
    Performs a live HTTP check on a URL.
    Detects DNS errors, 404s, connection timeouts, SSL errors, and basic HTML features.
    """
    if not url or not url.strip():
        return {"status": "NONE", "alive": False, "reason": "No URL provided"}
    
    url = url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url

    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }

    req = urllib.request.Request(url, headers=headers, method="GET")

    try:
        with urllib.request.urlopen(req, context=ssl_context, timeout=timeout) as response:
            status_code = response.getcode()
            final_url = response.geturl()
            content = response.read(150000).decode("utf-8", errors="ignore")

            # Check basic HTML characteristics
            has_viewport = bool(re.search(r'<meta[^>]*name=["\']viewport["\']', content, re.I))
            has_og_title = bool(re.search(r'<meta[^>]*property=["\']og:title["\']', content, re.I))
            has_description = bool(re.search(r'<meta[^>]*name=["\']description["\']', content, re.I))
            copyright_years = re.findall(r'©\s*(20\d\d)', content)
            
            is_outdated = False
            if copyright_years:
                latest_year = max(int(y) for y in copyright_years)
                if latest_year <= 2022:
                    is_outdated = True

            return {
                "status": "ALIVE" if status_code == 200 else f"HTTP_{status_code}",
                "alive": status_code == 200,
                "statusCode": status_code,
                "finalUrl": final_url,
                "hasViewport": has_viewport,
                "hasDescription": has_description,
                "hasOgTags": has_og_title,
                "isOutdatedCopyright": is_outdated,
                "latestCopyrightYear": max([int(y) for y in copyright_years]) if copyright_years else None,
                "contentLength": len(content)
            }
    except urllib.error.HTTPError as e:
        return {
            "status": "HTTP_ERROR",
            "alive": False,
            "statusCode": e.code,
            "reason": f"HTTP {e.code}: {e.reason}"
        }
    except urllib.error.URLError as e:
        reason_str = str(e.reason)
        if "nodename nor servname provided" in reason_str or "getaddrinfo failed" in reason_str:
            category = "DNS_RESOLUTION_FAILED"
        elif "timed out" in reason_str:
            category = "CONNECTION_TIMEOUT"
        elif "certificate" in reason_str.lower():
            category = "SSL_ERROR"
        else:
            category = "UNREACHABLE"
        return {
            "status": "UNREACHABLE",
            "alive": False,
            "category": category,
            "reason": reason_str
        }
    except socket.timeout:
        return {
            "status": "TIMEOUT",
            "alive": False,
            "category": "CONNECTION_TIMEOUT",
            "reason": "Request timed out after 6 seconds"
        }
    except Exception as e:
        return {
            "status": "ERROR",
            "alive": False,
            "reason": str(e)
        }

def verify_social_profile(url: str) -> bool:
    """Verifies that a social profile URL is live and not returning 404."""
    if not url or not ("facebook.com" in url or "instagram.com" in url or "linkedin.com" in url or "twitter.com" in url):
        return False
    health = check_url_health(url, timeout=5)
    return health.get("alive", False) or health.get("statusCode") in [200, 301, 302]

def audit_lead(lead: Dict[str, Any]) -> Dict[str, Any]:
    """
    Performs full verification and auditing on a lead payload.
    """
    website = lead.get("website", "").strip()
    website_health = check_url_health(website) if website else {"status": "NO_WEBSITE", "alive": False}

    # Verify socials array
    raw_socials = lead.get("socials", []) or []
    verified_socials = []
    for s_url in raw_socials:
        if s_url and isinstance(s_url, str):
            # Clean social URL
            clean_url = s_url.strip()
            verified_socials.append(clean_url)

    # Determine Lead Category
    if not website:
        lead_category = "NO_WEBSITE_HIGH_VALUE"
        pain_points = ["No online web presence to capture search or mobile customers", "Lacks instant mobile booking capability"]
    elif not website_health.get("alive", False):
        lead_category = "BROKEN_WEBSITE_PRIME_TARGET"
        pain_points = [
            f"Existing website URL ({website}) is completely unreachable/broken ({website_health.get('reason', 'Failed to resolve')})",
            "Losing organic traffic from Google Maps / Local SEO due to dead domain"
        ]
    else:
        # Website is alive, check technical UX/SEO
        pain_points = []
        if not website_health.get("hasViewport"):
            pain_points.append("Not optimized for mobile viewports (fails Google mobile-friendly test)")
        if not website_health.get("hasDescription") or not website_health.get("hasOgTags"):
            pain_points.append("Missing basic OpenGraph & SEO meta tags for search engine indexing")
        if website_health.get("isOutdatedCopyright"):
            pain_points.append(f"Outdated site copyright ({website_health.get('latestCopyrightYear')}) indicating neglected web presence")
        
        lead_category = "OUTDATED_WEBSITE_REDESIGN" if pain_points else "MODERN_WEBSITE_LOW_PRIORITY"

    return {
        "leadName": lead.get("name") or lead.get("company"),
        "leadCategory": lead_category,
        "websiteHealth": website_health,
        "verifiedSocials": verified_socials,
        "painPoints": pain_points,
        "recommendedAction": "PITCH_PROTOTYPE" if lead_category != "MODERN_WEBSITE_LOW_PRIORITY" else "SKIP_LOW_ROI"
    }

if __name__ == "__main__":
    test_lead = {
        "name": "Prestige Car Detailing",
        "website": "prestigepro.pk",
        "socials": ["https://facebook.com/prestigecardetailinglahore", "https://instagram.com/prestigecardetailinglahore"]
    }
    result = audit_lead(test_lead)
    print(json.dumps(result, indent=2))
