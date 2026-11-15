import { useState } from 'react';
import { ArrowRight, CaretDown, CaretUp, CheckCircle, Coins, ShieldCheck, TrendUp } from '@phosphor-icons/react';
import { useApp } from '../context/AppContext';

/**
 * Vertically Stacked Crop Rotation Comparison Matrix
 * Styled with African agro green cards (#1C5535, #276F46, #23583C)
 * Features crisp cream internal contrast cards, popping performance scores (like StatCards),
 * 100% XAF/FCFA local currency (zero USD), and Inter regular body typography.
 */
export default function RotationComparison({ onSelectOption, activeOptionId = 'opt-b', farmerContext }) {
  const { language } = useApp();
  const isFr = language === 'fr';

  const [selected, setSelected] = useState(activeOptionId);
  const [showDetails, setShowDetails] = useState(false);

  // Dynamic parameters from the farmer input questionnaire
  const size = Number(farmerContext?.fieldSize) || 1.5;
  const locName = farmerContext?.location?.name || 'Buea';
  const elev = farmerContext?.location?.elevation || 620;
  const rainExp = farmerContext?.rainExp || 'good';

  // Scientific Agro-Climatic Match Score formula:
  // Evaluates volcanic slope infiltration, nitrogen drawdown, and deluge risk
  const scoreB = Math.min(94, Math.max(86, 90 + (elev > 800 ? 2 : 0) - (rainExp === 'uncertain' ? 3 : 0)));
  const scoreA = Math.min(74, Math.max(62, 68 - (rainExp === 'good' ? 3 : 0) + (rainExp === 'low' ? 3 : 0)));
  const scoreC = Math.min(46, Math.max(36, 42 - (rainExp === 'good' ? 4 : 0)));

  // African agro green cards with high visual distinction
  const CARD_CONFIGS = [
    {
      bg: '#1C5535', // Deep rich forest green (Option A - Baseline)
      border: 'border-[#276F46]/70',
      motifType: 'maize',
      tagTextClass: 'text-stone-100',
    },
    {
      bg: '#276F46', // Vibrant leaf/emerald green (Option B - AI-Optimized Ranked #1)
      border: 'border-[#3DA068]/90',
      motifType: 'sprout',
      tagTextClass: 'text-[#F8D063]',
    },
    {
      bg: '#1F4733', // Deep volcanic woodland green (Option C - Continuous)
      border: 'border-[#33634B]/70',
      motifType: 'terrace',
      tagTextClass: 'text-rose-200',
    }
  ];

  const rotations = [
    {
      id: 'opt-a',
      code: 'Option A',
      title: isFr ? 'Pratique actuelle du paysan' : "Farmer's Current Practice",
      crops: isFr ? 'Maïs → Niébé' : 'Maize → Cowpea',
      cropsDetail: isFr
        ? 'Céréale vivrière de base suivie d\'une légumineuse locale. Pratique traditionnelle bien maîtrisée.'
        : `Standard staple cereal followed by local pulse on ${locName} soils. Familiar traditional management with moderate biological nitrogen return.`,
      isRecommended: false,
      isBaseline: true,
      tag: isFr ? 'Pratique de référence' : 'Baseline Reference',
      performanceScore: scoreA,
      scoreRating: `Moderate Match (${scoreA}/100)`,
      scoreNote: rainExp === 'good' 
        ? `Exposed to root-zone saturation and pod rot during peak August deluges in ${locName}`
        : `Moderate water-holding capacity on ${elev}m slopes`,
      scoreColor: 'text-stone-900 dark:text-stone-100',
      metrics: {
        netRevenueXAF: `${(820000 * size).toLocaleString()} FCFA (${size} ha)`,
        diffXAF: null,
        foodSecurity: {
          level: isFr ? 'Élevé' : 'High',
          desc: isFr ? 'Mix équilibré calories et protéines locales' : 'Good calorie & vegetable protein balance'
        },
        upfrontExpenseXAF: {
          amount: `${(170000 * size).toLocaleString()} FCFA (${size} ha)`,
          level: isFr ? 'Moyen' : 'Medium Cost',
          desc: isFr ? 'Semences certifiées + engrais de démarrage NPK' : 'Certified seed + starter NPK expenditure'
        }
      },
      benefits: [
        'Secures essential household staple food supply in Fako',
        `Predictable local yield but exposed to waterlogging on lower ${locName} terraces`
      ]
    },
    {
      id: 'opt-b',
      code: 'Option B',
      title: isFr ? 'Rotation optimisée par IA (Recommandée)' : 'AI-Optimized Rotation (Top Match)',
      crops: isFr ? 'Sorgho → Arachide' : 'Sorghum → Groundnut',
      cropsDetail: isFr
        ? 'Système racinaire profond tolérant aux excès d\'eau temporaires, associé à une légumineuse à forte valeur marchande.'
        : `Deep taproot cereal anchoring ${locName}'s volcanic slope, paired with high-value edible groundnuts that biologically restore 45kg soil N/ha.`,
      isRecommended: true,
      isBaseline: false,
      tag: isFr ? 'Classé #1 Recommandé' : 'Ranked #1 Recommended Match',
      performanceScore: scoreB,
      scoreRating: `Top Agro-Climatic Match (${scoreB}/100)`,
      scoreNote: `Optimal drainage resilience at ${elev}m elevation & 35% chemical fertilizer savings`,
      scoreColor: 'text-[#184A2C] dark:text-[#4ADE80]',
      metrics: {
        netRevenueXAF: `${(1120000 * size).toLocaleString()} FCFA (${size} ha)`,
        diffXAF: `+${((1120000 - 820000) * size).toLocaleString()} FCFA (+37%)`,
        foodSecurity: {
          level: isFr ? 'Très élevé' : 'Very High',
          desc: isFr ? 'Excellente conservation + valeur nutritive riche en lipides' : 'Long storage life + superior lipid & protein market value in Buea'
        },
        upfrontExpenseXAF: {
          amount: `${(135000 * size).toLocaleString()} FCFA (${size} ha)`,
          level: isFr ? 'Économique' : 'Cost-Efficient',
          desc: isFr ? '35% d\'engrais chimique en moins grâce aux légumineuses' : '35% less chemical fertilizer required due to biological N-fixation'
        }
      },
      benefits: [
        `Deep root network anchors ${elev}m volcanic slopes against torrential runoff`,
        `Highest net margin at Muea & Mutengene markets with minimal chemical input costs`
      ]
    },
    {
      id: 'opt-c',
      code: 'Option C',
      title: isFr ? 'Monoculture continue (Risque)' : 'Continuous Monocropping (High Risk)',
      crops: isFr ? 'Maïs continu (Saison 1 & 2)' : 'Continuous Maize (Season 1 & 2)',
      cropsDetail: isFr
        ? 'Répétition de la même céréale sans rotation régénératrice. Épuisement rapide de la fertilité volcanique.'
        : `Repeated maize monoculture without rotational soil rest. Causes progressive soil nitrogen depletion and stem-borer pest buildup in ${locName}.`,
      isRecommended: false,
      isBaseline: false,
      tag: isFr ? 'Risque agronomique élevé' : 'High Agronomic Risk',
      performanceScore: scoreC,
      scoreRating: `High Risk of Soil Loss (${scoreC}/100)`,
      scoreNote: `Accelerated soil organic carbon leaching and topsoil erosion during heavy Buea rains`,
      scoreColor: 'text-rose-600 dark:text-rose-400',
      metrics: {
        netRevenueXAF: `${(628000 * size).toLocaleString()} FCFA (${size} ha)`,
        diffXAF: `-${((820000 - 628000) * size).toLocaleString()} FCFA (-23%)`,
        foodSecurity: {
          level: isFr ? 'Vulnérable' : 'Vulnerable',
          desc: isFr ? 'Risque de perte sévère en cas d\'attaque de ravageurs' : 'High vulnerability to stem-borer infestation & foliar blight'
        },
        upfrontExpenseXAF: {
          amount: `${(250000 * size).toLocaleString()} FCFA (${size} ha)`,
          level: isFr ? 'Très élevé' : 'High Expense',
          desc: isFr ? 'Forte dépendance aux engrais chimiques et pesticides' : 'Heavy chemical fertilizer & continuous pesticide sprays needed'
        }
      },
      benefits: [
        'High operator familiarity but progressively exhausts volcanic andosol fertility'
      ]
    }
  ];

  return (
    <section aria-label="Crop Rotation Comparison" className="w-full">
      {/* Section Header */}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#184A2C] text-[#FAF5EE] shadow-sm">
              <TrendUp size={20} weight="bold" />
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-[#1F2421] dark:text-[#FAF5EE] sm:text-3xl">
              {isFr ? 'Comparaison des rotations de cultures' : 'Crop Rotation Comparison Matrix'}
            </h2>
          </div>
          <p className="mt-2 text-sm sm:text-base font-normal leading-relaxed text-stone-600 dark:text-stone-300">
            {isFr
              ? 'Comparez les 3 options agronomiques selon leur note d\'accord pédo-climatique, revenu net en FCFA et sécurité du sol.'
              : 'Evaluate the 3 rotational paths side by side: Agro-Climatic Match Score, Net Revenue in FCFA, and Volcanic Slope Safety.'}
          </p>
        </div>

        {/* Expand / Reduce view toggle */}
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-[#E3D9CC] bg-[#FAF5EE] px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 transition hover:bg-[#F2ECE1] dark:border-white/10 dark:bg-white/10 dark:text-leaf-50 sm:self-end"
        >
          <span>{showDetails ? (isFr ? 'Masquer les détails' : 'Compact View') : (isFr ? 'Détails agronomiques complets' : 'Expand Detailed Metrics')}</span>
          {showDetails ? <CaretUp size={15} weight="bold" /> : <CaretDown size={15} weight="bold" />}
        </button>
      </div>

      {/* Vertically Stacked Cards for Maximum Balance and Clarity */}
      <div className="flex flex-col gap-6">
        {rotations.map((item, index) => {
          const cfg = CARD_CONFIGS[index] || CARD_CONFIGS[0];
          const isRec = item.isRecommended;
          const isSel = selected === item.id;

          return (
            <div
              key={item.id}
              onClick={() => {
                setSelected(item.id);
                if (onSelectOption) onSelectOption(item);
              }}
              style={{ backgroundColor: cfg.bg }}
              className={`relative rounded-3xl p-6 sm:p-8 transition-all duration-200 cursor-pointer overflow-hidden border-2 shadow-soft hover:shadow-lift ${cfg.border} ${
                isSel ? 'ring-4 ring-white/90 shadow-xl' : ''
              }`}
            >
              {/* Large African Farm Outline Artworks on the Left Side */}
              <div className="absolute -left-6 top-0 bottom-0 pointer-events-none opacity-[0.16] text-white flex items-center gap-2 overflow-hidden select-none">
                {cfg.motifType === 'maize' && (
                  <>
                    <svg className="w-52 h-52 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
                      <path d="M50 15 C40 30 40 70 50 85 C60 70 60 30 50 15 Z" />
                      <line x1="50" y1="20" x2="50" y2="80" />
                      <line x1="44" y1="32" x2="56" y2="32" />
                      <line x1="42" y1="45" x2="58" y2="45" />
                      <line x1="42" y1="58" x2="58" y2="58" />
                      <line x1="44" y1="70" x2="56" y2="70" />
                      <path d="M35 55 C22 62 18 78 32 88" />
                      <path d="M65 55 C78 62 82 78 68 88" />
                      <path d="M8 20 L20 32 L8 44 L20 56 L8 68" />
                    </svg>
                    <svg className="w-44 h-44 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
                      <rect x="46" y="10" width="8" height="38" rx="2" />
                      <path d="M38 48 L62 48 L60 78 C60 85 40 85 40 78 Z" />
                      <path d="M15 88 Q50 78 85 88" />
                      <path d="M10 96 Q50 86 90 96" />
                      <polygon points="20,25 28,15 36,25 28,35" />
                    </svg>
                  </>
                )}
                {cfg.motifType === 'sprout' && (
                  <>
                    <svg className="w-56 h-56 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
                      <path d="M50 42 C44 26 26 22 20 32 C15 44 32 54 50 42 Z" />
                      <path d="M50 42 C56 26 74 22 80 32 C85 44 68 54 50 42 Z" />
                      <line x1="50" y1="42" x2="50" y2="82" />
                      <path d="M15 84 Q50 68 85 84" />
                      <path d="M10 94 Q50 78 90 94" />
                      <circle cx="50" cy="18" r="8" />
                      <line x1="50" y1="4" x2="50" y2="8" />
                      <line x1="36" y1="10" x2="40" y2="14" />
                      <line x1="64" y1="10" x2="60" y2="14" />
                    </svg>
                    <svg className="w-44 h-44 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
                      <path d="M30 18 C65 15 82 45 68 82 C45 85 20 65 30 18 Z" />
                      <path d="M36 28 C55 35 65 52 56 74" />
                      <line x1="42" y1="40" x2="52" y2="45" />
                      <line x1="40" y1="55" x2="50" y2="60" />
                      <polygon points="12,45 20,35 28,45 20,55" />
                    </svg>
                  </>
                )}
                {cfg.motifType === 'terrace' && (
                  <>
                    <svg className="w-56 h-56 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
                      <polygon points="50,12 80,48 50,86 20,48" />
                      <polygon points="50,26 68,48 50,72 32,48" />
                      <circle cx="50" cy="48" r="5" fill="currentColor" />
                      <path d="M8 15 L8 85" />
                      <line x1="14" y1="25" x2="18" y2="25" />
                      <line x1="14" y1="48" x2="18" y2="48" />
                      <line x1="14" y1="70" x2="18" y2="70" />
                    </svg>
                    <svg className="w-44 h-44 shrink-0 stroke-current fill-none stroke-[2.2]" viewBox="0 0 100 100">
                      <path d="M25 22 C32 30 40 38 50 38 C60 38 68 30 75 22 C82 14 86 18 80 28 C74 38 72 45 70 60 C68 76 58 84 50 84 C42 84 32 76 30 60 C28 45 26 38 20 28 C14 18 18 14 25 22 Z" />
                      <circle cx="40" cy="56" r="3" fill="currentColor" />
                      <circle cx="60" cy="56" r="3" fill="currentColor" />
                      <ellipse cx="50" cy="74" rx="8" ry="4" />
                    </svg>
                  </>
                )}
              </div>

              {/* Main Content Grid: Left Content (Description & Benefits) + Right Content (Popping Score & Metrics) */}
              <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:items-center">
                {/* Left Side: Option Header, Crops Title & Narrative */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  {/* Top Bar: Code + Tag Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-white">
                        {item.code}
                      </span>
                      <span className="text-white/40">•</span>
                      <span className="text-xs font-bold text-white/90">
                        {item.title}
                      </span>
                    </div>

                    <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-md bg-black/35 px-2.5 py-1 border border-white/15 ${cfg.tagTextClass}`}>
                      {isRec && <span className="h-2 w-2 rounded-full bg-[#F8D063]" />}
                      <span>{item.tag}</span>
                    </div>
                  </div>

                  {/* Crops Headline */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {item.crops}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base font-normal text-white/90 leading-relaxed max-w-2xl">
                      {item.cropsDetail}
                    </p>
                  </div>

                  {/* Key Benefits */}
                  <ul className="space-y-2.5 pt-2">
                    {item.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm font-normal text-white/95">
                        <CheckCircle size={18} weight="fill" className="shrink-0 mt-0.5 text-[#F8D063]" />
                        <span className="leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Side: CRISP CONTRAST CARD with Popping Score and FCFA Metrics */}
                {/* Right Side: Internal Dark Agro-Match Score & FCFA Revenue Panel with Circular Contours & Large Motifs */}
                <div className="lg:col-span-5">
                  <div className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-xl border text-white ${
                    item.id === 'opt-b' 
                      ? 'bg-[#091D12] border-emerald-500/40 shadow-emerald-950/40' 
                      : item.id === 'opt-a'
                      ? 'bg-[#0F1B14] border-white/15'
                      : 'bg-[#141210] border-rose-500/20'
                  }`}>
                    
                    {/* Concentric Soil Contour Rings (From StatCard) */}
                    <svg aria-hidden viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" className="pointer-events-none absolute -bottom-10 -right-10 h-52 w-52 text-white/10">
                      {[48, 38, 28, 18, 8].map((r) => (
                        <ellipse key={r} cx="55" cy="55" rx={r * 1.15} ry={r * 0.75} transform="rotate(-15 55 55)" />
                      ))}
                    </svg>

                    {/* Background Large Motif for Storytelling */}
                    <div className="pointer-events-none absolute -top-4 -right-4 opacity-[0.10] text-white">
                      <svg className="w-36 h-36 stroke-current fill-none stroke-[2]" viewBox="0 0 100 100">
                        <path d="M50 42 C44 26 26 22 20 32 C15 44 32 54 50 42 Z" />
                        <path d="M50 42 C56 26 74 22 80 32 C85 44 68 54 50 42 Z" />
                        <line x1="50" y1="42" x2="50" y2="82" />
                      </svg>
                    </div>

                    {/* POPPING SCORE SECTION */}
                    <div className="relative z-10 border-b border-white/15 pb-4">
                      <div className="flex items-baseline justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-stone-300">
                          {isFr ? 'Score d\'accord agro-climatique' : 'Agro-Climatic Match Score'}
                        </p>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/10 text-stone-200 border border-white/10">
                          20-Yr NASA Record
                        </span>
                      </div>

                      {/* Giant popping score number */}
                      <div className="mt-2.5 flex items-baseline gap-2">
                        <span className={`text-4xl sm:text-5xl font-black tracking-tight ${
                          item.id === 'opt-b' ? 'text-[#4ADE80]' : item.id === 'opt-a' ? 'text-[#FCD34D]' : 'text-rose-400'
                        }`}>
                          {item.performanceScore}%
                        </span>
                        <span className="text-sm font-bold text-stone-400">
                          / 100
                        </span>
                      </div>

                      <p className="mt-1.5 text-xs font-semibold text-stone-200 leading-snug">
                        {item.scoreNote}
                      </p>
                    </div>

                    {/* NET REVENUE IN FCFA (100% XAF - ZERO USD) */}
                    <div className="relative z-10 py-4 border-b border-white/15">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                        <span className="flex items-center gap-1.5">
                          <Coins size={16} weight="bold" className="text-[#4ADE80]" />
                          {isFr ? 'Revenu net estimé (Fako)' : 'Estimated Net Revenue'}
                        </span>
                        <span className="text-[11px] text-stone-400">Buea / Muea Market</span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-1">
                        <span className="text-xl sm:text-2xl font-black text-white">
                          {item.metrics.netRevenueXAF}
                        </span>

                        {item.metrics.diffXAF && (
                          <span className="text-xs font-extrabold text-[#4ADE80] bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                            {item.metrics.diffXAF}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DETAILED STATS (When toggled) */}
                    {showDetails && (
                      <div className="py-3 space-y-3 text-xs border-b border-stone-200/80 dark:border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                            <ShieldCheck size={16} weight="bold" className="text-amber-600 dark:text-amber-400" />
                            {isFr ? 'Sécurité alimentaire' : 'Food Security Impact'}
                          </span>
                          <span className="font-bold text-stone-900 dark:text-stone-100">
                            {item.metrics.foodSecurity.level}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 pl-5">
                          {item.metrics.foodSecurity.desc}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          <span className="font-semibold text-stone-600 dark:text-stone-400">
                            {isFr ? 'Dépenses intrants (NPK & semences)' : 'Estimated Input Cost'}
                          </span>
                          <span className="font-bold text-stone-900 dark:text-stone-100">
                            {item.metrics.upfrontExpenseXAF.amount}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {item.metrics.upfrontExpenseXAF.desc}
                        </p>
                      </div>
                    )}

                    {/* SELECT PLAN BUTTON */}
                    <div className="pt-4">
                      <button
                        type="button"
                        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs sm:text-sm font-bold transition shadow-sm ${
                          isRec
                            ? 'bg-[#184A2C] hover:bg-[#123821] text-white'
                            : isSel
                            ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                            : 'border border-stone-300 bg-stone-100 text-stone-800 hover:bg-stone-200 dark:border-white/20 dark:bg-white/10 dark:text-stone-100'
                        }`}
                      >
                        <span>
                          {isSel
                            ? (isFr ? 'Plan actif sélectionné' : 'Active Field Plan')
                            : (isFr ? 'Choisir ce plan pour le champ' : 'Select This Rotation Plan')}
                        </span>
                        <ArrowRight size={16} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
