import { CYCLE, FAMILIES } from './fields';

// Planting windows for the two Buea rainy-season plantings.
const SEASONS = [
  { label: 'Season A 2027', window: '10 Mar to 5 Apr 2027' },
  { label: 'Season B 2027', window: '15 Aug to 10 Sep 2027' },
  { label: 'Season A 2028', window: '8 Mar to 4 Apr 2028' },
  { label: 'Season B 2028', window: '14 Aug to 9 Sep 2028' },
];

/** Builds the next four seasons by walking the rotation cycle from the current crop family. */
export function buildPlan(field) {
  const start = CYCLE.indexOf(field.family);
  return SEASONS.map((s, i) => {
    const family = CYCLE[(start + 1 + i) % CYCLE.length];
    const prev = CYCLE[(start + i) % CYCLE.length];
    const crops = FAMILIES[family].crops;
    return {
      ...s,
      family,
      crops,
      crop: crops[(i + field.id.length) % crops.length],
      reason: `${FAMILIES[family].label} after ${FAMILIES[prev].label.toLowerCase()}: ${FAMILIES[family].note}`,
    };
  });
}

/** Plain-language advice derived from the field's current readings. */
export function advisories(field) {
  const out = [];
  if (field.floodRisk === 'high') out.push({ tone: 'danger', text: 'Waterlogging risk is high. Clear drainage channels and hold fertiliser until the soil drains.' });
  if (field.floodRisk === 'medium') out.push({ tone: 'warning', text: 'Moderate flood risk after heavy rain. Check low corners of the plot for standing water.' });
  if (field.soilMoisture < 55) out.push({ tone: 'warning', text: 'Soil moisture is low. Mulch with dry grass or plantain leaves to hold water.' });
  if (field.health < 70) out.push({ tone: 'danger', text: 'Crop health is below target. Scout for pests and leaf disease this week.' });
  if (!out.length) out.push({ tone: 'success', text: 'Conditions are good. No action needed this week.' });
  const next = buildPlan(field)[0];
  out.push({ tone: 'info', text: `After harvest, plant ${next.crop.toLowerCase()} in ${next.label} (${next.window}).` });
  return out;
}
