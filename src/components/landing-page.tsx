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
} from "lucide-react";
import { Logo, WolfLogo } from "./logo";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

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
              Core Identity
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-display font-bold text-white">
                $299
              </span>
              <span className="text-zinc-400 pb-1">setup</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">+$29</span>
              <span className="text-zinc-400 pb-1">/ month</span>
            </div>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
              Perfect for businesses wanting to secure their brand, domain, and
              a professional one-page presence.
            </p>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              "Custom Domain Connection",
              "Premium Cloud Hosting",
              "Professional One-Page Site",
              "Basic SEO Setup",
              "Standard Support",
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
            Select Core
          </a>
        </div>

        {/* Plan 2 */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] pointer-events-none rounded-full" />
          <div className="mb-8 flex-1 relative z-10">
            <div className="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono uppercase tracking-widest rounded-full mb-4">
              Growth Partner
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl sm:text-5xl font-display font-bold text-white">
                $499
              </span>
              <span className="text-zinc-400 pb-1">setup</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-white">+$49</span>
              <span className="text-zinc-400 pb-1">/ month</span>
            </div>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
              Multi-page architecture and automation for businesses ready to
              capture leads and scale.
            </p>
          </div>

          <ul className="space-y-4 mb-8 relative z-10">
            {[
              "Everything in Core",
              "Multi-Page Architecture",
              "Continuous AI SEO Optimization",
              "Lead Capture Forms & Automation",
              "Priority Email & Chat Support",
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
            Get Started Now
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <form
      className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden"
      onSubmit={handleSubmit}
    >
      <AnimatePresence>
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-20 bg-zinc-950 flex flex-col items-center justify-center text-center px-6"
          >
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6">
              <Check className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Request Received!
            </h3>
            <p className="text-zinc-400 max-w-sm">
              Our AI is already analyzing your market. We'll be in touch with
              your prototype soon.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 gap-6 relative z-10">
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-400">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            disabled={isSubmitting}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-400">
            Email Address
          </label>
          <input
            type="email"
            placeholder="john@example.com"
            disabled={isSubmitting}
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            required
          />
        </div>
      </div>
      <div className="space-y-2 relative z-10">
        <label className="text-sm font-bold text-zinc-400">
          Business Type / Industry
        </label>
        <input
          type="text"
          placeholder="e.g. Auto Repair, Bakery, HVAC"
          disabled={isSubmitting}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
          required
        />
      </div>
      <div className="space-y-2 relative z-10">
        <label className="text-sm font-bold text-zinc-400">
          Current Website URL (Optional)
        </label>
        <input
          type="url"
          placeholder="https://yourwebsite.com"
          disabled={isSubmitting}
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
        />
      </div>
      <div className="pt-4 relative z-10">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Market...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
              Generate My Prototype
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-center text-zinc-500 font-medium relative z-10 mt-4">
        By submitting, you agree to receive emails regarding your prototype
        setup.
      </p>
    </form>
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
      <nav className="sticky top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-300 mt-4 mb-8">
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-full h-16 flex items-center justify-between px-6 shadow-2xl">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.15)] group-hover:shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all duration-500">
              <WolfLogo className="w-5 h-5 text-rose-500" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white hidden sm:block">
              MO-X Agency
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#compare"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block"
            >
              The New Way
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden md:block"
            >
              Free Prototype
            </a>
            <Link
              to="/login"
              className="text-sm font-bold bg-white text-black px-6 py-2 rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Client Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-20 px-6 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-grid-zinc/[0.04] bg-[size:32px_32px] pointer-events-none" />
        <motion.div
          style={{ y: y1 }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-500/10 blur-[100px] rounded-full pointer-events-none"
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="tracking-widest uppercase text-[10px] sm:text-xs font-semibold text-zinc-300">
              AI-Powered Digital Dominance
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tighter mb-8 leading-[1.05] text-white"
          >
            You Run Your Business.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
              AI Builds Your Website.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Your leads are buying right now—just not from you. Stop losing local
            market share to competitors with inferior services but a better
            digital presence. We build elite, AI-optimized websites. Zero
            upfront costs. Zero risk. Just aggressive growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0px 0px 0px rgba(99,102,241,0)",
                  "0px 0px 30px rgba(99,102,241,0.4)",
                  "0px 0px 0px rgba(99,102,241,0)",
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Monitor className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Claim Free Prototype</span>
            </motion.a>
            <a
              href="#services"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-700 text-zinc-300 font-bold rounded-full hover:bg-zinc-800 hover:border-zinc-600 transition-colors flex items-center justify-center gap-2"
            >
              See Our Services
            </a>
          </motion.div>

          {/* Interactive Hero Visual (Multi-layered 3D Cards) */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{
              delay: 0.5,
              duration: 1.5,
              type: "spring",
              bounce: 0.3,
            }}
            style={{ perspective: 2000 }}
            className="relative max-w-5xl mx-auto hidden sm:flex justify-center items-center h-[400px] mt-10"
          >
            {/* Back Card (Abstract Code) */}
            <motion.div
              animate={{ y: [-10, 10, -10], rotateZ: [-2, -2, -2] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute w-[600px] h-[350px] bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl -translate-x-32 -translate-y-10 opacity-60 z-0"
            >
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              </div>
              <div className="space-y-3 font-mono text-xs text-indigo-400/50">
                <p>import &#123; createPrototype &#125; from '@mox/ai';</p>
                <p className="pl-4">
                  const analyze = await marketAnalysis('local_roofing');
                </p>
                <p className="pl-4">
                  const design = await generateUI(analyze.competitors);
                </p>
                <p className="pl-4">deploy(design); // Time: 0.03s</p>
                <div className="mt-8 space-y-2">
                  <div className="h-2 w-3/4 bg-zinc-800/50 rounded" />
                  <div className="h-2 w-1/2 bg-zinc-800/50 rounded" />
                  <div className="h-2 w-5/6 bg-zinc-800/50 rounded" />
                </div>
              </div>
            </motion.div>

            {/* Middle Card (Generated UI) */}
            <motion.div
              animate={{ y: [10, -10, 10], rotateZ: [1, 1, 1] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="absolute w-[650px] h-[380px] bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700/50 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 ml-20"
            >
              <div className="h-12 border-b border-zinc-800/50 bg-zinc-900/50 flex items-center px-6 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <div className="w-1/2 h-6 bg-zinc-950 rounded-md border border-zinc-800 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-zinc-500">
                    https://prototype.yourbrand.com
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col gap-6 relative">
                <div className="flex justify-between items-center">
                  <div className="w-32 h-8 bg-zinc-800 rounded-lg" />
                  <div className="flex gap-3">
                    <div className="w-16 h-2 bg-zinc-800 rounded" />
                    <div className="w-16 h-2 bg-zinc-800 rounded" />
                    <div className="w-24 h-8 bg-indigo-500/20 rounded-lg border border-indigo-500/30" />
                  </div>
                </div>
                <div className="w-3/4 h-16 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-xl mt-4" />
                <div className="w-1/2 h-4 bg-zinc-800 rounded" />

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="h-32 bg-zinc-800/50 rounded-2xl border border-zinc-700/30 p-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 mb-4" />
                    <div className="w-full h-2 bg-zinc-700 rounded mb-2" />
                    <div className="w-2/3 h-2 bg-zinc-700 rounded" />
                  </div>
                  <div className="h-32 bg-zinc-800/50 rounded-2xl border border-zinc-700/30 p-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 mb-4" />
                    <div className="w-full h-2 bg-zinc-700 rounded mb-2" />
                    <div className="w-2/3 h-2 bg-zinc-700 rounded" />
                  </div>
                  <div className="h-32 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5 animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-indigo-500/40 mb-4" />
                    <div className="w-full h-2 bg-indigo-400/50 rounded mb-2" />
                    <div className="w-2/3 h-2 bg-indigo-400/50 rounded" />
                  </div>
                </div>

                {/* Scanning Laser */}
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] z-20"
                />
              </div>
            </motion.div>

            {/* Floating Action Badge */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute z-30 bottom-10 -right-10 bg-white border border-zinc-200 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-zinc-900 uppercase">
                  Prototype Ready
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  Sent to prospect email
                </p>
              </div>
            </motion.div>
          </motion.div>
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
        className="py-24 px-6 relative z-10 bg-zinc-900/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              What We Build
            </h2>
            <p className="text-zinc-400 max-w-2xl">
              Complete digital infrastructure designed for small businesses to
              dominate local markets.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 group shadow-[0_0_0_rgba(99,102,241,0)] hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
            >
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
                <Monitor className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                AI-Powered Websites
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Lightning-fast, highly-converting websites built specifically
                for your brand. AI optimizations keep it ranking high.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all duration-300 group shadow-[0_0_0_rgba(225,29,72,0)] hover:shadow-[0_0_30px_rgba(225,29,72,0.15)]"
            >
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rose-500/20 group-hover:border-rose-500/30 transition-colors">
                <Sparkles className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Social Media Automation
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Never worry about what to post. Our AI systems generate and
                schedule high-quality content that builds trust.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 group shadow-[0_0_0_rgba(99,102,241,0)] hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
            >
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
                <Mail className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                5-Day Follow-Up Sequences
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Instantly drop new leads into automated 5-day email sequences.
                We share social proof, handle objections, and push for the call.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 group shadow-[0_0_0_rgba(245,158,11,0)] hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
            >
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 transition-colors">
                <Play className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                UGC Video Retargeting
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                People don't buy on visit one. We run authentic, AI-generated
                video testimonials to retarget lost traffic and force
                conversions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 group shadow-[0_0_0_rgba(16,185,129,0)] hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-colors">
                <XCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Exit-Intent Capture
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                If a prospect tries to leave, we hit them with an irresistible
                "Free Guide" or "Free Audit" popup, securing their email for
                future marketing.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/80 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300 group shadow-[0_0_0_rgba(99,102,241,0)] hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
            >
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors">
                <Rocket className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Hands-Free Growth
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                You handle the customers, we handle the internet. From automated
                lead capture to zero-touch maintenance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Pain Agitation (Old Way vs New Way) */}
      <section id="compare" className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              The Old Way vs. The MO-X Way
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Stop paying thousands upfront for clunky templates that don't
              convert.
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
                  The Industry Standard
                </h3>
              </div>
              <ul className="space-y-4 text-zinc-400 font-medium">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />{" "}
                  High upfront costs ($3k-$10k+) before seeing any work.
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />{" "}
                  Slow delivery times taking weeks or months.
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />{" "}
                  Generic templates that look exactly like your competitors.
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />{" "}
                  Requires constant input and technical setup from your end.
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
                  The MO-X Standard
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-widest bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] ml-auto">
                  100% Free
                </span>
              </div>
              <ul className="space-y-4 text-zinc-200 font-medium relative z-10">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />{" "}
                  Instant, fully functional custom prototype.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />{" "}
                  Rapid deployment in under 24 hours.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />{" "}
                  AI-engineered designs tuned specifically for local
                  conversions.
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />{" "}
                  Zero-touch experience. We handle the tech; you handle the
                  leads.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The 3-Step Mechanism */}
      <section className="py-24 px-6 bg-zinc-900/20 border-y border-zinc-800/50 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-zinc/[0.02] bg-[size:32px_32px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-6 text-white tracking-tight">
              The AI-Engineered Pipeline
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">
              We don't do guesswork. Our proprietary models autonomously build
              the perfect funnel for your business.
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
                <Cpu className="w-6 h-6 text-indigo-400" /> The Analysis
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                We ingest millions of data points about your local market,
                competitors, and ideal customers to craft a dominant digital
                strategy.
              </p>

              {/* Decorative mini-UI */}
              <div className="mt-8 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <div className="text-xs text-zinc-500 font-mono">
                    Scanning local competitors...
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
                <Code2 className="w-6 h-6 text-indigo-400" /> The Build
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                Our AI models generate a high-converting website prototype
                instantly. Tailored copy, aggressive CTAs, and sleek UI deployed
                in seconds.
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
                <Rocket className="w-6 h-6 text-indigo-400" /> The Close
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                You review the live link. If it blows your mind, we push it to
                production and manage everything. You just handle the incoming
                leads.
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
                  LEADS +340%
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

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between hover:border-indigo-500/30 transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-zinc-700 mb-6" />
                <p className="text-zinc-300 leading-relaxed mb-8">
                  "They didn't try to sell me. They just built the exact website
                  I was missing and emailed me the working link. I signed the
                  contract the next day and haven't touched a line of code
                  since."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400">
                  MT
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Mark T.</div>
                  <div className="text-xs text-indigo-400 uppercase tracking-widest font-mono mt-1">
                    Local Bakery Owner
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between hover:border-rose-500/30 transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-zinc-700 mb-6" />
                <p className="text-zinc-300 leading-relaxed mb-8">
                  "I was paying an agency $2k a month for a website that looked
                  like it was from 2010. MO-X delivered a completely
                  AI-engineered overhaul in 24 hours that instantly boosted my
                  leads by 40%."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400">
                  SJ
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    Sarah Jenkins
                  </div>
                  <div className="text-xs text-rose-400 uppercase tracking-widest font-mono mt-1">
                    HVAC Services
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between hover:border-indigo-500/30 transition-colors"
            >
              <div>
                <Quote className="w-8 h-8 text-zinc-700 mb-6" />
                <p className="text-zinc-300 leading-relaxed mb-8">
                  "The automated social media content is mind-blowing. It writes
                  better posts than my old marketing guy, schedules them, and
                  actually brings people into the shop. Best investment ever."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400">
                  DL
                </div>
                <div>
                  <div className="font-bold text-white text-sm">David L.</div>
                  <div className="text-xs text-indigo-400 uppercase tracking-widest font-mono mt-1">
                    Auto Repair Shop
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto relative z-10 mb-32">
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

      {/* The MO-X Roadmap & Pricing */}
      <section
        id="roadmap"
        className="py-24 px-6 bg-zinc-950 relative z-10 border-t border-zinc-800"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              The MO-X Roadmap
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              A transparent, risk-free path to dominating your local market.
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
                  Request Free Prototype
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Give us your business details. Our AI analyzes your market and
                  we generate a functional website prototype tailored for your
                  audience. Zero cost.
                </p>
              </div>

              <div className="flex-1 relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mb-4 bg-zinc-950">
                  <span className="text-zinc-400 font-bold font-mono">02</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Review & Iterate
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  We send you the working link. If you love it, you can keep the
                  single-page prototype for free on our subdomain. No strings
                  attached.
                </p>
              </div>

              <div className="flex-1 relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 mb-4 bg-zinc-950">
                  <span className="text-zinc-400 font-bold font-mono">03</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Go Live & Scale
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Want more pages, your own custom domain, hosting, and advanced
                  AI SEO? Choose a plan below and we handle everything.
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
        className="py-24 px-6 bg-zinc-900/40 relative z-10 border-t border-zinc-800/50"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
              Request Your Free Prototype
            </h2>
            <p className="text-zinc-400">
              Fill out the details below and our AI will begin analyzing your
              market.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800 relative z-10 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <WolfLogo className="w-6 h-6 text-rose-500" />
            <span className="font-bold text-white">MO-X Agency</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <Link
              to="/login"
              className="hover:text-indigo-400 transition-colors font-medium"
            >
              Client Login
            </Link>
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
