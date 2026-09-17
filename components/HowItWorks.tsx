"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      num: "01",
      title: t.step1Title,
      desc: t.step1Desc,
    },
    {
      num: "02",
      title: t.step2Title,
      desc: t.step2Desc,
    },
    {
      num: "03",
      title: t.step3Title,
      desc: t.step3Desc,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-24 bg-[#f7f4ee] border-b border-[#e6e2d8]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Editorial Section Header */}
        <div className="max-w-xl mb-16 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
            {t.methodologyBadge}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight">
            {t.methodologyTitle}
          </h2>
        </div>

        {/* 3 Steps in Clean Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#fbf9f5] p-8 rounded-2xl border border-[#e6e2d8] shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="font-serif text-4xl font-normal text-emerald-900/40 block">
                  {item.num}
                </span>

                <h3 className="font-serif text-xl font-normal text-stone-900">
                  {item.title}
                </h3>

                <p className="text-sm font-normal text-stone-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e6e2d8] text-xs font-medium text-emerald-900">
                Phase {idx + 1} Pipeline →
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
