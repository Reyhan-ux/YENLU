import wfpMarketData from './buea_market_prices.json';

// Authentic WFP Cameroon HDX Market nodes in Fako Division
export const MARKETS = [
  { value: 'buea', label: 'Buea Town Market', factor: 1.0 },
  { value: 'muea', label: 'Muea Market', factor: 0.93 },
  { value: 'mutengene', label: 'Mutengene Junction', factor: 0.96 },
  { value: 'limbe', label: 'Limbé Coastal Market', factor: 1.05 }
];

// Map 2023-2026 cleaned WFP Food Prices (XAF/KG)
export const PRICES = (wfpMarketData.prices || []).map((p) => {
  // Realistic simulated short-term price momentum based on volatility
  const changeVal = p.price_risk_rating === 'High Volatility' 
    ? (p.avg_price_xaf_kg % 7 === 0 ? -4.5 : 5.8)
    : (p.avg_price_xaf_kg % 2 === 0 ? 2.3 : -1.8);

  return {
    crop: p.crop_name,
    cropId: p.crop_id,
    price: p.avg_price_xaf_kg,
    minPrice: p.min_price_xaf_kg,
    maxPrice: p.max_price_xaf_kg,
    volatility: p.price_volatility_pct,
    riskRating: p.price_risk_rating,
    change: changeVal,
    estRevenueHa: p.est_gross_revenue_xaf_ha,
    unit: p.unit
  };
});

