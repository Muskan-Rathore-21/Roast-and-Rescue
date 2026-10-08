import React, { useEffect, useState } from 'react';
import { ProfileGrade } from '../types/analysis.ts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreGaugeProps {
  score: number;
  grade: ProfileGrade;
  previousScore?: number;
  isDark?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, grade, previousScore, isDark = true }) => {
  const [displayedScore, setDisplayedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = score / totalSteps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayedScore(score);
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [score]);

  let strokeColor = '#64748b';
  if (score >= 90) {
    strokeColor = '#10b981';
  } else if (score >= 75) {
    strokeColor = '#06b6d4';
  } else if (score >= 55) {
    strokeColor = '#3b82f6';
  } else if (score >= 35) {
    strokeColor = '#94a3b8';
  }

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreDiff = previousScore !== undefined ? score - previousScore : null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={isDark ? '#1e293b' : '#e2e8f0'}
            strokeWidth="11"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="11"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-4xl sm:text-5xl font-black tracking-tight font-mono transition-colors ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            {displayedScore}
          </span>
          <span className={`text-[10px] font-semibold uppercase tracking-widest mt-0.5 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            / 100 PTS
          </span>
        </div>
      </div>

      <div className="mt-3 px-3.5 py-1 rounded-full text-xs font-bold border border-slate-300 tracking-wide shadow-sm bg-slate-200 text-black">
        Profile Grade: {grade}
      </div>

      {scoreDiff !== null && (
        <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium font-mono">
          {scoreDiff > 0 ? (
            <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800">
              <TrendingUp className="w-3 h-3" />
              +{scoreDiff} pts since last audit
            </span>
          ) : scoreDiff < 0 ? (
            <span className="text-slate-400 flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              <TrendingDown className="w-3 h-3" />
              {scoreDiff} pts since last audit
            </span>
          ) : (
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
              <Minus className="w-3 h-3 inline" /> Same score as previous audit
            </span>
          )}
        </div>
      )}
    </div>
  );
};
