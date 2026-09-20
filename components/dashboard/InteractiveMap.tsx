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
import { Navigation, X, Info } from "lucide-react";

interface InteractiveMapProps {
  mandis: MandiMarket[];
  selectedCrop: string;
  selectedMandi: MandiMarket | null;
  onSelectMandi: (mandi: MandiMarket) => void;
  recommendedMandiId?: string;
  origin?: Origin; // optional — falls back to PRESET_ORIGINS[0] internally
  activeRouteMandi?: MandiMarket | null;
  onClearRoute?: () => void;
  onOpenRouteDetails?: (mandi: MandiMarket) => void;
}

// Generate realistic intermediate highway curve points between origin and destination
function generateHighwayRoutePoints(start: [number, number], end: [number, number]): [number, number][] {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  // Mid point with realistic road curvature offset
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  // Slight perpendicular bow to mimic highway curves
  const curveFactor = 0.08;
  const p1Lat = lat1 + dLat * 0.33 + (-dLng * curveFactor);
  const p1Lng = lng1 + dLng * 0.33 + (dLat * curveFactor);

  const p2Lat = lat1 + dLat * 0.66 + (dLng * curveFactor * 0.5);
  const p2Lng = lng1 + dLng * 0.66 + (-dLat * curveFactor * 0.5);

  return [
    [lat1, lng1],
    [p1Lat, p1Lng],
    [midLat, midLng],
    [p2Lat, p2Lng],
    [endLatOrTarget(lat2), endLngOrTarget(lng2)],
  ];
}

function endLatOrTarget(lat: number) { return lat; }
function endLngOrTarget(lng: number) { return lng; }

