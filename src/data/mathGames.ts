import type { ClassNumber } from './mathsMaster';

export type MiniGameId =
  | 'balloon'
  | 'detective'
  | 'compare'
  | 'rocket'
  | 'tableHero'
  | 'clockMaster';

export interface MiniGameMeta {
  id: MiniGameId;
  titleEn: string;
  titleHi: string;
  taglineEn: string;
  taglineHi: string;
  badgeEn: string;
  badgeHi: string;
  gradientClass: string;
  borderBottomColor: string;
  accentHex: string;
}

export const MINI_GAMES: MiniGameMeta[] = [
  {
    id: 'balloon',
    titleEn: 'Balloon Pop Maths',
    titleHi: 'गुब्बारा फोड़ गणित',
    taglineEn: 'Tap the balloon with the right answer before it floats away!',
    taglineHi: 'गुब्बारे उड़ने से पहले सही उत्तर वाला गुब्बारा फोड़ें!',
    badgeEn: '8 Rounds · Reflex',
    badgeHi: '8 चरण · तेज़ नज़र',
    gradientClass: 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600',
    borderBottomColor: '#BE123C',
    accentHex: '#E11D48',
  },
  {
    id: 'detective',
    titleEn: 'Missing Number Detective',
    titleHi: 'लापता संख्या जासूस',
    taglineEn: 'Crack fill-in-the-blank puzzles like 14 + [ ? ] = 22.',
    taglineHi: '14 + [ ? ] = 22 जैसी खाली जगह वाली पहेलियाँ सुलझाएँ।',
    badgeEn: '8 Cases · Logic',
    badgeHi: '8 पहेलियाँ · तर्क',
    gradientClass: 'bg-gradient-to-br from-indigo-400 via-indigo-500 to-blue-700',
    borderBottomColor: '#3730A3',
    accentHex: '#4F46E5',
  },
  {
    id: 'compare',
    titleEn: 'Compare & Win (<, >, =)',
    titleHi: 'तुलना करें और जीतें (<, >, =)',
    taglineEn: 'Compare two math expressions and tap <, =, or >.',
    taglineHi: 'दो गणित समीकरणों की तुलना करें और <, = या > चुनें।',
    badgeEn: '10 Rounds · Speed',
    badgeHi: '10 चरण · गति',
    gradientClass: 'bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600',
    borderBottomColor: '#0E7490',
    accentHex: '#0891B2',
  },
  {
    id: 'rocket',
    titleEn: '60-Second Rocket Launch',
    titleHi: '60-सेकंड रॉकेट लॉन्च',
    taglineEn: 'Answer fast for 60 seconds to fuel and blast off your rocket!',
    taglineHi: 'रॉकेट में ईंधन भरने और अंतरिक्ष में भेजने के लिए 60 सेकंड में तेज़ उत्तर दें!',
    badgeEn: '60s Sprint · Space',
    badgeHi: '60 सेकंड · अंतरिक्ष',
    gradientClass: 'bg-gradient-to-br from-amber-400 via-orange-500 to-red-600',
    borderBottomColor: '#C2410C',
    accentHex: '#EA580C',
  },
  {
    id: 'tableHero',
    titleEn: 'Multiplication Table Hero',
    titleHi: 'पहाड़ा हीरो (Tables 2–20)',
    taglineEn: 'Master tables 2 to 20 or Mixed Tables and build combo streaks!',
    taglineHi: '2 से 20 तक के पहाड़े या मिश्रित पहाड़े सीखें और कॉम्बो स्ट्रीक बनाएँ!',
    badgeEn: '10 Rounds · Combo',
    badgeHi: '10 चरण · कॉम्बो',
    gradientClass: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-700',
    borderBottomColor: '#047857',
    accentHex: '#059669',
  },
  {
    id: 'clockMaster',
    titleEn: 'Clock & Time Master',
    titleHi: 'घड़ी और समय मास्टर',
    taglineEn: 'Read the colorful analog clock and match the exact digital time!',
    taglineHi: 'रंगीन एनालॉग घड़ी देखकर सही डिजिटल समय पहचानें!',
    badgeEn: '8 Clocks · Time',
    badgeHi: '8 घड़ियाँ · समय',
    gradientClass: 'bg-gradient-to-br from-fuchsia-500 via-purple-500 to-violet-700',
    borderBottomColor: '#6D28D9',
    accentHex: '#7C3AED',
  },
];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueFourOptions(correct: number): number[] {
  const set = new Set<number>([correct]);
  const spread = correct >= 100 ? Math.max(4, Math.floor(correct / 15)) : 1;
  const offsets = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 8, -8, 10, -10];
  let guard = 0;
  while (set.size < 4 && guard < 80) {
    guard++;
    const candidate = correct + offsets[randInt(0, offsets.length - 1)] * spread;
    if (candidate >= 0 && candidate !== correct) {
      set.add(candidate);
    }
  }
  let bump = 1;
  while (set.size < 4) {
    if (!set.has(correct + bump)) set.add(correct + bump);
    bump++;
  }
  return shuffle(Array.from(set));
}

