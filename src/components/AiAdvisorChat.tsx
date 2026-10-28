import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Volume2,
  ArrowUpRight,
  RotateCcw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { IRISH_TERMS, Language, speakIrishText } from '../data/i18n';
import {
  BITCOIN_WHITEPAPER_METADATA,
  BITCOIN_WHITEPAPER_SECTIONS,
} from '../data/bitcoinWhitepaper';
import {
  BITCOIN_CORE_METRICS,
  BITCOIN_HALVING_SCHEDULE,
  BITCOIN_ENCYCLOPEDIA,
} from '../data/bitcoinKnowledgeBase';
import { ALL_TABS_KNOWLEDGE_BASE } from '../data/allTabsKnowledgeBase';
import { DAILY_QUIZ_POOL, getTodayDateKey } from '../data/dailyQuizData';
import { BudgetItem } from './PurchasingPowerLab';
import {
  BADGE_DEFINITIONS,
  DEFAULT_PROFILES,
  getRankForXp,
  STORAGE_KEY_ACTIVE_PROFILE_ID,
  STORAGE_KEY_PROFILES,
  UserProfile,
} from '../data/gamification';

interface AiAdvisorChatProps {
  lang: Language;
  onJumpToModule: (mod: 'all' | 'tax' | 'bitcoin' | 'budget' | 'security' | 'quiz') => void;
}

interface KeyFigure {
  label: string;
  value: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  keyFigures?: KeyFigure[];
  relatedModule?: 'tax' | 'bitcoin' | 'budget' | 'security' | 'quiz';
  followUpQuestions?: string[];
  isError?: boolean;
}

const STORAGE_KEY_ITEMS = 'fringe_finance_budget_items_v1';
const STORAGE_KEY_INCOME = 'fringe_finance_net_income_v1';

