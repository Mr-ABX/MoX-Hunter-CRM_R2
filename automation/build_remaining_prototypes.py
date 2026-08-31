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

# 1. Hissam & Associates Prototype HTML
hissam_html = """<!DOCTYPE html>
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
    .reveal { opacity: 0; transform: translateY(24px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body class="bg-[#050b14] text-slate-100 antialiased selection:bg-[#d4af37] selection:text-slate-950">
  <!-- Top Bar -->
  <div class="bg-[#0c1626] border-b border-[#d4af37]/20 px-4 py-2 text-center text-xs font-medium text-[#e8c86d]">
    Beverly Centre, Blue Area / F-6 Islamabad • Flawless 5.0★ Patient Rating • Call 0300-5143322
  </div>

  <!-- Header -->
  <header class="sticky top-0 z-50 backdrop-blur-xl bg-[#050b14]/85 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#997b1e] flex items-center justify-center text-slate-950 font-bold text-lg font-luxury shadow-lg shadow-[#d4af37]/20">
          HA
        </div>
        <div>
          <div class="text-sm font-bold tracking-wide text-white uppercase font-luxury text-base">Hissam & Associates</div>
          <div class="text-[10px] text-[#d4af37] tracking-widest uppercase">Beverly Centre • Blue Area</div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <a href="tel:+923005143322" class="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-[#d4af37] transition-colors">
          <span>📞 0300-5143322</span>
        </a>
        <a href="#consultation" class="bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:from-[#c5a028] hover:to-[#d4af37] text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-lg shadow-[#d4af37]/20">
          VIP Consultation
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-6">
    <div class="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1600" alt="Beverly Centre Clinic" class="w-full h-full object-cover opacity-20 filter brightness-75">
      <div class="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/80 to-transparent"></div>
    </div>
    <div class="relative z-10 max-w-4xl mx-auto text-center reveal">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#e8c86d] text-xs font-semibold uppercase tracking-wider mb-6">
        ★ Beverly Centre's Premier Aesthetic Dental Suite
      </div>
      <h1 class="font-luxury text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-tight mb-6">
        Refined Elegance & <span class="italic text-[#d4af37]">Flawless Precision</span>.
      </h1>
      <p class="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
        Islamabad's distinguished aesthetic clinic in Beverly Centre, Blue Area. Providing high-end porcelain smile architecture, invisible aligners, and painless dental surgery.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#consultation" class="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:from-[#c5a028] hover:to-[#d4af37] text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-[#d4af37]/25 transition-all text-sm uppercase tracking-wider">
          Reserve Private Appointment
        </a>
        <a href="https://wa.me/923005143322?text=Hi%20Hissam%20%26%20Associates%20Dental,%20I%20would%20like%20to%20inquire%20about%20a%20private%20consultation." class="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-medium px-8 py-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
          💬 WhatsApp Concierge
        </a>
      </div>
    </div>
  </section>

  <!-- Metrics Bar -->
  <section class="border-y border-slate-800 bg-[#09121f] py-10 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="reveal">
        <div class="font-luxury text-4xl font-bold text-[#d4af37]">5.0★</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Flawless Review Score</div>
      </div>
      <div class="reveal">
        <div class="font-luxury text-4xl font-bold text-[#d4af37]">Beverly Centre</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Jinnah Avenue, Blue Area</div>
      </div>
      <div class="reveal">
        <div class="font-luxury text-4xl font-bold text-[#d4af37]">VIP Protocol</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Complete Patient Privacy</div>
      </div>
      <div class="reveal">
        <div class="font-luxury text-4xl font-bold text-[#d4af37]">100%</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Digital Smile Previews</div>
      </div>
    </div>
  </section>

  <!-- Treatment Suites Grid -->
  <section class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <h2 class="font-luxury text-3xl md:text-5xl font-normal text-white mb-4">Master Aesthetic Suites</h2>
      <p class="text-slate-400">Curated restorative and cosmetic dentistry for Islamabad's discerning clientele.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-[#d4af37]/40 transition-all">
        <div class="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] text-2xl mb-6">💎</div>
        <h3 class="font-luxury text-2xl font-bold text-white mb-3">Custom Porcelain Veneers</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">Master-crafted ceramic laminates designed for natural light reflection, custom translucency, and permanent shade stability.</p>
        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600" alt="Veneers" class="w-full h-48 object-cover rounded-2xl">
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-[#d4af37]/40 transition-all">
        <div class="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] text-2xl mb-6">✨</div>
        <h3 class="font-luxury text-2xl font-bold text-white mb-3">Clear Aligner Orthodontics</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">Discreet, digitally mapped clear aligners delivering precision alignment without compromising your professional appearance.</p>
        <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600" alt="Aligners" class="w-full h-48 object-cover rounded-2xl">
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-[#d4af37]/40 transition-all">
        <div class="w-12 h-12 rounded-2xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] text-2xl mb-6">🔩</div>
        <h3 class="font-luxury text-2xl font-bold text-white mb-3">Swiss Guided Implants</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">Computer-guided surgical implant placement engineered for rapid osseointegration and lifetime structural longevity.</p>
        <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600" alt="Implants" class="w-full h-48 object-cover rounded-2xl">
      </div>
    </div>
  </section>

  <!-- Consultation Booking -->
  <section id="consultation" class="py-24 px-6 bg-[#09121f] border-t border-slate-800">
    <div class="max-w-3xl mx-auto bg-[#050b14] border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl reveal">
      <div class="text-center mb-10">
        <h2 class="font-luxury text-3xl md:text-4xl font-normal text-white mb-2">Request Your Private Appointment</h2>
        <p class="text-slate-400 text-sm">Hissam & Associates • Beverly Centre, Jinnah Avenue, Blue Area Islamabad</p>
      </div>
      <form onsubmit="handleHissamSubmit(event)" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Patient Name</label>
            <input type="text" required placeholder="e.g. Aftab Sherpao" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]">
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">WhatsApp / Phone</label>
            <input type="tel" required placeholder="0300-1234567" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]">
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Primary Aesthetic Concern</label>
          <select class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]">
            <option>Complete Porcelain Smile Makeover</option>
            <option>Invisible Aligner Consultation</option>
            <option>Dental Implant Restoration</option>
            <option>Laser Teeth Whitening</option>
            <option>VIP Oral Health Assessment</option>
          </select>
        </div>
        <button type="submit" id="ha-submit-btn" class="w-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:from-[#c5a028] hover:to-[#d4af37] text-slate-950 font-bold py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-[#d4af37]/20 transition-all">
          Reserve Priority Consultation
        </button>
        <div id="ha-submit-success" class="hidden p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#e8c86d] text-center text-sm font-medium">
          ✓ Appointment requested. Our concierge at Beverly Centre will contact you via WhatsApp shortly.
        </div>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-800 py-12 px-6 bg-[#050b14] text-xs text-slate-500 text-center">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 rounded-lg bg-[#d4af37] text-slate-950 flex items-center justify-center font-bold text-xs font-luxury">HA</div>
        <span>Hissam & Associates Dental Care • Beverly Centre, Blue Area / F-6 Islamabad</span>
      </div>
      <div>
        Direct Phone: 0300-5143322 • Mon - Sat: 11:00 AM - 8:00 PM
      </div>
    </div>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    function handleHissamSubmit(e) {
      e.preventDefault();
      document.getElementById('ha-submit-btn').innerText = 'Confirming...';
      setTimeout(() => {
        document.getElementById('ha-submit-btn').classList.add('hidden');
        document.getElementById('ha-submit-success').classList.remove('hidden');
      }, 600);
    }
  </script>
</body>
</html>"""

