"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Clock, Truck, IndianRupee } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { RecommendationResult } from "@/lib/recommendation";
import type { Language } from "@/lib/types";

interface MandiLeaderboardProps {
    recommendation: RecommendationResult | null;
    onSelectMandiId?: (mandiId: string) => void;
}

type Filter = "all" | "feasible";

export default function MandiLeaderboard({
    recommendation,
    onSelectMandiId,
}: MandiLeaderboardProps) {
    const { t, language } = useLanguage();
    const lang: Language = language ?? "en";
    const [isOpen, setIsOpen] = useState(true);
    const [filter, setFilter] = useState<Filter>("feasible");

    if (!recommendation) return null;

    const all = [...recommendation.allEvaluations]
        .filter((e) => e.pricePerKg > 0)
        .sort((a, b) => {
            if (a.feasible !== b.feasible) return a.feasible ? -1 : 1;
            return b.netRevenue - a.netRevenue;
        });

    const visible = filter === "feasible" ? all.filter((e) => e.feasible) : all;
    const feasibleCount = all.filter((e) => e.feasible).length;
    const totalCount = all.length;

    return (
        <div className="absolute top-4 left-4 z-30 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl border border-[#e6e2d8] shadow-xl overflow-hidden">

            <button
                onClick={() => setIsOpen((v) => !v)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-stone-50 transition-colors"
            >
                <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                        🎯 Mandi Comparison
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">
                        {feasibleCount}/{totalCount} feasible
                    </span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-stone-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400" />
                )}
            </button>

            {isOpen && (
                <>
                    <div className="px-4 pb-2 flex items-center space-x-1 text-[10px] font-medium">
                        <button
                            onClick={() => setFilter("feasible")}
                            className={`px-2.5 py-1 rounded-full transition-all ${filter === "feasible"
                                ? "bg-emerald-800 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                }`}
                        >
                            ✅ Feasible ({feasibleCount})
                        </button>
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-2.5 py-1 rounded-full transition-all ${filter === "all"
                                ? "bg-emerald-800 text-white"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                                }`}
                        >
                            All ({totalCount})
                        </button>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto border-t border-stone-100">
                        {visible.length === 0 && (
                            <div className="p-6 text-center text-xs text-stone-500">
                                No feasible mandis within {recommendation.sellingWindowHours}h window.
                                <br />
                                <span className="text-[10px] text-stone-400 mt-1 block">
                                    Try extending the selling window.
                                </span>
                            </div>
                        )}

                        {visible.map((e, idx) => {
                            const rank = idx + 1;
                            const isBest = e.feasible && rank === 1;

                            return (
                                <button
                                    key={e.mandiId}
                                    onClick={() => onSelectMandiId?.(e.mandiId)}
                                    className={`w-full text-left px-4 py-3 border-b border-stone-100 last:border-0 transition-colors hover:bg-emerald-50/40 ${isBest ? "bg-emerald-50/60" : ""
                                        } ${!e.feasible ? "opacity-60" : ""}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-1.5">
                                                <span
                                                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${isBest
                                                        ? "bg-amber-400 text-amber-950"
                                                        : e.feasible
                                                            ? "bg-emerald-100 text-emerald-900"
                                                            : "bg-stone-200 text-stone-500"
                                                        }`}
                                                >
                                                    {isBest ? "★" : rank}
                                                </span>
                                                <span
                                                    className={`font-semibold text-xs truncate ${isBest ? "text-emerald-900" : "text-stone-900"
                                                        }`}
                                                >
                                                    {e.mandiName}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[10px] text-stone-500">
                                                <span className="flex items-center space-x-0.5">
                                                    <IndianRupee className="w-2.5 h-2.5" />
                                                    <span>{e.pricePerKg.toFixed(2)}/kg</span>
                                                </span>
                                                <span className="flex items-center space-x-0.5">
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    <span>{e.distanceKm} km</span>
                                                </span>
                                                <span className="flex items-center space-x-0.5">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    <span>{e.travelTimeHours.toFixed(1)}h</span>
                                                </span>
                                                <span className="flex items-center space-x-0.5">
                                                    <Truck className="w-2.5 h-2.5" />
                                                    <span>₹{e.transportCost.toFixed(0)}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <div
                                                className={`font-bold text-xs ${e.feasible ? "text-emerald-800" : "text-stone-400 line-through"
                                                    }`}
                                            >
                                                ₹{e.netRevenue.toLocaleString("en-IN")}
                                            </div>
                                            <div className="text-[9px] text-stone-400">
                                                {e.feasible ? "net take-home" : "not feasible"}
                                            </div>
                                        </div>
                                    </div>

                                    {!e.feasible && e.infeasibleReason === "travel_time_exceeds_window" && (
                                        <div className="mt-1 text-[9px] text-amber-700 font-medium">
                                            ⚠ Travel {e.travelTimeHours.toFixed(1)}h &gt; {recommendation.sellingWindowHours}h window
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}