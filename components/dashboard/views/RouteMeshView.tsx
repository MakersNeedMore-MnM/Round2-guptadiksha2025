"use client";

import React, { useState } from "react";
import {
  Truck,
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Clock,
  MapPin,
  TrendingDown,
  Scale,
  Sparkles,
  HelpCircle,
  Split,
  ChevronRight,
} from "lucide-react";
import { PRESET_CORRIDORS, calculateCorridorSplit, type RouteCorridorPlan } from "@/lib/routeMesh";

interface SharedTruck {
  id: string;
  vehicleType: string;
  driverName: string;
  corridor: string;
  origin: string;
  destination: string;
  departureTime: string;
  availableCapacityKg: number;
  totalCapacityKg: number;
  pooledRatePerQtl: number;
  soloRatePerQtl: number;
  booked: boolean;
}

const INITIAL_TRUCKS: SharedTruck[] = [
  {
    id: "truck-1",
    vehicleType: "Tata 1109 (10 Tonne Heavy)",
    driverName: "Sanjay Deshmukh",
    corridor: "Pune ➔ Mumbai Vashi Corridor",
    origin: "Hadapsar / Loni Kalbhor, Pune",
    destination: "Mumbai Vashi APMC",
    departureTime: "Tonight, 11:30 PM",
    availableCapacityKg: 1500,
    totalCapacityKg: 10000,
    pooledRatePerQtl: 95,
    soloRatePerQtl: 160,
    booked: false,
  },
  {
    id: "truck-2",
    vehicleType: "Eicher Pro 1110 (7 Tonne)",
    driverName: "Balasaheb Shinde",
    corridor: "Nashik ➔ Mumbai APMC",
    origin: "Niphad, Nashik",
    destination: "Mumbai Vashi APMC",
    departureTime: "Tomorrow, 04:00 AM",
    availableCapacityKg: 700,
    totalCapacityKg: 7000,
    pooledRatePerQtl: 90,
    soloRatePerQtl: 155,
    booked: false,
  },
  {
    id: "truck-3",
    vehicleType: "Mahindra Bolero Maxi Truck (2.5 Tonne)",
    driverName: "Kishore More",
    corridor: "Baramati ➔ Pune Gultekdi",
    origin: "Baramati Agricultural Zone",
    destination: "Pune Gultekdi Mandi",
    departureTime: "Today, 06:00 PM",
    availableCapacityKg: 500,
    totalCapacityKg: 2500,
    pooledRatePerQtl: 60,
    soloRatePerQtl: 110,
    booked: false,
  },
];

