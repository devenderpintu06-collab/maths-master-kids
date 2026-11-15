export type MathOperation = 'ADDITION' | 'SUBTRACTION' | 'MULTIPLICATION' | 'DIVISION';
export type ClassNumber = 1 | 2 | 3 | 4 | 5;
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';
export type AppLanguage = 'en' | 'hi';

export interface OperationMeta {
  id: MathOperation;
  titleEn: string;
  titleHi: string;
  symbol: string;
  bgHex: string;
  taglineEn: string;
  taglineHi: string;
}

export const OPERATIONS: OperationMeta[] = [
  {
    id: 'ADDITION',
    titleEn: 'Addition',
    titleHi: 'Jod (Addition)',
    symbol: '+',
    bgHex: '#059669',
    taglineEn: 'Put numbers together',
    taglineHi: 'Numbers ko milao',
  },
  {
    id: 'SUBTRACTION',
    titleEn: 'Subtraction',
    titleHi: 'Ghatav (Subtraction)',
    symbol: '−',
    bgHex: '#2563EB',
    taglineEn: 'Take away and find difference',
    taglineHi: 'Numbers kam karo',
  },
  {
    id: 'MULTIPLICATION',
    titleEn: 'Multiplication',
    titleHi: 'Guna (Multiply)',
    symbol: '×',
    bgHex: '#D97706',
    taglineEn: 'Equal groups and times tables',
    taglineHi: 'Pahade aur groups',
  },
  {
    id: 'DIVISION',
    titleEn: 'Division',
    titleHi: 'Bhag (Division)',
    symbol: '÷',
    bgHex: '#7C3AED',
    taglineEn: 'Share numbers equally',
    taglineHi: 'Barabar baanto',
  },
];

export const CLASS_LEVELS: { number: ClassNumber; label: string; agesEn: string; agesHi: string }[] = [
  { number: 1, label: 'Class 1', agesEn: 'Ages 6–7', agesHi: '6–7 saal' },
  { number: 2, label: 'Class 2', agesEn: 'Ages 7–8', agesHi: '7–8 saal' },
  { number: 3, label: 'Class 3', agesEn: 'Ages 8–9', agesHi: '8–9 saal' },
  { number: 4, label: 'Class 4', agesEn: 'Ages 9–10', agesHi: '9–10 saal' },
  { number: 5, label: 'Class 5', agesEn: 'Ages 10–11', agesHi: '10–11 saal' },
];

export const DIFFICULTIES: {
  id: DifficultyLevel;
  labelEn: string;
  labelHi: string;
  subEn: string;
  subHi: string;
}[] = [
  { id: 'EASY', labelEn: 'Easy', labelHi: 'Easy', subEn: 'No Carry', subHi: 'Bina Hasil ke' },
  { id: 'MEDIUM', labelEn: 'Medium', labelHi: 'Medium', subEn: 'With Carry', subHi: 'Hasil wala' },
  { id: 'HARD', labelEn: 'Hard', labelHi: 'Hard', subEn: 'Big Numbers', subHi: 'Bade Number' },
];

export const UI_TEXT = {
  en: {
    subtitle: 'Learn Maths with Fun!',
    heroDesc: 'Pick your class (1 to 5), choose a difficulty, and tap any of the four maths games below to start a 10-question quiz.',
    selectClass: '1. Select Your Class',
    selectDiff: '2. Choose Difficulty',
    chooseGame: '3. Choose a Maths Game',
    perQuizNote: '10 Questions per Quiz',
    dailyBadge: 'Daily Practice',
    dailyTitle: 'Mixed 10-Question Daily Challenge',
    dailyDesc: 'Test your skills across Addition, Subtraction, Multiplication, and Division in one fun daily quiz.',
    startDaily: 'Start Daily Practice',
    replayDaily: 'Practice Daily Mix Again',
    chooseAnswer: 'Choose the correct answer',
    needHint: 'Need a Hint? See Visual',
    hideHint: 'Hide Hint',
    listen: 'Listen',
    correctMsg: 'Correct! +1 Star Earned — Great job!',
    wrongMsgPrefix: 'Not quite! Correct answer is',
    understandLabel: 'Understand:',
    nextQuestion: 'Next Question',
    seeFinalScore: 'See Final Score',
    practiceAgain: 'Practice Again',
    backHome: 'Back to Home',
  },
  hi: {
    subtitle: 'Maths Seekho Maze Se!',
    heroDesc: 'Apni class (1 se 5) aur level chuno, game khelo aur har sahi jawab par star jeeto!',
    selectClass: '1. Apni Class Chuno',
    selectDiff: '2. Level Chuno',
    chooseGame: '3. Game Chuno',
    perQuizNote: 'Har Quiz me 10 Sawal',
    dailyBadge: 'Daily Practice',
    dailyTitle: 'Mixed Daily Challenge (10 Sawal)',
    dailyDesc: 'Jod, Ghatav, Guna aur Bhag sab ek sath practice karo aur apna daily streak badhao.',
    startDaily: 'Daily Challenge Shuru Karo',
    replayDaily: 'Daily Mix Dobara Khelo',
    chooseAnswer: 'Sahi jawab chuno',
    needHint: 'Hint Chahiye? Picture Dekho',
    hideHint: 'Hint Chhupao',
    listen: 'Sunno',
    correctMsg: 'Shabash! +1 Star Mila — Bilkul Sahi!',
    wrongMsgPrefix: 'Koi baat nahi! Sahi jawab hai',
    understandLabel: 'Samjho:',
    nextQuestion: 'Agla Sawal',
    seeFinalScore: 'Final Score Dekho',
    practiceAgain: 'Dobara Khelo',
    backHome: 'Home Par Jao',
  },
} as const;

