import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Target, Zap, Globe, Shield, MessageSquare, Briefcase } from 'lucide-react';
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
            <span className="font-display font-bold text-xl tracking-tight">MO-X</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#services" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors hidden sm:block">Services</a>
            <a href="#about" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors hidden sm:block">About</a>
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Next-Generation Digital Agency</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1]"
          >
            We design <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">digital experiences</span> that dominate.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            MO-X partners with ambitious brands to build elite websites, outbound systems, and high-converting marketing campaigns.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href="mailto:contact@mo-x.vercel.app"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Start a Project
            </a>
            <a 
              href="#services"
              className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
            >
              View Our Services
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-zinc-900/50 border-y border-zinc-800/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Our Capabilities</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">We combine cutting-edge technology with premium design to deliver unmatched results.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'Web Development', desc: 'Blazing fast, responsive, and stunning websites built with modern frameworks.' },
              { icon: Zap, title: 'Growth Systems', desc: 'Automated lead generation and outbound infrastructure that scales.' },
              { icon: Target, title: 'Conversion Optimization', desc: 'Data-driven redesigns focused on maximizing your ROI and sales.' },
              { icon: Briefcase, title: 'Brand Identity', desc: 'Cohesive, premium visual identities that set you apart from competitors.' },
              { icon: Shield, title: 'Secure Architecture', desc: 'Enterprise-grade security and scalable backend infrastructure.' },
              { icon: Sparkles, title: 'AI Integration', desc: 'Custom AI solutions to streamline your business operations.' },
            ].map((service, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-indigo-500/50 transition-colors group">
                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors">
                  <service.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800 relative z-10 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5 text-zinc-400" />
            <span className="font-bold">MO-X</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <Link to="/login" className="hover:text-indigo-400 transition-colors">Client Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
