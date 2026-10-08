import React from 'react';
import { X, Scale, Cpu } from 'lucide-react';

interface MethodologyModalProps {
  onClose: () => void;
}

const RUBRIC = [
  {
    category: '1. Profile Basics',
    points: 15,
    details: 'Custom non-identicon avatar (+3), full name (+3), descriptive bio >20 chars (+4), location (+2), website / portfolio URL (+2), organization / affiliation (+1).',
  },
  {
    category: '2. Profile README',
    points: 10,
    details: 'Presence of username/username repository (+5), rich length >300 chars featuring skills, flagship links, and social contacts (+5).',
  },
  {
    category: '3. Project Quality',
    points: 25,
    details: 'Average health of top 6 repos: clear descriptions (+5), GitHub topics (+3), live demo URL / deployed web app (+7), open-source license (+4), non-fork code size >50KB (+6).',
  },
  {
    category: '4. README Documentation',
    points: 20,
    details: 'Average across top 6 repos: comprehensive length >400 chars (+4), title & tech stack badges (+4), installation & quickstart commands (+5), screenshot/media previews (+4), feature bullet points (+3).',
  },
  {
    category: '5. Activity & Consistency',
    points: 15,
    details: 'Spread across active weeks in the past 6 months (up to +10 pts for 12+ active weeks), recency of last push (+5 pts for push in last 7 days; 0 pts if dead gap >90 days).',
  },
  {
    category: '6. Finish Rate & Focus',
    points: 10,
    details: 'Ratio of finished repos with descriptions and commits (+5), presence of 2+ solid flagship projects (+5). Penalty (-2 pts) if clogged with empty tutorial clones or test junk.',
  },
  {
    category: '7. Community Signals',
    points: 5,
    details: 'Genuine engagement: GitHub stars earned across repositories (+3), external forks (+1), sustained account track record (+1).',
  },
];

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#141C2F] border border-[#263247] rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
        <div className="p-5 border-b border-[#232F46] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1C263D] border border-[#2E3C5B] flex items-center justify-center text-cyan-300">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Scoring Methodology</h3>
              <p className="text-xs text-slate-400">100% deterministic code. Zero LLM hallucinations.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="bg-[#0B1020] border border-[#232F46] p-4 rounded-xl text-xs sm:text-sm text-slate-300 space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-1.5 text-sm">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Core Principle: Code Computes the Facts, AI Crafts Delivery</span>
            </div>
            <p className="leading-relaxed">
              Your Profile Score (0-100) is evaluated strictly using deterministic algorithms checking real GitHub repository data. The LLM is given only these verified facts to write the roast jokes and recruiter review.
            </p>
          </div>

          <div className="space-y-3">
            {RUBRIC.map((item, idx) => (
              <div key={idx} className="bg-[#0B1020] border border-[#232F46] p-3.5 rounded-xl">
                <div className="flex items-center justify-between text-sm font-bold text-white mb-1">
                  <span>{item.category}</span>
                  <span className="font-mono text-emerald-400">{item.points} pts max</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.details}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#232F46]">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Grade Tiers</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
              <div className="bg-[#0B1020] border border-emerald-800/80 p-2 rounded-lg text-emerald-300 font-bold">
                90-100<div className="text-[10px] font-sans">Hire-ready</div>
              </div>
              <div className="bg-[#0B1020] border border-cyan-800/80 p-2 rounded-lg text-cyan-300 font-bold">
                75-89<div className="text-[10px] font-sans">Solid</div>
              </div>
              <div className="bg-[#0B1020] border border-amber-800/80 p-2 rounded-lg text-amber-300 font-bold">
                55-74<div className="text-[10px] font-sans">Needs Work</div>
              </div>
              <div className="bg-[#0B1020] border border-[#2E3C5B] p-2 rounded-lg text-slate-300 font-bold">
                35-54<div className="text-[10px] font-sans">Roast-worthy</div>
              </div>
              <div className="bg-[#0B1020] border border-slate-800 p-2 rounded-lg text-slate-400 font-bold">
                &lt; 35<div className="text-[10px] font-sans">Blank Canvas</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#0B1020] border-t border-[#232F46] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
