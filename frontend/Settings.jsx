import { useEffect, useState } from 'react';
import { ArrowClockwise, Info, Moon, Plant, ShieldCheck } from '@phosphor-icons/react';
import Card from '../components/Card';
import Button from '../components/Button';
import Toggle from '../components/Toggle';
import Tabs from '../components/Tabs';
import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal';
import MethodologyTelemetry from '../components/MethodologyTelemetry';
import { useApp } from '../context/AppContext';
import { initials } from '../utils/format';

const LOCATIONS = ['Buea Town', 'Molyko', 'Muea', 'Bokwango', 'Bonakanda', 'Bova', 'Tole', 'Lysoka'].map((l) => ({ value: l, label: l }));
const LANGUAGES = [{ value: 'en', label: 'English' }, { value: 'fr', label: 'Français' }];
const NOTIFY = [
  ['flood', 'Flood and heavy rain', 'Waterlogging and storm warnings for your fields.'],
  ['dry', 'Dry spells', 'Low soil moisture and dry season reminders.'],
  ['rotation', 'Rotation reminders', 'When a planting window opens or a rotation rule is at risk.'],
  ['market', 'Market prices', 'Weekly price moves for your crops.'],
];

/** One labelled row: text on the left, control on the right (stacks on phones). */
function Row({ title, hint, children }) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 sm:max-w-sm">
        <p className="font-semibold text-stone-800 dark:text-stone-200">{title}</p>
        {hint && <p className="text-xs text-stone-500 dark:text-stone-400">{hint}</p>}
      </div>
      <div className="sm:w-60">{children}</div>
    </div>
  );
}

