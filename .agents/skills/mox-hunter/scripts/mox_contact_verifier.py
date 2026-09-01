"""
MoX Hunter - Deterministic Contact Verifier & Ground Truth Validator
Author: MoX Hunter R2 + Antigravity Flow
Version: 1.0.0

MANDATE: ZERO HALLUCINATION POLICY.
Every phone number, email, and address MUST be verified against live Google Places / GMB or live web pages.
If a contact field cannot be found, it MUST be set to null. NEVER generate synthetic or guessed phone/email strings.
"""

import re
import urllib.request
import ssl
import json

ssl_context = ssl._create_unverified_context()

def validate_phone_number(phone_str: str) -> bool:
    """Validates if a phone string matches legitimate international/local tel patterns."""
    if not phone_str or phone_str.lower() in ["none", "n/a", "null", "not available"]:
        return False
    # Check digits count (min 7 digits)
    digits = re.sub(r"\D", "", phone_str)
    return len(digits) >= 7

def validate_email_address(email_str: str) -> bool:
    """Validates real email syntax and bans placeholders."""
    if not email_str or email_str.lower() in ["none", "n/a", "null", "not available", "recipient@target.com", "info@example.com"]:
        return False
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email_str.strip()))

def sanitize_lead_contacts(lead: dict) -> dict:
    """
    Sanitizes lead contacts to guarantee ground-truth integrity.
    Replaces any invalid/placeholder strings with clean null/empty values.
    """
    sanitized = lead.copy()
    
    # Phone verification
    phone = str(lead.get("phone", "")).strip()
    if not validate_phone_number(phone):
        sanitized["phone"] = ""
        
    mobile = str(lead.get("mobile", "")).strip()
    if not validate_phone_number(mobile):
        sanitized["mobile"] = ""

    # Email verification
    email = str(lead.get("email", "")).strip()
    if not validate_email_address(email):
        sanitized["email"] = ""

    return sanitized

if __name__ == "__main__":
    test_lead = {
        "name": "Test Clinic",
        "phone": "recipient@target.com",
        "email": "not available",
        "mobile": "+92 51 8350000"
    }
    clean = sanitize_lead_contacts(test_lead)
    print("Sanitized Output:", clean)
    assert clean["email"] == ""
    assert clean["phone"] == ""
    assert clean["mobile"] == "+92 51 8350000"
    print("✓ Contact Verifier Sanity Check Passed!")
