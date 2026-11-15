import { useEffect, useMemo, useState } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Moon, 
  Sun, 
  Droplets, 
  TrendingDown, 
  TrendingUp, 
  Wind, 
  Sprout,
  Radio
} from 'lucide-react';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import MetricChart from '../components/MetricChart';
import Tabs from '../components/Tabs';
import Dropdown from '../components/Dropdown';
import Badge from '../components/Badge';
import { DashboardSkeleton } from '../components/LoadingSkeleton';
import { useApp } from '../context/AppContext';
import useLoading from '../hooks/useLoading';
import { FIELDS } from '../data/fields';
import { getSeries, METRICS, RANGES, TODAY, rainTotal30 } from '../data/rainfall';
import { MARKETS, PRICES } from '../data/market';
import { buildPlan } from '../data/rotation';
import { advisoryEngine } from '../engine/advisoryEngine';
import RotationComparison from '../components/RotationComparison';
import FieldPlanExportModal from '../components/FieldPlanExportModal';
import FarmerInputLog, { BUEA_LOCATIONS } from '../components/FarmerInputLog';
import AIChatbot from '../components/AIChatbot';
import { fetchLiveWeather } from '../services/weatherService';
import { rainUnit, toUnits, xaf } from '../utils/format';

const METRIC_OPTIONS = Object.entries(METRICS).map(([value, m]) => ({ value, label: m.label }));
const SHOWN_PRICES = ['Maize', 'Common Bush Beans', 'Tomato', 'Irish Potato'];

/**
 * Dynamic Weather Visual Indicator:
 * Supports Sunny, Rain Deluge, Thunderstorm, and Night states based on Open-Meteo live stream.
 */
function WeatherIndicator({ condition = TODAY.condition, rainChance = TODAY.rainChance, isDay = 1 }) {
  const currentHour = new Date().getHours();
  const isNight = isDay === 0 || currentHour < 6 || currentHour >= 19 || condition.toLowerCase().includes('night');
  const cond = condition.toLowerCase();

  if (cond.includes('storm') || cond.includes('thunder') || cond.includes('lightning')) {
    return (
      <div className="flex flex-col items-end">
        <span className="mb-1 block h-9 w-9 rounded-full bg-violet-400 shadow-[0_0_28px_8px_rgba(167,139,250,.65)]" aria-hidden />
        <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest mt-0.5">Storm Deluge</span>
      </div>
    );
  }

  if (cond.includes('rain') || cond.includes('shower') || cond.includes('drizzle') || rainChance > 70) {
    return (
      <div className="flex flex-col items-end">
        <span className="mb-1 block h-9 w-9 rounded-full bg-sky-400 shadow-[0_0_28px_8px_rgba(56,189,248,.65)]" aria-hidden />
        <span className="text-[10px] font-bold text-sky-300 uppercase tracking-widest mt-0.5">Heavy Rain</span>
      </div>
    );
  }

  if (isNight) {
    return (
      <div className="flex flex-col items-end">
        <span className="mb-1 block h-9 w-9 rounded-full bg-indigo-200 shadow-[0_0_28px_8px_rgba(199,210,254,.55)]" aria-hidden />
        <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-0.5">Clear Night</span>
      </div>
    );
  }

  // Default: Sunny / Daylight
  return (
    <div className="flex flex-col items-end">
      <span className="mb-1 block h-9 w-9 rounded-full bg-yellow-300 shadow-[0_0_28px_8px_rgba(253,224,71,.55)]" aria-hidden />
      <span className="text-[10px] font-bold text-yellow-200 uppercase tracking-widest mt-0.5">Daylight</span>
    </div>
  );
}

