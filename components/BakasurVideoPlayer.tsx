'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Volume2, VolumeX, Sparkles, Flame, Play, Pause, Clapperboard, Video } from 'lucide-react';

export interface SpiceOption {
  id: string;
  name: string;
  level: string;
  icon: string;
  description?: string;
}

interface BakasurVideoPlayerProps {
  videoUrl: string;
  stageName: string;
  feastingStage?: 1 | 2 | 3;
  dishName?: string;
  dishImage?: string;
  restaurantName?: string;
  spice?: SpiceOption;
  soundEnabled?: boolean;
  loop?: boolean;
  onToggleSound?: () => void;
  onVideoEnded?: () => void;
  onSelectDish?: (dish: { name: string; image?: string; price?: number }) => void;
  posterImage?: string;
}

export interface DishMomentInfo {
  category: string;
  biteEmoji: string;
  biteLabel: string;
  munchSound: string;
  actionText: string;
  image: string;
  eatingScene: string;
}

// Preset popular food quick-picks for testing/dynamic preview
export const POPULAR_FOOD_PRESETS = [
  { name: 'Crispy Butter Masala Dosa', icon: '🥞', image: '/images/eating/dosa.jpg' },
  { name: 'Shahi Chicken Dum Biryani', icon: '🍗', image: '/images/eating/biryani.jpg' },
  { name: 'Aslam Special Butter Chicken', icon: '🍗', image: '/images/eating/butter_chicken.jpg' },
  { name: 'Sita Ram Chole Bhature', icon: '🫓', image: '/images/eating/chole_bhature.jpg' },
  { name: 'Famous Creamy Dal Makhani', icon: '🍲', image: '/images/eating/dal_makhani.jpg' },
  { name: 'Extra Butter Pav Bhaji', icon: '🍛', image: '/images/eating/pav_bhaji.jpg' },
  { name: 'Spicy Katakirr Tarri Misal', icon: '🌶️', image: '/images/eating/misal.jpg' },
  { name: 'Mutton Keema Ghotala & Pav', icon: '🍳', image: '/images/eating/keema_pav.jpg' },
  { name: 'Sajuk Tupatli Puran Poli', icon: '🧈', image: '/images/eating/puran_poli.jpg' },
  { name: 'SPDP Chaat Crunch', icon: '🥣', image: '/images/eating/spdp.jpg' }
];

