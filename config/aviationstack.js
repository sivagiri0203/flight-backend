import axios from "axios";

const BASE = process.env.AVIATIONSTACK_BASE_URL || "https://api.aviationstack.com/v1";
const KEY = process.env.AVIATIONSTACK_ACCESS_KEY;

export async function aviationstackSearchFlights({ depIata, arrIata, date, limit = 20 }) {
  if (!KEY) throw new Error("Missing AVIATIONSTACK_ACCESS_KEY");

  // AviationStack doesn’t support “route search” perfectly.
  // Common approach: call /flights and filter.
  const { data } = await axios.get(`${BASE}/flights`, {
    params: {
      access_key: KEY,
      dep_iata: depIata,
      arr_iata: arrIata,
      limit,
      // if your plan supports date filtering, keep it
      flight_date: date,
    },
  });

  // return normalized
  return { results: data?.data || [] };
}
