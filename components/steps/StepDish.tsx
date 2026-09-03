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
  { id: 'mild', name: 'Mild & Makkhan', level: '1/5', icon: '🧈', description: 'Smooth butter & gentle aroma' },
  { id: 'masaledaar', name: 'Masaledaar', level: '3/5', icon: '🌶️', description: 'Rich Indian spices & robust heat' },
  { id: 'fire', name: 'Bakasur Fire', level: '5/5', icon: '🔥', description: 'Extreme spicy chili blast' }
];

interface StepDishProps {
  restaurant: Restaurant;
  selectedDish: Dish | { name: string; id?: number; price?: number } | null;
  selectedSpice: SpiceOption;
  onSelectDish: (dish: Dish | { name: string; id?: number; price?: number }) => void;
  onSelectSpice: (spice: SpiceOption) => void;
  onFeedBakasur: (customDishName?: string) => void;
  onBack: () => void;
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
    <div className="w-full flex flex-col gap-4 text-white">
      {/* Top Header */}
      <div className="text-left">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-black text-yellow-300 uppercase tracking-wider">
            STEP 2 OF 4 • PICK DISH AT {restaurant.name.toUpperCase()}
          </span>
          <span className="text-[11px] font-black text-yellow-300 bg-yellow-400/20 px-2.5 py-0.5 rounded-full border border-yellow-400/40">
            📍 {restaurant.area || restaurant.city}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white brand-font">
          {restaurant.name} Mein Kya Khilaoge?
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 mt-0.5">
          Pick a signature dish recommended by {restaurant.name} or search any specialty:
        </p>
      </div>

      {/* Dish Search Bar */}
      <div className="relative z-10">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`🔍 Search menu or type any dish (e.g. ${dishes[0]?.name || 'Special Biryani'})...`}
          className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-white border border-blue-200 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all shadow-md"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* 3 Dishes Associated with Restaurant */}
      <div className="flex flex-col gap-1.5 min-h-0 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-yellow-400" />
            <span>Dishes at {restaurant.name}</span>
          </span>
          {activeDishName && (
            <span className="text-[11px] font-black text-yellow-300 truncate max-w-[180px]">
              ✓ Selected: {activeDishName}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 max-h-[130px] sm:max-h-[160px] md:max-h-[180px] overflow-y-auto pr-1">
          {isLoading && dishes.length === 0 ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 rounded-xl bg-white/10 animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* Option to feed typed custom dish if searching or manual entry */}
              {searchQuery.trim() && (
                <div
                  onClick={() => handleSelectCustomDish(searchQuery)}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-between gap-3 text-slate-900 ${
                    isCustomDishSelected && selectedDish?.name.toLowerCase() === searchQuery.toLowerCase()
                      ? 'border-yellow-400 bg-yellow-50/95 shadow-md'
                      : 'border-yellow-300/80 bg-white/95 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center text-lg shrink-0 shadow-sm font-bold">
                      🍲
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-xs sm:text-sm text-slate-900 brand-font truncate">
                          Recommend Dish: &ldquo;{searchQuery}&rdquo;
                        </h4>
                        <span className="text-[10px] font-bold text-slate-900 bg-yellow-400 px-1.5 py-0.2 rounded">
                          Your Recommendation
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                        Feed Bakasur your custom recommended dish at {restaurant.name}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCustomDish(searchQuery);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all shrink-0 cursor-pointer ${
                      isCustomDishSelected && selectedDish?.name.toLowerCase() === searchQuery.toLowerCase()
                        ? 'bg-yellow-400 text-slate-950 shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isCustomDishSelected && selectedDish?.name.toLowerCase() === searchQuery.toLowerCase()
                      ? '✓ Selected'
                      : '+ Recommend This'}
                  </button>
                </div>
              )}

              {/* List of 3 Dishes associated with restaurant */}
              {filteredDishes.length === 0 && !searchQuery.trim() ? (
                <div className="p-4 text-center rounded-xl bg-white/10 border border-white/15">
                  <p className="text-xs text-blue-100">No dishes available at this moment. You can type any dish above to recommend.</p>
                </div>
              ) : (
                filteredDishes.slice(0, 3).map((dish) => {
                  const isSelected = selectedDish?.name === dish.name;
                  return (
                    <div
                      key={dish.id}
                      onClick={() => handleSelectDish(dish)}
                      className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-slate-900 ${
                        isSelected
                          ? 'border-2 border-yellow-400 bg-yellow-50/95 shadow-md scale-[1.01]'
                          : 'border-white/20 hover:border-yellow-400/50 hover:bg-slate-50 bg-white shadow-sm'
                      }`}
                    >
                      {/* Left info */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center">
                          {dish.image ? (
                            <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">🍽️</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className={`font-black text-xs sm:text-sm brand-font truncate ${isSelected ? 'text-[#023093]' : 'text-slate-900'}`}>
                              {dish.name}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded">
                              ₹{dish.price}
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5">
                            {dish.description || `Dish served at ${restaurant.name}.`}
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-yellow-400 text-slate-950 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : 'Select'}
                      </button>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>

      {/* Spice Level Selector */}
      <div className="flex flex-col gap-1.5 pt-1 relative z-10">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-yellow-300 uppercase tracking-wider flex items-center gap-1">
            <span>CHOOSE SPICE LEVEL</span>
            <span>🌶️</span>
          </label>
          <span className="text-[11px] font-black text-yellow-400">
            {selectedSpice.name} ({selectedSpice.level})
          </span>
        </div>

        {/* 3 Spice Cards Side by Side */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {SPICE_LEVELS.map((sp) => {
            const isSelected = selectedSpice.id === sp.id;
            return (
              <button
                key={sp.id}
                onClick={() => onSelectSpice(sp)}
                type="button"
                className={`p-2.5 sm:p-3 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'border-2 border-yellow-400 bg-yellow-400 text-slate-950 font-black shadow-lg shadow-yellow-500/25 scale-[1.02]'
                    : 'border-white/20 hover:border-yellow-400/50 bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <span className="text-xl">{sp.icon}</span>
                <span className="font-extrabold text-xs brand-font truncate w-full">{sp.name}</span>
                <span className={`text-[10px] font-bold ${isSelected ? 'text-slate-900' : 'text-blue-200'}`}>{sp.level}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center gap-3 pt-1 relative z-10">
        <button
          onClick={onBack}
          type="button"
          className="px-5 py-2.5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={() => onFeedBakasur(activeDishName)}
          disabled={!activeDishName.trim()}
          type="button"
          className="flex-1 py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-yellow-500/25 hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer brand-font disabled:opacity-50 tracking-wide"
        >
          <span>Feed Bakasur Now! 🍛</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

