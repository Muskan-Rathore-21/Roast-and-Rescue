import React from 'react';
import { CheckCircle2, AlertTriangle, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';

interface RecruiterViewProps {
  verdict: {
    impression: 'Would keep reading' | 'Maybe' | 'Would close tab';
    summary: string;
  };
  greenFlags: string[];
  redFlags: string[];
  isDark?: boolean;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  verdict,
  greenFlags,
  redFlags,
  isDark = true,
}) => {
  let impressionBadge = isDark
    ? 'bg-slate-800 text-slate-200 border-slate-700'
    : 'bg-slate-100 text-slate-800 border-slate-300';
  if (verdict.impression === 'Would keep reading') {
    impressionBadge = isDark
      ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (verdict.impression === 'Would close tab') {
    impressionBadge = isDark
      ? 'bg-rose-950/40 text-rose-300 border-rose-800/60'
      : 'bg-rose-50 text-rose-900 border-rose-200';
  }

  return (
    <div className={`border rounded-2xl p-5 sm:p-6 shadow-xl transition-colors ${
      isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
        isDark ? 'border-[#232F46]' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            isDark ? 'bg-[#1C263D] border-[#2E3C5B] text-cyan-300' : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}>
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Recruiter&apos;s 30-Second Skim
              </h3>
              <span className="text-[10px] font-mono uppercase bg-[#182238] border border-[#2D3B55] px-2 py-0.5 rounded text-cyan-300 font-semibold">
                HR LENS
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              What hiring managers notice before deciding whether to call you
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Impression:</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${impressionBadge}`}>
            {verdict.impression}
          </span>
        </div>
      </div>

      <p className={`mt-4 text-xs sm:text-sm leading-relaxed italic p-4 rounded-xl border ${
        isDark
          ? 'bg-[#0B1020] text-slate-200 border-[#232F46]'
          : 'bg-slate-50 text-slate-800 border-slate-200'
      }`}>
        &ldquo;{verdict.summary}&rdquo;
      </p>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Green Flags */}
        <div className={`border rounded-xl p-4 transition-colors ${
          isDark
            ? 'bg-[#0B1020] border-emerald-900/40'
            : 'bg-emerald-50/70 border-emerald-200'
        }`}>
          <div className={`flex items-center gap-2 mb-3 font-bold text-xs sm:text-sm ${
            isDark ? 'text-emerald-300' : 'text-emerald-900'
          }`}>
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Green Flags (Keep these!)</span>
          </div>
          <ul className={`space-y-2 text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {greenFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Red Flags */}
        <div className={`border rounded-xl p-4 transition-colors ${
          isDark
            ? 'bg-[#0B1020] border-[#232F46]'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`flex items-center gap-2 mb-3 font-bold text-xs sm:text-sm ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Red Flags (Fix these first)</span>
          </div>
          <ul className={`space-y-2 text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
