import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Flame,
  Heart,
  Zap,
  Timer,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Users,
  Volume2,
  Award,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Language, speakIrishText } from '../data/i18n';
import {
  DailyQuizQuestion,
  getQuestionsForSeed,
  getTodayDateKey,
} from '../data/dailyQuizData';
import {
  UserProfile,
  getRankForXp,
  DailyQuizRecord,
} from '../data/gamification';

interface DailyQuizArenaProps {
  lang: Language;
  profiles: UserProfile[];
  activeProfile: UserProfile;
  onSelectProfile: (profileId: string) => void;
  onRecordQuizResult: (profileId: string, record: DailyQuizRecord, xpEarned: number) => void;
  onOpenProfileModal?: () => void;
}

const QUESTION_TIME_LIMIT_SEC = 15;

export const DailyQuizArena: React.FC<DailyQuizArenaProps> = ({
  lang,
  profiles,
  activeProfile,
  onSelectProfile,
  onRecordQuizResult,
}) => {
  const todayKey = getTodayDateKey();
  const [mode, setMode] = useState<'daily' | 'practice'>('daily');
  const [practiceRound, setPracticeRound] = useState<number>(1);

  const seed = mode === 'daily' ? `daily-${todayKey}` : `practice-${todayKey}-${practiceRound}`;
  const questions: DailyQuizQuestion[] = getQuestionsForSeed(seed, 5);

  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'finished'>('lobby');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT_SEC);
  const [hearts, setHearts] = useState<number>(3);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [totalTimeSaved, setTotalTimeSaved] = useState<number>(0);

  // Power-ups (1 per match)
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState<boolean>(false);
  const [hiddenOptionIndices, setHiddenOptionIndices] = useState<number[]>([]);
  const [doublePointsUsed, setDoublePointsUsed] = useState<boolean>(false);
  const [doublePointsActive, setDoublePointsActive] = useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex];
  const alreadyCompletedToday = Boolean(activeProfile.dailyQuizHistory?.[todayKey]);

  // Countdown timer during active question
  useEffect(() => {
    if (gameState !== 'playing' || isRevealed) return;

    if (timeLeft <= 0) {
      // Time ran out -> treat as wrong answer
      handleSelectAnswer(-1);
      return;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [gameState, isRevealed, timeLeft]);

  const startQuiz = (selectedMode: 'daily' | 'practice') => {
    setMode(selectedMode);
    if (selectedMode === 'practice') {
      setPracticeRound((r) => r + 1);
    }
    setCurrentIndex(0);
    setTimeLeft(QUESTION_TIME_LIMIT_SEC);
    setHearts(3);
    setCombo(0);
    setMaxCombo(0);
    setScore(0);
    setCorrectCount(0);
    setTotalTimeSaved(0);
    setFiftyFiftyUsed(false);
    setHiddenOptionIndices([]);
    setDoublePointsUsed(false);
    setDoublePointsActive(false);
    setSelectedOption(null);
    setIsRevealed(false);
    setGameState('playing');
  };

  const handleUseFiftyFifty = () => {
    if (fiftyFiftyUsed || isRevealed || !currentQuestion) return;
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.correctIndex);
    // Deterministically hide 2 wrong options
    const toHide = wrongIndices.slice(0, 2);
    setHiddenOptionIndices(toHide);
    setFiftyFiftyUsed(true);
  };

  const handleUseDoublePoints = () => {
    if (doublePointsUsed || isRevealed) return;
    setDoublePointsActive(true);
    setDoublePointsUsed(true);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (isRevealed || !currentQuestion) return;
    setSelectedOption(optionIdx);
    setIsRevealed(true);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      const nextCombo = combo + 1;
      const nextMaxCombo = Math.max(maxCombo, nextCombo);
      const speedBonus = timeLeft * 10;
      const streakBonus = nextCombo * 25;
      const multiplier = doublePointsActive ? 2 : 1;
      const pointsEarned = (currentQuestion.xpBase + speedBonus + streakBonus) * multiplier;

      setCombo(nextCombo);
      setMaxCombo(nextMaxCombo);
      setScore((prev) => prev + pointsEarned);
      setCorrectCount((prev) => prev + 1);
      setTotalTimeSaved((prev) => prev + timeLeft);
    } else {
      setCombo(0);
      setHearts((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNextQuestion = () => {
    const outOfHearts = hearts <= 0;
    const isLastQuestion = currentIndex >= questions.length - 1;

    if (outOfHearts || isLastQuestion) {
      finishMatch();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setTimeLeft(QUESTION_TIME_LIMIT_SEC);
    setSelectedOption(null);
    setIsRevealed(false);
    setHiddenOptionIndices([]);
    setDoublePointsActive(false);
  };

  const finishMatch = () => {
    setGameState('finished');
    const record: DailyQuizRecord = {
      dateKey: todayKey,
      score,
      correctCount,
      maxCombo,
      timeRemainingTotalSec: totalTimeSaved,
    };
    const xpReward = Math.max(50, Math.round(score / 3));
    onRecordQuizResult(activeProfile.id, record, xpReward);
  };

  // Sort profiles for competitive leaderboard
  const sortedLeaderboard = [...profiles].sort((a, b) => {
    const todayA = a.dailyQuizHistory?.[todayKey]?.score ?? a.dailyQuizBestScore ?? 0;
    const todayB = b.dailyQuizHistory?.[todayKey]?.score ?? b.dailyQuizBestScore ?? 0;
    if (todayB !== todayA) return todayB - todayA;
    return b.xp - a.xp;
  });

  return (
    <div className="space-y-6">
      {/* Top Competitive Arena Banner & Player Switcher */}
      <div className="bg-gradient-to-br from-[#0A192F] via-[#0F2342] to-[#0A192F] text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-lg space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F7931A] font-semibold">
              <Trophy className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'ga'
                  ? `AIRÉINE SHATOSHI LAETHÚIL · ${todayKey}`
                  : `DAILY SATOSHI QUIZ ARENA · ${todayKey}`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {lang === 'ga'
                ? 'Tráth na gCeist Laethúil Iomaíoch (Bitcoin, An Páipéar Bán & Airgead)'
                : 'Daily Competitive Bitcoin & Financial Literacy Blitz'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              {lang === 'ga'
                ? '5 cheist in aghaidh an chloig (15s an cheist), 3 chroí, bónais luais, cumhachtaí 50/50 & 2x XP, agus Clár Ceannairí beo idir úsáideoirí!'
                : 'Compete head-to-head across profiles! 5 rapid-fire questions (15s timer), 3 lives, streak multipliers, 50/50 & 2x XP power-ups, and a live Irish Leaderboard.'}
            </p>
          </div>

          {/* Active Competitor Switcher */}
          <div className="bg-white/8 border border-white/15 rounded-2xl p-3.5 space-y-2 shrink-0">
            <div className="flex items-center justify-between gap-4 text-[11px] font-mono text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#F7931A]" />
                {lang === 'ga' ? 'Imreoir Gníomhach:' : 'Competing As:'}
              </span>
              <span className="text-[#F7931A] font-bold">
                🔥 {activeProfile.dailyQuizStreak || 1} {lang === 'ga' ? 'lá' : 'day streak'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {profiles.map((prof) => {
                const isSelected = prof.id === activeProfile.id;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => {
                      if (gameState !== 'playing') onSelectProfile(prof.id);
                    }}
                    disabled={gameState === 'playing'}
                    className={`min-h-[32px] pl-1.5 pr-3 py-1 rounded-full text-xs font-bold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                      isSelected
                        ? 'bg-[#F7931A] text-[#0A192F] shadow-sm'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full text-[10px] inline-flex items-center justify-center text-white font-bold shrink-0 leading-none"
                      style={{ backgroundColor: prof.avatarColor }}
                    >
                      {prof.displayName.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="truncate max-w-[110px] leading-none">
                      {prof.displayName.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Game Rules / Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-white/6 border border-white/10">
            <div className="text-[11px] text-slate-300">
              {lang === 'ga' ? 'Scór is Fearr' : 'Your High Score'}
            </div>
            <div className="text-lg font-bold font-mono text-[#F7931A] mt-0.5">
              {(activeProfile.dailyQuizBestScore || 0).toLocaleString('en-IE')} pts
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/6 border border-white/10">
            <div className="text-[11px] text-slate-300">
              {lang === 'ga' ? 'Sraith Laethúil' : 'Daily Streak'}
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
              <Flame className="w-4 h-4 text-[#F7931A] shrink-0" />
              <span>{activeProfile.dailyQuizStreak || 1} {lang === 'ga' ? 'Lá' : 'Days'}</span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/6 border border-white/10">
            <div className="text-[11px] text-slate-300">
              {lang === 'ga' ? 'Stádas Inniu' : 'Today’s Daily Blitz'}
            </div>
            <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
              {alreadyCompletedToday ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {activeProfile.dailyQuizHistory?.[todayKey]?.score} pts (
                    {activeProfile.dailyQuizHistory?.[todayKey]?.correctCount}/5)
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#F7931A] shrink-0" />
                  <span>{lang === 'ga' ? 'Réidh le hImirt!' : 'Ready to Compete!'}</span>
                </>
              )}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/6 border border-white/10">
            <div className="text-[11px] text-slate-300">
              {lang === 'ga' ? 'Cumhachtaí Cluiche' : 'Arena Power-Ups'}
            </div>
            <div className="text-xs font-semibold text-slate-200 mt-1">
              50/50 Lifeline · 2x XP Boost
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Quiz Arena (7 cols) + Competitive Multi-User Leaderboard (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Interactive Game Stage */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0D1F38] rounded-3xl border border-slate-200 dark:border-[#1E3A5F] p-5 sm:p-6 shadow-xs space-y-5">
          {gameState === 'lobby' && (
            <div className="space-y-5 py-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F7931A]/15 text-[#D97706] dark:text-[#F7931A]">
                    {lang === 'ga' ? 'MODH IOMAÍOCH' : 'COMPETITIVE MULTI-PLAYER'}
                  </span>
                  <h3 className="text-xl font-bold text-[#0A192F] dark:text-white mt-2">
                    {lang === 'ga'
                      ? `An bhfuil tú réidh, ${activeProfile.displayName.split(' ')[0]}?`
                      : `Ready to top the leaderboard, ${activeProfile.displayName.split(' ')[0]}?`}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {lang === 'ga'
                      ? 'Faigheann gach imreoir na 5 cheist chéanna sa Dúshlán Laethúil inniu. Freagair go tapa chun bónas luais agus sraith-iolraitheoir a thuilleamh, ansin athraigh próifílí chun dul san iomaíocht le cairde nó le baill teaghlaigh!'
                      : 'Every profile gets the exact same 5 questions in today’s Daily Challenge. Answer fast to stack speed bonuses and combo multipliers, then switch profiles above so friends or family can try to beat your score!'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F4F6F9] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F]">
                  <div className="text-xs font-bold text-[#0A192F] dark:text-white flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-[#F7931A] shrink-0" />
                    <span>{lang === 'ga' ? '15 Soicind / Ceist' : '15s Speed Clock'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    {lang === 'ga'
                      ? '+10 bpointe in aghaidh gach soicind a shábhálann tú.'
                      : 'Earn +10 bonus points for every second left on the clock.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F4F6F9] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F]">
                  <div className="text-xs font-bold text-[#0A192F] dark:text-white flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#006B3F] dark:text-emerald-400 shrink-0" />
                    <span>{lang === 'ga' ? 'Teaglaim & 2x XP' : 'Combo & Power-Ups'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    {lang === 'ga'
                      ? 'Úsáid 50/50 chun 2 fhreagra mhíchearta a bhaint nó 2x XP.'
                      : 'Use 50/50 to remove 2 wrong answers or activate 2x Points.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F4F6F9] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F]">
                  <div className="text-xs font-bold text-[#0A192F] dark:text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#F7931A] shrink-0" />
                    <span>{lang === 'ga' ? 'Suaitheantas Curaidh' : 'Champion Badge'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                    {lang === 'ga'
                      ? 'Faigh 4/5+ chun suaitheantas Curadh Airéine Satoshi (+300 XP) a dhíghlasáil.'
                      : 'Score 4/5+ to unlock the Daily Satoshi Arena Champion badge (+300 XP).'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startQuiz('daily')}
                  className="btn-google-amber min-h-[44px] w-full sm:w-auto justify-center !px-5 !text-xs sm:!text-sm"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>
                    {alreadyCompletedToday
                      ? lang === 'ga'
                        ? 'Imir Dúshlán an Lae Arís'
                        : 'Replay Today’s Official Daily Blitz'
                      : lang === 'ga'
                      ? 'Tosaigh Dúshlán Oifigiúil an Lae (5 Cheist)'
                      : 'Start Today’s Official Daily Blitz (5 Questions)'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => startQuiz('practice')}
                  className="btn-google-outlined min-h-[44px] w-full sm:w-auto justify-center !px-5"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === 'ga' ? 'Babhta Cleachtaidh Randamach' : 'Play Endless Practice Blitz'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {gameState === 'playing' && currentQuestion && (
            <div className="space-y-5">
              {/* Top Game HUD: Question Counter, Hearts, Combo Streak, Countdown Timer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#1E3A5F]">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0A192F] text-white">
                    Q{currentIndex + 1} / {questions.length}
                  </span>

                  {/* 3 Hearts Lives Indicator */}
                  <div className="flex items-center gap-1" aria-label={`${hearts} lives remaining`}>
                    {[1, 2, 3].map((h) => (
                      <Heart
                        key={h}
                        className={`w-4 h-4 transition-transform ${
                          h <= hearts
                            ? 'text-red-500 fill-red-500 scale-100'
                            : 'text-slate-300 dark:text-slate-700 scale-90'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Combo Multiplier Pill */}
                  {combo > 0 && (
                    <motion.span
                      key={combo}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#F7931A]/20 text-[#D97706] dark:text-[#F7931A] inline-flex items-center justify-center gap-1"
                    >
                      <Flame className="w-3.5 h-3.5 shrink-0" />
                      <span>{combo}x Streak!</span>
                    </motion.span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono font-bold text-[#006B3F] dark:text-emerald-400">
                    {score.toLocaleString('en-IE')} pts
                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold inline-flex items-center justify-center gap-1.5 ${
                      timeLeft <= 5
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 animate-pulse'
                        : 'bg-slate-100 dark:bg-[#0A192F] text-[#0A192F] dark:text-white'
                    }`}
                  >
                    <Timer className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                    <span>{timeLeft}s</span>
                  </div>
                </div>
              </div>

              {/* Animated Timer Bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    timeLeft <= 5 ? 'bg-red-500' : 'bg-gradient-to-r from-[#006B3F] to-[#F7931A]'
                  }`}
                  animate={{ width: `${(timeLeft / QUESTION_TIME_LIMIT_SEC) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Power-Up Lifelines Row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={fiftyFiftyUsed || isRevealed}
                    onClick={handleUseFiftyFifty}
                    className={`min-h-[34px] px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 ${
                      fiftyFiftyUsed
                        ? 'bg-slate-100 text-slate-400 border-slate-200'
                        : 'bg-[#0A192F] text-white border-[#0A192F] hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                    <span>50 / 50 {fiftyFiftyUsed ? '✓' : ''}</span>
                  </button>

                  <button
                    type="button"
                    disabled={doublePointsUsed || isRevealed}
                    onClick={handleUseDoublePoints}
                    className={`min-h-[34px] px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 ${
                      doublePointsActive
                        ? 'bg-[#F7931A] text-[#0A192F] border-[#F7931A] shadow-sm'
                        : doublePointsUsed
                        ? 'bg-slate-100 text-slate-400 border-slate-200'
                        : 'bg-[#006B3F] text-white border-[#006B3F] hover:bg-[#005532]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      2x Points {doublePointsActive ? '(ACTIVE!)' : doublePointsUsed ? '✓' : ''}
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    speakIrishText(
                      lang === 'ga' ? currentQuestion.questionGa : currentQuestion.questionEn,
                      lang
                    )
                  }
                  className="min-h-[34px] px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F] inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0A192F] dark:hover:text-white cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
                  <span>{lang === 'ga' ? 'Éist leis an gceist' : 'Read Aloud'}</span>
                </button>
              </div>

              {/* Question Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F6F9] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F]">
                <h3 className="text-base sm:text-lg font-bold text-[#0A192F] dark:text-white leading-snug">
                  {lang === 'ga' ? currentQuestion.questionGa : currentQuestion.questionEn}
                </h3>
              </div>

              {/* 4 Answer Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {(lang === 'ga' ? currentQuestion.optionsGa : currentQuestion.optionsEn).map(
                  (optText, idx) => {
                    const isHiddenBy5050 = hiddenOptionIndices.includes(idx);
                    if (isHiddenBy5050) {
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center italic"
                        >
                          {lang === 'ga'
                            ? 'Bainte ag cumhacht 50/50'
                            : 'Removed by 50/50 Lifeline'}
                        </div>
                      );
                    }

                    const isCorrectOption = idx === currentQuestion.correctIndex;
                    const isChosen = selectedOption === idx;

                    let btnStyle =
                      'bg-white dark:bg-[#0F2342] border-slate-200 dark:border-[#1E3A5F] text-[#0A192F] dark:text-white hover:border-[#F7931A]';

                    if (isRevealed) {
                      if (isCorrectOption) {
                        btnStyle =
                          'bg-emerald-50 dark:bg-[#006B3F]/30 border-2 border-[#006B3F] text-[#0A192F] dark:text-white';
                      } else if (isChosen && !isCorrectOption) {
                        btnStyle =
                          'bg-red-50 dark:bg-red-950/50 border-2 border-red-500 text-red-900 dark:text-red-200';
                      } else {
                        btnStyle =
                          'bg-slate-50 dark:bg-[#0A192F] border-slate-200 dark:border-[#1E3A5F] opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isRevealed}
                        onClick={() => handleSelectAnswer(idx)}
                        className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-[#0A192F] text-xs font-mono font-bold inline-flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold leading-snug">
                            {optText}
                          </span>
                        </div>

                        {isRevealed && isCorrectOption && (
                          <CheckCircle2 className="w-5 h-5 text-[#006B3F] dark:text-emerald-400 shrink-0" />
                        )}
                        {isRevealed && isChosen && !isCorrectOption && (
                          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              {/* Instant Explanation & Next Button */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-[#0A192F] text-white space-y-3 border border-slate-800"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <span className="text-xs font-mono font-bold text-[#F7931A]">
                        {selectedOption === currentQuestion.correctIndex
                          ? lang === 'ga'
                            ? '✓ CEART! BÓNAS LUAIS CURTHA LEIS'
                            : '✓ CORRECT! SPEED & STREAK BONUS ADDED'
                          : selectedOption === -1
                          ? lang === 'ga'
                            ? '⏰ AM ISTIGH!'
                            : '⏰ TIME RAN OUT!'
                          : lang === 'ga'
                          ? '✗ MÍCHEART — COINNIGH AG FOGHLAIM'
                          : '✗ NOT QUITE — HERE IS WHY'}
                      </span>

                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="btn-google-amber !py-2 !px-4 !text-xs w-full sm:w-auto shrink-0"
                      >
                        <span>
                          {hearts <= 0 || currentIndex >= questions.length - 1
                            ? lang === 'ga'
                              ? 'Críochnaigh & Féach Scór'
                              : 'Finish & See Rank'
                            : lang === 'ga'
                            ? 'An Chéad Cheist Eile'
                            : 'Next Question'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {lang === 'ga'
                        ? currentQuestion.explanationGa
                        : currentQuestion.explanationEn}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {gameState === 'finished' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5 py-2 text-center sm:text-left"
            >
              <div className="p-5 rounded-3xl bg-[#0A192F] text-white border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono text-[#F7931A] font-bold">
                      {lang === 'ga' ? 'TORTHAÍ AN BHLITZ LAETHÚIL' : 'DAILY BLITZ MATCH COMPLETE'}
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-0.5">
                      {score.toLocaleString('en-IE')} {lang === 'ga' ? 'Pointe!' : 'Points Scored!'}
                    </h3>
                  </div>

                  <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#006B3F] text-white text-xs font-mono font-bold self-center sm:self-auto shrink-0">
                    <Sparkles className="w-4 h-4 text-[#F7931A] shrink-0" />
                    <span>+{Math.max(50, Math.round(score / 3))} XP Earned</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <div className="text-[11px] text-slate-300">
                      {lang === 'ga' ? 'Cruinneas' : 'Accuracy'}
                    </div>
                    <div className="text-base font-bold font-mono text-emerald-400">
                      {correctCount} / {questions.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300">
                      {lang === 'ga' ? 'Teaglaim Is Airde' : 'Best Streak'}
                    </div>
                    <div className="text-base font-bold font-mono text-[#F7931A]">
                      {maxCombo}x Combo
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-300">
                      {lang === 'ga' ? 'Am Sábháilte' : 'Speed Saved'}
                    </div>
                    <div className="text-base font-bold font-mono text-white">
                      {totalTimeSaved}s
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => startQuiz('daily')}
                  className="btn-google-amber min-h-[42px] w-full sm:w-auto justify-center"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === 'ga' ? 'Imir Arís chun Scór a Bhriseadh' : 'Play Again to Beat Your Score'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => startQuiz('practice')}
                  className="btn-google-outlined min-h-[42px] w-full sm:w-auto justify-center"
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === 'ga' ? 'Ceisteanna Nua Cleachtaidh' : 'New 5-Question Practice Set'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right 5 Cols: Live Multi-User Competitive Leaderboard */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D1F38] rounded-3xl border border-slate-200 dark:border-[#1E3A5F] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#1E3A5F]">
            <div>
              <div className="text-[11px] font-mono font-bold text-[#006B3F] dark:text-emerald-400 uppercase">
                {lang === 'ga' ? 'CLÁR CEANNAIRÍ NA HÉIREANN' : 'LIVE COMPETITIVE LEADERBOARD'}
              </div>
              <h3 className="text-base font-bold text-[#0A192F] dark:text-white mt-0.5 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#F7931A]" />
                <span>
                  {lang === 'ga'
                    ? 'Rangú Imreoirí & Scóir an Lae'
                    : 'Player Standings & Daily High Scores'}
                </span>
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {profiles.length} {lang === 'ga' ? 'Imreoir' : 'Players'}
            </span>
          </div>

          <div className="space-y-2.5">
            {sortedLeaderboard.map((prof, idx) => {
              const isCurrent = prof.id === activeProfile.id;
              const bestScore =
                prof.dailyQuizHistory?.[todayKey]?.score ?? prof.dailyQuizBestScore ?? 0;
              const streak = prof.dailyQuizStreak || 1;
              const rankTier = getRankForXp(prof.xp).current;

              return (
                <div
                  key={prof.id}
                  onClick={() => {
                    if (gameState !== 'playing') onSelectProfile(prof.id);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#006B3F]/8 border-2 border-[#006B3F] dark:border-emerald-400'
                      : 'bg-[#F4F6F9] dark:bg-[#0A192F] border-slate-200 dark:border-[#1E3A5F] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Medal (#1 Gold, #2 Silver, #3 Bronze) */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        idx === 0
                          ? 'bg-[#F7931A] text-[#0A192F] shadow-xs'
                          : idx === 1
                          ? 'bg-slate-300 text-[#0A192F]'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      #{idx + 1}
                    </div>

                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: prof.avatarColor }}
                    >
                      {prof.displayName.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-[#0A192F] dark:text-white truncate">
                          {prof.displayName}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#006B3F] text-white shrink-0">
                            {lang === 'ga' ? 'Tusa' : 'You'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {prof.county.split(' ')[0]} ·{' '}
                        {lang === 'ga' ? rankTier.titleGa : rankTier.titleEn} · 🔥 {streak}d
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-mono text-[#006B3F] dark:text-emerald-400 tabular-nums">
                      {bestScore.toLocaleString('en-IE')} pts
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 tabular-nums">
                      {prof.xp.toLocaleString('en-IE')} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F4F6F9] dark:bg-[#0A192F] border border-slate-200 dark:border-[#1E3A5F] text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-[#0A192F] dark:text-white">
              {lang === 'ga' ? 'Leid Iomaíochta: ' : 'Pass & Play Tip: '}
            </strong>
            {lang === 'ga'
              ? 'Cliceáil ar aon imreoir ar an gClár Ceannairí chun a bpróifíl a roghnú agus féachaint an féidir leat scór an lae a shárú!'
              : 'Tap any player on the Leaderboard to switch to their profile—or create a new profile in the Learning Path modal to challenge friends!'}
          </div>
        </div>
      </div>
    </div>
  );
};
