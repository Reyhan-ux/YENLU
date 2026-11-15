/** Segmented pill tabs. `tabs` = [{ value, label, count? }]. Scrolls sideways on narrow screens. */
export default function Tabs({ tabs, value, onChange, label, className = '' }) {
  return (
    <div role="tablist" aria-label={label} className={`inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-ink/5 p-1 dark:bg-white/10 ${className}`}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={`min-h-[44px] shrink-0 whitespace-nowrap rounded-full px-4 text-sm font-medium transition ${
              active ? 'bg-white text-ink shadow-soft dark:bg-leaf-300 dark:text-ink' : 'text-ink/60 hover:text-ink dark:text-leaf-100/70 dark:hover:text-white'
            }`}
          >
            {t.label}
            {t.count != null && <span className="ml-1.5 text-xs opacity-60">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
