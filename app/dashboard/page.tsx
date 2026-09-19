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
import { User } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { PRESET_ORIGINS } from "@/lib/geo";
import type { Language } from "@/lib/types";
import { fetchMandiDataAction } from "@/app/actions/mandi";
import { EXPORT_MANDIS, isFruitCrop } from "@/lib/exportMandiData";
import MandiLeaderboard from "@/components/dashboard/MandiLeaderboard";

const EXPORT_CROPS = new Set([
  "Mango", "Grapes", "Pomegranate", "Banana", "Orange", "Chikoo", "Apple",
]);

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

  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [mandis, setMandis] = useState<MandiMarket[]>(MOCK_MANDIS);
  const [dataSource, setDataSource] = useState<"api" | "fallback" | "curated">("fallback");

  const [selectedCrop, setSelectedCrop] = useState("Tomatoes");
  const [selectedMandi, setSelectedMandi] = useState<MandiMarket | null>(null);
  const [recommendedMandiId, setRecommendedMandiId] = useState<string | undefined>("mumbai-vashi");

  const [originId, setOriginId] = useState<string>("pune");
  const origin =
    PRESET_ORIGINS.find((o) => o.id === originId) ?? PRESET_ORIGINS[0];

  useEffect(() => {
    const saved = localStorage.getItem("farmoptima_user");
    if (!saved) return;
    try {
      const profile = JSON.parse(saved) as UserProfile;
      setUserProfile(profile);
      const raw = (profile.location ?? "").toLowerCase();
      const matched = PRESET_ORIGINS.find((o) =>
        raw.includes(o.nameEn.toLowerCase())
      );
      if (matched) setOriginId(matched.id);
    } catch (e) {
      console.error("Failed to parse user profile", e);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (isFruitCrop(selectedCrop)) {
      setMandis(EXPORT_MANDIS);
      setDataSource("curated");
      return;
    }

    fetchMandiDataAction(selectedCrop)
      .then((result) => {
        if (cancelled) return;
        setMandis(result.mandis);
        setDataSource(result.source);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Mandi fetch failed:", err);
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

      const windowHours = EXPORT_CROPS.has(harvest.crop) ? 48 : 12;
      const sourceMandis = isFruitCrop(harvest.crop) ? EXPORT_MANDIS : mandis;

      const result = recommendBestMandi(
        {
          origin: activeOrigin,
          crop: harvest.crop,
          quantityKg: harvest.quantity,
          sellingWindowHours: windowHours,
          ageDays: harvest.ageDays,
        },
        sourceMandis
      );

      setRecommendation(result);

      if (result.best) {
        setRecommendedMandiId(result.best.mandiId);
        const bestMandi = sourceMandis.find((m) => m.id === result.best!.mandiId);
        if (bestMandi) setSelectedMandi(bestMandi);
      } else {
        setRecommendedMandiId(undefined);
        setSelectedMandi(null);
      }
    },
    [originId, mandis]
  );

  const crops = [
    { id: "Tomatoes", emoji: "🍅" },
    { id: "Onions", emoji: "🧅" },
    { id: "Potatoes", emoji: "🥔" },
    { id: "Soybeans", emoji: "🌱" },
    { id: "Wheat", emoji: "🌾" },
    { id: "Cotton", emoji: "☁️" },
    { id: "Mango", emoji: "🥭" },
    { id: "Grapes", emoji: "🍇" },
    { id: "Pomegranate", emoji: "🍎" },
    { id: "Banana", emoji: "🍌" },
    { id: "Orange", emoji: "🍊" },
    { id: "Chikoo", emoji: "🟤" },
    { id: "Apple", emoji: "🍏" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf9f5] font-sans">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userName={userProfile?.name}
        userLocation={userProfile?.location}
      />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">

        <header className="h-16 px-6 bg-[#fbf9f5] border-b border-[#e6e2d8] flex items-center gap-6 z-20">

          {/* LEFT: Title */}
          <div className="shrink-0">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-900 whitespace-nowrap">
              {t.headerCanvasTitle ?? "Mandi Map Canvas"}
            </span>
          </div>

          {/* CENTER: Crop pills */}
          <div className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto no-scrollbar px-2">
            {crops.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCrop(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${selectedCrop === c.id
                  ? "bg-amber-400 text-stone-950 font-bold shadow-sm ring-1 ring-amber-500"
                  : "bg-white text-stone-700 hover:bg-amber-50 border border-[#e6e2d8] hover:border-amber-300"
                  }`}
              >
                {c.emoji} {getCropLabel(c.id, lang)}
              </button>
            ))}
          </div>

          {/* RIGHT: Live badge + Language + User */}
          <div className="flex items-center gap-3 shrink-0">

            {/* Live / India-wide / Offline badge */}
            <span
              className={`hidden md:inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${dataSource === "api"
                ? "bg-amber-50 text-amber-800 border-amber-300"
                : dataSource === "curated"
                  ? "bg-purple-50 text-purple-800 border-purple-300"
                  : "bg-stone-100 text-stone-700 border-stone-300"
                }`}
              title={
                dataSource === "api"
                  ? "Live data from data.gov.in"
                  : dataSource === "curated"
                    ? "Curated India-wide fruit mandis"
                    : "Using local fallback data"
              }
            >
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${dataSource === "api"
                  ? "bg-amber-600"
                  : dataSource === "curated"
                    ? "bg-purple-600"
                    : "bg-stone-500"
                  }`}
              />
              {dataSource === "api"
                ? "LIVE"
                : dataSource === "curated"
                  ? "INDIA-WIDE"
                  : "OFFLINE"}
            </span>

            <LanguageSelector />

            {userProfile && (
              <div className="px-3 py-1.5 bg-stone-100 rounded-full border border-stone-200 text-xs font-semibold text-stone-800 flex items-center gap-2 max-w-[140px]">
                <User className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span className="truncate">{userProfile.name}</span>
              </div>
            )}
          </div>

        </header>

        <div className="flex-1 relative p-4 bg-[#f7f4ee]">

          <InteractiveMap
            mandis={mandis}
            selectedCrop={selectedCrop}
            selectedMandi={selectedMandi}
            onSelectMandi={handleSelectMandi}
            recommendedMandiId={recommendedMandiId}
            origin={origin}
          />

          <MandiLeaderboard
            recommendation={recommendation}
            onSelectMandiId={(id) => {
              const m = mandis.find((x) => x.id === id);
              if (m) setSelectedMandi(m);
            }}
          />

          <MarketDetailDrawer
            mandi={selectedMandi}
            selectedCrop={selectedCrop}
            onClose={() => setSelectedMandi(null)}
            isRecommended={selectedMandi?.id === recommendedMandiId}
            origin={origin}
          />

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