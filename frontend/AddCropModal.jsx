import { useState } from 'react';
import { PlusCircle, CheckCircle, Sprout, DollarSign, Mountain } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import Badge from './Badge';
import { advisoryEngine } from '../engine/advisoryEngine';
import { useApp } from '../context/AppContext';

export default function AddCropModal({ open, onClose, onCropAdded }) {
  const { language, setCustomCrops } = useApp();

  const [form, setForm] = useState({
    crop_id: '',
    common_name: '',
    local_name: '',
    category: 'Vegetable',
    duration_days_min: 90,
    waterlogging_tolerance: 'Moderate',
    preferred_elevation_min_m: 400,
    preferred_elevation_max_m: 1300,
    max_slope_pct: 20,
    nitrogen_fixing: false,
    price_xaf_kg: 600,
    typical_yield_kg_ha: 6000
  });

  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.common_name.trim()) return;

    const cropId = form.crop_id.trim() || form.common_name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const profile = {
      ...form,
      crop_id: cropId,
      duration_days_min: Number(form.duration_days_min),
      duration_days_max: Number(form.duration_days_min) + 20,
      price_xaf_kg: Number(form.price_xaf_kg),
      typical_yield_kg_ha: Number(form.typical_yield_kg_ha)
    };

    const res = advisoryEngine.addCustomCrop(profile);
    setCustomCrops((prev) => [...prev, res.crop]);
    setSuccess(res);

    if (onCropAdded) onCropAdded(res);

    setTimeout(() => {
      setSuccess(null);
      onClose();
    }, 1800);
  };

  const estRevenue = Math.round((Number(form.price_xaf_kg) || 0) * (Number(form.typical_yield_kg_ha) || 0));

  return (
    <Modal open={open} onClose={onClose} title={language === 'pidgin' ? 'Add New Crop Make Model Test Am' : 'Live "Add-a-Crop" Simulator'}>
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-leaf-100 text-leaf-800 dark:bg-leaf-900/60 dark:text-leaf-300">
            <CheckCircle size={32} />
          </div>
          <h4 className="text-lg font-bold text-ink dark:text-leaf-50">
            {language === 'pidgin' ? 'Crop Added Sharp-Sharp!' : 'Crop Successfully Ingested!'}
          </h4>
          <p className="text-xs text-ink/70 dark:text-leaf-100/70 max-w-sm mx-auto">
            {language === 'pidgin'
              ? `Model don evaluate ${success.crop.common_name} with 20-year NASA rain data and slot am inside rotation.`
              : `Model simulated ${success.crop.common_name} across 7,305 NASA Earth Observation days and benchmarked rotation rankings.`}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-ink/70 dark:text-leaf-100/70">
            {language === 'pidgin' 
              ? 'Test any special crop (like Ginger, Egusi, Cocoa, Garlic) live on stage. The model go calculate income and rain risk immediately.'
              : 'Add any custom or niche crop profile to test universal model generalizability live. The client engine computes 20-year back-test scores in < 5ms.'}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-ink/80 dark:text-leaf-100">Crop Common Name *</label>
              <input
                type="text"
                name="common_name"
                required
                placeholder="e.g. Ginger, Egusi, Cocoa"
                value={form.common_name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-xs text-ink shadow-sm focus:border-leaf-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-leaf-50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/80 dark:text-leaf-100">Local / Pidgin Name</label>
              <input
                type="text"
                name="local_name"
                placeholder="e.g. Djia, Egusi melon"
                value={form.local_name}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-xs text-ink shadow-sm focus:border-leaf-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-leaf-50"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-ink/80 dark:text-leaf-100">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-xs text-ink shadow-sm focus:border-leaf-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-leaf-50"
              >
                <option value="Vegetable">Vegetable</option>
                <option value="Legume">Legume</option>
                <option value="Cereal">Cereal</option>
                <option value="Root/Tuber">Root/Tuber</option>
                <option value="Spices / Cash Crop">Spices / Cash Crop</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/80 dark:text-leaf-100">Duration (Days)</label>
              <input
                type="number"
                name="duration_days_min"
                min="30"
                max="365"
                value={form.duration_days_min}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-xs text-ink shadow-sm focus:border-leaf-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-leaf-50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/80 dark:text-leaf-100">Waterlogging Tolerance</label>
              <select
                name="waterlogging_tolerance"
                value={form.waterlogging_tolerance}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-xs text-ink shadow-sm focus:border-leaf-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-leaf-50"
              >
                <option value="Low">Low (Sensitive)</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High (Wet tolerant)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-ink/80 dark:text-leaf-100">Local Market Price (XAF / kg)</label>
              <input
                type="number"
                name="price_xaf_kg"
                min="50"
                max="10000"
                value={form.price_xaf_kg}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-xs text-ink shadow-sm focus:border-leaf-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-leaf-50"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink/80 dark:text-leaf-100">Typical Yield (kg / ha)</label>
              <input
                type="number"
                name="typical_yield_kg_ha"
                min="500"
                max="50000"
                value={form.typical_yield_kg_ha}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 text-xs text-ink shadow-sm focus:border-leaf-500 focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-leaf-50"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-leaf-50/70 p-2.5 text-xs text-ink/80 dark:bg-white/5 dark:text-leaf-100">
            <input
              type="checkbox"
              id="nitrogen_fixing"
              name="nitrogen_fixing"
              checked={form.nitrogen_fixing}
              onChange={handleChange}
              className="h-4 w-4 rounded text-leaf-600 focus:ring-leaf-500"
            />
            <label htmlFor="nitrogen_fixing" className="cursor-pointer">
              {language === 'pidgin' ? 'Dis crop dey fix biological nitrogen for ground (+35 soil score)' : 'Nitrogen-fixing legume (Adds +35 soil health points)'}
            </label>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-leaf-100/60 p-3 text-xs dark:bg-leaf-900/40">
            <span className="text-ink/70 dark:text-leaf-200">
              {language === 'pidgin' ? 'Estimated Total Revenue:' : 'Projected Gross Revenue / ha:'}
            </span>
            <span className="font-bold text-ink dark:text-leaf-50">
              {estRevenue.toLocaleString()} XAF / ha
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              {language === 'pidgin' ? 'Cancel' : 'Cancel'}
            </Button>
            <Button type="submit">
              <Sprout size={14} className="mr-1.5" />
              {language === 'pidgin' ? 'Simulate & Rank Crop' : 'Simulate & Rank Crop'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
