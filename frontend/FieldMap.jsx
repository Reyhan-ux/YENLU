import { layerColor } from '../utils/layers';

/**
 * Schematic map of the Buea farming zones (no tiles, no network).
 * Marker colour follows the selected layer. Positions are approximate.
 */
export default function FieldMap({ fields, layer, selectedId, onSelect }) {
  return (
    <svg viewBox="0 0 100 78" className="h-auto w-full select-none" role="group" aria-label="Map of fields around Buea">
      <rect width="100" height="78" rx="4" className="fill-leaf-50 dark:fill-white/[0.03]" />
      {/* Mount Cameroon slopes: contour rings */}
      {[34, 27, 20, 13, 6].map((r) => (
        <ellipse key={r} cx="22" cy="14" rx={r * 1.25} ry={r} className="fill-none stroke-leaf-400/50 dark:stroke-leaf-300/20" strokeWidth=".4" />
      ))}
      {/* Rivers and main road */}
      <path d="M30 20 C 38 34, 30 48, 46 58 S 60 72, 64 78" className="fill-none stroke-sky-400/60" strokeWidth=".9" strokeLinecap="round" />
      <path d="M12 44 C 24 46, 34 40, 44 41 S 70 42, 98 48" className="fill-none stroke-ink/25 dark:stroke-white/25" strokeWidth=".7" strokeDasharray="2 1.4" />
      <text x="6" y="8" className="fill-ink/50 dark:fill-leaf-100/50" fontSize="2.6">Mount Cameroon slopes</text>
      <circle cx="44" cy="41" r="1" className="fill-ink/60 dark:fill-leaf-100/60" />
      <text x="46" y="44" className="fill-ink/60 dark:fill-leaf-100/60" fontSize="2.4">Buea Town</text>

      {fields.map((f) => {
        const selected = f.id === selectedId;
        return (
          <g
            key={f.id}
            role="button"
            tabIndex={0}
            aria-label={`${f.name}, ${f.crop}`}
            aria-pressed={selected}
            onClick={() => onSelect(f.id)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(f.id))}
            className="cursor-pointer"
          >
            <circle cx={f.map.x} cy={f.map.y} r="6" fill="transparent" />
            <circle cx={f.map.x} cy={f.map.y} r={selected ? 4.6 : 0} fill="none" stroke="#0F2A1D" strokeWidth=".7" opacity=".8" />
            <circle cx={f.map.x} cy={f.map.y} r={selected ? 3.4 : 2.8} fill={layerColor(f, layer)} stroke="#fff" strokeWidth=".8" style={{ transition: 'all .25s' }} />
            <text x={f.map.x} y={f.map.y + 7} textAnchor="middle" fontSize="2.5" fontWeight={selected ? 600 : 400} className="fill-ink dark:fill-leaf-50">{f.short}</text>
          </g>
        );
      })}
    </svg>
  );
}
