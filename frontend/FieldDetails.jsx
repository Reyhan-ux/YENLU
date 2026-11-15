import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, CloudRain, MapPinned, Sprout } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import ChartCard from '../components/ChartCard';
import MetricChart from '../components/MetricChart';
import EmptyState from '../components/EmptyState';
import FavoriteButton from '../components/FavoriteButton';
import { FLOOD_TONE } from '../components/FieldCard';
import { Skeleton } from '../components/LoadingSkeleton';
import { useApp } from '../context/AppContext';
import useLoading from '../hooks/useLoading';
import { FAMILIES, FIELDS } from '../data/fields';
import { advisories, buildPlan } from '../data/rotation';
import { getForecast, getSeries, METRICS, RANGES } from '../data/rainfall';
import { clamp, fmtDate, rainUnit, toUnits } from '../utils/format';
import ThreeSlotRotations from '../components/ThreeSlotRotations';
import WhatIfSliders from '../components/WhatIfSliders';
import AddCropModal from '../components/AddCropModal';
import FieldPlanExport from '../components/FieldPlanExport';

const FAMILY_TONE = { legume: 'green', vegetable: 'amber', cereal: 'teal', root: 'iris' };
const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'rotation', label: 'Rotation plan' },
  { value: 'climate', label: 'Rainfall and soil' },
];
const METRIC_OPTIONS = Object.entries(METRICS).map(([value, m]) => ({ value, label: m.label }));

