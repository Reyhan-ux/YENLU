/** Switch with a 44px touch target. */
export default function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="relative inline-flex h-11 w-[60px] shrink-0 items-center justify-center">
      <span className={`h-7 w-12 rounded-full transition ${checked ? 'bg-leaf-500' : 'bg-ink/15 dark:bg-white/20'}`} />
      <span className={`absolute left-[10px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </button>
  );
}
