// lib/recommendation.ts
//
// FarmOptima "Best Mandi" recommendation engine.
//
// Flow (per spec):
//   ALL CANDIDATE MANDIS
//           ↓
//   Calculate road distance (from origin)
//           ↓
//   Calculate travel time
//           ↓
//   Check urgency  ──► NOT FEASIBLE  ──► REMOVE from ranking
//           │
//           └──► FEASIBLE
//                    ↓
//            Calculate gross revenue
//                    ↓
//            Calculate transport cost
//                    ↓
//            Calculate other selling costs
//                    ↓
//            Calculate net revenue
//                    ↓
//            Rank by net revenue
//                    ↓
//                 🥇 BEST MANDI
//
// IMPORTANT: A mandi with a higher ₹/kg price but impractical
// travel time is EXCLUDED entirely — not penalized.
//
// The engine is modular: price source, distance source, and
// config can all be swapped without changing the algorithm.

import type { MandiMarket } from "./mockMandiData";
import { distanceFromOrigin, type Origin } from "./geo";

// ─────────────────────────────────────────────────────────────
//  CONFIG — swap these to change behaviour without touching logic
// ─────────────────────────────────────────────────────────────

export interface RecommendationConfig {
    /** ₹ per km for the whole truck. Override later with a real routing API. */
    transportCostPerKm: number;
    /** Average truck speed in km/h, used for travel-time feasibility. */
    averageSpeedKmh: number;
    /** Load/unload + mandi paperwork + waiting time, in hours. */
    fixedOverheadHours: number;
    /** Other selling costs (mandi fee, cess, hamali) as a fraction of gross. */
    otherSellingCostRate: number;
    /** Default selling window if the farmer doesn't specify one, in hours. */
    defaultSellingWindowHours: number;
}

export const DEFAULT_CONFIG: RecommendationConfig = {
    transportCostPerKm: 12,        // ₹12/km for a small truck
    averageSpeedKmh: 40,           // conservative for MH highways + ghats
    fixedOverheadHours: 1.5,       // loading, paperwork, queue
    otherSellingCostRate: 0.04,    // ~4% for mandi fees + hamali
    defaultSellingWindowHours: 12, // half-day selling window
};

// ─────────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────────

export interface RecommendationInput {
    origin: Origin;
    crop: string;              // e.g. "Tomatoes"
    quantityKg: number;        // total harvest weight
    /** How many hours the farmer is willing/able to spend selling. */
    sellingWindowHours?: number;
    /** Optional: age of the crop in days (currently informational). */
    ageDays?: number;
}

export interface MandiEvaluation {
    mandiId: string;
    mandiName: string;

    // Raw inputs
    pricePerKg: number;        // ₹/kg (net after commissions)
    distanceKm: number;        // road distance from origin

    // Derived
    travelTimeHours: number;   // distance / avg speed + fixed overhead
    transportCost: number;     // ₹, whole-trip
    grossRevenue: number;      // ₹, whole harvest
    otherSellingCost: number;  // ₹, mandi fees / hamali / cess
    netRevenue: number;        // ₹, what farmer actually takes home

    // Feasibility
    feasible: boolean;
    infeasibleReason?: "travel_time_exceeds_window" | "no_price_data";
}

export interface RecommendationResult {
    best: MandiEvaluation | null;
    top3: MandiEvaluation[];
    allEvaluations: MandiEvaluation[];  // includes infeasible ones for debugging
    origin: Origin;
    crop: string;
    quantityKg: number;
    sellingWindowHours: number;
}

// ─────────────────────────────────────────────────────────────
//  PLUGGABLE DATA SOURCES
//  Swap these out to wire up real APIs later.
// ─────────────────────────────────────────────────────────────

export interface PriceSource {
    getNetPricePerKg(mandi: MandiMarket, crop: string): number | null;
}

export interface DistanceSource {
    getDistanceKm(origin: Origin, mandi: MandiMarket): number;
}

export const defaultPriceSource: PriceSource = {
    getNetPricePerKg(mandi, crop) {
        return mandi.prices[crop]?.netEstimatedPrice ?? null;
    },
};

