import { Origin, haversineKm, roadDistanceKm } from "./geo";
import { MandiMarket } from "./mockMandiData";

export interface CoLoaderFarmer {
  id: string;
  name: string;
  phoneMasked: string;
  pickupLocation: string;
  pickupDistanceKm: number; // distance from route start
  lat: number;
  lng: number;
  crop: string;
  cropEmoji: string;
  quantityKg: number;
  destinationMandi: string;
  isCurrentUser?: boolean;
  status: "Confirmed" | "Pending Match" | "En-Route";
}

export interface RouteCorridorPlan {
  id: string;
  corridorName: string;
  originName: string;
  destinationName: string;
  totalDistanceKm: number;
  truckType: string;
  truckCapacityKg: number;
  truckBaseSoloCost: number; // ₹ full truck charter
  farmers: CoLoaderFarmer[];
}

// Predefined corridors with realistic highway pickup waypoints in Maharashtra
export const PRESET_CORRIDORS: Record<string, RouteCorridorPlan> = {
  "pune-mumbai": {
    id: "pune-mumbai",
    corridorName: "Pune ➔ Mumbai Vashi APMC (via Mumbai-Pune Expressway / NH 48)",
    originName: "Pune (Hadapsar / Haveli)",
    destinationName: "Mumbai Vashi APMC",
    totalDistanceKm: 145,
    truckType: "Tata 1109 (10 Tonne Heavy)",
    truckCapacityKg: 10000,
    truckBaseSoloCost: 16000, // ₹160/Qtl solo baseline for 10T
    farmers: [
      {
        id: "farmer-you",
        name: "You (Ramesh Patil)",
        phoneMasked: "+91 98234 •••••",
        pickupLocation: "Origin: Hadapsar, Pune",
        pickupDistanceKm: 0,
        lat: 18.5089,
        lng: 73.9259,
        crop: "Tomatoes",
        cropEmoji: "🍅",
        quantityKg: 5000,
        destinationMandi: "Mumbai Vashi APMC",
        isCurrentUser: true,
        status: "Confirmed",
      },
      {
        id: "farmer-talegaon",
        name: "Suresh Shinde",
        phoneMasked: "+91 94220 •••••",
        pickupLocation: "Waypoint 1: Talegaon Toll Hub (NH 48)",
        pickupDistanceKm: 35,
        lat: 18.7303,
        lng: 73.6738,
        crop: "Red Onions",
        cropEmoji: "🧅",
        quantityKg: 2000,
        destinationMandi: "Mumbai Vashi APMC",
        status: "Confirmed",
      },
      {
        id: "farmer-khopoli",
        name: "Anand Deshmukh",
        phoneMasked: "+91 98601 •••••",
        pickupLocation: "Waypoint 2: Khalapur / Khopoli Junction",
        pickupDistanceKm: 80,
        lat: 18.7892,
        lng: 73.3421,
        crop: "Potatoes",
        cropEmoji: "🥔",
        quantityKg: 1500,
        destinationMandi: "Mumbai Vashi APMC",
        status: "Confirmed",
      },
    ],
  },

  "nashik-mumbai": {
    id: "nashik-mumbai",
    corridorName: "Nashik ➔ Mumbai Vashi APMC (via NH 160 / Samruddhi Corridor)",
    originName: "Nashik (Niphad Onion Belt)",
    destinationName: "Mumbai Vashi APMC",
    totalDistanceKm: 165,
    truckType: "Eicher Pro 1110 (7 Tonne)",
    truckCapacityKg: 7000,
    truckBaseSoloCost: 11000,
    farmers: [
      {
        id: "farmer-you-nashik",
        name: "You (Niphad Grower)",
        phoneMasked: "+91 98221 •••••",
        pickupLocation: "Origin: Niphad Mandi Yard",
        pickupDistanceKm: 0,
        lat: 20.0768,
        lng: 74.1082,
        crop: "Red Onions",
        cropEmoji: "🧅",
        quantityKg: 3500,
        destinationMandi: "Mumbai Vashi APMC",
        isCurrentUser: true,
        status: "Confirmed",
      },
      {
        id: "farmer-igatpuri",
        name: "Balasaheb Jadhav",
        phoneMasked: "+91 97632 •••••",
        pickupLocation: "Waypoint 1: Igatpuri Freight Hub",
        pickupDistanceKm: 45,
        lat: 19.6967,
        lng: 73.5593,
        crop: "Tomatoes",
        cropEmoji: "🍅",
        quantityKg: 1800,
        destinationMandi: "Mumbai Vashi APMC",
        status: "Confirmed",
      },
      {
        id: "farmer-shahapur",
        name: "Ganesh More",
        phoneMasked: "+91 98904 •••••",
        pickupLocation: "Waypoint 2: Shahapur Toll Checkpoint",
        pickupDistanceKm: 105,
        lat: 19.4533,
        lng: 73.3317,
        crop: "Grapes",
        cropEmoji: "🍇",
        quantityKg: 1000,
        destinationMandi: "Mumbai Vashi APMC",
        status: "Confirmed",
      },
    ],
  },

  "baramati-pune": {
    id: "baramati-pune",
    corridorName: "Baramati ➔ Pune Gultekdi Mandi (via Baramati-Hadapsar Highway)",
    originName: "Baramati Agricultural Zone",
    destinationName: "Pune Gultekdi Market Yard",
    totalDistanceKm: 100,
    truckType: "Mahindra Bolero Maxi Truck (2.5 Tonne)",
    truckCapacityKg: 2500,
    truckBaseSoloCost: 3500,
    farmers: [
      {
        id: "farmer-you-baramati",
        name: "You (Baramati Farmer)",
        phoneMasked: "+91 98234 •••••",
        pickupLocation: "Origin: Baramati APMC Gate",
        pickupDistanceKm: 0,
        lat: 18.1514,
        lng: 74.5815,
        crop: "Soybeans",
        cropEmoji: "🌱",
        quantityKg: 1200,
        destinationMandi: "Pune Gultekdi Market Yard",
        isCurrentUser: true,
        status: "Confirmed",
      },
      {
        id: "farmer-uruli",
        name: "Santosh Jagtap",
        phoneMasked: "+91 94231 •••••",
        pickupLocation: "Waypoint 1: Uruli Kanchan Hub",
        pickupDistanceKm: 65,
        lat: 18.4842,
        lng: 74.1352,
        crop: "Wheat",
        cropEmoji: "🌾",
        quantityKg: 800,
        destinationMandi: "Pune Gultekdi Market Yard",
        status: "Confirmed",
      },
    ],
  },
};

