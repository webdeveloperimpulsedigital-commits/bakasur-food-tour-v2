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
  onToggleSound?: () => void;
  onVideoEnded?: () => void;
  posterImage?: string;
}

export const BakasurVideoPlayer: React.FC<BakasurVideoPlayerProps> = ({
  videoUrl,
  stageName,
  feastingStage = 1,
  dishName,
  spice,
  soundEnabled = false,
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

  return (
    <div className="relative w-full h-full min-h-full overflow-hidden bg-black flex items-center justify-center">
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

      {/* Auto-playing Bakasur Video Player */}
      <video
        ref={videoRef}
        src={videoUrl}
        playsInline
        autoPlay
        loop
        muted={isMuted}
        onEnded={onVideoEnded}
        className="w-full h-full object-cover object-[center_40%] sm:object-center"
      />
    </div>
  );
};

