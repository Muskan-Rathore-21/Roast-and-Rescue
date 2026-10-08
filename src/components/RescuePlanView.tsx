import React, { useState } from 'react';
import { RescuePlanItem } from '../types/analysis.ts';
import { CheckSquare, Square, ChevronDown, ChevronUp, Sparkles, CloudCheck } from 'lucide-react';

interface RescuePlanViewProps {
  rescuePlan: RescuePlanItem[];
  username: string;
  onGenerateProfileReadme: () => void;
  onSaveProgressToCloud?: (completedIds: string[]) => void;
  isDark?: boolean;
}

export const RescuePlanView: React.FC<RescuePlanViewProps> = ({
  rescuePlan,
  onGenerateProfileReadme,
  onSaveProgressToCloud,
  isDark = true,
}) => {
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [expandedId, setExpandedId] = useState<string | null>(rescuePlan[0]?.id || null);
  const [filter, setFilter] = useState<'all' | 'high-impact' | 'quick-wins'>('all');

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...completedIds, [id]: !completedIds[id] };
    setCompletedIds(updated);
    if (onSaveProgressToCloud) {
      const activeIds = Object.keys(updated).filter((k) => updated[k]);
      onSaveProgressToCloud(activeIds);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredItems = rescuePlan.filter((item) => {
    if (filter === 'high-impact') return item.impact === 'High';
    if (filter === 'quick-wins') return item.effort === '5 min' || item.effort === '15 min';
    return true;
  });

  const completedCount = Object.values(completedIds).filter(Boolean).length;
  const progressPercent = rescuePlan.length > 0 ? Math.round((completedCount / rescuePlan.length) * 100) : 0;

  return (
    <div className={`border rounded-2xl p-5 sm:p-6 shadow-xl transition-colors ${
      isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isDark ? 'border-[#232F46]' : 'border-slate-100'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              The Rescue Plan
            </h3>
            <span className="text-[10px] font-mono uppercase bg-[#182238] border border-[#2D3B55] px-2 py-0.5 rounded text-cyan-300 font-semibold">
              RESCUE MISSION
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Prioritized by ROI (Impact vs Effort). Checked items are automatically saved to your cloud database.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border ${
            isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="text-right">
              <div className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {completedCount} of {rescuePlan.length} Fixed
              </div>
              <div className={`text-[10px] font-mono flex items-center gap-1 justify-end ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <CloudCheck className="w-3 h-3 text-emerald-400" />
                <span>Cloud Synced</span>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs font-mono ${
              isDark ? 'border-emerald-500/60 text-emerald-400' : 'border-emerald-300 text-emerald-700'
            }`}>
              {progressPercent}%
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${
          isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'all'
                ? isDark
                  ? 'bg-[#1C263D] text-white font-bold border border-[#2E3C5B]'
                  : 'bg-white text-slate-900 shadow-sm font-bold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All Items ({rescuePlan.length})
          </button>
          <button
            onClick={() => setFilter('high-impact')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'high-impact'
                ? isDark
                  ? 'bg-[#1C263D] text-white font-bold border border-[#2E3C5B]'
                  : 'bg-white text-slate-900 shadow-sm font-bold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            High Impact
          </button>
          <button
            onClick={() => setFilter('quick-wins')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              filter === 'quick-wins'
                ? isDark
                  ? 'bg-[#1C263D] text-white font-bold border border-[#2E3C5B]'
                  : 'bg-white text-slate-900 shadow-sm font-bold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Quick Wins
          </button>
        </div>

        <button
          onClick={onGenerateProfileReadme}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-black border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-black" />
          <span>Generate Profile README.md</span>
        </button>
      </div>

      <div className="mt-4 space-y-2.5">
        {filteredItems.map((item, idx) => {
          const isDone = Boolean(completedIds[item.id]);
          const isExpanded = expandedId === item.id;
          let impactBadge = isDark
            ? 'bg-[#1C263D] text-slate-200 border-[#2E3C5B]'
            : 'bg-slate-100 text-slate-800 border-slate-300';
          if (item.impact === 'High') {
            impactBadge = isDark
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
              : 'bg-emerald-50 text-emerald-900 border-emerald-300';
          }

          return (
            <div
              key={item.id}
              className={`border rounded-xl transition-all ${
                isDone
                  ? isDark
                    ? 'bg-[#0B1020]/40 border-[#1A2333] opacity-60'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                  : isDark
                  ? 'bg-[#0B1020] border-[#232F46] hover:border-slate-700'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={(e) => toggleCheck(item.id, e)}
                    className="shrink-0 p-0.5 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    title={isDone ? 'Mark as incomplete' : 'Mark as done'}
                  >
                    {isDone ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono font-bold ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        #{idx + 1}
                      </span>
                      <h4
                        className={`text-xs sm:text-sm font-bold truncate ${
                          isDone
                            ? 'line-through text-slate-500'
                            : isDark
                            ? 'text-white'
                            : 'text-slate-900'
                        }`}
                      >
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${impactBadge}`}>
                    {item.impact}
                  </span>
                  <span className={`text-[11px] font-mono hidden xs:inline ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {item.effort}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className={`px-4 pb-4 pt-1 border-t text-xs space-y-3 animate-fadeIn ${
                  isDark ? 'border-[#232F46]' : 'border-slate-200'
                }`}>
                  <div className="mt-2">
                    <span className="font-bold text-black bg-slate-200 px-2 py-0.5 rounded text-[11px] inline-block mb-1 shadow-sm">
                      Why this matters:
                    </span>
                    <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {item.why}
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-200 block mb-1">Action steps:</span>
                    <ol className={`space-y-1.5 list-decimal list-inside leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {item.steps.map((step: string, sIdx: number) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
