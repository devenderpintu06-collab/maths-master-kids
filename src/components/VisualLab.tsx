import { useState } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import type { AppLanguage } from '../data/mathsMaster';
import { soundFx } from '../utils/sound';

type LabMode = 'number-line' | 'array-area' | 'fraction-compare';

export function VisualLab({ lang = 'en' }: { lang?: AppLanguage }) {
  const isHi = lang === 'hi';
  const [mode, setMode] = useState<LabMode>('number-line');

  // Lab 1: Number Line Hopper
  const [startNum, setStartNum] = useState(5);
  const [jumpAmount, setJumpAmount] = useState(4);

  // Lab 2: Array & Area Builder
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(6);

  // Lab 3: Fraction Explorer
  const [numA, setNumA] = useState(1);
  const [denA, setDenA] = useState(2);
  const [numB, setNumB] = useState(2);
  const [denB, setDenB] = useState(4);

  return (
    <div className="max-w-6xl mx-auto px-3.5 sm:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5 sm:pb-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            {isHi ? 'विज़ुअल गणित लैब' : 'Visual Math Lab'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            {isHi
              ? 'स्लाइड करें, बनाएँ और देखें कि संख्याएँ, गुणा ग्रिड और भिन्न कैसे काम करते हैं।'
              : 'Slide, build, and explore how numbers, multiplication arrays, and fractions work.'}
          </p>
        </div>

        {/* Segmented Lab Switcher */}
        <div className="w-full md:w-auto grid grid-cols-3 md:flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setMode('number-line');
            }}
            className={`min-h-[44px] px-2 sm:px-3.5 py-2 text-[11px] min-[375px]:text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              mode === 'number-line' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHi ? 'संख्या रेखा' : 'Number Line'}
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setMode('array-area');
            }}
            className={`min-h-[44px] px-2 sm:px-3.5 py-2 text-[11px] min-[375px]:text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              mode === 'array-area' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHi ? 'गुणा ग्रिड' : 'Array & Area'}
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setMode('fraction-compare');
            }}
            className={`min-h-[44px] px-2 sm:px-3.5 py-2 text-[11px] min-[375px]:text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              mode === 'fraction-compare' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isHi ? 'भिन्न' : 'Fractions'}
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout */}
      {mode === 'number-line' && (
        <NumberLineSandbox
          lang={lang}
          startNum={startNum}
          jumpAmount={jumpAmount}
          setStartNum={setStartNum}
          setJumpAmount={setJumpAmount}
        />
      )}

      {mode === 'array-area' && (
        <ArrayAreaSandbox
          lang={lang}
          rows={rows}
          cols={cols}
          setRows={setRows}
          setCols={setCols}
        />
      )}

      {mode === 'fraction-compare' && (
        <FractionSandbox
          lang={lang}
          numA={numA}
          denA={denA}
          numB={numB}
          denB={denB}
          setNumA={setNumA}
          setDenA={setDenA}
          setNumB={setNumB}
          setDenB={setDenB}
        />
      )}
    </div>
  );
}

function NumberLineSandbox({
  lang,
  startNum,
  jumpAmount,
  setStartNum,
  setJumpAmount,
}: {
  lang: AppLanguage;
  startNum: number;
  jumpAmount: number;
  setStartNum: (n: number) => void;
  setJumpAmount: (n: number) => void;
}) {
  const isHi = lang === 'hi';
  const min = 0;
  const max = 20;
  const clampedEnd = Math.max(min, Math.min(max, startNum + jumpAmount));
  const actualJump = clampedEnd - startNum;
  const steps = Math.abs(actualJump);
  const dir = actualJump < 0 ? -1 : 1;

  const width = 680;
  const padX = 28;
  const toX = (n: number) => padX + ((n - min) / (max - min)) * (width - padX * 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-5 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-medium text-slate-500">
              {isHi ? 'कक्षा 1–2 · जोड़ और घटाव' : 'Class 1–2 · Addition & Subtraction'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {isHi ? 'मेंढक छलांग संख्या रेखा' : 'Frog Hop Number Line'}
            </h2>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 font-math text-lg sm:text-xl font-bold text-blue-900">
            {startNum} {actualJump >= 0 ? `+ ${actualJump}` : `- ${Math.abs(actualJump)}`} = {clampedEnd}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="overflow-x-auto py-3">
            <svg viewBox={`0 0 ${width} 130`} className="w-full min-w-[440px] h-32 sm:h-36">
              <line x1={padX} y1="88" x2={width - padX} y2="88" stroke="#94A3B8" strokeWidth="3" />
              {Array.from({ length: max - min + 1 }).map((_, idx) => {
                const val = min + idx;
                const x = toX(val);
                const isStart = val === startNum;
                const isEnd = val === clampedEnd;
                return (
                  <g key={val}>
                    <line
                      x1={x}
                      y1={isStart || isEnd ? 76 : 82}
                      x2={x}
                      y2={isStart || isEnd ? 100 : 94}
                      stroke={isStart ? '#2563EB' : isEnd ? '#059669' : '#64748B'}
                      strokeWidth={isStart || isEnd ? 3 : 1.5}
                    />
                    <text
                      x={x}
                      y="118"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight={isStart || isEnd ? '700' : '500'}
                      fill={isStart ? '#2563EB' : isEnd ? '#059669' : '#475569'}
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {Array.from({ length: steps }).map((_, i) => {
                const x1 = toX(startNum + dir * i);
                const x2 = toX(startNum + dir * (i + 1));
                const mid = (x1 + x2) / 2;
                return (
                  <path
                    key={i}
                    d={`M ${x1} 78 Q ${mid} 38 ${x2} 78`}
                    fill="none"
                    stroke={dir > 0 ? '#059669' : '#D97706'}
                    strokeWidth="2.5"
                  />
                );
              })}

              <circle cx={toX(startNum)} cy="78" r="7" fill="#2563EB" />
              <circle cx={toX(clampedEnd)} cy="78" r="7" fill="#059669" />
            </svg>
          </div>
          <p className="sm:hidden text-[11px] font-semibold text-slate-400 text-center">
            {isHi ? '← 0 से 20 देखने के लिए स्वाइप करें →' : '← Swipe sideways to view 0–20 →'}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isHi
            ? `नीला बिंदु आपकी शुरुआती संख्या (${startNum}) दिखाता है। ${steps} कदम ${dir >= 0 ? 'आगे' : 'पीछे'} कूदने के बाद हरा बिंदु (${clampedEnd}) पर पहुँचता है।`
            : `Blue dot shows your starting number (${startNum}). Green dot shows where you land (${clampedEnd}) after hopping ${steps} ${dir >= 0 ? 'forward' : 'backward'}.`}
        </p>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-5 sm:gap-6">
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-slate-900">
            {isHi ? 'नियंत्रण (Controls)' : 'Controls'}
          </h3>

          <label className="block space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>{isHi ? 'शुरुआती संख्या' : 'Start Number'}</span>
              <span className="font-math font-bold text-blue-700">{startNum}</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={startNum}
              onChange={(e) => setStartNum(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </label>

          <label className="block space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>{isHi ? 'छलांग कदम' : 'Jump Steps'}</span>
              <span className="font-math font-bold text-emerald-700">
                {jumpAmount >= 0 ? `+${jumpAmount}` : jumpAmount}
              </span>
            </div>
            <input
              type="range"
              min={-10}
              max={10}
              value={jumpAmount}
              onChange={(e) => setJumpAmount(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFx.playClick();
            setStartNum(5);
            setJumpAmount(4);
          }}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 shrink-0" />
          <span>{isHi ? 'संख्या रेखा रीसेट करें' : 'Reset Number Line'}</span>
        </button>
      </div>
    </div>
  );
}

function ArrayAreaSandbox({
  lang,
  rows,
  cols,
  setRows,
  setCols,
}: {
  lang: AppLanguage;
  rows: number;
  cols: number;
  setRows: (n: number) => void;
  setCols: (n: number) => void;
}) {
  const isHi = lang === 'hi';
  const area = rows * cols;
  const perimeter = 2 * (rows + cols);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-5 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-medium text-slate-500">
              {isHi ? 'कक्षा 3–4 · गुणा और क्षेत्रफल' : 'Class 3–4 · Multiplication & Area'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {isHi ? 'गुणा और क्षेत्रफल ग्रिड बिल्डर' : 'Array & Area Grid Builder'}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 font-math text-base sm:text-lg font-bold text-amber-900">
              {rows} × {cols} = {area}
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-math text-xs sm:text-sm font-semibold text-slate-700">
              {isHi ? `परिमाप: ${perimeter}` : `Perimeter: ${perimeter}`}
            </div>
          </div>
        </div>

        <div className="py-3 overflow-x-auto max-w-full">
          <div
            className="mx-auto w-fit grid gap-1 sm:gap-1.5 p-2.5 sm:p-3 rounded-xl bg-slate-50 border-2 border-slate-300"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: area }).map((_, i) => (
              <div
                key={i}
                className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6 sm:w-8 sm:h-8 rounded-md bg-amber-400 border border-amber-600/30"
              />
            ))}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isHi
            ? `${rows} पंक्तियों में हर पंक्ति में ${cols} वर्ग होने से कुल ${area} वर्ग इकाइयाँ बनती हैं। पंक्तियाँ और स्तंभ बदलकर क्रम-विनिमेय नियम देखें!`
            : `${rows} rows with ${cols} squares in each row makes ${area} square units inside. Try swapping rows and columns to see the commutative property!`}
        </p>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-5 sm:gap-6">
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-slate-900">
            {isHi ? 'ग्रिड आकार' : 'Grid Dimensions'}
          </h3>

          <label className="block space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>{isHi ? 'पंक्तियाँ (ऊँचाई)' : 'Rows (Height)'}</span>
              <span className="font-math font-bold text-amber-700">
                {rows} {isHi ? 'इकाई' : 'units'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </label>

          <label className="block space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>{isHi ? 'स्तंभ (चौड़ाई)' : 'Columns (Width)'}</span>
              <span className="font-math font-bold text-blue-700">
                {cols} {isHi ? 'इकाई' : 'units'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={cols}
              onChange={(e) => setCols(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => {
            soundFx.playPop();
            const r = rows;
            const c = cols;
            setRows(Math.min(10, c));
            setCols(Math.min(12, r));
          }}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4 shrink-0" />
          <span>{isHi ? 'पंक्तियाँ और स्तंभ बदलें' : 'Swap Rows & Columns'}</span>
        </button>
      </div>
    </div>
  );
}

function FractionSandbox({
  lang,
  numA,
  denA,
  numB,
  denB,
  setNumA,
  setDenA,
  setNumB,
  setDenB,
}: {
  lang: AppLanguage;
  numA: number;
  denA: number;
  numB: number;
  denB: number;
  setNumA: (n: number) => void;
  setDenA: (n: number) => void;
  setNumB: (n: number) => void;
  setDenB: (n: number) => void;
}) {
  const isHi = lang === 'hi';
  const valA = numA / denA;
  const valB = numB / denB;
  const symbol = Math.abs(valA - valB) < 0.0001 ? '=' : valA > valB ? '>' : '<';

  const renderBar = (num: number, den: number, color: string) => (
    <div className="grid gap-1 h-10 w-full" style={{ gridTemplateColumns: `repeat(${den}, minmax(0, 1fr))` }}>
      {Array.from({ length: den }).map((_, i) => (
        <div
          key={i}
          className={`rounded-md border ${
            i < num ? `${color} border-black/15` : 'bg-slate-50 border-slate-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 flex flex-col justify-between gap-5 sm:gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-medium text-slate-500">
              {isHi ? 'कक्षा 3–5 · तुल्य और भिन्न तुलना' : 'Class 3–5 · Equivalent & Comparing Fractions'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {isHi ? 'भिन्न तुलना पट्टियाँ' : 'Fraction Comparison Bars'}
            </h2>
          </div>
          <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 font-math text-lg sm:text-xl font-bold text-indigo-900">
            {numA}/{denA} {symbol} {numB}/{denB}
          </div>
        </div>

        <div className="space-y-6 py-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-blue-800">
              <span>{isHi ? 'भिन्न A' : 'Fraction A'}</span>
              <span className="font-math">
                {numA}/{denA} ({Math.round(valA * 100)}%)
              </span>
            </div>
            {renderBar(numA, denA, 'bg-blue-500')}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-emerald-800">
              <span>{isHi ? 'भिन्न B' : 'Fraction B'}</span>
              <span className="font-math">
                {numB}/{denB} ({Math.round(valB * 100)}%)
              </span>
            </div>
            {renderBar(numB, denB, 'bg-emerald-500')}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {symbol === '='
            ? isHi
              ? `तुल्य भिन्न! ${numA}/${denA} और ${numB}/${denB} बिल्कुल बराबर हिस्सा दिखाते हैं।`
              : `Equivalent fractions! ${numA}/${denA} and ${numB}/${denB} cover the exact same length.`
            : isHi
              ? `${valA > valB ? `${numA}/${denA}` : `${numB}/${denB}`} पूरी पट्टी का बड़ा हिस्सा दर्शाता है।`
              : `${valA > valB ? `${numA}/${denA}` : `${numB}/${denB}`} covers a larger share of the whole bar.`}
        </p>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5">
        <h3 className="text-lg font-bold text-slate-900">
          {isHi ? 'भिन्न बदलें' : 'Adjust Fractions'}
        </h3>

        <div className="space-y-3 pb-4 border-b border-slate-100">
          <p className="text-xs font-bold text-blue-700">
            {isHi ? `भिन्न A (${numA}/${denA})` : `Fraction A (${numA}/${denA})`}
          </p>
          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>{isHi ? 'अंश (ऊपर)' : 'Numerator (Top)'}</span>
              <span className="font-math font-bold">{numA}</span>
            </div>
            <input
              type="range"
              min={1}
              max={denA}
              value={numA}
              onChange={(e) => setNumA(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </label>
          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>{isHi ? 'हर (नीचे)' : 'Denominator (Bottom)'}</span>
              <span className="font-math font-bold">{denA}</span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              value={denA}
              onChange={(e) => {
                const nextDen = Number(e.target.value);
                setDenA(nextDen);
                if (numA > nextDen) setNumA(nextDen);
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </label>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-emerald-700">
            {isHi ? `भिन्न B (${numB}/${denB})` : `Fraction B (${numB}/${denB})`}
          </p>
          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>{isHi ? 'अंश (ऊपर)' : 'Numerator (Top)'}</span>
              <span className="font-math font-bold">{numB}</span>
            </div>
            <input
              type="range"
              min={1}
              max={denB}
              value={numB}
              onChange={(e) => setNumB(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </label>
          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>{isHi ? 'हर (नीचे)' : 'Denominator (Bottom)'}</span>
              <span className="font-math font-bold">{denB}</span>
            </div>
            <input
              type="range"
              min={2}
              max={12}
              value={denB}
              onChange={(e) => {
                const nextDen = Number(e.target.value);
                setDenB(nextDen);
                if (numB > nextDen) setNumB(nextDen);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
