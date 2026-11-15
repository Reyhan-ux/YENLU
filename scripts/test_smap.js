const https = require('https');

// NASA Common Metadata Repository (CMR) query for SMAP L3 Soil Moisture (SPL3SMP_E)
// Bounding box over Buea, Cameroon: Lon 9.1 to 9.4, Lat 4.0 to 4.3
const cmrUrl = 'https://cmr.earthdata.nasa.gov/search/granules.json?short_name=SPL3SMP_E&bounding_box=9.1,4.0,9.4,4.3&page_size=5&sort_key=-start_date';

console.log('Querying NASA Earthdata CMR API for SMAP L3 Soil Moisture granules covering Buea...');

https.get(cmrUrl, { headers: { 'User-Agent': 'YENLU-Agro/1.0' } }, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      const entries = data.feed?.entry || [];
      console.log(`Success! Found ${entries.length} SMAP Enhanced Level-3 Soil Moisture granules for Buea coordinates [4.15°N, 9.24°E]:\n`);
      entries.forEach((e, idx) => {
        console.log(`[Granule ${idx + 1}] ${e.title}`);
        console.log(`  Acquisition Start: ${e.time_start}`);
        console.log(`  Acquisition End:   ${e.time_end}`);
        console.log(`  Size:              ${e.granule_size} MB`);
        const dataLink = e.links?.find(l => l.href?.endsWith('.h5') || l.rel?.includes('data#'));
        if (dataLink) {
          console.log(`  HDF5 Data Link:    ${dataLink.href}`);
        }
        console.log('');
      });
    } catch (err) {
      console.error('Error parsing CMR response:', err.message);
    }
  });
}).on('error', (err) => {
  console.error('Network error contacting NASA CMR:', err.message);
});
