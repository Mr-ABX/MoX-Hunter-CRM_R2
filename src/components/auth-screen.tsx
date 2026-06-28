
import { motion } from 'motion/react';
import { Logo } from './logo';

interface AuthScreenProps {
  handleSignIn: () => void;
  authError?: string | null;
}

export function AuthScreen({ handleSignIn, authError }: AuthScreenProps) {
  return (
    <div className="h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-zinc bg-[size:32px_32px] pointer-events-none opacity-20" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center"
      >
        <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <Logo className="w-7 h-7 text-zinc-100" />
        </div>
        <h1 className="text-3xl font-display font-bold text-zinc-100 mb-2 tracking-tight">Wolf CRM</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          The elite acquisition engine for solo contractors and agencies. Hunt, track, and close with AI precision.
        </p>
        
        {authError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {authError}
          </div>
        )}

        <button 
          onClick={handleSignIn}
          className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xl"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>
        <p className="mt-6 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
          Authorized Access Only
        </p>
      </motion.div>
    </div>
  );
}
