"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Sprout, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getCropLabel } from "@/lib/mockMandiData";
import { PRESET_ORIGINS } from "@/lib/geo";
import type { Language } from "@/lib/types";

interface HarvestSearchFormProps {
  selectedCrop: string;
  onCropChange: (crop: string) => void;
  onSearch: (harvest: {
    crop: string;
    quantity: number;
    location: string;
    ageDays?: number;
    originId?: string;
  }) => void;
}

export default function HarvestSearchForm({
  selectedCrop,
  onCropChange,
  onSearch,
}: HarvestSearchFormProps) {
  const { t, language } = useLanguage();
  const lang: Language = language ?? "en";

  const [quantity, setQuantity] = useState("5000");
  const [ageDays, setAgeDays] = useState("2");
  const [originId, setOriginId] = useState<string>("pune"); // will be overwritten below
  const [location, setLocation] = useState("Pune");

  // On mount, read the user's saved profile from localStorage
  // and set origin + location from what they entered in login/onboarding.
  useEffect(() => {
    const saved = localStorage.getItem("farmoptima_user");
    if (!saved) return;

    try {
      const profile = JSON.parse(saved) as {
        name?: string;
        location?: string;
      };

      const rawLocation = (profile.location ?? "").trim();
      if (!rawLocation) return;

      // Match against PRESET_ORIGINS by checking if any preset name appears
      // in the user's saved location string (e.g. "Haveli, Pune" → pune).
      const matched = PRESET_ORIGINS.find((o) => {
        const needle = o.nameEn.toLowerCase();
        return rawLocation.toLowerCase().includes(needle);
      });

      if (matched) {
        setOriginId(matched.id);
        setLocation(matched.nameEn);
      } else {
        // Fallback: keep whatever they typed, use Pune coords for distance math
        setLocation(rawLocation);
        setOriginId("pune");
      }
    } catch (e) {
      console.error("Failed to read user profile for origin default", e);
    }
  }, []);

  const CROP_OPTIONS: { id: string; emoji: string }[] = [
    { id: "Tomatoes", emoji: "🍅" },
    { id: "Onions", emoji: "🧅" },
    { id: "Potatoes", emoji: "🥔" },
    { id: "Soybeans", emoji: "🌱" },
    { id: "Wheat", emoji: "🌾" },
    { id: "Cotton", emoji: "☁️" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = PRESET_ORIGINS.find((o) => o.id === originId);
    onSearch({
      crop: selectedCrop,
      quantity: parseFloat(quantity) || 5000,
      location: origin ? origin.nameEn : location,
      ageDays: parseInt(ageDays, 10) || 0,
      originId,
    });
  };

  return (
    <div className="bg-[#fbf9f5] border border-[#e6e2d8] rounded-2xl p-5 shadow-lg space-y-3 text-stone-900">
      <div className="flex items-center space-x-2">
        <Sprout className="w-4 h-4 text-emerald-800" />
        <h3 className="font-serif text-lg font-normal text-stone-950">
          {t.harvestPrompt}
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
      >
        {/* Crop Selector */}
        <div className="sm:col-span-3">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            {t.harvestCropLabel}
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => onCropChange(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-xs font-semibold text-stone-800 outline-none focus:border-emerald-800"
          >
            {CROP_OPTIONS.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.emoji} {getCropLabel(crop.id, lang)}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity (kg) */}
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            {t.harvestQuantityLabel}
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="5000"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-xs font-medium text-stone-900 outline-none focus:border-emerald-800"
          />
        </div>

        {/* Crop Age (days) */}
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            {t.harvestAgeLabel}
          </label>
          <div className="relative">
            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            <input
              type="number"
              min="0"
              value={ageDays}
              onChange={(e) => setAgeDays(e.target.value)}
              placeholder="2"
              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-xs font-medium text-stone-900 outline-none focus:border-emerald-800"
            />
          </div>
        </div>

        {/* Origin (from user profile by default) */}
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">
            {t.harvestOriginLabel}
          </label>
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-xs font-semibold text-stone-800 outline-none focus:border-emerald-800"
          >
            {PRESET_ORIGINS.map((o) => (
              <option key={o.id} value={o.id}>
                {lang === "hi" ? o.nameHi : lang === "mr" ? o.nameMr : o.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <div className="sm:col-span-3 sm:pt-4">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-medium uppercase tracking-wider shadow-sm transition-all flex items-center justify-center space-x-1.5"
          >
            <span>{t.harvestFindBest}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </form>
    </div>
  );
}