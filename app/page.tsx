"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarketVsRealization from "@/components/MarketVsRealization";
import RouteMeshTeaser from "@/components/RouteMeshTeaser";
import HowItWorks from "@/components/HowItWorks";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import DashboardPage from "./dashboard/page";
import { UserProfile } from "@/components/AuthModal";

export default function Home() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Persistent Session Check on mount
  useEffect(() => {
    const saved = localStorage.getItem("farmoptima_user");
    if (saved) {
      try {
        setUserProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing user session", e);
      }
    }
    setIsCheckingSession(false);
  }, []);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] flex items-center justify-center text-xs text-stone-500 font-medium">
        Loading FarmOptima Session...
      </div>
    );
  }

  // IF LOGGED IN: Render the Map-First Dashboard directly on / (Root)
  if (userProfile) {
    return <DashboardPage />;
  }

  // IF LOGGED OUT: Render Landing Page
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <MarketVsRealization />
        <RouteMeshTeaser />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