export default function RouteMeshView() {
  const [trucks] = useState<SharedTruck[]>(INITIAL_TRUCKS);
  const [selectedCorridorKey, setSelectedCorridorKey] = useState<"pune-mumbai" | "nashik-mumbai" | "baramati-pune">("pune-mumbai");
  const [userQuantity, setUserQuantity] = useState(5000);
  const [bookedIds, setBookedIds] = useState<string[]>([]);
  const [activeScenarioTab, setActiveScenarioTab] = useState<"enroute" | "partial">("enroute");

  // Get corridor plan and calculate live ton-km multi-farmer splits
  const currentPlan = { ...PRESET_CORRIDORS[selectedCorridorKey] };
  if (currentPlan.farmers.length > 0 && currentPlan.farmers[0].isCurrentUser) {
    currentPlan.farmers[0].quantityKg = userQuantity;
  }
  const splitResult = calculateCorridorSplit(currentPlan);
  const userSplit = splitResult.splits.find((s) => s.farmerId.includes("you")) || splitResult.splits[0];

  const handleBookSlot = (truckId: string) => {
    if (bookedIds.includes(truckId)) {
      setBookedIds(bookedIds.filter((id) => id !== truckId));
    } else {
      setBookedIds([...bookedIds, truckId]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#fbf9f5] space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2d8] pb-5 sm:pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-900 mb-1">
            <Truck className="w-4 h-4 text-emerald-800" />
            <span>RouteMesh™ Shared Freight & Co-Loader Network</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
            Highway Corridor Pooling & Split Engine
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Pool truck capacity with en-route farmers along your highway corridor. Split freight proportionally by produce weight and distance.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold self-start sm:self-auto">
          <Users className="w-3.5 h-3.5 text-amber-800" />
          <span>Save ~38% on Freight Overhead</span>
        </div>
      </div>

      {/* Corridor Selector & Scenario Switcher */}
      <div className="bg-white rounded-2xl border border-[#e6e2d8] p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Active Highway Corridor
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <MapPin className="w-4 h-4 text-emerald-800" />
              <h2 className="font-serif text-lg font-bold text-stone-900">
                {currentPlan.corridorName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCorridorKey}
              onChange={(e) => setSelectedCorridorKey(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-[#e6e2d8] bg-stone-50 text-xs font-semibold text-stone-800 outline-none focus:border-emerald-800 shadow-2xs"
            >
              <option value="pune-mumbai">Pune ➔ Mumbai Vashi (145 km)</option>
              <option value="nashik-mumbai">Nashik ➔ Mumbai Vashi (165 km)</option>
              <option value="baramati-pune">Baramati ➔ Pune Gultekdi (100 km)</option>
            </select>
          </div>
        </div>

        {/* Visual Corridor Diagram: Farmer A (Origin) ➔ Farmer B (Waypoint 1) ➔ Farmer C (Waypoint 2) ➔ Mandi Drop */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700 flex items-center space-x-1.5">
              <Split className="w-4 h-4 text-emerald-800" />
              <span>En-Route Pickup & Co-Loading Sequence</span>
            </span>
            <span className="text-[11px] text-stone-500 font-medium">
              Total Distance: <strong>{currentPlan.totalDistanceKm} km</strong> • Truck: <strong>{currentPlan.truckType}</strong>
            </span>
          </div>

          {/* Visual Interactive Horizontal Ribbon of Waypoints */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Origin Node (You) */}
            <div className="p-3.5 rounded-2xl bg-[#0b2b1d] text-amber-300 border border-emerald-950 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-400 text-stone-950 text-[9px] font-bold uppercase">
                Origin
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-stone-300 block font-sans">Farmer 1 (You)</span>
                <div className="font-serif text-base font-bold text-white truncate">
                  {currentPlan.farmers[0].name}
                </div>
                <div className="text-[11px] text-emerald-200">
                  {currentPlan.farmers[0].cropEmoji} {currentPlan.farmers[0].quantityKg.toLocaleString()} kg {currentPlan.farmers[0].crop}
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-emerald-800/80 text-[10px] text-amber-300 flex justify-between items-center">
                <span>Start Point (0 km)</span>
                <span className="font-bold">Share: ₹{userSplit?.splitCost.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* En-Route Farmer 2 */}
            {currentPlan.farmers[1] && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 flex flex-col justify-between shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-bold uppercase">Waypoint 1 Pickup</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                      +{currentPlan.farmers[1].pickupDistanceKm} km
                    </span>
                  </div>
                  <div className="font-serif text-base font-bold text-stone-900 truncate">
                    {currentPlan.farmers[1].name}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    {currentPlan.farmers[1].cropEmoji} {currentPlan.farmers[1].quantityKg.toLocaleString()} kg {currentPlan.farmers[1].crop}
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-stone-200 text-[10px] text-stone-500 flex justify-between items-center">
                  <span>{currentPlan.farmers[1].pickupLocation.split(":")[1] || "En-Route"}</span>
                  <span className="font-bold text-emerald-800">
                    ₹{splitResult.splits[1]?.splitCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}

            {/* En-Route Farmer 3 */}
            {currentPlan.farmers[2] && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 flex flex-col justify-between shadow-2xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-bold uppercase">Waypoint 2 Pickup</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">
                      +{currentPlan.farmers[2].pickupDistanceKm} km
                    </span>
                  </div>
                  <div className="font-serif text-base font-bold text-stone-900 truncate">
                    {currentPlan.farmers[2].name}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    {currentPlan.farmers[2].cropEmoji} {currentPlan.farmers[2].quantityKg.toLocaleString()} kg {currentPlan.farmers[2].crop}
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-stone-200 text-[10px] text-stone-500 flex justify-between items-center">
                  <span>{currentPlan.farmers[2].pickupLocation.split(":")[1] || "Highway Hub"}</span>
                  <span className="font-bold text-emerald-800">
                    ₹{splitResult.splits[2]?.splitCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}

            {/* Final Mandi Destination Drop */}
            <div className="p-3.5 rounded-2xl bg-emerald-900 text-white border border-emerald-950 flex flex-col justify-between shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-300 font-bold uppercase">Final Mandi Destination</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-800 text-emerald-200 rounded font-bold">
                    {currentPlan.totalDistanceKm} km
                  </span>
                </div>
                <div className="font-serif text-base font-bold text-amber-300 truncate">
                  {currentPlan.destinationName}
                </div>
                <div className="text-[11px] text-emerald-100">
                  Total Produce: {splitResult.totalCarriedKg.toLocaleString()} kg ({splitResult.loadPct}% full)
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-emerald-800 text-[10px] text-emerald-200 flex justify-between items-center">
                <span>Single APMC Gate Entry</span>
                <span className="font-bold text-white">Save {userSplit?.savingsPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Proportional Cost-Split Calculator & Math Logic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 7 Cols: Interactive Produce Slider & Live Split Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#e6e2d8] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-emerald-800" />
              <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900">
                Proportional Ton-Km Cost Split Calculator
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Live Algorithmic Math
            </span>
          </div>

          {/* User Produce Slider */}
          <div className="space-y-2 p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex justify-between text-xs font-semibold text-stone-700">
              <span>Your Produce Weight (Farmer 1)</span>
              <span className="text-emerald-900 font-bold">
                {userQuantity.toLocaleString()} kg ({(userQuantity / 100).toFixed(0)} Quintals)
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={8000}
              step={500}
              value={userQuantity}
              onChange={(e) => setUserQuantity(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>1,000 kg (Small batch)</span>
              <span>5,000 kg (Standard harvest)</span>
              <span>8,000 kg (Large batch)</span>
            </div>
          </div>

          {/* Multi-Farmer Live Split Breakdown Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800">Farmer Split Manifest</span>
              <span className="text-emerald-800 font-semibold text-[11px]">
                Truck Capacity: {splitResult.totalCarriedKg.toLocaleString()} / {currentPlan.truckCapacityKg.toLocaleString()} kg
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-[10px] uppercase font-bold text-stone-400">
                    <th className="pb-2">Farmer</th>
                    <th className="pb-2 text-right">Distance</th>
                    <th className="pb-2 text-right">Ton-Km</th>
                    <th className="pb-2 text-right">Solo Cost</th>
                    <th className="pb-2 text-right">RouteMesh Split</th>
                    <th className="pb-2 text-right">Net Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {splitResult.splits.map((split) => {
                    const isYou = split.farmerId.includes("you");
                    return (
                      <tr key={split.farmerId} className={isYou ? "bg-amber-50/80 font-semibold" : ""}>
                        <td className="py-3">
                          <div className="flex items-center space-x-1.5">
                            {isYou && <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0" />}
                            <span className="truncate">{split.farmerName}</span>
                          </div>
                          <div className="text-[10px] text-stone-500 font-normal">
                            {split.crop} ({split.quantityKg.toLocaleString()} kg)
                          </div>
                        </td>
                        <td className="py-3 text-right text-stone-600">
                          {split.carriedDistanceKm} km
                        </td>
                        <td className="py-3 text-right text-stone-500">
                          {split.tonKm.toLocaleString()}
                        </td>
                        <td className="py-3 text-right text-stone-400 line-through">
                          ₹{split.soloCost.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3 text-right font-bold text-emerald-900">
                          ₹{split.splitCost.toLocaleString("en-IN")}
                          <span className="text-[10px] text-stone-500 font-normal block">₹{split.ratePerQtl}/Qtl</span>
                        </td>
                        <td className="py-3 text-right font-bold text-emerald-800">
                          +₹{split.savingsRs.toLocaleString("en-IN")}
                          <span className="text-[10px] text-amber-800 block font-normal">({split.savingsPct}% saved)</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Highlight Savings Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-stone-900">
            <div>
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                Total Farming Group Savings
              </span>
              <span className="text-xs text-emerald-900">
                Combined cash saved across all co-loading farmers on this single trip
              </span>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900 shrink-0">
              +₹{splitResult.totalCommunitySavings.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Two Sharing Scenarios Explained Clearly */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#e6e2d8] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="font-serif text-base sm:text-lg font-bold text-stone-900">
              How Corridor Splitting Works
            </h2>
            <p className="text-xs text-stone-500">
              Supporting both en-route pickups and branching partial corridor drop-offs.
            </p>
          </div>

          {/* Scenario Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setActiveScenarioTab("enroute")}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                activeScenarioTab === "enroute"
                  ? "bg-[#0b2b1d] text-amber-300 shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              Scenario 1: En-Route Pickups
            </button>
            <button
              onClick={() => setActiveScenarioTab("partial")}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                activeScenarioTab === "partial"
                  ? "bg-[#0b2b1d] text-amber-300 shadow-xs"
                  : "text-stone-700 hover:text-stone-950"
              }`}
            >
              Scenario 2: Partial Splits
            </button>
          </div>

          {/* Scenario 1 Content */}
          {activeScenarioTab === "enroute" && (
            <div className="space-y-3 text-xs text-stone-700 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <strong className="text-stone-900 font-serif block text-sm">
                  1. Mid-Way Pickup Along the Highway
                </strong>
                <p>
                  Truck starts at Farmer A's farm in Pune with 5,000 kg Tomatoes. It stops at Talegaon Toll to pick up Farmer B (2,000 kg Onions), and Khopoli for Farmer C (1,500 kg Potatoes).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <strong className="text-stone-900 font-serif block text-sm">
                  2. Ton-Kilometer Proportional Math
                </strong>
                <p>
                  Instead of equal split, costs are calculated strictly on <code>Weight (Tonnes) × Distance (km)</code> carried in the truck. Farmers picking up closer to the destination pay only for their exact travel segment.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <strong className="text-stone-900 font-serif block text-sm">
                  3. Direct APMC Delivery
                </strong>
                <p>
                  All farmers receive individual digital delivery passes for the destination APMC wholesale floor.
                </p>
              </div>
            </div>
          )}

          {/* Scenario 2 Content */}
          {activeScenarioTab === "partial" && (
            <div className="space-y-3 text-xs text-stone-700 animate-in fade-in">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <strong className="text-stone-900 font-serif block text-sm">
                  Same Village, Different Destinations (A➔B & A➔C)
                </strong>
                <p>
                  Farmer 1 needs to go from <strong>Pune to Mumbai</strong> (145 km), while Farmer 2 in the same village only needs to deliver to <strong>Lonavala / Talegaon</strong> (40 km).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <strong className="text-stone-900 font-serif block text-sm">
                  Common Highway Corridor Sharing
                </strong>
                <p>
                  Both farmers load into the same truck in Pune. Farmer 2's produce is unloaded at the intermediate market, and the truck continues to Mumbai with Farmer 1.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <strong className="text-stone-900 font-serif block text-sm">
                  Fair Partial Share Split
                </strong>
                <p>
                  Farmer 2 only pays for the shared 40 km leg. Farmer 1 pays for their 145 km journey minus Farmer 2's contribution, dramatically cutting total freight costs for both!
                </p>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
            <span>All vehicles are verified with APMC transit permits and goods-in-transit cargo insurance.</span>
          </div>
        </div>

      </div>

      {/* Available Shared Vehicles Looking for Co-loaders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-normal text-stone-900">
            Available Verified Trucks on Active Corridors
          </h2>
          <span className="text-xs text-stone-500">
            Real-time APMC logistics network
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trucks.map((truck) => {
            const isBooked = bookedIds.includes(truck.id);
            const loadPct = Math.round(((truck.totalCapacityKg - truck.availableCapacityKg) / truck.totalCapacityKg) * 100);

            return (
              <div
                key={truck.id}
                className={`bg-white rounded-2xl border p-5 shadow-2xs flex flex-col justify-between space-y-4 transition-all ${
                  isBooked ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-[#e6e2d8]"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                        {truck.corridor}
                      </span>
                      <h3 className="font-serif text-base font-bold text-stone-900 mt-0.5">
                        {truck.vehicleType}
                      </h3>
                      <span className="text-xs text-stone-500">Driver: {truck.driverName}</span>
                    </div>

                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                      <Truck className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Route points */}
                  <div className="space-y-1 text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>Origin: <strong>{truck.origin}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Departing: <strong>{truck.departureTime}</strong></span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-500">Co-loader Capacity: {loadPct}% Filled</span>
                      <span className="font-bold text-emerald-900">{truck.availableCapacityKg.toLocaleString()} kg free</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full"
                        style={{ width: `${loadPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="flex items-baseline justify-between pt-1 border-t border-stone-100">
                    <span className="text-xs text-stone-500">RouteMesh Shared Rate:</span>
                    <div className="font-serif text-lg font-bold text-emerald-900">
                      ₹{truck.pooledRatePerQtl} <span className="text-xs font-sans font-normal text-stone-500">/ Quintal</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBookSlot(truck.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                    isBooked
                      ? "bg-emerald-800 text-white"
                      : "bg-[#0b2b1d] hover:bg-[#143e2c] text-amber-300 shadow-2xs"
                  }`}
                >
                  {isBooked ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Co-Loader Slot Reserved</span>
                    </>
                  ) : (
                    <>
                      <span>Reserve Co-Loader Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
