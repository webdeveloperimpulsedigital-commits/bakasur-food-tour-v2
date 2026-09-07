'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, ArrowRight, ArrowLeft, PlusCircle, Check, Flame, Sparkles } from 'lucide-react';
import { Restaurant, Dish } from '@/lib/db';

export interface SpiceOption {
  id: string;
  name: string;
  level: string;
  icon: string;
  description: string;
}

export const SPICE_LEVELS: SpiceOption[] = [
  { id: 'mild', name: 'Mild & Makkhan', level: '1/5', icon: '🧈', description: 'Bachha Level - Bakasur will laugh at you!' },
  { id: 'masaledaar', name: 'Masaledaar', level: '3/5', icon: '🌶️', description: 'Asli Street Spice - Thoda thoda pasina aayega' },
  { id: 'fire', name: 'Bakasur Fire', level: '5/5', icon: '🔥', description: 'Direct Volcano - Seene mein aag guarantee!' }
];

interface StepDishProps {
  restaurant: Restaurant;
  selectedDish: Dish | { name: string; id?: number; price?: number } | null;
  selectedSpice: SpiceOption;
  onSelectDish: (dish: Dish | { name: string; id?: number; price?: number }) => void;
  onSelectSpice: (spice: SpiceOption) => void;
  onFeedBakasur: (customDishName?: string) => void;
  onBack?: () => void;
}

