import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Download,
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  Volume2,
  HelpCircle,
  Coins,
  FileText,
  Activity,
} from 'lucide-react';
import { Language, speakIrishText } from '../data/i18n';
import { TermTooltip } from './TermTooltip';
import { BitcoinWhitepaperReader } from './BitcoinWhitepaperReader';
import { BitcoinAddressMonitor } from './BitcoinAddressMonitor';

interface BitcoinHubProps {
  lang: Language;
  initialLesson?: 'basics' | 'whitepaper' | 'custody' | 'monitor' | 'lightning' | 'tax';
  onOpenWhitepaperPage?: () => void;
}

interface CgtTransaction {
  id: string;
  description: string;
  disposalType: 'btc_to_eur' | 'crypto_to_crypto' | 'btc_purchase_goods';
  dateAcquired: string;
  dateDisposed: string;
  costBasisEur: number;
  proceedsEur: number;
  feesEur: number;
}

const INITIAL_TXS: CgtTransaction[] = [
  {
    id: 'tx-1',
    description: 'Sold Bitcoin to Euro',
    disposalType: 'btc_to_eur',
    dateAcquired: '2024-04-12',
    dateDisposed: '2026-06-18',
    costBasisEur: 2000,
    proceedsEur: 4500,
    feesEur: 20,
  },
];

