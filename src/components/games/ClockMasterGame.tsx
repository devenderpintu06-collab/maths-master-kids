import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Clock, Star, XCircle } from 'lucide-react';
import { generateClockChallenge, type ClockChallenge } from '../../data/mathGames';
import type { AppLanguage, ClassNumber } from '../../data/mathsMaster';
import { soundFx } from '../../utils/sound';

interface ClockMasterGameProps {
  classNumber: ClassNumber;
  lang: AppLanguage;
  onRecordAnswer: (isCorrect: boolean) => void;
  onFinishGame: (stats: { correct: number; total: number; stars: number }) => void;
  onExit: () => void;
}

const TOTAL_CLOCKS = 8;

function AnalogClockSvg({ hours, minutes }: { hours: number; minutes: number }) {
  // Continuous hour-hand rotation + crisp minute-hand rotation
  const minuteDeg = minutes * 6;
  const hourDeg = ((hours % 12) + minutes / 60) * 30;

  return (
    <svg
      viewBox="0 0 240 240"
      className="w-48 h-48 sm:w-64 sm:h-64 mx-auto drop-shadow-md select-none"
      role="img"
      aria-label="Analog clock"
    >
      {/* Colorful Outer Bezel */}
      <circle cx="120" cy="120" r="112" fill="#7C3AED" />
      <circle cx="120" cy="120" r="104" fill="#FFFFFF" stroke="#DDD6FE" strokeWidth="4" />

      {/* 60 Tick Marks (hour ticks highlighted) */}
      {Array.from({ length: 60 }).map((_, i) => {
        const isHour = i % 5 === 0;
        const angleRad = ((i * 6 - 90) * Math.PI) / 180;
        const rOuter = 96;
        const rInner = isHour ? 86 : 91;
        return (
          <line
            key={i}
            x1={120 + rInner * Math.cos(angleRad)}
            y1={120 + rInner * Math.sin(angleRad)}
            x2={120 + rOuter * Math.cos(angleRad)}
            y2={120 + rOuter * Math.sin(angleRad)}
            stroke={isHour ? '#6D28D9' : '#CBD5E1'}
            strokeWidth={isHour ? 3 : 1.5}
            strokeLinecap="round"
          />
        );
      })}

      {/* Clear Numbers 1 to 12 */}
      {Array.from({ length: 12 }).map((_, idx) => {
        const num = idx + 1;
        const angleRad = ((num * 30 - 90) * Math.PI) / 180;
        const rNum = 72;
        return (
          <text
            key={num}
            x={120 + rNum * Math.cos(angleRad)}
            y={120 + rNum * Math.sin(angleRad) + 6}
            textAnchor="middle"
            fill="#1E293B"
            fontSize="18"
            fontWeight="800"
            fontFamily="JetBrains Mono, monospace"
          >
            {num}
          </text>
        );
      })}

      {/* Hour Hand (Shorter, Thick, Coral Red) */}
      <g transform={`rotate(${hourDeg} 120 120)`}>
        <line
          x1="120"
          y1="128"
          x2="120"
          y2="72"
          stroke="#E11D48"
          strokeWidth="7.5"
          strokeLinecap="round"
        />
      </g>

      {/* Minute Hand (Longer, Crisp Blue) */}
      <g transform={`rotate(${minuteDeg} 120 120)`}>
        <line
          x1="120"
          y1="132"
          x2="120"
          y2="44"
          stroke="#2563EB"
          strokeWidth="4.8"
          strokeLinecap="round"
        />
      </g>

      {/* Center Cap */}
      <circle cx="120" cy="120" r="8" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" />
    </svg>
  );
}

