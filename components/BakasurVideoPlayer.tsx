'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Flame, ShieldAlert, Zap } from 'lucide-react';
import { SpiceOption } from './steps/StepDish';

interface BakasurVideoPlayerProps {
  videoUrl: string;
  stageName: string; // 'city' | 'restaurant' | 'dish' | 'eating' | 'heartburn' | 'relief_countdown' | 'relief_done' | 'pass'
  feastingStage?: 1 | 2 | 3;
  dishName?: string;
  spice?: SpiceOption;
  soundEnabled?: boolean;
  onVideoEnded?: () => void;
  posterImage?: string;
}

export const BakasurVideoPlayer: React.FC<BakasurVideoPlayerProps> = ({
  videoUrl,
  stageName,
  feastingStage = 1,
  dishName,
  spice,
  soundEnabled = true,
  onVideoEnded,
  posterImage = "/images/bakasur_pass.jpg"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(!soundEnabled);
  const [isVideoEnded, setIsVideoEnded] = useState<boolean>(false);

  // Sync mute state
  useEffect(() => {
    setIsMuted(!soundEnabled);
    if (videoRef.current) {
      videoRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);

  // Restart & play on video URL change
  useEffect(() => {
    setIsVideoEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [videoUrl, stageName, feastingStage]);

  const handleVideoEnded = () => {
    setIsVideoEnded(true);
    setIsPlaying(false);
    if (onVideoEnded) {
      onVideoEnded();
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const isPreEatingStage = stageName === 'city' || stageName === 'restaurant' || stageName === 'dish';
  const isEatingStage = stageName === 'eating' || stageName === 'heartburn';
  const isPassStage = stageName === 'pass';
  const isReliefDoneStage = stageName === 'relief_done';

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 bg-[#060b24] group flex items-center justify-center">
      {/* Top Left: Gastrium Pill Logo Overlay */}
      <div className="absolute top-3.5 left-3.5 z-30 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-black shadow-md">
          <span className="text-cyan-400">💊</span>
          <span>Gastrium</span>
          <span className="text-blue-400 font-normal">/</span>
        </div>
      </div>

      {/* Top Right: Dynamic Stage Badge Overlay */}
      {isEatingStage ? (
        <div className="absolute top-3.5 right-3.5 z-30 pointer-events-none animate-in fade-in duration-300">
          {feastingStage === 1 ? (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[11px] font-black shadow-lg border border-amber-300">
              <span>😋</span>
              <span>{isVideoEnded ? '20% EATEN • WAITING FOR FOOD!' : '20% EATING...'}</span>
            </div>
          ) : feastingStage === 2 ? (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500 text-white text-[11px] font-black shadow-lg border border-orange-300 animate-pulse">
              <span>🤤</span>
              <span>{isVideoEnded ? '45% GOBBLED • STILL HUNGRY!' : '45% GOBBLING...'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black shadow-lg border border-red-400 animate-bounce">
              <span>🔥</span>
              <span>100% OVERLOAD • ACIDITY ATTACK!</span>
            </div>
          )}
        </div>
      ) : isPreEatingStage ? (
        <div className="absolute top-3.5 right-3.5 z-30 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-[11px] font-black shadow-lg border border-amber-300">
            <span className="animate-pulse">⚡</span>
            <span>HUNGRY MONSTER</span>
          </div>
        </div>
      ) : null}

      {/* Main Video or Static Graphic depending on Stage */}
      {isReliefDoneStage ? (
        /* Relief Visual */
        <div className="w-full h-full relative">
          <img
            src="/images/bakasur_relieved.jpg"
            alt="Bakasur Relieved"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b24]/60 via-transparent to-transparent" />
        </div>
      ) : isPassStage ? (
        /* Tour Pass Mascot Visual */
        <div className="w-full h-full relative">
          <img
            src="/images/bakasur_pass.jpg"
            alt="Bakasur Official Pass"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b24]/40 via-transparent to-transparent" />
        </div>
      ) : isPreEatingStage ? (
        /* Step 1 & Step 2: Hungry Bakasur Mascot Visual (NOT eating video) */
        <div className="w-full h-full relative flex items-center justify-center bg-[#060b24]">
          <img
            src="/images/bakasur_hero.jpg"
            alt="Hungry Bakasur Mascot"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060b24]/80 via-black/20 to-transparent pointer-events-none" />

          {/* Comic Callouts for Hungry Bakasur */}
          <div className="absolute left-4 top-14 z-20 animate-bounce pointer-events-none">
            <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black border-2 border-white shadow-xl flex items-center gap-1.5 rotate-[-6deg]">
              <span className="text-sm">🤤</span>
              <span>Khana Kahan Hai?</span>
            </div>
          </div>

          <div className="absolute right-4 bottom-14 z-20 animate-pulse pointer-events-none">
            <div className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md text-amber-300 text-[11px] font-black border border-amber-400/50 shadow-lg flex items-center gap-1.5">
              <span>🍗</span>
              <span>Awaiting Your Delicious Order...</span>
            </div>
          </div>
        </div>
      ) : (
        /* Live Bakasur Video Player (Active during 'eating' and feasting stages) */
        <div className="w-full h-full relative flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            autoPlay
            muted={isMuted}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover object-center"
          />

          {/* Dynamic Floating Comic Tags based on Feasting Stage */}
          {isEatingStage && !isVideoEnded && (
            <>
              {feastingStage === 1 && (
                <>
                  <div className="absolute left-5 top-1/3 z-20 animate-bounce pointer-events-none">
                    <div className="px-2.5 py-1 rounded-xl bg-amber-500/90 text-slate-950 text-xs font-black border border-amber-300 shadow-xl flex items-center gap-1 rotate-[-8deg]">
                      <span>😋</span>
                      <span>DELICIOUS!</span>
                    </div>
                  </div>

                  <div className="absolute right-5 bottom-24 z-20 animate-pulse pointer-events-none">
                    <div className="px-2.5 py-1 rounded-xl bg-orange-500/90 text-white text-xs font-black border border-orange-300 shadow-xl flex items-center gap-1 rotate-[6deg]">
                      <span>✨</span>
                      <span>YUMMY!</span>
                    </div>
                  </div>

                  <div className="absolute left-4 bottom-14 z-20 pointer-events-none">
                    <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-yellow-300 text-[10px] font-black uppercase tracking-wider border border-yellow-400/40 flex items-center gap-1">
                      <span>🍽️</span>
                      <span>CHOMP CHOMP!</span>
                    </div>
                  </div>
                </>
              )}

              {feastingStage === 2 && (
                <>
                  <div className="absolute left-5 top-1/3 z-20 animate-bounce pointer-events-none">
                    <div className="px-2.5 py-1 rounded-xl bg-orange-600/90 text-white text-xs font-black border border-orange-400 shadow-xl flex items-center gap-1 rotate-[-8deg]">
                      <span>🌶️</span>
                      <span>MORE SPICE!</span>
                    </div>
                  </div>

                  <div className="absolute right-5 bottom-24 z-20 animate-pulse pointer-events-none">
                    <div className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-black border border-amber-300 shadow-xl flex items-center gap-1 rotate-[6deg]">
                      <span>🤤</span>
                      <span>GOBBLING FAST!</span>
                    </div>
                  </div>

                  <div className="absolute left-4 bottom-14 z-20 pointer-events-none">
                    <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-orange-300 text-[10px] font-black uppercase tracking-wider border border-orange-400/40 flex items-center gap-1">
                      <span>🍗</span>
                      <span>GULP GULP!</span>
                    </div>
                  </div>
                </>
              )}

              {feastingStage === 3 && (
                <>
                  <div className="absolute left-5 top-1/3 z-20 animate-bounce pointer-events-none">
                    <div className="px-2.5 py-1 rounded-xl bg-red-600 text-white text-xs font-black border border-red-400 shadow-xl flex items-center gap-1 rotate-[-8deg]">
                      <span>🔥🔥</span>
                      <span>PET MEIN AAG!</span>
                    </div>
                  </div>

                  <div className="absolute right-5 bottom-24 z-20 animate-pulse pointer-events-none">
                    <div className="px-2.5 py-1 rounded-xl bg-red-700 text-white text-xs font-black border border-red-400 shadow-xl flex items-center gap-1 rotate-[6deg]">
                      <span>🚨</span>
                      <span>ACIDITY OVERLOAD!</span>
                    </div>
                  </div>

                  <div className="absolute left-4 bottom-14 z-20 pointer-events-none">
                    <div className="px-2.5 py-1 rounded-lg bg-red-950/80 backdrop-blur-sm text-amber-300 text-[10px] font-black uppercase tracking-wider border border-red-500/50 flex items-center gap-1 animate-pulse">
                      <span>💊</span>
                      <span>NEED GASTRIUM NOW!</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Waiting for More Food Overlay when Video Finishes Playing */}
          {isEatingStage && isVideoEnded && (
            <div className="absolute inset-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-black/30 backdrop-blur-[2px] flex flex-col items-center justify-center p-5 sm:p-6 text-center animate-in fade-in duration-300">
              {feastingStage === 1 ? (
                <div className="flex flex-col items-center gap-2.5 max-w-xs">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 animate-bounce">
                    😋
                  </div>
                  
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
                    <span>🍽️ 20% EATEN • WAITING FOR FOOD!</span>
                  </div>

                  <div className="rounded-2xl bg-white/15 backdrop-blur-md p-3 border border-white/25 text-white shadow-xl">
                    <p className="text-xs sm:text-sm font-black leading-snug">
                      &ldquo;Mmm, delicious! But I&apos;m still hungry... Mujhe aur khilao! 🤤&rdquo;
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-orange-900/50 animate-pulse border border-amber-300/60">
                    <span>👇 Click &ldquo;AUR KHILAO&rdquo; Below 👇</span>
                  </div>
                </div>
              ) : feastingStage === 2 ? (
                <div className="flex flex-col items-center gap-2.5 max-w-xs">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30 animate-bounce">
                    🤤
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-black uppercase tracking-wider shadow-md">
                    <span>🍗 45% GOBBLED • STILL HUNGRY!</span>
                  </div>

                  <div className="rounded-2xl bg-white/15 backdrop-blur-md p-3 border border-white/25 text-white shadow-xl">
                    <p className="text-xs sm:text-sm font-black leading-snug">
                      &ldquo;Mazedaar! Par pet abhi bhi nahi bhara... Aur lao!&rdquo;
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-orange-900/50 animate-pulse border border-orange-300/60">
                    <span>👇 Click &ldquo;AUR KHILAO&rdquo; Below 👇</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2.5 max-w-xs">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-3xl shadow-lg shadow-red-500/30 animate-bounce">
                    🔥
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md animate-pulse">
                    <span>🚨 100% ACIDITY OVERLOAD!</span>
                  </div>

                  <div className="rounded-2xl bg-red-950/80 backdrop-blur-md p-3 border border-red-500/40 text-amber-200 shadow-xl">
                    <p className="text-xs sm:text-sm font-black leading-snug">
                      &ldquo;Pet mein aag lag gayi! Give me Gastrium immediately!&rdquo;
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-[#023093] text-white text-[11px] font-black uppercase tracking-wider shadow-lg shadow-emerald-900/50 animate-bounce border border-emerald-300/60">
                    <span>👇 Click &ldquo;GIVE GASTRIUM&rdquo; Below 👇</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Play/Pause Button on Hover if manual pause */}
          {!isPlaying && !isVideoEnded && (
            <button
              onClick={togglePlay}
              className="absolute z-20 w-14 h-14 rounded-full bg-[#023093]/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </button>
          )}
        </div>
      )}

      {/* Bottom-Left Overlay Pill: Active Selection / Devouring Badge */}
      {dishName && (
        <div className="absolute bottom-3.5 left-3.5 z-30 pointer-events-none max-w-[85%]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg truncate">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="truncate">
              {isEatingStage ? `Bakasur Devouring ${dishName}` : `Selected: ${dishName}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

