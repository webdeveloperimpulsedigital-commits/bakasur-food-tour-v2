'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, X, ArrowRight, ArrowLeft, Star, Sparkles, Utensils, Check, Flame, PlusCircle } from 'lucide-react';
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

  // Fetch recommended dishes for the selected restaurant
  const fetchDishes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${restaurant.id}/dishes`);
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
  }, [restaurant.id, selectedDish, onSelectDish]);

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
      price: 150
    };
    onSelectDish(customItem);
  };

  const activeDishName = selectedDish?.name || '';
  const isCustomDishSelected = selectedDish && !dishes.some(d => d.name.toLowerCase() === selectedDish.name.toLowerCase());

  return (
    <div className="w-full flex flex-col gap-2 sm:gap-2.5 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white brand-font leading-tight">
            {restaurant.name} Special Thali:
          </h2>
          <p className="text-[10px] sm:text-[11px] text-blue-200 font-medium leading-snug">
            Bakasur ko kaunsi famous dish taste karwani hai?
          </p>
        </div>
        <span className="text-[10px] font-bold text-white bg-[#D23002]/60 px-2 py-0.5 rounded-full border border-[#D23002] shrink-0">
          📍 {restaurant.area || restaurant.city}
        </span>
      </div>

      {/* Dishes List */}
      <div className="flex flex-col gap-1.5 max-h-[145px] sm:max-h-[170px] overflow-y-auto pr-0.5">
        {isLoading && dishes.length === 0 ? (
          <div className="flex flex-col gap-1.5">
            {[1, 2].map(i => (
              <div key={i} className="h-12 rounded-xl bg-white/10 animate-pulse" />
            ))}
          </div>
        ) : (
          dishes.slice(0, 3).map((dish) => {
            const isSelected = selectedDish?.name === dish.name;
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
                    <div className="flex items-center gap-1.5">
                      <h4 className={`font-black text-xs sm:text-sm brand-font truncate ${isSelected ? 'text-[#D23002]' : 'text-slate-900'}`}>
                        {dish.name}
                      </h4>
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

      {/* Spice Level Selector - Compact Pill Row */}
      <div className="flex flex-col gap-1 pt-0.5 relative z-10">
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

      {/* Navigation Footer */}
      <div className="pt-0.5 relative z-10">
        <button
          onClick={() => onFeedBakasur(activeDishName)}
          disabled={!activeDishName.trim()}
          type="button"
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#D23002] hover:bg-[#eb420e] text-white font-black text-xs sm:text-sm shadow-xl shadow-[#D23002]/30 transition-all flex items-center justify-center gap-2 cursor-pointer brand-font disabled:opacity-50 tracking-wide border border-white/20"
        >
          <span>Feed Bakasur Now! 🍛</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

