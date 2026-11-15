import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/** Custom select. `options` = [{ value, label }]. Closes on outside click and Escape. */
export default function Dropdown({ value, onChange, options, label, align = 'left', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, []);

  const current = options.find((o) => o.value === value);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-full border border-ink/10 bg-white px-4 text-sm font-medium transition hover:bg-leaf-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown size={16} aria-hidden className={`shrink-0 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul role="listbox" className={`absolute z-30 mt-2 max-h-64 w-max min-w-full animate-pop overflow-auto rounded-2xl border border-ink/10 bg-white p-1 shadow-lift dark:border-white/10 dark:bg-[#10261A] ${align === 'right' ? 'right-0' : 'left-0'}`}>
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className="flex min-h-[44px] w-full items-center justify-between gap-6 rounded-xl px-3 text-left text-sm hover:bg-leaf-50 dark:hover:bg-white/10"
              >
                {o.label}
                {o.value === value && <Check size={16} className="text-leaf-500" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
