import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  animate,
  useInView,
} from "motion/react";
import {
  ArrowRight,
  Sparkles,
  Monitor,
  Rocket,
  CheckCircle2,
  Quote,
  Play,
  XCircle,
  Check,
  Code2,
  Cpu,
  X,
  Mail,
  ChevronDown,
  Loader2,
  Globe,
  Share2,
  Megaphone,
  Palette,
  Layers,
  ShieldCheck,
  TrendingUp,
  Zap,
  Star,
  Clock,
  Lock,
  CheckCheck,
  Smartphone,
  Laptop,
  Gauge,
  Send,
  Building2,
  ExternalLink,
  Info,
  SlidersHorizontal,
  HelpCircle,
} from "lucide-react";
import { Logo, LogoFull, WolfLogo } from "./logo";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { TestimonialCarousel } from "./testimonial-carousel";
import { EntranceSplash } from "./entrance-splash";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const faqs = [
  {
    question: "Is the prototype actually free?",
    answer:
      "Yes. We use our proprietary AI to generate a functional prototype of your new site. You review it, and if you don't like it, you walk away. No credit card required upfront.",
  },
  {
    question: "How fast can you launch my new site?",
    answer:
      "Because our core build process is AI-driven, we can go from initial analysis to a live, production-ready website in under 24 hours.",
  },
  {
    question: "Do I need to write my own copy?",
    answer:
      "No. Our AI analyzes your competitors, local market, and specific business type to write high-converting, SEO-optimized copy tailored exactly for your audience.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
}: {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const controls = animate(from, to, {
        duration: duration,
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = `${prefix}${Math.round(value).toLocaleString()}${suffix}`;
          }
        },
      });
      return controls.stop;
    }
  }, [from, to, duration, isInView, prefix, suffix]);

  return (
    <span ref={nodeRef}>
      {prefix}
      {from}
      {suffix}
    </span>
  );
}