/**
 * Generates dynamic corridor farmers for any origin & destination mandi
 */
export function getCorridorPlan(
  origin: Origin,
  mandi: MandiMarket,
  userQuantityKg: number = 5000,
  userCrop: string = "Tomatoes"
): RouteCorridorPlan {
  const destLower = mandi.name.toLowerCase();
  const origLower = origin.nameEn.toLowerCase();

  // Match preset corridors if available
  if ((destLower.includes("mumbai") || destLower.includes("vashi") || destLower.includes("thane")) && origLower.includes("pune")) {
    const plan = { ...PRESET_CORRIDORS["pune-mumbai"] };
    plan.farmers[0].quantityKg = userQuantityKg;
    plan.farmers[0].crop = userCrop;
    return plan;
  }

  if ((destLower.includes("mumbai") || destLower.includes("vashi")) && origLower.includes("nashik")) {
    const plan = { ...PRESET_CORRIDORS["nashik-mumbai"] };
    plan.farmers[0].quantityKg = userQuantityKg;
    plan.farmers[0].crop = userCrop;
    return plan;
  }

  if (destLower.includes("pune") && (origLower.includes("baramati") || origLower.includes("satara") || origLower.includes("daund"))) {
    const plan = { ...PRESET_CORRIDORS["baramati-pune"] };
    plan.farmers[0].quantityKg = userQuantityKg;
    plan.farmers[0].crop = userCrop;
    return plan;
  }

  // Generate dynamic waypoints between origin and destination
  const totalDist = roadDistanceKm(origin.lat, origin.lng, mandi.lat, mandi.lng);
  const truckCapacity = userQuantityKg > 4000 ? 10000 : 5000;
  const truckType = truckCapacity === 10000 ? "Tata 1109 (10 Tonne)" : "Tata 407 (4 Tonne)";
  const soloBaseRatePerQtl = Math.round(Math.max(60, totalDist * 1.05 + 20));
  const truckBaseSoloCost = Math.round((truckCapacity / 100) * soloBaseRatePerQtl);

  // Dynamic co-loader 1 (at ~30% distance along corridor)
  const w1Lat = origin.lat + (mandi.lat - origin.lat) * 0.35 + 0.02;
  const w1Lng = origin.lng + (mandi.lng - origin.lng) * 0.35 - 0.02;

  // Dynamic co-loader 2 (at ~65% distance along corridor)
  const w2Lat = origin.lat + (mandi.lat - origin.lat) * 0.68 - 0.02;
  const w2Lng = origin.lng + (mandi.lng - origin.lng) * 0.68 + 0.02;

  const coLoader1Kg = Math.min(2500, Math.round((truckCapacity - userQuantityKg) * 0.55));
  const coLoader2Kg = Math.max(500, Math.round((truckCapacity - userQuantityKg - coLoader1Kg) * 0.7));

  return {
    id: `${origin.id}-${mandi.id}`,
    corridorName: `${origin.nameEn} ➔ ${mandi.name} Corridor`,
    originName: `${origin.nameEn} Farm Hub`,
    destinationName: mandi.name,
    totalDistanceKm: totalDist,
    truckType,
    truckCapacityKg: truckCapacity,
    truckBaseSoloCost,
    farmers: [
      {
        id: "farmer-you-dynamic",
        name: `You (${origin.nameEn})`,
        phoneMasked: "+91 98234 •••••",
        pickupLocation: `Origin: ${origin.nameEn} Farm Dispatch`,
        pickupDistanceKm: 0,
        lat: origin.lat,
        lng: origin.lng,
        crop: userCrop,
        cropEmoji: "🌾",
        quantityKg: userQuantityKg,
        destinationMandi: mandi.name,
        isCurrentUser: true,
        status: "Confirmed",
      },
      {
        id: "farmer-enroute-1",
        name: "Suresh Patil",
        phoneMasked: "+91 94220 •••••",
        pickupLocation: `Waypoint 1 (Toll Gate / Junction)`,
        pickupDistanceKm: Math.round(totalDist * 0.35),
        lat: w1Lat,
        lng: w1Lng,
        crop: "Red Onions",
        cropEmoji: "🧅",
        quantityKg: coLoader1Kg > 0 ? coLoader1Kg : 1500,
        destinationMandi: mandi.name,
        status: "Confirmed",
      },
      {
        id: "farmer-enroute-2",
        name: "Anand Shinde",
        phoneMasked: "+91 98601 •••••",
        pickupLocation: `Waypoint 2 (Highway Aggregation Point)`,
        pickupDistanceKm: Math.round(totalDist * 0.68),
        lat: w2Lat,
        lng: w2Lng,
        crop: "Potatoes",
        cropEmoji: "🥔",
        quantityKg: coLoader2Kg > 0 ? coLoader2Kg : 1000,
        destinationMandi: mandi.name,
        status: "Confirmed",
      },
    ],
  };
}

