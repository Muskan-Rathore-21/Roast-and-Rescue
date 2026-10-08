import React from 'react';
import { Lock, Sparkles, UserCheck, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, FileCode } from 'lucide-react';

interface GatedSectionCardProps {
  username: string;
  onOpenLogin: () => void;
  onQuickDemoLogin: () => void;
  isDark?: boolean;
}

export const GatedSectionCard: React.FC<GatedSectionCardProps> = ({
  username,
  onOpenLogin,
  onQuickDemoLogin,
  isDark = true,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${
        isDark
          ? 'bg-[#141C2F] border-[#263247] shadow-xl'
          : 'bg-white border-slate-200 shadow-xl'
      } p-6 sm:p-8 text-center`}
    >
      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-black text-xs font-mono font-semibold shadow-sm">
            <Lock className="w-3.5 h-3.5 text-black" />
            <span>MEMBER ACCESS • 100% FREE</span>
          </div>
        </div>

        <h3 className={`text-2xl sm:text-3xl font-black tracking-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Unlock @{username}&apos;s Rescue Plan &amp; AI Career Coach
        </h3>
        <p className={`text-sm sm:text-base leading-relaxed mb-6 max-w-lg mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Log in or sign up to access your personalized remediation roadmap, 1-click README generators, and interactive doubt solver saved in your cloud database.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
          <div className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Actionable Roadmap</h4>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Ranked fixes by impact &amp; effort to quickly boost your score.
            </p>
          </div>
          <div className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>1-Click READMEs</h4>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Ready-to-copy profile and repository README templates.
            </p>
          </div>
          <div className={`p-3.5 rounded-2xl border ${
            isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center mb-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
            </div>
            <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Ask AI Career Mentor</h4>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Answers to resume, repo, and interview questions.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-md border border-slate-200 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-black" />
            <span>Log In / Sign Up (Free)</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
          <button
            onClick={onQuickDemoLogin}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isDark
                ? 'bg-[#1C263D] hover:bg-[#25324E] text-white border-[#2E3C5B]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant 1-Click Demo Login</span>
          </button>
        </div>

        <div className={`mt-4 text-[11px] flex items-center justify-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>No credit card required • Public GitHub data only</span>
        </div>
      </div>
    </div>
  );
};
