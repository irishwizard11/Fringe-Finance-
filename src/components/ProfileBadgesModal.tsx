import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  CheckCircle2,
  Compass,
  Lock,
  Plus,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
  Volume2,
  X,
  ArrowRight,
  Clock,
  Flag,
} from 'lucide-react';
import {
  BADGE_DEFINITIONS,
  BadgeDefinition,
  getRankForXp,
  IRISH_COUNTIES,
  UserProfile,
} from '../data/gamification';
import { Language, speakIrishText } from '../data/i18n';

interface ProfileBadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  profiles: UserProfile[];
  activeProfile: UserProfile;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (displayName: string, county: string, personaTitle: string, avatarColor: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onClaimModuleBadges: (module: 'tax' | 'bitcoin' | 'budget' | 'security') => void;
  onJumpToModule: (module: 'all' | 'tax' | 'bitcoin' | 'budget' | 'security') => void;
}

interface LearningMilestone {
  id: 'tax' | 'bitcoin' | 'budget' | 'security';
  stepNumber: string;
  titleEn: string;
  titleGa: string;
  milestoneNameEn: string;
  milestoneNameGa: string;
  estimatedTimeEn: string;
  estimatedTimeGa: string;
  xpTotal: number;
  summaryEn: string;
  summaryGa: string;
  topicsEn: string[];
  topicsGa: string[];
  badgeIds: string[];
}

