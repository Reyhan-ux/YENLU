import { SearchX } from 'lucide-react';

/** Friendly empty or error panel with an optional action. */
export default function EmptyState({ icon: Icon = SearchX, title, text, action }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink/15 px-6 py-14 text-center dark:border-white/15">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-leaf-100 text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-200">
        <Icon size={24} aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {text && <p className="mt-1 max-w-sm text-sm text-ink/60 dark:text-leaf-100/60">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
