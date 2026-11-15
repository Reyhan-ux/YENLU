import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { ALERTS } from '../data/alerts';

// Global app state: theme, favourites, alert status, applied rotation plans and settings.
// Everything persists in localStorage under the "yenlu:" prefix.
const Ctx = createContext(null);

export const DEFAULT_SETTINGS = {
  name: 'Clarisse Ngwa',
  location: 'Buea Town',
  language: 'en',
  units: 'mm',
  notify: { flood: true, dry: true, rotation: true, market: false },
};
const prefersDark = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;

export function AppProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('yenlu:theme', 'light');
  const [favorites, setFavorites] = useLocalStorage('yenlu:favorites', ['muea-north']);
  const [readAlerts, setReadAlerts] = useLocalStorage('yenlu:read', ['a8', 'a9', 'a10']);
  const [dismissed, setDismissed] = useLocalStorage('yenlu:dismissed', []);
  const [plans, setPlans] = useLocalStorage('yenlu:plans', {});
  const [rawSettings, setRawSettings] = useLocalStorage('yenlu:settings', DEFAULT_SETTINGS);

  // Advanced features state: What-If climate sliders and custom crops
  const [climateModifiers, setClimateModifiers] = useState({ rainMultiplier: 1.0, onsetDelayDays: 0 });
  const [customCrops, setCustomCrops] = useState([]);

  // Guarantee settings is never null and always contains default fields even if localStorage is corrupted
  const settings = useMemo(() => ({
    ...DEFAULT_SETTINGS,
    ...(rawSettings && typeof rawSettings === 'object' ? rawSettings : {})
  }), [rawSettings]);

  // Keep the <html> class light mode default
  useEffect(() => {
    try {
      document.documentElement.classList.remove('dark');
    } catch (e) {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [setTheme]);
  const toggleFavorite = useCallback((id) => setFavorites((f) => (Array.isArray(f) && f.includes(id) ? f.filter((x) => x !== id) : [...(Array.isArray(f) ? f : []), id])), [setFavorites]);
  const markRead = useCallback((id) => setReadAlerts((r) => (Array.isArray(r) && r.includes(id) ? r : [...(Array.isArray(r) ? r : []), id])), [setReadAlerts]);
  const dismiss = useCallback((id) => setDismissed((d) => (Array.isArray(d) && d.includes(id) ? d : [...(Array.isArray(d) ? d : []), id])), [setDismissed]);
  const applyPlan = useCallback((fieldId, plan) => setPlans((p) => ({ ...(p || {}), [fieldId]: plan })), [setPlans]);
  const updateSettings = useCallback((patch) => setRawSettings((s) => ({ ...(s || DEFAULT_SETTINGS), ...patch })), [setRawSettings]);

  const toggleLanguage = useCallback(() => {
    const nextLang = settings.language === 'fr' ? 'en' : 'fr';
    updateSettings({ language: nextLang });
  }, [settings.language, updateSettings]);

  const resetClimateModifiers = useCallback(() => {
    setClimateModifiers({ rainMultiplier: 1.0, onsetDelayDays: 0 });
  }, []);

  // Alerts the user can see: not dismissed, and the type has not been switched off in Settings.
  const safeDismissed = Array.isArray(dismissed) ? dismissed : [];
  const safeReadAlerts = Array.isArray(readAlerts) ? readAlerts : [];
  const safeFavorites = Array.isArray(favorites) ? favorites : [];

  const alerts = useMemo(
    () => ALERTS.filter((a) => !safeDismissed.includes(a.id) && settings.notify?.[a.type] !== false),
    [safeDismissed, settings.notify]
  );
  const unreadCount = alerts.filter((a) => !safeReadAlerts.includes(a.id)).length;
  const markAllRead = useCallback(() => setReadAlerts(ALERTS.map((a) => a.id)), [setReadAlerts]);

  const resetAll = useCallback(() => {
    setFavorites(['muea-north']); setReadAlerts(['a8', 'a9', 'a10']); setDismissed([]); setPlans({}); setRawSettings(DEFAULT_SETTINGS);
    setClimateModifiers({ rainMultiplier: 1.0, onsetDelayDays: 0 });
    setCustomCrops([]);
  }, [setFavorites, setReadAlerts, setDismissed, setPlans, setRawSettings]);

  const value = {
    theme, toggleTheme, favorites: safeFavorites, isFavorite: (id) => safeFavorites.includes(id), toggleFavorite,
    alerts, readAlerts: safeReadAlerts, unreadCount, markRead, markAllRead, dismiss,
    plans: plans || {}, applyPlan, settings, updateSettings, resetAll,
    language: settings.language || 'en', toggleLanguage,
    climateModifiers, setClimateModifiers, resetClimateModifiers,
    customCrops, setCustomCrops
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);