const LEARNING_PATH_STAGES: LearningMilestone[] = [
  {
    id: 'bitcoin',
    stepNumber: '01',
    titleEn: 'Bitcoin Fundamentals, The Whitepaper (GA/EN) & Self-Custody',
    titleGa: 'Bunús Bitcoin, An Páipéar Bán (GA/EN) & Féin-Choinneáil',
    milestoneNameEn: 'Milestone 1: Mastering the 21M Cap, Whitepaper & Private Keys',
    milestoneNameGa: 'Cloch Mhíle 1: Teorainn 21M, An Páipéar Bán & Eochracha Príobháideacha',
    estimatedTimeEn: '~6 mins',
    estimatedTimeGa: '~6 nóiméad',
    xpTotal: 450,
    summaryEn:
      'Read Satoshi Nakamoto’s 2008 Bitcoin Whitepaper in English or Gaeilge, understand why only 21 million Bitcoin will ever exist, practice 12-word hardware wallet self-custody, and explore instant Lightning payments.',
    summaryGa:
      'Léigh Páipéar Bán Satoshi Nakamoto (2008) i nGaeilge nó i mBéarla, tuig cén fáth nach mbeidh ach 21 milliún Bitcoin ann go deo, agus foghlaim faoi Fhéin-Choinneáil agus Líonra Lightning.',
    topicsEn: [
      'Bilingual Bitcoin Whitepaper Reader (EN & Gaeilge)',
      'Central Bank Euro vs. 21M Scarce Bitcoin',
      'Hardware Wallets & 12-Word Backup Safety',
      'Instant Everyday Payments on Lightning',
    ],
    topicsGa: [
      'Léitheoir Dátheangach an Pháipéir Bháin (GA/EN)',
      'Euro an Bhainc Cheannais vs. 21M Bitcoin',
      'Sparáin Chrua-Earraí & Cúltaca 12 Fhocal',
      'Íocaíochtaí Láithreacha ar Líonra Lightning',
    ],
    badgeIds: ['badge_sovereign_keyholder', 'badge_lightning_compliance'],
  },
  {
    id: 'budget',
    stepNumber: '02',
    titleEn: 'Everyday Money Habits, Inflation & Sound Savings',
    titleGa: 'Propanna Airgid Laethúla, Boilsciú & Coigiltis Shlána',
    milestoneNameEn: 'Milestone 2: Mastering the 50/30/20 Rule & Buying Power',
    milestoneNameGa: 'Cloch Mhíle 2: Máistreacht ar an Riail 50/30/20 & Cumhacht Cheannaigh',
    estimatedTimeEn: '~5 mins',
    estimatedTimeGa: '~5 nóiméad',
    xpTotal: 350,
    summaryEn:
      'Organize your monthly pay into Needs, Wants, and Future Bitcoin/Savings, see why fiat inflation erodes idle cash purchasing power, and learn how pensions multiply your savings.',
    summaryGa:
      'Roinn do phá míosúil de réir 50/30/20, feic conas a chreimeann boilsciú airgead tirim, agus feic conas a iolraíonn coigiltis fhadtéarmacha.',
    topicsEn: [
      'Interactive 50/30/20 Monthly Budget Planner',
      'Why Prices Rise: Fiat Inflation & Buying Power',
      'The €100-for-€60 Pension Multiplier',
      'Building Positive Monthly Cashflow',
    ],
    topicsGa: [
      'Pleanálaí Buiséid Míosúil 50/30/20',
      'Cén Fáth a nArdaíonn Praghsanna (Boilsciú)',
      'Treisiú Pinsin €100 ar Chostas €60',
      'Sreabhadh Airgid Dearfach a Thógáil',
    ],
    badgeIds: ['badge_budget_architect', 'badge_pension_alchemist'],
  },
  {
    id: 'tax',
    stepNumber: '03',
    titleEn: 'Growing Wealth, Emergency Funds & Compounding',
    titleGa: 'Fás Saibhris, Ciste Éigeandála & Fás Iolraithe',
    milestoneNameEn: 'Milestone 3: Emergency Cushion & Compound Growth',
    milestoneNameGa: 'Cloch Mhíle 3: Líontán Sábháilteachta & Fás Iolraithe',
    estimatedTimeEn: '~5 mins',
    estimatedTimeGa: '~5 nóiméad',
    xpTotal: 350,
    summaryEn:
      'Learn the 4-step Money Ladder, calculate your personal Emergency Fund target so you never have to sell long-term Bitcoin in an emergency, model compound growth, and claim back cash on rent & GP bills.',
    summaryGa:
      'Foghlaim an Dréimire Airgeadais 4-Chéim, tóg do Chiste Éigeandála, samhlaigh Ús Iolraithe, agus éiligh airgead ar ais ar chíos agus billí dochtúra.',
    topicsEn: [
      'The 4-Step Financial Order of Operations',
      '3–6 Month Emergency Safety-Net Builder',
      'Compound Growth Snowball Simulator',
      'Claiming Rent (€1,000) & Medical Cash Back',
    ],
    topicsGa: [
      'An Dréimire Airgeadais 4-Chéim',
      'Áireamhán Ciste Éigeandála 3–6 Mhí',
      'Simléir Fáis Iolraithe (Ús ar Ús)',
      'Airgead Ar Ais ar Chíos (€1,000) & Dochtúir',
    ],
    badgeIds: ['badge_tax_reclaimer', 'badge_cgt_strategist'],
  },
  {
    id: 'security',
    stepNumber: '04',
    titleEn: 'Protecting Your Bitcoin & Spotting Financial Scams',
    titleGa: 'Do Chuid Bitcoin a Chosaint & Scaimeanna a Aithint',
    milestoneNameEn: 'Final Milestone: Bradán Feasa (Sovereign Financial Sage)',
    milestoneNameGa: 'Cloch Mhíle Dheiridh: An Bradán Feasa (Máistir Feasa & Bitcoine)',
    estimatedTimeEn: '~4 mins',
    estimatedTimeGa: '~4 nóiméad',
    xpTotal: 250,
    summaryEn:
      'Protect your Bitcoin seed phrase and bank accounts by spotting fake hardware wallet pop-ups, "get-rich-quick" WhatsApp/Telegram trading groups, and SMS phishing links.',
    summaryGa:
      'Cosain do Fhrása Síol Bitcoin agus do chuntais bhainc trí phreabfhuinneoga bréige sparáin, grúpaí trádála bréige ar WhatsApp, agus naisc fhíodóireachta a aithint.',
    topicsEn: [
      'Hardware Wallet Seed Phrase Phishing Defense',
      'Why “Guaranteed Daily Crypto Returns” Are Always a Scam',
      'Spotting Fake Bank & An Post SMS Links',
      'Verifying Regulated Financial Firms in Ireland',
    ],
    topicsGa: [
      'Cosaint ar Fhíodóireacht Frása Síol',
      'Cén Fáth gur Scaim iad “Brabús Ráthaithe Laethúil”',
      'Téacsanna Bréige Bainc & An Post a Aithint',
      'Comhlachtaí Rialáilte a Fhíorú in Éirinn',
    ],
    badgeIds: ['badge_scam_sentinel', 'badge_salmon_of_knowledge'],
  },
];

