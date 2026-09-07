'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Flame, ShieldAlert, Sparkles, Utensils, Zap, HeartHandshake } from 'lucide-react';
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
  onBackToDish?: () => void;
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
      title: 'Pehli Helping (20%)',
      dialogue: 'Waah re waah! Itna tasty? Par yeh toh mere daant mein phas ke reh gaya... Aur lao jaldi! 😋',
      subtitle: 'Bakasur inhaled the 1st plate! Still 80% hungry.',
      statusColor: 'text-amber-500',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      progressBg: 'from-amber-500 via-orange-400 to-yellow-300',
      plates: '🍽️ 1 Plate',
      ctaText: '🍽️ AUR KHILAO (2ND HELPING)',
      ctaSubtext: '👉 Feed Bakasur the 2nd plate!',
      mascotEmoji: '😋',
      mascotMood: 'Wanting More Food'
    },
    2: {
      title: 'Doosri Helping (45%)',
      dialogue: 'Mazedaar! Bakasur ke monster pet ko full karne ke liye ek aur round chahiye... Phenko idhar! 🤪',
      subtitle: 'Warning: Spice level reaching dangerous territory!',
      statusColor: 'text-orange-500',
      badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
      progressBg: 'from-orange-500 via-amber-400 to-yellow-400',
      plates: '🍽️🍽️ 2 Plates',
      ctaText: '💥 AUR KHILAO (3RD ROUND - OVERLOAD)',
      ctaSubtext: '👉 Warning: Dangerously high spice incoming!',
      mascotEmoji: '🤪',
      mascotMood: 'Still Hungry'
    },
    3: {
      title: 'Acidity Overload! 100% Full 🔥',
      dialogue: 'ARRE BAAP RE! 🔥🔥 Seene mein volcano phat gaya! Pet mein aag lag gayi... Bachao re koi!',
      subtitle: '🚨 Severe Acidity & Heartburn! Give Gastrium for 6s cooling relief!',
      statusColor: 'text-red-500',
      badgeBg: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
      progressBg: 'from-red-600 via-rose-500 to-orange-500',
      plates: '🍽️🍽️🍽️ 3 Plates (Overload!)',
      ctaText: '⚡ GIVE 6s GASTRIUM RELIEF! 💧',
      ctaSubtext: '🚨 Instant heartburn relief needed! Tap to cure Bakasur',
      mascotEmoji: '🥵',
      mascotMood: 'Acid Discomfort'
    }
  };

  const currentConfig = STAGE_CONFIG[currentStage as 1 | 2 | 3] || STAGE_CONFIG[1];

  // Handle "Aur Khilao" and "Give Gastrium" actions
  const handleMainAction = () => {
    if (currentStage === 1) {
      // Advance to Stage 2 (45%)
      if (onPlaySound) onPlaySound('bite');
      setInternalStage(2);
      if (onFeastingStageChange) onFeastingStageChange(2);
    } else if (currentStage === 2) {
      // Advance to Stage 3 (100% Acidity Overload)
      if (onPlaySound) onPlaySound('bite');
      setInternalStage(3);
      if (onFeastingStageChange) onFeastingStageChange(3);
      if (onProceedToHeartburn) onProceedToHeartburn();
    } else {
      // Stage 3 -> Give Gastrium (Launch 6s Countdown)
      if (onPlaySound) onPlaySound('relief');
      onGiveGastrium();
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-2.5 text-white animate-in fade-in duration-300">
      {/* Top Header Label */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white brand-font leading-tight">
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
            <Flame className={`w-3.5 h-3.5 shrink-0 ${meterPercent >= 100 ? 'text-red-400 animate-ping' : 'text-orange-400'}`} />
            <span className="font-black text-white uppercase tracking-wide brand-font text-[11px] truncate">
              {currentConfig.title}
            </span>
          </div>
          <span className="text-[10px] font-bold text-white bg-[#D23002]/60 px-1.5 py-0.2 rounded border border-[#D23002] shrink-0">
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
          <span className={meterPercent >= 20 ? 'text-orange-300 font-bold' : ''}>🍽️ 1st Plate</span>
          <span className={meterPercent >= 45 ? 'text-orange-300 font-bold' : ''}>🍽️ 2nd Plate</span>
          <span className={meterPercent >= 100 ? 'text-red-300 font-extrabold' : ''}>🔥 Overload</span>
        </div>
      </div>

      {/* Main Interactive CTA Button */}
      <div className="flex flex-col gap-1 pt-0.5 relative z-10">
        <button
          onClick={handleMainAction}
          type="button"
          className={`w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer brand-font ${
            currentStage === 3
              ? 'gastrium-pulse bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-emerald-500/30 border border-emerald-300'
              : 'aur-khilo-btn bg-[#D23002] hover:bg-[#eb420e] text-white hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-[#D23002]/40 border border-white/20'
          }`}
        >
          {currentStage === 3 ? (
            <>
              <ShieldAlert className="w-4 h-4 text-slate-950 animate-bounce shrink-0" />
              <span>{currentConfig.ctaText}</span>
            </>
          ) : (
            <>
              <Utensils className="w-3.5 h-3.5 fill-current text-white shrink-0" />
              <span>{currentConfig.ctaText}</span>
              <Zap className="w-3.5 h-3.5 fill-current animate-bounce text-yellow-300 shrink-0" />
            </>
          )}
        </button>

        <p className={`text-center text-[10px] font-bold ${
          currentStage === 3 ? 'text-red-300 animate-pulse' : 'text-blue-200'
        }`}>
          {currentConfig.ctaSubtext}
        </p>
      </div>
    </div>
  );
};


