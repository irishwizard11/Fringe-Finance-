import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Sliders,
  Coins,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { Language } from '../data/i18n';

interface DepositTranche {
  txid: string;
  date: string;
  btcAmount: number;
  priceEurAtTx: number;
  currentValueEur: number;
  roiPct: number;
}

interface AddressAnalyticsPayload {
  address: string;
  labelEn: string;
  labelGa: string;
  formatEn: string;
  formatGa: string;
  source: string;
  spotPriceEur: number;
  balanceBtc: number;
  balanceSats: number;
  unconfirmedDeltaSats: number;
  totalReceivedBtc: number;
  totalSentBtc: number;
  txCount: number;
  utxoCount: number;
  dcaAveragePriceEur: number;
  estimatedCostBasisEur: number;
  currentValueEur: number;
  unrealizedProfitEur: number;
  roiPct: number;
  recentDeposits: DepositTranche[];
}

interface BitcoinAddressMonitorProps {
  lang: Language;
}

const SAMPLE_ADDRESSES = [
  {
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    labelEn: 'Sample DCA Cold Wallet (bc1q)',
    labelGa: 'Sampla Sparán DCA (bc1q)',
  },
  {
    address: 'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297',
    labelEn: 'Taproot Vault (bc1p)',
    labelGa: 'Cruinneachán Taproot (bc1p)',
  },
  {
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    labelEn: 'Satoshi Genesis Block (1A1z...)',
    labelGa: 'Bloc Geinisis Satoshi (1A1z...)',
  },
];

