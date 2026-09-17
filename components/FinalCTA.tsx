"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FinalCTA() {
  const { t } = useLanguage();

  return (
    <section id="get-started" className="py-20 lg:py-24 bg-[#0b2b1d] text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8 relative z-10">
        
        <div className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
          {t.ctaBadge}
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-tight max-w-3xl mx-auto">
          {t.ctaTitle}
        </h2>

        <p className="text-emerald-100/80 text-base sm:text-lg font-normal max-w-xl mx-auto leading-relaxed">
          {t.ctaSubtitle}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#market-realization"
            className="inline-flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-medium uppercase tracking-widest px-8 py-4 rounded-full shadow-xl transition-all"
          >
            <span>{t.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
