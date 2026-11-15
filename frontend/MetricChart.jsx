import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '../context/AppContext';
import { METRICS } from '../data/rainfall';
import { rainUnit, toUnits } from '../utils/format';

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-ink px-3 py-2 text-xs text-white shadow-lift">
      <p className="font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="opacity-80">{p.name}: {p.value} {unit}</p>
      ))}
    </div>
  );
}

/** Area chart of a metric against its climate normal. Honours the mm/in setting and dark mode. */
export default function MetricChart({ series, metric }) {
  const { theme, settings } = useApp();
  const dark = theme === 'dark';
  const isRain = metric === 'rain';
  const conv = (v) => (isRain ? toUnits(v, settings.units) : v);
  const unit = isRain ? rainUnit(settings.units) : METRICS[metric].unit;
  const data = series.map((p) => ({ label: p.label, value: conv(p.value), normal: conv(p.normal) }));
  const tick = dark ? '#9ACFAB' : '#5B7366';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2F9A63" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#2F9A63" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={dark ? 'rgba(255,255,255,.08)' : 'rgba(15,42,29,.08)'} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: tick }} interval="preserveStartEnd" minTickGap={28} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: tick }} width={48} />
        <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: tick, strokeDasharray: 3 }} />
        <Area type="monotone" dataKey="value" name={METRICS[metric].label} stroke="#2F9A63" strokeWidth={2.5} fill="url(#metricFill)" />
        <Line type="monotone" dataKey="normal" name="Normal" stroke={dark ? '#9ACFAB' : '#0F2A1D'} strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
