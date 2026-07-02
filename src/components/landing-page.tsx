import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Monitor, Rocket, CheckCircle2, Quote, Play, XCircle, Check, Code2, Cpu } from 'lucide-react';
import { Logo } from './logo';
import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Logo className="w-5 h-5 text-zinc-100" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">MO-X Agency</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#compare" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">The New Way</a>
            <a href="#prototype" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Free Prototype</a>
            <Link 
              to="/login"
              className="text-sm font-bold bg-white text-black px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2"
            >
              Client Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none opacity-20" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-8 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
          >
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wide uppercase text-xs">AI-Powered Digital Dominance</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.1] text-white"
          >
            You Run Your Business.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">AI Builds Your Website.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Your leads are buying right now—just not from you. Stop losing local market share to competitors with inferior services but a better digital presence. We build elite, AI-optimized websites. Zero upfront costs. Zero risk. Just aggressive growth.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <motion.a 
              href="#prototype"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: ["0px 0px 0px rgba(99,102,241,0)", "0px 0px 25px rgba(99,102,241,0.5)", "0px 0px 0px rgba(99,102,241,0)"] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              <Monitor className="w-5 h-5" />
              Claim Free Prototype
            </motion.a>
            <a 
              href="#services"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-700 text-zinc-300 font-bold rounded-2xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              See Our Services
            </a>
          </motion.div>

          {/* Abstract Floating Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ perspective: 1200 }}
            className="relative max-w-4xl mx-auto hidden sm:block"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-full h-80 bg-zinc-900 border border-zinc-800 rounded-t-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col relative"
            >
              {/* Fake browser bar */}
              <div className="h-10 border-b border-zinc-800/50 bg-zinc-900 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="mx-auto w-1/3 h-4 rounded bg-zinc-800" />
              </div>
              {/* Fake website content */}
              <div className="flex-1 p-8 flex flex-col gap-6 opacity-70">
                <div className="flex justify-between items-center">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }} className="w-20 h-6 bg-zinc-800 rounded" />
                  <div className="flex gap-4">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.5 }} className="w-12 h-4 bg-zinc-800 rounded" />
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, duration: 0.5 }} className="w-12 h-4 bg-zinc-800 rounded" />
                  </div>
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-2/3 h-12 bg-indigo-500/20 rounded-lg border border-indigo-500/20 mt-4" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="w-1/2 h-4 bg-zinc-800 rounded" />
                <div className="grid grid-cols-3 gap-6 mt-8">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.6 }} className="h-24 bg-zinc-800/50 rounded-xl" />
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.6 }} className="h-24 bg-zinc-800/50 rounded-xl" />
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.6 }} className="h-24 bg-zinc-800/50 rounded-xl" />
                </div>
              </div>
              
              {/* AI Overlay scanning effect */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-20"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof (Marquee Style) */}
      <section className="py-12 border-y border-zinc-800/50 bg-zinc-950/50 relative z-10 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />
        
        <p className="text-center text-xs font-mono text-zinc-500 uppercase tracking-[0.2em] mb-8">Trusted by elite local businesses</p>
        
        <div className="flex justify-center gap-16 opacity-40 grayscale items-center flex-wrap px-6">
          <div className="flex items-center gap-3 font-display font-bold text-xl"><div className="w-6 h-6 rounded-full bg-white" /> Apex Auto</div>
          <div className="flex items-center gap-3 font-display font-bold text-xl"><div className="w-6 h-6 rounded bg-white" /> Bloom Cafe</div>
          <div className="flex items-center gap-3 font-display font-bold text-xl"><div className="w-6 h-6 rotate-45 bg-white" /> Elite Roofing</div>
          <div className="flex items-center gap-3 font-display font-bold text-xl"><div className="w-6 h-6 rounded-tl-xl rounded-br-xl bg-white" /> NextGen Plumbers</div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 relative z-10 bg-zinc-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">What We Build</h2>
            <p className="text-zinc-400 max-w-2xl">Complete digital infrastructure designed for small businesses to dominate local markets.</p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-indigo-500/30 transition-colors group">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <Monitor className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">AI-Powered Websites</h3>
              <p className="text-zinc-400 leading-relaxed">Lightning-fast, highly-converting websites built specifically for your brand. AI optimizations keep it ranking high.</p>
            </div>
            
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-indigo-500/30 transition-colors group">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <Sparkles className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Social Media Automation</h3>
              <p className="text-zinc-400 leading-relaxed">Never worry about what to post. Our AI systems generate and schedule high-quality content that builds trust.</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-indigo-500/30 transition-colors group">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                <Rocket className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Hands-Free Growth</h3>
              <p className="text-zinc-400 leading-relaxed">You handle the customers, we handle the internet. From automated lead capture to zero-touch maintenance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Pain Agitation (Old Way vs New Way) */}
      <section id="compare" className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">The Old Way vs. The MO-X Way</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Stop paying thousands upfront for clunky templates that don't convert.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-300">The Industry Standard</h3>
              </div>
              <ul className="space-y-4 text-zinc-400 font-medium">
                <li className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" /> High upfront costs ($3k-$10k+) before seeing any work.</li>
                <li className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" /> Slow delivery times taking weeks or months.</li>
                <li className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" /> Generic templates that look exactly like your competitors.</li>
                <li className="flex items-start gap-3"><XCircle className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" /> Requires constant input and technical setup from your end.</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-b from-indigo-500/10 to-zinc-900/40 border border-indigo-500/30 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white">The MO-X Standard</h3>
              </div>
              <ul className="space-y-4 text-zinc-200 font-medium relative z-10">
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> Instant, fully functional custom prototype. <span className="text-indigo-300 font-bold">100% Free.</span></li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> Rapid deployment in under 24 hours.</li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> AI-engineered designs tuned specifically for local conversions.</li>
                <li className="flex items-start gap-3"><Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" /> Zero-touch experience. We handle the tech; you handle the leads.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Mechanism */}
      <section className="py-24 px-6 bg-zinc-900/20 border-y border-zinc-800/50 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">The 3-Step Automation Sequence</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">We don't do guesswork. Our AI autonomously builds the perfect funnel for your business.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-[1px] bg-gradient-to-r from-zinc-800 via-indigo-500/50 to-zinc-800 -z-10" />

            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 relative">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center mb-6 text-zinc-300 font-mono font-bold">01</div>
              <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2"><Cpu className="w-5 h-5 text-indigo-400"/> The Analysis</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">We ingest data about your local market, competitors, and ideal customers to craft the perfect digital strategy.</p>
            </div>
            
            <div className="bg-zinc-950 border border-indigo-500/30 rounded-3xl p-8 relative shadow-[0_0_30px_rgba(99,102,241,0.05)]">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 font-mono font-bold">02</div>
              <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2"><Code2 className="w-5 h-5 text-indigo-400"/> The Build</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">Our AI generates a high-converting website prototype instantly. Tailored copy, aggressive CTAs, and sleek UI.</p>
            </div>
            
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 relative">
              <div className="w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center mb-6 text-zinc-300 font-mono font-bold">03</div>
              <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2"><Rocket className="w-5 h-5 text-indigo-400"/> The Close</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">You review the live link. If it blows your mind, we push it to production and manage everything. You just relax.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Prototype Pitch & Heavy Quote */}
      <section id="prototype" className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none opacity-[0.03]" />
        
        {/* Social Proof / Reviews Grid */}
        <div className="max-w-6xl mx-auto relative z-10 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">Don't Take Our Word For It</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Hear from businesses that let our AI handle their growth.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-zinc-700 mb-6" />
                <p className="text-zinc-300 leading-relaxed mb-8">
                  "They didn't try to sell me. They just built the exact website I was missing and emailed me the working link. I signed the contract the next day and haven't touched a line of code since."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400">MT</div>
                <div>
                  <div className="font-bold text-white text-sm">Mark T.</div>
                  <div className="text-xs text-indigo-400 uppercase tracking-widest font-mono mt-1">Local Bakery Owner</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-zinc-700 mb-6" />
                <p className="text-zinc-300 leading-relaxed mb-8">
                  "I was paying an agency $2k a month for a website that looked like it was from 2010. MO-X delivered a completely AI-engineered overhaul in 24 hours that instantly boosted my leads by 40%."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400">SJ</div>
                <div>
                  <div className="font-bold text-white text-sm">Sarah Jenkins</div>
                  <div className="text-xs text-indigo-400 uppercase tracking-widest font-mono mt-1">HVAC Services</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <Quote className="w-8 h-8 text-zinc-700 mb-6" />
                <p className="text-zinc-300 leading-relaxed mb-8">
                  "The automated social media content is mind-blowing. It writes better posts than my old marketing guy, schedules them, and actually brings people into the shop. Best investment ever."
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-400">DL</div>
                <div>
                  <div className="font-bold text-white text-sm">David L.</div>
                  <div className="text-xs text-indigo-400 uppercase tracking-widest font-mono mt-1">Auto Repair Shop</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[3rem] p-12 text-center overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-500/20 blur-[100px] pointer-events-none" />
          
          <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6 text-white relative z-10">Stop Waiting. Start Dominating.</h2>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto relative z-10">
            Your leads are searching for you online right now—but finding your competitors. Claim your free, custom-built AI prototype today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 relative z-10">
            <div className="flex items-center gap-2 bg-zinc-950/50 px-4 py-2 rounded-lg border border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-sm text-zinc-300">No Credit Card</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-950/50 px-4 py-2 rounded-lg border border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-sm text-zinc-300">Delivered in 24h</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-950/50 px-4 py-2 rounded-lg border border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span className="font-medium text-sm text-zinc-300">Zero Obligation</span>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{ boxShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 30px rgba(255,255,255,0.4)", "0px 0px 0px rgba(255,255,255,0)"] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="relative z-10 px-12 py-5 bg-white text-black font-bold text-lg rounded-2xl flex items-center gap-3 mx-auto group"
          >
            <Play className="w-5 h-5 group-hover:text-indigo-600 transition-colors" />
            Request Free Prototype Now
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800 relative z-10 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5 text-indigo-500" />
            <span className="font-bold text-white">MO-X Agency</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <Link to="/login" className="hover:text-indigo-400 transition-colors font-medium">Client Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

