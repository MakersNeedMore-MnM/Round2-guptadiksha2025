"use client";

import React from "react";
import { X, MapPin, ShieldCheck } from "lucide-react";
import {
  MandiMarket,
  getMandiName,
  getMandiDistrict,
  getCropLabel,
} from "@/lib/mockMandiData";
import { useLanguage } from "@/context/LanguageContext";
import { distanceFromOrigin, type Origin } from "@/lib/geo";
import type { Language } from "@/lib/types";

interface MarketDetailDrawerProps {
  mandi: MandiMarket | null;
  selectedCrop: string;
  onClose: () => void;
  onViewRoute?: (mandi: MandiMarket) => void;
  isRecommended?: boolean;
  origin: Origin;   // ← the user's selected origin
}

export default function MarketDetailDrawer({
  mandi,
  selectedCrop,
  onClose,
  onViewRoute,
  isRecommended = false,
  origin,
}: MarketDetailDrawerProps) {
  const { t, language } = useLanguage();
  const lang: Language = language ?? "en";

  if (!mandi) return null;

  const priceObj = mandi.prices[selectedCrop] || {
    headlinePrice: 30,
    minPrice: 26,
    maxPrice: 34,
    arrivalsTonnes: 100,
    netEstimatedPrice: 25.5,
  };

  const mandiName = getMandiName(mandi, lang);
  const mandiDistrict = getMandiDistrict(mandi, lang);
  const cropLabel = getCropLabel(selectedCrop, lang);

  // Dynamic distance from user's selected origin
  const distKm = distanceFromOrigin(origin, mandi);

  // Localized origin name for the "from X" label
  const originName =
    lang === "hi" ? origin.nameHi : lang === "mr" ? origin.nameMr : origin.nameEn;

  // Localized congestion level
  const congestionLabel =
    mandi.congestionLevel === "High"
      ? t.drawerCongestionHigh
      : mandi.congestionLevel === "Medium"
        ? t.drawerCongestionMedium
        : t.drawerCongestionLow;

  return (
    <div className="absolute top-auto bottom-0 sm:bottom-auto sm:top-4 right-0 sm:right-4 z-30 w-full sm:w-96 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-md rounded-t-3xl sm:rounded-2xl border border-[#e6e2d8] shadow-2xl p-4 sm:p-5 text-stone-900 animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-3 duration-200">

      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-stone-100">
        <div>
          {isRecommended && (
            <span className="px-2 py-0.5 bg-[#0b2b1d] text-amber-300 text-[10px] font-bold uppercase rounded inline-block mb-1">
              {t.mockupOptimalChoice}
            </span>
          )}
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-950">{mandiName}</h3>
          <div className="text-xs text-stone-500 flex items-center space-x-1 mt-0.5">
            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
            <span className="truncate">
              {mandiDistrict} • {distKm} {t.drawerKm} ({originName})
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Crop Pricing Box */}
      <div className="py-3 sm:py-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-stone-600">
            {t.mockupCropSelection}: <strong>{cropLabel}</strong>
          </span>
          <span className="text-[11px] text-stone-400">{mandi.verifiedDate}</span>
        </div>

        <div className="p-3.5 bg-[#f7f4ee] rounded-xl border border-[#e6e2d8] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
              {t.mockupGrossMandiRate}
            </span>
            <span className="font-serif text-2xl font-bold text-stone-900">
              ₹{priceObj.headlinePrice.toFixed(2)}
            </span>
            <span className="text-xs text-stone-500 font-normal"> / kg</span>
          </div>

          <div className="text-right pl-3 border-l border-stone-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              {t.mockupNetRealizationLabel}
            </span>
            <span className="font-serif text-2xl font-bold text-emerald-900">
              ₹{priceObj.netEstimatedPrice.toFixed(2)}
            </span>
            <span className="text-xs text-emerald-800 font-medium"> {t.mockupNetPerKg}</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100">
            <span className="text-stone-400 text-[10px] block">{t.drawerArrivalVolume}</span>
            <span className="font-semibold text-stone-800">
              {priceObj.arrivalsTonnes} T
            </span>
          </div>
          <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-100">
            <span className="text-stone-400 text-[10px] block">{t.drawerCongestion}</span>
            <span
              className={`font-bold ${mandi.congestionLevel === "High" ? "text-red-600" : "text-emerald-800"
                }`}
            >
              {congestionLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Note with Functional View Route Button */}
      <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <span className="truncate">{t.heroVerified}</span>
        </span>
        <button
          onClick={() => onViewRoute?.(mandi)}
          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#0b2b1d] hover:bg-[#143e2c] text-amber-300 font-bold shadow-xs transition-colors shrink-0"
        >
          <span>{t.drawerViewRoute}</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
}