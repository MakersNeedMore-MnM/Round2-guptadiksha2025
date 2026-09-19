import type { MandiMarket } from "./mockMandiData";

// Preset origins so the user doesn't have to type
export interface Origin {
    id: string;
    nameEn: string;
    nameHi: string;
    nameMr: string;
    lat: number;
    lng: number;
}

export const PRESET_ORIGINS: Origin[] = [
    { id: "pune", nameEn: "Pune", nameHi: "पुणे", nameMr: "पुणे", lat: 18.5204, lng: 73.8567 },
    { id: "mumbai", nameEn: "Mumbai", nameHi: "मुंबई", nameMr: "मुंबई", lat: 19.0760, lng: 72.8777 },
    { id: "nashik", nameEn: "Nashik", nameHi: "नासिक", nameMr: "नाशिक", lat: 19.9975, lng: 73.7898 },
    { id: "nagpur", nameEn: "Nagpur", nameHi: "नागपुर", nameMr: "नागपूर", lat: 21.1458, lng: 79.0882 },
    { id: "aurangabad", nameEn: "Chhatrapati Sambhajinagar", nameHi: "छत्रपति संभाजीनगर", nameMr: "छत्रपती संभाजीनगर", lat: 19.8762, lng: 75.3433 },
    { id: "latur", nameEn: "Latur", nameHi: "लातूर", nameMr: "लातूर", lat: 18.4088, lng: 76.5604 },
    { id: "nanded", nameEn: "Nanded", nameHi: "नांदेड़", nameMr: "नांदेड", lat: 19.1383, lng: 77.3210 },
    { id: "kolhapur", nameEn: "Kolhapur", nameHi: "कोल्हापुर", nameMr: "कोल्हापूर", lat: 16.7050, lng: 74.2433 },
    { id: "solapur", nameEn: "Solapur", nameHi: "सोलापुर", nameMr: "सोलापूर", lat: 17.6599, lng: 75.9064 },
    { id: "amravati", nameEn: "Amravati", nameHi: "अमरावती", nameMr: "अमरावती", lat: 20.9374, lng: 77.7796 },
    { id: "jalgaon", nameEn: "Jalgaon", nameHi: "जलगांव", nameMr: "जळगाव", lat: 21.0077, lng: 75.5626 },
    { id: "satara", nameEn: "Satara", nameHi: "सतारा", nameMr: "सातारा", lat: 17.6805, lng: 74.0183 },
];

// Haversine straight-line distance in km
export function haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Approximate road distance ≈ straight-line × 1.25 for Maharashtra highways
export function roadDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    return Math.round(haversineKm(lat1, lng1, lat2, lng2) * 1.25);
}

// Convenience: distance from an origin point to a mandi
export function distanceFromOrigin(
    origin: { lat: number; lng: number } | undefined,
    mandi: MandiMarket | undefined
): number {
    if (!origin || !mandi) return 0;
    if (
        typeof origin.lat !== "number" ||
        typeof origin.lng !== "number" ||
        typeof mandi.lat !== "number" ||
        typeof mandi.lng !== "number"
    ) {
        return 0;
    }
    return roadDistanceKm(origin.lat, origin.lng, mandi.lat, mandi.lng);
}

// ─────────────────────────────────────────────────────────────
//  FREE GEOCODING via OpenStreetMap Nominatim (no API key)
// ─────────────────────────────────────────────────────────────

export async function geocodePlace(
    query: string
): Promise<{ lat: number; lng: number; label: string } | null> {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(
                query
            )}`,
            {
                headers: {
                    "Accept-Language": "en",
                    // ⚠️ Nominatim REQUIREs a User-Agent — without it you get 403
                    "User-Agent": "FarmOptima/1.0 (hackathon)",
                },
            }
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return null;
        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            label: data[0].display_name as string,
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────
//  MARKET GEOCODING (for data.gov.in market names)
//  Cleans API names like "APMC Akola " or "Amrawati(Frui & Veg. Market)"
//  then geocodes via Nominatim. Results are cached in memory.
// ─────────────────────────────────────────────────────────────

const geocodeMarketCache = new Map<string, { lat: number; lng: number }>();

export async function geocodeMarket(
    marketName: string,
    district: string
): Promise<{ lat: number; lng: number } | null> {
    // Clean: "APMC Akola " → "Akola", "Amrawati(Frui & Veg. Market)" → "Amrawati"
    const cleaned = marketName
        .replace(/\bAPMC\b/gi, "")
        .replace(/\(.*?\)/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const cacheKey = `${cleaned}|${district}`;
    if (geocodeMarketCache.has(cacheKey)) {
        return geocodeMarketCache.get(cacheKey)!;
    }

    // Try multiple queries, most specific first
    const queries = [
        `${cleaned}, ${district}, Maharashtra, India`,
        `${cleaned}, Maharashtra, India`,
        `${district}, Maharashtra, India`,
    ];

    for (const q of queries) {
        const result = await geocodePlace(q);
        if (result) {
            const coords = { lat: result.lat, lng: result.lng };
            geocodeMarketCache.set(cacheKey, coords);
            return coords;
        }
        // Nominatim rate limit: max 1 req/sec — add delay between tries
        await new Promise((r) => setTimeout(r, 1100));
    }

    return null;
}