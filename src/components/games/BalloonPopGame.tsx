import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Star, XCircle } from 'lucide-react';
import { generateQuickPrompt, type QuickArithmeticPrompt } from '../../data/mathGames';
import type { AppLanguage, ClassNumber } from '../../data/mathsMaster';
import { soundFx } from '../../utils/sound';

interface BalloonPopGameProps {
  classNumber: ClassNumber;
  lang: AppLanguage;
  onRecordAnswer: (isCorrect: boolean) => void;
  onFinishGame: (stats: { correct: number; total: number; stars: number }) => void;
  onExit: () => void;
}

const TOTAL_ROUNDS = 8;

const BALLOON_PALETTES = [
  { body: '#FB7185', shade: '#E11D48', highlight: '#FFE4E6' },
  { body: '#34D399', shade: '#059669', highlight: '#D1FAE5' },
  { body: '#FBBF24', shade: '#D97706', highlight: '#FEF3C7' },
  { body: '#A78BFA', shade: '#7C3AED', highlight: '#EDE9FE' },
];

interface BalloonSlot {
  value: number;
  xPercent: number;
  speedMultiplier: number;
  startOffset: number;
  paletteIndex: number;
}

function createSlots(prompt: QuickArithmeticPrompt): BalloonSlot[] {
  const xSpots = [14, 38, 62, 86];
  const speeds = [0.85, 1.0, 0.92, 1.08];
  const offsets = [0, 5, 2, 7];
  return prompt.options.map((value, idx) => ({
    value,
    xPercent: xSpots[idx],
    speedMultiplier: speeds[(idx + Math.floor(Math.random() * 4)) % 4],
    startOffset: offsets[idx],
    paletteIndex: idx % BALLOON_PALETTES.length,
  }));
}

