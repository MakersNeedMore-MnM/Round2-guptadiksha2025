// lib/exportMandiData.ts
// Hardcoded India-wide mandis that handle fruit exports.
// Used INSTEAD of the API for Mango, Grapes, Pomegranate, Banana,
// Chikoo, Apple, Orange because:
//   1. API data for these is sparse and seasonal
//   2. Nominatim geocoding is slow (1 req/sec)
//   3. Fruits travel far (ports, metro cities) so nationwide data matters
//
// Prices come from a curated city × crop table reflecting real
// APMC / AGMARKNET observations. No randomness — each city has a
// specific price per crop, so the recommendation engine produces
// deterministic, explainable results.
import type { MandiMarket } from "./mockMandiData";

// ─────────────────────────────────────────────────────────────
//  CITY × FRUIT PRICE TABLE (₹/kg)
//  Every city has a fixed price for every fruit.
// ─────────────────────────────────────────────────────────────
type FruitPrices = {
    Mango: number;
    Banana: number;
    Pomegranate: number;
    Chikoo: number;
    Apple: number;
    Orange: number;
    Grapes: number;
};

const CITY_PRICES: Record<string, FruitPrices> = {
    Delhi: { Mango: 180, Banana: 50, Pomegranate: 180, Chikoo: 70, Apple: 180, Orange: 90, Grapes: 100 },
    Mumbai: { Mango: 280, Banana: 60, Pomegranate: 200, Chikoo: 80, Apple: 200, Orange: 100, Grapes: 110 },
    Pune: { Mango: 220, Banana: 50, Pomegranate: 160, Chikoo: 60, Apple: 190, Orange: 90, Grapes: 90 },
    Bengaluru: { Mango: 120, Banana: 40, Pomegranate: 170, Chikoo: 70, Apple: 210, Orange: 80, Grapes: 100 },
    Chennai: { Mango: 140, Banana: 45, Pomegranate: 180, Chikoo: 65, Apple: 220, Orange: 85, Grapes: 110 },
    Hyderabad: { Mango: 130, Banana: 40, Pomegranate: 150, Chikoo: 60, Apple: 200, Orange: 80, Grapes: 95 },
    Kolkata: { Mango: 100, Banana: 45, Pomegranate: 160, Chikoo: 75, Apple: 170, Orange: 80, Grapes: 100 },
    Ahmedabad: { Mango: 130, Banana: 40, Pomegranate: 150, Chikoo: 55, Apple: 180, Orange: 85, Grapes: 90 },
    Surat: { Mango: 140, Banana: 40, Pomegranate: 140, Chikoo: 50, Apple: 180, Orange: 85, Grapes: 90 },
    Lucknow: { Mango: 80, Banana: 35, Pomegranate: 160, Chikoo: 70, Apple: 160, Orange: 70, Grapes: 90 },
    Varanasi: { Mango: 70, Banana: 35, Pomegranate: 150, Chikoo: 70, Apple: 150, Orange: 70, Grapes: 85 },
    Jaipur: { Mango: 120, Banana: 40, Pomegranate: 170, Chikoo: 80, Apple: 170, Orange: 80, Grapes: 95 },
    Patna: { Mango: 80, Banana: 35, Pomegranate: 150, Chikoo: 75, Apple: 160, Orange: 75, Grapes: 90 },
    Chandigarh: { Mango: 110, Banana: 45, Pomegranate: 180, Chikoo: 80, Apple: 160, Orange: 80, Grapes: 100 },
    Jalandhar: { Mango: 100, Banana: 45, Pomegranate: 175, Chikoo: 80, Apple: 160, Orange: 80, Grapes: 95 },
    Kochi: { Mango: 130, Banana: 50, Pomegranate: 190, Chikoo: 85, Apple: 220, Orange: 100, Grapes: 120 },
    Salem: { Mango: 135, Banana: 40, Pomegranate: 170, Chikoo: 60, Apple: 210, Orange: 90, Grapes: 110 },
    Visakhapatnam: { Mango: 80, Banana: 35, Pomegranate: 160, Chikoo: 65, Apple: 200, Orange: 80, Grapes: 100 },
    Guwahati: { Mango: 110, Banana: 50, Pomegranate: 190, Chikoo: 90, Apple: 190, Orange: 90, Grapes: 120 },
    Indore: { Mango: 100, Banana: 35, Pomegranate: 150, Chikoo: 60, Apple: 170, Orange: 70, Grapes: 85 },
};

// ─────────────────────────────────────────────────────────────
//  MANDI LOCATIONS
//  City name here MUST match a key in CITY_PRICES above.
// ─────────────────────────────────────────────────────────────
interface RawExportMandi {
    id: string;
    city: string;           // ← links to CITY_PRICES
    name: string;
    nameHi: string;
    nameMr: string;
    district: string;
    districtHi: string;
    districtMr: string;
    lat: number;
    lng: number;
    congestion: "Low" | "Medium" | "High";
}

