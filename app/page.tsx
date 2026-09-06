'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BakasurVideoPlayer } from '@/components/BakasurVideoPlayer';
import { StepStart } from '@/components/steps/StepStart';
import { StepCity, CITIES_LIST, CityItem } from '@/components/steps/StepCity';
import { StepRestaurant } from '@/components/steps/StepRestaurant';
import { StepDish, SPICE_LEVELS, SpiceOption } from '@/components/steps/StepDish';
import { StepEating } from '@/components/steps/StepEating';
import { StepRelief } from '@/components/steps/StepRelief';
import { StepContest } from '@/components/steps/StepContest';
import { StepMap } from '@/components/steps/StepMap';
import { Restaurant, Dish } from '@/lib/db';

type AppStep =
  | 'start'
  | 'city'
  | 'restaurant'
  | 'dish'
  | 'eating'
  | 'heartburn'
  | 'relief_countdown'
  | 'relief_done'
  | 'pass'
  | 'map';

export default function CampaignPage() {
  // Campaign State
  const [currentStep, setCurrentStep] = useState<AppStep>('start');
  const [sessionId, setSessionId] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<CityItem>({
    name: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8407
  });
  const [selectedArea, setSelectedArea] = useState<string>('FC Road');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | { name: string; id?: number; price?: number } | null>(null);
  const [selectedSpice, setSelectedSpice] = useState<SpiceOption>(SPICE_LEVELS[1]); // Default Masaledaar (3/5)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [feastingStage, setFeastingStage] = useState<1 | 2 | 3>(1);

  // Video State
  const [videoUrl, setVideoUrl] = useState<string>('/uploads/videos/video-frame-1.mp4');

  // Initialize Session ID & Auto Detect Live Location
  useEffect(() => {
    let sess = localStorage.getItem('bakasur_session_id');
    if (!sess) {
      sess = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem('bakasur_session_id', sess);
    }
    setSessionId(sess);

    // Auto-detect user live location immediately
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`/api/location?lat=${latitude}&lng=${longitude}`);
            const json = await res.json();
            if (json.success && json.detectedCity) {
              setSelectedCity({
                name: json.detectedCity.name,
                state: json.detectedCity.state || 'Maharashtra',
                lat: latitude,
                lng: longitude
              });
              if (json.detectedArea?.name) {
                setSelectedArea(json.detectedArea.name);
              }
            }
          } catch {
            // Keep default Pune
          }
        },
        () => {
          // Keep default Pune
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    }
  }, []);

  // Web Audio FX Generator
  const playSound = useCallback((type: 'click' | 'bite' | 'fanfare' | 'relief') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'click' || type === 'bite') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(type === 'click' ? 440 : 220, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'relief') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
        });
      }
    } catch {
      // Audio autoplay fallback
    }
  }, [soundEnabled]);

  // Transitions: Start -> Step 1 (City & Nearby Hotels)
  const handleStartTour = () => {
    playSound('click');
    setFeastingStage(1);
    setCurrentStep('city');
    setVideoUrl('/uploads/videos/video-frame-1.mp4');
  };

  // Transitions: Step 1 (City & Hotel Selection) -> Step 3 (Dish)
  const handleCityNext = () => {
    playSound('click');
    setFeastingStage(1);
    setCurrentStep('dish');
    setVideoUrl('/uploads/videos/video-frame-1.mp4');
  };

  // Transitions: Dish -> Feasting (Step 4) - Stage 1 (20% Meter)
  const handleFeedBakasur = async (customDishName?: string) => {
    playSound('bite');
    const finalDish = customDishName
      ? { name: customDishName, id: selectedDish?.id || 1, price: 120 }
      : selectedDish || { name: 'Signature Food', id: 1, price: 120 };

    setSelectedDish(finalDish);
    setFeastingStage(1);
    setCurrentStep('eating');
    setVideoUrl('/uploads/videos/1.mp4');

    // Register backend campaign session start
    try {
      await fetch('/api/campaign/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_location: `${selectedArea ? selectedArea + ', ' : ''}${selectedCity.name}`,
          latitude: selectedCity.lat,
          longitude: selectedCity.lng,
          restaurant_id: selectedRestaurant?.id || 1,
          dish_id: finalDish.id || 1
        })
      });
    } catch (err) {
      console.error("Session start error", err);
    }
  };

  // Transitions: Aur Khilao Multi-Stage Feasting (Stage 1 -> Stage 2 -> Stage 3)
  const handleFeastingStageChange = (stage: 1 | 2 | 3) => {
    setFeastingStage(stage);
    if (stage === 1) {
      setVideoUrl('/uploads/videos/1.mp4');
    } else if (stage === 2) {
      setVideoUrl('/uploads/videos/2.mp4');
    } else if (stage === 3) {
      setVideoUrl('/uploads/videos/3.mp4');
    }
  };

  // Transitions: Eating -> Heartburn Overload (Step 5)
  const handleProceedToHeartburn = () => {
    playSound('click');
    setFeastingStage(3);
    setVideoUrl('/uploads/videos/3.mp4');
  };

  // Transitions: Heartburn -> 6s Relief Countdown (Step 6)
  const handleGiveGastrium = () => {
    playSound('relief');
    setCurrentStep('relief_countdown');
    setVideoUrl('/uploads/videos/video-frame-1.mp4');
  };

  // Transitions: 6s Countdown complete -> Relief Complete (Step 7)
  const handleCountdownComplete = () => {
    playSound('fanfare');
    setCurrentStep('relief_done');
    setVideoUrl('/uploads/videos/video-frame-1.mp4');
  };

  // Transitions: Relief Complete -> Official Pass / Submission Confirmation (Step 8)
  const handleGetOfficialPass = () => {
    playSound('fanfare');
    setCurrentStep('pass');
    setVideoUrl('/uploads/videos/video-frame-1.mp4');
  };

  // Restart Tour / Recommend Another Spot
  const handleRestartTour = () => {
    playSound('click');
    setCurrentStep('start');
    setSelectedRestaurant(null);
    const newSess = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bakasur_session_id', newSess);
    }
    setSessionId(newSess);
    setVideoUrl('/uploads/videos/video-frame-1.mp4');
  };

  return (
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] w-full flex flex-col lg:flex-row overflow-hidden bg-slate-950">
      {/* Top Section on Mobile / Left Section on Desktop: Full Prominent Bakasur Video Player */}
      <div className="w-full lg:w-1/2 h-[52vh] min-h-[270px] sm:h-[54vh] lg:h-full lg:max-h-none relative overflow-hidden bg-black flex items-center justify-center shrink-0">
        <BakasurVideoPlayer
          videoUrl={videoUrl}
          stageName={currentStep}
          feastingStage={feastingStage}
          dishName={
            currentStep === 'start'
              ? `Ready in ${selectedCity.name}`
              : currentStep === 'city'
              ? `Bakasur in ${selectedCity.name}`
              : currentStep === 'dish'
              ? (selectedDish ? `${selectedDish.name} at ${selectedRestaurant?.name}` : `At ${selectedRestaurant?.name}`)
              : selectedDish?.name
          }
          spice={selectedSpice}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />
      </div>

      {/* Bottom Section on Mobile / Right Section on Desktop: Sleek, Uncluttered Blue Panel */}
      <div className="w-full lg:w-1/2 flex-1 lg:h-full relative bg-gradient-to-br from-[#023093] via-[#02287e] to-[#011a54] text-white flex flex-col justify-between overflow-y-auto p-3 sm:p-5 md:p-7 lg:p-10 -mt-2.5 sm:-mt-4 lg:mt-0 rounded-t-[1.5rem] sm:rounded-t-[2rem] lg:rounded-none border-t border-white/20 lg:border-t-0 lg:border-l-2 lg:border-blue-400/20 backdrop-blur-xl shadow-2xl z-20">
        {/* Mobile Pull Bar Indicator */}
        <div className="w-9 h-1 rounded-full bg-white/30 mx-auto mb-1 lg:hidden shrink-0" />

        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Interactive Step Content Area */}
        <main className="flex-1 w-full max-w-lg mx-auto flex flex-col justify-center min-h-0 py-0.5 sm:py-2 relative z-10">
          {currentStep === 'start' && (
            /* Step 0: Landing / Start Screen */
            <StepStart
              onStartTour={handleStartTour}
              selectedCity={selectedCity.name}
              selectedArea={selectedArea}
            />
          )}

          {currentStep === 'city' && (
            /* Step 1: Auto Location Detect + Nearby Recommended Hotels + Search */
            <StepCity
              selectedCity={selectedCity.name}
              selectedArea={selectedArea}
              userCoords={{ lat: selectedCity.lat, lng: selectedCity.lng }}
              selectedRestaurant={selectedRestaurant}
              onSelectCity={(city) => setSelectedCity(city)}
              onSelectArea={(area) => setSelectedArea(area)}
              onSelectRestaurant={(rest) => setSelectedRestaurant(rest)}
              onNext={handleCityNext}
              onBack={() => setCurrentStep('start')}
            />
          )}

          {currentStep === 'dish' && selectedRestaurant && (
            /* Step 2: Pick Recommended Hotel Dish & Spice */
            <StepDish
              restaurant={selectedRestaurant}
              selectedDish={selectedDish}
              selectedSpice={selectedSpice}
              onSelectDish={(d) => setSelectedDish(d)}
              onSelectSpice={(sp) => setSelectedSpice(sp)}
              onFeedBakasur={handleFeedBakasur}
              onBack={() => setCurrentStep('city')}
            />
          )}

          {(currentStep === 'eating' || currentStep === 'heartburn') && selectedRestaurant && (
            /* Step 4 & Step 5: Feasting & Heartburn Multi-Stage */
            <StepEating
              restaurant={selectedRestaurant}
              dish={selectedDish || { name: 'Bun Omelette' }}
              spice={selectedSpice}
              sessionId={sessionId}
              feastingStage={feastingStage}
              onFeastingStageChange={handleFeastingStageChange}
              isHeartburnStage={currentStep === 'heartburn'}
              onProceedToHeartburn={handleProceedToHeartburn}
              onGiveGastrium={handleGiveGastrium}
              onBackToDish={() => setCurrentStep('dish')}
              onPlaySound={playSound}
            />
          )}

          {currentStep === 'relief_countdown' && (
            /* Step 6: 6-Second Gastrium Relief Active Countdown Screen */
            <StepRelief
              restaurant={selectedRestaurant || { id: 1, name: 'Goodluck Cafe', city: selectedCity.name, address: 'FC Road', area: 'Deccan', rating: 4.8, image: '', description: '', is_campaign_active: 1, total_visits: 1200, status: 'active', latitude: 0, longitude: 0 }}
              dish={selectedDish || { name: 'Bun Omelette' }}
              spice={selectedSpice}
              isCountdownDone={false}
              onCountdownComplete={handleCountdownComplete}
              onGetOfficialPass={handleGetOfficialPass}
            />
          )}

          {currentStep === 'relief_done' && selectedRestaurant && (
            /* Step 7: Relief Complete */
            <StepRelief
              restaurant={selectedRestaurant}
              dish={selectedDish || { name: 'Bun Omelette' }}
              spice={selectedSpice}
              isCountdownDone={true}
              onCountdownComplete={handleCountdownComplete}
              onGetOfficialPass={handleGetOfficialPass}
            />
          )}

          {currentStep === 'pass' && selectedRestaurant && (
            /* Step 8: Submission Confirmation, Map & Offline Tour Registration */
            <StepContest
              sessionId={sessionId}
              restaurant={selectedRestaurant}
              dish={selectedDish || { name: 'Bun Omelette' }}
              spice={selectedSpice}
              onExploreMap={() => setCurrentStep('map')}
              onRestartTour={handleRestartTour}
            />
          )}

          {currentStep === 'map' && (
            /* Step 9: Collective Food Tour Map */
            <StepMap
              onProceedToContest={() => setCurrentStep('pass')}
              onRestartTour={handleRestartTour}
              selectedRestaurantName={selectedRestaurant?.name}
              selectedCity={selectedCity.name}
            />
          )}
        </main>
      </div>
    </div>
  );
}
