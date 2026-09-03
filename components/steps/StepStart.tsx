'use client';

import React from 'react';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

interface StepStartProps {
  onStartTour: () => void;
  isLoading?: boolean;
  selectedCity?: string;
  selectedArea?: string;
}

export const StepStart: React.FC<StepStartProps> = ({
  onStartTour,
  isLoading = false,
}) => {
  return (
    <div className="w-full flex flex-col justify-center gap-4 sm:gap-6 text-white">
      {/* Top Main Heading Section */}
      <div className="text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight brand-font">
          Are you ready? <span className="text-yellow-400">🚀</span>
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 mt-1 sm:mt-2 font-medium leading-relaxed">
          Aapke sheher ka next spicy &amp; legendary food joint Bakasur ko batao.
        </p>
      </div>

      {/* Bakasur is Hungry Card */}
      <div className="rounded-2xl bg-white/10 hover:bg-white/[0.14] p-3.5 sm:p-5 border border-white/15 backdrop-blur-md flex items-center gap-3.5 sm:gap-4 transition-all shadow-md">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-yellow-500 to-amber-400 text-slate-950 shrink-0 shadow-md flex items-center justify-center text-xl sm:text-2xl font-bold">
          👹
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-base font-black text-yellow-300 brand-font flex items-center gap-1">
            <span>Bakasur is Hungry!</span>
            <span>🍗</span>
          </h3>
          <p className="text-[11px] sm:text-sm text-blue-100 leading-snug mt-0.5 sm:mt-1">
            Feed him your city&apos;s spiciest, most legendary food joint.
          </p>
        </div>
      </div>

      {/* Start Tour CTA Button */}
      <div className="pt-1 sm:pt-2">
        <button
          onClick={onStartTour}
          disabled={isLoading}
          className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm sm:text-base lg:text-lg shadow-xl shadow-yellow-500/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer brand-font tracking-wide"
        >
          <span>Start Tour</span>
          <span>🚀</span>
        </button>
      </div>
    </div>
  );
};