export default function InteractiveMap({
  mandis,
  selectedCrop,
  selectedMandi,
  onSelectMandi,
  recommendedMandiId,
  origin,
  activeRouteMandi,
  onClearRoute,
  onOpenRouteDetails,
}: InteractiveMapProps) {
  const { language } = useLanguage();

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const routeLayersRef = useRef<L.Layer[]>([]);

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
      const isRouteDest = activeRouteMandi?.id === mandi.id;

      const cityName = getMandiName(mandi, lang);
      const districtName = getMandiDistrict(mandi, lang);

      // Dynamic distance from user's origin
      const distKm = distanceFromOrigin(safeOrigin, mandi);

      const customIcon = L.divIcon({
        className: "custom-price-tag-wrapper",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
            <div class="px-2.5 py-1 rounded-full text-xs font-bold shadow-md transition-transform border ${
              isRouteDest
                ? "bg-[#0b2b1d] text-amber-300 border-amber-400 scale-125 ring-4 ring-amber-400/40"
                : isSelected
                ? "bg-[#0b2b1d] text-amber-300 border-amber-400 scale-110 ring-2 ring-amber-400"
                : isBest
                ? "bg-emerald-800 text-amber-300 border-emerald-950 scale-105"
                : "bg-white text-stone-900 border-stone-300 hover:border-emerald-800"
            }">
              ${isBest ? "★ " : ""}₹${priceObj.headlinePrice.toFixed(0)}/kg
            </div>
            <div style="font-size:10px;font-weight:600;color:#0b2b1d;background:rgba(255,255,255,0.95);padding:0 5px;border-radius:4px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.12);border:1px solid rgba(0,0,0,0.06);">
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
    activeRouteMandi,
    onSelectMandi,
    language,
    origin,
  ]);

  // ─── Render Highway Route Polyline & Origin Marker when activeRouteMandi is set ───
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous route layers
    routeLayersRef.current.forEach((layer) => layer.remove());
    routeLayersRef.current = [];

    if (!activeRouteMandi) return;

    const safeOrigin = origin ?? PRESET_ORIGINS[0];
    const originCoords: [number, number] = [safeOrigin.lat, safeOrigin.lng];
    const destCoords: [number, number] = [activeRouteMandi.lat, activeRouteMandi.lng];

    const lang: Language = language ?? "en";
    const originName = lang === "hi" ? safeOrigin.nameHi : lang === "mr" ? safeOrigin.nameMr : safeOrigin.nameEn;
    const destName = getMandiName(activeRouteMandi, lang);
    const distKm = distanceFromOrigin(safeOrigin, activeRouteMandi);
    const driveHours = Math.max(0.5, parseFloat((distKm / 42 + 0.3).toFixed(1)));

    // 1. Origin Pin Marker
    const originIcon = L.divIcon({
      className: "origin-marker-pin",
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <div style="background:#0b2b1d;color:#fde047;font-weight:bold;font-size:11px;padding:3px 8px;border-radius:12px;border:2px solid #fde047;box-shadow:0 3px 8px rgba(0,0,0,0.3);white-space:nowrap;display:flex;align-items:center;gap:4px;">
            <span>📍</span>
            <span>Origin: ${originName}</span>
          </div>
          <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #0b2b1d;margin-top:-1px;"></div>
        </div>
      `,
      iconSize: [130, 36],
      iconAnchor: [65, 36],
    });

    const originMarker = L.marker(originCoords, { icon: originIcon, zIndexOffset: 1000 }).addTo(map);
    routeLayersRef.current.push(originMarker);

    // 2. Generate Route Waypoints
    const routePoints = generateHighwayRoutePoints(originCoords, destCoords);

    // Outer Glow / Road Outline
    const routeOutline = L.polyline(routePoints, {
      color: "#0b2b1d",
      weight: 7,
      opacity: 0.85,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);
    routeLayersRef.current.push(routeOutline);

    // Inner Glowing Emerald / Amber Dashed Highway Line
    const routeInner = L.polyline(routePoints, {
      color: "#34d399",
      weight: 3.5,
      opacity: 1,
      dashArray: "8, 12",
      lineCap: "round",
    }).addTo(map);
    routeLayersRef.current.push(routeInner);

    // 3. Mid-Point Interactive Badge
    const midPoint = routePoints[Math.floor(routePoints.length / 2)];
    const midIcon = L.divIcon({
      className: "route-mid-badge",
      html: `
        <div style="background:rgba(11,43,29,0.92);backdrop-filter:blur(4px);color:#ffffff;font-size:10px;font-weight:bold;padding:4px 9px;border-radius:20px;border:1.5px solid #34d399;box-shadow:0 4px 10px rgba(0,0,0,0.25);white-space:nowrap;cursor:pointer;display:flex;align-items:center;gap:4px;">
          <span>🛣️</span>
          <span>${distKm} km • ~${driveHours}h</span>
        </div>
      `,
      iconSize: [110, 26],
      iconAnchor: [55, 13],
    });

    const midMarker = L.marker(midPoint, { icon: midIcon, zIndexOffset: 950 }).addTo(map);
    midMarker.on("click", () => {
      onOpenRouteDetails?.(activeRouteMandi);
    });
    routeLayersRef.current.push(midMarker);

    // 4. Auto-fit camera bounds to comfortably view the whole route
    const bounds = L.latLngBounds([originCoords, destCoords]);
    map.fitBounds(bounds, {
      padding: [70, 70],
      maxZoom: 11,
      animate: true,
      duration: 1,
    });

  }, [activeRouteMandi, origin, language, onOpenRouteDetails]);

  return (
    <div className="relative w-full h-full min-h-[420px] sm:min-h-[500px] rounded-2xl overflow-hidden shadow-md border border-[#e6e2d8]">
      
      {/* Route Active Top Overlay Notification Banner */}
      {activeRouteMandi && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[92%] sm:max-w-md bg-[#0b2b1d]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-full border border-amber-400 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center space-x-2 text-xs truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">
              <strong>Route Active:</strong> {origin?.nameEn ?? "Pune"} ➔ {activeRouteMandi.name} ({distanceFromOrigin(origin, activeRouteMandi)} km)
            </span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => onOpenRouteDetails?.(activeRouteMandi)}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors flex items-center space-x-1"
            >
              <Info className="w-3 h-3" />
              <span>Details</span>
            </button>
            <button
              onClick={onClearRoute}
              className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Clear Route"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}