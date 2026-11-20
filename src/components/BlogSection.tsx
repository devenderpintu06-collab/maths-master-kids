import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Play, Sparkles, X } from 'lucide-react';
import { BLOG_ARTICLES, type BlogArticle } from '../data/blogArticles';
import type { AppLanguage } from '../data/mathsMaster';
import { soundFx } from '../utils/sound';

interface BlogSectionProps {
  lang: AppLanguage;
  activeArticleId: string | null;
  onSelectArticle: (id: string | null) => void;
  onChangeLang: (lang: AppLanguage) => void;
  onStartDailyQuiz: () => void;
}

function BlogCardIllustration({ articleId, accentHex }: { articleId: string; accentHex: string }) {
  if (articleId === 'remove-fear-of-maths') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 shrink-0" aria-hidden="true">
        <rect x="4" y="4" width="40" height="40" rx="14" fill={accentHex} fillOpacity="0.14" />
        <path
          d="M24 35 C24 35 13 27.5 13 20 C13 16 16 13.5 19.5 13.5 C21.8 13.5 23.3 14.8 24 16.2 C24.7 14.8 26.2 13.5 28.5 13.5 C32 13.5 35 16 35 20 C35 27.5 24 35 24 35 Z"
          fill={accentHex}
        />
        <path d="M21 22 L23.2 24.2 L27.5 19.8" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (articleId === 'master-tables-and-mental-math') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 shrink-0" aria-hidden="true">
        <rect x="4" y="4" width="40" height="40" rx="14" fill={accentHex} fillOpacity="0.14" />
        <rect x="12" y="12" width="10" height="10" rx="3" fill={accentHex} />
        <rect x="26" y="12" width="10" height="10" rx="3" fill={accentHex} fillOpacity="0.55" />
        <rect x="12" y="26" width="10" height="10" rx="3" fill={accentHex} fillOpacity="0.55" />
        <rect x="26" y="26" width="10" height="10" rx="3" fill={accentHex} />
      </svg>
    );
  }
  if (articleId === 'ten-minutes-daily-mental-math') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 shrink-0" aria-hidden="true">
        <rect x="4" y="4" width="40" height="40" rx="14" fill={accentHex} fillOpacity="0.14" />
        <circle cx="24" cy="25" r="11" stroke={accentHex} strokeWidth="3.2" fill="white" />
        <path d="M24 25 V19 M24 25 L29 27.5" stroke={accentHex} strokeWidth="3" strokeLinecap="round" />
        <path d="M20 11 H28" stroke={accentHex} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (articleId === 'history-of-maths-stone-age-to-space-age') {
    return (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 shrink-0" aria-hidden="true">
        <rect x="4" y="4" width="40" height="40" rx="14" fill={accentHex} fillOpacity="0.14" />
        <path d="M24 11 C19 17 18 24 18 30 H30 C30 24 29 17 24 11 Z" fill={accentHex} />
        <circle cx="24" cy="22" r="2.8" fill="white" />
        <path d="M21 30 L24 37 L27 30 Z" fill="#F59E0B" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10 shrink-0" aria-hidden="true">
      <rect x="4" y="4" width="40" height="40" rx="14" fill={accentHex} fillOpacity="0.14" />
      <path d="M25 11 L15 26 H23 L22 37 L33 21 H25 L25 11 Z" fill={accentHex} stroke={accentHex} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function BlogSection({
  lang,
  activeArticleId,
  onSelectArticle,
  onChangeLang,
  onStartDailyQuiz,
}: BlogSectionProps) {
  const isHi = lang === 'hi';
  const activeArticle: BlogArticle | null =
    BLOG_ARTICLES.find((a) => a.id === activeArticleId) ?? null;
  const activeIndex = activeArticle
    ? BLOG_ARTICLES.findIndex((a) => a.id === activeArticle.id)
    : -1;

  useEffect(() => {
    if (!activeArticle) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSelectArticle(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeArticle, onSelectArticle]);

  const handleOpenArticle = (id: string) => {
    soundFx.playClick();
    onSelectArticle(id);
  };

  return (
    <section
      id="blog-section"
      aria-labelledby="blog-section-heading"
      className="bg-gradient-to-br from-amber-50/75 via-white to-orange-50/65 border border-amber-200/80 rounded-[2rem] p-6 sm:p-8 shadow-card-soft space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-700">
            <BookOpen className="w-4 h-4" />
            <span>{isHi ? 'Blog & Maths Tips (माता-पिता और बच्चों के लिए)' : 'Blog & Maths Tips'}</span>
          </div>
          <h2
            id="blog-section-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
          >
            {isHi ? 'गणित सीखने के आसान लेख और गाइड' : 'Helpful Maths Articles & Learning Guides'}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            {isHi
              ? 'पढ़ने के लिए किसी भी लेख पर क्लिक करें — English और हिंदी दोनों भाषाओं में उपलब्ध।'
              : 'Tap any article card below to open the full reader view in English or Hindi.'}
          </p>
        </div>

        <span className="text-xs font-semibold text-amber-800/80 whitespace-nowrap">
          {isHi
            ? `${BLOG_ARTICLES.length} विस्तृत गाइड · EN / हिं`
            : `${BLOG_ARTICLES.length} Detailed Guides · EN / हिं`}
        </span>
      </div>

      {/* Article Cards with Custom SVG Illustrations & 3D Tactile Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BLOG_ARTICLES.map((article, idx) => (
          <article
            key={article.id}
            className="bg-white border border-slate-200/85 border-b-4 border-b-slate-300/80 rounded-3xl p-6 flex flex-col justify-between gap-5 shadow-sm hover:border-amber-300 hover:-translate-y-1 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BlogCardIllustration articleId={article.id} accentHex={article.accentHex} />
                  <div className="space-y-0.5">
                    <span className="block text-xs font-extrabold" style={{ color: article.accentHex }}>
                      {isHi ? article.categoryHi : article.categoryEn}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {isHi ? article.readTimeHi : article.readTimeEn}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {isHi ? article.titleHi : article.titleEn}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {isHi ? article.summaryHi : article.summaryEn}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenArticle(article.id)}
              className="w-full inline-flex items-center justify-between gap-2 px-5 py-3 rounded-2xl text-sm font-extrabold text-white border-b-4 border-black/25 transition-all hover:brightness-105 active:translate-y-[2px] cursor-pointer shadow-sm"
              style={{ backgroundColor: article.accentHex }}
            >
              <span>
                {isHi ? `लेख ${idx + 1} पढ़ें` : 'Read Full Article'}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </article>
        ))}
      </div>

      {/* Reader View Modal */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={() => {
            soundFx.playClick();
            onSelectArticle(null);
          }}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-reader-title"
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl"
          >
            {/* Reader Top Bar */}
            <div className="px-5 sm:px-7 py-4 border-b border-slate-200 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold ${activeArticle.badgeBgClass}`}
                >
                  {isHi ? activeArticle.categoryHi : activeArticle.categoryEn}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {isHi ? activeArticle.readTimeHi : activeArticle.readTimeEn}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Inline Language Toggle inside Reader */}
                <div
                  className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-xl"
                  role="group"
                  aria-label="Article language toggle"
                >
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      onChangeLang('en');
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      onChangeLang('hi');
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      lang === 'hi' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onSelectArticle(null);
                  }}
                  aria-label="Close article reader"
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Reader Article Body */}
            <div className="px-5 sm:px-8 py-6 overflow-y-auto space-y-6 text-slate-700 leading-relaxed">
              <div className="space-y-3">
                <div
                  className="w-16 h-1.5 rounded-full"
                  style={{ backgroundColor: activeArticle.accentHex }}
                  aria-hidden="true"
                />
                <h2
                  id="blog-reader-title"
                  className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug"
                >
                  {isHi ? activeArticle.titleHi : activeArticle.titleEn}
                </h2>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  {(isHi ? activeArticle.introHi : activeArticle.introEn)
                    .split('\n\n')
                    .map((para, idx) => (
                      <p key={idx} className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
                        {para}
                      </p>
                    ))}
                </div>
              </div>

              <div className="space-y-5">
                {activeArticle.sections.map((sec, i) => {
                  const bodyText = isHi ? sec.bodyHi : sec.bodyEn;
                  const paragraphs = bodyText.split('\n\n');
                  return (
                    <div key={i} className="space-y-2">
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                        {isHi ? sec.headingHi : sec.headingEn}
                      </h3>
                      <div className="space-y-2">
                        {paragraphs.map((para, pIdx) => (
                          <p
                            key={pIdx}
                            className="text-sm sm:text-base text-slate-600 leading-relaxed"
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conclusion & Practice CTA */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm sm:text-base font-semibold text-amber-950">
                    {isHi ? activeArticle.conclusionHi : activeArticle.conclusionEn}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectArticle(null);
                      onStartDailyQuiz();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {isHi ? '10 सवालों का Daily Quiz शुरू करें' : 'Try a 10-Question Daily Quiz'}
                  </button>
                </div>
              </div>
            </div>

            {/* Reader Footer Navigation */}
            <div className="px-5 sm:px-7 py-3.5 border-t border-slate-200 bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  const prevIdx =
                    (activeIndex - 1 + BLOG_ARTICLES.length) % BLOG_ARTICLES.length;
                  onSelectArticle(BLOG_ARTICLES[prevIdx].id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {isHi ? 'पिछला लेख' : 'Previous Article'}
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  const nextIdx = (activeIndex + 1) % BLOG_ARTICLES.length;
                  onSelectArticle(BLOG_ARTICLES[nextIdx].id);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {isHi ? 'अगला लेख' : 'Next Article'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
