// Pill button. Minimum 44px tall for touch.
const VARIANTS = {
  primary: 'bg-ink text-white hover:bg-ink-soft dark:bg-leaf-300 dark:text-ink dark:hover:bg-leaf-200',
  secondary: 'border border-ink/10 bg-white text-ink hover:bg-leaf-50 dark:border-white/10 dark:bg-white/5 dark:text-leaf-50 dark:hover:bg-white/10',
  ghost: 'text-ink hover:bg-ink/5 dark:text-leaf-50 dark:hover:bg-white/10',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

export default function Button({ variant = 'primary', icon: Icon, iconOnly = false, className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full text-sm font-medium transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-50 ${
        iconOnly ? 'w-11' : 'px-5'
      } ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={18} aria-hidden />}
      {children}
    </button>
  );
}
