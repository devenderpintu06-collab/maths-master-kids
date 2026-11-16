import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, Send, ShieldCheck, X } from 'lucide-react';
import { soundFx } from '../utils/sound';

export type FooterDocType = 'about' | 'privacy' | 'terms' | 'contact';

interface LegalFooterModalsProps {
  activeDoc: FooterDocType | null;
  onSelectDoc: (doc: FooterDocType | null) => void;
}

const DOC_TABS: { id: FooterDocType; label: string }[] = [
  { id: 'about', label: 'About Us' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'contact', label: 'Contact Us' },
];

export function LegalFooterModals({ activeDoc, onSelectDoc }: LegalFooterModalsProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Feedback');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!activeDoc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSelectDoc(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeDoc, onSelectDoc]);

  if (!activeDoc) return null;

  const handleClose = () => {
    soundFx.playClick();
    onSelectDoc(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setFormError('Please fill in your name, email address, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setFormError('');
    setSubmitted(true);
    soundFx.playCorrect();
  };

  const mailtoHref = `mailto:support@mathsmasterkids.in?subject=${encodeURIComponent(
    `[Maths Master Kids] ${topic}${name.trim() ? ` - ${name.trim()}` : ''}`
  )}&body=${encodeURIComponent(
    message.trim()
      ? `${message.trim()}\n\nFrom: ${name.trim()} (${email.trim()})`
      : 'Hello Maths Master Kids Team,'
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={handleClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="footer-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden shadow-xl"
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-[#FAF9F6]">
          <div className="flex flex-wrap items-center gap-1.5">
            {DOC_TABS.map((tab) => {
              const active = activeDoc === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setSubmitted(false);
                    setFormError('');
                    onSelectDoc(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-5 sm:px-7 py-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
          {activeDoc === 'about' && (
            <div className="space-y-4">
              <h2 id="footer-modal-title" className="text-2xl font-extrabold text-slate-900">
                About Maths Master Kids
              </h2>
              <p>
                <strong>Maths Master Kids</strong> is a free, kid-friendly mathematics practice platform designed specifically for primary school students in <strong>Classes 1 to 5</strong> (ages 6–11).
              </p>
              <p>
                Our goal is to turn everyday arithmetic practice—Addition, Subtraction, Multiplication, and Division—into a calm, encouraging, game-like habit. Every question is calibrated by class level and difficulty (Easy with no carry/borrow, Medium with carry/borrow, and Hard with larger numbers), paired with visual picture hints, voice read-aloud, and step-by-step explanations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">Built for Primary Learners</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Large readable fonts, instant positive feedback, star rewards, and interactive visual sandboxes.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="font-bold text-slate-900">No Sign-Up Required</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Kids can start practicing immediately. Quiz scores and streaks are stored locally on your own device.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDoc === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <h2 id="footer-modal-title" className="text-2xl font-extrabold text-slate-900">
                  Privacy Policy & COPPA Compliance
                </h2>
              </div>
              <p className="text-xs text-slate-500">Effective Date: November 2026</p>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  1. Children&apos;s Privacy (COPPA Compliance)
                </h3>
                <p>
                  Maths Master Kids is committed to protecting children&apos;s privacy in accordance with the <strong>Children&apos;s Online Privacy Protection Act (COPPA)</strong>. We do <strong>not</strong> require registration, logins, user profiles, or personal information (such as a child&apos;s name, age, phone number, location, or photos) to play quizzes or use the Visual Math Lab.
                </p>
                <p>
                  All quiz stars, recent scores, language preferences, and daily practice streaks are saved strictly on your local browser or device via <code>localStorage</code> and are never transmitted to our servers.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  2. Google AdSense & Advertising Cookies Disclosure
                </h3>
                <p>
                  This website may display advertisements served by <strong>Google AdSense</strong> and third-party ad partners. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>
                    Google&apos;s use of advertising cookies enables it and its partners to serve ads based on visits to this site and/or other sites on the Internet.
                  </li>
                  <li>
                    In accordance with COPPA child-directed service requirements, ad requests on child-directed content are configured for <strong>non-personalized, family-safe advertising</strong> without behavioral profiling of children.
                  </li>
                  <li>
                    Parents and adult visitors may opt out of personalized advertising by visiting{' '}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold underline hover:text-blue-700"
                    >
                      Google Ads Settings
                    </a>{' '}
                    or{' '}
                    <a
                      href="https://www.aboutads.info/choices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold underline hover:text-blue-700"
                    >
                      www.aboutads.info
                    </a>
                    .
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  3. Parent Contact & Data Removal
                </h3>
                <p>
                  You can clear all locally stored quiz scores at any time using the <strong>Reset Progress</strong> button in <strong>My Progress</strong> or by clearing your browser storage. Parents with any privacy questions may email{' '}
                  <a
                    href="mailto:support@mathsmasterkids.in"
                    className="text-blue-600 font-semibold underline"
                  >
                    support@mathsmasterkids.in
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          {activeDoc === 'terms' && (
            <div className="space-y-4">
              <h2 id="footer-modal-title" className="text-2xl font-extrabold text-slate-900">
                Terms & Conditions
              </h2>
              <p className="text-xs text-slate-500">Last Updated: November 2026</p>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">1. Educational Use</h3>
                <p>
                  Maths Master Kids is provided free of charge for personal, home, and classroom educational practice for students in Classes 1 to 5.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">2. Acceptable Use</h3>
                <p>
                  You agree to use this website lawfully and not attempt to disrupt, scrape, or reverse-engineer site services or display misleading copies of our content.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">3. Local Storage & Availability</h3>
                <p>
                  Progress, stars, and recent quiz scores are stored locally in your browser. Clearing browser site data or switching devices will reset local progress. While we verify every maths question and explanation carefully, the platform is provided &quot;as is&quot; without warranties of uninterrupted availability.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">4. Contact</h3>
                <p>
                  For questions regarding these terms, reach us at{' '}
                  <a
                    href="mailto:support@mathsmasterkids.in"
                    className="text-blue-600 font-semibold underline"
                  >
                    support@mathsmasterkids.in
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          {activeDoc === 'contact' && (
            <div className="space-y-5">
              <div>
                <h2 id="footer-modal-title" className="text-2xl font-extrabold text-slate-900">
                  Contact Us
                </h2>
                <p className="text-slate-600 mt-1">
                  Have feedback, a suggestion for Classes 1–5, or a parent/teacher question? Reach out directly by email or use the quick message form below.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900">Support Email</p>
                    <a
                      href="mailto:support@mathsmasterkids.in"
                      className="font-math text-sm font-bold text-blue-700 hover:underline"
                    >
                      support@mathsmasterkids.in
                    </a>
                  </div>
                </div>
                <span className="text-xs text-blue-800">Typically replies within 1–2 business days</span>
              </div>

              {submitted ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <p className="font-bold text-base">Thank you, {name.trim()}! Your message is ready.</p>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-900">
                    Because Maths Master Kids runs without collecting data on external servers, click below if you&apos;d also like to open your email app addressed to{' '}
                    <strong>support@mathsmasterkids.in</strong> with your message pre-filled.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      href={mailtoHref}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Open in Email App
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setMessage('');
                      }}
                      className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-white text-emerald-900 text-xs font-bold hover:bg-emerald-100/50 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block space-y-1.5">
                      <span className="text-xs font-bold text-slate-700">Your Name (Parent / Teacher)</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Priya Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-xs font-bold text-slate-700">Email Address</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </label>
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-slate-700">Topic</span>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="General Feedback">General Feedback</option>
                      <option value="Class 1-5 Question Suggestion">Class 1–5 Question Suggestion</option>
                      <option value="Privacy / COPPA Inquiry">Privacy / COPPA Inquiry</option>
                      <option value="Bug Report">Bug Report</option>
                    </select>
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-bold text-slate-700">Message</span>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your question or suggestion here..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </label>

                  {formError && (
                    <p className="text-xs font-semibold text-rose-600" role="alert">
                      {formError}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                    <a
                      href={mailtoHref}
                      className="text-xs font-semibold text-slate-500 hover:text-blue-600 underline"
                    >
                      Or email support@mathsmasterkids.in directly
                    </a>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
