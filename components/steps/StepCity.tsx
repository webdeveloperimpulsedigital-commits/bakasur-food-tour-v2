'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, ArrowRight, Star } from 'lucide-react';
import { Restaurant } from '@/lib/db';

export interface CityItem {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

export const CITIES_LIST: CityItem[] = [
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8407 },
  { name: "Mumbai", state: "Maharashtra", lat: 18.9222, lng: 72.8317 },
  { name: "Delhi", state: "NCR-Delhi", lat: 28.6507, lng: 77.2334 },
  { name: "Bengaluru", state: "Karnataka", lat: 12.9452, lng: 77.5704 },
  { name: "Hyderabad", state: "Telangana", lat: 17.4416, lng: 78.4983 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5528, lng: 88.3533 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Amritsar", state: "Punjab", lat: 31.6340, lng: 74.8723 },
  { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Goa", state: "Goa", lat: 15.2993, lng: 74.1240 },
  { name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081 }
];

interface StepCityProps {
  selectedCity: string;
  selectedArea?: string;
  userCoords: { lat: number; lng: number };
  selectedRestaurant: Restaurant | null;
  onSelectCity: (city: CityItem) => void;
  onSelectArea?: (area: string) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onNext: () => void;
  onBack?: () => void;
}

export const StepCity: React.FC<StepCityProps> = ({
  selectedCity,
  userCoords,
  selectedRestaurant,
  onSelectCity,
  onSelectArea,
  onSelectRestaurant,
  onNext,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [coords] = useState<{ lat: number; lng: number }>(userCoords || { lat: 18.5204, lng: 73.8407 });
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = useState(true);

  // Handle selecting any restaurant from any city
  const handleSelectSpot = useCallback((rest: Restaurant) => {
    onSelectRestaurant(rest);
    if (onSelectCity && rest.city) {
      const cityMatch = CITIES_LIST.find(c => c.name.toLowerCase() === rest.city.toLowerCase()) || {
        name: rest.city,
        state: rest.city,
        lat: rest.latitude || coords.lat,
        lng: rest.longitude || coords.lng
      };
      onSelectCity(cityMatch);
    }
    if (onSelectArea && rest.area) {
      onSelectArea(rest.area);
    }
  }, [onSelectRestaurant, onSelectCity, onSelectArea, coords]);

  // Fetch Recommended Spots or Nationwide Search Results
  const fetchNearbySpots = useCallback(async (query: string, city: string) => {
    setIsLoadingSpots(true);
    try {
      let url = `/api/restaurants/nearby?city=${encodeURIComponent(city || 'Pune')}&lat=${coords.lat}&lng=${coords.lng}`;
      if (query.trim()) {
        url = `/api/restaurants/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city || '')}&lat=${coords.lat}&lng=${coords.lng}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNearbyRestaurants(json.data);
        // Auto-select first matching restaurant if none is selected
        if ((!selectedRestaurant || !json.data.some((r: Restaurant) => r.id === selectedRestaurant.id)) && json.data.length > 0) {
          handleSelectSpot(json.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch restaurants", err);
    } finally {
      setIsLoadingSpots(false);
    }
  }, [coords, selectedRestaurant, handleSelectSpot]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNearbySpots(searchQuery, selectedCity);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCity, fetchNearbySpots]);

  // Handle Add Custom Restaurant if user types a new place
  const handleAddCustomRestaurant = () => {
    if (!searchQuery.trim()) return;
    const customSpot: Restaurant = {
      id: 999000 + Math.floor(Math.random() * 1000),
      name: searchQuery.trim(),
      description: `Custom selected food spot`,
      address: `${selectedCity || 'Local'}, India`,
      area: selectedCity || 'Local',
      city: selectedCity || 'Local',
      latitude: coords.lat,
      longitude: coords.lng,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      is_campaign_active: 1,
      total_visits: 1,
      status: 'active'
    };
    setNearbyRestaurants([customSpot, ...nearbyRestaurants]);
    handleSelectSpot(customSpot);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between min-h-0 text-white gap-2.5">
      {/* Top Header: Main Title & Subtitle */}
      <div className="shrink-0 flex flex-col gap-0.5">
        <h2 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-white brand-font leading-tight">
          Kahan Khilaoge Bakasur Ko?
        </h2>
        <p className="text-[11px] sm:text-xs text-blue-200 font-medium leading-snug">
          Apne area ka sabse famous &amp; legendary food adda chuno!
        </p>
      </div>

      {/* Prominent Search Bar */}
      <div className="shrink-0 relative z-10">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hotel, restaurant, cafe, or food joint..."
            className="w-full pl-9 pr-8 py-2 sm:py-2.5 rounded-xl bg-white border border-blue-200 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D23002] shadow-md transition-all font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Suggestions / Food Joints List - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 flex flex-col gap-1.5 relative z-10">
        {isLoadingSpots && nearbyRestaurants.length === 0 ? (
          <div className="flex flex-col gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : nearbyRestaurants.length === 0 ? (
          <div className="p-4 text-center rounded-xl bg-white/10 border border-white/15">
            {searchQuery.trim() ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs font-bold text-blue-100">
                  No spot found for &quot;{searchQuery}&quot;
                </p>
                <p className="text-[11px] text-blue-200">
                  Bakasur can eat anywhere! Select this spot directly:
                </p>
                <button
                  onClick={handleAddCustomRestaurant}
                  type="button"
                  className="py-1.5 px-3 rounded-lg bg-[#D23002] hover:bg-[#eb420e] text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>➕ Feed Bakasur at &quot;{searchQuery}&quot;</span>
                </button>
              </div>
            ) : (
              <p className="text-xs font-bold text-blue-100">
                Type above to search any hotel or food joint.
              </p>
            )}
          </div>
        ) : (
          nearbyRestaurants.map((rest) => {
            const isSelected = selectedRestaurant?.id === rest.id;
            return (
              <div
                key={rest.id}
                onClick={() => handleSelectSpot(rest)}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 text-slate-900 ${
                  isSelected
                    ? 'border-2 border-[#D23002] bg-orange-50/95 shadow-md scale-[1.01]'
                    : 'border-white/20 hover:border-[#D23002]/50 hover:bg-slate-50 bg-white shadow-sm'
                }`}
              >
                {/* Left Thumbnail & Details */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 shadow-inner">
                    <img src={rest.image} alt={rest.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className={`font-black text-xs sm:text-sm brand-font truncate ${isSelected ? 'text-[#D23002]' : 'text-slate-900'}`}>
                        {rest.name}
                      </h4>
                      <span className="flex items-center text-[9px] font-bold text-amber-700 bg-amber-100 px-1 py-0.2 rounded">
                        ★ {rest.rating}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-500 font-semibold mt-0.5 truncate">
                      <span className="text-[#023093] font-bold bg-blue-100/70 px-1 rounded truncate">
                        📍 {rest.area && rest.city && !rest.area.toLowerCase().includes(rest.city.toLowerCase()) ? `${rest.area}, ${rest.city}` : rest.area || rest.city}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-mono font-bold">
                        ⚡ {(rest as Restaurant & { distanceKm?: number }).distanceKm ? `${(rest as Restaurant & { distanceKm?: number }).distanceKm} km away` : 'Nearby'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Select CTA */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectSpot(rest);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all shrink-0 cursor-pointer brand-font ${
                    isSelected
                      ? 'bg-[#D23002] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Select'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Navigation Footer */}
      <div className="shrink-0 pt-1 relative z-10">
        <button
          onClick={onNext}
          disabled={!selectedRestaurant}
          type="button"
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#D23002] hover:bg-[#eb420e] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#D23002]/30 transition-all flex items-center justify-center gap-2 cursor-pointer brand-font disabled:opacity-50 tracking-wide border border-white/20 active:scale-[0.99]"
        >
          <span>Next: Pick Spicy Dish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