export function getDishMomentDetails(dishName?: string, dishImage?: string): DishMomentInfo {
  const n = (dishName || '').toLowerCase();
  const hasCustomImg = Boolean(dishImage && (dishImage.startsWith('http') || dishImage.startsWith('/')));

  // 1. Puran Poli
  if (n.includes('puran poli') || n.includes('puran') || n.includes('poli')) {
    return {
      category: 'puran_poli',
      biteEmoji: '🧈',
      biteLabel: 'Ghee Puran Poli Feast',
      munchSound: 'SLURRP! Ghee Blast 🧈',
      actionText: 'Bakasur is devouring Ghee Puran Poli...',
      image: hasCustomImg ? dishImage! : '/images/eating/puran_poli.jpg',
      eatingScene: '/images/eating/puran_poli.jpg'
    };
  }

  // 2. Dosa / Uttapam / South Indian
  if (n.includes('dosa') || n.includes('uttapam') || n.includes('mysore masala') || n.includes('rava dosa') || n.includes('set dosa') || n.includes('ghee roast') || n.includes('benne')) {
    return {
      category: 'dosa',
      biteEmoji: '🥞',
      biteLabel: 'Crispy Butter Dosa Feast',
      munchSound: 'CRUNCH-CRUNCH! 🤤',
      actionText: 'Bakasur is chomping Crispy Dosa...',
      image: hasCustomImg ? dishImage! : '/images/eating/dosa.jpg',
      eatingScene: '/images/eating/dosa.jpg'
    };
  }

  // 3. Pav Bhaji / Masala Pav
  if (n.includes('pav bhaji') || n.includes('bhaji') || n.includes('pavbhaji') || n.includes('masala pav')) {
    return {
      category: 'pav_bhaji',
      biteEmoji: '🍛',
      biteLabel: 'Butter Pav Bhaji Feast',
      munchSound: 'CHOMP-CHOMP! Extra Butter 🧈',
      actionText: 'Bakasur is devouring Pav Bhaji...',
      image: hasCustomImg ? dishImage! : '/images/eating/pav_bhaji.jpg',
      eatingScene: '/images/eating/pav_bhaji.jpg'
    };
  }

  // 4. SPDP / Chaat / Dahi Puri / Pani Puri / Bhel
  if (n.includes('spdp') || n.includes('dahi puri') || n.includes('sev puri') || n.includes('pani puri') || n.includes('bhel') || n.includes('chaat') || n.includes('dahi') || n.includes('puri') || n.includes('sev') || n.includes('tikki')) {
    return {
      category: 'spdp',
      biteEmoji: '🥣',
      biteLabel: 'SPDP Chaat Crunch',
      munchSound: 'CRUNCH-POP! Chaat Blast 💥',
      actionText: 'Bakasur is popping Crispy Chaat...',
      image: hasCustomImg ? dishImage! : '/images/eating/spdp.jpg',
      eatingScene: '/images/eating/spdp.jpg'
    };
  }

  // 5. Misal Pav / Katakirr / Tarri
  if (n.includes('misal') || n.includes('katakirr') || n.includes('rassa') || n.includes('tarri') || n.includes('farsan') || n.includes('bedekar') || n.includes('saraswati') || n.includes('puneri misal')) {
    return {
      category: 'misal',
      biteEmoji: '🌶️',
      biteLabel: 'Jhanjhanit Tarri Misal',
      munchSound: 'SLURRP-FIRE! Teekha Kick 🔥',
      actionText: 'Bakasur is slurping Fiery Misal...',
      image: hasCustomImg ? dishImage! : '/images/eating/misal.jpg',
      eatingScene: '/images/eating/misal.jpg'
    };
  }

  // 6. Biryani / Pulao / Rice
  if (n.includes('biryani') || n.includes('pulao') || n.includes('dum biryani') || n.includes('rice')) {
    return {
      category: 'biryani',
      biteEmoji: '🍗',
      biteLabel: 'Shahi Dum Biryani Feast',
      munchSound: 'MUNCH-MUNCH! Aromatic Bite 🤤',
      actionText: 'Bakasur is gobbling Dum Biryani...',
      image: hasCustomImg ? dishImage! : '/images/eating/biryani.jpg',
      eatingScene: '/images/eating/biryani.jpg'
    };
  }

  // 7. Butter Chicken / Chicken / Meat / Curry / Mutton / Korma / Nihari
  if (n.includes('butter chicken') || n.includes('chicken') || n.includes('mutton') || n.includes('nihari') || n.includes('korma') || n.includes('handi') || n.includes('non veg') || n.includes('roast') || n.includes('tikka') || n.includes('burra') || n.includes('stroganoff') || n.includes('changezi')) {
    return {
      category: 'chicken',
      biteEmoji: '🍗',
      biteLabel: 'Rich Butter Chicken Feast',
      munchSound: 'CHOMP! Rich Masala Gravy 🍗',
      actionText: 'Bakasur is devouring Butter Chicken...',
      image: hasCustomImg ? dishImage! : '/images/eating/butter_chicken.jpg',
      eatingScene: '/images/eating/butter_chicken.jpg'
    };
  }

  // 8. Chole Bhature / Kulcha / Naan
  if (n.includes('chole') || n.includes('bhature') || n.includes('kulcha') || n.includes('naan') || n.includes('paratha') || n.includes('roti') || n.includes('baida roti')) {
    return {
      category: 'chole_bhature',
      biteEmoji: '🫓',
      biteLabel: 'Puffed Chole Bhature Feast',
      munchSound: 'RIP & DIP! Crispy Bhature 🤤',
      actionText: 'Bakasur is eating Chole Bhature...',
      image: hasCustomImg ? dishImage! : '/images/eating/chole_bhature.jpg',
      eatingScene: '/images/eating/chole_bhature.jpg'
    };
  }

  // 9. Keema Pav / Vada Pav / Burgers / Rolls / Sandwiches
  if (n.includes('keema') || n.includes('vada pav') || n.includes('roll') || n.includes('kebab') || n.includes('sandwich') || n.includes('burger') || n.includes('frankie')) {
    return {
      category: 'keema_pav',
      biteEmoji: '🍳',
      biteLabel: 'Spicy Keema & Vada Pav',
      munchSound: 'BIG BITE! Spicy Keema 🤤',
      actionText: 'Bakasur is chomping Keema Pav...',
      image: hasCustomImg ? dishImage! : '/images/eating/keema_pav.jpg',
      eatingScene: '/images/eating/keema_pav.jpg'
    };
  }

  // 10. Dal Makhani / Paneer / Vegetarian Gravies
  if (n.includes('dal') || n.includes('paneer') || n.includes('makhani') || n.includes('kofta') || n.includes('thali') || n.includes('pithla')) {
    return {
      category: 'dal_makhani',
      biteEmoji: '🍲',
      biteLabel: 'Creamy Dal & Paneer Feast',
      munchSound: 'SLURRP! Creamy Butter 🧈',
      actionText: 'Bakasur is relishing Dal Makhani...',
      image: hasCustomImg ? dishImage! : '/images/eating/dal_makhani.jpg',
      eatingScene: '/images/eating/dal_makhani.jpg'
    };
  }

  // 11. Mastani / Shakes / Lassi / Ice Cream / Desserts
  if (n.includes('mastani') || n.includes('shake') || n.includes('ice cream') || n.includes('lassi') || n.includes('falooda') || n.includes('kulfi') || n.includes('cake') || n.includes('custard') || n.includes('phirni') || n.includes('gulab jamun') || n.includes('sweet') || n.includes('biscuits')) {
    return {
      category: 'dessert',
      biteEmoji: '🍨',
      biteLabel: 'Chilled Mastani & Dessert',
      munchSound: 'GULP-GULP! Sweet Delight 🍨',
      actionText: 'Bakasur is drinking Sweet Mastani...',
      image: hasCustomImg ? dishImage! : 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
      eatingScene: '/images/eating/spdp.jpg'
    };
  }

  // 12. Tea / Coffee / Bun Maska
  if (n.includes('coffee') || n.includes('chai') || n.includes('tea') || n.includes('bun maska') || n.includes('maska') || n.includes('cafe')) {
    return {
      category: 'chai',
      biteEmoji: '☕',
      biteLabel: 'Bun Maska & Irani Chai',
      munchSound: 'DIP & SLURP! ☕',
      actionText: 'Bakasur is dipping Bun Maska in Chai...',
      image: hasCustomImg ? dishImage! : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      eatingScene: '/images/eating/keema_pav.jpg'
    };
  }

  // 13. Samosa / Kachori / Vada / Pakoda / Street Snacks
  if (n.includes('samosa') || n.includes('kachori') || n.includes('pakoda') || n.includes('bhajji') || n.includes('cutlet') || n.includes('momos') || n.includes('roll')) {
    return {
      category: 'snacks',
      biteEmoji: '🥟',
      biteLabel: 'Crispy Snack Blast',
      munchSound: `CRUNCH-POP! ${dishName || 'Crispy Snack'} 💥`,
      actionText: `Bakasur is chomping hot ${dishName || 'Snacks'}...`,
      image: hasCustomImg ? dishImage! : '/images/eating/spdp.jpg',
      eatingScene: '/images/eating/spdp.jpg'
    };
  }

  // 14. Pizza / Burger / Pasta / Fast Food
  if (n.includes('pizza') || n.includes('burger') || n.includes('pasta') || n.includes('fries') || n.includes('sandwich')) {
    return {
      category: 'fast_food',
      biteEmoji: '🍕',
      biteLabel: 'Cheesy Fast Food Feast',
      munchSound: `CHEESY-CHOMP! ${dishName || 'Cheesy Bite'} 🤤`,
      actionText: `Bakasur is devouring loaded ${dishName || 'Food'}...`,
      image: hasCustomImg ? dishImage! : '/images/eating/pav_bhaji.jpg',
      eatingScene: '/images/eating/pav_bhaji.jpg'
    };
  }

  // Default dynamic fallback for any custom dish typed by the user
  const formattedDish = dishName ? dishName.replace(/^Ready in |^Bakasur in |^Feeding /i, '').trim() : 'Delicious Food';
  return {
    category: 'general',
    biteEmoji: '🍛',
    biteLabel: `${formattedDish} Feast`,
    munchSound: `MUNCH-MUNCH! ${formattedDish} Blast! 🤤`,
    actionText: `Bakasur is devouring ${formattedDish}...`,
    image: hasCustomImg ? dishImage! : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    eatingScene: '/images/eating/pav_bhaji.jpg'
  };
}

