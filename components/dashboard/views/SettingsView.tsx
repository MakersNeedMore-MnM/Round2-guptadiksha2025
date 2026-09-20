"use client";

import React, { useState, useEffect } from "react";
import { Settings, Globe, Trash2, LogOut, Check, Server, ShieldCheck, Activity, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SettingsViewProps {
  onLogout: () => void;
}

export default function SettingsView({ onLogout }: SettingsViewProps) {
  const { language, setLanguage } = useLanguage();

  const [userName, setUserName] = useState<string>("Farmer");
  const [userLocation, setUserLocation] = useState<string>("Maharashtra");
  const [clearedData, setClearedData] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("farmoptima_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setUserName(parsed.name);
        if (parsed.location) setUserLocation(parsed.location);
      }
    } catch {
      // Fallback defaults
    }
  }, []);

  const handleClearCache = () => {
    try {
      // Clear non-essential cached form inputs while keeping auth
      localStorage.removeItem("farmoptima_last_query");
      localStorage.removeItem("farmoptima_cached_routes");
      setClearedData(true);
      setTimeout(() => setClearedData(false), 3000);
    } catch {
      // Handle error gracefully
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#fbf9f5] space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="border-b border-[#e6e2d8] pb-5 sm:pb-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-900 mb-1">
          <Settings className="w-4 h-4 text-emerald-800" />
          <span>App Preferences & Configuration</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Manage system language, local application data, and connected services.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Language Selection Card */}
        <div className="bg-white rounded-2xl border border-[#e6e2d8] p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
            <Globe className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">Application Language</h2>
              <p className="text-xs text-stone-500">Select language for interface labels, reports, and AI Agent</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setLanguage("en")}
              className={`py-3 rounded-xl text-xs font-medium border transition-all ${
                language === "en"
                  ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold shadow-xs"
                  : "bg-white border-[#e6e2d8] text-stone-700 hover:bg-stone-50"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={`py-3 rounded-xl text-xs font-medium border transition-all ${
                language === "hi"
                  ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold shadow-xs"
                  : "bg-white border-[#e6e2d8] text-stone-700 hover:bg-stone-50"
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => setLanguage("mr")}
              className={`py-3 rounded-xl text-xs font-medium border transition-all ${
                language === "mr"
                  ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold shadow-xs"
                  : "bg-white border-[#e6e2d8] text-stone-700 hover:bg-stone-50"
              }`}
            >
              मराठी (Marathi)
            </button>
          </div>
        </div>

        {/* Active Connected Services & Data Feeds */}
        <div className="bg-white rounded-2xl border border-[#e6e2d8] p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
            <Server className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">Live Service Integrations</h2>
              <p className="text-xs text-stone-500">Connected real-time APIs powering price discovery & dispatch</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start space-x-3">
              <Activity className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-stone-800 block">AGMARKNET / data.gov.in</span>
                <span className="text-stone-500 text-[11px]">Direct live wholesale price feed across APMC mandis</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start space-x-3">
              <Activity className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-stone-800 block">RouteMesh Routing Engine</span>
                <span className="text-stone-500 text-[11px]">Real-time corridor distance, toll & freight cost calculator</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start space-x-3">
              <Activity className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-stone-800 block">AI Agronomist Engine</span>
                <span className="text-stone-500 text-[11px]">Multilingual intelligence via Groq & Gemini Multimodal</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start space-x-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-stone-800 block">Client-Side Data Privacy</span>
                <span className="text-stone-500 text-[11px]">Harvest data stored securely within your browser</span>
              </div>
            </div>
          </div>
        </div>

        {/* Local Storage & Session Data Management */}
        <div className="bg-white rounded-2xl border border-[#e6e2d8] p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
            <User className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">Active Profile & Storage</h2>
              <p className="text-xs text-stone-500">Current session profile and browser storage controls</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-xs font-bold text-stone-800 block">
                {userName} &bull; {userLocation}
              </span>
              <span className="text-[11px] text-stone-500">
                Language Preference: {language === "en" ? "English" : language === "hi" ? "हिंदी" : "मराठी"}
              </span>
            </div>

            <button
              onClick={handleClearCache}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold shadow-2xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 text-stone-600" />
              <span>Clear Search Cache</span>
            </button>
          </div>

          {clearedData && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-300 flex items-center space-x-1.5">
              <Check className="w-4 h-4" />
              <span>Cached temporary search records cleared successfully!</span>
            </div>
          )}
        </div>

        {/* Logout Session */}
        <div className="pt-2">
          <button
            onClick={onLogout}
            className="px-6 py-3 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-200 transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of FarmOptima Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
