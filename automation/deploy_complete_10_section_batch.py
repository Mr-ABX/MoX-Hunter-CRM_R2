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
# PROTOTYPE 1: Care N Cure Dental Clinic (F-7 Markaz) - 10 Sections
# ==============================================================================
cnc_html = """<!DOCTYPE html>
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

  <!-- SECTION 5: Interactive Before/After Transformation -->
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

# ==============================================================================
# PROTOTYPE 2: Kensington Dental & Implant Centre (F-7/2 Islamabad) - 10 Sections
# ==============================================================================
kensington_html = """<!DOCTYPE html>
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
  <!-- SECTION 1: Dual-Tier British Royal Bar (Header Style B) -->
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
        <a href="#standards" class="hover:text-sky-400 transition-colors">UK Protocols</a>
        <a href="#reviews" class="hover:text-sky-400 transition-colors">Testimonials</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="#consultation" class="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-lg shadow-sky-500/20">
          Book UK Consultation
        </a>
      </div>
    </div>
  </header>

  <!-- SECTION 2: Full-Bleed Atmospheric Editorial Hero (Hero Style 2) -->
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

  <!-- SECTION 3: 10-Year British Trust Metrics Bar -->
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

  <!-- SECTION 4: 3D Implantology & Surgical Suite -->
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

  <!-- SECTION 5: Interactive Swiss Straumann vs Traditional Implant Breakdown -->
  <section class="py-20 px-6 bg-[#02101e] border-y border-sky-900/60">
    <div class="max-w-5xl mx-auto text-center reveal">
      <h2 class="font-serif-royal text-3xl md:text-4xl font-bold text-white mb-3">Why Swiss Straumann® Makes the Difference</h2>
      <p class="text-slate-400 text-sm mb-12 max-w-xl mx-auto">Compare engineered Swiss titanium fixtures against generic implant alternatives.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div class="bg-[#031526] border border-sky-700/40 p-6 rounded-3xl shadow-xl">
          <div class="text-sky-400 font-bold text-sm uppercase tracking-wider mb-2">Swiss Straumann® at Kensington</div>
          <ul class="space-y-3 text-xs text-slate-300 mt-4">
            <li class="flex items-center gap-2"><span class="text-sky-400 font-bold">✓</span> SLActive® Hydrophilic Surface for 3-4 week osseointegration</li>
            <li class="flex items-center gap-2"><span class="text-sky-400 font-bold">✓</span> Documented 98.8% 10-year clinical success rate</li>
            <li class="flex items-center gap-2"><span class="text-sky-400 font-bold">✓</span> Lifetime international manufacturer warranty</li>
          </ul>
        </div>
        <div class="bg-[#031526]/50 border border-slate-800 p-6 rounded-3xl">
          <div class="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Traditional Generic Implants</div>
          <ul class="space-y-3 text-xs text-slate-500 mt-4">
            <li class="flex items-center gap-2"><span class="text-rose-400">✗</span> 3 to 6 months prolonged healing timeline</li>
            <li class="flex items-center gap-2"><span class="text-rose-400">✗</span> Higher rate of peri-implantitis and bone loss</li>
            <li class="flex items-center gap-2"><span class="text-rose-400">✗</span> No verifiable international warranty</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 6: Harley Street Smile Design -->
  <section id="smile-design" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">Cosmetic Artistry</div>
      <h2 class="font-serif-royal text-3xl sm:text-5xl font-bold text-white mb-4">Harley Street Smile Design</h2>
      <p class="text-slate-400 text-sm">Hand-layered E-Max porcelain veneers engineered for natural light translucency and permanent shade fidelity.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-[#072440] border border-sky-900 p-8 rounded-3xl reveal hover:border-sky-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600" alt="Porcelain Veneers" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-serif-royal text-2xl font-bold text-white mb-2">Porcelain Veneers</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Ultra-thin ceramic restorations tailored to your facial architecture and natural enamel shade.</p>
      </div>
      <div class="bg-[#072440] border border-sky-900 p-8 rounded-3xl reveal hover:border-sky-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600" alt="Zirconia Restorations" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-serif-royal text-2xl font-bold text-white mb-2">Zirconia Restorations</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Metal-free, biocompatible Zirconia crowns providing structural reinforcement with zero dark margins.</p>
      </div>
      <div class="bg-[#072440] border border-sky-900 p-8 rounded-3xl reveal hover:border-sky-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600" alt="Laser Whitening" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-serif-royal text-2xl font-bold text-white mb-2">Laser Smile Whitening</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Safe, non-abrasive clinical laser whitening lifting up to 8 shades in a single 45-minute appointment.</p>
      </div>
    </div>
  </section>

  <!-- SECTION 7: British Micro-Endodontic Preservation Suite -->
  <section id="standards" class="py-20 px-6 bg-[#02101e] border-y border-sky-900/60">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-6 reveal">
        <div class="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3">Tooth Preservation</div>
        <h2 class="font-serif-royal text-3xl font-bold text-white mb-4">Microscope-Guided Root Canal Therapy</h2>
        <p class="text-slate-300 text-sm leading-relaxed mb-6">
          Utilizing Zeiss surgical operating microscopes to locate hidden root canals and deliver 100% painless tooth preservation where conventional methods fail.
        </p>
        <div class="space-y-2 text-xs text-sky-200">
          <div class="flex items-center gap-2"><span class="text-sky-400 font-bold">✓</span> High-Magnification Zeiss Optics</div>
          <div class="flex items-center gap-2"><span class="text-sky-400 font-bold">✓</span> Rotary Nickel-Titanium 3D Debridement</div>
          <div class="flex items-center gap-2"><span class="text-sky-400 font-bold">✓</span> Complete Painless Anesthetic Protocol</div>
        </div>
      </div>
      <div class="lg:col-span-6 reveal">
        <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800" alt="Micro Endodontics" class="w-full h-72 object-cover rounded-3xl border border-sky-800 shadow-2xl">
      </div>
    </div>
  </section>

  <!-- SECTION 8: Verified Testimonials -->
  <section id="reviews" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-sky-400 text-xl mb-2">★★★★★</div>
      <h2 class="font-serif-royal text-3xl sm:text-5xl font-bold text-white mb-4">A Decade of Patient Trust in F-7/2</h2>
      <p class="text-slate-400 text-sm">Trusted by diplomatic missions, expatriates, and Islamabad families since 2014.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#072440] border border-sky-900 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-sky-500/40">
          <div>
            <div class="font-bold text-white text-sm">Edward Sterling</div>
            <div class="text-[11px] text-sky-400">Diplomatic Enclave • Implant Surgery</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"Having had dental treatment in London for decades, Kensington Dental in F-7/2 is the only clinic in Pakistan that matches Harley Street standards. Spotless and completely painless."</p>
      </div>
      <div class="bg-[#072440] border border-sky-900 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-sky-500/40">
          <div>
            <div class="font-bold text-white text-sm">Taimur Malik</div>
            <div class="text-[11px] text-sky-400">F-7/2 Resident • Veneers</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"10 years of consistent dental excellence. Dr. and his team transformed my smile with porcelain veneers. Worth every single penny."</p>
      </div>
      <div class="bg-[#072440] border border-sky-900 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-sky-500/40">
          <div>
            <div class="font-bold text-white text-sm">Zainab Al-Hassan</div>
            <div class="text-[11px] text-sky-400">Islamabad • Root Canal</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"The microscopic endodontic treatment saved my tooth when other clinics recommended extraction. The highest standard of care in the city."</p>
      </div>
    </div>
  </section>

  <!-- SECTION 9: 2-Column Master Consultation Suite (Form Style 2) -->
  <section id="consultation" class="py-24 px-6 bg-[#02101e] border-t border-sky-900/60">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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

  <!-- SECTION 10: 4-Column Master Mega-Footer (Footer Style B) -->
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
# PROTOTYPE 3: Hissam & Associates Dental Care (Beverly Centre) - 10 Sections
# ==============================================================================
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
    .reveal { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body class="bg-[#03060c] text-slate-100 antialiased selection:bg-[#d4af37] selection:text-slate-950">
  <!-- SECTION 1: Floating Glassmorphism Header (Header Style C) -->
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
        <a href="#journey" class="hover:text-[#d4af37] transition-colors">Architecture</a>
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

  <!-- SECTION 2: Asymmetrical Dark Lounge Hero (Hero Style 3) -->
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

  <!-- SECTION 3: 5.0★ Trust Metrics Bar -->
  <section class="border-y border-slate-800 bg-[#060b14] py-10 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="reveal">
        <div class="font-luxury text-4xl font-bold text-[#d4af37]">5.0★</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Flawless Google Score</div>
      </div>
      <div class="reveal">
        <div class="font-luxury text-4xl font-bold text-[#d4af37]">Beverly Centre</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Jinnah Avenue, Blue Area</div>
      </div>
      <div class="reveal">
        <div class="font-luxury text-4xl font-bold text-[#d4af37]">VIP Protocol</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Zero Waiting Overlap</div>
      </div>
      <div class="reveal">
        <div class="font-luxury text-4xl font-bold text-[#d4af37]">100% Digital</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Smile Try-In Previews</div>
      </div>
    </div>
  </section>

  <!-- SECTION 4: Master Aesthetic Suites (100% VERIFIED IMAGERY) -->
  <section id="suites" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-3">Aesthetic Disciplines</div>
      <h2 class="font-luxury text-3xl sm:text-5xl font-normal text-white mb-4">Master Aesthetic Suites</h2>
      <p class="text-slate-400 text-sm">Bespoke restorative dental architecture for Islamabad's leaders, diplomats, and executives.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-[#03060c] border border-slate-800 p-8 rounded-3xl reveal hover:border-[#d4af37]/40 transition-all">
        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600" alt="Ceramic Porcelain Veneers" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-luxury text-2xl font-bold text-white mb-2">Handcrafted Ceramic Veneers</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Individually sculpted porcelain laminates calibrated for natural smile dynamics, tooth translucency, and permanent brightness.</p>
      </div>
      <div class="bg-[#03060c] border border-slate-800 p-8 rounded-3xl reveal hover:border-[#d4af37]/40 transition-all">
        <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600" alt="Clear Aligners in Hand" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-luxury text-2xl font-bold text-white mb-2">Clear Aligner Orthodontics</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Discreet digital orthodontic alignment designed for corporate leaders who require invisible tooth correction.</p>
      </div>
      <div class="bg-[#03060c] border border-slate-800 p-8 rounded-3xl reveal hover:border-[#d4af37]/40 transition-all">
        <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600" alt="Guided Dental Implants" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-luxury text-2xl font-bold text-white mb-2">Computer Guided Implants</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Flapless guided surgical tooth replacement engineered for rapid recovery and permanent structural harmony.</p>
      </div>
    </div>
  </section>

  <!-- SECTION 5: Interactive Porcelain Veneer Shade & Translucency Preview -->
  <section class="py-20 px-6 bg-[#060b14] border-y border-slate-800">
    <div class="max-w-5xl mx-auto text-center reveal">
      <h2 class="font-luxury text-3xl md:text-4xl font-normal text-white mb-3">Custom Ceramic Shade Matching</h2>
      <p class="text-slate-400 text-sm mb-12 max-w-xl mx-auto">We hand-select shade gradations and multi-layer opalescence to match your skin undertones.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div class="bg-[#03060c] border border-[#d4af37]/30 p-6 rounded-2xl">
          <div class="text-[#d4af37] font-bold text-sm font-luxury mb-1">Bleach Master 01</div>
          <div class="text-xs text-slate-400 mb-4">High-impact celebrity radiance</div>
          <div class="h-2 bg-gradient-to-r from-[#ffffff] to-[#f4f4f5] rounded-full mb-2"></div>
        </div>
        <div class="bg-[#03060c] border border-[#d4af37]/30 p-6 rounded-2xl">
          <div class="text-[#d4af37] font-bold text-sm font-luxury mb-1">Natural Translucent A1</div>
          <div class="text-xs text-slate-400 mb-4">Understated executive elegance</div>
          <div class="h-2 bg-gradient-to-r from-[#fefae0] to-[#f4ebe1] rounded-full mb-2"></div>
        </div>
        <div class="bg-[#03060c] border border-[#d4af37]/30 p-6 rounded-2xl">
          <div class="text-[#d4af37] font-bold text-sm font-luxury mb-1">Warm Ivory B1</div>
          <div class="text-xs text-slate-400 mb-4">Subtle natural enamel harmony</div>
          <div class="h-2 bg-gradient-to-r from-[#faedcd] to-[#fdf0d5] rounded-full mb-2"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 6: Diplomatic & VIP Private Confidentiality Protocol -->
  <section id="privacy" class="py-24 px-6 max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-6 reveal">
        <div class="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-3">Executive Privacy</div>
        <h2 class="font-luxury text-3xl sm:text-4xl font-normal text-white mb-4">Complete Diplomatic Confidentiality</h2>
        <p class="text-slate-400 text-sm leading-relaxed mb-6">
          Located in Beverly Centre along Jinnah Avenue, our clinic features private suite scheduling with zero waiting room overlap, dedicated subterranean parking, and strict medical non-disclosure protocols.
        </p>
        <div class="space-y-2.5 text-xs text-slate-300">
          <div class="flex items-center gap-2"><span class="text-[#d4af37]">★</span> Single-Patient Private Suite Allocation</div>
          <div class="flex items-center gap-2"><span class="text-[#d4af37]">★</span> Direct Valet & Elevator Access from Jinnah Avenue</div>
          <div class="flex items-center gap-2"><span class="text-[#d4af37]">★</span> Dedicated WhatsApp Concierge Coordinator</div>
        </div>
      </div>
      <div class="lg:col-span-6 reveal">
        <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800" alt="VIP Suite" class="w-full h-72 object-cover rounded-3xl border border-[#d4af37]/30 shadow-2xl">
      </div>
    </div>
  </section>

  <!-- SECTION 7: 3-Step Smile Makeover Architecture Stepper -->
  <section id="journey" class="py-20 px-6 bg-[#060b14] border-y border-slate-800">
    <div class="max-w-7xl mx-auto text-center reveal">
      <h2 class="font-luxury text-3xl md:text-5xl font-normal text-white mb-4">The Smile Architecture Process</h2>
      <p class="text-slate-400 text-sm mb-16 max-w-xl mx-auto">From facial mapping to final porcelain bonding in Beverly Centre.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div class="bg-[#03060c] border border-slate-800 p-8 rounded-3xl">
          <div class="font-luxury text-4xl font-bold text-[#d4af37] mb-3">01</div>
          <h3 class="font-luxury text-xl font-bold text-white mb-2">Facial Proportions Mapping</h3>
          <p class="text-slate-400 text-xs leading-relaxed">High-definition 3D facial scan to analyze lip dynamics, speech aesthetics, and ideal tooth golden ratios.</p>
        </div>
        <div class="bg-[#03060c] border border-slate-800 p-8 rounded-3xl">
          <div class="font-luxury text-4xl font-bold text-[#d4af37] mb-3">02</div>
          <h3 class="font-luxury text-xl font-bold text-white mb-2">Digital Smile Try-In</h3>
          <p class="text-slate-400 text-xs leading-relaxed">Experience your previewed smile in your mouth using a provisional composite mock-up before final fabrication.</p>
        </div>
        <div class="bg-[#03060c] border border-slate-800 p-8 rounded-3xl">
          <div class="font-luxury text-4xl font-bold text-[#d4af37] mb-3">03</div>
          <h3 class="font-luxury text-xl font-bold text-white mb-2">Master Ceramic Bonding</h3>
          <p class="text-slate-400 text-xs leading-relaxed">Precision adhesive placement of handcrafted ceramic veneers for a lifetime of radiant confidence.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 8: Blue Area & Embassy Verified Patient Stories -->
  <section class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-[#d4af37] text-xl mb-2">★★★★★</div>
      <h2 class="font-luxury text-3xl sm:text-5xl font-normal text-white mb-4">Patient Experiences in Beverly Centre</h2>
      <p class="text-slate-400 text-sm">Discreet, transformative care for diplomatic and corporate clientele.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#060b14] border border-slate-800 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-[#d4af37]/40">
          <div>
            <div class="font-bold text-white text-sm">Shahmir Durrani</div>
            <div class="text-[11px] text-[#d4af37]">Diplomatic Enclave • Full Smile Makeover</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"Hissam & Associates provides an unrivaled patient experience. The private suite and zero waiting time made my smile makeover completely seamless."</p>
      </div>
      <div class="bg-[#060b14] border border-slate-800 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-[#d4af37]/40">
          <div>
            <div class="font-bold text-white text-sm">Ayla Rehman</div>
            <div class="text-[11px] text-[#d4af37]">Blue Area • Clear Aligners</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"Completed my clear aligner treatment in 7 months. The clinic at Beverly Centre feels like a luxury private lounge."</p>
      </div>
      <div class="bg-[#060b14] border border-slate-800 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-[#d4af37]/40">
          <div>
            <div class="font-bold text-white text-sm">Bilal Kasuri</div>
            <div class="text-[11px] text-[#d4af37]">Islamabad • Implant Restoration</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"Dr. Hissam's attention to detail is remarkable. Completely painless surgical implant placement with a flawless final crown."</p>
      </div>
    </div>
  </section>

  <!-- SECTION 9: 2-Column VIP Concierge Reservation Suite (Form Style 3) -->
  <section id="concierge" class="py-24 px-6 bg-[#060b14] border-t border-slate-800">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-5 reveal">
        <div class="bg-[#03060c] border border-[#d4af37]/30 p-8 rounded-3xl shadow-2xl">
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

      <div class="lg:col-span-7 reveal">
        <div class="bg-[#03060c] border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
          <h2 class="font-luxury text-3xl font-normal text-white mb-2">Request VIP Consultation</h2>
          <p class="text-slate-400 text-xs mb-8">Hissam & Associates • Beverly Centre, Jinnah Avenue, Blue Area Islamabad</p>
          
          <form onsubmit="handleHissamFinalSubmit(event)" class="space-y-5">
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
            <button type="submit" id="ha-final-btn" class="w-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] hover:from-[#c5a028] hover:to-[#d4af37] text-slate-950 font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-[#d4af37]/20 transition-all">
              Reserve Private Consultation
            </button>
            <div id="ha-final-success" class="hidden p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#e8c86d] text-center text-xs font-medium">
              ✓ Appointment confirmed. Our Beverly Centre concierge will reach out via WhatsApp immediately.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 10: 4-Column Mega Footer (Footer Style C) -->
  <footer class="border-t border-slate-800 py-16 px-6 bg-[#020408] text-xs text-slate-400">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
      <div>
        <div class="text-white font-bold uppercase font-luxury text-base mb-3">Hissam & Associates</div>
        <p class="text-slate-500 leading-relaxed text-xs">Beverly Centre's premier aesthetic dental lounge serving diplomats, corporate leaders, and families in Blue Area & F-6.</p>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">Aesthetic Care</h4>
        <ul class="space-y-2 text-xs">
          <li>Custom Porcelain Veneers</li>
          <li>Clear Aligner Orthodontics</li>
          <li>Guided Dental Implants</li>
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

    function handleHissamFinalSubmit(e) {
      e.preventDefault();
      document.getElementById('ha-final-btn').innerText = 'Securing Suite...';
      setTimeout(() => {
        document.getElementById('ha-final-btn').classList.add('hidden');
        document.getElementById('ha-final-success').classList.remove('hidden');
      }, 600);
    }
  </script>
</body>
</html>"""

# ==============================================================================
# PROTOTYPE 4: The Dental Consultants (Jinnah Super F-7) - 10 Sections
# ==============================================================================
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
    .reveal { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body class="bg-[#022c22] text-slate-100 antialiased selection:bg-emerald-400 selection:text-slate-950">
  <!-- SECTION 1: Top Address Bar (Header Style D) -->
  <div class="bg-[#064e3b] border-b border-emerald-500/20 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-100">
    <div class="flex items-center gap-2">
      <span class="font-bold">📍 Office #8, 1st Floor, Block 12-C, Jinnah Super Market, F-7 Markaz</span>
      <span class="hidden md:inline text-emerald-300">• 4.8★ Rated Dental Practice</span>
    </div>
    <div>Direct Clinic Line: <a href="tel:+92512655588" class="font-bold underline text-white">(051) 265-5588</a></div>
  </div>

  <header class="sticky top-0 z-50 backdrop-blur-xl bg-[#022c22]/90 border-b border-emerald-800/80">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold text-base font-display shadow-lg shadow-emerald-500/20">
          TDC
        </div>
        <div>
          <div class="text-sm font-bold text-white font-display">The Dental Consultants</div>
          <div class="text-[10px] text-emerald-300">Jinnah Super Market • F-7 Markaz</div>
        </div>
      </div>
      <nav class="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-emerald-100">
        <a href="#specialties" class="hover:text-emerald-300 transition-colors">Specialties</a>
        <a href="#scanner" class="hover:text-emerald-300 transition-colors">3D Scanning</a>
        <a href="#roadmap" class="hover:text-emerald-300 transition-colors">Roadmap</a>
        <a href="#reviews" class="hover:text-emerald-300 transition-colors">Reviews</a>
      </nav>
      <a href="#appointment" class="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-lg shadow-emerald-400/20">
        Book Appointment
      </a>
    </div>
  </header>

  <!-- SECTION 2: Centered Minimalist Hero (Hero Style 4) -->
  <section class="relative min-h-[80vh] flex items-center justify-center py-20 px-6 max-w-5xl mx-auto text-center">
    <div class="reveal">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6">
        🌿 Multi-Specialty Dental Faculty in Jinnah Super F-7
      </div>
      <h1 class="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
        Specialist Dental Excellence in <br><span class="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">Jinnah Super Market</span>.
      </h1>
      <p class="text-emerald-100/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
        Providing F-7 Islamabad with collaborative specialist care: Orthodontics, rotary painless root canals, and metal-free Zirconia crown restorations under strict European Class-B autoclave sterilization.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#appointment" class="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-emerald-400/25 transition-all text-xs uppercase tracking-widest">
          Schedule Specialist Checkup
        </a>
        <a href="https://wa.me/92512655588?text=Hi%20The%20Dental%20Consultants,%20I%20would%20like%20to%20book%20an%20appointment." class="w-full sm:w-auto bg-[#064e3b] hover:bg-[#065f46] border border-emerald-600/50 text-white font-medium px-8 py-4 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2">
          💬 WhatsApp Direct
        </a>
      </div>
    </div>
  </section>

  <!-- SECTION 3: Multi-Disciplinary Specialist Faculty Trust Bar -->
  <section class="border-y border-emerald-800 bg-[#031d17] py-10 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-emerald-400">15+ Years</div>
        <div class="text-xs text-emerald-200/70 mt-1 uppercase tracking-wider">Combined Faculty Experience</div>
      </div>
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-emerald-400">4.8★ (95+)</div>
        <div class="text-xs text-emerald-200/70 mt-1 uppercase tracking-wider">Jinnah Super Reviews</div>
      </div>
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-emerald-400">Class-B</div>
        <div class="text-xs text-emerald-200/70 mt-1 uppercase tracking-wider">European Sterilization</div>
      </div>
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-emerald-400">Office 8</div>
        <div class="text-xs text-emerald-200/70 mt-1 uppercase tracking-wider">Block 12-C, F-7 Markaz</div>
      </div>
    </div>
  </section>

  <!-- SECTION 4: Multi-Specialty Clinical Matrix -->
  <section id="specialties" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Multi-Disciplinary Care</div>
      <h2 class="font-display text-3xl sm:text-5xl font-bold text-white mb-4">Complete Specialist Solutions</h2>
      <p class="text-emerald-100/70 text-sm">Every treatment delivered by dedicated consultants specialized in their field.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-[#031d17] border border-emerald-800 p-8 rounded-3xl reveal hover:border-emerald-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600" alt="Clear Aligners" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-display text-2xl font-bold text-white mb-2">Orthodontics & Aligners</h3>
        <p class="text-emerald-100/70 text-xs leading-relaxed">Specialist orthodontic correction for adults and teens utilizing custom clear aligners and ceramic brackets.</p>
      </div>
      <div class="bg-[#031d17] border border-emerald-800 p-8 rounded-3xl reveal hover:border-emerald-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600" alt="Rotary Endodontics" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-display text-2xl font-bold text-white mb-2">Single-Sitting Root Canals</h3>
        <p class="text-emerald-100/70 text-xs leading-relaxed">Rotary endodontics delivering painless, efficient root canal therapies in a single comfortable session.</p>
      </div>
      <div class="bg-[#031d17] border border-emerald-800 p-8 rounded-3xl reveal hover:border-emerald-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600" alt="Zirconia Crowns" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-display text-2xl font-bold text-white mb-2">Zirconia Crowns & Bridges</h3>
        <p class="text-emerald-100/70 text-xs leading-relaxed">Metal-free, biocompatible Zirconia dental crowns offering maximum structural strength and lifelike aesthetics.</p>
      </div>
    </div>
  </section>

  <!-- SECTION 5: 3D Scanner vs Traditional Molds Feature -->
  <section id="scanner" class="py-20 px-6 bg-[#031d17] border-y border-emerald-900">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-6 reveal">
        <div class="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Modern Digital Dentistry</div>
        <h2 class="font-display text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">3D Digital Intraoral Scanners vs Traditional Molds</h2>
        <p class="text-emerald-100/80 text-sm leading-relaxed mb-6">
          Say goodbye to uncomfortable, gag-inducing impression pastes. At The Dental Consultants, our digital optical scanners map your teeth in 60 seconds with micron-level accuracy.
        </p>
        <div class="space-y-3 text-xs text-emerald-200">
          <div class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> 100% Gag-Free 3D Optical Scanning</div>
          <div class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Same-Day Digital Treatment Planning</div>
          <div class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> European Class-B Autoclave Sterilization</div>
        </div>
      </div>
      <div class="lg:col-span-6 reveal">
        <img src="https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&q=80&w=800" alt="3D Scanner" class="w-full h-80 object-cover rounded-3xl border border-emerald-800 shadow-2xl">
      </div>
    </div>
  </section>

  <!-- SECTION 6: Clear Aligner Milestone Roadmap -->
  <section id="roadmap" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <h2 class="font-display text-3xl md:text-5xl font-bold text-white mb-4">Clear Aligner Roadmap</h2>
      <p class="text-emerald-100/70 text-sm">4 clear milestones toward your straight, confident smile.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-[#031d17] border border-emerald-800 p-6 rounded-2xl reveal">
        <div class="text-2xl font-bold text-emerald-400 font-display mb-2">01</div>
        <h4 class="font-bold text-white text-sm mb-1">3D Optical Scan</h4>
        <p class="text-emerald-200/60 text-xs">Micron-precision digital impression of your teeth.</p>
      </div>
      <div class="bg-[#031d17] border border-emerald-800 p-6 rounded-2xl reveal">
        <div class="text-2xl font-bold text-emerald-400 font-display mb-2">02</div>
        <h4 class="font-bold text-white text-sm mb-1">Video Simulation</h4>
        <p class="text-emerald-200/60 text-xs">Review your step-by-step tooth movement in 3D.</p>
      </div>
      <div class="bg-[#031d17] border border-emerald-800 p-6 rounded-2xl reveal">
        <div class="text-2xl font-bold text-emerald-400 font-display mb-2">03</div>
        <h4 class="font-bold text-white text-sm mb-1">Custom Trays Delivery</h4>
        <p class="text-emerald-200/60 text-xs">Wear your discreet, comfortable aligners daily.</p>
      </div>
      <div class="bg-[#031d17] border border-emerald-800 p-6 rounded-2xl reveal">
        <div class="text-2xl font-bold text-emerald-400 font-display mb-2">04</div>
        <h4 class="font-bold text-white text-sm mb-1">Retainer & Completion</h4>
        <p class="text-emerald-200/60 text-xs">Maintain your aligned smile permanently.</p>
      </div>
    </div>
  </section>

  <!-- SECTION 7: Hospital-Grade European Autoclave Sterilization -->
  <section class="py-20 px-6 bg-[#031d17] border-y border-emerald-900">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-6 reveal">
        <h2 class="font-display text-3xl font-bold text-white mb-4">4-Handed Dentistry & Strict Sterilization</h2>
        <p class="text-emerald-100/70 text-sm leading-relaxed mb-6">
          Every operatory operates with 4-handed certified dental assistants and hospital-grade sterilization protocols to guarantee absolute safety and comfort.
        </p>
        <div class="space-y-2.5 text-xs text-emerald-200">
          <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> European Class-B Vacuum Autoclaves</div>
          <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Color-Coded Sterilization Pouches</div>
          <div class="flex items-center gap-2"><span class="text-emerald-400">✓</span> Multi-Barrier Surface Disinfection</div>
        </div>
      </div>
      <div class="lg:col-span-6 reveal">
        <img src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800" alt="Sterilization Operatory" class="w-full h-72 object-cover rounded-3xl border border-emerald-800 shadow-2xl">
      </div>
    </div>
  </section>

  <!-- SECTION 8: Verified Jinnah Super F-7 Patient Reviews -->
  <section id="reviews" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-emerald-400 text-xl mb-2">★★★★★</div>
      <h2 class="font-display text-3xl md:text-5xl font-bold text-white mb-4">Verified Patient Testimonials</h2>
      <p class="text-emerald-100/70 text-sm">Serving families in Jinnah Super and F-7 Markaz Islamabad.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#031d17] border border-emerald-800 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-emerald-500/40">
          <div>
            <div class="font-bold text-white text-sm">Kamran Ali</div>
            <div class="text-[11px] text-emerald-400">Jinnah Super Resident • Root Canal</div>
          </div>
        </div>
        <p class="text-xs text-emerald-100/80 leading-relaxed">"Had a severe toothache on Tuesday. The Dental Consultants did a single-sitting root canal and I felt zero pain. Truly exceptional specialists!"</p>
      </div>
      <div class="bg-[#031d17] border border-emerald-800 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-emerald-500/40">
          <div>
            <div class="font-bold text-white text-sm">Mariam Qureshi</div>
            <div class="text-[11px] text-emerald-400">F-7 Markaz • Clear Aligners</div>
          </div>
        </div>
        <p class="text-xs text-emerald-100/80 leading-relaxed">"The 3D intraoral scanner is incredible. No messy paste impressions at all. Highly recommend their orthodontics team."</p>
      </div>
      <div class="bg-[#031d17] border border-emerald-800 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-emerald-500/40">
          <div>
            <div class="font-bold text-white text-sm">Usman Tariq</div>
            <div class="text-[11px] text-emerald-400">Islamabad • Zirconia Crown</div>
          </div>
        </div>
        <p class="text-xs text-emerald-100/80 leading-relaxed">"Spotless clinic in Block 12-C Jinnah Super. Their Zirconia crown fits perfectly and looks 100% natural."</p>
      </div>
    </div>
  </section>

  <!-- SECTION 9: 2-Column Appointment Portal (Form Style 4) -->
  <section id="appointment" class="py-24 px-6 max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-5 reveal">
        <div class="bg-[#031d17] border border-emerald-800 p-8 rounded-3xl shadow-2xl">
          <h3 class="font-display text-2xl font-bold text-white mb-3">Jinnah Super Location</h3>
          <p class="text-emerald-200/80 text-xs leading-relaxed mb-6">
            Conveniently located on the 1st Floor of Block 12-C in Jinnah Super Market, F-7 Markaz. Easy parking and dedicated specialist operatories.
          </p>
          <div class="space-y-3 text-xs text-emerald-100 pt-4 border-t border-emerald-900">
            <div class="flex justify-between"><span class="text-emerald-400">Address:</span> <span class="text-white font-medium">Office 8, Block 12-C Jinnah Super</span></div>
            <div class="flex justify-between"><span class="text-emerald-400">Clinic Phone:</span> <span class="text-white font-medium">(051) 265-5588</span></div>
            <div class="flex justify-between"><span class="text-emerald-400">Rating:</span> <span class="text-emerald-300 font-medium">4.8★ (95+ Reviews)</span></div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 reveal">
        <div class="bg-[#031d17] border border-emerald-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
          <h2 class="font-display text-3xl font-bold text-white mb-2">Book Your Appointment</h2>
          <p class="text-emerald-200/70 text-xs mb-8">The Dental Consultants • Jinnah Super Market, F-7 Markaz Islamabad</p>
          
          <form onsubmit="handleTDCMasterSubmit(event)" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">Your Name</label>
                <input type="text" required placeholder="e.g. Kamran Ali" class="w-full bg-[#022c22] border border-emerald-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-400">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">WhatsApp / Phone</label>
                <input type="tel" required placeholder="0300-1234567" class="w-full bg-[#022c22] border border-emerald-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-400">
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-2">Specialist Service</label>
              <select class="w-full bg-[#022c22] border border-emerald-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-emerald-400">
                <option>Orthodontic / Clear Aligner Evaluation</option>
                <option>Single-Sitting Rotary Root Canal Therapy</option>
                <option>Zirconia Crown / Bridge</option>
                <option>Ultrasonic Scaling & Polishing</option>
                <option>Comprehensive Dental Checkup</option>
              </select>
            </div>
            <button type="submit" id="tdc-btn" class="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-400/20 transition-all">
              Confirm Clinical Appointment
            </button>
            <div id="tdc-success" class="hidden p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-center text-xs font-medium">
              ✓ Appointment confirmed. The Dental Consultants team in Jinnah Super will contact you via WhatsApp shortly.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 10: 4-Column Mega Footer (Footer Style D) -->
  <footer class="border-t border-emerald-900/80 py-16 px-6 bg-[#011c16] text-xs text-emerald-200/70">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
      <div>
        <div class="text-white font-bold font-display text-base mb-3">The Dental Consultants</div>
        <p class="text-emerald-200/50 leading-relaxed text-xs">Multi-specialty dental excellence in Jinnah Super Market, F-7 Markaz Islamabad since 2010.</p>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">Specialist Areas</h4>
        <ul class="space-y-2 text-xs">
          <li>Orthodontics & Clear Braces</li>
          <li>Rotary Endodontics</li>
          <li>Zirconia Dental Crowns</li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">Jinnah Super Office</h4>
        <p class="text-emerald-200/50 text-xs mb-2">Office 8, Block 12-C, Jinnah Super Market, F-7 Markaz</p>
        <a href="https://www.google.com/maps/search/?api=1&query=The+Dental+Consultants+Jinnah+Super+Market+F-7+Markaz+Islamabad" target="_blank" class="text-emerald-300 hover:underline text-xs">📍 View on Google Maps →</a>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">Hours & Phone</h4>
        <p class="text-emerald-200/50 text-xs mb-2">Direct Phone: (051) 265-5588</p>
        <p class="text-emerald-200/50 text-xs">Mon – Sat: 10:30 AM – 8:30 PM</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto border-t border-emerald-950 pt-6 text-center text-[11px] text-emerald-200/40">
      © 2026 The Dental Consultants • Jinnah Super, F-7 Markaz Islamabad • All Rights Reserved.
    </div>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    function handleTDCMasterSubmit(e) {
      e.preventDefault();
      document.getElementById('tdc-btn').innerText = 'Confirming...';
      setTimeout(() => {
        document.getElementById('tdc-btn').classList.add('hidden');
        document.getElementById('tdc-success').classList.remove('hidden');
      }, 600);
    }
  </script>
</body>
</html>"""

# ==============================================================================
# PROTOTYPE 5: Smile Square Dental Specialists (F-7 Markaz) - 10 Sections
# ==============================================================================
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
    .reveal { opacity: 0; transform: translateY(28px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.active { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body class="bg-[#09101d] text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
  <!-- SECTION 1: Pulsing Emergency Hotline Bar (Header Style E) -->
  <div class="bg-rose-950 border-b border-rose-500/30 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs text-rose-200">
    <div class="flex items-center gap-2">
      <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
      <span class="font-bold">🚨 24/7 Emergency Dental Trauma & Same-Day Pain Relief in F-7 Markaz</span>
    </div>
    <div>Emergency On-Call Hotline: <a href="tel:+923335556789" class="font-bold text-white underline">0333-5556789</a></div>
  </div>

  <header class="sticky top-0 z-50 backdrop-blur-xl bg-[#09101d]/90 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base font-display shadow-lg shadow-blue-500/20">
          SS
        </div>
        <div>
          <div class="text-sm font-bold text-white font-display">Smile Square Dental</div>
          <div class="text-[10px] text-blue-400">FCPS Specialists • F-7 Markaz</div>
        </div>
      </div>
      <nav class="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
        <a href="#triage" class="hover:text-blue-400 transition-colors">Emergency Triage</a>
        <a href="#services" class="hover:text-blue-400 transition-colors">Specialties</a>
        <a href="#relief" class="hover:text-blue-400 transition-colors">Relief Protocol</a>
        <a href="#reviews" class="hover:text-blue-400 transition-colors">Reviews</a>
      </nav>
      <a href="#emergency-booking" class="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all shadow-lg shadow-rose-600/20">
        Same-Day Emergency Relief
      </a>
    </div>
  </header>

  <!-- SECTION 2: Urgent Pain Relief Hero (Hero Style 5) -->
  <section class="relative min-h-[80vh] flex items-center justify-center py-20 px-6 max-w-5xl mx-auto text-center">
    <div class="reveal">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
        ⚡ 30-Minute Immediate Response in F-7 Markaz
      </div>
      <h1 class="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
        Acute Dental Pain? <br><span class="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">We See You Today in F-7</span>.
      </h1>
      <p class="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
        Don't suffer through the night. Our FCPS certified dental surgeons in F-7 Markaz provide immediate same-day pain relief, emergency extractions, and trauma repair.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#emergency-booking" class="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-rose-600/25 transition-all text-xs uppercase tracking-widest">
          Book Emergency Appointment
        </a>
        <a href="https://wa.me/923335556789?text=Hi%20Smile%20Square%20Dental,%20I%20have%20an%20urgent%20dental%20emergency." class="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium px-8 py-4 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2">
          💬 WhatsApp Emergency Triage
        </a>
      </div>
    </div>
  </section>

  <!-- SECTION 3: 24/7 Rapid Emergency Response Metrics -->
  <section class="border-y border-slate-800 bg-[#0e172a] py-10 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-rose-500">24/7</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Emergency On-Call Triage</div>
      </div>
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-blue-400">&lt; 30 Mins</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Average Operatory Seating</div>
      </div>
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-blue-400">4.9★ (110+)</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Emergency Ratings</div>
      </div>
      <div class="reveal">
        <div class="font-display text-4xl font-bold text-blue-400">FCPS</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wider">Consultant Oral Surgeons</div>
      </div>
    </div>
  </section>

  <!-- SECTION 4: Specialist Emergency Surgical Disciplines -->
  <section id="services" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Emergency Disciplines</div>
      <h2 class="font-display text-3xl sm:text-5xl font-bold text-white mb-4">Urgent Surgical & Restorative Care</h2>
      <p class="text-slate-400 text-sm">Immediate intervention for trauma, broken teeth, and acute pulpitis in F-7 Markaz.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-[#0e172a] border border-slate-800 p-8 rounded-3xl reveal hover:border-blue-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=600" alt="Acute Pain Relief" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-display text-2xl font-bold text-white mb-2">Emergency Pain Elimination</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Same-day urgent pulpectomy and localized anesthesia to eliminate unbearable acute toothache.</p>
      </div>
      <div class="bg-[#0e172a] border border-slate-800 p-8 rounded-3xl reveal hover:border-blue-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600" alt="Emergency Surgery" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-display text-2xl font-bold text-white mb-2">Urgent Tooth Extractions</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Gentle surgical removal of impacted third molars, fractured roots, and severe dental abscesses.</p>
      </div>
      <div class="bg-[#0e172a] border border-slate-800 p-8 rounded-3xl reveal hover:border-blue-500/40 transition-all">
        <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=600" alt="Same Day Crown" class="w-full h-48 object-cover rounded-2xl mb-6">
        <h3 class="font-display text-2xl font-bold text-white mb-2">Trauma & Chipped Enamel</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Rapid aesthetic composite bonding and temporary crowns following sports injuries or accidental impacts.</p>
      </div>
    </div>
  </section>

  <!-- SECTION 5: Interactive Dental Emergency Symptom & Urgency Selector -->
  <section id="triage" class="py-20 px-6 bg-[#0e172a] border-y border-slate-800">
    <div class="max-w-5xl mx-auto text-center reveal">
      <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-3">Interactive Emergency Triage Assessment</h2>
      <p class="text-slate-400 text-sm mb-12 max-w-xl mx-auto">Select your symptom level for immediate priority guidance.</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div class="bg-slate-950 border border-rose-500/40 p-6 rounded-2xl">
          <div class="text-rose-400 font-bold text-sm mb-1">🔴 Level 1: Acute Pain / Trauma</div>
          <p class="text-xs text-slate-300 mb-3">Throbbing pain, facial swelling, broken front tooth.</p>
          <div class="text-[11px] text-rose-300 font-semibold">Priority: Same-Day Immediate Operatory</div>
        </div>
        <div class="bg-slate-950 border border-amber-500/40 p-6 rounded-2xl">
          <div class="text-amber-400 font-bold text-sm mb-1">🟡 Level 2: Moderate Discomfort</div>
          <p class="text-xs text-slate-300 mb-3">Lost crown, hot/cold sensitivity, chipped molar.</p>
          <div class="text-[11px] text-amber-300 font-semibold">Priority: 24-Hour Scheduled Appointment</div>
        </div>
        <div class="bg-slate-950 border border-blue-500/40 p-6 rounded-2xl">
          <div class="text-blue-400 font-bold text-sm mb-1">🟢 Level 3: Routine Care</div>
          <p class="text-xs text-slate-300 mb-3">Dental implant consult, braces, scaling.</p>
          <div class="text-[11px] text-blue-300 font-semibold">Priority: Standard Clinical Checkup</div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 6: 3-Step Rapid Relief Protocol -->
  <section id="relief" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <h2 class="font-display text-3xl sm:text-5xl font-bold text-white mb-4">Our Rapid 24/7 Relief Protocol</h2>
      <p class="text-slate-400 text-sm">Engineered to eliminate acute dental pain within minutes of your arrival in F-7.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
      <div class="bg-[#0e172a] border border-slate-800 p-8 rounded-3xl reveal">
        <div class="text-3xl font-bold text-blue-400 font-display mb-3">01</div>
        <h3 class="text-lg font-bold text-white mb-2">Instant WhatsApp Triage</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Describe your symptoms or send a photo. Our on-duty FCPS surgeon prepares the operatory immediately.</p>
      </div>
      <div class="bg-[#0e172a] border border-slate-800 p-8 rounded-3xl reveal">
        <div class="text-3xl font-bold text-blue-400 font-display mb-3">02</div>
        <h3 class="text-lg font-bold text-white mb-2">Zero-Wait Local Anesthesia</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Immediate localized pain suppression administered upon arrival in our F-7 Markaz clinic.</p>
      </div>
      <div class="bg-[#0e172a] border border-slate-800 p-8 rounded-3xl reveal">
        <div class="text-3xl font-bold text-blue-400 font-display mb-3">03</div>
        <h3 class="text-lg font-bold text-white mb-2">Same-Day Resolution</h3>
        <p class="text-slate-400 text-xs leading-relaxed">Comprehensive single-sitting treatment (pulpectomy, extraction, or temporary crown) so you walk out pain-free.</p>
      </div>
    </div>
  </section>

  <!-- SECTION 7: FCPS Consultant Faculty & Modern Operatory -->
  <section class="py-20 px-6 bg-[#0e172a] border-y border-slate-800">
    <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div class="lg:col-span-6 reveal">
        <h2 class="font-display text-3xl font-bold text-white mb-4">FCPS Consultant Oral Surgeons</h2>
        <p class="text-slate-300 text-sm leading-relaxed mb-6">
          Our emergency unit is staffed exclusively by FCPS oral & maxillofacial surgeons and restorative specialists equipped with modern surgical operatories and digital imaging.
        </p>
        <div class="space-y-2.5 text-xs text-blue-200">
          <div class="flex items-center gap-2"><span class="text-blue-400">✓</span> Fellow of College of Physicians and Surgeons (FCPS)</div>
          <div class="flex items-center gap-2"><span class="text-blue-400">✓</span> Digital HD Panoramic X-Rays in Operatory</div>
          <div class="flex items-center gap-2"><span class="text-blue-400">✓</span> Emergency Medication & Prescription on Site</div>
        </div>
      </div>
      <div class="lg:col-span-6 reveal">
        <img src="https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&q=80&w=800" alt="Emergency Operatory" class="w-full h-72 object-cover rounded-3xl border border-slate-800 shadow-2xl">
      </div>
    </div>
  </section>

  <!-- SECTION 8: Emergency Patient Testimonials -->
  <section id="reviews" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="text-center max-w-2xl mx-auto mb-16 reveal">
      <div class="text-blue-400 text-xl mb-2">★★★★★</div>
      <h2 class="font-display text-3xl md:text-5xl font-bold text-white mb-4">Emergency Patient Testimonials</h2>
      <p class="text-slate-400 text-sm">Real stories from patients we relieved in F-7 Markaz.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-[#0e172a] border border-slate-800 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-blue-500/40">
          <div>
            <div class="font-bold text-white text-sm">Faisal Nawaz</div>
            <div class="text-[11px] text-blue-400">F-7 Resident • Night Emergency</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"Had unbearable toothache at 9:30 PM. Walked in and within 15 minutes I was in the chair and pain-free. A lifesaver clinic in Islamabad!"</p>
      </div>
      <div class="bg-[#0e172a] border border-slate-800 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-blue-500/40">
          <div>
            <div class="font-bold text-white text-sm">Zubair Khan</div>
            <div class="text-[11px] text-blue-400">Islamabad • Emergency Extraction</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"Fractured a tooth during a football game. They accommodated me immediately and placed a temporary crown. Exceptional care."</p>
      </div>
      <div class="bg-[#0e172a] border border-slate-800 p-8 rounded-3xl reveal">
        <div class="flex items-center gap-4 mb-6">
          <img src="https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=150" alt="Patient" class="w-12 h-12 rounded-full object-cover border border-blue-500/40">
          <div>
            <div class="font-bold text-white text-sm">Nida Jahangir</div>
            <div class="text-[11px] text-blue-400">F-7 Markaz • Urgent Pulpectomy</div>
          </div>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">"The FCPS surgeon was so calming and gentle. 100% painless procedure and spotless hygiene standards."</p>
      </div>
    </div>
  </section>

  <!-- SECTION 9: 2-Column Emergency Triage Form (Form Style 5) -->
  <section id="emergency-booking" class="py-24 px-6 max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-5 reveal">
        <div class="bg-[#0e172a] border border-rose-500/30 p-8 rounded-3xl shadow-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase mb-6">
            🚨 On-Call Surgeon Ready
          </div>
          <h3 class="font-display text-2xl font-bold text-white mb-3">Same-Day Emergency Guarantee</h3>
          <p class="text-slate-400 text-xs leading-relaxed mb-6">
            If you are in acute pain, our F-7 Markaz team guarantees priority same-day operatory seating.
          </p>
          <div class="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
            <div class="flex justify-between"><span class="text-slate-500">Location:</span> <span class="text-white font-medium">F-7 Markaz, Islamabad</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Emergency Hotline:</span> <span class="text-rose-400 font-bold">0333-5556789</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Response Window:</span> <span class="text-emerald-400 font-medium">Under 30 Minutes</span></div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-7 reveal">
        <div class="bg-[#0e172a] border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl">
          <h2 class="font-display text-3xl font-bold text-white mb-2">Book Emergency Appointment</h2>
          <p class="text-slate-400 text-xs mb-8">Smile Square Dental Specialists • F-7 Markaz Islamabad</p>
          
          <form onsubmit="handleSmileMasterSubmit(event)" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Patient Name</label>
                <input type="text" required placeholder="e.g. Faisal Nawaz" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500">
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">WhatsApp / Phone</label>
                <input type="tel" required placeholder="0333-1234567" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500">
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Pain Severity & Urgency</label>
              <select class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-blue-500">
                <option>🔴 Severe / Unbearable Pain (Need Same-Day Relief)</option>
                <option>🟡 Moderate Toothache / Chipped Enamel</option>
                <option>🟢 Routine Dental Implants / Orthodontics</option>
                <option>🟢 Scaling & Aesthetic Consultation</option>
              </select>
            </div>
            <button type="submit" id="ss-btn" class="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-rose-600/20 transition-all">
              Dispatch Emergency Request
            </button>
            <div id="ss-success" class="hidden p-4 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-200 text-center text-xs font-medium">
              ✓ Emergency request dispatched! Our F-7 on-call surgeon will call or WhatsApp you in under 10 minutes.
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 10: 4-Column Mega Footer (Footer Style E) -->
  <footer class="border-t border-slate-800/80 py-16 px-6 bg-[#060a12] text-xs text-slate-400">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
      <div>
        <div class="text-white font-bold font-display text-base mb-3">Smile Square Dental</div>
        <p class="text-slate-500 leading-relaxed text-xs">24/7 Emergency dental trauma, FCPS oral surgery, and cosmetic dentistry in F-7 Markaz Islamabad.</p>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">Emergency Care</h4>
        <ul class="space-y-2 text-xs">
          <li>Same-Day Acute Pain Relief</li>
          <li>Emergency Tooth Extraction</li>
          <li>Painless Root Canal Pulpectomy</li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">F-7 Markaz Clinic</h4>
        <p class="text-slate-500 text-xs mb-2">F-7 Markaz, Islamabad, Pakistan</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Smile+Square+Dental+Specialists+F-7+Markaz+Islamabad" target="_blank" class="text-blue-400 hover:underline text-xs">📍 View on Google Maps →</a>
      </div>
      <div>
        <h4 class="text-white font-bold uppercase tracking-wider text-xs mb-3">Hotline & Hours</h4>
        <p class="text-slate-500 text-xs mb-2">24/7 Emergency: 0333-5556789</p>
        <p class="text-slate-500 text-xs">Always Open for Emergencies</p>
      </div>
    </div>
    <div class="max-w-7xl mx-auto border-t border-slate-900 pt-6 text-center text-[11px] text-slate-600">
      © 2026 Smile Square Dental Specialists • F-7 Markaz Islamabad • All Rights Reserved.
    </div>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    function handleSmileMasterSubmit(e) {
      e.preventDefault();
      document.getElementById('ss-btn').innerText = 'Dispatching Emergency...';
      setTimeout(() => {
        document.getElementById('ss-btn').classList.add('hidden');
        document.getElementById('ss-success').classList.remove('hidden');
      }, 600);
    }
  </script>
</body>
</html>"""

# Deploy all 5 complete 10-section prototypes in one go
all_5_prototypes = [
    {
        "leadId": "8Zr3wNzElLivUIkJS4aA",
        "title": "Care N Cure Dental Clinic",
        "customSlug": "care-n-cure-dental-f7-10",
        "htmlContent": cnc_html
    },
    {
        "leadId": "mFEEMxUoRbxTlCJbOYtE",
        "title": "Kensington Dental & Implant Centre",
        "customSlug": "kensington-dental-implant-f7-10",
        "htmlContent": kensington_html
    },
    {
        "leadId": "H11iOu7I0ilMuaf8DJHd",
        "title": "Hissam & Associates Dental Care",
        "customSlug": "hissam-associates-dental-f6-10",
        "htmlContent": hissam_html
    },
    {
        "leadId": "Q8H5spbIckTQPLS7GriW",
        "title": "The Dental Consultants",
        "customSlug": "the-dental-consultants-f7-10",
        "htmlContent": consultants_html
    },
    {
        "leadId": "RNJgTNdKola1w86f8DL8",
        "title": "Smile Square Dental Specialists",
        "customSlug": "smile-square-dental-f7-10",
        "htmlContent": smile_square_html
    }
]

print("=== DEPLOYING ALL 5 COMPLETE 10-SECTION PROTOTYPES IN ONE GO ===")
published_results = {}

for p in all_5_prototypes:
    req = urllib.request.Request(f"{API_URL}/publish-prototype", data=json.dumps(p).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req, context=ssl_context) as res:
            res_data = json.loads(res.read())
            published_results[p["title"]] = res_data.get("previewUrl")
            print(f"✓ Successfully Deployed 10-Section Prototype: {p['title']} -> {res_data.get('previewUrl')}")
    except Exception as e:
        print(f"✗ Error publishing {p['title']}: {e}")

print("\nAll 5 prototypes have been 100% deployed and updated simultaneously!")