export interface QuickArithmeticPrompt {
  prompt: string;
  answer: number;
  options: number[];
}

/**
 * Generates fast mental math prompts scaled for Classes 1 to 5 (used by Balloon Pop & Rocket Launch).
 */
export function generateQuickPrompt(classNumber: ClassNumber): QuickArithmeticPrompt {
  const opRoll = Math.random();
  let a = 0;
  let b = 0;
  let symbol = '+';
  let answer = 0;

  if (classNumber === 1) {
    if (opRoll < 0.6) {
      a = randInt(1, 9);
      b = randInt(1, 9);
      symbol = '+';
      answer = a + b;
    } else {
      a = randInt(5, 15);
      b = randInt(1, a - 1);
      symbol = '−';
      answer = a - b;
    }
  } else if (classNumber === 2) {
    if (opRoll < 0.45) {
      a = randInt(10, 45);
      b = randInt(5, 29);
      symbol = '+';
      answer = a + b;
    } else if (opRoll < 0.8) {
      a = randInt(25, 65);
      b = randInt(6, a - 4);
      symbol = '−';
      answer = a - b;
    } else {
      a = randInt(2, 5);
      b = randInt(2, 5);
      symbol = '×';
      answer = a * b;
    }
  } else if (classNumber === 3) {
    if (opRoll < 0.3) {
      a = randInt(24, 95);
      b = randInt(14, 65);
      symbol = '+';
      answer = a + b;
    } else if (opRoll < 0.55) {
      a = randInt(50, 140);
      b = randInt(15, a - 12);
      symbol = '−';
      answer = a - b;
    } else if (opRoll < 0.85) {
      a = randInt(3, 10);
      b = randInt(2, 9);
      symbol = '×';
      answer = a * b;
    } else {
      b = randInt(2, 8);
      answer = randInt(2, 9);
      a = b * answer;
      symbol = '÷';
    }
  } else if (classNumber === 4) {
    if (opRoll < 0.25) {
      a = randInt(110, 420);
      b = randInt(45, 240);
      symbol = '+';
      answer = a + b;
    } else if (opRoll < 0.5) {
      a = randInt(200, 620);
      b = randInt(60, a - 40);
      symbol = '−';
      answer = a - b;
    } else if (opRoll < 0.8) {
      a = randInt(5, 14);
      b = randInt(3, 12);
      symbol = '×';
      answer = a * b;
    } else {
      b = randInt(3, 12);
      answer = randInt(4, 15);
      a = b * answer;
      symbol = '÷';
    }
  } else {
    // Class 5
    if (opRoll < 0.25) {
      a = randInt(250, 950);
      b = randInt(125, 680);
      symbol = '+';
      answer = a + b;
    } else if (opRoll < 0.5) {
      a = randInt(450, 1200);
      b = randInt(120, a - 90);
      symbol = '−';
      answer = a - b;
    } else if (opRoll < 0.8) {
      a = randInt(11, 26);
      b = randInt(4, 14);
      symbol = '×';
      answer = a * b;
    } else {
      b = randInt(4, 15);
      answer = randInt(6, 25);
      a = b * answer;
      symbol = '÷';
    }
  }

  return {
    prompt: `${a} ${symbol} ${b} = ?`,
    answer,
    options: uniqueFourOptions(answer),
  };
}

