"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarketVsRealization from "@/components/MarketVsRealization";
import RouteMeshTeaser from "@/components/RouteMeshTeaser";
import HowItWorks from "@/components/HowItWorks";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fbf9f5]">
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
