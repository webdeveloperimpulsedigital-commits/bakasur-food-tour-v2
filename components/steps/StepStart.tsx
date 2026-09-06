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
  selectedCity = 'Pune',
  selectedArea = ''
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center gap-2 text-white max-w-sm mx-auto">
      {/* Live Badge */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-cyan-300 text-[10px] font-extrabold tracking-wide shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
        <span>📍 Live: {selectedArea ? `${selectedArea}, ` : ''}{selectedCity}</span>
      </div>

      {/* Main Title */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight lowercase brand-font leading-tight">
          are you ready?
        </h1>
        <p className="text-[11px] sm:text-xs text-blue-100 font-medium mt-0.5">
          Bakasur is hungry! Feed him your city&apos;s spiciest food.
        </p>
      </div>

      {/* Clean Single Action Card */}
      <div className="w-full rounded-2xl bg-white/95 backdrop-blur-md p-3 sm:p-4 border border-slate-100 shadow-xl flex flex-col gap-2.5 text-slate-900">
        {/* Social Proof Row */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex -space-x-1.5 overflow-hidden shrink-0">
            <img
              className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Foodie 1"
            />
            <img
              className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Foodie 2"
            />
            <div className="inline-flex items-center justify-center h-5 px-1.5 rounded-full ring-2 ring-white bg-[#023093] text-white text-[9px] font-black">
              +50k
            </div>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-800 brand-font">
            50,000+ foodies joined the tour
          </span>
        </div>

        {/* Big Start Tour Button */}
        <button
          onClick={onStartTour}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-[#023093] hover:bg-[#033bb8] text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-900/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer brand-font tracking-wide"
        >
          <span>Start Food Tour</span>
          <span className="text-sm">🚀</span>
        </button>
      </div>
    </div>
  );
};