function buildStructuredAppContext() {
  let netMonthlyIncome = 3500;
  let budgetItems: BudgetItem[] = [];
  let activeProfile: UserProfile = DEFAULT_PROFILES[0];
  let allProfiles: UserProfile[] = DEFAULT_PROFILES;

  try {
    const savedIncome = localStorage.getItem(STORAGE_KEY_INCOME);
    if (savedIncome) netMonthlyIncome = Number(savedIncome);
    const savedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (savedItems) budgetItems = JSON.parse(savedItems);

    const savedProfilesRaw = localStorage.getItem(STORAGE_KEY_PROFILES);
    const savedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_PROFILE_ID);
    if (savedProfilesRaw) {
      const profiles: UserProfile[] = JSON.parse(savedProfilesRaw);
      if (Array.isArray(profiles) && profiles.length > 0) {
        allProfiles = profiles;
        const found = profiles.find((p) => p.id === savedActiveId) || profiles[0];
        if (found) activeProfile = found;
      }
    }
  } catch {
    // ignore storage errors
  }

  const needsTotal = budgetItems
    .filter((i) => i.bucket === 'needs')
    .reduce((s, i) => s + i.amountEur, 0);
  const wantsTotal = budgetItems
    .filter((i) => i.bucket === 'wants')
    .reduce((s, i) => s + i.amountEur, 0);
  const savingsTotal = budgetItems
    .filter((i) => i.bucket === 'savings')
    .reduce((s, i) => s + i.amountEur, 0);

  const rankInfo = getRankForXp(activeProfile.xp);
  const todayKey = getTodayDateKey();

  return {
    appName: 'Emerald Ledger (Mórleabhar Smaragda)',
    tab1_BitcoinAndWhitepaperData: {
      coreMetrics: BITCOIN_CORE_METRICS,
      halvingSchedule: BITCOIN_HALVING_SCHEDULE,
      encyclopedia: BITCOIN_ENCYCLOPEDIA,
      whitepaperTitleEn: BITCOIN_WHITEPAPER_METADATA.titleEn,
      whitepaperTitleGa: BITCOIN_WHITEPAPER_METADATA.titleGa,
      author: BITCOIN_WHITEPAPER_METADATA.author,
      published: BITCOIN_WHITEPAPER_METADATA.dateEn,
      abstractEn: BITCOIN_WHITEPAPER_METADATA.abstractEn,
      abstractGa: BITCOIN_WHITEPAPER_METADATA.abstractGa,
      plainAbstractEn: BITCOIN_WHITEPAPER_METADATA.plainAbstractEn,
      plainAbstractGa: BITCOIN_WHITEPAPER_METADATA.plainAbstractGa,
      sections: BITCOIN_WHITEPAPER_SECTIONS.map((s) => ({
        sectionNumber: s.sectionNumber,
        titleEn: s.titleEn,
        titleGa: s.titleGa,
        keyTermEn: s.keyTermEn,
        keyTermGa: s.keyTermGa,
        originalTextEn: s.originalTextEn,
        originalTextGa: s.originalTextGa,
        plainSummaryEn: s.plainSummaryEn,
        plainSummaryGa: s.plainSummaryGa,
      })),
    },
    tabs2To5_AllOtherTabsData: ALL_TABS_KNOWLEDGE_BASE,
    tab5_DailyQuizArenaAndLeaderboard: {
      todayDateKey: todayKey,
      activeUserDailyBestScore: activeProfile.dailyQuizBestScore || 0,
      activeUserDailyStreak: activeProfile.dailyQuizStreak || 1,
      activeUserTodayResult: activeProfile.dailyQuizHistory?.[todayKey] || null,
      leaderboardStandings: allProfiles
        .map((p) => ({
          displayName: p.displayName,
          county: p.county,
          totalXp: p.xp,
          dailyQuizBestScore: p.dailyQuizBestScore || 0,
          dailyQuizStreak: p.dailyQuizStreak || 1,
          todayScore: p.dailyQuizHistory?.[todayKey]?.score ?? null,
        }))
        .sort((a, b) => (b.todayScore ?? b.dailyQuizBestScore) - (a.todayScore ?? a.dailyQuizBestScore)),
      totalQuizQuestionsAvailable: DAILY_QUIZ_POOL.length,
    },
    activeLearnerProfile: {
      displayName: activeProfile.displayName,
      county: activeProfile.county,
      xp: activeProfile.xp,
      currentRankEn: rankInfo.current.titleEn,
      currentRankGa: rankInfo.current.titleGa,
      completedModules: activeProfile.completedModules,
      unlockedBadges: BADGE_DEFINITIONS.filter((b) => Boolean(activeProfile.earnedBadges[b.id])).map(
        (b) => ({ titleEn: b.titleEn, titleGa: b.titleGa, xpReward: b.xpReward })
      ),
    },
    userLiveHouseholdBudget: {
      netMonthlyIncomeEur: netMonthlyIncome,
      essentialNeedsTotalEur: needsTotal,
      lifestyleWantsTotalEur: wantsTotal,
      savingsAndWealthTotalEur: savingsTotal,
      unallocatedMonthlySurplusEur: netMonthlyIncome - (needsTotal + wantsTotal + savingsTotal),
      lineItems: budgetItems.map((i) => ({
        nameEn: i.nameEn,
        nameGa: i.nameGa,
        monthlyEur: i.amountEur,
        bucket: i.bucket,
      })),
    },
    irishTaxParameters2026: {
      cgtRatePct: 33,
      cgtAnnualExemptionEur: 1270,
      dirtSavingsTaxRatePct: 33,
      etfOffshoreFundExitTaxPct: 41,
      etfDeemedDisposalIntervalYears: 8,
      payeTaxReliefs: [
        { name: 'Rent Tax Credit', maxCreditEur: '€1,000 single / €2,000 couple' },
        { name: 'Health Expenses Relief', rate: '20% refund on GP & prescriptions' },
        { name: 'Remote Working Relief', rate: '30% of home utility bills for remote days' },
        { name: 'Home Carer Credit', maxCreditEur: '€1,950' },
      ],
    },
    bilingualGlossaryTerms: Object.values(IRISH_TERMS).map((t) => ({
      ga: t.ga,
      en: t.en,
      definitionEn: t.definitionEn,
      definitionGa: t.definitionGa,
    })),
  };
}

