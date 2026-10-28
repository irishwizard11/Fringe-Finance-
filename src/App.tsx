import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Shield,
  TrendingUp,
  Coins,
  Wallet,
  Volume2,
  Globe,
  Award,
  CheckCircle2,
  Sparkles,
  Moon,
  Sun,
  FileText,
  Trophy,
  Home,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { Language, speakIrishText } from './data/i18n';
import {
  BADGE_DEFINITIONS,
  DailyQuizRecord,
  DEFAULT_PROFILES,
  getRankForXp,
  STORAGE_KEY_ACTIVE_PROFILE_ID,
  STORAGE_KEY_PROFILES,
  UserProfile,
} from './data/gamification';
import { TermTooltip, GlossaryDrawer } from './components/TermTooltip';
import { TaxNavigator } from './components/TaxNavigator';
import { BitcoinHub } from './components/BitcoinHub';
import { BitcoinWhitepaperReader } from './components/BitcoinWhitepaperReader';
import { PurchasingPowerLab } from './components/PurchasingPowerLab';
import { ScamRadar } from './components/ScamRadar';
import { DailyQuizArena } from './components/DailyQuizArena';
import { AiAdvisorChat } from './components/AiAdvisorChat';
import { ProfileBadgesModal } from './components/ProfileBadgesModal';
import { BitcoinPriceWidget } from './components/BitcoinPriceWidget';
import { HomeFaqSection } from './components/HomeFaqSection';

export type ActivePage =
  | 'home'
  | 'bitcoin'
  | 'whitepaper'
  | 'budget'
  | 'tax'
  | 'security'
  | 'quiz';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY_THEME = 'fringe_finance_theme_mode_v1';

const PAGE_HASH_MAP: Record<ActivePage, string> = {
  home: '#home',
  bitcoin: '#bitcoin',
  whitepaper: '#whitepaper',
  budget: '#money',
  tax: '#wealth',
  security: '#safety',
  quiz: '#quiz',
};

