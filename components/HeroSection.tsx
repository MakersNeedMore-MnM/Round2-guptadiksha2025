"use client";

import React from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="py-12 lg:py-20 bg-[#fbf9f5] border-b border-[#e6e2d8]/60">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Minimal Editorial Category */}
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
              {t.heroBadge}
            </div>

            {/* Serif Display Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-950 tracking-tight leading-[1.15]">
              {t.heroTitlePrefix}
              <em className="italic font-medium text-emerald-800">{t.heroTitleItalic}</em>
              {t.heroTitleSuffix}
            </h1>

            {/* Subtitle - Medium weight, direct, spacious */}
            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl">
              {t.heroSubtitle}
            </p>

            {/* Editorial CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-5">
              <a
                href="#market-realization"
                className="inline-flex items-center justify-center space-x-2 bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-medium uppercase tracking-widest px-8 py-4 rounded-full transition-all shadow-sm"
              >
                <span>{t.heroCtaCalculate}</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </a>

              <a
                href="#routemesh"
                className="inline-flex items-center justify-center space-x-1.5 text-stone-700 hover:text-stone-950 text-xs font-medium uppercase tracking-wider py-2 transition-colors border-b border-stone-300 hover:border-stone-900"
              >
                <span>{t.heroCtaRouteMesh}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Editorial Stat Strip */}
            <div className="pt-8 border-t border-[#e6e2d8] grid grid-cols-2 gap-6 text-stone-800">
              <div>
                <div className="font-serif text-3xl font-normal text-emerald-900">{t.heroStatGainVal}</div>
                <div className="text-xs text-stone-500 font-normal mt-0.5">{t.heroStatGainLabel}</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-normal text-amber-800">{t.heroStatSavedVal}</div>
                <div className="text-xs text-stone-500 font-normal mt-0.5">{t.heroStatSavedLabel}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Authentic Editorial Farmer & Farmland Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Photo Wrapper with Editorial Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#e6e2d8] bg-stone-100 group">
                <img
                  src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80"
                  alt="Indian farmer in agricultural farm field"
                  className="w-full h-[480px] sm:h-[540px] object-cover object-center transition-transform duration-700 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

                {/* Editorial Photo Caption Badge */}
                <div className="absolute bottom-6 left-6 right-6 text-white p-5 rounded-xl bg-stone-950/60 backdrop-blur-md border border-white/10 space-y-1">
                  <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                    {t.heroTestimonialLocation}
                  </div>
                  <p className="font-serif text-base sm:text-lg font-normal text-white italic">
                    {t.heroTestimonial}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
