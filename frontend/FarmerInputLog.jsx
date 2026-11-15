import { useState } from 'react';
import { 
  MapPin, 
  Mountains, 
  CloudRain, 
  Ruler, 
  CheckCircle,
  ArrowsClockwise,
  Check
} from '@phosphor-icons/react';
import Card from './Card';
import Button from './Button';

// Buea Agricultural Quarters on the slopes of Mount Cameroon
export const BUEA_LOCATIONS = [
  { id: 'muea', name: 'Muea', elevation: 620, slope: '5–10% gentle', desc: 'Market valley & vegetable belt' },
  { id: 'bokwango', name: 'Bokwango', elevation: 880, slope: '12–18% terraced', desc: 'Volcanic terraces & bean gardens' },
  { id: 'bonakanda', name: 'Bonakanda', elevation: 700, slope: '4–8% plateau', desc: 'Fertile plateau flats & cassava' },
  { id: 'buea-town', name: 'Buea Town', elevation: 920, slope: '10–15% upper slope', desc: 'Upper mountain gardens & cocoyam' },
  { id: 'lysoka', name: 'Lysoka', elevation: 310, slope: '2–5% lowland', desc: 'Lowland basin & rich loams' },
  { id: 'bova', name: 'Bova', elevation: 820, slope: '15–22% steep', desc: 'Upper volcanic slope & tubers' },
  { id: 'tole', name: 'Tole', elevation: 1100, slope: '10–16% highland', desc: 'Cool highland potato & tea ridge' },
  { id: 'likombe', name: 'Likombe', elevation: 680, slope: '6–12% slope', desc: 'Fertile volcanic terraces & maize' },
  { id: 'bolifamba', name: 'Bolifamba (Mile 16)', elevation: 520, slope: '4–8% gentle', desc: 'Valley farming entrance & beans' },
  { id: 'wotutu', name: 'Wotutu', elevation: 540, slope: '5–10% slope', desc: 'Lower volcanic slopes & cassava' },
  { id: 'molyko', name: 'Molyko', elevation: 590, slope: '3–6% valley', desc: 'Valley basin garden plots' },
  { id: 'soppo', name: 'Great Soppo', elevation: 750, slope: '8–12% slope', desc: 'Mid-slope volcanic loam' }
];

export const RAIN_EXPECTATIONS = [
  { id: 'good', label: 'Good / Heavy Rain (~2,800mm)', tag: 'Typical Buea', desc: 'Standard high-rainfall monsoon deluge on mountain slopes' },
  { id: 'uncertain', label: 'Uncertain / Erratic Onset', tag: 'High Variance', desc: 'Delayed showers or sporadic intense dry spells' },
  { id: 'low', label: 'Low / Drier than Normal', tag: 'Below Baseline', desc: 'Lighter rains requiring moisture-conserving rotations' }
];

/**
 * Stepped-Up Farmer Decision Input Log:
 * - High-contrast, large text for older farmers
 * - Balanced layout: Farm Size fills space directly under Volcanic Soil in Column 1
 * - Bold outline icons (26px-28px)
 * - Visual interactive zone selector
 */
