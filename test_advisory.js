import { AdvisoryEngine } from './engine/advisoryEngine.js';

const engine = new AdvisoryEngine('.');

console.log('======================================================================');
console.log('   YENLU FIELD SHIFT: ADVISORY & 20-YEAR BACK-TEST ENGINE TEST RUN');
console.log('======================================================================\n');

// Test 1: Upper Farms / Bokova (High Mountain Slope)
console.log('>>> TEST CASE 1: Upper Farms / Bokova (Steep Mountain Slope)\n');
const resUpper = engine.generateAdvisory(4.160, 9.225, 'maize');

console.log(`Matched Terrain: ${resUpper.farm_profile.terrain.elevation_m}m elevation | ${resUpper.farm_profile.terrain.slope_pct}% slope (${resUpper.farm_profile.terrain.slope_cat})`);
console.log(`Agro-Tier: ${resUpper.farm_profile.terrain.tier} | Temp Lapse: ${resUpper.farm_profile.terrain.temp_lapse_degC} °C\n`);

console.log('--- THE THREE ROTATION SLOTS ---');
console.log(`[SLOT 1 - Baseline]:     ${resUpper.rotations.slot_1_baseline.name}`);
console.log(`  Score: ${resUpper.rotations.slot_1_baseline.score}/100 | Stressed: ${resUpper.rotations.slot_1_baseline.stressed_seasons_20yr}/20 seasons | Est Revenue: ${resUpper.rotations.slot_1_baseline.annual_revenue_xaf.toLocaleString()} XAF`);

console.log(`[SLOT 2 - Top AI Pick]:  ${resUpper.rotations.slot_2_recommended.name}`);
console.log(`  Score: ${resUpper.rotations.slot_2_recommended.score}/100 | Stressed: ${resUpper.rotations.slot_2_recommended.stressed_seasons_20yr}/20 seasons | Est Revenue: ${resUpper.rotations.slot_2_recommended.annual_revenue_xaf.toLocaleString()} XAF`);

console.log(`[SLOT 3 - Alternative]:  ${resUpper.rotations.slot_3_alternative.name}`);
console.log(`  Score: ${resUpper.rotations.slot_3_alternative.score}/100 | Stressed: ${resUpper.rotations.slot_3_alternative.stressed_seasons_20yr}/20 seasons | Est Revenue: ${resUpper.rotations.slot_3_alternative.annual_revenue_xaf.toLocaleString()} XAF\n`);

console.log('--- GROUNDED AI ADVICE (WITH SOURCE CITATIONS) ---');
resUpper.advisory_statements.forEach((adv, i) => {
  console.log(`${i + 1}. [${adv.topic}]`);
  console.log(`   "${adv.text}"`);
  console.log(`   Sources: [${adv.sources.join(', ')}]\n`);
});


// Test 2: Muea (Gentle Lowland Plain)
console.log('======================================================================');
console.log('>>> TEST CASE 2: Muea Agricultural Belt (Gentle Lowland Basin)\n');
const resMuea = engine.generateAdvisory(4.165, 9.300, 'maize');

console.log(`Matched Terrain: ${resMuea.farm_profile.terrain.elevation_m}m elevation | ${resMuea.farm_profile.terrain.slope_pct}% slope (${resMuea.farm_profile.terrain.slope_cat})`);
console.log(`Agro-Tier: ${resMuea.farm_profile.terrain.tier} | Temp Lapse: ${resMuea.farm_profile.terrain.temp_lapse_degC} °C\n`);

console.log('--- THE THREE ROTATION SLOTS ---');
console.log(`[SLOT 1 - Baseline]:     ${resMuea.rotations.slot_1_baseline.name}`);
console.log(`  Score: ${resMuea.rotations.slot_1_baseline.score}/100 | Stressed: ${resMuea.rotations.slot_1_baseline.stressed_seasons_20yr}/20 seasons | Est Revenue: ${resMuea.rotations.slot_1_baseline.annual_revenue_xaf.toLocaleString()} XAF`);

console.log(`[SLOT 2 - Top AI Pick]:  ${resMuea.rotations.slot_2_recommended.name}`);
console.log(`  Score: ${resMuea.rotations.slot_2_recommended.score}/100 | Stressed: ${resMuea.rotations.slot_2_recommended.stressed_seasons_20yr}/20 seasons | Est Revenue: ${resMuea.rotations.slot_2_recommended.annual_revenue_xaf.toLocaleString()} XAF`);

console.log(`[SLOT 3 - Alternative]:  ${resMuea.rotations.slot_3_alternative.name}`);
console.log(`  Score: ${resMuea.rotations.slot_3_alternative.score}/100 | Stressed: ${resMuea.rotations.slot_3_alternative.stressed_seasons_20yr}/20 seasons | Est Revenue: ${resMuea.rotations.slot_3_alternative.annual_revenue_xaf.toLocaleString()} XAF\n`);

console.log('--- GROUNDED AI ADVICE (WITH SOURCE CITATIONS) ---');
resMuea.advisory_statements.forEach((adv, i) => {
  console.log(`${i + 1}. [${adv.topic}]`);
  console.log(`   "${adv.text}"`);
  console.log(`   Sources: [${adv.sources.join(', ')}]\n`);
});
