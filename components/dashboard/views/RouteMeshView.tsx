"use client";

import React, { useState } from "react";
import { Truck, Users, ShieldCheck, ArrowRight, CheckCircle2, Calculator, Clock, MapPin } from "lucide-react";

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
    vehicleType: "Tata 407 (4 Tonne)",
    driverName: "Sanjay Deshmukh",
    corridor: "Pune ➔ Mumbai Vashi Corridor",
    origin: "Hadapsar / Loni Kalbhor, Pune",
    destination: "Mumbai Vashi APMC",
    departureTime: "Tonight, 11:30 PM",
    availableCapacityKg: 1800,
    totalCapacityKg: 4000,
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
    availableCapacityKg: 2500,
    totalCapacityKg: 7000,
    pooledRatePerQtl: 90,
    soloRatePerQtl: 155,
    booked: false,
  },
  {
    id: "truck-3",
    vehicleType: "Mahindra Bolero Maxi Truck (1.5 Tonne)",
    driverName: "Kishore More",
    corridor: "Baramati ➔ Pune Gultekdi",
    origin: "Baramati Agricultural Zone",
    destination: "Pune Gultekdi Mandi",
    departureTime: "Today, 06:00 PM",
    availableCapacityKg: 700,
    totalCapacityKg: 1500,
    pooledRatePerQtl: 60,
    soloRatePerQtl: 110,
    booked: false,
  },
];

export default function RouteMeshView() {
  const [trucks] = useState<SharedTruck[]>(INITIAL_TRUCKS);

  // Calculator State
  const [calcQuantity, setCalcQuantity] = useState(3000);
  const [calcCorridor, setCalcCorridor] = useState<"pune-mumbai" | "nashik-mumbai" | "pune-local">("pune-mumbai");
  const [bookedIds, setBookedIds] = useState<string[]>([]);

  const rates = {
    "pune-mumbai": { solo: 160, pooled: 95, distance: "145 km" },
    "nashik-mumbai": { solo: 155, pooled: 90, distance: "165 km" },
    "pune-local": { solo: 110, pooled: 60, distance: "35 km" },
  };

  const selectedRate = rates[calcCorridor];
  const quintals = calcQuantity / 100;
  const soloTotal = Math.round(quintals * selectedRate.solo);
  const pooledTotal = Math.round(quintals * selectedRate.pooled);
  const savings = soloTotal - pooledTotal;
  const savingsPct = Math.round((savings / soloTotal) * 100);

  const handleBookSlot = (truckId: string) => {
    if (bookedIds.includes(truckId)) {
      setBookedIds(bookedIds.filter((id) => id !== truckId));
    } else {
      setBookedIds([...bookedIds, truckId]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fbf9f5] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2d8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-900 mb-1">
            <Truck className="w-4 h-4 text-emerald-800" />
            <span>Shared Logistics Network</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-stone-900 tracking-tight">
            RouteMesh™ Freight Pooling
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Never send half-empty trucks to the mandi. Pool capacity with verified nearby farmers along your corridor.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>Average 35–40% Freight Savings</span>
        </div>
      </div>

      {/* Comparison Strip & Live Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Pooling Calculator */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#e6e2d8] p-6 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
            <Calculator className="w-4 h-4 text-emerald-800" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Interactive Freight Savings Estimator
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Select Corridor
              </label>
              <select
                value={calcCorridor}
                onChange={(e) => setCalcCorridor(e.target.value as "pune-mumbai" | "nashik-mumbai" | "pune-local")}
                className="w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] text-xs text-stone-800 bg-stone-50 outline-none focus:border-emerald-800"
              >
                <option value="pune-mumbai">Pune ➔ Mumbai Vashi APMC Corridor (145 km)</option>
                <option value="nashik-mumbai">Nashik ➔ Mumbai Vashi APMC Corridor (165 km)</option>
                <option value="pune-local">Baramati / Haveli ➔ Pune Gultekdi Mandi (35 km)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Produce Quantity to Transport</span>
                <span className="text-emerald-900 font-bold">{calcQuantity.toLocaleString()} kg ({quintals} Quintals)</span>
              </div>
              <input
                type="range"
                min={500}
                max={10000}
                step={500}
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>500 kg (Small)</span>
                <span>5,000 kg (Medium)</span>
                <span>10,000 kg (Full Truckload)</span>
              </div>
            </div>

            {/* Savings Display Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Solo Truck Hire
                </span>
                <div className="font-serif text-2xl font-bold text-stone-900">
                  ₹{soloTotal.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-stone-500 block">
                  ₹{selectedRate.solo} / Quintal rate
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  RouteMesh Pooled
                </span>
                <div className="font-serif text-2xl font-bold text-emerald-900">
                  ₹{pooledTotal.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-emerald-800 block font-medium">
                  ₹{selectedRate.pooled} / Quintal rate
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-stone-900">
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                  Net Savings In Your Pocket
                </span>
                <span className="text-xs text-amber-900">
                  Save {savingsPct}% compared to traditional solo transport
                </span>
              </div>
              <div className="font-serif text-3xl font-bold text-emerald-900">
                +₹{savings.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* Right: How Corridor Matching Works */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#e6e2d8] p-6 shadow-xs space-y-5">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            How RouteMesh™ Corridors Work
          </h2>

          <div className="space-y-4 text-xs text-stone-700">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="p-2 rounded-lg bg-[#0b2b1d] text-amber-300 font-bold shrink-0">
                1
              </div>
              <div>
                <strong className="text-stone-900 block font-serif text-sm">Corridor Proximity Detection</strong>
                Our algorithm matches farmers along the same highway corridor who have compatible harvest schedules and perishability windows.
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="p-2 rounded-lg bg-[#0b2b1d] text-amber-300 font-bold shrink-0">
                2
              </div>
              <div>
                <strong className="text-stone-900 block font-serif text-sm">Proportional Capacity Split</strong>
                You only pay for the exact kilograms and quintals your produce takes up in the truck, not the empty vehicle return haul.
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="p-2 rounded-lg bg-[#0b2b1d] text-amber-300 font-bold shrink-0">
                3
              </div>
              <div>
                <strong className="text-stone-900 block font-serif text-sm">Farmer Privacy Protection</strong>
                Exact farm geolocation is kept private; coordination occurs at designated highway aggregation hubs (e.g. Talegaon Toll, Vashi Entry Gate).
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center space-x-2 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0" />
            <span>All drivers and commercial vehicles are verified with APMC Mandi passes and commercial goods insurance.</span>
          </div>
        </div>
      </div>

      {/* Available Shared Vehicles Looking for Co-loaders */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-normal text-stone-900">
          Available Trucks with Spare Capacity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <span>Pickup: <strong>{truck.origin}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Departing: <strong>{truck.departureTime}</strong></span>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-500">Capacity Filled: {loadPct}%</span>
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
                    <span className="text-xs text-stone-500">Shared Rate:</span>
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
                      <span>Capacity Slot Reserved</span>
                    </>
                  ) : (
                    <>
                      <span>Reserve Shared Space</span>
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
