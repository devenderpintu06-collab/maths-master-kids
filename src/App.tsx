import { useEffect, useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Flame,
  Play,
  RotateCcw,
  Smartphone,
  Sparkles,
  Star,
  Trophy,
  Volume2,
  VolumeX,
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
  const [activeBlogArticleId, setActiveBlogArticleId] = useState<string | null>(null);

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

  const navigateToBlogSection = () => {
    soundFx.playClick();
    setActiveQuiz(null);
    setActiveTab('home');
    setTimeout(() => {
      document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
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
  const isHi = lang === 'hi';

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FC] text-slate-900">
      {/* Top Bar Contract: 3 Zones */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: Custom SVG Mascot Logo + Brand Title */}
          <button
            type="button"
            onClick={() => navigateToTab('home')}
            className="inline-flex items-center gap-2 sm:gap-2.5 font-display text-[15px] sm:text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer group"
          >
            <MascotLogo className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-transform duration-200 group-hover:scale-105" />
            <span>Maths Master Kids</span>
          </button>

          {/* Zone 2: Clean single-line nav links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => navigateToTab('home')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'home' && !activeQuiz
                  ? 'border-blue-600 text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {isHi ? 'होम' : 'Home'}
            </button>
            <button
              type="button"
              onClick={navigateToDailySection}
              className="py-1 border-b-2 border-transparent hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isHi ? 'दैनिक अभ्यास' : 'Daily Practice'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('progress')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'progress' && !activeQuiz
                  ? 'border-blue-600 text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {isHi ? 'मेरी प्रगति' : 'My Progress'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('lab')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'lab' && !activeQuiz
                  ? 'border-blue-600 text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {isHi ? 'विज़ुअल लैब' : 'Visual Lab'}
            </button>
            <button
              type="button"
              onClick={navigateToBlogSection}
              className="py-1 border-b-2 border-transparent hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isHi ? 'ब्लॉग' : 'Blog'}
            </button>
          </nav>

          {/* Zone 3: Language Switcher + Star Count + Sound Toggle + Primary Action */}
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
                  lang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
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
                  lang === 'hi' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिं
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigateToTab('progress')}
              aria-label={`Total stars earned: ${progress.totalStars}. View progress`}
              className="min-h-[36px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200 hover:border-amber-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600"
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
              <span className="hidden lg:inline">
                {soundEnabled ? (isHi ? 'ध्वनि चालू' : 'Sound On') : isHi ? 'बंद' : 'Muted'}
              </span>
            </button>

            <button
              type="button"
              onClick={startDailyPractice}
              className="hidden sm:inline-flex min-h-[40px] px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 border-b-[3px] border-blue-800 rounded-xl hover:bg-blue-700 active:translate-y-[1px] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {t.heroCta}
            </button>
          </div>
        </div>

        {/* Mobile Nav Row */}
        {!activeQuiz && (
          <div className="md:hidden border-t border-slate-200/80 px-1.5 py-1.5 flex items-center justify-around text-[11px] sm:text-xs font-semibold text-slate-600 bg-white">
            <button
              type="button"
              onClick={() => navigateToTab('home')}
              className={`px-2 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
                activeTab === 'home' ? 'text-blue-700 bg-blue-50' : ''
              }`}
            >
              {isHi ? 'होम' : 'Home'}
            </button>
            <button
              type="button"
              onClick={navigateToDailySection}
              className="px-2 py-1.5 rounded-lg whitespace-nowrap cursor-pointer"
            >
              {isHi ? 'दैनिक क्विज़' : 'Daily Quiz'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('progress')}
              className={`px-2 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
                activeTab === 'progress' ? 'text-blue-700 bg-blue-50' : ''
              }`}
            >
              {isHi ? 'प्रगति' : 'Progress'}
            </button>
            <button
              type="button"
              onClick={() => navigateToTab('lab')}
              className={`px-2 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
                activeTab === 'lab' ? 'text-blue-700 bg-blue-50' : ''
              }`}
            >
              {isHi ? 'विज़ुअल लैब' : 'Visual Lab'}
            </button>
            <button
              type="button"
              onClick={navigateToBlogSection}
              className="px-2 py-1.5 rounded-lg whitespace-nowrap cursor-pointer"
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
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-7 sm:py-10 space-y-9 sm:space-y-11">
            {/* Hero Banner: Gradient backdrop, floating math symbols, Mascot, Tagline & Prominent CTA */}
            <section className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-br from-sky-50 via-white to-amber-50/90 p-6 sm:p-10 shadow-hero-soft">
              {/* Subtle Floating Math Symbols */}
              <div className="pointer-events-none select-none" aria-hidden="true">
                <span className="hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-100/80 text-emerald-700 font-math text-2xl font-extrabold absolute top-6 right-12 animate-float-symbol">
                  +
                </span>
                <span className="hidden sm:flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-100/80 text-blue-700 font-math text-2xl font-extrabold absolute bottom-8 right-24 animate-float-symbol-alt">
                  −
                </span>
                <span className="hidden md:flex items-center justify-center w-10 h-10 rounded-2xl bg-amber-100/80 text-amber-700 font-math text-2xl font-extrabold absolute top-10 right-44 animate-float-symbol-alt">
                  ×
                </span>
                <span className="hidden md:flex items-center justify-center w-9 h-9 rounded-2xl bg-purple-100/80 text-purple-700 font-math text-xl font-extrabold absolute bottom-7 right-6 animate-float-symbol">
                  ÷
                </span>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-3">
                    <MascotLogo className="w-12 h-12 sm:w-14 sm:h-14 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-blue-700 tracking-wide">
                        {isHi ? 'कक्षा 1 से 5 तक के लिए' : 'Designed for Classes 1 to 5'}
                      </p>
                      <p className="text-lg sm:text-xl font-extrabold text-blue-700">
                        {t.subtitle}
                      </p>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 text-balance leading-[1.12]">
                    {isHi ? 'मैथ्स मास्टर किड्स' : 'Maths Master Kids'}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                    {t.heroDesc}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={startDailyPractice}
                      className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-b from-blue-500 to-blue-600 border-b-4 border-blue-800 text-white text-sm sm:text-base font-extrabold shadow-md hover:brightness-105 active:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      {t.heroCta}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToTab('lab')}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-slate-200 border-b-4 border-b-slate-300 text-slate-800 text-sm sm:text-base font-bold hover:bg-slate-50 active:translate-y-[2px] transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      {t.heroExploreLab}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sleek Gamification HUD: Stars Earned, Daily Streak & Current Rank Badge */}
              <div className="relative z-10 mt-7 pt-5 border-t border-slate-200/70">
                <button
                  type="button"
                  onClick={() => navigateToTab('progress')}
                  aria-label={isHi ? 'प्रगति और रैंक देखें' : 'View progress, stars, streak and rank'}
                  className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 text-left group cursor-pointer"
                >
                  {/* Stars Earned */}
                  <div className="bg-white/95 border border-amber-200/90 rounded-2xl px-4 py-3.5 flex items-center gap-3.5 shadow-sm group-hover:border-amber-300 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Star className="w-6 h-6 text-amber-500 fill-amber-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-semibold text-slate-500">
                        {isHi ? 'कुल सितारे' : 'Stars Earned'}
                      </span>
                      <span className="font-math text-xl font-extrabold text-slate-900">
                        {progress.totalStars}
                      </span>
                    </div>
                  </div>

                  {/* Daily Streak */}
                  <div className="bg-white/95 border border-orange-200/90 rounded-2xl px-4 py-3.5 flex items-center gap-3.5 shadow-sm group-hover:border-orange-300 transition-colors">
                    <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                      <Flame className="w-6 h-6 text-orange-500 fill-orange-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-semibold text-slate-500">
                        {isHi ? 'दैनिक स्ट्रीक' : 'Daily Streak'}
                      </span>
                      <span className="font-math text-xl font-extrabold text-slate-900">
                        {progress.dailyStreak}{' '}
                        <span className="text-sm font-bold text-slate-600">
                          {isHi ? 'दिन' : progress.dailyStreak === 1 ? 'day' : 'days'}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Current Rank Badge */}
                  <div
                    className={`bg-white/95 border ${rank.borderClass} rounded-2xl px-4 py-3.5 flex items-center gap-3.5 shadow-sm transition-colors`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${rank.bgClass} flex items-center justify-center shrink-0`}>
                      <Trophy className={`w-6 h-6 ${rank.colorClass}`} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-slate-500">
                        {isHi ? 'वर्तमान रैंक' : 'Current Rank'}
                      </span>
                      <p className={`text-base sm:text-lg font-extrabold truncate ${rank.colorClass}`}>
                        {isHi ? rank.titleHi : rank.titleEn}
                      </p>
                      {rank.nextThreshold !== null && (
                        <p className="text-[11px] text-slate-500">
                          {isHi
                            ? `अगली रैंक के लिए ${Math.max(0, rank.nextThreshold - progress.totalStars)} सितारे और`
                            : `${Math.max(0, rank.nextThreshold - progress.totalStars)} stars to next rank`}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </section>

            {/* Class Selection & Difficulty Controls */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 space-y-6 shadow-card-soft">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Class 1-5 */}
                <div className="lg:col-span-7 space-y-3">
                  <label className="block text-sm font-extrabold text-slate-800">{t.selectClass}</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {CLASS_LEVELS.map((cls) => {
                      const active = cls.number === selectedClass;
                      return (
                        <button
                          key={cls.number}
                          type="button"
                          onClick={() => setSelectedClass(cls.number)}
                          className={`py-3 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                            active
                              ? 'bg-blue-600 border-blue-600 border-b-4 border-b-blue-800 text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 border-b-[3px] border-b-slate-300 text-slate-800 hover:border-blue-300 hover:bg-blue-50/40'
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
                  <label className="block text-sm font-extrabold text-slate-800">{t.selectDiff}</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {DIFFICULTIES.map((diff) => {
                      const active = diff.id === selectedDifficulty;
                      return (
                        <button
                          key={diff.id}
                          type="button"
                          onClick={() => setSelectedDifficulty(diff.id)}
                          className={`py-2.5 px-2.5 rounded-2xl border text-center transition-all cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-emerald-600 border-emerald-600 border-b-4 border-b-emerald-800 text-white shadow-sm'
                              : 'bg-slate-50 border-slate-200 border-b-[3px] border-b-slate-300 text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40'
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

            {/* Four 3D Interactive Math Operation Game Cards */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t.chooseGame}</h2>
                <span className="text-xs sm:text-sm font-semibold text-slate-500">
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
                    className={`group relative overflow-hidden rounded-3xl p-6 text-left text-white border-b-[6px] ${op.gradientClass} shadow-[0_12px_24px_-8px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_18px_32px_-8px_rgba(15,23,42,0.28)] active:translate-y-[3px] cursor-pointer flex flex-col justify-between min-h-[200px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/25 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3">
                        <OperationIllustration operation={op.id} />
                      </div>
                      <span className="font-math text-2xl font-extrabold text-white/85 bg-white/15 w-9 h-9 rounded-xl flex items-center justify-center">
                        {op.symbol}
                      </span>
                    </div>

                    <div className="space-y-1 pt-5">
                      <h3 className="text-2xl font-extrabold tracking-tight">
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

            {/* Daily Practice Section */}
            <section
              id="daily-practice"
              className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-card-soft"
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

                <h2 className="text-2xl font-extrabold text-slate-900">{t.dailyTitle}</h2>
                <p className="text-sm sm:text-base text-slate-600">{t.dailyDesc}</p>
              </div>

              <button
                type="button"
                onClick={startDailyPractice}
                className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-extrabold text-white border-b-4 transition-all active:translate-y-[2px] cursor-pointer shrink-0 whitespace-nowrap shadow-sm ${
                  dailyCompletedToday
                    ? 'bg-emerald-600 border-emerald-800 hover:bg-emerald-700'
                    : 'bg-blue-600 border-blue-800 hover:bg-blue-700'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                {dailyCompletedToday ? t.replayDaily : t.startDaily}
              </button>
            </section>

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
  );
}
