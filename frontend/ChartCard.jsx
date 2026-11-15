import Card from './Card';
import { Skeleton } from './LoadingSkeleton';

/** Card wrapper for a chart: title, optional controls, skeleton while loading. */
export default function ChartCard({ title, subtitle, actions, loading = false, height = 260, className = '', children }) {
  return (
    <Card className={className}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-sm text-ink/60 dark:text-leaf-100/60">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      <div className="mt-4" style={{ height }}>
        {loading ? <Skeleton className="h-full w-full" /> : children}
      </div>
    </Card>
  );
}