export function BalloonPopGame({
  classNumber,
  lang,
  onRecordAnswer,
  onFinishGame,
  onExit,
}: BalloonPopGameProps) {
  const isHi = lang === 'hi';
  const [roundIndex, setRoundIndex] = useState(0);
  const [prompt, setPrompt] = useState<QuickArithmeticPrompt>(() => generateQuickPrompt(classNumber));
  const [slots, setSlots] = useState<BalloonSlot[]>(() => createSlots(prompt));
  const [riseProgress, setRiseProgress] = useState(0); // 0 bottom -> 100 top
  const [status, setStatus] = useState<'playing' | 'won' | 'missed'>('playing');
  const [poppedValue, setPoppedValue] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const timeoutRef = useRef<number | null>(null);
  const correctRef = useRef(0);

  const loadNextRound = useCallback(
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
      const nextPrompt = generateQuickPrompt(classNumber);
      setRoundIndex(nextIdx);
      setPrompt(nextPrompt);
      setSlots(createSlots(nextPrompt));
      setRiseProgress(0);
      setStatus('playing');
      setPoppedValue(null);
    },
    [classNumber, onFinishGame]
  );

  // Floating sky ticker
  useEffect(() => {
    if (status !== 'playing') return;
    const stepPerTick = 0.55; // ~9 seconds to float across sky
    const timer = window.setInterval(() => {
      setRiseProgress((prev) => {
        if (prev + stepPerTick >= 100) {
          window.clearInterval(timer);
          return 100;
        }
        return prev + stepPerTick;
      });
    }, 50);

    return () => window.clearInterval(timer);
  }, [status, roundIndex]);

  // Handle balloons floating out of sky
  useEffect(() => {
    if (status === 'playing' && riseProgress >= 100) {
      setStatus('missed');
      soundFx.playTryAgain();
      onRecordAnswer(false);
      timeoutRef.current = window.setTimeout(() => {
        loadNextRound(roundIndex + 1);
      }, 1150);
    }
  }, [riseProgress, status, roundIndex, loadNextRound, onRecordAnswer]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePopBalloon = (value: number) => {
    if (status !== 'playing') return;
    setPoppedValue(value);

    if (value === prompt.answer) {
      soundFx.playPop();
      soundFx.playCorrect();
      setStatus('won');
      correctRef.current += 1;
      setCorrectCount(correctRef.current);
      onRecordAnswer(true);
    } else {
      soundFx.playTryAgain();
      setStatus('missed');
      onRecordAnswer(false);
    }

    timeoutRef.current = window.setTimeout(() => {
      loadNextRound(roundIndex + 1);
    }, 1050);
  };

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
              {isHi ? 'गुब्बारा फोड़ गणित' : 'Balloon Pop Maths'}
            </h1>
            <p className="text-xs text-slate-500">
              {isHi ? `कक्षा ${classNumber}` : `Class ${classNumber}`} ·{' '}
              {isHi ? `चरण ${roundIndex + 1}/${TOTAL_ROUNDS}` : `Round ${roundIndex + 1}/${TOTAL_ROUNDS}`}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-math text-sm font-extrabold text-amber-800">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>+{correctCount}</span>
        </div>
      </div>

      {/* Question Banner */}
      <div className="bg-white border border-rose-200 rounded-3xl p-5 text-center shadow-card-soft space-y-1">
        <p className="text-xs font-bold text-rose-600 uppercase tracking-wide">
          {isHi ? 'सही उत्तर वाला गुब्बारा फोड़ें!' : 'Tap the balloon with the correct answer!'}
        </p>
        <p className="font-math text-4xl sm:text-5xl font-extrabold text-slate-900">
          {prompt.prompt}
        </p>
      </div>

      {/* Sky Arena */}
      <div className="relative h-[380px] sm:h-[420px] rounded-3xl border border-sky-200 bg-gradient-to-b from-sky-200/75 via-sky-100/70 to-white overflow-hidden shadow-card-soft select-none">
        {/* Soft Decorative Clouds */}
        <div className="pointer-events-none absolute top-6 left-8 w-24 h-8 rounded-full bg-white/70" aria-hidden="true" />
        <div className="pointer-events-none absolute top-14 right-10 w-32 h-9 rounded-full bg-white/60" aria-hidden="true" />
        <div className="pointer-events-none absolute top-28 left-1/3 w-20 h-6 rounded-full bg-white/50" aria-hidden="true" />

        {/* Floating Balloons */}
        {slots.map((slot) => {
          const palette = BALLOON_PALETTES[slot.paletteIndex];
          const yProgress = Math.min(104, riseProgress * slot.speedMultiplier + slot.startOffset);
          // Map 0 -> bottom (82%), 100 -> top (-18%)
          const topPct = 78 - yProgress * 0.88;
          const isThisPopped = poppedValue === slot.value;
          const isRightOption = slot.value === prompt.answer;

          return (
            <motion.button
              key={`${roundIndex}-${slot.value}`}
              type="button"
              disabled={status !== 'playing'}
              onClick={() => handlePopBalloon(slot.value)}
              animate={
                isThisPopped && isRightOption
                  ? { scale: [1, 1.35, 0], opacity: [1, 1, 0] }
                  : isThisPopped && !isRightOption
                    ? { x: [-4, 4, -4, 0] }
                    : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.28 }}
              style={{
                left: `${slot.xPercent}%`,
                top: `${topPct}%`,
                transform: 'translateX(-50%)',
              }}
              aria-label={`Balloon ${slot.value}`}
              className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 group"
            >
              <div className="relative w-20 h-24 sm:w-24 sm:h-28 transition-transform group-hover:scale-105 active:scale-95">
                <svg viewBox="0 0 90 112" className="w-full h-full drop-shadow-md" aria-hidden="true">
                  {/* String */}
                  <path
                    d="M45 88 Q 40 97, 46 104 T 43 112"
                    stroke="#64748B"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Balloon Body */}
                  <ellipse cx="45" cy="44" rx="38" ry="43" fill={palette.shade} />
                  <ellipse cx="45" cy="42" rx="36" ry="41" fill={palette.body} />
                  {/* Glossy Highlight */}
                  <ellipse cx="30" cy="27" rx="9" ry="15" transform="rotate(-22 30 27)" fill={palette.highlight} fillOpacity="0.65" />
                  {/* Knot */}
                  <path d="M40 85 L50 85 L45 91 Z" fill={palette.shade} />
                </svg>
                <span className="absolute inset-0 pb-4 flex items-center justify-center font-math text-2xl sm:text-3xl font-extrabold text-white drop-shadow-sm">
                  {slot.value}
                </span>
              </div>
            </motion.button>
          );
        })}

        {/* Instant Round Feedback Overlay at bottom */}
        {status !== 'playing' && (
          <div className="absolute inset-x-4 bottom-4 flex justify-center pointer-events-none">
            <div
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border font-bold text-sm shadow-md ${
                status === 'won'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {status === 'won' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{isHi ? 'शाबाश! +1 सितारा मिला!' : 'Pop! +1 Star Earned!'}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>
                    {isHi ? `सही उत्तर ${prompt.answer} था` : `Correct answer was ${prompt.answer}`}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
