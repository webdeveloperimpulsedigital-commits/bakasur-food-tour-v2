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

  // Stage Dialogues & Visual Metadata (3-Tap Feeding Loop & Acidity from Indulgence)
  const STAGE_CONFIG = {
    1: {
      title: 'Pehli Helping',
      dialogue: 'Mmm delicious! Par pet nahi bhara, mujhe aur khilao! 🤤',
      subtitle: 'Bakasur devoured 1st plate! He wants more.',
      statusColor: 'text-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      progressBg: 'from-amber-500 via-orange-400 to-yellow-300',
      plates: '🍽️ 1 Plate',
      ctaText: '🍽️ AUR KHILAO (2ND HELPING)',
      ctaSubtext: '👆 Feed Bakasur the 2nd plate!',
      mascotEmoji: '😋',
      mascotMood: 'Wanting More Food'
    },
    2: {
      title: 'Doosri Helping',
      dialogue: 'Mazedaar! Bakasur ke monster pet ke liye yeh kaafi nahi... Aur lao! 🍗',
      subtitle: 'Bakasur devoured 2 plates! Demands 3rd course.',
      statusColor: 'text-orange-500',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
      progressBg: 'from-orange-500 via-amber-400 to-yellow-400',
      plates: '🍽️🍽️ 2 Plates',
      ctaText: '🍽️ AUR KHILAO (3RD HELPING)',
      ctaSubtext: '👆 Feed Bakasur to full capacity!',
      mascotEmoji: '🤤',
      mascotMood: 'Still Hungry'
    },
    3: {
      title: 'Acidity Overload 🔥',
      dialogue: '🔥🔥 ARRE BAAP RE! Overeating se pet mein aag lag gayi... Bachao!',
      subtitle: 'Heavy indulgence caused severe acidity discomfort!',
      statusColor: 'text-red-500',
      badgeBg: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
      progressBg: 'from-red-600 via-rose-500 to-orange-500',
      plates: '🍽️🍽️🍽️ 3 Plates (Overload!)',
      ctaText: '⚡ HELP BAKASUR NOW! 🔥',
      ctaSubtext: '🚨 Give Gastrium to cool down the burning acid in 6s!',
      mascotEmoji: '🔥',
      mascotMood: 'Acid Discomfort'
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
    <div className="w-full flex flex-col gap-2 sm:gap-2.5 text-white animate-in fade-in duration-300">
      {/* Top Header Label */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[10px] font-black text-yellow-300 uppercase tracking-wider block">
            STEP 3 • BAKASUR FEASTING
          </span>
          <h2 className="text-base sm:text-lg font-black tracking-tight text-white brand-font leading-tight truncate">
            {currentStage === 3 ? 'Arre Re! Masala Overload!' : `Feeding ${dish.name}!`}
          </h2>
        </div>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${currentConfig.badgeBg}`}>
          {meterPercent}% FULL
        </span>
      </div>

      {/* Bakasur Dynamic Comic Speech Bubble Box */}
      <div className={`relative rounded-xl p-2.5 sm:p-3 border-2 shadow-sm transition-all duration-300 z-10 ${
        currentStage === 3
          ? 'bg-red-950/85 border-red-400 text-white shadow-red-950/50'
          : currentStage === 2
          ? 'bg-amber-950/85 border-amber-400 text-white shadow-amber-950/50'
          : 'bg-blue-950/85 border-blue-300 text-white shadow-blue-950/50'
      }`}>
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="text-2xl shrink-0 p-0.5 select-none animate-bounce">
            {currentConfig.mascotEmoji}
          </div>
          <p className="font-extrabold text-xs sm:text-sm leading-snug tracking-tight text-white flex-1">
            &ldquo;{currentConfig.dialogue}&rdquo;
          </p>
        </div>
      </div>

      {/* Selected Food & Food Meter Bar */}
      <div className="rounded-xl bg-white/10 text-white p-2.5 sm:p-3 flex flex-col gap-1.5 shadow-md border border-white/15 backdrop-blur-md relative z-10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <Flame className={`w-3.5 h-3.5 shrink-0 ${meterPercent >= 100 ? 'text-red-400 animate-ping' : 'text-yellow-400'}`} />
            <span className="font-black text-white uppercase tracking-wide brand-font text-[11px] truncate">
              {currentConfig.title}
            </span>
          </div>
          <span className="text-[10px] font-bold text-yellow-300 bg-yellow-400/20 px-1.5 py-0.2 rounded shrink-0">
            {spice.icon} {spice.name}
          </span>
        </div>

        {/* Meter Bar */}
        <div className="relative w-full h-4 sm:h-5 rounded-lg bg-slate-900/60 p-0.5 border border-white/20 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-md bg-gradient-to-r ${currentConfig.progressBg} transition-all duration-700 ease-out flex items-center justify-end pr-1.5 shadow-sm`}
            style={{ width: `${Math.max(meterPercent, 10)}%` }}
          >
            <span className="text-[9px] font-black text-slate-950 font-mono">
              {meterPercent}%
            </span>
          </div>
        </div>

        {/* Stage Milestones */}
        <div className="flex items-center justify-between text-[10px] text-blue-200 font-medium">
          <span className={meterPercent >= 20 ? 'text-yellow-300 font-bold' : ''}>🍽️ 1st Plate</span>
          <span className={meterPercent >= 45 ? 'text-orange-300 font-bold' : ''}>🍽️ 2nd Plate</span>
          <span className={meterPercent >= 100 ? 'text-red-300 font-extrabold' : ''}>🔥 Overload</span>
        </div>
      </div>

      {/* Main Interactive CTA Button */}
      <div className="flex flex-col gap-1 pt-0.5 relative z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDish}
            type="button"
            className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change</span>
          </button>

          <button
            onClick={handleMainAction}
            type="button"
            className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer brand-font ${
              currentStage === 3
                ? 'gastrium-pulse bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-emerald-500/30 border border-emerald-300'
                : 'aur-khilo-btn bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 text-slate-950 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-yellow-500/25 border border-yellow-300'
            }`}
          >
            {currentStage === 3 ? (
              <>
                <ShieldAlert className="w-4 h-4 text-slate-950 animate-bounce shrink-0" />
                <span>{currentConfig.ctaText}</span>
              </>
            ) : (
              <>
                <Utensils className="w-3.5 h-3.5 fill-current text-slate-950 shrink-0" />
                <span>{currentConfig.ctaText}</span>
                <Zap className="w-3.5 h-3.5 fill-current animate-bounce text-slate-950 shrink-0" />
              </>
            )}
          </button>
        </div>

        <p className={`text-center text-[10px] font-bold ${
          currentStage === 3 ? 'text-red-300 animate-pulse' : 'text-blue-200'
        }`}>
          {currentConfig.ctaSubtext}
        </p>
      </div>
    </div>
  );
};


