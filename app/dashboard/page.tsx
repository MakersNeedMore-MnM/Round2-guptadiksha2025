"use client";

import { recommendBestMandi, type RecommendationResult } from "@/lib/recommendation";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/dashboard/Sidebar";
import HarvestSearchForm from "@/components/dashboard/HarvestSearchForm";
import MarketDetailDrawer from "@/components/dashboard/MarketDetailDrawer";
import RouteModal from "@/components/dashboard/RouteModal";
import { MOCK_MANDIS, MandiMarket, getCropLabel } from "@/lib/mockMandiData";
import AuthModal, { UserProfile } from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";
import { User, Menu, Lock, ArrowLeft } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { PRESET_ORIGINS } from "@/lib/geo";
import type { Language } from "@/lib/types";
import { fetchMandiDataAction } from "@/app/actions/mandi";
import { EXPORT_MANDIS, isFruitCrop } from "@/lib/exportMandiData";
import MandiLeaderboard from "@/components/dashboard/MandiLeaderboard";

// Dedicated Views for Sidebar Navigation
import MyHarvestView from "@/components/dashboard/views/MyHarvestView";
import MarketsView from "@/components/dashboard/views/MarketsView";
import RouteMeshView from "@/components/dashboard/views/RouteMeshView";
import RecommendationsView from "@/components/dashboard/views/RecommendationsView";
import ChatbotSection from "@/components/dashboard/ChatbotSection";
import ProfileView from "@/components/dashboard/views/ProfileView";
import SettingsView from "@/components/dashboard/views/SettingsView";

const EXPORT_CROPS = new Set([
  "Mango", "Grapes", "Pomegranate", "Banana", "Orange", "Chikoo", "Apple",
]);

