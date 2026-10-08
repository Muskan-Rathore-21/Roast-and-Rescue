import React, { useState } from 'react';
import { Swords, Crown, ArrowRight, Loader2 } from 'lucide-react';
import { FactsBundle, BattleRecord } from '../types/analysis.ts';
import { saveBattleToDatabase } from '../lib/databaseService.ts';

interface RoastBattleProps {
  onInspectUser: (username: string) => void;
  onRunAuditInternal: (username: string) => Promise<FactsBundle>;
}

export const RoastBattle: React.FC<RoastBattleProps> = ({
  onInspectUser,
  onRunAuditInternal,
}) => {
  const [userA, setUserA] = useState('gaearon');
  const [userB, setUserB] = useState('alex-student-dev');
  const [loading, setLoading] = useState(false);
  const [battleResult, setBattleResult] = useState<{
    factsA: FactsBundle;
    factsB: FactsBundle;
    winner: 'A' | 'B' | 'TIE';
    verdict: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runBattle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userA.trim() || !userB.trim()) return;
    setLoading(true);
    setError(null);
    setBattleResult(null);

    try {
      const [factsA, factsB] = await Promise.all([
        onRunAuditInternal(userA.trim()),
        onRunAuditInternal(userB.trim()),
      ]);

      let winner: 'A' | 'B' | 'TIE' = 'TIE';
      let verdict = '';
      if (factsA.totalScore > factsB.totalScore) {
        winner = 'A';
        const diff = factsA.totalScore - factsB.totalScore;
        verdict = `@${factsA.username} crushed @${factsB.username} by +${diff} points! Better documentation, cleaner git history, and fewer abandoned tutorial clones.`;
      } else if (factsB.totalScore > factsA.totalScore) {
        winner = 'B';
        const diff = factsB.totalScore - factsA.totalScore;
        verdict = `@${factsB.username} takes the championship over @${factsA.username} by +${diff} points! Clearer project packaging and more consistent shipping cadence won the day.`;
      } else {
        winner = 'TIE';
        verdict = `An absolute stalemate! Both developers scored identically at ${factsA.totalScore} points.`;
      }

      setBattleResult({ factsA, factsB, winner, verdict });

      // Save Battle Duel outcome to Cloud Database
      const record: BattleRecord = {
        id: `battle-${Date.now()}`,
        userA: factsA.username,
        userB: factsB.username,
        scoreA: factsA.totalScore,
        scoreB: factsB.totalScore,
        winner,
        verdict,
        createdAt: new Date().toISOString(),
      };
      saveBattleToDatabase(record).catch(console.error);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to execute Roast Battle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200 border border-slate-300 text-black text-xs font-mono font-semibold shadow-sm">
            <Swords className="w-3.5 h-3.5 text-black" />
            <span>HEAD-TO-HEAD DEVELOPER SHOWDOWN</span>
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Roast Battle
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
          Put two usernames in the arena. Our deterministic scoring engine compares their repositories, documentation, and Git hygiene, persisting battle duels to the cloud.
        </p>
      </div>

      <form onSubmit={runBattle} className="bg-[#141C2F] border border-[#263247] rounded-3xl p-6 shadow-xl mb-8">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Contender 1</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono">@</span>
              <input
                type="text"
                value={userA}
                onChange={(e) => setUserA(e.target.value)}
                placeholder="username1"
                className="w-full bg-[#0B1020] border border-[#232F46] focus:border-cyan-500/60 text-white rounded-xl pl-8 pr-3 py-2.5 text-sm font-mono focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <div className="w-9 h-9 rounded-full bg-[#1C263D] border border-[#2E3C5B] flex items-center justify-center font-black text-cyan-300 text-xs shadow-lg">
              VS
            </div>
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Contender 2</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono">@</span>
              <input
                type="text"
                value={userB}
                onChange={(e) => setUserB(e.target.value)}
                placeholder="username2"
                className="w-full bg-[#0B1020] border border-[#232F46] focus:border-cyan-500/60 text-white rounded-xl pl-8 pr-3 py-2.5 text-sm font-mono focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-rose-900/60 text-xs text-rose-300">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-sm flex items-center gap-2 shadow-md border border-slate-200 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Auditing Battle Contenders...</span>
              </>
            ) : (
              <>
                <Swords className="w-4 h-4 text-black" />
                <span>Commence Battle!</span>
              </>
            )}
          </button>
        </div>
      </form>

      {battleResult && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-[#141C2F] border border-[#263247] rounded-3xl p-6 text-center shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#1C263D] text-amber-400 flex items-center justify-center mx-auto mb-3 border border-[#2E3C5B]">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {battleResult.winner === 'A'
                ? `👑 @${battleResult.factsA.username} Takes The Crown!`
                : battleResult.winner === 'B'
                ? `👑 @${battleResult.factsB.username} Takes The Crown!`
                : '🤝 It is a Dead Heat Tie!'}
            </h3>
            <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto italic">
              &ldquo;{battleResult.verdict}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`bg-[#141C2F] border rounded-2xl p-6 relative ${
                battleResult.winner === 'A'
                  ? 'border-emerald-500/50 shadow-xl shadow-emerald-500/10'
                  : 'border-[#263247]'
              }`}
            >
              {battleResult.winner === 'A' && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md border border-slate-300">
                  <Crown className="w-3.5 h-3.5 text-black" /> Winner
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://github.com/${battleResult.factsA.username}.png`}
                    alt={battleResult.factsA.username}
                    className="w-12 h-12 rounded-full bg-slate-800 object-cover border border-[#263247]"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      @{battleResult.factsA.username}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {battleResult.factsA.grade}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black font-mono text-white">
                    {battleResult.factsA.totalScore}
                  </span>
                  <span className="text-xs text-slate-500 font-mono block">/100 PTS</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-3 border-y border-[#232F46] my-4">
                <div>
                  <span className="text-slate-500 block">Repos</span>
                  <span className="font-bold text-white">
                    {battleResult.factsA.metrics.publicRepoCount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stars</span>
                  <span className="font-bold text-white">
                    {battleResult.factsA.metrics.totalStars}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Lazy Commits</span>
                  <span className="font-bold text-slate-300">
                    {battleResult.factsA.metrics.overallGenericCommitRate}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => onInspectUser(battleResult.factsA.username)}
                className="w-full py-2 rounded-xl bg-[#1C263D] hover:bg-[#25324E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#2E3C5B]"
              >
                <span>Full Audit Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div
              className={`bg-[#141C2F] border rounded-2xl p-6 relative ${
                battleResult.winner === 'B'
                  ? 'border-emerald-500/50 shadow-xl shadow-emerald-500/10'
                  : 'border-[#263247]'
              }`}
            >
              {battleResult.winner === 'B' && (
                <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-white text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md border border-slate-300">
                  <Crown className="w-3.5 h-3.5 text-black" /> Winner
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://github.com/${battleResult.factsB.username}.png`}
                    alt={battleResult.factsB.username}
                    className="w-12 h-12 rounded-full bg-slate-800 object-cover border border-[#263247]"
                  />
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      @{battleResult.factsB.username}
                    </h4>
                    <span className="text-xs text-slate-400 font-mono">
                      {battleResult.factsB.grade}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black font-mono text-white">
                    {battleResult.factsB.totalScore}
                  </span>
                  <span className="text-xs text-slate-500 font-mono block">/100 PTS</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-3 border-y border-[#232F46] my-4">
                <div>
                  <span className="text-slate-500 block">Repos</span>
                  <span className="font-bold text-white">
                    {battleResult.factsB.metrics.publicRepoCount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stars</span>
                  <span className="font-bold text-white">
                    {battleResult.factsB.metrics.totalStars}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Lazy Commits</span>
                  <span className="font-bold text-slate-300">
                    {battleResult.factsB.metrics.overallGenericCommitRate}%
                  </span>
                </div>
              </div>

              <button
                onClick={() => onInspectUser(battleResult.factsB.username)}
                className="w-full py-2 rounded-xl bg-[#1C263D] hover:bg-[#25324E] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#2E3C5B]"
              >
                <span>Full Audit Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