export interface DetectiveCase {
  leftDisplay: string;
  missingPosition: 'left' | 'middle';
  operatorSymbol: string;
  rightDisplay: string;
  resultDisplay: number;
  missingValue: number;
  options: number[];
  solvedEquation: string;
}

/**
 * Generates fill-in-the-blank equations like `14 + [ ? ] = 22` or `6 × [ ? ] = 42`.
 */
export function generateDetectiveCase(classNumber: ClassNumber): DetectiveCase {
  const modeRoll = Math.random();
  let left = 0;
  let middle = 0;
  let result = 0;
  let symbol = '+';
  const missingPosition: 'left' | 'middle' = Math.random() < 0.72 ? 'middle' : 'left';

  if (classNumber === 1) {
    if (modeRoll < 0.65) {
      left = randInt(2, 11);
      middle = randInt(2, 9);
      result = left + middle;
      symbol = '+';
    } else {
      left = randInt(8, 18);
      middle = randInt(2, left - 2);
      result = left - middle;
      symbol = '−';
    }
  } else if (classNumber === 2) {
    if (modeRoll < 0.5) {
      left = randInt(8, 35);
      middle = randInt(4, 24);
      result = left + middle;
      symbol = '+';
    } else if (modeRoll < 0.8) {
      left = randInt(24, 60);
      middle = randInt(5, left - 6);
      result = left - middle;
      symbol = '−';
    } else {
      left = randInt(2, 6);
      middle = randInt(2, 6);
      result = left * middle;
      symbol = '×';
    }
  } else if (classNumber === 3) {
    if (modeRoll < 0.35) {
      left = randInt(15, 75);
      middle = randInt(12, 48);
      result = left + middle;
      symbol = '+';
    } else if (modeRoll < 0.6) {
      left = randInt(45, 110);
      middle = randInt(12, left - 15);
      result = left - middle;
      symbol = '−';
    } else {
      left = randInt(3, 10);
      middle = randInt(3, 10);
      result = left * middle;
      symbol = '×';
    }
  } else if (classNumber === 4) {
    if (modeRoll < 0.3) {
      left = randInt(60, 240);
      middle = randInt(25, 140);
      result = left + middle;
      symbol = '+';
    } else if (modeRoll < 0.55) {
      left = randInt(120, 380);
      middle = randInt(35, left - 40);
      result = left - middle;
      symbol = '−';
    } else if (modeRoll < 0.85) {
      left = randInt(4, 12);
      middle = randInt(4, 12);
      result = left * middle;
      symbol = '×';
    } else {
      middle = randInt(3, 9);
      result = randInt(4, 12);
      left = middle * result;
      symbol = '÷';
    }
  } else {
    if (modeRoll < 0.25) {
      left = randInt(150, 580);
      middle = randInt(65, 340);
      result = left + middle;
      symbol = '+';
    } else if (modeRoll < 0.5) {
      left = randInt(320, 880);
      middle = randInt(90, left - 80);
      result = left - middle;
      symbol = '−';
    } else if (modeRoll < 0.8) {
      left = randInt(8, 18);
      middle = randInt(4, 12);
      result = left * middle;
      symbol = '×';
    } else {
      middle = randInt(4, 12);
      result = randInt(6, 18);
      left = middle * result;
      symbol = '÷';
    }
  }

  const missingValue = missingPosition === 'left' ? left : middle;
  return {
    leftDisplay: missingPosition === 'left' ? '[ ? ]' : String(left),
    missingPosition,
    operatorSymbol: symbol,
    rightDisplay: missingPosition === 'middle' ? '[ ? ]' : String(middle),
    resultDisplay: result,
    missingValue,
    options: uniqueFourOptions(missingValue),
    solvedEquation: `${left} ${symbol} ${middle} = ${result}`,
  };
}

export type CompareSign = '<' | '=' | '>';

export interface CompareChallenge {
  leftExpr: string;
  rightExpr: string;
  leftVal: number;
  rightVal: number;
  answer: CompareSign;
}

