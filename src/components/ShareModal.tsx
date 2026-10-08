import React, { useRef, useState } from 'react';
import { FactsBundle, NarrativeResult } from '../types/analysis.ts';
import { X, Copy, Check, Download, Share2 } from 'lucide-react';

interface ShareModalProps {
  facts: FactsBundle;
  narrative: NarrativeResult;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ facts, narrative, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const shareUrl = `${window.location.origin}/?user=${encodeURIComponent(facts.username)}`;

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const downloadRoastCard = () => {
    setIsGeneratingImg(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 630;
    canvas.width = width;
    canvas.height = height;

    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0b0f19');
    bgGradient.addColorStop(0.5, '#111827');
    bgGradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('🔥 ROAST & RESCUE', 60, 80);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '20px monospace';
    ctx.fillText('github.com profile audit & cloud vault', 60, 115);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText(`@${facts.username}`, 60, 210);

    const scoreX = 950;
    const scoreY = 190;
    ctx.beginPath();
    ctx.arc(scoreX, scoreY, 90, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = facts.totalScore >= 75 ? '#10b981' : facts.totalScore >= 50 ? '#06b6d4' : '#64748b';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${facts.totalScore}`, scoreX, scoreY + 15);
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('/ 100 PTS', scoreX, scoreY + 45);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`Grade: ${facts.grade}`, 60, 260);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px sans-serif';
    ctx.fillText(`Recruiter Verdict: "${narrative.recruiterVerdict.impression}"`, 60, 310);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(60, 350, 1080, 160);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 350, 1080, 160);
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'italic 26px sans-serif';

    const maxWidth = 1020;
    const words = `"${narrative.headlineRoast}"`.split(' ');
    let line = '';
    let textY = 410;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, 90, textY);
        line = words[n] + ' ';
        textY += 36;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 90, textY);

    ctx.fillStyle = '#64748b';
    ctx.font = '20px sans-serif';
    ctx.fillText('Get your honest GitHub roast & rescue plan at Roast & Rescue', 60, 565);

    const link = document.createElement('a');
    link.download = `roast-${facts.username}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setIsGeneratingImg(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <canvas ref={canvasRef} className="hidden" />
      <div className="bg-[#141C2F] border border-[#263247] rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#1C263D] text-cyan-300 border border-[#2E3C5B] flex items-center justify-center">
            <Share2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Share Your Roast</h3>
            <p className="text-xs text-slate-400">Flex your score or roast your teammates</p>
          </div>
        </div>

        <div className="bg-[#0B1020] border border-[#232F46] rounded-2xl p-4 my-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white">
              <span>@{facts.username}</span>
              <span className="text-xs text-slate-400 font-mono">({facts.grade})</span>
            </div>
            <div className="font-mono font-bold text-lg text-emerald-400">
              {facts.totalScore}/100
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-300 italic line-clamp-2">
            &ldquo;{narrative.headlineRoast}&rdquo;
          </p>
        </div>

        <div className="space-y-1.5 mb-5">
          <label className="text-xs font-semibold text-slate-300">Shareable Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-[#0B1020] border border-[#232F46] text-slate-200 text-xs rounded-xl px-3 py-2 w-full font-mono select-all focus:outline-none"
            />
            <button
              onClick={copyShareLink}
              className="px-3.5 py-2 rounded-xl bg-[#1C263D] hover:bg-[#25324E] text-white font-medium text-xs flex items-center gap-1.5 shrink-0 transition-colors border border-[#2E3C5B] cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={downloadRoastCard}
          disabled={isGeneratingImg}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-md border border-slate-200 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-4 h-4 text-black" />
          <span>{isGeneratingImg ? 'Generating...' : 'Download Roast Card Image (.png)'}</span>
        </button>
      </div>
    </div>
  );
};