export const defaultDistanceSource: DistanceSource = {
    getDistanceKm(origin, mandi) {
        return distanceFromOrigin(origin, mandi);
    },
};

// ─────────────────────────────────────────────────────────────
//  STEP 1–4: Evaluate a single mandi
// ─────────────────────────────────────────────────────────────

export function evaluateMandi(
    origin: Origin,
    mandi: MandiMarket,
    crop: string,
    quantityKg: number,
    sellingWindowHours: number,
    priceSource: PriceSource,
    distanceSource: DistanceSource,
    config: RecommendationConfig
): MandiEvaluation {
    // ── Inputs ──
    const pricePerKg = priceSource.getNetPricePerKg(mandi, crop);
    const distanceKm = distanceSource.getDistanceKm(origin, mandi);

    // ── Travel time (always computed, even for missing price, so UI can show it) ──
    const travelTimeHours =
        distanceKm / config.averageSpeedKmh + config.fixedOverheadHours;

    // ── Handle missing price ──
    if (pricePerKg === null) {
        return {
            mandiId: mandi.id,
            mandiName: mandi.name,
            pricePerKg: 0,
            distanceKm,
            travelTimeHours,
            transportCost: 0,
            grossRevenue: 0,
            otherSellingCost: 0,
            netRevenue: -Infinity,
            feasible: false,
            infeasibleReason: "no_price_data",
        };
    }

    // ── Step 1: Gross revenue ──
    // Gross Revenue = Quantity × Price
    // e.g. 5000 kg × ₹35/kg = ₹1,75,000
    const grossRevenue = quantityKg * pricePerKg;

    // ── Step 2: Transport cost ──
    // Transport Cost = Distance × Cost per km
    // e.g. 150 km × ₹20/km = ₹3,000
    const transportCost = distanceKm * config.transportCostPerKm;

    // ── Step 3: Other selling costs (mandi fees, hamali) ──
    const otherSellingCost = grossRevenue * config.otherSellingCostRate;

    // ── Step 4: Net revenue ──
    // Net Revenue = Gross − Transport − Other
    const netRevenue = grossRevenue - transportCost - otherSellingCost;

    // ── Urgency constraint ──
    // IF travel time > available window → NOT FEASIBLE
    const feasible = travelTimeHours <= sellingWindowHours;

    return {
        mandiId: mandi.id,
        mandiName: mandi.name,
        pricePerKg,
        distanceKm,
        travelTimeHours,
        transportCost,
        grossRevenue,
        otherSellingCost,
        netRevenue,
        feasible,
        infeasibleReason: feasible ? undefined : "travel_time_exceeds_window",
    };
}

// ─────────────────────────────────────────────────────────────
//  STEP 5: Rank and pick the best
// ─────────────────────────────────────────────────────────────

export function recommendBestMandi(
    input: RecommendationInput,
    mandis: MandiMarket[],
    config: RecommendationConfig = DEFAULT_CONFIG,
    priceSource: PriceSource = defaultPriceSource,
    distanceSource: DistanceSource = defaultDistanceSource
): RecommendationResult {
    const sellingWindowHours =
        input.sellingWindowHours ?? config.defaultSellingWindowHours;

    // Evaluate every candidate mandi
    const allEvaluations = mandis.map((mandi) =>
        evaluateMandi(
            input.origin,
            mandi,
            input.crop,
            input.quantityKg,
            sellingWindowHours,
            priceSource,
            distanceSource,
            config
        )
    );

    // Filter out infeasible (travel time > window) and rank by net revenue
    const feasibleSorted = allEvaluations
        .filter((e) => e.feasible)
        .sort((a, b) => b.netRevenue - a.netRevenue);

    return {
        best: feasibleSorted[0] ?? null,
        top3: feasibleSorted.slice(0, 3),
        allEvaluations,
        origin: input.origin,
        crop: input.crop,
        quantityKg: input.quantityKg,
        sellingWindowHours,
    };
}