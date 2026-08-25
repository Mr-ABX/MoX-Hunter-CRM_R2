# MoX Hunter Bespoke Section Architecture & Awwwards Animation Engine

## 🎨 Core Architectural Rule: Variable Section Depth & Business-Specific Flow
Every website must have a **custom section count (7 to 12+ sections)** and unique narrative structure tailored directly to the business model. NEVER force every site into the same rigid structure or section count.

---

## 🏛️ Business-Specific Narrative Journeys:

### 1. Luxury Interior Architecture & Custom Remodeling (9–11 Sections):
1. **Hero**: Full-bleed architectural editorial split with floating project badge.
2. **Design Philosophy / Manifest**: Oversized typographic statement with warm alabaster accent.
3. **Featured Project Spotlight**: Full-width architectural portfolio with interactive room switcher.
4. **Material & Texture Palette**: Tactile showcase (Italian marble, smoked oak, brushed brass).
5. **Interactive Before / After Transformation**: Real-time slider revealing renovation progress.
6. **Architectural Process Timeline**: 4-phase journey (Consultation -> 3D BIM Modeling -> Procurement -> Handover).
7. **Interactive Project Budget Estimator**: Interactive Sq. Ft. slider calculating investment range.
8. **Awards, Publications & Accreditations**: Press logos (Architectural Digest, Elle Decor).
9. **Private Client Testimonials**: High-profile homeowner quotes with verified portraits.
10. **FAQ Accordion**: Interactive questions regarding permits, timelines, and budgets.
11. **Private Consultation Hub**: Direct designer booking calendar + WhatsApp concierge.

### 2. High-Ticket Aesthetic Dermatology & MedSpa (9–10 Sections):
1. **Hero**: Soft velvet luxury aesthetic with glowing skin portrait & instant consult CTA.
2. **Clinical Accreditations**: Board-certified dermatologists & FDA-cleared devices bar.
3. **Interactive Treatment Recommender**: Skin concern filter (Anti-Aging, Hydration, Contour, Laser).
4. **Interactive Treatment Carousel**: Hydrafacial, Morpheus8, Botox, Laser Resurfacing.
5. **Interactive Before / After Clinical Slider**: High-resolution zoomable clinical transformations.
6. **The Patient Experience Walkthrough**: Private VIP recovery suites & calming ambient care.
7. **Transparent Treatment & Package Tier Table**: Pricing guide with zero hidden fees.
8. **Client Video & Testimonial Wall**: Verified patient stories with star ratings.
9. **Doctor Q&A Accordion**: Preparation & recovery timeline FAQ.
10. **VIP Booking & WhatsApp Concierge**: Instant slot reservation.

---

## ✨ Awwwards & One Page Love Animation Standards:

1. **Buttery Scroll Reveal (`IntersectionObserver`)**:
   ```css
   .reveal {
     opacity: 0;
     transform: translateY(30px);
     transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
   }
   .reveal.active {
     opacity: 1;
     transform: translateY(0);
   }
   ```

2. **Interactive Before/After Image Comparison Slider**:
   A native JavaScript range-input slider allowing prospects to drag left/right to reveal before vs after transformations.

3. **Smooth Accordion FAQs & Tab Switchers**:
   Zero-lag instant state updates with smooth height expansion.

4. **Floating Ambient Badge Animation**:
   Subtle floating CSS keyframes (`translateY(-4px)` to `translateY(4px)`) on trust pills.