function buildExpressionForTarget(
  classNumber: ClassNumber,
  targetVal?: number
): { expr: string; val: number } {
  if (targetVal !== undefined && targetVal >= 2) {
    // Build an alternate expression that evaluates to exact targetVal
    if (classNumber >= 3 && targetVal >= 6 && targetVal <= 144) {
      for (let d = 2; d <= 12; d++) {
        if (targetVal % d === 0 && targetVal / d >= 2 && targetVal / d <= 14) {
          if (Math.random() < 0.55) {
            return { expr: `${d} × ${targetVal / d}`, val: targetVal };
          }
        }
      }
    }
    if (Math.random() < 0.5 && targetVal >= 4) {
      const split = randInt(1, Math.max(1, Math.min(targetVal - 1, Math.floor(targetVal * 0.65))));
      return { expr: `${split} + ${targetVal - split}`, val: targetVal };
    }
    const bump = randInt(2, classNumber <= 2 ? 12 : 35);
    return { expr: `${targetVal + bump} − ${bump}`, val: targetVal };
  }

  const prompt = generateQuickPrompt(classNumber);
  return {
    expr: prompt.prompt.replace(' = ?', ''),
    val: prompt.answer,
  };
}

/**
 * Generates side-by-side expressions for Compare & Win (<, =, >) with balanced outcomes.
 */
export function generateCompareChallenge(classNumber: ClassNumber): CompareChallenge {
  const desiredRoll = Math.random();
  const base = buildExpressionForTarget(classNumber);

  // ~30% equal, ~35% greater, ~35% less
  if (desiredRoll < 0.3 && base.val >= 4) {
    let partner = buildExpressionForTarget(classNumber, base.val);
    if (partner.expr === base.expr && base.val >= 4) {
      partner = { expr: `${base.val + 3} − 3`, val: base.val };
    }
    return {
      leftExpr: base.expr,
      rightExpr: partner.expr,
      leftVal: base.val,
      rightVal: partner.val,
      answer: '=',
    };
  }

  const deltaRange = classNumber === 1 ? 4 : classNumber === 2 ? 8 : 16;
  const offset = randInt(1, deltaRange) * (desiredRoll < 0.65 ? 1 : -1);
  const desiredRight = Math.max(2, base.val + offset);
  const rightSide = buildExpressionForTarget(
    classNumber,
    desiredRight === base.val ? base.val + 2 : desiredRight
  );

  const answer: CompareSign =
    base.val < rightSide.val ? '<' : base.val > rightSide.val ? '>' : '=';

  return {
    leftExpr: base.expr,
    rightExpr: rightSide.expr,
    leftVal: base.val,
    rightVal: rightSide.val,
    answer,
  };
}

export function getClassTableRange(classNumber: ClassNumber): [number, number] {
  const map: Record<ClassNumber, [number, number]> = {
    1: [2, 4],
    2: [2, 6],
    3: [2, 10],
    4: [4, 15],
    5: [6, 20],
  };
  return map[classNumber];
}

export interface TableHeroPrompt {
  tableNum: number;
  multiplier: number;
  prompt: string;
  answer: number;
  options: number[];
}

/**
 * Generates Multiplication Table Hero questions for Tables 2..20 or Class-adapted Mixed Tables.
 */
export function generateTableHeroPrompt(
  classNumber: ClassNumber,
  selectedTable: number | 'MIXED'
): TableHeroPrompt {
  const [minT, maxT] = getClassTableRange(classNumber);
  const tableNum = selectedTable === 'MIXED' ? randInt(minT, maxT) : selectedTable;
  const maxMult = classNumber === 1 ? 5 : classNumber === 2 ? 8 : 10;
  const multiplier = randInt(1, maxMult);
  const answer = tableNum * multiplier;

  // Build smart table-neighbor distractors + uniqueFourOptions fallback
  const distractorSet = new Set<number>([answer]);
  const candidates = [
    tableNum * Math.max(1, multiplier - 1),
    tableNum * (multiplier + 1),
    (tableNum + 1) * multiplier,
    Math.max(2, tableNum - 1) * multiplier,
    answer + 2,
    Math.max(1, answer - 2),
    answer + 10,
  ];
  for (const cand of shuffle(candidates)) {
    if (distractorSet.size >= 4) break;
    if (cand > 0 && cand !== answer) {
      distractorSet.add(cand);
    }
  }
  let extra = 1;
  while (distractorSet.size < 4) {
    if (!distractorSet.has(answer + extra)) distractorSet.add(answer + extra);
    extra++;
  }

  return {
    tableNum,
    multiplier,
    prompt: `${tableNum} × ${multiplier} = ?`,
    answer,
    options: shuffle(Array.from(distractorSet)),
  };
}

