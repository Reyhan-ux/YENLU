import Card from './Card';

/** Subtle organic soil contour lines echoing Mount Cameroon terraced farm plots. */
function SoilContours() {
  return (
    <svg aria-hidden viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 opacity-20">
      {[46, 36, 26, 16, 6].map((r) => (
        <ellipse key={r} cx="55" cy="55" rx={r * 1.1} ry={r * 0.7} transform="rotate(-15 55 55)" />
      ))}
    </svg>
  );
}

/**
 * Agro-African headline metric card with grounded tactile styling.
 */
export default function StatCard({ tone = 'plain', label, value, unit, caption, to }) {
  return (
    <Card tone={tone} to={to} arrow className="flex min-h-[148px] flex-col justify-between gap-5">
      <SoilContours />
      <p className="relative text-xs font-semibold uppercase tracking-wider opacity-90">{label}</p>
      <div className="relative">
        <p className="font-serif text-4xl font-bold tracking-tight">
          {value}
          {unit && <span className="ml-1 font-sans text-base font-medium opacity-85">{unit}</span>}
        </p>
        {caption && <p className="mt-1 text-xs opacity-85">{caption}</p>}
      </div>
    </Card>
  );
}
