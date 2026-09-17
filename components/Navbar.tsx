"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, User, LogOut, Sprout } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "./LanguageSelector";
import AuthModal, { UserProfile } from "./AuthModal";

export default function Navbar() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Load user profile from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("farmoptima_user");
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing user profile", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farmoptima_user");
    setUserProfile(null);
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fbf9f5]/90 backdrop-blur-md border-b border-[#e6e2d8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo - Editorial Serif Typography */}
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="font-serif text-2xl font-normal tracking-tight text-amber-400">
                Farm<span className="font-serif italic font-medium text-emerald-800">Optima</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-medium uppercase tracking-widest text-stone-600">
              <a href="#market-realization" className="hover:text-emerald-900 transition-colors py-1">
                {t.navNetRealization}
              </a>
              <a href="#routemesh" className="hover:text-emerald-900 transition-colors py-1">
                {t.navRouteMesh}
              </a>
              <a href="#how-it-works" className="hover:text-emerald-900 transition-colors py-1">
                {t.navMethodology}
              </a>
            </nav>

            {/* Action CTAs + Language Selector + User Profile */}
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <LanguageSelector />

              {userProfile ? (
                /* Logged-In User Profile Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-900 text-white text-xs font-medium hover:bg-emerald-950 transition-colors shadow-2xs"
                  >
                    <User className="w-3.5 h-3.5 text-amber-300" />
                    <span>{userProfile.name}</span>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#e6e2d8] shadow-xl p-4 z-50 text-xs text-stone-800 space-y-3">
                      <div className="pb-2 border-b border-stone-100">
                        <div className="font-bold text-stone-900 text-sm">{userProfile.name}</div>
                        <div className="text-[11px] text-stone-500">{userProfile.location}</div>
                        {userProfile.phone && <div className="text-[11px] text-emerald-800 font-mono mt-0.5">+91 {userProfile.phone}</div>}
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <span className="text-stone-400 uppercase font-bold block text-[10px]">Crops:</span>
                        <div className="flex flex-wrap gap-1">
                          {userProfile.crops.map((crop, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left py-1.5 text-xs text-red-600 font-semibold hover:underline flex items-center space-x-1.5"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t.navLogout}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Logged-Out Log In Button */
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-stone-700 hover:text-stone-950 font-medium transition-colors text-xs uppercase tracking-wider px-3 py-1.5 rounded-full hover:bg-stone-100"
                >
                  {t.navLogIn}
                </button>
              )}

              <a
                href="#market-realization"
                className="inline-flex items-center space-x-1 bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-medium uppercase tracking-wider px-5 py-2.5 rounded-full shadow-xs transition-all"
              >
                <span>{t.navExplore}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* Mobile Menu & Language Toggle */}
            <div className="md:hidden flex items-center space-x-3">
              <LanguageSelector />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-stone-700 hover:text-stone-950"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-[#e6e2d8] bg-[#fbf9f5] px-4 space-y-4">
              <div className="flex flex-col space-y-3 text-sm font-medium text-stone-700">
                <a href="#market-realization" onClick={() => setIsMobileMenuOpen(false)}>
                  {t.navNetRealization}
                </a>
                <a href="#routemesh" onClick={() => setIsMobileMenuOpen(false)}>
                  {t.navRouteMesh}
                </a>
                <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>
                  {t.navMethodology}
                </a>
                <div className="pt-4 border-t border-stone-200 flex flex-col space-y-3">
                  {userProfile ? (
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-stone-900">{userProfile.name} ({userProfile.location})</div>
                      <button
                        onClick={handleLogout}
                        className="text-left font-medium text-red-600 text-xs"
                      >
                        {t.navLogout}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="text-left font-medium text-stone-800"
                    >
                      {t.navLogIn}
                    </button>
                  )}
                  <a
                    href="#market-realization"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center bg-[#0b2b1d] text-white font-medium text-xs uppercase tracking-wider py-3 rounded-full"
                  >
                    {t.navExplore}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth & Onboarding Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(profile) => setUserProfile(profile)}
      />
    </>
  );
}