export function ClockMasterGame({
  classNumber,
  lang,
  onRecordAnswer,
  onFinishGame,
  onExit,
}: ClockMasterGameProps) {
  const isHi = lang === 'hi';
  const [roundIdx, setRoundIdx] = useState(0);
  const [challenge, setChallenge] = useState<ClockChallenge>(() =>
    generateClockChallenge(classNumber)
  );
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const correctRef = useRef(0);

  const nextRound = useCallback(
    (nextIdx: number) => {
      if (nextIdx >= TOTAL_CLOCKS) {
        soundFx.playVictory();
        onFinishGame({
          correct: correctRef.current,
          total: TOTAL_CLOCKS,
          stars: correctRef.current,
        });
        return;
      }
      setRoundIdx(nextIdx);
      setChallenge(generateClockChallenge(classNumber));
      setPicked(null);
    },
    [classNumber, onFinishGame]
  );

  const handleSelectTime = useCallback(
    (timeOption: string) => {
      if (picked !== null) return;
      setPicked(timeOption);
      const isRight = timeOption === challenge.correctTime;

      if (isRight) {
        soundFx.playCorrect();
        correctRef.current += 1;
        setCorrectCount(correctRef.current);
      } else {
        soundFx.playTryAgain();
      }
      onRecordAnswer(isRight);

      timeoutRef.current = window.setTimeout(() => {
        nextRound(roundIdx + 1);
      }, 1350);
    },
    [challenge.correctTime, nextRound, onRecordAnswer, picked, roundIdx]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (picked === null && e.key >= '1' && e.key <= '4') {
        const opt = challenge.options[Number(e.key) - 1];
        if (opt !== undefined) handleSelectTime(opt);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [challenge.options, handleSelectTime, picked]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const isAnswered = picked !== null;
  const isRight = isAnswered && picked === challenge.correctTime;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* HUD */}
      <div className="bg-white border border-slate-200/80 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3 shadow-card-soft">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onExit}
            className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            {isHi ? 'वापस' : 'Back'}
          </button>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 truncate">
              {isHi ? 'घड़ी और समय मास्टर' : 'Clock & Time Master'}
            </h1>
            <p className="text-xs text-slate-500">
              {isHi ? `कक्षा ${classNumber}` : `Class ${classNumber}`} ·{' '}
              {isHi ? `घड़ी ${roundIdx + 1}/${TOTAL_CLOCKS}` : `Clock ${roundIdx + 1}/${TOTAL_CLOCKS}`}
            </p>
          </div>
        </div>

        <div className="min-h-[44px] inline-flex items-center gap-1.5 px-3 rounded-xl bg-amber-50 border border-amber-200 font-math text-sm font-extrabold text-amber-800">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>+{correctCount}</span>
        </div>
      </div>

      {/* Main Analog Clock + Digital Options Split Card */}
      <div className="bg-white border border-purple-200/80 rounded-3xl p-4 sm:p-9 shadow-card-soft grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left: Colorful SVG Analog Clock */}
        <div className="md:col-span-6 flex flex-col items-center space-y-3 sm:space-y-4">
          <AnalogClockSvg hours={challenge.hours} minutes={challenge.minutes} />

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-bold text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-full bg-rose-600 inline-block" />
              {isHi ? 'घंटे की सुई (छोटी)' : 'Hour Hand (Short)'}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-4 h-1 rounded-full bg-blue-600 inline-block" />
              {isHi ? 'मिनट की सुई (लंबी)' : 'Minute Hand (Long)'}
            </span>
          </div>
        </div>

        {/* Right: 4 Digital Time Choices */}
        <div className="md:col-span-6 space-y-4 sm:space-y-5">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-extrabold">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{isHi ? 'सही डिजिटल समय चुनें' : 'What time does the clock show?'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {challenge.options.map((timeOpt, idx) => {
              const isPicked = picked === timeOpt;
              const isCorrectOpt = timeOpt === challenge.correctTime;

              let btnStyle =
                'bg-slate-50 border-slate-200 border-b-4 border-b-slate-300 text-slate-900 hover:border-purple-400 hover:bg-purple-50/50';
              if (isAnswered) {
                if (isCorrectOpt) {
                  btnStyle =
                    'bg-emerald-50 border-emerald-500 border-b-4 border-b-emerald-700 text-emerald-900';
                } else if (isPicked) {
                  btnStyle = 'bg-rose-50 border-rose-400 border-b-4 border-b-rose-600 text-rose-900';
                } else {
                  btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-70';
                }
              }

              return (
                <motion.button
                  key={`${roundIdx}-${timeOpt}`}
                  whileTap={isAnswered ? undefined : { scale: 0.96 }}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectTime(timeOpt)}
                  className={`min-h-[68px] sm:min-h-[76px] px-2.5 sm:px-4 py-3 rounded-2xl border-2 flex items-center justify-between gap-1.5 sm:gap-2 transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-math text-[11px] sm:text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-math text-lg min-[375px]:text-xl sm:text-3xl font-extrabold whitespace-nowrap">
                      {timeOpt}
                    </span>
                  </div>
                  {isAnswered && isCorrectOpt && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isPicked && !isCorrectOpt && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {isAnswered && (
            <div
              className={`rounded-2xl border p-3.5 text-xs sm:text-sm font-bold flex items-start gap-2.5 ${
                isRight
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {isRight ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p>
                  {isRight
                    ? isHi
                      ? 'बिल्कुल सही! +1 सितारा मिला!'
                      : 'Right on time! +1 Star Earned!'
                    : isHi
                      ? `सही समय ${challenge.correctTime} है`
                      : `Correct time is ${challenge.correctTime}`}
                </p>
                <p className="text-xs font-medium opacity-90 mt-0.5">
                  {isHi ? challenge.explanationHi : challenge.explanationEn}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
