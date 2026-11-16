import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Search, Star, XCircle } from 'lucide-react';
import { generateDetectiveCase, type DetectiveCase } from '../../data/mathGames';
import type { AppLanguage, ClassNumber } from '../../data/mathsMaster';
import { soundFx } from '../../utils/sound';

interface DetectiveGameProps {
  classNumber: ClassNumber;
  lang: AppLanguage;
  onRecordAnswer: (isCorrect: boolean) => void;
  onFinishGame: (stats: { correct: number; total: number; stars: number }) => void;
  onExit: () => void;
}

const TOTAL_CASES = 8;

export function DetectiveGame({
  classNumber,
  lang,
  onRecordAnswer,
  onFinishGame,
  onExit,
}: DetectiveGameProps) {
  const isHi = lang === 'hi';
  const [caseIdx, setCaseIdx] = useState(0);
  const [puzzle, setPuzzle] = useState<DetectiveCase>(() => generateDetectiveCase(classNumber));
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const correctRef = useRef(0);

  const advanceCase = useCallback(
    (nextIdx: number) => {
      if (nextIdx >= TOTAL_CASES) {
        soundFx.playVictory();
        onFinishGame({
          correct: correctRef.current,
          total: TOTAL_CASES,
          stars: correctRef.current,
        });
        return;
      }
      setCaseIdx(nextIdx);
      setPuzzle(generateDetectiveCase(classNumber));
      setSelected(null);
    },
    [classNumber, onFinishGame]
  );

  const handleSelectOption = useCallback(
    (value: number) => {
      if (selected !== null) return;
      setSelected(value);
      const isRight = value === puzzle.missingValue;

      if (isRight) {
        soundFx.playCorrect();
        correctRef.current += 1;
        setCorrectCount(correctRef.current);
      } else {
        soundFx.playTryAgain();
      }
      onRecordAnswer(isRight);

      timeoutRef.current = window.setTimeout(() => {
        advanceCase(caseIdx + 1);
      }, 1150);
    },
    [advanceCase, caseIdx, onRecordAnswer, puzzle.missingValue, selected]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected === null && e.key >= '1' && e.key <= '4') {
        const opt = puzzle.options[Number(e.key) - 1];
        if (opt !== undefined) handleSelectOption(opt);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSelectOption, puzzle.options, selected]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const isAnswered = selected !== null;
  const isRight = isAnswered && selected === puzzle.missingValue;

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
              {isHi ? 'लापता संख्या जासूस' : 'Missing Number Detective'}
            </h1>
            <p className="text-xs text-slate-500">
              {isHi ? `कक्षा ${classNumber}` : `Class ${classNumber}`} ·{' '}
              {isHi ? `पहेली ${caseIdx + 1}/${TOTAL_CASES}` : `Case ${caseIdx + 1}/${TOTAL_CASES}`}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-math text-sm font-extrabold text-amber-800">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>+{correctCount}</span>
        </div>
      </div>

      {/* Detective Case Card */}
      <div className="bg-white border border-indigo-200/80 rounded-3xl p-6 sm:p-10 space-y-8 shadow-card-soft text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold">
          <Search className="w-4 h-4" />
          <span>{isHi ? 'लापता संख्या खोजें' : 'Find the missing number'}</span>
        </div>

        {/* Equation with highlighted blank box */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-math text-3xl sm:text-5xl font-extrabold text-slate-900 py-2">
          {puzzle.missingPosition === 'left' ? (
            <span
              className={`min-w-[82px] px-4 py-2 rounded-2xl border-2 transition-colors ${
                isAnswered
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-amber-50 border-dashed border-amber-400 text-amber-700'
              }`}
            >
              {isAnswered ? puzzle.missingValue : '?'}
            </span>
          ) : (
            <span>{puzzle.leftDisplay}</span>
          )}

          <span className="text-indigo-600">{puzzle.operatorSymbol}</span>

          {puzzle.missingPosition === 'middle' ? (
            <span
              className={`min-w-[82px] px-4 py-2 rounded-2xl border-2 transition-colors ${
                isAnswered
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : 'bg-amber-50 border-dashed border-amber-400 text-amber-700'
              }`}
            >
              {isAnswered ? puzzle.missingValue : '?'}
            </span>
          ) : (
            <span>{puzzle.rightDisplay}</span>
          )}

          <span className="text-slate-400">=</span>
          <span>{puzzle.resultDisplay}</span>
        </div>

        {/* 4 Clue Option Buttons */}
        <div className="grid grid-cols-2 gap-4">
          {puzzle.options.map((opt, idx) => {
            const isPicked = selected === opt;
            const isCorrectOpt = opt === puzzle.missingValue;

            let btnStyle =
              'bg-slate-50 border-slate-200 border-b-4 border-b-slate-300 text-slate-900 hover:border-indigo-400 hover:bg-indigo-50/50';
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
                key={`${caseIdx}-${opt}`}
                whileTap={isAnswered ? undefined : { scale: 0.97 }}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`min-h-[76px] px-5 py-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-math text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-math text-2xl sm:text-3xl font-extrabold">{opt}</span>
                </div>
                {isAnswered && isCorrectOpt && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isPicked && !isCorrectOpt && (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
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
                    ? `केस सुलझा! +1 सितारा (${puzzle.solvedEquation})`
                    : `Case Cracked! +1 Star (${puzzle.solvedEquation})`}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>
                  {isHi
                    ? `सही उत्तर ${puzzle.missingValue} है (${puzzle.solvedEquation})`
                    : `Answer is ${puzzle.missingValue} (${puzzle.solvedEquation})`}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