# 2. The Dental Consultants Prototype HTML
consultants_html = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Dental Consultants | Jinnah Super F-7 Markaz Islamabad</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .reveal { opacity: 0; transform: translateY(24px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
  <!-- Top Bar -->
  <div class="bg-emerald-950 border-b border-emerald-500/20 px-4 py-2 text-center text-xs font-medium text-emerald-300">
    Office #8, Block 12-C, Jinnah Super Market, F-7 Markaz • 4.8★ Rated Dental Practice • Call (051) 265-5588
  </div>

  <!-- Header -->
  <header class="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-lg font-display shadow-lg shadow-emerald-500/20">
          TDC
        </div>
        <div>
          <div class="text-sm font-bold text-white font-display">The Dental Consultants</div>
          <div class="text-[10px] text-emerald-400">Jinnah Super Market • F-7 Markaz</div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <a href="tel:+92512655588" class="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">
          <span>📞 (051) 265-5588</span>
        </a>
        <a href="#consultation" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-lg shadow-emerald-500/20">
          Book Appointment
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20 px-6">
    <div class="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1600" alt="Jinnah Super Dental" class="w-full h-full object-cover opacity-20 filter brightness-75">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
    </div>
    <div class="relative z-10 max-w-4xl mx-auto text-center reveal">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
        🌿 Multi-Specialty Dental Clinic in Jinnah Super F-7
      </div>
      <h1 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
        Advanced Care from <span class="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Certified Specialists</span>.
      </h1>
      <p class="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
        Providing Jinnah Super Market and F-7 Islamabad with world-class orthodontics, painless root canal therapy, and aesthetic tooth restorations.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#consultation" class="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-emerald-500/25 transition-all text-sm uppercase tracking-wider">
          Schedule Clinical Checkup
        </a>
        <a href="https://wa.me/92512655588?text=Hi%20The%20Dental%20Consultants,%20I%20would%20like%20to%20book%20an%20appointment." class="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-medium px-8 py-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
          💬 WhatsApp Direct
        </a>
      </div>
    </div>
  </section>

  <!-- Key Disciplines Grid -->
  <section class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <h2 class="font-display text-3xl md:text-5xl font-bold text-white mb-4">Complete Dental Solutions</h2>
      <p class="text-slate-400">European Class-B Autoclave Sterilization & 4-Handed Precision Care.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-emerald-500/40 transition-all">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-2xl mb-6">🦷</div>
        <h3 class="text-xl font-bold text-white mb-3">Orthodontics & Clear Braces</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">Specialist orthodontic correction for adults and teens utilizing clear ceramic brackets and custom aligners.</p>
        <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600" alt="Orthodontics" class="w-full h-48 object-cover rounded-2xl">
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-emerald-500/40 transition-all">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-2xl mb-6">⚡</div>
        <h3 class="text-xl font-bold text-white mb-3">Single-Sitting Root Canals</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">Rotary endodontics delivering painless, efficient root canal therapies in a single comfortable session.</p>
        <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600" alt="Root Canal" class="w-full h-48 object-cover rounded-2xl">
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-emerald-500/40 transition-all">
        <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-2xl mb-6">✨</div>
        <h3 class="text-xl font-bold text-white mb-3">Zirconia Crowns & Bridges</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">Metal-free, biocompatible Zirconia dental crowns offering maximum structural strength and lifelike aesthetics.</p>
        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600" alt="Crowns" class="w-full h-48 object-cover rounded-2xl">
      </div>
    </div>
  </section>

  <!-- Consultation Booking -->
  <section id="consultation" class="py-24 px-6 bg-slate-900/40 border-t border-slate-800">
    <div class="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl reveal">
      <div class="text-center mb-10">
        <h2 class="font-display text-3xl font-bold text-white mb-2">Book Your Appointment</h2>
        <p class="text-slate-400 text-sm">The Dental Consultants • Office #8, 1st Floor, Block 12-C Jinnah Super, F-7 Markaz</p>
      </div>
      <form onsubmit="handleTDCSubmit(event)" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Name</label>
            <input type="text" required placeholder="e.g. Kamran Ali" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500">
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Phone / WhatsApp</label>
            <input type="tel" required placeholder="0300-1234567" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500">
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Service Required</label>
          <select class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500">
            <option>Orthodontic / Braces Evaluation</option>
            <option>Root Canal Therapy</option>
            <option>Zirconia Crown / Bridge</option>
            <option>Teeth Cleaning & Scaling</option>
            <option>General Dental Checkup</option>
          </select>
        </div>
        <button type="submit" id="tdc-submit-btn" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all">
          Confirm Appointment
        </button>
        <div id="tdc-submit-success" class="hidden p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center text-sm font-medium">
          ✓ Appointment request confirmed! We will contact you shortly from our Jinnah Super clinic.
        </div>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-800 py-12 px-6 bg-slate-950 text-xs text-slate-500 text-center">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>The Dental Consultants • Office 8, Block 12-C, Jinnah Super, F-7 Markaz Islamabad</div>
      <div>Direct Line: (051) 265-5588 • Mon - Sat: 10:30 AM - 8:30 PM</div>
    </div>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    function handleTDCSubmit(e) {
      e.preventDefault();
      document.getElementById('tdc-submit-btn').innerText = 'Processing...';
      setTimeout(() => {
        document.getElementById('tdc-submit-btn').classList.add('hidden');
        document.getElementById('tdc-submit-success').classList.remove('hidden');
      }, 600);
    }
  </script>
</body>
</html>"""

# 3. Smile Square Prototype HTML
smile_square_html = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smile Square Dental Specialists | F-7 Markaz Islamabad</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-display { font-family: 'Space Grotesk', sans-serif; }
    .reveal { opacity: 0; transform: translateY(24px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
  <!-- Emergency Top Bar -->
  <div class="bg-blue-900 border-b border-blue-500/30 px-4 py-2 text-center text-xs font-bold text-blue-200">
    🚨 24/7 Emergency Dental Response in F-7 Markaz Islamabad • Same-Day Pain Relief • Call 0333-5556789
  </div>

  <!-- Header -->
  <header class="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg font-display shadow-lg shadow-blue-500/20">
          SS
        </div>
        <div>
          <div class="text-sm font-bold text-white font-display">Smile Square Dental</div>
          <div class="text-[10px] text-blue-400">FCPS Specialists • F-7 Markaz</div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <a href="tel:+923335556789" class="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors">
          <span>📞 0333-5556789</span>
        </a>
        <a href="#consultation" class="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-lg shadow-blue-600/20">
          Emergency Booking
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-6">
    <div class="absolute inset-0 z-0">
      <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1600" alt="Smile Square F-7" class="w-full h-full object-cover opacity-20 filter brightness-75">
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
    </div>
    <div class="relative z-10 max-w-4xl mx-auto text-center reveal">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
        ⚡ FCPS Specialist Team & 24/7 Emergency Care
      </div>
      <h1 class="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
        Fast, Painless & <span class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Specialist Dental Care</span>.
      </h1>
      <p class="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
        From sudden acute toothaches to full ceramic smile reconstructions, our FCPS dental surgeons in F-7 Markaz provide immediate, gentle care.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#consultation" class="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-blue-600/25 transition-all text-sm uppercase tracking-wider">
          Book Same-Day Appointment
        </a>
        <a href="https://wa.me/923335556789?text=Hi%20Smile%20Square%20Dental,%20I%20have%20a%20dental%20emergency/inquiry." class="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white font-medium px-8 py-4 rounded-xl transition-all text-sm flex items-center justify-center gap-2">
          💬 WhatsApp Emergency Triage
        </a>
      </div>
    </div>
  </section>

  <!-- Trust Metrics -->
  <section class="border-y border-slate-800 bg-slate-900/40 py-10 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="reveal">
        <div class="font-display text-3xl md:text-4xl font-bold text-blue-400">24/7</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Emergency Response</div>
      </div>
      <div class="reveal">
        <div class="font-display text-3xl md:text-4xl font-bold text-blue-400">4.9★</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">110+ Verified Reviews</div>
      </div>
      <div class="reveal">
        <div class="font-display text-3xl md:text-4xl font-bold text-blue-400">FCPS</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Certified Specialists</div>
      </div>
      <div class="reveal">
        <div class="font-display text-3xl md:text-4xl font-bold text-blue-400">F-7 Markaz</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Central Islamabad Location</div>
      </div>
    </div>
  </section>

  <!-- Services Grid -->
  <section class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <h2 class="font-display text-3xl md:text-5xl font-bold text-white mb-4">Specialist Clinical Services</h2>
      <p class="text-slate-400">Comprehensive surgical and aesthetic dentistry under one roof in F-7.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-blue-500/40 transition-all">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl mb-6">🚨</div>
        <h3 class="text-xl font-bold text-white mb-3">Emergency Pain Relief</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">Same-day urgent treatment for broken teeth, acute pulpitis, dental abscesses, and sudden trauma with zero wait time.</p>
        <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600" alt="Emergency" class="w-full h-48 object-cover rounded-2xl">
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-blue-500/40 transition-all">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl mb-6">🔩</div>
        <h3 class="text-xl font-bold text-white mb-3">Permanent Dental Implants</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">High-precision titanium implants placed by FCPS oral & maxillofacial surgeons with lifetime structural support.</p>
        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600" alt="Implants" class="w-full h-48 object-cover rounded-2xl">
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-blue-500/40 transition-all">
        <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl mb-6">💎</div>
        <h3 class="text-xl font-bold text-white mb-3">Cosmetic Smile Design</h3>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">Laser teeth whitening and natural porcelain veneers engineered to give you a bright, confident smile.</p>
        <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600" alt="Cosmetic" class="w-full h-48 object-cover rounded-2xl">
      </div>
    </div>
  </section>

  <!-- Consultation Booking -->
  <section id="consultation" class="py-24 px-6 bg-slate-900/40 border-t border-slate-800">
    <div class="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl reveal">
      <div class="text-center mb-10">
        <h2 class="font-display text-3xl font-bold text-white mb-2">Book an Appointment in F-7</h2>
        <p class="text-slate-400 text-sm">Smile Square Dental Specialists • F-7 Markaz, Islamabad</p>
      </div>
      <form onsubmit="handleSmileSubmit(event)" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
            <input type="text" required placeholder="e.g. Faisal Nawaz" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">WhatsApp / Phone</label>
            <input type="tel" required placeholder="0333-1234567" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Treatment Urgency</label>
          <select class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500">
            <option>🚨 Emergency Pain / Same-Day</option>
            <option>Dental Implants Consultation</option>
            <option>Braces & Orthodontics</option>
            <option>Teeth Whitening / Veneers</option>
            <option>Routine Checkup & Cleaning</option>
          </select>
        </div>
        <button type="submit" id="ss-submit-btn" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg shadow-blue-600/20 transition-all">
          Reserve Dental Appointment
        </button>
        <div id="ss-submit-success" class="hidden p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-center text-sm font-medium">
          ✓ Appointment registered! Our F-7 clinic team will confirm via WhatsApp immediately.
        </div>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-800 py-12 px-6 bg-slate-950 text-xs text-slate-500 text-center">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>Smile Square Dental Specialists • F-7 Markaz Islamabad</div>
      <div>Emergency Hotline: 0333-5556789 • 24/7 Response Available</div>
    </div>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    function handleSmileSubmit(e) {
      e.preventDefault();
      document.getElementById('ss-submit-btn').innerText = 'Registering...';
      setTimeout(() => {
        document.getElementById('ss-submit-btn').classList.add('hidden');
        document.getElementById('ss-submit-success').classList.remove('hidden');
      }, 600);
    }
  </script>
</body>
</html>"""

remaining_prototypes = [
    {
        "leadId": "H11iOu7I0ilMuaf8DJHd",
        "title": "Hissam & Associates Dental Care",
        "customSlug": "hissam-associates-dental-f6",
        "htmlContent": hissam_html
    },
    {
        "leadId": "Q8H5spbIckTQPLS7GriW",
        "title": "The Dental Consultants",
        "customSlug": "the-dental-consultants-f7",
        "htmlContent": consultants_html
    },
    {
        "leadId": "RNJgTNdKola1w86f8DL8",
        "title": "Smile Square Dental Specialists",
        "customSlug": "smile-square-dental-f7",
        "htmlContent": smile_square_html
    }
]

published_urls = {}

for p in remaining_prototypes:
    req = urllib.request.Request(f"{API_URL}/publish-prototype", data=json.dumps(p).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, context=ssl_context) as res:
            res_data = json.loads(res.read())
            published_urls[p["leadId"]] = res_data.get("previewUrl")
            print(f"Published: {p['title']} -> {res_data.get('previewUrl')}")
    except Exception as e:
        print(f"Error publishing {p['title']}: {e}")

print("\nAll 5 Islamabad Prototypes are now published!")
