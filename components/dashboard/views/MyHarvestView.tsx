"use client";

import React, { useState } from "react";
import { Sprout, Plus, Calendar, ArrowUpRight, TrendingUp, AlertCircle, X, Scale } from "lucide-react";

interface HarvestBatch {
  id: string;
  crop: string;
  emoji: string;
  quantityKg: number;
  harvestDate: string;
  ageDays: number;
  location: string;
  grade: "Grade A (Export/Premium)" | "Grade B (Standard APMC)" | "Grade C (Local Processing)";
  status: "Ready to Sell" | "Stored" | "In Transit";
  estimatedNetPerKg: number;
}

const INITIAL_BATCHES: HarvestBatch[] = [
  {
    id: "batch-1",
    crop: "Tomatoes",
    emoji: "🍅",
    quantityKg: 5000,
    harvestDate: "2026-09-18",
    ageDays: 2,
    location: "Haveli, Pune",
    grade: "Grade A (Export/Premium)",
    status: "Ready to Sell",
    estimatedNetPerKg: 28.5,
  },
  {
    id: "batch-2",
    crop: "Onions",
    emoji: "🧅",
    quantityKg: 10000,
    harvestDate: "2026-09-15",
    ageDays: 5,
    location: "Niphad, Nashik",
    grade: "Grade A (Export/Premium)",
    status: "Stored",
    estimatedNetPerKg: 24.7,
  },
  {
    id: "batch-3",
    crop: "Soybeans",
    emoji: "🌱",
    quantityKg: 3500,
    harvestDate: "2026-09-12",
    ageDays: 8,
    location: "Baramati, Pune",
    grade: "Grade B (Standard APMC)",
    status: "Ready to Sell",
    estimatedNetPerKg: 43.2,
  },
  {
    id: "batch-4",
    crop: "Potatoes",
    emoji: "🥔",
    quantityKg: 6200,
    harvestDate: "2026-09-14",
    ageDays: 6,
    location: "Manchar, Pune",
    grade: "Grade B (Standard APMC)",
    status: "Stored",
    estimatedNetPerKg: 18.2,
  },
];

interface MyHarvestViewProps {
  onSelectCropForMandi?: (cropName: string) => void;
}

