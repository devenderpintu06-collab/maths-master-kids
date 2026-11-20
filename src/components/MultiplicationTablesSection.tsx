import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Grid2x2,
  Printer,
  RotateCcw,
  Sparkles,
  Square,
  Volume2,
} from 'lucide-react';
import type { AppLanguage } from '../data/mathsMaster';
import {
  downloadTablesPdf,
  getTableAccentHex,
  TABLE_NUMBERS,
  type TableChartSelection,
} from '../utils/tablesPdf';
import { soundFx } from '../utils/sound';

const HINDI_MULTIPLIER_WORDS = [
  'एकम',
  'दूनी',
  'तिया',
  'चौके',
  'पंजे',
  'छक्के',
  'सत्ते',
  'अठे',
  'निम्मा',
  'दहाई',
] as const;

function buildSpeechLine(tableNum: number, multiplier: number, lang: AppLanguage): string {
  const product = tableNum * multiplier;
  if (lang === 'hi') {
    const word = HINDI_MULTIPLIER_WORDS[multiplier - 1] ?? `गुना ${multiplier}`;
    return `${tableNum} ${word} ${product}`;
  }
  return `${tableNum} times ${multiplier} is ${product}`;
}

interface PrintableTablesA4SheetProps {
  selection: TableChartSelection;
  lang: AppLanguage;
}

/**
 * Pure A4 print-ready chart for either a single table (2..20) or All Tables (2 to 20).
 * Rendered inside the isolated @media print container in App.tsx.
 */
