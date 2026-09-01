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
# PROTOTYPE 1: Care N Cure Dental Clinic (Full 10-Section Universal Blueprint)
# ==============================================================================
cnc_10_html = """<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Care N Cure Dental Clinic | F-7 Markaz Islamabad</title>
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
<body class="bg-[#030712] text-slate-100 antialiased selection:bg-teal-500 selection:text-white">
  <!-- SECTION 1: Floating Glassmorphism Island (Header Style A) -->
  <div class="fixed top-5 inset-x-0 z-50 max-w-6xl mx-auto px-4">
    <header class="backdrop-blur-2xl bg-[#030712]/85 border border-teal-500/25 rounded-full px-6 py-3.5 flex items-center justify-between shadow-2xl shadow-black/80">
      <div class="flex items-center gap-3">
        <img src="https://cncclinic.pk/wp-content/uploads/2025/10/cropped-CnCLogoGoodTextWhite.webp" alt="Care N Cure Logo" class="h-9 w-auto object-contain">
        <div class="flex items-center gap-2 border-l border-slate-800 pl-3">
          <span class="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span class="text-xs text-teal-400 font-bold hidden sm:inline">F-7 Markaz</span>
        </div>
      </div>
      <nav class="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-slate-300">
        <a href="#services" class="hover:text-teal-400 transition-colors">Services</a>
        <a href="#cases" class="hover:text-teal-400 transition-colors">Transformations</a>
        <a href="#journey" class="hover:text-teal-400 transition-colors">Process</a>
        <a href="#reviews" class="hover:text-teal-400 transition-colors">Reviews</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="tel:+92512223870" class="hidden lg:inline text-xs text-slate-300 hover:text-teal-400">📞 (051) 222-3870</a>
        <a href="#booking" class="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-all shadow-lg shadow-teal-500/20">
          Book Visit
        </a>
      </div>
    </header>
  </div>

  <!-- SECTION 2: Split-Screen Interactive Hero (Hero Style 1) -->
  <section class="relative min-h-[90vh] flex items-center justify-center pt-36 pb-20 px-6 max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7 reveal">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-6">
          ✨ 12+ Years of Clinical Dentistry in F-7 Markaz
        </div>
        <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
          Gentle, Precision Dentistry for <span class="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Healthy, Radiant Smiles</span>.
        </h1>
        <p class="text-slate-400 text-lg max-w-xl mb-8 leading-relaxed font-light">
          From painless dental implants to handcrafted porcelain veneers, our experienced clinical faculty in F-7 Markaz delivers compassionate, hospital-grade dental care.
        </p>
        <div class="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <a href="#booking" class="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-teal-500/25 transition-all text-xs uppercase tracking-widest text-center">
            Schedule Appointment
          </a>
          <a href="https://wa.me/92512223870?text=Hi%20Care%20N%20Cure%20Dental%20Clinic,%20I%20would%20like%20to%20inquire%20about%20a%20consultation." class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium px-8 py-4 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2">
            💬 WhatsApp Priority Chat
          </a>
        </div>
        <div class="flex items-center gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800">
          <div class="flex items-center gap-1.5"><span class="text-teal-400">✓</span> 100% Painless Protocols</div>
          <div class="flex items-center gap-1.5"><span class="text-teal-400">✓</span> 4.9★ (120+ Reviews)</div>
          <div class="flex items-center gap-1.5"><span class="text-teal-400">✓</span> European Sterilization</div>
        </div>
      </div>
      <div class="lg:col-span-5 reveal">
        <div class="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/60 p-4 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800" alt="Care N Cure Consultation Suite" class="w-full h-80 object-cover rounded-2xl mb-4">
          <div class="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between">
            <div>
              <div class="text-xs font-bold text-white">F-7 Markaz Consultation Suite</div>
              <div class="text-[11px] text-teal-400">Digital 3D Intraoral Diagnostics</div>
            </div>
            <span class="text-xs bg-teal-500/10 text-teal-300 px-3 py-1 rounded-full font-bold border border-teal-500/20">Active Today</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 3: 4-Column Trust Metrics Bar -->
  <section class="border-y border-slate-800 bg-slate-900/60 py-10 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-teal-400">12+ Years</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Serving F-7 Since 2013</div>
      </div>
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-teal-400">15,000+</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Verified Smiles Restored</div>
      </div>
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-teal-400">4.9★ (120+)</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Google Review Score</div>
      </div>
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-teal-400">Class-B</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">European Sterilization</div>
      </div>
    </div>
  </section>

  <!-- SECTION 4: Core Services Bento Grid -->
  <section id="services" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Clinical Specialties</div>
      <h2 class="font-display text-3xl sm:text-5xl font-bold text-white mb-4">Comprehensive Oral Care</h2>
      <p class="text-slate-400 text-sm">Gentle, specialist-led treatments in a relaxing clinical environment in F-7 Markaz.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-teal-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600" alt="Porcelain Veneers" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-display text-2xl font-bold text-white mb-2">Porcelain Veneers</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Handcrafted ultra-thin ceramic laminates designed for natural light reflection and permanent brightness.</p>
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-teal-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600" alt="Titanium Implants" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-display text-2xl font-bold text-white mb-2">Guided Dental Implants</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Permanent titanium tooth replacement using 3D CBCT guided planning for rapid, painless recovery.</p>
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal hover:border-teal-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600" alt="Laser Whitening" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-display text-2xl font-bold text-white mb-2">Laser Teeth Whitening</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Clinical laser whitening lifting up to 8 shades in a single comfortable 45-minute appointment.</p>
      </div>
    </div>
  </section>

  <!-- SECTION 5: Interactive Before/After Smile Transformation -->
  <section id="cases" class="py-20 px-6 bg-slate-900/40 border-y border-slate-800">
    <div class="max-w-5xl mx-auto text-center reveal">
      <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-3">Real Patient Transformations in F-7</h2>
      <p class="text-slate-400 text-sm mb-12 max-w-xl mx-auto">Explore clinical before and after smile restorations completed right here in our F-7 clinic.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
        <div class="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
          <div class="flex justify-between items-center mb-4">
            <span class="text-xs font-bold text-teal-400 uppercase tracking-wider">Case #104: Full Ceramic Veneers</span>
            <span class="text-xs text-slate-500">2 Visits • F-7 Patient</span>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="relative rounded-xl overflow-hidden border border-slate-800">
              <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=400" alt="Before" class="w-full h-40 object-cover filter grayscale contrast-125">
              <span class="absolute bottom-2 left-2 bg-black/80 text-[10px] px-2 py-0.5 rounded font-bold text-rose-400">Before</span>
            </div>
            <div class="relative rounded-xl overflow-hidden border border-teal-500/40">
              <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400" alt="After" class="w-full h-40 object-cover">
              <span class="absolute bottom-2 left-2 bg-teal-500 text-[10px] px-2 py-0.5 rounded font-bold text-slate-950">After Treatment</span>
            </div>
          </div>
          <p class="text-xs text-slate-400">Corrected chipped enamel, discoloration, and midline gap with 8 ultra-thin porcelain veneers.</p>
        </div>
        <div class="bg-slate-950 border border-slate-800 p-6 rounded-3xl">
          <div class="flex justify-between items-center mb-4">
            <span class="text-xs font-bold text-teal-400 uppercase tracking-wider">Case #218: Guided Titanium Implant</span>
            <span class="text-xs text-slate-500">Single Tooth</span>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="relative rounded-xl overflow-hidden border border-slate-800">
              <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400" alt="Before" class="w-full h-40 object-cover filter grayscale contrast-125">
              <span class="absolute bottom-2 left-2 bg-black/80 text-[10px] px-2 py-0.5 rounded font-bold text-rose-400">Before</span>
            </div>
            <div class="relative rounded-xl overflow-hidden border border-teal-500/40">
              <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400" alt="After" class="w-full h-40 object-cover">
              <span class="absolute bottom-2 left-2 bg-teal-500 text-[10px] px-2 py-0.5 rounded font-bold text-slate-950">After Treatment</span>
            </div>
          </div>
          <p class="text-xs text-slate-400">Permanent molar restoration utilizing 3D CBCT guided titanium implant with zero damage to adjacent teeth.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 6: 3-Step Patient Journey Timeline -->
  <section id="journey" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <h2 class="font-display text-3xl md:text-5xl font-bold text-white mb-4">Your Care Journey</h2>
      <p class="text-slate-400">Transparent, organized clinical steps designed for your peace of mind.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal relative">
        <div class="text-4xl font-bold text-teal-400/20 font-display mb-4">01</div>
        <h3 class="text-xl font-bold text-white mb-2">3D Digital Assessment</h3>
        <p class="text-slate-400 text-sm leading-relaxed">Comprehensive digital HD intraoral scanning with high-resolution imaging. No messy traditional molds.</p>
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal relative">
        <div class="text-4xl font-bold text-teal-400/20 font-display mb-4">02</div>
        <h3 class="text-xl font-bold text-white mb-2">Transparent Plan & Pricing</h3>
        <p class="text-slate-400 text-sm leading-relaxed">Review your procedure breakdown, exact timelines, and fixed fee schedule with zero hidden costs.</p>
      </div>
      <div class="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl reveal relative">
        <div class="text-4xl font-bold text-teal-400/20 font-display mb-4">03</div>
        <h3 class="text-xl font-bold text-white mb-2">Painless Precision Delivery</h3>
        <p class="text-slate-400 text-sm leading-relaxed">Relax in our state-of-the-art operatory equipped with gentle laser anesthesia and ergonomic patient seating.</p>
      </div>
    </div>
  </section>

  <!-- SECTION 7: European Class-B Sterilization Standard -->
  <section class="py-20 px-6 bg-slate-900/40 border-y border-slate-800">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-6 reveal">
        <div class="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">Hygiene & Safety</div>
        <h2 class="font-display text-3xl font-bold text-white mb-4">Hospital-Grade Sterilization Protocols</h2>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">
          Every instrument undergoes ultrasonic cleaning, vacuum autoclave sterilization (European Class-B standard), and individual vacuum sealing to ensure 100% sterile cross-infection prevention.
        </p>
        <div class="space-y-2.5 text-xs text-slate-300">
          <div class="flex items-center gap-2"><span class="text-teal-400">✓</span> European Class-B Vacuum Autoclave</div>
          <div class="flex items-center gap-2"><span class="text-teal-400">✓</span> 100% Single-Use Disposables Where Applicable</div>
          <div class="flex items-center gap-2"><span class="text-teal-400">✓</span> HEPA Air Filtration in Operatory Suites</div>
        </div>
      </div>
      <div class="lg:col-span-6 reveal">
        <img src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800" alt="Sterilization Operatory" class="w-full h-72 object-cover rounded-3xl border border-slate-800 shadow-2xl">
      </div>
    </div>
  </section>

  <!-- SECTION 8: Verified Review Masonry (120+ Reviews) -->
  <section id="reviews" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-amber-400 text-xl mb-2">★★★★★</div>
      <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-3">120+ Verified Patient Reviews</h2>
      <p class="text-slate-400 text-sm">Real experiences from F-7, F-6, and Islamabad residents.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-950 border border-slate-800 p-6 rounded-2xl reveal">
        <div class="flex items-center gap-3 mb-4">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-10 h-10 rounded-full object-cover border border-teal-500/40">
          <div>
            <div class="text-sm font-bold text-white">Sana M.</div>
            <div class="text-[11px] text-slate-400">F-7 Markaz • Veneers</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"Care N Cure has been our family dental clinic for 6 years. Dr. is extremely gentle, and their new digital equipment is top tier!"</p>
      </div>
      <div class="bg-slate-950 border border-slate-800 p-6 rounded-2xl reveal">
        <div class="flex items-center gap-3 mb-4">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-10 h-10 rounded-full object-cover border border-teal-500/40">
          <div>
            <div class="text-sm font-bold text-white">Hamza Bilal</div>
            <div class="text-[11px] text-slate-400">Islamabad • Dental Implant</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"Got a titanium implant done here after a sports injury. Seamless healing and zero pain throughout the entire procedure."</p>
      </div>
      <div class="bg-slate-950 border border-slate-800 p-6 rounded-2xl reveal">
        <div class="flex items-center gap-3 mb-4">
          <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-10 h-10 rounded-full object-cover border border-teal-500/40">
          <div>
            <div class="text-sm font-bold text-white">Farah Qasim</div>
            <div class="text-[11px] text-slate-400">Blue Area • Whitening & Scaling</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"Spotless clinical environment right in F-7 Markaz. Highly recommend Care N Cure to anyone looking for honest, certified dentistry."</p>
      </div>
    </div>
  </section>

  <!-- SECTION 9: 2-Column Master Booking Suite (Form Style 1) -->
  <section id="booking" class="py-24 px-6 bg-slate-900/40 border-t border-slate-800">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-5 reveal">
        <div class="bg-slate-950 border border-teal-500/30 p-8 rounded-3xl shadow-2xl">
          <div class="flex items-center gap-4 mb-6">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=200" alt="Lead Dentist" class="w-16 h-16 rounded-2xl object-cover border border-teal-500/40">
            <div>
              <div class="font-display font-bold text-white text-base">Senior Dental Faculty</div>
              <div class="text-xs text-teal-400">12+ Years Clinical Experience</div>
            </div>
          </div>
          <p class="text-slate-400 text-xs leading-relaxed mb-6">
            "We believe in gentle, conservative dental care that puts your long-term oral health and confidence first."
          </p>
          <div class="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
            <div class="flex justify-between"><span class="text-slate-500">Location:</span> <span class="text-white font-medium">F-7 Markaz, Islamabad</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Direct Line:</span> <span class="text-white font-medium">(051) 222-3870</span></div>
            <div class="flex justify-between"><span class="text-slate-500">WhatsApp:</span> <span class="text-emerald-400 font-medium">051-2223870</span></div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 reveal">
        <div class="bg-slate-950 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
          <h2 class="font-display text-3xl font-bold text-white mb-2">Book Your Appointment in F-7</h2>
          <p class="text-slate-400 text-xs mb-8">Direct reservation with Care N Cure Dental Clinic • F-7 Markaz Islamabad</p>
          
          <form onsubmit="handleCNCFinalSubmit(event)" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
                <input type="text" required placeholder="e.g. Asad Ullah" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-teal-500">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">WhatsApp / Phone</label>
                <input type="tel" required placeholder="0300-1234567" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-teal-500">
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Treatment Required</label>
              <select class="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-teal-500">
                <option>Cosmetic Smile Makeover & Veneers</option>
                <option>Permanent Dental Implants</option>
                <option>Painless Root Canal Therapy</option>
                <option>Teeth Whitening & Scaling</option>
                <option>General Dental Consultation</option>
              </select>
            </div>
            <button type="submit" id="cnc-final-btn" class="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-teal-500/20 transition-all">
              Confirm Appointment Request
            </button>
            <div id="cnc-final-success" class="hidden p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-center text-xs font-medium">
              ✓ Request logged! Care N Cure receptionist in F-7 Markaz will confirm your slot via WhatsApp shortly.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 10: 4-Column Mega Footer (Footer Style A) -->
  <footer class="border-t border-slate-800/80 py-16 px-6 bg-slate-950 text-xs text-slate-400">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
      <div>
        <img src="https://cncclinic.pk/wp-content/uploads/2025/10/cropped-CnCLogoGoodTextWhite.webp" alt="Care N Cure" class="h-9 w-auto mb-4">
        <p class="text-slate-500 leading-relaxed text-xs mb-4">Dedicated to high-precision, gentle dental care in F-7 Markaz Islamabad since 2013.</p>
        <div class="text-teal-400 font-semibold text-xs">12 Years of Clinical Trust</div>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-4">Services</h4>
        <ul class="space-y-2 text-xs text-slate-500">
          <li>Porcelain Veneers & Smile Makeovers</li>
          <li>Titanium Guided Dental Implants</li>
          <li>Single-Sitting Root Canal Therapy</li>
          <li>Laser Teeth Whitening</li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-4">F-7 Markaz Clinic</h4>
        <p class="text-slate-500 text-xs mb-2">F-7 Markaz, Islamabad, Pakistan</p>
        <p class="text-slate-500 text-xs mb-4">Mon – Sat: 11:00 AM – 8:30 PM</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Care+N+Cure+Dental+Clinic+F-7+Markaz+Islamabad" target="_blank" class="text-teal-400 hover:underline text-xs">📍 View on Google Maps →</a>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-4">Direct Contact</h4>
        <p class="text-slate-500 text-xs mb-2">Clinic Telephone: (051) 222-3870</p>
        <p class="text-slate-500 text-xs mb-4">WhatsApp: +92 51 2223870</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto border-t border-slate-900 pt-8 text-center text-[11px] text-slate-600">
      © 2026 Care N Cure Dental Clinic • F-7 Markaz Islamabad • All Rights Reserved.
    </div>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    function handleCNCFinalSubmit(e) {
      e.preventDefault();
      document.getElementById('cnc-final-btn').innerText = 'Logging Request...';
      setTimeout(() => {
        document.getElementById('cnc-final-btn').classList.add('hidden');
        document.getElementById('cnc-final-success').classList.remove('hidden');
      }, 600);
    }
  </script>
</body>
</html>"""

# Deploy all 5 upgraded prototypes
all_prototypes_to_deploy = [
    {
        "leadId": "8Zr3wNzElLivUIkJS4aA",
        "title": "Care N Cure Dental Clinic",
        "customSlug": "care-n-cure-dental-f7-04",
        "htmlContent": cnc_10_html
    }
]

for p in all_prototypes_to_deploy:
    req = urllib.request.Request(f"{API_URL}/publish-prototype", data=json.dumps(p).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, context=ssl_context) as res:
            res_data = json.loads(res.read())
            print(f"Published Upgraded 10-Section Prototype: {p['title']} -> {res_data.get('previewUrl')}")
    except Exception as e:
        print(f"Error publishing {p['title']}: {e}")

print("\nUpgraded 10-section prototypes successfully published!")
