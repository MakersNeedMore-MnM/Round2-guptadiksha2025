"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MandiMarket,
  getMandiName,
  getMandiDistrict,
} from "@/lib/mockMandiData";
import { useLanguage } from "@/context/LanguageContext";
import { distanceFromOrigin, PRESET_ORIGINS, type Origin } from "@/lib/geo";
import type { Language } from "@/lib/types";

interface InteractiveMapProps {
  mandis: MandiMarket[];
  selectedCrop: string;
  selectedMandi: MandiMarket | null;
  onSelectMandi: (mandi: MandiMarket) => void;
  recommendedMandiId?: string;
  origin?: Origin; // optional — falls back to PRESET_ORIGINS[0] internally
}

export default function InteractiveMap({
  mandis,
  selectedCrop,
  selectedMandi,
  onSelectMandi,
  recommendedMandiId,
  origin,
}: InteractiveMapProps) {
  const { language } = useLanguage();

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  // ─── Initialize Map (runs once) ───
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [18.8504, 74.2567],
      zoom: 7,
      zoomControl: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    return () => {
      mapRef.current = null;
      map.remove();
    };
  }, []);

  // ─── Update Markers when data, selection, recommendation, language, or origin changes ───
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!(map as any)._container) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const lang: Language = language ?? "en";
    const safeOrigin: Origin = origin ?? PRESET_ORIGINS[0];

    mandis.forEach((mandi) => {
      const priceObj = mandi.prices[selectedCrop] || { headlinePrice: 30 };
      const isSelected = selectedMandi?.id === mandi.id;
      const isBest = recommendedMandiId === mandi.id;

      const cityName = getMandiName(mandi, lang);
      const districtName = getMandiDistrict(mandi, lang);

      // Dynamic distance from user's origin
      const distKm = distanceFromOrigin(safeOrigin, mandi);

      const customIcon = L.divIcon({
        className: "custom-price-tag-wrapper",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
            <div class="px-2.5 py-1 rounded-full text-xs font-bold shadow-md transition-transform border ${isSelected
            ? "bg-[#0b2b1d] text-amber-300 border-amber-400 scale-110 ring-2 ring-amber-400"
            : isBest
              ? "bg-emerald-800 text-amber-300 border-emerald-950 scale-105"
              : "bg-white text-stone-900 border-stone-300 hover:border-emerald-800"
          }">
              ${isBest ? "★ " : ""}₹${priceObj.headlinePrice.toFixed(0)}/kg
            </div>
            <div style="font-size:10px;font-weight:600;color:#0b2b1d;background:rgba(255,255,255,0.9);padding:0 5px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,0.08);">
              ${cityName} · ${distKm}km
            </div>
          </div>
        `,
        iconSize: [120, 46],
        iconAnchor: [60, 23],
      });

      const marker = L.marker([mandi.lat, mandi.lng], { icon: customIcon }).addTo(map);

      marker.bindTooltip(`${cityName} — ${districtName} · ${distKm} km`, {
        direction: "top",
        offset: [0, -22],
      });

      marker.on("click", () => {
        onSelectMandi(mandi);
        map.panTo([mandi.lat, mandi.lng], { animate: true, duration: 0.8 });
      });

      markersRef.current[mandi.id] = marker;
    });
  }, [
    mandis,
    selectedCrop,
    selectedMandi,
    recommendedMandiId,
    onSelectMandi,
    language,
    origin,
  ]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-md border border-[#e6e2d8]">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}