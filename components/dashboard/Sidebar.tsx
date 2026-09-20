"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Sprout,
  Store,
  Truck,
  Sparkles,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  X,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName?: string;
  userLocation?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  userName = "Ramesh Patil",
  userLocation = "Haveli, Pune",
  isOpenMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: t.sidebarDashboard, icon: LayoutDashboard },
    { id: "harvest", label: t.sidebarMyHarvest, icon: Sprout },
    { id: "markets", label: t.sidebarMarkets, icon: Store },
    { id: "routemesh", label: t.sidebarRouteMesh, icon: Truck },
    { id: "recommendations", label: t.sidebarRecommendations, icon: Sparkles },
    { id: "chatbot", label: t.sidebarAiAgent || "AI Agent (Q&A)", icon: MessageSquare },
    { id: "profile", label: t.sidebarProfile, icon: User },
    { id: "settings", label: t.sidebarSettings, icon: Settings },
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 md:relative md:z-30 bg-[#fbf9f5] text-stone-800 border-r border-[#e6e2d8] flex flex-col justify-between transition-all duration-300 shadow-2xl md:shadow-none ${
          isOpenMobile ? "translate-x-0 w-72" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        {/* Top Header & Logo */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#e6e2d8]">
            {!isCollapsed || isOpenMobile ? (
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-serif text-2xl font-normal text-stone-900">
                  Farm<span className="italic text-amber-700">Optima</span>
                </span>
              </Link>
            ) : (
              <Link href="/" className="mx-auto font-serif text-2xl font-bold text-amber-700">
                F<span className="text-stone-900">O</span>
              </Link>
            )}

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-3 space-y-1 text-xs font-medium overflow-y-auto max-h-[calc(100vh-160px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const collapsedOnDesktop = isCollapsed && !isOpenMobile;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center ${
                    collapsedOnDesktop ? "justify-center px-0 py-3" : "space-x-3 px-3.5 py-3"
                  } rounded-xl transition-all ${
                    isActive
                      ? "bg-[#0b2b1d] text-amber-300 font-bold shadow-sm ring-1 ring-amber-400/30"
                      : "text-stone-700 hover:bg-amber-100/60 hover:text-stone-950"
                  }`}
                  title={collapsedOnDesktop ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-amber-300" : "text-amber-800"
                    }`}
                  />
                  {(!isCollapsed || isOpenMobile) && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-3 border-t border-[#e6e2d8] space-y-2">
          {(!isCollapsed || isOpenMobile) && (
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <div className="font-serif text-sm font-semibold text-stone-900 truncate">{userName}</div>
              <div className="text-[11px] text-stone-600 truncate">{userLocation}</div>
            </div>
          )}

          <button
            onClick={onLogout}
            className={`w-full flex items-center ${
              isCollapsed && !isOpenMobile ? "justify-center px-0" : "space-x-2 px-3"
            } py-2.5 rounded-xl text-xs text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors font-medium`}
            title={t.navLogout}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!isCollapsed || isOpenMobile) && <span>{t.navLogout}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}