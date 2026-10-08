import React, { useState } from 'react';
import { FactsBundle } from '../types/analysis.ts';
import { MessageSquareCode, Send, Sparkles, User, Copy, Check, HelpCircle, Loader2 } from 'lucide-react';

interface AskDoubtSectionProps {
  facts: FactsBundle;
  isDark?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AskDoubtSection: React.FC<AskDoubtSectionProps> = ({ facts, isDark = true }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hey @${facts.username}! I've audited your profile (${facts.totalScore}/100, ${facts.grade}). Got doubts about your roast jokes, flagged issues, or how to tackle the rescue plan? Ask me anything below and I'll give you direct, step-by-step guidance!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const suggestedPrompts = [
    `How do I fix the issues in ${facts.topRepos?.[0]?.name || 'my main repo'}?`,
    'How do I lift my profile score to 80+?',
    'What should I write in my Profile README?',
    'How can I make my commit history look professional?',
  ];

  const sendMessage = async (questionText: string) => {
    const text = questionText.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const qLower = text.toLowerCase();
      let answer = '';

      if (qLower.includes('.env') || qLower.includes('secret') || qLower.includes('password') || qLower.includes('key')) {
        answer = `### How to Safely Remove Leaked Secrets from Git\n\n1. **Rotate/Revoke Immediately:** Treat any leaked credentials as compromised. Invalidate them first.\n2. **Add to \`.gitignore\`:**\n\`\`\`bash\necho ".env" >> .gitignore\n\`\`\`\n3. **Untrack Without Deleting Local File:**\n\`\`\`bash\ngit rm --cached .env\ngit commit -m "chore: untrack sensitive .env file"\ngit push origin main\n\`\`\``;
      } else if (qLower.includes('score') || qLower.includes('points') || qLower.includes('80')) {
        answer = `### Fastest Ways to Boost Your Score from ${facts.totalScore} to 80+\n\n- **1. Add a Profile README (+10 pts):** Create a repo \`${facts.username}/${facts.username}\` with a \`README.md\` introducing yourself.\n- **2. Add Live Demo Links (+7 pts per repo):** Deploy on Vercel or Netlify and paste the URL in the repo "About > Website" field.\n- **3. Improve README Documentation (+5-10 pts):** Add tech stack badges and quickstart commands.\n- **4. Clean Git History:** Avoid committing dependency folders like \`node_modules/\`.`;
      } else if (qLower.includes('readme')) {
        answer = `### Structuring a Standout GitHub Profile README\n\n- **Value Proposition:** "Full-stack engineer building with ${facts.metrics?.topLanguages?.[0]?.language || 'TypeScript'} & React."\n- **2-3 Featured Projects:** Include title, 1-line problem statement, tech stack, and Live Demo link.\n- **Contact:** LinkedIn and portfolio links.\n\nYou can click the **"Generate Profile README.md"** button above to generate a custom template!`;
      } else {
        answer = `Great question! Looking at @${facts.username}'s profile (${facts.totalScore}/100, ${facts.grade}):\n\n- **Top Priority:** Focus on your flagship project (${facts.topRepos?.[0]?.name || 'your primary repo'}). A well-documented project with a live preview immediately moves you to the top quartile of candidates.\n- **Commit Rhythm:** Keep your green squares active with 2 small, clean commits each week.\n- **Check the Rescue Plan:** Work through the prioritized checklist above.`;
      }

      setMessages([...newMessages, { role: 'assistant', content: answer }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Keep shipping consistent commits, add a Profile README, and deploy live demos to boost your portfolio score!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (content: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className={`border rounded-3xl p-5 sm:p-6 shadow-xl transition-colors ${
      isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
    }`}>
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
        isDark ? 'border-[#232F46]' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#1C263D] text-cyan-300 border border-[#2E3C5B] flex items-center justify-center">
            <MessageSquareCode className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Ask Your Doubts &amp; Get Guidance
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#182238] text-cyan-300 border border-[#2D3B55] uppercase tracking-wider">
                AI Coach
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Confused by the roast or unsure how to execute the rescue plan? Ask below.
            </p>
          </div>
        </div>
      </div>

      <div className="my-3 flex flex-wrap gap-1.5 items-center">
        <span className={`text-[11px] flex items-center gap-1 mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <HelpCircle className="w-3 h-3 text-cyan-400" />
          Suggested:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(prompt)}
            disabled={loading}
            className={`text-xs px-2.5 py-1 rounded-xl border transition-colors text-left disabled:opacity-50 cursor-pointer ${
              isDark
                ? 'bg-[#0B1020] hover:bg-[#1C263D] text-slate-300 hover:text-white border-[#232F46]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200'
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className={`my-4 max-h-96 overflow-y-auto space-y-3 p-3.5 rounded-2xl border text-xs sm:text-sm ${
        isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-50 border-slate-200'
      }`}>
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-[#1C263D] text-cyan-300 border border-[#2E3C5B] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed relative group ${
                  isUser
                    ? 'bg-[#1C263D] border border-[#2E3C5B] text-white shadow-md'
                    : isDark
                    ? 'bg-[#141C2F] border border-[#263247] text-slate-200'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {!isUser && (
                  <button
                    onClick={() => copyMessage(msg.content, idx)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-[#1C263D] text-slate-400 hover:text-white transition-opacity text-[10px] flex items-center gap-1 cursor-pointer border border-[#2E3C5B]"
                    title="Copy advice"
                  >
                    {copiedIdx === idx ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>
              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-[#1C263D] text-slate-300 flex items-center justify-center shrink-0 mt-0.5 border border-[#2E3C5B]">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span>AI Coach is analyzing your repositories...</span>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about @${facts.username}'s score, repos, or rescue steps...`}
          disabled={loading}
          className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors ${
            isDark
              ? 'bg-[#0B1020] border-[#232F46] text-white placeholder-slate-500 focus:border-cyan-500'
              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer shadow-md border border-slate-200"
        >
          <Send className="w-3.5 h-3.5 text-black" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};
