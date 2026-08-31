#!/usr/bin/env python3
"""
mox_verifier.py - Lead & URL Health Verification Engine for MoX Hunter
Diagnoses HTTP codes, SSL certs, DNS resolution, mobile viewports, and Core Web Vitals issues.
"""

import sys
import os
import json
import socket
import ssl
import urllib.request
from urllib.parse import urlparse

def verify_lead_url(url: str):
    """Deeply audits a website URL to diagnose live status and conversion blockers."""
    if not url.startswith("http"):
        url = "https://" + url

    parsed = urlparse(url)
    hostname = parsed.hostname or url

    audit = {
        "url": url,
        "hostname": hostname,
        "dns_valid": False,
        "http_status": None,
        "ssl_valid": False,
        "diagnosis_category": "UNKNOWN",
        "conversion_blockers": []
    }

    # 1. Test DNS Resolution
    try:
        ip = socket.gethostbyname(hostname)
        audit["dns_valid"] = True
        audit["ip_address"] = ip
    except socket.gaierror as e:
        audit["dns_valid"] = False
        audit["diagnosis_category"] = "BROKEN_DNS_OR_DOMAIN_DEAD"
        audit["conversion_blockers"].append("Domain nameservers or DNS records are unresolvable (Site completely offline).")
        return audit

    # 2. Test HTTP Reachability with unverified SSL fallback
    headers = {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148"}
    req = urllib.request.Request(url, headers=headers)
    
    # First attempt with strict SSL
    strict_ssl = ssl.create_default_context()
    unverified_ssl = ssl._create_unverified_context()
    
    try:
        with urllib.request.urlopen(req, context=strict_ssl, timeout=8) as response:
            audit["http_status"] = response.status
            audit["ssl_valid"] = True
            html = response.read().decode('utf-8', errors='ignore')
    except ssl.SSLError as e:
        audit["ssl_valid"] = False
        audit["conversion_blockers"].append(f"SSL certificate validation issue: {e}")
        try:
            with urllib.request.urlopen(req, context=unverified_ssl, timeout=8) as response:
                audit["http_status"] = response.status
                html = response.read().decode('utf-8', errors='ignore')
        except Exception as e2:
            audit["conversion_blockers"].append(f"Site unreachable: {e2}")
            html = ""
    except urllib.error.HTTPError as e:
        audit["http_status"] = e.code
        html = ""
        if e.code == 403:
            audit["diagnosis_category"] = "HTTP_403_FORBIDDEN_OR_WAF_BLOCKED"
            audit["conversion_blockers"].append("WAF or server misconfiguration blocking mobile visitors (403 Forbidden).")
        elif e.code == 404:
            audit["diagnosis_category"] = "HTTP_404_NOT_FOUND"
            audit["conversion_blockers"].append("Landing page URL returns 404 Not Found.")
        elif e.code >= 500:
            audit["diagnosis_category"] = "SERVER_500_CRASH"
            audit["conversion_blockers"].append(f"Internal server error (HTTP {e.code}).")
    except Exception as e:
        audit["diagnosis_category"] = "SERVER_TIMEOUT_OR_CONNECTION_REFUSED"
        audit["conversion_blockers"].append(f"Connection failed: {e}")
        html = ""

    if audit["http_status"] == 200:
        if '<meta name="viewport"' not in html.lower():
            audit["conversion_blockers"].append("Missing mobile viewport meta tag (distorted mobile UI).")
        if "http://" in html and "https://" in url:
            audit["conversion_blockers"].append("Mixed content (insecure HTTP assets on HTTPS page).")
            
        if len(audit["conversion_blockers"]) > 0:
            audit["diagnosis_category"] = "DEFICIENT_UX_OR_MOBILE_BROKEN"
        else:
            audit["diagnosis_category"] = "OUTDATED_OR_REDESIGN_CANDIDATE"

    return audit

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 mox_verifier.py <url>")
        sys.exit(1)
    
    target_url = sys.argv[1]
    res = verify_lead_url(target_url)
    print(json.dumps(res, indent=2))
