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
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  userName?: string;
  userLocation?: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  userName = "Ramesh Patil",
  userLocation = "Haveli, Pune",
}: SidebarProps) {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: "dashboard", label: t.sidebarDashboard, icon: LayoutDashboard },
    { id: "harvest", label: t.sidebarMyHarvest, icon: Sprout },
    { id: "markets", label: t.sidebarMarkets, icon: Store },
    { id: "routemesh", label: t.sidebarRouteMesh, icon: Truck },
    { id: "recommendations", label: t.sidebarRecommendations, icon: Sparkles },
    { id: "profile", label: t.sidebarProfile, icon: User },
    { id: "settings", label: t.sidebarSettings, icon: Settings },
  ];

  return (
    <aside
      className={`relative z-30 bg-amber-150 text-stone-800 border-r border-amber-300 flex flex-col justify-between transition-all duration-300 shadow-xl ${isCollapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Top Header & Logo */}
      <div>
        <div className="h-20 px-6 flex items-center justify-between border-b border-amber-300">
          {!isCollapsed ? (
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

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-amber-200 text-amber-900 hover:bg-amber-300 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu Links */}
        <nav className="p-4 space-y-1 text-xs font-medium">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${isCollapsed ? "justify-center px-0 py-3" : "space-x-3 px-4 py-3"
                  } rounded-xl transition-all ${isActive
                    ? "bg-[#0b2b1d] text-amber-300 font-bold shadow-md"
                    : "text-stone-700 hover:bg-amber-200 hover:text-amber-900"
                  }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-amber-300" : "text-amber-800"
                    }`}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-amber-300 space-y-3">
        {!isCollapsed && (
          <div className="p-3 bg-amber-200/70 rounded-xl border border-amber-300 text-xs">
            <div className="font-serif text-sm font-normal text-stone-900">{userName}</div>
            <div className="text-[11px] text-stone-700">{userLocation}</div>
          </div>
        )}

        <button
          onClick={onLogout}
          className={`w-full flex items-center ${isCollapsed ? "justify-center px-0" : "space-x-2 px-3"
            } py-2.5 rounded-xl text-xs text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors font-medium`}
          title={t.navLogout}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>{t.navLogout}</span>}
        </button>
      </div>
    </aside>
  );
}