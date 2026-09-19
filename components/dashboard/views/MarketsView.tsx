"use client";

import React, { useState, useMemo } from "react";
import { Store, Search, MapPin, ExternalLink } from "lucide-react";
import { MOCK_MANDIS, MandiMarket } from "@/lib/mockMandiData";

interface MarketsViewProps {
  onSelectMandiOnMap?: (mandi: MandiMarket) => void;
  selectedCrop?: string;
  onCropChange?: (crop: string) => void;
}

export default function MarketsView({
  onSelectMandiOnMap,
  selectedCrop = "Tomatoes",
  onCropChange,
}: MarketsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [sortBy, setSortBy] = useState<"price" | "distance" | "arrivals">("price");
  const [activeCrop, setActiveCrop] = useState(selectedCrop);

  const districts = [
    "All",
    "Pune",
    "Navi Mumbai",
    "Nashik",
    "Ahmednagar",
    "Satara",
    "Solapur",
    "Kolhapur",
    "Thane",
  ];

  const crops = [
    { id: "Tomatoes", label: "Tomatoes", emoji: "🍅" },
    { id: "Onions", label: "Onions", emoji: "🧅" },
    { id: "Potatoes", label: "Potatoes", emoji: "🥔" },
    { id: "Soybeans", label: "Soybeans", emoji: "🌱" },
    { id: "Wheat", label: "Wheat", emoji: "🌾" },
    { id: "Cotton", label: "Cotton", emoji: "☁️" },
  ];

  const handleCropSelect = (cropId: string) => {
    setActiveCrop(cropId);
    onCropChange?.(cropId);
  };

  const filteredMandis = useMemo(() => {
    return MOCK_MANDIS.filter((mandi) => {
      const matchesSearch =
        mandi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mandi.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict =
        selectedDistrict === "All" ||
        mandi.district.toLowerCase() === selectedDistrict.toLowerCase();
      return matchesSearch && matchesDistrict;
    }).sort((a, b) => {
      const priceA = a.prices[activeCrop]?.headlinePrice || 0;
      const priceB = b.prices[activeCrop]?.headlinePrice || 0;
      const arrivalsA = a.prices[activeCrop]?.arrivalsTonnes || 0;
      const arrivalsB = b.prices[activeCrop]?.arrivalsTonnes || 0;

      if (sortBy === "price") return priceB - priceA;
      if (sortBy === "distance") return a.distanceFromPuneKm - b.distanceFromPuneKm;
      if (sortBy === "arrivals") return arrivalsB - arrivalsA;
      return 0;
    });
  }, [searchQuery, selectedDistrict, sortBy, activeCrop]);

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fbf9f5] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2d8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-900 mb-1">
            <Store className="w-4 h-4 text-emerald-800" />
            <span>Mandi Intelligence Directory</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-stone-900 tracking-tight">
            Maharashtra APMC Mandis
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Live prices, daily arrival volumes, and market congestion metrics verified with AGMARKNET feeds.
          </p>
        </div>

        {/* Live Feed Status Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>AGMARKNET Feeds Active</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl border border-[#e6e2d8] p-5 shadow-xs space-y-4">
        {/* Crop Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Select Crop</span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {crops.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCropSelect(c.id)}
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

        {/* Search Bar + District Filter + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mandi or district..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e6e2d8] text-xs text-stone-800 outline-none focus:border-emerald-800"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-xs text-stone-800 outline-none focus:border-emerald-800"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All Maharashtra Districts" : `District: ${d}`}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "price" | "distance" | "arrivals")}
              className="w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-xs text-stone-800 outline-none focus:border-emerald-800"
            >
              <option value="price">Sort: Highest Price</option>
              <option value="distance">Sort: Nearest Distance</option>
              <option value="arrivals">Sort: Highest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mandi Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMandis.map((mandi) => {
          const cropData = mandi.prices[activeCrop];
          const headlinePrice = cropData?.headlinePrice || 0;
          const netEstimated = cropData?.netEstimatedPrice || headlinePrice * 0.85;
          const arrivals = cropData?.arrivalsTonnes || 0;

          return (
            <div
              key={mandi.id}
              className="bg-white rounded-2xl border border-[#e6e2d8] p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                      {mandi.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-stone-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>{mandi.district} • {mandi.distanceFromPuneKm} km</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      mandi.congestionLevel === "Low"
                        ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                        : mandi.congestionLevel === "Medium"
                        ? "bg-amber-50 text-amber-900 border-amber-300"
                        : "bg-red-50 text-red-900 border-red-300"
                    }`}
                  >
                    {mandi.congestionLevel} Traffic
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider block">
                      Headline Rate ({activeCrop})
                    </span>
                    <div className="font-serif text-2xl font-bold text-stone-900">
                      ₹{headlinePrice.toFixed(1)} <span className="text-xs font-sans font-normal text-stone-600">/ kg</span>
                    </div>
                    <span className="text-[10px] text-stone-500">
                      (₹{(headlinePrice * 100).toFixed(0)} / Quintal)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider block">
                      Net Realization
                    </span>
                    <div className="font-serif text-2xl font-bold text-emerald-900">
                      ₹{netEstimated.toFixed(1)} <span className="text-xs font-sans font-normal text-stone-600">/ kg</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 font-semibold">
                      after transport & fees
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Daily Arrivals</span>
                    <span className="font-semibold text-stone-800">{arrivals} Tonnes</span>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Last Verified</span>
                    <span className="font-medium text-stone-600">{mandi.verifiedDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectMandiOnMap?.(mandi)}
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-[#0b2b1d] text-stone-800 hover:text-amber-300 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>View on Mandi Map Canvas</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
