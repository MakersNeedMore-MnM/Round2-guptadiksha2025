"use client";

import React, { useState } from "react";
import { Settings, Bell, Globe, Database, LogOut, Check, RefreshCw } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SettingsViewProps {
  onLogout: () => void;
}

export default function SettingsView({ onLogout }: SettingsViewProps) {
  const { language, setLanguage } = useLanguage();

  const [priceAlerts, setPriceAlerts] = useState(true);
  const [morningSummary, setMorningSummary] = useState(true);
  const [routemeshAlerts, setRoutemeshAlerts] = useState(true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  const handleRefreshCache = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fbf9f5] space-y-8">
      {/* Header */}
      <div className="border-b border-[#e6e2d8] pb-6">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-900 mb-1">
          <Settings className="w-4 h-4 text-emerald-800" />
          <span>App Preferences & Configuration</span>
        </div>
        <h1 className="font-serif text-3xl font-normal text-stone-900 tracking-tight">
          Settings & Notifications
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure notifications, offline data synchronization, and language settings.
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

        {/* Notification Alerts */}
        <div className="bg-white rounded-2xl border border-[#e6e2d8] p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
            <Bell className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">Notification Alerts</h2>
              <p className="text-xs text-stone-500">Mandi rate surge alerts and RouteMesh co-loader notifications</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-stone-50 transition-colors">
              <div>
                <span className="font-semibold text-stone-800 block text-sm">Mandi Price Spike Alerts</span>
                <span className="text-stone-500">Get notified when prices rise by more than 10% in your target mandis</span>
              </div>
              <input
                type="checkbox"
                checked={priceAlerts}
                onChange={(e) => setPriceAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-800"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-stone-50 transition-colors">
              <div>
                <span className="font-semibold text-stone-800 block text-sm">Daily 7:00 AM Morning Market Brief</span>
                <span className="text-stone-500">Daily summary of wholesale arrivals and top price realization</span>
              </div>
              <input
                type="checkbox"
                checked={morningSummary}
                onChange={(e) => setMorningSummary(e.target.checked)}
                className="w-4 h-4 accent-emerald-800"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-stone-50 transition-colors">
              <div>
                <span className="font-semibold text-stone-800 block text-sm">RouteMesh Co-Loader Match</span>
                <span className="text-stone-500">Alerts when another farmer on your corridor has compatible freight</span>
              </div>
              <input
                type="checkbox"
                checked={routemeshAlerts}
                onChange={(e) => setRoutemeshAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-800"
              />
            </label>
          </div>
        </div>

        {/* Offline Cache & Data Feeds */}
        <div className="bg-white rounded-2xl border border-[#e6e2d8] p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
            <Database className="w-5 h-5 text-emerald-800" />
            <div>
              <h2 className="font-serif text-base font-bold text-stone-900">Offline Mandi Data Cache</h2>
              <p className="text-xs text-stone-500">Store mandi price feeds locally for offline field connectivity</p>
            </div>
          </div>

          <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl hover:bg-stone-50 transition-colors text-xs">
            <div>
              <span className="font-semibold text-stone-800 block text-sm">Enable Offline Background Sync</span>
              <span className="text-stone-500">Keep latest verified rates available even when cell connectivity drops</span>
            </div>
            <input
              type="checkbox"
              checked={offlineSync}
              onChange={(e) => setOfflineSync(e.target.checked)}
              className="w-4 h-4 accent-emerald-800"
            />
          </label>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-xs font-bold text-stone-800 block">Status: 45 Maharashtra Mandis Cached</span>
              <span className="text-[11px] text-stone-500">Last synchronized from AGMARKNET / data.gov.in: Today at 08:30 AM</span>
            </div>

            <button
              onClick={handleRefreshCache}
              disabled={isRefreshing}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Updating Feeds..." : "Refresh Feeds"}</span>
            </button>
          </div>

          {refreshSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-medium border border-emerald-300 flex items-center space-x-1.5">
              <Check className="w-4 h-4" />
              <span>Offline Mandi cache updated successfully with latest data.gov.in rates!</span>
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
