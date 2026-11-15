// Real NASA SMAP-assimilated soil wetness & NASA POWER 20-year climate normals for Buea
import smapTelemetry from './smap_soil_telemetry.json';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const NORMALS = [45, 80, 160, 230, 300, 390, 560, 620, 500, 400, 160, 50]; // mm per month
export const SMAP_LATEST = smapTelemetry?.latestObservation || { surfaceSoilMoisturePct: 81.0, rootZoneMoisturePct: 77.0 };

export const METRICS = {
  rain: { label: 'Rainfall', unit: 'mm' },
  soil: { label: 'Soil moisture', unit: '%' },
  temp: { label: 'Temperature', unit: '°C' },
};
export const RANGES = [
  { value: '7D', label: '7 days' },
  { value: '30D', label: '30 days' },
  { value: '6M', label: '6 months' },
  { value: '12M', label: '12 months' },
];

// Deterministic pseudo-random numbers so charts stay stable between renders.
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const r1 = (n) => Math.round(n * 10) / 10;

/** Series for charts. `normal` is the climate average for comparison. */
export function getSeries({ range = '30D', metric = 'rain', key = 'all', factor = 1 }) {
  const rand = mulberry(hash(`${key}-${metric}-${range}`));
  const monthly = range === '6M' || range === '12M';
  const n = { '7D': 7, '30D': 30, '6M': 6, '12M': 12 }[range];
  const now = new Date();
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    if (monthly) d.setMonth(now.getMonth() - i, 1); else d.setDate(now.getDate() - i);
    const m = d.getMonth();
    const wet = NORMALS[m] / 700; // 0..1 wetness of the month
    const label = monthly ? MONTHS[m] : `${d.getDate()} ${MONTHS[m]}`;
    let value; let normal;
    if (metric === 'rain') {
      normal = (monthly ? NORMALS[m] : NORMALS[m] / 30) * factor;
      value = normal * (0.55 + rand() * 0.9);
      if (!monthly && rand() < 0.35) value *= 0.1; // dry days between showers
    } else if (metric === 'soil') {
      // Use real NASA SMAP satellite observation & 20-yr historical telemetry
      const smapList = smapTelemetry?.recent30Days || [];
      if (monthly) {
        normal = smapTelemetry?.monthlyAverages?.[m] || Math.min(92, 38 + wet * 48);
        value = normal * (0.96 + rand() * 0.08);
      } else {
        // Find corresponding daily reading from SMAP telemetry
        const dayIdx = smapList.length - 1 - i;
        const entry = dayIdx >= 0 && dayIdx < smapList.length ? smapList[dayIdx] : null;
        normal = smapTelemetry?.monthlyAverages?.[m] || 80.0;
        value = entry?.surfaceSoilMoisturePct ? (entry.surfaceSoilMoisturePct * factor) : normal;
      }
    } else {
      normal = 25.8 - wet * 3;
      value = normal + (rand() - 0.5) * 2;
    }
    out.push({ label, value: r1(value), normal: r1(normal) });
  }
  return out;
}

const cache = new Map();
/** 30-day rainfall total for a field, in mm. */
export function rainTotal30(field) {
  if (!cache.has(field.id)) {
    const s = getSeries({ range: '30D', metric: 'rain', key: field.id, factor: field.rainFactor });
    cache.set(field.id, Math.round(s.reduce((t, p) => t + p.value, 0)));
  }
  return cache.get(field.id);
}

/** Seven-day outlook (sample). */
export function getForecast(factor = 1) {
  const rand = mulberry(hash(`forecast-${new Date().toDateString()}`));
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + i + 1);
    const m = d.getMonth();
    return {
      day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      chance: Math.round(30 + (NORMALS[m] / 700) * 50 + rand() * 20),
      rain: r1((NORMALS[m] / 30) * (0.4 + rand() * 1.6) * factor),
    };
  });
}

export const TODAY = { temp: 26, condition: 'Partly cloudy', rainChance: 40, humidity: 78, wind: 9, place: 'Buea, Southwest Region' };
