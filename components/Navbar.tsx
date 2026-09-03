'use client';

import React from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, ShieldCheck, Settings } from 'lucide-react';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentStepTitle?: string;
  selectedCity?: string;
  stepIndex?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="w-full z-40 px-4 py-3 sm:px-6 flex items-center justify-between pointer-events-auto">
      {/* Gastrium Logo Pill */}
      <Link href="/" className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1430]/90 border border-slate-700/60 shadow-lg backdrop-blur-md group hover:border-blue-400/60 transition-all">
        <div className="w-6 h-6 rounded-full bg-[#023093] flex items-center justify-center text-white text-xs font-black shadow-sm">
          💊
        </div>
        <span className="font-extrabold text-sm tracking-tight text-white brand-font flex items-center gap-1">
          <span>Gastrium</span>
          <span className="text-blue-400 font-normal">/</span>
        </span>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSound}
          aria-label="Toggle Sound"
          className="p-2 rounded-full bg-[#0d1430]/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-blue-400 transition-all shadow-md cursor-pointer"
          title={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        <Link
          href="/admin"
          className="p-2 rounded-full bg-[#0d1430]/80 border border-slate-700/60 text-slate-300 hover:text-white hover:border-blue-400 transition-all shadow-md"
          title="Admin CMS"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
