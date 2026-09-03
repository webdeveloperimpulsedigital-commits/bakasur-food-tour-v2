'use client';

import React, { useState } from 'react';
import { Share2, RotateCcw, Check, Sparkles, Trophy, Download, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Restaurant, Dish } from '@/lib/db';
import { SpiceOption } from './StepDish';

interface StepContestProps {
  sessionId: string;
  restaurant: Restaurant;
  dish: Dish | { name: string; id?: number };
  spice: SpiceOption;
  onRestartTour: () => void;
}

export const StepContest: React.FC<StepContestProps> = ({
  sessionId,
  restaurant,
  dish,
  spice,
  onRestartTour
}) => {
  const [showRegModal, setShowRegModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [participationId, setParticipationId] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle WhatsApp Share / Native Share
  const handleSharePass = async () => {
    const shareText = `🍽️ I just fed Bakasur legendary ${dish.name} at ${restaurant.name} (${restaurant.city}) on Bakasur Ka Food Tour! 🌶️ Acidity neutralized in 6 seconds with Gastrium Antacid! Join the tour: ${typeof window !== 'undefined' ? window.location.origin : ''}`;
    
    // Trigger celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#023093', '#00acc1', '#ff9800', '#00c853']
    });

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bakasur Ka Food Tour Official Pass',
          text: shareText,
          url: window.location.href
        });
      } catch {
        // Fallback to WhatsApp direct link
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/campaign/participate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          name: name.trim(),
          mobile: mobile.trim(),
          email: email.trim() || `${mobile.trim()}@foodtour.com`,
          city: restaurant.city,
          restaurant_id: restaurant.id,
          dish_id: dish.id || 1,
          consent: true,
          terms_accepted: true
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setParticipationId(json.data.participation_id);
        setIsRegistered(true);
        setShowRegModal(false);

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#023093', '#00acc1', '#ff9800', '#ffd700']
        });
      } else {
        setError(json.error || 'Failed to submit registration');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-4 sm:gap-5 text-slate-900 animate-in fade-in duration-300">
      {/* Top Label */}
      <div className="text-left">
        <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
          OFFICIAL TOUR PASS • VERIFIED
        </span>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 brand-font">
          Aapka Tour Pass Ready Hai!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Bakasur has savoured your recommendation and registered this stop for {restaurant.city}!
        </p>
      </div>

      {/* Official Tour Pass Ticket Card */}
      <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 sm:p-5 flex flex-col gap-3 shadow-md relative overflow-hidden">
        {/* Pass Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
              BAKASUR FOOD TOUR PASS
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-300">
            ⚡ 1/1 VERIFIED
          </span>
        </div>

        {/* Restaurant & City */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-black text-lg text-slate-900 brand-font flex items-center gap-1">
              <span>📍 {restaurant.name}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              City: <span className="font-bold text-slate-800">{restaurant.city}</span>
            </p>
          </div>

          {participationId && (
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Pass ID</span>
              <span className="text-xs font-black text-[#023093] font-mono">{participationId}</span>
            </div>
          )}
        </div>

        {/* Dish & Spice Info */}
        <div className="rounded-xl bg-white border border-slate-200/80 p-3 flex flex-col gap-1 text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-1">
            <span>🍽 Signature Food:</span>
            <span className="text-[#023093] font-extrabold">{dish.name}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold pt-1">
            <span className="text-orange-600 font-bold">
              {spice.icon} {spice.name} ({spice.level})
            </span>
            <span>•</span>
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <span>✨</span>
              <span>Bakasur Approved</span>
            </span>
          </div>
        </div>

        {/* Contest badge / status */}
        {isRegistered ? (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <span>✓ Entered in Food Tour Hamper Contest</span>
            <span className="text-[10px] text-emerald-600">Active</span>
          </div>
        ) : (
          <button
            onClick={() => setShowRegModal(true)}
            type="button"
            className="text-xs font-bold text-[#023093] hover:underline flex items-center justify-center gap-1 py-1"
          >
            <span>🎁 Claim Food Tour Contest Entry</span>
            <Sparkles className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onRestartTour}
          type="button"
          className="px-4 sm:px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Feed at Another Joint</span>
        </button>

        <button
          onClick={handleSharePass}
          type="button"
          className="flex-1 py-3 px-5 rounded-xl bg-[#023093] hover:bg-[#033bb8] text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-900/30 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer brand-font"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Pass on WhatsApp</span>
        </button>
      </div>

      {/* Contest Modal Dialog */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-base brand-font">Contest Registration</h3>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Enter your mobile number to register this food tour stop and enter the Gastrium Food Tour contest:
            </p>

            {error && (
              <div className="p-2.5 mb-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohit Sharma"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#023093]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  10-Digit Mobile *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#023093]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohit@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#023093]"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 py-3 rounded-xl bg-[#023093] hover:bg-[#033bb8] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer brand-font disabled:opacity-50"
              >
                {isLoading ? 'Registering...' : 'Complete Registration & Claim Pass'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
