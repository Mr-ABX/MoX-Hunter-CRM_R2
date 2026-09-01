import json
import urllib.request
import ssl

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
}

lead_updates = [
    {
        "id": "8Zr3wNzElLivUIkJS4aA", # Care N Cure
        "logo": "https://cncclinic.pk/wp-content/uploads/2025/10/cropped-CnCLogoGoodTextWhite.webp",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Care+N+Cure+Dental+Clinic+F-7+Markaz+Islamabad",
        "insights": "Top-rated F-7 Markaz clinic since 2013. Website has severe design & layout bugs, broken footer, and distorted responsive sections. Perfect candidate for a clean modern clinical redesign."
    },
    {
        "id": "H11iOu7I0ilMuaf8DJHd", # Hissam & Associates
        "logo": "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=300&auto=format&fit=crop&q=80",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Hissam+%26+Associates+Dental+Care+Beverly+Centre+Blue+Area+Islamabad",
        "insights": "Prestigious 5.0★ clinic in Beverly Centre, Blue Area. Domain hissamdental.com has dead DNS/unconfigured nameservers. Losing diplomatic & corporate patient bookings."
    },
    {
        "id": "Q8H5spbIckTQPLS7GriW", # The Dental Consultants
        "logo": "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=300&auto=format&fit=crop&q=80",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=The+Dental+Consultants+Jinnah+Super+Market+F-7+Markaz+Islamabad",
        "insights": "Elite Jinnah Super Market clinic. Domain thedentalconsultants.pk returns HTTP 403 Forbidden server misconfiguration."
    },
    {
        "id": "RNJgTNdKola1w86f8DL8", # Smile Square
        "logo": "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&auto=format&fit=crop&q=80",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Smile+Square+Dental+Specialists+F-7+Markaz+Islamabad",
        "insights": "24/7 emergency care & FCPS specialists in F-7. Live desktop site lacks modern mobile conversion funnel and instant emergency WhatsApp booking."
    },
    {
        "id": "mFEEMxUoRbxTlCJbOYtE", # Kensington Dental
        "logo": "https://kdicislamabad.com/assets/img/logo/KDIC-logo.png",
        "googleMapsUrl": "https://www.google.com/maps/search/?api=1&query=Kensington+Dental+%26+Implant+Centre+F-7%2F2+Islamabad",
        "insights": "10-Year Legacy (Est. 2014) in F-7/2 offering UK Standard Oral Health Care. Website is outdated and doesn't match its prestigious British clinical standard."
    }
]

for upd in lead_updates:
    lead_id = upd["id"]
    req = urllib.request.Request(f"{API_URL}/leads/{lead_id}", data=json.dumps(upd).encode('utf-8'), headers=headers, method='PATCH')
    try:
        with urllib.request.urlopen(req, context=ssl_context) as res:
            print(f"Updated lead {lead_id} with original logo and Google Maps URL.")
    except Exception as e:
        print(f"Error updating lead {lead_id}: {e}")
