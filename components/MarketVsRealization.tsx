"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function MarketVsRealization() {
  const { t } = useLanguage();
  const [activeCrop, setActiveCrop] = useState<"tomato" | "onion">("tomato");

  const cropData = {
    tomato: {
      name: t.cropTomatoes,
      quantity: "5,000 kg (50 Qtl)",
      origin: "Pune, Maharashtra",
      headlinePrice: 34.0,
      transport: 4.20,
      fees: 0.80,
      spoilage: 0.50,
      netPrice: 28.50,
      netTotal: "₹ 1,42,500",
      altNet: "₹ 1,34,000",
    },
    onion: {
      name: t.cropOnions,
      quantity: "10,000 kg (100 Qtl)",
      origin: "Nashik, Maharashtra",
      headlinePrice: 28.0,
      transport: 2.50,
      fees: 0.60,
      spoilage: 0.20,
      netPrice: 24.70,
      netTotal: "₹ 2,47,000",
      altNet: "₹ 2,28,000",
    },
  };

  const current = cropData[activeCrop];

  return (
    <section id="market-realization" className="py-16 lg:py-24 bg-[#f7f4ee] border-b border-[#e6e2d8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Editorial Section Intro */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
            {t.mockupBadge}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight">
            {t.mockupTitle}
          </h2>
          <p className="text-base text-stone-600 font-normal leading-relaxed">
            {t.mockupSubtitle}
          </p>
        </div>

        {/* High-Fidelity Web Application Screenshot Mockup Frame */}
        <div className="bg-stone-900 rounded-2xl p-2 sm:p-3 shadow-2xl border border-stone-800 max-w-6xl mx-auto">
          
          {/* macOS Style Window Header */}
          <div className="bg-stone-900 px-4 py-2.5 flex items-center justify-between text-xs text-stone-400 border-b border-stone-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            </div>
            
            <div className="px-4 py-1 rounded-md bg-stone-800/90 text-stone-300 text-[11px] font-mono flex items-center space-x-2">
              <span className="text-emerald-400">https://</span>
              <span>app.farmoptima.in/net-realization</span>
            </div>

            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AGMARKNET Live Feed</span>
            </div>
          </div>

          {/* App Body - Clean Product UI Preview */}
          <div className="bg-white rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 text-stone-800 text-xs">
            
            {/* Sidebar Controls */}
            <div className="lg:col-span-3 bg-stone-50/80 p-5 border-b lg:border-b-0 lg:border-r border-stone-200 space-y-6">
              <div>
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                  {t.mockupCropSelection}
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveCrop("tomato")}
                    className={`w-full text-left p-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
                      activeCrop === "tomato"
                        ? "bg-[#0b2b1d] text-white shadow-xs"
                        : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    <span>🍅 {t.cropTomatoes}</span>
                    <span className="text-[10px] opacity-75">5,000 kg</span>
                  </button>

                  <button
                    onClick={() => setActiveCrop("onion")}
                    className={`w-full text-left p-3 rounded-lg font-medium flex items-center justify-between transition-colors ${
                      activeCrop === "onion"
                        ? "bg-[#0b2b1d] text-white shadow-xs"
                        : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    <span>🧅 {t.cropOnions}</span>
                    <span className="text-[10px] opacity-75">10,000 kg</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-200">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {t.mockupLocation}
                </div>
                <div className="p-3 bg-white rounded-lg border border-stone-200 font-medium text-stone-800">
                  {current.origin}
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
                💡 {t.mockupDynamicMath}
              </div>
            </div>

            {/* Main Workspace Dashboard View */}
            <div className="lg:col-span-9 p-6 space-y-6">
              
              {/* Dashboard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                    {t.mockupResultsTitle}
                  </span>
                  <h3 className="font-serif text-xl font-normal text-stone-900">
                    {t.mockupResultsHeader}
                  </h3>
                </div>

                <div className="text-right bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">{t.mockupEstNetTakehome}</span>
                  <span className="font-serif text-2xl font-normal text-emerald-950">{current.netTotal}</span>
                </div>
              </div>

              {/* Mandi Ranking Table View */}
              <div className="space-y-3">
                
                {/* Option 1 - WINNER */}
                <div className="p-4 rounded-xl border-2 border-emerald-800 bg-emerald-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 bg-[#0b2b1d] text-amber-300 text-[10px] font-bold uppercase rounded">
                        {t.mockupOptimalChoice}
                      </span>
                      <h4 className="font-serif text-base font-normal text-stone-900">{t.mockupMandiMumbai}</h4>
                    </div>
                    <div className="text-[11px] text-stone-500 font-normal">
                      {t.mockupMandiMumbaiDetails}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <div className="text-[10px] text-stone-400 line-through">₹{current.headlinePrice.toFixed(2)}/kg</div>
                      <div className="font-serif text-lg font-normal text-emerald-900">₹{current.netPrice.toFixed(2)} <span className="text-xs font-sans text-stone-500">{t.mockupNetPerKg}</span></div>
                    </div>
                    <div className="pl-4 border-l border-stone-200">
                      <div className="text-[10px] text-stone-500">{t.mockupTotalTakehome}</div>
                      <div className="font-bold text-stone-900 text-sm">{current.netTotal}</div>
                    </div>
                  </div>
                </div>

                {/* Option 2 */}
                <div className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-stone-600">
                  <div>
                    <div className="font-serif text-base font-normal text-stone-800">{t.mockupMandiPune}</div>
                    <div className="text-[11px] text-stone-400">{t.mockupMandiPuneDetails}</div>
                  </div>
                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <div className="text-[10px] text-stone-400 line-through">₹32.00/kg</div>
                      <div className="font-bold text-stone-800 text-sm">₹26.80 <span className="text-xs font-normal">{t.mockupNetPerKg}</span></div>
                    </div>
                    <div className="pl-4 border-l border-stone-200">
                      <div className="text-[10px] text-stone-400">{t.mockupTotalTakehome}</div>
                      <div className="font-medium text-stone-700 text-sm">{current.altNet}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Cost Deduction Breakdown Strip */}
              <div className="pt-4 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center text-[11px]">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <span className="text-stone-400 block font-medium">{t.mockupGrossMandiRate}</span>
                  <span className="font-bold text-stone-800 text-sm mt-0.5 block">₹{current.headlinePrice.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-red-50/50 rounded-lg border border-red-200 text-red-900">
                  <span className="text-red-700 block font-medium">{t.mockupFreightCost}</span>
                  <span className="font-bold text-red-700 text-sm mt-0.5 block">− ₹{current.transport.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-red-50/50 rounded-lg border border-red-200 text-red-900">
                  <span className="text-red-700 block font-medium">{t.mockupMandiFees}</span>
                  <span className="font-bold text-red-700 text-sm mt-0.5 block">− ₹{current.fees.toFixed(2)}</span>
                </div>
                <div className="p-3 bg-[#0b2b1d] text-white rounded-lg col-span-2 sm:col-span-1">
                  <span className="text-amber-300 block font-medium">{t.mockupNetRealizationLabel}</span>
                  <span className="font-serif text-sm font-normal text-amber-300 mt-0.5 block">₹{current.netPrice.toFixed(2)}/kg</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
