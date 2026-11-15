const TONES = {
  neutral: 'bg-ink/5 text-ink/70 dark:bg-white/10 dark:text-leaf-100',
  success: 'bg-leaf-100 text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-200',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200',
  danger: 'bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-200',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200',
  glass: 'bg-white/25 text-inherit backdrop-blur',
};

/** Small status pill. */
export default function Badge({ tone = 'neutral', icon: Icon, className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}>
      {Icon && <Icon size={12} aria-hidden />}
      {children}
    </span>
  );
}
