import { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Gamepad2, Home, Play, RotateCcw, Star } from 'lucide-react';
import { MINI_GAMES, type MiniGameId } from '../data/mathGames';
import { CLASS_LEVELS, type AppLanguage, type ClassNumber } from '../data/mathsMaster';
import { BalloonPopGame } from './games/BalloonPopGame';
import { DetectiveGame } from './games/DetectiveGame';
import { CompareGame } from './games/CompareGame';
import { RocketLaunchGame } from './games/RocketLaunchGame';
import { TableHeroGame } from './games/TableHeroGame';
import { ClockMasterGame } from './games/ClockMasterGame';
import { soundFx } from '../utils/sound';

function MiniGameIllustration({ gameId }: { gameId: MiniGameId }) {
  if (gameId === 'balloon') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
        <ellipse cx="19" cy="18" rx="10" ry="12" fill="white" fillOpacity="0.92" />
        <ellipse cx="32" cy="22" rx="8" ry="10" fill="white" fillOpacity="0.45" />
        <path d="M19 30 Q17 37 21 43" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 32 Q34 38 30 43" stroke="white" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (gameId === 'detective') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
        <circle cx="21" cy="21" r="11" stroke="white" strokeWidth="4.5" fill="white" fillOpacity="0.2" />
        <path d="M29 29 L40 40" stroke="white" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M18 18 C18 15.5 23 15.5 23 18.5 C23 20.5 20.8 20.8 20.8 22.8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="20.8" cy="26" r="1.4" fill="white" />
      </svg>
    );
  }
  if (gameId === 'compare') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
        <path d="M17 15 L8 24 L17 33" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31 15 L40 24 L31 33" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="3" fill="white" />
      </svg>
    );
  }
  if (gameId === 'tableHero') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
        <rect x="8" y="10" width="32" height="28" rx="6" fill="white" fillOpacity="0.22" stroke="white" strokeWidth="2.5" />
        <path d="M17 19 L27 29 M27 19 L17 29" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <path d="M31 20 H36 M31 27 H36" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="37" cy="11" r="4" fill="#FDE047" />
      </svg>
    );
  }
  if (gameId === 'clockMaster') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
        <circle cx="24" cy="24" r="16" fill="white" fillOpacity="0.22" stroke="white" strokeWidth="3.2" />
        <circle cx="24" cy="12" r="1.4" fill="white" />
        <circle cx="36" cy="24" r="1.4" fill="white" />
        <circle cx="24" cy="36" r="1.4" fill="white" />
        <circle cx="12" cy="24" r="1.4" fill="white" />
        <path d="M24 24 L24 14" stroke="white" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M24 24 L32 28" stroke="#FDE047" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="2.5" fill="white" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-11 h-11" aria-hidden="true">
      <path d="M24 6 C17 15 16 26 16 34 H32 C32 26 31 15 24 6 Z" fill="white" fillOpacity="0.95" />
      <circle cx="24" cy="22" r="4" fill="#EA580C" />
      <path d="M16 28 L10 36 L16 34 Z" fill="white" fillOpacity="0.7" />
      <path d="M32 28 L38 36 L32 34 Z" fill="white" fillOpacity="0.7" />
      <path d="M20 34 L24 43 L28 34 Z" fill="#FDE047" />
    </svg>
  );
}

interface ArcadeSectionProps {
  lang: AppLanguage;
  selectedClass: ClassNumber;
  onSelectClass?: (classNum: ClassNumber) => void;
  showClassPicker?: boolean;
  onLaunchGame: (gameId: MiniGameId) => void;
}