export function getDishImage(dishName?: string, dishImage?: string): string {
  return getDishMomentDetails(dishName, dishImage).image;
}

export const BakasurVideoPlayer: React.FC<BakasurVideoPlayerProps> = ({
  videoUrl,
  stageName,
  feastingStage = 1,
  dishName,
  dishImage,
  restaurantName,
  spice,
  soundEnabled = true,
  loop = true,
  onToggleSound,
  onVideoEnded,
  posterImage = "/images/bakasur_pass.jpg"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(!soundEnabled);

  const isEating = stageName === 'eating' || stageName === 'heartburn';
  const isHeartburn = stageName === 'heartburn' || feastingStage === 3;
  const isPass = stageName === 'pass';
  const isReliefDone = stageName === 'relief_done';

  const cleanDishTitle = dishName ? dishName.replace(/^Ready in |^Bakasur in |^Feeding /i, '') : 'Signature Food';

  // Sync mute state
  useEffect(() => {
    setIsMuted(!soundEnabled);
    if (videoRef.current) {
      videoRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);

  // User-uploaded Bakasur eating videos for 20%, 45%, and 100% stages:
  // - Start / City / Restaurant / Dish: /uploads/videos/video-frame-1.mp4 (Hostinger character frame)
  // - Stage 1 (20% Food Meter): /uploads/videos/1.mp4 (Uploaded Eating Video 1)
  // - Stage 2 (45% Food Meter): /uploads/videos/2.mp4 (Uploaded Eating Video 2)
  // - Stage 3 (100% Acidity Overload): /uploads/videos/3.mp4 (Uploaded Eating Video 3)
  const activeVideoSrc = useMemo(() => {
    if (stageName === 'start' || stageName === 'city' || stageName === 'restaurant' || stageName === 'dish') {
      return '/uploads/videos/video-frame-1.mp4';
    }
    if (stageName === 'eating' || stageName === 'heartburn') {
      if (feastingStage === 1) return '/uploads/videos/1.mp4'; // 20%
      if (feastingStage === 2) return '/uploads/videos/2.mp4'; // 45%
      if (feastingStage === 3) return '/uploads/videos/3.mp4'; // 100%
    }
    if (isHeartburn) {
      return '/uploads/videos/3.mp4';
    }
    return videoUrl || '/uploads/videos/video-frame-1.mp4';
  }, [stageName, feastingStage, isHeartburn, videoUrl]);

  // Autoplay video smoothly on source change
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;
    const playVideo = async () => {
      try {
        video.currentTime = 0;
        video.muted = !soundEnabled;
        const p = video.play();
        if (p !== undefined) {
          await p;
        }
        if (isMounted) setIsPlaying(true);
      } catch {
        try {
          if (!isMounted || !video) return;
          video.muted = true;
          const retry = video.play();
          if (retry !== undefined) {
            await retry;
          }
          if (isMounted) setIsPlaying(true);
        } catch {
          if (isMounted) setIsPlaying(false);
        }
      }
    };

    playVideo();
    return () => {
      isMounted = false;
    };
  }, [activeVideoSrc, soundEnabled]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full min-h-full overflow-hidden bg-[#8e8e8e] flex items-center justify-center select-none">
      {/* Ambient backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter blur-3xl scale-125 opacity-20 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `url(${posterImage})`,
          backgroundColor: '#8e8e8e'
        }}
      />

      {/* Top Left: Audio Toggle Button */}
      {onToggleSound && (
        <button
          onClick={onToggleSound}
          type="button"
          aria-label={soundEnabled ? "Mute Sound" : "Enable Sound"}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-40 p-2 sm:p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 backdrop-blur-md shadow-xl transition-all cursor-pointer flex items-center justify-center group"
          title={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 group-hover:scale-110 transition-transform" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:scale-110 transition-transform" />
          )}
        </button>
      )}

      {/* Top Right: Status / Stage Pill Badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/80 border border-yellow-400/50 backdrop-blur-md text-white text-[10px] sm:text-xs font-black shadow-xl">
        {isHeartburn ? (
          <span className="flex items-center gap-1 text-red-400 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>ACIDITY OVERLOAD!</span>
          </span>
        ) : isEating ? (
          <span className="flex items-center gap-1.5 text-yellow-300">
            <span className="truncate max-w-[120px] sm:max-w-[160px] brand-font">{cleanDishTitle}</span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 shrink-0">
              {feastingStage === 1 ? '20% Eaten' : feastingStage === 2 ? '45% Gobbled' : '100% Critical'}
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-blue-200">
            <Sparkles className="w-3 h-3 text-cyan-300 animate-spin" />
            <span>BAKASUR TOUR</span>
          </span>
        )}
      </div>

      {/* Main Stage Media Render */}
      {isReliefDone ? (
        /* Relief Complete Visual */
        <div className="w-full h-full relative">
          <img
            src="/images/bakasur_relieved.jpg"
            alt="Bakasur Relieved"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      ) : isPass ? (
        /* Tour Pass Visual */
        <div className="w-full h-full relative">
          <img
            src="/images/bakasur_pass.jpg"
            alt="Bakasur Official Pass"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ) : (
        /* ========================================================================= */
        /* CLEAN HIGH QUALITY CHARACTER VIDEO FRAMES (FRAME 1 -> FRAME 2 -> FRAME 3) */
        /* Matches exact frame sequence from live reference hostinger site           */
        /* ========================================================================= */
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#8e8e8e]">
          <video
            ref={videoRef}
            src={activeVideoSrc}
            playsInline
            autoPlay
            loop={isEating ? false : loop}
            muted={isMuted}
            onEnded={() => {
              setIsPlaying(false);
              if (onVideoEnded) onVideoEnded();
            }}
            className="w-full h-full max-w-full max-h-full object-contain object-center relative z-10"
          />

          {/* Catchy Hungry Cue Overlay directly on Video Frame */}
          {isEating && feastingStage < 3 && (
            <div className="absolute bottom-6 sm:bottom-10 inset-x-3 sm:inset-x-6 flex justify-center items-center pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative bg-black/90 backdrop-blur-md border-2 border-yellow-400 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(250,204,21,0.55)] flex items-center gap-3 sm:gap-4 max-w-sm sm:max-w-md w-full animate-bounce">
                <div className="text-3xl sm:text-4xl shrink-0 select-none animate-pulse">
                  {feastingStage === 1 ? '🤤' : '🤪'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-yellow-400 text-slate-950 font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      STILL HUNGRY!
                    </span>
                    <span className="text-yellow-300 text-[11px] sm:text-xs font-black">
                      Needs More Food! 🍽️
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-black text-white mt-1 leading-snug">
                    {feastingStage === 1
                      ? '“Abhi toh pet khali hai! Aur lao jaldi!” 😋'
                      : '“Monster bhookh abhi baki hai! Aur khilao!” 🍖'}
                  </p>
                  <p className="text-[10px] font-bold text-amber-300/90 mt-0.5">
                    👉 Tap &ldquo;AUR KHILAO&rdquo; to feed Bakasur!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Acidity Overload Burning Aura (Stage 3 Heartburn) */}
          {isHeartburn && (
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/40 via-orange-600/20 to-transparent pointer-events-none z-20 animate-flame-volcano" />
          )}
        </div>
      )}
    </div>
  );
};
