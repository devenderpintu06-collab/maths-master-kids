import type { ClassNumber, MathOperation } from './mathsMaster';

export interface WorksheetQuestion {
  number: number;
  text: string;
}

export interface MathWorksheet {
  id: string;
  classNumber: ClassNumber;
  operation: MathOperation;
  symbol: string;
  worksheetNumber: 1 | 2;
  titleEn: string;
  titleHi: string;
  focusEn: string;
  focusHi: string;
  questions: WorksheetQuestion[];
}

function createRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function seededShuffle<T>(items: T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const OP_META: Record<
  MathOperation,
  { symbol: string; en: string; hi: string; shortCode: string }
> = {
  ADDITION: { symbol: '+', en: 'Addition', hi: 'जोड़', shortCode: 'add' },
  SUBTRACTION: { symbol: '−', en: 'Subtraction', hi: 'घटाव', shortCode: 'sub' },
  MULTIPLICATION: { symbol: '×', en: 'Multiplication', hi: 'गुणा', shortCode: 'mul' },
  DIVISION: { symbol: '÷', en: 'Division', hi: 'भाग', shortCode: 'div' },
};

const FOCUS_DESCRIPTIONS: Record<
  ClassNumber,
  Record<MathOperation, { ws1En: string; ws1Hi: string; ws2En: string; ws2Hi: string }>
> = {
  1: {
    ADDITION: {
      ws1En: 'Single-digit sums within 12',
      ws1Hi: '12 तक एक-अंकीय जोड़',
      ws2En: 'Sums up to 20 & counting on',
      ws2Hi: '20 तक जोड़ अभ्यास',
    },
    SUBTRACTION: {
      ws1En: 'Taking away within 10',
      ws1Hi: '10 तक सरल घटाव',
      ws2En: 'Subtracting single digits from teens (up to 20)',
      ws2Hi: '20 तक की संख्याओं से घटाव',
    },
    MULTIPLICATION: {
      ws1En: 'Introductory tables of 1, 2, and 3',
      ws1Hi: '1, 2 और 3 का प्रारंभिक पहाड़ा',
      ws2En: 'Equal groups using tables of 4 and 5',
      ws2Hi: '4 और 5 के पहाड़े का अभ्यास',
    },
    DIVISION: {
      ws1En: 'Equal sharing by 1, 2, and 3',
      ws1Hi: '1, 2 और 3 से बराबर भाग',
      ws2En: 'Equal sharing by 4, 5, and 6',
      ws2Hi: '4, 5 और 6 से बराबर भाग',
    },
  },
  2: {
    ADDITION: {
      ws1En: '2-digit addition without carry',
      ws1Hi: 'बिना हासिल 2-अंकीय जोड़',
      ws2En: '2-digit addition with regrouping (carry)',
      ws2Hi: 'हासिल सहित 2-अंकीय जोड़',
    },
    SUBTRACTION: {
      ws1En: '2-digit subtraction without borrow',
      ws1Hi: 'बिना उधार 2-अंकीय घटाव',
      ws2En: '2-digit subtraction with borrowing',
      ws2Hi: 'उधार सहित 2-अंकीय घटाव',
    },
    MULTIPLICATION: {
      ws1En: 'Multiplication tables 2 to 5',
      ws1Hi: '2 से 5 तक के पहाड़े',
      ws2En: 'Multiplication tables 6 to 10',
      ws2Hi: '6 से 10 तक के पहाड़े',
    },
    DIVISION: {
      ws1En: 'Exact division facts (tables 2 to 5)',
      ws1Hi: '2 से 5 के पहाड़े पर आधारित भाग',
      ws2En: 'Exact division facts (tables 6 to 10)',
      ws2Hi: '6 से 10 के पहाड़े पर आधारित भाग',
    },
  },
  3: {
    ADDITION: {
      ws1En: '3-digit addition without carrying',
      ws1Hi: 'बिना हासिल 3-अंकीय जोड़',
      ws2En: '3-digit addition with carrying',
      ws2Hi: 'हासिल सहित 3-अंकीय जोड़',
    },
    SUBTRACTION: {
      ws1En: '3-digit subtraction without borrowing',
      ws1Hi: 'बिना उधार 3-अंकीय घटाव',
      ws2En: '3-digit subtraction with borrowing',
      ws2Hi: 'उधार सहित 3-अंकीय घटाव',
    },
    MULTIPLICATION: {
      ws1En: 'Times tables 2 to 12 mastery',
      ws1Hi: '2 से 12 तक पहाड़ों का अभ्यास',
      ws2En: '2-digit × 1-digit multiplication',
      ws2Hi: '2-अंकीय × 1-अंकीय गुणा',
    },
    DIVISION: {
      ws1En: 'Division facts with divisors 2 to 10',
      ws1Hi: '2 से 10 से सटीक भाग',
      ws2En: '2-digit & 3-digit ÷ 1-digit division',
      ws2Hi: 'बड़े भाग अभ्यास (1-अंकीय भाजक)',
    },
  },
  4: {
    ADDITION: {
      ws1En: '4-digit + 3-digit & 4-digit addition',
      ws1Hi: '3 और 4-अंकीय संख्याओं का जोड़',
      ws2En: 'Multi-carry 4-digit + 4-digit sums',
      ws2Hi: 'हासिल सहित 4-अंकीय बड़ा जोड़',
    },
    SUBTRACTION: {
      ws1En: '4-digit − 3-digit subtraction practice',
      ws1Hi: '4-अंकीय संख्या से 3-अंकीय घटाव',
      ws2En: '4-digit − 4-digit borrowing challenge',
      ws2Hi: 'उधार सहित 4-अंकीय घटाव चुनौती',
    },
    MULTIPLICATION: {
      ws1En: 'Tables 11–16 & 2-digit × 1-digit',
      ws1Hi: '11–16 पहाड़े और 2-अंकीय × 1-अंकीय गुणा',
      ws2En: '3-digit × 1-digit & 2-digit × 2-digit',
      ws2Hi: '3-अंकीय × 1-अंकीय व 2-अंकीय × 2-अंकीय गुणा',
    },
    DIVISION: {
      ws1En: '3-digit ÷ 1-digit exact division',
      ws1Hi: '3-अंकीय संख्या को 1-अंकीय संख्या से भाग',
      ws2En: '3-digit ÷ 2-digit exact division',
      ws2Hi: '3-अंकीय संख्या को 2-अंकीय संख्या से भाग',
    },
  },
  5: {
    ADDITION: {
      ws1En: '4-digit multi-carry sums',
      ws1Hi: '4-अंकीय संख्याओं का बहु-हासिल जोड़',
      ws2En: '5-digit large-number addition',
      ws2Hi: '5-अंकीय बड़ी संख्याओं का जोड़',
    },
    SUBTRACTION: {
      ws1En: '4-digit multi-borrow subtraction',
      ws1Hi: '4-अंकीय बहु-उधार घटाव',
      ws2En: '5-digit large-number subtraction',
      ws2Hi: '5-अंकीय बड़ी संख्याओं का घटाव',
    },
    MULTIPLICATION: {
      ws1En: '3-digit × 1-digit & 2-digit × 2-digit',
      ws1Hi: '3-अंकीय × 1-अंकीय व 2-अंकीय × 2-अंकीय गुणा',
      ws2En: '3-digit × 2-digit advanced multiplication',
      ws2Hi: '3-अंकीय × 2-अंकीय उच्च गुणा अभ्यास',
    },
    DIVISION: {
      ws1En: '3-digit & 4-digit ÷ 1-digit division',
      ws1Hi: '3 व 4-अंकीय संख्याओं का 1-अंकीय भाग',
      ws2En: '3-digit & 4-digit ÷ 2-digit division',
      ws2Hi: '3 व 4-अंकीय संख्याओं का 2-अंकीय भाग',
    },
  },
};

function makeNoCarryNumbers(rng: () => number, digits: number): [number, number] {
  let a = 0;
  let b = 0;
  for (let d = 0; d < digits; d++) {
    const isTop = d === digits - 1;
    const minD = isTop ? 1 : 0;
    const da = rngInt(rng, minD, isTop ? 5 : 6);
    const db = rngInt(rng, minD, 9 - da);
    const place = 10 ** d;
    a += da * place;
    b += db * place;
  }
  return [a, b];
}

function makeNoBorrowNumbers(rng: () => number, digits: number): [number, number] {
  let a = 0;
  let b = 0;
  for (let d = 0; d < digits; d++) {
    const isTop = d === digits - 1;
    const da = rngInt(rng, isTop ? 3 : 2, 9);
    const db = isTop ? rngInt(rng, 1, da - 1) : rngInt(rng, 0, da);
    const place = 10 ** d;
    a += da * place;
    b += db * place;
  }
  return [a, b];
}

function generateEquationPair(
  rng: () => number,
  classNumber: ClassNumber,
  operation: MathOperation,
  wsNum: 1 | 2
): [number, number] {
  if (operation === 'ADDITION') {
    if (classNumber === 1) {
      if (wsNum === 1) {
        const a = rngInt(rng, 1, 8);
        const b = rngInt(rng, 1, Math.min(8, 12 - a));
        return [a, b];
      }
      const a = rngInt(rng, 5, 14);
      const b = rngInt(rng, Math.max(2, 10 - a), Math.min(9, 20 - a));
      return [a, b];
    }
    if (classNumber === 2) {
      if (wsNum === 1) return makeNoCarryNumbers(rng, 2);
      const a0 = rngInt(rng, 3, 9);
      const b0 = rngInt(rng, 10 - a0, 9);
      return [rngInt(rng, 1, 6) * 10 + a0, rngInt(rng, 1, 6) * 10 + b0];
    }
    if (classNumber === 3) {
      if (wsNum === 1) {
        const [a, b] = makeNoCarryNumbers(rng, 3);
        return [a, b];
      }
      return [rngInt(rng, 145, 689), rngInt(rng, 125, 498)];
    }
    if (classNumber === 4) {
      if (wsNum === 1) return [rngInt(rng, 1020, 4850), rngInt(rng, 210, 980)];
      return [rngInt(rng, 1450, 5890), rngInt(rng, 1250, 4950)];
    }
    // Class 5
    if (wsNum === 1) return [rngInt(rng, 2450, 7890), rngInt(rng, 1650, 6980)];
    return [rngInt(rng, 12450, 48950), rngInt(rng, 8250, 36850)];
  }

  if (operation === 'SUBTRACTION') {
    if (classNumber === 1) {
      if (wsNum === 1) {
        const a = rngInt(rng, 3, 10);
        const b = rngInt(rng, 1, a - 1);
        return [a, b];
      }
      const a = rngInt(rng, 11, 20);
      const b = rngInt(rng, 1, 9);
      return [a, b];
    }
    if (classNumber === 2) {
      if (wsNum === 1) return makeNoBorrowNumbers(rng, 2);
      const a0 = rngInt(rng, 0, 6);
      const b0 = rngInt(rng, a0 + 1, 9);
      const bTens = rngInt(rng, 1, 4);
      const aTens = bTens + rngInt(rng, 1, 4);
      return [aTens * 10 + a0, bTens * 10 + b0];
    }
    if (classNumber === 3) {
      if (wsNum === 1) return makeNoBorrowNumbers(rng, 3);
      const b = rngInt(rng, 125, 468);
      const diff = rngInt(rng, 135, 480);
      return [b + diff, b];
    }
    if (classNumber === 4) {
      if (wsNum === 1) {
        const b = rngInt(rng, 215, 890);
        const a = rngInt(rng, 1200, 4800);
        return [a, b];
      }
      const b = rngInt(rng, 1150, 3890);
      const diff = rngInt(rng, 1120, 3950);
      return [b + diff, b];
    }
    // Class 5
    if (wsNum === 1) {
      const b = rngInt(rng, 1450, 4890);
      const diff = rngInt(rng, 1350, 4850);
      return [b + diff, b];
    }
    const b = rngInt(rng, 8450, 28950);
    const diff = rngInt(rng, 9120, 34500);
    return [b + diff, b];
  }

  if (operation === 'MULTIPLICATION') {
    if (classNumber === 1) {
      if (wsNum === 1) return [rngInt(rng, 1, 3), rngInt(rng, 1, 9)];
      return [rngInt(rng, 4, 5), rngInt(rng, 1, 9)];
    }
    if (classNumber === 2) {
      if (wsNum === 1) return [rngInt(rng, 2, 5), rngInt(rng, 2, 10)];
      return [rngInt(rng, 6, 10), rngInt(rng, 2, 10)];
    }
    if (classNumber === 3) {
      if (wsNum === 1) return [rngInt(rng, 3, 12), rngInt(rng, 2, 12)];
      return [rngInt(rng, 13, 49), rngInt(rng, 3, 9)];
    }
    if (classNumber === 4) {
      if (wsNum === 1) {
        return rng() < 0.5 ? [rngInt(rng, 11, 16), rngInt(rng, 3, 10)] : [rngInt(rng, 22, 68), rngInt(rng, 4, 9)];
      }
      return rng() < 0.5 ? [rngInt(rng, 112, 295), rngInt(rng, 3, 8)] : [rngInt(rng, 14, 42), rngInt(rng, 11, 24)];
    }
    // Class 5
    if (wsNum === 1) {
      return rng() < 0.5 ? [rngInt(rng, 135, 485), rngInt(rng, 4, 9)] : [rngInt(rng, 22, 68), rngInt(rng, 12, 34)];
    }
    return [rngInt(rng, 115, 345), rngInt(rng, 12, 28)];
  }

  // DIVISION (always exact integer quotient, zero remainder)
  if (classNumber === 1) {
    if (wsNum === 1) {
      const pairs: [number, number][] = [];
      for (let q = 1; q <= 10; q++) pairs.push([2 * q, 2]);
      for (let q = 1; q <= 6; q++) pairs.push([3 * q, 3]);
      for (let q = 2; q <= 9; q++) pairs.push([q, 1]);
      return pairs[rngInt(rng, 0, pairs.length - 1)];
    }
    const pairs: [number, number][] = [];
    for (let q = 1; q <= 6; q++) pairs.push([4 * q, 4]);
    for (let q = 1; q <= 6; q++) pairs.push([5 * q, 5]);
    for (let q = 1; q <= 4; q++) pairs.push([6 * q, 6]);
    for (let q = 7; q <= 10; q++) pairs.push([3 * q, 3]);
    return pairs[rngInt(rng, 0, pairs.length - 1)];
  }
  if (classNumber === 2) {
    const divisor = wsNum === 1 ? rngInt(rng, 2, 5) : rngInt(rng, 6, 10);
    const quotient = rngInt(rng, 2, 10);
    return [divisor * quotient, divisor];
  }
  if (classNumber === 3) {
    if (wsNum === 1) {
      const divisor = rngInt(rng, 2, 10);
      const quotient = rngInt(rng, 3, 12);
      return [divisor * quotient, divisor];
    }
    const divisor = rngInt(rng, 4, 9);
    const quotient = rngInt(rng, 12, 28);
    return [divisor * quotient, divisor];
  }
  if (classNumber === 4) {
    if (wsNum === 1) {
      const divisor = rngInt(rng, 3, 9);
      const quotient = rngInt(rng, 18, 55);
      return [divisor * quotient, divisor];
    }
    const divisor = rngInt(rng, 11, 18);
    const quotient = rngInt(rng, 8, 22);
    return [divisor * quotient, divisor];
  }
  // Class 5
  if (wsNum === 1) {
    const divisor = rngInt(rng, 4, 9);
    const quotient = rngInt(rng, 45, 165);
    return [divisor * quotient, divisor];
  }
  const divisor = rngInt(rng, 12, 26);
  const quotient = rngInt(rng, 14, 52);
  return [divisor * quotient, divisor];
}

function buildWorksheetQuestions(
  classNumber: ClassNumber,
  operation: MathOperation,
  wsNum: 1 | 2,
  usedExpressions: Set<string>
): WorksheetQuestion[] {
  const symbol = OP_META[operation].symbol;
  const opIndex = (['ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION'] as MathOperation[]).indexOf(operation);
  const seed = classNumber * 10007 + (opIndex + 1) * 997 + wsNum * 313;
  const rng = createRng(seed);

  const collected: string[] = [];
  let guard = 0;

  while (collected.length < 15 && guard < 1500) {
    guard++;
    const [a, b] = generateEquationPair(rng, classNumber, operation, wsNum);
    const expr = `${a} ${symbol} ${b}`;
    if (!usedExpressions.has(expr)) {
      usedExpressions.add(expr);
      collected.push(expr);
    }
  }

  // Deterministic clean fallback sweep in case dense small-domain pools need remaining unique pairs
  if (collected.length < 15) {
    const fallbackCandidates: string[] = [];
    if (operation === 'MULTIPLICATION') {
      for (let a = 1; a <= 10; a++) {
        for (let b = 1; b <= 10; b++) {
          fallbackCandidates.push(`${a} ${symbol} ${b}`);
        }
      }
    } else if (operation === 'DIVISION') {
      for (let d = 1; d <= 10; d++) {
        for (let q = 1; q <= 10; q++) {
          fallbackCandidates.push(`${d * q} ${symbol} ${d}`);
        }
      }
    } else if (operation === 'ADDITION') {
      for (let a = 1; a <= 20; a++) {
        for (let b = 1; b <= 20; b++) {
          fallbackCandidates.push(`${a} ${symbol} ${b}`);
        }
      }
    } else {
      for (let a = 2; a <= 25; a++) {
        for (let b = 1; b < a; b++) {
          fallbackCandidates.push(`${a} ${symbol} ${b}`);
        }
      }
    }
    for (const candidate of seededShuffle(fallbackCandidates, rng)) {
      if (collected.length >= 15) break;
      if (!usedExpressions.has(candidate)) {
        usedExpressions.add(candidate);
        collected.push(candidate);
      }
    }
  }

  return collected.slice(0, 15).map((text, idx) => ({
    number: idx + 1,
    text,
  }));
}

function generateAllFortyWorksheets(): MathWorksheet[] {
  const classes: ClassNumber[] = [1, 2, 3, 4, 5];
  const ops: MathOperation[] = ['ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION'];
  const all: MathWorksheet[] = [];

  for (const classNumber of classes) {
    for (const operation of ops) {
      const meta = OP_META[operation];
      const focus = FOCUS_DESCRIPTIONS[classNumber][operation];
      const usedExpressions = new Set<string>();

      for (const wsNum of [1, 2] as const) {
        const questions = buildWorksheetQuestions(classNumber, operation, wsNum, usedExpressions);
        all.push({
          id: `c${classNumber}-${meta.shortCode}-${wsNum}`,
          classNumber,
          operation,
          symbol: meta.symbol,
          worksheetNumber: wsNum,
          titleEn: `Class ${classNumber} ${meta.en} — Worksheet ${wsNum}`,
          titleHi: `कक्षा ${classNumber} ${meta.hi} — वर्कशीट ${wsNum}`,
          focusEn: wsNum === 1 ? focus.ws1En : focus.ws2En,
          focusHi: wsNum === 1 ? focus.ws1Hi : focus.ws2Hi,
          questions,
        });
      }
    }
  }

  return all;
}

export const ALL_WORKSHEETS: MathWorksheet[] = generateAllFortyWorksheets();
