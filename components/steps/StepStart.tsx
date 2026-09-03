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
  selectedArea = 'FC Road'
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-2 sm:py-6 flex flex-col items-center">
      {/* Top Main Heading Section */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight brand-font mb-3">
          Bakasur Ka Food Tour 🍲
        </h1>

        {/* Badges Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0d1430]/90 border border-slate-700/80 text-white text-xs font-extrabold uppercase tracking-wider shadow-md">
            <span className="text-amber-400">⚡</span>
            <span>GASTRIUM FOOD TOUR</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-600/50 text-cyan-300 text-xs font-extrabold tracking-wide shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span>📍 Live: {selectedArea ? `${selectedArea}, ` : ''}{selectedCity}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-200 text-xs font-extrabold tracking-wide shadow-md">
            <span>🗺️</span>
            <span>Collective Food Tour Map</span>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
          Bakasur is travelling across India exploring iconic food joints. Recommend your favourite restaurant and contribute to the collective <strong className="text-cyan-300 font-bold">Gastrium Food Tour Map</strong>!
        </p>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Bakasur Mascot Hero Graphic */}
        <div className="md:col-span-6 flex justify-center items-center">
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 bg-[#060b24]">
            <img
              src="/images/bakasur_hero.jpg"
              alt="Bakasur Mascot"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05091e]/80 via-transparent to-transparent pointer-events-none" />

            {/* Mascot Comic Intro Tag */}
            <div className="absolute left-4 bottom-4 z-20 pointer-events-none">
              <div className="px-3.5 py-2 rounded-2xl bg-black/80 backdrop-blur-md text-amber-300 text-xs font-black border border-amber-400/40 shadow-xl flex items-center gap-2">
                <span className="text-base">👹</span>
                <span>&ldquo;Mujhe aapke sheher ka best khana khilao!&rdquo;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Cards & Start Tour CTA */}
        <div className="md:col-span-6 flex flex-col gap-4 max-w-md mx-auto w-full">
          {/* Card 1: Recommend a Restaurant */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 border border-slate-100 shadow-xl flex items-center gap-4 transition-all hover:shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 p-0.5 shrink-0 shadow-md shadow-orange-500/30 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-[#0d1430] rounded-[14px] flex items-center justify-center text-2xl">
                🍽️
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 brand-font flex items-center gap-1.5">
                <span>Recommend a Restaurant</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-snug mt-0.5">
                Pick an authentic local restaurant &amp; feed Bakasur your chosen dish.
              </p>
            </div>
          </div>

          {/* Card 2: Collective Food Tour Map */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 border border-slate-100 shadow-xl flex items-center gap-4 transition-all hover:shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-[#023093] p-0.5 shrink-0 shadow-md shadow-blue-500/30 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-[#0d1430] rounded-[14px] flex items-center justify-center text-2xl">
                🗺️
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 brand-font flex items-center gap-1.5">
                <span>Build the Food Tour Map</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-snug mt-0.5">
                Every entry builds India&apos;s live Food Tour Map for fellow foodies.
              </p>
            </div>
          </div>

          {/* Card 3: Social Proof & Start Tour CTA */}
          <div className="rounded-2xl bg-white/95 backdrop-blur-md p-5 sm:p-6 border border-slate-100 shadow-xl flex flex-col gap-4">
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
                  Join 50,000+ Foodies
                </h4>
              </div>
              <p className="text-xs text-slate-500">
                Send Bakasur to your favourite food stop today
              </p>
            </div>

            {/* Big Start Tour Button */}
            <button
              onClick={onStartTour}
              disabled={isLoading}
              className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#023093] hover:bg-[#033bb8] text-white font-extrabold text-base shadow-lg shadow-blue-900/40 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer brand-font"
            >
              <span>Recommend a Restaurant &amp; Start</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
