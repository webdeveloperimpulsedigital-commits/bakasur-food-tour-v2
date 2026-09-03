'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Sparkles, Flame, ArrowRight, Layers, Trophy } from 'lucide-react';

interface MapPoint {
  id: number;
  name: string;
  address: string;
  area: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
  image: string;
  total_visits: number;
  featured_dish: string;
  featured_dish_image: string;
}

interface StepMapProps {
  onProceedToContest: () => void;
  selectedRestaurantName?: string;
  selectedCity?: string;
}

export const StepMap: React.FC<StepMapProps> = ({
  onProceedToContest,
  selectedRestaurantName,
  selectedCity
}) => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [activePoint, setActivePoint] = useState<MapPoint | null>(null);
  const [selectedCityFilter, setSelectedCityFilter] = useState('All');
  const [totalVisits, setTotalVisits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMapData() {
      try {
        const res = await fetch('/api/campaign/map');
        const json = await res.json();
        if (json.success && json.data) {
          setPoints(json.data.points || []);
          setTotalVisits(json.data.totalCampaignVisits || 8900);
          if (json.data.points?.length > 0) {
            setActivePoint(json.data.points[0]);
          }
        }
      } catch (err) {
        console.error("Map fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMapData();
  }, []);

  const filteredPoints = selectedCityFilter === 'All'
    ? points
    : points.filter(p => p.city.toLowerCase() === selectedCityFilter.toLowerCase());

  const cities = ['All', 'Pune', 'Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Hyderabad'];

  return (
    <div className="flex flex-col gap-5 w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shared Food Tour Map</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white brand-font">Global Campaign Map</h2>
        </div>

        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-400/40 text-xs text-cyan-300 font-extrabold">
          <Flame className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
          <span>{totalVisits.toLocaleString()}+ Visits</span>
        </div>
      </div>

      <p className="text-xs text-blue-200/70">
        Every foodie who takes the tour adds to the live Bakasur Food Map across India! Click on any spot to view legendary dishes and total food-tour visits.
      </p>

      {/* City Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => {
              setSelectedCityFilter(city);
              const match = points.find(p => city === 'All' || p.city.toLowerCase() === city.toLowerCase());
              if (match) setActivePoint(match);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCityFilter === city
                ? 'bg-gradient-to-r from-[#023093] to-[#00acc1] text-white shadow-md shadow-blue-900/40'
                : 'bg-[#101642]/80 border border-[#023093]/40 text-blue-200/80 hover:text-white'
            }`}
          >
            {city === 'All' ? 'All India 🇮🇳' : city}
          </button>
        ))}
      </div>

      {/* Interactive Visual Map Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-[#023093]/60 bg-[#080d24] shadow-2xl flex flex-col justify-between p-4">
        {/* Background stylized India Grid / Radar lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#00acc1_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#023093]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Map Top Status Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-[#101642]/90 backdrop-blur-md border border-[#023093]/50 text-[11px] text-cyan-200 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Live Food-Tour Trail</span>
          </span>

          <span className="text-[11px] text-blue-200/70 bg-[#101642]/90 px-2.5 py-1 rounded-full border border-[#023093]/40 font-semibold">
            {filteredPoints.length} Live Food Spots
          </span>
        </div>

        {/* Map Points Visualization */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-auto">
          {filteredPoints.map((point) => {
            const isSelected = activePoint?.id === point.id;
            return (
              <button
                key={point.id}
                onClick={() => setActivePoint(point)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#023093] to-[#00acc1] border-cyan-300 text-white shadow-xl shadow-blue-900/50 scale-105'
                    : 'bg-[#101642]/80 border-[#023093]/40 hover:border-cyan-400/50 text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs">📍</span>
                  <span className={`font-extrabold text-xs truncate brand-font ${isSelected ? 'text-white' : 'text-blue-100'}`}>
                    {point.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className={isSelected ? 'text-cyan-200 font-bold' : 'text-cyan-400 font-semibold'}>
                    {point.city}
                  </span>
                  <span className={isSelected ? 'text-white font-extrabold' : 'text-blue-200/80 font-mono'}>
                    {point.total_visits} visits
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Restaurant Mini Details Drawer */}
        {activePoint && (
          <div className="relative z-10 rounded-2xl bg-[#101642]/95 backdrop-blur-md border border-[#023093]/60 p-3 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={activePoint.image} alt={activePoint.name} className="w-11 h-11 rounded-xl object-cover border border-[#023093]/40 shrink-0" />
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs sm:text-sm text-white truncate brand-font">{activePoint.name}</h4>
                <p className="text-[11px] text-blue-200/80 truncate">
                  Popular: <span className="font-semibold text-cyan-300">{activePoint.featured_dish}</span>
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-black text-cyan-400 block">{activePoint.total_visits}</span>
              <span className="text-[9px] text-blue-200/60 uppercase">Tour Visits</span>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Participation CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-[#101642] via-[#0e1338] to-[#101642] border-2 border-[#023093]/60 p-5 text-center shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-400/30 text-cyan-300 text-xs font-bold mb-2">
          <Trophy className="w-3.5 h-3.5 text-cyan-400" />
          <span>Contest Grand Prize</span>
        </div>
        <h3 className="font-black text-lg text-white mb-1 brand-font">
          Complete Your Food Tour &amp; Win!
        </h3>
        <p className="text-xs text-blue-100/70 mb-4 max-w-sm mx-auto">
          Claim your official Bakasur Food Tour Certificate, enter the weekly food-hamper contest, and win exciting Gastrium hampers!
        </p>

        <button
          onClick={onProceedToContest}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#023093] via-[#033bb8] to-[#00acc1] hover:from-[#033bb8] hover:to-[#00acc1] text-white font-black text-base uppercase tracking-wider shadow-xl shadow-blue-900/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer brand-font"
        >
          <Trophy className="w-5 h-5 fill-current text-amber-300" />
          <span>Enter Contest &amp; Claim Participation Pass</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
