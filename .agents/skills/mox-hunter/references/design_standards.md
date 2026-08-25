# MoX Hunter Master UI/UX Prototype Design System & Standards

## 1. Core Principles (Anti-AI Design Directive)
1. **Never Make Every Site Dark Mode + Glassmorphism**: Every business has its own brand identity. Match the business niche:
   - **Luxury Auto Detailing / Fine Crafts**: Warm Obsidian & Champagne, Ivory, Velvet Dark, High-Gloss Finishes.
   - **Contractors & Roofing / Storm Repair**: Tough Industrial Slate, Safety Amber, Bright Crisp White, Heavy Duty Imagery.
   - **Healthcare & Wellness**: Clean Medical Teal, Soft Mint, High-Contrast Crisp Off-White.
   - **Food & Hospitality**: Rich Terracotta, Warm Cream, Vibrant Gold, High-Emotive Food Photography.
2. **Mandatory High-Resolution Imagery**:
   - NO text-heavy walls. Every prototype MUST include at least 4 to 6 real high-definition images (Unsplash CDN or generated visual assets).
   - Hero background must have real lifestyle/workplace imagery with subtle overlay, not just plain gradient blurs.
   - Product/Service cards must showcase real photo thumbnails.
   - Testimonials must include real avatar portrait images.
3. **Distinct Typography & Layout**:
   - Avoid generic Inter/Roboto defaults for everything.
   - Pair display headers with body fonts tailored to the industry:
     - *Luxury*: `Cinzel` / `Cormorant Garamond` + `Plus Jakarta Sans`
     - *Contractors / Trades*: `Outfit` / `Space Grotesk` + `Inter`
     - *Creative / Modern*: `Syne` / `Clash Display` + `DMSans`
4. **Rich Interactivity & Micro-Animations**:
   - Hover cards with subtle scale & border transitions (`transition-all duration-300 transform hover:-translate-y-1.5`).
   - Dynamic tabbed before/after galleries, cost calculators, or interactive package pickers.
   - Tailwind CSS CDN + FontAwesome 6 icons + Google Fonts.

---

## 2. Niche Image Catalog & Unsplash Asset Libraries

### A. Luxury Auto Detailing & Ceramic Coating:
- **Hero Car Detailing**: `https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1600&auto=format&fit=crop`
- **Ceramic Coating Polishing**: `https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=800&auto=format&fit=crop`
- **Interior Leather Care**: `https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop`
- **Wheel & Brake Detailing**: `https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop`
- **Customer Avatars**:
  - `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop`
  - `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop`
  - `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop`

### B. Roofing Contractors & Storm Repair:
- **Hero Roof Replacement Construction**: `https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?q=80&w=1600&auto=format&fit=crop`
- **Roofers Working on Roof**: `https://images.unsplash.com/photo-1618090584126-129cd1f3fbae?q=80&w=800&auto=format&fit=crop`
- **Architectural Shingles Closeup**: `https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop`
- **Commercial TPO Flat Roof**: `https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop`
- **Storm & Hail House Exterior**: `https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop`
- **Customer Avatars**:
  - `https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop`
  - `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop`

---

## 3. Structural Checklist for Industry Prototypes
1. **Header & Emergency / Trust Topbar**: Phone call CTA, local service badge, operating hours.
2. **Hero Section**: High-resolution imagery background + bold value proposition + primary CTA form/button.
3. **Trust & Metrics Bar**: Verified ratings, years in business, insurance/certification badges.
4. **Service Cards with Photo Thumbnails**: Real photography per service card.
5. **Interactive Element**: Calculator, before/after slider, or tabbed package picker.
6. **Social Proof & Testimonials**: Real customer reviews with star ratings and avatar photos.
7. **Contact / Quote Form & Footer**: Fast booking form + map location badge + privacy guarantee.