export function PrintableTablesA4Sheet({ selection, lang }: PrintableTablesA4SheetProps) {
  const isHi = lang === 'hi';

  if (selection === 'ALL') {
    return (
      <div className="bg-white text-slate-900 border border-slate-300 rounded-lg p-4 print:p-3 print:w-full">
        <div className="text-center border-b-2 border-slate-300 pb-2 mb-3">
          <h2 className="font-display text-lg font-extrabold text-blue-900">
            Maths Master Kids (mathsmasterkids.in)
          </h2>
          <p className="text-xs font-extrabold text-slate-800">
            {isHi
              ? 'पहाड़े चार्ट: 2 से 20 तक (A4 संदर्भ चार्ट)'
              : 'Multiplication Tables Chart: 2 to 20 (A4 Reference Poster)'}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {TABLE_NUMBERS.map((n) => {
            const accent = getTableAccentHex(n);
            return (
              <div
                key={`print-all-${n}`}
                className="border border-slate-300 rounded-md overflow-hidden bg-white"
              >
                <div
                  className="text-white text-center text-[10px] font-extrabold py-0.5"
                  style={{ backgroundColor: accent }}
                >
                  {isHi ? `${n} का पहाड़ा` : `Table of ${n}`}
                </div>
                <div className="px-1.5 py-1 space-y-0.5 text-center font-math text-[9.5px] font-bold text-slate-900 leading-tight">
                  {Array.from({ length: 10 }, (_, idx) => {
                    const m = idx + 1;
                    return (
                      <div key={m}>
                        {n} × {m} = {n * m}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="border border-amber-300 bg-amber-50 rounded-md p-2 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-extrabold text-amber-900">
              {isHi ? 'रोज़ 5 मिनट अभ्यास!' : '5-Min Daily Tip!'}
            </p>
            <p className="text-[9px] text-slate-700 mt-1 leading-snug">
              {isHi
                ? 'हर सुबह 1 पहाड़ा ज़ोर से बोलकर पढ़ें और इस चार्ट को स्टडी टेबल के पास लगाएँ।'
                : 'Read 1 table aloud each morning and pin this A4 chart near your study desk.'}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-1.5 border-t border-slate-200 text-center text-[9px] text-slate-500">
          {isHi
            ? 'मैथ्स मास्टर किड्स (mathsmasterkids.in) · निःशुल्क प्रिंटेबल पहाड़े चार्ट'
            : 'Maths Master Kids (mathsmasterkids.in) · Free Printable Multiplication Tables Chart'}
        </div>
      </div>
    );
  }

  const n = selection;
  const accent = getTableAccentHex(n);

  return (
    <div className="bg-white text-slate-900 border border-slate-300 rounded-xl p-6 print:p-5 print:w-full">
      <div className="text-center border-b-2 border-slate-300 pb-3 mb-4">
        <h2 className="font-display text-2xl font-extrabold text-blue-900">
          Maths Master Kids (mathsmasterkids.in)
        </h2>
        <p className="text-xl font-extrabold mt-1" style={{ color: accent }}>
          {isHi ? `${n} का पहाड़ा (गुणा सारणी)` : `Multiplication Table of ${n}`}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {isHi
            ? `कक्षा 1 से 5 के लिए A4 रेफरेंस चार्ट (${n} × 1 से ${n} × 10)`
            : `A4 Reference Chart for Classes 1 to 5 (${n} × 1 to ${n} × 10)`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {Array.from({ length: 10 }, (_, idx) => {
          const m = idx + 1;
          return (
            <div
              key={m}
              className="border border-slate-300 rounded-xl px-4 py-4 bg-slate-50/70 flex flex-col items-center justify-center"
            >
              <p className="font-math text-2xl font-extrabold text-slate-900">
                {n} × {m} = {n * m}
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {isHi ? `${n} गुना ${m} बराबर ${n * m}` : `${n} times ${m} equals ${n * m}`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="border border-blue-200 bg-blue-50/60 rounded-xl p-3.5 text-center mb-4">
        <p className="text-xs font-extrabold text-blue-900">
          {isHi
            ? `स्किप काउंटिंग पैटर्न (+${n} जोड़कर गिनें):`
            : `Skip Counting Pattern (+${n} each step):`}
        </p>
        <p className="font-math text-base font-extrabold text-slate-900 mt-1">
          {Array.from({ length: 10 }, (_, idx) => n * (idx + 1)).join(' · ')}
        </p>
      </div>

      <div className="border-t border-slate-200 pt-2 text-center text-[11px] text-slate-500">
        {isHi
          ? 'मैथ्स मास्टर किड्स (mathsmasterkids.in) · निःशुल्क प्रिंटेबल पहाड़े चार्ट'
          : 'Maths Master Kids (mathsmasterkids.in) · Free Printable Multiplication Tables Chart'}
      </div>
    </div>
  );
}

interface MultiplicationTablesSectionProps {
  lang: AppLanguage;
  initialTable?: TableChartSelection;
  onPrintTables: (selection: TableChartSelection) => void;
}

export function MultiplicationTablesSection({
  lang,
  initialTable = 2,
  onPrintTables,
}: MultiplicationTablesSectionProps) {
  const isHi = lang === 'hi';
  const [selectedView, setSelectedView] = useState<TableChartSelection>(initialTable);
  const [hideAnswers, setHideAnswers] = useState<boolean>(false);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingRow, setSpeakingRow] = useState<number | null>(null);
  const [speechUnavailable, setSpeechUnavailable] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);
  const speechSessionRef = useRef<number>(0);

  // Sync if user jumped from homepage quick-pill to a specific table
  useEffect(() => {
    setSelectedView(initialTable);
  }, [initialTable]);

  const stopSpeech = useCallback(() => {
    speechSessionRef.current += 1;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore speech cancel errors in restricted environments
      }
    }
    setIsSpeaking(false);
    setSpeakingRow(null);
  }, []);

  // Cancel speech cleanly on unmount or language/table change
  useEffect(() => {
    stopSpeech();
    setRevealedKeys({});
  }, [selectedView, lang, stopSpeech]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  const pickVoice = useCallback((targetLang: AppLanguage): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    if (targetLang === 'hi') {
      return (
        voices.find((v) => v.lang.toLowerCase().startsWith('hi')) ??
        voices.find((v) => v.lang.toLowerCase().includes('in')) ??
        null
      );
    }
    return (
      voices.find((v) => v.lang.toLowerCase() === 'en-in') ??
      voices.find((v) => v.lang.toLowerCase().startsWith('en-us')) ??
      voices.find((v) => v.lang.toLowerCase().startsWith('en')) ??
      null
    );
  }, []);

  const speakSingleLine = (tableNum: number, multiplier: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechUnavailable(true);
      return;
    }
    setSpeechUnavailable(false);
    stopSpeech();
    const sessionId = speechSessionRef.current;

    const utterance = new SpeechSynthesisUtterance(buildSpeechLine(tableNum, multiplier, lang));
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    const voice = pickVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      if (speechSessionRef.current === sessionId) {
        setIsSpeaking(true);
        setSpeakingRow(multiplier);
      }
    };
    utterance.onend = () => {
      if (speechSessionRef.current === sessionId) {
        setIsSpeaking(false);
        setSpeakingRow(null);
      }
    };
    utterance.onerror = () => {
      if (speechSessionRef.current === sessionId) {
        setIsSpeaking(false);
        setSpeakingRow(null);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      soundFx.playClick();
      stopSpeech();
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechUnavailable(true);
      return;
    }

    // If user is in All Tables view, switch to Table 2 or read Table 2 clearly
    const targetTable = selectedView === 'ALL' ? 2 : selectedView;
    if (selectedView === 'ALL') {
      setSelectedView(2);
    }

    setSpeechUnavailable(false);
    stopSpeech();
    const sessionId = speechSessionRef.current;
    const voice = pickVoice(lang);
    setIsSpeaking(true);

    const speakStep = (multiplier: number) => {
      if (speechSessionRef.current !== sessionId) return;
      if (multiplier > 10) {
        setIsSpeaking(false);
        setSpeakingRow(null);
        return;
      }

      setSpeakingRow(multiplier);
      const utterance = new SpeechSynthesisUtterance(buildSpeechLine(targetTable, multiplier, lang));
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.88;
      utterance.pitch = 1.04;
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (speechSessionRef.current !== sessionId) return;
        window.setTimeout(() => speakStep(multiplier + 1), 220);
      };
      utterance.onerror = () => {
        if (speechSessionRef.current === sessionId) {
          setIsSpeaking(false);
          setSpeakingRow(null);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    speakStep(1);
  };

  const toggleHideAnswers = () => {
    soundFx.playClick();
    setHideAnswers((prev) => {
      const next = !prev;
      setRevealedKeys({});
      return next;
    });
  };

  const toggleRevealCard = (key: string) => {
    if (!hideAnswers) return;
    setRevealedKeys((prev) => {
      const willReveal = !prev[key];
      if (willReveal) {
        soundFx.playCorrect();
      } else {
        soundFx.playClick();
      }
      return { ...prev, [key]: willReveal };
    });
  };

  const handleSavePdf = async () => {
    soundFx.playClick();
    setIsDownloadingPdf(true);
    try {
      await downloadTablesPdf(selectedView, lang);
      setPdfDownloaded(true);
      window.setTimeout(() => setPdfDownloaded(false), 2600);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrintChart = () => {
    soundFx.playClick();
    onPrintTables(selectedView);
  };

  const activeAccent =
    selectedView === 'ALL' ? '#4F46E5' : getTableAccentHex(selectedView);
  const revealedCount =
    selectedView === 'ALL'
      ? Object.values(revealedKeys).filter(Boolean).length
      : Array.from({ length: 10 }, (_, idx) => `${selectedView}-${idx + 1}`).filter(
          (k) => revealedKeys[k]
        ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
      {/* Vibrant EdTech Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#312E81] via-[#4F46E5] to-[#7C3AED] rounded-[2rem] p-6 sm:p-8 shadow-hero-soft text-white grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="absolute inset-0 hero-math-grid opacity-55 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 md:col-span-9 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-300">
            <Sparkles className="w-4 h-4" />
            <span>
              {isHi
                ? 'कक्षा 1 से 5 · बोलकर सुनें, याद करें और A4 चार्ट प्रिंट करें'
                : 'Classes 1 to 5 · Listen Aloud, Memory Practice & Printable A4 Charts'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {isHi ? 'पहाड़े 2 से 20 (Multiplication Tables)' : 'Multiplication Tables 2 to 20'}
          </h1>

          <p className="text-sm sm:text-base text-indigo-100 max-w-2xl leading-relaxed">
            {isHi
              ? '2 से 20 तक कोई भी संख्या चुनें और पूरा पहाड़ा (× 1 से × 10) बड़े और आसान कार्ड में सीखें। बच्चों की याददाश्त तेज़ करने के लिए बोलकर सुनने, उत्तर छिपाकर अभ्यास करने और A4 PDF चार्ट डाउनलोड करने की सुविधा है।'
              : 'Pick any number from 2 to 20 to explore its complete multiplication table (× 1 to × 10) in bold kid-friendly cards. Use Read Aloud voice, Hide Answers memory mode, or print a clean A4 reference chart.'}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-indigo-200 pt-1">
            <span>{isHi ? '2 से 20 तक सभी पहाड़े' : 'Tables 2 to 20'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHi ? 'आवाज़ में सुनें' : 'Read Aloud Voice'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHi ? 'उत्तर छिपाकर टेस्ट' : 'Tap-to-Reveal Memory Mode'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHi ? 'A4 PDF / प्रिंट चार्ट' : 'A4 PDF / Print Chart'}</span>
          </div>
        </div>

        {/* Custom Vector Multiplication Grid Badge Illustration */}
        <div className="relative z-10 hidden md:flex md:col-span-3 justify-end" aria-hidden="true">
          <svg viewBox="0 0 144 144" fill="none" className="w-32 h-32 drop-shadow-xl">
            <rect x="14" y="16" width="116" height="112" rx="22" fill="#FFFFFF" fillOpacity="0.16" stroke="#C4B5FD" strokeWidth="2.5" />
            <rect x="26" y="30" width="42" height="36" rx="10" fill="#F59E0B" />
            <text x="47" y="54" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              2×
            </text>
            <rect x="76" y="30" width="42" height="36" rx="10" fill="#10B981" />
            <text x="97" y="54" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              12×
            </text>
            <rect x="26" y="76" width="42" height="36" rx="10" fill="#38BDF8" />
            <text x="47" y="100" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              15×
            </text>
            <rect x="76" y="76" width="42" height="36" rx="10" fill="#FB7185" />
            <text x="97" y="100" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800" fontFamily="JetBrains Mono, monospace">
              20×
            </text>
          </svg>
        </div>
      </section>

      {/* 1. Interactive Table Selector (2 to 20 + All Tables Chart) */}
      <section className="bg-gradient-to-br from-indigo-50/85 via-white to-violet-50/75 border border-indigo-200/80 rounded-[2rem] p-5 sm:p-6 shadow-card-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {isHi ? 'पहाड़ा चुनें (2 से 20)' : 'Select a Table (2 to 20)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              {isHi
                ? 'किसी भी संख्या पर टैप करें या एक साथ सभी पहाड़ों का चार्ट देखें।'
                : 'Tap any number pill to view its × 1 to × 10 table, or open the All Tables Chart.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setSelectedView('ALL');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border-b-4 transition-all active:translate-y-[1px] cursor-pointer whitespace-nowrap ${
              selectedView === 'ALL'
                ? 'bg-slate-900 border-slate-950 text-white shadow-md'
                : 'bg-white border border-slate-300 border-b-slate-400 text-slate-800 hover:bg-indigo-50 hover:border-indigo-300'
            }`}
          >
            <Grid2x2 className="w-4 h-4 shrink-0" />
            <span>{isHi ? 'सभी पहाड़े चार्ट (2–20)' : 'All Tables Chart (2–20)'}</span>
          </button>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
          {TABLE_NUMBERS.map((n) => {
            const active = selectedView === n;
            const accent = getTableAccentHex(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setSelectedView(n);
                }}
                aria-pressed={active}
                style={
                  active
                    ? { backgroundColor: accent, borderBottomColor: 'rgba(15,23,42,0.35)' }
                    : undefined
                }
                className={`py-2.5 px-2 rounded-2xl font-math text-sm sm:text-base font-extrabold border transition-all cursor-pointer active:translate-y-[2px] ${
                  active
                    ? 'text-white border-transparent border-b-4 shadow-md scale-[1.03]'
                    : 'bg-white border-slate-200 border-b-4 border-b-slate-300 text-slate-800 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/40'
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Kid-Friendly Learning Tools Bar */}
      <section className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-card-soft flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Read Aloud / Listen (Web Speech API) */}
          <button
            type="button"
            onClick={handleReadAloud}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white border-b-4 transition-all active:translate-y-[1px] cursor-pointer whitespace-nowrap ${
              isSpeaking
                ? 'bg-rose-600 border-rose-800 hover:bg-rose-700'
                : 'bg-gradient-to-b from-emerald-500 to-teal-600 border-teal-800 hover:brightness-105'
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-4 h-4 fill-current shrink-0" />
                <span>{isHi ? 'पढ़ना रोकें' : 'Stop Reading'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>{isHi ? 'बोलकर सुनें (Read Aloud)' : 'Read Aloud / Listen'}</span>
              </>
            )}
          </button>

          {/* Practice / Hide Answers Toggle */}
          <button
            type="button"
            onClick={toggleHideAnswers}
            aria-pressed={hideAnswers}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold border-b-4 transition-all active:translate-y-[1px] cursor-pointer whitespace-nowrap ${
              hideAnswers
                ? 'bg-gradient-to-b from-amber-400 to-orange-500 border-orange-700 text-slate-950 shadow-sm'
                : 'bg-indigo-50 border border-indigo-200 border-b-indigo-300 text-indigo-900 hover:bg-indigo-100'
            }`}
          >
            {hideAnswers ? (
              <>
                <Eye className="w-4 h-4 shrink-0" />
                <span>{isHi ? 'सभी उत्तर दिखाएँ' : 'Show All Answers'}</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 shrink-0" />
                <span>{isHi ? 'अभ्यास / उत्तर छिपाएँ' : 'Practice / Hide Answers'}</span>
              </>
            )}
          </button>

          {hideAnswers && revealedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setRevealedKeys({});
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? 'फिर से छिपाएँ' : 'Hide Again'}</span>
            </button>
          )}
        </div>

        {/* Print / Save PDF Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={isDownloadingPdf}
            onClick={() => void handleSavePdf()}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white border-b-4 transition-all active:translate-y-[1px] cursor-pointer disabled:opacity-70 whitespace-nowrap ${
              pdfDownloaded
                ? 'bg-emerald-600 border-emerald-800'
                : 'bg-blue-600 border-blue-800 hover:bg-blue-700'
            }`}
          >
            {pdfDownloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isHi ? 'PDF सेव हो गई!' : 'PDF Saved!'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 shrink-0" />
                <span>
                  {isDownloadingPdf
                    ? isHi
                      ? 'PDF बन रही है...'
                      : 'Creating PDF...'
                    : isHi
                      ? 'PDF सेव करें (A4)'
                      : 'Save PDF (A4)'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrintChart}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-300 border-b-4 border-b-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all active:translate-y-[1px] cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>{isHi ? 'प्रिंट A4' : 'Print A4'}</span>
          </button>
        </div>

        {speechUnavailable && (
          <p className="w-full text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            {isHi
              ? 'इस ब्राउज़र में वॉइस रीडर (Web Speech API) उपलब्ध नहीं है। कृपया आधुनिक ब्राउज़र में प्रयास करें।'
              : 'Voice playback (Web Speech API) is not supported in this browser. Try opening in Chrome, Edge, or Safari.'}
          </p>
        )}
      </section>

      {/* 3. Main Display: Single Selected Table (2..20) OR All Tables Chart */}
      {selectedView === 'ALL' ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {isHi ? 'सभी पहाड़ों का संपूर्ण चार्ट (2 से 20)' : 'Complete All Tables Chart (2 to 20)'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                {hideAnswers
                  ? isHi
                    ? 'अभ्यास मोड चालू है: किसी भी लाइन पर टैप करके उत्तर देखें!'
                    : 'Practice mode active: tap any equation line to reveal its hidden answer!'
                  : isHi
                    ? 'किसी भी पहाड़े के शीर्षक पर क्लिक करके उसे बड़े कार्ड व्यू में खोलें और सुनें।'
                    : 'Click any table header to open it in large card view with Read Aloud voice.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TABLE_NUMBERS.map((n) => {
              const accent = getTableAccentHex(n);
              return (
                <article
                  key={`chart-${n}`}
                  className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-card-soft flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedView(n);
                    }}
                    style={{ backgroundColor: accent }}
                    className="w-full px-4 py-3 text-white flex items-center justify-between font-display font-bold text-base hover:brightness-105 transition cursor-pointer"
                  >
                    <span>{isHi ? `${n} का पहाड़ा` : `Table of ${n}`}</span>
                    <span className="text-xs font-sans font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                      {isHi ? 'खोलें →' : 'Focus →'}
                    </span>
                  </button>

                  <div className="p-3 space-y-1.5">
                    {Array.from({ length: 10 }, (_, idx) => {
                      const m = idx + 1;
                      const key = `${n}-${m}`;
                      const isHidden = hideAnswers && !revealedKeys[key];
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            if (hideAnswers) {
                              toggleRevealCard(key);
                            } else {
                              speakSingleLine(n, m);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-math text-sm font-bold transition-colors cursor-pointer ${
                            isHidden
                              ? 'bg-amber-50 hover:bg-amber-100 text-slate-800 border border-amber-200'
                              : 'bg-slate-50/80 hover:bg-indigo-50 text-slate-800'
                          }`}
                        >
                          <span>
                            {n} × {m} =
                          </span>
                          {isHidden ? (
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-extrabold">
                              ?
                            </span>
                          ) : (
                            <span className="font-extrabold" style={{ color: accent }}>
                              {n * m}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="bg-white border border-slate-200/90 rounded-[2rem] p-5 sm:p-7 shadow-card-soft space-y-6">
          {/* Selected Table Header & Prev/Next Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3.5">
              <div
                style={{ backgroundColor: activeAccent }}
                className="w-14 h-14 rounded-2xl text-white font-math text-2xl font-extrabold flex items-center justify-center shadow-md border-b-4 border-black/20 shrink-0"
              >
                {selectedView}×
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {isHi
                    ? `${selectedView} का पहाड़ा (${selectedView} × 1 से ${selectedView} × 10)`
                    : `Table of ${selectedView} (${selectedView} × 1 to ${selectedView} × 10)`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  {hideAnswers
                    ? isHi
                      ? `अभ्यास मोड: किसी भी कार्ड पर टैप करके उत्तर देखें (${revealedCount} / 10 देखे गए)`
                      : `Memory Practice Mode: Tap any card to reveal the answer (${revealedCount} / 10 revealed)`
                    : isHi
                      ? 'सुनने के लिए किसी भी कार्ड पर टैप करें या ऊपर "बोलकर सुनें" बटन दबाएँ।'
                      : 'Tap any card to hear that fact aloud, or click Read Aloud to listen to the full table.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedView <= 2}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedView((prev) => (typeof prev === 'number' && prev > 2 ? prev - 1 : 2));
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isHi ? 'पिछला' : 'Prev'}</span>
              </button>
              <button
                type="button"
                disabled={selectedView >= 20}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedView((prev) =>
                    typeof prev === 'number' && prev < 20 ? prev + 1 : 20
                  );
                }}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>{isHi ? 'अगला' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 10 Bold, Easy-to-Read Cards (2 Columns x 5 Rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 10 }, (_, idx) => {
              const m = idx + 1;
              const product = selectedView * m;
              const key = `${selectedView}-${m}`;
              const isHidden = hideAnswers && !revealedKeys[key];
              const isCurrentlySpoken = speakingRow === m;

              return (
                <motion.button
                  key={key}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (hideAnswers) {
                      toggleRevealCard(key);
                    } else {
                      speakSingleLine(selectedView, m);
                    }
                  }}
                  className={`group relative rounded-3xl px-5 py-4 border-2 border-b-[5px] text-left flex items-center justify-between gap-4 transition-all cursor-pointer ${
                    isCurrentlySpoken
                      ? 'bg-emerald-50 border-emerald-500 border-b-emerald-700 shadow-md scale-[1.01]'
                      : isHidden
                        ? 'bg-amber-50/70 border-amber-200 border-b-amber-300 hover:border-amber-400 hover:-translate-y-0.5'
                        : 'bg-slate-50/80 border-slate-200 border-b-slate-300 hover:bg-white hover:border-indigo-300 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      style={{ backgroundColor: isCurrentlySpoken ? '#059669' : activeAccent }}
                      className="w-9 h-9 rounded-xl text-white font-math text-sm font-extrabold flex items-center justify-center shrink-0 shadow-xs"
                    >
                      {m}
                    </span>

                    <div className="min-w-0">
                      <p className="font-math text-2xl sm:text-[1.75rem] font-extrabold text-slate-900 tracking-tight whitespace-nowrap flex items-center gap-2.5">
                        <span>
                          {selectedView} × {m} =
                        </span>
                        {isHidden ? (
                          <span className="inline-flex items-center justify-center min-w-[54px] px-3 py-0.5 rounded-xl bg-gradient-to-b from-amber-400 to-orange-500 text-slate-950 border-b-[3px] border-orange-700 text-xl font-extrabold shadow-xs">
                            ?
                          </span>
                        ) : (
                          <motion.span
                            key={`${key}-ans`}
                            initial={hideAnswers ? { scale: 0.7, opacity: 0 } : false}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ color: isCurrentlySpoken ? '#047857' : activeAccent }}
                            className="font-extrabold"
                          >
                            {product}
                          </motion.span>
                        )}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {isHidden
                          ? isHi
                            ? 'उत्तर देखने के लिए टैप करें'
                            : 'Tap card to reveal answer'
                          : buildSpeechLine(selectedView, m, lang)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isCurrentlySpoken
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-500 group-hover:text-indigo-600 group-hover:border-indigo-200'
                    }`}
                    aria-hidden="true"
                  >
                    {isHidden ? <Eye className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Skip Counting Pattern Strip */}
          <div className="bg-gradient-to-r from-indigo-50/90 via-sky-50/80 to-emerald-50/80 border border-indigo-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
            <p className="text-xs sm:text-sm font-extrabold text-indigo-900">
              {isHi
                ? `स्किप काउंटिंग ट्रिक (+${selectedView} जोड़कर याद करें):`
                : `Skip Counting Trick (Add +${selectedView} each step):`}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {Array.from({ length: 10 }, (_, idx) => {
                const m = idx + 1;
                const val = selectedView * m;
                const key = `${selectedView}-${m}`;
                const isHidden = hideAnswers && !revealedKeys[key];
                return (
                  <span
                    key={`skip-${m}`}
                    className="font-math text-sm sm:text-base font-extrabold px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-slate-800 shadow-2xs"
                  >
                    {isHidden ? '?' : val}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
