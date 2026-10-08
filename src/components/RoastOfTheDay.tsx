import React, { useState } from 'react';
import { RefreshCw, Flame, Quote } from 'lucide-react';
import { FUNNY_ROASTS_LIST } from '../lib/roastsData.ts';

interface RoastOfTheDayProps {
  isDark?: boolean;
}

export const RoastOfTheDay: React.FC<RoastOfTheDayProps> = ({ isDark = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const nextRoast = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % FUNNY_ROASTS_LIST.length);
      setAnimating(false);
    }, 150);
  };

  const currentRoast = FUNNY_ROASTS_LIST[currentIndex];

  return (
    <div
      className={`border rounded-2xl p-4 sm:p-5 shadow-xl transition-all relative overflow-hidden ${
        isDark
          ? 'bg-gradient-to-r from-[#111827] via-[#141C2F] to-[#111827] border-[#263247]'
          : 'bg-gradient-to-r from-slate-50 via-white to-slate-50 border-slate-200'
      }`}
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold tracking-wider uppercase ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                Roast of the Day
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isDark ? 'bg-[#182238] border-[#2D3B55] text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
              }`}>
                #{currentIndex + 1} of {FUNNY_ROASTS_LIST.length}
              </span>
            </div>
            <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Daily reminder that nobody builds cleanly on the first commit
            </div>
          </div>
        </div>

        <button
          onClick={nextRoast}
          className={`self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
            isDark
              ? 'bg-[#182238] hover:bg-[#1E2B46] text-slate-200 border-[#2D3B55] hover:border-slate-500 shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-sm'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${animating ? 'animate-spin' : ''}`} />
          <span>Another Roast</span>
        </button>
      </div>

      <div
        className={`mt-3.5 p-3.5 sm:p-4 rounded-xl border flex items-start gap-3 transition-opacity duration-150 ${
          animating ? 'opacity-40' : 'opacity-100'
        } ${
          isDark
            ? 'bg-[#0B1020]/70 border-[#1E2A40] text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <Quote className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-cyan-400/80' : 'text-cyan-600'}`} />
        <p className={`text-xs sm:text-sm font-medium leading-relaxed italic ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
          &ldquo;{currentRoast}&rdquo;
        </p>
      </div>
    </div>
  );
};
