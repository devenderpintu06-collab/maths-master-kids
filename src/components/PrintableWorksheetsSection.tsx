import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Printer,
  RefreshCw,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  CLASS_LEVELS,
  OPERATIONS,
  type AppLanguage,
  type ClassNumber,
  type MathOperation,
} from '../data/mathsMaster';
import {
  ALL_WORKSHEETS,
  generateDailyWorksheet,
  type MathWorksheet,
} from '../data/worksheets';
import { downloadWorksheetPdf } from '../utils/worksheetPdf';
import { soundFx } from '../utils/sound';

interface PrintableA4SheetProps {
  worksheet: MathWorksheet;
  lang: AppLanguage;
}

/**
 * Pure single-page A4 school-ready worksheet layout (no website chrome, no answers).
 * Used both inside the A4 Preview modal and inside the isolated @media print container.
 */
export function PrintableA4Sheet({ worksheet, lang }: PrintableA4SheetProps) {
  const isHi = lang === 'hi';
  const opMeta = OPERATIONS.find((o) => o.id === worksheet.operation);
  const opLabel = opMeta ? (isHi ? opMeta.titleHi : opMeta.titleEn) : '';
  const leftQuestions = worksheet.questions.slice(0, 8);
  const rightQuestions = worksheet.questions.slice(8, 15);

  return (
    <div className="bg-white text-slate-900 border border-slate-300 rounded-xl p-6 sm:p-8 print:border print:border-slate-300 print:rounded-lg print:p-5 print:w-full">
      {/* School-Ready Header */}
      <div className="text-center border-b-2 border-slate-300 pb-3 mb-3.5">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-blue-900 tracking-tight">
          Maths Master Kids (mathsmasterkids.in)
        </h2>
        {worksheet.isDaily ? (
          <>
            <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
              {isHi
                ? `दैनिक गणित वर्कशीट — दिनांक: ${worksheet.displayDateHi ?? ''}${
                    worksheet.variantNumber && worksheet.variantNumber > 0
                      ? ` · अतिरिक्त शीट #${worksheet.variantNumber}`
                      : ''
                  }`
                : `Daily Maths Worksheet — Date: ${worksheet.displayDateEn ?? ''}${
                    worksheet.variantNumber && worksheet.variantNumber > 0
                      ? ` · Extra Sheet #${worksheet.variantNumber}`
                      : ''
                  }`}
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              {isHi
                ? `कक्षा ${worksheet.classNumber} · ${opLabel} (${worksheet.symbol}) · 15 अभ्यास प्रश्न`
                : `Class ${worksheet.classNumber} · ${opLabel} (${worksheet.symbol}) · 15 Practice Problems`}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
              {isHi
                ? `कक्षा ${worksheet.classNumber} · ${opLabel} (${worksheet.symbol}) · वर्कशीट ${worksheet.worksheetNumber}`
                : `Class ${worksheet.classNumber} · ${opLabel} (${worksheet.symbol}) · Worksheet ${worksheet.worksheetNumber}`}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi ? worksheet.focusHi : worksheet.focusEn}
            </p>
          </>
        )}
      </div>

      {/* Student Details Strip */}
      <div className="bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 mb-3 text-xs sm:text-[13px] font-bold text-slate-800 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 print:flex-nowrap print:text-[11.5px]">
        {worksheet.isDaily ? (
          <>
            <span>
              {isHi
                ? 'विद्यार्थी का नाम: _________________________'
                : 'Student Name: _________________________'}
            </span>
            <span>{isHi ? 'कक्षा: __________' : 'Class: __________'}</span>
            <span>{isHi ? 'अंक: ______ / 15' : 'Score: ______ / 15'}</span>
          </>
        ) : (
          <>
            <span>
              {isHi ? 'विद्यार्थी का नाम: ___________________' : 'Student Name: ___________________'}
            </span>
            <span>{isHi ? 'कक्षा: _______' : 'Class: _______'}</span>
            <span>{isHi ? 'दिनांक: ___________' : 'Date: ___________'}</span>
            <span>{isHi ? 'अंक: ____ / 15' : 'Score: ____ / 15'}</span>
          </>
        )}
      </div>

      <p className="text-xs font-semibold text-slate-600 mb-3 print:text-[11px]">
        {isHi
          ? 'निर्देश: सभी 15 प्रश्नों को ध्यान से हल करें और खाली स्थान पर अपना उत्तर लिखें।'
          : 'Instructions: Solve all 15 questions carefully and write your answer on the blank line.'}
      </p>

      {/* 2-Column Layout for all 15 questions (Questions 1-8 left, Questions 9-15 right) */}
      <div className="grid grid-cols-2 gap-3 print:gap-2.5">
        <div className="space-y-2.5 print:space-y-2">
          {leftQuestions.map((q) => (
            <div
              key={q.number}
              className="border border-slate-300 rounded-lg px-3.5 pt-3 pb-7 print:pt-2.5 print:pb-6 bg-white"
            >
              <p className="font-math text-sm sm:text-base print:text-[14px] font-bold text-slate-900 whitespace-nowrap">
                {q.number}) {q.text} = _______
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2.5 print:space-y-2">
          {rightQuestions.map((q) => (
            <div
              key={q.number}
              className="border border-slate-300 rounded-lg px-3.5 pt-3 pb-7 print:pt-2.5 print:pb-6 bg-white"
            >
              <p className="font-math text-sm sm:text-base print:text-[14px] font-bold text-slate-900 whitespace-nowrap">
                {q.number}) {q.text} = _______
              </p>
            </div>
          ))}

          {/* Slot 16: Parent / Teacher Remarks for symmetrical 2x8 A4 page */}
          <div className="border border-slate-300 rounded-lg px-3.5 py-2.5 bg-slate-50 min-h-[76px] print:min-h-[68px] flex flex-col justify-between">
            <p className="text-[11px] font-bold text-slate-700">
              {isHi ? 'अभिभावक / शिक्षक टिप्पणी व हस्ताक्षर:' : 'Parent / Teacher Remarks & Signature:'}
            </p>
            <div className="space-y-3 pt-2">
              <div className="border-b border-slate-300" />
              <div className="border-b border-slate-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[11px] text-slate-500">
        {isHi
          ? 'मैथ्स मास्टर किड्स (mathsmasterkids.in) · निःशुल्क प्रिंटेबल अभ्यास वर्कशीट'
          : 'Maths Master Kids (mathsmasterkids.in) · Free Printable Practice Worksheet'}
      </div>
    </div>
  );
}

interface PrintableWorksheetsSectionProps {
  lang: AppLanguage;
  selectedClass: ClassNumber;
  onSelectClass: (classNum: ClassNumber) => void;
  onPrintWorksheet: (worksheet: MathWorksheet) => void;
}

export function PrintableWorksheetsSection({
  lang,
  selectedClass,
  onSelectClass,
  onPrintWorksheet,
}: PrintableWorksheetsSectionProps) {
  const isHi = lang === 'hi';
  const [selectedSubject, setSelectedSubject] = useState<MathOperation | 'ALL'>('ALL');
  const [dailyOp, setDailyOp] = useState<MathOperation>('ADDITION');
  const [dailyVariant, setDailyVariant] = useState<number>(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [previewWorksheet, setPreviewWorksheet] = useState<MathWorksheet | null>(null);

  useEffect(() => {
    setDailyVariant(0);
  }, [selectedClass, dailyOp]);

  const dailyWorksheet = useMemo(
    () => generateDailyWorksheet(selectedClass, dailyOp, dailyVariant),
    [selectedClass, dailyOp, dailyVariant]
  );

  const dailyLeftCol = dailyWorksheet.questions.slice(0, 8);
  const dailyRightCol = dailyWorksheet.questions.slice(8, 15);
  const isDailyDownloading = downloadingId === dailyWorksheet.id;
  const isDailyDownloaded = downloadedId === dailyWorksheet.id;
  const dailyOpMeta = OPERATIONS.find((o) => o.id === dailyOp) ?? OPERATIONS[0];

  const classWorksheets = ALL_WORKSHEETS.filter((ws) => ws.classNumber === selectedClass);
  const visibleOperations =
    selectedSubject === 'ALL'
      ? OPERATIONS
      : OPERATIONS.filter((op) => op.id === selectedSubject);

  const handleDownloadPdf = async (ws: MathWorksheet) => {
    soundFx.playClick();
    setDownloadingId(ws.id);
    try {
      await downloadWorksheetPdf(ws, lang);
      setDownloadedId(ws.id);
      window.setTimeout(() => {
        setDownloadedId((curr) => (curr === ws.id ? null : curr));
      }, 2600);
    } finally {
      setDownloadingId((curr) => (curr === ws.id ? null : curr));
    }
  };

  const handlePrint = (ws: MathWorksheet) => {
    soundFx.playClick();
    onPrintWorksheet(ws);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
      {/* Section Header with Custom A4 Worksheet SVG Illustration */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1B4B] via-[#1E40AF] to-[#0284C7] rounded-[2rem] p-6 sm:p-8 shadow-hero-soft text-white grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-9 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-300">
            <FileText className="w-4 h-4" />
            <span>
              {isHi
                ? 'कक्षा 1 से 5 · 40 निःशुल्क स्कूल-रेडी PDF वर्कशीट'
                : 'Classes 1 to 5 · 40 Free School-Ready PDF Worksheets'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            {isHi ? 'प्रिंटेबल गणित वर्कशीट (PDF)' : 'Printable Maths Worksheets (PDF)'}
          </h1>

          <p className="text-sm sm:text-base text-sky-100 max-w-2xl leading-relaxed">
            {isHi
              ? 'हर कक्षा (1 से 5) के लिए जोड़ (+), घटाव (−), गुणा (×) और भाग (÷) की 2-2 अलग वर्कशीट (कुल 40 वर्कशीट)। प्रत्येक शीट में बिना उत्तर के 15 प्रश्न हैं और एक क्लिक में साफ A4 PDF डाउनलोड या प्रिंट होती है।'
              : 'Choose your class (1 to 5) and subject (+, −, ×, ÷) to download clean single-page A4 worksheets. Each sheet includes 15 grade-appropriate problems with blank answer lines and zero answer keys so kids can solve them directly on paper.'}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-sky-200 pt-1">
            <span>{isHi ? 'रोज़ नई दैनिक वर्कशीट' : 'Auto Daily Worksheet'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHi ? '5 कक्षाएँ' : '5 Classes'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHi ? '4 विषय (+ − × ÷)' : '4 Subjects (+ − × ÷)'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHi ? '40 स्टैटिक वर्कशीट' : '40 Static Worksheets'}</span>
            <span aria-hidden="true">·</span>
            <span>{isHi ? 'प्रति शीट 15 प्रश्न · 1-पेज A4' : '15 Questions / Sheet · 1-Page A4'}</span>
          </div>
        </div>

        {/* Custom Vector A4 Sheet Stack Illustration */}
        <div className="hidden md:flex md:col-span-3 justify-end" aria-hidden="true">
          <svg viewBox="0 0 140 140" fill="none" className="w-32 h-32 drop-shadow-xl">
            <rect x="30" y="14" width="84" height="108" rx="12" fill="#BAE6FD" transform="rotate(6 72 68)" />
            <rect x="24" y="16" width="84" height="108" rx="12" fill="#FFFFFF" stroke="#E0F2FE" strokeWidth="2.5" />
            <rect x="36" y="30" width="60" height="8" rx="4" fill="#1E40AF" />
            <rect x="36" y="46" width="44" height="5" rx="2.5" fill="#94A3B8" />
            <rect x="36" y="60" width="26" height="14" rx="4" fill="#EFF6FF" stroke="#BFDBFE" />
            <rect x="68" y="60" width="26" height="14" rx="4" fill="#EFF6FF" stroke="#BFDBFE" />
            <rect x="36" y="80" width="26" height="14" rx="4" fill="#EFF6FF" stroke="#BFDBFE" />
            <rect x="68" y="80" width="26" height="14" rx="4" fill="#EFF6FF" stroke="#BFDBFE" />
            <circle cx="104" cy="108" r="20" fill="#F59E0B" stroke="#FEF08A" strokeWidth="3" />
            <text x="104" y="113" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
              PDF
            </text>
          </svg>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TODAY'S DAILY WORKSHEET (AUTO-SEEDED BY TODAY'S DATE)                 */}
      {/* ===================================================================== */}
      <section
        aria-labelledby="daily-worksheet-heading"
        className="bg-gradient-to-br from-emerald-50/90 via-white to-sky-50/85 border-2 border-emerald-200/90 rounded-[2rem] p-5 sm:p-7 shadow-card-soft space-y-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex flex-wrap items-center gap-2 text-xs font-extrabold text-emerald-700">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                {isHi
                  ? 'आज की दैनिक वर्कशीट · हर दिन स्वतः नए प्रश्न'
                  : "Today's Daily Worksheet · Auto-Generated Every Day"}
              </span>
              {dailyVariant > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  <Sparkles className="w-3 h-3" />
                  {isHi ? `अतिरिक्त शीट #${dailyVariant}` : `Extra Sheet #${dailyVariant}`}
                </span>
              )}
            </div>

            <h2
              id="daily-worksheet-heading"
              className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight"
            >
              {isHi
                ? `दैनिक गणित वर्कशीट — दिनांक: ${dailyWorksheet.displayDateHi ?? ''}`
                : `Daily Maths Worksheet — Date: ${dailyWorksheet.displayDateEn ?? ''}`}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {isHi
                ? 'आज की तारीख के आधार पर हर कक्षा (1 से 5) और हर विषय (+, −, ×, ÷) के लिए रोज़ 15 नए अभ्यास प्रश्न (बिना उत्तर) अपने आप तैयार होते हैं। अतिरिक्त अभ्यास के लिए नीचे नई शीट भी बना सकते हैं।'
                : 'Automatically generates a fresh set of 15 grade-level practice problems (zero answers) every day using today’s date for Classes 1 to 5 and all 4 operations. Need an extra sheet right now? Click Generate New Practice Sheet.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {dailyVariant > 0 && (
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setDailyVariant(0);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-900 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isHi ? 'आज की मूल शीट' : "Today's Default Sheet"}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setPreviewWorksheet(dailyWorksheet);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-xs font-bold text-emerald-900 cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              {isHi ? 'A4 प्रीव्यू' : 'Preview A4'}
            </button>
          </div>
        </div>

        {/* Daily Worksheet Controls: Class 1-5 & 4 Operations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white/90 border border-emerald-100 rounded-2xl p-4">
          <div className="lg:col-span-6 space-y-2">
            <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
              {isHi ? 'कक्षा चुनें (1 से 5)' : 'Choose Class (1 to 5)'}
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {CLASS_LEVELS.map((cls) => {
                const active = cls.number === selectedClass;
                return (
                  <button
                    key={`daily-cls-${cls.number}`}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      onSelectClass(cls.number);
                    }}
                    className={`py-2 px-1.5 rounded-xl border text-center text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-emerald-600 border-emerald-600 border-b-[3px] border-b-emerald-800 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 border-b-2 border-b-slate-300 text-slate-700 hover:bg-emerald-50/70'
                    }`}
                  >
                    {isHi ? `क. ${cls.number}` : `Class ${cls.number}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-2">
            <p className="text-xs font-extrabold text-slate-700 uppercase tracking-wide">
              {isHi ? 'गणित विषय चुनें' : 'Choose Operation'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {OPERATIONS.map((op) => {
                const active = dailyOp === op.id;
                return (
                  <button
                    key={`daily-op-${op.id}`}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setDailyOp(op.id);
                    }}
                    className={`py-2 px-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1 ${
                      active
                        ? 'text-white border-transparent border-b-[3px] border-b-black/25 shadow-xs'
                        : 'bg-slate-50 border-slate-200 border-b-2 border-b-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                    style={active ? { backgroundColor: op.bgHex } : undefined}
                  >
                    <span className="font-math font-extrabold">{op.symbol}</span>
                    <span>{isHi ? op.titleHi : op.titleEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live 2-Column Single-Page A4 Preview of Today's 15 Problems (Zero Answers) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
          <div className="border-b border-slate-200 pb-3 text-center space-y-1">
            <p className="font-display text-sm sm:text-base font-extrabold text-blue-900">
              Maths Master Kids (mathsmasterkids.in)
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-800">
              {isHi
                ? `दैनिक गणित वर्कशीट — दिनांक: ${dailyWorksheet.displayDateHi ?? ''}`
                : `Daily Maths Worksheet — Date: ${dailyWorksheet.displayDateEn ?? ''}`}
              {' · '}
              <span style={{ color: dailyOpMeta.bgHex }}>
                {isHi
                  ? `कक्षा ${selectedClass} · ${dailyOpMeta.titleHi} (${dailyOpMeta.symbol})`
                  : `Class ${selectedClass} · ${dailyOpMeta.titleEn} (${dailyOpMeta.symbol})`}
              </span>
            </p>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 pt-0.5">
              {isHi
                ? 'विद्यार्थी का नाम: ___________________   कक्षा: _______   अंक: ____ / 15'
                : 'Student Name: ___________________   Class: _______   Score: ____ / 15'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
            <div className="space-y-2">
              {dailyLeftCol.map((q) => (
                <p
                  key={q.number}
                  className="font-math text-xs sm:text-sm font-bold text-slate-800 bg-slate-50/90 border border-slate-200 rounded-xl px-3 py-2 whitespace-nowrap overflow-x-auto"
                >
                  {q.number}) {q.text} = ______
                </p>
              ))}
            </div>
            <div className="space-y-2">
              {dailyRightCol.map((q) => (
                <p
                  key={q.number}
                  className="font-math text-xs sm:text-sm font-bold text-slate-800 bg-slate-50/90 border border-slate-200 rounded-xl px-3 py-2 whitespace-nowrap overflow-x-auto"
                >
                  {q.number}) {q.text} = ______
                </p>
              ))}
              <div className="border border-dashed border-emerald-300 bg-emerald-50/50 rounded-xl px-3 py-2 text-[11px] sm:text-xs font-semibold text-emerald-800">
                {isHi
                  ? '15 नए प्रश्न · कोई उत्तर कुंजी नहीं · 2 कॉलम A4 पेज के लिए तैयार'
                  : '15 Fresh Questions · No Answer Key · Formatted in 2 Columns for 1 A4 Page'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Download PDF / Print Daily Worksheet, Print A4, Generate New Practice Sheet */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={isDailyDownloading}
            onClick={() => void handleDownloadPdf(dailyWorksheet)}
            className={`flex-1 min-w-[230px] inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white border-b-4 transition-all active:translate-y-[1px] cursor-pointer disabled:opacity-70 whitespace-nowrap ${
              isDailyDownloaded
                ? 'bg-emerald-600 border-emerald-800'
                : 'bg-blue-600 border-blue-800 hover:bg-blue-700'
            }`}
          >
            {isDailyDownloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {isHi ? 'दैनिक PDF डाउनलोड हो गई!' : 'Daily PDF Downloaded!'}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 shrink-0" />
                {isDailyDownloading
                  ? isHi
                    ? 'PDF बन रही है...'
                    : 'Preparing PDF...'
                  : isHi
                    ? 'दैनिक वर्कशीट PDF डाउनलोड / प्रिंट'
                    : 'Download PDF / Print Daily Worksheet'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handlePrint(dailyWorksheet)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl border border-slate-300 border-b-4 border-b-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all active:translate-y-[1px] cursor-pointer whitespace-nowrap shrink-0"
          >
            <Printer className="w-4 h-4 shrink-0" />
            {isHi ? 'प्रिंट A4' : 'Print A4'}
          </button>

          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setDailyVariant((v) => v + 1);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white border-b-4 border-emerald-800 text-xs sm:text-sm font-extrabold transition-all active:translate-y-[1px] cursor-pointer whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            {isHi ? 'नई प्रैक्टिस शीट बनाएँ' : 'Generate New Practice Sheet'}
          </button>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 40 STATIC CURRICULUM WORKSHEETS LIBRARY                               */}
      {/* ===================================================================== */}
      <div className="pt-2 space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          {isHi
            ? 'संपूर्ण प्रिंटेबल वर्कशीट लाइब्रेरी (40 वर्कशीट · कक्षा 1 से 5)'
            : 'Complete Printable Worksheet Library (40 Worksheets · Classes 1 to 5)'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {isHi
            ? 'हर कक्षा और विषय के लिए 2 स्थायी स्कूल-रेडी अभ्यास वर्कशीट नीचे उपलब्ध हैं।'
            : 'Browse all 40 permanent grade-calibrated practice worksheets — 2 distinct sheets per subject for every class.'}
        </p>
      </div>

      {/* Class 1-5 & Subject Controls */}
      <div className="bg-gradient-to-br from-sky-50/85 via-white to-indigo-50/70 border border-sky-200/80 rounded-[2rem] p-5 sm:p-6 shadow-card-soft space-y-5">
        <div className="space-y-2.5">
          <p className="text-sm font-extrabold text-slate-800">
            {isHi ? '1. कक्षा चुनें (कक्षा 1 से 5):' : '1. Select Class (Class 1 to Class 5):'}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {CLASS_LEVELS.map((cls) => {
              const active = cls.number === selectedClass;
              return (
                <button
                  key={cls.number}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onSelectClass(cls.number);
                  }}
                  className={`py-2.5 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 border-blue-600 border-b-4 border-b-blue-800 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 border-b-[3px] border-b-slate-300 text-slate-800 hover:border-blue-300 hover:bg-blue-50/40'
                  }`}
                >
                  <span className="block text-xs sm:text-sm font-extrabold whitespace-nowrap">
                    {isHi ? cls.labelHi : cls.label}
                  </span>
                  <span className={`block text-[11px] ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                    {isHi ? '8 वर्कशीट' : '8 Worksheets'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <p className="text-sm font-extrabold text-slate-800">
            {isHi ? '2. विषय चुनें:' : '2. Filter by Subject:'}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSelectedSubject('ALL');
              }}
              className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedSubject === 'ALL'
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isHi ? 'सभी विषय (8)' : 'All Subjects (8)'}
            </button>
            {OPERATIONS.map((op) => {
              const active = selectedSubject === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedSubject(op.id);
                  }}
                  className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 ${
                    active
                      ? 'text-white border-transparent shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  style={active ? { backgroundColor: op.bgHex } : undefined}
                >
                  <span className="font-math font-extrabold">{op.symbol}</span>
                  <span>{isHi ? op.titleHi : op.titleEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject Groups: 2 Distinct Worksheets per Subject */}
      <div className="space-y-10">
        {visibleOperations.map((op) => {
          const pair = classWorksheets.filter((ws) => ws.operation === op.id);
          return (
            <section key={op.id} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl text-white font-math text-xl font-extrabold flex items-center justify-center shrink-0 ${op.gradientClass}`}
                  >
                    {op.symbol}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {isHi
                        ? `कक्षा ${selectedClass} — ${op.titleHi} (${op.symbol})`
                        : `Class ${selectedClass} — ${op.titleEn} (${op.symbol})`}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isHi
                        ? '2 अलग अभ्यास वर्कशीट · प्रत्येक में 15 प्रश्न (बिना उत्तर)'
                        : '2 Distinct Practice Worksheets · 15 Questions Each (No Answers)'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pair.map((ws) => {
                  const isDownloading = downloadingId === ws.id;
                  const isDownloaded = downloadedId === ws.id;
                  const leftCol = ws.questions.slice(0, 8);
                  const rightCol = ws.questions.slice(8, 15);

                  return (
                    <article
                      key={ws.id}
                      className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-card-soft flex flex-col justify-between gap-5"
                    >
                      <div className="space-y-4">
                        {/* Card Title */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-slate-500">
                              {isHi ? `वर्कशीट ${ws.worksheetNumber}` : `Worksheet ${ws.worksheetNumber}`} ·{' '}
                              {isHi ? '15 प्रश्न · A4 प्रिंट रेडी' : '15 Questions · A4 Ready'}
                            </p>
                            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                              {isHi ? ws.titleHi : ws.titleEn}
                            </h3>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {isHi ? ws.focusHi : ws.focusEn}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playClick();
                              setPreviewWorksheet(ws);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {isHi ? 'A4 प्रीव्यू' : 'Preview A4'}
                          </button>
                        </div>

                        {/* School Sheet Mini-Preview (No Answers) */}
                        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-3">
                          <div className="border-b border-slate-200 pb-2 text-center">
                            <p className="text-xs font-extrabold text-blue-900">
                              Maths Master Kids (mathsmasterkids.in)
                            </p>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              {isHi
                                ? 'नाम: _________  कक्षा: ___  दिनांक: _______  अंक: ___/15'
                                : 'Student Name: _________  Class: ___  Date: _______  Score: ___ / 15'}
                            </p>
                          </div>

                          {/* 15 Questions in 2 Neat Columns */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                            <div className="space-y-1.5">
                              {leftCol.map((q) => (
                                <p
                                  key={q.number}
                                  className="font-math text-xs sm:text-[13px] font-bold text-slate-800 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 whitespace-nowrap overflow-x-auto"
                                >
                                  {q.number}) {q.text} = ______
                                </p>
                              ))}
                            </div>
                            <div className="space-y-1.5">
                              {rightCol.map((q) => (
                                <p
                                  key={q.number}
                                  className="font-math text-xs sm:text-[13px] font-bold text-slate-800 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 whitespace-nowrap overflow-x-auto"
                                >
                                  {q.number}) {q.text} = ______
                                </p>
                              ))}
                              <div className="border border-dashed border-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-500">
                                {isHi ? 'उत्तर कुंजी नहीं (अभ्यास हेतु)' : 'No answer key · Ready to solve'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Prominent Direct 1-Click PDF Download & Print Action Bar */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <button
                          type="button"
                          disabled={isDownloading}
                          onClick={() => void handleDownloadPdf(ws)}
                          className={`flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white border-b-4 transition-all active:translate-y-[1px] cursor-pointer disabled:opacity-70 whitespace-nowrap ${
                            isDownloaded
                              ? 'bg-emerald-600 border-emerald-800'
                              : 'bg-blue-600 border-blue-800 hover:bg-blue-700'
                          }`}
                        >
                          {isDownloaded ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              {isHi ? 'PDF डाउनलोड हो गई!' : 'PDF Downloaded!'}
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4 shrink-0" />
                              {isDownloading
                                ? isHi
                                  ? 'PDF बन रही है...'
                                  : 'Preparing PDF...'
                                : isHi
                                  ? 'PDF डाउनलोड / प्रिंट वर्कशीट'
                                  : 'Download PDF / Print Worksheet'}
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handlePrint(ws)}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-slate-300 border-b-4 border-b-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all active:translate-y-[1px] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Printer className="w-4 h-4 shrink-0" />
                          {isHi ? 'प्रिंट A4' : 'Print A4'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Full A4 Sheet Preview Modal */}
      {previewWorksheet && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={isHi ? 'A4 वर्कशीट प्रीव्यू' : 'A4 Worksheet Preview'}
        >
          <div className="bg-slate-100 border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  {isHi ? previewWorksheet.titleHi : previewWorksheet.titleEn}
                </h2>
                <p className="text-xs text-slate-600">
                  {isHi
                    ? 'A4 सिंगल-पेज लेआउट · 15 प्रश्न · कोई उत्तर कुंजी नहीं'
                    : 'Single-Page A4 Format · 15 Questions · No Answer Key'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleDownloadPdf(previewWorksheet)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 border-b-[3px] border-blue-800 text-white text-xs sm:text-sm font-bold hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  {previewWorksheet.isDaily
                    ? isHi
                      ? 'दैनिक वर्कशीट PDF डाउनलोड / प्रिंट'
                      : 'Download PDF / Print Daily Worksheet'
                    : isHi
                      ? 'PDF डाउनलोड / प्रिंट'
                      : 'Download PDF / Print Worksheet'}
                </button>
                <button
                  type="button"
                  onClick={() => handlePrint(previewWorksheet)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs sm:text-sm font-bold hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                >
                  <Printer className="w-4 h-4" />
                  {isHi ? 'प्रिंट A4' : 'Print A4'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setPreviewWorksheet(null);
                  }}
                  aria-label="Close preview"
                  className="w-9 h-9 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <PrintableA4Sheet worksheet={previewWorksheet} lang={lang} />
          </div>
        </div>
      )}
    </div>
  );
}
