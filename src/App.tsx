import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileText,
  Flame,
  Play,
  RotateCcw,
  Smartphone,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import {
  CLASS_LEVELS,
  DIFFICULTIES,
  getLearnerRank,
  getTodayKey,
  getYesterdayKey,
  INITIAL_PROGRESS,
  OPERATIONS,
  UI_TEXT,
  type AppLanguage,
  type ClassNumber,
  type DifficultyLevel,
  type LocalProgress,
  type MathOperation,
  type QuizConfig,
  type QuizHistoryEntry,
  type QuizSummary,
} from './data/mathsMaster';
import { QuizMode } from './components/QuizMode';
import { VisualLab } from './components/VisualLab';
import { ParentsGuideSection } from './components/ParentsGuideSection';
import { BlogSection } from './components/BlogSection';
import { LegalFooterModals, type FooterDocType } from './components/LegalFooterModals';
import { MascotLogo, OperationIllustration } from './components/MascotLogo';
import { HeroShowcase } from './components/HeroShowcase';
import { TrustHighlightsStrip } from './components/TrustHighlightsStrip';
import { ActiveMiniGameView, MathGamesArcadeSection } from './components/MathGamesArcade';
import {
  PrintableA4Sheet,
  PrintableWorksheetsSection,
} from './components/PrintableWorksheetsSection';
import { ALL_WORKSHEETS, type MathWorksheet } from './data/worksheets';
import type { MiniGameId } from './data/mathGames';
import { soundFx } from './utils/sound';

type AppTab = 'home' | 'games' | 'worksheets' | 'progress' | 'lab';

const STORAGE_KEY = 'maths_master_kids_progress_v1';

function loadProgress(): LocalProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<LocalProgress>;
    const validClass = ([1, 2, 3, 4, 5] as ClassNumber[]).includes(parsed.selectedClass as ClassNumber)
      ? (parsed.selectedClass as ClassNumber)
      : INITIAL_PROGRESS.selectedClass;
    const validDiff = (['EASY', 'MEDIUM', 'HARD'] as DifficultyLevel[]).includes(
      parsed.selectedDifficulty as DifficultyLevel
    )
      ? (parsed.selectedDifficulty as DifficultyLevel)
      : INITIAL_PROGRESS.selectedDifficulty;

    return {
      totalStars: Number.isFinite(parsed.totalStars) ? Math.max(0, Number(parsed.totalStars)) : 0,
      totalQuizzesCompleted: Number.isFinite(parsed.totalQuizzesCompleted)
        ? Math.max(0, Number(parsed.totalQuizzesCompleted))
        : 0,
      totalCorrectAnswers: Number.isFinite(parsed.totalCorrectAnswers)
        ? Math.max(0, Number(parsed.totalCorrectAnswers))
        : 0,
      totalAttemptedQuestions: Number.isFinite(parsed.totalAttemptedQuestions)
        ? Math.max(0, Number(parsed.totalAttemptedQuestions))
        : 0,
      dailyStreak: Number.isFinite(parsed.dailyStreak) ? Math.max(0, Number(parsed.dailyStreak)) : 0,
      lastDailyDate: typeof parsed.lastDailyDate === 'string' ? parsed.lastDailyDate : '',
      selectedClass: validClass,
      selectedDifficulty: validDiff,
      byOperation: {
        ADDITION: parsed.byOperation?.ADDITION ?? INITIAL_PROGRESS.byOperation.ADDITION,
        SUBTRACTION: parsed.byOperation?.SUBTRACTION ?? INITIAL_PROGRESS.byOperation.SUBTRACTION,
        MULTIPLICATION:
          parsed.byOperation?.MULTIPLICATION ?? INITIAL_PROGRESS.byOperation.MULTIPLICATION,
        DIVISION: parsed.byOperation?.DIVISION ?? INITIAL_PROGRESS.byOperation.DIVISION,
      },
      recentQuizzes: Array.isArray(parsed.recentQuizzes) ? parsed.recentQuizzes.slice(0, 20) : [],
    };
  } catch {
    return INITIAL_PROGRESS;
  }
}

const SOUND_STORAGE_KEY = 'maths_master_kids_sound_v1';
const LANG_STORAGE_KEY = 'maths_master_kids_lang_v1';

function loadSoundPreference(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(SOUND_STORAGE_KEY);
    return raw === null ? true : raw === 'true';
  } catch {
    return true;
  }
}