export const AiAdvisorChat: React.FC<AiAdvisorChatProps> = ({ lang, onJumpToModule }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Start with a completely blank message list as requested
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendQuery = async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const structuredAppContext = buildStructuredAppContext();
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          lang,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          structuredAppContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reach the AI Assistant.');
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'Here is your answer.',
        keyFigures: Array.isArray(data.keyFigures) ? data.keyFigures : [],
        relatedModule: data.relatedModule,
        followUpQuestions: Array.isArray(data.followUpQuestions)
          ? data.followUpQuestions.slice(0, 2)
          : [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorText =
        err instanceof Error ? err.message : 'An unexpected error occurred while contacting the server.';
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          text: errorText,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    sendQuery(input);
  };

  const handleResetChat = () => {
    setMessages([]);
    setInput('');
  };

  return (
    <>
      {/* Floating Launcher Button — Sits cleanly above the sticky bottom navigation bar */}
      <div className="fixed bottom-20 right-4 sm:right-5 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="h-11 inline-flex items-center justify-center gap-2 px-4 rounded-full bg-[#0A192F] hover:bg-slate-800 text-white border border-slate-700 shadow-xl transition-transform active:scale-95 hover:scale-[1.02] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#F7931A] shrink-0" />
            <span className="text-xs font-bold tracking-tight whitespace-nowrap">
              {lang === 'ga' ? 'Cúntóir AI' : 'AI Assistant'}
            </span>
          </button>
        )}
      </div>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0A192F]/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#0D1F38] h-[100dvh] flex flex-col shadow-2xl border-l border-slate-200 dark:border-[#1E3A5F] safe-area-pb">
            {/* Simple Header */}
            <div className="px-5 py-4 bg-[#0A192F] text-white border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#006B3F] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-[#F7931A] shrink-0" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold tracking-tight truncate">
                    {lang === 'ga' ? 'Cúntóir AI' : 'AI Assistant'}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetChat}
                    className="w-8 h-8 inline-flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                    title={lang === 'ga' ? 'Glan an comhrá' : 'Clear chat'}
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 inline-flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                  aria-label="Close AI Assistant"
                >
                  <X className="w-5 h-5 shrink-0" />
                </button>
              </div>
            </div>

            {/* Chat Messages Area (Starts completely blank until the user asks a question) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white dark:bg-[#0D1F38]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-3 ${
                      msg.role === 'user'
                        ? 'bg-[#006B3F] text-white'
                        : msg.isError
                        ? 'bg-red-50 text-red-900 border border-red-200'
                        : 'bg-[#F4F6F9] dark:bg-[#0A192F] text-[#0A192F] dark:text-slate-100 border border-slate-200 dark:border-[#1E3A5F]'
                    }`}
                  >
                    {msg.isError && (
                      <div className="flex items-center gap-1.5 font-semibold text-red-700 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{lang === 'ga' ? 'Earráid' : 'Notice'}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-line">{msg.text}</div>

                    {msg.keyFigures && msg.keyFigures.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 dark:border-[#1E3A5F]">
                        {msg.keyFigures.map((kf, i) => (
                          <div
                            key={i}
                            className="p-2 rounded-lg bg-white dark:bg-[#0F2342] border border-slate-200 dark:border-[#1E3A5F]"
                          >
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {kf.label}
                            </div>
                            <div className="text-xs font-bold font-mono tabular-nums text-[#006B3F] dark:text-emerald-400 mt-0.5">
                              {kf.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.role === 'assistant' && !msg.isError && (
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-[#1E3A5F] text-[11px]">
                        <button
                          type="button"
                          onClick={() => speakIrishText(msg.text, lang)}
                          className="min-h-[28px] inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-[#0F2342] border border-slate-200 dark:border-[#1E3A5F] text-slate-600 dark:text-slate-300 hover:text-[#006B3F] font-medium cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                          <span>{lang === 'ga' ? 'Éist' : 'Listen'}</span>
                        </button>

                        {msg.relatedModule && (
                          <button
                            type="button"
                            onClick={() => {
                              onJumpToModule(msg.relatedModule!);
                              setIsOpen(false);
                            }}
                            className="min-h-[28px] inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-[#006B3F]/10 text-[#006B3F] dark:text-emerald-400 font-semibold hover:bg-[#006B3F]/15 cursor-pointer"
                          >
                            <span>
                              {lang === 'ga' ? 'Oscail an uirlis' : 'Open related module'}
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Optional Follow-Up Question Pills After an Answer */}
                    {msg.role === 'assistant' &&
                      !msg.isError &&
                      msg.followUpQuestions &&
                      msg.followUpQuestions.length > 0 && (
                        <div className="pt-2 space-y-1.5">
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {lang === 'ga' ? 'Ceisteanna gaolmhara:' : 'Ask next:'}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.followUpQuestions.map((fq, idx) => (
                              <button
                                key={idx}
                                type="button"
                                disabled={isLoading}
                                onClick={() => sendQuery(fq)}
                                className="min-h-[30px] inline-flex items-center text-left text-[11px] font-medium px-3 py-1.5 rounded-full bg-white dark:bg-[#0F2342] hover:bg-slate-100 dark:hover:bg-[#163058] text-[#0A192F] dark:text-slate-200 border border-slate-200 dark:border-[#1E3A5F] transition-colors cursor-pointer"
                              >
                                {fq}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 p-3 rounded-xl bg-slate-50 dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F] w-fit">
                  <Loader2 className="w-4 h-4 animate-spin text-[#006B3F] shrink-0" />
                  <span>{lang === 'ga' ? 'Ag smaoineamh...' : 'Thinking...'}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Clean Blank Message Box with Placeholder Asking the User to Write Their Question */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-4 bg-[#F4F6F9] dark:bg-[#0A192F] border-t border-slate-200 dark:border-[#1E3A5F] flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  lang === 'ga'
                    ? 'Scríobh do cheist anseo...'
                    : 'Write your question here...'
                }
                className="flex-1 h-11 px-4 text-sm bg-white dark:bg-[#0F2342] text-[#0A192F] dark:text-white border border-slate-300 dark:border-[#1E3A5F] rounded-full focus:outline-2 focus:outline-[#006B3F]"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="btn-google-filled !h-11 !px-4 shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{lang === 'ga' ? 'Seol' : 'Send'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
