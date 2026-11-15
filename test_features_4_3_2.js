import { AdvisoryEngine } from './engine/advisoryEngine.js';

const engine = new AdvisoryEngine('.');

console.log('======================================================================');
console.log('     YENLU FIELD SHIFT: TESTING TOP-LEVEL ADVANCED FEATURES (4, 3, 2)');
console.log('======================================================================\n');

// -------------------------------------------------------------------------
// FEATURE 3: LIVE "ADD-A-CROP" STAGE DEMO
// -------------------------------------------------------------------------
console.log('>>> [FEATURE 3] LIVE "ADD-A-CROP" SIMULATOR DEMO: Adding "Ginger"\n');

const customCropResult = engine.addCustomCrop({
  crop_id: 'ginger',
  common_name: 'Ginger',
  local_name: 'Djia',
  category: 'Spices / Cash Crop',
  duration_days_min: 210,
  duration_days_max: 260,
  waterlogging_tolerance: 'Low',
  preferred_elevation_min_m: 400,
  preferred_elevation_max_m: 1300,
  optimal_temp_c_min: 20,
  optimal_temp_c_max: 30,
  max_slope_pct: 18,
  soil_ph_min: 5.0,
  soil_ph_max: 6.5,
  nitrogen_fixing: false,
  price_xaf_kg: 1200, // Premium cash price
  typical_yield_kg_ha: 7500, // 7.5 tons/ha
  market_tier: 'High-Margin Spice Export',
  rotation_role: 'High-margin cash anchor; requires well-drained volcanic ridges'
});

console.log(`Add Crop Status: ${customCropResult.status} - "${customCropResult.message}"`);
console.log(`Estimated Gross Revenue: ${customCropResult.economics.est_gross_revenue_xaf_ha.toLocaleString()} XAF/ha at ${customCropResult.economics.avg_price_xaf_kg} XAF/kg\n`);

// -------------------------------------------------------------------------
// FEATURE 4: INTERACTIVE "WHAT-IF" CLIMATE STRESS SIMULATOR
// -------------------------------------------------------------------------
console.log('======================================================================');
console.log('>>> [FEATURE 4] "WHAT-IF" CLIMATE SHIFT SIMULATION (+25% Extreme Rain Shift)\n');

// Baseline run without shift
const baselineUpper = engine.generateAdvisory(4.160, 9.225, 'maize');

// What-If run with +25% rain increase
const whatIfUpper = engine.generateAdvisory(
  4.160, 9.225, 'maize',
  { income: 0.35, climate_safety: 0.35, soil_health: 0.30 },
  { rainMultiplier: 1.25, onsetDelayDays: 10 }
);

console.log('Location: Upper Farms (1114m, 21.9% slope)');
console.log(`Historical Baseline Slot 2 Score: ${baselineUpper.rotations.slot_2_recommended.score}/100 (${baselineUpper.rotations.slot_2_recommended.name})`);
console.log(`What-If (+25% Rain) Slot 2 Score:   ${whatIfUpper.rotations.slot_2_recommended.score}/100 (${whatIfUpper.rotations.slot_2_recommended.name})`);
console.log(`What-If Scenario Flag: ${whatIfUpper.what_if_scenario.is_hypothetical ? 'ACTIVE HYPOTHETICAL SIMULATION' : 'Standard'}\n`);

// -------------------------------------------------------------------------
// FEATURE 2: DUAL-LANGUAGE GROUNDED ADVICE (ENGLISH & CAMEROON PIDGIN)
// -------------------------------------------------------------------------
console.log('======================================================================');
console.log('>>> [FEATURE 2] DUAL-LANGUAGE GROUNDED ADVICE (English & Cameroon Pidgin)\n');

whatIfUpper.advisory_statements.forEach((adv, i) => {
  console.log(`--- Advisory ${i + 1}: ${adv.topic} ---`);
  console.log(`🇬🇧 ENGLISH:`);
  console.log(`   "${adv.text_en}"`);
  console.log(`🇨🇲 CAMEROON PIDGIN ("Tok Pidgin"):`);
  console.log(`   "${adv.text_pidgin}"`);
  console.log(`📚 SOURCES: [${adv.sources.join(', ')}]\n`);
});
