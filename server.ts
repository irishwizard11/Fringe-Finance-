import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  BITCOIN_WHITEPAPER_METADATA,
  BITCOIN_WHITEPAPER_SECTIONS,
} from './src/data/bitcoinWhitepaper.ts';
import {
  BITCOIN_CORE_METRICS,
  BITCOIN_HALVING_SCHEDULE,
  BITCOIN_ENCYCLOPEDIA,
} from './src/data/bitcoinKnowledgeBase.ts';
import { ALL_TABS_KNOWLEDGE_BASE } from './src/data/allTabsKnowledgeBase.ts';
import { DAILY_QUIZ_POOL } from './src/data/dailyQuizData.ts';
import { IRISH_TERMS } from './src/data/i18n.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'MISSING_API_KEY',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');

  // Security headers middleware (avoid X-Frame-Options: SAMEORIGIN so AI Studio preview iframe works)
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use(express.json({ limit: '100kb' }));

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, lang = 'en', history = [], structuredAppContext = {} } = req.body || {};

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required.' });
        return;
      }

      const trimmedMessage = message.trim().slice(0, 1000);
      if (!trimmedMessage) {
        res.status(400).json({ error: 'Message cannot be empty.' });
        return;
      }

      const safeLang = lang === 'ga' ? 'ga' : 'en';

      const authoritativeAppKnowledge = {
        tab1_BitcoinAndWhitepaper: {
          coreProtocolMetrics: BITCOIN_CORE_METRICS,
          halvingSchedule: BITCOIN_HALVING_SCHEDULE,
          completeBilingualWhitepaper: {
            metadata: BITCOIN_WHITEPAPER_METADATA,
            allSections: BITCOIN_WHITEPAPER_SECTIONS.map((s) => ({
              section: s.sectionNumber,
              titleEn: s.titleEn,
              titleGa: s.titleGa,
              keyTermEn: s.keyTermEn,
              keyTermGa: s.keyTermGa,
              satoshiOriginalEn: s.originalTextEn,
              satoshiOriginalGa: s.originalTextGa,
              plainBeginnerSummaryEn: s.plainSummaryEn,
              plainBeginnerSummaryGa: s.plainSummaryGa,
            })),
          },
          bitcoinDeepDiveEncyclopedia: BITCOIN_ENCYCLOPEDIA,
        },
        tabs2To5_AllOtherModulesData: ALL_TABS_KNOWLEDGE_BASE,
        dailyQuizQuestionBank: DAILY_QUIZ_POOL.map((q) => ({
          id: q.id,
          category: q.category,
          questionEn: q.questionEn,
          questionGa: q.questionGa,
          correctAnswerEn: q.optionsEn[q.correctIndex],
          correctAnswerGa: q.optionsGa[q.correctIndex],
          explanationEn: q.explanationEn,
          explanationGa: q.explanationGa,
        })),
        bilingualTerminology: Object.values(IRISH_TERMS).map((t) => ({
          ga: t.ga,
          en: t.en,
          category: t.category,
          definitionEn: t.definitionEn,
          definitionGa: t.definitionGa,
        })),
      };

      const systemInstruction = `You are "AI Assistant", an authoritative, approachable, and crystal-clear bilingual (English & Gaeilge) Bitcoin Educator, Satoshi Whitepaper Scholar, and Personal Finance Mentor inside the Emerald Ledger web application.

CRITICAL INSTRUCTIONS FOR ANSWERING QUESTIONS ACROSS ALL APP PAGES:
1. Complete Mastery of All Modules:
   - Bitcoin Hub & Bilingual Whitepaper: 21M hard cap, Halving schedule (2009–2140), Satoshi Nakamoto's 2008 Whitepaper (all 12 sections in English & Gaeilge), UTXOs, SHA-256 Proof-of-Work, 2,016-block difficulty adjustment, Full Nodes vs Miners, BIP-39 12/24-word seed phrases, Hardware Wallets, On-Chain Address & DCA ROI Analytics Monitor, Lightning Network, and Irish 33% CGT (€1,270 annual exemption).
   - Everyday Money, 50/30/20 Budgeting, Inflation & Pensions: Splitting net income into Needs (50%), Wants (30%), and Savings (20%); how inflation erodes cash purchasing power; and how Irish Marginal Rate Pension Tax Relief turns €60 of net pay into €100 inside a pension at the 40% tax band.
   - Growing Wealth, Emergency Funds, Compounding & Cash-Back Reliefs: The 4-Step Money Ladder, 3–6 month Emergency Safety Net, compound interest math, Irish DIRT (33%) vs direct Bitcoin/Shares CGT (33% with €1,270 exemption) vs ETF Exit Tax (41% & 8-year deemed disposal), and PAYE tax reliefs (Rent Tax Credit €1,000/€2,000, Health Expenses 20%, Remote Working 30% utilities, Home Carer €1,950).
   - Scam Defense ("Is It a Scam?" Threat Simulator): Spotting Revenue/An Post smishing SMS links, WhatsApp/Telegram "guaranteed 4.5% daily return" pig-butchering scams, fake hardware wallet firmware pop-ups asking for 24-word seed phrases, and verifying regulated firms on the Central Bank of Ireland register.
   - Competitive Daily Quiz Arena & Leaderboard: 5-question Daily Challenge, 15-second speed bonus math, 3 hearts, combo multipliers, 50/50 & 2x Boost power-ups, and explaining any quiz question.

2. Bilingual Excellence (English & Gaeilge):
   - Active language: "${safeLang === 'ga' ? 'Gaeilge (Irish)' : 'English'}".
   - If the user asks in Gaeilge OR if active language is Gaeilge, respond in natural, clear Gaeilge with helpful English terms in parentheses where appropriate.
   - Keep explanations clear, concise, and complete. Pair numbers and formulas with a simple analogy.

3. Authoritative Knowledge Base:
${JSON.stringify(authoritativeAppKnowledge)}

4. User's Live App State:
${JSON.stringify(structuredAppContext || {}).slice(0, 15000)}

5. Practical Guidance & Disclaimer:
   - Show step-by-step math for any calculation question (ROI, DCA average price, Sats per Euro, 50/30/20 budget, inflation, pension relief, emergency fund, CGT/DIRT, or PAYE refunds).
   - Remind the user where relevant that Emerald Ledger is an educational tool only, not regulated financial advice.`;

      const recentHistory = Array.isArray(history)
        ? history
            .slice(-8)
            .map((h: { role?: string; text?: string }) => {
              const roleLabel = h?.role === 'user' ? 'User' : 'AI Assistant';
              const cleanText = typeof h?.text === 'string' ? h.text.slice(0, 800) : '';
              return `${roleLabel}: ${cleanText}`;
            })
            .join('\n')
        : '';

      const prompt = recentHistory
        ? `Conversation history:\n${recentHistory}\n\nCurrent User Question: ${trimmedMessage}`
        : `User Question: ${trimmedMessage}`;

      const ai = getAiClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description:
                  'Clear, concise, complete answer grounded in the Emerald Ledger knowledge base. Use bullet points or short paragraphs.',
              },
              keyFigures: {
                type: Type.ARRAY,
                description:
                  '1 to 3 key metrics, formulas, or numeric highlights directly relevant to the user question.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                  },
                  required: ['label', 'value'],
                },
              },
              relatedModule: {
                type: Type.STRING,
                description: 'Which app page relates best: "bitcoin", "budget", "tax", "security", or "quiz".',
              },
              followUpQuestions: {
                type: Type.ARRAY,
                description: '2 short, natural follow-up questions the user might want to ask next.',
                items: { type: Type.STRING },
              },
            },
            required: ['answer', 'keyFigures', 'relatedModule', 'followUpQuestions'],
          },
        },
      });

      const rawText = response.text || '{}';
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = {
          answer: rawText,
          keyFigures: [],
          relatedModule: 'bitcoin',
          followUpQuestions: [],
        };
      }

      res.json(parsed);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Service temporarily unavailable.';
      console.error('AI Assistant error:', errMsg);
      res.status(500).json({ error: 'Unable to generate a response right now. Please try again.' });
    }
  });

  // Real-time Bitcoin EUR price proxy with 30-second cache & multi-provider resilience
  let cachedPricePayload: {
    priceEur: number;
    change24hPct: number | null;
    satsPerEuro: number;
    source: string;
    updatedAt: string;
    fetchedAtMs: number;
  } | null = null;

  async function getLiveBtcEurPrice(): Promise<{
    priceEur: number;
    change24hPct: number | null;
    satsPerEuro: number;
    source: string;
    updatedAt: string;
    fetchedAtMs: number;
  }> {
    const now = Date.now();
    if (cachedPricePayload && now - cachedPricePayload.fetchedAtMs < 30_000) {
      return cachedPricePayload;
    }

    // 1. Primary: CoinGecko Simple Price API
    try {
      const cgRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur&include_24hr_change=true&include_last_updated_at=true',
        {
          headers: { Accept: 'application/json', 'User-Agent': 'FringeFinanceEducator/1.0' },
          signal: AbortSignal.timeout(4500),
        }
      );
      if (cgRes.ok) {
        const cgData = await cgRes.json();
        const eurPrice = Number(cgData?.bitcoin?.eur);
        if (Number.isFinite(eurPrice) && eurPrice > 0) {
          const change24h =
            typeof cgData?.bitcoin?.eur_24h_change === 'number'
              ? Number(cgData.bitcoin.eur_24h_change.toFixed(2))
              : null;
          cachedPricePayload = {
            priceEur: eurPrice,
            change24hPct: change24h,
            satsPerEuro: Math.round(100_000_000 / eurPrice),
            source: 'CoinGecko',
            updatedAt: new Date().toISOString(),
            fetchedAtMs: now,
          };
          return cachedPricePayload;
        }
      }
    } catch {
      // Fall through to secondary provider
    }

    // 2. Secondary: Mempool.space Public Bitcoin Price API
    try {
      const mpRes = await fetch('https://mempool.space/api/v1/prices', {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4500),
      });
      if (mpRes.ok) {
        const mpData = await mpRes.json();
        const eurPrice = Number(mpData?.EUR);
        if (Number.isFinite(eurPrice) && eurPrice > 0) {
          cachedPricePayload = {
            priceEur: eurPrice,
            change24hPct: cachedPricePayload?.change24hPct ?? null,
            satsPerEuro: Math.round(100_000_000 / eurPrice),
            source: 'mempool.space',
            updatedAt: new Date().toISOString(),
            fetchedAtMs: now,
          };
          return cachedPricePayload;
        }
      }
    } catch {
      // Fall through to tertiary provider
    }

    // 3. Tertiary: Coinbase Public Spot Price API (BTC-EUR)
    try {
      const cbRes = await fetch('https://api.coinbase.com/v2/prices/BTC-EUR/spot', {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4500),
      });
      if (cbRes.ok) {
        const cbData = await cbRes.json();
        const eurPrice = Number(cbData?.data?.amount);
        if (Number.isFinite(eurPrice) && eurPrice > 0) {
          cachedPricePayload = {
            priceEur: eurPrice,
            change24hPct: cachedPricePayload?.change24hPct ?? null,
            satsPerEuro: Math.round(100_000_000 / eurPrice),
            source: 'Coinbase',
            updatedAt: new Date().toISOString(),
            fetchedAtMs: now,
          };
          return cachedPricePayload;
        }
      }
    } catch {
      // Use cached payload if available
    }

    if (cachedPricePayload) {
      return cachedPricePayload;
    }

    return {
      priceEur: 82500,
      change24hPct: 1.4,
      satsPerEuro: Math.round(100_000_000 / 82500),
      source: 'Fallback Index',
      updatedAt: new Date().toISOString(),
      fetchedAtMs: now,
    };
  }

  app.get('/api/bitcoin-price', async (_req, res) => {
    const payload = await getLiveBtcEurPrice();
    res.json(payload);
  });

  // Historical BTC-EUR reference curve by year-month for estimating cost basis & DCA average price of on-chain UTXOs/txs
  function estimateHistoricalBtcEurPrice(unixTimestampSec: number, currentSpotEur: number): number {
    if (!unixTimestampSec || unixTimestampSec <= 0) return currentSpotEur * 0.65;
    const date = new Date(unixTimestampSec * 1000);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // 1..12

    const yearlyBenchmarksEur: Record<number, number> = {
      2009: 0.01,
      2010: 0.15,
      2011: 4.5,
      2012: 8.5,
      2013: 180,
      2014: 380,
      2015: 240,
      2016: 540,
      2017: 3800,
      2018: 5600,
      2019: 6400,
      2020: 10200,
      2021: 39500,
      2022: 26800,
      2023: 27400,
      2024: 58500,
      2025: 76000,
      2026: currentSpotEur * 0.92,
    };

    const base = yearlyBenchmarksEur[year] ?? currentSpotEur * 0.75;
    const nextBase = yearlyBenchmarksEur[year + 1] ?? currentSpotEur;
    const fraction = (month - 1) / 12;
    return Math.max(0.01, Math.round(base + (nextBase - base) * fraction));
  }

  function detectBitcoinAddressFormat(address: string): {
    valid: boolean;
    formatEn: string;
    formatGa: string;
  } {
    const trimmed = address.trim();
    if (/^bc1p[a-zA-HJ-NP-Z0-9]{58}$/i.test(trimmed)) {
      return {
        valid: true,
        formatEn: 'Taproot (Bech32m · bc1p)',
        formatGa: 'Taproot (Bech32m · bc1p)',
      };
    }
    if (/^bc1q[a-zA-HJ-NP-Z0-9]{38,58}$/i.test(trimmed)) {
      return {
        valid: true,
        formatEn: 'Native SegWit (Bech32 · bc1q)',
        formatGa: 'SegWit Dúchasach (Bech32 · bc1q)',
      };
    }
    if (/^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed)) {
      return {
        valid: true,
        formatEn: 'Nested SegWit / Multi-Sig (P2SH · 3...)',
        formatGa: 'SegWit Neadaithe / P2SH (3...)',
      };
    }
    if (/^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed)) {
      return {
        valid: true,
        formatEn: 'Legacy Address (P2PKH · 1...)',
        formatGa: 'Seoladh Oidhreachta (P2PKH · 1...)',
      };
    }
    return { valid: false, formatEn: 'Invalid Format', formatGa: 'Formáid Neamhbhailí' };
  }

  // On-Chain Bitcoin Address Analytics, DCA Average Price & ROI Monitor Endpoint
  app.get('/api/bitcoin-address/:address', async (req, res) => {
    const rawAddress = String(req.params.address || '').trim();
    const formatInfo = detectBitcoinAddressFormat(rawAddress);

    if (!formatInfo.valid) {
      res.status(400).json({
        error:
          'Invalid Bitcoin address format. Please enter a valid Mainnet address starting with bc1, 3, or 1.',
      });
      return;
    }

    const livePrice = await getLiveBtcEurPrice();
    const spotEur = livePrice.priceEur;

    // Curated educational demo presets so learners can also inspect realistic DCA & whale wallets instantly
    const DEMO_PRESETS: Record<
      string,
      {
        labelEn: string;
        labelGa: string;
        fundedSats: number;
        spentSats: number;
        txCount: number;
        utxoCount: number;
        dcaDeposits: Array<{ txid: string; date: string; btcAmount: number; priceEurAtTx: number }>;
      }
    > = {
      bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq: {
        labelEn: 'Irish Saver Monthly DCA Cold Wallet (Sample)',
        labelGa: 'Sparán Fuar DCA Míosúil Coigilteora (Sampla)',
        fundedSats: 18_500_000, // 0.185 BTC
        spentSats: 2_000_000, // 0.020 BTC
        txCount: 8,
        utxoCount: 6,
        dcaDeposits: [
          { txid: 'a1b2c3d4...89ef01', date: '2023-03-15', btcAmount: 0.04, priceEurAtTx: 24200 },
          { txid: 'b4e7f1a2...19cd02', date: '2023-09-15', btcAmount: 0.035, priceEurAtTx: 25100 },
          { txid: 'c8d9e2f3...44ab03', date: '2024-02-15', btcAmount: 0.03, priceEurAtTx: 47800 },
          { txid: 'd2f4a8c1...77ef04', date: '2024-08-15', btcAmount: 0.025, priceEurAtTx: 54200 },
          { txid: 'e9a1b5c7...32dc05', date: '2025-01-15', btcAmount: 0.02, priceEurAtTx: 72400 },
          { txid: 'f5c3d8e9...91ba06', date: '2025-06-15', btcAmount: 0.015, priceEurAtTx: 78500 },
        ],
      },
      bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297: {
        labelEn: 'Taproot Long-Term Sovereign Vault (Sample)',
        labelGa: 'Cruinneachán Taproot Fadtéarmach (Sampla)',
        fundedSats: 64_000_000, // 0.64 BTC
        spentSats: 0,
        txCount: 4,
        utxoCount: 4,
        dcaDeposits: [
          { txid: '71ef90a1...11ca01', date: '2022-11-20', btcAmount: 0.25, priceEurAtTx: 16400 },
          { txid: '82bc31d4...22db02', date: '2023-06-10', btcAmount: 0.20, priceEurAtTx: 24800 },
          { txid: '93de42f5...33ec03', date: '2024-04-20', btcAmount: 0.12, priceEurAtTx: 59900 },
          { txid: 'a4fa53b6...44fd04', date: '2025-02-01', btcAmount: 0.07, priceEurAtTx: 74500 },
        ],
      },
    };

    try {
      // Query real on-chain data from mempool.space (or blockstream.info fallback)
      let addrData: any = null;
      let txsData: any[] = [];

      const endpoints = [
        `https://mempool.space/api/address/${encodeURIComponent(rawAddress)}`,
        `https://blockstream.info/api/address/${encodeURIComponent(rawAddress)}`,
      ];

      for (const url of endpoints) {
        try {
          const resp = await fetch(url, {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout(5000),
          });
          if (resp.ok) {
            addrData = await resp.json();
            const txsResp = await fetch(`${url}/txs`, {
              headers: { Accept: 'application/json' },
              signal: AbortSignal.timeout(5000),
            });
            if (txsResp.ok) {
              txsData = await txsResp.json();
            }
            break;
          }
        } catch {
          // try next explorer
        }
      }

      const fundedSats = Number(addrData?.chain_stats?.funded_txo_sum ?? 0);
      const spentSats = Number(addrData?.chain_stats?.spent_txo_sum ?? 0);
      const mempoolFunded = Number(addrData?.mempool_stats?.funded_txo_sum ?? 0);
      const mempoolSpent = Number(addrData?.mempool_stats?.spent_txo_sum ?? 0);
      const txCount = Number(addrData?.chain_stats?.tx_count ?? 0);
      const fundedTxoCount = Number(addrData?.chain_stats?.funded_txo_count ?? 0);
      const spentTxoCount = Number(addrData?.chain_stats?.spent_txo_count ?? 0);

      // Extract real inbound funding transactions for this address from recent txs
      const extractedDeposits: Array<{
        txid: string;
        date: string;
        btcAmount: number;
        priceEurAtTx: number;
        currentValueEur: number;
        roiPct: number;
      }> = [];

      if (Array.isArray(txsData) && txsData.length > 0) {
        for (const tx of txsData.slice(0, 15)) {
          const vouts = Array.isArray(tx?.vout) ? tx.vout : [];
          let receivedSatsInTx = 0;
          for (const out of vouts) {
            if (out?.scriptpubkey_address === rawAddress && typeof out?.value === 'number') {
              receivedSatsInTx += out.value;
            }
          }
          if (receivedSatsInTx > 0) {
            const btcAmt = receivedSatsInTx / 100_000_000;
            const blockTime = Number(tx?.status?.block_time || Math.floor(Date.now() / 1000));
            const estEurPrice = estimateHistoricalBtcEurPrice(blockTime, spotEur);
            const dateStr = new Date(blockTime * 1000).toISOString().slice(0, 10);
            const curVal = btcAmt * spotEur;
            const costVal = btcAmt * estEurPrice;
            const roi = costVal > 0 ? ((curVal - costVal) / costVal) * 100 : 0;
            extractedDeposits.push({
              txid: `${String(tx.txid).slice(0, 8)}...${String(tx.txid).slice(-6)}`,
              date: dateStr,
              btcAmount: Number(btcAmt.toFixed(8)),
              priceEurAtTx: estEurPrice,
              currentValueEur: Number(curVal.toFixed(2)),
              roiPct: Number(roi.toFixed(1)),
            });
          }
        }
      }

      // If this is one of our educational demo addresses and has 0 on-chain activity (or if explorer is unreachable), enrich with the preset DCA history
      const preset = DEMO_PRESETS[rawAddress];
      if (preset && (txCount === 0 || extractedDeposits.length === 0)) {
        const balanceSats = preset.fundedSats - preset.spentSats;
        const balanceBtc = balanceSats / 100_000_000;
        const deposits = preset.dcaDeposits.map((d) => {
          const curVal = d.btcAmount * spotEur;
          const costVal = d.btcAmount * d.priceEurAtTx;
          const roi = costVal > 0 ? ((curVal - costVal) / costVal) * 100 : 0;
          return {
            ...d,
            currentValueEur: Number(curVal.toFixed(2)),
            roiPct: Number(roi.toFixed(1)),
          };
        });

        const totalDcaBtc = deposits.reduce((s, d) => s + d.btcAmount, 0);
        const totalDcaCostEur = deposits.reduce((s, d) => s + d.btcAmount * d.priceEurAtTx, 0);
        const dcaAveragePriceEur =
          totalDcaBtc > 0 ? Math.round(totalDcaCostEur / totalDcaBtc) : Math.round(spotEur * 0.6);

        const currentHoldingsCostEur = balanceBtc * dcaAveragePriceEur;
        const currentHoldingsValueEur = balanceBtc * spotEur;
        const unrealizedProfitEur = currentHoldingsValueEur - currentHoldingsCostEur;
        const roiPct =
          currentHoldingsCostEur > 0
            ? Number(((unrealizedProfitEur / currentHoldingsCostEur) * 100).toFixed(2))
            : 0;

        res.json({
          address: rawAddress,
          labelEn: preset.labelEn,
          labelGa: preset.labelGa,
          formatEn: formatInfo.formatEn,
          formatGa: formatInfo.formatGa,
          source: 'On-Chain + Historical EUR Index',
          spotPriceEur: spotEur,
          balanceBtc: Number(balanceBtc.toFixed(8)),
          balanceSats,
          unconfirmedDeltaSats: 0,
          totalReceivedBtc: Number((preset.fundedSats / 100_000_000).toFixed(8)),
          totalSentBtc: Number((preset.spentSats / 100_000_000).toFixed(8)),
          txCount: preset.txCount,
          utxoCount: preset.utxoCount,
          dcaAveragePriceEur,
          estimatedCostBasisEur: Number(currentHoldingsCostEur.toFixed(2)),
          currentValueEur: Number(currentHoldingsValueEur.toFixed(2)),
          unrealizedProfitEur: Number(unrealizedProfitEur.toFixed(2)),
          roiPct,
          recentDeposits: deposits,
        });
        return;
      }

      const confirmedBalanceSats = Math.max(0, fundedSats - spentSats);
      const unconfirmedDeltaSats = mempoolFunded - mempoolSpent;
      const balanceBtc = confirmedBalanceSats / 100_000_000;
      const utxoCount = Math.max(0, fundedTxoCount - spentTxoCount);

      // Compute weighted DCA average price from extracted inbound deposits
      const totalSampledBtc = extractedDeposits.reduce((s, d) => s + d.btcAmount, 0);
      const totalSampledCostEur = extractedDeposits.reduce(
        (s, d) => s + d.btcAmount * d.priceEurAtTx,
        0
      );
      const dcaAveragePriceEur =
        totalSampledBtc > 0
          ? Math.round(totalSampledCostEur / totalSampledBtc)
          : Math.round(spotEur * 0.65);

      const estimatedCostBasisEur = balanceBtc * dcaAveragePriceEur;
      const currentValueEur = balanceBtc * spotEur;
      const unrealizedProfitEur = currentValueEur - estimatedCostBasisEur;
      const roiPct =
        estimatedCostBasisEur > 0
          ? Number(((unrealizedProfitEur / estimatedCostBasisEur) * 100).toFixed(2))
          : 0;

      res.json({
        address: rawAddress,
        labelEn: 'Live Mainnet Bitcoin Address',
        labelGa: 'Seoladh Bitcoin Beo ar an bPríomhlíonra',
        formatEn: formatInfo.formatEn,
        formatGa: formatInfo.formatGa,
        source: 'mempool.space On-Chain Explorer',
        spotPriceEur: spotEur,
        balanceBtc: Number(balanceBtc.toFixed(8)),
        balanceSats: confirmedBalanceSats,
        unconfirmedDeltaSats,
        totalReceivedBtc: Number((fundedSats / 100_000_000).toFixed(8)),
        totalSentBtc: Number((spentSats / 100_000_000).toFixed(8)),
        txCount,
        utxoCount,
        dcaAveragePriceEur,
        estimatedCostBasisEur: Number(estimatedCostBasisEur.toFixed(2)),
        currentValueEur: Number(currentValueEur.toFixed(2)),
        unrealizedProfitEur: Number(unrealizedProfitEur.toFixed(2)),
        roiPct,
        recentDeposits: extractedDeposits,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to query Bitcoin address.';
      console.error('Bitcoin address lookup error:', msg);
      res.status(502).json({ error: 'Unable to reach the Bitcoin blockchain explorer right now.' });
    }
  });

  const distPath = path.resolve(__dirname, 'dist');
  const distIndexPath = path.join(distPath, 'index.html');
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && fs.existsSync(distIndexPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(distIndexPath);
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Emerald Ledger server running on http://0.0.0.0:${port}`);
  });
}

startServer();