function getPageFromHash(hash: string): ActivePage {
  const clean = hash.replace('#', '').toLowerCase();
  if (clean === 'bitcoin') return 'bitcoin';
  if (clean === 'whitepaper') return 'whitepaper';
  if (clean === 'money' || clean === 'budget') return 'budget';
  if (clean === 'wealth' || clean === 'tax') return 'tax';
  if (clean === 'safety' || clean === 'security') return 'security';
  if (clean === 'quiz') return 'quiz';
  return 'home';
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Discrete multi-page state synced with URL hash so every button opens its own standalone page
  const [activePage, setActivePage] = useState<ActivePage>(() =>
    typeof window !== 'undefined' ? getPageFromHash(window.location.hash) : 'home'
  );
  const [bitcoinInitialLesson, setBitcoinInitialLesson] = useState<
    'basics' | 'whitepaper' | 'custody' | 'monitor' | 'lightning' | 'tax'
  >('basics');
  const [glossaryOpen, setGlossaryOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(getPageFromHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const navigateToPage = (
    page: ActivePage,
    options?: {
      bitcoinLesson?: 'basics' | 'whitepaper' | 'custody' | 'monitor' | 'lightning' | 'tax';
    }
  ) => {
    if (page === 'bitcoin') {
      setBitcoinInitialLesson(options?.bitcoinLesson || 'basics');
    }
    setActivePage(page);
    try {
      const targetHash = PAGE_HASH_MAP[page];
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
    } catch {
      // ignore history errors in iframe
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    navigateToPage('home');
  };

  const openWhitepaperDirectly = () => {
    navigateToPage('whitepaper');
  };

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILES;
    } catch {
      return DEFAULT_PROFILES;
    }
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE_ID) || DEFAULT_PROFILES[0].id;
    } catch {
      return DEFAULT_PROFILES[0].id;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
    } catch {
      // ignore storage errors
    }
  }, [profiles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_PROFILE_ID, activeProfileId);
    } catch {
      // ignore storage errors
    }
  }, [activeProfileId]);

  const activeProfile =
    profiles.find((p) => p.id === activeProfileId) || profiles[0] || DEFAULT_PROFILES[0];
  const rankInfo = getRankForXp(activeProfile.xp);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ga' : 'en'));
  };

  const handleCreateProfile = (
    displayName: string,
    county: string,
    personaTitle: string,
    avatarColor: string
  ) => {
    const newProf: UserProfile = {
      id: `profile-${Date.now()}`,
      displayName,
      county,
      personaTitleEn: personaTitle,
      personaTitleGa: personaTitle,
      avatarColor,
      createdAt: new Date().toISOString().slice(0, 10),
      xp: 100,
      earnedBadges: {},
      completedModules: {
        tax: false,
        bitcoin: false,
        budget: false,
        security: false,
      },
      dailyQuizBestScore: 0,
      dailyQuizStreak: 1,
    };
    setProfiles((prev) => [...prev, newProf]);
    setActiveProfileId(newProf.id);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return;
    const remaining = profiles.filter((p) => p.id !== profileId);
    setProfiles(remaining);
    if (activeProfileId === profileId) {
      setActiveProfileId(remaining[0].id);
    }
  };

  const handleRecordDailyQuizResult = (
    profileId: string,
    record: DailyQuizRecord,
    xpEarned: number
  ) => {
    setProfiles((prev) =>
      prev.map((prof) => {
        if (prof.id !== profileId) return prof;
        const nowIso = new Date().toISOString();
        const prevHistory = prof.dailyQuizHistory || {};
        const prevToday = prevHistory[record.dateKey];
        const bestTodayScore = prevToday ? Math.max(prevToday.score, record.score) : record.score;
        const updatedBestOverall = Math.max(prof.dailyQuizBestScore || 0, record.score);
        const isFirstPlayToday = !prevToday;
        const nextStreak = isFirstPlayToday
          ? (prof.dailyQuizStreak || 1) + 1
          : prof.dailyQuizStreak || 1;

        const updatedBadges = { ...prof.earnedBadges };
        let bonusBadgeXp = 0;
        if (record.correctCount >= 4 && !updatedBadges.badge_daily_champion) {
          updatedBadges.badge_daily_champion = nowIso;
          bonusBadgeXp += 300;
        }

        return {
          ...prof,
          xp: prof.xp + xpEarned + bonusBadgeXp,
          earnedBadges: updatedBadges,
          dailyQuizBestScore: updatedBestOverall,
          dailyQuizStreak: nextStreak,
          lastDailyQuizDate: record.dateKey,
          dailyQuizHistory: {
            ...prevHistory,
            [record.dateKey]: {
              ...record,
              score: bestTodayScore,
            },
          },
        };
      })
    );
  };

  const handleClaimModuleBadges = (moduleKey: 'tax' | 'bitcoin' | 'budget' | 'security') => {
    setProfiles((prev) =>
      prev.map((prof) => {
        if (prof.id !== activeProfile.id) return prof;

        const nowIso = new Date().toISOString();
        const updatedBadges = { ...prof.earnedBadges };
        let addedXp = 0;

        BADGE_DEFINITIONS.filter(
          (b) => b.module === moduleKey && b.id !== 'badge_salmon_of_knowledge'
        ).forEach((b) => {
          if (!updatedBadges[b.id]) {
            updatedBadges[b.id] = nowIso;
            addedXp += b.xpReward;
          }
        });

        const updatedCompleted = {
          ...prof.completedModules,
          [moduleKey]: true,
        };

        const allFourDone =
          updatedCompleted.tax &&
          updatedCompleted.bitcoin &&
          updatedCompleted.budget &&
          updatedCompleted.security;

        if (allFourDone && !updatedBadges.badge_salmon_of_knowledge) {
          updatedBadges.badge_salmon_of_knowledge = nowIso;
          addedXp += 500;
        }

        return {
          ...prof,
          xp: prof.xp + addedXp,
          earnedBadges: updatedBadges,
          completedModules: updatedCompleted,
        };
      })
    );
  };

  // Helper to render the top page navigation banner on inner pages
  const renderInnerPageBar = (config: {
    badgeEn: string;
    badgeGa: string;
    titleEn: string;
    titleGa: string;
    nextPage: ActivePage;
    nextLabelEn: string;
    nextLabelGa: string;
  }) => (
    <div className="bg-[#0A192F] text-white border-b border-slate-800">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={goHome}
            className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 text-xs font-bold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
            <span>{lang === 'ga' ? 'Ar Ais go Baile' : 'Back to Home'}</span>
          </button>
          <div className="min-w-0">
            <div className="text-[11px] font-mono text-[#F7931A] font-semibold truncate">
              {lang === 'ga' ? config.badgeGa : config.badgeEn}
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white truncate">
              {lang === 'ga' ? config.titleGa : config.titleEn}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setProfileModalOpen(true)}
            className="h-9 inline-flex items-center justify-center gap-1.5 px-3.5 text-xs font-semibold text-slate-200 bg-white/8 hover:bg-white/14 border border-white/15 rounded-full transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
            <span className="font-mono">{activeProfile.xp} XP</span>
          </button>
          <button
            type="button"
            onClick={() => navigateToPage(config.nextPage)}
            className="btn-google-amber !min-h-[36px] !px-3.5 !py-1.5 !text-xs"
          >
            <span className="truncate">
              {lang === 'ga' ? config.nextLabelGa : config.nextLabelEn}
            </span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9] dark:bg-[#060E1E] text-[#0A192F] dark:text-slate-100 transition-colors duration-200">
      {/* TOP BAR CONTRACT: 1-row, 3-zone header separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0A192F]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1E3A5F]">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-2 sm:gap-6 px-3 sm:px-8 py-3">
          {/* Zone 1: Single text element Brand wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              goHome();
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-[#0A192F] dark:text-white whitespace-nowrap shrink-0 font-display"
          >
            <span className="sm:hidden">
              {lang === 'ga' ? 'Emerald Ledger' : 'Emerald Ledger'}
            </span>
            <span className="hidden sm:inline">
              {lang === 'ga' ? 'Emerald Ledger · Mórleabhar Smaragda' : 'Emerald Ledger'}
            </span>
          </a>

          {/* Zone 2: Separate Page Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={goHome}
              className={`hover:text-[#0A192F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center gap-1.5 py-1 ${
                activePage === 'home'
                  ? 'text-[#F7931A] font-semibold underline decoration-2 underline-offset-8'
                  : ''
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
              <span>{lang === 'ga' ? 'Baile' : 'Home'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigateToPage('bitcoin')}
              className={`hover:text-[#0A192F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center gap-1.5 py-1 ${
                activePage === 'bitcoin'
                  ? 'text-[#F7931A] font-semibold underline decoration-2 underline-offset-8'
                  : ''
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
              <span>{lang === 'ga' ? '1. Mol Bitcoin' : '1. Bitcoin Hub'}</span>
            </button>
            <button
              type="button"
              onClick={openWhitepaperDirectly}
              className={`hover:text-[#0A192F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center py-1 ${
                activePage === 'whitepaper'
                  ? 'text-[#F7931A] font-semibold underline decoration-2 underline-offset-8'
                  : ''
              }`}
            >
              {lang === 'ga' ? 'Páipéar Bán' : 'Whitepaper'}
            </button>
            <button
              type="button"
              onClick={() => navigateToPage('budget')}
              className={`hover:text-[#0A192F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center py-1 ${
                activePage === 'budget'
                  ? 'text-[#006B3F] dark:text-emerald-400 font-semibold underline decoration-2 underline-offset-8'
                  : ''
              }`}
            >
              {lang === 'ga' ? '2. Airgead' : '2. Money'}
            </button>
            <button
              type="button"
              onClick={() => navigateToPage('tax')}
              className={`hover:text-[#0A192F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center py-1 ${
                activePage === 'tax'
                  ? 'text-[#006B3F] dark:text-emerald-400 font-semibold underline decoration-2 underline-offset-8'
                  : ''
              }`}
            >
              {lang === 'ga' ? '3. Saibhreas' : '3. Wealth'}
            </button>
            <button
              type="button"
              onClick={() => navigateToPage('security')}
              className={`hover:text-[#0A192F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center py-1 ${
                activePage === 'security'
                  ? 'text-[#006B3F] dark:text-emerald-400 font-semibold underline decoration-2 underline-offset-8'
                  : ''
              }`}
            >
              {lang === 'ga' ? '4. Slándáil' : '4. Safety'}
            </button>
            <button
              type="button"
              onClick={() => navigateToPage('quiz')}
              className={`hover:text-[#0A192F] dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center justify-center gap-1.5 py-1 ${
                activePage === 'quiz'
                  ? 'text-[#F7931A] font-semibold underline decoration-2 underline-offset-8'
                  : ''
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
              <span>{lang === 'ga' ? 'Tráth na gCeist' : 'Daily Quiz'}</span>
            </button>
          </nav>

          {/* Zone 3: Real-time Bitcoin EUR Price Widget + Global Theme Toggle + Bilingual Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <BitcoinPriceWidget
              lang={lang}
              onClick={() => navigateToPage('bitcoin')}
            />

            <button
              type="button"
              onClick={toggleTheme}
              className="btn-google-outlined h-9 !py-0 !px-2.5 sm:!px-3.5 shrink-0"
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night Mode'}
              title={
                theme === 'dark'
                  ? lang === 'ga'
                    ? 'Mód Solais'
                    : 'Light Mode'
                  : lang === 'ga'
                  ? 'Mód Oíche (Cabhlach Doimhin)'
                  : 'Deep Navy Night Mode'
              }
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-[#F7931A] shrink-0" />
                  <span className="hidden xl:inline whitespace-nowrap">
                    {lang === 'ga' ? 'Mód Solais' : 'Light Mode'}
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#0A192F] shrink-0" />
                  <span className="hidden xl:inline whitespace-nowrap">
                    {lang === 'ga' ? 'Mód Oíche' : 'Night Mode'}
                  </span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className="btn-google-filled h-9 !py-0 !px-3 sm:!px-4 shrink-0"
            >
              <Globe className="w-4 h-4 text-[#F7931A] shrink-0" />
              <span className="sm:hidden whitespace-nowrap">{lang === 'en' ? 'GA' : 'EN'}</span>
              <span className="hidden sm:inline whitespace-nowrap">
                {lang === 'en' ? 'Gaeilge' : 'English'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MULTI-PAGE VIEWPORT — Each button opens its own standalone page */}
      <AnimatePresence mode="wait">
        {activePage === 'home' && (
          <motion.div
            key="page-home"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* HOME HERO & LEARNER PROGRESS CARD */}
            <section className="bg-gradient-to-b from-[#0A192F] to-[#102444] text-white border-b border-slate-800">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-6 sm:py-8 lg:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  {/* Left: Crisp Bitcoin & Financial Literacy Welcome (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300">
                      <span className="text-[#F7931A] font-semibold">
                        {lang === 'ga'
                          ? 'Oideachas Bitcoine, Airgead Fónta & An Páipéar Bán i nGaeilge'
                          : 'Bitcoin Literacy, Sound Money & The Bilingual Whitepaper'}
                      </span>
                      <span aria-hidden="true" className="hidden sm:inline">·</span>
                      <span className="text-slate-400">
                        {lang === 'ga'
                          ? 'Uirlis eolais & oideachais amháin.'
                          : 'Educational tool only. Not regulated financial advice.'}
                      </span>
                    </div>

                    <h1
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.15] text-white"
                      style={{ textWrap: 'balance' }}
                    >
                      {lang === 'ga'
                        ? 'Tuig Bitcoin ó Bhonn, Léigh Páipéar Bán Satoshi i nGaeilge & Tóg Féin-Choinneáil'
                        : 'Understand How Bitcoin Works, Read the Whitepaper in Irish or English & Master Self-Custody'}
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                      {lang === 'ga' ? (
                        <>
                          Foghlaim cén fáth nach mbeidh ach <strong>21 milliún Bitcoin</strong> ann go deo, léigh <strong>Páipéar Bán Satoshi Nakamoto (2008)</strong> i nGaeilge nó i mBéarla, cleachtaigh <TermTooltip termKey="self_custody" lang={lang} /> (<TermTooltip termKey="seed_phrase" lang={lang} />), agus cosain do <TermTooltip termKey="purchasing_power" lang={lang} />.
                        </>
                      ) : (
                        <>
                          Explore why only <strong>21 million Bitcoin</strong> will ever exist, read <strong>Satoshi Nakamoto’s 2008 Bitcoin Whitepaper</strong> in Irish or English, practice <TermTooltip termKey="self_custody" lang={lang} /> with a 12-word <TermTooltip termKey="seed_phrase" lang={lang} />, and protect your <TermTooltip termKey="purchasing_power" lang={lang} />.
                        </>
                      )}
                    </p>

                    {/* Google Material 3 Pill Action Row — Opens Separate Pages */}
                    <div className="pt-1 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => navigateToPage('bitcoin')}
                        className="btn-google-amber min-h-[42px] w-full sm:w-auto justify-center"
                      >
                        <Coins className="w-4 h-4 shrink-0" />
                        <span className="truncate">
                          {lang === 'ga' ? 'Oscail Mol Bitcoin (Céim 1)' : 'Open Bitcoin Hub (Step 1)'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={openWhitepaperDirectly}
                        className="btn-google-filled min-h-[42px] !px-4 sm:!px-5 w-full sm:w-auto justify-center"
                      >
                        <FileText className="w-4 h-4 text-[#F7931A] shrink-0" />
                        <span className="truncate">
                          {lang === 'ga' ? 'An Páipéar Bán (GA/EN)' : 'Whitepaper Page (GA/EN)'}
                        </span>
                      </button>

                      <div className="grid grid-cols-2 sm:flex items-stretch sm:items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => navigateToPage('quiz')}
                          className="min-h-[42px] inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-full transition-colors cursor-pointer w-full sm:w-auto"
                        >
                          <Trophy className="w-4 h-4 text-[#F7931A] shrink-0" />
                          <span className="truncate">
                            {lang === 'ga' ? 'Tráth na gCeist' : 'Daily Quiz'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setGlossaryOpen(true)}
                          className="min-h-[42px] inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-full transition-colors cursor-pointer w-full sm:w-auto"
                        >
                          <BookOpen className="w-4 h-4 text-[#F7931A] shrink-0" />
                          <span className="truncate">
                            {lang === 'ga' ? 'Foclóir (GA/EN)' : 'Glossary (GA/EN)'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Sleek Futuristic Learner Card with Mini Learning Path Timeline (5 cols) */}
                  <div className="lg:col-span-5 bg-white/6 backdrop-blur-md border border-white/15 rounded-3xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white border border-[#F7931A] shrink-0"
                          style={{ backgroundColor: activeProfile.avatarColor }}
                        >
                          {activeProfile.displayName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate">
                            {activeProfile.displayName}
                          </div>
                          <div className="text-xs text-slate-300 truncate">
                            {lang === 'ga' ? rankInfo.current.titleGa : rankInfo.current.titleEn} ·{' '}
                            <span className="text-[#F7931A] font-mono font-semibold">
                              {activeProfile.xp} XP
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProfileModalOpen(true)}
                        className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-bold text-[#0A192F] bg-[#F7931A] hover:bg-[#e5830e] rounded-full transition-colors cursor-pointer shrink-0 leading-none"
                      >
                        <span>{lang === 'ga' ? 'Conair' : 'View Path'}</span>
                      </button>
                    </div>

                    {/* Mini 4-Node Learning Path Timeline Preview */}
                    <div className="pt-1 space-y-2.5">
                      <div className="flex justify-between items-center text-[11px] text-slate-300">
                        <span>
                          {lang === 'ga' ? 'Clocha Míle na Conaire Foghlama' : 'Learning Path Milestones'}
                        </span>
                        <span className="font-mono text-[#F7931A]">
                          {Object.values(activeProfile.completedModules).filter(Boolean).length} / 4{' '}
                          {lang === 'ga' ? 'críochnaithe' : 'complete'}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[#006B3F] via-emerald-400 to-[#F7931A] rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (Object.values(activeProfile.completedModules).filter(Boolean).length / 4) * 100
                            }%`,
                          }}
                          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        {(
                          [
                            { id: 'bitcoin' as const, en: '1. Bitcoin', ga: '1. Bitcoin' },
                            { id: 'budget' as const, en: '2. Money', ga: '2. Airgead' },
                            { id: 'tax' as const, en: '3. Wealth', ga: '3. Saibhreas' },
                            { id: 'security' as const, en: '4. Safety', ga: '4. Slándáil' },
                          ] as const
                        ).map((node) => {
                          const done = activeProfile.completedModules[node.id];
                          return (
                            <motion.button
                              key={node.id}
                              type="button"
                              onClick={() => navigateToPage(node.id)}
                              initial={false}
                              animate={done ? { scale: [0.92, 1.06, 1] } : { scale: 1 }}
                              transition={{ type: 'spring', stiffness: 450, damping: 16 }}
                              className={`min-h-[36px] px-2.5 py-2 rounded-xl border flex items-center justify-center gap-1.5 text-center transition-colors cursor-pointer overflow-hidden ${
                                done
                                  ? 'bg-[#006B3F]/40 border-emerald-400/60 text-white'
                                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                              }`}
                            >
                              {done ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                              ) : (
                                <span className="w-2 h-2 rounded-full border border-slate-400 shrink-0" />
                              )}
                              <span className="text-[11px] font-mono font-bold leading-none truncate">
                                {lang === 'ga' ? node.ga : node.en}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* HOME PAGE DIRECTORY — 6 Dedicated Standalone Page Cards */}
            <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <div className="text-xs font-mono font-bold text-[#006B3F] dark:text-emerald-400 uppercase tracking-wide">
                    {lang === 'ga' ? 'EOLAÍ LEATHANACH (6 LEATHANACH AR LEITH)' : 'CHOOSE A DEDICATED PAGE (6 STANDALONE PAGES)'}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0A192F] dark:text-white mt-0.5 tracking-tight">
                    {lang === 'ga'
                      ? 'Roghnaigh Uirlis nó Ceacht le hOscailt ar Leathanach ar Leith'
                      : 'Select Any Module Below to Open Its Dedicated Page'}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'ga'
                    ? 'Osclaíonn gach cnaipe a leathanach dírithe féin.'
                    : 'Every card and navigation button opens a clean, standalone page.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
                {[
                  {
                    id: 'bitcoin' as ActivePage,
                    stepBadgeEn: 'STEP 1 · BITCOIN HUB & ADDRESS ANALYTICS',
                    stepBadgeGa: 'CÉIM 1 · MOL BITCOIN & ANAILÍS SEOLTAÍ',
                    icon: Coins,
                    titleEn: 'Bitcoin Hub, Wallet & Address DCA/ROI Monitor',
                    titleGa: 'Mol Bitcoin, Sparán & Monatóir Seoltaí DCA/ROI',
                    descEn:
                      'Compare the Euro vs. Bitcoin’s fixed 21M supply, paste any Bitcoin address to track live on-chain balance, DCA average price & ROI %, and calculate 33% CGT.',
                    descGa:
                      'Déan comparáid idir an Euro agus teorainn 21M Bitcoin, greamaigh seoladh Bitcoin chun Meánphraghas DCA & ROI % a fheiceáil beo, agus ríomh CGC 33%.',
                    ctaEn: 'Open Bitcoin & Wallet Page',
                    ctaGa: 'Oscail Leathanach Bitcoin',
                    xpLabel: '+450 XP',
                    isDone: activeProfile.completedModules.bitcoin,
                  },
                  {
                    id: 'whitepaper' as ActivePage,
                    stepBadgeEn: 'SATOSHI NAKAMOTO (2008) · GA / EN',
                    stepBadgeGa: 'SATOSHI NAKAMOTO (2008) · GA / EN',
                    icon: FileText,
                    titleEn: 'Bilingual Bitcoin Whitepaper Reader',
                    titleGa: 'Léitheoir Dátheangach Pháipéar Bán Bitcoin',
                    descEn:
                      'Read all 12 original sections of Satoshi Nakamoto’s 2008 Bitcoin Whitepaper in English, Gaeilge, or Side-by-Side with spoken audio and plain-language summaries.',
                    descGa:
                      'Léigh gach ceann de na 12 alt i bPáipéar Bán Satoshi Nakamoto (2008) i nGaeilge, i mBéarla, nó Taobh le Taobh le fuaimniú.',
                    ctaEn: 'Open Whitepaper Page',
                    ctaGa: 'Oscail Leathanach an Pháipéir Bháin',
                    xpLabel: '12 Sections',
                    isDone: activeProfile.completedModules.bitcoin,
                  },
                  {
                    id: 'budget' as ActivePage,
                    stepBadgeEn: 'STEP 2 · EVERYDAY MONEY & INFLATION',
                    stepBadgeGa: 'CÉIM 2 · AIRGEAD LAETHÚIL & BOILSCIÚ',
                    icon: Wallet,
                    titleEn: '50/30/20 Budget & Purchasing Power Lab',
                    titleGa: 'Buiséad 50/30/20 & Cumhacht Cheannaigh',
                    descEn:
                      'Organize monthly take-home pay into Needs, Wants, and Future You, see how inflation erodes idle cash vs. scarce assets, and model Irish pension tax relief.',
                    descGa:
                      'Roinn do phá glan ina Riachtanais, Mianta, agus Coigilteas, féach ar thionchar boilscithe, agus samhlaigh faoiseamh cánach pinsin.',
                    ctaEn: 'Open Money & Budget Page',
                    ctaGa: 'Oscail Leathanach Buiséid',
                    xpLabel: '+350 XP',
                    isDone: activeProfile.completedModules.budget,
                  },
                  {
                    id: 'tax' as ActivePage,
                    stepBadgeEn: 'STEP 3 · GROWING WEALTH & REBATES',
                    stepBadgeGa: 'CÉIM 3 · FÁS SAIBHRIS & AISÍOCAÍOCHTAÍ',
                    icon: TrendingUp,
                    titleEn: 'Emergency Fund, Compounding & Tax Rebates',
                    titleGa: 'Ciste Éigeandála, Fás Iolraithe & Cáin',
                    descEn:
                      'Build your 3–6 month emergency cash cushion first, compare 20-year compound growth (including Irish DIRT, 41% ETF exit tax & 33% CGT), and check PAYE rebates.',
                    descGa:
                      'Tóg do chiste éigeandála 3–6 mhí ar dtús, déan comparáid ar fhás iolraithe 20 bliain, agus seiceáil aisíocaíochtaí cánach PAYE.',
                    ctaEn: 'Open Growing Wealth Page',
                    ctaGa: 'Oscail Leathanach Saibhris',
                    xpLabel: '+350 XP',
                    isDone: activeProfile.completedModules.tax,
                  },
                  {
                    id: 'security' as ActivePage,
                    stepBadgeEn: 'STEP 4 · SCAM & SEED PHRASE DEFENSE',
                    stepBadgeGa: 'CÉIM 4 · COSAINT SCAIMEANNA & SÍOL',
                    icon: Shield,
                    titleEn: 'Interactive Scam & Phishing Radar',
                    titleGa: 'Radar Idirghníomhach Scaimeanna',
                    descEn:
                      'Test your instincts against realistic Irish bank texts, fake hardware wallet seed-phrase resets, WhatsApp impersonators, and celebrity Bitcoin giveaways.',
                    descGa:
                      'Tástáil do scileanna in aghaidh téacsanna bréige bainc, iarratais ar Fhrása Síol 12 fhocal, agus scaimeanna infheistíochta.',
                    ctaEn: 'Open Scam Defense Page',
                    ctaGa: 'Oscail Leathanach Slándála',
                    xpLabel: '+250 XP',
                    isDone: activeProfile.completedModules.security,
                  },
                  {
                    id: 'quiz' as ActivePage,
                    stepBadgeEn: 'STEP 5 · COMPETITIVE DAILY QUIZ ARENA',
                    stepBadgeGa: 'CÉIM 5 · TRÁTH NA GCEIST LAETHÚIL',
                    icon: Trophy,
                    titleEn: '15-Second Speed Blitz & Leaderboard',
                    titleGa: 'Cluiche Luais 15s & Clár Ceannairí',
                    descEn:
                      'Compete head-to-head across learner profiles in a 5-question daily Bitcoin & Irish finance blitz with streak multipliers, 50/50 lifelines, and live rankings.',
                    descGa:
                      'Glac páirt sa chluiche luais laethúil 5 cheist le hiolraitheoirí sraithe, tarrthálacha 50/50, agus clár ceannairí beo.',
                    ctaEn: 'Open Daily Quiz Page',
                    ctaGa: 'Oscail Leathanach an Trátha',
                    xpLabel: '+300 XP Bonus',
                    isDone: Boolean(activeProfile.earnedBadges.badge_daily_champion),
                  },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-[#0D1F38] rounded-3xl border border-slate-200/90 dark:border-[#1E3A5F] p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5 hover:border-[#F7931A] transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-10 h-10 rounded-2xl bg-[#0A192F] dark:bg-[#163058] flex items-center justify-center text-[#F7931A] shrink-0">
                            <Icon className="w-5 h-5 shrink-0" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-6 inline-flex items-center justify-center px-2.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 dark:bg-[#0A192F] text-[#006B3F] dark:text-emerald-400">
                              {card.xpLabel}
                            </span>
                            {card.isDone && (
                              <span className="h-6 inline-flex items-center justify-center gap-1 px-2.5 rounded-full text-[11px] font-bold bg-[#006B3F]/10 text-[#006B3F] dark:text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                <span>{lang === 'ga' ? 'Déanta' : 'Done'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] font-mono font-bold text-[#F7931A] uppercase tracking-wide">
                            {lang === 'ga' ? card.stepBadgeGa : card.stepBadgeEn}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-[#0A192F] dark:text-white mt-1 leading-snug">
                            {lang === 'ga' ? card.titleGa : card.titleEn}
                          </h3>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {lang === 'ga' ? card.descGa : card.descEn}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigateToPage(card.id)}
                        className="btn-google-filled w-full justify-center"
                      >
                        <span className="truncate">
                          {lang === 'ga' ? card.ctaGa : card.ctaEn}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#F7931A] shrink-0" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* SEARCHABLE FREQUENTLY ASKED QUESTIONS SECTION */}
              <HomeFaqSection
                lang={lang}
                onNavigateToPage={(page, bitcoinLesson) =>
                  navigateToPage(page, bitcoinLesson ? { bitcoinLesson } : undefined)
                }
                onOpenGlossary={() => setGlossaryOpen(true)}
              />
            </main>
          </motion.div>
        )}

        {/* DEDICATED PAGE 1: BITCOIN HUB */}
        {activePage === 'bitcoin' && (
          <motion.div
            key="page-bitcoin"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {renderInnerPageBar({
              badgeEn: 'PAGE 1 OF 6 · BITCOIN LITERACY HUB',
              badgeGa: 'LEATHANACH 1 AS 6 · MOL LITEARTHACHTA BITCOIN',
              titleEn: 'Bitcoin Supply (21M), Self-Custody, Lightning & Irish CGT',
              titleGa: 'Soláthar Bitcoin (21M), Féin-Choinneáil, Lightning & CGC',
              nextPage: 'whitepaper',
              nextLabelEn: 'Next: Whitepaper',
              nextLabelGa: 'Ar Aghaidh: Páipéar Bán',
            })}
            <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
              <BitcoinHub
                lang={lang}
                initialLesson={bitcoinInitialLesson}
                onOpenWhitepaperPage={openWhitepaperDirectly}
              />
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1F38] border border-slate-200/90 dark:border-[#1E3A5F] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Award className="w-6 h-6 text-[#F7931A] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#0A192F] dark:text-white">
                      {lang === 'ga'
                        ? 'Críochnaigh Céim 1 & Oscail Suaitheantais Bitcoine (+450 XP)'
                        : 'Finish Step 1 & Unlock Your Bitcoin & Whitepaper Badges (+450 XP)'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'ga'
                        ? 'Bronntar “Coimeádaí Eochrach” agus “Taiscéalaí Lightning” ar do phróifíl.'
                        : 'Awards “Sovereign Keyholder” and “Digital Money & Lightning Explorer” to your profile.'}
                    </div>
                  </div>
                </div>
                {activeProfile.completedModules.bitcoin ? (
                  <button
                    type="button"
                    onClick={() => navigateToPage('budget')}
                    className="btn-google-tonal w-full sm:w-auto shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === 'ga'
                        ? 'Críochnaithe · Téigh go Céim 2 →'
                        : 'Completed · Open Step 2 Page →'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaimModuleBadges('bitcoin')}
                    className="btn-google-filled w-full sm:w-auto shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-[#F7931A] shrink-0" />
                    <span>
                      {lang === 'ga' ? 'Críochnaigh Céim 1 (+450 XP)' : 'Complete Step 1 (+450 XP)'}
                    </span>
                  </button>
                )}
              </div>
            </main>
          </motion.div>
        )}

        {/* DEDICATED PAGE 2: BILINGUAL BITCOIN WHITEPAPER READER */}
        {activePage === 'whitepaper' && (
          <motion.div
            key="page-whitepaper"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {renderInnerPageBar({
              badgeEn: 'PAGE 2 OF 6 · SATOSHI NAKAMOTO (2008)',
              badgeGa: 'LEATHANACH 2 AS 6 · SATOSHI NAKAMOTO (2008)',
              titleEn: 'Bitcoin Whitepaper Reader (Irish & English)',
              titleGa: 'Páipéar Bán Bitcoin (Gaeilge & Béarla)',
              nextPage: 'budget',
              nextLabelEn: 'Next: Money & Budget',
              nextLabelGa: 'Ar Aghaidh: Airgead',
            })}
            <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
              <BitcoinWhitepaperReader lang={lang} />
            </main>
          </motion.div>
        )}

        {/* DEDICATED PAGE 3: EVERYDAY MONEY & INFLATION LAB */}
        {activePage === 'budget' && (
          <motion.div
            key="page-budget"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {renderInnerPageBar({
              badgeEn: 'PAGE 3 OF 6 · EVERYDAY MONEY & INFLATION LAB',
              badgeGa: 'LEATHANACH 3 AS 6 · AIRGEAD LAETHÚIL & BOILSCIÚ',
              titleEn: '50/30/20 Budget Planner, Inflation & Pension Tax Relief',
              titleGa: 'Buiséad 50/30/20, Boilsciú & Faoiseamh Cánach Pinsin',
              nextPage: 'tax',
              nextLabelEn: 'Next: Growing Wealth',
              nextLabelGa: 'Ar Aghaidh: Saibhreas',
            })}
            <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
              <PurchasingPowerLab lang={lang} />
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1F38] border border-slate-200/90 dark:border-[#1E3A5F] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Award className="w-6 h-6 text-[#F7931A] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#0A192F] dark:text-white">
                      {lang === 'ga'
                        ? 'Críochnaigh Céim 2 & Oscail Suaitheantais Buiséid (+350 XP)'
                        : 'Finish Step 2 & Unlock Your Everyday Money Badges (+350 XP)'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'ga'
                        ? 'Bronntar “Ailtire Buiséid 50/30/20” agus “Pleanálaí Cumhachta Ceannaigh” ort.'
                        : 'Awards “50/30/20 Cashflow Architect” and “Buying Power & Future Planner” to your profile.'}
                    </div>
                  </div>
                </div>
                {activeProfile.completedModules.budget ? (
                  <button
                    type="button"
                    onClick={() => navigateToPage('tax')}
                    className="btn-google-tonal w-full sm:w-auto shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === 'ga'
                        ? 'Críochnaithe · Téigh go Céim 3 →'
                        : 'Completed · Open Step 3 Page →'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaimModuleBadges('budget')}
                    className="btn-google-filled w-full sm:w-auto shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-[#F7931A] shrink-0" />
                    <span>
                      {lang === 'ga' ? 'Críochnaigh Céim 2 (+350 XP)' : 'Complete Step 2 (+350 XP)'}
                    </span>
                  </button>
                )}
              </div>
            </main>
          </motion.div>
        )}

        {/* DEDICATED PAGE 4: GROWING WEALTH & TAX NAVIGATOR */}
        {activePage === 'tax' && (
          <motion.div
            key="page-tax"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {renderInnerPageBar({
              badgeEn: 'PAGE 4 OF 6 · GROWING WEALTH & TAX REBATES',
              badgeGa: 'LEATHANACH 4 AS 6 · FÁS SAIBHRIS & AISÍOCAÍOCHTAÍ',
              titleEn: 'Emergency Safety Net, 20-Year Compounding & PAYE Rebates',
              titleGa: 'Ciste Éigeandála, Fás Iolraithe 20 Bliain & Aisíocaíochtaí PAYE',
              nextPage: 'security',
              nextLabelEn: 'Next: Scam Defense',
              nextLabelGa: 'Ar Aghaidh: Slándáil',
            })}
            <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
              <TaxNavigator lang={lang} />
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1F38] border border-slate-200/90 dark:border-[#1E3A5F] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Award className="w-6 h-6 text-[#F7931A] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#0A192F] dark:text-white">
                      {lang === 'ga'
                        ? 'Críochnaigh Céim 3 & Oscail 2 Shuaitheantas Fáis Saibhris (+350 XP)'
                        : 'Finish Step 3 & Unlock Your Wealth-Building Badges (+350 XP)'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'ga'
                        ? 'Bronntar suaitheantais Ciste Éigeandála agus Fáis Iolraithe ar do phróifíl.'
                        : 'Awards your Emergency Safety-Net and Compound Growth badges.'}
                    </div>
                  </div>
                </div>
                {activeProfile.completedModules.tax ? (
                  <button
                    type="button"
                    onClick={() => navigateToPage('security')}
                    className="btn-google-tonal w-full sm:w-auto shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === 'ga'
                        ? 'Críochnaithe · Téigh go Céim 4 →'
                        : 'Completed · Open Step 4 Page →'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaimModuleBadges('tax')}
                    className="btn-google-filled w-full sm:w-auto shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-[#F7931A] shrink-0" />
                    <span>
                      {lang === 'ga' ? 'Críochnaigh Céim 3 (+350 XP)' : 'Complete Step 3 (+350 XP)'}
                    </span>
                  </button>
                )}
              </div>
            </main>
          </motion.div>
        )}

        {/* DEDICATED PAGE 5: SCAM & SEED PHRASE DEFENSE RADAR */}
        {activePage === 'security' && (
          <motion.div
            key="page-security"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {renderInnerPageBar({
              badgeEn: 'PAGE 5 OF 6 · SCAM & SEED PHRASE DEFENSE',
              badgeGa: 'LEATHANACH 5 AS 6 · COSAINT SCAIMEANNA & FRÁSA SÍOL',
              titleEn: 'Interactive Scam Radar & Hardware Wallet Safety',
              titleGa: 'Radar Scaimeanna & Slándáil Sparán Crua-Earraí',
              nextPage: 'quiz',
              nextLabelEn: 'Next: Daily Quiz',
              nextLabelGa: 'Ar Aghaidh: Tráth na gCeist',
            })}
            <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
              <ScamRadar lang={lang} />
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1F38] border border-slate-200/90 dark:border-[#1E3A5F] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Award className="w-6 h-6 text-[#F7931A] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#0A192F] dark:text-white">
                      {lang === 'ga'
                        ? 'Críochnaigh Céim 4 & Oscail Cosantóir Slándála (+250 XP)'
                        : 'Finish Step 4 & Unlock Your Scam Sentinel Badge (+250 XP)'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {lang === 'ga'
                        ? 'Nuair a bhíonn na 4 chéim críochnaithe agat, díghlasáiltear “An Bradán Feasa”!'
                        : 'Completing all 4 steps also unlocks the “Bradán Feasa (Salmon of Knowledge)” master badge!'}
                    </div>
                  </div>
                </div>
                {activeProfile.completedModules.security ? (
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(true)}
                    className="btn-google-amber w-full sm:w-auto shrink-0"
                  >
                    <Award className="w-4 h-4 shrink-0" />
                    <span>
                      {lang === 'ga'
                        ? 'Féach Mo Chonair & Suaitheantais'
                        : 'View My Learning Path & Badges'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaimModuleBadges('security')}
                    className="btn-google-filled w-full sm:w-auto shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-[#F7931A] shrink-0" />
                    <span>
                      {lang === 'ga' ? 'Críochnaigh Céim 4 (+250 XP)' : 'Complete Step 4 (+250 XP)'}
                    </span>
                  </button>
                )}
              </div>
            </main>
          </motion.div>
        )}

        {/* DEDICATED PAGE 6: COMPETITIVE DAILY QUIZ ARENA */}
        {activePage === 'quiz' && (
          <motion.div
            key="page-quiz"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {renderInnerPageBar({
              badgeEn: 'PAGE 6 OF 6 · COMPETITIVE DAILY QUIZ ARENA',
              badgeGa: 'LEATHANACH 6 AS 6 · TRÁTH NA GCEIST LAETHÚIL',
              titleEn: 'Daily 15-Second Speed Blitz & Multi-Player Leaderboard',
              titleGa: 'Cluiche Luais 15 Soicind & Clár Ceannairí Beo',
              nextPage: 'home',
              nextLabelEn: 'Back to Home',
              nextLabelGa: 'Ar Ais go Baile',
            })}
            <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
              <DailyQuizArena
                lang={lang}
                profiles={profiles}
                activeProfile={activeProfile}
                onSelectProfile={(id) => setActiveProfileId(id)}
                onRecordQuizResult={handleRecordDailyQuizResult}
                onOpenProfileModal={() => setProfileModalOpen(true)}
              />
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QUIET EDITORIAL FOOTER WITH DIRECT PAGE NAVIGATION & EDUCATIONAL DISCLAIMER */}
      <footer className="bg-white dark:bg-[#0A192F] border-t border-slate-200 dark:border-[#1E3A5F] mt-8 pb-28">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 py-6 space-y-5 text-xs text-slate-500 dark:text-slate-400">
          {/* Row 1: Direct Page Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-[#1E3A5F]">
            <div className="font-bold text-[#0A192F] dark:text-white text-xs sm:text-sm">
              {lang === 'ga' ? 'Oscail Leathanach:' : 'Open Page:'}
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              {[
                {
                  id: 'home' as ActivePage,
                  icon: Home,
                  en: 'Home',
                  ga: 'Baile',
                },
                {
                  id: 'bitcoin' as ActivePage,
                  icon: Coins,
                  en: '1. Bitcoin Hub',
                  ga: '1. Mol Bitcoin',
                },
                {
                  id: 'whitepaper' as ActivePage,
                  icon: FileText,
                  en: 'Whitepaper',
                  ga: 'Páipéar Bán',
                },
                {
                  id: 'budget' as ActivePage,
                  icon: Wallet,
                  en: '2. Money & Budget',
                  ga: '2. Airgead',
                },
                {
                  id: 'tax' as ActivePage,
                  icon: TrendingUp,
                  en: '3. Growing Wealth',
                  ga: '3. Saibhreas',
                },
                {
                  id: 'security' as ActivePage,
                  icon: Shield,
                  en: '4. Scam Defense',
                  ga: '4. Slándáil',
                },
                {
                  id: 'quiz' as ActivePage,
                  icon: Trophy,
                  en: '5. Daily Quiz',
                  ga: '5. Tráth na gCeist',
                },
              ].map((page, idx) => {
                const Icon = page.icon;
                const isCurrent = activePage === page.id;
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => navigateToPage(page.id)}
                    className={`${idx === 6 ? 'col-span-2 sm:col-span-1' : ''} ${
                      isCurrent
                        ? 'btn-google-filled !py-2 !px-3.5 w-full sm:w-auto'
                        : 'btn-google-outlined !py-2 !px-3.5 w-full sm:w-auto'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                    <span className="truncate">{lang === 'ga' ? page.ga : page.en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 2: Brand Disclaimer & Quick Modals */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-semibold text-[#0A192F] dark:text-white">
                Emerald Ledger — Bitcoin Educator, On-Chain Address Analytics, Whitepaper &amp; Financial Literacy
              </div>
              <p>
                {lang === 'ga'
                  ? 'Séanadh: Uirlis eolais agus oideachais amháin. Ní comhairle airgeadais rialáilte í seo.'
                  : 'Disclaimer: Informational & educational tool only. Not regulated financial advice.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                type="button"
                onClick={openWhitepaperDirectly}
                className="btn-google-amber w-full sm:w-auto"
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  {lang === 'ga' ? 'Páipéar Bán Bitcoin (GA/EN)' : 'Bitcoin Whitepaper (GA/EN)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="btn-google-tonal w-full sm:w-auto"
              >
                <span className="truncate">
                  {lang === 'ga' ? 'Conair Foghlama & Suaitheantais' : 'Learning Path & Badges'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setGlossaryOpen(true)}
                className="btn-google-outlined w-full sm:w-auto"
              >
                <span className="truncate">
                  {lang === 'ga' ? 'Foclóir GA/EN' : 'Glossary GA/EN'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* STICKY BOTTOM PAGE NAVIGATION BAR — Each Button Opens a Separate Standalone Page */}
      <nav
        aria-label="Bottom page navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0A192F]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#1E3A5F] safe-area-pb shadow-lg"
      >
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 items-stretch max-w-4xl mx-auto px-1 sm:px-3 pt-1.5 pb-1">
          {[
            {
              id: 'home' as ActivePage,
              icon: Home,
              labelEn: 'Home',
              labelGa: 'Baile',
            },
            {
              id: 'bitcoin' as ActivePage,
              icon: Coins,
              labelEn: 'Bitcoin',
              labelGa: 'Bitcoin',
            },
            {
              id: 'whitepaper' as ActivePage,
              icon: FileText,
              labelEn: 'Paper',
              labelGa: 'Páipéar',
            },
            {
              id: 'budget' as ActivePage,
              icon: Wallet,
              labelEn: 'Money',
              labelGa: 'Airgead',
            },
            {
              id: 'tax' as ActivePage,
              icon: TrendingUp,
              labelEn: 'Wealth',
              labelGa: 'Saibhreas',
            },
            {
              id: 'security' as ActivePage,
              icon: Shield,
              labelEn: 'Safety',
              labelGa: 'Slándáil',
            },
            {
              id: 'quiz' as ActivePage,
              icon: Trophy,
              labelEn: 'Quiz',
              labelGa: 'Tráth',
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToPage(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`h-12 flex flex-col items-center justify-center py-1 px-0.5 sm:px-1 rounded-2xl transition-colors cursor-pointer min-w-0 overflow-hidden ${
                  isActive
                    ? 'text-[#F7931A] font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#0A192F] dark:hover:text-white'
                }`}
              >
                <div
                  className={`w-9 sm:w-11 h-6 flex items-center justify-center rounded-full transition-colors shrink-0 ${
                    isActive ? 'bg-[#F7931A]/20 text-[#F7931A]' : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <span className="text-[10px] sm:text-[11px] leading-tight mt-0.5 truncate max-w-full text-center">
                  {lang === 'ga' ? item.labelGa : item.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* BILINGUAL GLOSSARY DRAWER */}
      <GlossaryDrawer
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        lang={lang}
      />

      {/* LEARNER PROFILE & GAMIFICATION BADGES MODAL */}
      <ProfileBadgesModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        lang={lang}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={(id) => setActiveProfileId(id)}
        onCreateProfile={handleCreateProfile}
        onDeleteProfile={handleDeleteProfile}
        onClaimModuleBadges={handleClaimModuleBadges}
        onJumpToModule={(mod) => {
          if (mod === 'all') {
            navigateToPage('home');
          } else {
            navigateToPage(mod);
          }
        }}
      />

      {/* STRUCTURED DATA AI ADVISOR CHATBOT */}
      <AiAdvisorChat
        lang={lang}
        onJumpToModule={(mod) => {
          if (mod === 'all') {
            navigateToPage('home');
          } else {
            navigateToPage(mod);
          }
        }}
      />
    </div>
  );
}
