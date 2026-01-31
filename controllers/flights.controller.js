// backend/controllers/flights.controller.js
import { ok, bad } from "../utils/response.js";
import { aviationstackSearchFlights } from "../config/aviationstack.js"; // adjust if your function name differs
import { buildCabinPrices } from "../utils/priceEngine.js";

// GET /api/flights/search?depIata=MAA&arrIata=DEL&date=2026-01-31&limit=20
export async function searchFlights(req, res) {
  try {
    const { depIata, arrIata, date, limit = 20 } = req.query;

    if (!depIata || !arrIata) return bad(res, "depIata and arrIata are required");

    // ✅ call aviationstack (your existing config wrapper)
    const data = await aviationstackSearchFlights({
      depIata: String(depIata).toUpperCase(),
      arrIata: String(arrIata).toUpperCase(),
      date,
      limit: Number(limit) || 20,
    });

    // data.results should be aviationstack flights array in your project
    const results = (data?.results || []).map((f) => {
      const airlineIata = f?.airline?.iata || "DEFAULT";

      // optional distanceKm if you compute elsewhere; leaving undefined uses fallback
      const pricing = buildCabinPrices({ airlineIata, date });

      // normalize output (keep your original flight)
      return {
        ...f,
        pricing, // { cabins: [{class,price}...], minPrice, currency }
      };
    });

    // You can sort cheapest by default
    results.sort((a, b) => (a.pricing?.minPrice || 0) - (b.pricing?.minPrice || 0));

    return ok(res, { results }, "Flights fetched");
  } catch (err) {
    return bad(res, err.message || "Flight search failed");
  }
}
