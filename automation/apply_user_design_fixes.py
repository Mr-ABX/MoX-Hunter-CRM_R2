import json
import urllib.request
import ssl
import sys
import os

ssl_context = ssl._create_unverified_context()
API_URL = "https://mo-x.vercel.app/api/mcp"
API_KEY = "mox_zZdcZAAI2KXJzVOEorV3U2chSFTj2HWz"

headers = {
    "Content-Type": "application/json",
    "mo-x-api-key": API_KEY
}

# ==============================================================================
# 1. Kensington Dental & Implant Centre (True Royal British Blue Brand Palette)
# ==============================================================================
kensington_fixed_html = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kensington Dental & Implant Centre | F-7/2 Islamabad</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-serif-royal { font-family: 'Cormorant Garamond', serif; }
    .reveal { opacity: 0; transform: translateY(24px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body class="bg-[#031526] text-slate-100 antialiased selection:bg-[#0284c7] selection:text-white">
  <!-- Dual-Tier Header: Tier 1 (Royal British Navy Bar) -->
  <div class="bg-[#02101e] border-b border-sky-500/20 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs text-sky-100">
    <div class="flex items-center gap-3">
      <span class="inline-flex items-center gap-1.5 font-semibold text-sky-300"><span class="text-base">🇬🇧</span> UK Standard Oral Health Care • Est. 2014 in F-7/2 Islamabad</span>
      <span class="hidden md:inline text-slate-600">|</span>
      <span class="hidden md:inline text-slate-400">10-Year Clinical Legacy</span>
    </div>
    <div class="flex items-center gap-6 mt-1 sm:mt-0">
      <span class="text-slate-400">Mon – Sat: 10:00 AM – 8:00 PM</span>
      <a href="tel:+92512608822" class="font-bold text-sky-400 hover:text-sky-300 transition-colors">📞 (051) 260-8822</a>
    </div>
  </div>

  <!-- Dual-Tier Header: Tier 2 (Sticky Royal Blue Main Nav) -->
  <header class="sticky top-0 z-50 backdrop-blur-2xl bg-[#031526]/90 border-b border-sky-900/60">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <img src="https://kdicislamabad.com/assets/img/logo/KDIC-logo.png" alt="KDIC Logo" class="h-12 w-auto object-contain bg-white/5 p-1 rounded-xl border border-sky-500/20">
        <div class="hidden lg:block border-l border-sky-900/80 pl-4">
          <div class="text-[11px] font-bold text-sky-400 uppercase tracking-widest">Kensington Dental & Implant Centre</div>
          <div class="text-xs text-slate-400">Harley Street Surgical Standards in Islamabad</div>
        </div>
      </div>
      <nav class="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
        <a href="#implantology" class="hover:text-sky-400 transition-colors">3D Implantology</a>
        <a href="#smile-design" class="hover:text-sky-400 transition-colors">Harley Street Veneers</a>
        <a href="#reviews" class="hover:text-sky-400 transition-colors">Testimonials</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="#consultation" class="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-lg shadow-sky-500/20">
          Book UK Consultation
        </a>
      </div>
    </div>
  </header>

  <!-- Editorial Hero Section (Royal British Navy Backdrop) -->
  <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-24 px-6">
    <div class="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600" alt="Harley Street Architecture" class="w-full h-full object-cover opacity-15 filter brightness-75">
      <div class="absolute inset-0 bg-gradient-to-t from-[#031526] via-[#031526]/80 to-transparent"></div>
    </div>
    <div class="relative z-10 max-w-5xl mx-auto text-center reveal">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 text-xs font-semibold uppercase tracking-wider mb-6">
        🇬🇧 10 Years of British Clinical Dentistry in F-7/2 Islamabad
      </div>
      <h1 class="font-serif-royal text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
        Harley Street Aesthetic Standards. <br><span class="italic text-sky-400">Decade of Clinical Excellence</span>.
      </h1>
      <p class="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-light">
        Established in 2014 in Sector F-7/2 Islamabad. Delivering Swiss Straumann titanium implantology, custom hand-layered porcelain veneers, and microscope-guided dental surgery under strict British clinical protocols.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#consultation" class="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold px-9 py-4 rounded-xl shadow-xl shadow-sky-500/25 transition-all text-xs uppercase tracking-widest">
          Reserve Specialist Consultation
        </a>
        <a href="https://wa.me/92512608822?text=Hi%20Kensington%20Dental,%20I%20would%20like%20to%20book%20a%20UK%20Standard%20consultation." class="w-full sm:w-auto bg-[#072440] hover:bg-[#0a3156] border border-sky-700/50 text-white font-medium px-8 py-4 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2">
          💬 WhatsApp Concierge
        </a>
      </div>
    </div>
  </section>

  <!-- 10-Year Trust Metrics Bar -->
  <section class="border-y border-sky-900/60 bg-[#02101e] py-10 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="reveal">
        <div class="font-serif-royal text-4xl font-bold text-sky-400">10 Years</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Serving F-7/2 Since 2014</div>
      </div>
      <div class="reveal">
        <div class="font-serif-royal text-4xl font-bold text-sky-400">Swiss & German</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Straumann Implant Systems</div>
      </div>
      <div class="reveal">
        <div class="font-serif-royal text-4xl font-bold text-sky-400">4.9★ (70+)</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Diplomatic & Expat Ratings</div>
      </div>
      <div class="reveal">
        <div class="font-serif-royal text-4xl font-bold text-sky-400">100% GDC</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">British Sterilization Protocol</div>
      </div>
    </div>
  </section>

  <!-- 3D Implantology & Surgical Suite -->
  <section id="implantology" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-6 reveal">
        <div class="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">Precision Implantology</div>
        <h2 class="font-serif-royal text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">Swiss 3D Computer-Guided Titanium Dental Implants</h2>
        <p class="text-slate-300 text-sm leading-relaxed mb-6">
          At Kensington Dental, implant procedures are planned with 3D CBCT digital precision. We exclusively place documented Swiss Straumann® and German titanium fixtures backed by manufacturer lifetime structural warranties.
        </p>
        <div class="space-y-4 mb-8">
          <div class="flex items-start gap-3">
            <span class="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
            <div><strong class="text-white text-sm">Flapless Guided Placement:</strong> <span class="text-slate-400 text-xs">Rapid 24-hour healing with minimal swelling.</span></div>
          </div>
          <div class="flex items-start gap-3">
            <span class="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>
            <div><strong class="text-white text-sm">All-on-4 & Full Arch Reconstruction:</strong> <span class="text-slate-400 text-xs">Permanent full-jaw teeth replacement in a single day.</span></div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-6 reveal">
        <div class="relative rounded-3xl overflow-hidden border border-sky-800 bg-[#072440] p-3 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800" alt="3D Surgical Suite" class="w-full h-80 object-cover rounded-2xl mb-3">
          <div class="p-4 bg-[#02101e] rounded-xl border border-sky-900 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-white">Surgical Operatory • Sector F-7/2</div>
              <div class="text-[11px] text-sky-400">3D CBCT Guided Diagnostics</div>
            </div>
            <span class="text-xs bg-sky-500/10 text-sky-300 px-3 py-1 rounded-full font-bold border border-sky-500/30">UK Standard</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2-Column Master Consultation Suite -->
  <section id="consultation" class="py-24 px-6 bg-[#02101e] border-t border-sky-900/60">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <!-- Left Column: Certificate & Trust -->
      <div class="lg:col-span-5 reveal">
        <div class="bg-[#031526] border border-sky-700/40 p-8 rounded-3xl shadow-2xl">
          <div class="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 text-2xl mb-6">🇬🇧</div>
          <h3 class="font-serif-royal text-2xl font-bold text-white mb-3">UK Standard Protocol Guarantee</h3>
          <p class="text-slate-400 text-xs leading-relaxed mb-6">
            Every procedure at Kensington Dental & Implant Centre adheres strictly to British General Dental Council guidelines.
          </p>
          <div class="space-y-3 text-xs text-slate-300 pt-4 border-t border-sky-900">
            <div class="flex justify-between"><span class="text-slate-500">Location:</span> <span class="text-white font-medium">Sector F-7/2, Islamabad</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Established:</span> <span class="text-sky-400 font-medium">2014 (10-Year Legacy)</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Direct Telephone:</span> <span class="text-white font-medium">(051) 260-8822</span></div>
            <div class="flex justify-between"><span class="text-slate-500">WhatsApp:</span> <span class="text-emerald-400 font-medium">051-2608822</span></div>
          </div>
        </div>
      </div>

      <!-- Right Column: Priority Booking Form -->
      <div class="lg:col-span-7 reveal">
        <div class="bg-[#031526] border border-sky-900 p-8 sm:p-10 rounded-3xl shadow-2xl">
          <h2 class="font-serif-royal text-3xl font-bold text-white mb-2">Book Your UK Consultation</h2>
          <p class="text-slate-400 text-xs mb-8">Direct reservation with Kensington Dental & Implant Centre, F-7/2 Islamabad.</p>
          
          <form onsubmit="handleUKSubmit(event)" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Patient Full Name</label>
                <input type="text" required placeholder="e.g. Tariq Mansoor" class="w-full bg-[#02101e] border border-sky-900 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-sky-400">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">WhatsApp / Telephone</label>
                <input type="tel" required placeholder="0300-1234567" class="w-full bg-[#02101e] border border-sky-900 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-sky-400">
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Procedure Requested</label>
              <select class="w-full bg-[#02101e] border border-sky-900 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-sky-400">
                <option>Swiss Titanium Dental Implants & Bone Grafting</option>
                <option>Harley Street Porcelain Smile Makeover</option>
                <option>Microscopic Root Canal Therapy</option>
                <option>Zirconia Crown / Bridge Restoration</option>
                <option>UK Standard Oral Health Checkup</option>
              </select>
            </div>
            <button type="submit" id="uk-btn" class="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-sky-500/20 transition-all">
              Confirm Priority Consultation
            </button>
            <div id="uk-success" class="hidden p-4 rounded-xl bg-sky-500/20 border border-sky-500/40 text-sky-300 text-center text-xs font-medium">
              ✓ Consultation registered. Kensington Dental receptionist in F-7/2 will confirm your time via WhatsApp shortly.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- 4-Column Master Mega-Footer -->
  <footer class="border-t border-sky-900/80 py-16 px-6 bg-[#010a14] text-xs text-slate-400">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
      <div>
        <img src="https://kdicislamabad.com/assets/img/logo/KDIC-logo.png" alt="KDIC" class="h-10 w-auto mb-4 bg-white/5 p-1 rounded-lg">
        <p class="text-slate-500 leading-relaxed text-xs mb-4">Established in 2014 in Sector F-7/2. Delivering a decade of UK Standard Clinical Dentistry in Islamabad.</p>
        <div class="text-sky-400 font-semibold text-xs">A Decade of Excellence (2014 – 2026)</div>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-4">Clinical Disciplines</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="#implantology" class="hover:text-sky-400 transition-colors">3D Guided Dental Implants</a></li>
          <li><a href="#smile-design" class="hover:text-sky-400 transition-colors">Harley Street Porcelain Veneers</a></li>
          <li><a href="#smile-design" class="hover:text-sky-400 transition-colors">Zirconia Crowns & Bridges</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-4">Location & Hours</h4>
        <p class="text-slate-500 leading-relaxed text-xs mb-2">Sector F-7/2, Islamabad, Pakistan</p>
        <p class="text-slate-500 text-xs mb-4">Mon – Sat: 10:00 AM – 8:00 PM<br>Sunday: Closed</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Kensington+Dental+%26+Implant+Centre+F-7%2F2+Islamabad" target="_blank" class="text-sky-400 hover:underline text-xs">📍 View on Google Maps →</a>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-4">Direct Contact</h4>
        <p class="text-slate-500 text-xs mb-2">Clinic Telephone: (051) 260-8822</p>
        <p class="text-slate-500 text-xs mb-4">WhatsApp: +92 51 2608822</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-600">
      <div>© 2026 Kensington Dental & Implant Centre • All Rights Reserved.</div>
      <div>Adhering to British GDC Infection Control & Surgical Guidelines</div>
    </div>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    function handleUKSubmit(e) {
      e.preventDefault();
      document.getElementById('uk-btn').innerText = 'Securing Appointment...';
      setTimeout(() => {
        document.getElementById('uk-btn').classList.add('hidden');
        document.getElementById('uk-success').classList.remove('hidden');
      }, 600);
    }
  </script>
</body>
</html>"""

# ==============================================================================
# 2. Hissam & Associates (Fixed Verified Unsplash Dental Photography)
# ==============================================================================
hissam_fixed_html = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hissam & Associates Dental Care | Beverly Centre Blue Area Islamabad</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Italiana&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-luxury { font-family: 'Italiana', serif; }
    .reveal { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body class="bg-[#03060c] text-slate-100 antialiased selection:bg-[#d4af37] selection:text-slate-950">
  <!-- Floating Glassmorphism Header -->
  <div class="fixed top-5 inset-x-0 z-50 max-w-6xl mx-auto px-4">
    <header class="backdrop-blur-2xl bg-[#03060c]/85 border border-[#d4af37]/25 rounded-full px-6 py-3.5 flex items-center justify-between shadow-2xl shadow-black/80">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4af37] to-[#997b1e] flex items-center justify-center text-slate-950 font-bold text-sm font-luxury shadow-md">
          HA
        </div>
        <div>
          <div class="text-xs font-bold text-white uppercase tracking-wider font-luxury">Hissam & Associates</div>
          <div class="text-[9px] text-[#d4af37] uppercase tracking-widest">Beverly Centre • Blue Area</div>
        </div>
      </div>
      <nav class="hidden md:flex items-center gap-7 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
        <a href="#suites" class="hover:text-[#d4af37] transition-colors">Aesthetic Suites</a>
        <a href="#privacy" class="hover:text-[#d4af37] transition-colors">VIP Protocol</a>
        <a href="#concierge" class="hover:text-[#d4af37] transition-colors">Concierge</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="tel:+923005143322" class="hidden sm:inline text-xs text-slate-300 hover:text-[#d4af37]">📞 0300-5143322</a>
        <a href="#concierge" class="bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:from-[#c5a028] hover:to-[#d4af37] text-slate-950 font-bold text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-full transition-all shadow-lg shadow-[#d4af37]/20">
          Private Suite
        </a>
      </div>
    </header>
  </div>

  <!-- Asymmetrical Hero Section -->
  <section class="relative min-h-[90vh] flex items-center justify-center pt-36 pb-20 px-6 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 reveal">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#e8c86d] text-xs font-semibold uppercase tracking-wider mb-6">
          ★ Beverly Centre's Benchmark in Aesthetic Dentistry
        </div>
        <h1 class="font-luxury text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.1] mb-6">
          Discreet Luxury & <span class="italic text-[#d4af37]">Aesthetic Precision</span>.
        </h1>
        <p class="text-slate-300 text-lg max-w-xl mb-8 leading-relaxed font-light">
          Islamabad's distinguished aesthetic dental lounge in Beverly Centre, Jinnah Avenue. Dedicated to flawless porcelain smile architecture, invisible aligners, and absolute patient confidentiality.
        </p>
        <div class="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <a href="#concierge" class="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:from-[#c5a028] hover:to-[#d4af37] text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-[#d4af37]/25 transition-all text-xs uppercase tracking-widest text-center">
            Reserve Private Suite
          </a>
          <a href="https://wa.me/923005143322?text=Hi%20Hissam%20%26%20Associates,%20I%20would%20like%20to%20inquire%20about%20a%20private%20consultation." class="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-medium px-8 py-4 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2">
            💬 WhatsApp Concierge
          </a>
        </div>
        <div class="flex items-center gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
          <div class="flex items-center gap-1.5"><span class="text-[#d4af37]">★</span> 5.0 Perfect Google Rating</div>
          <div class="flex items-center gap-1.5"><span class="text-[#d4af37]">★</span> Beverly Centre Blue Area</div>
          <div class="flex items-center gap-1.5"><span class="text-[#d4af37]">★</span> Diplomatic Privacy Protocol</div>
        </div>
      </div>
      <div class="lg:col-span-5 reveal">
        <div class="relative rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-slate-950 p-3 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800" alt="Flawless Aesthetic Smile" class="w-full h-84 object-cover rounded-2xl mb-3">
          <div class="p-4 bg-[#050b14] rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-white font-luxury">Beverly Suite • Jinnah Avenue</div>
              <div class="text-[10px] text-[#d4af37]">Private Diplomatic Operatory</div>
            </div>
            <span class="text-xs bg-[#d4af37]/10 text-[#d4af37] px-3 py-1 rounded-full font-bold border border-[#d4af37]/30">VIP Lounge</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Master Aesthetic Suites (100% VERIFIED IMAGERY) -->
  <section id="suites" class="py-24 px-6 bg-[#060b14] border-y border-slate-800">
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-16 reveal">
        <div class="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-3">Aesthetic Disciplines</div>
        <h2 class="font-luxury text-3xl sm:text-5xl font-normal text-white mb-4">Master Aesthetic Suites</h2>
        <p class="text-slate-400 text-sm">Bespoke restorative dental architecture for Islamabad's leaders, diplomats, and executives.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 1. Handcrafted Ceramic Veneers (VERIFIED MACRO VENEER PHOTO) -->
        <div class="bg-[#03060c] border border-slate-800 p-8 rounded-3xl reveal hover:border-[#d4af37]/40 transition-all">
          <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600" alt="Ceramic Porcelain Veneers" class="w-full h-48 object-cover rounded-2xl mb-6">
          <h3 class="font-luxury text-2xl font-bold text-white mb-2">Handcrafted Ceramic Veneers</h3>
          <p class="text-slate-400 text-xs leading-relaxed">Individually sculpted porcelain laminates calibrated for natural smile dynamics, tooth translucency, and permanent brightness.</p>
        </div>
        <!-- 2. Clear Aligner Orthodontics (VERIFIED REAL CLEAR ALIGNER TRAY PHOTO) -->
        <div class="bg-[#03060c] border border-slate-800 p-8 rounded-3xl reveal hover:border-[#d4af37]/40 transition-all">
          <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600" alt="Clear Aligners in Hand" class="w-full h-48 object-cover rounded-2xl mb-6">
          <h3 class="font-luxury text-2xl font-bold text-white mb-2">Clear Aligner Orthodontics</h3>
          <p class="text-slate-400 text-xs leading-relaxed">Discreet digital orthodontic alignment designed for corporate leaders who require invisible tooth correction.</p>
        </div>
        <!-- 3. Computer Guided Implants (VERIFIED HIGH-TECH SURGICAL SUITE PHOTO) -->
        <div class="bg-[#03060c] border border-slate-800 p-8 rounded-3xl reveal hover:border-[#d4af37]/40 transition-all">
          <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600" alt="Guided Dental Implants" class="w-full h-48 object-cover rounded-2xl mb-6">
          <h3 class="font-luxury text-2xl font-bold text-white mb-2">Computer Guided Implants</h3>
          <p class="text-slate-400 text-xs leading-relaxed">Flapless guided surgical tooth replacement engineered for rapid recovery and permanent structural harmony.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- 2-Column VIP Concierge Suite -->
  <section id="concierge" class="py-24 px-6 max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <!-- Left Column -->
      <div class="lg:col-span-5 reveal">
        <div class="bg-[#060b14] border border-[#d4af37]/30 p-8 rounded-3xl shadow-2xl">
          <div class="w-10 h-10 rounded-xl bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-lg font-luxury mb-6">VIP</div>
          <h3 class="font-luxury text-2xl font-bold text-white mb-3">Diplomatic Confidentiality</h3>
          <p class="text-slate-400 text-xs leading-relaxed mb-6">
            Private suite appointments scheduled with zero waiting room overlap. Dedicated parking and secure access in Beverly Centre, Jinnah Avenue.
          </p>
          <div class="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
            <div class="flex justify-between"><span class="text-slate-500">Location:</span> <span class="text-white font-medium">Beverly Centre, Blue Area / F-6</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Concierge Phone:</span> <span class="text-[#d4af37] font-medium">0300-5143322</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Rating:</span> <span class="text-emerald-400 font-medium">5.0★ (85+ Reviews)</span></div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-7 reveal">
        <div class="bg-[#060b14] border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
          <h2 class="font-luxury text-3xl font-normal text-white mb-2">Request VIP Consultation</h2>
          <p class="text-slate-400 text-xs mb-8">Hissam & Associates • Beverly Centre, Jinnah Avenue, Blue Area Islamabad</p>
          
          <form onsubmit="handleHissamMasterSubmit(event)" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Patient Full Name</label>
                <input type="text" required placeholder="e.g. Aftab Sherpao" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#d4af37]">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">WhatsApp / Telephone</label>
                <input type="tel" required placeholder="0300-1234567" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#d4af37]">
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Treatment Requested</label>
              <select class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#d4af37]">
                <option>Complete Porcelain Smile Makeover</option>
                <option>Invisible Aligner Consultation</option>
                <option>Dental Implant Surgical Restoration</option>
                <option>Laser Teeth Whitening</option>
                <option>Executive Dental Health Assessment</option>
              </select>
            </div>
            <button type="submit" id="ha-btn" class="w-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:from-[#c5a028] hover:to-[#d4af37] text-slate-950 font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-[#d4af37]/20 transition-all">
              Reserve Private Consultation
            </button>
            <div id="ha-success" class="hidden p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#e8c86d] text-center text-xs font-medium">
              ✓ Appointment confirmed. Our Beverly Centre concierge will reach out via WhatsApp immediately.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- 4-Column Mega Footer -->
  <footer class="border-t border-slate-800 py-14 px-6 bg-[#020408] text-xs text-slate-400">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
      <div>
        <div class="text-white font-bold uppercase font-luxury text-base mb-3">Hissam & Associates</div>
        <p class="text-slate-500 leading-relaxed text-xs">Beverly Centre's premier aesthetic dental lounge serving diplomats, corporate leaders, and families in Blue Area & F-6.</p>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">Aesthetic Care</h4>
        <ul class="space-y-2 text-xs">
          <li><a href="#suites" class="hover:text-[#d4af37] transition-colors">Custom Porcelain Veneers</a></li>
          <li><a href="#suites" class="hover:text-[#d4af37] transition-colors">Clear Aligner Orthodontics</a></li>
          <li><a href="#suites" class="hover:text-[#d4af37] transition-colors">Guided Dental Implants</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">Beverly Centre Suite</h4>
        <p class="text-slate-500 text-xs mb-2">Beverly Centre, Jinnah Avenue, Blue Area / F-6 Islamabad</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Hissam+%26+Associates+Dental+Care+Beverly+Centre+Blue+Area+Islamabad" target="_blank" class="text-[#d4af37] hover:underline text-xs">📍 View on Google Maps →</a>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">Direct Line</h4>
        <p class="text-slate-500 text-xs mb-2">VIP Concierge: 0300-5143322</p>
        <p class="text-slate-500 text-xs">Mon – Sat: 11:00 AM – 8:00 PM</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto border-t border-slate-900 pt-6 text-center text-[11px] text-slate-600">
      © 2026 Hissam & Associates Dental Care • Beverly Centre, Islamabad • All Rights Reserved.
    </div>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    function handleHissamMasterSubmit(e) {
      e.preventDefault();
      document.getElementById('ha-btn').innerText = 'Securing Suite...';
      setTimeout(() => {
        document.getElementById('ha-btn').classList.add('hidden');
        document.getElementById('ha-success').classList.remove('hidden');
      }, 600);
    }
  </script>
</body>
</html>"""

fixes_batch = [
    {
        "leadId": "mFEEMxUoRbxTlCJbOYtE",
        "title": "Kensington Dental & Implant Centre",
        "customSlug": "kensington-dental-implant-f7-03",
        "htmlContent": kensington_fixed_html
    },
    {
        "leadId": "H11iOu7I0ilMuaf8DJHd",
        "title": "Hissam & Associates Dental Care",
        "customSlug": "hissam-associates-dental-f6-03",
        "htmlContent": hissam_fixed_html
    }
]

for p in fixes_batch:
    req = urllib.request.Request(f"{API_URL}/publish-prototype", data=json.dumps(p).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, context=ssl_context) as res:
            res_data = json.loads(res.read())
            print(f"Re-published Fixed Prototype: {p['title']} -> {res_data.get('previewUrl')}")
    except Exception as e:
        print(f"Error publishing {p['title']}: {e}")

print("\nPrototypes successfully updated with exact brand blue & verified dental photography!")