const RAW_EXPORT_MANDIS: RawExportMandi[] = [
    // ─── Maharashtra ───
    { id: "mumbai-vashi", city: "Mumbai", name: "Mumbai Vashi APMC", nameHi: "मुंबई वाशी एपीएमसी", nameMr: "मुंबई वाशी एपीएमसी", district: "Navi Mumbai", districtHi: "नवी मुंबई", districtMr: "नवी मुंबई", lat: 19.0748, lng: 72.9978, congestion: "High" },
    { id: "pune-gultekdi", city: "Pune", name: "Pune Market Yard (Gultekdi)", nameHi: "पुणे मार्केट यार्ड (गुलटेकड़ी)", nameMr: "पुणे मार्केट यार्ड (गुलटेकडी)", district: "Pune", districtHi: "पुणे", districtMr: "पुणे", lat: 18.4962, lng: 73.8647, congestion: "High" },

    // ─── Gujarat ───
    { id: "ahmedabad-jamalpur", city: "Ahmedabad", name: "Ahmedabad Jamalpur APMC", nameHi: "अहमदाबाद जमालपुर एपीएमसी", nameMr: "अहमदाबाद जमालपूर एपीएमसी", district: "Ahmedabad", districtHi: "अहमदाबाद", districtMr: "अहमदाबाद", lat: 23.0225, lng: 72.5714, congestion: "Medium" },
    { id: "surat", city: "Surat", name: "Surat APMC Market", nameHi: "सूरत एपीएमसी बाजार", nameMr: "सूरत एपीएमसी बाजार", district: "Surat", districtHi: "सूरत", districtMr: "सूरत", lat: 21.1702, lng: 72.8311, congestion: "Medium" },

    // ─── Madhya Pradesh ───
    { id: "indore", city: "Indore", name: "Indore Choithram Mandi", nameHi: "इंदौर चोइथराम मंडी", nameMr: "इंदूर चोइथराम मंडी", district: "Indore", districtHi: "इंदौर", districtMr: "इंदूर", lat: 22.7196, lng: 75.8577, congestion: "Medium" },

    // ─── Karnataka ───
    { id: "bengaluru-yeshwanthpur", city: "Bengaluru", name: "Bengaluru Yeshwanthpur APMC", nameHi: "बेंगलुरु यशवंतपुर एपीएमसी", nameMr: "बेंगळुरू यशवंतपूर एपीएमसी", district: "Bengaluru", districtHi: "बेंगलुरु", districtMr: "बेंगळुरू", lat: 13.0234, lng: 77.5540, congestion: "High" },

    // ─── Telangana ───
    { id: "hyderabad-bowenpally", city: "Hyderabad", name: "Hyderabad Bowenpally Market", nameHi: "हैदराबाद बोवेनपल्ली बाजार", nameMr: "हैदराबाद बोवेनपल्ली बाजार", district: "Hyderabad", districtHi: "हैदराबाद", districtMr: "हैदराबाद", lat: 17.4701, lng: 78.4786, congestion: "High" },

    // ─── Delhi NCR ───
    { id: "delhi-azadpur", city: "Delhi", name: "Delhi Azadpur Mandi", nameHi: "दिल्ली आज़ादपुर मंडी", nameMr: "दिल्ली आझादपूर मंडी", district: "Delhi", districtHi: "दिल्ली", districtMr: "दिल्ली", lat: 28.7074, lng: 77.1711, congestion: "High" },

    // ─── Rajasthan ───
    { id: "jaipur-muhana", city: "Jaipur", name: "Jaipur Muhana Mandi", nameHi: "जयपुर मुहाना मंडी", nameMr: "जयपूर मुहाना मंडी", district: "Jaipur", districtHi: "जयपुर", districtMr: "जयपूर", lat: 26.8218, lng: 75.8050, congestion: "Medium" },

    // ─── Tamil Nadu ───
    { id: "chennai-koyambedu", city: "Chennai", name: "Chennai Koyambedu Market", nameHi: "चेन्नई कोयमबेडु बाजार", nameMr: "चेन्नई कोयमबेडू बाजार", district: "Chennai", districtHi: "चेन्नई", districtMr: "चेन्नई", lat: 13.0700, lng: 80.1945, congestion: "High" },
    { id: "salem", city: "Salem", name: "Salem APMC Market", nameHi: "सेलम एपीएमसी बाजार", nameMr: "सेलम एपीएमसी बाजार", district: "Salem", districtHi: "सेलम", districtMr: "सेलम", lat: 11.6643, lng: 78.1460, congestion: "Medium" },

    // ─── West Bengal ───
    { id: "kolkata-sealdah", city: "Kolkata", name: "Kolkata Sealdah Market", nameHi: "कोलकाता सियालदह बाजार", nameMr: "कोलकाता सियालदहा बाजार", district: "Kolkata", districtHi: "कोलकाता", districtMr: "कोलकाता", lat: 22.5668, lng: 88.3697, congestion: "High" },

    // ─── Andhra Pradesh ───
    { id: "visakhapatnam", city: "Visakhapatnam", name: "Visakhapatnam Market", nameHi: "विशाखापत्तनम बाजार", nameMr: "विशाखापट्टणम बाजार", district: "Visakhapatnam", districtHi: "विशाखापत्तनम", districtMr: "विशाखापट्टणम", lat: 17.6868, lng: 83.2185, congestion: "Medium" },

    // ─── Uttar Pradesh ───
    { id: "lucknow", city: "Lucknow", name: "Lucknow Mandi", nameHi: "लखनऊ मंडी", nameMr: "लखनौ मंडी", district: "Lucknow", districtHi: "लखनऊ", districtMr: "लखनौ", lat: 26.8467, lng: 80.9462, congestion: "Medium" },
    { id: "varanasi", city: "Varanasi", name: "Varanasi Mandi", nameHi: "वाराणसी मंडी", nameMr: "वाराणसी मंडी", district: "Varanasi", districtHi: "वाराणसी", districtMr: "वाराणसी", lat: 25.3176, lng: 82.9739, congestion: "Low" },

    // ─── Bihar ───
    { id: "patna", city: "Patna", name: "Patna Mandi", nameHi: "पटना मंडी", nameMr: "पटणा मंडी", district: "Patna", districtHi: "पटना", districtMr: "पटणा", lat: 25.5941, lng: 85.1376, congestion: "Medium" },

    // ─── Punjab ───
    { id: "chandigarh", city: "Chandigarh", name: "Chandigarh Mandi", nameHi: "चंडीगढ़ मंडी", nameMr: "चंडीगड मंडी", district: "Chandigarh", districtHi: "चंडीगढ़", districtMr: "चंडीगड", lat: 30.7333, lng: 76.7794, congestion: "Medium" },
    { id: "jalandhar", city: "Jalandhar", name: "Jalandhar Mandi", nameHi: "जालंधर मंडी", nameMr: "जालंधर मंडी", district: "Jalandhar", districtHi: "जालंधर", districtMr: "जालंधर", lat: 31.3260, lng: 75.5762, congestion: "Medium" },

    // ─── Kerala ───
    { id: "kochi", city: "Kochi", name: "Kochi Market", nameHi: "कोच्चि बाजार", nameMr: "कोची बाजार", district: "Ernakulam", districtHi: "एर्नाकुलम", districtMr: "एर्नाकुलम", lat: 9.9312, lng: 76.2673, congestion: "Medium" },

    // ─── Assam ───
    { id: "guwahati", city: "Guwahati", name: "Guwahati Mandi", nameHi: "गुवाहाटी मंडी", nameMr: "गुवाहाटी मंडी", district: "Kamrup", districtHi: "कामरूप", districtMr: "कामरूप", lat: 26.1445, lng: 91.7362, congestion: "Medium" },
];

