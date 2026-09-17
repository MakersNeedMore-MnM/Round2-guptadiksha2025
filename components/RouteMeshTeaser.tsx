"use client";

import React from "react";
import { Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RouteMeshTeaser() {
  const { t } = useLanguage();

  return (
    <section id="routemesh" className="py-16 lg:py-24 bg-[#fbf9f5] border-b border-[#e6e2d8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Editorial Photography Frame */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#e6e2d8] shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80"
                alt="Agricultural transport vehicle on rural highway"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-xl bg-stone-950/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                <span className="font-serif italic text-base font-normal">Pune $\rightarrow$ Mumbai Highway Corridor</span>
                <span className="px-2.5 py-1 bg-amber-400 text-stone-950 font-bold rounded-md uppercase text-[10px]">
                  35% Freight Savings
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Editorial Content */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
              {t.routeBadge}
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight leading-[1.15]">
              {t.routeTitle}
            </h2>

            <p className="text-base text-stone-600 font-normal leading-relaxed">
              {t.routeSubtitle}
            </p>

            {/* Editorial Comparison Table */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Solo Haul */}
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 space-y-2">
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">{t.routeTraditional}</span>
                <div className="font-serif text-2xl font-normal text-stone-900">{t.routeTraditionalCost} <span className="text-xs font-sans font-normal text-stone-500">{t.routeTraditionalUnit}</span></div>
                <div className="text-xs text-stone-500">{t.routeTraditionalDesc}</div>
              </div>

              {/* RouteMesh Shared */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">{t.routePooled}</span>
                <div className="font-serif text-2xl font-normal text-emerald-900">{t.routePooledCost} <span className="text-xs font-sans font-normal text-emerald-700">{t.routePooledUnit}</span></div>
                <div className="text-xs text-emerald-800">{t.routePooledDesc}</div>
              </div>

            </div>

            <div className="pt-2 text-xs text-stone-500 flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
              <span>{t.routePrivacy}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
