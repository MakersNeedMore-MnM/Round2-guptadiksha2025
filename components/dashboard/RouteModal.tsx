"use client";

import React from "react";
import {
  X,
  Navigation,
  ExternalLink,
  Truck,
  Clock,
  MapPin,
  TrendingDown,
  ArrowRight,
  Route as RouteIcon,
  Users,
  CheckCircle2,
  Scale,
  Sparkles,
  Info,
} from "lucide-react";
import { MandiMarket, getMandiName, getMandiDistrict, getCropLabel } from "@/lib/mockMandiData";
import { distanceFromOrigin, type Origin } from "@/lib/geo";
import { getCorridorPlan, calculateCorridorSplit } from "@/lib/routeMesh";
import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/types";

interface RouteModalProps {
  mandi: MandiMarket | null;
  origin: Origin;
  selectedCrop: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRouteMesh?: () => void;
}

export default function RouteModal({
  mandi,
  origin,
  selectedCrop,
  isOpen,
  onClose,
  onNavigateToRouteMesh,
}: RouteModalProps) {
  const { t, language } = useLanguage();
  const lang: Language = language ?? "en";

  if (!isOpen || !mandi) return null;

  const mandiName = getMandiName(mandi, lang);
  const mandiDistrict = getMandiDistrict(mandi, lang);
  const cropLabel = getCropLabel(selectedCrop, lang);
  const originName = lang === "hi" ? origin.nameHi : lang === "mr" ? origin.nameMr : origin.nameEn;

  const distKm = distanceFromOrigin(origin, mandi);
  const driveHours = Math.max(0.5, parseFloat((distKm / 42 + 0.3).toFixed(1)));

  // Retrieve co-loading corridor plan and ton-km split calculations
  const plan = getCorridorPlan(origin, mandi, 5000, selectedCrop);
  const splitData = calculateCorridorSplit(plan);
  const userSplit = splitData.splits.find((s) => s.farmerId.includes("you")) || splitData.splits[0];

  // Google Maps navigation direct link
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${mandi.lat},${mandi.lng}&travelmode=driving`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#fbf9f5] rounded-3xl border border-[#e6e2d8] shadow-2xl overflow-hidden text-stone-900">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#e6e2d8] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-emerald-900">
              <RouteIcon className="w-3.5 h-3.5 text-emerald-800" />
              <span>RouteMesh™ Corridor Logistics & Co-Loader Split</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              {originName} ➔ {mandiName}
            </h2>
            <p className="text-xs text-stone-500">
              En-route pickup coordination & proportional freight split for <strong>{cropLabel}</strong> transport
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
            title="Close Route Details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Key Metric Highlights Strip */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-white rounded-2xl border border-[#e6e2d8] text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Total Corridor
              </span>
              <div className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                {distKm} <span className="text-xs font-sans font-normal text-stone-500">km</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#e6e2d8] text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Truck Utilization
              </span>
              <div className="font-serif text-lg sm:text-xl font-bold text-emerald-900 flex items-center justify-center space-x-1">
                <Scale className="w-3.5 h-3.5 text-emerald-800 hidden sm:inline" />
                <span>{splitData.loadPct}% <span className="text-xs font-sans font-normal text-stone-500">filled</span></span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Your Freight Saving
              </span>
              <div className="font-serif text-lg sm:text-xl font-bold text-emerald-950 flex items-center justify-center space-x-0.5">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-800" />
                <span>{userSplit?.savingsPct ?? 38}%</span>
              </div>
            </div>
          </div>

          {/* En-Route Highway Pickup Sequence Diagram */}
          <div className="bg-white rounded-2xl border border-[#e6e2d8] p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-800" />
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900">
                  En-Route Farmer Pickups Along Highway
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-900 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                {plan.farmers.length} Farmers Co-loading
              </span>
            </div>

            {/* Visual Step-by-Step Waypoint Timeline */}
            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-800/30 text-xs">
              
              {/* Farmer 1 (Origin - You) */}
              <div className="relative pb-2">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#0b2b1d] text-amber-300 font-bold text-[10px] flex items-center justify-center ring-4 ring-[#fbf9f5]">
                  1
                </span>
                <div className="pl-1 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/80">
                  <div className="flex items-center justify-between font-semibold">
                    <strong className="text-stone-900 font-serif">
                      📍 {plan.farmers[0].name} (Origin)
                    </strong>
                    <span className="text-emerald-900 font-bold text-[11px]">
                      {plan.farmers[0].cropEmoji} {plan.farmers[0].quantityKg.toLocaleString()} kg {plan.farmers[0].crop}
                    </span>
                  </div>
                  <div className="text-stone-500 text-[11px] mt-0.5 flex items-center justify-between">
                    <span>{plan.farmers[0].pickupLocation}</span>
                    <span className="text-emerald-800 font-medium">Split Share: ₹{userSplit?.splitCost.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Intermediate En-Route Farmers */}
              {plan.farmers.slice(1).map((farmer, idx) => {
                const s = splitData.splits.find((x) => x.farmerId === farmer.id);
                return (
                  <div key={farmer.id} className="relative pb-2">
                    <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center ring-4 ring-[#fbf9f5]">
                      {idx + 2}
                    </span>
                    <div className="pl-1 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                      <div className="flex items-center justify-between font-semibold">
                        <strong className="text-stone-900 font-serif flex items-center space-x-1.5">
                          <span>👨‍🌾 En-Route Pickup: {farmer.name}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded font-normal">
                            +{farmer.pickupDistanceKm}km
                          </span>
                        </strong>
                        <span className="text-stone-800 font-bold text-[11px]">
                          {farmer.cropEmoji} {farmer.quantityKg.toLocaleString()} kg {farmer.crop}
                        </span>
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5 flex items-center justify-between">
                        <span>{farmer.pickupLocation}</span>
                        <span className="text-emerald-800 font-medium">Split Share: ₹{s?.splitCost.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Destination Mandi Drop */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-800 text-white font-bold text-[10px] flex items-center justify-center ring-4 ring-[#fbf9f5]">
                  🏁
                </span>
                <div className="pl-1 bg-emerald-900 text-white p-2.5 rounded-xl">
                  <div className="flex items-center justify-between font-semibold">
                    <strong className="font-serif">Destination: {mandiName}</strong>
                    <span className="text-amber-300 font-bold text-[11px]">
                      Total Produce: {splitData.totalCarriedKg.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="text-emerald-200 text-[11px] mt-0.5">
                    Direct unloading at APMC wholesale trading floor. Single delivery pass.
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Proportional Cost-Split Table */}
          <div className="bg-white rounded-2xl border border-[#e6e2d8] p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900">
                  Proportional Cost Split Breakdown (By Ton-Km)
                </h3>
                <p className="text-[11px] text-stone-500">
                  Fair split based on exact produce weight and highway distance carried
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Community Saves ₹{splitData.totalCommunitySavings.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-[10px] uppercase font-bold text-stone-400">
                    <th className="pb-2">Farmer & Cargo</th>
                    <th className="pb-2 text-right">Weight</th>
                    <th className="pb-2 text-right">Solo Hire</th>
                    <th className="pb-2 text-right">RouteMesh Split</th>
                    <th className="pb-2 text-right">You Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {splitData.splits.map((split) => {
                    const isYou = split.farmerId.includes("you");
                    return (
                      <tr key={split.farmerId} className={isYou ? "bg-amber-50/70 font-semibold" : ""}>
                        <td className="py-2.5">
                          <div className="flex items-center space-x-1.5">
                            {isYou && <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0" />}
                            <span className="truncate">{split.farmerName}</span>
                          </div>
                          <div className="text-[10px] text-stone-400 font-normal">
                            {split.crop} • {split.carriedDistanceKm} km
                          </div>
                        </td>
                        <td className="py-2.5 text-right">
                          {split.quantityKg.toLocaleString()} kg
                          <span className="text-[10px] text-stone-400 block">({split.weightPct}%)</span>
                        </td>
                        <td className="py-2.5 text-right text-stone-400 line-through">
                          ₹{split.soloCost.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 text-right font-bold text-emerald-900">
                          ₹{split.splitCost.toLocaleString("en-IN")}
                          <span className="text-[10px] text-stone-500 font-normal block">₹{split.ratePerQtl}/Qtl</span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-emerald-800">
                          +₹{split.savingsRs.toLocaleString("en-IN")}
                          <span className="text-[10px] text-amber-800 block">({split.savingsPct}%)</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Educational Co-loader Tip */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start space-x-2.5 text-xs text-amber-950">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong>Why this saves you money:</strong> By picking up co-loaders along your highway route, the truck returns empty only once for the whole group. Vehicle fuel & driver toll costs are proportionally split across all {splitData.totalCarriedKg.toLocaleString()} kg of produce.
            </div>
          </div>

        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#e6e2d8] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-semibold transition-colors"
          >
            <Navigation className="w-4 h-4 text-emerald-800" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>

          <button
            onClick={() => {
              onClose();
              onNavigateToRouteMesh?.();
            }}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Manage Split in RouteMesh™</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
