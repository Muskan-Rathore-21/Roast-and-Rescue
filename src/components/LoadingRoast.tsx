import React, { useEffect, useState } from 'react';
import { Flame, GitCommit, FileText, Search, ShieldAlert, Sparkles } from 'lucide-react';

const STEPS = [
  { text: 'Fetching profile data & repository catalog...', icon: Search },
  { text: 'Computing commit frequency & original vs forked ratios...', icon: GitCommit },
  { text: 'Analyzing README quality, lengths & live project links...', icon: FileText },
  { text: 'Auditing commit message hygiene & generic commit patterns...', icon: Search },
  { text: 'Scanning for committed secrets, .env files & node_modules...', icon: ShieldAlert },
  { text: 'Calculating final deterministic 0-100 score & letter grade...', icon: Sparkles },
];

export const LoadingRoast: React.FC<{ username: string }> = ({ username }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = STEPS[stepIndex].icon;

  return (
    <div className="min-h-[460px] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-[#141C2F] border border-[#263247] animate-pulse flex items-center justify-center shadow-xl">
          <CurrentIcon className="w-8 h-8 text-cyan-300 animate-bounce" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#1C263D] border border-[#2E3C5B] flex items-center justify-center">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
        Auditing <span className="text-white font-mono bg-[#141C2F] px-2.5 py-0.5 rounded-lg border border-[#263247]">@{username}</span>
      </h3>

      <div className="h-12 flex items-center justify-center max-w-md px-4">
        <p className="text-slate-300 font-mono text-sm sm:text-base font-medium leading-relaxed transition-all">
          {STEPS[stepIndex].text}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mt-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === stepIndex ? 'w-6 bg-cyan-400' : i < stepIndex ? 'w-2 bg-slate-500' : 'w-2 bg-slate-800'
            }`}
          />
        ))}
      </div>

      <div className="mt-8 text-xs text-slate-400 font-mono flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Evaluating 100-point rubric • Inspecting commit messages &amp; repositories</span>
      </div>
    </div>
  );
};
