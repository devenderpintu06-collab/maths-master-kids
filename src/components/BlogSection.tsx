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
      className="space-y-5"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <BookOpen className="w-4 h-4" />
            <span>{isHi ? 'Blog & Maths Tips (माता-पिता और बच्चों के लिए)' : 'Blog & Maths Tips'}</span>
          </div>
          <h2
            id="blog-section-heading"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900"
          >
            {isHi ? 'गणित सीखने के आसान लेख और गाइड' : 'Helpful Maths Articles & Learning Guides'}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            {isHi
              ? 'पढ़ने के लिए किसी भी लेख पर क्लिक करें — English और हिंदी दोनों भाषाओं में उपलब्ध।'
              : 'Tap any article card below to open the full reader view in English or Hindi.'}
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
          {isHi
            ? `${BLOG_ARTICLES.length} विस्तृत गाइड · EN / हिं`
            : `${BLOG_ARTICLES.length} Detailed Guides · EN / हिं`}
        </span>
      </div>

      {/* 4 Colorful Article Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BLOG_ARTICLES.map((article, idx) => (
          <article
            key={article.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between gap-5 hover:border-blue-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-[11px] font-bold ${article.badgeBgClass}`}
                >
                  {isHi ? article.categoryHi : article.categoryEn}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  {isHi ? article.readTimeHi : article.readTimeEn}
                </span>
              </div>

              <div
                className="w-10 h-1.5 rounded-full"
                style={{ backgroundColor: article.accentHex }}
                aria-hidden="true"
              />

              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                {isHi ? article.titleHi : article.titleEn}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {isHi ? article.summaryHi : article.summaryEn}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenArticle(article.id)}
              className="w-full inline-flex items-center justify-between gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white transition-opacity hover:opacity-95 cursor-pointer"
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
                <p className="text-sm sm:text-base text-slate-700 font-medium bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  {isHi ? activeArticle.introHi : activeArticle.introEn}
                </p>
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