// All fruit crops we support
export const FRUIT_CROPS = new Set([
    "Mango",
    "Banana",
    "Pomegranate",
    "Chikoo",
    "Apple",
    "Orange",
    "Grapes",
]);

export function isFruitCrop(crop: string): boolean {
    return FRUIT_CROPS.has(crop);
}

// ─────────────────────────────────────────────────────────────
//  BUILD MandiMarket[] FROM CITY × PRICE TABLE
// ─────────────────────────────────────────────────────────────
export const EXPORT_MANDIS: MandiMarket[] = RAW_EXPORT_MANDIS.map((raw) => {
    const cityPrices = CITY_PRICES[raw.city];

    const prices: MandiMarket["prices"] = {};

    // Fruit prices — directly from the table (deterministic)
    if (cityPrices) {
        (Object.keys(cityPrices) as Array<keyof FruitPrices>).forEach((crop) => {
            const price = cityPrices[crop];
            prices[crop] = {
                headlinePrice: price,
                minPrice: +(price * 0.9).toFixed(2),
                maxPrice: +(price * 1.1).toFixed(2),
                arrivalsTonnes: 50,
                netEstimatedPrice: +(price * 0.94).toFixed(2), // 6% mandi fees
            };
        });
    }

    // Vegetable fallback so pill switching doesn't break
    const vegFallback: Record<string, number> = {
        Tomatoes: 32,
        Onions: 26,
        Potatoes: 20,
        Soybeans: 47,
        Wheat: 25,
        Cotton: 61,
    };
    Object.entries(vegFallback).forEach(([crop, price]) => {
        prices[crop] = {
            headlinePrice: price,
            minPrice: +(price * 0.88).toFixed(2),
            maxPrice: +(price * 1.12).toFixed(2),
            arrivalsTonnes: 100,
            netEstimatedPrice: +(price * 0.94).toFixed(2),
        };
    });

    return {
        id: raw.id,
        name: raw.name,
        nameHi: raw.nameHi,
        nameMr: raw.nameMr,
        district: raw.district,
        districtHi: raw.districtHi,
        districtMr: raw.districtMr,
        lat: raw.lat,
        lng: raw.lng,
        distanceFromPuneKm: 0,       // dynamic — computed from origin by engine
        congestionLevel: raw.congestion,
        verifiedDate: "Estimated (seasonal)",
        prices,
    };
});