import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, ExternalLink, Code, Eye } from 'lucide-react';

interface ReadmeModalProps {
  title: string;
  subtitle: string;
  markdown: string;
  loading: boolean;
  onClose: () => void;
  targetRepoUrl?: string;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({
  title,
  subtitle,
  markdown,
  loading,
  onClose,
  targetRepoUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="readme-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#141C2F] border border-[#263247] rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
        <div className="p-5 border-b border-[#232F46] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl bg-[#1C263D] text-cyan-300 border border-[#2E3C5B] flex items-center justify-center shrink-0"
              aria-hidden="true"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 id="readme-modal-title" className="text-base sm:text-lg font-bold text-white">
                {title}
              </h2>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close README generator dialog"
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="px-5 py-2.5 bg-[#0B1020] border-b border-[#232F46] flex items-center justify-between gap-2">
          <div role="tablist" aria-label="README view format" className="flex items-center gap-1 bg-[#141C2F] p-0.5 rounded-lg border border-[#232F46] text-xs">
            <button
              role="tab"
              aria-selected={viewMode === 'preview'}
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                viewMode === 'preview'
                  ? 'bg-[#1C263D] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Preview</span>
            </button>
            <button
              role="tab"
              aria-selected={viewMode === 'raw'}
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                viewMode === 'raw'
                  ? 'bg-[#1C263D] text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Raw Markdown</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {targetRepoUrl && (
              <a
                href={targetRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open target repository on GitHub"
                className="text-xs text-slate-400 hover:text-white hidden sm:flex items-center gap-1 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
              >
                <span>Open repo</span>
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            )}
            <button
              onClick={copyToClipboard}
              disabled={loading || !markdown}
              aria-label="Copy markdown content to clipboard"
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 border border-slate-200 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-black" aria-hidden="true" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-black" aria-hidden="true" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs sm:text-sm text-slate-200">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Sparkles className="w-8 h-8 text-cyan-400 animate-spin" aria-hidden="true" />
              <span>Crafting tailored README based on your real repository data...</span>
            </div>
          ) : viewMode === 'raw' ? (
            <pre className="whitespace-pre-wrap select-all bg-[#0B1020] p-4 rounded-xl border border-[#232F46] leading-relaxed text-slate-300">
              {markdown}
            </pre>
          ) : (
            <div className="bg-[#0B1020] p-5 rounded-xl border border-[#232F46] font-sans text-slate-200 space-y-4 leading-relaxed">
              <div className="whitespace-pre-wrap font-sans">
                {markdown}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 bg-[#0B1020] border-t border-[#232F46] text-[11px] text-slate-400 text-center font-mono">
          Paste directly into your GitHub repository&apos;s <code className="text-cyan-300 bg-[#1C263D] px-1 py-0.5 rounded font-bold">README.md</code>
        </div>
      </div>
    </div>
  );
};
