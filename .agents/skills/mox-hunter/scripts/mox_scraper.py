#!/usr/bin/env python3
"""
mox_scraper.py - Live Business Asset & Social Media Scraper for MoX Hunter
Zero-dependency scraper using standard Python library (urllib, html.parser, re).
"""

import sys
import os
import json
import re
import urllib.request
import ssl
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

ssl_context = ssl._create_unverified_context()

class AssetHTMLParser(HTMLParser):
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.logo_candidates = []
        self.social_links = {}
        self.in_viewport = False
        
    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        
        # Check img tags
        if tag == 'img':
            src = attr_dict.get('src') or attr_dict.get('data-src') or ''
            alt = attr_dict.get('alt', '').lower()
            cls = attr_dict.get('class', '').lower()
            img_id = attr_dict.get('id', '').lower()
            
            if src and any('logo' in s for s in [src.lower(), alt, cls, img_id]):
                self.logo_candidates.append(urljoin(self.base_url, src))
                
        # Check link tags for favicon / icon
        elif tag == 'link':
            rel = attr_dict.get('rel', '').lower()
            href = attr_dict.get('href', '')
            if href and any(x in rel for x in ['icon', 'apple-touch-icon', 'shortcut icon']):
                self.logo_candidates.append(urljoin(self.base_url, href))
                
        # Check meta OpenGraph
        elif tag == 'meta':
            prop = attr_dict.get('property', '').lower()
            content = attr_dict.get('content', '')
            if prop == 'og:image' and content:
                self.logo_candidates.append(urljoin(self.base_url, content))
                
        # Check anchor tags for socials
        elif tag == 'a':
            href = attr_dict.get('href', '')
            if href:
                if 'facebook.com' in href and not any(x in href for x in ['sharer', 'share.php']):
                    self.social_links['facebook'] = href
                elif 'instagram.com' in href:
                    self.social_links['instagram'] = href
                elif 'linkedin.com' in href:
                    self.social_links['linkedin'] = href
                elif 'wa.me' in href or 'whatsapp.com' in href:
                    self.social_links['whatsapp'] = href

def scrape_brand_assets(url: str, clinic_name: str = ""):
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    result = {
        "url": url,
        "name": clinic_name,
        "is_reachable": False,
        "logo_url": None,
        "phone": None,
        "email": None,
        "social_links": {},
        "notes": []
    }
    
    if not url.startswith("http"):
        url = "https://" + url

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context, timeout=8) as response:
            html = response.read().decode('utf-8', errors='ignore')
            result["is_reachable"] = True
            
            parser = AssetHTMLParser(url)
            parser.feed(html)
            
            if parser.logo_candidates:
                result["logo_url"] = parser.logo_candidates[0]
                result["all_logo_candidates"] = parser.logo_candidates[:3]
                
            result["social_links"] = parser.social_links

            # Extract Phone Numbers
            phone_matches = re.findall(r'(?:\+92|0)\s?[0-9]{2,3}[\s-]?[0-9]{7,8}', html)
            if phone_matches:
                result["phone"] = phone_matches[0].strip()

            # Extract Emails
            email_matches = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', html)
            clean_emails = [e for e in email_matches if not any(x in e.lower() for x in ['.png', '.jpg', '.webp', '.js', '.css', 'example.com', 'sentry.io'])]
            if clean_emails:
                result["email"] = clean_emails[0]

    except Exception as e:
        result["error"] = str(e)
        result["notes"].append(f"Scrape failed or timed out: {e}")

    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 mox_scraper.py <url> [clinic_name]")
        sys.exit(1)
    
    target_url = sys.argv[1]
    target_name = sys.argv[2] if len(sys.argv) > 2 else ""
    data = scrape_brand_assets(target_url, target_name)
    print(json.dumps(data, indent=2))
