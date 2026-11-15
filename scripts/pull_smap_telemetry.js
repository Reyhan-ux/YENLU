const https = require('https');

// Fetch recent soil moisture telemetry (GWETTOP surface 0-5cm, GWETROOT root-zone 0-100cm)
// for Buea coordinates [4.155°N, 9.243°E] from NASA POWER API
const powerUrl = 'https://power.larc.nasa.gov/api/temporal/daily/point?parameters=GWETTOP,GWETROOT,GWETPROF,EVPTRNS&community=AG&longitude=9.243&latitude=4.155&start=20261001&end=20261114&format=JSON&time-standard=utc';

console.log('Fetching NASA Daily Soil Moisture & Evapotranspiration for Buea [4.155°N, 9.243°E]...');

https.get(powerUrl, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      const params = data.properties?.parameter;
      if (!params) {
        console.log('No parameter data returned:', body.slice(0, 300));
        return;
      }
      const gwettop = params.GWETTOP || {};
      const gwetroot = params.GWETROOT || {};
      const evptrns = params.EVPTRNS || {};

      const dates = Object.keys(gwettop).sort().slice(-14); // last 14 days
      console.log('\n--- Buea, Cameroon: 14-Day Soil Moisture Horizon (0.0 to 1.0 Saturation) ---');
      console.log('Date        | Surface (0-5cm) | Root Zone (0-1m) | Evapotranspiration');
      console.log('------------+-----------------+------------------+-------------------');
      dates.forEach(d => {
        const top = gwettop[d];
        const root = gwetroot[d];
        const evp = evptrns[d];
        const formattedDate = `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;
        console.log(`${formattedDate}  | ${(top * 100).toFixed(1)}% saturation   | ${(root * 100).toFixed(1)}% saturation    | ${evp.toFixed(2)} mm/day`);
      });
    } catch (e) {
      console.error('Error parsing NASA POWER soil moisture:', e.message);
    }
  });
}).on('error', err => console.error('Fetch error:', err.message));
