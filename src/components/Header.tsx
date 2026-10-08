import React from 'react';
import {
  Flame,
  LifeBuoy,
  Swords,
  BookOpen,
  Key,
  User,
  LogOut,
  Sun,
  Moon,
  Database,
} from 'lucide-react';
import { UserSession } from '../types/analysis.ts';

interface HeaderProps {
  currentView: 'home' | 'battle' | 'methodology' | 'login' | 'database';
  hasActiveReport: boolean;
  onNavigate: (view: 'home' | 'battle' | 'methodology' | 'login' | 'database') => void;
  onBackToHome: () => void;
  onOpenDatabaseVault: () => void;
  scanCount: number;
  currentUser: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  hasGithubToken: boolean;
  onOpenTokenModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  hasActiveReport,
  onNavigate,
  onBackToHome,
  onOpenDatabaseVault,
  scanCount,
  currentUser,
  onOpenLogin,
  onLogout,
  hasGithubToken,
  onOpenTokenModal,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
      isDark
        ? 'border-[#232F46] bg-[#0B1020]/90'
        : 'border-slate-200 bg-white/90 shadow-sm'
    }`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onBackToHome();
              onNavigate('home');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none rounded-xl p-1 cursor-pointer"
            title="Go to Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#141C2F] border border-[#263247] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform text-white">
              <Flame className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className={`flex items-center gap-1.5 font-bold text-base tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                <span>Roast &amp; Rescue</span>
                <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className={`text-[11px] mt-0.5 font-mono hidden xs:block ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Portfolio Audit &amp; Cloud Vault
              </div>
            </div>
          </button>
        </div>

        {/* Center / Right Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Home Nav */}
          <button
            onClick={() => {
              onBackToHome();
              onNavigate('home');
            }}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentView === 'home' && !hasActiveReport
                ? isDark
                  ? 'bg-[#1C263D] text-white border border-[#2E3C5B] font-bold'
                  : 'bg-slate-100 text-slate-900 border border-slate-300 font-bold'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-[#141C2F]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Home</span>
          </button>

          {/* Cloud Database Storage Vault Button */}
          <button
            onClick={onOpenDatabaseVault}
            title="Open Cloud Database Vault (Firestore)"
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentView === 'database'
                ? isDark
                  ? 'bg-[#1C263D] text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'bg-cyan-50 text-cyan-900 border border-cyan-300 font-bold'
                : isDark
                ? 'bg-[#141C2F] text-cyan-300 hover:text-white border border-[#263247]'
                : 'bg-slate-100 text-cyan-700 hover:text-cyan-900 border border-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold">Database Vault</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300">
              {scanCount}
            </span>
          </button>

          {/* Roast Battle Nav */}
          <button
            onClick={() => onNavigate('battle')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
              currentView === 'battle'
                ? isDark
                  ? 'bg-[#1C263D] text-white border border-[#2E3C5B] font-bold'
                  : 'bg-slate-100 text-slate-900 border border-slate-300 font-bold'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-[#141C2F]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xs:inline">Roast</span> Battle
          </button>

          {/* Methodology Nav */}
          <button
            onClick={() => onNavigate('methodology')}
            className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 hidden md:flex cursor-pointer ${
              currentView === 'methodology'
                ? isDark
                  ? 'bg-[#1C263D] text-white border border-[#2E3C5B] font-bold'
                  : 'bg-slate-100 text-slate-900 border border-slate-300 font-bold'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-[#141C2F]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rubric</span>
          </button>

          {/* GitHub Token Config Button */}
          <button
            onClick={onOpenTokenModal}
            title={hasGithubToken ? 'GitHub Token Active (5,000 req/hr)' : 'Configure GitHub Token to avoid rate limits'}
            className={`px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors border cursor-pointer ${
              hasGithubToken
                ? isDark
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-[#141C2F] border-[#263247]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <Key className={`w-3.5 h-3.5 ${hasGithubToken ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">
              {hasGithubToken ? '5k/hr' : 'Token'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Night / Dark Mode'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#141C2F] text-slate-200 border-[#263247] hover:bg-[#1C263D] hover:text-white'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
            }`}
            aria-label="Toggle Night/Dark Mode"
          >
            {isDark ? <Moon className="w-3.5 h-3.5 text-cyan-300" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          </button>

          {/* User Profile / Log In */}
          {currentUser ? (
            <div className={`flex items-center gap-1.5 border rounded-xl p-1 ${
              isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => onNavigate('login')}
                className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'hover:bg-[#1C263D]' : 'hover:bg-white'
                }`}
                title="View Account Profile"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-md bg-slate-800 object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://github.com/${currentUser.username}.png`;
                  }}
                />
                <span className={`text-xs font-semibold hidden sm:inline max-w-[90px] truncate ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  @{currentUser.username}
                </span>
              </button>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 sm:px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm bg-white hover:bg-slate-100 text-black border border-slate-200 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-black" />
              <span>Log In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
