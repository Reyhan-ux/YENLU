import { useMemo } from 'react';
import { Award, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, Sprout, FileText, ExternalLink } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import { useApp } from '../context/AppContext';
import { advisoryEngine } from '../engine/advisoryEngine';

export default function ThreeSlotRotations({ field, onOpenAddCrop, onExportPlan, className = '' }) {
  const { language, climateModifiers } = useApp();

  const advisory = useMemo(() => {
    if (!field) return null;
    return advisoryEngine.generateAdvisory(
      field.lat || 4.16,
      field.lon || 9.23,
      field.cropId || 'maize',
      { income: 0.35, climate_safety: 0.35, soil_health: 0.30 },
      climateModifiers
    );
  }, [field, climateModifiers]);

  if (!advisory) return null;

  const { rotations, advisory_statements, computed_facts_summary, farm_profile, what_if_scenario } = advisory;
  const { slot_1_baseline, slot_2_recommended, slot_3_alternative } = rotations;

  const isPidgin = language === 'pidgin';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-ink dark:text-leaf-50">
              {isPidgin ? 'The 3-Rotation Rule (Compare Side by Side)' : 'The 3-Rotation Comparison Rule'}
            </h2>
            <Badge tone="green" className="text-[11px]">
              {isPidgin ? '20-Year NASA Evidence' : '20-Yr NASA Back-Test'}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-ink/70 dark:text-leaf-100/70 max-w-2xl">
            {isPidgin
              ? 'Slot 1 na your old practice. Slot 2 & 3 na the best two rotations wey satellite algorithm choose for this terrain.'
              : 'Slot 1 is your farm baseline. Slots 2 & 3 are top model suggestions based on slope, waterlogging risk, and market prices.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAddCrop && (
            <Button variant="secondary" size="sm" onClick={onOpenAddCrop} className="!h-9 text-xs">
              <Sprout size={14} className="mr-1.5" />
              {isPidgin ? 'Add Custom Crop' : 'Test Custom Crop'}
            </Button>
          )}
          {onExportPlan && (
            <Button size="sm" onClick={onExportPlan} className="!h-9 text-xs">
              <FileText size={14} className="mr-1.5" />
              {isPidgin ? 'Print Field Plan' : 'Export Field Plan'}
            </Button>
          )}
        </div>
      </div>

      {/* Terrain & Elevation Grounding Pill */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-leaf-200/60 bg-leaf-50/70 p-3.5 text-xs dark:border-leaf-800/40 dark:bg-canvas-card-dark/60">
        <div className="flex items-center gap-1.5 font-semibold text-ink dark:text-leaf-100">
          <span className="h-2 w-2 rounded-full bg-leaf-500 animate-pulse" />
          <span>{farm_profile.terrain.tier}</span>
        </div>
        <span className="text-ink/30 dark:text-white/20">•</span>
        <span className="text-ink/70 dark:text-leaf-100/70">
          Elevation: <strong>{farm_profile.terrain.elevation_m}m</strong> ({farm_profile.terrain.temp_lapse_degC}°C cooler)
        </span>
        <span className="text-ink/30 dark:text-white/20">•</span>
        <span className="text-ink/70 dark:text-leaf-100/70">
          Slope: <strong>{farm_profile.terrain.slope_pct}%</strong> ({farm_profile.terrain.slope_cat})
        </span>
        <span className="text-ink/30 dark:text-white/20">•</span>
        <span className="text-ink/70 dark:text-leaf-100/70">
          Volcanic Soil: <strong>pH {farm_profile.soil_context.ph}</strong> ({farm_profile.soil_context.texture})
        </span>

        {what_if_scenario.is_hypothetical && (
          <Badge tone="amber" className="ml-auto text-[10px]">
            {isPidgin ? `What-If Shift: ${what_if_scenario.rain_shift_pct}% Rain` : `What-If: ${what_if_scenario.rain_shift_pct}% Rain Shift`}
          </Badge>
        )}
      </div>

      {/* THE THREE SLOTS GRID */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* SLOT 1: Baseline Current Practice */}
        <Card className="relative flex flex-col justify-between border-2 border-dashed border-ink/20 bg-white/50 p-5 shadow-soft dark:border-white/10 dark:bg-canvas-card-dark/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/60 dark:text-leaf-100/60">
                {isPidgin ? 'Slot 1: Old Practice' : 'Slot 1: Baseline Practice'}
              </span>
              <Badge tone="gray" className="text-[10px]">
                {isPidgin ? 'Current Farm' : 'Current Practice'}
              </Badge>
            </div>

            <h3 className="mt-2 text-base font-bold text-ink dark:text-leaf-50">
              {slot_1_baseline.name}
            </h3>
            <p className="mt-1 text-xs text-ink/60 dark:text-leaf-100/60">
              {slot_1_baseline.management || 'Traditional minimum tillage & broadcast sowing'}
            </p>

            <div className="mt-4 space-y-2 border-t border-ink/10 pt-3 text-xs dark:border-white/10">
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-leaf-100/60">{isPidgin ? 'Resilience Score:' : 'Climate Resilience:'}</span>
                <span className="font-semibold">{slot_1_baseline.climate_resilience_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-leaf-100/60">{isPidgin ? 'Stressed Seasons:' : '20-Year Stress:'}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {slot_1_baseline.stressed_seasons_20yr} / 20 {isPidgin ? 'years' : 'seasons'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-leaf-100/60">{isPidgin ? 'Est. Annual Revenue:' : 'Gross Revenue / ha:'}</span>
                <span className="font-bold text-ink dark:text-leaf-50">
                  {slot_1_baseline.annual_revenue_xaf.toLocaleString()} XAF
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-ink/5 p-2 text-center text-[11px] font-medium text-ink/70 dark:bg-white/5 dark:text-leaf-100/70">
            {isPidgin ? 'Baseline wey other slots dey beat' : 'Standard baseline comparison'}
          </div>
        </Card>

        {/* SLOT 2: App's Top Recommendation */}
        <Card className="relative flex flex-col justify-between border-2 border-leaf-500 bg-white p-5 shadow-soft dark:border-leaf-400 dark:bg-canvas-card-dark">
          <div className="absolute -top-3 right-4">
            <span className="flex items-center gap-1 rounded-full bg-leaf-600 px-3 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
              <Award size={12} />
              {isPidgin ? 'Top AI Pick' : 'Top Recommendation'}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-leaf-800 dark:text-leaf-300">
                {isPidgin ? 'Slot 2: Best Rotation' : 'Slot 2: Top Climate Match'}
              </span>
              <span className="text-lg font-black text-leaf-600 dark:text-leaf-400">
                {slot_2_recommended.score}/100
              </span>
            </div>

            <h3 className="mt-2 text-base font-bold text-ink dark:text-leaf-50">
              {slot_2_recommended.name}
            </h3>
            <p className="mt-1 text-xs text-ink/70 dark:text-leaf-100/70">
              {slot_2_recommended.management || 'Conservation tillage, tied ridges & certified seed'}
            </p>

            <div className="mt-4 space-y-2 border-t border-leaf-100 pt-3 text-xs dark:border-white/10">
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-leaf-100/60">{isPidgin ? 'Resilience Score:' : 'Climate Resilience:'}</span>
                <span className="font-semibold text-leaf-700 dark:text-leaf-300">{slot_2_recommended.climate_resilience_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-leaf-100/60">{isPidgin ? 'Stressed Seasons:' : '20-Year Stress:'}</span>
                <span className="font-semibold text-leaf-700 dark:text-leaf-300">
                  {slot_2_recommended.stressed_seasons_20yr} / 20 {isPidgin ? 'years' : 'seasons'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-leaf-100/60">{isPidgin ? 'Est. Annual Revenue:' : 'Gross Revenue / ha:'}</span>
                <span className="font-bold text-leaf-700 dark:text-leaf-300">
                  {slot_2_recommended.annual_revenue_xaf.toLocaleString()} XAF
                </span>
              </div>
              <div className="flex justify-between text-leaf-700 dark:text-leaf-300 font-bold">
                <span>{isPidgin ? 'Extra Pocket Gain:' : 'Net Economic Gain:'}</span>
                <span>
                  {computed_facts_summary.slot1_vs_slot2_income_gain_xaf >= 0
                    ? `+${computed_facts_summary.slot1_vs_slot2_income_gain_xaf.toLocaleString()} XAF`
                    : `${computed_facts_summary.slot1_vs_slot2_income_gain_xaf.toLocaleString()} XAF`}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-leaf-100/80 p-2 text-center text-xs font-bold text-leaf-900 dark:bg-leaf-900/60 dark:text-leaf-200">
            {isPidgin ? '⭐ Best Balance for Yield & Safety' : '⭐ Optimal Climate-Economic Fit'}
          </div>
        </Card>

        {/* SLOT 3: Alternative Diversification */}
        <Card className="relative flex flex-col justify-between border border-leaf-200 bg-white/70 p-5 shadow-soft dark:border-white/10 dark:bg-canvas-card-dark/70">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink/70 dark:text-leaf-100/70">
                {isPidgin ? 'Slot 3: Alternative' : 'Slot 3: Diversification'}
              </span>
              <span className="text-base font-bold text-ink/80 dark:text-leaf-200">
                {slot_3_alternative.score}/100
              </span>
            </div>

            <h3 className="mt-2 text-base font-bold text-ink dark:text-leaf-50">
              {slot_3_alternative.name}
            </h3>
            <p className="mt-1 text-xs text-ink/60 dark:text-leaf-100/60">
              {slot_3_alternative.management}
            </p>

            <div className="mt-4 space-y-2 border-t border-leaf-100 pt-3 text-xs dark:border-white/10">
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-leaf-100/60">{isPidgin ? 'Resilience Score:' : 'Climate Resilience:'}</span>
                <span className="font-semibold">{slot_3_alternative.climate_resilience_pct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-leaf-100/60">{isPidgin ? 'Stressed Seasons:' : '20-Year Stress:'}</span>
                <span className="font-semibold">
                  {slot_3_alternative.stressed_seasons_20yr} / 20 {isPidgin ? 'years' : 'seasons'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60 dark:text-leaf-100/60">{isPidgin ? 'Est. Annual Revenue:' : 'Gross Revenue / ha:'}</span>
                <span className="font-bold text-ink dark:text-leaf-50">
                  {slot_3_alternative.annual_revenue_xaf.toLocaleString()} XAF
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-leaf-50 p-2 text-center text-[11px] font-medium text-ink/70 dark:bg-white/5 dark:text-leaf-100/70">
            {isPidgin ? 'Alternative option for farmer choice' : 'Alternative high-value option'}
          </div>
        </Card>
      </div>

      {/* GROUNDED AI ADVICE LIST WITH SCIENTIFIC CITATIONS */}
      <Card className="border border-leaf-200/60 bg-white/80 p-5 shadow-soft dark:border-white/10 dark:bg-canvas-card-dark/80">
        <div className="flex items-center justify-between border-b border-leaf-100/70 pb-3 dark:border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-leaf-700 dark:text-leaf-400" />
            <h3 className="text-sm font-bold tracking-tight text-ink dark:text-leaf-50">
              {isPidgin ? 'Grounded AI Advisory (Every Word Cites Real Facts)' : 'Grounded AI Advisory & Scientific Citations'}
            </h3>
          </div>
          <Badge tone="gray" className="text-[10px]">
            Zero Hallucination Guarantee
          </Badge>
        </div>

        <div className="mt-4 divide-y divide-leaf-100/60 dark:divide-white/5">
          {advisory_statements.map((adv, idx) => (
            <div key={idx} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-leaf-800 dark:text-leaf-300">
                  {adv.topic}
                </span>
              </div>

              <p className="mt-1 text-xs leading-relaxed text-ink/80 dark:text-leaf-100/90">
                {isPidgin ? adv.text_pidgin : adv.text_en}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold text-ink/40 uppercase dark:text-leaf-100/40">Sources:</span>
                {adv.sources.map((src, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 rounded-md bg-leaf-100/60 px-2 py-0.5 text-[10px] font-medium text-leaf-900 dark:bg-white/10 dark:text-leaf-200"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
