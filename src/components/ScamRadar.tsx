import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Lock,
  Volume2,
  AlertTriangle,
} from 'lucide-react';
import { Language, speakIrishText } from '../data/i18n';
import { TermTooltip } from './TermTooltip';

interface ScamRadarProps {
  lang: Language;
}

interface ScamScenario {
  id: string;
  categoryEn: string;
  categoryGa: string;
  senderHandle: string;
  channel: 'SMS' | 'WhatsApp' | 'Telegram / Trading Platform' | 'Support Pop-up';
  messageEn: string;
  messageGa: string;
  redFlagsEn: string[];
  redFlagsGa: string[];
  verdict: 'scam' | 'legitimate';
  explanationEn: string;
  explanationGa: string;
}

const SCENARIOS: ScamScenario[] = [
  {
    id: 'scam-1',
    categoryEn: 'Scenario 1: Revenue / An Post Smishing (SMS)',
    categoryGa: 'Cás 1: Téacs Bréige ó na Coimisinéirí Ioncaim / An Post',
    senderHandle: '+353 87 912 0481 (myRevenue-Refund-IE)',
    channel: 'SMS',
    messageEn:
      'REVENUE NOTICE: You have an unclaimed PAYE Tax Rebate of €648.20 expiring at midnight. Verify your IBAN and Debit Card PIN immediately at: https://myaccount-revenue-ie-portal.com/claim',
    messageGa:
      'FÓGRA REVENUE: Tá aisíoc cánach PAYE de €648.20 agat a rachaidh in éag meán oíche. Deimhnigh do chárta bainc agus Uimhir PIN láithreach ag: https://myaccount-revenue-ie-portal.com/claim',
    redFlagsEn: [
      'Fake lookalike domain ("myaccount-revenue-ie-portal.com" instead of official revenue.ie).',
      'Artificial midnight urgency designed to trigger panic.',
      'Revenue NEVER sends clickable SMS links for tax refunds or asks for a Debit Card PIN.',
    ],
    redFlagsGa: [
      'Fearann gréasáin bréige ("myaccount-revenue-ie-portal.com" in ionad revenue.ie).',
      'Brú ama bréagach ("meán oíche") chun scaoll a chruthú.',
      'Ní sheolann na Coimisinéirí Ioncaim naisc SMS le haghaidh aisíocaíochtaí riamh.',
    ],
    verdict: 'scam',
    explanationEn:
      '100% Smishing Scam. Revenue.ie will never text you a web link to claim a refund. Always open a fresh browser tab and log in directly at ros.ie or revenue.ie.',
    explanationGa:
      'Scaim Fíodóireachta 100%. Ní sheolfaidh Revenue.ie nasc téacs chugat riamh chun aisíoc a éileamh. Logáil isteach go díreach ar revenue.ie i gcónaí.',
  },
  {
    id: 'scam-2',
    categoryEn: 'Scenario 2: "Pig-Butchering" Crypto Investment Group',
    categoryGa: 'Cás 2: Scaim Infheistíochta Cripte ar WhatsApp / Telegram',
    senderHandle: 'Dublin Quantitative AI Crypto VIP Club',
    channel: 'Telegram / Trading Platform',
    messageEn:
      'Welcome! Professor Liam’s AI Arbitrage Bot guarantees 4.5% daily returns on USDT/BTC. Deposit €2,000 to our partner platform (BitFin-ProVIP.io). Note: To withdraw your €14,800 profit, you must first pay a 20% "Cross-Border Release Tax" in BTC to this wallet.',
    messageGa:
      'Fáilte! Ráthaíonn Róbat AI an Ollamh Liam brabús 4.5% in aghaidh an lae ar BTC. Chun do bhrabús €14,800 a tharraingt siar, caithfidh tú "Cáin Scaoilte 20%" a íoc roimh ré chuig an sparán seo.',
    redFlagsEn: [
      '"Guaranteed 4.5% daily return" is mathematically impossible (~900,000,000% APY).',
      'Fake dashboard showing fabricated paper profits on an unregulated domain.',
      'Demanding an upfront "withdrawal tax" or "unlock fee"—legitimate exchanges never require extra deposits to withdraw your own funds.',
    ],
    redFlagsGa: [
      'Níl a leithéid de rud ann is "brabús ráthaithe 4.5% in aghaidh an lae".',
      'Ardán neamhrialaithe a thaispeánann brabús bréige ar an scáileán.',
      'Éileamh ar "cháin tarraingthe siar" roimh ré—comhartha clasaiceach de scaim Pig-Butchering.',
    ],
    verdict: 'scam',
    explanationEn:
      'Classic "Pig-Butchering" Advance-Fee Scam. The trading platform is a mirage controlled by scammers. Never pay an "unlock" or "tax" fee to release funds—report immediately to Garda National Economic Crime Bureau (GNECB).',
    explanationGa:
      'Scaim clasaiceach "Pig-Butchering". Is suíomh bréige é an t-ardán trádála. Ná híoc aon táille "scaoilte" riamh.',
  },
  {
    id: 'scam-3',
    categoryEn: 'Scenario 3: Hardware Wallet Seed Phrase Phishing',
    categoryGa: 'Cás 3: Iarratas Bréige ar Fhrása Síol Sparáin Chrua-Earraí',
    senderHandle: 'Security-Alert@Ledger-Firmware-Sync.org',
    channel: 'Support Pop-up',
    messageEn:
      'CRITICAL FIRMWARE ERROR: Your hardware wallet USB bridge is out of sync. Please enter your 24-word recovery seed phrase below to restore cryptographic synchronization and prevent asset lock.',
    messageGa:
      'EARRÁID CHRUINNE: Tá do sparán crua-earraí as sioncrónú. Cuir isteach do Fhrása Síol 24-fhocal thíos chun do chuid Bitcoin a dhíghlasáil.',
    redFlagsEn: [
      'Asks you to type your 24-word recovery seed phrase into a computer browser.',
      'Your seed phrase is ONLY ever entered on the physical hardware wallet screen itself during a genuine device recovery.',
    ],
    redFlagsGa: [
      'Iarrtar ort do Fhrása Síol 24-fhocal a chlóscríobh ar ríomhaire.',
      'Ní chuirtear do Fhrása Síol isteach ach ar scáileán fisiciúil an ghléis féin.',
    ],
    verdict: 'scam',
    explanationEn:
      'Critical Phishing Attack. Anyone who obtains your 12 or 24 recovery words can steal 100% of your Bitcoin remotely in seconds without needing your physical hardware wallet.',
    explanationGa:
      'Ionsaí Fíodóireachta Criticiúil. Aon duine a fhaigheann do 12 nó 24 focal, is féidir leo do chuid Bitcoin go léir a ghoid láithreach.',
  },
  {
    id: 'scam-4',
    categoryEn: 'Scenario 4: Official Revenue myAccount Notification',
    categoryGa: 'Cás 4: Fógra Oifigiúil ó Revenue myAccount',
    senderHandle: 'no-reply@revenue.ie',
    channel: 'SMS',
    messageEn:
      'You have new correspondence in your myAccount inbox regarding your Statement of Liability. To view this document, please open your web browser, navigate to revenue.ie, and sign in to myAccount.',
    messageGa:
      'Tá comhfhreagras nua i do bhosca isteach myAccount maidir le do Ráiteas Dliteanais. Oscail do bhrabhsálaí, téigh go revenue.ie, agus logáil isteach ar myAccount.',
    redFlagsEn: [
      'No clickable URL link included in the message.',
      'Does not ask for passwords, bank card numbers, or seed phrases.',
      'Instructs you to independently navigate to the official revenue.ie website.',
    ],
    redFlagsGa: [
      ' níl aon nasc gréasáin sa teachtaireacht.',
      'Ní iarrtar uimhreacha cárta ná focail fhaire.',
      'Treoraítear thú chun dul go neamhspleách chuig revenue.ie.',
    ],
    verdict: 'legitimate',
    explanationEn:
      'Legitimate Notification Pattern. Genuine notices from Revenue or Irish banks tell you to log in independently via their official app or website without embedding clickable links.',
    explanationGa:
      'Fógra Dlisteanach. Iarrann fógraí fíora ó na Coimisinéirí Ioncaim ort logáil isteach go neamhspleách gan naisc bhréige.',
  },
];

