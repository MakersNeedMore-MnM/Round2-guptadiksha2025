"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#071d13] text-stone-400 py-16 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-emerald-900/40">
          
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-normal text-white">
                Farm<span className="italic text-amber-400">Optima</span>
              </span>
            </Link>
            <p className="text-xs text-stone-400 font-normal leading-relaxed max-w-sm">
              {t.footerDesc}
            </p>
          </div>

          <div className="md:col-span-3 space-y-3 text-xs">
            <div className="font-serif text-sm text-stone-200 uppercase tracking-wider mb-2">{t.footerPlatform}</div>
            <ul className="space-y-2.5">
              <li><a href="#market-realization" className="hover:text-white transition-colors">{t.navNetRealization}</a></li>
              <li><a href="#routemesh" className="hover:text-white transition-colors">{t.navRouteMesh}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{t.navMethodology}</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3 text-xs">
            <div className="font-serif text-sm text-stone-200 uppercase tracking-wider mb-2">{t.footerDataFeeds}</div>
            <p className="text-stone-400 font-normal leading-relaxed">
              {t.footerFeedsDesc}
            </p>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-normal">
          <div>© {new Date().getFullYear()} FarmOptima. {t.footerRights}</div>
          <div className="mt-2 sm:mt-0">Designed for Agricultural Selling Optimization</div>
        </div>
      </div>
    </footer>
  );
}
