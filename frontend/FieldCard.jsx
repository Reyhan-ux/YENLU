import { Link } from 'react-router-dom';
import { Droplets, ArrowRight, Sprout, TrendingUp } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import FavoriteButton from './FavoriteButton';
import { FAMILIES } from '../data/fields';
import { advisoryEngine } from '../engine/advisoryEngine';

export const healthColor = (h) => (h >= 80 ? 'bg-leaf-500' : h >= 65 ? 'bg-amber-400' : 'bg-red-500');
export const FLOOD_TONE = { low: 'success', medium: 'warning', high: 'danger' };
const FLOOD_LABEL = { low: 'Good drainage', medium: 'Watch drainage', high: 'Flood risk' };
const SCORE_COLOR = (s) =>
  s >= 80 ? 'text-leaf-600 dark:text-leaf-400' : s >= 60 ? 'text-amber-500' : 'text-red-500';

/**
 * Advisory-forward field card.
 * Hero: "Current crop → Next recommended crop" with agro-climatic match score bar.
 * Replaces the old generic health-bar-only card.
 */
export default function FieldCard({ field }) {
  // Pull live advisory recommendation for this plot
  let nextCrop = null;
  let matchScore = null;
  try {
    const adv = advisoryEngine.generateAdvisory(field.lat, field.lon, field.cropId);
    nextCrop = adv?.rotations?.slot_2_recommended?.next_crop?.common_name ?? null;
    const raw = adv?.rotations?.slot_2_recommended?.metrics?.agro_climatic_match_score
      ?? adv?.rotations?.slot_2_recommended?.composite_score
      ?? null;
    if (raw !== null) matchScore = raw <= 1 ? Math.round(raw * 100) : Math.round(raw);
  } catch (_) { /* silent */ }

  // Harvest countdown
  const harvestDate = field.harvest ? new Date(field.harvest) : null;
  const daysToHarvest = harvestDate
    ? Math.max(0, Math.ceil((harvestDate - Date.now()) / 86400000))
    : null;

  const familyLabel = FAMILIES[field.family]?.label ?? field.family;

  return (
    <Card lift className="relative flex flex-col gap-0 overflow-hidden p-0">
      {/* Full-card link */}
      <Link to={`/fields/${field.id}`} aria-label={`Open ${field.name}`} className="absolute inset-0 z-10" />

      {/* Top accent stripe — flood risk colour */}
      <div
        className={`h-1 w-full ${
          field.floodRisk === 'high' ? 'bg-red-400' :
          field.floodRisk === 'medium' ? 'bg-amber-400' : 'bg-leaf-500'
        }`}
      />

      <div className="pointer-events-none relative flex flex-col gap-4 p-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-ink/50 dark:text-leaf-100/50">
              {field.zone} · {field.elevation}m elev.
            </p>
            <h3 className="mt-0.5 truncate text-base font-semibold leading-tight tracking-tight font-sans">
              {field.name}
            </h3>
          </div>
          <span className="pointer-events-auto shrink-0">
            <FavoriteButton id={field.id} />
          </span>
        </div>

        {/* HERO ADVISORY BOX */}
        <div className="rounded-xl bg-leaf-50 px-4 py-3 dark:bg-white/5">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink/40 dark:text-leaf-100/40">
            Next rotation advice
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-ink dark:text-leaf-50">
              <Sprout size={14} className="text-leaf-500 shrink-0" />
              {field.crop}
            </span>
            <ArrowRight size={13} className="shrink-0 text-ink/30 dark:text-leaf-100/30" />
            <span className="text-sm font-bold text-leaf-700 dark:text-leaf-400">
              {nextCrop ?? 'Calculating…'}
            </span>
          </div>

          {/* Match score bar */}
          {matchScore !== null && (
            <div className="mt-2.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    matchScore >= 80 ? 'bg-leaf-500' :
                    matchScore >= 60 ? 'bg-amber-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${matchScore}%` }}
                />
              </div>
              <span className={`text-xs font-bold tabular-nums ${SCORE_COLOR(matchScore)}`}>
                {matchScore}%
              </span>
              <span className="text-[10px] text-ink/40 dark:text-leaf-100/40">agro-match</span>
            </div>
          )}
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{familyLabel}</Badge>
          <Badge tone={FLOOD_TONE[field.floodRisk]}>{FLOOD_LABEL[field.floodRisk]}</Badge>
          <span className="ml-auto text-xs text-ink/50 dark:text-leaf-100/50">
            {field.area} ac
          </span>
        </div>

        {/* Footer: moisture + harvest */}
        <div className="flex items-center justify-between gap-3 border-t border-ink/5 pt-3 dark:border-white/10">
          <span className="inline-flex items-center gap-1.5 text-xs text-ink/60 dark:text-leaf-100/60">
            <Droplets size={12} />
            {field.soilMoisture}% moisture
          </span>
          {daysToHarvest !== null && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ink/70 dark:text-leaf-100/70">
              <TrendingUp size={12} className="text-leaf-500" />
              Harvest in {daysToHarvest}d
            </span>
          )}
        </div>

      </div>
    </Card>
  );
}
