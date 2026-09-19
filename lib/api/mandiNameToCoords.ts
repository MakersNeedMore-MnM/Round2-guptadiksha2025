// lib/api/mandiNameToCoords.ts
// Maps market names from data.gov.in to lat/lng.
// Extend as you discover more market names in API responses.

export interface MarketCoord {
    lat: number;
    lng: number;
    district?: string;
    nameHi?: string;
    nameMr?: string;
    districtHi?: string;
    districtMr?: string;
}

export const MARKET_COORDS: Record<string, MarketCoord> = {
    // Match keys are lowercased, stripped of "APMC", "Market", "Mandi"
    "vashi": { lat: 19.0748, lng: 72.9978, district: "Navi Mumbai", nameHi: "वाशी", nameMr: "वाशी" },
    "gultekdi": { lat: 18.4962, lng: 73.8647, district: "Pune", nameHi: "गुलटेकड़ी", nameMr: "गुलटेकडी" },
    "pune": { lat: 18.5204, lng: 73.8567, district: "Pune", nameHi: "पुणे", nameMr: "पुणे" },
    "nashik": { lat: 19.9975, lng: 73.7898, district: "Nashik", nameHi: "नासिक", nameMr: "नाशिक" },
    "lasalgaon": { lat: 20.1486, lng: 74.2370, district: "Nashik", nameHi: "लासलगांव", nameMr: "लासलगाव" },
    "nagpur": { lat: 21.1458, lng: 79.0882, district: "Nagpur", nameHi: "नागपुर", nameMr: "नागपूर" },
    "aurangabad": { lat: 19.8762, lng: 75.3433, district: "Aurangabad", nameHi: "औरंगाबाद", nameMr: "औरंगाबाद" },
    "latur": { lat: 18.4088, lng: 76.5604, district: "Latur", nameHi: "लातूर", nameMr: "लातूर" },
    "nanded": { lat: 19.1383, lng: 77.3210, district: "Nanded", nameHi: "नांदेड़", nameMr: "नांदेड" },
    "kolhapur": { lat: 16.7050, lng: 74.2433, district: "Kolhapur", nameHi: "कोल्हापुर", nameMr: "कोल्हापूर" },
    "solapur": { lat: 17.6599, lng: 75.9064, district: "Solapur", nameHi: "सोलापुर", nameMr: "सोलापूर" },
    "amravati": { lat: 20.9374, lng: 77.7796, district: "Amravati", nameHi: "अमरावती", nameMr: "अमरावती" },
    "akola": { lat: 20.7002, lng: 77.0082, district: "Akola", nameHi: "अकोला", nameMr: "अकोला" },
    "jalgaon": { lat: 21.0077, lng: 75.5626, district: "Jalgaon", nameHi: "जलगांव", nameMr: "जळगाव" },
    "dhule": { lat: 20.9042, lng: 74.7749, district: "Dhule", nameHi: "धुले", nameMr: "धुळे" },
    "satara": { lat: 17.6805, lng: 74.0183, district: "Satara", nameHi: "सतारा", nameMr: "सातारा" },
    "sangli": { lat: 16.8524, lng: 74.5815, district: "Sangli", nameHi: "सांगली", nameMr: "सांगली" },
    "ratnagiri": { lat: 16.9902, lng: 73.3120, district: "Ratnagiri", nameHi: "रत्नागिरी", nameMr: "रत्नागिरी" },
    // ... add more as you see them in API responses
};

export function normalizeMarketName(name: string): string {
    return name
        .toLowerCase()
        .replace(/\s+apmc\s*/g, "")
        .replace(/\s+market\s*/g, "")
        .replace(/\s+mandi\s*/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

export function lookupCoords(marketName: string): MarketCoord | null {
    const norm = normalizeMarketName(marketName);

    // Exact key match
    if (MARKET_COORDS[norm]) return MARKET_COORDS[norm];

    // Substring match — try each known key against the API name
    for (const key of Object.keys(MARKET_COORDS)) {
        if (norm.includes(key)) return MARKET_COORDS[key];
    }

    return null;
}