export const BitcoinAddressMonitor: React.FC<BitcoinAddressMonitorProps> = ({ lang }) => {
  const [addressInput, setAddressInput] = useState<string>(SAMPLE_ADDRESSES[0].address);
  const [data, setData] = useState<AddressAnalyticsPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Optional user override for DCA Average Price (€ / BTC) and simulated BTC balance if inspecting a 0-balance address
  const [customDcaPriceEur, setCustomDcaPriceEur] = useState<number | null>(null);
  const [customBtcHoldings, setCustomBtcHoldings] = useState<number | null>(null);

  const fetchAddressAnalytics = useCallback(async (targetAddress: string) => {
    const clean = targetAddress.trim();
    if (!clean) return;

    setLoading(true);
    setError(null);
    setCustomDcaPriceEur(null);
    setCustomBtcHoldings(null);

    try {
      const res = await fetch(`/api/bitcoin-address/${encodeURIComponent(clean)}`, {
        headers: { Accept: 'application/json' },
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(
          json.error ||
            (lang === 'ga'
              ? 'Seoladh Bitcoin neamhbhailí.'
              : 'Invalid Bitcoin address format.')
        );
      }
      setData(json);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : lang === 'ga'
          ? 'Níorbh fhéidir sonraí an tseolta a fháil.'
          : 'Unable to load address analytics.'
      );
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchAddressAnalytics(SAMPLE_ADDRESSES[0].address);
  }, [fetchAddressAnalytics]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAddressAnalytics(addressInput);
  };

  const handleCopyAddress = () => {
    if (!data?.address) return;
    navigator.clipboard?.writeText(data.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Effective metrics (uses on-chain data by default, or user's custom DCA override)
  const spotEur = data?.spotPriceEur ?? 82500;
  const effectiveBtc =
    customBtcHoldings !== null ? customBtcHoldings : data?.balanceBtc ?? 0;
  const effectiveSats = Math.round(effectiveBtc * 100_000_000);
  const effectiveDcaPriceEur =
    customDcaPriceEur !== null
      ? customDcaPriceEur
      : data?.dcaAveragePriceEur ?? Math.round(spotEur * 0.6);

  const effectiveCostBasisEur = effectiveBtc * effectiveDcaPriceEur;
  const effectiveCurrentValueEur = effectiveBtc * spotEur;
  const effectiveProfitEur = effectiveCurrentValueEur - effectiveCostBasisEur;
  const effectiveRoiPct =
    effectiveCostBasisEur > 0
      ? ((effectiveProfitEur / effectiveCostBasisEur) * 100)
      : 0;

  // Irish 33% CGT Estimate (after €1,270 annual tax-free exemption)
  const taxableGainEur = Math.max(0, effectiveProfitEur - 1270);
  const estimatedIrishCgtEur = taxableGainEur * 0.33;
  const netAfterIrishCgtEur = effectiveCurrentValueEur - estimatedIrishCgtEur;

  const isPositiveRoi = effectiveProfitEur >= 0;

  return (
    <div className="bg-white dark:bg-[#0D1F38] rounded-3xl border border-slate-200/90 dark:border-[#1E3A5F] p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-[#1E3A5F]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#F7931A]">
            <Activity className="w-4 h-4 shrink-0" />
            <span>
              {lang === 'ga'
                ? 'ANAILÍSÍOCHT AR SHLABHRA · ROI & PRAGHAS MEÁNACH DCA'
                : 'ON-CHAIN WALLET ANALYTICS · ROI & DCA AVERAGE PRICE'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0A192F] dark:text-white">
            {lang === 'ga'
              ? 'Monatóir Seoladh Bitcoin, Praghas Meánach DCA & Áireamhán ROI'
              : 'Bitcoin Address Monitor: Live Balance, DCA Average Price & ROI'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            {lang === 'ga'
              ? 'Greamaigh aon seoladh poiblí Bitcoin (bc1, 3, nó 1) chun iarmhéid beo, praghas meánach DCA, brabús/caillteanas (ROI %), agus cáin CGC a ríomh.'
              : 'Paste any public Bitcoin address (bc1, 3, or 1) to monitor on-chain balance, weighted DCA average buy price, ROI %, and Irish CGT exposure.'}
          </p>
        </div>

        {/* Sample Address Quick-Fill Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-start">
          {SAMPLE_ADDRESSES.map((sample) => {
            const isCurrent = addressInput.trim() === sample.address;
            return (
              <button
                key={sample.address}
                type="button"
                onClick={() => {
                  setAddressInput(sample.address);
                  fetchAddressAnalytics(sample.address);
                }}
                className={`min-h-[34px] px-3 py-1.5 rounded-full text-xs font-bold border transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0A192F] text-white border-[#0A192F] dark:bg-[#F7931A] dark:text-[#0A192F] dark:border-[#F7931A]'
                    : 'bg-slate-100 dark:bg-[#0A192F] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1E3A5F] hover:border-[#F7931A]'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-[#F7931A] dark:text-current shrink-0" />
                <span className="truncate">
                  {lang === 'ga' ? sample.labelGa : sample.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Address Input Bar */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            maxLength={100}
            spellCheck={false}
            placeholder={
              lang === 'ga'
                ? 'Greamaigh seoladh Bitcoin anseo (m.sh. bc1q... nó 1A1z...)'
                : 'Paste Bitcoin address here (e.g. bc1q..., bc1p..., 3..., or 1...)'
            }
            className="w-full h-11 pl-4 pr-10 text-xs sm:text-sm font-mono bg-[#F4F6F9] dark:bg-[#0A192F] text-[#0A192F] dark:text-white border border-slate-300 dark:border-[#1E3A5F] rounded-full focus:outline-2 focus:outline-[#006B3F]"
          />
          {data?.address && (
            <button
              type="button"
              onClick={handleCopyAddress}
              title={lang === 'ga' ? 'Cóipeáil an seoladh' : 'Copy address'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded-full text-slate-400 hover:text-[#0A192F] dark:hover:text-white cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#006B3F]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !addressInput.trim()}
          className="btn-google-amber h-11 !px-5 shrink-0 justify-center disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          ) : (
            <Search className="w-4 h-4 shrink-0" />
          )}
          <span>
            {loading
              ? lang === 'ga'
                ? 'Ag Fíorú...'
                : 'Scanning...'
              : lang === 'ga'
              ? 'Anailísigh Seoladh'
              : 'Analyze Address'}
          </span>
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Address Metadata Bar */}
          <div className="p-3.5 rounded-2xl bg-[#0A192F] text-white flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="px-2.5 py-1 rounded-full bg-[#006B3F] text-white font-mono font-bold text-[11px]">
                {lang === 'ga' ? data.formatGa : data.formatEn}
              </span>
              <span className="font-semibold text-slate-200 truncate">
                {lang === 'ga' ? data.labelGa : data.labelEn}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-slate-300">
              <span>
                {lang === 'ga' ? 'Praghas Beo BTC:' : 'Live BTC Spot:'}{' '}
                <strong className="text-[#F7931A]">
                  €{spotEur.toLocaleString('en-IE', { maximumFractionDigits: 0 })}
                </strong>
              </span>
              <span>
                {lang === 'ga' ? 'Idirbhearta:' : 'Transactions:'}{' '}
                <strong className="text-white">{data.txCount.toLocaleString('en-IE')}</strong>
              </span>
              <span>
                UTXOs: <strong className="text-emerald-400">{data.utxoCount}</strong>
              </span>
            </div>
          </div>

          {/* 4 Core KPI Analytics Cards: Holdings, DCA Average Buy Price, Total Cost vs Value, Total ROI % */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: On-Chain Balance */}
            <div className="p-4 rounded-2xl bg-[#F4F6F9] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F] space-y-1">
              <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                {lang === 'ga' ? '1. IARMHÉID BITCOIN' : '1. BITCOIN BALANCE'}
              </div>
              <div className="text-xl font-bold font-mono text-[#0A192F] dark:text-white tabular-nums">
                {effectiveBtc.toFixed(6)} BTC
              </div>
              <div className="text-xs font-mono text-[#F7931A] font-semibold tabular-nums">
                {effectiveSats.toLocaleString('en-IE')} sats
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                {lang === 'ga' ? 'Faighte iomlán:' : 'Total received:'} {data.totalReceivedBtc.toFixed(4)} BTC
              </div>
            </div>

            {/* Card 2: DCA Average Buy Price */}
            <div className="p-4 rounded-2xl bg-[#F4F6F9] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F] space-y-1">
              <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                {lang === 'ga' ? '2. PRAGHAS MEÁNACH DCA' : '2. DCA AVERAGE BUY PRICE'}
              </div>
              <div className="text-xl font-bold font-mono text-[#0A192F] dark:text-white tabular-nums">
                €{effectiveDcaPriceEur.toLocaleString('en-IE', { maximumFractionDigits: 0 })}
                <span className="text-xs font-normal text-slate-500"> / BTC</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {lang === 'ga' ? 'Costas Infheistithe:' : 'Total Cost Basis:'}{' '}
                <strong className="font-mono">
                  €{Math.round(effectiveCostBasisEur).toLocaleString('en-IE')}
                </strong>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                {spotEur >= effectiveDcaPriceEur
                  ? lang === 'ga'
                    ? '✓ Praghas an mhargaidh os cionn do mheáin'
                    : '✓ Spot price is above your DCA average'
                  : lang === 'ga'
                  ? 'Praghas an mhargaidh faoi bhun do mheáin'
                  : 'Spot price is below your DCA average'}
              </div>
            </div>

            {/* Card 3: Current EUR Value & Unrealized PnL */}
            <div className="p-4 rounded-2xl bg-[#F4F6F9] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F] space-y-1">
              <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                {lang === 'ga' ? '3. LUACH BEO & BRABÚS (€)' : '3. LIVE VALUE & UNREALIZED P&L'}
              </div>
              <div className="text-xl font-bold font-mono text-[#006B3F] dark:text-emerald-400 tabular-nums">
                €{Math.round(effectiveCurrentValueEur).toLocaleString('en-IE')}
              </div>
              <div
                className={`text-xs font-mono font-bold tabular-nums ${
                  isPositiveRoi ? 'text-[#006B3F] dark:text-emerald-400' : 'text-red-600'
                }`}
              >
                {isPositiveRoi ? '+' : ''}€{Math.round(effectiveProfitEur).toLocaleString('en-IE')}{' '}
                {lang === 'ga' ? 'brabús' : 'net gain'}
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                {lang === 'ga' ? 'Glan tar éis 33% CGC:' : 'Net after 33% Irish CGT:'}{' '}
                <strong className="font-mono">
                  €{Math.round(netAfterIrishCgtEur).toLocaleString('en-IE')}
                </strong>
              </div>
            </div>

            {/* Card 4: Return on Investment (ROI %) */}
            <div
              className={`p-4 rounded-2xl border-2 space-y-1 ${
                isPositiveRoi
                  ? 'bg-[#006B3F]/6 border-[#006B3F] dark:bg-[#006B3F]/15'
                  : 'bg-red-50/70 border-red-300 dark:bg-red-950/30'
              }`}
            >
              <div className="text-[11px] font-mono font-bold text-[#006B3F] dark:text-emerald-400 uppercase">
                {lang === 'ga' ? '4. TORADH AR INFHEISTÍOCHT (ROI)' : '4. TOTAL RETURN (ROI %)'}
              </div>
              <div className="flex items-center gap-1.5">
                {isPositiveRoi ? (
                  <TrendingUp className="w-5 h-5 text-[#006B3F] dark:text-emerald-400 shrink-0" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span
                  className={`text-2xl font-bold font-mono tabular-nums ${
                    isPositiveRoi ? 'text-[#006B3F] dark:text-emerald-400' : 'text-red-600'
                  }`}
                >
                  {isPositiveRoi ? '+' : ''}
                  {effectiveRoiPct.toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-200">
                {lang === 'ga' ? 'CGC measta má dhíoltar:' : 'Est. 33% CGT if sold:'}{' '}
                <strong className="font-mono">
                  €{Math.round(estimatedIrishCgtEur).toLocaleString('en-IE')}
                </strong>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                {lang === 'ga'
                  ? '€1,270 díolúine bhliantúil san áireamh'
                  : 'Includes €1,270 annual CGT exemption'}
              </div>
            </div>
          </div>

          {/* Interactive DCA Average Buy Price & Holdings Customizer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F6F9] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0A192F] dark:text-white">
                <Sliders className="w-4 h-4 text-[#F7931A] shrink-0" />
                <span>
                  {lang === 'ga'
                    ? 'Simléir DCA Pearsanta: Coigeartaigh Do Phraghas Meánach Ceannaigh féin'
                    : 'Custom DCA Cost-Basis Tuner: Test Your Own Average Buy Price & Holdings'}
                </span>
              </div>
              {(customDcaPriceEur !== null || customBtcHoldings !== null) && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomDcaPriceEur(null);
                    setCustomBtcHoldings(null);
                  }}
                  className="min-h-[28px] px-3 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-[#0F2342] border border-slate-300 dark:border-[#1E3A5F] text-slate-700 dark:text-slate-200 hover:border-[#F7931A] cursor-pointer"
                >
                  {lang === 'ga' ? 'Athshocraigh go Sonraí Slabhra' : 'Reset to On-Chain Estimate'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <label htmlFor="dca-avg-price-slider">
                    {lang === 'ga'
                      ? 'Do Phraghas Meánach DCA (€ / BTC):'
                      : 'Your DCA Average Buy Price (€ / BTC):'}
                  </label>
                  <span className="font-mono font-bold text-[#006B3F] dark:text-emerald-400">
                    €{effectiveDcaPriceEur.toLocaleString('en-IE')}
                  </span>
                </div>
                <input
                  id="dca-avg-price-slider"
                  type="range"
                  min={5000}
                  max={120000}
                  step={500}
                  value={effectiveDcaPriceEur}
                  onChange={(e) => setCustomDcaPriceEur(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <label htmlFor="dca-btc-amount-slider">
                    {lang === 'ga'
                      ? 'Méid Bitcoin (BTC) le Samhlú:'
                      : 'Bitcoin Holdings (BTC) to Model:'}
                  </label>
                  <span className="font-mono font-bold text-[#0A192F] dark:text-white">
                    {effectiveBtc.toFixed(4)} BTC
                  </span>
                </div>
                <input
                  id="dca-btc-amount-slider"
                  type="range"
                  min={0.01}
                  max={2.5}
                  step={0.01}
                  value={Math.min(2.5, Math.max(0.01, effectiveBtc || 0.15))}
                  onChange={(e) => setCustomBtcHoldings(Number(e.target.value))}
                  className="w-full cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* On-Chain Deposit Tranches & DCA History Table */}
          {data.recentDeposits && data.recentDeposits.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#0A192F] dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#006B3F]" />
                  <span>
                    {lang === 'ga'
                      ? 'Stair Thaiscí an tSeolta & ROI de réir Tráinse'
                      : 'On-Chain Deposit History & Tranche-by-Tranche DCA Performance'}
                  </span>
                </h4>
                <span className="text-[11px] font-mono text-slate-500">
                  {data.recentDeposits.length}{' '}
                  {lang === 'ga' ? 'thaisce' : 'deposits analyzed'}
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-[#1E3A5F]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-[#0A192F] text-slate-600 dark:text-slate-300 font-mono text-[11px] border-b border-slate-200 dark:border-[#1E3A5F]">
                      <th className="py-2.5 px-3">{lang === 'ga' ? 'Dáta' : 'Date'}</th>
                      <th className="py-2.5 px-3">TXID</th>
                      <th className="py-2.5 px-3 text-right">{lang === 'ga' ? 'Méid BTC' : 'BTC Added'}</th>
                      <th className="py-2.5 px-3 text-right">
                        {lang === 'ga' ? 'Praghas ag an Am' : 'Buy Price (€/BTC)'}
                      </th>
                      <th className="py-2.5 px-3 text-right">
                        {lang === 'ga' ? 'Luach Inniu' : 'Value Today (€)'}
                      </th>
                      <th className="py-2.5 px-3 text-right">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-[#1E3A5F] font-mono">
                    {data.recentDeposits.map((dep, index) => (
                      <tr
                        key={`${dep.txid}-${index}`}
                        className="hover:bg-slate-50/80 dark:hover:bg-white/5"
                      >
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {dep.date}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                          {dep.txid}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#0A192F] dark:text-white whitespace-nowrap">
                          +{dep.btcAmount.toFixed(4)} BTC
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          €{dep.priceEurAtTx.toLocaleString('en-IE', { maximumFractionDigits: 0 })}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-[#006B3F] dark:text-emerald-400 whitespace-nowrap">
                          €{dep.currentValueEur.toLocaleString('en-IE', { maximumFractionDigits: 0 })}
                        </td>
                        <td
                          className={`py-2.5 px-3 text-right font-bold whitespace-nowrap ${
                            dep.roiPct >= 0
                              ? 'text-[#006B3F] dark:text-emerald-400'
                              : 'text-red-600'
                          }`}
                        >
                          {dep.roiPct >= 0 ? '+' : ''}
                          {dep.roiPct.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Privacy & Security Note */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-[#006B3F]/15 border border-[#006B3F]/30 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#006B3F] dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#0A192F] dark:text-white">
                {lang === 'ga' ? 'Riail Slándála & Príobháideachta: ' : 'Read-Only Public Address Safety: '}
              </strong>
              {lang === 'ga'
                ? 'Tá sé 100% sábháilte seoladh poiblí Bitcoin (bc1/3/1) a ghreamú chun iarmhéid a sheiceáil. Ná cuir isteach do Fhrása Síol 12/24 focal ar aon suíomh gréasáin riamh.'
                : 'Pasting a public Bitcoin address (bc1, 3, or 1) is 100% read-only and safe. Never paste your 12-word or 24-word recovery seed phrase into any website.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