export default function MyHarvestView({ onSelectCropForMandi }: MyHarvestViewProps) {
  const [batches, setBatches] = useState<HarvestBatch[]>(INITIAL_BATCHES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New batch form state
  const [newCrop, setNewCrop] = useState("Tomatoes");
  const [newQuantity, setNewQuantity] = useState(3000);
  const [newDate, setNewDate] = useState("2026-09-19");
  const [newGrade, setNewGrade] = useState<HarvestBatch["grade"]>("Grade A (Export/Premium)");
  const [newLocation, setNewLocation] = useState("Haveli, Pune");

  const cropEmojis: Record<string, string> = {
    Tomatoes: "🍅",
    Onions: "🧅",
    Potatoes: "🥔",
    Soybeans: "🌱",
    Wheat: "🌾",
    Cotton: "☁️",
    Mango: "🥭",
    Grapes: "🍇",
  };

  const totalQuantityKg = batches.reduce((acc, b) => acc + b.quantityKg, 0);
  const totalEstimatedValue = batches.reduce((acc, b) => acc + b.quantityKg * b.estimatedNetPerKg, 0);
  const readyToSellCount = batches.filter((b) => b.status === "Ready to Sell").length;

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: HarvestBatch = {
      id: `batch-${Date.now()}`,
      crop: newCrop,
      emoji: cropEmojis[newCrop] || "🌾",
      quantityKg: Number(newQuantity),
      harvestDate: newDate,
      ageDays: 1,
      location: newLocation,
      grade: newGrade,
      status: "Ready to Sell",
      estimatedNetPerKg: newCrop === "Tomatoes" ? 28.5 : newCrop === "Onions" ? 24.7 : 30.0,
    };
    setBatches([newBatch, ...batches]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#fbf9f5] space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e6e2d8] pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-emerald-900 mb-1">
            <Sprout className="w-4 h-4 text-emerald-800" />
            <span>Farm Inventory & Harvest Tracking</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-stone-900 tracking-tight">
            My Harvest Batches
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track produce harvested from your fields, monitor crop aging, and find the optimal mandi destination.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-full bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Harvest</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#e6e2d8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400">
            <span>Total Logged Produce</span>
            <Scale className="w-4 h-4 text-stone-500" />
          </div>
          <div className="font-serif text-3xl font-normal text-stone-900">
            {(totalQuantityKg / 100).toFixed(0)} <span className="text-sm font-sans font-normal text-stone-500">Quintals ({totalQuantityKg.toLocaleString()} kg)</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium">
            Across {batches.length} active crop batches
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e6e2d8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400">
            <span>Est. Net Realization Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-serif text-3xl font-normal text-emerald-900">
            ₹ {totalEstimatedValue.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-stone-500">
            Net take-home after freight & APMC deductions
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e6e2d8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-400">
            <span>Immediate Selling Window</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-serif text-3xl font-normal text-amber-800">
            {readyToSellCount} Batches Ready
          </div>
          <p className="text-[11px] text-amber-900 font-medium">
            High perishability crops requiring transport today
          </p>
        </div>
      </div>

      {/* Harvest Batches Listing */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-normal text-stone-900">
          Active Batches in Storage / Field
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white rounded-2xl border border-[#e6e2d8] p-5 shadow-2xs hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl p-2 rounded-xl bg-amber-50 border border-amber-200">
                    {batch.emoji}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {batch.crop}
                    </h3>
                    <div className="text-xs text-stone-500 flex items-center space-x-2">
                      <span>{batch.location}</span>
                      <span>•</span>
                      <span>{batch.grade}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    batch.status === "Ready to Sell"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                      : "bg-amber-50 text-amber-900 border-amber-300"
                  }`}
                >
                  {batch.status}
                </span>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Quantity</span>
                  <span className="font-semibold text-stone-800 text-sm">
                    {batch.quantityKg.toLocaleString()} kg
                  </span>
                  <span className="text-[10px] text-stone-500 block">({(batch.quantityKg / 100).toFixed(1)} Qtl)</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Harvest Age</span>
                  <span className="font-semibold text-stone-800 text-sm">
                    {batch.ageDays} {batch.ageDays === 1 ? "day" : "days"}
                  </span>
                  <span className="text-[10px] text-stone-500 block">{batch.harvestDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Est. Net Take-home</span>
                  <span className="font-semibold text-emerald-800 text-sm">
                    ₹{batch.estimatedNetPerKg}/kg
                  </span>
                  <span className="text-[10px] text-emerald-900 font-bold block">
                    ₹{(batch.quantityKg * batch.estimatedNetPerKg).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-stone-500 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Harvested on {batch.harvestDate}</span>
                </span>

                <button
                  onClick={() => onSelectCropForMandi?.(batch.crop)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-medium transition-colors shadow-2xs"
                >
                  <span>Find Best Mandi</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Harvest Batch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#fbf9f5] rounded-3xl border border-[#e6e2d8] shadow-2xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-900">
                New Harvest Entry
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-950 mt-1">
                Log Fresh Produce Batch
              </h3>
              <p className="text-xs text-stone-500">
                Enter details of your fresh harvest to evaluate net realization across Maharashtra mandis.
              </p>
            </div>

            <form onSubmit={handleAddBatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Crop</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-sm text-stone-800 outline-none"
                  >
                    <option value="Tomatoes">🍅 Tomatoes</option>
                    <option value="Onions">🧅 Red Onions</option>
                    <option value="Potatoes">🥔 Potatoes</option>
                    <option value="Soybeans">🌱 Soybeans</option>
                    <option value="Wheat">🌾 Wheat</option>
                    <option value="Cotton">☁️ Cotton</option>
                    <option value="Mango">🥭 Mango</option>
                    <option value="Grapes">🍇 Grapes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Quantity (kg)</label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-sm text-stone-800 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Harvest Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-sm text-stone-800 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Origin / Farm Location</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Haveli, Pune"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-sm text-stone-800 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Produce Grade</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value as HarvestBatch["grade"])}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#e6e2d8] bg-white text-sm text-stone-800 outline-none"
                >
                  <option value="Grade A (Export/Premium)">Grade A (Export / High APMC Bid)</option>
                  <option value="Grade B (Standard APMC)">Grade B (Standard APMC Market)</option>
                  <option value="Grade C (Local Processing)">Grade C (Local / Processing)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                >
                  Save Harvest Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