export const StepDish: React.FC<StepDishProps> = ({
  restaurant,
  selectedDish,
  selectedSpice,
  onSelectDish,
  onSelectSpice,
  onFeedBakasur,
  onBack
}) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live menu for the selected restaurant
  const fetchDishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        name: restaurant.name || '',
        area: restaurant.area || '',
        city: restaurant.city || ''
      });
      const res = await fetch(`/api/restaurants/${restaurant.id}/dishes?${queryParams.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDishes(json.data);
        // Auto-select first recommended dish if none selected yet
        if (!selectedDish && json.data.length > 0) {
          onSelectDish(json.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch dishes", err);
    } finally {
      setIsLoading(false);
    }
  }, [restaurant, selectedDish, onSelectDish]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  // Filtered dishes based on search query
  const filteredDishes = useMemo(() => {
    if (!searchQuery.trim()) return dishes;
    const q = searchQuery.toLowerCase().trim();
    return dishes.filter(d => 
      d.name.toLowerCase().includes(q) || 
      (d.description && d.description.toLowerCase().includes(q))
    );
  }, [dishes, searchQuery]);

  // Handle selecting an official dish
  const handleSelectDish = (dish: Dish) => {
    onSelectDish(dish);
  };

  // Handle selecting custom searched dish
  const handleSelectCustomDish = (customName: string) => {
    if (!customName.trim()) return;
    const customItem = {
      name: customName.trim(),
      id: Math.floor(Math.random() * 90000) + 10000,
      price: 160
    };
    onSelectDish(customItem);
  };

  const activeDishName = selectedDish?.name || '';
  const isCustomMatch = searchQuery.trim() && !filteredDishes.some(d => d.name.toLowerCase() === searchQuery.trim().toLowerCase());

  return (
    <div className="w-full h-full flex flex-col justify-between min-h-0 text-white gap-2">
      {/* Top Header - Fixed at Top */}
      <div className="shrink-0 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white brand-font leading-tight truncate">
              {restaurant.name} Menu:
            </h2>
            <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE MENU
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-blue-200 font-medium leading-snug">
            Choose what Bakasur will feast on today!
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold shrink-0 transition-all border border-white/15"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Change Spot</span>
          </button>
        )}
      </div>

      {/* Dish Search & Custom Dish Input Box */}
      <div className="shrink-0 relative z-10">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`🔍 Search menu or type ANY dish from ${restaurant.name}...`}
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

      {/* Custom Dish Quick Add Banner if user typed something new */}
      {isCustomMatch && (
        <div
          onClick={() => handleSelectCustomDish(searchQuery)}
          className="shrink-0 p-2 rounded-xl bg-amber-500/20 border border-amber-400/50 hover:bg-amber-500/30 cursor-pointer transition-all flex items-center justify-between gap-2 text-white"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <PlusCircle className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="text-[11px] font-bold truncate">
              Feed custom dish: <span className="underline text-amber-200">&quot;{searchQuery}&quot;</span>
            </span>
          </div>
          <button
            type="button"
            className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] shrink-0"
          >
            Select 🍛
          </button>
        </div>
      )}

      {/* Dishes List (All Authentic Live Menu Items) - Scrollable Middle Area */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 flex flex-col gap-1.5 relative z-10">
        {isLoading && dishes.length === 0 ? (
          <div className="flex flex-col gap-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 rounded-xl bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : filteredDishes.length === 0 && !isCustomMatch ? (
          <div className="p-3 text-center rounded-xl bg-white/10 border border-white/15">
            <p className="text-xs font-bold text-blue-100">No matching dishes for &quot;{searchQuery}&quot;</p>
            <p className="text-[10px] text-blue-200 mt-0.5">Type the dish name above to add it custom!</p>
          </div>
        ) : (
          filteredDishes.map((dish) => {
            const isSelected = selectedDish?.name.toLowerCase() === dish.name.toLowerCase();
            return (
              <div
                key={dish.id}
                onClick={() => handleSelectDish(dish)}
                className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 text-slate-900 ${
                  isSelected
                    ? 'border-2 border-[#D23002] bg-orange-50/95 shadow-md scale-[1.01]'
                    : 'border-white/20 hover:border-[#D23002]/50 hover:bg-slate-50 bg-white shadow-sm'
                }`}
              >
                {/* Left info */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                    {dish.image ? (
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-base">🍽️</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className={`font-black text-xs sm:text-sm brand-font truncate ${isSelected ? 'text-[#D23002]' : 'text-slate-900'}`}>
                        {dish.name}
                      </h4>
                      {dish.price ? (
                        <span className="text-[9px] font-extrabold text-slate-600 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                          ₹{dish.price}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 truncate mt-0.5">
                      {dish.description || `Specialty at ${restaurant.name}.`}
                    </p>
                  </div>
                </div>

                {/* Right Select button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectDish(dish);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#D23002] text-white shadow-sm'
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

      {/* Spice Level Selector - Compact Row */}
      <div className="shrink-0 flex flex-col gap-1 pt-0.5 relative z-10">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-extrabold text-[#ff8566] uppercase tracking-wider flex items-center gap-1">
            <span>SPICE LEVEL:</span>
            <span>🌶️</span>
          </span>
          <span className="font-bold text-[#ffb09c]">
            {selectedSpice.name} ({selectedSpice.level})
          </span>
        </div>

        {/* 3 Spice Pill Buttons Side by Side */}
        <div className="grid grid-cols-3 gap-1.5">
          {SPICE_LEVELS.map((sp) => {
            const isSelected = selectedSpice.id === sp.id;
            return (
              <button
                key={sp.id}
                onClick={() => onSelectSpice(sp)}
                type="button"
                className={`py-1.5 px-2 rounded-xl text-center border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'border-2 border-[#D23002] bg-[#D23002] text-white font-black shadow-md scale-[1.02]'
                    : 'border-white/20 hover:border-[#D23002]/50 bg-white/10 text-white'
                }`}
              >
                <span className="text-sm">{sp.icon}</span>
                <span className="font-extrabold text-[10px] sm:text-[11px] brand-font truncate">{sp.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer - Anchored at the bottom */}
      <div className="shrink-0 pt-0.5 relative z-10">
        <button
          onClick={() => onFeedBakasur(activeDishName)}
          disabled={!activeDishName.trim()}
          type="button"
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#D23002] hover:bg-[#eb420e] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#D23002]/30 transition-all flex items-center justify-center gap-2 cursor-pointer brand-font disabled:opacity-50 tracking-wide border border-white/20"
        >
          <span>Feed Bakasur: {activeDishName ? `"${activeDishName.slice(0, 20)}${activeDishName.length > 20 ? '...' : ''}"` : 'Pick a Dish'} 🍛</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
