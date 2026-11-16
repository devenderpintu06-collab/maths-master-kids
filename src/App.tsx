import { useEffect, useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Flame,
  Play,
  RotateCcw,
  Smartphone,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  CLASS_LEVELS,
  DIFFICULTIES,
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
import { LegalFooterModals, type FooterDocType } from './components/LegalFooterModals';
import { soundFx } from './utils/sound';

type AppTab = 'home' | 'progress' | 'lab';

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
  const [soundEnabled, setSoundEnabled] = useState<boolean>(loadSoundPreference);
  const [lang, setLang] = useState<AppLanguage>(loadLangPreference);
  const [confirmReset, setConfirmReset] = useState(false);
  const [activeFooterDoc, setActiveFooterDoc] = useState<FooterDocType | null>(null);

  const openFooterDoc = (doc: FooterDocType) => {
    soundFx.playClick();
    setActiveFooterDoc(doc);
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
    setActiveQuiz({
      classNumber: selectedClass,
      difficulty: selectedDifficulty,
      operation: null,
      isDailyPractice: true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTab = (tab: AppTab) => {
    soundFx.playClick();
    setActiveQuiz(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDailySection = () => {
    soundFx.playClick();
    setActiveQuiz(null);
    setActiveTab('home');
    setTimeout(() => {
      document.getElementById('daily-practice')?.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900">
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-2.5 sm:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-6">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => navigateToTab('home')}
            className="font-display text-[15px] sm:text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Maths Master Kids
          </button>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => navigateToTab('home')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'home' && !activeQuiz
                  ? 'border-blue-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={navigateToDailySection}
              className="py-1 border-b-2 border-transparent hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Daily Practice
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('progress')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'progress' && !activeQuiz
                  ? 'border-blue-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              My Progress
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('lab')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'lab' && !activeQuiz
                  ? 'border-blue-600 text-slate-900 font-semibold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Visual Lab
            </button>
          </nav>

          {/* Zone 3: Language Switcher + Global Star Count + Sound Toggle + Primary Action */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-xl shrink-0" role="group" aria-label="Language selector">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setLang('en');
                }}
                aria-pressed={lang === 'en'}
                className={`px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
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
                className={`px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  lang === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिं
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigateToTab('progress')}
              aria-label={`Total stars earned: ${progress.totalStars}. View progress`}
              className="min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" aria-hidden="true" />
              <span className="font-math text-sm font-extrabold text-slate-900">
                {progress.totalStars}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
              aria-pressed={!soundEnabled}
              title={soundEnabled ? 'Sound On (Click to mute)' : 'Sound Muted (Click to unmute)'}
              className={`min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl border inline-flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600 ${
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
              <span className="hidden lg:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={startDailyPractice}
              className="hidden sm:inline-flex min-h-[40px] px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Start Daily Quiz
            </button>
          </div>
        </div>

        {/* Mobile Nav Row */}
        {!activeQuiz && (
          <div className="md:hidden border-t border-slate-200/80 px-2 py-2 flex items-center justify-around text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => navigateToTab('home')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
                activeTab === 'home' ? 'text-blue-700 bg-blue-50' : ''
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={navigateToDailySection}
              className="px-2.5 py-1.5 rounded-md whitespace-nowrap cursor-pointer"
            >
              Daily Quiz
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('progress')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
                activeTab === 'progress' ? 'text-blue-700 bg-blue-50' : ''
              }`}
            >
              My Progress
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('lab')}
              className={`px-2.5 py-1.5 rounded-md whitespace-nowrap cursor-pointer ${
                activeTab === 'lab' ? 'text-blue-700 bg-blue-50' : ''
              }`}
            >
              Visual Lab
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
        ) : activeTab === 'lab' ? (
          <VisualLab />
        ) : activeTab === 'progress' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                  My Progress & Stars
                </h1>
                <p className="text-slate-600 text-base">
                  Saved locally on your device · 100% offline · No personal information collected.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
                <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
                <div>
                  <span className="block text-xs font-medium text-amber-800">Total Stars</span>
                  <span className="font-math text-2xl font-extrabold text-amber-950">
                    {progress.totalStars}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <span className="text-xs font-medium text-slate-500">Quizzes Completed</span>
                <p className="font-math text-3xl font-extrabold text-slate-900 mt-1">
                  {progress.totalQuizzesCompleted}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <span className="text-xs font-medium text-slate-500">Correct Answers</span>
                <p className="font-math text-3xl font-extrabold text-emerald-600 mt-1">
                  {progress.totalCorrectAnswers}
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <span className="text-xs font-medium text-slate-500">Overall Accuracy</span>
                <p className="font-math text-3xl font-extrabold text-blue-600 mt-1">
                  {overallAccuracy}%
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <span className="text-xs font-medium text-slate-500">Daily Streak</span>
                <p className="font-math text-3xl font-extrabold text-amber-600 mt-1">
                  {progress.dailyStreak} {progress.dailyStreak === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            {/* Per-Operation Breakdown */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Operation Mastery</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {OPERATIONS.map((op) => {
                  const st = progress.byOperation[op.id];
                  const acc = st.attempted > 0 ? Math.round((st.correct / st.attempted) * 100) : 0;
                  return (
                    <div
                      key={op.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl text-white font-math text-2xl font-extrabold flex items-center justify-center shrink-0"
                          style={{ backgroundColor: op.bgHex }}
                        >
                          {op.symbol}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">
                            {lang === 'hi' ? op.titleHi : op.titleEn}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {st.correct} / {st.attempted} correct · {acc}% accuracy
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => startOperationQuiz(op.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white cursor-pointer whitespace-nowrap"
                        style={{ backgroundColor: op.bgHex }}
                      >
                        Practice
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Quiz Scores History */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">Recent Quiz Scores</h2>
                <span className="text-xs text-slate-500">
                  {progress.recentQuizzes.length > 0
                    ? `Showing last ${progress.recentQuizzes.length} ${progress.recentQuizzes.length === 1 ? 'quiz' : 'quizzes'}`
                    : 'No quizzes completed yet'}
                </span>
              </div>

              {progress.recentQuizzes.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-sm text-slate-600">
                    Complete any 10-question quiz or Daily Practice to save your score, percentage, and stars here.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateToTab('home')}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    Start a Quiz
                  </button>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100">
                  {progress.recentQuizzes.map((entry) => {
                    const opInfo = entry.operation
                      ? OPERATIONS.find((o) => o.id === entry.operation)
                      : null;
                    const title = entry.isDailyPractice
                      ? 'Daily Practice Mix'
                      : opInfo
                        ? lang === 'hi'
                          ? opInfo.titleHi
                          : opInfo.titleEn
                        : 'Maths Quiz';
                    const diffLabel =
                      entry.difficulty.charAt(0) + entry.difficulty.slice(1).toLowerCase();
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
                              Class {entry.classNumber} · {diffLabel} · {dateStr}
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
              <h2 className="text-2xl font-bold text-slate-900">Achievements</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: 'First 10 Stars',
                    desc: 'Earn 10 stars from correct answers',
                    unlocked: progress.totalStars >= 10,
                  },
                  {
                    title: 'Quiz Explorer',
                    desc: 'Complete 3 full 10-question quizzes',
                    unlocked: progress.totalQuizzesCompleted >= 3,
                  },
                  {
                    title: 'Daily Champion',
                    desc: 'Finish at least 1 Daily Practice quiz',
                    unlocked: progress.dailyStreak >= 1,
                  },
                ].map((badge) => (
                  <div
                    key={badge.title}
                    className={`rounded-2xl border p-5 flex items-start gap-3 ${
                      badge.unlocked ? 'bg-amber-50/60 border-amber-300' : 'bg-slate-50 border-slate-200 opacity-75'
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
                        {badge.unlocked ? 'Unlocked!' : 'Keep practicing to unlock'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-xs text-slate-500">All scores stay offline on this device.</p>
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Progress
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-rose-700">Clear all stars?</span>
                  <button
                    type="button"
                    onClick={handleResetProgress}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-10">
            {/* Home Header: App Title, Subtitle & Daily Streak Summary */}
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-balance">
                  Maths Master Kids
                </h1>
                <p className="text-xl font-semibold text-blue-700">{t.subtitle}</p>
                <p className="text-sm sm:text-base text-slate-600 max-w-xl">{t.heroDesc}</p>
              </div>

              <div className="flex items-center gap-3 self-start md:self-center">
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab('progress');
                  }}
                  className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-amber-300 transition-colors cursor-pointer"
                >
                  <Star className="w-7 h-7 text-amber-500 fill-amber-400" aria-hidden="true" />
                  <div className="text-left">
                    <span className="block text-xs font-medium text-slate-500">Your Stars</span>
                    <span className="font-math text-xl font-extrabold text-slate-900">
                      {progress.totalStars}
                    </span>
                  </div>
                </button>
              </div>
            </section>

            {/* Class Selection & Difficulty Controls */}
            <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Class 1-5 */}
                <div className="lg:col-span-7 space-y-3">
                  <label className="block text-sm font-bold text-slate-800">{t.selectClass}</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {CLASS_LEVELS.map((cls) => {
                      const active = cls.number === selectedClass;
                      return (
                        <button
                          key={cls.number}
                          type="button"
                          onClick={() => setSelectedClass(cls.number)}
                          className={`py-3 px-2 rounded-xl border text-center transition-colors cursor-pointer ${
                            active
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-300'
                          }`}
                        >
                          <span className="block text-xs sm:text-sm font-extrabold whitespace-nowrap">
                            {cls.label}
                          </span>
                          <span
                            className={`block text-[11px] mt-0.5 ${
                              active ? 'text-blue-100' : 'text-slate-500'
                            }`}
                          >
                            {lang === 'hi' ? cls.agesHi : cls.agesEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Difficulty Easy / Medium / Hard with No Carry / With Carry / Big Numbers */}
                <div className="lg:col-span-5 space-y-3">
                  <label className="block text-sm font-bold text-slate-800">{t.selectDiff}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DIFFICULTIES.map((diff) => {
                      const active = diff.id === selectedDifficulty;
                      return (
                        <button
                          key={diff.id}
                          type="button"
                          onClick={() => setSelectedDifficulty(diff.id)}
                          className={`py-2.5 px-3 rounded-xl border text-center transition-colors cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-300'
                          }`}
                        >
                          <span className="block text-sm font-extrabold">
                            {lang === 'hi' ? diff.labelHi : diff.labelEn}
                          </span>
                          <span
                            className={`block text-[11px] font-medium ${
                              active ? 'text-emerald-100' : 'text-slate-500'
                            }`}
                          >
                            {lang === 'hi' ? diff.subHi : diff.subEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Four Large Colorful Operation Buttons */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900">{t.chooseGame}</h2>
                <span className="text-sm text-slate-500">
                  Class {selectedClass} · {selectedDifficulty.charAt(0) + selectedDifficulty.slice(1).toLowerCase()} · {t.perQuizNote}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {OPERATIONS.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => startOperationQuiz(op.id)}
                    style={{ backgroundColor: op.bgHex }}
                    className="group rounded-3xl p-6 text-left text-white transition-transform hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer flex flex-col justify-between min-h-[185px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center font-math text-4xl font-extrabold">
                      {op.symbol}
                    </div>

                    <div className="space-y-1 pt-4">
                      <h3 className="text-2xl font-extrabold tracking-tight">
                        {lang === 'hi' ? op.titleHi : op.titleEn}
                      </h3>
                      <p className="text-sm text-white/90">
                        {lang === 'hi' ? op.taglineHi : op.taglineEn}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Daily Practice Section */}
            <section
              id="daily-practice"
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                  <span className="inline-flex items-center gap-1.5 text-blue-700">
                    <Calendar className="w-4 h-4" />
                    {t.dailyBadge}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1 text-amber-700">
                    <Flame className="w-4 h-4" />
                    {progress.dailyStreak} day streak
                  </span>
                  {dailyCompletedToday && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed Today
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900">{t.dailyTitle}</h2>
                <p className="text-sm sm:text-base text-slate-600">{t.dailyDesc}</p>
              </div>

              <button
                type="button"
                onClick={startDailyPractice}
                className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-extrabold text-white transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                  dailyCompletedToday
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                {dailyCompletedToday ? t.replayDaily : t.startDaily}
              </button>
            </section>

            {/* Quick Local Progress Strip & Native Android Source Note */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between gap-6">
                <div className="grid grid-cols-3 gap-6 w-full text-center">
                  <div>
                    <span className="block text-xs text-slate-500">Quizzes</span>
                    <span className="font-math text-2xl font-extrabold text-slate-900">
                      {progress.totalQuizzesCompleted}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">Correct</span>
                    <span className="font-math text-2xl font-extrabold text-emerald-600">
                      {progress.totalCorrectAnswers}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500">Accuracy</span>
                    <span className="font-math text-2xl font-extrabold text-blue-600">
                      {overallAccuracy}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-3.5">
                <Smartphone className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm text-slate-900">
                    Native Kotlin & Jetpack Compose Project Included
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Complete offline Android Studio project is included in the <code className="font-math bg-slate-100 px-1 rounded">android/</code> folder with SharedPreferences storage and JUnit tests.
                  </p>
                </div>
              </div>
            </section>

            {/* Parent's Guide & Mental Math Tips for Classes 1 to 5 */}
            <ParentsGuideSection lang={lang} />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 space-y-2">
              <p className="font-display text-lg font-extrabold text-slate-900">
                Maths Master Kids
              </p>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                Fun, interactive mental maths practice for Class 1 to Class 5 students. Built for safe offline-friendly learning with zero login or personal data collection.
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
                Explore
              </p>
              <div className="flex flex-col items-start gap-2 text-xs font-medium text-slate-600">
                <button
                  type="button"
                  onClick={() => navigateToTab('home')}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={navigateToDailySection}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  Daily Practice
                </button>
                <button
                  type="button"
                  onClick={() => navigateToTab('progress')}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  My Progress
                </button>
                <button
                  type="button"
                  onClick={() => navigateToTab('lab')}
                  className="hover:text-slate-900 cursor-pointer"
                >
                  Visual Lab
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
                  Parent&apos;s Guide &amp; Tips
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
  );
}