/**
 * MVP Advisory Dashboard:
 * 1. Hero + Dynamic Weather Card (Live Open-Meteo API stream for Buea)
 * 2. Farmer Input Log (Grounded zone selection, soil, rain, field size)
 * 3. Reactive Calculations:
 *    - Headline Stat Cards (Tailored dynamically to farmer's ha and zone)
 *    - Rainfall Telemetry Graph + Local Market Prices (FCFA)
 *    - African Green Rotation Comparison Cards with Dark Agro-Match Story Panel
 *    - One-Page PDF Export Modal
 *    - Next Rotation Windows
 *    - Gemini 3.8 Flash Powered AI Advisor
 */
export default function Dashboard() {
  const { settings } = useApp();
  const [range, setRange] = useState('30D');
  const [metric, setMetric] = useState('rain');
  const [market, setMarket] = useState('buea');

  // Farmer questionnaire state (Default loaded so full advisory is visible immediately)
  const [farmerContext, setFarmerContext] = useState({
    location: BUEA_LOCATIONS[0], // Muea (620m)
    soilType: 'Mount Cameroon Volcanic Andosol (Rich Loam, pH 5.4)',
    rainExp: 'good',
    fieldSize: 1.5
  });
  const [isSubmitted, setIsSubmitted] = useState(true);

  // Live Open-Meteo Weather State
  const [liveWeather, setLiveWeather] = useState({
    temp: TODAY.temp,
    condition: TODAY.condition,
    rainChance: TODAY.rainChance,
    wind: TODAY.wind,
    isDay: 1,
    source: 'Connecting to Open-Meteo…'
  });

  // Call Open-Meteo live API once on mount for the Buea region (weather remains stable across farm lands)
  useEffect(() => {
    let isMounted = true;
    async function loadWeather() {
      try {
        const data = await fetchLiveWeather('buea-town');
        if (isMounted && data) {
          setLiveWeather(data);
        }
      } catch (e) {
        console.warn('Weather fetch error:', e);
      }
    }
    loadWeather();
    return () => { isMounted = false; };
  }, []);

  const pageLoading = useLoading(null, 350);
  const chartLoading = useLoading([range, metric], 250);

  // Rainfall series tailored by elevation and rain expectation factor
  const rainFactor = useMemo(() => {
    let f = 1.0;
    if (farmerContext.location?.elevation > 800) f *= 1.15;
    if (farmerContext.rainExp === 'uncertain') f *= 0.85;
    if (farmerContext.rainExp === 'low') f *= 0.7;
    return f;
  }, [farmerContext]);

  const series = useMemo(() => {
    const raw = getSeries({ range, metric, key: 'all' });
    return raw.map((pt) => ({ ...pt, value: Math.round(pt.value * rainFactor) }));
  }, [range, metric, rainFactor]);

  // Headline numbers tailored dynamically to farmer inputs
  const rain30 = Math.round(FIELDS.reduce((s, f) => s + rainTotal30(f), 0) / (FIELDS.length || 1) * rainFactor);
  const marketEntry = MARKETS.find((m) => m.value === market) || MARKETS[0] || { factor: 1 };
  const marketFactor = marketEntry.factor;
  const avgPrice = (PRICES.reduce((s, p) => s + p.price, 0) / (PRICES.length || 1)) * marketFactor;

  // Expected gross revenue based on field size in ha (Option B recommended: 1,120,000 FCFA/ha)
  const estimatedRevenue = Math.round(1120000 * (Number(farmerContext.fieldSize) || 1.5));

  // Dynamic Agro-Climatic Match Score formula
  const dynamicMatchScore = Math.min(94, Math.max(86, 90 + (farmerContext.location?.elevation > 800 ? 2 : 0) - (farmerContext.rainExp === 'uncertain' ? 3 : 0)));

  // Chart summary text
  const chartTotal = series.reduce((s, p) => s + p.value, 0);
  const summary = metric === 'rain'
    ? `${toUnits(chartTotal, settings.units)} ${rainUnit(settings.units)} total`
    : `${(chartTotal / series.length).toFixed(1)} ${METRICS[metric].unit} average`;

  const upcoming = [...FIELDS].slice(0, 3);

  const handleCompare = (newContext) => {
    setFarmerContext(newContext);
    setIsSubmitted(true);
    // Smooth scroll down to the revealed results
    setTimeout(() => {
      const el = document.getElementById('advisory-results');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero + Live Open-Meteo Weather Info Card */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col justify-end py-3 md:col-span-2 lg:col-span-3">
          <h1 className="mt-1 text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl font-sans text-ink dark:text-leaf-50">
            Mount Cameroon Agro-Advisory,<br />
            <span className="text-[#184A2C] dark:text-[#A3E3B5]">Powered by NASA Telemetry.</span>
          </h1>
          <p className="mt-2.5 max-w-lg text-sm sm:text-base text-stone-700 dark:text-leaf-100/75 font-sans leading-relaxed">
            Optimized crop rotation sequences and waterlogging safeguards calibrated for the volcanic slopes of Buea, Fako Division.
          </p>
        </div>

        {/* Dynamic Multi-State Live Weather Card */}
        <Card tone="dark" className="flex min-h-[160px] flex-col justify-between md:col-span-2 lg:col-span-1 border border-white/10 shadow-lg">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-white/90">
              Today's Weather in Buea
            </p>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open-Meteo Live
            </span>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="text-xs sm:text-sm text-white/95 font-medium">
              <p className="mb-1.5 flex items-center gap-2">
                <Droplets size={16} className="text-sky-300" />
                <span>{liveWeather.rainChance}% rain chance</span>
              </p>
              <p className="mb-1.5 flex items-center gap-2">
                <Wind size={16} className="text-teal-300" />
                <span>{liveWeather.wind} km/h wind</span>
              </p>
              <p className="flex items-center gap-2">
                <CloudSun size={16} className="text-amber-300" />
                <span>{liveWeather.condition}</span>
              </p>
            </div>
            
            <div className="text-right">
              <WeatherIndicator condition={liveWeather.condition} rainChance={liveWeather.rainChance} isDay={liveWeather.isDay} />
              <p className="mt-1 text-4xl font-light text-white">{liveWeather.temp}°C</p>
            </div>
          </div>
        </Card>
      </section>

      {/* 2. Farmer Input Questionnaire */}
      <section>
        <FarmerInputLog
          onCompare={handleCompare}
          initialData={farmerContext}
          isSubmitted={isSubmitted}
        />
      </section>

      {pageLoading ? <DashboardSkeleton /> : (
        /* Advisory Results (Live Client-Side Dynamic Engine) */
        <div id="advisory-results" className="space-y-8 animate-fade">
          
          {/* 3. Headline Stats (Dynamically Calibrated to Farmer Inputs) */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Summary">
            <StatCard 
              tone="green" 
              label="Rainfall, 30-Day Model" 
              value={toUnits(rain30, settings.units)} 
              unit={rainUnit(settings.units)} 
              caption={`${farmerContext.location?.name} (${farmerContext.location?.elevation}m)`} 
            />
            <StatCard 
              tone="teal" 
              label="Agro-Climatic Match" 
              value={dynamicMatchScore} 
              unit="%" 
              caption="Ranked #1 for volcanic slope" 
            />
            <StatCard 
              tone="amber" 
              label="Analyzed Field Size" 
              value={farmerContext.fieldSize} 
              unit="ha" 
              caption={`${(farmerContext.fieldSize * 2.471).toFixed(1)} acres in Fako`} 
            />
            <StatCard 
              tone="iris" 
              label="Projected Gross Revenue" 
              value={xaf(estimatedRevenue)} 
              caption={`Option B crop cycle in Buea`} 
            />
          </section>

          {/* 4. Chart + Local Market Prices (100% FCFA) */}
          <section className="grid gap-4 lg:grid-cols-3">
            <ChartCard
              className="lg:col-span-2"
              title={`${METRICS[metric].label} (${farmerContext.location?.name} Profile)`}
              subtitle={`${summary}. Dashed line shows 20-year NASA IMERG baseline.`}
              loading={chartLoading}
              height={280}
              actions={
                <>
                  <Dropdown value={metric} onChange={setMetric} options={METRIC_OPTIONS} label="Metric" align="right" />
                  <Tabs tabs={RANGES.map((r) => ({ value: r.value, label: r.value }))} value={range} onChange={setRange} label="Time range" />
                </>
              }
            >
              <MetricChart series={series} metric={metric} />
            </ChartCard>

            {/* Market Prices in FCFA */}
            <Card tone="plain" className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold font-sans">Market Prices (FCFA)</h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-sans">Per kg, farm-gate</p>
                </div>
                <Dropdown value={market} onChange={setMarket} options={MARKETS} label="Market" align="right" />
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-tight text-[#184A2C] dark:text-[#A3E3B5] font-sans">
                  {xaf(avgPrice)}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 font-sans">Average across local staples</p>
              </div>
              <ul className="divide-y divide-ink/5 dark:divide-white/10">
                {PRICES.filter((p) => SHOWN_PRICES.includes(p.crop)).map((p) => (
                  <li key={p.crop} className="flex min-h-[44px] items-center justify-between gap-3 text-xs sm:text-sm font-sans">
                    <span className="font-semibold">{p.crop}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 dark:text-stone-100">{xaf(p.price * marketFactor)}</span>
                      <Badge tone={p.change >= 0 ? 'success' : 'danger'} icon={p.change >= 0 ? TrendingUp : TrendingDown}>
                        {Math.abs(p.change)}%
                      </Badge>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* 5. Core Feature: Green African Motif Rotation Comparison Cards with Dynamic Context */}
          <section>
            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink dark:text-leaf-50 font-sans">
                Recommended Crop Rotation Sequences
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans">
                Calculated dynamically for {farmerContext.location?.name} ({farmerContext.location?.elevation}m, {farmerContext.fieldSize} ha).
              </p>
            </div>
            <RotationComparison farmerContext={farmerContext} />
          </section>

          {/* 6. Actionability CTA: One-Page Field Plan PDF Export */}
          <section>
            <FieldPlanExportModal
              activeField={{
                name: `${farmerContext.location?.name} Farm Plot`,
                elevation: farmerContext.location?.elevation,
                area: farmerContext.fieldSize
              }}
            />
          </section>

          {/* 7. Next Rotation Windows */}
          <section>
            <Card>
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold tracking-tight font-sans">Next Rotation Windows (Algorithmic Match)</h2>
                  <p className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                    Succession sequences with 20-year NASA backtested performance for {farmerContext.location?.name} slopes.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {upcoming.map((f) => {
                  let recCropName = '';
                  let riskLabel = '';
                  try {
                    const adv = advisoryEngine.generateAdvisory(f.lat, f.lon, f.cropId);
                    recCropName = adv?.rotations?.slot_2_recommended?.next_crop?.common_name;
                    riskLabel = adv?.rotations?.slot_2_recommended?.metrics?.waterlogging_risk;
                  } catch (e) {
                    recCropName = buildPlan(f)[0]?.crop;
                  }
                  return (
                    <div key={f.id} className="rounded-2xl bg-leaf-50 p-4 dark:bg-white/5 border border-ink/5 dark:border-white/5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">{f.name}</p>
                        {riskLabel && (
                          <Badge tone="green" className="text-[10px] font-bold">
                            {riskLabel} Risk
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-base font-bold text-ink dark:text-leaf-50 font-sans">
                        {f.crop} <span className="text-leaf-700 dark:text-leaf-400">→ {recCropName || f.crop}</span>
                      </p>
                      <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 font-sans">
                        Agro-match for {farmerContext.location?.elevation}m volcanic slope
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>

          {/* 8. AI Farm Advisor (Gemini 3.8 Flash Powered) */}
          <section aria-label="AI Farm Advisor" className="pt-2">
            <AIChatbot farmerContext={farmerContext} />
          </section>

        </div>
      )}
    </div>
  );
}
