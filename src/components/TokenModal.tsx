import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Check, Trash2, Info } from 'lucide-react';

interface TokenModalProps {
  onClose: () => void;
  token: string;
  onSaveToken: (token: string) => void;
  onRemoveToken: () => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  onClose,
  token,
  onSaveToken,
  onRemoveToken,
}) => {
  const [inputVal, setInputVal] = useState(token);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveToken(inputVal.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#141C2F] border border-[#263247] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1C263D] text-cyan-400 border border-[#2E3C5B] flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">GitHub API Token</h3>
            <p className="text-xs text-slate-400">Unlock 5,000 requests/hour and bypass IP rate limits</p>
          </div>
        </div>

        <div className="bg-[#0B1020] border border-[#232F46] p-3.5 rounded-xl text-xs text-slate-300 space-y-2 mb-4">
          <div className="flex items-start gap-2 font-semibold text-slate-200">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-cyan-400" />
            <span>Why is this needed?</span>
          </div>
          <p className="leading-relaxed">
            GitHub restricts public, unauthenticated IP requests to only <strong>60 requests per hour</strong>. Supplying a free Personal Access Token (classic or fine-grained) increases your quota to <strong>5,000 requests per hour</strong>.
          </p>
          <p className="text-slate-400">
            <strong>No scopes required!</strong> Roast &amp; Rescue only reads public GitHub repositories.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Personal Access Token (PAT)
              </label>
              <a
                href="https://github.com/settings/tokens/new?description=RoastAndRescue&scopes="
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Generate free token</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="ghp_... or github_pat_..."
              className="w-full bg-[#0B1020] border border-[#232F46] focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {token ? (
              <button
                type="button"
                onClick={() => {
                  onRemoveToken();
                  setInputVal('');
                }}
                className="px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Token</span>
              </button>
            ) : <div />}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-[#1C263D] text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-xs flex items-center gap-1.5 shadow-md border border-slate-200 transition-all disabled:opacity-50 cursor-pointer"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Token</span>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-[#232F46] flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Stored locally in your browser. Never sent anywhere else.</span>
        </div>
      </div>
    </div>
  );
};
