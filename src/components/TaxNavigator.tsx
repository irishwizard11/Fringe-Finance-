import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  ShieldCheck,
  Gift,
  RotateCcw,
  Volume2,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { Language, speakIrishText } from '../data/i18n';
import { TermTooltip } from './TermTooltip';

interface TaxNavigatorProps {
  lang: Language;
}

interface ReliefStep {
  id: string;
  titleEn: string;
  titleGa: string;
  plainSummaryEn: string;
  plainSummaryGa: string;
  rateOrCapEn: string;
  rateOrCapGa: string;
  stepsEn: string[];
  stepsGa: string[];
  defaultEstimateEur: number;
}

const RELIEF_GUIDES: ReliefStep[] = [
  {
    id: 'rent_credit',
    titleEn: 'Renting a Home? (Rent Credit)',
    titleGa: 'Ag Íoc Cíosa? (Creidmheas Cíosa)',
    plainSummaryEn: 'Get up to €1,000 back straight into your bank account just for paying rent in Ireland.',
    plainSummaryGa: 'Faigh suas le €1,000 ar ais i do chuntas bainc as cíos a íoc in Éirinn.',
    rateOrCapEn: '€1,000 back / year (€2,000 for couples)',
    rateOrCapGa: '€1,000 ar ais / bliain (€2,000 do lánúineacha)',
    stepsEn: [
      'Log in to Revenue myAccount and click "Review your tax".',
      'Open your Income Tax Return and click "Rent Tax Credit".',
      'Type in the rent you paid—the refund goes straight to your bank!',
    ],
    stepsGa: [
      'Logáil isteach ar myAccount agus brúigh "Athbhreithnigh do cháin".',
      'Roghnaigh "Creidmheas Cánach Cíosa".',
      'Cuir isteach an cíos a d’íoc tú!',
    ],
    defaultEstimateEur: 1000,
  },
  {
    id: 'health_expenses',
    titleEn: 'Doctor & Pharmacy Visits (20% Back)',
    titleGa: 'Billí Dochtúra & Cógaslainne (20% Ar Ais)',
    plainSummaryEn: 'Every €100 you spend on GP visits or prescriptions gets you €20 back into your pocket.',
    plainSummaryGa: 'Faigheann tú €20 ar ais ar gach €100 a chaitheann tú ar an dochtúir nó ar oidis.',
    rateOrCapEn: '20% cash back on medical bills',
    rateOrCapGa: '20% ar ais ar chostais leighis',
    stepsEn: [
      'Add up what you spent on GP visits, prescriptions, or dental care.',
      'Enter that total under "Health Expenses" inside Revenue myAccount.',
      'Receive 20% of the total back into your bank account.',
    ],
    stepsGa: [
      'Suimigh an méid a chaith tú ar an dochtúir agus ar chógais.',
      'Cuir an figiúr isteach faoi "Costais Leighis" ar myAccount.',
      'Seoltar 20% den chostas ar ais chugat.',
    ],
    defaultEstimateEur: 340,
  },
  {
    id: 'remote_working',
    titleEn: 'Working From Home? (Utility Money Back)',
    titleGa: 'Ag Obair ón mBaile? (Billí Teasa & Solais)',
    plainSummaryEn: 'Claim back a portion of your home electricity, heat, and Wi-Fi bills for remote work days.',
    plainSummaryGa: 'Éiligh cuid de do bhillí leictreachais, teasa agus Wi-Fi ar ais.',
    rateOrCapEn: '30% of home utility bills eligible',
    rateOrCapGa: '30% de bhillí baile incháilithe',
    stepsEn: [
      'Count how many days you worked from home last year.',
      'Enter your annual electricity, heat, and broadband totals in myAccount.',
      'Also tick "Flat-Rate Expenses" for automatic job-related deductions.',
    ],
    stepsGa: [
      'Comhair na laethanta a d’oibrigh tú ón mbaile anuraidh.',
      'Cuir isteach do bhillí leictreachais, teasa agus Wi-Fi.',
      'Seiceáil "Costais Ráta Chomhréidh" do do phost freisin.',
    ],
    defaultEstimateEur: 180,
  },
  {
    id: 'family_credits',
    titleEn: 'Married or Caring for Family?',
    titleGa: 'Pósta nó ag Tabhairt Aire do Theaghlach?',
    plainSummaryEn: 'Couples can share pay bands to keep more take-home pay, and home carers get up to €1,950.',
    plainSummaryGa: 'Is féidir le lánúineacha bandaí a roinnt agus €1,950 a fháil do chúramóir baile.',
    rateOrCapEn: 'Up to €1,950 Home Carer Support',
    rateOrCapGa: 'Suas le €1,950 Creidmheas Cúramóra',
    stepsEn: [
      'Switch to "Joint Assessment" in myAccount if married or in a civil partnership.',
      'Claim the €1,950 Home Carer Credit if one partner cares for children at home.',
    ],
    stepsGa: [
      'Roghnaigh "Measúnú Comhpháirteach" má tá tú pósta.',
      'Éiligh Creidmheas Cúramóra Baile (€1,950) má fhanann céile amháin sa bhaile.',
    ],
    defaultEstimateEur: 650,
  },
];

