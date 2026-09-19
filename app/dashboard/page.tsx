"use client";

import { recommendBestMandi, type RecommendationResult } from "@/lib/recommendation";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/dashboard/Sidebar";
import HarvestSearchForm from "@/components/dashboard/HarvestSearchForm";
import MarketDetailDrawer from "@/components/dashboard/MarketDetailDrawer";
import { MOCK_MANDIS, MandiMarket, getCropLabel } from "@/lib/mockMandiData";
import { UserProfile } from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, User, LogOut } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { PRESET_ORIGINS } from "@/lib/geo";
import type { Language } from "@/lib/types";
import { fetchMandiDataAction } from "@/app/actions/mandi";

// Dynamically import Leaflet InteractiveMap with SSR disabled to prevent window object errors
const InteractiveMap = dynamic(() => import("@/components/dashboard/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] rounded-2xl bg-stone-100 animate-pulse flex items-center justify-center text-xs text-stone-500 font-medium">
      Loading Maharashtra Interactive Mandi Map...
    </div>
  ),
});

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const lang: Language = language ?? "en";

  // Full recommendation result (top 3 + breakdown)
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 🆕 Mandi data from API (falls back to MOCK_MANDIS on failure)
  const [mandis, setMandis] = useState<MandiMarket[]>(MOCK_MANDIS);
  const [dataSource, setDataSource] = useState<"api" | "fallback">("fallback");

  // Map state
  const [selectedCrop, setSelectedCrop] = useState("Tomatoes");
  const [selectedMandi, setSelectedMandi] = useState<MandiMarket | null>(null);
  const [recommendedMandiId, setRecommendedMandiId] = useState<string | undefined>("mumbai-vashi");

  // Origin state — defaults to Pune, gets overridden from user profile
  const [originId, setOriginId] = useState<string>("pune");
  const origin =
    PRESET_ORIGINS.find((o) => o.id === originId) ?? PRESET_ORIGINS[0];

  // Load user profile from localStorage AND match origin from user's location
  useEffect(() => {
    const saved = localStorage.getItem("farmoptima_user");
    if (!saved) return;

    try {
      const profile = JSON.parse(saved) as UserProfile;
      setUserProfile(profile);

      // Match user's location to a preset origin
      const raw = (profile.location ?? "").toLowerCase();
      const matched = PRESET_ORIGINS.find((o) =>
        raw.includes(o.nameEn.toLowerCase())
      );
      if (matched) setOriginId(matched.id);
    } catch (e) {
      console.error("Failed to parse user profile", e);
    }
  }, []);

  // 🆕 Fetch real mandi data whenever crop changes (with fallback)
  useEffect(() => {
    let cancelled = false;

    fetchMandiDataAction(selectedCrop)
      .then((result) => {
        if (cancelled) return;
        setMandis(result.mandis);
        setDataSource(result.source);
        console.log("Mandi source:", result.source, result.reason ?? "");
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Mandi fetch failed, keeping fallback:", err);
        setMandis(MOCK_MANDIS);
        setDataSource("fallback");
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCrop]);

  const handleLogout = () => {
    localStorage.removeItem("farmoptima_user");
    window.location.href = "/";
  };

  // Stable callback so InteractiveMap doesn't re-render on every dashboard render
  const handleSelectMandi = useCallback((mandi: MandiMarket) => {
    setSelectedMandi(mandi);
  }, []);

  const handleHarvestSearch = useCallback(
    (harvest: {
      crop: string;
      quantity: number;
      location: string;
      ageDays?: number;
      originId?: string;
    }) => {
      setSelectedCrop(harvest.crop);

      const activeOriginId = harvest.originId ?? originId;
      if (harvest.originId) setOriginId(harvest.originId);

      const activeOrigin =
        PRESET_ORIGINS.find((o) => o.id === activeOriginId) ?? PRESET_ORIGINS[0];

      // 🧠 Real recommendation engine — uses live `mandis` from API/fallback
      const result = recommendBestMandi(
        {
          origin: activeOrigin,
          crop: harvest.crop,
          quantityKg: harvest.quantity,
          sellingWindowHours: 12,
          ageDays: harvest.ageDays,
        },
        mandis
      );

      setRecommendation(result);

      if (result.best) {
        setRecommendedMandiId(result.best.mandiId);
        const bestMandi = mandis.find((m) => m.id === result.best!.mandiId);
        if (bestMandi) setSelectedMandi(bestMandi);
      } else {
        setRecommendedMandiId(undefined);
        setSelectedMandi(null);
      }
    },
    [originId, mandis]
  );

  // Crop pills — labels pull from translations, IDs stay English for data lookup
  const crops = [
    { id: "Tomatoes", emoji: "🍅" },
    { id: "Onions", emoji: "🧅" },
    { id: "Potatoes", emoji: "🥔" },
    { id: "Soybeans", emoji: "🌱" },
    { id: "Wheat", emoji: "🌾" },
    { id: "Cotton", emoji: "☁️" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf9f5] font-sans">

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userName={userProfile?.name}
        userLocation={userProfile?.location}
      />

      {/* Main Canvas / Map First View */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">

        {/* Top Header Bar */}
        <header className="h-16 px-6 bg-[#fbf9f5] border-b border-[#e6e2d8] flex items-center justify-between z-20">
          <div className="flex items-center space-x-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-900">
              {t.headerCanvasTitle ?? "Mandi Map Canvas"}
            </span>

            {/* Data source indicator (subtle) */}
            <span
              className={`hidden md:inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border ${dataSource === "api"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              title={
                dataSource === "api"
                  ? "Live data from data.gov.in"
                  : "Using local fallback data"
              }
            >
              {dataSource === "api" ? "● Live" : "● Offline"}
            </span>

            {/* Crop Selector Pills */}
            <div className="hidden sm:flex items-center space-x-1.5 overflow-x-auto">
              {crops.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedCrop === c.id
                    ? "bg-[#0b2b1d] text-amber-300 font-bold shadow-2xs"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-[#e6e2d8]"
                    }`}
                >
                  {c.emoji} {getCropLabel(c.id, lang)}
                </button>
              ))}
            </div>
          </div>

          {/* Right Header Actions & Language */}
          <div className="flex items-center space-x-3">
            <LanguageSelector />

            {userProfile && (
              <div className="px-3 py-1 bg-stone-100 rounded-full border border-stone-200 text-xs font-semibold text-stone-800 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-emerald-800" />
                <span>{userProfile.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Map Container View */}
        <div className="flex-1 relative p-4 bg-[#f7f4ee]">

          {/* Interactive Map Component — uses `mandis` from API/fallback */}
          <InteractiveMap
            mandis={mandis}
            selectedCrop={selectedCrop}
            selectedMandi={selectedMandi}
            onSelectMandi={handleSelectMandi}
            recommendedMandiId={recommendedMandiId}
            origin={origin}
          />

          {/* Clicked Market Detail Drawer (Overlay Top-Right) */}
          <MarketDetailDrawer
            mandi={selectedMandi}
            selectedCrop={selectedCrop}
            onClose={() => setSelectedMandi(null)}
            isRecommended={selectedMandi?.id === recommendedMandiId}
            origin={origin}
          />

          {/* Floating Harvest Action Panel ("What's your harvest?") (Bottom Overlay) */}
          <div className="absolute bottom-6 left-6 right-6 z-20 max-w-4xl mx-auto">
            <HarvestSearchForm
              selectedCrop={selectedCrop}
              onCropChange={(crop) => setSelectedCrop(crop)}
              onSearch={handleHarvestSearch}
            />
          </div>

        </div>

      </main>
    </div>
  );
}