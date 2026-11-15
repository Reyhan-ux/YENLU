import { rainTotal30 } from '../data/rainfall';
import { toUnits, rainUnit } from './format';

// Map / insights layers and their colour scales.
export const LAYERS = [
  { value: 'flood', label: 'Flood risk' },
  { value: 'rain', label: 'Rainfall (30 days)' },
  { value: 'soil', label: 'Soil moisture' },
  { value: 'health', label: 'Crop health' },
];
const FLOOD_SCORE = { low: 25, medium: 55, high: 85 };
const FLOOD_COLOR = { low: '#2F9A63', medium: '#E5A93C', high: '#D9534F' };

export const layerValue = (f, layer) =>
  layer === 'flood' ? FLOOD_SCORE[f.floodRisk] : layer === 'rain' ? rainTotal30(f) : layer === 'soil' ? f.soilMoisture : f.health;

export const layerLabel = (f, layer, units) =>
  layer === 'flood' ? `${f.floodRisk} risk` : layer === 'rain' ? `${toUnits(rainTotal30(f), units)} ${rainUnit(units)}` : `${layerValue(f, layer)}%`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t)).join(',')})`;

export function layerColor(f, layer) {
  if (layer === 'flood') return FLOOD_COLOR[f.floodRisk];
  const t = Math.min(1, layerValue(f, layer) / (layer === 'rain' ? 450 : 100));
  return layer === 'rain' ? mix('#A9D2F2', '#1F5FB0', t) : mix('#BFE3CB', '#0F6B40', t);
}
