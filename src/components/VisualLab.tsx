import { useState } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import { soundFx } from '../utils/sound';

type LabMode = 'number-line' | 'array-area' | 'fraction-compare';

export function VisualLab() {
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
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Visual Math Lab
          </h1>
          <p className="text-slate-600 text-base">
            Slide, build, and explore how numbers, multiplication arrays, and fractions work.
          </p>
        </div>

        {/* Segmented Lab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setMode('number-line');
            }}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'number-line' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Number Line
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setMode('array-area');
            }}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'array-area' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Array & Area
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setMode('fraction-compare');
            }}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'fraction-compare' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fractions
          </button>
        </div>
      </div>

      {/* Two-Zone Sandbox Layout */}
      {mode === 'number-line' && <NumberLineSandbox startNum={startNum} jumpAmount={jumpAmount} setStartNum={setStartNum} setJumpAmount={setJumpAmount} />}

      {mode === 'array-area' && (
        <ArrayAreaSandbox rows={rows} cols={cols} setRows={setRows} setCols={setCols} />
      )}

      {mode === 'fraction-compare' && (
        <FractionSandbox
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
  startNum,
  jumpAmount,
  setStartNum,
  setJumpAmount,
}: {
  startNum: number;
  jumpAmount: number;
  setStartNum: (n: number) => void;
  setJumpAmount: (n: number) => void;
}) {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-slate-500">Class 1–2 · Addition & Subtraction</span>
            <h2 className="text-xl font-bold text-slate-900">Frog Hop Number Line</h2>
          </div>
          <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 font-math text-xl font-bold text-blue-900">
            {startNum} {actualJump >= 0 ? `+ ${actualJump}` : `- ${Math.abs(actualJump)}`} = {clampedEnd}
          </div>
        </div>

        <div className="overflow-x-auto py-4">
          <svg viewBox={`0 0 ${width} 130`} className="w-full min-w-[520px] h-36">
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

        <p className="text-sm text-slate-600">
          Blue dot shows your starting number ({startNum}). Green dot shows where you land ({clampedEnd}) after hopping {steps} {dir >= 0 ? 'forward' : 'backward'}.
        </p>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-6">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Controls</h3>

          <label className="block space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>Start Number</span>
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
              <span>Jump Steps</span>
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
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Number Line
        </button>
      </div>
    </div>
  );
}

function ArrayAreaSandbox({
  rows,
  cols,
  setRows,
  setCols,
}: {
  rows: number;
  cols: number;
  setRows: (n: number) => void;
  setCols: (n: number) => void;
}) {
  const area = rows * cols;
  const perimeter = 2 * (rows + cols);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-slate-500">Class 3–4 · Multiplication & Area</span>
            <h2 className="text-xl font-bold text-slate-900">Array & Area Grid Builder</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 font-math text-lg font-bold text-amber-900">
              {rows} × {cols} = {area}
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-math text-sm font-semibold text-slate-700">
              Perimeter: {perimeter}
            </div>
          </div>
        </div>

        <div className="py-4 overflow-x-auto">
          <div
            className="mx-auto w-fit grid gap-1.5 p-3 rounded-xl bg-slate-50 border-2 border-slate-300"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: area }).map((_, i) => (
              <div
                key={i}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-amber-400 border border-amber-600/30"
              />
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-600">
          {rows} rows with {cols} squares in each row makes {area} square units inside. Try swapping rows and columns to see the commutative property!
        </p>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-6">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Grid Dimensions</h3>

          <label className="block space-y-2">
            <div className="flex justify-between text-sm font-medium text-slate-700">
              <span>Rows (Height)</span>
              <span className="font-math font-bold text-amber-700">{rows} units</span>
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
              <span>Columns (Width)</span>
              <span className="font-math font-bold text-blue-700">{cols} units</span>
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
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Swap Rows & Columns
        </button>
      </div>
    </div>
  );
}

function FractionSandbox({
  numA,
  denA,
  numB,
  denB,
  setNumA,
  setDenA,
  setNumB,
  setDenB,
}: {
  numA: number;
  denA: number;
  numB: number;
  denB: number;
  setNumA: (n: number) => void;
  setDenA: (n: number) => void;
  setNumB: (n: number) => void;
  setDenB: (n: number) => void;
}) {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-slate-500">Class 3–5 · Equivalent & Comparing Fractions</span>
            <h2 className="text-xl font-bold text-slate-900">Fraction Comparison Bars</h2>
          </div>
          <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 font-math text-xl font-bold text-indigo-900">
            {numA}/{denA} {symbol} {numB}/{denB}
          </div>
        </div>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-blue-800">
              <span>Fraction A</span>
              <span className="font-math">
                {numA}/{denA} ({Math.round(valA * 100)}%)
              </span>
            </div>
            {renderBar(numA, denA, 'bg-blue-500')}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-semibold text-emerald-800">
              <span>Fraction B</span>
              <span className="font-math">
                {numB}/{denB} ({Math.round(valB * 100)}%)
              </span>
            </div>
            {renderBar(numB, denB, 'bg-emerald-500')}
          </div>
        </div>

        <p className="text-sm text-slate-600">
          {symbol === '='
            ? `Equivalent fractions! ${numA}/${denA} and ${numB}/${denB} cover the exact same length.`
            : `${valA > valB ? `${numA}/${denA}` : `${numB}/${denB}`} covers a larger share of the whole bar.`}
        </p>
      </div>

      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <h3 className="text-lg font-bold text-slate-900">Adjust Fractions</h3>

        <div className="space-y-3 pb-4 border-b border-slate-100">
          <p className="text-xs font-bold text-blue-700">Fraction A ({numA}/{denA})</p>
          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Numerator (Top)</span>
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
              <span>Denominator (Bottom)</span>
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
          <p className="text-xs font-bold text-emerald-700">Fraction B ({numB}/{denB})</p>
          <label className="block space-y-1">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Numerator (Top)</span>
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
              <span>Denominator (Bottom)</span>
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