export function MathGamesArcadeSection({
  lang,
  selectedClass,
  onSelectClass,
  showClassPicker = false,
  onLaunchGame,
}: ArcadeSectionProps) {
  const isHi = lang === 'hi';

  return (
    <section
      id="math-games-arcade"
      aria-labelledby="arcade-section-heading"
      className="bg-gradient-to-br from-fuchsia-50/75 via-white to-indigo-50/80 border border-purple-200/75 rounded-[2rem] p-6 sm:p-8 shadow-card-soft space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-fuchsia-700">
            <Gamepad2 className="w-4 h-4" />
            <span>{isHi ? 'मज़ेदार गणित खेल' : 'Fun Math Games'}</span>
          </div>
          <h2
            id="arcade-section-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
          >
            {isHi ? 'मैथ गेम्स आर्केड' : 'Math Games Arcade'}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            {isHi
              ? `कक्षा ${selectedClass} के अनुसार कठिनाई के साथ 6 इंटरैक्टिव मिनी-गेम्स खेलें और हर सही उत्तर पर सितारे जीतें!`
              : `Play 6 interactive mini-games automatically tuned for Class ${selectedClass} and earn stars for your score!`}
          </p>
        </div>

        <span className="text-xs sm:text-sm font-semibold text-purple-700/80 whitespace-nowrap">
          {isHi ? `कक्षा ${selectedClass} स्तर · +1 सितारा / सही उत्तर` : `Class ${selectedClass} Tuned · +1 Star / Win`}
        </span>
      </div>

      {showClassPicker && onSelectClass && (
        <div className="bg-white/95 border border-purple-200/70 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2.5">
          <p className="text-xs font-extrabold text-slate-700">
            {isHi ? 'खेल के लिए अपनी कक्षा चुनें:' : 'Choose Class Level for Games:'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {CLASS_LEVELS.map((cls) => {
              const active = cls.number === selectedClass;
              return (
                <button
                  key={cls.number}
                  type="button"
                  onClick={() => onSelectClass(cls.number)}
                  className={`py-2.5 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 border-indigo-600 border-b-[5px] border-b-indigo-900 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 border-b-4 border-b-slate-300 text-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <span className="block text-xs sm:text-sm font-extrabold whitespace-nowrap">
                    {isHi ? cls.labelHi : cls.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6 Colorful 3D Bouncy Mini-Game Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MINI_GAMES.map((game) => (
          <button
            key={game.id}
            type="button"
            onClick={() => {
              soundFx.playClick();
              onLaunchGame(game.id);
            }}
            style={{ borderBottomColor: game.borderBottomColor }}
            className={`group relative overflow-hidden rounded-3xl p-6 text-left text-white border-b-[6px] ${game.gradientClass} shadow-[0_14px_26px_-8px_rgba(15,23,42,0.26)] transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_20px_34px_-8px_rgba(15,23,42,0.32)] active:translate-y-[3px] cursor-pointer flex flex-col justify-between min-h-[225px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900`}
          >
            {/* Subtle decorative ring inside card */}
            <div
              className="pointer-events-none absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-white/10"
              aria-hidden="true"
            />

            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="w-16 h-16 rounded-2xl bg-white/22 backdrop-blur-xs border border-white/30 flex items-center justify-center transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                <MiniGameIllustration gameId={game.id} />
              </div>
              <span className="text-[11px] font-bold text-white/95 bg-black/15 px-2.5 py-1 rounded-xl whitespace-nowrap">
                {isHi ? game.badgeHi : game.badgeEn}
              </span>
            </div>

            <div className="relative z-10 space-y-1.5 pt-4">
              <h3 className="text-xl font-bold tracking-tight leading-snug">
                {isHi ? game.titleHi : game.titleEn}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-white/95 leading-snug">
                {isHi ? game.taglineHi : game.taglineEn}
              </p>
              <span className="inline-flex items-center gap-1.5 pt-2 text-xs font-extrabold text-white">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isHi ? 'अभी खेलें' : 'Play Now'}
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

interface ActiveMiniGameViewProps {
  gameId: MiniGameId;
  classNumber: ClassNumber;
  lang: AppLanguage;
  onRecordAnswer: (isCorrect: boolean) => void;
  onExit: () => void;
}

export function ActiveMiniGameView({
  gameId,
  classNumber,
  lang,
  onRecordAnswer,
  onExit,
}: ActiveMiniGameViewProps) {
  const isHi = lang === 'hi';
  const [runKey, setRunKey] = useState(0);
  const [summary, setSummary] = useState<{
    correct: number;
    total: number;
    stars: number;
  } | null>(null);

  const meta = MINI_GAMES.find((g) => g.id === gameId);

  const handlePlayAgain = () => {
    soundFx.playClick();
    setSummary(null);
    setRunKey((k) => k + 1);
  };

  if (summary) {
    const pct = summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0;
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-card-soft"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
            <Award className="w-14 h-14 text-amber-500" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500">
              {meta ? (isHi ? meta.titleHi : meta.titleEn) : ''} ·{' '}
              {isHi ? `कक्षा ${classNumber}` : `Class ${classNumber}`}
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {isHi
                ? summary.stars >= 6
                  ? 'शानदार खेल! आप स्टार खिलाड़ी हैं!'
                  : 'बहुत बढ़िया प्रयास!'
                : summary.stars >= 6
                  ? 'Awesome Arcade Run!'
                  : 'Great Effort!'}
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-4 py-5 border-y border-slate-100">
            <div>
              <span className="block text-xs font-medium text-slate-500">
                {isHi ? 'सही उत्तर' : 'Correct'}
              </span>
              <span className="font-math text-2xl font-extrabold text-emerald-600">
                {summary.correct}/{summary.total}
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">
                {isHi ? 'सटीकता' : 'Accuracy'}
              </span>
              <span className="font-math text-2xl font-extrabold text-blue-600">{pct}%</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">
                {isHi ? 'मिले सितारे' : 'Stars Earned'}
              </span>
              <span className="font-math text-2xl font-extrabold text-amber-600">
                +{summary.stars}
              </span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 inline-flex items-center justify-center gap-3 mx-auto">
            <Star className="w-7 h-7 text-amber-500 fill-amber-400" />
            <span className="font-display text-lg sm:text-xl font-bold text-amber-900">
              {isHi
                ? `+${summary.stars} सितारे आपके खाते में जोड़े गए!`
                : `+${summary.stars} ${summary.stars === 1 ? 'Star' : 'Stars'} Added to Your Stars!`}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePlayAgain}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 border-b-4 border-blue-800 text-white text-base font-bold hover:bg-blue-700 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-5 h-5" />
              {isHi ? 'फिर से खेलें' : 'Play Again'}
            </button>
            <button
              type="button"
              onClick={onExit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-slate-300 bg-white text-slate-800 text-base font-bold hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Home className="w-5 h-5" />
              {isHi ? 'आर्केड पर वापस' : 'Back to Arcade'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameId === 'balloon') {
    return (
      <BalloonPopGame
        key={`balloon-${classNumber}-${runKey}`}
        classNumber={classNumber}
        lang={lang}
        onRecordAnswer={onRecordAnswer}
        onFinishGame={setSummary}
        onExit={onExit}
      />
    );
  }
  if (gameId === 'detective') {
    return (
      <DetectiveGame
        key={`detective-${classNumber}-${runKey}`}
        classNumber={classNumber}
        lang={lang}
        onRecordAnswer={onRecordAnswer}
        onFinishGame={setSummary}
        onExit={onExit}
      />
    );
  }
  if (gameId === 'compare') {
    return (
      <CompareGame
        key={`compare-${classNumber}-${runKey}`}
        classNumber={classNumber}
        lang={lang}
        onRecordAnswer={onRecordAnswer}
        onFinishGame={setSummary}
        onExit={onExit}
      />
    );
  }
  if (gameId === 'tableHero') {
    return (
      <TableHeroGame
        key={`tableHero-${classNumber}-${runKey}`}
        classNumber={classNumber}
        lang={lang}
        onRecordAnswer={onRecordAnswer}
        onFinishGame={setSummary}
        onExit={onExit}
      />
    );
  }
  if (gameId === 'clockMaster') {
    return (
      <ClockMasterGame
        key={`clockMaster-${classNumber}-${runKey}`}
        classNumber={classNumber}
        lang={lang}
        onRecordAnswer={onRecordAnswer}
        onFinishGame={setSummary}
        onExit={onExit}
      />
    );
  }
  return (
    <RocketLaunchGame
      key={`rocket-${classNumber}-${runKey}`}
      classNumber={classNumber}
      lang={lang}
      onRecordAnswer={onRecordAnswer}
      onFinishGame={setSummary}
      onExit={onExit}
    />
  );
}
