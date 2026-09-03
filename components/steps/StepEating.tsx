'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Flame, ShieldAlert, Sparkles, Utensils, Zap, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Restaurant, Dish } from '@/lib/db';
import { SpiceOption } from './StepDish';

interface StepEatingProps {
  restaurant: Restaurant;
  dish: Dish | { name: string; id?: number };
  spice: SpiceOption;
  sessionId: string;
  isHeartburnStage?: boolean;
  feastingStage?: 1 | 2 | 3;
  onFeastingStageChange?: (stage: 1 | 2 | 3) => void;
  onProceedToHeartburn?: () => void;
  onGiveGastrium: () => void;
  onBackToDish: () => void;
  onPlaySound?: (type: 'click' | 'bite' | 'fanfare' | 'relief') => void;
}

export const StepEating: React.FC<StepEatingProps> = ({
  restaurant,
  dish,
  spice,
  sessionId,
  isHeartburnStage = false,
  feastingStage: externalStage,
  onFeastingStageChange,
  onProceedToHeartburn,
  onGiveGastrium,
  onBackToDish,
  onPlaySound
}) => {
  // Feasting Stage: 1 (20%), 2 (45%), 3 (100% Acidity Overload)
  const [internalStage, setInternalStage] = useState<1 | 2 | 3>(
    isHeartburnStage ? 3 : (externalStage || 1)
  );

  const currentStage = externalStage || internalStage;

  // Track Meter Percent with smooth animated progression
  const [meterPercent, setMeterPercent] = useState<number>(20);

  // Sync stage to percentage and notify parent
  useEffect(() => {
    if (currentStage === 1) {
      setMeterPercent(20);
    } else if (currentStage === 2) {
      setMeterPercent(45);
    } else if (currentStage === 3 || isHeartburnStage) {
      setMeterPercent(100);
    }
  }, [currentStage, isHeartburnStage]);

  // Stage Dialogues & Visual Metadata
  const STAGE_CONFIG = {
    1: {
      title: 'Pehli Bhookh (Appetite Started)',
      dialogue: '😋 Mmm, delicious! But I\'m still hungry... Mujhe aur khilao! 🤤',
      subtitle: 'Bakasur tasted the first bites of ' + dish.name + '! Appetite is warming up.',
      statusColor: 'text-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      progressBg: 'from-amber-500 via-orange-400 to-yellow-300',
      ctaText: '🍽️ AUR KHILAO',
      ctaSubtext: '👆 Click "AUR KHILAO" to feed Bakasur the next course!',
      mascotEmoji: '😋',
      mascotMood: 'Hungry & Ready'
    },
    2: {
      title: 'Pel Ke Bhookh (Going Strong)',
      dialogue: '🍗 Mazedaar! Par pet abhi bhi nahi bhara... Aur lao!',
      subtitle: 'Bakasur is gobbling down the spices fast! He still wants more food.',
      statusColor: 'text-orange-500',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
      progressBg: 'from-orange-500 via-amber-400 to-yellow-400',
      ctaText: '🍽️ AUR KHILAO (MORE FOOD!)',
      ctaSubtext: '👆 Click "AUR KHILAO" to feed him to maximum capacity!',
      mascotEmoji: '🤤',
      mascotMood: 'Gobbling Fast'
    },
    3: {
      title: 'Pet Phat Gaya! (Acidity Attack 🔥)',
      dialogue: '🔥🔥 ARRE BAAP RE! Masala bohot zyada ho gaya! Pet mein aag lag gayi... Bachao! Help karo!',
      subtitle: 'Too much intense spice triggered massive heartburn! Give Bakasur Gastrium fast antacid!',
      statusColor: 'text-red-500',
      badgeBg: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
      progressBg: 'from-red-600 via-rose-500 to-orange-500',
      ctaText: '💊 GIVE GASTRIUM TO BAKASUR ⚡',
      ctaSubtext: '🚨 Neutralize heartburn and acidity in 6 seconds with Gastrium!',
      mascotEmoji: '🔥',
      mascotMood: 'Acidity Overload!'
    }
  };

  const currentConfig = STAGE_CONFIG[currentStage as 1 | 2 | 3] || STAGE_CONFIG[1];

  // Handle "Aur Khilao" and "Give Gastrium" actions
  const handleMainAction = () => {
    if (currentStage === 1) {
      // Advance to Stage 2 (45%)
      if (onPlaySound) onPlaySound('bite');
      triggerConfetti();
      setInternalStage(2);
      if (onFeastingStageChange) onFeastingStageChange(2);
    } else if (currentStage === 2) {
      // Advance to Stage 3 (100% Acidity Overload)
      if (onPlaySound) onPlaySound('bite');
      triggerConfetti();
      setInternalStage(3);
      if (onFeastingStageChange) onFeastingStageChange(3);
      if (onProceedToHeartburn) onProceedToHeartburn();
    } else {
      // Stage 3 -> Give Gastrium (Launch 6s Countdown)
      if (onPlaySound) onPlaySound('relief');
      onGiveGastrium();
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 75,
        origin: { y: 0.65 },
        colors: ['#FF5500', '#FFB800', '#FF3B30', '#00ACC1', '#00C853']
      });
    } catch {
      // Ignore
    }
  };

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-4 sm:gap-5 text-slate-900 animate-in fade-in duration-300">
      {/* Top Header Label */}
      <div className="text-left">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            STEP 4 • BAKASUR FEASTING 🍲
          </span>
          <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            Stage {currentStage} of 3
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-extrabold uppercase tracking-wider mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>LIVE FEASTING • {restaurant.name.toUpperCase()}, {restaurant.city.toUpperCase()}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 brand-font flex items-center gap-2">
          <span>{currentStage === 3 ? 'Arre Re! Masala Overload!' : `Bakasur is Eating ${dish.name}!`}</span>
        </h2>
      </div>

      {/* Bakasur Dynamic Comic Speech Bubble Box */}
      <div className={`relative rounded-2xl p-4 sm:p-5 border-2 shadow-sm transition-all duration-300 ${
        currentStage === 3
          ? 'bg-red-50/90 border-red-400 text-red-950 shadow-red-100'
          : currentStage === 2
          ? 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-amber-100'
          : 'bg-blue-50/90 border-blue-200 text-blue-950 shadow-blue-50'
      }`}>
        {/* Speech Bubble Pointer */}
        <div className={`absolute -top-2.5 left-8 w-5 h-5 rotate-45 border-t-2 border-l-2 bg-inherit ${
          currentStage === 3
            ? 'border-red-400'
            : currentStage === 2
            ? 'border-amber-300'
            : 'border-blue-200'
        }`} />

        <div className="flex items-start gap-3 relative z-10">
          <div className="text-3xl sm:text-4xl shrink-0 p-1 select-none animate-bounce">
            {currentConfig.mascotEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <span>BAKASUR SAYS:</span>
                <span className="font-mono text-slate-400">({currentConfig.mascotMood})</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${currentConfig.badgeBg}`}>
                {meterPercent}% CAPACITY
              </span>
            </div>

            <p className="font-extrabold text-sm sm:text-base leading-snug tracking-tight text-slate-900">
              &ldquo;{currentConfig.dialogue}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Selected Food & Multi-Stage Food Meter HUD */}
      <div className="rounded-2xl bg-slate-900 text-white p-4 sm:p-5 flex flex-col gap-3.5 shadow-xl border border-slate-800">
        {/* Row 1: Food Info & Spice Level */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              🍽 SELECTED FOOD &amp; JOINT
            </span>
            <h3 className="font-black text-base sm:text-lg text-white brand-font truncate">
              {dish.name}
            </h3>
            <p className="text-xs text-slate-400 font-medium truncate">
              📍 {restaurant.name} • {restaurant.city}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1 text-xs font-black text-red-400 bg-red-950/80 px-2.5 py-1 rounded-full border border-red-500/40 shadow-sm">
              <span>{spice.icon}</span>
              <span>{spice.name}</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Heat: {spice.level}</p>
          </div>
        </div>

        {/* Row 2: Food Meter Capacity & Status */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Flame className={`w-4 h-4 ${meterPercent >= 100 ? 'text-red-500 animate-ping' : 'text-amber-400 animate-pulse'}`} />
              <span className="font-black text-slate-200 uppercase tracking-wide brand-font">
                FOOD METER: <span className={currentConfig.statusColor}>{currentConfig.title}</span>
              </span>
            </div>
            <span className={`font-black font-mono text-sm sm:text-base ${
              meterPercent >= 100 ? 'text-red-400 animate-pulse' : 'text-amber-300'
            }`}>
              {meterPercent}%
            </span>
          </div>

          {/* Meter Bar */}
          <div className="relative w-full h-6 sm:h-7 rounded-xl bg-slate-950 p-1 border border-slate-700/80 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-lg bg-gradient-to-r ${currentConfig.progressBg} transition-all duration-700 ease-out flex items-center justify-end pr-2 shadow-lg`}
              style={{ width: `${Math.max(meterPercent, 10)}%` }}
            >
              <span className="text-[10px] sm:text-[11px] font-black text-slate-950 font-mono tracking-tight">
                {meterPercent}%
              </span>
            </div>

            {/* Checkpoint Milestones (20%, 45%, 100%) */}
            <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none opacity-40">
              <div className="h-3 w-0.5 bg-white" title="Stage 1 (20%)" />
              <div className="h-3 w-0.5 bg-white" title="Stage 2 (45%)" />
              <div className="h-3 w-0.5 bg-white" title="Stage 3 (100%)" />
            </div>
          </div>

          {/* Stage Checkpoints */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-medium">
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${meterPercent >= 20 ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'}`} />
              <span className={meterPercent >= 20 ? 'text-amber-300 font-bold' : ''}>20% Eaten</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${meterPercent >= 45 ? 'bg-orange-400 shadow-sm shadow-orange-400' : 'bg-slate-700'}`} />
              <span className={meterPercent >= 45 ? 'text-orange-300 font-bold' : ''}>45% Gobbled</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${meterPercent >= 100 ? 'bg-red-500 shadow-sm shadow-red-500 animate-ping' : 'bg-slate-700'}`} />
              <span className={meterPercent >= 100 ? 'text-red-400 font-extrabold' : ''}>100% Critical 🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive CTA Button */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-3">
          {/* Back Button (always available to pick food again) */}
          <button
            onClick={onBackToDish}
            type="button"
            className="px-4 sm:px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Food</span>
          </button>

          {/* Dynamic Stage Progression CTA Button */}
          <button
            onClick={handleMainAction}
            type="button"
            className={`flex-1 py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl font-extrabold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer brand-font ${
              currentStage === 3
                ? 'gastrium-pulse bg-gradient-to-r from-emerald-600 via-teal-600 to-[#023093] text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-emerald-900/40 border border-emerald-400/60'
                : 'aur-khilo-btn bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-orange-950/40 border border-amber-300/60'
            }`}
          >
            {currentStage === 3 ? (
              <>
                <ShieldAlert className="w-5 h-5 text-emerald-300 animate-bounce shrink-0" />
                <span>{currentConfig.ctaText}</span>
              </>
            ) : (
              <>
                <Utensils className="w-4 h-4 fill-current text-white shrink-0" />
                <span>{currentConfig.ctaText}</span>
                <Zap className="w-4 h-4 fill-current animate-bounce text-yellow-300 shrink-0" />
              </>
            )}
          </button>
        </div>

        <p className={`text-center text-[11px] font-bold ${
          currentStage === 3 ? 'text-red-600 animate-pulse' : 'text-slate-500'
        }`}>
          {currentConfig.ctaSubtext}
        </p>
      </div>
    </div>
  );
};

