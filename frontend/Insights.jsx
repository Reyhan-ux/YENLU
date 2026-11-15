import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';
import FieldMap from '../components/FieldMap';
import WhatIfSliders from '../components/WhatIfSliders';
import Tabs from '../components/Tabs';
import Dropdown from '../components/Dropdown';
import SearchBar from '../components/SearchBar';
import Badge from '../components/Badge';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { FLOOD_TONE } from '../components/FieldCard';
import { Skeleton } from '../components/LoadingSkeleton';
import { useApp } from '../context/AppContext';
import useLoading from '../hooks/useLoading';
import { FIELDS, ZONES } from '../data/fields';
import { LAYERS, layerColor, layerLabel, layerValue } from '../utils/layers';

/** Map and insights: switch layers, filter by zone, compare fields. */
export default function Insights() {
  const { theme, settings } = useApp();
  const [layer, setLayer] = useState('flood');
  const [zone, setZone] = useState('all');
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const loading = useLoading([layer], 450);
  const tick = theme === 'dark' ? '#9ACFAB' : '#5B7366';

  const fields = useMemo(() => {
    const term = q.trim().toLowerCase();
    return FIELDS.filter((f) => (zone === 'all' || f.zone === zone) && (!term || [f.name, f.crop, f.zone].join(' ').toLowerCase().includes(term)));
  }, [zone, q]);
  const selected = fields.find((f) => f.id === selectedId);
  const data = fields.map((f) => ({ id: f.id, name: f.short, value: layerValue(f, layer), label: layerLabel(f, layer, settings.units), color: layerColor(f, layer) }));
  const zoneOptions = [{ value: 'all', label: 'All zones' }, ...ZONES.map((z) => ({ value: z, label: z }))];

  return (
    <div className="space-y-4">
      <div className="py-4">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Field insights</h1>
        <p className="mt-2 max-w-xl text-ink/60 dark:text-leaf-100/60">See where water, soil and crop health differ across the farming zones around Buea.</p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs tabs={LAYERS} value={layer} onChange={setLayer} label="Map layer" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchBar value={q} onChange={setQ} placeholder="Search fields" className="sm:w-60" />
          <Dropdown value={zone} onChange={setZone} options={zoneOptions} label="Zone" align="right" className="sm:w-44" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 !p-3 md:!p-4">
          {loading ? <Skeleton className="aspect-[100/78] w-full !rounded-xl" /> : fields.length ? (
            <FieldMap fields={fields} layer={layer} selectedId={selectedId} onSelect={setSelectedId} />
          ) : (
            <EmptyState title="No fields found" text="Change the search or zone to see fields on the map." action={<Button variant="secondary" onClick={() => { setQ(''); setZone('all'); }}>Reset</Button>} />
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-xs text-ink/70 dark:text-leaf-100/70">
            {layer === 'flood' ? (
              [['Low', '#2F9A63'], ['Medium', '#E5A93C'], ['High', '#D9534F']].map(([l, c]) => (
                <span key={l} className="inline-flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: c }} />{l}</span>
              ))
            ) : (
              <span className="inline-flex items-center gap-2">Lower<span className="h-2 w-24 rounded-full" style={{ background: layer === 'rain' ? 'linear-gradient(90deg,#A9D2F2,#1F5FB0)' : 'linear-gradient(90deg,#BFE3CB,#0F6B40)' }} />Higher</span>
            )}
            <span className="ml-auto">Schematic map. Positions are approximate.</span>
          </div>
        </Card>

        <Card className="flex flex-col">
          {selected ? (
            <>
              <p className="text-sm text-ink/60 dark:text-leaf-100/60">{selected.zone}</p>
              <h2 className="text-xl font-semibold tracking-tight">{selected.name}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="success">{selected.crop}</Badge>
                <Badge tone={FLOOD_TONE[selected.floodRisk]}>Flood: {selected.floodRisk}</Badge>
              </div>
              <dl className="mt-4 divide-y divide-ink/5 text-sm dark:divide-white/10">
                {[
                  ['Selected layer', layerLabel(selected, layer, settings.units)],
                  ['Soil moisture', `${selected.soilMoisture}%`],
                  ['Crop health', `${selected.health}%`],
                  ['Elevation', `About ${selected.elevation} m`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2.5"><dt className="text-ink/60 dark:text-leaf-100/60">{k}</dt><dd className="font-medium">{v}</dd></div>
                ))}
              </dl>
              <Link to={`/fields/${selected.id}`} className="mt-auto pt-4"><Button className="w-full">Open field</Button></Link>
            </>
          ) : (
            <div className="my-auto py-8 text-center">
              <p className="font-medium">Select a field</p>
              <p className="mt-1 text-sm text-ink/60 dark:text-leaf-100/60">Tap a marker on the map or a bar in the chart to see its details.</p>
            </div>
          )}
        </Card>
      </div>

      <ChartCard title="Compare fields" subtitle={LAYERS.find((l) => l.value === layer).label} loading={loading} height={Math.max(180, data.length * 44 + 20)}>
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <XAxis type="number" hide domain={[0, layer === 'rain' ? 'dataMax' : 100]} />
              <YAxis type="category" dataKey="name" width={84} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: tick }} />
              <Tooltip
                cursor={{ fill: 'rgba(47,154,99,.08)' }}
                content={({ active, payload }) => active && payload?.length ? (
                  <div className="rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-lift">{payload[0].payload.name}: {payload[0].payload.label}</div>
                ) : null}
              />
              <Bar dataKey="value" radius={8} barSize={22} onClick={(d) => setSelectedId(d.payload?.id ?? d.id)} cursor="pointer">
                {data.map((d) => <Cell key={d.id} fill={d.color} stroke={d.id === selectedId ? '#0F2A1D' : 'none'} strokeWidth={2} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : null}
      </ChartCard>

      {/* Interactive What-If Climate Simulator */}
      <section className="pt-2">
        <WhatIfSliders />
      </section>
    </div>
  );
}
