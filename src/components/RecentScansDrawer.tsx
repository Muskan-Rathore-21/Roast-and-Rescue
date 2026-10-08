import React, { useState } from 'react';
import { StoredScan } from '../types/analysis.ts';
import { X, History, Trash2, ArrowRight, AlertCircle, Database } from 'lucide-react';

interface RecentScansDrawerProps {
  scans: StoredScan[];
  onSelectScan: (username: string) => void;
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
  onOpenDatabaseVault?: () => void;
}

export const RecentScansDrawer: React.FC<RecentScansDrawerProps> = ({
  scans,
  onSelectScan,
  onDeleteScan,
  onClearHistory,
  onClose,
  onOpenDatabaseVault,
}) => {
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#141C2F] border-l border-[#263247] w-full max-w-sm h-full flex flex-col shadow-2xl">
        <div className="p-4 border-b border-[#232F46] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Scan History</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {onOpenDatabaseVault && (
          <div className="p-3 bg-[#0B1020] border-b border-[#232F46] flex items-center justify-between">
            <span className="text-xs text-slate-400">Stored in Cloud Database:</span>
            <button
              onClick={() => {
                onClose();
                onOpenDatabaseVault();
              }}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Open Vault</span>
            </button>
          </div>
        )}

        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {scans.length === 0 ? (
            <div className="text-center text-slate-500 py-12 text-sm space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-600" />
              <p>No scans saved yet.</p>
              <p className="text-xs text-slate-600">Audit any GitHub profile to start tracking history.</p>
            </div>
          ) : (
            scans.map((scan) => {
              let scoreColor = 'text-slate-300 border-slate-700 bg-slate-800';
              if (scan.score >= 80) scoreColor = 'text-emerald-400 border-emerald-800 bg-emerald-950/40';
              else if (scan.score >= 60) scoreColor = 'text-cyan-400 border-cyan-800 bg-cyan-950/40';
              else if (scan.score >= 40) scoreColor = 'text-amber-300 border-amber-800 bg-amber-950/40';

              return (
                <div
                  key={scan.id}
                  onClick={() => {
                    onSelectScan(scan.username);
                    onClose();
                  }}
                  className="bg-[#0B1020] border border-[#232F46] hover:border-slate-600 p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={scan.avatarUrl || `https://github.com/${scan.username}.png`}
                      alt={scan.username}
                      className="w-9 h-9 rounded-full bg-slate-800 object-cover shrink-0 border border-[#263247]"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://github.com/${scan.username}.png`;
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                        @{scan.username}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {new Date(scan.scannedAt).toLocaleDateString()} • Grade {scan.grade}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${scoreColor}`}>
                      {scan.score}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteScan(scan.id);
                      }}
                      title="Delete this scan"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-[#1C263D] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {scans.length > 0 && (
          <div className="p-4 border-t border-[#232F46] bg-[#0B1020]">
            {confirmClear ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-rose-300 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Confirm clear all?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 cursor-pointer"
                  >
                    Yes, Delete All
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-mono">{scans.length} saved in cloud</span>
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All History</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
