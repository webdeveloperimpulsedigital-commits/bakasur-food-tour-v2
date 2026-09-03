'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Video, 
  Utensils, 
  Store, 
  Users, 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  RefreshCw,
  Search,
  ExternalLink,
  ChevronLeft,
  ShieldCheck
} from 'lucide-react';
import { Restaurant, Dish, BakasurVideo, Participant } from '@/lib/db';

type AdminTab = 'analytics' | 'videos' | 'restaurants' | 'dishes' | 'participants' | 'database';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Data States
  interface AnalyticsData {
    totalUsers: number;
    totalToursStarted: number;
    totalAurKhiloClicks: number;
    totalCompletedTours: number;
    totalSubmissions: number;
    popularRestaurants: Restaurant[];
    popularDishes: Dish[];
    dbStatus: {
      engine: string;
      isMySQLHealthy: boolean;
      config: { host: string; database: string; user: string };
    };
  }

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [videos, setVideos] = useState<BakasurVideo[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Video Upload / Add Form State
  const [videoForm, setVideoForm] = useState({
    restaurant_id: '',
    dish_id: '',
    stage: 'stage_1',
    stage_number: '1',
    video_url: '',
    meter_percentage: '20',
    message: 'Aur Khilo! Bakasur ki bhookh abhi shant nahi hui!',
    cta_text: '🍽️ AUR KHILO'
  });
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Restaurant Form State
  const [restForm, setRestForm] = useState({
    name: '',
    description: '',
    address: '',
    area: '',
    city: 'Pune',
    latitude: '18.5204',
    longitude: '73.8407',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'
  });
  const [showRestModal, setShowRestModal] = useState(false);

  // Dish Form State
  const [dishForm, setDishForm] = useState({
    restaurant_id: '1',
    name: '',
    description: '',
    price: '160',
    rating: '4.8',
    popularity: '95',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80'
  });
  const [showDishModal, setShowDishModal] = useState(false);

  // Load All Data
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Analytics
      const aRes = await fetch('/api/admin/analytics');
      const aJson = await aRes.json();
      if (aJson.success) setAnalytics(aJson.data);

      // 2. Videos
      const vRes = await fetch('/api/admin/videos');
      const vJson = await vRes.json();
      if (vJson.success) setVideos(vJson.data);

      // 3. Restaurants
      const rRes = await fetch('/api/admin/restaurants');
      const rJson = await rRes.json();
      if (rJson.success) setRestaurants(rJson.data);

      // 4. Dishes
      const dRes = await fetch('/api/admin/dishes');
      const dJson = await dRes.json();
      if (dJson.success) setDishes(dJson.data);

      // 5. Participants
      const pRes = await fetch('/api/admin/participants');
      const pJson = await pRes.json();
      if (pJson.success) setParticipants(pJson.data);
    } catch (err) {
      console.error("Failed to load admin data", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Video File Upload
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    setStatusMessage({ text: `Uploading "${file.name}"...`, type: 'success' });

    try {
      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch('/api/admin/videos/upload', {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (json.success && json.videoUrl) {
        setVideoForm(prev => ({ ...prev, video_url: json.videoUrl }));
        setStatusMessage({ text: 'Video uploaded successfully to server!', type: 'success' });
      } else {
        setStatusMessage({ text: json.error || 'Upload failed', type: 'error' });
      }
    } catch {
      setStatusMessage({ text: 'Upload failed due to network issue', type: 'error' });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Handle Save Video Mapping
  const handleSaveVideoMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.video_url || !videoForm.message) {
      setStatusMessage({ text: 'Video URL and dialogue message are required', type: 'error' });
      return;
    }

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoForm)
      });
      const json = await res.json();
      if (json.success) {
        setStatusMessage({ text: 'Bakasur video stage mapped successfully!', type: 'success' });
        loadDashboardData();
      }
    } catch {
      setStatusMessage({ text: 'Failed to save video mapping', type: 'error' });
    }
  };

  // Handle Delete Video
  const handleDeleteVideo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video mapping?')) return;
    try {
      await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
      setStatusMessage({ text: 'Video deleted', type: 'success' });
      loadDashboardData();
    } catch {
      setStatusMessage({ text: 'Delete failed', type: 'error' });
    }
  };

  // Handle Create Restaurant
  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restForm)
      });
      const json = await res.json();
      if (json.success) {
        setShowRestModal(false);
        setStatusMessage({ text: 'Restaurant added successfully!', type: 'success' });
        loadDashboardData();
      }
    } catch {
      setStatusMessage({ text: 'Failed to add restaurant', type: 'error' });
    }
  };

  // Handle Create Dish
  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dishForm)
      });
      const json = await res.json();
      if (json.success) {
        setShowDishModal(false);
        setStatusMessage({ text: 'Dish added successfully!', type: 'success' });
        loadDashboardData();
      }
    } catch {
      setStatusMessage({ text: 'Failed to add dish', type: 'error' });
    }
  };

  // Handle Test MySQL Connection
  const handleTestMySQL = async () => {
    setStatusMessage({ text: 'Testing MySQL database connection...', type: 'success' });
    try {
      const res = await fetch('/api/admin/seed');
      const json = await res.json();
      if (json.mysqlTest?.success) {
        setStatusMessage({ text: `✓ ${json.mysqlTest.message}`, type: 'success' });
      } else {
        setStatusMessage({ text: `⚠️ ${json.mysqlTest?.message || 'MySQL is currently not reachable locally. Local Smart Engine is active.'}`, type: 'error' });
      }
      loadDashboardData();
    } catch {
      setStatusMessage({ text: 'MySQL test failed', type: 'error' });
    }
  };

  // Handle Re-seed Data
  const handleReSeedData = async () => {
    if (!confirm('Re-seed sample campaign restaurants, dishes, and videos?')) return;
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setStatusMessage({ text: json.message, type: 'success' });
        loadDashboardData();
      }
    } catch {
      setStatusMessage({ text: 'Re-seed failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0503] text-stone-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-[#120906]/95 border-b border-orange-500/20 px-4 py-3 sm:px-6 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-black/50 border border-orange-500/30 text-amber-200 hover:text-white flex items-center gap-1 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Tour</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm">
                👹
              </div>
              <h1 className="font-extrabold text-base sm:text-lg text-white">
                Bakasur Campaign CMS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Database Engine Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>{analytics?.dbStatus?.engine || 'Local & MySQL Ready'}</span>
            </div>

            <button
              onClick={loadDashboardData}
              className="p-2 rounded-xl bg-orange-950/40 border border-orange-500/30 text-orange-300 hover:text-white"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className={`p-3 text-center text-xs font-bold border-b ${
          statusMessage.type === 'success' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' : 'bg-red-950/80 border-red-500 text-red-200'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {/* Main Admin Body */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-orange-500/20">
          {[
            { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
            { id: 'videos', label: 'Video Management', icon: Video },
            { id: 'restaurants', label: 'Restaurants', icon: Store },
            { id: 'dishes', label: 'Dishes', icon: Utensils },
            { id: 'participants', label: 'Contest Participants', icon: Users },
            { id: 'database', label: 'Database & System', icon: Database }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/30'
                    : 'bg-black/40 text-stone-400 hover:text-amber-200 border border-orange-500/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS OVERVIEW */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Total Users', val: analytics?.totalUsers ?? 1240, icon: '👥', color: 'from-orange-600/30 to-amber-600/10' },
                { label: 'Tours Started', val: analytics?.totalToursStarted ?? 850, icon: '🚀', color: 'from-amber-600/30 to-yellow-600/10' },
                { label: '"Aur Khilo" Clicks', val: analytics?.totalAurKhiloClicks ?? 3420, icon: '🍽️', color: 'from-red-600/30 to-orange-600/10' },
                { label: 'Completed Tours', val: analytics?.totalCompletedTours ?? 720, icon: '🏆', color: 'from-emerald-600/30 to-teal-600/10' },
                { label: 'Contest Submissions', val: analytics?.totalSubmissions ?? 580, icon: '📋', color: 'from-sky-600/30 to-blue-600/10' }
              ].map((kpi, idx) => (
                <div key={idx} className={`p-4 rounded-2xl bg-gradient-to-b ${kpi.color} border border-orange-500/20 backdrop-blur-md`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{kpi.icon}</span>
                    <span className="text-[10px] text-amber-300 font-mono">LIVE</span>
                  </div>
                  <div className="text-2xl font-black text-white">{kpi.val.toLocaleString()}</div>
                  <div className="text-xs text-amber-200/70 font-semibold">{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Top Visited Restaurants & Dishes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Restaurants Card */}
              <div className="rounded-2xl bg-black/40 border border-orange-500/20 p-5">
                <h3 className="font-extrabold text-base text-white mb-3 flex items-center gap-2">
                  <span>🏆</span>
                  <span>Most Visited Restaurants</span>
                </h3>
                <div className="flex flex-col gap-2.5">
                  {(analytics?.popularRestaurants || restaurants.slice(0, 4)).map((r, i) => (
                    <div key={r.id} className="p-3 rounded-xl bg-stone-900/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-400 font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <strong className="text-white block">{r.name}</strong>
                          <span className="text-stone-400 text-[11px]">{r.city}</span>
                        </div>
                      </div>
                      <span className="font-black text-amber-400">{r.total_visits || 1200} visits</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Dishes Card */}
              <div className="rounded-2xl bg-black/40 border border-orange-500/20 p-5">
                <h3 className="font-extrabold text-base text-white mb-3 flex items-center gap-2">
                  <span>🍲</span>
                  <span>Top Satiated Dishes</span>
                </h3>
                <div className="flex flex-col gap-2.5">
                  {(analytics?.popularDishes || dishes.slice(0, 4)).map((d, i) => (
                    <div key={d.id} className="p-3 rounded-xl bg-stone-900/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-amber-600/30 text-amber-400 font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <strong className="text-white block">{d.name}</strong>
                          <span className="text-stone-400 text-[11px]">₹{d.price} • {d.popularity}% Popular</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold">⭐ {d.rating}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIDEO MANAGEMENT */}
        {activeTab === 'videos' && (
          <div className="flex flex-col gap-6">
            {/* Add / Upload Video Stage Form */}
            <div className="rounded-2xl bg-gradient-to-b from-[#1c0f08] to-[#120804] border border-orange-500/40 p-5 sm:p-6 shadow-xl">
              <h3 className="font-extrabold text-base sm:text-lg text-white mb-1 flex items-center gap-2">
                <Video className="w-5 h-5 text-orange-400" />
                <span>Upload &amp; Assign Bakasur Eating Stage Video</span>
              </h3>
              <p className="text-xs text-amber-200/70 mb-5">
                Map videos to specific Restaurant + Dish combinations, or configure default stage eating videos.
              </p>

              <form onSubmit={handleSaveVideoMapping} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Restaurant Assignment */}
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">Assign to Restaurant</label>
                  <select
                    value={videoForm.restaurant_id}
                    onChange={(e) => setVideoForm({ ...videoForm, restaurant_id: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-amber-100 text-xs focus:outline-none focus:border-orange-400"
                  >
                    <option value="">Default (All Restaurants)</option>
                    {restaurants.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.city})</option>
                    ))}
                  </select>
                </div>

                {/* Dish Assignment */}
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">Assign to Dish</label>
                  <select
                    value={videoForm.dish_id}
                    onChange={(e) => setVideoForm({ ...videoForm, dish_id: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-amber-100 text-xs focus:outline-none focus:border-orange-400"
                  >
                    <option value="">Default (All Dishes)</option>
                    {dishes.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Stage Type */}
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">Eating Stage</label>
                  <select
                    value={videoForm.stage}
                    onChange={(e) => {
                      const st = e.target.value;
                      let pct = '20';
                      let num = '1';
                      if (st === 'intro') { pct = '0'; num = '0'; }
                      if (st === 'stage_1') { pct = '20'; num = '1'; }
                      if (st === 'stage_2') { pct = '45'; num = '2'; }
                      if (st === 'stage_3') { pct = '85'; num = '3'; }
                      if (st === 'acidity') { pct = '100'; num = '4'; }
                      setVideoForm({ ...videoForm, stage: st, meter_percentage: pct, stage_number: num });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-amber-100 text-xs focus:outline-none focus:border-orange-400"
                  >
                    <option value="intro">Intro / Landing Video (0%)</option>
                    <option value="stage_1">Stage 1: First Portion (20%)</option>
                    <option value="stage_2">Stage 2: Heavy Feasting (45%)</option>
                    <option value="stage_3">Stage 3: Binge Overload (85%)</option>
                    <option value="acidity">Stage 4: Acidity / Gastrium Moment (100%)</option>
                  </select>
                </div>

                {/* Meter Target % */}
                <div>
                  <label className="block text-xs font-bold text-amber-200 mb-1">Food Meter % Target</label>
                  <input
                    type="number"
                    value={videoForm.meter_percentage}
                    onChange={(e) => setVideoForm({ ...videoForm, meter_percentage: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-amber-100 text-xs focus:outline-none"
                  />
                </div>

                {/* Video URL & File Upload */}
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-amber-200 mb-1">Video URL (MP4 / WebM)</label>
                    <input
                      type="text"
                      required
                      value={videoForm.video_url}
                      onChange={(e) => setVideoForm({ ...videoForm, video_url: e.target.value })}
                      placeholder="https://.../video.mp4 or /uploads/videos/..."
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-amber-100 text-xs focus:outline-none focus:border-orange-400 font-mono"
                    />
                  </div>

                  {/* Direct File Upload Trigger */}
                  <label className="py-2.5 px-4 rounded-xl bg-orange-700 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>{isUploadingVideo ? 'Uploading...' : 'Upload Video File'}</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={handleVideoFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Bakasur Speech Dialogue */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-amber-200 mb-1">Bakasur Dialogue Speech</label>
                  <textarea
                    rows={2}
                    required
                    value={videoForm.message}
                    onChange={(e) => setVideoForm({ ...videoForm, message: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-orange-500/30 text-amber-100 text-xs focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer"
                  >
                    Save &amp; Publish Video Mapping
                  </button>
                </div>
              </form>
            </div>

            {/* List of Configured Videos */}
            <div className="rounded-2xl bg-black/40 border border-orange-500/20 p-5">
              <h3 className="font-extrabold text-base text-white mb-3">Configured Eating Stage Videos</h3>
              <div className="flex flex-col gap-3">
                {videos.map((vid) => (
                  <div key={vid.id} className="p-3.5 rounded-xl bg-stone-900/70 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-orange-600 text-white font-bold text-[10px] uppercase">
                          {vid.stage} ({vid.meter_percentage}%)
                        </span>
                        <span className="text-amber-300 font-semibold truncate">
                          {vid.restaurant_id ? `Rest ID: ${vid.restaurant_id}` : 'Global Default'}
                        </span>
                      </div>
                      <p className="text-stone-300 text-xs italic mb-1">&ldquo;{vid.message}&rdquo;</p>
                      <span className="text-[11px] font-mono text-stone-500 truncate block">{vid.video_url}</span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="p-2 rounded-lg bg-red-950/60 text-red-400 hover:text-red-200 border border-red-500/30"
                        title="Delete Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RESTAURANTS */}
        {activeTab === 'restaurants' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-white">Manage Campaign Restaurants ({restaurants.length})</h3>
              <button
                onClick={() => setShowRestModal(true)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Restaurant</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map((r) => (
                <div key={r.id} className="rounded-2xl bg-stone-900/60 border border-orange-500/20 overflow-hidden flex flex-col">
                  <div className="h-32 w-full relative">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-300 text-xs font-bold">
                      ⭐ {r.rating}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-sm text-white mb-1">{r.name}</h4>
                      <p className="text-xs text-amber-200/70 line-clamp-2 mb-2">{r.description}</p>
                      <div className="text-[11px] text-stone-400">
                        📍 {r.address}, {r.city}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-800 text-xs">
                      <span className="text-orange-400 font-bold">{r.total_visits || 0} Visits</span>
                      <button
                        onClick={async () => {
                          if (confirm(`Delete ${r.name}?`)) {
                            await fetch(`/api/admin/restaurants/${r.id}`, { method: 'DELETE' });
                            loadDashboardData();
                          }
                        }}
                        className="text-red-400 hover:text-red-300 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Restaurant Modal */}
            {showRestModal && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-3xl bg-[#1a0f0a] border border-orange-500/40 p-6 shadow-2xl">
                  <h3 className="font-black text-lg text-white mb-4">Add New Restaurant</h3>
                  <form onSubmit={handleCreateRestaurant} className="flex flex-col gap-3 text-xs">
                    <div>
                      <label className="font-bold text-amber-200 block mb-1">Restaurant Name</label>
                      <input
                        type="text"
                        required
                        value={restForm.name}
                        onChange={(e) => setRestForm({ ...restForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-amber-200 block mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={restForm.city}
                          onChange={(e) => setRestForm({ ...restForm, city: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-amber-200 block mb-1">Area</label>
                        <input
                          type="text"
                          value={restForm.area}
                          onChange={(e) => setRestForm({ ...restForm, area: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-amber-200 block mb-1">Address</label>
                      <input
                        type="text"
                        required
                        value={restForm.address}
                        onChange={(e) => setRestForm({ ...restForm, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-amber-200 block mb-1">Image URL</label>
                      <input
                        type="text"
                        value={restForm.image}
                        onChange={(e) => setRestForm({ ...restForm, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowRestModal(false)}
                        className="px-4 py-2 rounded-xl bg-stone-800 text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold"
                      >
                        Save Restaurant
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: DISHES */}
        {activeTab === 'dishes' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-white">Manage Campaign Dishes ({dishes.length})</h3>
              <button
                onClick={() => setShowDishModal(true)}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dishes.map((d) => (
                <div key={d.id} className="rounded-2xl bg-stone-900/60 border border-orange-500/20 p-4 flex gap-3 items-center">
                  <img src={d.image} alt={d.name} className="w-16 h-16 rounded-xl object-cover border border-orange-500/30 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{d.name}</h4>
                    <span className="text-xs font-bold text-amber-400 block">₹{d.price} • ⭐ {d.rating}</span>
                    <p className="text-[11px] text-stone-400 line-clamp-1">{d.description}</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete ${d.name}?`)) {
                        await fetch(`/api/admin/dishes/${d.id}`, { method: 'DELETE' });
                        loadDashboardData();
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-950 text-red-400 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Dish Modal */}
            {showDishModal && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="w-full max-w-md rounded-3xl bg-[#1a0f0a] border border-orange-500/40 p-6 shadow-2xl">
                  <h3 className="font-black text-lg text-white mb-4">Add New Dish</h3>
                  <form onSubmit={handleCreateDish} className="flex flex-col gap-3 text-xs">
                    <div>
                      <label className="font-bold text-amber-200 block mb-1">Restaurant</label>
                      <select
                        value={dishForm.restaurant_id}
                        onChange={(e) => setDishForm({ ...dishForm, restaurant_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                      >
                        {restaurants.map(r => (
                          <option key={r.id} value={r.id}>{r.name} ({r.city})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-amber-200 block mb-1">Dish Name</label>
                      <input
                        type="text"
                        required
                        value={dishForm.name}
                        onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-amber-200 block mb-1">Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={dishForm.price}
                          onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-amber-200 block mb-1">Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          value={dishForm.rating}
                          onChange={(e) => setDishForm({ ...dishForm, rating: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-bold text-amber-200 block mb-1">Image URL</label>
                      <input
                        type="text"
                        value={dishForm.image}
                        onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black border border-stone-700 text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowDishModal(false)}
                        className="px-4 py-2 rounded-xl bg-stone-800 text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold"
                      >
                        Save Dish
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PARTICIPANTS */}
        {activeTab === 'participants' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-white">Contest Participants ({participants.length})</h3>
                <p className="text-xs text-stone-400">All registered users and contest entries with participation IDs</p>
              </div>

              <a
                href="/api/admin/participants/export"
                download
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </a>
            </div>

            <div className="rounded-2xl bg-black/40 border border-orange-500/20 overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-900 text-stone-400 uppercase font-mono text-[10px] border-b border-stone-800">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Mobile</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Restaurant Visited</th>
                    <th className="p-3">Dish Satiated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-medium">
                  {participants.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-900/30">
                      <td className="p-3 font-mono font-bold text-amber-400">{p.participation_id}</td>
                      <td className="p-3 text-white font-bold">{p.name}</td>
                      <td className="p-3">{p.mobile}</td>
                      <td className="p-3">{p.email}</td>
                      <td className="p-3">{p.city}</td>
                      <td className="p-3 text-orange-300">{p.restaurant_name || '-'}</td>
                      <td className="p-3 text-amber-200">{p.dish_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: DATABASE & SYSTEM HEALTH */}
        {activeTab === 'database' && (
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="rounded-2xl bg-black/40 border border-orange-500/20 p-5">
              <h3 className="font-extrabold text-base text-white mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-400" />
                <span>MySQL Connection Status &amp; Configuration</span>
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                The application connects to MySQL using the standard connection pooling layer. If MySQL is local or on RDS/Cloud, supply credentials in <code className="text-amber-300 bg-stone-900 px-1 py-0.5 rounded">.env.local</code>.
              </p>

              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 text-xs font-mono mb-4">
                <div>Engine: <strong className="text-emerald-400">{analytics?.dbStatus?.engine || 'MySQL Ready Dual Adapter'}</strong></div>
                <div>Host: <span className="text-amber-200">{analytics?.dbStatus?.config?.host || '127.0.0.1'}</span></div>
                <div>Database: <span className="text-amber-200">{analytics?.dbStatus?.config?.database || 'bakasur_food_tour'}</span></div>
                <div>User: <span className="text-amber-200">{analytics?.dbStatus?.config?.user || 'root'}</span></div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleTestMySQL}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Test MySQL Connection</span>
                </button>

                <button
                  onClick={handleReSeedData}
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>Re-seed Sample Data</span>
                </button>
              </div>
            </div>

            {/* Schema reference info */}
            <div className="rounded-2xl bg-black/40 border border-orange-500/20 p-5 text-xs text-stone-300">
              <h4 className="font-bold text-sm text-white mb-2">Database Schema File</h4>
              <p className="mb-2">
                Full SQL schema is located in <code className="text-amber-300 bg-stone-900 px-1.5 py-0.5 rounded">schema.sql</code> with all 7 tables (<code className="text-orange-400">restaurants</code>, <code className="text-orange-400">dishes</code>, <code className="text-orange-400">bakasur_videos</code>, <code className="text-orange-400">campaign_sessions</code>, <code className="text-orange-400">campaign_visits</code>, <code className="text-orange-400">participants</code>, <code className="text-orange-400">campaign_configs</code>).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