export interface ClockChallenge {
  hours: number;
  minutes: number;
  correctTime: string;
  options: string[];
  explanationEn: string;
  explanationHi: string;
}

export function formatDigitalTime(hours: number, minutes: number): string {
  return `${hours}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Generates Clock & Time Master challenges adapted by Class 1 to 5.
 */
export function generateClockChallenge(classNumber: ClassNumber): ClockChallenge {
  const hours = randInt(1, 12);
  let minutes = 0;

  if (classNumber === 1) {
    minutes = Math.random() < 0.65 ? 0 : 30;
  } else if (classNumber === 2) {
    const quarters = [0, 15, 30, 45];
    minutes = quarters[randInt(0, quarters.length - 1)];
  } else if (classNumber === 3) {
    minutes = randInt(0, 11) * 5;
  } else if (classNumber === 4) {
    // Mix of 5-min and 1-min times
    minutes = Math.random() < 0.6 ? randInt(0, 11) * 5 : randInt(0, 59);
  } else {
    minutes = randInt(0, 59);
  }

  const correctTime = formatDigitalTime(hours, minutes);
  const optionSet = new Set<string>([correctTime]);

  const neighborOffsets =
    classNumber <= 2
      ? [
          [0, 30],
          [0, 15],
          [1, 0],
          [-1, 0],
          [0, 45],
          [2, 0],
        ]
      : classNumber === 3
        ? [
            [0, 5],
            [0, -5],
            [1, 0],
            [-1, 0],
            [0, 15],
            [0, -15],
          ]
        : [
            [0, 5],
            [0, -5],
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
          ];

  for (const [dh, dm] of shuffle(neighborOffsets)) {
    if (optionSet.size >= 4) break;
    const candH = ((hours - 1 + dh + 12) % 12) + 1;
    let candM = (minutes + dm + 60) % 60;
    if (classNumber === 1) candM = candM < 15 || candM >= 45 ? 0 : 30;
    if (classNumber === 2) candM = Math.round(candM / 15) * 15 % 60;
    const cand = formatDigitalTime(candH, candM);
    if (cand !== correctTime) optionSet.add(cand);
  }

  let guard = 0;
  while (optionSet.size < 4 && guard < 40) {
    guard++;
    const rh = randInt(1, 12);
    const rm =
      classNumber === 1
        ? 0
        : classNumber === 2
          ? [0, 15, 30, 45][randInt(0, 3)]
          : classNumber === 3
            ? randInt(0, 11) * 5
            : randInt(0, 59);
    optionSet.add(formatDigitalTime(rh, rm));
  }

  const minuteWordEn =
    minutes === 0
      ? 'on 12 (00 minutes)'
      : minutes % 5 === 0
        ? `on ${minutes === 0 ? 12 : minutes / 5} (${minutes} minutes)`
        : `at ${minutes} minutes`;
  const minuteWordHi =
    minutes === 0
      ? '12 पर (00 मिनट)'
      : minutes % 5 === 0
        ? `${minutes / 5} पर (${minutes} मिनट)`
        : `${minutes} मिनट पर`;

  return {
    hours,
    minutes,
    correctTime,
    options: shuffle(Array.from(optionSet)),
    explanationEn: `Hour hand is ${minutes === 0 ? 'on' : 'past'} ${hours}, and Minute hand is ${minuteWordEn} → ${correctTime}.`,
    explanationHi: `घंटे की सुई ${hours} ${minutes === 0 ? 'पर' : 'के पार'} है और मिनट की सुई ${minuteWordHi} है → ${correctTime}।`,
  };
}