export const ScamRadar: React.FC<ScamRadarProps> = ({ lang }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, 'scam' | 'legitimate'>>({});

  const currentScenario = SCENARIOS[currentIndex];
  const userChoice = answers[currentScenario.id];
  const isCorrect = userChoice === currentScenario.verdict;

  const totalAnswered = Object.keys(answers).length;
  const totalCorrect = SCENARIOS.filter((s) => answers[s.id] === s.verdict).length;

  const handleSelectVerdict = (choice: 'scam' | 'legitimate') => {
    setAnswers((prev) => ({ ...prev, [currentScenario.id]: choice }));
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentIndex(0);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#006B3F] font-semibold">
            <span>04. {lang === 'ga' ? 'Radar Slándála & Cosaint ar Scaimeanna' : 'Scam Protection & Security Radar'}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'ga' ? 'Tráth na gCeist Idirghníomhach' : 'Interactive Threat Simulator'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0A192F] mt-1 tracking-tight">
            {lang === 'ga'
              ? '“An Scaim É?” — Aithin Fíodóireacht, Téacsanna Bréige & Scaimeanna Cripte'
              : '“Is It a Scam?” — Spot Irish Smishing, Pig-Butchering & Seed Phishing'}
          </h2>
          <p className="text-sm text-slate-600 mt-1.5 max-w-2xl">
            {lang === 'ga' ? (
              <>
                Tástáil do chumas chun ionsaithe <TermTooltip termKey="phishing" lang={lang} /> agus scaimeanna infheistíochta a aithint sula gcailltear aon Euro nó <TermTooltip termKey="seed_phrase" lang={lang} />.
              </>
            ) : (
              <>
                Analyze real-world Irish financial and crypto <TermTooltip termKey="phishing" lang={lang} /> scenarios to protect your bank accounts and <TermTooltip termKey="seed_phrase" lang={lang} />.
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            speakIrishText(
              'Radar Slándála agus Cosaint ar Scaimeanna. An Scaim É? Fíodóireacht.',
              'ga'
            )
          }
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-[#006B3F] bg-white border border-[#006B3F]/30 rounded-lg hover:bg-[#006B3F]/5 transition-colors whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>{lang === 'ga' ? 'Éist le Fuaimniú Gaeilge' : 'Hear Gaeilge Terms'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Scenario Quiz (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {SCENARIOS.map((s, idx) => {
                const answered = answers[s.id];
                const correct = answered === s.verdict;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`min-w-[38px] h-9 px-3 inline-flex items-center justify-center text-xs font-mono font-bold rounded-xl border transition-colors cursor-pointer ${
                      currentIndex === idx
                        ? 'bg-[#0A192F] text-white border-[#0A192F]'
                        : answered
                        ? correct
                          ? 'bg-emerald-50 text-[#006B3F] border-[#006B3F]/30'
                          : 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>0{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-slate-600">
                {lang === 'ga' ? 'Scór:' : 'Score:'}{' '}
                <strong className="text-[#006B3F]">{totalCorrect}</strong> / {SCENARIOS.length}
              </span>
              <button
                type="button"
                onClick={handleResetQuiz}
                className="h-8 inline-flex items-center justify-center gap-1.5 px-3 text-xs font-semibold text-slate-600 hover:text-[#0A192F] bg-slate-100 hover:bg-slate-200/70 rounded-full transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                <span>{lang === 'ga' ? 'Athshocraigh' : 'Reset'}</span>
              </button>
            </div>
          </div>

          {/* Scenario Message Inspector Card */}
          <div className="p-5 rounded-2xl bg-[#0A192F] text-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs font-mono">
              <span className="text-[#F7931A] font-semibold">
                {lang === 'ga' ? currentScenario.categoryGa : currentScenario.categoryEn}
              </span>
              <span className="text-slate-400">
                Channel: {currentScenario.channel} · From: {currentScenario.senderHandle}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs sm:text-sm text-slate-100 leading-relaxed">
              “{lang === 'ga' ? currentScenario.messageGa : currentScenario.messageEn}”
            </div>

            {/* Action Buttons (Google Material 3 Pill Standard) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 items-stretch gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSelectVerdict('scam')}
                className={`min-h-[44px] py-2.5 px-4 rounded-full text-xs font-bold inline-flex items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                  userChoice === 'scam'
                    ? 'bg-red-600 text-white ring-2 ring-white shadow-md'
                    : 'bg-red-600/20 hover:bg-red-600/35 text-red-200 border border-red-500/40'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className="leading-snug">
                  {lang === 'ga' ? 'FOLÁIREAMH: IS SCAIM É SEO' : 'FLAG AS SCAM / PHISHING'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectVerdict('legitimate')}
                className={`min-h-[44px] py-2.5 px-4 rounded-full text-xs font-bold inline-flex items-center justify-center gap-2 text-center transition-all cursor-pointer ${
                  userChoice === 'legitimate'
                    ? 'bg-[#006B3F] text-white ring-2 ring-white shadow-md'
                    : 'bg-[#006B3F]/25 hover:bg-[#006B3F]/40 text-emerald-200 border border-emerald-500/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="leading-snug">
                  {lang === 'ga' ? 'FÓGRA DLISTEANACH SÁBHÁILTE' : 'SAFE / LEGITIMATE NOTICE'}
                </span>
              </button>
            </div>
          </div>

          {/* Feedback & Forensic Breakdown */}
          {userChoice && (
            <div
              className={`p-5 rounded-2xl border space-y-3 ${
                isCorrect
                  ? 'bg-emerald-50/70 border-[#006B3F]'
                  : 'bg-red-50/80 border-red-300'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-[#006B3F] shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span className="text-sm font-bold text-[#0A192F]">
                    {isCorrect
                      ? lang === 'ga'
                        ? 'Ceart go leor! D’aithin tú na comharthaí.'
                        : 'Spot on! You identified the forensic signals.'
                      : lang === 'ga'
                      ? 'Bí cúramach! Féach ar na comharthaí rabhaidh thíos.'
                      : 'Watch out! Review the forensic indicators below.'}
                  </span>
                </div>

                {currentIndex < SCENARIOS.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0A192F] hover:bg-slate-800 rounded-full transition-colors cursor-pointer shrink-0"
                  >
                    <span>{lang === 'ga' ? 'An Chéad Chás Eile' : 'Next Scenario'}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {lang === 'ga' ? currentScenario.explanationGa : currentScenario.explanationEn}
              </p>

              <div className="pt-2 border-t border-slate-200/80">
                <div className="text-xs font-semibold text-[#0A192F] mb-1.5">
                  {lang === 'ga' ? 'Príomhchomharthaí le Scrúdú:' : 'Key Forensic Signals:'}
                </div>
                <ul className="space-y-1">
                  {(lang === 'ga' ? currentScenario.redFlagsGa : currentScenario.redFlagsEn).map(
                    (flag, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="font-mono text-[#006B3F] font-bold">•</span>
                        <span>{flag}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Irish Security & Golden Rules Playbook (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
          <div>
            <h3 className="text-lg font-bold text-[#0A192F] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#006B3F]" />
              <span>
                {lang === 'ga'
                  ? 'Na 4 Riail Órga Slándála in Éirinn'
                  : 'The 4 Golden Rules of Irish Financial & Crypto Defense'}
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'ga'
                ? 'Coinnigh na rialacha seo i gcuimhne chun tú féin agus do theaghlach a chosaint.'
                : 'Memorize these non-negotiable security invariants against modern social engineering.'}
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                num: '01',
                titleEn: 'Zero Clickable Links from Revenue, An Post, or Banks',
                titleGa: 'Ná Brúigh Naisc i dTéacsanna ó Revenue nó ó Bhainc Riamh',
                descEn:
                  'Irish banks (AIB, BOI, PTSB, Revolut) and Revenue.ie never include sign-in links in SMS messages. Always type the URL manually.',
                descGa:
                  'Ní chuireann bainc Éireannacha ná Revenue.ie naisc logála isteach i dteachtaireachtaí SMS riamh.',
              },
              {
                num: '02',
                titleEn: 'Your 12/24-Word Seed Phrase Never Touches a Keyboard',
                titleGa: 'Ná Clóscríobh do Fhrása Síol 12/24-Fhocal ar Ríomhaire Riamh',
                descEn:
                  'No firmware update, tax audit, or support desk ever needs your seed words. Only enter them on a physical hardware wallet during recovery.',
                descGa:
                  'Ní bhíonn do Fhrása Síol ag teastáil le haghaidh nuashonrú bogearraí ná tacaíocht chustaiméirí riamh.',
              },
              {
                num: '03',
                titleEn: 'Beware "Unlock Fees" & WhatsApp Trading Mentors',
                titleGa: 'Seachain Grúpaí Trádála VIP ar WhatsApp & Táillí "Scaoilte"',
                descEn:
                  'If a platform demands an extra deposit to "pay tax" or "unfreeze" your crypto withdrawal, it is a Pig-Butchering scam. Stop sending money immediately.',
                descGa:
                  'Má iarrann ardán ort táille bhreise a íoc chun do chuid airgid a tharraingt siar, is scaim é. Ná seol Euro amháin eile.',
              },
              {
                num: '04',
                titleEn: 'Verify Central Bank of Ireland VASP / MiCA Registration',
                titleGa: 'Seiceáil Clárúchán Bhanc Ceannais na hÉireann (VASP / MiCA)',
                descEn:
                  'Before using any financial or crypto service in Ireland, verify the company on the official Central Bank of Ireland register.',
                descGa:
                  'Sula n-úsáideann tú aon tseirbhís airgeadais nó cripte, seiceáil clár oifigiúil Bhanc Ceannais na hÉireann.',
              },
            ].map((rule) => (
              <div key={rule.num} className="p-3.5 rounded-xl bg-[#F4F6F9] border border-slate-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-mono font-bold text-[#006B3F]">{rule.num}.</span>
                  <h4 className="text-xs font-bold text-[#0A192F]">
                    {lang === 'ga' ? rule.titleGa : rule.titleEn}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {lang === 'ga' ? rule.descGa : rule.descEn}
                </p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                {lang === 'ga' ? 'Cad le déanamh má bhíonn amhras ort? ' : 'Suspect Fraud in Ireland? '}
              </span>
              {lang === 'ga'
                ? 'Cuir glaoch láithreach ar an uimhir ar chúl do chárta bainc agus déan tuairisciú ag stáisiún Gardaí áitiúil.'
                : 'Freeze your card immediately in your banking app, call the number on the back of your card, and report to your local Garda station.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
