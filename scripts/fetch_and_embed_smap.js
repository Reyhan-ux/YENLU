const https = require('https');
const fs = require('fs');
const path = require('path');

// 1. Read existing 20-year soil baseline
const basePath = path.join(__dirname, '..', 'nasapower_soil.json');
let baseData = null;
if (fs.existsSync(basePath)) {
  baseData = JSON.parse(fs.readFileSync(basePath, 'utf8'));
}

// 2. Fetch 2026 daily observations for Buea [4.155°N, 9.243°E]
const url = 'https://power.larc.nasa.gov/api/temporal/daily/point?parameters=GWETTOP,GWETROOT,GWETPROF,EVPTRNS,TSOIL1&community=AG&longitude=9.243&latitude=4.155&start=20260101&end=20261114&format=JSON&time-standard=utc';

console.log('Fetching 2026 NASA SMAP-assimilated daily soil moisture for Buea...');

https.get(url, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const resp = JSON.parse(body);
      const params2026 = resp.properties?.parameter || {};
      
      const gwettop = { ...(baseData?.properties?.parameter?.GWETTOP || {}), ...(params2026.GWETTOP || {}) };
      const gwetroot = { ...(baseData?.properties?.parameter?.GWETROOT || {}), ...(params2026.GWETROOT || {}) };
      const gwetprof = { ...(baseData?.properties?.parameter?.GWETPROF || {}), ...(params2026.GWETPROF || {}) };
      const evptrns = { ...(baseData?.properties?.parameter?.EVPTRNS || {}), ...(params2026.EVPTRNS || {}) };

      // Clean invalid -999 values
      for (const key of Object.keys(gwettop)) {
        if (gwettop[key] < 0) delete gwettop[key];
      }
      for (const key of Object.keys(gwetroot)) {
        if (gwetroot[key] < 0) delete gwetroot[key];
      }
      for (const key of Object.keys(gwetprof)) {
        if (gwetprof[key] < 0) delete gwetprof[key];
      }

      // Compute monthly soil moisture averages (30-day normal curves)
      const monthlyAverages = {};
      for (let m = 1; m <= 12; m++) {
        const mm = String(m).padStart(2, '0');
        const vals = [];
        for (const [date, val] of Object.entries(gwettop)) {
          if (date.slice(4, 6) === mm && val > 0) vals.push(val);
        }
        monthlyAverages[m - 1] = vals.length ? Number((vals.reduce((a, b) => a + b, 0) / vals.length * 100).toFixed(1)) : 75.0;
      }

      // Recent 30 days time series
      const sortedDates = Object.keys(gwettop).sort().slice(-30);
      const recent30Days = sortedDates.map(d => {
        const formatted = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
        const top = gwettop[d] !== undefined ? Number((gwettop[d] * 100).toFixed(1)) : null;
        const root = gwetroot[d] !== undefined ? Number((gwetroot[d] * 100).toFixed(1)) : (gwetprof[d] !== undefined ? Number((gwetprof[d] * 100).toFixed(1)) : top);
        const evp = evptrns[d] !== undefined && evptrns[d] > 0 ? Number(evptrns[d].toFixed(2)) : 4.5;
        return {
          date: formatted,
          rawDate: d,
          surfaceSoilMoisturePct: top,
          rootZoneMoisturePct: root,
          evapotranspirationMm: evp
        };
      });

      const output = {
        metadata: {
          source: 'NASA SMAP / NASA POWER GEOS-Land Modeling',
          coordinates: { lat: 4.155, lon: 9.243, location: 'Buea, Fako Division, Mount Cameroon' },
          parameters: {
            GWETTOP: 'Surface Soil Wetness (0-5cm layer, % saturation)',
            GWETROOT: 'Root Zone Soil Wetness (0-100cm layer, % saturation)',
            EVPTRNS: 'Total Evapotranspiration (mm/day)'
          },
          generatedAt: new Date().toISOString(),
          totalDays: Object.keys(gwettop).length
        },
        monthlyAverages,
        recent30Days,
        latestObservation: recent30Days[recent30Days.length - 1]
      };

      const outDir = path.join(__dirname, '..', 'frontend', 'src', 'data');
      fs.writeFileSync(path.join(outDir, 'smap_soil_telemetry.json'), JSON.stringify(output, null, 2));
      console.log(`Successfully generated frontend/src/data/smap_soil_telemetry.json with ${recent30Days.length} recent daily records!`);
      console.log('Latest Buea Soil Observation:', output.latestObservation);
    } catch (e) {
      console.error('Error processing SMAP data:', e);
    }
  });
}).on('error', err => console.error('Fetch error:', err.message));