/** Field detail page with three tabs and an "apply rotation plan" modal. */
export default function FieldDetails() {
  const { id } = useParams();
  const field = FIELDS.find((f) => f.id === id);
  const { plans, applyPlan, settings } = useApp();
  const [tab, setTab] = useState('overview');
  const [range, setRange] = useState('30D');
  const [metric, setMetric] = useState('rain');
  const [open, setOpen] = useState(false);
  const [crop, setCrop] = useState('');
  const [done, setDone] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [showExportPlan, setShowExportPlan] = useState(false);

  const loading = useLoading([id], 500);
  const chartLoading = useLoading([id, range, metric, tab], 400);
  const series = useMemo(() => getSeries({ range, metric, key: id, factor: field?.rainFactor ?? 1 }), [range, metric, id, field]);
  const plan = useMemo(() => (field ? buildPlan(field) : []), [field]);
  const forecast = useMemo(() => getForecast(field?.rainFactor ?? 1), [field]);

  useEffect(() => { setTab('overview'); }, [id]);

  if (!field) {
    return (
      <EmptyState
        title="Field not found"
        text="This field may have been removed, or the link is wrong."
        action={<Link to="/"><Button>Back to dashboard</Button></Link>}
      />
    );
  }

  const applied = plans[field.id];
  const progress = clamp(Math.round(((Date.now() - new Date(field.planted)) / (new Date(field.harvest) - new Date(field.planted))) * 100), 0, 100);
  const rainTotal = series.reduce((s, p) => s + p.value, 0);
  const openModal = () => { setCrop(plan[0].crop); setDone(false); setOpen(true); };
  const confirm = () => { applyPlan(field.id, { season: plan[0].label, window: plan[0].window, crop }); setDone(true); };

  return (
    <div className="space-y-4">
      <Link to="/" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink dark:text-leaf-100/70 dark:hover:text-white">
        <ArrowLeft size={16} /> All fields
      </Link>

      {/* Hero */}
      <Card tone={FAMILY_TONE[field.family]} className="p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm opacity-85"><MapPinned size={14} />{field.zone}, Buea</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">{field.name}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="glass">{field.crop}</Badge>
              <Badge tone="glass">{field.stage}</Badge>
              {applied && <Badge tone="glass" icon={CheckCircle2}>Plan applied</Badge>}
            </div>
          </div>
          <FavoriteButton id={field.id} />
        </div>
        <div className="mt-6">
          <div className="mb-1.5 flex justify-between text-sm opacity-90"><span>Season progress</span><span>{progress}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-black/15"><div className="h-full rounded-full bg-white/90 transition-all duration-700" style={{ width: `${progress}%` }} /></div>
          <p className="mt-1.5 text-xs opacity-80">Planted {fmtDate(field.planted)}. Harvest expected {fmtDate(field.harvest)}.</p>
        </div>
      </Card>

      <Tabs tabs={TABS} value={tab} onChange={setTab} label="Field sections" />

      {loading ? <Skeleton className="h-72 w-full !rounded-2xl" /> : (
        <>
          {tab === 'overview' && (
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-4">
                {[
                  ['Crop health', `${field.health}%`],
                  ['Soil moisture', `${field.soilMoisture}%`],
                  ['Area', `${field.area} acres`],
                ].map(([label, value]) => (
                  <Card key={label}><p className="text-sm text-ink/60 dark:text-leaf-100/60">{label}</p><p className="mt-1 text-3xl font-light tracking-tight">{value}</p></Card>
                ))}
                <Card><p className="text-sm text-ink/60 dark:text-leaf-100/60">Flood risk</p><div className="mt-2"><Badge tone={FLOOD_TONE[field.floodRisk]}>{field.floodRisk}</Badge></div></Card>
              </div>

              <Card className="lg:col-span-2">
                <h2 className="text-base font-semibold">This week's advice</h2>
                <ul className="mt-3 space-y-3">
                  {advisories(field).map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <Badge tone={a.tone} className="mt-0.5 shrink-0">{a.tone === 'info' ? 'Next' : a.tone === 'success' ? 'Good' : a.tone === 'danger' ? 'Act' : 'Watch'}</Badge>
                      <span>{a.text}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <h2 className="text-base font-semibold">Field details</h2>
                <dl className="mt-3 divide-y divide-ink/5 text-sm dark:divide-white/10">
                  {[
                    ['Soil', field.soil],
                    ['Elevation', `About ${field.elevation} m`],
                    ['Family', FAMILIES[field.family].label],
                    ['Previous crops', field.history.join(', ')],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-ink/60 dark:text-leaf-100/60">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
                  ))}
                </dl>
              </Card>

              <Card className="lg:col-span-3">
                <h2 className="flex items-center gap-2 text-base font-semibold"><CloudRain size={18} />Next 7 days</h2>
                <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {forecast.map((d) => (
                    <div key={d.day} className="rounded-xl bg-leaf-50 p-3 text-center dark:bg-white/5">
                      <p className="text-xs text-ink/60 dark:text-leaf-100/60">{d.day}</p>
                      <p className="mt-1 font-medium">{toUnits(d.rain, settings.units)}<span className="text-xs font-normal"> {rainUnit(settings.units)}</span></p>
                      <p className="text-xs text-ink/60 dark:text-leaf-100/60">{d.chance}%</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {tab === 'rotation' && (
            <div className="space-y-6">
              {/* Interactive What-If Climate Simulator */}
              <WhatIfSliders />

              {/* 3-Slot Rotation Decision Model with 20-Yr NASA Back-Test */}
              <ThreeSlotRotations
                field={field}
                onOpenAddCrop={() => setShowAddCrop(true)}
                onExportPlan={() => setShowExportPlan(true)}
              />

              {/* Four-Season Succession Timeline */}
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold tracking-tight">Four-Season Succession Plan</h2>
                    <p className="text-sm text-ink/60 dark:text-leaf-100/60">
                      Currently {field.crop.toLowerCase()} ({FAMILIES[field.family].label.toLowerCase()}). Planned in rotation order.
                    </p>
                  </div>
                  <Button icon={Sprout} onClick={openModal}>{applied ? 'Change plan' : 'Apply plan'}</Button>
                </div>
                <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {plan.map((p, i) => (
                    <li key={p.label} className={`rounded-2xl p-4 ${i === 0 ? 'bg-leaf-100 dark:bg-leaf-500/15' : 'bg-leaf-50 dark:bg-white/5'}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-xs text-ink/70 dark:text-leaf-100/70">{p.label}</p>
                        <Badge tone={i === 0 ? 'success' : 'neutral'} className="text-[10px]">{p.window}</Badge>
                      </div>
                      <p className="mt-2 text-lg font-semibold tracking-tight">{i === 0 && applied ? applied.crop : p.crop}</p>
                      <p className="mt-1 text-xs text-ink/70 dark:text-leaf-100/70 line-clamp-2">{p.reason}</p>
                    </li>
                  ))}
                </ol>
              </Card>
            </div>
          )}

          {tab === 'climate' && (
            <div className="space-y-6">
              <WhatIfSliders />
              <ChartCard
                title={METRICS[metric].label}
                subtitle={metric === 'rain' ? `${toUnits(rainTotal, settings.units)} ${rainUnit(settings.units)} over this period at ${field.zone}.` : `Readings for ${field.zone}.`}
                loading={chartLoading}
                height={300}
                actions={
                  <>
                    <Dropdown value={metric} onChange={setMetric} options={METRIC_OPTIONS} label="Metric" align="right" />
                    <Tabs tabs={RANGES.map((r) => ({ value: r.value, label: r.value }))} value={range} onChange={setRange} label="Time range" />
                  </>
                }
              >
                <MetricChart series={series} metric={metric} />
              </ChartCard>
            </div>
          )}
        </>
      )}

      {/* Apply plan modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={done ? 'Plan applied' : 'Apply rotation plan'}
        footer={done ? <Button onClick={() => setOpen(false)}>Done</Button> : (
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={confirm}>Apply plan</Button>
          </>
        )}
      >
        {done ? (
          <p className="text-sm text-ink/70 dark:text-leaf-100/70">{field.name} will follow the plan, starting with {crop.toLowerCase()} in {plan[0].label}.</p>
        ) : (
          <div className="space-y-3 text-sm">
            <p className="text-ink/70 dark:text-leaf-100/70">Choose the crop for {plan[0].label} ({plan[0].window}). Every option keeps the rotation order.</p>
            <Dropdown value={crop} onChange={setCrop} label="Crop for next season" options={plan[0].crops.map((c) => ({ value: c, label: c }))} />
          </div>
        )}
      </Modal>

      {/* Add Custom Crop Modal (Feature 3) */}
      <AddCropModal
        open={showAddCrop}
        onClose={() => setShowAddCrop(false)}
        onCropAdded={() => {}}
      />

      {/* 1-Page Printable / PDF Field Action Plan (Feature 1) */}
      <FieldPlanExport
        open={showExportPlan}
        onClose={() => setShowExportPlan(false)}
        field={field}
      />
    </div>
  );
}
