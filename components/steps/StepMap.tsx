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
  onProceedToContest?: () => void;
  onRestartTour?: () => void;
  selectedRestaurantName?: string;
  selectedCity?: string;
}

export const StepMap: React.FC<StepMapProps> = ({
  onProceedToContest,
  onRestartTour,
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
    <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collective Outcome</span>
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
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${selectedCityFilter === city
                ? 'bg-[#023093] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            {city === 'All' ? 'All India 🇮🇳' : city}
          </button>
        ))}
      </div>

      {/* Interactive Visual Map Container */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-lg flex flex-col justify-between p-4">
        {/* Map Top Status Pill */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1.5 font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Food-Tour Trail</span>
          </span>

          <span className="text-[11px] text-slate-500 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200 font-semibold shadow-sm">
            {filteredPoints.length} Live Food Spots
          </span>
        </div>

        {/* Map Points Visualization */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-auto overflow-y-auto max-h-[190px] pr-1">
          {filteredPoints.map((point) => {
            const isSelected = activePoint?.id === point.id;
            return (
              <button
                key={point.id}
                onClick={() => setActivePoint(point)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer shadow-sm ${isSelected
                    ? 'bg-blue-50 border-[#023093] text-slate-900 shadow-md scale-105'
                    : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
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
                  Dish: <span className="font-semibold text-cyan-300">{activePoint.featured_dish}</span>
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

      {/* Navigation Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {onProceedToContest && (
          <button
            onClick={onProceedToContest}
            className="py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>← Back to My Submission</span>
          </button>
        )}

        {onRestartTour && (
          <button
            onClick={onRestartTour}
            className="py-3.5 px-5 rounded-2xl bg-[#023093] hover:bg-[#033bb8] text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-900/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer brand-font"
          >
            <span>🍽️ Recommend Another Restaurant</span>
          </button>
        )}
      </div>
    </div>
  );
};
