// Small formatting helpers shared across the app.
export const MM_PER_IN = 25.4;
export const toUnits = (mm, units) => (units === 'in' ? +(mm / MM_PER_IN).toFixed(2) : Math.round(mm));
export const rainUnit = (units) => (units === 'in' ? 'in' : 'mm');
export const xaf = (n) => `${new Intl.NumberFormat('fr-FR').format(Math.round(n)).replace(/[\u202f\u00a0]/g, ' ')} XAF`;
export const initials = (name = '') => name.split(' ').filter(Boolean).map((s) => s[0]).slice(0, 2).join('').toUpperCase();
export const fmtDate = (iso) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
export const daysUntil = (iso) => Math.ceil((new Date(iso) - new Date()) / 86400000);
export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};