const InteractiveMap = dynamic(() => import("@/components/dashboard/InteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] sm:min-h-[500px] rounded-2xl bg-stone-100 animate-pulse flex items-center justify-center text-xs text-stone-500 font-medium">
      Loading Maharashtra Interactive Mandi Map...
    </div>
  ),
});

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const lang: Language = language ?? "en";

  // Auth Guard State: null = checking localStorage, false = not logged in, true = logged in
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Route Intelligence State
  const [activeRouteMandi, setActiveRouteMandi] = useState<MandiMarket | null>(null);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);

  const [mandis, setMandis] = useState<MandiMarket[]>(MOCK_MANDIS);
  const [dataSource, setDataSource] = useState<"api" | "fallback" | "curated">("fallback");

  const [selectedCrop, setSelectedCrop] = useState("Tomatoes");
  const [selectedMandi, setSelectedMandi] = useState<MandiMarket | null>(null);
  const [recommendedMandiId, setRecommendedMandiId] = useState<string | undefined>("mumbai-vashi");

  const [originId, setOriginId] = useState<string>("pune");
  const origin =
    PRESET_ORIGINS.find((o) => o.id === originId) ?? PRESET_ORIGINS[0];

  // Auth Check on Mount: only allow logged-in users to view dashboard
  useEffect(() => {
    const saved = localStorage.getItem("farmoptima_user");
    if (!saved) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const profile = JSON.parse(saved) as UserProfile;
      if (profile && (profile.name || profile.username)) {
        setUserProfile(profile);
        setIsAuthenticated(true);
        const raw = (profile.location ?? "").toLowerCase();
        const matched = PRESET_ORIGINS.find((o) =>
          raw.includes(o.nameEn.toLowerCase())
        );
        if (matched) setOriginId(matched.id);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error("Failed to parse user profile", e);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
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
  }, [selectedCrop, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("farmoptima_user");
    setUserProfile(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const handleSelectMandi = useCallback((mandi: MandiMarket) => {
    setSelectedMandi(mandi);
  }, []);

  const handleViewRoute = useCallback((mandi: MandiMarket) => {
    setActiveRouteMandi(mandi);
    setIsRouteModalOpen(true);
  }, []);

  const handleClearRoute = useCallback(() => {
    setActiveRouteMandi(null);
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
        if (bestMandi) {
          setSelectedMandi(bestMandi);
          // Set initial route to recommended best mandi
          setActiveRouteMandi(bestMandi);
        }
      } else {
        setRecommendedMandiId(undefined);
        setSelectedMandi(null);
        setActiveRouteMandi(null);
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

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return t.headerCanvasTitle ?? "Mandi Map Canvas";
      case "harvest":
        return "Farm Harvest Batches";
      case "markets":
        return "Mandi Directory & Live Rates";
      case "routemesh":
        return "RouteMesh™ Logistics Hub";
      case "recommendations":
        return "Net Realization Engine";
      case "chatbot":
        return "FarmOptima AI Agri-Agent";
      case "profile":
        return "Farmer Profile";
      case "settings":
        return "Settings & Preferences";
      default:
        return "FarmOptima";
    }
  };

  // 1. Loading State while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#fbf9f5] font-sans text-xs text-stone-500">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-800 border-t-transparent animate-spin" />
          <span className="font-medium text-stone-700">Verifying FarmOptima farmer session...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gatekeeper: require login before opening dashboard
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#fbf9f5] p-4 text-center font-sans relative">
        <div className="max-w-md space-y-4 z-10">
          <div className="inline-flex p-3 rounded-2xl bg-amber-100 text-amber-900 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Sign In Required
          </h1>
          <p className="text-xs text-stone-600 leading-relaxed">
            Please sign in with your farmer account to access the live Maharashtra Mandi Intelligence Canvas and RouteMesh™ freight network.
          </p>
          <div className="pt-2">
            <button
              onClick={() => { window.location.href = "/"; }}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-700 hover:text-stone-950 px-4 py-2 rounded-full border border-stone-300 hover:bg-stone-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Auth Modal Gatekeeper */}
        <AuthModal
          isOpen={true}
          onClose={() => {
            window.location.href = "/";
          }}
          onLoginSuccess={(profile) => {
            setUserProfile(profile);
            setIsAuthenticated(true);
            const raw = (profile.location ?? "").toLowerCase();
            const matched = PRESET_ORIGINS.find((o) =>
              raw.includes(o.nameEn.toLowerCase())
            );
            if (matched) setOriginId(matched.id);
          }}
        />
      </div>
    );
  }

  // 3. Authenticated Dashboard View
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbf9f5] font-sans">

      {/* Responsive Sidebar (Desktop Docked + Mobile Sliding Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        userName={userProfile?.name}
        userLocation={userProfile?.location}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">

        {/* Dynamic Top Header */}
        <header className="h-16 px-4 sm:px-6 bg-[#fbf9f5] border-b border-[#e6e2d8] flex items-center justify-between gap-3 sm:gap-6 z-20 shrink-0">

          {/* LEFT: Mobile Menu Button + Dynamic View Title */}
          <div className="shrink-0 flex items-center space-x-2.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-1.5 rounded-xl text-stone-700 hover:text-stone-950 hover:bg-stone-200/60 transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-widest text-amber-900 whitespace-nowrap">
              {getHeaderTitle()}
            </span>
          </div>

          {/* CENTER: Crop pills (shown on Dashboard, Markets, Recommendations) */}
          {activeTab === "dashboard" ? (
            <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar px-1 sm:px-2 touch-pan-x">
              {crops.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                    selectedCrop === c.id
                      ? "bg-amber-400 text-stone-950 font-bold shadow-sm ring-1 ring-amber-500"
                      : "bg-white text-stone-700 hover:bg-amber-50 border border-[#e6e2d8] hover:border-amber-300"
                  }`}
                >
                  {c.emoji} {getCropLabel(c.id, lang)}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 min-w-0 flex items-center px-2">
              <span className="text-[11px] text-stone-400 hidden lg:inline truncate">
                Decision Support Platform • Agricultural Intelligence & Logistics
              </span>
            </div>
          )}

          {/* RIGHT: Live badge + Language + User */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Live / India-wide / Offline badge */}
            <span
              className={`hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full border ${
                dataSource === "api"
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
                className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
                  dataSource === "api"
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
              <div className="hidden sm:flex px-3 py-1.5 bg-stone-100 rounded-full border border-stone-200 text-xs font-semibold text-stone-800 items-center gap-2 max-w-[130px] sm:max-w-[160px]">
                <User className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span className="truncate">{userProfile.name}</span>
              </div>
            )}
          </div>

        </header>

        {/* Dynamic View Body based on activeTab */}
        <div className="flex-1 relative overflow-hidden flex flex-col">

          {/* TAB 1: DASHBOARD (Mandi Map Canvas) */}
          {activeTab === "dashboard" && (
            <div className="flex-1 relative p-2 sm:p-4 bg-[#f7f4ee] h-full overflow-hidden flex flex-col">
              
              {/* Main Leaflet Map with Route & Co-Loader Waypoint Dots */}
              <InteractiveMap
                mandis={mandis}
                selectedCrop={selectedCrop}
                selectedMandi={selectedMandi}
                onSelectMandi={handleSelectMandi}
                recommendedMandiId={recommendedMandiId}
                origin={origin}
                activeRouteMandi={activeRouteMandi}
                onClearRoute={handleClearRoute}
                onOpenRouteDetails={handleViewRoute}
              />

              {/* Mandi Leaderboard (Top-Left overlay) */}
              <MandiLeaderboard
                recommendation={recommendation}
                onSelectMandiId={(id) => {
                  const m = mandis.find((x) => x.id === id);
                  if (m) {
                    setSelectedMandi(m);
                  }
                }}
              />

              {/* Market Detail Drawer (Bottom sheet on Mobile, Top-Right on Laptop) */}
              <MarketDetailDrawer
                mandi={selectedMandi}
                selectedCrop={selectedCrop}
                onClose={() => setSelectedMandi(null)}
                onViewRoute={handleViewRoute}
                isRecommended={selectedMandi?.id === recommendedMandiId}
                origin={origin}
              />

              {/* Bottom Harvest Search Form */}
              <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 z-20 max-w-4xl mx-auto pointer-events-auto">
                <HarvestSearchForm
                  selectedCrop={selectedCrop}
                  onCropChange={(crop) => setSelectedCrop(crop)}
                  onSearch={handleHarvestSearch}
                />
              </div>
            </div>
          )}

          {/* TAB 2: MY HARVEST */}
          {activeTab === "harvest" && (
            <MyHarvestView
              onSelectCropForMandi={(crop) => {
                setSelectedCrop(crop);
                setActiveTab("dashboard");
              }}
            />
          )}

          {/* TAB 3: MARKETS */}
          {activeTab === "markets" && (
            <MarketsView
              selectedCrop={selectedCrop}
              onCropChange={setSelectedCrop}
              onSelectMandiOnMap={(mandi) => {
                setSelectedMandi(mandi);
                setActiveTab("dashboard");
              }}
            />
          )}

          {/* TAB 4: ROUTEMESH LOGISTICS */}
          {activeTab === "routemesh" && (
            <RouteMeshView />
          )}

          {/* TAB 5: RECOMMENDATIONS */}
          {activeTab === "recommendations" && (
            <RecommendationsView
              selectedCrop={selectedCrop}
              onCropChange={setSelectedCrop}
              onNavigateToRouteMesh={() => setActiveTab("routemesh")}
            />
          )}

          {/* TAB 6: AI ASSISTANT / AGENT Q&A */}
          {activeTab === "chatbot" && (
            <ChatbotSection />
          )}

          {/* TAB 7: PROFILE */}
          {activeTab === "profile" && (
            <ProfileView
              userProfile={userProfile}
              onUpdateProfile={(updated) => setUserProfile(updated)}
            />
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === "settings" && (
            <SettingsView onLogout={handleLogout} />
          )}

        </div>

        {/* Turn-by-Turn Route Navigation & Multi-Farmer Split Modal */}
        <RouteModal
          mandi={activeRouteMandi}
          origin={origin}
          selectedCrop={selectedCrop}
          isOpen={isRouteModalOpen}
          onClose={() => setIsRouteModalOpen(false)}
          onNavigateToRouteMesh={() => {
            setIsRouteModalOpen(false);
            setActiveTab("routemesh");
          }}
        />

      </main>
    </div>
  );
}