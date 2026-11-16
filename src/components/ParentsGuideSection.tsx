import { BookOpen, Brain, Clock, Lightbulb, Sparkles } from 'lucide-react';
import type { AppLanguage } from '../data/mathsMaster';

interface ParentsGuideSectionProps {
  lang: AppLanguage;
}

const CLASS_TIPS = [
  {
    grade: 'Class 1–2',
    titleEn: 'Number Bonds & Counting On',
    titleHi: 'Number Bonds aur Aage Ginna',
    accent: '#059669',
    tipEn:
      'Teach kids to always start from the bigger number and count forward (e.g., for 3 + 8, start at 8 and count 9, 10, 11). Practice pairs that make 10 (6 + 4, 7 + 3) so no-carry sums become automatic.',
    tipHi:
      'Bachon ko hamesha bade number se aage ginna sikhayein (jaise 3 + 8 ke liye 8 se 9, 10, 11). 10 banane wale pairs (6+4, 7+3) roz practice karein.',
  },
  {
    grade: 'Class 3',
    titleEn: 'Break Tens & Ones Mentally',
    titleHi: 'Tens aur Ones Alag Karke Jodna',
    accent: '#2563EB',
    tipEn:
      'Before doing vertical carry or borrow on paper, split two-digit numbers in the mind: 46 + 27 becomes (40 + 20) + (6 + 7) = 60 + 13 = 73. Check subtraction by adding the answer back.',
    tipHi:
      'Two-digit numbers ko dimaag me tod kar solve karein: 46 + 27 = (40 + 20) + (6 + 7) = 73. Ghatav check karne ke liye ulta jod kar dekhein.',
  },
  {
    grade: 'Class 4',
    titleEn: 'Split & Multiply Faster',
    titleHi: 'Tod Kar Guna (Multiply) Karna',
    accent: '#D97706',
    tipEn:
      'Master tables up to 12 × 12, then split harder products into friendly tens: 14 × 6 = (10 × 6) + (4 × 6) = 60 + 24 = 84. Use the Visual Lab Array Grid to see why splitting works.',
    tipHi:
      '12 tak ke pahade pakke karein, phir bade multiply ko 10 ke hisso me todein: 14 × 6 = (10 × 6) + (4 × 6) = 84.',
  },
  {
    grade: 'Class 5',
    titleEn: 'Fact Families & Division Shortcuts',
    titleHi: 'Division ko Multiply se Jodna',
    accent: '#7C3AED',
    tipEn:
      'Turn every division problem into a missing multiplication fact: 144 ÷ 12 asks "12 times what equals 144?". Estimation before tapping an option builds strong number sense and catches careless slips.',
    tipHi:
      'Har division sawal ko multiply me badal kar sochein: 144 ÷ 12 matlab "12 ko kis se guna karein ki 144 aaye?".',
  },
];

export function ParentsGuideSection({ lang }: ParentsGuideSectionProps) {
  const isHi = lang === 'hi';

  return (
    <section
      id="parents-guide"
      aria-labelledby="parents-guide-heading"
      className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <BookOpen className="w-4 h-4" />
            <span>{isHi ? 'Parents ke Liye Guide' : "Parent's Guide & Maths Tips"}</span>
          </div>
          <h2
            id="parents-guide-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
          >
            {isHi
              ? 'Class 1 se 5 tak Mental Maths Kaise Strong Karein'
              : 'How Kids in Classes 1 to 5 Can Build Strong Mental Math'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {isHi
              ? 'Roz sirf 10 minute ke fun practice aur sahi tricks se bache bina ungliyon par gine tez calculation kar sakte hain.'
              : 'Short 10-minute daily sessions with the right mental strategies help children calculate accurately without rushing or memorizing blindly.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 shrink-0 self-start md:self-auto">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{isHi ? 'Recommended: Roz 1 Daily Quiz (10 min)' : 'Recommended: 10 mins / day'}</span>
        </div>
      </div>

      {/* Class-by-Class Mental Math Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CLASS_TIPS.map((item) => (
          <article
            key={item.grade}
            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="font-math text-xs font-extrabold px-2.5 py-1 rounded-lg text-white"
                style={{ backgroundColor: item.accent }}
              >
                {item.grade}
              </span>
              <Brain className="w-4 h-4 text-slate-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {isHi ? item.titleHi : item.titleEn}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {isHi ? item.tipHi : item.tipEn}
            </p>
          </article>
        ))}
      </div>

      {/* 3 Practical Parent Habits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="rounded-2xl border border-slate-200 p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-slate-900">
              {isHi ? '1. Easy (No Carry) se Shuru Karein' : '1. Start with Easy (No Carry)'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi
                ? 'Jab 80%+ score aane lage tab Medium (With Carry) aur phir Hard level par jaayein.'
                : 'Build confidence with Easy mode until your child scores 8/10+, then step up to Medium and Hard.'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-slate-900">
              {isHi ? '2. Visual Hint aur Listen Use Karein' : '2. Use Visual Hints Before Guessing'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi
                ? 'Atakne par chitra hint dekhein aur Samjho explanation saath me padhein.'
                : 'Encourage tapping "Need a Hint?" or exploring the Visual Lab instead of guessing randomly.'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4 flex items-start gap-3">
          <Brain className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-slate-900">
              {isHi ? '3. Galti se Seekhein' : '3. Review Mistakes Together'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi
                ? 'My Progress me pichhle scores aur accuracy dekh kar kamzor operation practice karein.'
                : 'Check Operation Mastery in My Progress weekly to spot which skill needs extra practice.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
