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
    <div className="w-full flex flex-col justify-center gap-4 sm:gap-6 text-white max-w-md mx-auto">
      {/* Top Main Heading Section */}
      <div className="text-center mb-2 sm:mb-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight lowercase brand-font mb-2.5">
          are you ready?
        </h1>

        {/* Badges Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0d1430]/90 border border-slate-700/80 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
            <span className="text-amber-400">⚡</span>
            <span>GASTRIUM FOOD TOUR</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-600/50 text-cyan-300 text-xs font-extrabold tracking-wide shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>📍 Live: {selectedArea ? `${selectedArea}, ` : ''}{selectedCity}</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-blue-100 max-w-md mx-auto font-medium leading-relaxed">
          Aapke sheher ka next spicy &amp; legendary food stop Bakasur ko batao.
        </p>
      </div>

      {/* Interaction Cards & Start Tour CTA */}
      <div className="flex flex-col gap-3.5 w-full">
        {/* Card 1: Bakasur is Hungry! */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 border border-slate-100 shadow-xl flex items-center gap-4 transition-all hover:shadow-2xl text-slate-900">
          <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shrink-0 shadow-md shadow-orange-500/30 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-[#0d1430] rounded-[14px] flex items-center justify-center text-xl sm:text-2xl">
              👹
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-black text-slate-900 brand-font flex items-center gap-1.5">
              <span>Bakasur is Hungry!</span>
              <span className="text-base">🍗</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-snug mt-0.5">
              Send him to your city&apos;s spiciest, most legendary food joint.
            </p>
          </div>
        </div>

        {/* Card 2: Social Proof & Start Tour CTA */}
        <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-6 border border-slate-100 shadow-xl flex flex-col gap-4 text-slate-900">
          {/* Social Proof Header */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {/* Avatar Cluster */}
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Foodie 1"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Foodie 2"
                />
                <img
                  className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Foodie 3"
                />
                <div className="inline-flex items-center justify-center h-7 px-1.5 rounded-full ring-2 ring-white bg-[#023093] text-white text-[10px] font-black">
                  +4.2k
                </div>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 brand-font">
                You and 50,000 foodies
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              ready to send Bakasur on this epic spice food tour
            </p>
          </div>

          {/* Big Start Tour Button */}
          <button
            onClick={onStartTour}
            disabled={isLoading}
            className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#023093] hover:bg-[#033bb8] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-900/40 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer brand-font"
          >
            <span>Start Food Tour</span>
            <span className="text-base">🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