export const BadgeSvgEmblem: React.FC<{ iconType: BadgeDefinition['iconType']; earned: boolean }> = ({
  iconType,
  earned,
}) => {
  const strokeColor = earned ? '#F7931A' : '#94A3B8';
  const fillBg = earned ? '#0A192F' : '#F1F5F9';
  const accentFill = earned ? '#006B3F' : '#CBD5E1';

  return (
    <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0" role="img" aria-label={iconType}>
      <circle cx="32" cy="32" r="29" fill={fillBg} stroke={strokeColor} strokeWidth="2.5" />
      <circle cx="32" cy="32" r="23" fill="none" stroke={accentFill} strokeWidth="1.2" strokeDasharray="3 3" />

      {iconType === 'emerald_knot' && (
        <path
          d="M22 32 C22 22, 42 22, 42 32 C42 42, 22 42, 22 32 Z M32 22 C42 22, 42 42, 32 42 C22 42, 22 22, 32 22 Z"
          fill="none"
          stroke={earned ? '#10B981' : '#94A3B8'}
          strokeWidth="2.5"
        />
      )}

      {iconType === 'gold_shield' && (
        <path
          d="M32 16 L46 22 V33 C46 42 39 47 32 50 C25 47 18 42 18 33 V22 L32 16 Z"
          fill={earned ? '#006B3F' : 'none'}
          stroke={strokeColor}
          strokeWidth="2.5"
        />
      )}

      {iconType === 'bitcoin_key' && (
        <g>
          <circle cx="26" cy="32" r="7" fill="none" stroke={strokeColor} strokeWidth="2.5" />
          <path d="M33 32 H46 V38 M41 32 V37" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {iconType === 'lightning_bolt' && (
        <path
          d="M35 16 L22 34 H32 L29 48 L42 30 H32 L35 16 Z"
          fill={earned ? '#F7931A' : '#CBD5E1'}
        />
      )}

      {iconType === 'budget_compass' && (
        <g>
          <circle cx="32" cy="32" r="12" fill="none" stroke={earned ? '#10B981' : '#94A3B8'} strokeWidth="2.2" />
          <polygon points="32,22 36,32 32,42 28,32" fill={strokeColor} />
        </g>
      )}

      {iconType === 'pension_oak' && (
        <g>
          <circle cx="32" cy="27" r="10" fill={earned ? '#006B3F' : '#CBD5E1'} />
          <path d="M32 33 V46 M26 46 H38" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {iconType === 'radar_eye' && (
        <g>
          <path
            d="M18 32 C22 23, 42 23, 46 32 C42 41, 22 41, 18 32 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.2"
          />
          <circle cx="32" cy="32" r="4.5" fill={earned ? '#10B981' : '#94A3B8'} />
        </g>
      )}

      {iconType === 'master_salmon' && (
        <g>
          <path
            d="M18 32 C24 22, 38 22, 46 32 C38 42, 24 42, 18 32 Z M46 32 L51 26 V38 L46 32 Z"
            fill={earned ? '#F7931A' : '#CBD5E1'}
          />
          <circle cx="25" cy="30" r="1.8" fill="#0A192F" />
        </g>
      )}
    </svg>
  );
};

export const ProfileBadgesModal: React.FC<ProfileBadgesModalProps> = ({
  isOpen,
  onClose,
  lang,
  profiles,
  activeProfile,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  onClaimModuleBadges,
  onJumpToModule,
}) => {
  // Default to the new 'journey' (Learning Path Timeline) tab so users immediately see their milestone roadmap
  const [activeTab, setActiveTab] = useState<'journey' | 'badges' | 'profiles'>('journey');
  const [newName, setNewName] = useState('');
  const [newCounty, setNewCounty] = useState(IRISH_COUNTIES[0]);
  const [newPersona, setNewPersona] = useState('First-Time Buyer & Bitcoin Saver');
  const [newColor, setNewColor] = useState('#006B3F');

  if (!isOpen) return null;

  const rankInfo = getRankForXp(activeProfile.xp);
  const earnedCount = Object.keys(activeProfile.earnedBadges).length;
  const totalBadges = BADGE_DEFINITIONS.length;

  const completedStagesCount = LEARNING_PATH_STAGES.filter(
    (s) => activeProfile.completedModules[s.id]
  ).length;

  // Determine the "Next Active Milestone" (first uncompleted module)
  const firstUncompletedStage = LEARNING_PATH_STAGES.find(
    (s) => !activeProfile.completedModules[s.id]
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProfile(newName.trim(), newCounty, newPersona.trim() || 'Irish Financial Learner', newColor);
    setNewName('');
    setActiveTab('journey');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0A192F]/70 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-[#0D1F38] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E3A5F] overflow-hidden flex flex-col max-h-[92dvh] safe-area-pb">
        {/* Top Modal Header */}
        <div className="px-4 sm:px-6 py-4 bg-[#0A192F] text-white flex items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-sm sm:text-lg font-bold text-white border-2 border-[#F7931A] shrink-0"
              style={{ backgroundColor: activeProfile.avatarColor }}
            >
              {activeProfile.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-bold tracking-tight truncate">
                  {activeProfile.displayName}
                </h2>
                <span className="text-xs font-mono text-[#F7931A] shrink-0">
                  · {activeProfile.county}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                {lang === 'ga' ? rankInfo.current.titleGa : rankInfo.current.titleEn} (Lv.{' '}
                {rankInfo.current.level}) ·{' '}
                <span className="font-mono font-semibold text-emerald-400">
                  {activeProfile.xp} XP
                </span>{' '}
                · {earnedCount}/{totalBadges} {lang === 'ga' ? 'Suaitheantais' : 'Badges'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                speakIrishText(
                  `${activeProfile.displayName}. ${rankInfo.current.titleGa}. Tá ${completedStagesCount} as 4 chéim críochnaithe agat.`,
                  'ga'
                )
              }
              className="h-9 inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full border border-slate-700 transition-colors cursor-pointer"
              title={lang === 'ga' ? 'Éist' : 'Pronounce Rank'}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
              <span className="hidden sm:inline">{lang === 'ga' ? 'Éist' : 'Pronounce Rank'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 inline-flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Close profile modal"
            >
              <X className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>

        {/* XP Progress & Responsive 3-Column Segmented Pill Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#F4F6F9] dark:bg-[#0A192F] border-b border-slate-200 dark:border-[#1E3A5F] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center justify-between gap-2 text-xs font-medium">
              <span className="text-slate-700 dark:text-slate-300 truncate">
                {lang === 'ga' ? 'Céim Eile:' : 'Next Rank:'}{' '}
                <strong className="text-[#0A192F] dark:text-white">
                  {rankInfo.next
                    ? lang === 'ga'
                      ? rankInfo.next.titleGa
                      : rankInfo.next.titleEn
                    : lang === 'ga'
                    ? 'Céim Uasta!'
                    : 'Max Rank!'}
                </strong>
              </span>
              <span className="font-mono font-bold text-[#006B3F] dark:text-emerald-400 tabular-nums shrink-0">
                {activeProfile.xp} {rankInfo.next ? `/ ${rankInfo.next.minXp} XP` : 'XP'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#006B3F] to-[#F7931A]"
                initial={{ width: 0 }}
                animate={{ width: `${rankInfo.progressPct}%` }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-stretch gap-1 p-1 bg-slate-200/80 dark:bg-[#0F2342] rounded-2xl sm:rounded-full w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('journey')}
              className={`min-h-[36px] px-2.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-xl sm:rounded-full transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'journey'
                  ? 'bg-[#006B3F] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{lang === 'ga' ? 'Conair' : 'Path'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('badges')}
              className={`min-h-[36px] px-2.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-xl sm:rounded-full transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'badges'
                  ? 'bg-[#006B3F] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {lang === 'ga'
                  ? `Suaitheantais (${earnedCount}/${totalBadges})`
                  : `Badges (${earnedCount}/${totalBadges})`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profiles')}
              className={`min-h-[36px] px-2.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-bold rounded-xl sm:rounded-full transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'profiles'
                  ? 'bg-[#006B3F] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {lang === 'ga' ? `Próifílí (${profiles.length})` : `Profiles (${profiles.length})`}
              </span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: INTERACTIVE TIMELINE LEARNING PATH VISUALIZATION */}
          {activeTab === 'journey' && (
            <div className="space-y-5">
              {/* Top Horizontal Milestone Overview Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0A192F] text-white border border-slate-800 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-[#F7931A] font-semibold uppercase tracking-wide">
                      {lang === 'ga'
                        ? 'DO CHONAIR FOGHLAMA (4 CHLOCH MHÍLE)'
                        : 'YOUR INTERACTIVE LEARNING PATH (4 MILESTONES)'}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 leading-snug">
                      {completedStagesCount === 4
                        ? lang === 'ga'
                          ? 'Comhghairdeas! Tá gach cloch mhíle críochnaithe agat (An Bradán Feasa).'
                          : 'Congratulations! You have mastered all 4 milestones and unlocked the Salmon of Knowledge.'
                        : lang === 'ga'
                        ? `An Chéad Chloch Mhíle Eile: ${firstUncompletedStage?.titleGa}`
                        : `Current Focus: ${firstUncompletedStage?.titleEn}`}
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 shrink-0">
                    {completedStagesCount} / 4 {lang === 'ga' ? 'Críochnaithe' : 'Complete'} (
                    {Math.round((completedStagesCount / 4) * 100)}%)
                  </div>
                </div>

                {/* Smooth Animated Overall Milestone Progress Bar */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/80">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#006B3F] via-emerald-400 to-[#F7931A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((completedStagesCount / 4) * 100)}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                {/* SVG Horizontal Milestone Map with Framer Motion Transitions */}
                <svg
                  viewBox="0 0 680 78"
                  className="w-full h-auto"
                  role="img"
                  aria-label="4-stage learning path milestone map"
                >
                  {/* Background Track Line */}
                  <line
                    x1="75"
                    y1="28"
                    x2="605"
                    y2="28"
                    stroke="#334155"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Smooth Animated Active Progress Line */}
                  <motion.line
                    x1="75"
                    y1="28"
                    y2="28"
                    initial={{ x2: 75 }}
                    animate={{
                      x2:
                        completedStagesCount === 0
                          ? 75
                          : 75 + Math.min(3, Math.max(0.35, completedStagesCount - 0.25)) * (530 / 3),
                    }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  {LEARNING_PATH_STAGES.map((stage, idx) => {
                    const cx = 75 + idx * 176;
                    const isDone = activeProfile.completedModules[stage.id];
                    const isNext = firstUncompletedStage?.id === stage.id;

                    return (
                      <g key={stage.id}>
                        <motion.circle
                          cx={cx}
                          cy={28}
                          r={18}
                          initial={false}
                          animate={{
                            scale: isDone ? [0.82, 1.16, 1] : 1,
                            fill: isDone ? '#006B3F' : isNext ? '#F7931A' : '#1E293B',
                            stroke: isDone ? '#10B981' : isNext ? '#FFFFFF' : '#475569',
                          }}
                          transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                          strokeWidth="2.5"
                        />

                        {isDone ? (
                          <motion.path
                            key={`svg-check-${stage.id}`}
                            d={`M ${cx - 6} 28.5 L ${cx - 1.5} 33 L ${cx + 6.5} 23.5`}
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, scale: 0.4, opacity: 0 }}
                            animate={{ pathLength: 1, scale: 1, opacity: 1 }}
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 16,
                            }}
                          />
                        ) : (
                          <text
                            x={cx}
                            y={32}
                            textAnchor="middle"
                            fill={isNext ? '#0A192F' : '#FFFFFF'}
                            fontSize="12"
                            fontWeight="700"
                            fontFamily="IBM Plex Mono, monospace"
                          >
                            {stage.stepNumber}
                          </text>
                        )}

                        <text
                          x={cx}
                          y={64}
                          textAnchor="middle"
                          fill={isDone ? '#34D399' : isNext ? '#F7931A' : '#94A3B8'}
                          fontSize="12"
                          fontWeight="700"
                        >
                          {lang === 'ga'
                            ? `${idx + 1}. ${
                                stage.id === 'bitcoin'
                                  ? 'Bitcoin'
                                  : stage.id === 'budget'
                                  ? 'Airgead'
                                  : stage.id === 'tax'
                                  ? 'Saibhreas'
                                  : 'Slándáil'
                              }`
                            : `${idx + 1}. ${
                                stage.id === 'bitcoin'
                                  ? 'Bitcoin'
                                  : stage.id === 'budget'
                                  ? 'Money'
                                  : stage.id === 'tax'
                                  ? 'Wealth'
                                  : 'Safety'
                              }`}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Vertical Timeline Journey Cards with Animated Progress Spine & Popping Checkmarks */}
              <div className="relative pl-7 sm:pl-9 space-y-5">
                {/* Background Vertical Timeline Track */}
                <div className="absolute top-5 bottom-5 left-2.5 sm:left-3.5 w-0.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="w-full bg-gradient-to-b from-[#006B3F] to-emerald-400 rounded-full"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.round((completedStagesCount / 4) * 100)}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>

                {LEARNING_PATH_STAGES.map((stage) => {
                  const isDone = activeProfile.completedModules[stage.id];
                  const isCurrentFocus = firstUncompletedStage?.id === stage.id;
                  const stageBadges = BADGE_DEFINITIONS.filter((b) =>
                    stage.badgeIds.includes(b.id)
                  );

                  return (
                    <motion.div
                      key={stage.id}
                      layout
                      className="relative"
                    >
                      {/* Animated Timeline Node Marker */}
                      <motion.div
                        initial={false}
                        animate={
                          isDone
                            ? { scale: [0.6, 1.25, 1], backgroundColor: '#006B3F', borderColor: '#006B3F' }
                            : isCurrentFocus
                            ? { scale: 1, backgroundColor: '#F7931A', borderColor: '#0A192F' }
                            : { scale: 1, backgroundColor: '#FFFFFF', borderColor: '#CBD5E1' }
                        }
                        transition={{ type: 'spring', stiffness: 450, damping: 16 }}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold absolute -left-7 sm:-left-9 top-4 border-2 z-10 ${
                          isDone
                            ? 'text-white shadow-sm'
                            : isCurrentFocus
                            ? 'text-[#0A192F] shadow-md'
                            : 'text-slate-500'
                        }`}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {isDone ? (
                            <motion.span
                              key="done-check"
                              initial={{ scale: 0, rotate: -45, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 520, damping: 15 }}
                              className="flex items-center justify-center"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </motion.span>
                          ) : isCurrentFocus ? (
                            <motion.span
                              key="focus-flag"
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-center"
                            >
                              <Flag className="w-3.5 h-3.5" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="step-num"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              {stage.stepNumber}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Milestone Card */}
                      <motion.div
                        layout
                        className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
                          isDone
                            ? 'bg-[#006B3F]/6 border-[#006B3F]'
                            : isCurrentFocus
                            ? 'bg-white dark:bg-[#0F2342] border-2 border-[#F7931A] shadow-md'
                            : 'bg-slate-50/80 dark:bg-[#0A192F]/80 border-slate-200 dark:border-[#1E3A5F]'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3.5 border-b border-slate-200/80 dark:border-[#1E3A5F]">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono">
                              <span
                                className={`font-bold inline-flex items-center gap-1 ${
                                  isDone
                                    ? 'text-[#006B3F] dark:text-emerald-400'
                                    : isCurrentFocus
                                    ? 'text-[#D97706] dark:text-[#F7931A]'
                                    : 'text-slate-500'
                                }`}
                              >
                                {isDone && (
                                  <motion.span
                                    initial={{ scale: 0, rotate: -30 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                    className="inline-flex"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#006B3F] dark:text-emerald-400" />
                                  </motion.span>
                                )}
                                {isDone
                                  ? lang === 'ga'
                                    ? 'CRÍOCHNAITHE'
                                    : 'COMPLETED'
                                  : isCurrentFocus
                                  ? lang === 'ga'
                                    ? '★ AN CHÉAD CHÉIM EILE'
                                    : '★ CURRENT FOCUS'
                                  : lang === 'ga'
                                  ? 'LE TEACHT'
                                  : 'UPCOMING'}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1 text-slate-500">
                                <Clock className="w-3 h-3" />
                                {lang === 'ga' ? stage.estimatedTimeGa : stage.estimatedTimeEn}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="font-bold text-[#006B3F] dark:text-emerald-400">
                                +{stage.xpTotal} XP
                              </span>
                            </div>

                            <h4 className="text-sm sm:text-base font-bold text-[#0A192F] dark:text-white mt-1 leading-snug">
                              {stage.stepNumber}. {lang === 'ga' ? stage.titleGa : stage.titleEn}
                            </h4>
                            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                              {lang === 'ga' ? stage.milestoneNameGa : stage.milestoneNameEn}
                            </div>
                          </div>

                          {/* Action Buttons — Responsive Grid on Mobile, Inline on Desktop */}
                          <div
                            className={`grid ${
                              !isDone ? 'grid-cols-2' : 'grid-cols-1'
                            } sm:flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onJumpToModule(stage.id);
                                onClose();
                              }}
                              className={`${
                                isCurrentFocus ? 'btn-google-amber' : 'btn-google-outlined'
                              } !px-3.5 !py-2 !text-xs w-full sm:w-auto justify-center`}
                            >
                              <span className="truncate">
                                {isDone
                                  ? lang === 'ga'
                                    ? 'Athbhreithnigh'
                                    : 'Review'
                                  : lang === 'ga'
                                  ? 'Tosaigh Anois'
                                  : 'Launch Module'}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </button>

                            {!isDone && (
                              <button
                                type="button"
                                onClick={() => onClaimModuleBadges(stage.id)}
                                className="btn-google-filled !px-3.5 !py-2 !text-xs w-full sm:w-auto justify-center"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                                <span className="truncate">
                                  {lang === 'ga' ? 'Marcáil Déanta' : 'Complete'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Individual Stage Progress Bar with Smooth Fill Transition */}
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-[11px] font-mono text-slate-500">
                            <span>
                              {lang === 'ga' ? 'Dul Chun Cinn na Céime' : 'Milestone Progress'}
                            </span>
                            <span className={isDone ? 'text-[#006B3F] dark:text-emerald-400 font-bold' : ''}>
                              {isDone ? '100%' : '0%'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200/90 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#006B3F] to-emerald-400 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: isDone ? '100%' : '0%' }}
                              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                          {lang === 'ga' ? stage.summaryGa : stage.summaryEn}
                        </p>

                        {/* Topics & Milestone Badges Row */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start md:items-center pt-3 border-t border-slate-200/60 dark:border-[#1E3A5F]">
                          <div className="md:col-span-7">
                            <div className="text-[11px] font-bold text-slate-500 mb-1.5">
                              {lang === 'ga'
                                ? 'Ábhair & Uirlisí sa Chéim Seo:'
                                : 'Key Topics & Interactive Tools Covered:'}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {(lang === 'ga' ? stage.topicsGa : stage.topicsEn).map((topic, i) => (
                                <div
                                  key={i}
                                  className="text-xs text-[#0A192F] dark:text-slate-200 flex items-start gap-1.5"
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                                      isDone ? 'bg-[#006B3F]' : 'bg-[#F7931A]'
                                    }`}
                                  />
                                  <span className="leading-snug">{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="md:col-span-5 flex flex-wrap items-center md:justify-end gap-2">
                            {stageBadges.map((b) => {
                              const unlocked = Boolean(activeProfile.earnedBadges[b.id]);
                              return (
                                <div
                                  key={b.id}
                                  className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold flex items-center gap-1.5 max-w-full ${
                                    unlocked
                                      ? 'bg-[#006B3F]/10 border-[#006B3F]/30 text-[#006B3F] dark:text-emerald-400'
                                      : 'bg-white dark:bg-[#0A192F] border-slate-200 dark:border-[#1E3A5F] text-slate-500'
                                  }`}
                                >
                                  <AnimatePresence mode="wait" initial={false}>
                                    {unlocked ? (
                                      <motion.span
                                        key="badge-unlocked"
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: 'spring', stiffness: 520, damping: 14 }}
                                        className="inline-flex shrink-0"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#006B3F] dark:text-emerald-400" />
                                      </motion.span>
                                    ) : (
                                      <motion.span
                                        key="badge-locked"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="inline-flex shrink-0"
                                      >
                                        <Lock className="w-3 h-3 text-slate-400" />
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                  <span className="truncate">
                                    {lang === 'ga' ? b.titleGa : b.titleEn}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BADGES GALLERY */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0A192F]">
                  {lang === 'ga'
                    ? 'Gailearaí Suaitheantas Ceilteach & Bitcoine'
                    : 'All Achievement Badges & Credentials'}
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {earnedCount} / {totalBadges} {lang === 'ga' ? 'bainte amach' : 'unlocked'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BADGE_DEFINITIONS.map((badge) => {
                  const earnedTimestamp = activeProfile.earnedBadges[badge.id];
                  const isEarned = Boolean(earnedTimestamp);

                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-2xl border flex items-start gap-4 transition-colors ${
                        isEarned
                          ? 'bg-white border-[#006B3F] shadow-xs'
                          : 'bg-slate-50/70 border-slate-200 opacity-75'
                      }`}
                    >
                      <BadgeSvgEmblem iconType={badge.iconType} earned={isEarned} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-[#006B3F]">
                            +{badge.xpReward} XP
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            {isEarned
                              ? lang === 'ga'
                                ? 'Bainte amach ✓'
                                : 'Unlocked ✓'
                              : lang === 'ga'
                              ? 'Faoi Ghlas'
                              : 'Locked'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#0A192F] mt-0.5">
                          {lang === 'ga' ? badge.titleGa : badge.titleEn}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {lang === 'ga' ? badge.descriptionGa : badge.descriptionEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SWITCH OR CREATE LEARNER PROFILE */}
          {activeTab === 'profiles' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-sm font-bold text-[#0A192F]">
                  {lang === 'ga' ? 'Próifílí Foghlama Sábháilte' : 'Saved Learner Profiles'}
                </h3>
                <div className="space-y-2.5">
                  {profiles.map((prof) => {
                    const isCurrent = prof.id === activeProfile.id;
                    const pRank = getRankForXp(prof.xp);
                    const pBadges = Object.keys(prof.earnedBadges).length;

                    return (
                      <div
                        key={prof.id}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
                          isCurrent
                            ? 'bg-[#006B3F]/6 border-[#006B3F]'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                            style={{ backgroundColor: prof.avatarColor }}
                          >
                            {prof.displayName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-[#0A192F] truncate">
                                {prof.displayName}
                              </span>
                              <span className="text-xs text-slate-500 truncate">
                                · {prof.county}
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 font-mono mt-0.5">
                              {lang === 'ga' ? pRank.current.titleGa : pRank.current.titleEn} ·{' '}
                              <span className="text-[#006B3F] font-semibold">{prof.xp} XP</span> ·{' '}
                              {pBadges}/{BADGE_DEFINITIONS.length}{' '}
                              {lang === 'ga' ? 'Suaitheantais' : 'Badges'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isCurrent ? (
                            <span className="h-8 inline-flex items-center justify-center gap-1 px-3 text-xs font-semibold text-[#006B3F] bg-[#006B3F]/10 rounded-full">
                              <UserCheck className="w-3.5 h-3.5 shrink-0" />
                              <span>{lang === 'ga' ? 'Gníomhach' : 'Active'}</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onSelectProfile(prof.id)}
                              className="btn-google-outlined !min-h-[34px] !px-3.5 !py-1.5 !text-xs"
                            >
                              {lang === 'ga' ? 'Roghnaigh' : 'Switch'}
                            </button>
                          )}

                          {profiles.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onDeleteProfile(prof.id)}
                              className="w-8 h-8 inline-flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer shrink-0"
                              aria-label={`Delete profile ${prof.displayName}`}
                            >
                              <Trash2 className="w-4 h-4 shrink-0" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form
                onSubmit={handleCreateSubmit}
                className="lg:col-span-5 p-5 rounded-2xl bg-[#F4F6F9] border border-slate-200 space-y-4"
              >
                <h3 className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#006B3F] shrink-0" />
                  <span>
                    {lang === 'ga' ? 'Cruthaigh Próifíl Nua' : 'Create New Learner Profile'}
                  </span>
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ga' ? 'Ainm Taispeána' : 'Your Name / Handle'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={lang === 'ga' ? 'm.sh. Ciarán Ó Briain' : 'e.g. Ciarán O’Brien'}
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-300 rounded-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ga' ? 'Contae' : 'Irish County'}
                  </label>
                  <select
                    value={newCounty}
                    onChange={(e) => setNewCounty(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-300 rounded-full"
                  >
                    {IRISH_COUNTIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {lang === 'ga' ? 'Sprioc Airgeadais' : 'Primary Financial Goal'}
                  </label>
                  <input
                    type="text"
                    value={newPersona}
                    onChange={(e) => setNewPersona(e.target.value)}
                    placeholder="e.g. Mastering PAYE Refunds & Cold Storage"
                    className="w-full h-10 px-3.5 text-xs bg-white border border-slate-300 rounded-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {lang === 'ga' ? 'Dath an tSuaitheantais' : 'Profile Emblem Color'}
                  </label>
                  <div className="flex items-center gap-2">
                    {['#006B3F', '#0A192F', '#D97706', '#2563EB', '#7C3AED'].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewColor(col)}
                        className={`w-8 h-8 rounded-full border-2 inline-flex items-center justify-center transition-transform cursor-pointer shrink-0 ${
                          newColor === col ? 'border-[#F7931A] scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: col }}
                        aria-label={`Select color ${col}`}
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full btn-google-filled !min-h-[40px] justify-center">
                  <Sparkles className="w-4 h-4 text-[#F7931A] shrink-0" />
                  <span>
                    {lang === 'ga'
                      ? 'Cruthaigh & Tosaigh do Chonair'
                      : 'Create Profile & Start Learning Path'}
                  </span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
