import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    initials: "MT",
    name: "Mark T.",
    role: "Local Bakery Owner",
    text: "\"They didn't try to sell me. They just built the exact website I was missing and emailed me the working link. I signed the contract the next day and haven't touched a line of code since.\"",
    color: "text-indigo-400"
  },
  {
    initials: "SJ",
    name: "Sarah Jenkins",
    role: "HVAC Services",
    text: "\"I was paying an agency $2k a month for a website that looked like it was from 2010. MO-X delivered a completely AI-engineered overhaul in 24 hours that instantly boosted my leads by 40%.\"",
    color: "text-rose-400"
  },
  {
    initials: "DL",
    name: "David L.",
    role: "Auto Repair Shop",
    text: "\"The automated social media content is mind-blowing. It writes better posts than my old marketing guy, schedules them, and actually brings people into the shop. Best investment ever.\"",
    color: "text-emerald-400"
  },
  {
    initials: "AP",
    name: "Amanda P.",
    role: "Fitness Studio",
    text: "\"Our online bookings doubled in the first month. The AI seamless integration with our calendar is flawless.\"",
    color: "text-blue-400"
  },
  {
    initials: "RK",
    name: "Robert K.",
    role: "Plumbing Contractor",
    text: "\"I used to hate dealing with my website. Now, it just runs itself and generates leads while I'm out on calls.\"",
    color: "text-amber-400"
  },
  {
    initials: "EL",
    name: "Emily L.",
    role: "Boutique Cafe",
    text: "\"The AI generated menus and promotional graphics are stunning. It saved us thousands in graphic design fees.\"",
    color: "text-purple-400"
  },
  {
    initials: "JC",
    name: "James C.",
    role: "Real Estate Agent",
    text: "\"Property listings get automatically optimized and posted. My digital presence is unmatched in my local area now.\"",
    color: "text-cyan-400"
  },
  {
    initials: "MW",
    name: "Michael W.",
    role: "Landscaping Pros",
    text: "\"The automated follow-ups for quote requests have closed deals I would have completely forgotten about.\"",
    color: "text-teal-400"
  },
  {
    initials: "SN",
    name: "Samantha N.",
    role: "Dental Clinic",
    text: "\"Patient acquisition costs dropped by 60%. The AI targeting is incredibly precise and the landing pages convert beautifully.\"",
    color: "text-pink-400"
  },
  {
    initials: "BW",
    name: "Brian W.",
    role: "Roofing Company",
    text: "\"I didn't believe AI could write good copy for a roofing site. I was wrong. It sounds professional and builds instant trust.\"",
    color: "text-orange-400"
  },
  {
    initials: "KL",
    name: "Karen L.",
    role: "Yoga Studio",
    text: "\"The customized email newsletters it sends out have re-engaged so many of our inactive members. Pure magic.\"",
    color: "text-indigo-400"
  },
  {
    initials: "TR",
    name: "Tom R.",
    role: "Law Firm",
    text: "\"Professional, compliant, and highly effective. Our firm's online visibility has never been stronger.\"",
    color: "text-slate-400"
  },
  {
    initials: "JL",
    name: "Jessica L.",
    role: "Hair Salon",
    text: "\"We are fully booked weeks in advance now. The AI-driven ad campaigns just work without any tinkering.\"",
    color: "text-rose-400"
  },
  {
    initials: "DP",
    name: "Daniel P.",
    role: "Moving Company",
    text: "\"We went from struggling to get leads to having to hire more crews to handle the volume. Incredible ROI.\"",
    color: "text-emerald-400"
  },
  {
    initials: "CH",
    name: "Chloe H.",
    role: "Interior Design",
    text: "\"My portfolio site is now a lead generation machine. The aesthetic is perfect and the performance is lightning fast.\"",
    color: "text-amber-400"
  },
  {
    initials: "GM",
    name: "Greg M.",
    role: "Pest Control",
    text: "\"It handles all our local SEO. We rank #1 for almost every search term in our county now.\"",
    color: "text-blue-400"
  },
  {
    initials: "VN",
    name: "Victoria N.",
    role: "Event Planner",
    text: "\"The client intake forms and automated responses have saved me at least 15 hours a week of admin work.\"",
    color: "text-purple-400"
  },
  {
    initials: "AF",
    name: "Andrew F.",
    role: "Accounting Firm",
    text: "\"Clean, professional, and trustworthy. The AI built a site that perfectly represents our brand values.\"",
    color: "text-cyan-400"
  },
  {
    initials: "LB",
    name: "Laura B.",
    role: "Pet Grooming",
    text: "\"I love how it automatically asks for reviews from happy customers. Our Google rating shot up to 4.9 stars.\"",
    color: "text-teal-400"
  },
  {
    initials: "MS",
    name: "Mark S.",
    role: "Cleaning Service",
    text: "\"Simplest marketing decision I've ever made. The system is essentially on autopilot and business is booming.\"",
    color: "text-indigo-400"
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden relative h-[400px] sm:h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm border border-zinc-800 rounded-3xl p-8 sm:p-12 flex flex-col justify-center items-center text-center"
          >
            <Quote className="w-10 h-10 text-zinc-700 mb-6" />
            <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed mb-8 max-w-2xl">
              {TESTIMONIALS[currentIndex].text}
            </p>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400">
                {TESTIMONIALS[currentIndex].initials}
              </div>
              <div>
                <div className="font-bold text-white text-base">{TESTIMONIALS[currentIndex].name}</div>
                <div className={`text-xs uppercase tracking-widest font-mono mt-1 ${TESTIMONIALS[currentIndex].color}`}>
                  {TESTIMONIALS[currentIndex].role}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={prev}
          className="p-3 rounded-full bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-700/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-wrap justify-center gap-2 max-w-[200px] sm:max-w-none">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? "bg-indigo-500 w-6" : "bg-zinc-700 hover:bg-zinc-600"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="p-3 rounded-full bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-700/50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
