// backend/utils/priceEngine.js

const CABIN_MULTIPLIER = {
  economy: 1.0,
  premium: 1.35,
  business: 2.1,
  first: 3.0,
};

// rough airline multiplier by IATA (extend anytime)
const AIRLINE_MULTIPLIER = {
  "AI": 1.20,   // Air India
  "UK": 1.25,   // Vistara (old IATA UK)
  "6E": 1.05,   // IndiGo
  "SG": 1.00,   // SpiceJet
  "G8": 0.98,   // Go First (legacy)
  DEFAULT: 1.12,
};

// optional demand factor by day of week (simple)
function demandFactor(dateStr) {
  if (!dateStr) return 1.0;
  const d = new Date(dateStr);
  const day = d.getDay(); // 0 Sun ... 6 Sat
  if (day === 5 || day === 6) return 1.12; // Fri/Sat
  if (day === 0) return 1.08; // Sun
  return 1.0;
}

// distance is optional; if you don't have it, use fallback
function baseFareINR(distanceKm = 900) {
  // simple base fare using distance buckets
  if (distanceKm <= 500) return 2499;
  if (distanceKm <= 1200) return 3299;
  if (distanceKm <= 2500) return 4499;
  return 5999;
}

export function buildCabinPrices({ airlineIata, date, distanceKm }) {
  const airlineFactor = AIRLINE_MULTIPLIER[airlineIata] || AIRLINE_MULTIPLIER.DEFAULT;
  const demand = demandFactor(date);
  const base = baseFareINR(distanceKm);

  const cabins = Object.keys(CABIN_MULTIPLIER).map((cls) => {
    const price = Math.round(base * airlineFactor * CABIN_MULTIPLIER[cls] * demand);
    return { class: cls, price };
  });

  const minPrice = Math.min(...cabins.map((c) => c.price));
  return { cabins, minPrice, currency: "INR" };
}
