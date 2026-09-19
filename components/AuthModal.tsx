"use client";

import React, { useState } from "react";
import { X, Lock, User, ArrowRight, ShieldCheck, Check, Sparkles, UserPlus, LogIn, MapPin, Sprout } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: UserProfile) => void;
}

export interface UserProfile {
  username?: string;
  name: string;
  location: string;
  crops: string[];
  acres?: string;
  language: Language;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const { t, language, setLanguage } = useLanguage();

  // Modes: "login" (Sign In) | "register" (Create Account) | "onboarding" (Fill Details: Name, Location, Harvest)
  const [authMode, setAuthMode] = useState<"login" | "register" | "onboarding">("login");

  // Credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Details (Step 2: Name, Location, Harvest Crops, Acres, Language)
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [acres, setAcres] = useState("5.0");
  const [selectedCrops, setSelectedCrops] = useState<string[]>(["Tomatoes", "Onions"]);
  const [prefLanguage, setPrefLanguage] = useState<Language>(language);

  if (!isOpen) return null;

  // Handle Sign In with Username & Password
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    // Check if account already exists with saved details
    const existing = localStorage.getItem("farmoptima_user");
    if (existing) {
      try {
        const parsed = JSON.parse(existing) as UserProfile;
        // If user already has profile details filled out
        if (parsed.name && parsed.location) {
          onLoginSuccess(parsed);
          onClose();
          window.location.href = "/dashboard";
          return;
        }
      } catch (err) {
        console.error("Error reading profile", err);
      }
    }

