// ============================================================
// HELIO — SPACE WEATHER API
// NASA CCMC DONKI + NOAA SWPC
// ============================================================

const NASA_API_KEY =
  import.meta.env.VITE_NASA_API_KEY || "DEMO_KEY";

// NASA CCMC updated the DONKI API infrastructure
// effective September 30, 2026.
const NASA_BASE_URL =
  "https://ccmc.gsfc.nasa.gov/DONKI-API/get";

const NOAA_SOLAR_WIND_URL =
  "https://services.swpc.noaa.gov/products/summary/solar-wind-speed.json";


// ============================================================
// DATE HELPERS
// ============================================================

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function getDateRange(days = 7) {
  const endDate = new Date();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}


// ============================================================
// NASA DONKI REQUEST
// ============================================================

async function fetchNASA(endpoint) {
  const {
    startDate,
    endDate,
  } = getDateRange(7);

  const url =
    `${NASA_BASE_URL}/${endpoint}` +
    `?startDate=${startDate}` +
    `&endDate=${endDate}` +
    `&api_key=${NASA_API_KEY}`;

  console.log(
    `[HELIO] NASA ${endpoint}:`,
    url.replace(
      NASA_API_KEY,
      "API_KEY"
    )
  );

  try {
    const response = await fetch(url);

    if (!response.ok) {
      let message = "";

      try {
        message = await response.text();
      } catch {
        message = "";
      }

      throw new Error(
        `NASA ${endpoint} error: ${response.status}` +
        (
          message
            ? ` — ${message.slice(0, 180)}`
            : ""
        )
      );
    }

    const data =
      await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        `NASA ${endpoint} returned invalid data`
      );
    }

    console.log(
      `[HELIO] NASA ${endpoint}: ${data.length} events`
    );

    return data;

  } catch (error) {

    console.error(
      `[HELIO] NASA ${endpoint} failed:`,
      error
    );

    throw error;
  }
}


// ============================================================
// SOLAR FLARES
// ============================================================

export async function getSolarFlares() {
  return fetchNASA("FLR");
}


// ============================================================
// CORONAL MASS EJECTIONS
// ============================================================

export async function getCMEs() {
  return fetchNASA("CME");
}


// ============================================================
// GEOMAGNETIC STORMS
// ============================================================

export async function getGeomagneticStorms() {
  return fetchNASA("GST");
}


// ============================================================
// NOAA SOLAR WIND
// ============================================================

export async function getSolarWindSpeed() {

  console.log(
    "[HELIO] NOAA Solar Wind:"
  );

  try {

    const response =
      await fetch(
        NOAA_SOLAR_WIND_URL
      );

    if (!response.ok) {
      throw new Error(
        `NOAA Solar Wind error: ${response.status}`
      );
    }

    const data =
      await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "NOAA Solar Wind returned invalid data"
      );
    }

    /*
      NOAA returns something like:

      [
        {
          proton_speed: 287,
          time_tag: "2026-10-03T..."
        }
      ]
    */

    const latest =
      data[0] || null;

    if (latest) {
      console.log(
        `[HELIO] Solar wind speed: ${latest.proton_speed} km/s`
      );
    }

    return latest;

  } catch (error) {

    console.error(
      "[HELIO] NOAA Solar Wind failed:",
      error
    );

    throw error;
  }
}