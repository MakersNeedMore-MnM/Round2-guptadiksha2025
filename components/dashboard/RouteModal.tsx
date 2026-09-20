"use client";

import React from "react";
import {
  X,
  Navigation,
  ExternalLink,
  Truck,
  Clock,
  ShieldCheck,
  MapPin,
  TrendingDown,
  ArrowRight,
  Route as RouteIcon,
} from "lucide-react";
import { MandiMarket, getMandiName, getMandiDistrict, getCropLabel } from "@/lib/mockMandiData";
import { distanceFromOrigin, type Origin } from "@/lib/geo";
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
  // Estimate driving time at ~42 km/h commercial truck average speed + 30 min buffer
  const driveHours = Math.max(0.5, parseFloat((distKm / 42 + 0.3).toFixed(1)));

  // Determine realistic highway corridor based on origin & destination
  const getHighwayCorridor = () => {
    const dest = mandi.name.toLowerCase();
    const orig = origin.nameEn.toLowerCase();
    if (dest.includes("mumbai") || dest.includes("vashi") || dest.includes("thane")) {
      return "Mumbai-Pune Expressway (Yashwantrao Chavan) / NH 48";
    }
    if (dest.includes("nashik") || orig.includes("nashik")) {
      return "Pune-Nashik Highway / NH 60";
    }
    if (dest.includes("solapur") || dest.includes("baramati")) {
      return "Pune-Solapur Highway / NH 65";
    }
    if (dest.includes("satara") || dest.includes("kolhapur")) {
      return "Pune-Bangalore Highway / NH 48";
    }
    if (dest.includes("aurangabad") || dest.includes("sambhajinagar")) {
      return "Pune-Ahmednagar-Sambhajinagar Expressway";
    }
    return "Maharashtra State Highway & APMC Agricultural Freight Corridor";
  };

  const corridorName = getHighwayCorridor();

  // Freight estimate (solo vs shared)
  const soloFreightPerQtl = Math.round(Math.max(50, distKm * 1.05 + 20));
  const pooledFreightPerQtl = Math.round(soloFreightPerQtl * 0.62); // ~38% savings
  const savingsPct = Math.round(((soloFreightPerQtl - pooledFreightPerQtl) / soloFreightPerQtl) * 100);

  // Google Maps navigation direct link
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${mandi.lat},${mandi.lng}&travelmode=driving`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#fbf9f5] rounded-3xl border border-[#e6e2d8] shadow-2xl overflow-hidden text-stone-900">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-white border-b border-[#e6e2d8] flex items-start justify-between gap-4 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-emerald-900">
              <RouteIcon className="w-3.5 h-3.5 text-emerald-800" />
              <span>Route Intelligence & Navigation</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              {originName} ➔ {mandiName}
            </h2>
            <p className="text-xs text-stone-500">
              Corridor route optimization for <strong>{cropLabel}</strong> produce transport
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
                Distance
              </span>
              <div className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                {distKm} <span className="text-xs font-sans font-normal text-stone-500">km</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#e6e2d8] text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Est. Transit Time
              </span>
              <div className="font-serif text-lg sm:text-xl font-bold text-stone-900 flex items-center justify-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-emerald-800 hidden sm:inline" />
                <span>{driveHours} <span className="text-xs font-sans font-normal text-stone-500">hrs</span></span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                RouteMesh Save
              </span>
              <div className="font-serif text-lg sm:text-xl font-bold text-emerald-950 flex items-center justify-center space-x-0.5">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-800" />
                <span>{savingsPct}%</span>
              </div>
            </div>
          </div>

          {/* Highway Corridor Detail */}
          <div className="p-3.5 bg-white rounded-2xl border border-[#e6e2d8] flex items-center space-x-3 text-xs text-stone-700 shadow-2xs">
            <div className="p-2 rounded-xl bg-amber-100/70 text-amber-900 shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Primary Highway Corridor
              </span>
              <span className="font-semibold text-stone-900">{corridorName}</span>
            </div>
          </div>

          {/* Step-by-Step Waypoint Journey */}
          <div className="bg-white rounded-2xl border border-[#e6e2d8] p-4 sm:p-5 shadow-2xs space-y-4">
            <h3 className="font-serif text-sm font-bold text-stone-900 pb-2 border-b border-stone-100 flex items-center space-x-2">
              <span>Transit Waypoints & Toll Checkpoints</span>
            </h3>

            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-800/30 text-xs">
              {/* Waypoint 1 */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-800 text-amber-300 font-bold text-[10px] flex items-center justify-center ring-4 ring-[#fbf9f5]">
                  1
                </span>
                <div className="pl-1">
                  <strong className="text-stone-900 block font-serif">Farm Dispatch: {originName}</strong>
                  <span className="text-stone-500 text-[11px]">
                    Produce loaded and weighed. Temperature & moisture verified.
                  </span>
                </div>
              </div>

              {/* Waypoint 2 */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center ring-4 ring-[#fbf9f5]">
                  2
                </span>
                <div className="pl-1">
                  <strong className="text-stone-900 block font-serif">Highway Transit Toll & RouteMesh Aggregation Hub</strong>
                  <span className="text-stone-500 text-[11px]">
                    Transit via {corridorName.split("/")[0]}. Fastag commercial freight clearance.
                  </span>
                </div>
              </div>

              {/* Waypoint 3 */}
              <div className="relative">
                <span className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#0b2b1d] text-emerald-300 font-bold text-[10px] flex items-center justify-center ring-4 ring-[#fbf9f5]">
                  3
                </span>
                <div className="pl-1">
                  <strong className="text-stone-900 block font-serif">Destination APMC: {mandiName}</strong>
                  <span className="text-stone-500 text-[11px]">
                    Direct entry to wholesale trading floor. Verified daily auction bidding.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Freight Economics Comparison Box */}
          <div className="p-4 bg-emerald-950 text-white rounded-2xl space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
                Freight Cost Comparison (Per Quintal)
              </span>
              <span className="px-2 py-0.5 bg-amber-400 text-stone-950 font-bold rounded text-[10px]">
                Save {savingsPct}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-white/10 text-stone-200 text-xs">
                <span className="text-[10px] text-stone-400 block">Solo Vehicle Hire</span>
                <div className="font-serif text-lg font-bold text-stone-100">
                  ₹{soloFreightPerQtl} <span className="text-[10px] font-sans font-normal text-stone-400">/ Qtl</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-800/80 border border-emerald-600/50 text-white text-xs">
                <span className="text-[10px] text-emerald-200 block font-medium">RouteMesh Pooled</span>
                <div className="font-serif text-lg font-bold text-amber-300">
                  ₹{pooledFreightPerQtl} <span className="text-[10px] font-sans font-normal text-emerald-200">/ Qtl</span>
                </div>
              </div>
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
            <span>Book RouteMesh Freight</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
