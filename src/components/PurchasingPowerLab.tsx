import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Language, speakIrishText } from '../data/i18n';
import { TermTooltip } from './TermTooltip';

interface PurchasingPowerLabProps {
  lang: Language;
}

export interface BudgetItem {
  id: string;
  nameEn: string;
  nameGa: string;
  amountEur: number;
  bucket: 'needs' | 'wants' | 'savings';
}

const DEFAULT_BUDGET_ITEMS: BudgetItem[] = [
  { id: 'b-1', nameEn: 'Rent / Mortgage Payment', nameGa: 'Cíos / Morgáiste', amountEur: 1250, bucket: 'needs' },
  { id: 'b-2', nameEn: 'Groceries (Supermarket)', nameGa: 'Earraí Grósaeireachta', amountEur: 420, bucket: 'needs' },
  { id: 'b-3', nameEn: 'Electricity, Heat & Wi-Fi', nameGa: 'Leictreachas, Teas & Wi-Fi', amountEur: 195, bucket: 'needs' },
  { id: 'b-4', nameEn: 'Dining Out, Coffee & Social', nameGa: 'Bialanna, Caife & Sóisialta', amountEur: 260, bucket: 'wants' },
  { id: 'b-5', nameEn: 'Holidays & Weekend Fund', nameGa: 'Ciste Saoire', amountEur: 180, bucket: 'wants' },
  { id: 'b-6', nameEn: 'Emergency Savings Account', nameGa: 'Ciste Éigeandála', amountEur: 300, bucket: 'savings' },
  { id: 'b-7', nameEn: 'Pension / Long-Term Bitcoin', nameGa: 'Pinsean / Bitcoin Fadtéarmach', amountEur: 250, bucket: 'savings' },
];

const STORAGE_KEY_ITEMS = 'fringe_finance_budget_items_v1';
const STORAGE_KEY_INCOME = 'fringe_finance_net_income_v1';

