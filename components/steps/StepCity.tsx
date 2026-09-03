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
  onBack: () => void;
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
  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting live GPS location...');
  const [detectedLocalityLabel, setDetectedLocalityLabel] = useState<string>('FC Road, Deccan, Pune');
  const [isLoadingSpots, setIsLoadingSpots] = useState(true);
  const [showLocationPickerModal, setShowLocationPickerModal] = useState(false);
  const [availableAreas, setAvailableAreas] = useState<AreaInfo[]>(PUNE_AREAS);
  const [areaSearchQuery, setAreaSearchQuery] = useState('');

  // 1. Auto Detect Geolocation & Reverse Geocode Area (Zomato Style)
  const detectUserLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('📍 Defaulted to Pune (FC Road)');
      setDetectedLocalityLabel('FC Road, Deccan, Pune');
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus('Pinpointing your exact GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const accMeters = Math.round(accuracy || 20);
        setUserCoords({ lat: latitude, lng: longitude });

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
      let url = `/api/restaurants/nearby?city=${encodeURIComponent(city)}&area=${areaParam}&lat=${userCoords.lat}&lng=${userCoords.lng}`;
      if (query.trim()) {
        url = `/api/restaurants/search?q=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`;
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
  }, [userCoords, selectedRestaurant, onSelectRestaurant]);

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
    <div className="w-full rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-4 text-slate-900 relative">
      {/* Top Section Header */}
      <div className="text-left">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
            STEP 1 OF 4 • GPS LOCATION &amp; HOTELS
          </span>
          <button
            onClick={detectUserLocation}
            disabled={isDetectingLocation}
            type="button"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#023093] text-[11px] font-extrabold border border-blue-200 transition-all cursor-pointer"
          >
            <RotateCw className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin text-blue-600' : ''}`} />
            <span>Re-detect GPS</span>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 brand-font">
          Kahan Khilaoge Bakasur Ko?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Live GPS auto-detected iconic food joints in your locality:
        </p>
      </div>

      {/* Zomato-Style Location Bar */}
      <div
        onClick={() => setShowLocationPickerModal(true)}
        className="flex items-center justify-between p-3 px-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-slate-50 to-blue-50/90 border-2 border-blue-200/90 hover:border-[#023093] transition-all cursor-pointer shadow-sm group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#023093] text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-900/30">
            <MapPin className="w-4 h-4 text-cyan-300 animate-bounce" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs sm:text-sm text-slate-900 truncate brand-font group-hover:text-[#023093] transition-colors">
                {detectedLocalityLabel}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#023093] shrink-0 transition-transform group-hover:translate-y-0.5" />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className="truncate">{locationStatus}</span>
            </div>
          </div>
        </div>

        <span className="text-[11px] font-extrabold text-[#023093] bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs shrink-0 whitespace-nowrap">
          Change Area ▾
        </span>
      </div>

      {/* Zomato-Style Area Quick Filter Chips */}
      {selectedCity.toLowerCase() === 'pune' && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-orange-500" />
              <span>Select Locality / Area in Pune:</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {availableAreas.length} Localities
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {/* All Areas Chip */}
            <button
              onClick={() => handleAreaSelect('All Areas')}
              type="button"
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer border text-[11px] ${
                currentArea === 'All Areas'
                  ? 'bg-[#023093] text-white border-[#023093] shadow-md shadow-blue-900/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
              }`}
            >
              ✨ All Pune
            </button>

            {/* Popular Area Chips */}
            {availableAreas.map((area) => {
              const isSelected = currentArea.toLowerCase() === area.name.toLowerCase();
              return (
                <button
                  key={area.id}
                  onClick={() => handleAreaSelect(area.name)}
                  type="button"
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer border text-[11px] flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#023093] text-white border-[#023093] shadow-md shadow-blue-900/20 scale-[1.02]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>📍 {area.name}</span>
                  {area.distanceKm !== undefined && (
                    <span className={`text-[9px] font-mono px-1 rounded ${isSelected ? 'bg-blue-800 text-cyan-200' : 'bg-slate-200 text-slate-600'}`}>
                      {area.distanceKm}km
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Unified Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`🔍 Search restaurant, dish, or area (e.g. Vaishali, Misal, FC Road)...`}
          className="w-full pl-10 pr-8 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-[#023093] focus:bg-white transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5"
          >
            ✕
          </button>
        )}
      </div>

      {/* Recommended Nearby Hotels / Food Joints List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {currentArea !== 'All Areas' ? `${currentArea} Spots` : `Recommended Spots in ${selectedCity}`}
            </span>
          </span>
          <span className="text-[11px] text-slate-500 font-semibold font-mono">
            {nearbyRestaurants.length} Joints
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
          {isLoadingSpots && nearbyRestaurants.length === 0 ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : nearbyRestaurants.length === 0 ? (
            <div className="p-6 text-center rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <p className="text-xs font-bold text-slate-600">No restaurants found in &quot;{currentArea}&quot;.</p>
              <button
                onClick={() => handleAreaSelect('All Areas')}
                className="text-xs font-bold text-[#023093] hover:underline"
              >
                View all restaurants in {selectedCity} →
              </button>
            </div>
          ) : (
            nearbyRestaurants.map((rest) => {
              const isSelected = selectedRestaurant?.id === rest.id;
              return (
                <div
                  key={rest.id}
                  onClick={() => onSelectRestaurant(rest)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-2 border-[#023093] bg-blue-50/80 shadow-md scale-[1.01]'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  {/* Left Thumbnail & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-inner">
                      <img src={rest.image} alt={rest.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className={`font-black text-xs sm:text-sm brand-font truncate ${isSelected ? 'text-[#023093]' : 'text-slate-900'}`}>
                          {rest.name}
                        </h4>
                        <span className="flex items-center text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          ★ {rest.rating}
                        </span>
                      </div>

                      {/* Locality & Live Distance Tag */}
                      <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-0.5 truncate">
                        <span className="text-[#023093] font-bold bg-blue-100/70 px-1.5 py-0.2 rounded truncate">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer brand-font ${
                      isSelected
                        ? 'bg-[#023093] text-white shadow-md shadow-blue-900/30'
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
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={onBack}
          type="button"
          className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!selectedRestaurant}
          type="button"
          className="flex-1 py-3 px-5 rounded-xl bg-[#023093] hover:bg-[#033bb8] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-900/30 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer brand-font disabled:opacity-50"
        >
          <span>Next: Pick Food to Feed</span>
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