export interface MathsQuestion {
  id: string;
  operandA: number;
  operandB: number;
  operation: MathOperation;
  symbol: string;
  correctAnswer: number;
  options: number[];
  hintEn: string;
  hintHi: string;
  stepsEn: string;
  stepsHi: string;
}

export interface QuizConfig {
  classNumber: ClassNumber;
  difficulty: DifficultyLevel;
  operation: MathOperation | null;
  isDailyPractice: boolean;
}

export interface QuizSummary {
  config: QuizConfig;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  starsEarned: number;
  percentage: number;
}

export interface QuizHistoryEntry {
  id: string;
  completedAt: string;
  classNumber: ClassNumber;
  difficulty: DifficultyLevel;
  operation: MathOperation | null;
  isDailyPractice: boolean;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  starsEarned: number;
}

export interface OperationStats {
  attempted: number;
  correct: number;
  quizzes: number;
}

export interface LocalProgress {
  totalStars: number;
  totalQuizzesCompleted: number;
  totalCorrectAnswers: number;
  totalAttemptedQuestions: number;
  dailyStreak: number;
  lastDailyDate: string;
  selectedClass: ClassNumber;
  selectedDifficulty: DifficultyLevel;
  byOperation: Record<MathOperation, OperationStats>;
  recentQuizzes: QuizHistoryEntry[];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildFourUniqueOptions(correct: number): number[] {
  const set = new Set<number>([correct]);
  const step = correct >= 100 ? Math.max(5, Math.floor(correct / 20)) : 1;
  const deltas = [-4, -3, -2, -1, 1, 2, 3, 4, 5, 10, -10];
  let safety = 0;

  while (set.size < 4 && safety < 60) {
    safety++;
    const delta = deltas[randInt(0, deltas.length - 1)] * step;
    const candidate = correct + delta;
    if (candidate >= 0 && candidate !== correct) {
      set.add(candidate);
    }
  }

  let fallback = 1;
  while (set.size < 4) {
    if (!set.has(correct + fallback)) {
      set.add(correct + fallback);
    }
    fallback++;
  }

  return shuffle(Array.from(set));
}

function makeNoCarryPair(digits: number): [number, number] {
  let a = 0;
  let b = 0;
  for (let d = 0; d < digits; d++) {
    const isTop = d === digits - 1;
    const minD = isTop ? 1 : 0;
    const da = randInt(minD, isTop ? 4 : 5);
    const db = randInt(minD, 9 - da);
    const place = 10 ** d;
    a += da * place;
    b += db * place;
  }
  return [a, b];
}

function makeNoBorrowPair(digits: number): [number, number] {
  let a = 0;
  let b = 0;
  for (let d = 0; d < digits; d++) {
    const isTop = d === digits - 1;
    const da = randInt(isTop ? 3 : 2, 9);
    const db = isTop ? randInt(1, da - 1) : randInt(0, da);
    const place = 10 ** d;
    a += da * place;
    b += db * place;
  }
  return [a, b];
}

function generateSingleQuestion(
  index: number,
  classNumber: ClassNumber,
  difficulty: DifficultyLevel,
  operation: MathOperation
): MathsQuestion {
  let a = 0;
  let b = 0;
  let answer = 0;
  let hintEn = '';
  let hintHi = '';
  let stepsEn = '';
  let stepsHi = '';

  if (operation === 'ADDITION') {
    if (classNumber === 1) {
      if (difficulty === 'EASY') {
        a = randInt(1, 5);
        b = randInt(1, 4);
      } else if (difficulty === 'MEDIUM') {
        a = randInt(6, 9);
        b = randInt(10 - a, 9);
      } else {
        a = randInt(12, 24);
        b = randInt(6, 16);
      }
    } else if (difficulty === 'EASY') {
      // Strictly no-carry addition scaled by class (2-digit for Class 2-3, 3-digit for Class 4-5)
      const digits = classNumber <= 3 ? 2 : 3;
      [a, b] = makeNoCarryPair(digits);
      if (classNumber === 3) {
        a += 100; // 3-digit + 2-digit with zero carries in ones/tens
      } else if (classNumber === 5) {
        a += 1000; // 4-digit + 3-digit with zero carries
      }
    } else if (difficulty === 'MEDIUM') {
      // Guaranteed ones-column carry scaled by class
      const baseRanges: Record<ClassNumber, [number, number]> = {
        1: [0, 0],
        2: [2, 5],
        3: [12, 35],
        4: [45, 95],
        5: [180, 480],
      };
      const [minTen, maxTen] = baseRanges[classNumber];
      const a0 = randInt(3, 9);
      const b0 = randInt(10 - a0, 9);
      a = randInt(minTen, maxTen) * 10 + a0;
      b = randInt(minTen, maxTen) * 10 + b0;
    } else {
      const hardRanges: Record<ClassNumber, [number, number]> = {
        1: [12, 24],
        2: [55, 98],
        3: [350, 750],
        4: [1100, 3200],
        5: [4800, 9900],
      };
      const [minV, maxV] = hardRanges[classNumber];
      a = randInt(minV, maxV);
      b = randInt(minV, maxV);
    }
    answer = a + b;
    hintEn = `Start at ${a} and count forward by ${b}.`;
    hintHi = `${a} se shuru karke ${b} aage gino. Pehle Ones jodo, phir Tens.`;
    stepsEn = `${a} + ${b} = ${answer}. Add the ones first, then the tens.`;
    stepsHi = `${a} + ${b} = ${answer}. Pehle Ones jodo, phir Tens jodo.`;
  } else if (operation === 'SUBTRACTION') {
    if (classNumber === 1) {
      if (difficulty === 'EASY') {
        a = randInt(4, 9);
        b = randInt(1, a - 1);
      } else if (difficulty === 'MEDIUM') {
        a = randInt(10, 16);
        b = randInt((a % 10) + 1, 9);
      } else {
        a = randInt(16, 28);
        b = randInt(7, 15);
      }
      answer = a - b;
    } else if (difficulty === 'EASY') {
      // Strictly no-borrow subtraction scaled by class
      const digits = classNumber <= 3 ? 2 : 3;
      [a, b] = makeNoBorrowPair(digits);
      if (classNumber === 3) {
        a += 100;
      } else if (classNumber === 5) {
        a += 1000;
      }
      answer = a - b;
    } else if (difficulty === 'MEDIUM') {
      // Guaranteed ones-column borrow scaled by class
      const tenRanges: Record<ClassNumber, [number, number, number, number]> = {
        1: [0, 0, 0, 0],
        2: [1, 4, 2, 5],
        3: [8, 22, 8, 28],
        4: [35, 95, 30, 95],
        5: [140, 420, 120, 460],
      };
      const [minBT, maxBT, minDT, maxDT] = tenRanges[classNumber];
      const a0 = randInt(0, 6);
      const b0 = randInt(a0 + 1, 9);
      const bTens = randInt(minBT, maxBT);
      const diffTens = randInt(minDT, maxDT);
      b = bTens * 10 + b0;
      const aTens = bTens + diffTens + 1;
      a = aTens * 10 + a0;
      answer = a - b;
    } else {
      const hardRanges: Record<ClassNumber, [number, number, number, number]> = {
        1: [7, 15, 3, 13],
        2: [30, 78, 28, 88],
        3: [220, 520, 200, 560],
        4: [900, 2800, 850, 2900],
        5: [3200, 8500, 3000, 9200],
      };
      const [minB, maxB, minDiff, maxDiff] = hardRanges[classNumber];
      b = randInt(minB, maxB);
      answer = randInt(minDiff, maxDiff);
      a = b + answer;
    }
    hintEn = `Take away ${b} from ${a}, or think: what plus ${b} equals ${a}?`;
    hintHi = `${a} me se ${b} kam karo, ya socho ${b} me kitna jodein ki ${a} aaye.`;
    stepsEn = `${a} - ${b} = ${answer}. Removing ${b} from ${a} leaves ${answer}.`;
    stepsHi = `${a} - ${b} = ${answer}. ${a} me se ${b} hatane par ${answer} bachta hai.`;
  } else if (operation === 'MULTIPLICATION') {
    const ranges: Record<ClassNumber, Record<DifficultyLevel, [number, number, number, number]>> = {
      1: { EASY: [1, 4, 1, 3], MEDIUM: [2, 5, 2, 5], HARD: [3, 6, 3, 6] },
      2: { EASY: [2, 5, 2, 5], MEDIUM: [3, 8, 3, 6], HARD: [5, 10, 4, 8] },
      3: { EASY: [2, 8, 2, 6], MEDIUM: [4, 10, 4, 10], HARD: [6, 12, 6, 12] },
      4: { EASY: [4, 9, 3, 8], MEDIUM: [7, 14, 5, 10], HARD: [12, 26, 4, 12] },
      5: { EASY: [11, 24, 3, 9], MEDIUM: [18, 48, 6, 14], HARD: [28, 78, 11, 22] },
    };
    const [minA, maxA, minB, maxB] = ranges[classNumber][difficulty];
    a = randInt(minA, maxA);
    b = randInt(minB, maxB);
    answer = a * b;
    hintEn = `Add ${a} together ${b} times.`;
    hintHi = `${a} ko ${b} baar jodo (${a} ka pahada ${b} tak bolo).`;
    stepsEn = `${a} × ${b} = ${answer}. ${b} groups of ${a} makes ${answer}.`;
    stepsHi = `${a} × ${b} = ${answer}. ${a} ke ${b} group milake ${answer} hote hain.`;
  } else {
    const ranges: Record<ClassNumber, Record<DifficultyLevel, [number, number, number, number]>> = {
      1: { EASY: [2, 3, 1, 4], MEDIUM: [2, 4, 3, 5], HARD: [3, 5, 3, 6] },
      2: { EASY: [2, 4, 2, 5], MEDIUM: [3, 6, 3, 8], HARD: [4, 8, 4, 9] },
      3: { EASY: [2, 6, 2, 8], MEDIUM: [4, 9, 4, 10], HARD: [6, 12, 5, 12] },
      4: { EASY: [2, 9, 2, 9], MEDIUM: [5, 12, 6, 15], HARD: [8, 16, 10, 24] },
      5: { EASY: [4, 12, 8, 20], MEDIUM: [7, 15, 12, 30], HARD: [10, 24, 16, 42] },
    };
    const [minDiv, maxDiv, minQ, maxQ] = ranges[classNumber][difficulty];
    b = randInt(minDiv, maxDiv);
    answer = randInt(minQ, maxQ);
    a = b * answer;
    hintEn = `Think: ${b} times what number equals ${a}?`;
    hintHi = `${b} ka pahada padho: ${b} × ? = ${a}.`;
    stepsEn = `${a} ÷ ${b} = ${answer}, because ${b} × ${answer} = ${a}.`;
    stepsHi = `${a} ÷ ${b} = ${answer}, kyunki ${b} × ${answer} = ${a} hota hai.`;
  }

  const symbol = OPERATIONS.find((op) => op.id === operation)?.symbol ?? '+';

  return {
    id: `${operation}-${classNumber}-${difficulty}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    operandA: a,
    operandB: b,
    operation,
    symbol,
    correctAnswer: answer,
    options: buildFourUniqueOptions(answer),
    hintEn,
    hintHi,
    stepsEn,
    stepsHi,
  };
}

export function generateTenQuestionQuiz(config: QuizConfig): MathsQuestion[] {
  const ops: MathOperation[] = ['ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION'];
  return Array.from({ length: 10 }, (_, idx) => {
    const op = config.operation ?? ops[idx % ops.length];
    return generateSingleQuestion(idx, config.classNumber, config.difficulty, op);
  });
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDateKey(d);
}

export const INITIAL_PROGRESS: LocalProgress = {
  totalStars: 0,
  totalQuizzesCompleted: 0,
  totalCorrectAnswers: 0,
  totalAttemptedQuestions: 0,
  dailyStreak: 0,
  lastDailyDate: '',
  selectedClass: 1,
  selectedDifficulty: 'EASY',
  byOperation: {
    ADDITION: { attempted: 0, correct: 0, quizzes: 0 },
    SUBTRACTION: { attempted: 0, correct: 0, quizzes: 0 },
    MULTIPLICATION: { attempted: 0, correct: 0, quizzes: 0 },
    DIVISION: { attempted: 0, correct: 0, quizzes: 0 },
  },
  recentQuizzes: [],
};
