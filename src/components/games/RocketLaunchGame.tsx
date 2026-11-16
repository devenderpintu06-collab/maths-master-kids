import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Flame, Rocket, Star, Timer, XCircle } from 'lucide-react';
import { generateQuickPrompt, type QuickArithmeticPrompt } from '../../data/mathGames';
import type { AppLanguage, ClassNumber } from '../../data/mathsMaster';
import { soundFx } from '../../utils/sound';

interface RocketLaunchGameProps {
  classNumber: ClassNumber;
  lang: AppLanguage;
  onRecordAnswer: (isCorrect: boolean) => void;
  onFinishGame: (stats: { correct: number; total: number; stars: number }) => void;
  onExit: () => void;
}

const TOTAL_SECONDS = 60;
const LAUNCH_FUEL_GOAL = 8;

export function RocketLaunchGame({
  classNumber,
  lang,
  onRecordAnswer,
  onFinishGame,
  onExit,
}: RocketLaunchGameProps) {
  const isHi = lang === 'hi';
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [prompt, setPrompt] = useState<QuickArithmeticPrompt>(() => generateQuickPrompt(classNumber));
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptedCount, setAttemptedCount] = useState(0);

  const correctRef = useRef(0);
  const attemptedRef = useRef(0);
  const finishedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  const finishSprint = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    soundFx.playVictory();
    onFinishGame({
      correct: correctRef.current,
      total: Math.max(attemptedRef.current, correctRef.current),
      stars: correctRef.current,
    });
  }, [onFinishGame]);

  // 60-second countdown timer
  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      finishSprint();
    }
  }, [finishSprint, timeLeft]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSelectOption = useCallback(
    (value: number) => {
      if (picked !== null || finishedRef.current) return;
      setPicked(value);
      const isRight = value === prompt.answer;
      attemptedRef.current += 1;
      setAttemptedCount(attemptedRef.current);

      if (isRight) {
        soundFx.playRocketBoost();
        correctRef.current += 1;
        setCorrectCount(correctRef.current);
      } else {
        soundFx.playTryAgain();
      }
      onRecordAnswer(isRight);

      timeoutRef.current = window.setTimeout(() => {
        if (!finishedRef.current) {
          setPrompt(generateQuickPrompt(classNumber));
          setPicked(null);
        }
      }, 360);
    },
    [classNumber, onRecordAnswer, picked, prompt.answer]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (picked === null && e.key >= '1' && e.key <= '4') {
        const opt = prompt.options[Number(e.key) - 1];
        if (opt !== undefined) handleSelectOption(opt);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSelectOption, picked, prompt.options]);

  const fuelPct = Math.min(100, Math.round((correctCount / LAUNCH_FUEL_GOAL) * 100));
  const rocketBottomPct = Math.min(72, 8 + (correctCount / LAUNCH_FUEL_GOAL) * 58);

  const stageLabel =
    correctCount >= 12
      ? isHi
        ? 'गहरा अंतरिक्ष!'
        : 'Deep Space!'
      : correctCount >= LAUNCH_FUEL_GOAL
        ? isHi
          ? 'चाँद की कक्षा!'
          : 'Orbit Blast-Off!'
        : correctCount >= 4
          ? isHi
            ? 'प्रक्षेपण तैयार!'
            : 'Engines Firing!'
          : isHi
            ? 'ईंधन भरें!'
            : 'Fueling Rocket';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* HUD */}
      <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-card-soft">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            {isHi ? 'वापस' : 'Back'}
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
              {isHi ? '60-सेकंड रॉकेट लॉन्च' : '60-Second Rocket Launch'}
            </h1>
            <p className="text-xs text-slate-500">
              {isHi ? `कक्षा ${classNumber}` : `Class ${classNumber}`} ·{' '}
              {isHi ? `${attemptedCount} हल किए` : `${attemptedCount} solved`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-math text-sm font-extrabold ${
              timeLeft <= 10
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-math text-sm font-extrabold text-amber-800">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>+{correctCount}</span>
          </div>
        </div>
      </div>

      {/* Main Split Stage: Space Launchpad + Rapid-Fire Question Pad */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Space Rocket Visual Stage */}
        <div className="md:col-span-5 relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-950 via-indigo-950 to-sky-900 p-5 min-h-[270px] flex flex-col justify-between text-white shadow-card-soft">
          {/* Background Stars */}
          <div className="pointer-events-none select-none" aria-hidden="true">
            <span className="absolute top-6 left-8 w-1.5 h-1.5 rounded-full bg-white/80" />
            <span className="absolute top-12 right-10 w-1 h-1 rounded-full bg-amber-200/90" />
            <span className="absolute top-24 left-1/4 w-1 h-1 rounded-full bg-white/70" />
            <span className="absolute top-16 right-1/3 w-1.5 h-1.5 rounded-full bg-sky-200/80" />
            <span className="absolute top-36 right-8 w-1 h-1 rounded-full bg-white/75" />
          </div>

          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300">
              <Rocket className="w-4 h-4" />
              {stageLabel}
            </span>
            <span className="font-math text-xs font-bold text-sky-200">
              {fuelPct}% {isHi ? 'ईंधन' : 'Fuel'}
            </span>
          </div>

          {/* Animated SVG Rocket */}
          <div className="relative flex-1 min-h-[165px]">
            <motion.div
              animate={{ bottom: `${rocketBottomPct}%` }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <svg viewBox="0 0 64 84" className="w-16 h-20 drop-shadow-lg" aria-hidden="true">
                {/* Rocket Nose & Body */}
                <path d="M32 4 C20 18 18 36 18 54 H46 C46 36 44 18 32 4 Z" fill="#F8FAFC" />
                <path d="M32 4 C25 13 22 20 20 26 H44 C42 20 39 13 32 4 Z" fill="#EF4444" />
                {/* Window */}
                <circle cx="32" cy="36" r="7" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" />
                {/* Side Fins */}
                <path d="M18 42 L8 58 L18 54 Z" fill="#F97316" />
                <path d="M46 42 L56 58 L46 54 Z" fill="#F97316" />
                {/* Thruster Flame */}
                {correctCount > 0 && (
                  <path d="M25 54 L32 76 L39 54 Z" fill="#FACC15" />
                )}
              </svg>
            </motion.div>
          </div>

          {/* Fuel Progress Bar */}
          <div className="relative z-10 space-y-1.5">
            <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${fuelPct}%` }}
              />
            </div>
            <p className="text-[11px] text-sky-100/80 flex items-center justify-between">
              <span className="inline-flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {isHi ? `लक्ष्य: ${LAUNCH_FUEL_GOAL} सही उत्तर` : `Blast-off goal: ${LAUNCH_FUEL_GOAL} right`}
              </span>
              <button
                type="button"
                onClick={finishSprint}
                className="underline hover:text-white cursor-pointer"
              >
                {isHi ? 'समाप्त करें' : 'Finish'}
              </button>
            </p>
          </div>
        </div>

        {/* Rapid-Fire Question Pad */}
        <div className="md:col-span-7 bg-white border border-orange-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-card-soft text-center">
          <div className="space-y-2">
            <p className="text-xs font-extrabold text-orange-600 uppercase tracking-wide">
              {isHi ? 'तेज़ी से हल करें!' : 'Quick! Pick the answer to fuel up!'}
            </p>
            <p className="font-math text-4xl sm:text-5xl font-extrabold text-slate-900 py-2">
              {prompt.prompt}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {prompt.options.map((opt, idx) => {
              const isPicked = picked === opt;
              const isRightOpt = opt === prompt.answer;

              let btnClass =
                'bg-slate-50 border-slate-200 border-b-4 border-b-slate-300 text-slate-900 hover:border-orange-400 hover:bg-orange-50/50';
              if (picked !== null) {
                if (isRightOpt) {
                  btnClass =
                    'bg-emerald-50 border-emerald-500 border-b-4 border-b-emerald-700 text-emerald-900';
                } else if (isPicked) {
                  btnClass = 'bg-rose-50 border-rose-400 border-b-4 border-b-rose-600 text-rose-900';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-70';
                }
              }

              return (
                <button
                  key={`${prompt.prompt}-${opt}`}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => handleSelectOption(opt)}
                  className={`min-h-[74px] px-4 py-3 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all cursor-pointer disabled:cursor-default active:translate-y-0.5 ${btnClass}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-math text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-math text-2xl sm:text-3xl font-extrabold">{opt}</span>
                  </div>
                  {picked !== null && isRightOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {picked !== null && isPicked && !isRightOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
