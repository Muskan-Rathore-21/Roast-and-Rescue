import React, { useState } from 'react';
import { CategoryScores } from '../types/analysis.ts';
import { ChevronDown, ChevronUp, User, FileText, FolderGit2, BookOpen, Activity, Target, Users } from 'lucide-react';

interface CategoryBarsProps {
  categoryScores: CategoryScores;
  isDark?: boolean;
}

const CATEGORY_META = [
  { key: 'profileBasics', icon: User, colorDark: 'from-slate-400 to-slate-200', colorLight: 'from-slate-600 to-slate-800' },
  { key: 'profileReadme', icon: FileText, colorDark: 'from-emerald-500 to-teal-400', colorLight: 'from-emerald-600 to-teal-600' },
  { key: 'projectQuality', icon: FolderGit2, colorDark: 'from-cyan-500 to-blue-400', colorLight: 'from-cyan-600 to-blue-600' },
  { key: 'readmeQuality', icon: BookOpen, colorDark: 'from-indigo-400 to-purple-400', colorLight: 'from-indigo-600 to-purple-600' },
  { key: 'activityConsistency', icon: Activity, colorDark: 'from-teal-400 to-emerald-400', colorLight: 'from-teal-600 to-emerald-600' },
  { key: 'finishRateFocus', icon: Target, colorDark: 'from-blue-400 to-indigo-400', colorLight: 'from-blue-600 to-indigo-600' },
  { key: 'communitySignals', icon: Users, colorDark: 'from-slate-400 to-slate-300', colorLight: 'from-slate-500 to-slate-700' },
] as const;

export const CategoryBars: React.FC<CategoryBarsProps> = ({ categoryScores, isDark = true }) => {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className={`border rounded-2xl p-5 sm:p-6 shadow-xl transition-colors ${
      isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Deterministic Category Breakdown
            </h3>
            <span className="text-[10px] font-mono uppercase bg-[#182238] border border-[#2D3B55] px-2 py-0.5 rounded text-cyan-300 font-semibold">
              100 PTS RUBRIC
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Computed by verified code rules — never arbitrary or hallucinated
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {CATEGORY_META.map(({ key, icon: Icon, colorDark, colorLight }) => {
          const item = categoryScores[key];
          const percentage = Math.round((item.score / item.max) * 100);
          const isExpanded = expandedKey === key;
          const gradientColor = isDark ? colorDark : colorLight;

          return (
            <div
              key={key}
              className={`border rounded-xl p-3 sm:p-3.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-[#0B1020] border-[#232F46] hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => toggleExpand(key)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-[#1C263D] text-cyan-400 border border-[#2E3C5B]' : 'bg-white text-slate-700 border border-slate-200'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.label}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className={`text-sm font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {item.score}
                    </span>
                    <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      /{item.max}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              <div className={`mt-2.5 w-full h-2 rounded-full overflow-hidden ${
                isDark ? 'bg-slate-800' : 'bg-slate-200'
              }`}>
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${gradientColor} transition-all duration-700`}
                  style={{ width: `${Math.max(4, percentage)}%` }}
                />
              </div>

              {isExpanded && (
                <div className={`mt-3 pt-3 border-t text-xs space-y-1.5 animate-fadeIn ${
                  isDark ? 'border-[#232F46] text-slate-300' : 'border-slate-200 text-slate-600'
                }`}>
                  {item.breakdown.map((b: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-black bg-slate-200 w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                        •
                      </span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
