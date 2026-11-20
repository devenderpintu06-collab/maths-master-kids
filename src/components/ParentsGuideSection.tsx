import { BookOpen, Brain, Clock, Lightbulb, Sparkles } from 'lucide-react';
import type { AppLanguage } from '../data/mathsMaster';

interface ParentsGuideSectionProps {
  lang: AppLanguage;
}

const CLASS_TIPS = [
  {
    gradeEn: 'Class 1–2',
    gradeHi: 'कक्षा 1–2',
    titleEn: 'Number Bonds & Counting On',
    titleHi: 'संख्या युग्म और आगे गिनती',
    accent: '#059669',
    tipEn:
      'Teach kids to always start from the bigger number and count forward (e.g., for 3 + 8, start at 8 and count 9, 10, 11). Practice pairs that make 10 (6 + 4, 7 + 3) so no-carry sums become automatic.',
    tipHi:
      'बच्चों को हमेशा बड़ी संख्या से आगे गिनना सिखाएँ (जैसे 3 + 8 के लिए 8 से 9, 10, 11 गिनें)। 10 बनाने वाली जोड़ियों (6 + 4, 7 + 3) का रोज़ अभ्यास कराएँ।',
  },
  {
    gradeEn: 'Class 3',
    gradeHi: 'कक्षा 3',
    titleEn: 'Break Tens & Ones Mentally',
    titleHi: 'दहाई और इकाई अलग कर जोड़ें',
    accent: '#2563EB',
    tipEn:
      'Before doing vertical carry or borrow on paper, split two-digit numbers in the mind: 46 + 27 becomes (40 + 20) + (6 + 7) = 60 + 13 = 73. Check subtraction by adding the answer back.',
    tipHi:
      'दो अंकों की संख्याओं को मन में तोड़कर हल करें: 46 + 27 = (40 + 20) + (6 + 7) = 73। घटाव की जाँच के लिए उत्तर को वापस जोड़कर देखें।',
  },
  {
    gradeEn: 'Class 4',
    gradeHi: 'कक्षा 4',
    titleEn: 'Split & Multiply Faster',
    titleHi: 'संख्या तोड़कर तेज़ गुणा करें',
    accent: '#D97706',
    tipEn:
      'Master tables up to 12 × 12, then split harder products into friendly tens: 14 × 6 = (10 × 6) + (4 × 6) = 60 + 24 = 84. Use the Visual Lab Array Grid to see why splitting works.',
    tipHi:
      '12 तक के पहाड़े पक्के करें, फिर बड़े गुणा को 10 के आसान हिस्सों में तोड़ें: 14 × 6 = (10 × 6) + (4 × 6) = 84।',
  },
  {
    gradeEn: 'Class 5',
    gradeHi: 'कक्षा 5',
    titleEn: 'Fact Families & Division Shortcuts',
    titleHi: 'भाग को गुणा से जोड़कर समझें',
    accent: '#7C3AED',
    tipEn:
      'Turn every division problem into a missing multiplication fact: 144 ÷ 12 asks "12 times what equals 144?". Estimation before tapping an option builds strong number sense and catches careless slips.',
    tipHi:
      'हर भाग के सवाल को गुणा से जोड़कर सोचें: 144 ÷ 12 का अर्थ है "12 को किससे गुणा करें कि 144 आए?"। विकल्प चुनने से पहले अनुमान लगाना भी सिखाएँ।',
  },
];

export function ParentsGuideSection({ lang }: ParentsGuideSectionProps) {
  const isHi = lang === 'hi';

  return (
    <section
      id="parents-guide"
      aria-labelledby="parents-guide-heading"
      className="bg-gradient-to-br from-sky-50/75 via-white to-emerald-50/60 border border-sky-200/80 rounded-[2rem] p-6 sm:p-8 space-y-6 shadow-card-soft"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sky-100 pb-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700">
            <BookOpen className="w-4 h-4" />
            <span>{isHi ? 'माता-पिता के लिए मार्गदर्शिका' : "Parent's Guide & Maths Tips"}</span>
          </div>
          <h2
            id="parents-guide-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance"
          >
            {isHi
              ? 'कक्षा 1 से 5 तक बच्चों का मानसिक गणित कैसे मज़बूत करें'
              : 'How Kids in Classes 1 to 5 Can Build Strong Mental Math'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {isHi
              ? 'रोज़ सिर्फ 10 मिनट के मज़ेदार अभ्यास और सही तरीकों से बच्चे बिना उंगलियों पर गिने तेज़ी से गणना कर सकते हैं।'
              : 'Short 10-minute daily sessions with the right mental strategies help children calculate accurately without rushing or memorizing blindly.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 shrink-0 self-start md:self-auto">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{isHi ? 'सुझाव: रोज़ 1 दैनिक क्विज़ (10 मिनट)' : 'Recommended: 10 mins / day'}</span>
        </div>
      </div>

      {/* Class-by-Class Mental Math Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CLASS_TIPS.map((item) => (
          <article
            key={item.gradeEn}
            className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className="font-math text-xs font-extrabold px-2.5 py-1 rounded-lg text-white"
                style={{ backgroundColor: item.accent }}
              >
                {isHi ? item.gradeHi : item.gradeEn}
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-slate-900">
              {isHi ? '1. आसान स्तर (बिना हासिल) से शुरू करें' : '1. Start with Easy (No Carry)'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi
                ? 'जब 80% से अधिक स्कोर आने लगे, तब मध्यम (हासिल सहित) और फिर कठिन स्तर पर जाएँ।'
                : 'Build confidence with Easy mode until your child scores 8/10+, then step up to Medium and Hard.'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-slate-900">
              {isHi ? '2. चित्र संकेत और विज़ुअल लैब का उपयोग करें' : '2. Use Visual Hints Before Guessing'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi
                ? 'अटकने पर चित्र संकेत देखें और "समझें" विवरण साथ में पढ़कर अवधारणा स्पष्ट करें।'
                : 'Encourage tapping "Need a Hint?" or exploring the Visual Lab instead of guessing randomly.'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 flex items-start gap-3">
          <Brain className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-slate-900">
              {isHi ? '3. गलतियों से सीखने की आदत डालें' : '3. Review Mistakes Together'}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHi
                ? '"मेरी प्रगति" में पिछले स्कोर और सटीकता देखकर कमज़ोर विषय का थोड़ा अतिरिक्त अभ्यास कराएँ।'
                : 'Check Operation Mastery in My Progress weekly to spot which skill needs extra practice.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