function loadLangPreference(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const raw = window.localStorage.getItem(LANG_STORAGE_KEY);
    return raw === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [progress, setProgress] = useState<LocalProgress>(loadProgress);
  const [activeQuiz, setActiveQuiz] = useState<QuizConfig | null>(null);
  const [activeMiniGame, setActiveMiniGame] = useState<MiniGameId | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(loadSoundPreference);
  const [lang, setLang] = useState<AppLanguage>(loadLangPreference);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeFooterDoc, setActiveFooterDoc] = useState<FooterDocType | null>(null);
  const [activeBlogArticleId, setActiveBlogArticleId] = useState<string | null>(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const [printTargetWorksheet, setPrintTargetWorksheet] = useState<MathWorksheet>(
    () => ALL_WORKSHEETS[0]
  );

  useEffect(() => {
    if (!moreMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [moreMenuOpen]);

  const openFooterDoc = (doc: FooterDocType) => {
    soundFx.playClick();
    setActiveFooterDoc(doc);
  };

  const handlePrintWorksheet = (worksheet: MathWorksheet) => {
    flushSync(() => {
      setPrintTargetWorksheet(worksheet);
    });
    window.print();
  };

  const t = UI_TEXT[lang];
  const selectedClass = progress.selectedClass;
  const selectedDifficulty = progress.selectedDifficulty;
  const todayKey = getTodayKey();
  const dailyCompletedToday = progress.lastDailyDate === todayKey;

  useEffect(() => {
    soundFx.enabled = soundEnabled;
    try {
      window.localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled));
    } catch {
      // Ignore storage quota errors
    }
  }, [soundEnabled]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage quota errors
    }
  }, [lang]);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      soundFx.enabled = next;
      if (next) {
        soundFx.playClick();
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors
    }
  }, [progress]);

  const setSelectedClass = (classNum: ClassNumber) => {
    soundFx.playClick();
    setProgress((prev) => ({ ...prev, selectedClass: classNum }));
  };

  const setSelectedDifficulty = (diff: DifficultyLevel) => {
    soundFx.playClick();
    setProgress((prev) => ({ ...prev, selectedDifficulty: diff }));
  };

  const startOperationQuiz = (op: MathOperation) => {
    soundFx.playClick();
    setActiveMiniGame(null);
    setActiveQuiz({
      classNumber: selectedClass,
      difficulty: selectedDifficulty,
      operation: op,
      isDailyPractice: false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startDailyPractice = () => {
    soundFx.playClick();
    setActiveMiniGame(null);
    setActiveQuiz({
      classNumber: selectedClass,
      difficulty: selectedDifficulty,
      operation: null,
      isDailyPractice: true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const launchMiniGame = (gameId: MiniGameId) => {
    soundFx.playClick();
    setActiveQuiz(null);
    setActiveMiniGame(gameId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recordMiniGameAnswer = (isCorrect: boolean) => {
    setProgress((prev) => ({
      ...prev,
      totalStars: prev.totalStars + (isCorrect ? 1 : 0),
      totalCorrectAnswers: prev.totalCorrectAnswers + (isCorrect ? 1 : 0),
      totalAttemptedQuestions: prev.totalAttemptedQuestions + 1,
    }));
  };

  const navigateToTab = (tab: AppTab) => {
    soundFx.playClick();
    setMoreMenuOpen(false);
    setActiveQuiz(null);
    setActiveMiniGame(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDailySection = () => {
    soundFx.playClick();
    setMoreMenuOpen(false);
    setActiveQuiz(null);
    setActiveMiniGame(null);
    setActiveTab('home');
    setTimeout(() => {
      document.getElementById('daily-practice')?.scrollIntoView({ behavior: 'smooth' });
    }, 40);
  };

  const navigateToBlogSection = () => {
    soundFx.playClick();
    setMoreMenuOpen(false);
    setActiveQuiz(null);
    setActiveMiniGame(null);
    setActiveTab('home');
    setTimeout(() => {
      document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 40);
  };

  const navigateToParentsGuide = () => {
    soundFx.playClick();
    setMoreMenuOpen(false);
    setActiveQuiz(null);
    setActiveMiniGame(null);
    setActiveTab('home');
    setTimeout(() => {
      document.getElementById('parents-guide')?.scrollIntoView({ behavior: 'smooth' });
    }, 40);
  };

  const handleQuizComplete = (
    summary: QuizSummary,
    perOpCounts: Record<MathOperation, { attempted: number; correct: number }>
  ) => {
    const yesterdayKey = getYesterdayKey();
    const historyEntry: QuizHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      completedAt: new Date().toISOString(),
      classNumber: summary.config.classNumber,
      difficulty: summary.config.difficulty,
      operation: summary.config.operation,
      isDailyPractice: summary.config.isDailyPractice,
      correctAnswers: summary.correctAnswers,
      totalQuestions: summary.totalQuestions,
      percentage: summary.percentage,
      starsEarned: summary.starsEarned,
    };

    setProgress((prev) => {
      const nextByOp = { ...prev.byOperation };
      (Object.keys(perOpCounts) as MathOperation[]).forEach((op) => {
        const delta = perOpCounts[op];
        if (delta.attempted > 0) {
          nextByOp[op] = {
            attempted: nextByOp[op].attempted + delta.attempted,
            correct: nextByOp[op].correct + delta.correct,
            quizzes: nextByOp[op].quizzes + (summary.config.operation === op ? 1 : 0),
          };
        }
      });

      let nextStreak = prev.dailyStreak;
      let nextLastDaily = prev.lastDailyDate;
      if (summary.config.isDailyPractice && prev.lastDailyDate !== todayKey) {
        nextStreak = prev.lastDailyDate === yesterdayKey ? prev.dailyStreak + 1 : 1;
        nextLastDaily = todayKey;
      }

      return {
        ...prev,
        totalStars: prev.totalStars + summary.starsEarned,
        totalQuizzesCompleted: prev.totalQuizzesCompleted + 1,
        totalCorrectAnswers: prev.totalCorrectAnswers + summary.correctAnswers,
        totalAttemptedQuestions: prev.totalAttemptedQuestions + summary.totalQuestions,
        dailyStreak: nextStreak,
        lastDailyDate: nextLastDaily,
        byOperation: nextByOp,
        recentQuizzes: [historyEntry, ...prev.recentQuizzes].slice(0, 20),
      };
    });
  };

  const handleResetProgress = () => {
    soundFx.playClick();
    setProgress(INITIAL_PROGRESS);
    setConfirmReset(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const overallAccuracy =
    progress.totalAttemptedQuestions > 0
      ? Math.round((progress.totalCorrectAnswers / progress.totalAttemptedQuestions) * 100)
      : 0;
  const rank = getLearnerRank(progress.totalStars);
  const currentXp = progress.totalStars * 10;
  const prevRankStars =
    progress.totalStars >= 100
      ? 100
      : progress.totalStars >= 60
        ? 60
        : progress.totalStars >= 30
          ? 30
          : progress.totalStars >= 10
            ? 10
            : 0;
  const nextRankXp = rank.nextThreshold !== null ? rank.nextThreshold * 10 : null;
  const nextRankTitle =
    rank.nextThreshold === 10
      ? lang === 'hi'
        ? 'गणित अन्वेषक'
        : 'Math Explorer'
      : rank.nextThreshold === 30
        ? lang === 'hi'
          ? 'गणित साधक'
          : 'Math Achiever'
        : rank.nextThreshold === 60
          ? lang === 'hi'
            ? 'गणित जादूगर'
            : 'Math Wizard'
          : rank.nextThreshold === 100
            ? lang === 'hi'
              ? 'गणित चैंपियन'
              : 'Math Champion'
            : null;
  const xpProgressPercent =
    rank.nextThreshold === null
      ? 100
      : Math.min(
          100,
          Math.max(
            6,
            Math.round(
              ((progress.totalStars - prevRankStars) / (rank.nextThreshold - prevRankStars)) * 100
            )
          )
        );
  const isHi = lang === 'hi';

  return (
    <>
    <div className="min-h-screen flex flex-col bg-[#F4F7FE] text-slate-900 print:hidden">
      {/* Clean Modern 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-indigo-100/90 shadow-[0_4px_18px_-6px_rgba(30,27,75,0.08)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: Mascot Logo + Brand Title */}
          <button
            type="button"
            onClick={() => navigateToTab('home')}
            className="inline-flex items-center gap-2.5 font-display text-[16px] sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer group"
          >
            <MascotLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-3" />
            <span>Maths Master Kids</span>
          </button>

          {/* Zone 2: Cleanly Grouped 5-Item Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-bold text-slate-600">
            <button
              type="button"
              onClick={() => navigateToTab('home')}
              className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'home' && !activeQuiz && !activeMiniGame
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {isHi ? 'होम' : 'Home'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('games')}
              className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                (activeTab === 'games' && !activeQuiz) || activeMiniGame
                  ? 'border-fuchsia-600 text-fuchsia-700'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {isHi ? 'गणित खेल' : 'Games'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('worksheets')}
              className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'worksheets' && !activeQuiz && !activeMiniGame
                  ? 'border-sky-600 text-sky-700'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {isHi ? 'वर्कशीट PDF' : 'Worksheets PDF'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('lab')}
              className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'lab' && !activeQuiz && !activeMiniGame
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {isHi ? 'विज़ुअल लैब' : 'Visual Lab'}
            </button>

            {/* More / Blog Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setMoreMenuOpen((prev) => !prev);
                }}
                aria-expanded={moreMenuOpen}
                aria-haspopup="menu"
                className={`py-1.5 inline-flex items-center gap-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'progress' || moreMenuOpen
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent hover:text-slate-900'
                }`}
              >
                <span>{isHi ? 'ब्लॉग और अधिक' : 'More / Blog'}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-150 ${moreMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {moreMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 space-y-0.5"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={navigateToBlogSection}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{isHi ? 'ब्लॉग और गणित टिप्स' : 'Blog & Maths Tips'}</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => navigateToTab('progress')}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{isHi ? 'मेरी प्रगति और सितारे' : 'My Progress & Stars'}</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={navigateToDailySection}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{isHi ? 'दैनिक अभ्यास' : 'Daily Practice'}</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={navigateToParentsGuide}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isHi ? 'अभिभावक गाइड' : "Parent's Guide"}</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Language Switcher + Star Count + Sound Toggle + Glowing Daily Quiz Pill CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-xl shrink-0" role="group" aria-label="Language selector">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setLang('en');
                }}
                aria-pressed={lang === 'en'}
                className={`px-2 sm:px-2.5 py-1.5 text-xs font-extrabold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  lang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setLang('hi');
                }}
                aria-pressed={lang === 'hi'}
                className={`px-2 sm:px-2.5 py-1.5 text-xs font-extrabold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  lang === 'hi' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिं
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigateToTab('progress')}
              aria-label={`Total stars earned: ${progress.totalStars}. View progress`}
              className="min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 hover:border-amber-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" aria-hidden="true" />
              <span className="font-math text-sm font-extrabold text-amber-950">
                {progress.totalStars}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
              aria-pressed={!soundEnabled}
              title={soundEnabled ? 'Sound On (Click to mute)' : 'Sound Muted (Click to unmute)'}
              className={`min-h-[36px] sm:min-h-[40px] px-2.5 py-1.5 rounded-xl border inline-flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                soundEnabled
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={startDailyPractice}
              className="hidden sm:inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 border-b-[3px] border-rose-700 rounded-full shadow-[0_4px_16px_rgba(249,115,22,0.42)] hover:brightness-105 hover:shadow-[0_6px_22px_rgba(249,115,22,0.55)] active:translate-y-[1px] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>{isHi ? 'दैनिक क्विज़' : 'Daily Quiz'}</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Nav Row */}
        {!activeQuiz && !activeMiniGame && (
          <div className="lg:hidden border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-start sm:justify-around gap-1 overflow-x-auto text-[11px] sm:text-xs font-bold text-slate-600 bg-white">
            <button
              type="button"
              onClick={() => navigateToTab('home')}
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'home' ? 'text-indigo-700 bg-indigo-50' : ''
              }`}
            >
              {isHi ? 'होम' : 'Home'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('games')}
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'games' ? 'text-fuchsia-700 bg-fuchsia-50' : ''
              }`}
            >
              {isHi ? 'गणित खेल' : 'Games'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('worksheets')}
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'worksheets' ? 'text-sky-700 bg-sky-50' : ''
              }`}
            >
              {isHi ? 'वर्कशीट PDF' : 'Worksheets PDF'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('lab')}
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'lab' ? 'text-emerald-700 bg-emerald-50' : ''
              }`}
            >
              {isHi ? 'विज़ुअल लैब' : 'Visual Lab'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('progress')}
              className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'progress' ? 'text-indigo-700 bg-indigo-50' : ''
              }`}
            >
              {isHi ? 'प्रगति' : 'Progress'}
            </button>
            <button
              type="button"
              onClick={navigateToBlogSection}
              className="px-2.5 py-1.5 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isHi ? 'ब्लॉग' : 'Blog'}
            </button>
          </div>
        )}
      </header>

      <main className="flex-1">
        {activeQuiz ? (
          <QuizMode
            key={`${activeQuiz.isDailyPractice}-${activeQuiz.operation ?? 'mix'}-${activeQuiz.classNumber}-${activeQuiz.difficulty}`}
            config={activeQuiz}
            lang={lang}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            onExit={() => {
              soundFx.playClick();
              setActiveQuiz(null);
            }}
            onQuizComplete={handleQuizComplete}
          />
        ) : activeMiniGame ? (
          <ActiveMiniGameView
            gameId={activeMiniGame}
            classNumber={selectedClass}
            lang={lang}
            onRecordAnswer={recordMiniGameAnswer}
            onExit={() => {
              soundFx.playClick();
              setActiveMiniGame(null);
            }}
          />
        ) : activeTab === 'games' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
            <MathGamesArcadeSection
              lang={lang}
              selectedClass={selectedClass}
              onSelectClass={setSelectedClass}
              showClassPicker
              onLaunchGame={launchMiniGame}
            />
          </div>
        ) : activeTab === 'worksheets' ? (
          <PrintableWorksheetsSection
            lang={lang}
            selectedClass={selectedClass}
            onSelectClass={setSelectedClass}
            onPrintWorksheet={handlePrintWorksheet}
          />
        ) : activeTab === 'lab' ? (
          <VisualLab lang={lang} />
        ) : activeTab === 'progress' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {isHi ? 'मेरी प्रगति और सितारे' : 'My Progress & Stars'}
                </h1>
                <p className="text-slate-600 text-base">
                  {isHi
                    ? 'आपके डिवाइस पर सुरक्षित · 100% ऑफ़लाइन · कोई व्यक्तिगत डेटा एकत्र नहीं।'
                    : 'Saved locally on your device · 100% offline · No personal information collected.'}
                </p>
              </div>
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 shadow-card-soft">
                <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
                <div>
                  <span className="block text-xs font-medium text-amber-800">
                    {isHi ? 'कुल सितारे' : 'Total Stars'}
                  </span>
                  <span className="font-math text-2xl font-extrabold text-amber-950">
                    {progress.totalStars}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card-soft">
                <span className="text-xs font-medium text-slate-500">
                  {isHi ? 'पूर्ण क्विज़' : 'Quizzes Completed'}
                </span>
                <p className="font-math text-3xl font-extrabold text-slate-900 mt-1">
                  {progress.totalQuizzesCompleted}
                </p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card-soft">
                <span className="text-xs font-medium text-slate-500">
                  {isHi ? 'सही उत्तर' : 'Correct Answers'}
                </span>
                <p className="font-math text-3xl font-extrabold text-emerald-600 mt-1">
                  {progress.totalCorrectAnswers}
                </p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card-soft">
                <span className="text-xs font-medium text-slate-500">
                  {isHi ? 'कुल सटीकता' : 'Overall Accuracy'}
                </span>
                <p className="font-math text-3xl font-extrabold text-blue-600 mt-1">
                  {overallAccuracy}%
                </p>
              </div>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card-soft">
                <span className="text-xs font-medium text-slate-500">
                  {isHi ? 'दैनिक स्ट्रीक' : 'Daily Streak'}
                </span>
                <p className="font-math text-3xl font-extrabold text-amber-600 mt-1">
                  {progress.dailyStreak}{' '}
                  {isHi ? 'दिन' : progress.dailyStreak === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            {/* Per-Operation Breakdown */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {isHi ? 'संक्रिया निपुणता' : 'Operation Mastery'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {OPERATIONS.map((op) => {
                  const st = progress.byOperation[op.id];
                  const acc = st.attempted > 0 ? Math.round((st.correct / st.attempted) * 100) : 0;
                  return (
                    <div
                      key={op.id}
                      className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-card-soft"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl text-white font-math text-2xl font-extrabold flex items-center justify-center shrink-0 ${op.gradientClass}`}
                        >
                          {op.symbol}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {isHi ? op.titleHi : op.titleEn}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {st.correct} / {st.attempted} {isHi ? 'सही' : 'correct'} · {acc}%{' '}
                            {isHi ? 'सटीकता' : 'accuracy'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => startOperationQuiz(op.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer whitespace-nowrap"
                        style={{ backgroundColor: op.bgHex }}
                      >
                        {isHi ? 'अभ्यास करें' : 'Practice'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Quiz Scores History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {isHi ? 'हाल के क्विज़ स्कोर' : 'Recent Quiz Scores'}
                </h2>
                <span className="text-xs text-slate-500">
                  {progress.recentQuizzes.length > 0
                    ? isHi
                      ? `अंतिम ${progress.recentQuizzes.length} क्विज़ दिखाई जा रही हैं`
                      : `Showing last ${progress.recentQuizzes.length} ${progress.recentQuizzes.length === 1 ? 'quiz' : 'quizzes'}`
                    : isHi
                      ? 'अभी कोई क्विज़ पूरा नहीं हुआ'
                      : 'No quizzes completed yet'}
                </span>
              </div>

              {progress.recentQuizzes.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-card-soft">
                  <p className="text-sm text-slate-600">
                    {isHi
                      ? 'अपना स्कोर, प्रतिशत और सितारे यहाँ सहेजने के लिए कोई भी 10 प्रश्नों का क्विज़ या दैनिक अभ्यास पूरा करें।'
                      : 'Complete any 10-question quiz or Daily Practice to save your score, percentage, and stars here.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateToTab('home')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    {isHi ? 'क्विज़ शुरू करें' : 'Start a Quiz'}
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-card-soft">
                  {progress.recentQuizzes.map((entry) => {
                    const opInfo = entry.operation
                      ? OPERATIONS.find((o) => o.id === entry.operation)
                      : null;
                    const title = entry.isDailyPractice
                      ? isHi
                        ? 'दैनिक मिश्रित अभ्यास'
                        : 'Daily Practice Mix'
                      : opInfo
                        ? isHi
                          ? opInfo.titleHi
                          : opInfo.titleEn
                        : isHi
                          ? 'गणित क्विज़'
                          : 'Maths Quiz';
                    const diffLabel = isHi
                      ? entry.difficulty === 'EASY'
                        ? 'आसान'
                        : entry.difficulty === 'MEDIUM'
                          ? 'मध्यम'
                          : 'कठिन'
                      : entry.difficulty.charAt(0) + entry.difficulty.slice(1).toLowerCase();
                    const dateStr = new Date(entry.completedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <div
                        key={entry.id}
                        className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl text-white font-math text-lg font-extrabold flex items-center justify-center shrink-0"
                            style={{ backgroundColor: opInfo?.bgHex ?? '#2563EB' }}
                          >
                            {opInfo?.symbol ?? '★'}
                          </div>
                          <div>
                            <p className="font-bold text-sm sm:text-base text-slate-900">{title}</p>
                            <p className="text-xs text-slate-500">
                              {isHi ? `कक्षा ${entry.classNumber}` : `Class ${entry.classNumber}`} · {diffLabel} · {dateStr}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-math text-base sm:text-lg font-extrabold text-slate-900">
                              {entry.correctAnswers}/{entry.totalQuestions}
                            </span>
                            <span className="ml-2 font-math text-xs sm:text-sm font-bold text-blue-600">
                              ({entry.percentage}%)
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 font-math text-xs font-extrabold text-amber-800">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                            +{entry.starsEarned}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Milestones */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {isHi ? 'उपलब्धियाँ' : 'Achievements'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: isHi ? 'पहले 10 सितारे' : 'First 10 Stars',
                    desc: isHi ? 'सही उत्तरों से 10 सितारे जीतें' : 'Earn 10 stars from correct answers',
                    unlocked: progress.totalStars >= 10,
                  },
                  {
                    title: isHi ? 'क्विज़ अन्वेषक' : 'Quiz Explorer',
                    desc: isHi ? '10 प्रश्नों के 3 पूर्ण क्विज़ हल करें' : 'Complete 3 full 10-question quizzes',
                    unlocked: progress.totalQuizzesCompleted >= 3,
                  },
                  {
                    title: isHi ? 'दैनिक चैंपियन' : 'Daily Champion',
                    desc: isHi ? 'कम से कम 1 दैनिक अभ्यास पूरा करें' : 'Finish at least 1 Daily Practice quiz',
                    unlocked: progress.dailyStreak >= 1,
                  },
                ].map((badge) => (
                  <div
                    key={badge.title}
                    className={`rounded-2xl border p-5 flex items-start gap-3 shadow-card-soft ${
                      badge.unlocked ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-slate-200/80 opacity-80'
                    }`}
                  >
                    <Award
                      className={`w-7 h-7 shrink-0 ${
                        badge.unlocked ? 'text-amber-500' : 'text-slate-400'
                      }`}
                    />
                    <div>
                      <p className="font-bold text-base text-slate-900">{badge.title}</p>
                      <p className="text-xs text-slate-600">{badge.desc}</p>
                      <p className="text-xs font-semibold mt-1 text-slate-700">
                        {badge.unlocked
                          ? isHi
                            ? 'अनलॉक हो गया!'
                            : 'Unlocked!'
                          : isHi
                            ? 'अनलॉक करने के लिए अभ्यास जारी रखें'
                            : 'Keep practicing to unlock'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                {isHi ? 'सभी स्कोर आपके डिवाइस पर ऑफ़लाइन सुरक्षित रहते हैं।' : 'All scores stay offline on this device.'}
              </p>
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isHi ? 'प्रगति रीसेट करें' : 'Reset Progress'}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-rose-700">
                    {isHi ? 'क्या सभी सितारे हटाएँ?' : 'Clear all stars?'}
                  </span>
                  <button
                    type="button"
                    onClick={handleResetProgress}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  >
                    {isHi ? 'हाँ, रीसेट करें' : 'Yes, Reset'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    {isHi ? 'रद्द करें' : 'Cancel'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-9 space-y-9 sm:space-y-11">
            {/* 1. Rich Illustrated Deep-Indigo-to-Royal-Blue Hero Section */}
            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1E1B4B] via-[#272D8F] to-[#1D4ED8] text-white p-6 sm:p-10 shadow-hero-soft border border-indigo-400/30">
              {/* Subtle Geometric Math Pattern Backdrop */}
              <div className="absolute inset-0 hero-math-grid opacity-70 pointer-events-none" aria-hidden="true" />
              <div
                className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-24 right-1/3 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left Column: Inspiring EdTech Copy & Tactile 3D CTAs */}
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-3">
                    <MascotLogo className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 drop-shadow-md" />
                    <div>
                      <p className="text-xs font-extrabold text-amber-300 tracking-wide">
                        {isHi ? 'कक्षा 1 से 5 तक · हमेशा 100% निःशुल्क' : 'Designed for Classes 1 to 5 · 100% Free'}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-sky-200">
                        {t.subtitle}
                      </p>
                    </div>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-bold tracking-tight text-white text-balance leading-[1.08]">
                    {isHi ? 'मैथ्स मास्टर किड्स' : 'Maths Master Kids'}
                  </h1>

                  <p className="text-sm sm:text-base text-indigo-100/95 max-w-xl leading-relaxed">
                    {t.heroDesc}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={startDailyPractice}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-orange-500 border-b-[5px] border-orange-700 text-slate-950 text-sm sm:text-base font-extrabold shadow-[0_10px_28px_rgba(245,158,11,0.45)] hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      {t.heroCta}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToTab('games')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/22 backdrop-blur-sm border border-white/30 border-b-[5px] border-b-indigo-950/60 text-white text-sm sm:text-base font-bold active:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      {isHi ? '6 मज़ेदार खेल खेलें' : 'Play 6 Fun Games'}
                    </button>
                  </div>

                  {/* Clean Unboxed Proof Highlights */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2 text-xs font-semibold text-indigo-100/90">
                    <span>{isHi ? '6 इंटरैक्टिव गेम्स' : '6 Interactive Games'}</span>
                    <span aria-hidden="true" className="text-indigo-300">·</span>
                    <span>{isHi ? '40 प्रिंटेबल A4 PDFs' : '40 Printable A4 PDFs'}</span>
                    <span aria-hidden="true" className="text-indigo-300">·</span>
                    <span>{isHi ? 'बिना लॉगिन · सुरक्षित' : 'No Login · Kid Safe'}</span>
                  </div>
                </div>

                {/* Right Column: Large Owl/Robot Math Mascot with Trophy + Floating 3D Badges + Live Mini Challenge */}
                <div className="lg:col-span-6">
                  <HeroShowcase
                    classNumber={selectedClass}
                    lang={lang}
                    onRecordAnswer={recordMiniGameAnswer}
                    onStartDailyQuiz={startDailyPractice}
                  />
                </div>
              </div>
            </section>

            {/* 2. Duolingo-Style Gamification & Visual XP Progress Bar Strip */}
            <section
              aria-label={isHi ? 'प्रगति और एक्सपी बार' : 'Gamification and XP Progress Bar'}
              className="bg-white border border-indigo-100 rounded-[2rem] p-5 sm:p-6 shadow-card-soft space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Stars Earned */}
                <motion.button
                  key={`stars-${progress.totalStars}`}
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  type="button"
                  onClick={() => navigateToTab('progress')}
                  className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/90 border-b-4 border-b-amber-300 rounded-2xl px-4 py-3.5 flex items-center gap-3.5 text-left hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 border-b-[3px] border-orange-700 flex items-center justify-center shrink-0 shadow-sm">
                    <Star className="w-6 h-6 text-white fill-white" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-amber-800/80">
                      {isHi ? 'कुल सितारे' : 'Stars Earned'}
                    </span>
                    <span className="font-math text-2xl font-extrabold text-slate-900">
                      {progress.totalStars}
                    </span>
                  </div>
                </motion.button>

                {/* Daily Streak */}
                <button
                  type="button"
                  onClick={() => navigateToTab('progress')}
                  className="bg-gradient-to-br from-rose-50 to-orange-50/70 border border-orange-200/90 border-b-4 border-b-orange-300 rounded-2xl px-4 py-3.5 flex items-center gap-3.5 text-left hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 border-b-[3px] border-rose-700 flex items-center justify-center shrink-0 shadow-sm">
                    <Flame className="w-6 h-6 text-white fill-amber-200" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-orange-800/80">
                      {isHi ? 'दैनिक स्ट्रीक' : 'Daily Streak'}
                    </span>
                    <span className="font-math text-2xl font-extrabold text-slate-900">
                      {progress.dailyStreak}{' '}
                      <span className="text-sm font-bold text-slate-600">
                        {isHi ? 'दिन' : progress.dailyStreak === 1 ? 'day' : 'days'}
                      </span>
                    </span>
                  </div>
                </button>

                {/* Current Rank Badge */}
                <button
                  type="button"
                  onClick={() => navigateToTab('progress')}
                  className="bg-gradient-to-br from-indigo-50 to-purple-50/70 border border-indigo-200/90 border-b-4 border-b-indigo-300 rounded-2xl px-4 py-3.5 flex items-center gap-3.5 text-left hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border-b-[3px] border-purple-800 flex items-center justify-center shrink-0 shadow-sm">
                    <Trophy className="w-6 h-6 text-amber-300" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-indigo-800/80">
                      {isHi ? 'वर्तमान रैंक' : 'Current Rank'}
                    </span>
                    <p className={`text-lg font-bold truncate ${rank.colorClass}`}>
                      {isHi ? rank.titleHi : rank.titleEn}
                    </p>
                  </div>
                </button>
              </div>

              {/* Duolingo-Style Visual XP Level Progress Bar */}
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl px-4 py-3.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold">
                  <span className="inline-flex items-center gap-1.5 text-slate-800">
                    <Zap className="w-4 h-4 text-emerald-500 fill-emerald-400 shrink-0" />
                    <span className="font-math text-emerald-700">{currentXp} XP</span>
                    <span className="text-slate-400">·</span>
                    <span>{isHi ? rank.titleHi : rank.titleEn}</span>
                  </span>
                  <span className="font-math text-xs sm:text-sm font-extrabold text-indigo-700">
                    {nextRankXp !== null && nextRankTitle
                      ? isHi
                        ? `${currentXp} / ${nextRankXp} XP → ${nextRankTitle}`
                        : `${currentXp} / ${nextRankXp} XP to ${nextRankTitle}`
                      : isHi
                        ? '1000+ XP · सर्वोच्च चैंपियन रैंक!'
                        : '1000+ XP · Top Champion Rank Unlocked!'}
                  </span>
                </div>

                <div className="h-4 w-full bg-slate-200/90 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgressPercent}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="relative h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-500 overflow-hidden"
                  >
                    <div
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent animate-xp-shine"
                      aria-hidden="true"
                    />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* 3. Soft-Tinted Class Selection & Difficulty Controls */}
            <section className="bg-gradient-to-br from-sky-50/90 via-white to-indigo-50/75 border border-sky-200/80 rounded-[2rem] p-5 sm:p-7 space-y-6 shadow-card-soft">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Class 1-5 */}
                <div className="lg:col-span-7 space-y-3">
                  <label className="block text-base font-bold text-slate-900 font-display">{t.selectClass}</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {CLASS_LEVELS.map((cls) => {
                      const active = cls.number === selectedClass;
                      return (
                        <button
                          key={cls.number}
                          type="button"
                          onClick={() => setSelectedClass(cls.number)}
                          className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer active:translate-y-[2px] ${
                            active
                              ? 'bg-gradient-to-b from-blue-500 to-indigo-600 border-indigo-600 border-b-[5px] border-b-indigo-900 text-white shadow-md'
                              : 'bg-white border-slate-200 border-b-4 border-b-slate-300 text-slate-800 hover:border-blue-300 hover:bg-blue-50/40'
                          }`}
                        >
                          <span className="block text-xs sm:text-sm font-extrabold whitespace-nowrap">
                            {isHi ? cls.labelHi : cls.label}
                          </span>
                          <span
                            className={`block text-[11px] mt-0.5 ${
                              active ? 'text-blue-100' : 'text-slate-500'
                            }`}
                          >
                            {isHi ? cls.agesHi : cls.agesEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Easy / Medium / Hard */}
                <div className="lg:col-span-5 space-y-3">
                  <label className="block text-base font-bold text-slate-900 font-display">{t.selectDiff}</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {DIFFICULTIES.map((diff) => {
                      const active = diff.id === selectedDifficulty;
                      return (
                        <button
                          key={diff.id}
                          type="button"
                          onClick={() => setSelectedDifficulty(diff.id)}
                          className={`py-3 px-2.5 rounded-2xl border text-center transition-all cursor-pointer whitespace-nowrap active:translate-y-[2px] ${
                            active
                              ? 'bg-gradient-to-b from-emerald-500 to-teal-600 border-teal-600 border-b-[5px] border-b-teal-900 text-white shadow-md'
                              : 'bg-white border-slate-200 border-b-4 border-b-slate-300 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40'
                          }`}
                        >
                          <span className="block text-xs sm:text-sm font-extrabold">
                            {isHi ? diff.labelHi : diff.labelEn}
                          </span>
                          <span
                            className={`block text-[11px] font-medium ${
                              active ? 'text-emerald-100' : 'text-slate-500'
                            }`}
                          >
                            {isHi ? diff.subHi : diff.subEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Soft-Tinted Basic Math Operations Section with High-Contrast 3D Cards */}
            <section className="bg-gradient-to-br from-emerald-50/75 via-white to-teal-50/65 border border-emerald-200/80 rounded-[2rem] p-6 sm:p-8 shadow-card-soft space-y-5">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-emerald-700">
                    {isHi ? 'मूलभूत गणित अभ्यास' : 'Core Skill Practice'}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t.chooseGame}</h2>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-emerald-800/80">
                  {isHi ? `कक्षा ${selectedClass}` : `Class ${selectedClass}`} ·{' '}
                  {isHi
                    ? selectedDifficulty === 'EASY'
                      ? 'आसान'
                      : selectedDifficulty === 'MEDIUM'
                        ? 'मध्यम'
                        : 'कठिन'
                    : selectedDifficulty.charAt(0) + selectedDifficulty.slice(1).toLowerCase()}{' '}
                  · {t.perQuizNote}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {OPERATIONS.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => startOperationQuiz(op.id)}
                    style={{ borderBottomColor: op.borderBottomColor }}
                    className={`group relative overflow-hidden rounded-3xl p-6 text-left text-white border-b-[6px] ${op.gradientClass} shadow-[0_14px_26px_-8px_rgba(15,23,42,0.26)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_20px_34px_-8px_rgba(15,23,42,0.32)] active:translate-y-[3px] cursor-pointer flex flex-col justify-between min-h-[212px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900`}
                  >
                    <div
                      className="pointer-events-none absolute -right-7 -bottom-7 w-24 h-24 rounded-full bg-white/12"
                      aria-hidden="true"
                    />
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-white/22 backdrop-blur-xs border border-white/30 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3 shadow-inner">
                        <OperationIllustration operation={op.id} />
                      </div>
                      <span className="font-math text-2xl font-extrabold text-white/95 bg-black/15 w-9 h-9 rounded-xl flex items-center justify-center">
                        {op.symbol}
                      </span>
                    </div>

                    <div className="relative z-10 space-y-1 pt-5">
                      <h3 className="text-2xl font-bold tracking-tight">
                        {isHi ? op.titleHi : op.titleEn}
                      </h3>
                      <p className="text-sm font-medium text-white/95 leading-snug">
                        {isHi ? op.taglineHi : op.taglineEn}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 5. Math Games Arcade Section (6 Interactive Mini-Games) */}
            <MathGamesArcadeSection
              lang={lang}
              selectedClass={selectedClass}
              onLaunchGame={launchMiniGame}
            />

            {/* 6. Printable A4 PDF Worksheets Showcase Banner */}
            <section className="bg-gradient-to-br from-cyan-50/85 via-white to-sky-50/80 border border-sky-200/85 rounded-[2rem] p-6 sm:p-8 shadow-card-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 border-b-4 border-blue-900 text-white flex items-center justify-center shrink-0 shadow-md">
                  <FileText className="w-7 h-7" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-sky-700">
                    {isHi ? 'स्कूल और होमवर्क के लिए 40 निःशुल्क A4 PDF' : '40 Free School-Ready A4 PDF Sheets'}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {isHi ? 'प्रिंटेबल गणित वर्कशीट (PDF)' : 'Printable Maths Worksheets (PDF)'}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {isHi
                      ? 'कक्षा 1 से 5 तक हर विषय (+, −, ×, ÷) की 2-2 अलग वर्कशीट — बिना उत्तर के 15 प्रश्न, एक क्लिक में A4 PDF डाउनलोड या प्रिंट करें।'
                      : '2 distinct worksheets per subject (+, −, ×, ÷) for Classes 1 to 5 — 15 blank practice problems per sheet, ready for 1-click A4 PDF download or printing.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateToTab('worksheets')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-b from-sky-500 to-blue-600 border-b-[5px] border-blue-800 text-white text-sm sm:text-base font-extrabold shadow-md hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <span>{isHi ? 'सभी 40 PDF वर्कशीट देखें' : 'Browse 40 PDF Worksheets'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </section>

            {/* 7. Daily Practice Section */}
            <section
              id="daily-practice"
              className="bg-gradient-to-r from-indigo-50/85 via-white to-blue-50/85 border border-indigo-200/80 rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-card-soft"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                  <span className="inline-flex items-center gap-1.5 text-indigo-700">
                    <Calendar className="w-4 h-4" />
                    {t.dailyBadge}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1 text-amber-700">
                    <Flame className="w-4 h-4" />
                    {isHi
                      ? `${progress.dailyStreak} दिन की स्ट्रीक`
                      : `${progress.dailyStreak} day streak`}
                  </span>
                  {dailyCompletedToday && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        {isHi ? 'आज पूरा हुआ' : 'Completed Today'}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-slate-900">{t.dailyTitle}</h2>
                <p className="text-sm sm:text-base text-slate-600">{t.dailyDesc}</p>
              </div>

              <button
                type="button"
                onClick={startDailyPractice}
                className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-extrabold text-white border-b-[5px] transition-all active:translate-y-[2px] cursor-pointer shrink-0 whitespace-nowrap shadow-md ${
                  dailyCompletedToday
                    ? 'bg-emerald-600 border-emerald-800 hover:bg-emerald-700'
                    : 'bg-gradient-to-b from-blue-500 to-indigo-600 border-indigo-900 hover:brightness-105'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                {dailyCompletedToday ? t.replayDaily : t.startDaily}
              </button>
            </section>

            {/* 8. Trust & Parent Highlights Strip */}
            <TrustHighlightsStrip
              lang={lang}
              onOpenWorksheets={() => navigateToTab('worksheets')}
              onToggleLang={() => setLang((prev) => (prev === 'en' ? 'hi' : 'en'))}
            />

            {/* Quick Local Progress Strip & Native Android Source Note */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              <div className="md:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 flex items-center justify-between gap-6 shadow-card-soft">
                <div className="grid grid-cols-3 gap-6 w-full text-center">
                  <div>
                    <span className="block text-xs font-medium text-slate-500">
                      {isHi ? 'क्विज़' : 'Quizzes'}
                    </span>
                    <span className="font-math text-2xl font-extrabold text-slate-900">
                      {progress.totalQuizzesCompleted}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-500">
                      {isHi ? 'सही उत्तर' : 'Correct'}
                    </span>
                    <span className="font-math text-2xl font-extrabold text-emerald-600">
                      {progress.totalCorrectAnswers}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-medium text-slate-500">
                      {isHi ? 'सटीकता' : 'Accuracy'}
                    </span>
                    <span className="font-math text-2xl font-extrabold text-blue-600">
                      {overallAccuracy}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 flex items-start gap-3.5 shadow-card-soft">
                <Smartphone className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm text-slate-900">
                    {isHi
                      ? 'नेटिव Android (Kotlin & Compose) प्रोजेक्ट शामिल'
                      : 'Native Kotlin & Jetpack Compose Project Included'}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isHi ? (
                      <>
                        ऑफ़लाइन Android Studio प्रोजेक्ट <code className="font-math bg-slate-100 px-1 rounded">android/</code> फ़ोल्डर में SharedPreferences और JUnit टेस्ट सहित उपलब्ध है।
                      </>
                    ) : (
                      <>
                        Complete offline Android Studio project is included in the{' '}
                        <code className="font-math bg-slate-100 px-1 rounded">android/</code> folder with SharedPreferences storage and JUnit tests.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </section>

            {/* Parent's Guide & Mental Math Tips for Classes 1 to 5 */}
            <ParentsGuideSection lang={lang} />

            {/* Blog & Maths Tips Section (above Footer) */}
            <BlogSection
              lang={lang}
              activeArticleId={activeBlogArticleId}
              onSelectArticle={setActiveBlogArticleId}
              onChangeLang={setLang}
              onStartDailyQuiz={startDailyPractice}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200/80 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 space-y-2">
              <div className="inline-flex items-center gap-2">
                <MascotLogo className="w-7 h-7 shrink-0" />
                <p className="font-display text-lg font-extrabold text-slate-900">
                  Maths Master Kids
                </p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                {isHi
                  ? 'कक्षा 1 से 5 के बच्चों के लिए मज़ेदार मानसिक गणित अभ्यास। बिना लॉगिन और बिना किसी व्यक्तिगत डेटा संग्रह के सुरक्षित ऑफ़लाइन शिक्षा।'
                  : 'Fun, interactive mental maths practice for Class 1 to Class 5 students. Built for safe offline-friendly learning with zero login or personal data collection.'}
              </p>
              <p className="text-xs text-slate-500">
                Support:{' '}
                <a
                  href="mailto:support@mathsmasterkids.in"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  support@mathsmasterkids.in
                </a>
              </p>
            </div>

            <div className="md:col-span-3 space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isHi ? 'एक्सप्लोर करें' : 'Explore'}
              </p>
              <div className="flex flex-col items-start gap-2 text-xs font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => navigateToTab('home')}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  {isHi ? 'होम' : 'Home'}
                </button>
                <button
                  type="button"
                  onClick={() => navigateToTab('games')}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  {isHi ? 'मज़ेदार गणित खेल' : 'Fun Math Games'}
                </button>
                <button
                  type="button"
                  onClick={() => navigateToTab('worksheets')}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  {isHi ? 'प्रिंटेबल वर्कशीट (PDF)' : 'Printable Worksheets (PDF)'}
                </button>
                <button
                  type="button"
                  onClick={navigateToDailySection}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  {isHi ? 'दैनिक अभ्यास' : 'Daily Practice'}
                </button>
                <button
                  type="button"
                  onClick={() => navigateToTab('progress')}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  {isHi ? 'मेरी प्रगति' : 'My Progress'}
                </button>
                <button
                  type="button"
                  onClick={() => navigateToTab('lab')}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  {isHi ? 'विज़ुअल लैब' : 'Visual Lab'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveQuiz(null);
                    setActiveTab('home');
                    setTimeout(() => {
                      document.getElementById('parents-guide')?.scrollIntoView({ behavior: 'smooth' });
                    }, 40);
                  }}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  {isHi ? 'अभिभावक गाइड और टिप्स' : "Parent's Guide & Tips"}
                </button>
                <button
                  type="button"
                  onClick={navigateToBlogSection}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  {isHi ? 'ब्लॉग और गणित टिप्स' : 'Blog & Maths Tips'}
                </button>
              </div>
            </div>

            <div className="md:col-span-4 space-y-2.5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Information &amp; Policies
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => openFooterDoc('about')}
                  className="text-left hover:text-blue-600 cursor-pointer"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => openFooterDoc('privacy')}
                  className="text-left hover:text-blue-600 cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => openFooterDoc('terms')}
                  className="text-left hover:text-blue-600 cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
                <button
                  type="button"
                  onClick={() => openFooterDoc('contact')}
                  className="text-left hover:text-blue-600 cursor-pointer"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} Maths Master Kids · Classes 1 to 5</span>
            <span>COPPA-Aware · Local Device Progress · Educational Use</span>
          </div>
        </div>
      </footer>

      <LegalFooterModals activeDoc={activeFooterDoc} onSelectDoc={setActiveFooterDoc} />
    </div>

    <div className="hidden print:block bg-white text-slate-900">
      <PrintableA4Sheet worksheet={printTargetWorksheet} lang={lang} />
    </div>
    </>
  );
}
