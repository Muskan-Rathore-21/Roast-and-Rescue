import React from 'react';

interface FunnyStickerProps {
  emoji: string;
  text: string;
  accent?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose' | 'slate';
  className?: string;
  float?: boolean;
  altFloat?: boolean;
  tilt?: 'left' | 'right' | 'none';
}

export const FunnySticker: React.FC<FunnyStickerProps> = ({
  emoji,
  text,
  accent = 'cyan',
  className = '',
  float = false,
  altFloat = false,
  tilt = 'none',
}) => {
  const accentBorderMap = {
    cyan: 'border-cyan-500/30 text-cyan-300',
    purple: 'border-purple-500/30 text-purple-300',
    amber: 'border-amber-400/30 text-amber-300',
    emerald: 'border-emerald-500/30 text-emerald-300',
    rose: 'border-rose-500/30 text-rose-300',
    slate: 'border-slate-600/40 text-slate-300',
  };

  const floatClass = float ? 'animate-float' : altFloat ? 'animate-float-alt' : '';
  const tiltClass = tilt === 'left' ? '-rotate-1 hover:rotate-0' : tilt === 'right' ? 'rotate-1 hover:rotate-0' : '';

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-tight bg-[#151C2E]/90 border ${accentBorderMap[accent]} shadow-lg shadow-black/30 backdrop-blur-md select-none transition-all duration-300 hover:scale-105 ${tiltClass} ${floatClass} ${className}`}
    >
      <span className="text-xs">{emoji}</span>
      <span className="text-slate-200 font-semibold">{text}</span>
    </div>
  );
};
