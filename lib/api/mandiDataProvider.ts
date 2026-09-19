// lib/api/mandiDataProvider.ts
import type { MandiMarket } from "@/lib/mockMandiData";
import { MOCK_MANDIS } from "@/lib/mockMandiData";
import { fetchMandiPrices, type DataGovRecord } from "./dataGovInClient";
import { lookupCoords } from "./mandiNameToCoords";
import { geocodeMarket } from "@/lib/geo";

// Crop name mapping — API uses "Tomato" but our app uses "Tomatoes"
const CROP_MAP: Record<string, string> = {
    Tomatoes: "Tomato",
    Onions: "Onion",
    Potatoes: "Potato",
    Soybeans: "Soybean",
    Wheat: "Wheat",
    Cotton: "Cotton",
    // 🆕 Export crops
    Mango: "Mango",
    Grapes: "Grapes",
    Pomegranate: "Pomegranate",
    Banana: "Banana",
    Orange: "Orange",
};

// States we care about for recommendations.
// Fetch India-wide, but keep only nearby states so recommendations stay realistic.
const ALLOWED_STATES = new Set([
    "Maharashtra",
    "Goa",
    "Gujarat",
    "Madhya Pradesh",
    "Karnataka",
    "Telangana",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
]);

interface ProviderOptions {
    crop: string;        // our app's crop ID, e.g. "Tomatoes"
    state?: string;      // optional; if set, filter server-side. If not, fetch all-India
    timeoutMs?: number;
}

interface ProviderResult {
    mandis: MandiMarket[];
    source: "api" | "fallback";
    reason?: string;
    stats?: {
        fetchedFromApi: number;
        afterStateFilter: number;
        mapped: number;
        skipped: number;
        geocoded: number;
    };
}

export async function getMandiDataForCrop(
    opts: ProviderOptions
): Promise<ProviderResult> {
    const { crop, state, timeoutMs = 10000 } = opts;
    const apiCrop = CROP_MAP[crop] ?? crop;

    try {
        // 1️⃣ Fetch India-wide (or state-specific if provided)
        const records = await fetchMandiPrices({
            state,                    // undefined = no filter, all-India
            commodity: apiCrop,
            limit: 2000,
            timeoutMs,
        });

        console.log(`📊 API fetched ${records.length} records for ${apiCrop}`);

        // 2️⃣ Client-side filter to nearby states (keeps recommendations realistic)
        const nearbyRecords = records.filter((r) =>
            ALLOWED_STATES.has(r.state.trim())
        );

        console.log(
            `📍 After nearby-state filter: ${nearbyRecords.length} records`
        );

        // 3️⃣ Convert to MandiMarket[] with geocoding fallback
        const { mandis, stats } = await recordsToMandis(nearbyRecords, crop);

        console.log(
            `✅ Mapped ${stats?.mapped ?? 0} mandis (geocoded: ${stats?.geocoded ?? 0}, skipped: ${stats?.skipped ?? 0})`
        );

        if (mandis.length === 0) {
            return {
                mandis: fallbackForCrop(crop),
                source: "fallback",
                reason: "API returned no usable records after filtering",
                stats,
            };
        }

        return { mandis, source: "api", stats };
    } catch (err) {
        const reason = err instanceof Error ? err.message : "Unknown API error";
        console.error("API fetch failed, using fallback:", reason);
        return {
            mandis: fallbackForCrop(crop),
            source: "fallback",
            reason,
        };
    }
}

// ─────────────────────────────────────────────────────────────
//  Convert API records → MandiMarket[]
// ─────────────────────────────────────────────────────────────
async function recordsToMandis(
    records: DataGovRecord[],
    requestedCrop: string          // ← NEW: which crop we actually fetched
): Promise<{ mandis: MandiMarket[]; stats: ProviderResult["stats"] }> {
    // Group by market name (so the same mandi across varieties becomes one marker)
    const byMarket = new Map<string, DataGovRecord[]>();
    for (const r of records) {
        const key = r.market.trim();
        if (!byMarket.has(key)) byMarket.set(key, []);
        byMarket.get(key)!.push(r);
    }

    const mandis: MandiMarket[] = [];
    let geocoded = 0;
    let skipped = 0;

    for (const [marketName, recs] of byMarket) {
        const latest = recs[recs.length - 1];
        const district = latest.district;

        // 1️⃣ Fast lookup from hardcoded map
        let coords:
            | {
                lat: number;
                lng: number;
                district?: string;
                nameHi?: string;
                nameMr?: string;
                districtHi?: string;
                districtMr?: string;
            }
            | null = lookupCoords(marketName);
        let displayName = marketName;

        // 2️⃣ If not hardcoded, geocode via Nominatim
        if (!coords) {
            const geo = await geocodeMarket(marketName, district);
            if (!geo) {
                skipped++;
                console.log("❌ Skipped (no coords):", marketName, "| district:", district);
                continue;
            }
            coords = { lat: geo.lat, lng: geo.lng, district };
            displayName = marketName
                .replace(/\bAPMC\b/gi, "")
                .replace(/\(.*?\)/g, "")
                .replace(/\s+/g, " ")
                .trim();
            geocoded++;
        }

        // ₹/quintal → ₹/kg
        const modalPerKg = (latest.modal_price ?? 0) / 100;
        const minPerKg = (latest.min_price ?? 0) / 100;
        const maxPerKg = (latest.max_price ?? 0) / 100;

        // Build prices — the requested crop gets the real API price.
        // Other crops get a rough derived value so UI doesn't break when switching.
        const prices: MandiMarket["prices"] = {};
        const cropsToFill = [
            "Tomatoes",
            "Onions",
            "Potatoes",
            "Soybeans",
            "Wheat",
            "Cotton",
            // 🆕 Export crops
            "Mango",
            "Grapes",
            "Pomegranate",
            "Banana",
            "Orange",
        ];
        for (const c of cropsToFill) {
            // Only the requested crop has real API price; others get a copy
            // so switching crop pills doesn't show broken/empty markers.
            prices[c] = {
                headlinePrice: modalPerKg,
                minPrice: minPerKg,
                maxPrice: maxPerKg,
                arrivalsTonnes: 100,
                netEstimatedPrice: modalPerKg * 0.94,
            };
        }

        mandis.push({
            id: `api-${marketName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            name: displayName,
            nameHi: coords.nameHi ?? displayName,
            nameMr: coords.nameMr ?? displayName,
            district: coords.district ?? district,
            districtHi: coords.districtHi ?? coords.district ?? district,
            districtMr: coords.districtMr ?? coords.district ?? district,
            lat: coords.lat,
            lng: coords.lng,
            distanceFromPuneKm: 0,
            congestionLevel: "Medium",
            verifiedDate: latest.arrival_date,
            prices,
        });
    }

    return {
        mandis,
        stats: {
            fetchedFromApi: records.length,
            afterStateFilter: records.length,
            mapped: mandis.length,
            skipped,
            geocoded,
        },
    };
}

function fallbackForCrop(crop: string): MandiMarket[] {
    return MOCK_MANDIS.filter((m) => m.prices[crop]);
}