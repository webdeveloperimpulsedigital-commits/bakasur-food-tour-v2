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
  onExploreMap: () => void;
  onRestartTour: () => void;
}

export const StepContest: React.FC<StepContestProps> = ({
  sessionId,
  restaurant,
  dish,
  spice,
  onExploreMap,
  onRestartTour
}) => {
  const [showOfflineTourModal, setShowOfflineTourModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [participationId, setParticipationId] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle WhatsApp Share / Native Share
  const handleSharePass = async () => {
    const shareText = `🍽️ I just contributed my food recommendation (${dish.name} at ${restaurant.name}, ${restaurant.city}) to Bakasur's Food Tour! Check out the Gastrium Food Tour Map: ${typeof window !== 'undefined' ? window.location.origin : ''}`;
    
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
          title: 'Bakasur Ka Food Tour Contribution',
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

  const handleRegisterOfflineTour = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!mobile.trim() || !/^\d{10}$/.test(mobile.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!consentAccepted) {
      setError('Please accept the consent terms to register for the offline food tour.');
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
        setShowOfflineTourModal(false);

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#023093', '#00acc1', '#ff9800', '#ffd700']
        });
      } else {
        setError(json.error || 'Failed to submit offline tour registration');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-4 sm:gap-5 text-slate-900 animate-in fade-in duration-300">
      {/* Top Header: Submission Confirmation */}
      <div className="text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2 border border-emerald-300">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>SUBMISSION CONFIRMED • CONTRIBUTION RECORDED</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 brand-font">
          Thank You! Bakasur Ka Food Tour Contribution Recorded!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          Bakasur personally thanks you for recommending <strong className="text-slate-900 font-bold">{dish.name}</strong> at <strong className="text-slate-900 font-bold">{restaurant.name}</strong>! Your recommendation has been submitted and will appear on the live <span className="text-[#023093] font-bold">Gastrium Food Tour Map</span> after a brief review.
        </p>
      </div>

      {/* Contribution Ticket Card */}
      <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-blue-50/40 to-white p-4 sm:p-5 flex flex-col gap-3 shadow-md relative overflow-hidden">
        {/* Pass Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
              GASTRIUM FOOD TOUR MAP SUBMISSION
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider border border-blue-300">
            ✓ In Review Trail
          </span>
        </div>

        {/* Restaurant & City */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-black text-lg text-slate-900 brand-font flex items-center gap-1">
              <span>📍 {restaurant.name}</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              City: <span className="font-bold text-slate-800">{restaurant.city}</span> ({restaurant.area || 'Pune'})
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
            <span>🍽 Recommended Dish:</span>
            <span className="text-[#023093] font-extrabold">{dish.name}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold pt-1">
            <span className="text-orange-600 font-bold">
              {spice.icon} {spice.name}
            </span>
            <span>•</span>
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <span>✨</span>
              <span>Bakasur Approved Stop</span>
            </span>
          </div>
        </div>

        {/* Offline Food Tour Registration Box */}
        {isRegistered ? (
          <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Registered for Real-World Offline Food Tour with Influencers!</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Active Entry</span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h4 className="text-xs font-black text-slate-900 brand-font flex items-center gap-1">
                <span>🎉 Join the Real-World Food Tour with Top Influencers</span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Optional invitation to join the offline Gastrium Food Tour in {restaurant.city}.
              </p>
            </div>

            <button
              onClick={() => setShowOfflineTourModal(true)}
              type="button"
              className="px-3.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer whitespace-nowrap shrink-0 brand-font"
            >
              <span>Register Interest 🎟️</span>
            </button>
          </div>
        )}
      </div>

      {/* Continue the Journey: Primary (Explore Map) & Secondary (Recommend Another Spot) */}
      <div className="flex flex-col gap-2.5 pt-1">
        {/* Primary Action Button: Explore Food Tour Map */}
        <button
          onClick={onExploreMap}
          type="button"
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#023093] via-[#033bb8] to-[#00acc1] hover:from-[#033bb8] hover:to-[#00acc1] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-900/40 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer brand-font"
        >
          <span className="text-lg">🗺️</span>
          <span>Explore the Food Tour Map</span>
          <Sparkles className="w-4 h-4 text-cyan-200" />
        </button>

        {/* Secondary Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={onRestartTour}
            type="button"
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recommend Another Restaurant</span>
          </button>

          <button
            onClick={handleSharePass}
            type="button"
            className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Contribution</span>
          </button>
        </div>
      </div>

      {/* Offline Food Tour Registration Modal */}
      {showOfflineTourModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="font-black text-base brand-font">Offline Food Tour Registration</h3>
              </div>
              <button
                onClick={() => setShowOfflineTourModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Clear info what they are registering interest for */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 mb-4 leading-relaxed">
              <strong className="text-blue-950 block font-bold mb-1">What you are registering for:</strong>
              An invitation to participate in the real-world Gastrium Food Tour across legendary culinary spots with featured food influencers. Shortlisted foodies will be invited based on selection conditions.
            </div>

            {error && (
              <div className="p-2.5 mb-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleRegisterOfflineTour} className="flex flex-col gap-3">
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
                  10-Digit Mobile Number *
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

              {/* Explicit Consent & Conditions Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-1 rounded text-[#023093] focus:ring-[#023093]"
                />
                <label htmlFor="consentCheckbox" className="text-[11px] text-slate-600 leading-tight">
                  I agree to the registration conditions and consent to be contacted regarding the real-world Gastrium Food Tour with food influencers.
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 py-3 rounded-xl bg-[#023093] hover:bg-[#033bb8] text-white font-extrabold text-sm shadow-md transition-all cursor-pointer brand-font disabled:opacity-50"
              >
                {isLoading ? 'Registering Interest...' : 'Confirm Registration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
