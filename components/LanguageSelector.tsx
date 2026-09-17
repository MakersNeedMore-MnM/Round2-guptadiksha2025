"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; nativeName: string }[] = [
    { code: "en", label: "English", nativeName: "English" },
    { code: "hi", label: "Hindi", nativeName: "हिंदी" },
    { code: "mr", label: "Marathi", nativeName: "मराठी" },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-[#e6e2d8] text-xs font-medium text-stone-800 transition-colors focus:outline-none"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-800" />
        <span>{currentLang.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-stone-500 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white border border-[#e6e2d8] shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 mb-1">
            Language / भाषा
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-emerald-50/60 transition-colors ${
                language === lang.code ? "text-emerald-900 font-bold bg-emerald-50/80" : "text-stone-700"
              }`}
            >
              <span>{lang.nativeName}</span>
              {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-800" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
