import { Search, X } from 'lucide-react';

/** Controlled search input with a clear button. */
export default function SearchBar({ value, onChange, placeholder = 'Search', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={18} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 dark:text-leaf-100/50" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-full border border-ink/10 bg-white pl-11 pr-11 text-sm outline-none transition placeholder:text-ink/40 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/20 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-leaf-100/40 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="absolute right-0 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center text-ink/50 dark:text-leaf-100/60">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
