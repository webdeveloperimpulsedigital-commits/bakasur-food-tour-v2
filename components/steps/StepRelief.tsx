'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { Restaurant, Dish } from '@/lib/db';
import { SpiceOption } from './StepDish';

interface StepReliefProps {
  restaurant: Restaurant;
  dish: Dish | { name: string; id?: number };
  spice: SpiceOption;
  isCountdownDone: boolean;
  onCountdownComplete: () => void;
  onGetOfficialPass: () => void;
}

export const StepRelief: React.FC<StepReliefProps> = ({
  restaurant,
  dish,
  spice,
  isCountdownDone,
  onCountdownComplete,
  onGetOfficialPass
}) => {
  const [timeLeft, setTimeLeft] = useState(5.0);

  // 6-second countdown timer interval
  useEffect(() => {
    if (isCountdownDone) return;

    setTimeLeft(5.0);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = parseFloat((prev - 0.1).toFixed(1));
        return next > 0 ? next : 0.0;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isCountdownDone]);

  // Separate effect to safely trigger completion callback when countdown reaches 0
  useEffect(() => {
    if (!isCountdownDone && timeLeft <= 0.0) {
      onCountdownComplete();
    }
  }, [timeLeft, isCountdownDone, onCountdownComplete]);

  // Radius for SVG ring
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((5.0 - timeLeft) / 5.0) * circumference;

  if (!isCountdownDone) {
    /* STEP 6: 6-SECOND GASTRIUM RELIEF ACTIVE COUNTDOWN */
    return (
      <div className="w-full max-w-lg mx-auto py-8 sm:py-16 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
        {/* Glowing Circular Timer Ring */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="rgba(2, 48, 147, 0.3)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Active animated gradient ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="url(#timerGradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-100 ease-linear"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00acc1" />
                <stop offset="50%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#023093" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Countdown Number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight drop-shadow-[0_0_20px_rgba(0,172,193,0.8)]">
              {timeLeft.toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Status Text Under Ring */}
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-cyan-950/50">
            <span>Gastrium 6s Relief Active</span>
            <span className="text-amber-300">⚡</span>
          </div>

          <p className="text-xs sm:text-sm text-cyan-100/90 font-medium max-w-sm">
            Neutralizing 🌶️ <span className="font-bold">{spice.name}</span> acid burn in Bakasur&apos;s stomach...
          </p>
        </div>
      </div>
    );
  }

  /* STEP 7: RELIEF COMPLETE SCREEN */
  return (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-4 sm:gap-5 text-slate-900 animate-in fade-in duration-300">
      {/* Top Label */}
      <div className="text-left">
        <span className="text-[11px] font-black text-cyan-600 uppercase tracking-wider block mb-1 flex items-center gap-1">
          <span>⚡</span>
          <span>100% RELIEVED IN 6 SECONDS</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 brand-font">
          Ahhh! Pet Mein Thandak Aur Chain!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Gastrium neutralized the 🌶️ acid burn in 6 seconds! Bakasur is smiling and ready for his next food stop.
        </p>
      </div>

      {/* Verified Food Tour Stop Card */}
      <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 sm:p-5 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>VERIFIED FOOD TOUR STOP</span>
          </span>
          <span className="text-xs font-bold text-slate-600">
            🌶 {spice.level}
          </span>
        </div>

        <div className="mt-1">
          <h3 className="font-black text-base sm:text-lg text-slate-900 brand-font flex items-center gap-1.5">
            <span>📍 {restaurant.name}</span>
            <span className="text-xs text-slate-500 font-semibold">({restaurant.city})</span>
          </h3>
          <p className="text-xs font-bold text-[#023093] mt-0.5">
            🍽 {dish.name}
          </p>
        </div>
      </div>

      {/* Action CTA Button */}
      <div className="pt-2">
        <button
          onClick={onGetOfficialPass}
          type="button"
          className="w-full py-3.5 px-6 rounded-xl bg-[#023093] hover:bg-[#033bb8] text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-900/40 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer brand-font"
        >
          <span>Get Official Food Pass</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
