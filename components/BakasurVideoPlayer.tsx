'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Flame, ShieldAlert, Zap } from 'lucide-react';
import { SpiceOption } from './steps/StepDish';

interface BakasurVideoPlayerProps {
  videoUrl: string;
  stageName: string;
  feastingStage?: 1 | 2 | 3;
  dishName?: string;
  spice?: SpiceOption;
  soundEnabled?: boolean;
  loop?: boolean;
  onToggleSound?: () => void;
  onVideoEnded?: () => void;
  posterImage?: string;
}

export const BakasurVideoPlayer: React.FC<BakasurVideoPlayerProps> = ({
  videoUrl,
  stageName,
  feastingStage = 1,
  dishName,
  soundEnabled = true,
  loop = true,
  onToggleSound,
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

  // Autoplay on video load / URL change
  useEffect(() => {
    setIsVideoEnded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = !soundEnabled;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // If unmuted autoplay fails due to browser policy, fallback to muted autoplay
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            setIsPlaying(false);
          });
        }
      });
    }
  }, [videoUrl, stageName, feastingStage, soundEnabled]);

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

  // Determine if eating video
  const isEating = stageName === 'eating' || stageName === 'heartburn';
  // If loop is not explicitly specified, do not loop during eating
  const shouldLoop = loop !== undefined ? loop : !isEating;

  return (
    <div className="relative w-full h-full min-h-full overflow-hidden bg-slate-950 flex items-center justify-center">
      {/* Ambient blurred backdrop to ensure seamless edge-to-edge look without black bars */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-2xl scale-125 opacity-40 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${posterImage})`,
          backgroundColor: '#0f172a'
        }}
      />

      {/* Top Left: Sound Mute / Unmute Toggle Button */}
      {onToggleSound && (
        <button
          onClick={onToggleSound}
          type="button"
          aria-label={soundEnabled ? "Mute Video Sound" : "Unmute Video Sound"}
          className="absolute top-4 left-4 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/25 backdrop-blur-md shadow-lg transition-all cursor-pointer flex items-center justify-center group"
          title={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 group-hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:scale-110 transition-transform" />
          )}
        </button>
      )}

      {/* When video ends in eating mode: subtle waiting for food badge */}
      {isEating && isVideoEnded && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-yellow-400/50 backdrop-blur-md text-yellow-300 text-xs font-bold shadow-lg animate-pulse pointer-events-none">
          <span>🍽️</span>
          <span>Food Finished • Waiting for Next Helping</span>
        </div>
      )}

      {/* Main Bakasur Video Player */}
      <video
        ref={videoRef}
        src={videoUrl}
        playsInline
        autoPlay
        loop={shouldLoop}
        muted={isMuted}
        onEnded={handleVideoEnded}
        className="w-full h-full object-contain sm:object-cover object-center relative z-10"
      />
    </div>
  );
};

