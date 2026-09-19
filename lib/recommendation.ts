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
    /** Optional: age of the crop in days, if you later want to model spoilage. */
    ageDays?: number;
}

export interface MandiEvaluation {
    mandiId: string;
    mandiName: string;

    // Raw inputs
    pricePerKg: number;        // ₹/kg (net after commissions, as stored in mock data)
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
//  CORE EVALUATION (one mandi)
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
    const pricePerKg = priceSource.getNetPricePerKg(mandi, crop);
    const distanceKm = distanceSource.getDistanceKm(origin, mandi);

    // Handle missing price data
    if (pricePerKg === null) {
        return {
            mandiId: mandi.id,
            mandiName: mandi.name,
            pricePerKg: 0,
            distanceKm,
            travelTimeHours: 0,
            transportCost: 0,
            grossRevenue: 0,
            otherSellingCost: 0,
            netRevenue: -Infinity,
            feasible: false,
            infeasibleReason: "no_price_data",
        };
    }

    const grossRevenue = quantityKg * pricePerKg;
    const transportCost = distanceKm * config.transportCostPerKm;
    const otherSellingCost = grossRevenue * config.otherSellingCostRate;
    const netRevenue = grossRevenue - transportCost - otherSellingCost;

    const travelTimeHours =
        distanceKm / config.averageSpeedKmh + config.fixedOverheadHours;

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
//  TOP-LEVEL RECOMMENDATION
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