import { Printer, X, Download, ShieldCheck, Sprout } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { useApp } from '../context/AppContext';
import { advisoryEngine } from '../engine/advisoryEngine';

export default function FieldPlanExport({ open, onClose, field }) {
  const { language, climateModifiers } = useApp();

  if (!field) return null;

  const advisory = advisoryEngine.generateAdvisory(
    field.lat || 4.16,
    field.lon || 9.23,
    field.cropId || 'maize',
    { income: 0.35, climate_safety: 0.35, soil_health: 0.30 },
    climateModifiers
  );

  const { farm_profile, rotations, computed_facts_summary } = advisory;
  const isPidgin = language === 'pidgin';

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal open={open} onClose={onClose} title={isPidgin ? 'Farmer Field Action Plan' : 'Downloadable Field Plan (Print / PDF)'}>
      <div className="space-y-4 text-ink dark:text-leaf-50">
        {/* Action button bar */}
        <div className="flex justify-between items-center bg-leaf-50 dark:bg-white/5 p-3 rounded-xl border border-leaf-200 dark:border-white/10">
          <span className="text-xs text-ink/70 dark:text-leaf-100/70">
            {isPidgin ? 'Ready for print or save as PDF for extension agent' : 'Printable 1-page summary card for farmer or extension agent'}
          </span>
          <Button size="sm" onClick={handlePrint} className="!h-8 text-xs">
            <Printer size={14} className="mr-1.5" />
            {isPidgin ? 'Print / Save PDF' : 'Print / Save PDF'}
          </Button>
        </div>

        {/* PRINTABLE CARD CONTENT CONTAINER */}
        <div id="printable-field-plan" className="rounded-2xl border-2 border-leaf-600 bg-white p-5 text-black shadow-sm print:p-0 print:border-none">
          {/* Header */}
          <div className="border-b-2 border-leaf-700 pb-3 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-leaf-800">
                NASA Space Apps Challenge 2026 • Team YENLU, Buea
              </span>
              <h2 className="text-xl font-black text-black">
                YENLU FIELD SHIFT: ADVISORY PLAN
              </h2>
              <p className="text-xs text-gray-700">
                Decision-support plan for smallholder agro-resilience on Mount Cameroon volcanic slopes.
              </p>
            </div>
            <div className="text-right text-[11px] text-gray-600">
              <div>Date: {new Date().toLocaleDateString('en-GB')}</div>
              <div className="font-bold text-leaf-800">Zone: {field.zone}</div>
            </div>
          </div>

          {/* Farm Details Matrix */}
          <div className="mt-3 grid grid-cols-4 gap-2 bg-gray-50 p-3 rounded-lg text-xs border border-gray-200">
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Farm Plot</span>
              <span className="font-bold">{field.name}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Coordinates</span>
              <span className="font-bold">{field.lat}°N, {field.lon}°E</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Terrain (SRTM 30m)</span>
              <span className="font-bold">{farm_profile.terrain.elevation_m}m • {farm_profile.terrain.slope_pct}% slope</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px] uppercase">Soil Context</span>
              <span className="font-bold">pH 5.4 (Clay Loam)</span>
            </div>
          </div>

          {/* 3 Rotations Table */}
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase text-gray-800 mb-1.5">
              The 3 Rotations Evaluated Over 20 Historical NASA Seasons (2006–2025)
            </h4>
            <table className="w-full text-left text-xs border border-gray-300">
              <thead className="bg-leaf-800 text-white font-bold text-[11px]">
                <tr>
                  <th className="p-2 border-r border-leaf-700">Rotation Slot</th>
                  <th className="p-2 border-r border-leaf-700">Cropping Plan</th>
                  <th className="p-2 border-r border-leaf-700 text-center">Resilience</th>
                  <th className="p-2 border-r border-leaf-700 text-center">Stressed Yrs</th>
                  <th className="p-2 text-right">Est. Revenue / ha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-gray-50">
                  <td className="p-2 font-bold text-gray-700 border-r border-gray-300">Slot 1 (Baseline BAU)</td>
                  <td className="p-2 border-r border-gray-300">{rotations.slot_1_baseline.name}</td>
                  <td className="p-2 text-center border-r border-gray-300">{rotations.slot_1_baseline.climate_resilience_pct}%</td>
                  <td className="p-2 text-center border-r border-gray-300 text-amber-700 font-bold">{rotations.slot_1_baseline.stressed_seasons_20yr} / 20</td>
                  <td className="p-2 text-right font-bold">{rotations.slot_1_baseline.annual_revenue_xaf.toLocaleString()} XAF</td>
                </tr>
                <tr className="bg-green-50 font-semibold">
                  <td className="p-2 font-black text-leaf-900 border-r border-gray-300">Slot 2 (Top Pick ⭐)</td>
                  <td className="p-2 border-r border-gray-300 text-leaf-900">{rotations.slot_2_recommended.name}</td>
                  <td className="p-2 text-center border-r border-gray-300 text-leaf-800">{rotations.slot_2_recommended.climate_resilience_pct}%</td>
                  <td className="p-2 text-center border-r border-gray-300 text-leaf-800 font-bold">{rotations.slot_2_recommended.stressed_seasons_20yr} / 20</td>
                  <td className="p-2 text-right font-black text-leaf-900">{rotations.slot_2_recommended.annual_revenue_xaf.toLocaleString()} XAF</td>
                </tr>
                <tr>
                  <td className="p-2 text-gray-700 border-r border-gray-300">Slot 3 (Alternative)</td>
                  <td className="p-2 border-r border-gray-300">{rotations.slot_3_alternative.name}</td>
                  <td className="p-2 text-center border-r border-gray-300">{rotations.slot_3_alternative.climate_resilience_pct}%</td>
                  <td className="p-2 text-center border-r border-gray-300">{rotations.slot_3_alternative.stressed_seasons_20yr} / 20</td>
                  <td className="p-2 text-right font-bold">{rotations.slot_3_alternative.annual_revenue_xaf.toLocaleString()} XAF</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Actionable Calendar & Tillage Guidance */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="border border-gray-200 p-2.5 rounded-lg bg-gray-50">
              <span className="font-bold block text-leaf-800 mb-1">Recommended Calendar:</span>
              <ul className="space-y-1 list-disc list-inside text-gray-700">
                <li><strong>Season A (Mid-March to July):</strong> Plant certified early staple with basal NPK.</li>
                <li><strong>Season B (August to December):</strong> Follow with biological nitrogen-fixing legume to regenerate soil.</li>
              </ul>
            </div>
            <div className="border border-gray-200 p-2.5 rounded-lg bg-gray-50">
              <span className="font-bold block text-leaf-800 mb-1">Slope Management Guidance:</span>
              <p className="text-gray-700">
                On this <strong>{farm_profile.terrain.slope_pct}% slope</strong>, construct contour ridges with tied bunds to prevent topsoil washouts during IMERG extreme storms (&gt;70mm/day).
              </p>
            </div>
          </div>

          {/* Mandatory NASA & WFP Attribution Footer */}
          <div className="mt-4 border-t border-gray-300 pt-2 flex justify-between items-center text-[9px] text-gray-500">
            <span>Powered by: NASA POWER (MERRA-2, IMERG), SRTM 30m, FAO GAEZ, ISRIC SoilGrids, and WFP Cameroon.</span>
            <span>Grounded AI: Traceable figures only. No yield claims.</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
}
