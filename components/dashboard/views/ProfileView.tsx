"use client";

import React, { useState } from "react";
import { User, Check, Save, Award } from "lucide-react";
import { UserProfile } from "@/components/AuthModal";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";

interface ProfileViewProps {
  userProfile: UserProfile | null;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export default function ProfileView({ userProfile, onUpdateProfile }: ProfileViewProps) {
  const { language, setLanguage } = useLanguage();

  const [name, setName] = useState(userProfile?.name || "Ramesh Patil");
  const [username, setUsername] = useState(userProfile?.username || "ramesh_patil");
  const [location, setLocation] = useState(userProfile?.location || "Haveli, Pune");
  const [farmAcres, setFarmAcres] = useState("5.5");
  const [irrigation, setIrrigation] = useState("Drip Irrigation");
  const [soilType, setSoilType] = useState("Medium Black (Regur)");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    userProfile?.crops || ["Tomatoes", "Onions"]
  );
  const [prefLang, setPrefLang] = useState<Language>(userProfile?.language || language || "en");
  const [isSaved, setIsSaved] = useState(false);

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      username,
      name,
      location,
      crops: selectedCrops,
      language: prefLang,
    };

    localStorage.setItem("farmoptima_user", JSON.stringify(updated));
    setLanguage(prefLang);
    onUpdateProfile?.(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const cropsList = [
    { id: "Tomatoes", label: "Tomatoes", icon: "🍅" },
    { id: "Onions", label: "Red Onions", icon: "🧅" },
    { id: "Potatoes", label: "Potatoes", icon: "🥔" },
    { id: "Soybeans", label: "Soybeans", icon: "🌱" },
    { id: "Wheat", label: "Wheat", icon: "🌾" },
    { id: "Cotton", label: "Cotton", icon: "☁️" },
    { id: "Mango", label: "Mango", icon: "🥭" },
    { id: "Grapes", label: "Grapes", icon: "🍇" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fbf9f5] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2d8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-900 mb-1">
            <User className="w-4 h-4 text-emerald-800" />
            <span>Account & Farm Management</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-stone-900 tracking-tight">
            Farmer Profile
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your agricultural profile, farm location origin, and crop portfolio.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Profile Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* Personal & Farm Identity */}
        <div className="bg-white rounded-2xl border border-[#e6e2d8] p-6 shadow-xs space-y-5">
          <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
            <div className="w-12 h-12 rounded-full bg-[#0b2b1d] text-amber-300 font-serif text-xl flex items-center justify-center font-bold">
              {name.charAt(0)}
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">{name}</h2>
              <div className="text-xs text-stone-500 flex items-center space-x-2">
                <span>@{username}</span>
                <span>•</span>
                <span className="text-emerald-800 font-semibold flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Verified AGMARKNET Farmer</span>
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e2d8] text-xs text-stone-800 outline-none focus:border-emerald-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e2d8] text-xs text-stone-800 outline-none focus:border-emerald-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Farm Location / Village, District</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                placeholder="e.g. Haveli, Pune"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e2d8] text-xs text-stone-800 outline-none focus:border-emerald-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Cultivated Land Area</label>
              <div className="flex items-center rounded-xl border border-[#e6e2d8] overflow-hidden">
                <input
                  type="text"
                  value={farmAcres}
                  onChange={(e) => setFarmAcres(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs text-stone-800 outline-none"
                />
                <span className="px-3 py-2.5 bg-stone-100 text-stone-600 text-xs font-medium border-l border-[#e6e2d8]">
                  Acres
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Agricultural Specifications */}
        <div className="bg-white rounded-2xl border border-[#e6e2d8] p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg font-bold text-stone-900 pb-2 border-b border-stone-100">
            Agricultural Attributes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Irrigation System</label>
              <select
                value={irrigation}
                onChange={(e) => setIrrigation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-xs text-stone-800 outline-none"
              >
                <option value="Drip Irrigation">Drip Irrigation (Micro-irrigation)</option>
                <option value="Sprinkler System">Sprinkler System</option>
                <option value="Canal / Flood">Canal / Flood Basin</option>
                <option value="Rainfed / Kharif Only">Rainfed / Seasonal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Soil Characteristic</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-xs text-stone-800 outline-none"
              >
                <option value="Medium Black (Regur)">Medium Black Soil (Regur)</option>
                <option value="Deep Black Soil">Deep Black Soil (High Moisture Retention)</option>
                <option value="Red Sandy Loam">Red Sandy Loam</option>
                <option value="Alluvial">Alluvial Floodplain Soil</option>
              </select>
            </div>
          </div>

          {/* Crops Multi-Select */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-stone-700 block">
              Primary Crops Grown in Your Rotation
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {cropsList.map((crop) => {
                const isSelected = selectedCrops.includes(crop.id);
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => toggleCrop(crop.id)}
                    className={`p-3 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-800 text-emerald-950 font-bold"
                        : "bg-white border-[#e6e2d8] text-stone-700 hover:bg-stone-50"
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{crop.icon}</span>
                      <span>{crop.label}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-emerald-800" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Language */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-stone-700 block">
              Preferred Language for Mandi Alerts & AI Responses
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPrefLang("en")}
                className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                  prefLang === "en" ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold" : "bg-white border-[#e6e2d8] text-stone-700"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPrefLang("hi")}
                className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                  prefLang === "hi" ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold" : "bg-white border-[#e6e2d8] text-stone-700"
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => setPrefLang("mr")}
                className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${
                  prefLang === "mr" ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold" : "bg-white border-[#e6e2d8] text-stone-700"
                }`}
              >
                मराठी (Marathi)
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-8 py-3.5 rounded-full bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </form>
    </div>
  );
}
