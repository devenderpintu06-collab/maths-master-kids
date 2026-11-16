import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Scale, Star, XCircle } from 'lucide-react';
import {
  generateCompareChallenge,
  type CompareChallenge,
  type CompareSign,
} from '../../data/mathGames';
import type { AppLanguage, ClassNumber } from '../../data/mathsMaster';
import { soundFx } from '../../utils/sound';

interface CompareGameProps {
  classNumber: ClassNumber;
  lang: AppLanguage;
  onRecordAnswer: (isCorrect: boolean) => void;
  onFinishGame: (stats: { correct: number; total: number; stars: number }) => void;
  onExit: () => void;
}

const TOTAL_ROUNDS = 10;

export function CompareGame({
  classNumber,
  lang,
  onRecordAnswer,
  onFinishGame,
  onExit,
}: CompareGameProps) {
  const isHi = lang === 'hi';
  const [roundIdx, setRoundIdx] = useState(0);
  const [challenge, setChallenge] = useState<CompareChallenge>(() =>
    generateCompareChallenge(classNumber)
  );
  const [picked, setPicked] = useState<CompareSign | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const correctRef = useRef(0);

  const nextRound = useCallback(
    (nextIdx: number) => {
      if (nextIdx >= TOTAL_ROUNDS) {
        soundFx.playVictory();
        onFinishGame({
          correct: correctRef.current,
          total: TOTAL_ROUNDS,
          stars: correctRef.current,
        });
        return;
      }
      setRoundIdx(nextIdx);
      setChallenge(generateCompareChallenge(classNumber));
      setPicked(null);
    },
    [classNumber, onFinishGame]
  );

  const handleChooseSign = (sign: CompareSign) => {
    if (picked !== null) return;
    setPicked(sign);
    const isRight = sign === challenge.answer;

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
    }, 1150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const isAnswered = picked !== null;
  const isRight = isAnswered && picked === challenge.answer;

  const signButtons: { sign: CompareSign; labelEn: string; labelHi: string }[] = [
    { sign: '<', labelEn: 'Less Than', labelHi: 'छोटा है' },
    { sign: '=', labelEn: 'Equal To', labelHi: 'बराबर है' },
    { sign: '>', labelEn: 'Greater Than', labelHi: 'बड़ा है' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
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
              {isHi ? 'तुलना करें और जीतें (<, >, =)' : 'Compare & Win (<, >, =)'}
            </h1>
            <p className="text-xs text-slate-500">
              {isHi ? `कक्षा ${classNumber}` : `Class ${classNumber}`} ·{' '}
              {isHi ? `चरण ${roundIdx + 1}/${TOTAL_ROUNDS}` : `Round ${roundIdx + 1}/${TOTAL_ROUNDS}`}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-math text-sm font-extrabold text-amber-800">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>+{correctCount}</span>
        </div>
      </div>

      {/* Side-by-Side Comparison Stage */}
      <div className="bg-white border border-cyan-200/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-card-soft text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-extrabold">
          <Scale className="w-4 h-4" />
          <span>{isHi ? 'दोनों मानों की तुलना करें' : 'Compare both sides and tap <, =, or >'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-11 items-center gap-4">
          {/* Left Expression Card */}
          <div className="sm:col-span-4 rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-5 space-y-1">
            <p className="font-math text-2xl sm:text-3xl font-extrabold text-slate-900">
              {challenge.leftExpr}
            </p>
            {isAnswered && (
              <p className="font-math text-sm font-bold text-blue-700">= {challenge.leftVal}</p>
            )}
          </div>

          {/* Center Sign Circle */}
          <div className="sm:col-span-3 flex justify-center">
            <div
              className={`w-16 h-16 rounded-2xl border-2 font-math text-4xl font-extrabold flex items-center justify-center transition-colors ${
                isAnswered
                  ? isRight
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'bg-rose-50 border-rose-400 text-rose-700'
                  : 'bg-cyan-50 border-dashed border-cyan-400 text-cyan-700'
              }`}
            >
              {isAnswered ? challenge.answer : '?'}
            </div>
          </div>

          {/* Right Expression Card */}
          <div className="sm:col-span-4 rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-5 space-y-1">
            <p className="font-math text-2xl sm:text-3xl font-extrabold text-slate-900">
              {challenge.rightExpr}
            </p>
            {isAnswered && (
              <p className="font-math text-sm font-bold text-blue-700">= {challenge.rightVal}</p>
            )}
          </div>
        </div>

        {/* 3 Comparison Buttons (<, =, >) */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {signButtons.map((item) => {
            const isPicked = picked === item.sign;
            const isCorrectSign = item.sign === challenge.answer;

            let btnClass =
              'bg-gradient-to-b from-white to-slate-50 border-slate-300 border-b-4 border-b-slate-400 text-slate-900 hover:border-cyan-500 hover:from-cyan-50/60';
            if (isAnswered) {
              if (isCorrectSign) {
                btnClass =
                  'bg-emerald-50 border-emerald-500 border-b-4 border-b-emerald-700 text-emerald-900';
              } else if (isPicked) {
                btnClass = 'bg-rose-50 border-rose-400 border-b-4 border-b-rose-600 text-rose-900';
              } else {
                btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-70';
              }
            }

            return (
              <motion.button
                key={item.sign}
                whileTap={isAnswered ? undefined : { scale: 0.96 }}
                type="button"
                disabled={isAnswered}
                onClick={() => handleChooseSign(item.sign)}
                className={`py-4 px-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer disabled:cursor-default ${btnClass}`}
              >
                <span className="font-math text-4xl font-extrabold leading-none">{item.sign}</span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-600">
                  {isHi ? item.labelHi : item.labelEn}
                </span>
              </motion.button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-bold inline-flex items-center gap-2 ${
              isRight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {isRight ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  {isHi
                    ? `बिल्कुल सही! +1 सितारा (${challenge.leftVal} ${challenge.answer} ${challenge.rightVal})`
                    : `Spot on! +1 Star (${challenge.leftVal} ${challenge.answer} ${challenge.rightVal})`}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>
                  {isHi
                    ? `${challenge.leftVal} ${challenge.answer} ${challenge.rightVal} सही है`
                    : `Correct: ${challenge.leftVal} ${challenge.answer} ${challenge.rightVal}`}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