export const PurchasingPowerLab: React.FC<PurchasingPowerLabProps> = ({ lang }) => {
  // Beginner Sub-Tab Selector so only 1 tool is shown at a time
  const [activeSubTab, setActiveSubTab] = useState<'budget' | 'inflation' | 'pension'>('budget');

  // 1. Personal Monthly Budget State (Persisted)
  const [netMonthlyIncome, setNetMonthlyIncome] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INCOME);
      return saved ? Number(saved) : 3500;
    } catch {
      return 3500;
    }
  });

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      return saved ? JSON.parse(saved) : DEFAULT_BUDGET_ITEMS;
    } catch {
      return DEFAULT_BUDGET_ITEMS;
    }
  });

  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('100');
  const [newItemBucket, setNewItemBucket] = useState<BudgetItem['bucket']>('needs');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INCOME, String(netMonthlyIncome));
    } catch {
      // Ignore storage errors
    }
  }, [netMonthlyIncome]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(budgetItems));
    } catch {
      // Ignore storage errors
    }
  }, [budgetItems]);

  // 2. Inflation Visualizer State
  const [savingsCashEur, setSavingsCashEur] = useState<number>(10000);
  const [inflationRatePct, setInflationRatePct] = useState<number>(3.5);
  const [inflationHorizonYrs, setInflationHorizonYrs] = useState<number>(10);

  // 3. Pension Tax Relief Optimizer State
  const [monthlyPensionGrossEur, setMonthlyPensionGrossEur] = useState<number>(300);
  const [marginalTaxRate, setMarginalTaxRate] = useState<20 | 40>(40);
  const [pensionYears, setPensionYears] = useState<number>(20);

  // Budget Math
  const needsTotal = budgetItems
    .filter((i) => i.bucket === 'needs')
    .reduce((sum, i) => sum + i.amountEur, 0);
  const wantsTotal = budgetItems
    .filter((i) => i.bucket === 'wants')
    .reduce((sum, i) => sum + i.amountEur, 0);
  const savingsTotal = budgetItems
    .filter((i) => i.bucket === 'savings')
    .reduce((sum, i) => sum + i.amountEur, 0);
  const totalOutgoings = needsTotal + wantsTotal + savingsTotal;
  const unallocatedSurplus = netMonthlyIncome - totalOutgoings;

  const needsPct = netMonthlyIncome > 0 ? Math.round((needsTotal / netMonthlyIncome) * 100) : 0;
  const wantsPct = netMonthlyIncome > 0 ? Math.round((wantsTotal / netMonthlyIncome) * 100) : 0;
  const savingsPct = netMonthlyIncome > 0 ? Math.round((savingsTotal / netMonthlyIncome) * 100) : 0;

  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Math.max(0, Number(newItemAmount) || 0);
    if (!newItemName.trim() || amt <= 0) return;
    const item: BudgetItem = {
      id: `b-${Date.now()}`,
      nameEn: newItemName.trim(),
      nameGa: newItemName.trim(),
      amountEur: amt,
      bucket: newItemBucket,
    };
    setBudgetItems((prev) => [...prev, item]);
    setNewItemName('');
    setNewItemAmount('100');
  };

  const handleUpdateAmount = (id: string, value: number) => {
    setBudgetItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amountEur: Math.max(0, value) } : item))
    );
  };

  const handleDeleteBudgetItem = (id: string) => {
    setBudgetItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleResetBudget = () => {
    setNetMonthlyIncome(3500);
    setBudgetItems(DEFAULT_BUDGET_ITEMS);
  };

  const handleExportBudgetCsv = () => {
    const sanitizeCsvCell = (val: string) => {
      const escaped = val.replace(/"/g, '""');
      return /^[=+\-@\t\r]/.test(escaped) ? `"'${escaped}"` : `"${escaped}"`;
    };
    const headers = ['Category', 'Item', 'Monthly (EUR)'];
    const rows = budgetItems.map((i) =>
      [i.bucket.toUpperCase(), sanitizeCsvCell(lang === 'ga' ? i.nameGa : i.nameEn), i.amountEur.toFixed(2)].join(',')
    );
    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emerald-ledger-monthly-budget.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Inflation Math
  const realValue5Yrs = savingsCashEur / Math.pow(1 + inflationRatePct / 100, 5);
  const realValueHorizon = savingsCashEur / Math.pow(1 + inflationRatePct / 100, inflationHorizonYrs);
  const purchasingPowerLost = savingsCashEur - realValueHorizon;

  // Pension Math
  const netMonthlyCostToUser = monthlyPensionGrossEur * (1 - marginalTaxRate / 100);
  const monthlyTaxSaved = monthlyPensionGrossEur - netMonthlyCostToUser;
  const r = 0.07;
  const futurePensionPot =
    monthlyPensionGrossEur * 12 * ((Math.pow(1 + r, pensionYears) - 1) / r);

  return (
    <div className="space-y-6">
      {/* Beginner Header & 3 Simple Tool Pills */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#006B3F]">
              {lang === 'ga' ? 'Céim 2: Do Chuid Airgid Laethúil' : 'Step 2: Everyday Money, Inflation & Pensions'}
            </div>
            <h2 className="text-2xl font-bold text-[#0A192F] mt-1 tracking-tight">
              {lang === 'ga'
                ? 'Pleanáil do Bhuiséad Míosúil & Cosain do Chumhacht Cheannaigh'
                : 'Plan Your Monthly Budget & Beat Inflation'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              speakIrishText('Cumhacht Cheannaigh, Boilsciú agus Pinsean.', 'ga')
            }
            className="btn-google-tonal self-start"
          >
            <Volume2 className="w-4 h-4" />
            <span>{lang === 'ga' ? 'Éist i nGaeilge' : 'Hear Gaeilge Terms'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#F4F6F9] border border-slate-200/80 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-[#006B3F] shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 leading-relaxed">
            {lang === 'ga' ? (
              <>
                <strong>An Buneolas Simplí:</strong> Úsáid an riail shimplí <strong>50/30/20</strong> chun do thuarastal míosúil a roinnt, feic conas a chreimeann <TermTooltip termKey="inflation" lang={lang} /> do <TermTooltip termKey="purchasing_power" lang={lang} />, agus faigh amach conas €100 a chur i do phinsean ar chostas €60 le <TermTooltip termKey="tax_relief" lang={lang} />.
              </>
            ) : (
              <>
                <strong>The Simple Version:</strong> Use the easy <strong>50/30/20 rule</strong> to organize your monthly take-home pay, see how <TermTooltip termKey="inflation" lang={lang} /> quietly shrinks idle cash <TermTooltip termKey="purchasing_power" lang={lang} />, and see how Irish <TermTooltip termKey="tax_relief" lang={lang} /> puts €100 into your pension for just €60.
              </>
            )}
          </p>
        </div>

        {/* Google Material 3 Segmented Pill Bar — Concentric Shape Alignment */}
        <div className="grid grid-cols-1 sm:grid-cols-3 items-stretch gap-1.5 p-1.5 bg-slate-100 dark:bg-[#0A192F] border border-slate-200/70 dark:border-[#1E3A5F] rounded-2xl w-full">
          {[
            { id: 'budget' as const, icon: Wallet, en: '1. Monthly Budget Planner', ga: '1. Pleanálaí Buiséid' },
            { id: 'inflation' as const, icon: TrendingDown, en: '2. Inflation Calculator', ga: '2. Áireamhán Boilscithe' },
            { id: 'pension' as const, icon: PiggyBank, en: '3. €100-for-€60 Pension Boost', ga: '3. Treisiú Pinsin (€100 ar €60)' },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`min-h-[40px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-[13px] font-bold rounded-xl transition-all cursor-pointer overflow-hidden ${
                  activeSubTab === tab.id
                    ? 'bg-[#006B3F] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{lang === 'ga' ? tab.ga : tab.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: MONTHLY HOUSEHOLD BUDGET PLANNER */}
      {activeSubTab === 'budget' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-[#0A192F]">
                {lang === 'ga'
                  ? 'Do Bhuiséad Míosúil (Sábháiltear go huathoibríoch é)'
                  : 'Your Monthly 50/30/20 Budget (Auto-Saved)'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ga'
                  ? '50% Riachtanais · 30% Miana · 20% Coigiltis & Todhchaí'
                  : 'Aim for: 50% Essential Needs · 30% Fun/Wants · 20% Future Savings'}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start shrink-0">
              <button type="button" onClick={handleExportBudgetCsv} className="btn-google-tonal">
                <Download className="w-4 h-4 shrink-0" />
                <span>{lang === 'ga' ? 'CSV' : 'Save CSV'}</span>
              </button>
              <button type="button" onClick={handleResetBudget} className="btn-google-outlined">
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>{lang === 'ga' ? 'Athshocraigh' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Step 1: Take-Home Pay Slider + 4 Simple Summary Tiles */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#F4F6F9] p-5 rounded-2xl border border-slate-200/80">
            <div className="lg:col-span-4 space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="net-income-input" className="text-xs font-bold text-[#0A192F]">
                  {lang === 'ga' ? 'Pá Glan Míosúil (Tar éis Cánach)' : 'Monthly Take-Home Pay'}
                </label>
                <span className="text-xl font-bold font-mono tabular-nums text-[#006B3F]">
                  €{netMonthlyIncome.toLocaleString('en-IE')}
                </span>
              </div>
              <input
                id="net-income-input"
                type="range"
                min={1200}
                max={10000}
                step={50}
                value={netMonthlyIncome}
                onChange={(e) => setNetMonthlyIncome(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  {lang === 'ga' ? 'Riachtanais (~50%)' : 'Needs (~50%)'}
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-[#0A192F] mt-0.5">
                  €{needsTotal.toLocaleString('en-IE')} ({needsPct}%)
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                <div className="text-[11px] text-slate-500">
                  {lang === 'ga' ? 'Mianta (~30%)' : 'Wants (~30%)'}
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-[#0A192F] mt-0.5">
                  €{wantsTotal.toLocaleString('en-IE')} ({wantsPct}%)
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#006B3F]/40">
                <div className="text-[11px] text-[#006B3F] font-semibold">
                  {lang === 'ga' ? 'Coigiltis (≥20%)' : 'Savings (≥20%)'}
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-[#006B3F] mt-0.5">
                  €{savingsTotal.toLocaleString('en-IE')} ({savingsPct}%)
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl border ${
                  unallocatedSurplus >= 0
                    ? 'bg-[#0A192F] text-white border-[#0A192F]'
                    : 'bg-red-50 text-red-900 border-red-300'
                }`}
              >
                <div className="text-[11px] opacity-80">
                  {unallocatedSurplus >= 0
                    ? lang === 'ga'
                      ? 'Fágtha os cionn'
                      : 'Left Over'
                    : lang === 'ga'
                    ? 'Os cionn buiséid'
                    : 'Over Budget'}
                </div>
                <div className="text-base font-bold font-mono tabular-nums text-[#F7931A] mt-0.5 flex items-center gap-1">
                  {unallocatedSurplus >= 0 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  )}
                  <span>
                    {unallocatedSurplus >= 0 ? '+' : ''}€{unallocatedSurplus.toLocaleString('en-IE')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Add Item Bar — Uniform Pill Height Alignment */}
          <form onSubmit={handleAddBudgetItem} className="flex flex-wrap items-center gap-2.5">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={lang === 'ga' ? 'Cuir costas nua leis...' : 'Add a monthly expense...'}
              className="h-10 px-4 text-xs bg-[#F4F6F9] border border-slate-300 rounded-full flex-1 min-w-[180px]"
            />
            <select
              value={newItemBucket}
              onChange={(e) => setNewItemBucket(e.target.value as BudgetItem['bucket'])}
              className="h-10 px-3.5 text-xs bg-[#F4F6F9] border border-slate-300 rounded-full"
            >
              <option value="needs">{lang === 'ga' ? 'Riachtanas (Billí)' : 'Need (Essential)'}</option>
              <option value="wants">{lang === 'ga' ? 'Mian (Siamsaíocht)' : 'Want (Lifestyle)'}</option>
              <option value="savings">{lang === 'ga' ? 'Coigilteas' : 'Saving / Investing'}</option>
            </select>
            <input
              type="number"
              min={1}
              value={newItemAmount}
              onChange={(e) => setNewItemAmount(e.target.value)}
              className="h-10 w-24 px-3.5 text-xs font-mono bg-[#F4F6F9] border border-slate-300 rounded-full"
            />
            <button type="submit" className="btn-google-filled h-10 !py-0 shrink-0">
              <Plus className="w-4 h-4 shrink-0" />
              <span>{lang === 'ga' ? 'Cuir Leis' : 'Add Item'}</span>
            </button>
          </form>

          {/* Clean Editable Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {budgetItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0A192F] truncate">
                    {lang === 'ga' ? item.nameGa : item.nameEn}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.bucket === 'needs'
                      ? lang === 'ga'
                        ? 'Riachtanas'
                        : 'Essential Need'
                      : item.bucket === 'wants'
                      ? lang === 'ga'
                        ? 'Mian'
                        : 'Lifestyle Want'
                      : lang === 'ga'
                      ? 'Coigilteas'
                      : 'Future Savings'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-slate-500">€</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={item.amountEur}
                    onChange={(e) => handleUpdateAmount(item.id, Number(e.target.value))}
                    className="h-8 w-20 px-2.5 text-xs font-mono font-bold text-right bg-white border border-slate-300 rounded-full tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteBudgetItem(item.id)}
                    className="w-8 h-8 inline-flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer shrink-0"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INFLATION CALCULATOR */}
      {activeSubTab === 'inflation' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#0A192F]">
              {lang === 'ga'
                ? 'Conas a Laghdaíonn Boilsciú Do Chuid Airgid le hImeacht Ama'
                : 'See How Rising Prices Shrink Cash Sitting in a 0% Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ga'
                ? 'Nuair a ardaíonn praghsanna (boilsciú), ceannaíonn an méid céanna Euro níos lú earraí.'
                : 'Even though the number of Euros in your bank stays the same, what it can actually buy shrinks each year.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F4F6F9] p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="inflation-cash-slider">{lang === 'ga' ? 'Airgead Tirim' : 'Cash Savings'}</label>
                <span className="font-mono font-bold text-[#0A192F]">€{savingsCashEur.toLocaleString('en-IE')}</span>
              </div>
              <input
                id="inflation-cash-slider"
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={savingsCashEur}
                onChange={(e) => setSavingsCashEur(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="inflation-rate-slider">{lang === 'ga' ? 'Boilsciú / Bliain' : 'Annual Inflation'}</label>
                <span className="font-mono font-bold text-red-600">{inflationRatePct.toFixed(1)}%</span>
              </div>
              <input
                id="inflation-rate-slider"
                type="range"
                min={1}
                max={8}
                step={0.5}
                value={inflationRatePct}
                onChange={(e) => setInflationRatePct(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="inflation-years-slider">{lang === 'ga' ? 'Blianta' : 'Years Ahead'}</label>
                <span className="font-mono font-bold text-[#0A192F]">{inflationHorizonYrs} yrs</span>
              </div>
              <input
                id="inflation-years-slider"
                type="range"
                min={5}
                max={20}
                step={1}
                value={inflationHorizonYrs}
                onChange={(e) => setInflationHorizonYrs(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-slate-500">
                {lang === 'ga' ? 'CUMHACHT CEANNAIGH INNIU' : 'BUYING POWER TODAY'}
              </div>
              <div className="text-2xl font-bold font-mono text-[#006B3F] mt-1">
                €{savingsCashEur.toLocaleString('en-IE')}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-amber-700">
                {lang === 'ga' ? 'TAR ÉIS 5 BLIANA' : 'IN 5 YEARS'}
              </div>
              <div className="text-2xl font-bold font-mono text-[#0A192F] mt-1">
                €{Math.round(realValue5Yrs).toLocaleString('en-IE')}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-red-200 bg-red-50/60">
              <div className="text-xs font-bold text-red-700">
                {lang === 'ga' ? `TAR ÉIS ${inflationHorizonYrs} BLIANA` : `IN ${inflationHorizonYrs} YEARS`}
              </div>
              <div className="text-2xl font-bold font-mono text-red-700 mt-1">
                €{Math.round(realValueHorizon).toLocaleString('en-IE')}
              </div>
              <div className="text-xs text-red-800 mt-1">
                {lang === 'ga' ? 'Cailleadh:' : 'Lost buying power:'} -€{Math.round(purchasingPowerLost).toLocaleString('en-IE')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PENSION TAX RELIEF OPTIMIZER */}
      {activeSubTab === 'pension' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#0A192F]">
              {lang === 'ga'
                ? 'Conas €100 a Chur i do Phinsean ar Chostas €60 Duitse'
                : 'How Top-Rate Taxpayers Get €100 in Their Pension for Only €60'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ga'
                ? 'Nuair a chuireann tú airgead i bpinsean in Éirinn, ní ghearrann Revenue cáin ioncaim air.'
                : 'In Ireland, pension contributions come out before Income Tax—so Revenue effectively pays up to 40% of it for you.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F4F6F9] p-4 rounded-2xl border border-slate-200 items-center">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="pension-contrib-slider">{lang === 'ga' ? 'Isteach sa Phinsean' : 'Monthly Into Pension'}</label>
                <span className="font-mono font-bold text-[#006B3F]">€{monthlyPensionGrossEur}/mo</span>
              </div>
              <input
                id="pension-contrib-slider"
                type="range"
                min={50}
                max={1000}
                step={25}
                value={monthlyPensionGrossEur}
                onChange={(e) => setMonthlyPensionGrossEur(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1.5">
                {lang === 'ga' ? 'Do Ráta Cánach' : 'Your Income Tax Rate'}
              </div>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-200/80 dark:bg-[#0A192F] rounded-full">
                {[40 as const, 20 as const].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setMarginalTaxRate(rate)}
                    className={`min-h-[32px] inline-flex items-center justify-center px-3 py-1 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                      marginalTaxRate === rate
                        ? 'bg-[#006B3F] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
                    }`}
                  >
                    <span>{rate}% Tax Rate</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <label htmlFor="pension-years-slider">{lang === 'ga' ? 'Blianta Fáis' : 'Years Growing'}</label>
                <span className="font-mono font-bold text-[#0A192F]">{pensionYears} yrs</span>
              </div>
              <input
                id="pension-years-slider"
                type="range"
                min={5}
                max={35}
                step={1}
                value={pensionYears}
                onChange={(e) => setPensionYears(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white">
              <div className="text-xs font-bold text-slate-500">
                {lang === 'ga' ? '1. DO CHOSTAS GLAN' : '1. WHAT IT COSTS YOUR PAYSLIP'}
              </div>
              <div className="text-2xl font-bold font-mono text-[#0A192F] mt-1">
                €{netMonthlyCostToUser.toFixed(0)} / mo
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-[#006B3F] bg-[#006B3F]/5">
              <div className="text-xs font-bold text-[#006B3F]">
                {lang === 'ga' ? `2. BÓNAS REVENUE (${marginalTaxRate}%)` : `2. TAX SAVED (${marginalTaxRate}% RELIEF)`}
              </div>
              <div className="text-2xl font-bold font-mono text-[#006B3F] mt-1">
                +€{monthlyTaxSaved.toFixed(0)} / mo
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A192F] text-white">
              <div className="text-xs font-bold text-[#F7931A]">
                {lang === 'ga' ? `3. POTA TAR ÉIS ${pensionYears} BLIANA` : `3. ESTIMATED POT IN ${pensionYears} YRS`}
              </div>
              <div className="text-2xl font-bold font-mono text-[#F7931A] mt-1">
                €{Math.round(futurePensionPot).toLocaleString('en-IE')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
