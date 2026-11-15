import { Sliders, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { useApp } from '../context/AppContext';

export default function WhatIfSliders({ className = '' }) {
  const { climateModifiers, setClimateModifiers, resetClimateModifiers, language } = useApp();
  const { rainMultiplier = 1.0, onsetDelayDays = 0 } = climateModifiers;

  const rainShiftPct = Math.round((rainMultiplier - 1.0) * 100);
  const isCustom = rainMultiplier !== 1.0 || onsetDelayDays > 0;

  const handleRainChange = (e) => {
    const val = parseFloat(e.target.value);
    setClimateModifiers((prev) => ({ ...prev, rainMultiplier: val }));
  };

  const handleOnsetChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setClimateModifiers((prev) => ({ ...prev, onsetDelayDays: val }));
  };

  const applyPreset = (rain, delay) => {
    setClimateModifiers({ rainMultiplier: rain, onsetDelayDays: delay });
  };

  return (
    <Card className={`overflow-hidden border border-leaf-200/50 bg-white/70 shadow-soft dark:border-leaf-800/40 dark:bg-canvas-card-dark/70 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-leaf-100/60 pb-3 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-leaf-100 text-leaf-800 dark:bg-leaf-900/60 dark:text-leaf-300">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-ink dark:text-leaf-50">
              {language === 'pidgin' ? 'Test Different Rain Weather ("What-If")' : 'Interactive "What-If" Climate Simulator'}
            </h3>
            <p className="text-xs text-ink/60 dark:text-leaf-100/60">
              {language === 'pidgin' 
                ? 'Slide am make you see how your crop go behave if rain fall pass mark or late'
                : 'Test crop rotation resilience under hypothetical rainfall shifts and delayed onset'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCustom && (
            <Badge tone="amber" className="flex items-center gap-1 text-[11px]">
              <AlertTriangle size={12} />
              {language === 'pidgin' ? 'Hypothetical Active' : 'Simulation Active'}
            </Badge>
          )}
          {isCustom && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetClimateModifiers}
              className="!h-8 !px-2.5 text-xs text-ink/70 hover:text-ink dark:text-leaf-200"
            >
              <RefreshCw size={13} className="mr-1 inline" />
              {language === 'pidgin' ? 'Reset Normal' : 'Reset'}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {/* Slider 1: Rainfall Shift */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-ink/80 dark:text-leaf-100">
              {language === 'pidgin' ? 'Rainfall Shift (Heavy / Light)' : 'Rainfall Volume Shift'}
            </span>
            <span className={`rounded-md px-2 py-0.5 font-bold ${
              rainShiftPct > 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
              rainShiftPct < 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
              'bg-leaf-100 text-leaf-800 dark:bg-white/10 dark:text-leaf-200'
            }`}>
              {rainShiftPct > 0 ? `+${rainShiftPct}% Rain` : rainShiftPct < 0 ? `${rainShiftPct}% Rain` : 'Historical Normal (0%)'}
            </span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.4"
            step="0.05"
            value={rainMultiplier}
            onChange={handleRainChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-leaf-100 accent-leaf-600 dark:bg-white/10 dark:accent-leaf-400"
          />
          <div className="flex justify-between text-[10px] text-ink/50 dark:text-leaf-100/50">
            <span>-30% Dry Spell</span>
            <span>NASA Historical Baseline</span>
            <span>+40% Severe Deluge</span>
          </div>
        </div>

        {/* Slider 2: Onset Delay */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-ink/80 dark:text-leaf-100">
              {language === 'pidgin' ? 'Late Rain Onset Delay' : 'Rainy Season Onset Delay'}
            </span>
            <span className={`rounded-md px-2 py-0.5 font-bold ${
              onsetDelayDays > 0 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' :
              'bg-leaf-100 text-leaf-800 dark:bg-white/10 dark:text-leaf-200'
            }`}>
              {onsetDelayDays === 0 ? 'On Time (Mid-March)' : `+${onsetDelayDays} Days Late`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={onsetDelayDays}
            onChange={handleOnsetChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-leaf-100 accent-leaf-600 dark:bg-white/10 dark:accent-leaf-400"
          />
          <div className="flex justify-between text-[10px] text-ink/50 dark:text-leaf-100/50">
            <span>Normal Onset</span>
            <span>+15d False Start</span>
            <span>+30d Prolonged Drought</span>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-leaf-100/50 pt-3 text-xs dark:border-white/5">
        <span className="text-[11px] font-semibold text-ink/50 uppercase tracking-wider dark:text-leaf-100/50">
          {language === 'pidgin' ? 'Fast Scenario:' : 'Quick Presets:'}
        </span>
        <button
          type="button"
          onClick={() => applyPreset(1.0, 0)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
            !isCustom 
              ? 'bg-ink text-white dark:bg-leaf-300 dark:text-ink font-semibold' 
              : 'bg-leaf-50 text-ink/70 hover:bg-leaf-100 dark:bg-white/5 dark:text-leaf-200'
          }`}
        >
          {language === 'pidgin' ? 'Baseline' : 'Historical Normal'}
        </button>
        <button
          type="button"
          onClick={() => applyPreset(1.25, 0)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
            rainMultiplier === 1.25 && onsetDelayDays === 0
              ? 'bg-ink text-white dark:bg-leaf-300 dark:text-ink font-semibold' 
              : 'bg-leaf-50 text-ink/70 hover:bg-leaf-100 dark:bg-white/5 dark:text-leaf-200'
          }`}
        >
          {language === 'pidgin' ? '+25% Heavy Rain' : '+25% Extreme Rain (Flood Test)'}
        </button>
        <button
          type="button"
          onClick={() => applyPreset(0.85, 14)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
            rainMultiplier === 0.85 && onsetDelayDays === 14
              ? 'bg-ink text-white dark:bg-leaf-300 dark:text-ink font-semibold' 
              : 'bg-leaf-50 text-ink/70 hover:bg-leaf-100 dark:bg-white/5 dark:text-leaf-200'
          }`}
        >
          {language === 'pidgin' ? 'Late Dry Season (+14d)' : 'Late Onset & Dry (-15% / +14d)'}
        </button>
      </div>
    </Card>
  );
}
