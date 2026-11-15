// Sample fields for smallholder farms around Buea, Fako Division, Southwest Region, Cameroon.
// Illustrative data for the prototype. Replace with real plot records and NASA POWER results.

/** Crop families used by the rotation rules. */
export const FAMILIES = {
  legume: { label: 'Legume', note: 'fixes nitrogen and rebuilds the soil.', crops: ['Groundnut', 'Common beans', 'Soybean'] },
  vegetable: { label: 'Vegetable', note: 'heavy feeders that use the nitrogen left behind by legumes.', crops: ['Tomato', 'Okra', 'Huckleberry'] },
  cereal: { label: 'Cereal', note: 'breaks pest and disease cycles of vegetables and roots.', crops: ['Maize'] },
  root: { label: 'Root and tuber', note: 'loosens compacted soil and draws on deeper nutrients.', crops: ['Cassava', 'Cocoyam', 'Irish potato'] },
};

/** Rotation order: nitrogen builder first, soil breaker last. */
export const CYCLE = ['legume', 'vegetable', 'cereal', 'root'];

// history: most recent previous crop first.
export const FIELDS = [
  { id: 'muea-north', name: 'Muea North Plot', short: 'Muea N', zone: 'Muea', area: 2.4, crop: 'Maize', cropId: 'maize', family: 'cereal', stage: 'Tasseling', health: 84, soilMoisture: 62, floodRisk: 'low', soil: 'Volcanic loam', elevation: 620, lat: 4.168, lon: 9.302, planted: '2026-08-14', harvest: '2026-12-10', history: ['Tomato', 'Groundnut'], rainFactor: 1.0, map: { x: 64, y: 52 } },
  { id: 'bokwango-terrace', name: 'Bokwango Terrace', short: 'Bokwango', zone: 'Bokwango', area: 1.8, crop: 'Common beans', cropId: 'bush_beans', family: 'legume', stage: 'Pod filling', health: 91, soilMoisture: 58, floodRisk: 'low', soil: 'Well-drained volcanic soil', elevation: 880, lat: 4.148, lon: 9.225, planted: '2026-09-02', harvest: '2026-11-28', history: ['Cassava', 'Maize'], rainFactor: 1.2, map: { x: 36, y: 28 } },
  { id: 'bonakanda-flats', name: 'Bonakanda Flats', short: 'Bonakanda', zone: 'Bonakanda', area: 3.1, crop: 'Cassava', cropId: 'cassava', family: 'root', stage: 'Tuber bulking', health: 76, soilMoisture: 71, floodRisk: 'medium', soil: 'Sandy loam', elevation: 700, lat: 4.175, lon: 9.255, planted: '2026-03-20', harvest: '2027-01-15', history: ['Maize', 'Okra'], rainFactor: 0.95, map: { x: 60, y: 36 } },
  { id: 'lysoka-lowland', name: 'Lysoka Lowland', short: 'Lysoka', zone: 'Lysoka', area: 2.0, crop: 'Tomato', cropId: 'tomato', family: 'vegetable', stage: 'Fruiting', health: 63, soilMoisture: 83, floodRisk: 'high', soil: 'Clay loam, slow drainage', elevation: 310, lat: 4.195, lon: 9.320, planted: '2026-08-25', harvest: '2026-12-02', history: ['Groundnut', 'Cassava'], rainFactor: 0.9, map: { x: 40, y: 62 } },
  { id: 'bova-slope', name: 'Bova Slope Garden', short: 'Bova', zone: 'Bova', area: 1.2, crop: 'Cocoyam', cropId: 'cocoyam', family: 'root', stage: 'Corm development', health: 88, soilMoisture: 66, floodRisk: 'medium', soil: 'Humus-rich loam', elevation: 820, lat: 4.185, lon: 9.210, planted: '2026-04-10', harvest: '2027-01-30', history: ['Maize', 'Huckleberry'], rainFactor: 1.15, map: { x: 20, y: 38 } },
  { id: 'tole-highland', name: 'Tole Highland Plot', short: 'Tole', zone: 'Tole', area: 1.6, crop: 'Irish potato', cropId: 'irish_potato', family: 'root', stage: 'Tuber filling', health: 80, soilMoisture: 57, floodRisk: 'low', soil: 'Cool, deep volcanic soil', elevation: 1100, lat: 4.135, lon: 9.215, planted: '2026-09-18', harvest: '2026-12-20', history: ['Maize', 'Okra'], rainFactor: 1.25, map: { x: 24, y: 20 } },
  { id: 'molyko-garden', name: 'Molyko Backyard Garden', short: 'Molyko', zone: 'Molyko', area: 0.5, crop: 'Huckleberry', cropId: 'njama_njama', family: 'vegetable', stage: 'Leaf harvest', health: 90, soilMoisture: 64, floodRisk: 'low', soil: 'Loam with compost', elevation: 590, lat: 4.152, lon: 9.285, planted: '2026-10-01', harvest: '2026-12-15', history: ['Groundnut', 'Cassava'], rainFactor: 1.05, map: { x: 52, y: 50 } },
  { id: 'muea-groundnut', name: 'Muea Groundnut Block', short: 'Muea Block', zone: 'Muea', area: 2.6, crop: 'Groundnut', cropId: 'cowpea', family: 'legume', stage: 'Flowering', health: 79, soilMoisture: 52, floodRisk: 'low', soil: 'Light sandy loam', elevation: 640, lat: 4.162, lon: 9.310, planted: '2026-09-25', harvest: '2027-01-05', history: ['Cassava', 'Maize'], rainFactor: 1.0, map: { x: 76, y: 60 } },
];

export const ZONES = [...new Set(FIELDS.map((f) => f.zone))].sort();
export const TOTAL_AREA = +FIELDS.reduce((s, f) => s + f.area, 0).toFixed(1);