export const BitcoinHub: React.FC<BitcoinHubProps> = ({
  lang,
  initialLesson = 'basics',
  onOpenWhitepaperPage,
}) => {
  // Beginner Sub-View Selector: Includes the Bilingual Bitcoin Whitepaper (Irish & English) & On-Chain Address Monitor
  const [activeLesson, setActiveLesson] = useState<
    'basics' | 'whitepaper' | 'custody' | 'monitor' | 'lightning' | 'tax'
  >(initialLesson);

  useEffect(() => {
    setActiveLesson(initialLesson);
  }, [initialLesson]);

  // Active tab for Monetary Network comparison
  const [activeNetworkTab, setActiveNetworkTab] = useState<'euro' | 'bitcoin' | 'altcoins'>('bitcoin');

  // Self-Custody Simulator Step (1, 2, 3)
  const [custodyStep, setCustodyStep] = useState<1 | 2 | 3>(1);
  const [seedChecklist, setSeedChecklist] = useState<Record<string, boolean>>({
    paperOrSteel: true,
    noCloudPhotos: true,
    verifyReceiveAddress: false,
    neverTypeSeedOnline: true,
  });

  // Irish Bitcoin Tax & Compliance Calculator
  const [transactions, setTransactions] = useState<CgtTransaction[]>(INITIAL_TXS);
  const [newType, setNewType] = useState<CgtTransaction['disposalType']>('btc_to_eur');
  const [newCost, setNewCost] = useState<string>('1000');
  const [newProceeds, setNewProceeds] = useState<string>('2500');

  // On-Chain vs Lightning Visualizer
  const [paymentAmountEur, setPaymentAmountEur] = useState<number>(4.5);

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = Math.max(0, Number(newCost) || 0);
    const proceeds = Math.max(0, Number(newProceeds) || 0);
    const item: CgtTransaction = {
      id: `tx-${Date.now()}`,
      description:
        newType === 'btc_to_eur'
          ? 'Sold BTC for Euro'
          : newType === 'crypto_to_crypto'
          ? 'Swapped Crypto for Another Coin'
          : 'Bought Goods with BTC',
      disposalType: newType,
      dateAcquired: '2025-01-15',
      dateDisposed: '2026-09-15',
      costBasisEur: cost,
      proceedsEur: proceeds,
      feesEur: 10,
    };
    setTransactions((prev) => [...prev, item]);
  };

  const handleDeleteTx = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const totalProceeds = transactions.reduce((sum, t) => sum + t.proceedsEur, 0);
  const totalCostAndFees = transactions.reduce((sum, t) => sum + t.costBasisEur + t.feesEur, 0);
  const netGainBeforeExemptions = totalProceeds - totalCostAndFees;
  const annualExemption = 1270;
  const taxableGain = Math.max(0, netGainBeforeExemptions - annualExemption);
  const cgtPayable = taxableGain * 0.33;

  const handleDownloadCsv = () => {
    const sanitizeCsvCell = (val: string) => {
      const escaped = val.replace(/"/g, '""');
      return /^[=+\-@\t\r]/.test(escaped) ? `"'${escaped}"` : `"${escaped}"`;
    };
    const headers = ['ID', 'Event', 'Type', 'Cost Basis (EUR)', 'Proceeds (EUR)', 'Net Profit (EUR)'];
    const rows = transactions.map((t) => {
      const gain = t.proceedsEur - t.costBasisEur - t.feesEur;
      return [t.id, sanitizeCsvCell(t.description), t.disposalType, t.costBasisEur, t.proceedsEur, gain].join(',');
    });
    rows.push('');
    rows.push(`"Annual Tax-Free Exemption",${annualExemption}`);
    rows.push(`"Taxable Profit",${taxableGain}`);
    rows.push(`"Irish CGT Due (33%)",${cgtPayable.toFixed(2)}`);

    const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emerald-ledger-cgt-bitcoin-summary.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Beginner Header & 5 Bite-Sized Lesson Pills (Including Bilingual Whitepaper) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-[#F7931A]">
              {lang === 'ga'
                ? 'Céim 1: Mol Litearthachta Bitcoin, Sparán & Anailís Seoltaí'
                : 'Step 1: Bitcoin Literacy, Self-Custody Wallet & Address Analytics'}
            </div>
            <h2 className="text-2xl font-bold text-[#0A192F] mt-1 tracking-tight">
              {lang === 'ga'
                ? 'Tuig Bitcoin, Féin-Choinneáil, Anailís ROI/DCA & An Páipéar Bán'
                : 'Understand Bitcoin, Self-Custody, Live Address ROI/DCA & The Whitepaper'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 self-start w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveLesson('monitor')}
              className="btn-google-filled w-full sm:w-auto justify-center"
            >
              <Activity className="w-4 h-4 text-[#F7931A] shrink-0" />
              <span className="truncate">
                {lang === 'ga' ? 'Monatóir Seoltaí & ROI' : 'Address & DCA ROI Monitor'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenWhitepaperPage) {
                  onOpenWhitepaperPage();
                } else {
                  setActiveLesson('whitepaper');
                }
              }}
              className="btn-google-amber w-full sm:w-auto justify-center"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span className="truncate">
                {lang === 'ga' ? 'Páipéar Bán (GA/EN)' : 'Bitcoin Whitepaper (GA/EN)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                speakIrishText(
                  'Bitcoin: Córas Airgid Leictreonaigh Piara-go-Piara. Lárnach vs Díláraithe, Féin-Choinneáil agus Frása Síol.',
                  'ga'
                )
              }
              className="btn-google-tonal w-full sm:w-auto justify-center"
            >
              <Volume2 className="w-4 h-4 text-[#F7931A] shrink-0" />
              <span className="truncate">{lang === 'ga' ? 'Éist i nGaeilge' : 'Hear Gaeilge Terms'}</span>
            </button>
          </div>
        </div>

        {/* Plain-Language Intro Box */}
        <div className="p-4 rounded-2xl bg-[#F4F6F9] border border-slate-200/80 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-[#F7931A] shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 leading-relaxed">
            {lang === 'ga' ? (
              <>
                <strong>An Buneolas Simplí:</strong> Is airgead digiteach <TermTooltip termKey="decentralized" lang={lang} /> é Bitcoin le teorainn dhocht de <strong>21 milliún bonn</strong>. Greamaigh aon seoladh Bitcoin chun <strong>Meánphraghas DCA, ROI %, agus iarmhéid ar an mblocshlabhra</strong> a sheiceáil beo, nó cleachtaigh <TermTooltip termKey="self_custody" lang={lang} />.
              </>
            ) : (
              <>
                <strong>The Simple Version:</strong> Bitcoin is scarce digital money on a <TermTooltip termKey="decentralized" lang={lang} /> network capped at <strong>21 million coins</strong>. Paste any Bitcoin address to inspect <strong>live on-chain balance, DCA average buy price, and ROI %</strong>, or practice <TermTooltip termKey="self_custody" lang={lang} />.
              </>
            )}
          </p>
        </div>

        {/* 6 Bite-Sized Google Material 3 Pill Tabs — Concentric Shape Alignment */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 items-stretch gap-1.5 p-1.5 bg-slate-100 dark:bg-[#0A192F] rounded-2xl w-full border border-slate-200/70 dark:border-[#1E3A5F]">
          {[
            { id: 'basics' as const, icon: Coins, en: '1. Why 21M?', ga: '1. Cén Fáth 21M?' },
            { id: 'whitepaper' as const, icon: FileText, en: '2. Whitepaper', ga: '2. Páipéar Bán' },
            { id: 'custody' as const, icon: KeyRound, en: '3. Wallets & Keys', ga: '3. Sparáin' },
            { id: 'monitor' as const, icon: Activity, en: '4. Address & ROI', ga: '4. Seoladh & ROI' },
            { id: 'lightning' as const, icon: Zap, en: '5. Lightning Pay', ga: '5. Lightning' },
            { id: 'tax' as const, icon: ShieldCheck, en: '6. CGT Calculator', ga: '6. Áireamhán CGC' },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === 'whitepaper' && onOpenWhitepaperPage) {
                    onOpenWhitepaperPage();
                  } else {
                    setActiveLesson(tab.id);
                  }
                }}
                className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer overflow-hidden ${
                  activeLesson === tab.id
                    ? 'bg-[#0A192F] dark:bg-[#F7931A] text-white dark:text-[#0A192F] shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    activeLesson === tab.id ? 'text-[#F7931A] dark:text-[#0A192F]' : 'text-[#F7931A]'
                  }`}
                />
                <span className="truncate">{lang === 'ga' ? tab.ga : tab.en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* LESSON 4: ON-CHAIN BITCOIN ADDRESS & DCA ROI ANALYTICS MONITOR */}
      {activeLesson === 'monitor' && <BitcoinAddressMonitor lang={lang} />}

      {/* LESSON 2: BILINGUAL BITCOIN WHITEPAPER READER (IRISH & ENGLISH) */}
      {activeLesson === 'whitepaper' && <BitcoinWhitepaperReader lang={lang} />}

      {/* LESSON 1: EURO VS BITCOIN VS ALTCOINS */}
      {activeLesson === 'basics' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A192F]">
                {lang === 'ga'
                  ? 'Cad é an difríocht idir an Euro, Bitcoin, agus Altcoins?'
                  : 'How Does Bitcoin Differ from Euros and Other Crypto Coins?'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ga'
                  ? 'Brúigh ar gach cnaipe chun achoimre shimplí 3 phointe a fheiceáil.'
                  : 'Click each option below for a plain-English 3-point summary.'}
              </p>
            </div>

            <div className="grid grid-cols-3 items-stretch gap-1 p-1 bg-slate-100 dark:bg-[#0A192F] border border-slate-200/70 dark:border-[#1E3A5F] rounded-xl w-full sm:w-auto">
              {[
                { id: 'euro', en: 'Euro (€)', ga: 'Euro (€)' },
                { id: 'bitcoin', en: 'Bitcoin (BTC)', ga: 'Bitcoin (BTC)' },
                { id: 'altcoins', en: 'Other Coins', ga: 'Coineanna Eile' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveNetworkTab(t.id as 'euro' | 'bitcoin' | 'altcoins')}
                  className={`min-h-[34px] inline-flex items-center justify-center px-2.5 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center truncate ${
                    activeNetworkTab === t.id
                      ? 'bg-[#006B3F] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{lang === 'ga' ? t.ga : t.en}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeNetworkTab === 'euro' && (
              <>
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">
                    {lang === 'ga' ? 'CÉ A RIALAÍONN É?' : 'WHO CONTROLS IT?'}
                  </div>
                  <div className="text-base font-bold text-[#0A192F] mt-1">
                    {lang === 'ga' ? 'An Banc Ceannais (Lárnach)' : 'Central Banks & Commercial Banks'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ga'
                      ? 'Is féidir leis an mBanc Ceannais Eorpach níos mó airgid a chruthú am ar bith.'
                      : 'The European Central Bank controls the supply and can print more money when needed.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">
                    {lang === 'ga' ? 'COSAINT' : 'SAFETY NET'}
                  </div>
                  <div className="text-base font-bold text-[#006B3F] mt-1">
                    {lang === 'ga' ? 'Ráthaíocht €100,000' : 'Protected up to €100,000'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ga'
                      ? 'Cosnaíonn Scéim Ráthaíochta Taiscí na hÉireann do chuntas bainc.'
                      : 'Irish bank deposits are insured up to €100,000 per bank by the Deposit Guarantee Scheme.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">
                    {lang === 'ga' ? 'ÚSÁID IS FEARR' : 'BEST USED FOR'}
                  </div>
                  <div className="text-base font-bold text-[#0A192F] mt-1">
                    {lang === 'ga' ? 'Billí Laethúla & Ciste Éigeandála' : 'Everyday Bills & Emergency Cash'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ga'
                      ? 'An rogha ceart le haghaidh cíosa, grósaeireachta agus coigilteas gearrthéarmach.'
                      : 'Best for paying rent, groceries, taxes, and keeping 3–6 months of emergency expenses.'}
                  </p>
                </div>
              </>
            )}

            {activeNetworkTab === 'bitcoin' && (
              <>
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">
                    {lang === 'ga' ? 'SOLÁTHAR' : 'HOW MUCH EXISTS?'}
                  </div>
                  <div className="text-base font-bold text-[#F7931A] font-mono mt-1">
                    {lang === 'ga' ? '21 Milliún go Deo' : 'Strictly 21 Million Max'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ga'
                      ? 'Ní féidir le haon duine níos mó Bitcoin a chruthú os cionn 21 milliún.'
                      : 'Nobody can ever print extra Bitcoin—making it scarce like digital gold.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">
                    {lang === 'ga' ? 'SMACHT' : 'WHO CONTROLS IT?'}
                  </div>
                  <div className="text-base font-bold text-[#0A192F] mt-1">
                    {lang === 'ga' ? 'Díláraithe (Gan POF)' : 'No CEO, No Central Bank'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ga'
                      ? 'Ritheann sé ar na mílte ríomhairí poiblí ar fud an domhain.'
                      : 'Verified by thousands of independent computers worldwide—you can hold it yourself.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">
                    {lang === 'ga' ? 'CÁIN IN ÉIRINN' : 'IRISH TAX RULE'}
                  </div>
                  <div className="text-base font-bold text-[#006B3F] mt-1">
                    {lang === 'ga' ? '33% CGC nuair a dhíoltar é' : '33% CGT When You Sell'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ga'
                      ? 'Níl aon cháin le híoc fad is a choinníonn tú é; €1,270 saor ó cháin nuair a dhíolann tú.'
                      : 'No tax while holding. When you sell for profit, the first €1,270/year is tax-free.'}
                  </p>
                </div>
              </>
            )}

            {activeNetworkTab === 'altcoins' && (
              <>
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">
                    {lang === 'ga' ? 'CAD IAD FÉIN?' : 'WHAT ARE THEY?'}
                  </div>
                  <div className="text-base font-bold text-[#0A192F] mt-1">
                    {lang === 'ga' ? 'Tionscadail Tech / Comharthaí' : 'Company / App Tokens'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ga'
                      ? 'Cruthaithe ag cuideachtaí príobháideacha—níos cosúla le scaireanna ard-riosca.'
                      : 'Usually created by private startups or founders—much higher risk than Bitcoin.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">
                    {lang === 'ga' ? 'PRÍOMH-RIOSCA' : 'MAIN RISK'}
                  </div>
                  <div className="text-base font-bold text-amber-700 mt-1">
                    {lang === 'ga' ? 'Luaineacht & Scaimeanna' : 'Hacks & “Rug-Pulls”'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ga'
                      ? 'Bíonn go leor bonn nua mar chuid de scaimeanna margaíochta.'
                      : 'Many hyped tokens lose 90%+ of their value or suffer smart-contract bugs.'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200">
                  <div className="text-xs font-bold text-slate-500">
                    {lang === 'ga' ? 'GAISTE CÁNACH' : 'IRISH TAX TRAP'}
                  </div>
                  <div className="text-base font-bold text-red-600 mt-1">
                    {lang === 'ga' ? 'Gearrtar Cáin ar Gach Babhtáil' : 'Swapping Coins = Taxable'}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {lang === 'ga'
                      ? 'In Éirinn, má bhabhtálann tú bonn amháin ar bhonn eile, is ócáid chánach CGC é.'
                      : 'In Ireland, trading one crypto coin for another triggers Capital Gains Tax immediately.'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* LESSON 2: SELF-CUSTODY SIMULATOR */}
      {activeLesson === 'custody' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A192F]">
                {lang === 'ga'
                  ? 'Conas Bitcoin a Choinneáil Sábháilte (Féin-Choinneáil)'
                  : 'How to Hold Bitcoin Safely Yourself (Self-Custody)'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ga' ? '3 chéim shimplí:' : 'Click through these 3 simple steps:'}
              </p>
            </div>

            <div className="grid grid-cols-3 items-stretch gap-1 p-1 bg-slate-100 dark:bg-[#0A192F] border border-slate-200/70 dark:border-[#1E3A5F] rounded-xl w-full sm:w-auto">
              {[
                { step: 1 as const, en: '1. Keys', ga: '1. Eochair' },
                { step: 2 as const, en: '2. Cold Wallet', ga: '2. Sparán Fuar' },
                { step: 3 as const, en: '3. 12 Words', ga: '3. 12 Fhocal' },
              ].map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setCustodyStep(s.step)}
                  className={`min-h-[34px] inline-flex items-center justify-center px-2.5 sm:px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center truncate ${
                    custodyStep === s.step
                      ? 'bg-[#006B3F] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{lang === 'ga' ? s.ga : s.en}</span>
                </button>
              ))}
            </div>
          </div>

          {custodyStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#F4F6F9] border border-[#006B3F]">
                <div className="text-xs font-mono font-bold text-[#006B3F]">
                  {lang === 'ga' ? '1. DO SHEOLADH POIBLÍ (AN BOSCA POIST)' : '1. YOUR PUBLIC ADDRESS (THE MAILBOX)'}
                </div>
                <div className="text-base font-bold text-[#0A192F] mt-1">
                  {lang === 'ga' ? 'Sábháilte le roinnt le haon duine' : 'Safe to Share with Anyone'}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {lang === 'ga'
                    ? 'Cosúil le d’uimhir IBAN nó bosca poist ar an tsráid—is féidir le daoine airgead a chur isteach ann, ach ní féidir leo é a oscailt.'
                    : 'Works just like your bank IBAN or a locked street mailbox—anyone can drop money in, but nobody can reach inside to take it.'}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0A192F] text-white border border-[#F7931A]">
                <div className="text-xs font-mono font-bold text-[#F7931A]">
                  {lang === 'ga' ? '2. D’EOCHAIR PHRÍOBHÁIDEACH (AN EOCHAIR)' : '2. YOUR PRIVATE KEY (THE MASTER KEY)'}
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {lang === 'ga' ? 'Rúnda — Ná roinn le haon duine riamh!' : 'Secret — Never Share with Anyone!'}
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {lang === 'ga'
                    ? 'Is í seo an eochair a osclaíonn an bosca poist. Aon duine a bhfuil an eochair seo aige, is leis an Bitcoin.'
                    : 'This unlocks your mailbox to spend your funds. Whoever holds this key controls the Bitcoin.'}
                </p>
              </div>
            </div>
          )}

          {custodyStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-red-50/60 border border-red-200">
                <div className="text-xs font-bold text-red-700">
                  {lang === 'ga' ? 'FÁGÁIL AR MHALARTÁN (RIOSCA)' : 'LEAVING COINS ON AN EXCHANGE APP'}
                </div>
                <div className="text-base font-bold text-[#0A192F] mt-1">
                  {lang === 'ga' ? 'Coinníonn an chuideachta d’eochair' : 'The Company Holds Your Keys'}
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {lang === 'ga'
                    ? 'Má théann an malartán i bhféimheacht nó má dhéantar haiceáil air, d’fhéadfá do chuid airgid a chailleadh.'
                    : 'Okay for small amounts, but if the exchange gets hacked or freezes withdrawals, your money is stuck.'}
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#006B3F]/6 border-2 border-[#006B3F]">
                <div className="text-xs font-bold text-[#006B3F]">
                  {lang === 'ga' ? 'SPARÁN CRUA-EARRAÍ (SÁBHÁILTE)' : 'HARDWARE WALLET (COLD STORAGE)'}
                </div>
                <div className="text-base font-bold text-[#0A192F] mt-1">
                  {lang === 'ga' ? 'Coinníonn tusa d’eochair as líne' : 'You Hold the Key Offline'}
                </div>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                  {lang === 'ga'
                    ? 'Gléas beag fisiciúil (cosúil le USB) a choinníonn d’eochair scoite ón idirlíon ionas nach féidir le haon haiceálaí teacht uirthi.'
                    : 'A small physical device that keeps your private key completely offline, safe from computer viruses and exchange collapses.'}
                </p>
              </div>
            </div>
          )}

          {custodyStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                {lang === 'ga'
                  ? 'Nuair a bhunaíonn tú sparán, tugtar liosta de 12 focal duit (“Frása Síol”). Má chailleann tú do ghléas, tugann na 12 focal seo do chuid airgid ar ais duit. Cuir tic sna 4 riail shábháilteachta:'
                  : 'When you set up a wallet, it gives you 12 recovery words (your "Seed Phrase"). If your device breaks, these 12 words restore your money. Tick the 4 safety rules:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                {[
                  {
                    key: 'paperOrSteel',
                    en: 'Write the 12 words on paper or metal—never in computer notes.',
                    ga: 'Scríobh na 12 focal ar pháipéar—ná sábháil ar ríomhaire iad.',
                  },
                  {
                    key: 'noCloudPhotos',
                    en: 'Never take a phone photo or screenshot of your 12 words.',
                    ga: 'Ná tóg grianghraf ar do ghuthán de na 12 focal riamh.',
                  },
                  {
                    key: 'verifyReceiveAddress',
                    en: 'Double-check the address on your device screen before sending.',
                    ga: 'Seiceáil an seoladh ar scáileán an ghléis sula seolann tú.',
                  },
                  {
                    key: 'neverTypeSeedOnline',
                    en: 'Never type your 12 words into any website or support chat.',
                    ga: 'Ná clóscríobh do 12 focal ar aon suíomh gréasáin riamh.',
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setSeedChecklist((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                    }
                    className="h-full p-3.5 rounded-xl border border-slate-200 bg-[#F4F6F9] hover:bg-white flex items-center gap-3 text-left cursor-pointer transition-colors"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        seedChecklist[item.key] ? 'text-[#006B3F]' : 'text-slate-300'
                      }`}
                    />
                    <span className="text-xs font-medium text-[#0A192F] leading-snug">
                      {lang === 'ga' ? item.ga : item.en}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct Wallet Page Address & DCA ROI Analytics Monitor */}
          <div className="pt-4 border-t border-slate-200">
            <BitcoinAddressMonitor lang={lang} />
          </div>
        </div>
      )}

      {/* LESSON 3: ON-CHAIN VS LIGHTNING NETWORK */}
      {activeLesson === 'lightning' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[#0A192F]">
              {lang === 'ga'
                ? 'Cén fáth a n-úsáidtear “Líonra Lightning” le haghaidh caife?'
                : 'Why We Use the “Lightning Network” for Everyday Payments'}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'ga'
                ? 'Tá príomh-bhlocshlabhra Bitcoine cosúil le trucail armúrtha (sábháilte do shuim mhór, ach mall). Is é Lightning an cárta tadhaill láithreach.'
                : 'Bitcoin’s main blockchain is like an armored truck (great for large savings, ~10 mins). Lightning is like tapping your card—instant and nearly free.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F4F6F9] border border-slate-200 max-w-md">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <label htmlFor="coffee-slider">
                {lang === 'ga' ? 'Méid na hÍocaíochta:' : 'Test Payment Amount:'}
              </label>
              <span className="font-mono font-bold text-[#0A192F]">€{paymentAmountEur.toFixed(2)}</span>
            </div>
            <input
              id="coffee-slider"
              type="range"
              min={2}
              max={100}
              step={0.5}
              value={paymentAmountEur}
              onChange={(e) => setPaymentAmountEur(Number(e.target.value))}
              className="w-full accent-bitcoin cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="text-xs font-bold text-slate-500">
                {lang === 'ga' ? 'SRAITH 1: PRÍOMH-BHLOCSHLABHRA' : 'MAIN BITCOIN BLOCKCHAIN (LAYER 1)'}
              </div>
              <div className="text-xl font-bold font-mono text-[#0A192F] mt-1">
                ~10–30 mins · €2.50 Fee
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {lang === 'ga'
                  ? 'Is fearr le haghaidh coigilteas mór fadtéarmach.'
                  : 'Best for moving larger long-term savings into cold storage.'}
              </p>
            </div>

            <div className="p-5 rounded-xl border-2 border-[#F7931A] bg-[#0A192F] text-white">
              <div className="text-xs font-bold text-[#F7931A]">
                {lang === 'ga' ? 'SRAITH 2: LÍONRA LIGHTNING' : 'LIGHTNING NETWORK (LAYER 2)'}
              </div>
              <div className="text-xl font-bold font-mono text-[#F7931A] mt-1">
                Instant (&lt;1 sec) · €0.002 Fee
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'ga'
                  ? `Íoc €${paymentAmountEur.toFixed(2)} ar chaife láithreach gan táille mhór.`
                  : `Pay €${paymentAmountEur.toFixed(2)} for a coffee in milliseconds for a fraction of a cent.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LESSON 4: SIMPLE IRISH BITCOIN TAX CALCULATOR */}
      {activeLesson === 'tax' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-[#0A192F]">
                {lang === 'ga'
                  ? 'Áireamhán Simplí CGC Bitcoine (33%)'
                  : 'Simple Irish Bitcoin Tax Calculator (33% CGT)'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'ga'
                  ? 'Cuir isteach an méid a d’íoc tú agus an méid ar dhíol tú é—tá an chéad €1,270 de bhrabús saor ó cháin.'
                  : 'Enter what you paid and what you sold for—remember your first €1,270 of profit each year is tax-free!'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="btn-google-filled self-start shrink-0"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>{lang === 'ga' ? 'Íoslódáil CSV' : 'Download Revenue CSV'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <form
                onSubmit={handleAddTx}
                className="p-4 rounded-2xl bg-[#F4F6F9] border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {lang === 'ga' ? 'Cineál' : 'What did you do?'}
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CgtTransaction['disposalType'])}
                    className="h-9 w-full px-2.5 text-xs bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="btc_to_eur">{lang === 'ga' ? 'Díol go Euro' : 'Sold for Euro'}</option>
                    <option value="crypto_to_crypto">{lang === 'ga' ? 'Babhtáil Cripte' : 'Swapped Coins'}</option>
                    <option value="btc_purchase_goods">{lang === 'ga' ? 'Ceannach Earra' : 'Spent BTC'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {lang === 'ga' ? 'Cheannaigh tú ar (€)' : 'You Paid (€)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="h-9 w-full px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    {lang === 'ga' ? 'Dhíol tú ar (€)' : 'Sold Value (€)'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newProceeds}
                    onChange={(e) => setNewProceeds(e.target.value)}
                    className="h-9 w-full px-2.5 text-xs font-mono bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="h-9 px-3 text-xs font-bold text-white bg-[#0A192F] hover:bg-slate-800 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer w-full"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'ga' ? 'Cuir Leis' : 'Add'}</span>
                </button>
              </form>

              <div className="space-y-2">
                {transactions.map((t) => {
                  const net = t.proceedsEur - t.costBasisEur - t.feesEur;
                  return (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[#0A192F] truncate">{t.description}</div>
                        <div className="text-slate-500 font-mono truncate">
                          Paid €{t.costBasisEur.toLocaleString('en-IE')} → Sold €{t.proceedsEur.toLocaleString('en-IE')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="font-mono font-bold text-[#006B3F]">
                          Profit: €{net.toLocaleString('en-IE')}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteTx(t.id)}
                          className="w-7 h-7 inline-flex items-center justify-center rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4 shrink-0" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-xl bg-[#0A192F] text-white space-y-3">
              <div className="text-xs font-mono text-[#F7931A] font-bold">
                {lang === 'ga' ? 'DO RÍOMH CÁNACH SHIMPLÍ' : 'YOUR SIMPLE TAX SUMMARY'}
              </div>
              <div className="space-y-1.5 text-xs font-mono border-b border-slate-800 pb-3">
                <div className="flex justify-between text-slate-300">
                  <span>{lang === 'ga' ? 'Brabús Iomlán:' : 'Total Profit:'}</span>
                  <span>€{Math.max(0, netGainBeforeExemptions).toLocaleString('en-IE')}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>{lang === 'ga' ? 'Saor ó Cháin (€1,270):' : 'Tax-Free Allowance:'}</span>
                  <span>-€{annualExemption.toLocaleString('en-IE')}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1">
                  <span>{lang === 'ga' ? 'Brabús Inchánach:' : 'Taxable Amount:'}</span>
                  <span>€{taxableGain.toLocaleString('en-IE')}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-300">
                  {lang === 'ga' ? 'Cáin 33% CGC le hÍoc:' : '33% CGT Tax Due:'}
                </div>
                <div className="text-2xl font-bold font-mono text-[#F7931A] mt-0.5">
                  €{cgtPayable.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
