// Test SMAP integration
import { ClientAdvisoryEngine } from './frontend/src/engine/advisoryEngine.js';
const engine = new ClientAdvisoryEngine();
console.log('SMAP profile (default month):', engine.getSmapSoilProfile());
console.log('SMAP profile month 0 (Jan):', engine.getSmapSoilProfile(0));
