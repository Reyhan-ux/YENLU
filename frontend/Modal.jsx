import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

/** Accessible modal: bottom sheet on phones, centred dialog from sm up. Esc and backdrop close it. */
export default function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full animate-sheet overflow-y-auto rounded-t-3xl bg-white p-6 pb-8 shadow-lift dark:bg-[#0F2318] dark:text-leaf-50 sm:max-w-md sm:rounded-3xl sm:pb-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="-mr-2 -mt-1 grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5 dark:hover:bg-white/10">
            <X size={20} />
          </button>
        </div>
        {children}
        {footer && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