/** Profile, preferences, notifications, About Us, and Scientific Methodology. */
export default function Settings() {
  const { settings, updateSettings, theme, toggleTheme, resetAll, language } = useApp();
  const [confirmReset, setConfirmReset] = useState(false);
  const isFr = language === 'fr';

  useEffect(() => {
    if (window.location.hash === '#methodology') {
      const el = document.getElementById('methodology');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="py-4">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1F2421] dark:text-[#F5EFEB] md:text-4xl">
          {isFr ? 'Paramètres & À Propos' : 'Settings & About'}
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          {isFr ? 'Préférences locales et méthodologie scientifique de télémétrie.' : 'Local farmer preferences and scientific telemetry methodology.'}
        </p>
      </div>

      {/* Farmer Profile Card */}
      <Card>
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#184A2C] font-serif text-xl font-bold text-white shadow-sm dark:bg-[#A3E3B5] dark:text-[#0F2A1D]">
            {initials(settings.name)}
          </span>
          <div>
            <p className="text-lg font-bold text-stone-900 dark:text-stone-100">{settings.name || 'Farmer'}</p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {isFr ? 'Exploitant agricole' : 'Farmer'}, {settings.location} (Fako Division)
            </p>
          </div>
        </div>
        <div className="mt-3 divide-y divide-[#E3D9CC]/60 dark:divide-white/10">
          <Row title={isFr ? 'Nom affiché' : 'Display name'}>
            <input
              value={settings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
              aria-label="Display name"
              className="h-11 w-full rounded-xl border border-[#E3D9CC] bg-white px-4 text-sm font-medium text-stone-800 outline-none focus:border-[#184A2C] focus:ring-2 focus:ring-[#184A2C]/20 dark:border-white/10 dark:bg-white/5 dark:text-stone-100"
            />
          </Row>
          <Row title={isFr ? 'Zone d\'exploitation' : 'Home area'} hint={isFr ? 'Utilisé pour la météo et les conseils.' : 'Used for microclimate calibrations.'}>
            <Dropdown value={settings.location} onChange={(v) => updateSettings({ location: v })} options={LOCATIONS} label="Home area" />
          </Row>
          <Row title={isFr ? 'Langue' : 'Language'}>
            <Dropdown value={settings.language} onChange={(v) => updateSettings({ language: v })} options={LANGUAGES} label="Language" />
          </Row>
        </div>
      </Card>

      {/* About Us Section */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#184A2C]/10 text-[#184A2C] dark:bg-leaf-300/20 dark:text-leaf-300">
            <Info size={16} weight="bold" />
          </span>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            {isFr ? 'À propos de YENLU Field Shift' : 'About YENLU Field Shift'}
          </h2>
        </div>
        <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-300">
          {isFr
            ? 'YENLU Field Shift est une application d\'aide à la décision agronomique conçue pour les petits exploitants et conseillers agricoles du Mont Cameroun (Buea, Fako). Face aux risques combinés de fortes pluies torrentielles et d\'érosion sur pentes volcaniques, YENLU croise les données satellitaires ouvertes de la NASA avec la réalité des sols locaux et des prix du marché.'
            : 'YENLU Field Shift is an agro-advisory decision support platform engineered specifically for smallholder farmers and extension agents on Mount Cameroon (Buea, Fako Division). Rather than generic drought tools, YENLU addresses Buea\'s specific environmental challenge: steep volcanic slopes vulnerable to extreme rainfall waterlogging and severe topsoil runoff.'}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E3D9CC] bg-[#FAF5EE] p-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#184A2C] dark:text-leaf-300">
              <Plant size={14} weight="bold" />
              <span>{isFr ? 'Mission locale' : 'Our Mission'}</span>
            </div>
            <p className="mt-1 text-[11px] text-stone-600 dark:text-stone-400">
              {isFr
                ? 'Donner aux agriculteurs des recommandations vérifiables et compréhensibles sans promesses de rendement irréalistes.'
                : 'Provide smallholders with verifiable, grounded crop rotation recommendations without hallucinated yield predictions.'}
            </p>
          </div>

          <div className="rounded-xl border border-[#E3D9CC] bg-[#FAF5EE] p-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-1.5 font-bold text-xs text-[#184A2C] dark:text-leaf-300">
              <ShieldCheck size={14} weight="bold" />
              <span>{isFr ? 'Résilience des sols' : 'Volcanic Soil Care'}</span>
            </div>
            <p className="mt-1 text-[11px] text-stone-600 dark:text-stone-400">
              {isFr
                ? 'Protection des andosols acides (pH 5.4) et optimisation des rotations fixatrices d\'azote.'
                : 'Preserving Buea\'s acidic andosols (pH 5.4) through nitrogen-fixing pulses and slope stabilization.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Methodology & Satellite Telemetry Section (Lives here in Settings!) */}
      <Card id="methodology">
        <MethodologyTelemetry />
      </Card>

      {/* Preferences & Units */}
      <Card>
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">{isFr ? 'Affichage & Unités' : 'Appearance and units'}</h2>
        <div className="divide-y divide-[#E3D9CC]/60 dark:divide-white/10">
          <Row title={isFr ? 'Mode sombre' : 'Dark mode'} hint={isFr ? 'Plus reposant pour les yeux au champ.' : 'Easier on the eyes outdoors.'}>
            <div className="flex items-center gap-2 sm:justify-end">
              <Moon size={16} weight="bold" className="text-stone-500" />
              <Toggle checked={theme === 'dark'} onChange={toggleTheme} label="Dark mode" />
            </div>
          </Row>
          <Row title={isFr ? 'Unités de pluie' : 'Rainfall units'}>
            <Tabs
              tabs={[{ value: 'mm', label: 'Millimetres (mm)' }, { value: 'in', label: 'Inches (in)' }]}
              value={settings.units}
              onChange={(v) => updateSettings({ units: v })}
              label="Rainfall units"
            />
          </Row>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">{isFr ? 'Alertes & Notifications' : 'Notifications'}</h2>
        <ul className="divide-y divide-[#E3D9CC]/60 dark:divide-white/10">
          {NOTIFY.map(([key, title, hint]) => (
            <li key={key} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-semibold text-xs text-stone-800 dark:text-stone-200">{title}</p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">{hint}</p>
              </div>
              <Toggle checked={settings.notify[key]} onChange={(v) => updateSettings({ notify: { ...settings.notify, [key]: v } })} label={title} />
            </li>
          ))}
        </ul>
      </Card>

      {/* Data Reset */}
      <Card>
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">{isFr ? 'Données & Réinitialisation' : 'Data'}</h2>
        <Row title={isFr ? 'Réinitialiser les données' : 'Reset demo data'} hint={isFr ? 'Efface les favoris et paramètres sauvegardés.' : 'Clears saved favourites, plans and cache.'}>
          <Button variant="secondary" icon={ArrowClockwise} onClick={() => setConfirmReset(true)} className="w-full">
            {isFr ? 'Réinitialiser' : 'Reset'}
          </Button>
        </Row>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title={isFr ? 'Réinitialiser les données locales ?' : 'Reset demo data?'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmReset(false)}>{isFr ? 'Annuler' : 'Cancel'}</Button>
            <Button variant="danger" onClick={() => { resetAll(); setConfirmReset(false); }}>{isFr ? 'Confirmer la réinitialisation' : 'Reset data'}</Button>
          </>
        }
      >
        <p className="text-xs text-stone-600 dark:text-stone-300">
          {isFr
            ? 'Cette action réinitialise les paramètres et favoris sur cet appareil.'
            : 'This removes your saved favourites, applied rotation plans, and preferences on this device.'}
        </p>
      </Modal>
    </div>
  );
}