    // If profile details not yet completed, proceed to Onboarding step (Name, Location, Harvest)
    setName(username.charAt(0).toUpperCase() + username.slice(1));
    setAuthMode("onboarding");
  };

  // Handle Create Account
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please enter a username and password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    // Move directly to Step 2: Details (Name, Location, Harvest, Language)
    setName(username.charAt(0).toUpperCase() + username.slice(1));
    setAuthMode("onboarding");
  };

  // 1-Click Demo Fill
  const handleFillDemo = () => {
    setUsername("ramesh_patil");
    setPassword("kisan2026");
    setErrorMsg("");
  };

  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      setSelectedCrops(selectedCrops.filter((c) => c !== crop));
    } else {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  // Final Step: Complete Profile & Launch Dashboard
  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    const userProfile: UserProfile = {
      username: username || "ramesh_patil",
      name: name || "Ramesh Patil",
      location: location || "Haveli, Pune",
      crops: selectedCrops.length > 0 ? selectedCrops : ["Tomatoes", "Onions"],
      acres: acres || "5.0",
      language: prefLanguage,
    };

    localStorage.setItem("farmoptima_user", JSON.stringify(userProfile));
    setLanguage(prefLanguage);
    onLoginSuccess(userProfile);
    onClose();
    window.location.href = "/dashboard";
  };

  const cropsList = [
    { id: "Tomatoes", label: t.cropTomatoes, icon: "🍅" },
    { id: "Onions", label: t.cropOnions, icon: "🧅" },
    { id: "Potatoes", label: t.cropPotatoes, icon: "🥔" },
    { id: "Soybeans", label: t.cropSoybeans, icon: "🌱" },
    { id: "Wheat", label: t.cropWheat, icon: "🌾" },
    { id: "Cotton", label: t.cropCotton, icon: "☁️" },
    { id: "Mango", label: t.cropMango || "Mango", icon: "🥭" },
    { id: "Grapes", label: t.cropGrapes || "Grapes", icon: "🍇" },
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

        {/* ========================================================================= */}
        {/* VIEW 1: SIGN IN (USERNAME & PASSWORD)                                      */}
        {/* ========================================================================= */}
        {authMode === "login" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-900">
                FarmOptima Account
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-950">
                Sign In to FarmOptima
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                Enter your username and password to access your Mandi Intelligence Dashboard.
              </p>
            </div>

            {/* Toggle between Sign In and Create Account */}
            <div className="flex rounded-xl bg-stone-200/70 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setErrorMsg(""); }}
                className="flex-1 py-2 rounded-lg text-center transition-all bg-white text-stone-900 shadow-xs font-bold flex items-center justify-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-800" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
                className="flex-1 py-2 rounded-lg text-center transition-all text-stone-600 hover:text-stone-900 flex items-center justify-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700">Username</label>
                <div className="flex items-center rounded-xl border border-[#e6e2d8] bg-white overflow-hidden shadow-2xs focus-within:border-emerald-800 focus-within:ring-1 focus-within:ring-emerald-800">
                  <span className="px-3 py-3 bg-stone-100 text-stone-500 border-r border-[#e6e2d8]">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ramesh_patil"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700">Password</label>
                <div className="flex items-center rounded-xl border border-[#e6e2d8] bg-white overflow-hidden shadow-2xs focus-within:border-emerald-800 focus-within:ring-1 focus-within:ring-emerald-800">
                  <span className="px-3 py-3 bg-stone-100 text-stone-500 border-r border-[#e6e2d8]">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none"
                  />
                </div>
              </div>

              {/* Demo Helper */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-amber-800 hover:text-amber-900 font-medium flex items-center space-x-1 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fill Demo (ramesh_patil)</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
                  className="text-emerald-800 hover:underline font-semibold"
                >
                  New user? Create Account
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-medium uppercase tracking-widest shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Sign In & Continue</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
              <span>Secure Farmer Login • AGMARKNET Intelligence</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CREATE ACCOUNT (NEW USER REGISTER)                                */}
        {/* ========================================================================= */}
        {authMode === "register" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-900">
                New Farmer Registration
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-950">
                Create an Account
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                Choose a username and password to create your FarmOptima account.
              </p>
            </div>

            {/* Toggle between Sign In and Create Account */}
            <div className="flex rounded-xl bg-stone-200/70 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => { setAuthMode("login"); setErrorMsg(""); }}
                className="flex-1 py-2 rounded-lg text-center transition-all text-stone-600 hover:text-stone-900 flex items-center justify-center space-x-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
                className="flex-1 py-2 rounded-lg text-center transition-all bg-white text-stone-900 shadow-xs font-bold flex items-center justify-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-800" />
                <span>Create Account</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700">Choose Username</label>
                <div className="flex items-center rounded-xl border border-[#e6e2d8] bg-white overflow-hidden shadow-2xs focus-within:border-emerald-800 focus-within:ring-1 focus-within:ring-emerald-800">
                  <span className="px-3 py-3 bg-stone-100 text-stone-500 border-r border-[#e6e2d8]">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. kisan_pune"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700">Password</label>
                <div className="flex items-center rounded-xl border border-[#e6e2d8] bg-white overflow-hidden shadow-2xs focus-within:border-emerald-800 focus-within:ring-1 focus-within:ring-emerald-800">
                  <span className="px-3 py-3 bg-stone-100 text-stone-500 border-r border-[#e6e2d8]">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-700">Confirm Password</label>
                <div className="flex items-center rounded-xl border border-[#e6e2d8] bg-white overflow-hidden shadow-2xs focus-within:border-emerald-800 focus-within:ring-1 focus-within:ring-emerald-800">
                  <span className="px-3 py-3 bg-stone-100 text-stone-500 border-r border-[#e6e2d8]">
                    <Check className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-3 text-sm text-stone-900 placeholder-stone-400 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-medium uppercase tracking-widest shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Continue to Profile Setup</span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </button>

              <div className="text-center text-xs text-stone-500 pt-1">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setErrorMsg(""); }}
                  className="text-emerald-800 font-semibold hover:underline"
                >
                  Sign In here
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: ONBOARDING DETAILS (NAME, LOCATION, HARVEST CROPS, LANGUAGE)       */}
        {/* ========================================================================= */}
        {authMode === "onboarding" && (
          <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="space-y-1 border-b border-[#e6e2d8] pb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                Step 2 • Complete Farmer Profile
              </span>
              <h3 className="font-serif text-2xl font-normal text-stone-950">
                {t.authOnboardingTitle}
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                Please provide your name, location, and harvest crops before opening your Mandi Map Canvas.
              </p>
            </div>

            <form onSubmit={handleCompleteOnboarding} className="space-y-4">

              {/* Question 1: Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-800" />
                  <span>1. {t.authQuestionName}</span>
                  <span className="text-red-500">*</span>
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

              {/* Question 2: Place / Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  <span>2. {t.authQuestionLocation}</span>
                  <span className="text-red-500">*</span>
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

              {/* Question 3: Major Harvest / Crops (Multi-select) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800 flex items-center space-x-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-800" />
                  <span>3. {t.authQuestionCrops}</span>
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cropsList.map((crop) => {
                    const isSelected = selectedCrops.includes(crop.id);
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => toggleCrop(crop.id)}
                        className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                          isSelected
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

              {/* Question 4: Cultivated Land Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800 block">
                  4. Farm Land Size (Acres)
                </label>
                <div className="flex items-center rounded-xl border border-[#e6e2d8] overflow-hidden bg-white">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={acres}
                    onChange={(e) => setAcres(e.target.value)}
                    className="w-full px-4 py-2 text-sm text-stone-900 outline-none"
                  />
                  <span className="px-3 py-2 bg-stone-100 text-stone-600 text-xs font-medium border-l border-[#e6e2d8]">
                    Acres
                  </span>
                </div>
              </div>

              {/* Question 5: Preferred Language */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800 block">
                  5. {t.authQuestionLanguage} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setPrefLanguage("en")}
                    className={`py-2 rounded-xl text-center border transition-all ${
                      prefLanguage === "en" ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold" : "bg-white border-[#e6e2d8] text-stone-700"
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefLanguage("hi")}
                    className={`py-2 rounded-xl text-center border transition-all ${
                      prefLanguage === "hi" ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold" : "bg-white border-[#e6e2d8] text-stone-700"
                    }`}
                  >
                    हिंदी
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefLanguage("mr")}
                    className={`py-2 rounded-xl text-center border transition-all ${
                      prefLanguage === "mr" ? "bg-[#0b2b1d] text-white border-[#0b2b1d] font-bold" : "bg-white border-[#e6e2d8] text-stone-700"
                    }`}
                  >
                    मराठी
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#0b2b1d] hover:bg-[#143e2c] text-white text-xs font-bold uppercase tracking-widest shadow-md transition-all pt-3 flex items-center justify-center space-x-2"
              >
                <span>Launch Mandi Map Dashboard</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
