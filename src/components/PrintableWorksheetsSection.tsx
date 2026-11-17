import { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Printer,
  X,
} from 'lucide-react';
import {
  CLASS_LEVELS,
  OPERATIONS,
  type AppLanguage,
  type ClassNumber,
  type MathOperation,
} from '../data/mathsMaster';
import { ALL_WORKSHEETS, type MathWorksheet } from '../data/worksheets';
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
        <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
          {isHi
            ? `कक्षा ${worksheet.classNumber} · ${opLabel} (${worksheet.symbol}) · वर्कशीट ${worksheet.worksheetNumber}`
            : `Class ${worksheet.classNumber} · ${opLabel} (${worksheet.symbol}) · Worksheet ${worksheet.worksheetNumber}`}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {isHi ? worksheet.focusHi : worksheet.focusEn}
        </p>
      </div>

      {/* Student Details Strip */}
      <div className="bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 mb-3 text-xs sm:text-[13px] font-bold text-slate-800 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 print:flex-nowrap print:text-[11.5px]">
        <span>
          {isHi ? 'विद्यार्थी का नाम: ___________________' : 'Student Name: ___________________'}
        </span>
        <span>{isHi ? 'कक्षा: _______' : 'Class: _______'}</span>
        <span>{isHi ? 'दिनांक: ___________' : 'Date: ___________'}</span>
        <span>{isHi ? 'अंक: ____ / 15' : 'Score: ____ / 15'}</span>
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
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [previewWorksheet, setPreviewWorksheet] = useState<MathWorksheet | null>(null);

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
      {/* Section Header */}
      <div className="bg-gradient-to-br from-sky-50 via-white to-emerald-50/70 border border-blue-200/70 rounded-3xl p-6 sm:p-8 shadow-hero-soft space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold text-blue-700">
          <FileText className="w-4 h-4" />
          <span>
            {isHi
              ? 'कक्षा 1 से 5 · 40 निःशुल्क स्कूल-रेडी PDF वर्कशीट'
              : 'Classes 1 to 5 · 40 Free School-Ready PDF Worksheets'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          {isHi ? 'प्रिंटेबल गणित वर्कशीट (PDF)' : 'Printable Maths Worksheets (PDF)'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {isHi
            ? 'हर कक्षा (1 से 5) के लिए जोड़ (+), घटाव (−), गुणा (×) और भाग (÷) की 2-2 अलग वर्कशीट (कुल 40 वर्कशीट)। प्रत्येक शीट में बिना उत्तर के 15 प्रश्न हैं और एक क्लिक में साफ A4 PDF डाउनलोड या प्रिंट होती है।'
            : 'Choose your class (1 to 5) and subject (+, −, ×, ÷) to download clean single-page A4 worksheets. Each sheet includes 15 grade-appropriate problems with blank answer lines and zero answer keys so kids can solve them directly on paper.'}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-slate-500 pt-1">
          <span>{isHi ? '5 कक्षाएँ' : '5 Classes'}</span>
          <span aria-hidden="true">·</span>
          <span>{isHi ? '4 विषय (+ − × ÷)' : '4 Subjects (+ − × ÷)'}</span>
          <span aria-hidden="true">·</span>
          <span>{isHi ? 'कुल 40 वर्कशीट' : '40 Total Worksheets'}</span>
          <span aria-hidden="true">·</span>
          <span>{isHi ? 'प्रति शीट 15 प्रश्न · 1-पेज A4' : '15 Questions / Sheet · 1-Page A4'}</span>
        </div>
      </div>

      {/* Class 1-5 & Subject Controls */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-card-soft space-y-5">
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
                  {isHi ? 'PDF डाउनलोड / प्रिंट' : 'Download PDF / Print Worksheet'}
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