export interface ProportionalSplitResult {
  farmerId: string;
  farmerName: string;
  crop: string;
  quantityKg: number;
  carriedDistanceKm: number;
  tonKm: number;
  weightPct: number;
  soloCost: number;
  splitCost: number;
  savingsRs: number;
  savingsPct: number;
  ratePerQtl: number;
}

/**
 * Calculates fair proportional cost-split based on Ton-Km (Weight × Distance Carried)
 * and compares it with what each farmer would pay for solo rental.
 */
export function calculateCorridorSplit(plan: RouteCorridorPlan): {
  splits: ProportionalSplitResult[];
  totalCarriedKg: number;
  spareCapacityKg: number;
  loadPct: number;
  totalFreightBill: number;
  totalCommunitySavings: number;
} {
  const totalCarriedKg = plan.farmers.reduce((sum, f) => sum + f.quantityKg, 0);
  const spareCapacityKg = Math.max(0, plan.truckCapacityKg - totalCarriedKg);
  const loadPct = Math.min(100, Math.round((totalCarriedKg / plan.truckCapacityKg) * 100));

  // Baseline pooled rate: ~₹0.65 to ₹0.75 per quintal per 100km or fixed corridor cost
  // Total shared bill with co-loading discount
  const pooledTotalBill = Math.round(plan.truckBaseSoloCost * 0.65);

  // Calculate Ton-Km for each farmer: (Weight in Tonnes) × (Total Dist - Pickup Dist)
  const farmerTonKms = plan.farmers.map((f) => {
    const distanceTraveled = Math.max(10, plan.totalDistanceKm - f.pickupDistanceKm);
    const ton = f.quantityKg / 1000;
    const tonKm = ton * distanceTraveled;
    return {
      farmer: f,
      distanceTraveled,
      tonKm,
    };
  });

  const totalTonKm = farmerTonKms.reduce((sum, item) => sum + item.tonKm, 0) || 1;

  let totalCommunitySavings = 0;

  const splits: ProportionalSplitResult[] = farmerTonKms.map(({ farmer, distanceTraveled, tonKm }) => {
    // Proportional share of the pooled bill
    const shareRatio = tonKm / totalTonKm;
    const splitCost = Math.round(pooledTotalBill * shareRatio);

    // Solo alternative: what would this farmer pay if hiring their own smaller vehicle?
    const qtl = farmer.quantityKg / 100;
    // Solo rate per Qtl is higher for smaller loads
    const soloRatePerQtl = Math.round((plan.truckBaseSoloCost / (plan.truckCapacityKg / 100)) * (distanceTraveled / plan.totalDistanceKm) * 1.35);
    const soloCost = Math.round(qtl * soloRatePerQtl);

    const savingsRs = Math.max(0, soloCost - splitCost);
    const savingsPct = soloCost > 0 ? Math.round((savingsRs / soloCost) * 100) : 38;
    const ratePerQtl = Math.round(splitCost / (farmer.quantityKg / 100));

    totalCommunitySavings += savingsRs;

    return {
      farmerId: farmer.id,
      farmerName: farmer.name,
      crop: farmer.crop,
      quantityKg: farmer.quantityKg,
      carriedDistanceKm: distanceTraveled,
      tonKm: Math.round(tonKm),
      weightPct: Math.round((farmer.quantityKg / totalCarriedKg) * 100),
      soloCost,
      splitCost,
      savingsRs,
      savingsPct,
      ratePerQtl,
    };
  });

  return {
    splits,
    totalCarriedKg,
    spareCapacityKg,
    loadPct,
    totalFreightBill: pooledTotalBill,
    totalCommunitySavings,
  };
}
