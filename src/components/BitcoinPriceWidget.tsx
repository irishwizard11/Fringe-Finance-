import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Language } from '../data/i18n';

interface BitcoinPriceData {
  priceEur: number;
  change24hPct: number | null;
  satsPerEuro: number;
  source: string;
  updatedAt: string;
}

interface BitcoinPriceWidgetProps {
  lang: Language;
  onClick?: () => void;
}

export const BitcoinPriceWidget: React.FC<BitcoinPriceWidgetProps> = ({ lang, onClick }) => {
  const [priceData, setPriceData] = useState<BitcoinPriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showSatsPerEur, setShowSatsPerEur] = useState<boolean>(false);
  const [flashDirection, setFlashDirection] = useState<'up' | 'down' | null>(null);
  const prevPriceRef = useRef<number | null>(null);

  const fetchLiveBitcoinPrice = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);

    const applyUpdate = (next: BitcoinPriceData) => {
      if (prevPriceRef.current !== null && prevPriceRef.current !== next.priceEur) {
        setFlashDirection(next.priceEur > prevPriceRef.current ? 'up' : 'down');
        setTimeout(() => setFlashDirection(null), 1200);
      }
      prevPriceRef.current = next.priceEur;
      setPriceData(next);
      setLoading(false);
      setRefreshing(false);
    };

    // 1. Fetch from server-side /api/bitcoin-price proxy (avoids CORS & rate limits)
    try {
      const response = await fetch('/api/bitcoin-price', {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        if (typeof data?.priceEur === 'number' && data.priceEur > 0) {
          applyUpdate({
            priceEur: data.priceEur,
            change24hPct: typeof data.change24hPct === 'number' ? data.change24hPct : null,
            satsPerEuro:
              typeof data.satsPerEuro === 'number'
                ? data.satsPerEuro
                : Math.round(100_000_000 / data.priceEur),
            source: data.source || 'Live API',
            updatedAt: data.updatedAt || new Date().toISOString(),
          });
          return;
        }
      }
    } catch {
      // Fallback to direct client fetch if needed
    }

    // 2. Client-side fallback: CoinGecko Simple Price EUR
    try {
      const cgRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true'
      );
      if (cgRes.ok) {
        const cgData = await cgRes.json();
        const eur = Number(cgData?.bitcoin?.eur);
        if (Number.isFinite(eur) && eur > 0) {
          applyUpdate({
            priceEur: eur,
            change24hPct:
              typeof cgData?.bitcoin?.eur_24h_change === 'number'
                ? Number(cgData.bitcoin.eur_24h_change.toFixed(2))
                : null,
            satsPerEuro: Math.round(100_000_000 / eur),
            source: 'CoinGecko',
            updatedAt: new Date().toISOString(),
          });
          return;
        }
      }
    } catch {
      // Fallback to Coinbase spot
    }

    // 3. Client-side fallback: Coinbase BTC-EUR spot
    try {
      const cbRes = await fetch('https://api.coinbase.com/v2/prices/BTC-EUR/spot');
      if (cbRes.ok) {
        const cbData = await cbRes.json();
        const eur = Number(cbData?.data?.amount);
        if (Number.isFinite(eur) && eur > 0) {
          applyUpdate({
            priceEur: eur,
            change24hPct: null,
            satsPerEuro: Math.round(100_000_000 / eur),
            source: 'Coinbase',
            updatedAt: new Date().toISOString(),
          });
          return;
        }
      }
    } catch {
      // Ignore network error
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLiveBitcoinPrice(false);
    const intervalId = window.setInterval(() => {
      fetchLiveBitcoinPrice(false);
    }, 30_000);
    return () => window.clearInterval(intervalId);
  }, [fetchLiveBitcoinPrice]);

  const formattedEur = priceData
    ? new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: priceData.priceEur >= 1000 ? 0 : 2,
      }).format(priceData.priceEur)
    : '—';

  const formattedSats = priceData
    ? new Intl.NumberFormat('en-IE').format(priceData.satsPerEuro)
    : '—';

  const isPositive24h =
    priceData?.change24hPct !== null &&
    priceData?.change24hPct !== undefined &&
    priceData.change24hPct >= 0;

  return (
    <div
      role="group"
      aria-label={
        lang === 'ga'
          ? 'Praghas Margaidh Beo Bitcoin in Euro'
          : 'Live Bitcoin Market Price in Euro'
      }
      className={`h-9 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 rounded-full border text-xs font-medium transition-all select-none shrink-0 ${
        flashDirection === 'up'
          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-[#0A192F] dark:text-white'
          : flashDirection === 'down'
          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-[#0A192F] dark:text-white'
          : 'bg-slate-50/90 dark:bg-[#102444] border-slate-200/90 dark:border-[#1E3A5F] text-[#0A192F] dark:text-slate-100 hover:border-[#F7931A]/70'
      }`}
    >
      {/* Live Pulse Dot + BTC Symbol Button (toggles BTC/EUR vs Sats/€1 or jumps to Bitcoin Hub) */}
      <button
        type="button"
        onClick={() => {
          setShowSatsPerEur((prev) => !prev);
          if (onClick) onClick();
        }}
        title={
          lang === 'ga'
            ? `Praghas beo BTC/EUR (${priceData?.source || 'API'}) · Cliceáil chun Sats in aghaidh €1 a fheiceáil`
            : `Live BTC/EUR market price (${priceData?.source || 'API'}) · Click to toggle Sats per €1`
        }
        className="inline-flex items-center justify-center gap-1.5 h-full cursor-pointer focus:outline-none"
      >
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7931A] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F7931A]" />
        </span>

        <span className="font-bold text-[#F7931A] tracking-tight leading-none">BTC</span>

        {loading && !priceData ? (
          <span className="font-mono text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 animate-pulse leading-none">
            €••,•••
          </span>
        ) : showSatsPerEur && priceData ? (
          <span className="font-mono font-bold text-[11px] sm:text-xs text-[#0A192F] dark:text-white whitespace-nowrap leading-none">
            {formattedSats} <span className="text-[10px] font-normal text-slate-500 dark:text-slate-300">sats/€1</span>
          </span>
        ) : (
          <span className="font-mono font-bold text-[11px] sm:text-xs text-[#0A192F] dark:text-white whitespace-nowrap leading-none">
            {formattedEur}
          </span>
        )}

        {/* 24h Percentage Delta Badge (shown on sm+ screens when available) */}
        {priceData?.change24hPct !== null && priceData?.change24hPct !== undefined && (
          <span
            className={`hidden md:inline-flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold leading-none ${
              isPositive24h
                ? 'bg-emerald-500/15 text-[#006B3F] dark:text-emerald-300'
                : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
            }`}
          >
            {isPositive24h ? (
              <TrendingUp className="w-2.5 h-2.5 shrink-0" />
            ) : (
              <TrendingDown className="w-2.5 h-2.5 shrink-0" />
            )}
            <span>
              {isPositive24h ? '+' : ''}
              {priceData.change24hPct}%
            </span>
          </span>
        )}
      </button>

      {/* Manual Refresh Trigger — Centered circular button inside pill */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          fetchLiveBitcoinPrice(true);
        }}
        aria-label={lang === 'ga' ? 'Athnuaigh praghas Bitcoin' : 'Refresh Bitcoin price'}
        title={
          lang === 'ga'
            ? 'Athnuaigh praghas an mhargaidh anois'
            : 'Refresh live market price now'
        }
        className="w-5 h-5 inline-flex items-center justify-center rounded-full text-slate-400 hover:text-[#F7931A] hover:bg-slate-200/50 dark:text-slate-400 dark:hover:text-[#F7931A] dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
      >
        <RefreshCw className={`w-3 h-3 shrink-0 ${refreshing ? 'animate-spin text-[#F7931A]' : ''}`} />
      </button>
    </div>
  );
};
