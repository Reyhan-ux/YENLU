import { Database, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MethodologyTelemetry() {
  const { language } = useApp();
  const isFr = language === 'fr';

  const telemetrySources = [
    {
      id: 'modis',
      sourceName: 'NASA MODIS & VIIRS',
      subtext: 'Terra & Aqua Satellites (250m–1km)',
      category: isFr ? 'Indices de végétation' : 'Vegetation Indices',
      indicator: 'NDVI & Canopy Vigor',
      status: isFr ? 'Couverture décennale active' : 'Active · 10-Day Composites',
      description: isFr
        ? 'Fournit les profils phénologiques (NDVI/EVI) et la vigueur foliaire pour calibrer les stades critiques de croissance des cultures sur les flancs du Mont Cameroun.'
        : 'Supplies Normalized Difference Vegetation Index (NDVI) and greenness curves to verify historical crop vigor, vegetative health transitions, and true field planting dates.',
      parameters: ['NDVI (MOD13Q1)', 'EVI (Enhanced Vegetation)', 'Land Cover (MCD12Q1)']
    },
    {
      id: 'power',
      sourceName: 'NASA POWER Climatology',
      subtext: 'MERRA-2 & IMERG Telemetry (~10–50km)',
      category: isFr ? 'Paramètres climatiques' : 'Climate Parameters',
      indicator: 'Rainfall, Temp & Solar',
      status: isFr ? '20 ans rétro-testés · 7 305 jours' : '20-Yr Back-Tested · 7,305 Days',
      description: isFr
        ? 'Historique quotidien complet (2006–2025) des précipitations (IMERG), températures maximales et déficit de pression de vapeur pour évaluer les risques d\'inondation et de ruissellement.'
        : 'Continuous daily meteorological telemetry (2006–2025) tracking extreme rainfall deluges (100+ mm/day), temperature lapse rates, and historical planting window reliability on volcanic slopes.',
      parameters: ['PRECTOTCORR (MERRA-2)', 'IMERG_PRECTOT (GPM)', 'T2M_MAX & EVPTRNS']
    },
    {
      id: 'smap',
      sourceName: 'NASA SMAP & SoilGrids',
      subtext: 'L4 Radiometer / Radar + ISRIC 250m',
      category: isFr ? 'Humidité & Sol' : 'Soil Wetness Telemetry',
      indicator: 'Root-Zone Saturation & pH',
      status: isFr ? 'Horizons 0–5cm & 0–100cm' : 'Root Horizons 0–5cm & 0–100cm',
      description: isFr
        ? 'Mesure la saturation en eau de la zone racinaire pour prévenir l\'asphyxie racinaire et analyse les sols volcaniques acides de Buea (pH 5.4, 7.9% de carbone organique).'
        : 'Monitors root-zone soil wetness saturation (GWETROOT) to avert root rot, calibrated alongside Buea\'s volcanic andosol chemistry (pH 5.4, 7.9% Soil Organic Carbon).',
      parameters: ['GWETROOT (0–100 cm)', 'GWETTOP (0–5 cm Surface)', 'SoilGrids pH & Texture']
    }
  ];

  return (
    <section aria-label="Methodology and Earth Observation Data Sources" className="w-full">
      <div className="mb-4 flex flex-col justify-between gap-1 sm:flex-row sm:items-end border-b border-ink/10 pb-3 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#184A2C] text-white dark:bg-[#A3E3B5] dark:text-[#0F2A1D]">
              <Database size={15} />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-leaf-50 sm:text-2xl font-sans">
              {isFr ? 'Méthodologie et Télémétrie Spatiale NASA' : 'Telemetry Inputs & Satellite Methodology'}
            </h2>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-leaf-100/60 font-sans">
            {isFr
              ? 'Comment les données d\'observation de la Terre alimentent les conseils agronomiques de YENLU.'
              : 'How NASA Earth observations, precipitation radar, and volcanic soil telemetry power our grounded rotations.'}
          </p>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-leaf-100/40">
          {isFr ? 'Données scientifiques ouvertes vérifiables' : 'Transparent, verifiable scientific inputs'}
        </span>
      </div>

      {/* Stacked Telemetry Cards for Visual Balance */}
      <div className="flex flex-col gap-4">
        {telemetrySources.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-stone-200/90 bg-[#FAF5EE] p-5 shadow-xs transition hover:border-[#184A2C]/50 hover:shadow-md dark:border-white/10 dark:bg-[#1A120E] sm:p-6"
          >
            <div>
              {/* Category & Clean Status Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#184A2C] dark:text-[#A3E3B5]">
                    {item.category}
                  </span>
                  <span className="text-stone-300 dark:text-white/20">•</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {item.subtext}
                  </span>
                </div>

                {/* Clean, high-precision technical status tag (No cartoon pills) */}
                <div className="inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{item.status}</span>
                </div>
              </div>

              {/* Source Name & Sensor */}
              <h3 className="mt-2.5 text-lg font-bold text-stone-900 dark:text-stone-100 sm:text-xl font-sans">
                {item.sourceName}
              </h3>

              {/* Explanatory Description */}
              <p className="mt-2 text-xs leading-relaxed text-stone-600 dark:text-stone-300 sm:text-sm font-sans">
                {item.description}
              </p>
            </div>

            {/* Telemetry Parameter Pills & Tooltip Hint */}
            <div className="mt-4 border-t border-stone-200/70 dark:border-white/10 pt-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">
                <span>{isFr ? 'Paramètres ingérés :' : 'Ingested telemetry parameters:'}</span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[#184A2C] dark:text-[#A3E3B5]">
                  <Info size={12} />
                  {item.indicator}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.parameters.map((param, i) => (
                  <span
                    key={i}
                    className="rounded-md bg-white px-2.5 py-1 font-mono text-[11px] font-medium text-stone-700 border border-stone-200 dark:border-white/10 dark:bg-white/10 dark:text-stone-200"
                  >
                    {param}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
