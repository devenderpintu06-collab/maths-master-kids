import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Home,
  Lightbulb,
  RotateCcw,
  Star,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import {
  generateTenQuestionQuiz,
  OPERATIONS,
  UI_TEXT,
  type AppLanguage,
  type MathOperation,
  type MathsQuestion,
  type QuizConfig,
  type QuizSummary,
} from '../data/mathsMaster';
import { soundFx } from '../utils/sound';

interface QuizModeProps {
  config: QuizConfig;
  lang: AppLanguage;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onExit: () => void;
  onQuizComplete: (
    summary: QuizSummary,
    perOpCounts: Record<MathOperation, { attempted: number; correct: number }>
  ) => void;
}

function VisualPictureHint({ question, lang }: { question: MathsQuestion; lang: AppLanguage }) {
  const { operandA, operandB, operation, hintEn, hintHi } = question;
  const hintText = lang === 'hi' ? hintHi : hintEn;

  return (
    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 text-left space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
        <span>{lang === 'hi' ? 'चित्र संकेत (Visual Hint)' : 'Visual Hint'}</span>
      </div>

      {operation === 'ADDITION' && operandA <= 20 && operandB <= 20 && (
        <div className="flex flex-wrap items-center gap-3 bg-white border border-amber-200/80 rounded-xl p-3">
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {Array.from({ length: operandA }).map((_, i) => (
              <span key={`a-${i}`} className="w-4 h-4 rounded bg-blue-500 inline-block" />
            ))}
          </div>
          <span className="font-math font-bold text-slate-600">+</span>
          <div className="flex flex-wrap gap-1 max-w-[220px]">
            {Array.from({ length: operandB }).map((_, i) => (
              <span key={`b-${i}`} className="w-4 h-4 rounded bg-amber-500 inline-block" />
            ))}
          </div>
        </div>
      )}

      {operation === 'SUBTRACTION' && operandA <= 24 && (
        <div className="flex flex-wrap gap-1.5 bg-white border border-amber-200/80 rounded-xl p-3">
          {Array.from({ length: operandA }).map((_, i) => {
            const removed = i >= operandA - operandB;
            return (
              <span
                key={i}
                className={`w-4 h-4 rounded inline-block border ${
                  removed
                    ? 'bg-rose-100 border-rose-300 opacity-50'
                    : 'bg-blue-500 border-blue-600/20'
                }`}
              />
            );
          })}
        </div>
      )}

      {operation === 'MULTIPLICATION' && operandA <= 10 && operandB <= 10 && (
        <div className="bg-white border border-amber-200/80 rounded-xl p-3 max-w-full overflow-x-auto">
          <div
            className="grid gap-1 w-fit"
            style={{ gridTemplateColumns: `repeat(${operandB}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: operandA * operandB }).map((_, i) => (
              <span key={i} className="w-4 h-4 rounded-full bg-amber-400 border border-amber-600/30" />
            ))}
          </div>
        </div>
      )}

      {operation === 'DIVISION' && operandB <= 8 && question.correctAnswer <= 12 && (
        <div className="flex flex-wrap gap-2 bg-white border border-amber-200/80 rounded-xl p-3">
          {Array.from({ length: operandB }).map((_, g) => (
            <div key={g} className="px-2 py-1 rounded-lg bg-purple-50 border border-purple-200 text-xs font-math font-bold text-purple-800">
              {lang === 'hi' ? `समूह ${g + 1}` : `Box ${g + 1}`}: ?
            </div>
          ))}
        </div>
      )}

      <p className="text-sm font-medium text-amber-950">{hintText}</p>
      {operation === 'MULTIPLICATION' && operandA <= 12 && operandB <= 12 && (
        <p className="font-math text-xs text-amber-800">
          {Array.from({ length: Math.min(operandB, 6) })
            .map(() => operandA)
            .join(' + ')}
          {operandB > 6 ? ' + ...' : ''} = ?
        </p>
      )}
      {((operation === 'ADDITION' && (operandA > 20 || operandB > 20)) ||
        (operation === 'SUBTRACTION' && operandA > 24)) && (
        <p className="text-xs text-amber-800">
          {lang === 'hi'
            ? 'सुझाव: पहले इकाई (Ones) के अंक हल करें, फिर दहाई (Tens)।'
            : 'Tip: Solve the Ones column first, then the Tens and Hundreds.'}
        </p>
      )}
    </div>
  );
}

export function QuizMode({
  config,
  lang,
  soundEnabled,
  onToggleSound,
  onExit,
  onQuizComplete,
}: QuizModeProps) {
  const t = UI_TEXT[lang];
  const [questions, setQuestions] = useState<MathsQuestion[]>(() => generateTenQuestionQuiz(config));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [starBurstKey, setStarBurstKey] = useState(0);
  const [finishedSummary, setFinishedSummary] = useState<QuizSummary | null>(null);
  const [perOpCounts, setPerOpCounts] = useState<Record<MathOperation, { attempted: number; correct: number }>>({
    ADDITION: { attempted: 0, correct: 0 },
    SUBTRACTION: { attempted: 0, correct: 0 },
    MULTIPLICATION: { attempted: 0, correct: 0 },
    DIVISION: { attempted: 0, correct: 0 },
  });

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === currentQuestion?.correctAnswer;

  const opMeta = config.operation
    ? OPERATIONS.find((o) => o.id === config.operation)
    : null;
  const quizTitle = config.isDailyPractice
    ? t.dailyBadge
    : opMeta
      ? lang === 'hi'
        ? opMeta.titleHi
        : opMeta.titleEn
      : 'Maths Quiz';

  const speakQuestion = useCallback(() => {
    if (!currentQuestion || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const opWord =
        currentQuestion.operation === 'ADDITION'
          ? lang === 'hi'
            ? 'जोड़'
            : 'plus'
          : currentQuestion.operation === 'SUBTRACTION'
            ? lang === 'hi'
              ? 'घटा'
              : 'minus'
            : currentQuestion.operation === 'MULTIPLICATION'
              ? lang === 'hi'
                ? 'गुणा'
                : 'times'
              : lang === 'hi'
                ? 'भाग'
                : 'divided by';
      const spoken =
        lang === 'hi'
          ? `${currentQuestion.operandA} ${opWord} ${currentQuestion.operandB} कितना होता है?`
          : `What is ${currentQuestion.operandA} ${opWord} ${currentQuestion.operandB}?`;
      const utterance = new SpeechSynthesisUtterance(spoken);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech synthesis is blocked
    }
  }, [currentQuestion, lang]);

  const handlePracticeAgain = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    soundFx.playClick();
    setQuestions(generateTenQuestionQuiz(config));
    setCurrentIndex(0);
    setSelectedOption(null);
    setCorrectCount(0);
    setIncorrectCount(0);
    setShowHint(false);
    setFinishedSummary(null);
    setPerOpCounts({
      ADDITION: { attempted: 0, correct: 0 },
      SUBTRACTION: { attempted: 0, correct: 0 },
      MULTIPLICATION: { attempted: 0, correct: 0 },
      DIVISION: { attempted: 0, correct: 0 },
    });
  }, [config]);

  const handleSelectOption = useCallback(
    (value: number) => {
      if (isAnswered || !currentQuestion) return;
      setSelectedOption(value);
      const right = value === currentQuestion.correctAnswer;

      if (right) {
        soundFx.playCorrect();
        setCorrectCount((c) => c + 1);
        setStarBurstKey((k) => k + 1);
      } else {
        soundFx.playTryAgain();
        setIncorrectCount((c) => c + 1);
      }

      setPerOpCounts((prev) => ({
        ...prev,
        [currentQuestion.operation]: {
          attempted: prev[currentQuestion.operation].attempted + 1,
          correct: prev[currentQuestion.operation].correct + (right ? 1 : 0),
        },
      }));
    },
    [currentQuestion, isAnswered]
  );

  const handleNext = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    soundFx.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      soundFx.playVictory();
      const percentage = Math.round((correctCount / questions.length) * 100);
      const summary: QuizSummary = {
        config,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        starsEarned: correctCount,
        percentage,
      };
      setFinishedSummary(summary);
      onQuizComplete(summary, perOpCounts);
    }
  }, [config, correctCount, currentIndex, incorrectCount, onQuizComplete, perOpCounts, questions.length]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (finishedSummary || !currentQuestion) return;
    const onKey = (e: KeyboardEvent) => {
      if (!isAnswered && e.key >= '1' && e.key <= '4') {
        const opt = currentQuestion.options[Number(e.key) - 1];
        if (opt !== undefined) handleSelectOption(opt);
      } else if (isAnswered && (e.key === 'Enter' || e.key === ' ')) {
        if (document.activeElement?.tagName === 'BUTTON') return;
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentQuestion, finishedSummary, handleNext, handleSelectOption, isAnswered]);

  if (finishedSummary) {
    const praise =
      lang === 'hi'
        ? finishedSummary.percentage >= 80
          ? 'शाबाश! आप गणित के सितारे हैं!'
          : finishedSummary.percentage >= 50
            ? 'बहुत बढ़िया! थोड़ा और अभ्यास करें!'
            : 'हार मत मानो, फिर से प्रयास करें!'
        : finishedSummary.percentage >= 90
          ? 'Maths Superstar!'
          : finishedSummary.percentage >= 70
            ? 'Great Achievement!'
            : finishedSummary.percentage >= 50
              ? 'Good Effort!'
              : 'Keep Practicing!';

    const diffText =
      lang === 'hi'
        ? finishedSummary.config.difficulty === 'EASY'
          ? 'आसान'
          : finishedSummary.config.difficulty === 'MEDIUM'
            ? 'मध्यम'
            : 'कठिन'
        : finishedSummary.config.difficulty.charAt(0) +
          finishedSummary.config.difficulty.slice(1).toLowerCase();

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 text-center space-y-7 shadow-card-soft"
        >
          <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
            {finishedSummary.percentage >= 60 &&
              Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const tx = Math.cos(angle) * 64;
                const ty = Math.sin(angle) * 64;
                const colors = ['#F59E0B', '#10B981', '#2563EB', '#7C3AED'];
                return (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                    animate={{ x: tx, y: ty, opacity: 0, scale: 1.2 }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[i % colors.length] }}
                  />
                );
              })}

            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 14 }}
              className="w-24 h-24 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center"
            >
              <Award className="w-14 h-14 text-amber-500" />
            </motion.div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">
              {quizTitle} · {lang === 'hi' ? `कक्षा ${finishedSummary.config.classNumber}` : `Class ${finishedSummary.config.classNumber}`} · {diffText}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{praise}</h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-slate-100">
            <div>
              <span className="block text-xs font-medium text-slate-500">
                {lang === 'hi' ? 'अंतिम स्कोर' : 'Final Score'}
              </span>
              <span className="font-math text-2xl font-extrabold text-blue-600">
                {finishedSummary.correctAnswers}/{finishedSummary.totalQuestions}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">
                {lang === 'hi' ? 'प्रतिशत' : 'Percentage'}
              </span>
              <span className="font-math text-2xl font-extrabold text-slate-900">
                {finishedSummary.percentage}%
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">
                {lang === 'hi' ? 'सही उत्तर' : 'Correct'}
              </span>
              <span className="font-math text-2xl font-extrabold text-emerald-600">
                {finishedSummary.correctAnswers}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">
                {lang === 'hi' ? 'गलत उत्तर' : 'Incorrect'}
              </span>
              <span className="font-math text-2xl font-extrabold text-rose-600">
                {finishedSummary.incorrectAnswers}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 inline-flex items-center justify-center gap-3 mx-auto">
            <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
            <span className="font-display text-xl font-bold text-amber-900">
              {lang === 'hi'
                ? `+${finishedSummary.starsEarned} सितारे मिले!`
                : `+${finishedSummary.starsEarned} ${finishedSummary.starsEarned === 1 ? 'Star' : 'Stars'} Earned!`}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePracticeAgain}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 border-b-4 border-blue-800 text-white text-base font-bold hover:bg-blue-700 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-5 h-5" />
              {t.practiceAgain}
            </button>
            <button
              type="button"
              onClick={onExit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-800 text-base font-bold hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Home className="w-5 h-5" />
              {t.backHome}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progressPct = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 relative">
      {/* Subtle floating star celebration burst on correct answer */}
      {starBurstKey > 0 && isCorrect && (
        <div
          key={starBurstKey}
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-20 flex justify-center gap-6 z-40"
        >
          {[-90, -45, 0, 45, 90].map((dx, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.7 }}
              animate={{ opacity: 0, y: -48, x: dx, scale: 1.25 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
            >
              <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Top Quiz HUD */}
      <div className="bg-white border border-slate-200/80 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 shadow-card-soft">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onExit}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === 'hi' ? 'होम' : 'Home'}
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 truncate">{quizTitle}</h1>
            <p className="text-xs text-slate-500">
              {lang === 'hi' ? `कक्षा ${config.classNumber}` : `Class ${config.classNumber}`} ·{' '}
              {lang === 'hi'
                ? config.difficulty === 'EASY'
                  ? 'आसान'
                  : config.difficulty === 'MEDIUM'
                    ? 'मध्यम'
                    : 'कठिन'
                : config.difficulty.charAt(0) + config.difficulty.slice(1).toLowerCase()}{' '}
              · {lang === 'hi' ? `प्रश्न ${currentIndex + 1}/${questions.length}` : `Q ${currentIndex + 1}/${questions.length}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="min-h-[44px] inline-flex items-center gap-1.5 px-3 rounded-xl bg-amber-50 border border-amber-200 font-math text-sm font-extrabold text-amber-800">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{correctCount}</span>
          </div>
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
            aria-pressed={!soundEnabled}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 10-Question Progress Bar */}
      <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-8 lg:p-10 space-y-5 sm:space-y-6 shadow-card-soft">
        <div className="text-center space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-slate-500">{t.chooseAnswer}</p>
          <div className="font-math text-3xl min-[380px]:text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight py-1 sm:py-2 break-words">
            {currentQuestion.operandA} {currentQuestion.symbol} {currentQuestion.operandB} = ?
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {!isAnswered && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setShowHint((h) => !h);
                }}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                {showHint ? t.hideHint : t.needHint}
              </button>
            )}

            <button
              type="button"
              onClick={speakQuestion}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-blue-600 shrink-0" />
              {t.listen}
            </button>
          </div>

          {showHint && !isAnswered && <VisualPictureHint question={currentQuestion} lang={lang} />}
        </div>

        {/* 4 Large Multiple Choice Answer Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isThisCorrect = opt === currentQuestion.correctAnswer;

            let cardStyle =
              'bg-white border-slate-300 text-slate-900 hover:border-blue-500 hover:bg-blue-50/40';
            if (isAnswered) {
              if (isThisCorrect) {
                cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200';
              } else if (isSelected) {
                cardStyle = 'bg-rose-50 border-rose-400 text-rose-900';
              } else {
                cardStyle = 'bg-slate-50 border-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={`${currentQuestion.id}-${opt}`}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`min-h-[68px] sm:min-h-[76px] px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all cursor-pointer disabled:cursor-default focus-visible:outline-2 focus-visible:outline-blue-600 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-math text-sm font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-math text-2xl sm:text-3xl font-extrabold">{opt}</span>
                </div>

                {isAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isThisCorrect && (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback & Samjho/Understand Explanation */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
              className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {isCorrect ? (
                  <motion.div
                    initial={{ scale: 0.3, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 14 }}
                    className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0"
                  >
                    <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                  </motion.div>
                ) : (
                  <XCircle className="w-8 h-8 text-rose-600 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1">
                  <p className="font-display text-lg font-extrabold">
                    {isCorrect
                      ? t.correctMsg
                      : `${t.wrongMsgPrefix} ${currentQuestion.correctAnswer}`}
                  </p>
                  <p className="text-sm opacity-90">
                    <span className="font-bold">{t.understandLabel} </span>
                    {lang === 'hi' ? currentQuestion.stepsHi : currentQuestion.stepsEn}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              >
                {currentIndex + 1 < questions.length ? t.nextQuestion : t.seeFinalScore}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
