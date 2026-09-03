'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { BakasurVideoPlayer } from '@/components/BakasurVideoPlayer';
import { StepStart } from '@/components/steps/StepStart';
import { StepCity, CITIES_LIST, CityItem } from '@/components/steps/StepCity';
import { StepRestaurant } from '@/components/steps/StepRestaurant';
import { StepDish, SPICE_LEVELS, SpiceOption } from '@/components/steps/StepDish';
import { StepEating } from '@/components/steps/StepEating';
import { StepRelief } from '@/components/steps/StepRelief';
import { StepContest } from '@/components/steps/StepContest';
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
  | 'pass';

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
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [feastingStage, setFeastingStage] = useState<1 | 2 | 3>(1);

  // Video State
  const [videoUrl, setVideoUrl] = useState<string>('/uploads/videos/1.mp4');

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
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
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
      // Audio autoplay policy fallback
    }
  }, [soundEnabled]);

  // Transitions: Start -> Step 1 (City & Nearby Hotels)
  const handleStartTour = () => {
    playSound('click');
    setFeastingStage(1);
    setCurrentStep('city');
    setVideoUrl('/uploads/videos/1.mp4');
  };

  // Transitions: Step 1 (City & Hotel Selection) -> Step 3 (Dish)
  const handleCityNext = () => {
    playSound('click');
    setFeastingStage(1);
    setCurrentStep('dish');
    setVideoUrl('/uploads/videos/1.mp4');
  };

  // Transitions: Dish -> Feasting (Step 4) - Stage 1 (20%)
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

  // Transitions: Multi-Stage Feasting Updates (Stage 1 -> Stage 2 -> Stage 3)
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
  };

  // Transitions: 6s Countdown complete -> Relief Complete (Step 7)
  const handleCountdownComplete = () => {
    playSound('fanfare');
    setCurrentStep('relief_done');
  };

  // Transitions: Relief Complete -> Official Pass (Step 8)
  const handleGetOfficialPass = () => {
    playSound('fanfare');
    setCurrentStep('pass');
  };

  // Restart Tour
  const handleRestartTour = () => {
    playSound('click');
    const newSess = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem('bakasur_session_id', newSess);
    setSessionId(newSess);
    setSelectedRestaurant(null);
    setSelectedDish(null);
    setFeastingStage(1);
    setCurrentStep('start');
    setVideoUrl('/uploads/videos/1.mp4');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-900 bg-[#05091e]">
      {/* Top Header Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Campaign Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col justify-center">
        {currentStep === 'start' ? (
          /* Landing Screen (00:00 - 00:01) */
          <StepStart
            onStartTour={handleStartTour}
            selectedCity={selectedCity.name}
            selectedArea={selectedArea}
          />
        ) : currentStep === 'relief_countdown' ? (
          /* 6-Second Gastrium Relief Active Countdown Screen (00:33 - 00:38) */
          <StepRelief
            restaurant={selectedRestaurant || { id: 1, name: 'Goodluck Cafe', city: selectedCity.name, address: 'FC Road', area: 'Deccan', rating: 4.8, image: '', description: '', is_campaign_active: 1, total_visits: 1200, status: 'active', latitude: 0, longitude: 0 }}
            dish={selectedDish || { name: 'Bun Omelette' }}
            spice={selectedSpice}
            isCountdownDone={false}
            onCountdownComplete={handleCountdownComplete}
            onGetOfficialPass={handleGetOfficialPass}
          />
        ) : (
          /* Split Screen Layout for Steps 1, 2, 3, 4, 5, 7, 8 */
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Bakasur Video Player & Mascot Visual */}
            <div className="md:col-span-6 flex justify-center items-center">
              <div className="w-full max-w-md">
                <BakasurVideoPlayer
                  videoUrl={videoUrl}
                  stageName={currentStep}
                  feastingStage={feastingStage}
                  dishName={
                    currentStep === 'city'
                      ? `Bakasur in ${selectedCity.name}`
                      : currentStep === 'dish'
                      ? (selectedDish ? `${selectedDish.name} at ${selectedRestaurant?.name}` : `At ${selectedRestaurant?.name}`)
                      : selectedDish?.name
                  }
                  spice={selectedSpice}
                  soundEnabled={soundEnabled}
                />
              </div>
            </div>

            {/* Right Column: White Interactive Step Card */}
            <div className="md:col-span-6 flex justify-center items-center">
              <div className="w-full max-w-lg">
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
                  /* Step 8: Official Tour Pass & Share */
                  <StepContest
                    sessionId={sessionId}
                    restaurant={selectedRestaurant}
                    dish={selectedDish || { name: 'Bun Omelette' }}
                    spice={selectedSpice}
                    onRestartTour={handleRestartTour}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Subtle Footer */}
      <footer className="w-full py-3 px-4 text-center text-[11px] text-slate-400 border-t border-slate-800/40 bg-[#030614]/80">
        <p>© 2026 Bakasur Ka Food Tour • Powered by Gastrium Antacid</p>
      </footer>
    </div>
  );
}
