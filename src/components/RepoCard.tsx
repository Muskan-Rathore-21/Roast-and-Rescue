import React from 'react';
import { RepoAnalysis, RepoRoastItem } from '../types/analysis.ts';
import { Star, GitFork, ExternalLink, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface RepoCardProps {
  repo: RepoAnalysis;
  roastItem?: RepoRoastItem;
  onGenerateReadme: (repoName: string) => void;
  isDark?: boolean;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo, roastItem, onGenerateReadme, isDark = true }) => {
  let gradeColor = isDark
    ? 'text-slate-300 bg-slate-800 border-slate-700'
    : 'bg-slate-100 text-slate-800 border-slate-200';
  if (repo.healthGrade === 'A') {
    gradeColor = isDark
      ? 'text-emerald-300 bg-emerald-950/50 border-emerald-800/80'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (repo.healthGrade === 'B') {
    gradeColor = isDark
      ? 'text-cyan-300 bg-cyan-950/50 border-cyan-800/80'
      : 'bg-cyan-50 text-cyan-800 border-cyan-200';
  } else if (repo.healthGrade === 'C') {
    gradeColor = isDark
      ? 'text-amber-300 bg-amber-950/50 border-amber-800/80'
      : 'bg-amber-50 text-amber-800 border-amber-200';
  }

  return (
    <div className={`border rounded-2xl p-5 transition-all flex flex-col justify-between shadow-md ${
      isDark
        ? 'bg-[#141C2F] border-[#263247] hover:border-slate-600'
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <a
                href={`https://github.com/${repo.fullName}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-bold text-sm sm:text-base transition-colors truncate flex items-center gap-1.5 ${
                  isDark ? 'text-white hover:text-cyan-300' : 'text-slate-900 hover:text-blue-600'
                }`}
                title={repo.name}
              >
                <span>{repo.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </a>
            </div>
            {repo.description ? (
              <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {repo.description}
              </p>
            ) : (
              <p className={`text-xs italic mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Missing repository description
              </p>
            )}
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${gradeColor}`}
              title={`Health score: ${repo.healthScore}/100`}
            >
              Grade {repo.healthGrade}
            </span>
            <span className={`text-[10px] mt-0.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {repo.healthScore}/100
            </span>
          </div>
        </div>

        <div className={`mt-3 flex flex-wrap items-center gap-2 text-[11px] font-mono ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {repo.language && (
            <span className={`px-2 py-0.5 rounded ${
              isDark ? 'bg-[#0B1020] text-cyan-300 border border-[#232F46]' : 'bg-slate-100 text-slate-700'
            }`}>
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400" />
            {repo.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="w-3 h-3 text-slate-400" />
            {repo.forks}
          </span>
          {repo.homepage && (
            <a
              href={repo.homepage.startsWith('http') ? repo.homepage : `https://${repo.homepage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 hover:underline flex items-center gap-1 font-semibold"
            >
              Live Demo ↗
            </a>
          )}
        </div>

        {(repo.committedSecretsOrEnv || repo.committedNodeModulesOrVenv || repo.genericCommitPercentage > 50) && (
          <div className="mt-3 space-y-1">
            {repo.committedSecretsOrEnv && (
              <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border ${
                isDark
                  ? 'bg-rose-950/40 text-rose-300 border-rose-900/60'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                <span className="font-semibold">Exposed .env / credentials detected</span>
              </div>
            )}
            {repo.committedNodeModulesOrVenv && (
              <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border ${
                isDark
                  ? 'bg-[#0B1020] text-slate-300 border-[#232F46]'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}>
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span>node_modules or venv committed</span>
              </div>
            )}
            {repo.genericCommitPercentage > 50 && (
              <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border ${
                isDark
                  ? 'bg-[#0B1020] text-slate-300 border-[#232F46]'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}>
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span>{repo.genericCommitPercentage}% low-effort commits (&ldquo;update&rdquo;, &ldquo;fix&rdquo;)</span>
              </div>
            )}
          </div>
        )}

        {roastItem && (
          <div className={`mt-3.5 p-3 rounded-xl border text-xs italic ${
            isDark
              ? 'bg-[#0B1020] border-[#232F46] text-slate-200'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="text-black bg-slate-200 px-1.5 py-0.5 rounded text-[11px] font-bold not-italic mr-1.5 shadow-sm">
              Roast:
            </span>
            &ldquo;{roastItem.roast}&rdquo;
          </div>
        )}
      </div>

      <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
        isDark ? 'border-[#232F46]' : 'border-slate-100'
      }`}>
        <div className={`text-[11px] font-mono flex items-center gap-1.5 ${
          repo.hasReadme
            ? isDark ? 'text-emerald-400' : 'text-emerald-700'
            : isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {repo.hasReadme ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>README ({repo.readmeLength} chars)</span>
            </>
          ) : (
            <span>No README found</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onGenerateReadme(repo.name)}
          aria-label={`Generate clean professional README markdown template for ${repo.name}`}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
            isDark
              ? 'bg-[#1C263D] hover:bg-[#25324E] text-white border-[#2E3C5B]'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
          }`}
          title="Generate clean professional README markdown template"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Fix README</span>
        </button>
      </div>
    </div>
  );
};
