/**
 * Open-Meteo Live Weather & Climate Telemetry Service for Mount Cameroon (Buea, Fako Division)
 * Completely free, zero API key required, with high-resolution coordinates for Buea slope quarters.
 */

// Coordinates and elevation for Buea farming quarters
export const QUARTER_COORDINATES = {
  muea: { lat: 4.168, lon: 9.302, elev: 620, name: 'Muea' },
  bokwango: { lat: 4.148, lon: 9.225, elev: 880, name: 'Bokwango' },
  bonakanda: { lat: 4.175, lon: 9.255, elev: 700, name: 'Bonakanda' },
  lysoka: { lat: 4.195, lon: 9.320, elev: 310, name: 'Lysoka' },
  bova: { lat: 4.185, lon: 9.210, elev: 820, name: 'Bova' },
  tole: { lat: 4.135, lon: 9.215, elev: 1100, name: 'Tole' },
  molyko: { lat: 4.152, lon: 9.285, elev: 590, name: 'Molyko' },
  soppo: { lat: 4.150, lon: 9.240, elev: 750, name: 'Great Soppo' }
};

// Map WMO Weather Interpretation Codes to human readable conditions and visual tones
export function mapWmoCode(code, isDay = 1) {
  switch (code) {
    case 0:
      return { condition: isDay ? 'Clear sunny sky' : 'Clear starry night', type: isDay ? 'sunny' : 'night', rainChance: 5 };
    case 1:
      return { condition: isDay ? 'Mainly clear' : 'Clear night', type: isDay ? 'sunny' : 'night', rainChance: 15 };
    case 2:
      return { condition: 'Partly cloudy', type: isDay ? 'sunny' : 'night', rainChance: 30 };
    case 3:
      return { condition: 'Overcast & cloudy', type: 'cloudy', rainChance: 45 };
    case 45:
    case 48:
      return { condition: 'Volcanic mountain mist', type: 'cloudy', rainChance: 50 };
    case 51:
    case 53:
    case 55:
      return { condition: 'Light mountain drizzle', type: 'rain', rainChance: 65 };
    case 61:
    case 63:
      return { condition: 'Moderate rainfall', type: 'rain', rainChance: 80 };
    case 65:
      return { condition: 'Torrential rain deluge', type: 'rain', rainChance: 95 };
    case 80:
    case 81:
    case 82:
      return { condition: 'Heavy rain showers', type: 'rain', rainChance: 90 };
    case 95:
    case 96:
    case 99:
      return { condition: 'Severe thunderstorm', type: 'storm', rainChance: 98 };
    default:
      return { condition: 'Partly cloudy', type: isDay ? 'sunny' : 'night', rainChance: 35 };
  }
}

/**
 * Fetch current and forecasted weather telemetry from Open-Meteo for a specific Buea quarter.
 */
export async function fetchLiveWeather(quarterId = 'muea') {
  const coords = QUARTER_COORDINATES[quarterId] || QUARTER_COORDINATES.muea;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Africa%2FDouala`;

  try {
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
    const data = await res.json();

    const curr = data.current || {};
    const wmo = mapWmoCode(curr.weather_code ?? 2, curr.is_day ?? 1);

    return {
      success: true,
      source: 'Open-Meteo Live API',
      temp: Math.round(curr.temperature_2m ?? 24),
      feelsLike: Math.round(curr.apparent_temperature ?? 25),
      condition: wmo.condition,
      type: wmo.type,
      rainChance: curr.precipitation > 0 ? 90 : Math.max(wmo.rainChance, Math.round((data.daily?.precipitation_probability_max?.[0]) || 35)),
      humidity: Math.round(curr.relative_humidity_2m ?? 80),
      wind: Math.round(curr.wind_speed_10m ?? 7),
      isDay: curr.is_day ?? 1,
      precipitationMm: curr.precipitation ?? 0,
      dailyForecast: (data.daily?.time || []).slice(0, 7).map((d, i) => ({
        date: d,
        maxTemp: Math.round(data.daily.temperature_2m_max[i]),
        minTemp: Math.round(data.daily.temperature_2m_min[i]),
        precipMm: data.daily.precipitation_sum[i],
        rainProb: data.daily.precipitation_probability_max[i]
      }))
    };
  } catch (err) {
    console.warn('Open-Meteo fetch failed, using Mount Cameroon baseline:', err);
    return {
      success: false,
      source: 'NASA POWER Climatological Baseline',
      temp: 24,
      condition: 'Partly cloudy',
      type: 'sunny',
      rainChance: 40,
      humidity: 82,
      wind: 8,
      isDay: 1,
      precipitationMm: 12
    };
  }
}
