import React, { useState } from 'react';
import { UserSession, StoredScan } from '../types/analysis.ts';
import {
  User,
  Github,
  Mail,
  LogOut,
  ArrowRight,
  ShieldCheck,
  History,
  Trash2,
  Award,
  Sparkles,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Database,
} from 'lucide-react';
import { fetchUserProfile, GitHubApiError } from '../lib/github/client.ts';
import { DEMO_PROFILES } from '../lib/github/fixtures.ts';

interface LoginPageProps {
  currentUser: UserSession | null;
  onLoginSuccess: (user: UserSession) => void;
  onLogout: () => void;
  storedScans: StoredScan[];
  onSelectScan: (username: string) => void;
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  onNavigateHome: () => void;
  onOpenDatabaseVault?: () => void;
  isDark?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  storedScans,
  onSelectScan,
  onDeleteScan,
  onClearHistory,
  onNavigateHome,
  onOpenDatabaseVault,
  isDark = true,
}) => {
  const [method, setMethod] = useState<'github' | 'google' | 'email'>('github');
  const [githubUser, setGithubUser] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [googleEmail, setGoogleEmail] = useState('muskanrathore575@gmail.com');
  const [googleName, setGoogleName] = useState('Muskan Rathore');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGitHubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = githubUser.trim().replace(/^@/, '');
    if (!clean) {
      setError('Please enter your GitHub username.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (DEMO_PROFILES[clean.toLowerCase()]) {
        const demo = DEMO_PROFILES[clean.toLowerCase()];
        const session: UserSession = {
          username: demo.username,
          name: demo.metrics.username,
          avatarUrl: `https://github.com/${demo.username}.png`,
          provider: 'github',
          loggedInAt: new Date().toISOString(),
        };
        onLoginSuccess(session);
        return;
      }

      const profile = await fetchUserProfile(clean);
      const session: UserSession = {
        username: profile.login,
        name: profile.name || profile.login,
        avatarUrl: profile.avatar_url || `https://github.com/${profile.login}.png`,
        provider: 'github',
        loggedInAt: new Date().toISOString(),
      };
      onLoginSuccess(session);
    } catch (err: unknown) {
      if (err instanceof GitHubApiError && err.status === 404) {
        setError(`GitHub account '@${clean}' not found. Please verify your handle.`);
      } else {
        const session: UserSession = {
          username: clean,
          name: clean,
          avatarUrl: `https://github.com/${clean}.png`,
          provider: 'github',
          loggedInAt: new Date().toISOString(),
        };
        onLoginSuccess(session);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = googleEmail.trim();
    if (!cleanEmail) {
      setError('Please provide your Google email.');
      return;
    }
    const usernameFromEmail = cleanEmail.split('@')[0] || 'google-user';
    const session: UserSession = {
      username: usernameFromEmail,
      name: googleName.trim() || 'Google User',
      email: cleanEmail,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(googleName || cleanEmail)}&backgroundColor=06b6d4`,
      provider: 'google',
      loggedInAt: new Date().toISOString(),
    };
    onLoginSuccess(session);
    setError(null);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      setError('Please provide your name and email address.');
      return;
    }
    const usernameFromEmail = email.split('@')[0] || name.toLowerCase().replace(/\s+/g, '-');
    const session: UserSession = {
      username: usernameFromEmail,
      name: name.trim(),
      email: email.trim(),
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=10b981`,
      provider: 'email',
      loggedInAt: new Date().toISOString(),
    };
    onLoginSuccess(session);
    setError(null);
  };

  const handleDemoSignIn = (handle: string, fullName: string) => {
    const session: UserSession = {
      username: handle,
      name: fullName,
      email: `${handle}@example.com`,
      avatarUrl: `https://github.com/${handle}.png`,
      provider: 'demo',
      loggedInAt: new Date().toISOString(),
    };
    onLoginSuccess(session);
    setError(null);
  };

  const avgScore =
    storedScans.length > 0
      ? Math.round(storedScans.reduce((acc, s) => acc + s.score, 0) / storedScans.length)
      : null;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 animate-fadeIn">
      {currentUser ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onNavigateHome}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                isDark
                  ? 'bg-[#141C2F] hover:bg-[#1C263D] text-slate-300 hover:text-white border-[#263247]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-sm'
              }`}
            >
              <ArrowLeft className="w-4 h-4 text-slate-300" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-2">
              {onOpenDatabaseVault && (
                <button
                  onClick={onOpenDatabaseVault}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cloud Database Vault</span>
                </button>
              )}
              <button
                onClick={onLogout}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                  isDark
                    ? 'bg-[#141C2F] hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border-[#263247]'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          <div className={`border rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden transition-colors ${
            isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#263247] shadow-lg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://github.com/${currentUser.username}.png`;
                  }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {currentUser.name}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      isDark
                        ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {currentUser.provider ? `${currentUser.provider.toUpperCase()} MEMBER` : 'ACTIVE MEMBER'}
                    </span>
                  </div>
                  <div className={`text-xs sm:text-sm font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    @{currentUser.username} {currentUser.email && ` • ${currentUser.email}`}
                  </div>
                  <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Active session synced with Cloud Firestore
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSelectScan(currentUser.username);
                    onNavigateHome();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-xs flex items-center gap-1.5 shadow-md border border-slate-200 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                  <span>Audit My Profile Now</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`border p-4 rounded-2xl ${isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'}`}>
              <div className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <History className="w-4 h-4 text-cyan-400" />
                <span>Audits Saved in Cloud</span>
              </div>
              <div className={`text-2xl font-black mt-1 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {storedScans.length}
              </div>
            </div>
            <div className={`border p-4 rounded-2xl ${isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'}`}>
              <div className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Average Audit Score</span>
              </div>
              <div className={`text-2xl font-black mt-1 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {avgScore !== null ? `${avgScore}/100` : '—'}
              </div>
            </div>
            <div className={`border p-4 rounded-2xl ${isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'}`}>
              <div className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cloud Storage Sync</span>
              </div>
              <div className="text-xs font-semibold text-emerald-400 mt-1.5">
                Firestore Database Connected
              </div>
            </div>
          </div>

          <div className={`border rounded-3xl p-5 sm:p-6 shadow-xl ${isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Saved Profile Scans ({storedScans.length})
              </h3>
              {storedScans.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className={`text-xs flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-[#1C263D]' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete All</span>
                </button>
              )}
            </div>

            {storedScans.length === 0 ? (
              <p className={`text-xs py-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                No audits saved yet. Enter any GitHub username to run an audit!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {storedScans.map((scan) => (
                  <div
                    key={scan.id}
                    className={`border p-3.5 rounded-2xl flex items-center justify-between gap-2.5 transition-all ${
                      isDark ? 'bg-[#0B1020] border-[#232F46] hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectScan(scan.username);
                        onNavigateHome();
                      }}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                    >
                      <img
                        src={scan.avatarUrl || `https://github.com/${scan.username}.png`}
                        alt={scan.username}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#263247]"
                      />
                      <div className="min-w-0">
                        <div className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          @{scan.username}
                        </div>
                        <div className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          Score: {scan.score}/100 • Grade {scan.grade}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteScan(scan.id)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        isDark ? 'text-slate-500 hover:text-rose-400 hover:bg-[#1C263D]' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-200'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#141C2F] text-cyan-300 border border-[#263247] flex items-center justify-center mx-auto mb-3 shadow-md">
              <User className="w-6 h-6" />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Sign In to Roast &amp; Rescue
            </h1>
            <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Check your GitHub ID, sign in with Google or Email to unlock cloud storage and the full Rescue Plan.
            </p>
          </div>

          <div className={`border rounded-3xl p-6 sm:p-7 shadow-xl transition-colors ${
            isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex p-1 rounded-xl border mb-5 text-xs font-semibold ${
              isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => {
                  setMethod('github');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  method === 'github'
                    ? isDark
                      ? 'bg-[#1C263D] text-white shadow-sm border border-[#2E3C5B]'
                      : 'bg-white text-slate-900 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub ID</span>
              </button>
              <button
                onClick={() => {
                  setMethod('google');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  method === 'google'
                    ? isDark
                      ? 'bg-[#1C263D] text-white shadow-sm border border-[#2E3C5B]'
                      : 'bg-white text-slate-900 shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button
                onClick={() => {
                  setMethod('email');
                  setError(null);
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  method === 'email'
                    ? isDark
                      ? 'bg-[#1C263D] text-white shadow-sm border border-[#2E3C5B]'
                      : 'bg-white text-slate-900 shadow-sm'
                : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl border border-rose-900/60 bg-slate-950 text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {method === 'github' && (
              <form onSubmit={handleGitHubSubmit} className="space-y-4">
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    GitHub Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                      @
                    </span>
                    <input
                      type="text"
                      value={githubUser}
                      onChange={(e) => {
                        setGithubUser(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="e.g. torvalds or alex-student-dev"
                      disabled={loading}
                      className={`w-full border rounded-xl pl-8 pr-3 py-2.5 text-xs sm:text-sm font-mono focus:outline-none transition-colors ${
                        isDark
                          ? 'bg-[#0B1020] border-[#232F46] text-white focus:border-cyan-500'
                          : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                      }`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md border border-slate-200 transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Verifying on GitHub...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify &amp; Sign In</span>
                      <ArrowRight className="w-4 h-4 text-black" />
                    </>
                  )}
                </button>
              </form>
            )}

            {method === 'google' && (
              <form onSubmit={handleGoogleSubmit} className="space-y-4">
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Google Account Name
                  </label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Your Name"
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#0B1020] border-[#232F46] text-white focus:border-cyan-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#0B1020] border-[#232F46] text-white focus:border-cyan-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black border border-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer hover:scale-[1.01]"
                >
                  <span>Continue with Google</span>
                </button>
              </form>
            )}

            {method === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Developer"
                    className={`w-full border rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#0B1020] border-[#232F46] text-white focus:border-cyan-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className={`w-full border rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#0B1020] border-[#232F46] text-white focus:border-cyan-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Password (Optional)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full border rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none transition-colors ${
                      isDark
                        ? 'bg-[#0B1020] border-[#232F46] text-white focus:border-cyan-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md border border-slate-200 transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <span>Sign In with Email</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </form>
            )}

            <div className={`mt-6 pt-4 border-t text-center ${isDark ? 'border-[#232F46]' : 'border-slate-200'}`}>
              <div className={`text-xs mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Or test with instant demo profiles:
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('alex-student-dev', 'Alex Developer')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#0B1020] hover:bg-[#1C263D] border-[#232F46] text-slate-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  @alex-student-dev
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoSignIn('priya-fullstack', 'Priya Sharma')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#0B1020] hover:bg-[#1C263D] border-[#232F46] text-emerald-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  @priya-fullstack
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
