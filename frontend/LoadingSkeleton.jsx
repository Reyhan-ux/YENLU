/** Shimmering placeholder block. */
export function Skeleton({ className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-ink/[0.07] dark:bg-white/10 ${className}`} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10" />
    </div>
  );
}

/** Placeholder for a stat or field card. */
export function CardSkeleton({ className = 'h-40' }) {
  return <Skeleton className={`w-full !rounded-2xl ${className}`} />;
}

/** Placeholder for a list of rows. */
export function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => <Skeleton key={i} className="h-24 w-full !rounded-2xl" />)}
    </div>
  );
}

/** Placeholder for the whole dashboard on first load. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} className="h-36" />)}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <CardSkeleton className="h-80 lg:col-span-2" />
        <CardSkeleton className="h-80" />
      </div>
    </div>
  );
}

export default Skeleton;
