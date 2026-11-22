import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, RefreshCw, Sparkles, Star, XCircle } from 'lucide-react';
import type { AppLanguage, ClassNumber } from '../data/mathsMaster';
import { generateQuickPrompt, type QuickArithmeticPrompt } from '../data/mathGames';
import { soundFx } from '../utils/sound';

interface HeroShowcaseProps {
  classNumber: ClassNumber;
  lang: AppLanguage;
  onRecordAnswer: (isCorrect: boolean) => void;
  onStartDailyQuiz: () => void;
}

/**
 * Large, cheerful custom SVG Owl-Robot Math Mascot holding a sparkling golden trophy,
 * surrounded by glowing floating 3D math badges (+, −, ×, ÷, 100%).
 */
function HeroMascotTrophyIllustration() {
  return (
    <div className="relative w-full max-w-[235px] sm:max-w-[290px] lg:max-w-[330px] mx-auto select-none px-1 sm:px-0" aria-hidden="true">
      {/* Ambient Radial Halo behind Mascot */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-sky-400/30 via-indigo-400/20 to-amber-300/35 blur-2xl pointer-events-none" />

      {/* Floating Glowing 3D Math Badges (inset cleanly on narrow screens to prevent clipping) */}
      <div className="absolute -top-1 left-1 sm:-top-2 sm:left-2 z-20 animate-float-symbol">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-600 border-b-[3px] sm:border-b-4 border-emerald-800 shadow-[0_10px_22px_rgba(16,185,129,0.45)] flex items-center justify-center font-math text-lg sm:text-xl font-extrabold text-white">
          +
        </div>
      </div>

      <div className="absolute top-2 right-0 sm:top-3 sm:right-0 z-20 animate-float-symbol-alt">
        <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 border-b-[3px] sm:border-b-4 border-orange-700 shadow-[0_10px_24px_rgba(245,158,11,0.5)] font-math text-[11px] sm:text-sm font-extrabold text-slate-950">
          100%
        </div>
      </div>

      <div className="absolute top-[46%] left-0 sm:-left-3 z-20 animate-float-symbol-alt">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 border-b-[3px] sm:border-b-4 border-blue-800 shadow-[0_10px_22px_rgba(56,189,248,0.45)] flex items-center justify-center font-math text-base sm:text-xl font-extrabold text-white">
          −
        </div>
      </div>

      <div className="absolute top-[46%] right-0 sm:-right-3 z-20 animate-float-symbol">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-b from-amber-400 to-orange-600 border-b-[3px] sm:border-b-4 border-orange-800 shadow-[0_10px_22px_rgba(249,115,22,0.45)] flex items-center justify-center font-math text-base sm:text-xl font-extrabold text-white">
          ×
        </div>
      </div>

      <div className="absolute bottom-1 left-4 sm:bottom-2 sm:left-6 z-20 animate-float-symbol">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-b from-fuchsia-400 to-purple-600 border-b-[3px] sm:border-b-4 border-purple-800 shadow-[0_10px_22px_rgba(168,85,247,0.45)] flex items-center justify-center font-math text-base sm:text-xl font-extrabold text-white">
          ÷
        </div>
      </div>

      {/* Main Custom SVG Mascot Holding Trophy */}
      <svg
        viewBox="0 0 320 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-auto drop-shadow-[0_18px_28px_rgba(15,23,42,0.35)]"
      >
        <defs>
          <linearGradient id="owlBodyGrad" x1="150" y1="36" x2="150" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="55%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="owlBellyGrad" x1="150" y1="118" x2="150" y2="196" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </linearGradient>
          <linearGradient id="trophyGoldGrad" x1="218" y1="74" x2="274" y2="146" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="45%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="100" y1="62" x2="200" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Soft Platform Glow Shadow */}
        <ellipse cx="162" cy="212" rx="92" ry="12" fill="#0F172A" fillOpacity="0.28" />

        {/* Sparkle Stars */}
        <path d="M84 36 L87 43 L94 46 L87 49 L84 56 L81 49 L74 46 L81 43 Z" fill="#FDE047" />
        <path d="M236 44 L238.5 50 L244.5 52.5 L238.5 55 L236 61 L233.5 55 L227.5 52.5 L233.5 50 Z" fill="#38BDF8" />
        <circle cx="268" cy="176" r="4" fill="#34D399" />

        {/* Robot-Owl Antenna with Glowing Star */}
        <line x1="150" y1="42" x2="150" y2="20" stroke="#93C5FD" strokeWidth="5" strokeLinecap="round" />
        <circle cx="150" cy="18" r="9" fill="#FACC15" stroke="#FEF08A" strokeWidth="2.5" />

        {/* Playful Owl Ear Tufts / Scholar Headsets */}
        <path d="M98 62 L114 34 L132 54 Z" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M202 62 L186 34 L168 54 Z" fill="#38BDF8" stroke="#E0F2FE" strokeWidth="2.5" strokeLinejoin="round" />

        {/* Left Waving Wing / Arm */}
        <path
          d="M96 122 C66 112 58 88 70 76 C80 66 96 82 104 104 Z"
          fill="#2563EB"
          stroke="#93C5FD"
          strokeWidth="3"
        />

        {/* Mascot Feet */}
        <rect x="116" y="188" width="24" height="16" rx="8" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2" />
        <rect x="160" y="188" width="24" height="16" rx="8" fill="#F59E0B" stroke="#FDE68A" strokeWidth="2" />

        {/* Main Rounded Owl-Robot Body */}
        <rect x="92" y="46" width="116" height="148" rx="54" fill="url(#owlBodyGrad)" stroke="#93C5FD" strokeWidth="3.5" />

        {/* Belly Shield */}
        <rect x="112" y="122" width="76" height="62" rx="31" fill="url(#owlBellyGrad)" />
        {/* Chest Math Emblem */}
        <rect x="132" y="138" width="36" height="24" rx="10" fill="#1E3A8A" />
        <text
          x="150"
          y="154"
          textAnchor="middle"
          fill="#38BDF8"
          fontSize="12"
          fontWeight="800"
          fontFamily="JetBrains Mono, monospace"
        >
          A+
        </text>

        {/* Sleek Robot-Owl Face Visor */}
        <rect x="104" y="64" width="92" height="52" rx="26" fill="url(#visorGrad)" stroke="#60A5FA" strokeWidth="3" />

        {/* Big Cheerful Expressive Eyes */}
        <circle cx="131" cy="89" r="14" fill="#FFFFFF" />
        <circle cx="169" cy="89" r="14" fill="#FFFFFF" />
        <circle cx="133" cy="89" r="7.5" fill="#0F172A" />
        <circle cx="171" cy="89" r="7.5" fill="#0F172A" />
        {/* Eye Sparkles */}
        <circle cx="136" cy="85" r="3" fill="#FFFFFF" />
        <circle cx="174" cy="85" r="3" fill="#FFFFFF" />
        <circle cx="129" cy="93" r="1.5" fill="#38BDF8" />
        <circle cx="167" cy="93" r="1.5" fill="#38BDF8" />

        {/* Cute Rosy Cheeks */}
        <ellipse cx="114" cy="103" rx="5" ry="3" fill="#FB7185" fillOpacity="0.85" />
        <ellipse cx="186" cy="103" rx="5" ry="3" fill="#FB7185" fillOpacity="0.85" />

        {/* Cheerful Golden Beak / Smile */}
        <path d="M144 98 L156 98 L150 109 Z" fill="#FACC15" stroke="#EA580C" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Right Wing Holding Trophy */}
        <path
          d="M202 126 C224 128 238 118 242 104 C246 92 232 88 222 100 C215 108 206 112 198 112 Z"
          fill="#2563EB"
          stroke="#93C5FD"
          strokeWidth="3"
        />

        {/* Sparkling Golden Trophy Held High */}
        <g transform="translate(208, 66)">
          {/* Trophy Handles */}
          <path d="M12 18 C-2 18 -2 38 14 38" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M56 18 C70 18 70 38 54 38" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Cup Body */}
          <path
            d="M12 10 H56 V34 C56 48 46 56 34 56 C22 56 12 48 12 34 V10 Z"
            fill="url(#trophyGoldGrad)"
            stroke="#FEF08A"
            strokeWidth="2.5"
          />
          {/* Star on Trophy */}
          <path
            d="M34 20 L36.8 26.2 L43.5 27 L38.5 31.6 L39.8 38.2 L34 34.8 L28.2 38.2 L29.5 31.6 L24.5 27 L31.2 26.2 Z"
            fill="#FFFFFF"
          />
          {/* Stem & Pedestal */}
          <rect x="29" y="55" width="10" height="14" rx="3" fill="#F59E0B" />
          <rect x="18" y="67" width="32" height="10" rx="4" fill="#92400E" stroke="#FACC15" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function buildThreeOptions(prompt: QuickArithmeticPrompt): number[] {
  const distractors = prompt.options.filter((o) => o !== prompt.answer).slice(0, 2);
  const combined = [prompt.answer, ...distractors];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return combined;
}

export function HeroShowcase({
  classNumber,
  lang,
  onRecordAnswer,
  onStartDailyQuiz,
}: HeroShowcaseProps) {
  const isHi = lang === 'hi';
  const [challenge, setChallenge] = useState<{ prompt: string; answer: number; options: number[] }>(
    () => {
      const q = generateQuickPrompt(classNumber);
      return { prompt: q.prompt, answer: q.answer, options: buildThreeOptions(q) };
    }
  );
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    const q = generateQuickPrompt(classNumber);
    setChallenge({ prompt: q.prompt, answer: q.answer, options: buildThreeOptions(q) });
    setPicked(null);
  }, [classNumber]);

  const loadNewChallenge = () => {
    soundFx.playClick();
    const q = generateQuickPrompt(classNumber);
    setChallenge({ prompt: q.prompt, answer: q.answer, options: buildThreeOptions(q) });
    setPicked(null);
  };

  const handlePick = (opt: number) => {
    if (picked !== null) return;
    setPicked(opt);
    const isRight = opt === challenge.answer;
    if (isRight) {
      soundFx.playCorrect();
    } else {
      soundFx.playTryAgain();
    }
    onRecordAnswer(isRight);
  };

  const isAnswered = picked !== null;
  const isRight = isAnswered && picked === challenge.answer;

  return (
    <div className="flex flex-col items-center gap-3.5 sm:gap-4 w-full">
      {/* Mascot + Trophy + Floating 3D Math Badges */}
      <HeroMascotTrophyIllustration />

      {/* Live Interactive "Today's Mini Challenge" Preview Card */}
      <div className="w-full max-w-sm bg-white/12 backdrop-blur-md border border-white/25 rounded-3xl p-3.5 sm:p-5 shadow-[0_14px_34px_rgba(15,23,42,0.28)] space-y-3 text-white">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-300 min-w-0">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">{isHi ? 'आज की मिनी चुनौती' : "Today's Mini Challenge"}</span>
          </div>
          <button
            type="button"
            onClick={loadNewChallenge}
            aria-label={isHi ? 'नया सवाल लाएँ' : 'Load new mini challenge'}
            className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold text-indigo-100 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            <span>{isHi ? `कक्षा ${classNumber}` : `Class ${classNumber}`}</span>
          </button>
        </div>

        <div className="bg-slate-950/35 border border-white/15 rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-center">
          <p className="font-math text-xl sm:text-3xl font-extrabold tracking-wide text-white break-words">
            {challenge.prompt} = <span className="text-amber-300">?</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {challenge.options.map((opt) => {
            const isPickedOpt = picked === opt;
            const isCorrectOpt = opt === challenge.answer;

            let btnStyle =
              'bg-white text-slate-900 border-b-4 border-indigo-200 hover:bg-amber-50 hover:border-amber-300';
            if (isAnswered) {
              if (isCorrectOpt) {
                btnStyle = 'bg-emerald-400 text-slate-950 border-b-4 border-emerald-700';
              } else if (isPickedOpt) {
                btnStyle = 'bg-rose-400 text-slate-950 border-b-4 border-rose-700';
              } else {
                btnStyle = 'bg-white/20 text-white/60 border-b-4 border-white/10';
              }
            }

            return (
              <motion.button
                key={`${challenge.prompt}-${opt}`}
                whileTap={isAnswered ? undefined : { scale: 0.94 }}
                type="button"
                disabled={isAnswered}
                onClick={() => handlePick(opt)}
                className={`min-h-[48px] py-2.5 px-1.5 sm:px-2 rounded-2xl font-math text-base sm:text-lg font-extrabold transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>

        {isAnswered ? (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-xs font-bold">
            <span className={`inline-flex items-center gap-1.5 ${isRight ? 'text-emerald-300' : 'text-amber-200'}`}>
              {isRight ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {isHi ? 'शाबाश! +1 सितारा (+10 XP)' : 'Spot on! +1 Star (+10 XP)'}
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 shrink-0 text-rose-300" />
                  {isHi ? `सही उत्तर: ${challenge.answer}` : `Answer: ${challenge.answer}`}
                </>
              )}
            </span>
            <button
              type="button"
              onClick={loadNewChallenge}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-extrabold hover:bg-amber-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              {isHi ? 'अगला सवाल' : 'Try Another'}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs font-semibold text-indigo-100/90">
            <span className="inline-flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
              <span>{isHi ? 'सही उत्तर पर +1 सितारा!' : 'Tap answer for +1 Star!'}</span>
            </span>
            <button
              type="button"
              onClick={onStartDailyQuiz}
              className="min-h-[44px] px-2 inline-flex items-center underline decoration-amber-300/70 underline-offset-2 hover:text-amber-200 cursor-pointer whitespace-nowrap"
            >
              {isHi ? '10 सवाल खेलें →' : 'Full Quiz →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
