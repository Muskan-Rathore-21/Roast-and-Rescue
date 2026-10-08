import React, { useState } from 'react';
import {
  Flame,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Key,
  History,
  Trash2,
  Code2,
  MessageSquare,
  Swords,
  BookOpen,
  Database,
} from 'lucide-react';
import { RoastIntensity, StoredScan, FactsBundle } from '../types/analysis.ts';
import { RoastOfTheDay } from './RoastOfTheDay.tsx';

interface LandingPageProps {
  usernameInput: string;
  setUsernameInput: (val: string) => void;
  intensity: RoastIntensity;
  setIntensity: (val: RoastIntensity) => void;
  inputError: string | null;
  loading: boolean;
  onRunAudit: (username?: string) => void;
  facts: FactsBundle | null;
  onResumeAudit: () => void;
  githubToken: string;
  onOpenTokenModal: () => void;
  storedScans: StoredScan[];
  onSelectScan: (username: string) => void;
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  onOpenLogin: () => void;
  onOpenBattle: () => void;
  onOpenMethodology: () => void;
  onOpenDatabaseVault: () => void;
  onOpenTestRunner?: () => void;
  isDark?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  usernameInput,
  setUsernameInput,
  intensity,
  setIntensity,
  inputError,
  loading,
  onRunAudit,
  facts,
  onResumeAudit,
  githubToken,
  onOpenTokenModal,
  storedScans,
  onSelectScan,
  onDeleteScan,
  onClearHistory,
  onOpenLogin,
  onOpenBattle,
  onOpenMethodology,
  onOpenDatabaseVault,
  onOpenTestRunner,
  isDark = true,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRunAudit();
  };

  const faqs = [
    {
      q: 'Where is my audit data saved and stored?',
      a: 'All audited profiles, custom notes, developer tags, and battle results are stored permanently in your cloud database (Firestore & Supabase). You can view, search, export to JSON/CSV, and manage your stored data anytime by clicking "Database Vault" in the navigation bar.',
    },
    {
      q: 'Will running an audit modify anything in my GitHub account?',
      a: 'Never. Roast & Rescue strictly inspects public GitHub repositories, commit logs, and README markdown using read-only APIs. No repositories are altered or write tokens requested.',
    },
    {
      q: 'Why deterministic scoring instead of AI hallucination?',
      a: 'AI models can invent arbitrary scores or give different grades each time. Our 0–100 score is computed using deterministic code algorithms that verify commit hygiene, demo links, documentation length, and original vs forked code.',
    },
    {
      q: 'What is the GitHub API rate limit and how do I bypass it?',
      a: 'Unauthenticated requests to GitHub are capped at 60/hr per IP address. You can instantly bypass this by clicking "Token" in the top bar to add your free Personal Access Token, or click any of our instant demo profiles.',
    },
    {
      q: 'Can I add manual entries or custom developer notes to the database?',
      a: 'Yes! Open the Database Vault to add candidate records, write qualitative review notes, attach custom tags, and export data as CSV or JSON.',
    },
  ];

  return (
    <div className="space-y-14 sm:space-y-20 py-2 animate-fadeIn relative">
      {/* HERO SECTION */}
      <section className="text-center max-w-4xl mx-auto px-4 pt-6 sm:pt-10 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[360px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-md transition-all border bg-[#141C2F] border-[#263247] text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
          <span className="font-mono tracking-tight">DEVELOPER AUDIT ENGINE • CLOUD VAULT</span>
          <span className="hidden sm:inline text-slate-600" aria-hidden="true">|</span>
          <span className="hidden sm:inline text-cyan-300 font-mono text-[11px]">Database Storage Enabled</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] mb-5 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Turn Your GitHub Profile Into{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent inline-block">
            An Unfair Advantage
          </span>
        </h1>

        <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-normal ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Get data-grounded code audits, witty constructive roasts, the recruiter&apos;s 30-second verdict, and store all your developer benchmarks in a persistent cloud database vault.
        </p>

        {/* SEARCH & AUDIT FORM */}
        <div className={`max-w-2xl mx-auto rounded-3xl p-4 sm:p-6 border shadow-2xl transition-all relative ${
          isDark
            ? 'bg-[#141C2F] border-[#263247] shadow-black/40'
            : 'bg-white border-slate-200 shadow-slate-200/60'
        }`}>
          <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-[#182238] border border-[#263247] text-[10px] font-mono text-cyan-300 tracking-wider uppercase">
            ⚡ Instant Deep Audit &amp; Cloud Save
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className={`relative flex-1 w-full rounded-2xl border transition-all ${
                isDark
                  ? 'bg-[#0B1020] border-[#232F46] focus-within:border-cyan-500/60'
                  : 'bg-slate-50 border-slate-200 focus-within:border-slate-400'
              }`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400" aria-hidden="true">
                  <Search className="w-5 h-5 text-cyan-400" />
                </div>
                <label htmlFor="github-search-input" className="sr-only">
                  Enter GitHub username
                </label>
                <input
                  type="text"
                  id="github-search-input"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter GitHub username (e.g. torvalds or alex-student-dev)"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  className={`w-full pl-11 pr-4 py-3.5 text-sm sm:text-base font-medium rounded-2xl bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors ${
                    isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-label={loading ? 'Auditing profile...' : 'Audit GitHub Profile'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/30 border border-slate-200 transition-all cursor-pointer disabled:opacity-50 shrink-0 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Flame className="w-4 h-4 text-slate-950" aria-hidden="true" />
                <span>{loading ? 'Auditing...' : 'Audit Profile'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" aria-hidden="true" />
              </button>
            </div>

            {inputError && (
              <div role="alert" className="text-xs text-rose-400 font-medium text-left px-2">
                {inputError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Roast Intensity:</span>
                <div
                  role="radiogroup"
                  aria-label="Select roast intensity"
                  className={`flex items-center p-0.5 rounded-xl border ${
                    isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={intensity === 'gentle'}
                    onClick={() => setIntensity('gentle')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      intensity === 'gentle'
                        ? isDark ? 'bg-[#1C263D] text-emerald-400 shadow-sm border border-[#2D3B55]' : 'bg-white text-emerald-700 shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Gentle
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={intensity === 'medium'}
                    onClick={() => setIntensity('medium')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      intensity === 'medium'
                        ? isDark ? 'bg-[#1C263D] text-cyan-300 shadow-sm border border-[#2D3B55]' : 'bg-white text-cyan-700 shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={intensity === 'spicy'}
                    onClick={() => setIntensity('spicy')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      intensity === 'spicy'
                        ? isDark ? 'bg-[#1C263D] text-rose-400 shadow-sm border border-[#2D3B55]' : 'bg-white text-rose-700 shadow-sm'
                        : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Spicy
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenDatabaseVault}
                  aria-label={`Open Database Storage Vault containing ${storedScans.length} scans`}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
                >
                  <Database className="w-3 h-3" aria-hidden="true" />
                  <span>Database Vault ({storedScans.length})</span>
                </button>

                {onOpenTestRunner && (
                  <button
                    type="button"
                    onClick={onOpenTestRunner}
                    aria-label="Open test suite runner and accessibility inspector"
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md"
                  >
                    <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                    <span>Tests &amp; A11y</span>
                  </button>
                )}

                {githubToken ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    <span>5k/hr Active</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenTokenModal}
                    className="text-xs text-slate-400 hover:text-cyan-300 font-semibold underline flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
                  >
                    <Key className="w-3 h-3 text-cyan-400" aria-hidden="true" />
                    <span>Rate limit protection</span>
                  </button>
                )}
              </div>
            </div>

            {/* Instant Demo Profiles */}
            <div className="pt-3 border-t border-[#232F46] text-left">
              <div className={`text-[11px] mb-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Instant 0-wait demo profiles:
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { user: 'alex-student-dev', label: '@alex-student-dev (Student 42)' },
                  { user: 'priya-fullstack', label: '@priya-fullstack (Solid 84)' },
                  { user: 'shadcn', label: '@shadcn (96)' },
                  { user: 'torvalds', label: '@torvalds (98)' },
                ].map((demo) => (
                  <button
                    key={demo.user}
                    type="button"
                    onClick={() => {
                      setUsernameInput(demo.user);
                      onRunAudit(demo.user);
                    }}
                    aria-label={`Audit demo profile for ${demo.user}`}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isDark
                        ? 'bg-[#0B1020] hover:bg-[#1C263D] border-[#263247] text-slate-300 hover:text-white'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {facts && (
          <div className={`mt-6 max-w-xl mx-auto rounded-2xl p-4 border flex items-center justify-between gap-3 shadow-lg ${
            isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3 text-left">
              <img
                src={`https://github.com/${facts.username}.png`}
                alt={`${facts.username}'s avatar`}
                className="w-10 h-10 rounded-full bg-slate-800 object-cover border border-[#263247]"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                }}
              />
              <div>
                <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Current active audit in memory:</div>
                <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  @{facts.username} ({facts.totalScore}/100)
                </div>
              </div>
            </div>
            <button
              onClick={onResumeAudit}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md border border-slate-200 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span>Resume Audit</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" aria-hidden="true" />
            </button>
          </div>
        )}
      </section>

      {/* ROAST OF THE DAY */}
      <section className="max-w-4xl mx-auto px-4" aria-label="Roast of the Day">
        <RoastOfTheDay isDark={isDark} />
      </section>

      {/* METRICS & PROOF BAR */}
      <section className="max-w-5xl mx-auto px-4" aria-label="Key Platform Metrics">
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl border ${
          isDark ? 'bg-[#141C2F] border-[#263247] shadow-xl shadow-black/20' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              100%
            </div>
            <div className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Cloud Stored in Firestore &amp; Supabase
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              100 PTS
            </div>
            <div className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Deterministic Scoring
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
              30s
            </div>
            <div className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Recruiter Glance Lens
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-slate-200 font-mono">
              CSV &amp; JSON
            </div>
            <div className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Data Export Support
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="max-w-5xl mx-auto px-4" aria-label="Key Features">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141C2F] border border-[#263247] text-xs font-mono text-cyan-300 font-semibold mb-3">
            <span>🛡️ THE RESCUE &amp; STORAGE ARSENAL</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Everything You Need To Fix &amp; Track Portfolios
          </h2>
          <p className={`text-sm sm:text-base mt-2 max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Move from generic repository graveyards to standout profiles, with persistent cloud storage for every scan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-[#141C2F] border-[#263247] hover:border-slate-600 shadow-xl' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-[#1C263D] text-cyan-400 border border-[#2E3C5B] flex items-center justify-center mb-4" aria-hidden="true">
              <Database className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Persistent Database Storage
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Secure cloud collections for candidate audits, custom tags, private evaluation notes, and full CSV/JSON export capability.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-[#141C2F] border-[#263247] hover:border-slate-600 shadow-xl' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-[#1C263D] text-emerald-400 border border-[#2E3C5B] flex items-center justify-center mb-4" aria-hidden="true">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Deterministic 100-Point Rubric
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Evaluates profile basics, repository substance, commit hygiene, project documentation, and community signals objectively.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-[#141C2F] border-[#263247] hover:border-slate-600 shadow-xl' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-[#1C263D] text-amber-400 border border-[#2E3C5B] flex items-center justify-center mb-4" aria-hidden="true">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Data-Grounded Roasts
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Witty, personalized feedback directly referencing commit logs, repo names, and missing licenses. Roast the work, never the person.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-[#141C2F] border-[#263247] hover:border-slate-600 shadow-xl' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-[#1C263D] text-blue-400 border border-[#2E3C5B] flex items-center justify-center mb-4" aria-hidden="true">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI Career Mentor &amp; Doubts
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Ask anything about how recruiters read your profile, how to explain repo gaps, or how to rearchitect your showcase.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-[#141C2F] border-[#263247] hover:border-slate-600 shadow-xl' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-[#1C263D] text-purple-400 border border-[#2E3C5B] flex items-center justify-center mb-4" aria-hidden="true">
              <Swords className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              1v1 Roast Battles
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Pit any two GitHub developers head-to-head in a live battle with category showdowns and saved battle history in the database.
            </p>
          </div>

          <div className={`p-6 rounded-3xl border transition-all ${
            isDark ? 'bg-[#141C2F] border-[#263247] hover:border-slate-600 shadow-xl' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-[#1C263D] text-teal-400 border border-[#2E3C5B] flex items-center justify-center mb-4" aria-hidden="true">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Transparent Scoring Math
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Full mathematical breakdown with exact formulas and weights for original repos, commit messages, and README completeness.
            </p>
          </div>
        </div>
      </section>

      {/* RECENT SCANS HISTORY */}
      {storedScans.length > 0 && (
        <section className="max-w-5xl mx-auto px-4" aria-label="Recent Scans in Database">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <h3 className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                Recent Profile Audits in Database ({storedScans.length})
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDatabaseVault}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
              >
                <Database className="w-3.5 h-3.5" aria-hidden="true" />
                <span>View Full Vault</span>
              </button>
              <button
                onClick={onClearHistory}
                aria-label="Clear all recent profile scans"
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg hover:bg-[#1E2B46] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear History</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {storedScans.slice(0, 6).map((scan) => {
              let scoreColor = 'text-slate-300 border-slate-700 bg-[#1C263D]';
              if (scan.score >= 80) scoreColor = 'text-emerald-400 border-emerald-800/80 bg-emerald-950/40';
              else if (scan.score >= 60) scoreColor = 'text-cyan-400 border-cyan-800/80 bg-cyan-950/40';
              else if (scan.score >= 40) scoreColor = 'text-amber-300 border-amber-800/80 bg-amber-950/40';

              return (
                <div
                  key={scan.id}
                  className={`border p-3.5 rounded-2xl flex items-center justify-between gap-2.5 transition-all group ${
                    isDark
                      ? 'bg-[#141C2F] border-[#263247] hover:border-slate-600 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => {
                      setUsernameInput(scan.username);
                      onSelectScan(scan.username);
                    }}
                    aria-label={`Open audit report for @${scan.username}, score ${scan.score}`}
                    className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
                  >
                    <img
                      src={scan.avatarUrl || `https://github.com/${scan.username}.png`}
                      alt={`${scan.username}'s avatar`}
                      className="w-8 h-8 rounded-full bg-slate-800 object-cover shrink-0 border border-[#263247]"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                      }}
                    />
                    <div className="min-w-0">
                      <div className={`font-bold text-xs truncate group-hover:text-cyan-300 transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        @{scan.username}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(scan.scannedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${scoreColor}`}>
                      {scan.score}
                    </span>
                    <button
                      onClick={() => onDeleteScan(scan.id)}
                      aria-label={`Delete @${scan.username} from history`}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-[#1E2B46] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4" aria-label="Frequently Asked Questions">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141C2F] border border-[#263247] text-xs font-mono text-cyan-300 font-semibold mb-3">
            <span>💡 CLARITY FIRST</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isDark ? 'bg-[#141C2F] border-[#263247] shadow-md' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full p-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>{faq.q}</span>
                  <span className="text-cyan-400 text-lg font-mono" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className={`px-4.5 pb-4.5 text-xs sm:text-sm leading-relaxed border-t ${
                      isDark ? 'border-[#232F46] text-slate-300' : 'border-slate-100 text-slate-600'
                    }`}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center" aria-label="Call to Action">
        <div className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden shadow-2xl ${
          isDark
            ? 'bg-gradient-to-b from-[#141C2F] to-[#111827] border-[#263247]'
            : 'bg-white border-slate-200'
        }`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ready To See What Recruiters See?
          </h2>
          <p className={`text-sm sm:text-base max-w-lg mx-auto mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Audit your public profile in seconds, store audit snapshots in your database vault, and level up your portfolio today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                document.getElementById('github-search-input')?.focus();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/30 border border-slate-200 cursor-pointer transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Flame className="w-4 h-4 text-slate-950" aria-hidden="true" />
              <span>Audit A Profile Now</span>
            </button>
            <button
              onClick={onOpenLogin}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isDark
                  ? 'bg-[#1C263D] hover:bg-[#24314E] text-slate-200 border-[#2E3C5B]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" aria-hidden="true" />
              <span>Log In / Sign Up (Free)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