export const TaxNavigator: React.FC<TaxNavigatorProps> = ({ lang }) => {
  // Default to the new beginner-friendly "How Money Grows & Wealth Foundations" view
  const [activeSubView, setActiveSubView] = useState<'foundations' | 'compounding' | 'cashback'>('foundations');

  // Interactive Emergency Fund & Debt vs Investing Readiness Simulator
  const [monthlyEssentialsEur, setMonthlyEssentialsEur] = useState<number>(1600);
  const [monthsBuffer, setMonthsBuffer] = useState<number>(3);
  const [currentSavingsEur, setCurrentSavingsEur] = useState<number>(2400);

  // Compounding & Net Yield Simulator State
  const [principal, setPrincipal] = useState<number>(5000);
  const [monthlyAdded, setMonthlyAdded] = useState<number>(150);
  const [annualReturnPct, setAnnualReturnPct] = useState<number>(7);
  const [savingsRatePct, setSavingsRatePct] = useState<number>(2.5);
  const [years, setYears] = useState<number>(10);
  const [includeIrishTaxRules, setIncludeIrishTaxRules] = useState<boolean>(true);

  // Cash Back Checklist State
  const [expandedId, setExpandedId] = useState<string>('rent_credit');
  const [checkedReliefs, setCheckedReliefs] = useState<Record<string, boolean>>({
    rent_credit: true,
    health_expenses: true,
    remote_working: false,
    family_credits: false,
  });

  const toggleChecked = (id: string) => {
    setCheckedReliefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const estimatedTotalRefund = RELIEF_GUIDES.reduce(
    (sum, item) => (checkedReliefs[item.id] ? sum + item.defaultEstimateEur : sum),
    0
  );

  // Emergency Fund Math
  const targetEmergencyFund = monthlyEssentialsEur * monthsBuffer;
  const emergencyProgressPct = Math.min(100, Math.round((currentSavingsEur / Math.max(1, targetEmergencyFund)) * 100));
  const remainingToSafetyNet = Math.max(0, targetEmergencyFund - currentSavingsEur);

  // Compounding Math (Starting Principal + Monthly Contributions)
  const totalCashPutIn = principal + monthlyAdded * 12 * years;

  // 1. Bank Savings
  const effectiveBankRate = includeIrishTaxRules ? (savingsRatePct / 100) * (1 - 0.33) : savingsRatePct / 100;
  const bankFuturePrincipal = principal * Math.pow(1 + effectiveBankRate, years);
  const bankFutureContribs =
    effectiveBankRate > 0
      ? monthlyAdded * 12 * ((Math.pow(1 + effectiveBankRate, years) - 1) / effectiveBankRate)
      : monthlyAdded * 12 * years;
  const finalBankBalance = bankFuturePrincipal + bankFutureContribs;

  // 2. Direct Investing (Shares / Index / Bitcoin)
  const rGrowth = annualReturnPct / 100;
  const grossInvestPrincipal = principal * Math.pow(1 + rGrowth, years);
  const grossInvestContribs =
    rGrowth > 0 ? monthlyAdded * 12 * ((Math.pow(1 + rGrowth, years) - 1) / rGrowth) : monthlyAdded * 12 * years;
  const grossInvestTotal = grossInvestPrincipal + grossInvestContribs;
  const grossProfit = Math.max(0, grossInvestTotal - totalCashPutIn);
  const cgtAllowance = 1270;
  const cgtTaxAmount = includeIrishTaxRules ? Math.max(0, grossProfit - cgtAllowance) * 0.33 : 0;
  const finalDirectInvestBalance = grossInvestTotal - cgtTaxAmount;

  // 3. Managed Fund / ETF (with optional 41% 8-year rule comparison)
  const etfTaxAmount = includeIrishTaxRules ? grossProfit * 0.41 : 0;
  const finalEtfBalance = grossInvestTotal - etfTaxAmount;

  return (
    <div className="space-y-6">
      {/* Beginner-Friendly Financial Literacy Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#006B3F]">
              {lang === 'ga'
                ? 'Céim 3: Conas a Oibríonn Airgead & Saibhreas'
                : 'Step 3: Understanding Finance & How Wealth Grows'}
            </div>
            <h2 className="text-2xl font-bold text-[#0A192F] mt-1 tracking-tight">
              {lang === 'ga'
                ? 'Na 3 Chéim d’Airgeadas Pearsanta: Sábháilteacht, Fás Iolraithe & Airgead Ar Ais'
                : 'The 3 Pillars of Personal Finance: Safety Nets, Compounding & Smart Boosts'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              speakIrishText(
                'Ciste Éigeandála, Ús Iolraithe, agus Cumhacht Cheannaigh.',
                'ga'
              )
            }
            className="btn-google-tonal self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>{lang === 'ga' ? 'Éist i nGaeilge' : 'Hear Gaeilge Terms'}</span>
          </button>
        </div>

        {/* Plain-Language "In 10 Seconds" Beginner Callout */}
        <div className="p-4 rounded-2xl bg-[#F4F6F9] border border-slate-200/80 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 leading-relaxed">
            {lang === 'ga' ? (
              <>
                <strong>An Buneolas Simplí:</strong> Ní bhaineann litearthacht airgeadais le téarmaí casta. Baineann sé le trí rud shimplí: <strong>1.</strong> <TermTooltip termKey="emergency_fund" lang={lang} /> a thógáil le haghaidh suaimhneas intinne, <strong>2.</strong> <TermTooltip termKey="compound_interest" lang={lang} /> a thuiscint ionas go n-oibríonn do chuid airgid ar do shon, agus <strong>3.</strong> Gan airgead saor in aisce (<TermTooltip termKey="tax_relief" lang={lang} />) a fhágáil ina dhiaidh.
              </>
            ) : (
              <>
                <strong>The Simple Version:</strong> Understanding finance comes down to three habits: <strong>1.</strong> Building a rainy-day <TermTooltip termKey="emergency_fund" lang={lang} /> so you never need expensive debt, <strong>2.</strong> Letting <TermTooltip termKey="compound_interest" lang={lang} /> grow your money like a snowball over time, and <strong>3.</strong> Claiming easy <TermTooltip termKey="tax_relief" lang={lang} /> cash back on bills you already pay.
              </>
            )}
          </p>
        </div>

        {/* Clean Google Material 3 Pill Selector — Concentric Shape Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-3 items-stretch gap-1.5 p-1.5 bg-slate-100 dark:bg-[#0A192F] border border-slate-200/70 dark:border-[#1E3A5F] rounded-2xl w-full">
          <button
            type="button"
            onClick={() => setActiveSubView('foundations')}
            className={`min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-[13px] font-bold rounded-xl transition-all cursor-pointer overflow-hidden ${
              activeSubView === 'foundations'
                ? 'bg-[#006B3F] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {lang === 'ga'
                ? '1. An Dréimire Airgeadais & Ciste Éigeandála'
                : '1. The Money Ladder & Safety Net'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('compounding')}
            className={`min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-[13px] font-bold rounded-xl transition-all cursor-pointer overflow-hidden ${
              activeSubView === 'compounding'
                ? 'bg-[#006B3F] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {lang === 'ga'
                ? '2. Conas a Fhásann Airgead (Ús Iolraithe)'
                : '2. How Money Grows (Compounding)'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('cashback')}
            className={`min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-[13px] font-bold rounded-xl transition-all cursor-pointer overflow-hidden ${
              activeSubView === 'cashback'
                ? 'bg-[#006B3F] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
            }`}
          >
            <Gift className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {lang === 'ga'
                ? '3. Airgead Ar Ais ar Chíos & Dochtúir'
                : '3. Easy Cash Back on Rent & Bills'}
            </span>
          </button>
        </div>
      </div>

      {/* VIEW 1: THE 4-STEP MONEY LADDER & EMERGENCY FUND BUILDER */}
      {activeSubView === 'foundations' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: The 4-Step Personal Finance Ladder (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#0A192F]">
                {lang === 'ga'
                  ? 'An Dréimire Airgeadais 4-Chéim (Cén ord ar chóir tosú?)'
                  : 'The 4-Step Financial Order of Operations'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ga'
                  ? 'Sula ndéanann tú infheistíocht, lean an t-ord simplí seo chun bonn láidir a chruthú.'
                  : 'Wondering what to do first with spare money? Follow these 4 steps in order.'}
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: '01',
                  titleEn: 'Cover Essentials & Clear High-Interest Debt',
                  titleGa: 'Íoc Riachtanais & Glan Fiacha Daora (Cártaí Creidmheasa)',
                  descEn:
                    'Credit cards and overdrafts charge 15%–22% interest. Paying them off is a guaranteed 20% return on your money.',
                  descGa:
                    'Gearrann cártaí creidmheasa 15%–22% ús. Is é glanadh na bhfiacha sin an chéad chéim i gcónaí.',
                  color: 'bg-[#0A192F] text-white',
                },
                {
                  step: '02',
                  titleEn: 'Build a 3–6 Month Emergency Safety Net',
                  titleGa: 'Tóg Ciste Éigeandála 3–6 Mhí',
                  descEn:
                    'Keep 3–6 months of basic bills in an easy-access Credit Union or savings account so a broken car or job change is never a crisis.',
                  descGa:
                    'Coinnigh 3–6 mhí de chostais bhunúsacha i gcuntas sábháilte le haghaidh lá na coise tinne.',
                  color: 'bg-[#006B3F] text-white',
                },
                {
                  step: '03',
                  titleEn: 'Grab Free Employer Match & Bill Rebates',
                  titleGa: 'Faigh Bónas Pinsin d’Fhostóra & Aisíoc ar Bhillí',
                  descEn:
                    'If your workplace matches pension contributions, take it—it is an instant 100% return, plus tax relief.',
                  descGa:
                    'Má chuireann d’fhostóir airgead le do phinsean, glac leis—is airgead saor in aisce é.',
                  color: 'bg-[#F7931A] text-[#0A192F]',
                },
                {
                  step: '04',
                  titleEn: 'Invest Long-Term for Compound Growth',
                  titleGa: 'Infheistigh don Fhadtéarma (5+ Bliain)',
                  descEn:
                    'Once your safety net is full, put long-term money into productive assets (global equities, property, or scarce Bitcoin) to beat inflation.',
                  descGa:
                    'Nuair atá do chiste éigeandála lán, cuir airgead fadtéarmach i sócmhainní a fhásann níos tapúla ná boilsciú.',
                  color: 'bg-slate-800 text-white',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-4 rounded-2xl bg-[#F4F6F9] border border-slate-200/80 flex items-start gap-3.5"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${item.color}`}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0A192F]">
                      {lang === 'ga' ? item.titleGa : item.titleEn}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {lang === 'ga' ? item.descGa : item.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Emergency Fund Calculator (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#006B3F]" />
                <span>
                  {lang === 'ga'
                    ? 'Áireamhán Ciste Éigeandála (Do Líontán Sábháilteachta)'
                    : 'Interactive Emergency Fund Builder'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ga'
                  ? 'Cé mhéad airgid thirim ar chóir duit a choinneáil leataobh sula ndéanann tú infheistíocht?'
                  : 'Find out your exact personal safety-net target before you start investing.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F6F9] border border-slate-200 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <label htmlFor="essentials-slider">
                    {lang === 'ga' ? 'Costais Riachtanacha Míosúla (Cíos, Bia, Billí)' : 'Monthly Essential Bills (Rent, Food, Utilities)'}
                  </label>
                  <span className="font-mono font-bold text-[#0A192F]">
                    €{monthlyEssentialsEur.toLocaleString('en-IE')}/mo
                  </span>
                </div>
                <input
                  id="essentials-slider"
                  type="range"
                  min={600}
                  max={4500}
                  step={100}
                  value={monthlyEssentialsEur}
                  onChange={(e) => setMonthlyEssentialsEur(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <label htmlFor="months-buffer-slider">
                    {lang === 'ga' ? 'Míonna de Chosaint' : 'Months of Cushion You Want'}
                  </label>
                  <span className="font-mono font-bold text-[#006B3F]">
                    {monthsBuffer} {lang === 'ga' ? 'mhí' : 'months'}
                  </span>
                </div>
                <input
                  id="months-buffer-slider"
                  type="range"
                  min={1}
                  max={12}
                  step={1}
                  value={monthsBuffer}
                  onChange={(e) => setMonthsBuffer(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <label htmlFor="current-saved-slider">
                    {lang === 'ga' ? 'Coigilteas atá agat faoi láthair' : 'Cash Saved So Far'}
                  </label>
                  <span className="font-mono font-bold text-[#0A192F]">
                    €{currentSavingsEur.toLocaleString('en-IE')}
                  </span>
                </div>
                <input
                  id="current-saved-slider"
                  type="range"
                  min={0}
                  max={25000}
                  step={200}
                  value={currentSavingsEur}
                  onChange={(e) => setCurrentSavingsEur(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>

            {/* Visual Safety Net Meter */}
            <div className="p-5 rounded-2xl bg-[#0A192F] text-white space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-300">
                    {lang === 'ga' ? 'Do Sprioc Ciste Éigeandála:' : 'Your Recommended Safety-Net Target:'}
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-[#F7931A] mt-0.5">
                    €{targetEmergencyFund.toLocaleString('en-IE')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-300">
                    {lang === 'ga' ? 'Stádas:' : 'Readiness:'}
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {emergencyProgressPct}%
                  </div>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#006B3F] to-[#F7931A] transition-all duration-200"
                  style={{ width: `${emergencyProgressPct}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 pt-1">
                {remainingToSafetyNet === 0
                  ? lang === 'ga'
                    ? '✓ Tá do Chiste Éigeandála lán! Tá tú réidh le breathnú ar fhás fadtéarmach sa chéad chluaisín eile.'
                    : '✓ Your Emergency Fund is fully funded! You are ready to explore long-term compound investing in Tab 2.'
                  : lang === 'ga'
                  ? `Tá €${remainingToSafetyNet.toLocaleString('en-IE')} eile uait chun ${monthsBuffer} mhí de chosaint iomlán a bhaint amach.`
                  : `You are €${remainingToSafetyNet.toLocaleString('en-IE')} away from a full ${monthsBuffer}-month peace-of-mind cushion.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: HOW MONEY GROWS (COMPOUND GROWTH & NET RETURN SIMULATOR) */}
      {activeSubView === 'compounding' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-[#0A192F]">
                {lang === 'ga'
                  ? 'Simléir Fáis Iolraithe: Conas a Fhásann Coigilteas vs Infheistíocht'
                  : 'Compound Growth Simulator: Saving vs. Investing Over Time'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ga'
                  ? 'Feic an difríocht idir an t-airgead a chuireann tú isteach agus an fás iolraithe a thuilleann sé.'
                  : 'See how a starting sum plus a small monthly habit snowballs over the years.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start shrink-0">
              <button
                type="button"
                onClick={() => setIncludeIrishTaxRules((prev) => !prev)}
                className={includeIrishTaxRules ? 'btn-google-tonal' : 'btn-google-outlined'}
              >
                <span className="truncate">
                  {includeIrishTaxRules
                    ? lang === 'ga'
                      ? '✓ Rialacha Cánach na hÉireann San Áireamh'
                      : '✓ Showing Net After Irish Tax'
                    : lang === 'ga'
                    ? 'Taispeáin Fás Comhlán (Roimh Cháin)'
                    : 'Showing Gross Growth (Pre-Tax)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setPrincipal(5000);
                  setMonthlyAdded(150);
                  setAnnualReturnPct(7);
                  setSavingsRatePct(2.5);
                  setYears(10);
                }}
                className="btn-google-outlined"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'ga' ? 'Athshocraigh' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F4F6F9] p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="principal-slider">{lang === 'ga' ? 'Suim Thosaigh' : 'Starting Amount'}</label>
                <span className="font-mono font-bold text-[#0A192F] tabular-nums">
                  €{principal.toLocaleString('en-IE')}
                </span>
              </div>
              <input
                id="principal-slider"
                type="range"
                min={0}
                max={50000}
                step={500}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="monthly-added-slider">{lang === 'ga' ? 'Coigilteas Míosúil' : 'Added Every Month'}</label>
                <span className="font-mono font-bold text-[#006B3F] tabular-nums">
                  +€{monthlyAdded}/mo
                </span>
              </div>
              <input
                id="monthly-added-slider"
                type="range"
                min={0}
                max={1000}
                step={25}
                value={monthlyAdded}
                onChange={(e) => setMonthlyAdded(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="years-slider">{lang === 'ga' ? 'Blianta Fáis' : 'Time Horizon'}</label>
                <span className="font-mono font-bold text-[#0A192F] tabular-nums">
                  {years} {lang === 'ga' ? 'bl' : 'yrs'}
                </span>
              </div>
              <input
                id="years-slider"
                type="range"
                min={1}
                max={25}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="market-return-slider">{lang === 'ga' ? 'Ráta Fáis Bliantúil' : 'Expected Annual Growth'}</label>
                <span className="font-mono font-bold text-[#006B3F] tabular-nums">
                  {annualReturnPct.toFixed(1)}%/yr
                </span>
              </div>
              <input
                id="market-return-slider"
                type="range"
                min={2}
                max={14}
                step={0.5}
                value={annualReturnPct}
                onChange={(e) => setAnnualReturnPct(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          {/* 3 Comparison Cards: Cash Put In vs Bank Deposit vs Compounding Asset */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
              <div className="text-xs font-bold text-slate-500">
                {lang === 'ga' ? '1. AIRGEAD A CHUIR TÚ ISTEACH (0%)' : '1. TOTAL CASH YOU PUT IN (0%)'}
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#0A192F]">
                €{Math.round(totalCashPutIn).toLocaleString('en-IE')}
              </div>
              <p className="text-xs text-slate-600">
                {lang === 'ga'
                  ? `€${principal.toLocaleString('en-IE')} ag an tús + €${monthlyAdded}/mí thar ${years} bliana.`
                  : `€${principal.toLocaleString('en-IE')} upfront + €${monthlyAdded}/mo over ${years} years with zero interest.`}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
              <div className="text-xs font-bold text-slate-600">
                {lang === 'ga'
                  ? `2. CUNTAS BAINC (${savingsRatePct}% ÚS)`
                  : `2. STANDARD BANK ACCOUNT (${savingsRatePct}%/YR)`}
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#0A192F]">
                €{Math.round(finalBankBalance).toLocaleString('en-IE')}
              </div>
              <p className="text-xs text-slate-600">
                {lang === 'ga'
                  ? 'Sábháilte do do Chiste Éigeandála, ach fásann sé go mall.'
                  : 'Great for short-term emergency savings, though bank interest is modest.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-[#006B3F] bg-[#006B3F]/4 space-y-2">
              <div className="text-xs font-bold text-[#006B3F]">
                {lang === 'ga'
                  ? `3. FÁS IOLRAITHE (${annualReturnPct}% / BLIAIN)`
                  : `3. COMPOUNDING INVESTMENTS (${annualReturnPct}%/YR)`}
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-[#006B3F]">
                €{Math.round(finalDirectInvestBalance).toLocaleString('en-IE')}
              </div>
              <p className="text-xs text-slate-700">
                {lang === 'ga'
                  ? `Rinne ús iolraithe +€${Math.round(finalDirectInvestBalance - totalCashPutIn).toLocaleString('en-IE')} de bhrabús glan duit!`
                  : `Compound growth generated +€${Math.round(finalDirectInvestBalance - totalCashPutIn).toLocaleString('en-IE')} on top of your contributions!`}
              </p>
              {includeIrishTaxRules && (
                <div className="pt-2 border-t border-[#006B3F]/20 text-[11px] font-mono text-slate-600">
                  {lang === 'ga'
                    ? `Tar éis 33% CGC (€1,270 saor). I gciste ETF (41%): €${Math.round(finalEtfBalance).toLocaleString('en-IE')}`
                    : `Net after 33% CGT (€1,270 tax-free). In a 41% taxed ETF: €${Math.round(finalEtfBalance).toLocaleString('en-IE')}`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: EASY CASH BACK ON RENT & DOCTOR BILLS */}
      {activeSubView === 'cashback' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-[#0A192F]">
                {lang === 'ga'
                  ? 'Éiligh Airgead Ar Ais ar Bhillí a Íocann Tú Cheana Féin'
                  : 'Boost Your Savings: Claim Cash Back on Bills You Already Pay'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'ga'
                  ? 'Cuir tic sna boscaí thíos chun feiceáil cé mhéad airgid is féidir leat a chur le do chiste coigiltis.'
                  : 'Tick what applies to you—most people use this annual refund to jump-start their Emergency Fund.'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0A192F] text-white flex items-center gap-4 shrink-0">
              <div>
                <div className="text-[11px] text-slate-300">
                  {lang === 'ga' ? 'Airgead Ar Ais Measta' : 'Estimated Cash Back'}
                </div>
                <div className="text-2xl font-bold font-mono tabular-nums text-[#F7931A]">
                  €{estimatedTotalRefund.toLocaleString('en-IE')}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RELIEF_GUIDES.map((guide) => {
              const isExpanded = expandedId === guide.id;
              const isChecked = !!checkedReliefs[guide.id];
              return (
                <div
                  key={guide.id}
                  className={`rounded-2xl border p-4 transition-colors ${
                    isChecked ? 'border-[#006B3F] bg-[#006B3F]/4' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        onClick={() => toggleChecked(guide.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 cursor-pointer ${
                          isChecked
                            ? 'bg-[#006B3F] border-[#006B3F] text-white'
                            : 'bg-white border-slate-300 text-transparent hover:border-[#006B3F]'
                        }`}
                        aria-label={`Select ${guide.titleEn}`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div>
                        <h4 className="text-base font-bold text-[#0A192F]">
                          {lang === 'ga' ? guide.titleGa : guide.titleEn}
                        </h4>
                        <div className="text-xs font-mono font-semibold text-[#006B3F] mt-0.5">
                          {lang === 'ga' ? guide.rateOrCapGa : guide.rateOrCapEn}
                        </div>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {lang === 'ga' ? guide.plainSummaryGa : guide.plainSummaryEn}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? '' : guide.id)}
                      className="p-1.5 text-slate-500 hover:text-[#0A192F] rounded-lg cursor-pointer shrink-0"
                      aria-label="Show steps"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                      <div className="text-xs font-bold text-[#0A192F]">
                        {lang === 'ga' ? '3 Chéim Shimplí:' : 'How to claim in 3 steps:'}
                      </div>
                      <ol className="space-y-1.5">
                        {(lang === 'ga' ? guide.stepsGa : guide.stepsEn).map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="font-mono font-bold text-[#006B3F]">{idx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
