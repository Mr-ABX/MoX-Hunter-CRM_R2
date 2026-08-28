import React from 'react';


export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img src="/m-logo.svg" alt="MoX" className="object-contain w-full h-full" referrerPolicy="no-referrer" />
    </div>
  );
}

export function LogoFull({ className = "h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <img src="/mox-hunter-full-holo-o-with-star-in-it.svg" alt="MoX Hunter" className="object-contain h-full w-auto max-w-none" referrerPolicy="no-referrer" />
    </div>
  );
}

export function WolfLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="12" y="45" width="14" height="22" rx="3" />
      <rect x="22" y="70" width="14" height="14" rx="3" />
      <rect x="38" y="82" width="14" height="14" rx="3" />
      <path d="M22 42 V 32 L 42 12 V 28 H 52 V 18 L 68 34 V 38 H 78 L 95 55 L 82 68 H 62 L 48 82 H 38 L 55 65 H 75 L 84 56 L 72 44 H 58 V 28 H 38 V 42 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