export default function FarmerInputLog({ onCompare, initialData, isSubmitted }) {
  const [location, setLocation] = useState(initialData?.location?.id || initialData?.location || 'muea');
  const [rainExp, setRainExp] = useState(initialData?.rainExp || 'good');
  const [fieldSize, setFieldSize] = useState(initialData?.fieldSize || 1.5);
  const [isResetting, setIsResetting] = useState(false);

  const selectedLoc = BUEA_LOCATIONS.find((l) => l.id === location) || BUEA_LOCATIONS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onCompare({
      location: selectedLoc,
      soilType: 'Mount Cameroon Volcanic Andosol (Rich Loam, pH 5.4)',
      rainExp,
      fieldSize: Number(fieldSize) || 1.0
    });
  };

  return (
    <Card className="relative overflow-hidden border-2 border-[#184A2C]/25 bg-[#FAF5EE] shadow-md p-6 sm:p-8 dark:border-white/10 dark:bg-[#1A120E]">
      
      {/* Large African Motif SVGs in Background */}
      <div className="pointer-events-none absolute -top-8 -right-8 opacity-[0.08] text-[#184A2C] dark:text-white" aria-hidden="true">
        <svg className="w-64 h-64 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
          <path d="M50 42 C44 26 26 22 20 32 C15 44 32 54 50 42 Z" />
          <path d="M50 42 C56 26 74 22 80 32 C85 44 68 54 50 42 Z" />
          <line x1="50" y1="42" x2="50" y2="82" />
          <path d="M15 84 Q50 68 85 84" />
          <circle cx="50" cy="18" r="8" />
        </svg>
      </div>
      <div className="pointer-events-none absolute -bottom-10 -left-10 opacity-[0.06] text-[#184A2C] dark:text-white" aria-hidden="true">
        <svg className="w-56 h-56 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
          <polygon points="50,12 80,48 50,86 20,48" />
          <polygon points="50,26 68,48 50,72 32,48" />
          <circle cx="50" cy="48" r="5" fill="currentColor" />
        </svg>
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200/80 pb-4 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-[#184A2C]/20 bg-[#184A2C]/5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-[#184A2C] dark:border-white/10 dark:bg-white/5 dark:text-[#A3E3B5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#184A2C] dark:bg-[#A3E3B5]" />
            <span>Fako Smallholder Advisory Log</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl dark:text-leaf-50 font-sans">
            Configure Your Plot Parameters
          </h2>
          <p className="mt-1 text-sm sm:text-base text-stone-700 dark:text-leaf-100/80 max-w-2xl font-sans leading-relaxed">
            Select your farming quarter on Mount Cameroon to calibrate our 20-year NASA IMERG and volcanic soil model for your plot.
          </p>
        </div>

        {isSubmitted && (
          <button
            type="button"
            onClick={() => {
              setIsResetting(true);
              setTimeout(() => setIsResetting(false), 300);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-bold text-stone-800 shadow-2xs hover:bg-stone-50 dark:border-white/10 dark:bg-white/10 dark:text-stone-200"
          >
            <ArrowsClockwise size={16} weight="bold" className={isResetting ? 'animate-spin text-[#184A2C]' : ''} />
            <span>Adjust Inputs</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-6">
        
        {/* 1. Visual Zone Selector Grid with Bold High-Contrast Text for Older Farmers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              <MapPin size={26} weight="bold" className="text-[#184A2C] dark:text-[#A3E3B5]" />
              <span>1. Select Farm Zone on Mount Cameroon</span>
            </label>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Selected: <strong className="text-[#184A2C] dark:text-[#A3E3B5] text-sm">{selectedLoc.name} ({selectedLoc.elevation}m)</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {BUEA_LOCATIONS.map((loc) => {
              const isSel = location === loc.id;
              return (
                <button
                  type="button"
                  key={loc.id}
                  onClick={() => setLocation(loc.id)}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                    isSel
                      ? 'border-2 border-[#184A2C] bg-white shadow-md ring-1 ring-[#184A2C] dark:border-[#A3E3B5] dark:bg-[#201814]'
                      : 'border-stone-300 bg-white/80 hover:bg-white hover:border-stone-400 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                      {loc.name}
                    </span>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                      isSel 
                        ? 'bg-[#184A2C] text-white dark:bg-[#A3E3B5] dark:text-[#0F2A1D]' 
                        : 'bg-stone-100 text-stone-800 dark:bg-white/10 dark:text-stone-300'
                    }`}>
                      {loc.elevation}m
                    </span>
                  </div>

                  {/* High contrast, large text for older farmers */}
                  <p className="mt-2 text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 leading-snug">
                    {loc.desc}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-400">
                    <span>{loc.slope}</span>
                    {isSel && <Check size={16} weight="bold" className="text-[#184A2C] dark:text-[#A3E3B5]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Balanced 2-Column Section: 
            Column 1: Volcanic Soil + Farm Size (Fills the space perfectly!)
            Column 2: Rain Outlook */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Column 1: Volcanic Soil Classification & Farm Size */}
          <div className="flex flex-col gap-4">
            
            {/* Volcanic Soil Profile */}
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                <Mountains size={26} weight="bold" className="text-[#184A2C] dark:text-[#A3E3B5]" />
                <span>2. Volcanic Soil Classification</span>
              </label>
              <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base text-[#184A2C] dark:text-[#A3E3B5]">
                    Mount Cameroon Volcanic Andosol
                  </span>
                  <span className="rounded-md border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-bold text-stone-800 dark:border-white/10 dark:bg-white/10 dark:text-stone-200">
                    pH 5.4 · 7.9% SOC
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 leading-relaxed">
                  Porous volcanic ash substrate with rapid water drainage, high natural fertility, and slope leaching sensitivity during torrential mountain downpours.
                </p>
              </div>
            </div>

            {/* Farm Size in Hectares (Fills the space underneath soil to eliminate empty gap!) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                <Ruler size={26} weight="bold" className="text-[#184A2C] dark:text-[#A3E3B5]" />
                <span>3. Farm Size in Hectares (ha)</span>
              </label>
              <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 shadow-2xs flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0.1"
                      max="50"
                      step="0.1"
                      value={fieldSize}
                      onChange={(e) => setFieldSize(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-2.5 text-base font-extrabold text-stone-900 focus:border-[#184A2C] focus:bg-white focus:outline-none dark:border-white/20 dark:bg-black/30 dark:text-stone-100"
                    />
                    <span className="pointer-events-none absolute right-4 top-2.5 text-sm font-bold text-stone-500">
                      ha
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    {[0.5, 1.0, 2.0, 5.0].map((sz) => (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => setFieldSize(sz)}
                        className={`rounded-xl px-3 py-2 text-xs font-extrabold transition ${
                          Number(fieldSize) === sz
                            ? 'bg-[#184A2C] text-white dark:bg-[#A3E3B5] dark:text-[#0F2A1D]'
                            : 'bg-stone-100 text-stone-800 hover:bg-stone-200 dark:bg-white/10 dark:text-stone-200'
                        }`}
                      >
                        {sz}h
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                  {Number(fieldSize || 1)} ha = {(Number(fieldSize || 1) * 2.471).toFixed(1)} acres ({Number(fieldSize || 1) * 10000} m²)
                </p>
              </div>
            </div>

          </div>

          {/* Column 2: Rain Expectations */}
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              <CloudRain size={26} weight="bold" className="text-[#184A2C] dark:text-[#A3E3B5]" />
              <span>4. Rain Outlook for Upcoming Cycle</span>
            </label>
            <div className="space-y-3">
              {RAIN_EXPECTATIONS.map((r) => {
                const isSel = rainExp === r.id;
                return (
                  <button
                    type="button"
                    key={r.id}
                    onClick={() => setRainExp(r.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                      isSel
                        ? 'border-2 border-[#184A2C] bg-white shadow-sm ring-1 ring-[#184A2C] dark:border-[#A3E3B5] dark:bg-[#201814]'
                        : 'border-stone-200 bg-white/70 hover:bg-white dark:border-white/10 dark:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                          {r.label}
                        </span>
                        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-bold text-stone-700 dark:bg-white/10 dark:text-stone-300">
                          {r.tag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 mt-1 leading-snug">
                        {r.desc}
                      </p>
                    </div>
                    {isSel && <Check size={18} weight="bold" className="text-[#184A2C] dark:text-[#A3E3B5] shrink-0 ml-3" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Submit Action CTA */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-stone-200/80 pt-5 sm:flex-row dark:border-white/10">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
            <CheckCircle size={20} weight="fill" className="text-[#184A2C] dark:text-[#A3E3B5]" />
            <span>Economic forecasts and rotation scores calculated in <strong>FCFA / XAF</strong>.</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto min-h-[50px] px-8 text-base font-bold shadow-md bg-[#184A2C] hover:bg-[#123821] text-white"
          >
            {isSubmitted ? 'Update & Recalculate Advisory' : 'Compare Options & Reveal Advisory'}
          </Button>
        </div>

      </form>
    </Card>
  );
}
