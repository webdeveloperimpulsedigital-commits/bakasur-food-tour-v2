'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, MapPin, Navigation, ArrowRight, ArrowLeft, Star, Sparkles, Utensils, Check, RotateCw, ChevronDown, Compass, Building2, Flame } from 'lucide-react';
import { Restaurant } from '@/lib/db';
import { PUNE_AREAS, AreaInfo } from '@/lib/areas';

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
  selectedArea = 'All Areas',
  userCoords,
  selectedRestaurant,
  onSelectCity,
  onSelectArea,
  onSelectRestaurant,
  onNext,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentArea, setCurrentArea] = useState<string>(selectedArea || 'All Areas');
  const [coords, setCoords] = useState<{ lat: number; lng: number }>(userCoords || { lat: 18.5204, lng: 73.8407 });
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting live GPS location...');
  const [detectedLocalityLabel, setDetectedLocalityLabel] = useState<string>('Pune, Maharashtra');
  const [isLoadingSpots, setIsLoadingSpots] = useState(true);
  const [showLocationPickerModal, setShowLocationPickerModal] = useState(false);
  const [availableAreas, setAvailableAreas] = useState<AreaInfo[]>(PUNE_AREAS);
  const [areaSearchQuery, setAreaSearchQuery] = useState('');

  // 1. Auto Detect Geolocation & Reverse Geocode Area (Zomato Style)
  const detectUserLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('📍 Defaulted to Pune (FC Road)');
      setDetectedLocalityLabel('Pune, Maharashtra');
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('Pinpointing your exact GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const accMeters = Math.round(accuracy || 20);
        setCoords({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(`/api/location?lat=${latitude}&lng=${longitude}`);
          const json = await res.json();
          if (json.success) {
            const detectedCity = json.detectedCity;
            const detectedArea = json.detectedArea;

            const cityMatch = CITIES_LIST.find(c => c.name.toLowerCase() === detectedCity.name.toLowerCase()) || {
              name: detectedCity.name,
              state: detectedCity.state || 'India',
              lat: latitude,
              lng: longitude
            };

            onSelectCity(cityMatch);
            if (json.areas) setAvailableAreas(json.areas);

            if (detectedArea?.name) {
              setCurrentArea(detectedArea.name);
              if (onSelectArea) onSelectArea(detectedArea.name);
              const label = json.locationDisplay || `${detectedArea.displayName}, ${cityMatch.name}`;
              setDetectedLocalityLabel(label);
              setLocationStatus(`📍 Live GPS: ${detectedArea.name}, ${cityMatch.name} (±${accMeters}m)`);
            } else {
              setDetectedLocalityLabel(`${cityMatch.name}, India`);
              setLocationStatus(`📍 Live GPS: ${cityMatch.name} (±${accMeters}m)`);
            }
          }
        } catch {
          setLocationStatus(`📍 Live GPS Active • Pune (±${accMeters}m)`);
          setDetectedLocalityLabel('Pune, Maharashtra');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      () => {
        // Fallback gracefully without blocking
        setIsDetectingLocation(false);
        setLocationStatus(`📍 Location: ${selectedCity || 'Pune'} (Area: ${currentArea})`);
        setDetectedLocalityLabel(`${currentArea !== 'All Areas' ? currentArea + ', ' : ''}${selectedCity || 'Pune'}`);
      },
      { timeout: 7000, enableHighAccuracy: true, maximumAge: 0 }
    );
  }, [selectedCity, currentArea, onSelectCity, onSelectArea]);

  useEffect(() => {
    detectUserLocation();
  }, [detectUserLocation]);

  // 2. Fetch Recommended Spots Nearby Current Location / Selected Area & City
  const fetchNearbySpots = useCallback(async (query: string, city: string, area: string) => {
    setIsLoadingSpots(true);
    try {
      const areaParam = area && area !== 'All Areas' && area !== 'All' ? encodeURIComponent(area) : '';
      let url = `/api/restaurants/nearby?city=${encodeURIComponent(city)}&area=${areaParam}&lat=${coords.lat}&lng=${coords.lng}`;
      if (query.trim()) {
        url = `/api/restaurants/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}&lat=${coords.lat}&lng=${coords.lng}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setNearbyRestaurants(json.data);
        // Auto-select first matching restaurant if none is selected
        if ((!selectedRestaurant || !json.data.some((r: Restaurant) => r.id === selectedRestaurant.id)) && json.data.length > 0) {
          onSelectRestaurant(json.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch nearby restaurants", err);
    } finally {
      setIsLoadingSpots(false);
    }
  }, [coords, selectedRestaurant, onSelectRestaurant]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNearbySpots(searchQuery, selectedCity, currentArea);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCity, currentArea, fetchNearbySpots]);

  // Handle Area Chip Click (Zomato Style)
  const handleAreaSelect = (areaName: string) => {
    setCurrentArea(areaName);
    if (onSelectArea) onSelectArea(areaName);
    if (areaName === 'All Areas') {
      setDetectedLocalityLabel(`All Localities in ${selectedCity}`);
    } else {
      setDetectedLocalityLabel(`${areaName}, ${selectedCity}`);
    }
    setShowLocationPickerModal(false);
  };

  // Handle Add Custom Restaurant
  const handleAddCustomRestaurant = () => {
    if (!searchQuery.trim()) return;
    const customSpot: Restaurant = {
      id: 999000 + Math.floor(Math.random() * 1000),
      name: searchQuery.trim(),
      description: `Custom selected food spot in ${selectedCity}`,
      address: `${currentArea !== 'All Areas' ? currentArea + ', ' : ''}${selectedCity}`,
      area: currentArea !== 'All Areas' ? currentArea : 'Central',
      city: selectedCity,
      latitude: coords.lat,
      longitude: coords.lng,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
      is_campaign_active: 1,
      total_visits: 1,
      status: 'active'
    };
    setNearbyRestaurants([customSpot, ...nearbyRestaurants]);
    onSelectRestaurant(customSpot);
  };

  // Filtered Localities in Modal
  const filteredLocalities = useMemo(() => {
    if (!areaSearchQuery.trim()) return availableAreas;
    const q = areaSearchQuery.toLowerCase();
    return availableAreas.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.displayName.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.popularLandmarks.some(l => l.toLowerCase().includes(q))
    );
  }, [availableAreas, areaSearchQuery]);

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-2.5 text-white">
      {/* Top Section Header with Compact Area Pill */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white brand-font leading-tight">
            Kahan Khilaoge Bakasur Ko?
          </h2>
          <p className="text-[10px] sm:text-[11px] text-blue-200 font-medium leading-snug">
            Apne area ka sabse famous &amp; legendary food adda chuno!
          </p>
        </div>

        {/* Quick Area Switcher Pill */}
        <button
          onClick={() => setShowLocationPickerModal(true)}
          type="button"
          className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-[10px] sm:text-xs font-extrabold shrink-0 transition-all shadow-sm"
        >
          <span className="text-yellow-400">📍</span>
          <span className="max-w-[80px] sm:max-w-[120px] truncate font-mono">
            {currentArea !== 'All Areas' ? currentArea : selectedCity}
          </span>
          <ChevronDown className="w-3 h-3 text-blue-200 shrink-0" />
        </button>
      </div>

      {/* Unified Search Bar */}
      <div className="relative z-10">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`🔍 Search ANY spot in ${selectedCity} (e.g. Roopali, Vaishali, Katakirr, Goodluck)...`}
          className="w-full pl-8 pr-7 py-2 rounded-xl bg-white border border-blue-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D23002] shadow-md"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 py-0.5"
          >
            ✕
          </button>
        )}
      </div>

      {/* Recommended Nearby Food Joints List */}
      <div className="flex flex-col gap-1 min-h-0 relative z-10">
        <div className="flex flex-col gap-1.5 max-h-[145px] sm:max-h-[180px] overflow-y-auto pr-0.5">
          {isLoadingSpots && nearbyRestaurants.length === 0 ? (
            <div className="flex flex-col gap-1.5">
              {[1, 2].map(i => (
                <div key={i} className="h-12 rounded-xl bg-white/10 animate-pulse" />
              ))}
            </div>
          ) : nearbyRestaurants.length === 0 ? (
            <div className="p-3 text-center rounded-xl bg-white/10 border border-white/15">
              {searchQuery.trim() ? (
                <div className="flex flex-col items-center gap-1.5">
                  <p className="text-xs font-bold text-blue-100">
                    No pre-listed spot found for &quot;{searchQuery}&quot;
                  </p>
                  <p className="text-[10px] text-blue-200">
                    Bakasur can eat anywhere! Add this spot directly:
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
                <>
                  <p className="text-xs font-bold text-blue-100">No spots found in &quot;{currentArea}&quot;.</p>
                  <button
                    onClick={() => handleAreaSelect('All Areas')}
                    className="text-xs font-bold text-[#ff6b4a] hover:underline mt-1 block mx-auto"
                  >
                    View all in {selectedCity} →
                  </button>
                </>
              )}
            </div>
          ) : (
            nearbyRestaurants.map((rest) => {
              const isSelected = selectedRestaurant?.id === rest.id;
              return (
                <div
                  key={rest.id}
                  onClick={() => onSelectRestaurant(rest)}
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
                          📍 {rest.area || rest.city}
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
                      onSelectRestaurant(rest);
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
      </div>

      {/* Navigation Footer */}
      <div className="pt-0.5 relative z-10">
        <button
          onClick={onNext}
          disabled={!selectedRestaurant}
          type="button"
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#D23002] hover:bg-[#eb420e] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#D23002]/30 transition-all flex items-center justify-center gap-2 cursor-pointer brand-font disabled:opacity-50 tracking-wide border border-white/20"
        >
          <span>Next: Pick Spicy Dish</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Zomato-Style Area & City Selection Modal */}
      {showLocationPickerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col gap-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#023093] text-white flex items-center justify-center text-sm shadow-sm">
                  📍
                </div>
                <div>
                  <h3 className="font-black text-base brand-font">Select Locality / Area</h3>
                  <p className="text-[11px] text-slate-500">Pick an area in {selectedCity} or switch cities</p>
                </div>
              </div>
              <button
                onClick={() => setShowLocationPickerModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Area Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={areaSearchQuery}
                onChange={(e) => setAreaSearchQuery(e.target.value)}
                placeholder={`Search localities in ${selectedCity} (e.g. FC Road, Kothrud, Camp)...`}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#023093]"
              />
            </div>

            {/* Scrollable Localities List */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 max-h-[300px] pr-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {selectedCity} Localities &amp; Neighborhoods:
              </span>

              {/* All Areas Option */}
              <button
                onClick={() => handleAreaSelect('All Areas')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  currentArea === 'All Areas' ? 'bg-blue-50 border-[#023093] font-bold text-[#023093]' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-extrabold text-xs sm:text-sm">✨ All Localities in {selectedCity}</div>
                  <div className="text-[11px] text-slate-500">Show all iconic spots across the entire city</div>
                </div>
                {currentArea === 'All Areas' && <Check className="w-4 h-4 text-[#023093]" />}
              </button>

              {filteredLocalities.map((area) => {
                const isSelected = currentArea.toLowerCase() === area.name.toLowerCase();
                return (
                  <button
                    key={area.id}
                    onClick={() => handleAreaSelect(area.name)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-blue-50 border-[#023093] font-bold text-[#023093]'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-blue-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 brand-font truncate">
                          📍 {area.displayName}
                        </span>
                        {area.distanceKm !== undefined && (
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded border border-emerald-200">
                            {area.distanceKm} km
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate">{area.description}</p>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 shrink-0 bg-slate-100 px-2 py-0.5 rounded">
                      {area.popularSpotsCount} spots
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Switch Indian City Section */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Switch Indian Food City:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                {CITIES_LIST.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      onSelectCity(city);
                      setCurrentArea('All Areas');
                      if (onSelectArea) onSelectArea('All Areas');
                      setDetectedLocalityLabel(`${city.name}, India`);
                      setShowLocationPickerModal(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer border text-xs ${
                      selectedCity.toLowerCase() === city.name.toLowerCase()
                        ? 'bg-[#023093] text-white border-[#023093]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

