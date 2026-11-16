import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Flame, Star, Trophy, XCircle, Zap } from 'lucide-react';
import {
  generateTableHeroPrompt,
  getClassTableRange,
  type TableHeroPrompt,
} from '../../data/mathGames';
import type { AppLanguage, ClassNumber } from '../../data/mathsMaster';
import { soundFx } from '../../utils/sound';

interface TableHeroGameProps {
  classNumber: ClassNumber;
  lang: AppLanguage;
  onRecordAnswer: (isCorrect: boolean) => void;
  onFinishGame: (stats: { correct: number; total: number; stars: number }) => void;
  onExit: () => void;
}

const TOTAL_ROUNDS = 10;
const TABLES_2_TO_20 = Array.from({ length: 19 }, (_, i) => i + 2);

export function TableHeroGame({
  classNumber,
  lang,
  onRecordAnswer,
  onFinishGame,
  onExit,
}: TableHeroGameProps) {
  const isHi = lang === 'hi';
  const [selectedTable, setSelectedTable] = useState<number | 'MIXED'>('MIXED');
  const [roundIdx, setRoundIdx] = useState(0);
  const [prompt, setPrompt] = useState<TableHeroPrompt>(() =>
    generateTableHeroPrompt(classNumber, 'MIXED')
  );
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const correctRef = useRef(0);

  const [minClassT, maxClassT] = getClassTableRange(classNumber);

  const handleSelectTableMode = (mode: number | 'MIXED') => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    soundFx.playClick();
    setSelectedTable(mode);
    setRoundIdx(0);
    correctRef.current = 0;
    setCorrectCount(0);
    setCombo(0);
    setBestCombo(0);
    setPicked(null);
    setPrompt(generateTableHeroPrompt(classNumber, mode));
  };

  const advanceRound = useCallback(
    (nextIdx: number, tableMode: number | 'MIXED') => {
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
      setPrompt(generateTableHeroPrompt(classNumber, tableMode));
      setPicked(null);
    },
    [classNumber, onFinishGame]
  );

  const handleAnswer = useCallback(
    (value: number) => {
      if (picked !== null) return;
      setPicked(value);
      const isRight = value === prompt.answer;

      if (isRight) {
        soundFx.playCorrect();
        correctRef.current += 1;
        setCorrectCount(correctRef.current);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        setBestCombo((b) => Math.max(b, nextCombo));
      } else {
        soundFx.playTryAgain();
        setCombo(0);
      }
      onRecordAnswer(isRight);

      timeoutRef.current = window.setTimeout(() => {
        advanceRound(roundIdx + 1, selectedTable);
      }, 780);
    },
    [advanceRound, combo, onRecordAnswer, picked, prompt.answer, roundIdx, selectedTable]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (picked === null && e.key >= '1' && e.key <= '4') {
        const opt = prompt.options[Number(e.key) - 1];
        if (opt !== undefined) handleAnswer(opt);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleAnswer, picked, prompt.options]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const isAnswered = picked !== null;
  const isRight = isAnswered && picked === prompt.answer;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
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
              {isHi ? 'पहाड़ा हीरो (Tables 2–20)' : 'Multiplication Table Hero'}
            </h1>
            <p className="text-xs text-slate-500">
              {isHi ? `कक्षा ${classNumber}` : `Class ${classNumber}`} ·{' '}
              {isHi ? `चरण ${roundIdx + 1}/${TOTAL_ROUNDS}` : `Round ${roundIdx + 1}/${TOTAL_ROUNDS}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border font-math text-xs sm:text-sm font-extrabold ${
              combo >= 2
                ? 'bg-orange-50 border-orange-300 text-orange-700'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <Flame className={`w-4 h-4 ${combo >= 2 ? 'text-orange-500 fill-orange-400' : 'text-slate-400'}`} />
            <span>
              {isHi ? `कॉम्बो ×${combo}` : `Combo ×${combo}`}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-math text-sm font-extrabold text-amber-800">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>+{correctCount}</span>
          </div>
        </div>
      </div>

      {/* Table Selector Bar (Mixed Tables + 2 to 20) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 space-y-3 shadow-card-soft">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-slate-700">
            {isHi ? 'पहाड़ा चुनें (2 से 20):' : 'Choose a Table (2 to 20):'}
          </span>
          <span className="text-[11px] font-semibold text-emerald-700">
            {selectedTable === 'MIXED'
              ? isHi
                ? `कक्षा ${classNumber} मिश्रित: पहाड़े ${minClassT}–${maxClassT}`
                : `Class ${classNumber} Mixed: Tables ${minClassT}–${maxClassT}`
              : isHi
                ? `${selectedTable} का पहाड़ा सक्रिय`
                : `Practicing Table of ${selectedTable}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleSelectTableMode('MIXED')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              selectedTable === 'MIXED'
                ? 'bg-emerald-600 border-emerald-600 border-b-2 border-b-emerald-800 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-300'
            }`}
          >
            {isHi ? `मिश्रित (${minClassT}–${maxClassT})` : `Mixed (${minClassT}–${maxClassT})`}
          </button>

          {TABLES_2_TO_20.map((tNum) => {
            const active = selectedTable === tNum;
            return (
              <button
                key={tNum}
                type="button"
                onClick={() => handleSelectTableMode(tNum)}
                className={`min-w-[36px] px-2.5 py-1.5 rounded-xl border font-math text-xs font-extrabold transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-600 border-emerald-600 border-b-2 border-b-emerald-800 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                {tNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-emerald-200/80 rounded-3xl p-6 sm:p-10 space-y-7 shadow-card-soft text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold">
            <Zap className="w-3.5 h-3.5" />
            {isHi ? `${prompt.tableNum} का पहाड़ा` : `Table of ${prompt.tableNum}`}
          </span>
          {bestCombo >= 3 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              {isHi ? `सर्वश्रेष्ठ कॉम्बो: ${bestCombo}` : `Best Combo: ${bestCombo}`}
            </span>
          )}
        </div>

        <p className="font-math text-4xl sm:text-6xl font-extrabold text-slate-900 py-1">
          {prompt.prompt}
        </p>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 max-w-xl mx-auto">
          {prompt.options.map((opt, idx) => {
            const isPicked = picked === opt;
            const isCorrectOpt = opt === prompt.answer;

            let btnStyle =
              'bg-slate-50 border-slate-200 border-b-4 border-b-slate-300 text-slate-900 hover:border-emerald-400 hover:bg-emerald-50/50';
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
                key={`${roundIdx}-${selectedTable}-${opt}`}
                whileTap={isAnswered ? undefined : { scale: 0.96 }}
                type="button"
                disabled={isAnswered}
                onClick={() => handleAnswer(opt)}
                className={`min-h-[76px] px-5 py-4 rounded-2xl border-2 flex items-center justify-between gap-2 transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
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
            className={`rounded-2xl border px-4 py-2.5 text-sm font-bold inline-flex items-center gap-2 ${
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
                    ? `शाबाश! +1 सितारा (${prompt.tableNum} × ${prompt.multiplier} = ${prompt.answer})`
                    : `Hero Hit! +1 Star (${prompt.tableNum} × ${prompt.multiplier} = ${prompt.answer})`}
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>
                  {isHi
                    ? `सही उत्तर: ${prompt.tableNum} × ${prompt.multiplier} = ${prompt.answer}`
                    : `Correct: ${prompt.tableNum} × ${prompt.multiplier} = ${prompt.answer}`}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
