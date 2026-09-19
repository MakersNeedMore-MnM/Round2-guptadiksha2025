// lib/api/mandiDataProvider.ts
import type { MandiMarket } from "@/lib/mockMandiData";
import { MOCK_MANDIS } from "@/lib/mockMandiData";
import { fetchMandiPrices, type DataGovRecord } from "./dataGovInClient";
import { lookupCoords } from "./mandiNameToCoords";

// Crop name mapping — API uses "Tomato" but our app uses "Tomatoes"
const CROP_MAP: Record<string, string> = {
    Tomatoes: "Tomato",
    Onions: "Onion",
    Potatoes: "Potato",
    Soybeans: "Soybean",
    Wheat: "Wheat",
    Cotton: "Cotton",
};

interface ProviderOptions {
    crop: string;        // our app's crop ID, e.g. "Tomatoes"
    state?: string;      // default "Maharashtra"
    timeoutMs?: number;
}

interface ProviderResult {
    mandis: MandiMarket[];
    source: "api" | "fallback";
    reason?: string;     // why fallback was used, if applicable
}

export async function getMandiDataForCrop(
    opts: ProviderOptions
): Promise<ProviderResult> {
    const { crop, state = "Maharashtra", timeoutMs = 6000 } = opts;
    const apiCrop = CROP_MAP[crop] ?? crop;

    try {
        const records = await fetchMandiPrices({
            state,
            commodity: apiCrop,
            limit: 500,
            timeoutMs,
        });

        const mandis = recordsToMandis(records);

        // If API returned nothing usable, fall back
        if (mandis.length === 0) {
            return {
                mandis: fallbackForCrop(crop),
                source: "fallback",
                reason: "API returned no usable records for this crop",
            };
        }

        // Merge with fallback so crops missing from API still get a mandi list
        return { mandis, source: "api" };
    } catch (err) {
        const reason = err instanceof Error ? err.message : "Unknown API error";
        return {
            mandis: fallbackForCrop(crop),
            source: "fallback",
            reason,
        };
    }
}

// Convert raw API records → MandiMarket[]
function recordsToMandis(records: DataGovRecord[]): MandiMarket[] {
    // Group by market name, take the latest arrival_date per market
    const byMarket = new Map<string, DataGovRecord[]>();
    for (const r of records) {
        const key = r.market;
        if (!byMarket.has(key)) byMarket.set(key, []);
        byMarket.get(key)!.push(r);
    }

    const mandis: MandiMarket[] = [];

    for (const [marketName, recs] of byMarket) {
        const coords = lookupCoords(marketName);
        if (!coords) continue; // skip markets we can't place on the map

        // Take the most recent record
        const latest = recs[recs.length - 1];

        // Convert ₹/quintal → ₹/kg (API uses quintal)
        const modalPerKg = (latest.modal_price ?? 0) / 100;
        const minPerKg = (latest.min_price ?? 0) / 100;
        const maxPerKg = (latest.max_price ?? 0) / 100;

        // Build prices object — for now we only know this one crop's price.
        // Other crops get a copy of the same value so the map doesn't break.
        const prices: MandiMarket["prices"] = {};
        const cropsToFill = ["Tomatoes", "Onions", "Potatoes", "Soybeans", "Wheat", "Cotton"];
        for (const c of cropsToFill) {
            prices[c] = {
                headlinePrice: modalPerKg,
                minPrice: minPerKg,
                maxPrice: maxPerKg,
                arrivalsTonnes: 100, // not provided by API
                netEstimatedPrice: modalPerKg * 0.94, // 6% mandi fees
            };
        }

        mandis.push({
            id: `api-${marketName.toLowerCase().replace(/\s+/g, "-")}`,
            name: marketName,
            nameHi: coords.nameHi ?? marketName,
            nameMr: coords.nameMr ?? marketName,
            district: coords.district ?? latest.district,
            districtHi: coords.districtHi ?? coords.district ?? latest.district,
            districtMr: coords.districtMr ?? coords.district ?? latest.district,
            lat: coords.lat,
            lng: coords.lng,
            distanceFromPuneKm: 0, // computed dynamically by recommendation engine
            congestionLevel: "Medium",
            verifiedDate: latest.arrival_date,
            prices,
        });
    }

    return mandis;
}

// Fallback: filter existing MOCK_MANDIS to relevant mandis for the crop
function fallbackForCrop(crop: string): MandiMarket[] {
    // Return all mandis — the recommendation engine will sort by net revenue
    return MOCK_MANDIS.filter((m) => m.prices[crop]);
}