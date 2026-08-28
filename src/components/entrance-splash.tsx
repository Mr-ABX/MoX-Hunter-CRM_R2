import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { WolfLogo } from './logo';

interface EntranceSplashProps {
  onComplete: () => void;
}

export function EntranceSplash({ onComplete }: EntranceSplashProps) {
  // Phase 1: Wolf charging (0 - 1.6s)
  // Phase 2: Morphing to MoX M + Brand Reveal (1.6s - 3.4s)
  // Phase 3: Final zoom out & fade (3.4s - 4.0s)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStep(2);
    }, 1500);

    const timer2 = setTimeout(() => {
      setStep(3);
    }, 3400);

    const timer3 = setTimeout(() => {
      onComplete();
    }, 4000);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: step === 1 ? [1, 1.3, 1.1] : [1.1, 1.8, 1.4],
            opacity: step === 1 ? [0.25, 0.45, 0.3] : [0.4, 0.7, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background:
              step === 1
                ? 'radial-gradient(circle, rgba(225,29,72,0.35) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)'
                : 'radial-gradient(circle, rgba(99,102,241,0.45) 0%, rgba(168,85,247,0.3) 50%, transparent 80%)',
          }}
        />

        {/* High-tech Grid overlay */}
        <div className="absolute inset-0 bg-grid-zinc/[0.04] bg-[size:40px_40px]" />
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 z-50 text-xs font-mono tracking-wider uppercase text-zinc-500 hover:text-zinc-200 px-4 py-2 rounded-full border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md transition-all duration-200 hover:border-zinc-700 flex items-center gap-1.5 group cursor-pointer"
      >
        <span>Skip</span>
        <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 font-sans border border-zinc-800 px-1 py-0.5 rounded">ESC</span>
      </button>

      {/* Main Cinematic Visual Center */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] w-full max-w-xl px-4">
        {/* STEP 1: Geometric Wolf Stage */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-wolf"
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Radial shockwave pulse rings */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute w-32 h-32 rounded-3xl border border-rose-500/40 pointer-events-none"
                />
                <motion.div
                  animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3, ease: "easeOut" }}
                  className="absolute w-32 h-32 rounded-full border border-indigo-500/30 pointer-events-none"
                />

                {/* Wolf Icon Card */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(225,29,72,0.3)] relative group">
                  <WolfLogo className="w-16 h-16 sm:w-20 sm:h-20 text-rose-500 drop-shadow-[0_0_20px_rgba(225,29,72,0.8)]" />
                  
                  {/* Glowing Corner Accents */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-rose-400" />
                  <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-rose-400" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-rose-400" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-rose-400" />
                </div>
              </div>

              {/* Status Tracker Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                  Initializing Core Engine...
                </span>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2 & 3: Converging into MoX Hunter M + Full Mark */}
          {step >= 2 && (
            <motion.div
              key="step-mox"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center"
            >
              {/* Converging Energy Light Burst */}
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute w-48 h-48 rounded-full bg-indigo-400 blur-xl pointer-events-none"
              />

              {/* High Resolution MoX Hunter Logo Full Mark */}
              <motion.div
                initial={{ y: 10, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center"
              >
                <div className="h-16 sm:h-20 flex items-center justify-center">
                  <img
                    src="/mox-hunter-full-holo-o-with-star-in-it.svg"
                    alt="MoX Hunter"
                    className="h-full w-auto max-w-[280px] sm:max-w-[360px] object-contain drop-shadow-[0_0_35px_rgba(99,102,241,0.6)]"
                  />
                </div>

                {/* Subtitle / Tagline reveal */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-6 flex flex-col items-center gap-2"
                >
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-mono tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                    <span>Proof-First Prototype Engine</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Track at bottom */}
      <div className="absolute bottom-8 w-48 sm:w-64 h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: step === 1 ? '45%' : '100%' }}
          transition={{ duration: step === 1 ? 1.5 : 1.8, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-rose-500 via-indigo-500 to-purple-400"
        />
      </div>
    </motion.div>
  );
}