function PricingReveal() {
  const [revealed, setRevealed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const resetScratch = () => {
    setIsResetting(true);
    setTimeout(() => {
      setRevealed(false);
      setIsResetting(false);
    }, 400);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || revealed) return;

    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Fill the scratchable layer
      ctx.fillStyle = "#18181b"; // zinc-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add a cool pattern or gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height,
      );
      gradient.addColorStop(0, "#27272a");
      gradient.addColorStop(1, "#18181b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw text
      ctx.fillStyle = "#e4e4e7"; // zinc-200
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const drawText = (
        text: string,
        y: number,
        font: string,
        maxWidthOffset = 60,
      ) => {
        ctx.font = font;
        const words = text.split(" ");
        let line = "";
        let currentY = y;
        const maxWidth = canvas.width - maxWidthOffset;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, canvas.width / 2, currentY);
            line = words[n] + " ";
            currentY += parseInt(font, 10) * 1.5;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, canvas.width / 2, currentY);
        return currentY;
      };

      let startY = canvas.height / 2 - 80;
      startY = drawText(
        "So, what happens after your Free Prototype?",
        startY,
        "bold 28px Inter, sans-serif",
      );
      startY += 40;
      ctx.fillStyle = "#a1a1aa";
      startY = drawText(
        "Ready for your own domain, custom branding, and a multi-page setup?",
        startY,
        "18px Inter, sans-serif",
        100,
      );
      startY += 60;
      ctx.fillStyle = "#818cf8"; // indigo-400
      drawText(
        "✨ Scratch anywhere to reveal Growth Plans ✨",
        startY,
        "bold 20px Inter, sans-serif",
      );
    };

    // Need a small timeout to ensure container has dimensions
    setTimeout(resizeCanvas, 0);

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [revealed]);

  const checkPercentage = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    const pixels = ctx.getImageData(0, 0, width, height).data;
    let transparent = 0;
    // Check every 16th pixel (stride of 64 bytes) for performance
    for (let i = 3; i < pixels.length; i += 64) {
      if (pixels[i] < 128) {
        transparent++;
      }
    }
    const percent = transparent / (pixels.length / 64);
    const threshold = window.innerWidth < 768 ? 0.25 : 0.4;
    if (percent > threshold) {
      setRevealed(true);
      setPointerPos(null);
    }
  };

  const updatePointer = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPointerPos({ x, y });
  };

  const scratch = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = window.innerWidth < 768 ? 80 : 100;

    if (!isDrawing || !lastPos.current) {
      ctx.beginPath();
      ctx.arc(x, y, window.innerWidth < 768 ? 40 : 50, 0, Math.PI * 2);
      ctx.fill();
      lastPos.current = { x, y };
    } else {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastPos.current = { x, y };
    }

    if (Math.random() < 0.1) {
      checkPercentage(ctx, canvas.width, canvas.height);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDrawing(true);
    lastPos.current = null;
    updatePointer(e);
    scratch(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    updatePointer(e);
    if (isDrawing) scratch(e);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    lastPos.current = null;
    setPointerPos(null);
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-[500px]">
      <div className="flex justify-end mb-4 h-10">
        <AnimatePresence>
          {revealed && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={resetScratch}
              className="text-sm px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full hover:text-white hover:border-zinc-700 transition-colors z-30"
            >
              Reset Scratchpad
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!revealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 top-14 w-full h-[calc(100%-3.5rem)] z-20 rounded-[2rem] shadow-2xl border border-zinc-800 overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="w-full h-full touch-none cursor-crosshair"
            />
            {pointerPos && (
              <div
                className="absolute pointer-events-none rounded-full w-32 h-32 blur-[40px] bg-indigo-500/40 mix-blend-screen transition-opacity duration-200"
                style={{
                  left: pointerPos.x,
                  top: pointerPos.y,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Pricing Plans underneath */}
      <motion.div
        animate={{ opacity: isResetting ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="grid lg:grid-cols-2 gap-6 w-full h-full relative z-10 mb-6"
      >
        {/* Plan 1 */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative flex flex-col">
          <div className="mb-8 flex-1">
            <div className="inline-block px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold font-mono uppercase tracking-widest rounded-full mb-4">
              Core Launch Package
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-display font-bold text-white">
                $299
              </span>
              <span className="text-zinc-400 pb-1">one-time</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">+$29</span>
              <span className="text-zinc-400 pb-1">/ month hosting & maintenance</span>
            </div>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
              For businesses ready to take their approved prototype live with a custom domain, fast hosting, and local presence.
            </p>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              "Custom Domain Connection & SSL",
              "Ultra-Fast Global Cloud Infrastructure",
              "Full Prototype Customization & Polish",
              "Local SEO & Search Indexing Setup",
              "Ongoing Server & Security Maintenance",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span className="text-zinc-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="block w-full py-4 text-center bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Select Core Launch
          </a>
        </div>

        {/* Plan 2 */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] pointer-events-none rounded-full" />
          <div className="mb-8 flex-1 relative z-10">
            <div className="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono uppercase tracking-widest rounded-full mb-4">
              Full Growth Partner
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-display font-bold text-white">
                $499
              </span>
              <span className="text-zinc-400 pb-1">one-time</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">+$49</span>
              <span className="text-zinc-400 pb-1">/ month automations & tuning</span>
            </div>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
              Complete digital dominance with multi-channel lead funnels, automated email follow-ups, and social workflows.
            </p>
          </div>

          <ul className="space-y-4 mb-8 relative z-10">
            {[
              "Everything in Core Launch",
              "Multi-Page Custom Architecture",
              "Automated Email & SMS Follow-Up Workflows",
              "Social Media Content Distribution Setup",
              "High-Conversion Exit Capture & CRM Sync",
              "Priority 24/7 Support & Monthly Iterations",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                <span className="text-zinc-300 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="block w-full py-4 text-center bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors relative z-10"
          >
            Start With Free Prototype
          </a>
        </div>
      </motion.div>

      <div className="relative z-10 text-center">
        <p className="text-zinc-500 text-sm">
          Need a fully custom enterprise solution or e-commerce?{" "}
          <a
            href="#contact"
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors font-medium"
          >
            Contact our team to discuss your requirements.
          </a>
        </p>
      </div>
    </div>
  );
}

function ContactForm() {
  const [selectedGoal, setSelectedGoal] = useState("Website Redesign & Conversion Modernization");
  const [submittingStep, setSubmittingStep] = useState<number>(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [ticketId, setTicketId] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    website: "",
    notes: "",
  });

  const objectiveOptions = [
    { value: "Website Redesign & Conversion Modernization", label: "Complete High-Converting Website Redesign" },
    { value: "New Brand & Digital Authority Launch", label: "New Brand Launch & Digital Authority" },
    { value: "Automated Lead Capture & CRM Pipeline", label: "Automated Lead Funnel & CRM Pipeline" },
    { value: "Mobile Speed & Core Web Vitals Optimization", label: "Mobile Speed & SEO Core Web Vitals" },
    { value: "Custom Web Application / Booking Engine", label: "Custom Booking Engine / Portal System" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingStep(1);

    const generatedTicket = `MOX-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(generatedTicket);

    // Prepare lead data
    const leadPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      niche: formData.business.trim(),
      city: "",
      website: formData.website.trim(),
      notes: `Primary Objective: ${selectedGoal}${formData.notes ? ' | Notes: ' + formData.notes : ''} | Ticket: #${generatedTicket}`,
      status: 'Qualified',
      source: 'Landing Page Free Prototype Request',
      createdAt: Date.now(),
    };

    // Save to Firestore and local storage in parallel
    try {
      if (db) {
        await addDoc(collection(db, 'leads'), leadPayload);
      }
    } catch (err) {
      console.warn("Firestore sync warning (stored in local backup):", err);
    }

    try {
      const localBackups = JSON.parse(localStorage.getItem('mox_leads_backup') || '[]');
      localStorage.setItem('mox_leads_backup', JSON.stringify([leadPayload, ...localBackups]));
    } catch (err) {
      console.warn("Local storage warning:", err);
    }

    setTimeout(() => {
      setSubmittingStep(2);
    }, 800);

    setTimeout(() => {
      setSubmittingStep(3);
    }, 1600);

    setTimeout(() => {
      setSubmittingStep(0);
      setIsSuccess(true);
    }, 2400);
  };

  const isSubmitting = submittingStep > 0;

  return (
    <div className="relative">
      {/* Background glow behind form */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-rose-500/20 rounded-[2rem] blur-xl opacity-50 pointer-events-none" />

      <div className="relative bg-zinc-950/90 backdrop-blur-2xl border border-zinc-800/90 rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-6 flex flex-col items-center justify-center text-center px-2 sm:px-4"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <CheckCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
                Ticket #{ticketId || "MOX-8821"} Confirmed
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
                Your Free Prototype Is In Motion!
              </h3>
              <p className="text-zinc-400 max-w-md text-sm sm:text-base leading-relaxed mb-6">
                Our engineering engine has queued your business analysis. We will deliver your live interactive prototype link to <strong className="text-white font-semibold">{formData.email || "your email"}</strong> within 24–48 hours.
              </p>

              <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 mb-6 text-left space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800/80 pb-2">
                  <span className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Clock className="w-4 h-4 text-indigo-400" /> Turnaround Time
                  </span>
                  <span className="font-mono text-indigo-300 font-bold">24–48 Hours</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800/80 pb-2">
                  <span className="flex items-center gap-2 text-zinc-300 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Upfront Cost
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">$0.00 (Zero Risk)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Zap className="w-4 h-4 text-amber-400" /> Objective
                  </span>
                  <span className="font-mono text-zinc-300 text-right truncate max-w-[180px]">{selectedGoal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ name: "", email: "", business: "", website: "", notes: "" });
                }}
                className="text-xs font-mono tracking-wider uppercase text-zinc-400 hover:text-white px-5 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              {/* Step 1: Goal Select Dropdown */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  1. Select Primary Objective
                </label>
                <div className="relative">
                  <select
                    value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full appearance-none bg-zinc-900/80 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all disabled:opacity-50 cursor-pointer pr-10"
                  >
                    {objectiveOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white py-2">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Step 2: Information Inputs */}
              <div className="space-y-4">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
                  2. Business & Contact Information
                </label>
                
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all disabled:opacity-50"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Business / Work Email *</label>
                    <input
                      type="email"
                      placeholder="alex@yourcompany.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Company Name / Industry *</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Dental, Horizon Roofing"
                      value={formData.business}
                      onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all disabled:opacity-50"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-400">Current Website URL (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. yourbrand.com (if any)"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Specific Requirements or Competitor URLs (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Tell us any specific features, competitors you admire, or goals..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    disabled={isSubmitting}
                    className="w-full bg-zinc-900/70 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all disabled:opacity-50 resize-none"
                  />
                </div>
              </div>

              {/* Turnaround Badge with Interactive Tooltip */}
              <div className="relative pt-1 flex items-center justify-between bg-zinc-900/40 border border-zinc-800/70 rounded-xl p-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Turnaround: <strong className="text-white font-semibold">24–48 Hours</strong></span>
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTooltip(!showTooltip)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="flex items-center gap-1 text-zinc-400 hover:text-indigo-300 transition-colors text-[11px] cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="hidden sm:inline">Traffic Queue Info</span>
                  </button>

                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 bottom-full mb-2 w-64 p-2.5 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-30 text-[11px] text-zinc-300 leading-snug"
                      >
                        <div className="font-semibold text-white mb-1 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> Prototype Queue Notice
                        </div>
                        Delivery is typically 24 to 48 hours depending on live incoming prototype queue volume. Each prototype is custom engineered.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit CTA with multi-phase animation */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(99,102,241,0.3)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)] disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer"
                >
                  {submittingStep === 1 ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>1/3 Analyzing Market & Competitors...</span>
                    </>
                  ) : submittingStep === 2 ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-purple-300" />
                      <span>2/3 Engineering Live Architecture...</span>
                    </>
                  ) : submittingStep === 3 ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin text-emerald-300" />
                      <span>3/3 Queuing 24–48h Delivery Link...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                      <span>Build My Free Working Prototype (Zero Risk)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges below button */}
              <div className="pt-1 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Free Upfront
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-400" /> No Credit Card Required
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" /> 24–48h Turnaround
                </span>
              </div>
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-2xl overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
          >
            <h4 className="text-lg font-bold text-white">{faq.question}</h4>
            <motion.div
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5 text-zinc-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-6 pb-4 pt-2 border-t border-zinc-800/50 mt-2 mx-6">
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

export function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Only display automatically if not previously shown in this session
    try {
      return sessionStorage.getItem("mox_splash_shown") !== "true";
    } catch {
      return false;
    }
  });

  const handleSplashComplete = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem("mox_hunter_splash_seen", "true");
      sessionStorage.setItem("mox_splash_shown", "true");
    } catch {
      // ignore
    }
  };

  const handleReplayIntro = () => {
    setShowSplash(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownPopup) {
        setShowExitPopup(true);
        setHasShownPopup(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShownPopup]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30 overflow-clip">
      {/* Cinematic Entrance Splash Screen */}
      <AnimatePresence>
        {showSplash && <EntranceSplash onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {/* Announcement Banner */}
      <div className="relative z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 px-4 py-2 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{ x: ["-100vw", "100vw"] }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          className="absolute inset-y-0 left-0 bg-white/20 skew-x-12 w-1/4 sm:w-64"
        />
        <p className="text-xs sm:text-sm font-medium text-white text-center flex items-center gap-2 relative z-10">
          <Sparkles className="w-4 h-4" />
          Excited to announce that MO-X is now officially partnered with{" "}
          <strong>INFINI-T Enterprises</strong>
        </p>
      </div>

      {/* Navigation */}
      <nav className="sticky top-2 sm:top-4 z-40 max-w-7xl mx-auto px-3 sm:px-6 transition-all duration-300 mt-2 sm:mt-3 mb-2 sm:mb-4">
        <div className="bg-zinc-950/85 backdrop-blur-xl border border-white/10 rounded-full h-15 sm:h-16 flex items-center justify-between px-4 sm:px-6 shadow-2xl">
          <a href="#" className="flex items-center gap-3 group cursor-pointer">
            <LogoFull className="h-7 sm:h-9" />
          </a>
          <div className="flex items-center gap-2 sm:gap-6">
            <a
              href="#compare"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block"
            >
              The New Way
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block"
            >
              How It Works
            </a>
            <a
              href="#services"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block"
            >
              What We Build
            </a>
            <a
              href="#roadmap"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden lg:block"
            >
              Go Live & Scale
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block"
            >
              FAQ
            </a>
            <a
              href="#contact"
              className="text-xs sm:text-sm font-bold bg-white text-black px-4 sm:px-6 py-2 rounded-full hover:bg-zinc-200 transition-all flex items-center gap-1.5 sm:gap-2 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <span>Free Prototype</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-4 sm:pt-8 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Dynamic Background Grid & Ambient Glows */}
        <div className="absolute inset-0 bg-grid-zinc/[0.03] bg-[size:32px_32px] pointer-events-none" />
        <motion.div
          style={{ y: y1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-[120px] rounded-full pointer-events-none"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-rose-500/10 blur-[100px] rounded-full pointer-events-none"
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Framer-Style Social Proof Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-1.5 rounded-full bg-zinc-900/70 border border-zinc-800/90 backdrop-blur-md mb-6 sm:mb-8 shadow-[0_0_25px_rgba(0,0,0,0.6)]"
          >
            {/* Avatar Group */}
            <div className="flex items-center -space-x-2">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&auto=format&fit=crop&q=80",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Client"
                  className="w-6 h-6 rounded-full border-2 border-zinc-950 object-cover"
                />
              ))}
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <span className="text-[11px] sm:text-xs font-medium text-zinc-300">
              Rated <strong className="text-white font-semibold">4.9/5</strong> by 140+ Founders
            </span>
          </motion.div>

          {/* Main Headline (Laser-Focused 2 Lines) */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-5 leading-[1.1] text-white max-w-5xl mx-auto"
          >
            See Your Working Prototype Live.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400">
              Before Spending A Single Dollar.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal"
          >
            Stop gambling thousands on slow agencies with broken promises. We engineer and host your custom, interactive prototype within 24–48 hours — 100% free with zero upfront commitment.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 sm:mb-10"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2 relative overflow-hidden group shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-shadow cursor-pointer"
            >
              <Monitor className="w-5 h-5" />
              <span>Claim Free Working Prototype</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <a
              href="#guarantees"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900/60 border border-zinc-800 text-zinc-300 font-semibold rounded-full hover:bg-zinc-850 hover:border-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Explore Our Process
            </a>
          </motion.div>

          {/* Interactive Hero Visual (3D Multi-Layered Laser Prototype) */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.45, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-5xl mx-auto mt-4"
          >
            {/* Desktop 3D Layered Mockup */}
            <div className="hidden sm:flex justify-center items-center h-[390px] relative">
              {/* Back Card (Abstract Code & Automation Engine) */}
              <motion.div
                animate={{ y: [-8, 8, -8], rotateZ: [-2, -2, -2] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                className="absolute w-[580px] h-[330px] bg-zinc-950/90 backdrop-blur-xl border border-zinc-800/90 rounded-3xl p-6 shadow-2xl -translate-x-28 -translate-y-8 opacity-70 z-0 text-left font-mono text-xs"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  <span className="text-[10px] text-zinc-500 ml-2">mox-prototype-engine.ts</span>
                </div>
                <div className="space-y-2 text-indigo-300/80">
                  <p className="text-zinc-500">// Step 1: Scan competitor conversion gaps</p>
                  <p><span className="text-purple-400">const</span> analysis = <span className="text-purple-400">await</span> MoX.scan(<span className="text-emerald-300">'industry_leaders'</span>);</p>
                  <p className="text-zinc-500 pt-1">// Step 2: Generate high-speed interactive UI</p>
                  <p><span className="text-purple-400">const</span> prototype = <span className="text-purple-400">await</span> MoX.buildInteractive(analysis);</p>
                  <p className="text-emerald-400 font-semibold">deploy(prototype); // Deployed in 0.04s — $0 Upfront</p>
                  <div className="mt-6 space-y-2 opacity-50">
                    <div className="h-2 w-3/4 bg-zinc-800 rounded" />
                    <div className="h-2 w-1/2 bg-zinc-800 rounded" />
                    <div className="h-2 w-5/6 bg-zinc-800 rounded" />
                  </div>
                </div>
              </motion.div>

              {/* Front Main Card (Live Generated UI Mockup with Laser Scan) */}
              <motion.div
                animate={{ y: [8, -8, 8], rotateZ: [1, 1, 1] }}
                transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                className="absolute w-[640px] h-[360px] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700/80 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 ml-24 text-left"
              >
                {/* Browser Header Bar */}
                <div className="h-11 border-b border-zinc-800/80 bg-zinc-900/90 flex items-center px-5 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="w-1/2 h-6 bg-zinc-950 rounded-md border border-zinc-800 flex items-center justify-center gap-1.5 px-3">
                    <Lock className="w-2.5 h-2.5 text-emerald-400" />
                    <span className="text-[10px] font-mono text-zinc-400 truncate">
                      https://preview.moxhunter.com/your-brand
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </div>
                </div>

                {/* Inner Mock Visual */}
                <div className="p-6 flex flex-col gap-4 relative">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                        YB
                      </div>
                      <div className="w-24 h-4 bg-zinc-800 rounded" />
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="w-14 h-3 bg-zinc-800 rounded hidden sm:block" />
                      <div className="w-14 h-3 bg-zinc-800 rounded hidden sm:block" />
                      <div className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold">
                        Book Service
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-2">
                    <div className="w-3/4 h-8 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg" />
                    <div className="w-1/2 h-3.5 bg-zinc-800/80 rounded" />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="h-24 bg-zinc-900/90 rounded-xl border border-zinc-800 p-3 flex flex-col justify-between">
                      <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-zinc-700 rounded" />
                        <div className="w-2/3 h-1.5 bg-zinc-800 rounded" />
                      </div>
                    </div>

                    <div className="h-24 bg-zinc-900/90 rounded-xl border border-zinc-800 p-3 flex flex-col justify-between">
                      <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <Zap className="w-3 h-3 text-indigo-400" />
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-zinc-700 rounded" />
                        <div className="w-2/3 h-1.5 bg-zinc-800 rounded" />
                      </div>
                    </div>

                    <div className="h-24 bg-indigo-500/10 rounded-xl border border-indigo-500/30 p-3 relative overflow-hidden flex flex-col justify-between">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 text-indigo-300" />
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-indigo-400/50 rounded" />
                        <div className="w-2/3 h-1.5 bg-indigo-400/30 rounded" />
                      </div>
                    </div>
                  </div>

                  {/* Scanning Laser */}
                  <motion.div
                    animate={{ top: ["5%", "95%", "5%"] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-0.5 bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,1)] z-20 pointer-events-none"
                  />
                </div>
              </motion.div>

              {/* Floating Action Badge */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="absolute z-30 -bottom-4 -right-2 bg-zinc-900/95 border border-zinc-700 rounded-2xl p-3.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white uppercase tracking-wide">
                    Prototype Active
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Ready for client preview
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Mobile Fallback Card */}
            <div className="sm:hidden bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-left shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ● LIVE PROTOTYPE
                </span>
              </div>
              <div className="h-6 w-3/4 bg-zinc-800 rounded" />
              <div className="h-3 w-1/2 bg-zinc-850 rounded" />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800 text-xs">
                  <div className="font-bold text-white">4.9 ★★★★★</div>
                  <div className="text-[10px] text-zinc-400">High-Trust Rating</div>
                </div>
                <div className="bg-indigo-950/40 p-2.5 rounded-xl border border-indigo-500/30 text-xs">
                  <div className="font-bold text-indigo-300">24–48h Ready</div>
                  <div className="text-[10px] text-zinc-400">$0 Upfront</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4 Dedicated Core Guarantees & Performance Pillars Section */}
      <section id="guarantees" className="py-16 sm:py-20 px-4 sm:px-6 relative z-10 border-t border-zinc-800/60 bg-zinc-950/60 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              The 4 Pillars of MoX Hunter
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white mb-3">
              Engineered For Speed, Proof, and Conversion
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
              We replaced traditional agency friction with instant, transparent architecture.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pillar 1: 24-48h Delivery */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 mb-1">
                24–48h Turnaround
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Rapid Deployment</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Receive your live interactive prototype link fast, custom-tailored to your exact niche and business goals.
              </p>
            </motion.div>

            {/* Pillar 2: $0 Upfront Risk */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
                $0 Upfront Cost
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% Risk Free</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Zero deposits, zero credit card requirements. Test the real product on your phone and computer before committing.
              </p>
            </motion.div>

            {/* Pillar 3: +310% Leads */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-1">
                +310% Lead Lift
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Conversion Architecture</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Engineered with psychology-backed conversion triggers, frictionless inquiry capture, and automated sync.
              </p>
            </motion.div>

            {/* Pillar 4: 99+ Speed */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-1">
                99+ Core Vitals
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Load Speed</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Sub-second loading times on all mobile networks with zero bloat and modern edge CDN distribution.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof (Marquee Style) */}
      <section className="py-12 border-y border-zinc-800/50 bg-zinc-950/50 relative z-10 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

        <p className="text-center text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-8">
          Trusted by elite local businesses
        </p>

        <div className="flex justify-center gap-16 opacity-40 grayscale items-center flex-wrap px-6">
          <div className="flex items-center gap-3 font-display font-bold text-xl">
            <div className="w-6 h-6 rounded-full bg-white" /> Apex Auto
          </div>
          <div className="flex items-center gap-3 font-display font-bold text-xl">
            <div className="w-6 h-6 rounded bg-white" /> Bloom Cafe
          </div>
          <div className="flex items-center gap-3 font-display font-bold text-xl">
            <div className="w-6 h-6 rotate-45 bg-white" /> Elite Roofing
          </div>
          <div className="flex items-center gap-3 font-display font-bold text-xl">
            <div className="w-6 h-6 rounded-tl-xl rounded-br-xl bg-white" />{" "}
            NextGen Plumbers
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-24 px-6 relative z-10 bg-zinc-900/10 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
              Comprehensive Growth Suite
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4 text-white">
              What We Build & Scale
            </h2>
            <p className="text-zinc-400 max-w-2xl text-lg">
              High-end digital infrastructure and automated workflows priced transparently in the hundreds per project scope — never inflated agency retainers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: High-End Custom Web Development */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all duration-500 group relative overflow-hidden shadow-[0_0_0_rgba(99,102,241,0)] hover:shadow-[0_0_35px_rgba(99,102,241,0.18)]"
            >
              {/* Subtle background glow & abstract geometry on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors relative z-10">
                <Globe className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">
                High-End Web Architecture
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm relative z-10">
                Bespoke, lightning-fast web experiences engineered with modern UI/UX, responsive mobile design, and high-converting layouts tailored specifically to your brand.
              </p>
            </motion.div>

            {/* Card 2: Social Media & Growth Automations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 hover:border-rose-500/50 hover:bg-zinc-900/80 transition-all duration-500 group relative overflow-hidden shadow-[0_0_0_rgba(225,29,72,0)] hover:shadow-[0_0_35px_rgba(225,29,72,0.18)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-500/20 group-hover:border-rose-500/30 transition-colors relative z-10">
                <Share2 className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">
                Social Media & Growth Automations
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm relative z-10">
                Omnipresent content pipelines, automated multi-channel publishing workflows, and engagement systems that keep your brand commanding attention hands-free.
              </p>
            </motion.div>

            {/* Card 3: Intelligent Email & Follow-Up Engines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all duration-500 group relative overflow-hidden shadow-[0_0_0_rgba(99,102,241,0)] hover:shadow-[0_0_35px_rgba(99,102,241,0.18)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors relative z-10">
                <Mail className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">
                Intelligent Email & Follow-Up Funnels
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm relative z-10">
                Behavioral email follow-ups, automated objection handling, and appointment booking triggers that convert cold inquiries into signed clients.
              </p>
            </motion.div>

            {/* Card 4: High-Converting Ads & Visual Campaigns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 hover:border-amber-500/50 hover:bg-zinc-900/80 transition-all duration-500 group relative overflow-hidden shadow-[0_0_0_rgba(245,158,11,0)] hover:shadow-[0_0_35px_rgba(245,158,11,0.18)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-colors relative z-10">
                <Megaphone className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">
                High-Impact Ad Creatives & Video
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm relative z-10">
                High-conversion ad assets, retargeting sequences, and creative campaigns built to dominate local market share — priced in the hundreds, never agency thousands.
              </p>
            </motion.div>

            {/* Card 5: Brand Identity & Custom Visual Design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 hover:border-purple-500/50 hover:bg-zinc-900/80 transition-all duration-500 group relative overflow-hidden shadow-[0_0_0_rgba(168,85,247,0)] hover:shadow-[0_0_35px_rgba(168,85,247,0.18)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-colors relative z-10">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">
                Brand Identity & UI/UX Assets
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm relative z-10">
                Distinctive modern logos, clean typography systems, bespoke vector iconography, and design guidelines that command instant credibility and client trust.
              </p>
            </motion.div>

            {/* Card 6: Conversion Optimization & Lead Capture */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-zinc-950/60 backdrop-blur-md border border-zinc-800/80 rounded-3xl p-8 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all duration-500 group relative overflow-hidden shadow-[0_0_0_rgba(16,185,129,0)] hover:shadow-[0_0_35px_rgba(16,185,129,0.18)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-colors relative z-10">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">
                Lead Capture & Conversion Systems
              </h3>
              <p className="text-zinc-400 leading-relaxed text-sm relative z-10">
                Smart exit-intent mechanisms, interactive business audit widgets, and direct CRM sync that ensure zero lost opportunities from your visitor traffic.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Pain Agitation (Old Way vs New Way) */}
      <section id="compare" className="py-24 px-6 relative z-10 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              The Old Agency Way vs. The MoX Hunter Standard
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Stop paying thousands upfront before seeing a single page. Experience the solution live first.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-300">
                  Legacy Agency Retainers
                </h3>
              </div>
              <ul className="space-y-4 text-zinc-400 font-medium">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />{" "}
                  High upfront costs ($3k-$10k+) before seeing any tangible work.
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />{" "}
                  Slow delivery times dragging out over weeks or months.
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />{" "}
                  Clunky templates that blend in with your local competitors.
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />{" "}
                  Requires endless meetings and technical management on your end.
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-indigo-500/10 via-zinc-900/40 to-zinc-950/80 backdrop-blur-xl border border-indigo-500/30 hover:border-indigo-500/50 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.1)] hover:shadow-[0_0_50px_rgba(99,102,241,0.2)] transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-3 mb-8 relative z-10 flex-wrap">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] shrink-0">
                  <Check className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  The MoX Hunter Standard
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-widest bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] ml-auto">
                  Prototype First • 100% Free
                </span>
              </div>
              <ul className="space-y-4 text-zinc-200 font-medium relative z-10">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />{" "}
                  Interactive, fully functional working prototype delivered upfront.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />{" "}
                  Rapid turnaround delivered to your inbox in 24 hours.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />{" "}
                  High-end bespoke architecture tuned specifically for client conversions.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />{" "}
                  Transparent launch pricing in the hundreds, only when you approve the result.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The 3-Step Mechanism */}
      <section id="how-it-works" className="py-24 px-6 bg-zinc-900/20 border-y border-zinc-800/50 relative z-10 overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-grid-zinc/[0.02] bg-[size:32px_32px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
              Clear & Risk-Free
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-6 text-white tracking-tight">
              3 Steps From Vision To Reality
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
              We eliminate client risk by engineering and delivering your live working prototype upfront.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-[2px] bg-gradient-to-r from-zinc-800 via-indigo-500/50 to-zinc-800 -z-10" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 rounded-[2rem] p-8 relative group"
            >
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-8 text-zinc-400 font-mono font-bold text-xl group-hover:scale-110 group-hover:text-white transition-all duration-300">
                01
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <Cpu className="w-6 h-6 text-indigo-400" /> 1. Share Your Vision
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Provide basic details about your business and ideal audience. Our intelligent systems map your local competition and identify high-converting angles.
              </p>

              {/* Decorative mini-UI */}
              <div className="mt-8 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <div className="text-xs text-zinc-500 font-mono">
                    Analyzing market gaps & keywords...
                  </div>
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-indigo-500 h-full w-2/3"
                    animate={{ width: ["0%", "100%", "100%"] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-gradient-to-b from-indigo-500/10 to-zinc-950 border border-indigo-500/30 hover:border-indigo-500/50 rounded-[2rem] p-8 relative shadow-[0_0_40px_rgba(99,102,241,0.1)] group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none" />
              <div className="w-16 h-16 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-8 text-indigo-300 font-mono font-bold text-xl group-hover:scale-110 group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                02
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <Code2 className="w-6 h-6 text-indigo-400" /> 2. Test Prototype Live
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                We generate and host a fully interactive, working prototype within 24 hours. You test real functionality, layout, and copy with 100% zero obligation.
              </p>

              {/* Decorative mini-UI */}
              <div className="mt-8 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="space-y-2">
                  <div className="w-full h-2 bg-indigo-500/20 rounded-full" />
                  <div className="w-3/4 h-2 bg-indigo-500/20 rounded-full" />
                  <div className="w-5/6 h-2 bg-indigo-500/20 rounded-full" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700 rounded-[2rem] p-8 relative group"
            >
              <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-8 text-zinc-400 font-mono font-bold text-xl group-hover:scale-110 group-hover:text-white transition-all duration-300">
                03
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                <Rocket className="w-6 h-6 text-indigo-400" /> 3. Go Live & Scale
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Only when you love the prototype do we connect your custom domain, activate lead automations, and manage your continuous growth systems.
              </p>

              {/* Decorative mini-UI */}
              <div className="mt-8 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 flex items-center justify-between">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-1 h-4 bg-zinc-700 rounded-full">
                      <motion.div
                        className="w-full bg-green-500 rounded-full"
                        initial={{ height: "0%" }}
                        animate={{ height: `${Math.random() * 100}%` }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatType: "mirror",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="text-xs font-bold text-green-400">
                  CONVERSION READY
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Free Prototype Pitch & Heavy Quote */}
      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none opacity-[0.03]" />

        {/* Social Proof / Reviews Grid */}
        <div className="max-w-6xl mx-auto relative z-10 mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              Don't Take Our Word For It
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Hear from businesses that let our AI handle their growth.
            </p>
          </div>

          {/* Dynamic Counters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mb-16"
          >
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                <AnimatedCounter from={0} to={142} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm text-zinc-500 uppercase tracking-widest font-mono font-medium">
                Businesses Empowered
              </div>
            </div>
            <div className="hidden sm:block w-px h-16 bg-zinc-800/50" />
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 tracking-tight">
                <AnimatedCounter from={0} to={12450} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm text-zinc-500 uppercase tracking-widest font-mono font-medium">
                Hours Saved
              </div>
            </div>
            <div className="hidden sm:block w-px h-16 bg-zinc-800/50" />
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-display font-bold text-white mb-2 tracking-tight text-indigo-400">
                <AnimatedCounter
                  from={0}
                  to={4.2}
                  prefix="$"
                  suffix="M"
                  duration={2.5}
                />
              </div>
              <div className="text-xs sm:text-sm text-zinc-500 uppercase tracking-widest font-mono font-medium">
                Revenue Generated
              </div>
            </div>
          </motion.div>

          <TestimonialCarousel />
        </div>

        {/* FAQ Section */}
        <div id="faq" className="max-w-4xl mx-auto relative z-10 mb-32 scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Everything you need to know about the MO-X system.
            </p>
          </div>

          <FaqAccordion />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto relative z-10 bg-gradient-to-br from-indigo-500/20 via-zinc-900/80 to-rose-500/10 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 sm:p-20 text-center overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.15)]"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/30 blur-[120px] pointer-events-none" />

          <h2 className="text-4xl sm:text-6xl font-display font-bold mb-6 text-white relative z-10 tracking-tight">
            Stop Waiting. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              Start Dominating.
            </span>
          </h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto relative z-10 font-light">
            Your leads are searching for you online right now—but finding your
            competitors. Claim your free, custom-built AI prototype today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 relative z-10">
            <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-5 py-2.5 rounded-xl border border-zinc-800 shadow-xl">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-sm text-zinc-200">
                No Credit Card
              </span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-5 py-2.5 rounded-xl border border-zinc-800 shadow-xl">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              <span className="font-medium text-sm text-zinc-200">
                Delivered in 24h
              </span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-5 py-2.5 rounded-xl border border-zinc-800 shadow-xl">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-sm text-zinc-200">
                Zero Obligation
              </span>
            </div>
          </div>

          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0px 0px 0px rgba(255,255,255,0)",
                "0px 0px 40px rgba(255,255,255,0.3)",
                "0px 0px 0px rgba(255,255,255,0)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="relative z-10 px-12 py-5 bg-white text-black font-bold text-lg rounded-full flex items-center justify-center gap-3 mx-auto max-w-sm group overflow-hidden"
          >
            <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <Play className="w-5 h-5 relative z-10 group-hover:text-indigo-600 transition-colors" />
            <span className="relative z-10">Request Free Prototype Now</span>
          </motion.a>
        </motion.div>
      </section>

      {/* The Roadmap & Pricing */}
      <section
        id="roadmap"
        className="py-24 px-6 bg-zinc-950 relative z-10 border-t border-zinc-800 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
              Transparent & Measurable
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4 text-white">
              From Free Prototype to Full Launch
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              A transparent, risk-free path to dominating your local market — no locked retainers or hidden agency fees.
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-20 space-y-8">
            {/* Steps */}
            <div className="flex flex-col sm:flex-row gap-8 relative">
              <div className="hidden sm:block absolute top-6 left-12 right-12 h-px bg-zinc-800" />

              <div className="flex-1 relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mb-4 bg-zinc-950">
                  <span className="text-indigo-400 font-bold font-mono">
                    01
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  1. Free Prototype Delivery
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  We build and host a live working prototype tailored to your brand in 24 hours. You review real functionality with 100% zero upfront cost.
                </p>
              </div>

              <div className="flex-1 relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mb-4 bg-zinc-950">
                  <span className="text-zinc-400 font-bold font-mono">02</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  2. Review & Fine-Tune
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Test your interactive prototype link on all devices. If you decide not to proceed, keep your free preview link with zero strings attached.
                </p>
              </div>

              <div className="flex-1 relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mb-4 bg-zinc-950">
                  <span className="text-zinc-400 font-bold font-mono">03</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  3. Production Launch & Scale
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  When you approve, we connect your custom domain, launch automations, and manage your continuous growth — priced in hundreds, not thousands.
                </p>
              </div>
            </div>
          </div>

          <PricingReveal />
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        id="contact"
        className="py-20 sm:py-28 px-4 sm:px-6 bg-zinc-900/30 relative z-10 border-t border-zinc-800/60 scroll-mt-20 overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
              100% Free • Zero Financial Lock-In
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4 text-white">
              Request Your Free Working Prototype
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Tell us about your business. We engineer your live, interactive prototype and deliver a private demo link within 24–48 hours so you can test the real solution before spending $1.
            </p>
          </div>

          {/* 2-Column Landing Section: Visual Showcase Left + Contact Form Right */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Visual Showcase & Delivery Pipeline */}
            <div className="lg:col-span-5 space-y-6">
              {/* Visual Prototype Preview Card */}
              <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

                {/* Mockup Window */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden mb-6 shadow-lg">
                  <div className="h-9 bg-zinc-950 px-3.5 flex items-center justify-between border-b border-zinc-800">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[180px]">
                      preview.moxhunter.com/demo
                    </span>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <div className="p-4 space-y-3 bg-gradient-to-b from-zinc-900 to-zinc-950">
                    <div className="flex items-center justify-between">
                      <div className="w-20 h-4 bg-zinc-800 rounded" />
                      <div className="w-16 h-5 bg-indigo-600/30 border border-indigo-500/40 rounded text-[9px] font-mono text-indigo-300 flex items-center justify-center font-bold">
                        Interactive
                      </div>
                    </div>
                    <div className="h-6 w-4/5 bg-zinc-800 rounded" />
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="h-14 bg-zinc-850 rounded-xl border border-zinc-800 p-2 space-y-1">
                        <div className="w-1/2 h-2 bg-zinc-700 rounded" />
                        <div className="w-3/4 h-2 bg-zinc-750 rounded" />
                      </div>
                      <div className="h-14 bg-indigo-950/40 rounded-xl border border-indigo-500/30 p-2 space-y-1">
                        <div className="w-1/2 h-2 bg-indigo-400 rounded" />
                        <div className="w-3/4 h-2 bg-indigo-300/60 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3 Step Delivery Process */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                    What Happens Once You Submit:
                  </h4>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                        1
                      </div>
                      <div>
                        <strong className="text-white block font-semibold text-xs sm:text-sm">Competitor & Conversion Scan</strong>
                        <p className="text-zinc-400 text-[11px] sm:text-xs">We analyze top-performing players in your market to identify your biggest revenue gaps.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                        2
                      </div>
                      <div>
                        <strong className="text-white block font-semibold text-xs sm:text-sm">Interactive Prototype Built</strong>
                        <p className="text-zinc-400 text-[11px] sm:text-xs">A real, clickable web prototype is deployed with high-speed architecture.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                        3
                      </div>
                      <div>
                        <strong className="text-white block font-semibold text-xs sm:text-sm">24–48h Private Delivery Link</strong>
                        <p className="text-zinc-400 text-[11px] sm:text-xs">Test it on your smartphone or desktop. No credit card, no pressure, no sales traps.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Proof Quote */}
                <div className="mt-6 pt-5 border-t border-zinc-800/80">
                  <div className="flex items-center gap-1 text-amber-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-zinc-300 italic mb-2 leading-relaxed">
                    "Seeing our actual business interactive prototype before paying made this a total no-brainer. Closed 6 new high-ticket clients in our first week."
                  </p>
                  <p className="text-[11px] font-mono text-zinc-500">
                    — Marcus V., Founder at Apex Mechanical
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 sm:py-16 px-4 sm:px-6 border-t border-zinc-800/80 relative z-10 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 pb-8 border-b border-zinc-800/80">
            <div className="flex flex-col items-center md:items-start gap-3 max-w-md">
              <LogoFull className="h-8 sm:h-9" />
              <p className="text-sm text-zinc-300 text-center md:text-left leading-relaxed">
                MoX Hunter is the proof-first growth platform. We engineer and host your working digital prototype in 24 hours — 100% free with zero financial lock-in.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Zero Risk • Free 24h Working Prototype
              </div>
            </div>

            {/* Quick Links with Enhanced Legibility & Pop */}
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-sm font-medium">
              <a
                href="#compare"
                className="text-zinc-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
              >
                The New Way
              </a>
              <a
                href="#how-it-works"
                className="text-zinc-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
              >
                How It Works
              </a>
              <a
                href="#services"
                className="text-zinc-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
              >
                What We Build
              </a>
              <a
                href="#roadmap"
                className="text-zinc-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
              >
                Go Live
              </a>
              <a
                href="#faq"
                className="text-zinc-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 hover:bg-indigo-600/50 hover:text-white font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              >
                <span>Claim Free Prototype</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} MoX Hunter. All rights reserved. High-authority digital solutions.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors">
                Terms of Service
              </a>
              <button
                type="button"
                onClick={handleReplayIntro}
                className="text-zinc-300 hover:text-indigo-300 transition-colors font-medium flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 hover:border-indigo-500/40"
              >
                <Play className="w-3 h-3 fill-current text-indigo-400" />
                <span>Replay Wolf Intro</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowExitPopup(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />

              <button
                onClick={() => setShowExitPopup(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30">
                <Rocket className="w-6 h-6 text-indigo-400" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3 tracking-tight">
                Leaving so soon?
              </h3>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Get our free guide on how AI is replacing traditional marketing
                agencies in 2026. Learn the exact systems top local businesses
                are using to scale.
              </p>

              <form
                className="flex flex-col gap-3 relative z-10"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowExitPopup(false);
                }}
              >
                <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-indigo-500/50 focus-within:bg-zinc-800/50 transition-colors">
                  <Mail className="w-5 h-5 text-zinc-500 shrink-0" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-transparent border-none text-white focus:outline-none placeholder:text-zinc-600"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                >
                  Send Me The Guide
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-zinc-500 text-center mt-4 font-medium">
                We hate spam as much as you do.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
