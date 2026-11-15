import { useState } from 'react';
import { CheckCircle, DownloadSimple, FileText, MapPin, Printer, ShieldWarning, X } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';

export default function FieldPlanExportModal({ activeField, activeRotation }) {
  const { language, settings } = useApp();
  const isFr = language === 'fr';

  const [isOpen, setIsOpen] = useState(false);

  const defaultRotation = {
    code: 'Option B (Recommended)',
    crops: isFr ? 'Sorgho → Arachide' : 'Sorghum → Groundnut',
    season1: isFr ? 'Avril – Juillet (Saison des pluies A)' : 'April – July (Wet Season A)',
    season2: isFr ? 'Août – Novembre (Saison des pluies B)' : 'August – November (Wet Season B)',
    resilience: '89% (Very High)',
    expectedRevenue: '1,120,000 FCFA / ha',
    safeguards: isFr
      ? ['Créer des billons de 25 cm sur les pentes > 15% pour éviter l\'érosion', 'Semer l\'arachide pour fixer environ 45 kg d\'azote organique/ha']
      : ['Construct 25cm contour ridges on slopes > 15% to stop runoff', 'Plant groundnut as second cycle to fix ~45 kg organic N/ha']
  };

  const plan = activeRotation || defaultRotation;
  const fieldName = activeField?.name || settings?.location || 'Buea Demonstration Plot';

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Prominent Call-To-Action Banner / Button */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#184A2C] via-[#1E5E3A] to-[#123821] p-5 text-white shadow-md border border-[#276F46]">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-leaf-100 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F8D063]" />
              <span>{isFr ? 'Fiche de campagne pratique' : 'Actionable Agronomic Advisory'}</span>
            </div>
            <h3 className="mt-2 font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">
              {isFr ? 'Prêt pour le champ ? Exportez votre plan' : 'Field-Ready Decision Support'}
            </h3>
            <p className="mt-1 text-xs text-leaf-100/80 leading-relaxed">
              {isFr
                ? 'Générez une fiche pratique d\'une page, spécialement allégée pour les téléphones en zone rurale sans connexion stable.'
                : 'Generate a compact one-page farm plan with telemetry facts, planting dates, and slope erosion safeguards.'}
            </p>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="group flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#FAF5EE] px-5 py-3 text-sm font-bold text-[#184A2C] shadow-lg transition hover:bg-white active:scale-95"
            >
              <DownloadSimple size={18} weight="bold" className="transition-transform group-hover:-translate-y-0.5" />
              <span>{isFr ? 'Exporter le plan de champ (PDF)' : 'Export One-Page Field Plan (PDF)'}</span>
            </button>
            <span className="text-[11px] font-medium text-leaf-200/90">
              {isFr ? 'Optimisé pour bas débit (moins de 50 Ko)' : 'Optimized for low-bandwidth field use (< 50 KB)'}
            </span>
          </div>
        </div>
      </div>

      {/* Printable One-Page Modal Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/70 backdrop-blur-sm animate-fade">
          <div className="relative flex max-h-[95vh] w-full max-w-2xl flex-col rounded-3xl bg-[#FAF5EE] p-6 shadow-2xl overflow-y-auto dark:bg-[#1A120E] dark:text-[#F5EFEB] border border-[#E3D9CC] dark:border-white/10">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E3D9CC] pb-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#184A2C] text-white">
                  <FileText size={22} weight="bold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                    {isFr ? 'Plan de culture agronomique YENLU' : 'YENLU One-Page Field Plan'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {isFr ? 'Fiche officielle imprimable • 1 Page A4' : 'Official Printable Farmer Sheet • Compact 1-Page Format'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full text-stone-400 hover:bg-[#EDE5DA] dark:hover:bg-white/10"
              >
                <X size={20} weight="bold" />
              </button>
            </div>

            {/* Document Content */}
            <div className="mt-4 space-y-4 text-xs text-stone-700 dark:text-stone-300">
              {/* Farm metadata row */}
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-white p-3.5 border border-[#E3D9CC] dark:bg-white/5 dark:border-white/5">
                <div>
                  <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] block">
                    {isFr ? 'Localisation de l\'exploitation' : 'Field / Location'}
                  </span>
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1 mt-0.5">
                    <MapPin size={14} weight="fill" className="text-[#184A2C] dark:text-[#A3E3B5]" />
                    {fieldName} (Buea, Cameroon)
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px] block">
                    {isFr ? 'Profil pédoclimatique' : 'Soil & Slope Profile'}
                  </span>
                  <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                    Volcanic Andosol (pH 5.4) • 12% Slope
                  </span>
                </div>
              </div>

              {/* Recommended Rotation Sequence */}
              <div className="rounded-xl border border-[#184A2C]/20 bg-[#184A2C]/5 p-4 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#184A2C] dark:text-[#A3E3B5]">
                    {isFr ? 'Séquence culturale recommandée' : 'Recommended Crop Sequence'}
                  </span>
                  <span className="rounded-full bg-[#FDF3D8] border border-[#E0B238] px-2 py-0.5 text-[10px] font-bold text-[#8A5A0A]">
                    Ranked #1
                  </span>
                </div>
                <div className="mt-2 font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                  {plan.crops}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#184A2C]/10 pt-2.5">
                  <div>
                    <span className="text-[10px] font-medium text-stone-500 block">
                      {isFr ? 'Saison 1 (Cycle précoce)' : 'Cycle 1 (Early Season)'}
                    </span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {plan.season1}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-stone-500 block">
                      {isFr ? 'Saison 2 (Cycle tardif)' : 'Cycle 2 (Late Season)'}
                    </span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      {plan.season2}
                    </span>
                  </div>
                </div>
              </div>

              {/* Agronomic Safeguards */}
              <div className="rounded-xl border border-[#E3D9CC] bg-white p-3.5 dark:bg-white/5 dark:border-white/10">
                <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mb-2">
                  <ShieldWarning size={16} weight="bold" className="text-[#C68A2C]" />
                  <span>{isFr ? 'Consignes de gestion du ruissellement & des sols' : 'Critical Slope & Soil Safeguards'}</span>
                </h4>
                <ul className="space-y-1.5">
                  {plan.safeguards.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle size={14} weight="fill" className="shrink-0 mt-0.5 text-[#184A2C] dark:text-[#A3E3B5]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Provenance Footer */}
              <div className="flex items-center justify-between border-t border-[#E3D9CC] pt-3 text-[10px] text-stone-500 dark:border-white/10 dark:text-stone-400">
                <span>NASA POWER (IMERG) • NASA SMAP L4 • ISRIC SoilGrids</span>
                <span>{new Date().toLocaleDateString(isFr ? 'fr-FR' : 'en-GB')}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#E3D9CC] pt-4 dark:border-white/10">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-[#EDE5DA] dark:text-stone-300 dark:hover:bg-white/10"
              >
                {isFr ? 'Fermer' : 'Close'}
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl bg-[#184A2C] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#123821] transition"
              >
                <Printer size={16} weight="bold" />
                <span>{isFr ? 'Imprimer / Sauvegarder PDF' : 'Print / Save as PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
