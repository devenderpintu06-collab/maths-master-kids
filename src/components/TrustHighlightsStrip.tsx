import { FileText, GraduationCap, Languages, ShieldCheck } from 'lucide-react';
import type { AppLanguage } from '../data/mathsMaster';
import { soundFx } from '../utils/sound';

interface TrustHighlightsStripProps {
  lang: AppLanguage;
  onOpenWorksheets: () => void;
  onToggleLang: () => void;
}

export function TrustHighlightsStrip({
  lang,
  onOpenWorksheets,
  onToggleLang,
}: TrustHighlightsStripProps) {
  const isHi = lang === 'hi';

  const items = [
    {
      id: 'free',
      icon: ShieldCheck,
      iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600 border-b-[3px] border-teal-800',
      cardTint: 'bg-emerald-50/75 border-emerald-200/80',
      titleEn: '100% Free Forever',
      titleHi: 'हमेशा 100% निःशुल्क',
      descEn: 'No login, no subscriptions, and zero personal data collected.',
      descHi: 'बिना लॉगिन, बिना शुल्क और बिना किसी व्यक्तिगत डेटा संग्रह के सुरक्षित।',
      action: undefined,
    },
    {
      id: 'curriculum',
      icon: GraduationCap,
      iconBg: 'bg-gradient-to-br from-blue-400 to-indigo-600 border-b-[3px] border-indigo-800',
      cardTint: 'bg-blue-50/75 border-blue-200/80',
      titleEn: 'Class 1–5 Curriculum Aligned',
      titleHi: 'कक्षा 1–5 पाठ्यक्रम आधारित',
      descEn: 'Age-appropriate Easy, Medium & Hard drills for primary learners.',
      descHi: 'प्राथमिक बच्चों के लिए आसान, मध्यम और कठिन स्तर पर तैयार सवाल।',
      action: undefined,
    },
    {
      id: 'pdfs',
      icon: FileText,
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-600 border-b-[3px] border-orange-800',
      cardTint: 'bg-amber-50/80 border-amber-200/80 hover:border-amber-400',
      titleEn: 'Printable A4 PDFs',
      titleHi: 'प्रिंटेबल A4 PDF वर्कशीट',
      descEn: '40 school-ready worksheets with 15 problems each & zero answers.',
      descHi: '40 स्कूल-रेडी वर्कशीट, हर शीट में बिना उत्तर के 15 अभ्यास प्रश्न।',
      action: () => {
        soundFx.playClick();
        onOpenWorksheets();
      },
    },
    {
      id: 'bilingual',
      icon: Languages,
      iconBg: 'bg-gradient-to-br from-purple-400 to-fuchsia-600 border-b-[3px] border-purple-800',
      cardTint: 'bg-purple-50/75 border-purple-200/80 hover:border-purple-400',
      titleEn: 'Bilingual EN / हिं',
      titleHi: 'द्विभाषी English / हिंदी',
      descEn: 'Switch instantly between clear English and natural Devanagari Hindi.',
      descHi: 'एक क्लिक में आसान अंग्रेज़ी और शुद्ध देवनागरी हिंदी के बीच बदलें।',
      action: () => {
        soundFx.playClick();
        onToggleLang();
      },
    },
  ];

  return (
    <section
      aria-labelledby="trust-highlights-heading"
      className="bg-white border border-indigo-100 rounded-[2rem] p-6 sm:p-8 shadow-card-soft space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs font-extrabold text-indigo-600">
            {isHi ? 'माता-पिता और शिक्षकों की पहली पसंद' : 'Built for Home & Classroom Excellence'}
          </p>
          <h2
            id="trust-highlights-heading"
            className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900"
          >
            {isHi
              ? 'माता-पिता और शिक्षक Maths Master Kids पर भरोसा क्यों करते हैं'
              : 'Why Parents & Teachers Trust Maths Master Kids'}
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
          {isHi ? 'सुरक्षित · ऑफ़लाइन-फ्रेंडली · COPPA जागरूक' : 'Safe · Offline-Ready · COPPA-Aware'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <div
                className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-sm ${item.iconBg}`}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {isHi ? item.titleHi : item.titleEn}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {isHi ? item.descHi : item.descEn}
                </p>
              </div>
            </>
          );

          if (item.action) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className={`rounded-2xl border p-4 text-left flex flex-col gap-3 transition-all hover:-translate-y-0.5 cursor-pointer ${item.cardTint}`}
              >
                {content}
              </button>
            );
          }

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 flex flex-col gap-3 ${item.cardTint}`}
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
