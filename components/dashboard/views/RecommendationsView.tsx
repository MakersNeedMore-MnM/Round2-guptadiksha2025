"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, TrendingUp, CheckCircle, Info } from "lucide-react";

interface RecommendationsViewProps {
  selectedCrop?: string;
  onCropChange?: (crop: string) => void;
  onNavigateToRouteMesh?: () => void;
}

export default function RecommendationsView({
  selectedCrop = "Tomatoes",
  onCropChange,
  onNavigateToRouteMesh,
}: RecommendationsViewProps) {
  const [activeCrop, setActiveCrop] = useState(selectedCrop);
  const [quantityKg, setQuantityKg] = useState(5000);
  const [origin, setOrigin] = useState("Haveli, Pune");

  const crops = [
    { id: "Tomatoes", label: "Tomatoes", emoji: "🍅" },
    { id: "Onions", label: "Red Onions", emoji: "🧅" },
    { id: "Potatoes", label: "Potatoes", emoji: "🥔" },
    { id: "Soybeans", label: "Soybeans", emoji: "🌱" },
    { id: "Wheat", label: "Wheat", emoji: "🌾" },
    { id: "Cotton", label: "Cotton", emoji: "☁️" },
  ];

  const handleCropChange = (c: string) => {
    setActiveCrop(c);
    onCropChange?.(c);
  };

  // Dynamic recommendation calculations
  const mandiCandidates = [
    {
      id: "mumbai-vashi",
      name: "Mumbai Vashi APMC",
      badge: "Optimal Choice (#1 Net Realization)",
      distanceKm: 145,
      transitHours: 3.5,
      headlinePrice: activeCrop === "Tomatoes" ? 34.0 : activeCrop === "Onions" ? 28.0 : 48.0,
      freightPerKg: 3.2,
      apmcFeePerKg: 0.5,
      spoilageRiskPerKg: 0.4,
      netPerKg: activeCrop === "Tomatoes" ? 29.9 : activeCrop === "Onions" ? 23.9 : 43.9,
      isBest: true,
      deltaGain: "+ ₹14,500 vs Local",
    },
    {
      id: "pune-gultekdi",
      name: "Pune Gultekdi Mandi",
      badge: "Local Mandi (Nearest)",
      distanceKm: 18,
      transitHours: 0.8,
      headlinePrice: activeCrop === "Tomatoes" ? 29.0 : activeCrop === "Onions" ? 23.0 : 44.0,
      freightPerKg: 1.0,
      apmcFeePerKg: 0.45,
      spoilageRiskPerKg: 0.15,
      netPerKg: activeCrop === "Tomatoes" ? 27.4 : activeCrop === "Onions" ? 21.4 : 41.4,
      isBest: false,
      deltaGain: "Baseline Reference",
    },
    {
      id: "narayangaon-mandi",
      name: "Narayangaon Tomato Hub",
      badge: "Specialized Hub",
      distanceKm: 75,
      transitHours: 1.8,
      headlinePrice: activeCrop === "Tomatoes" ? 31.0 : activeCrop === "Onions" ? 24.5 : 45.0,
      freightPerKg: 2.1,
      apmcFeePerKg: 0.45,
      spoilageRiskPerKg: 0.25,
      netPerKg: activeCrop === "Tomatoes" ? 28.2 : activeCrop === "Onions" ? 21.7 : 42.2,
      isBest: false,
      deltaGain: "+ ₹4,000 vs Local",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#fbf9f5] space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2d8] pb-5 sm:pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-900 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-800" />
            <span>Optimization & Decision Intelligence</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
            Net Realization Recommendations
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Comparing headline mandi prices vs. real cash-in-hand after deducting freight, market fees, and perishability transit risk.
          </p>
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold text-xs border border-emerald-300">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Algorithmic Optimization</span>
        </div>
      </div>

      {/* Harvest Profile Controls */}
      <div className="bg-white rounded-2xl border border-[#e6e2d8] p-5 shadow-xs space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Harvest Crop</span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {crops.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCropChange(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  activeCrop === c.id
                    ? "bg-[#0b2b1d] text-amber-300 font-bold shadow-xs"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Harvest Quantity: <strong className="text-emerald-900">{quantityKg.toLocaleString()} kg ({(quantityKg / 100).toFixed(0)} Quintals)</strong>
            </label>
            <input
              type="range"
              min={1000}
              max={15000}
              step={500}
              value={quantityKg}
              onChange={(e) => setQuantityKg(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Harvest Origin Location
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Haveli, Pune"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#e6e2d8] bg-stone-50 text-stone-800 outline-none focus:border-emerald-800"
            />
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {mandiCandidates.map((cand) => {
          const totalTakehome = Math.round(quantityKg * cand.netPerKg);

          return (
            <div
              key={cand.id}
              className={`rounded-2xl p-6 transition-all flex flex-col justify-between space-y-5 relative ${
                cand.isBest
                  ? "bg-white border-2 border-emerald-700 shadow-lg ring-4 ring-emerald-600/10"
                  : "bg-white border border-[#e6e2d8] shadow-2xs"
              }`}
            >
              {cand.isBest && (
                <div className="absolute -top-3.5 left-6 px-3 py-1 bg-emerald-800 text-amber-300 font-bold text-[10px] uppercase tracking-wider rounded-full shadow-xs flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Top Recommendation</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {cand.name}
                  </h3>
                  <span className="text-xs text-stone-500 block mt-0.5">
                    {cand.distanceKm} km from {origin} • ~{cand.transitHours}h transit
                  </span>
                </div>

                {/* Net Take-Home Highlight */}
                <div className={`p-4 rounded-xl space-y-1 ${cand.isBest ? "bg-emerald-50 border border-emerald-200" : "bg-stone-50 border border-stone-200"}`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Estimated Net Cash Take-Home
                  </span>
                  <div className="font-serif text-3xl font-bold text-emerald-950">
                    ₹{totalTakehome.toLocaleString("en-IN")}
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-emerald-800">₹{cand.netPerKg.toFixed(2)} / kg net</span>
                    <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded text-[11px]">{cand.deltaGain}</span>
                  </div>
                </div>

                {/* Step-by-Step Economic Deductions */}
                <div className="space-y-2 pt-2 text-xs border-t border-stone-100">
                  <div className="flex justify-between text-stone-700">
                    <span>1. Gross Mandi Rate</span>
                    <strong className="text-stone-900 font-serif text-sm">₹{cand.headlinePrice.toFixed(2)}/kg</strong>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>2. Transport & Freight</span>
                    <span>- ₹{cand.freightPerKg.toFixed(2)}/kg</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>3. APMC Cess & Weighment</span>
                    <span>- ₹{cand.apmcFeePerKg.toFixed(2)}/kg</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>4. Spoilage & Weight Risk</span>
                    <span>- ₹{cand.spoilageRiskPerKg.toFixed(2)}/kg</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-stone-200 font-bold text-stone-900">
                    <span>Net Realization</span>
                    <span className="text-emerald-800 font-serif text-base">₹{cand.netPerKg.toFixed(2)}/kg</span>
                  </div>
                </div>
              </div>

              {cand.isBest ? (
                <button
                  onClick={onNavigateToRouteMesh}
                  className="w-full py-3 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <span>Book RouteMesh to this Mandi</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              ) : (
                <div className="text-center text-[11px] text-stone-400 py-1">
                  Local alternative option
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decision Insight Notice */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300/80 flex items-start space-x-3 text-xs text-amber-950">
        <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
        <div>
          <strong className="font-serif text-sm text-stone-950 block mb-0.5">Why Mumbai Vashi APMC is recommended:</strong>
          Even after accounting for the 145 km transport distance and toll charges, the higher wholesale buying demand in Mumbai (+₹5/kg over local rate) yields an extra ₹14,500 net profit on your 5,000 kg harvest batch when using RouteMesh shared transport.
        </div>
      </div>
    </div>
  );
}
