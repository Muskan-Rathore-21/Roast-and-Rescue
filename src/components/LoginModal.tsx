import React, { useState } from 'react';
import {
  X,
  Github,
  Mail,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { UserSession } from '../types/analysis.ts';
import { fetchUserProfile, GitHubApiError } from '../lib/github/client.ts';
import { DEMO_PROFILES } from '../lib/github/fixtures.ts';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserSession) => void;
  isDark?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess, isDark = true }) => {
  const [method, setMethod] = useState<'github' | 'google' | 'email'>('github');
  const [githubUser, setGithubUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('muskanrathore575@gmail.com');
  const [googleName, setGoogleName] = useState('Muskan Rathore');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGitHubLogin = async (e: React.FormEvent) => {
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
        onClose();
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
      onClose();
    } catch (err: unknown) {
      if (err instanceof GitHubApiError && err.status === 404) {
        setError(`GitHub account '@${clean}' not found. Please verify your handle.`);
      } else {
        // Fallback for demo or offline
        const session: UserSession = {
          username: clean,
          name: clean,
          avatarUrl: `https://github.com/${clean}.png`,
          provider: 'github',
          loggedInAt: new Date().toISOString(),
        };
        onLoginSuccess(session);
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = googleEmail.trim();
    if (!cleanEmail) {
      setError('Please enter your Google account email.');
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
    onClose();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
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
    onClose();
  };

  const handleDemoLogin = () => {
    const session: UserSession = {
      username: 'alex-student-dev',
      name: 'Alex Developer',
      email: 'alex@example.com',
      avatarUrl: 'https://github.com/alex-student-dev.png',
      provider: 'demo',
      loggedInAt: new Date().toISOString(),
    };
    onLoginSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-md p-6 sm:p-7 rounded-3xl shadow-2xl relative border transition-colors ${
        isDark
          ? 'bg-[#141C2F] border-[#263247] text-slate-100'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-[#1C263D]' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#1C263D] text-cyan-300 border border-[#2E3C5B] flex items-center justify-center mx-auto mb-3">
            <UserCheck className="w-5 h-5" />
          </div>
          <h3 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Sign In to Roast &amp; Rescue
          </h3>
          <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Unlock your custom Rescue Plan, README generator, and cloud sync.
          </p>
        </div>

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
            <span>GitHub</span>
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
          <form onSubmit={handleGitHubLogin} className="space-y-4">
            <div>
              <label className={`text-xs font-semibold block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                GitHub Username / ID
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
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
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
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md border border-slate-200 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Verifying account...</span>
                </>
              ) : (
                <>
                  <span>Verify &amp; Sign In with GitHub</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>
        )}

        {method === 'google' && (
          <form onSubmit={handleGoogleLogin} className="space-y-4">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Account Name
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
                Email Address
              </label>
              <input
                type="email"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className={`w-full border rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-[#0B1020] border-[#232F46] text-white focus:border-cyan-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400'
                }`}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black border border-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
            >
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {method === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Full Name
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
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md border border-slate-200 transition-all cursor-pointer"
            >
              <span>Sign In with Email</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </form>
        )}

        <div className={`mt-5 pt-4 border-t text-center ${isDark ? 'border-[#232F46]' : 'border-slate-200'}`}>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-xs underline font-medium flex items-center justify-center gap-1 mx-auto cursor-pointer text-cyan-300 hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try instant 1-click Demo Account (@alex-student-dev)</span>
          </button>
        </div>

        <div className={`mt-3.5 flex items-center justify-center gap-1.5 text-[11px] font-mono ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Synchronized with cloud database storage</span>
        </div>
      </div>
    </div>
  );
};
