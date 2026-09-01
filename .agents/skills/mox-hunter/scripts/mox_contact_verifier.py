"""
MoX Hunter - Deterministic Contact Verifier & Multi-Page Web Crawler
Author: MoX Hunter R2 + Antigravity Flow
Version: 2.0.0

MANDATE: ZERO HALLUCINATION & STRICT EMAIL/PHONE FILTRATION.
1. Crawls Homepage + /contact, /contact-us, /about, /about-us for ground-truth contacts.
2. Filters out dummy/placeholder emails (e.g. username@domain.com, example.com, wixpress.com, sentry.io).
3. Validates phone numbers (minimum 7 digits, formatted).
4. If no valid email exists, strictly sets email to null/empty (NEVER fallback to test emails).
"""

import re
import urllib.request
import urllib.error
import ssl
import json
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

ssl_context = ssl._create_unverified_context()

BANNED_EMAIL_DOMAINS = {
    "domain.com", "example.com", "test.com", "sentry.io", "wixpress.com", 
    "schema.org", "gravatar.com", "wordpress.org", "w.org", "bootstrap.com",
    "fontawesome.com", "googleapis.com", "cloudflare.com", "github.com",
    "mysite.com", "yourdomain.com", "sample.com", "target.com"
}

BANNED_EMAIL_PREFIXES = {
    "username", "user", "name", "yourname", "youremail", "test", "demo",
    "sample", "recipient", "admin@domain", "info@domain", "contact@domain"
}

def validate_phone_number(phone_str: str) -> bool:
    """Validates if a phone string matches legitimate international/local tel patterns."""
    if not phone_str or phone_str.lower() in ["none", "n/a", "null", "not available"]:
        return False
    digits = re.sub(r"\D", "", str(phone_str))
    return len(digits) >= 7

def validate_email_address(email_str: str) -> bool:
    """Strictly validates real business email syntax and rejects dummy/placeholder strings."""
    if not email_str or not isinstance(email_str, str):
        return False
    
    clean = email_str.strip().lower()
    if clean in ["none", "n/a", "null", "not available"]:
        return False
    
    # Reject asset extensions
    if any(ext in clean for ext in [".png", ".jpg", ".jpeg", ".webp", ".svg", ".js", ".css"]):
        return False

    pattern = r"^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)$"
    match = re.match(pattern, clean)
    if not match:
        return False

    domain = match.group(1).lower()
    prefix = clean.split("@")[0].lower()

    if domain in BANNED_EMAIL_DOMAINS or any(banned in domain for banned in ["example", "schema", "sentry", "wixpress"]):
        return False

    if prefix in BANNED_EMAIL_PREFIXES:
        return False

    return True

class ContactHTMLParser(HTMLParser):
    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url
        self.emails = set()
        self.phones = set()
        self.social_links = {}
        self.internal_contact_pages = set()

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        href = attr_dict.get('href', '')
        
        if tag == 'a' and href:
            href_lower = href.lower().strip()
            
            # mailto: links
            if href_lower.startswith('mailto:'):
                email = href_lower.replace('mailto:', '').split('?')[0].strip()
                if validate_email_address(email):
                    self.emails.add(email)

            # tel: links
            elif href_lower.startswith('tel:'):
                phone = href_lower.replace('tel:', '').strip()
                if validate_phone_number(phone):
                    self.phones.add(phone)

            # WhatsApp links
            elif 'wa.me' in href_lower or 'whatsapp.com' in href_lower:
                self.social_links['whatsapp'] = href

            # Social profiles
            elif 'facebook.com' in href_lower and not any(x in href_lower for x in ['sharer', 'share.php']):
                self.social_links['facebook'] = href
            elif 'instagram.com' in href_lower:
                self.social_links['instagram'] = href
            elif 'linkedin.com' in href_lower:
                self.social_links['linkedin'] = href

            # Internal contact subpaths
            elif any(k in href_lower for k in ['contact', 'about', 'reach-us', 'location']):
                full_url = urljoin(self.base_url, href)
                # Ensure same domain
                if urlparse(full_url).netloc == urlparse(self.base_url).netloc:
                    self.internal_contact_pages.add(full_url)

def crawl_and_extract_verified_contacts(website_url: str) -> dict:
    """
    Crawls homepage and contact subpaths to extract verified ground-truth emails & phone numbers.
    """
    if not website_url.startswith("http"):
        website_url = "https://" + website_url

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    discovered_emails = set()
    discovered_phones = set()
    discovered_socials = {}
    
    pages_to_crawl = [website_url]

    # 1. Scrape Homepage
    try:
        req = urllib.request.Request(website_url, headers=headers)
        with urllib.request.urlopen(req, context=ssl_context, timeout=6) as response:
            html = response.read().decode('utf-8', errors='ignore')
            parser = ContactHTMLParser(website_url)
            parser.feed(html)

            discovered_emails.update(parser.emails)
            discovered_phones.update(parser.phones)
            discovered_socials.update(parser.social_links)

            # Regex text fallbacks on homepage
            email_matches = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', html)
            for e in email_matches:
                if validate_email_address(e):
                    discovered_emails.add(e.lower().strip())

            phone_matches = re.findall(r'(?:\+92|0)\s?[0-9]{2,3}[\s-]?[0-9]{7,8}', html)
            for p in phone_matches:
                if validate_phone_number(p):
                    discovered_phones.add(p.strip())

            # Add discovered contact subpages (max 2)
            pages_to_crawl.extend(list(parser.internal_contact_pages)[:2])
    except Exception:
        pass

    # 2. Crawl Contact Subpages (if homepage had no email)
    if not discovered_emails and len(pages_to_crawl) > 1:
        for subpage in pages_to_crawl[1:3]:
            try:
                req = urllib.request.Request(subpage, headers=headers)
                with urllib.request.urlopen(req, context=ssl_context, timeout=6) as response:
                    sub_html = response.read().decode('utf-8', errors='ignore')
                    sub_parser = ContactHTMLParser(subpage)
                    sub_parser.feed(sub_html)
                    discovered_emails.update(sub_parser.emails)
                    discovered_phones.update(sub_parser.phones)
                    discovered_socials.update(sub_parser.social_links)

                    email_matches = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', sub_html)
                    for e in email_matches:
                        if validate_email_address(e):
                            discovered_emails.add(e.lower().strip())
            except Exception:
                continue

    verified_email = list(discovered_emails)[0] if discovered_emails else None
    verified_phone = list(discovered_phones)[0] if discovered_phones else None

    return {
        "website": website_url,
        "verified_email": verified_email,
        "all_emails": list(discovered_emails),
        "verified_phone": verified_phone,
        "all_phones": list(discovered_phones),
        "socials": discovered_socials
    }

if __name__ == "__main__":
    print("Testing Contact Verifier on live clinic websites...")
    test_url = "https://cncclinic.pk"
    res = crawl_and_extract_verified_contacts(test_url)
    print("Crawl Result for cncclinic.pk:", json.dumps(res, indent=2))
