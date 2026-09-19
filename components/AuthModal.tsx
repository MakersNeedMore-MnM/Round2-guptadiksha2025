"use client";

import React, { useState } from "react";
import { X, Smartphone, Mail, ArrowRight, CheckCircle2, ShieldCheck, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: UserProfile) => void;
}

export interface UserProfile {
  name: string;
  phone?: string;
  email?: string;
  location: string;
  crops: string[];
  language: Language;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { t, language, setLanguage } = useLanguage();

  // Auth Modes: "login" -> "otp" -> "onboarding"
  const [authMode, setAuthMode] = useState<"login" | "otp" | "onboarding">("login");
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");

  // Inputs
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["1", "2", "3", "4", "5", "6"]);

  // Onboarding Form State (Section 31.2)
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Tomatoes", "Onions"]);
  const [prefLanguage, setPrefLanguage] = useState<Language>(language);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMode("otp");
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if user has an existing profile saved
    const existing = localStorage.getItem("farmoptima_user");
    if (existing) {
      const parsed = JSON.parse(existing);
      onLoginSuccess(parsed);
      onClose();
      window.location.reload();
    } else {
      // First-time login -> Trigger Onboarding Questions!
      setAuthMode("onboarding");
    }
  };

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const userProfile: UserProfile = {
      name: name || "Ramesh Patil",
      phone: loginMethod === "phone" ? phone || "9876543210" : undefined,
      email: loginMethod === "email" ? email || "farmer@farmoptima.in" : undefined,
      location: location || "Haveli, Pune",
      crops: selectedCrops.length > 0 ? selectedCrops : ["Tomatoes"],
      language: prefLanguage,
    };

    localStorage.setItem("farmoptima_user", JSON.stringify(userProfile));
    setLanguage(prefLanguage);
    onLoginSuccess(userProfile);
    onClose();
    window.location.reload();
  };

  const cropsList = [
    { id: "Tomatoes", label: t.cropTomatoes, icon: "🍅" },
    { id: "Onions", label: t.cropOnions, icon: "🧅" },
    { id: "Potatoes", label: t.cropPotatoes, icon: "🥔" },
    { id: "Soybeans", label: t.cropSoybeans, icon: "🌱" },
    { id: "Wheat", label: t.cropWheat, icon: "🌾" },
    { id: "Cotton", label: t.cropCotton, icon: "☁️" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#fbf9f5] rounded-3xl border border-[#e6e2d8] shadow-2xl overflow-hidden text-stone-900">

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-200/60 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: LOGIN (PHONE DEFAULT / EMAIL OPTION) */}
        {authMode === "login" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-900">
                FarmOptima Auth
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-950">
                Sign In to FarmOptima
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                Enter your mobile number to receive a one-time OTP password.
              </p>
            </div>

            {/* Login Method Toggle Pills */}
            <div className="flex rounded-xl bg-stone-200/60 p-1 text-xs font-medium">
              <button
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center space-x-1.5 ${loginMethod === "phone" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
                  }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-800" />
                <span>{t.authMobileTab}</span>
              </button>

              <button
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-2 rounded-lg text-center transition-all flex items-center justify-center space-x-1.5 ${loginMethod === "email" ? "bg-white text-stone-900 shadow-xs font-bold" : "text-stone-600 hover:text-stone-900"
                  }`}
              >
                <Mail className="w-3.5 h-3.5 text-stone-600" />
                <span>{t.authEmailTab}</span>
              </button>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {loginMethod === "phone" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-700">Mobile Number (India +91)</label>
                  <div className="flex items-center rounded-xl border border-[#e6e2d8] bg-white overflow-hidden shadow-2xs focus-within:border-emerald-800 focus-within:ring-1 focus-within:ring-emerald-800">
                    <span className="px-2 py-3 bg-stone-100 text-stone-600 text-xsm font-semibold border-r border-[#e6e2d8]">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-700">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="farmer@farmoptima.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 text-sm text-stone-900 placeholder-stone-400 rounded-xl border border-[#e6e2d8] bg-white outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-medium uppercase tracking-widest shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>{t.authSendOtp}</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
              <span>Secure authentication via Supabase Auth</span>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {authMode === "otp" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-900">
                OTP Verification
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-950">
                Enter Verification Code
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                {t.authEnterOtp} <strong className="text-stone-900">{loginMethod === "phone" ? `+91 ${phone || "9876543210"}` : email}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* 6 Digit OTP Inputs */}
              <div className="flex items-center justify-between space-x-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                    }}
                    className="w-11 h-12 text-center font-serif text-xl font-normal text-emerald-950 bg-white border border-[#e6e2d8] rounded-xl outline-none focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 shadow-2xs"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-medium uppercase tracking-widest shadow-md transition-all"
              >
                {t.authVerifyOtp}
              </button>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="hover:text-stone-900 underline"
                >
                  ← Change {loginMethod === "phone" ? "Number" : "Email"}
                </button>
                <button type="button" className="text-emerald-800 font-semibold hover:underline">
                  {t.authResendOtp}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: FIRST-TIME LOGIN ONBOARDING QUESTIONS (Section 31.2) */}
        {authMode === "onboarding" && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="space-y-1 border-b border-[#e6e2d8] pb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Step 2 of 2 • Welcome to FarmOptima
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-950">
                {t.authOnboardingTitle}
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                {t.authOnboardingSubtitle}
              </p>
            </div>

            <form onSubmit={handleCompleteOnboarding} className="space-y-5">

              {/* Question 1: Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800">
                  1. {t.authQuestionName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.authNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-stone-900 rounded-xl border border-[#e6e2d8] bg-white outline-none focus:border-emerald-800"
                />
              </div>

              {/* Question 2: Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800">
                  2. {t.authQuestionLocation} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.authLocationPlaceholder}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-stone-900 rounded-xl border border-[#e6e2d8] bg-white outline-none focus:border-emerald-800"
                />
              </div>

              {/* Question 3: Major Crops (Multi-select) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800 block">
                  3. {t.authQuestionCrops} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cropsList.map((crop) => {
                    const isSelected = selectedCrops.includes(crop.id);
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => toggleCrop(crop.id)}
                        className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${isSelected
                          ? "bg-emerald-50 border-emerald-800 text-emerald-950 font-bold"
                          : "bg-white border-[#e6e2d8] text-stone-700 hover:bg-stone-50"
                          }`}
                      >
                        <span className="flex items-center space-x-1.5">
                          <span>{crop.icon}</span>
                          <span>{crop.label}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-800" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 4: Preferred Language */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800 block">
                  4. {t.authQuestionLanguage} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setPrefLanguage("en")}
                    className={`py-2 rounded-xl text-center border transition-all ${prefLanguage === "en" ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold" : "bg-white border-[#e6e2d8] text-stone-700"
                      }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefLanguage("hi")}
                    className={`py-2 rounded-xl text-center border transition-all ${prefLanguage === "hi" ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold" : "bg-white border-[#e6e2d8] text-stone-700"
                      }`}
                  >
                    हिंदी
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefLanguage("mr")}
                    className={`py-2 rounded-xl text-center border transition-all ${prefLanguage === "mr" ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold" : "bg-white border-[#e6e2d8] text-stone-700"
                      }`}
                  >
                    मराठी
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-medium uppercase tracking-widest shadow-md transition-all pt-3"
              >
                {t.authCompleteBtn}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
