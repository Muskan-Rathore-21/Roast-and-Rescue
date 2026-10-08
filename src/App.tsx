import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RefreshCw,
  Share2,
  ExternalLink,
  Trash2,
  CheckCircle,
  Key,
  Swords,
  AlertCircle,
  Database,
  CloudCheck,
} from 'lucide-react';
import { FactsBundle, NarrativeResult, RoastIntensity, StoredScan, UserSession } from './types/analysis.ts';
import { Header } from './components/Header.tsx';
import { LoadingRoast } from './components/LoadingRoast.tsx';
import { ScoreGauge } from './components/ScoreGauge.tsx';
import { CategoryBars } from './components/CategoryBars.tsx';
import { RecruiterView } from './components/RecruiterView.tsx';
import { RepoCard } from './components/RepoCard.tsx';
import { RescuePlanView } from './components/RescuePlanView.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { ReadmeModal } from './components/ReadmeModal.tsx';
import { MethodologyModal } from './components/MethodologyModal.tsx';
import { RecentScansDrawer } from './components/RecentScansDrawer.tsx';
import { RoastBattle } from './components/RoastBattle.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { LoginPage } from './components/LoginPage.tsx';
import { AskDoubtSection } from './components/AskDoubtSection.tsx';
import { TokenModal } from './components/TokenModal.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { GatedSectionCard } from './components/GatedSectionCard.tsx';
import { FunnySticker } from './components/FunnySticker.tsx';
import { DatabaseVaultModal } from './components/DatabaseVaultModal.tsx';

import { DEMO_PROFILES } from './lib/github/fixtures.ts';
import {
  fetchUserProfile,
  fetchUserRepos,
  fetchProfileReadme,
  fetchRepoDetails,
  fetchUserPublicEvents,
  GitHubApiError,
} from './lib/github/client.ts';
import { analyzeRepoHealth, computeProfileMetrics } from './lib/analysis/metrics.ts';
import { computeScore } from './lib/analysis/scoring.ts';
import { detectFlags } from './lib/analysis/flags.ts';
import { generateRescueSkeleton } from './lib/analysis/rescueSkeleton.ts';
import { generateFallbackNarrative } from './lib/llm/fallbackRoasts.ts';
import { generateProfileReadmeMarkdown, generateRepoReadmeMarkdown } from './lib/llm/readmeGenerator.ts';
import {
  saveScanToDatabase,
  fetchScansFromDatabase,
  deleteScanFromDatabase,
  updateScanNotesAndTags,
  saveUserProfileToDatabase,
  saveRescueProgressToDatabase,
} from './lib/databaseService.ts';

const USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
const LOCAL_STORAGE_SCANS_KEY = 'roast_rescue_scans_v2';
const LOCAL_STORAGE_USER_KEY = 'roast_rescue_user_v2';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'battle' | 'methodology' | 'login' | 'database'>('home');
  const [showReportView, setShowReportView] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [intensity, setIntensity] = useState<RoastIntensity>('medium');
  const [inputError, setInputError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // User Session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // GitHub Token State for 5,000 req/hr
  const [githubToken, setGithubToken] = useState<string>('');
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);

  // Database Vault Modal
  const [showDatabaseVault, setShowDatabaseVault] = useState<boolean>(false);

  // Analysis State
  const [loading, setLoading] = useState(false);
  const [facts, setFacts] = useState<FactsBundle | null>(null);
  const [narrative, setNarrative] = useState<NarrativeResult | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [apiError, setApiError] = useState<{ code: string; message: string; resetTime?: string } | null>(null);

  // Stored Scans (from Cloud Database + Local Storage)
  const [storedScans, setStoredScans] = useState<StoredScan[]>([]);
  const [previousScore, setPreviousScore] = useState<number | undefined>(undefined);

  // Modals & Drawers
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [readmeModalState, setReadmeModalState] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    markdown: string;
    loading: boolean;
    targetRepoUrl?: string;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    markdown: '',
    loading: false,
  });

  // Load theme, user, and fetch cloud database records on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('roast_theme') as 'dark' | 'light';
      if (savedTheme) {
        setTheme(savedTheme);
        document.body.classList.toggle('theme-light', savedTheme === 'light');
      }
    } catch {
      // Ignore
    }

    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore
    }

    try {
      const savedToken = localStorage.getItem('roast_github_token');
      if (savedToken) {
        setGithubToken(savedToken);
      }
    } catch {
      // Ignore
    }

    // Load from Firestore Database with local fallback
    fetchScansFromDatabase()
      .then((scans) => {
        setStoredScans(scans);
      })
      .catch((err) => {
        console.warn('Initial cloud scans fetch error, using local storage:', err);
        try {
          const data = localStorage.getItem(LOCAL_STORAGE_SCANS_KEY);
          if (data) setStoredScans(JSON.parse(data));
        } catch {
          // Ignore
        }
      });
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('roast_theme', next);
    } catch {
      // Ignore
    }
    document.body.classList.toggle('theme-light', next === 'light');
    showToast(next === 'dark' ? 'Dark mode activated' : 'Light mode activated');
  };

  const handleLoginSuccess = (user: UserSession) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } catch {
      // Ignore
    }
    saveUserProfileToDatabase(user).catch(console.error);
    showToast(`Signed in as @${user.username} • Cloud sync active`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } catch {
      // Ignore
    }
    showToast('Signed out successfully');
  };

  const handleQuickDemoLogin = () => {
    const session: UserSession = {
      username: 'alex-student-dev',
      name: 'Alex Developer',
      email: 'alex@example.com',
      avatarUrl: 'https://github.com/alex-student-dev.png',
      provider: 'demo',
      loggedInAt: new Date().toISOString(),
    };
    handleLoginSuccess(session);
  };

  const handleDeleteScan = async (id: string) => {
    const updated = storedScans.filter((s) => s.id !== id);
    setStoredScans(updated);
    await deleteScanFromDatabase(id);
    showToast('Record removed from database');
  };

  const handleClearAllHistory = async () => {
    const currentList = [...storedScans];
    setStoredScans([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_SCANS_KEY);
      for (const item of currentList) {
        await deleteScanFromDatabase(item.id);
      }
    } catch {
      // Ignore
    }
    showToast('All database records cleared');
  };

  const handleUpdateNotesAndTags = async (id: string, notes: string, tags: string[]) => {
    const updated = storedScans.map((s) => (s.id === id ? { ...s, notes, tags } : s));
    setStoredScans(updated);
    await updateScanNotesAndTags(id, notes, tags);
    showToast('Record notes & tags updated in cloud database');
  };

  const handleAddManualScan = async (scan: StoredScan) => {
    const updated = [scan, ...storedScans.filter((s) => s.id !== scan.id)];
    setStoredScans(updated);
    await saveScanToDatabase(scan, currentUser?.username || 'anonymous');
    showToast(`Record for @${scan.username} saved to cloud database`);
  };

  const saveScan = (factsData: FactsBundle, headline?: string) => {
    const existing = storedScans.find((s) => s.username.toLowerCase() === factsData.username.toLowerCase());
    const newScan: StoredScan = {
      id: `scan-${factsData.username.toLowerCase()}-${Date.now()}`,
      username: factsData.username,
      avatarUrl: `https://github.com/${factsData.username}.png`,
      score: factsData.totalScore,
      grade: factsData.grade,
      scannedAt: new Date().toISOString(),
      headlineRoast: headline,
      tags: ['audit', factsData.grade.toLowerCase().replace(/\s+/g, '-')],
      syncedToCloud: true,
    };

    const updated = [
      newScan,
      ...storedScans.filter((s) => s.username.toLowerCase() !== factsData.username.toLowerCase()),
    ].slice(0, 30);
    setStoredScans(updated);

    // Save to Cloud Database
    saveScanToDatabase(newScan, currentUser?.username || 'anonymous').catch(console.error);

    if (existing && factsData.totalScore > existing.score) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Profile Analysis Computation Engine
  const executeAnalysis = useCallback(
    async (username: string, token?: string): Promise<FactsBundle> => {
      const cleanUser = username.toLowerCase();
      if (DEMO_PROFILES[cleanUser]) {
        return DEMO_PROFILES[cleanUser];
      }

      const activeToken = token || githubToken;
      const user = await fetchUserProfile(username, activeToken);
      const isOrg = user.type === 'Organization';
      const allRepos = await fetchUserRepos(username, activeToken);
      const profileReadme = await fetchProfileReadme(username, activeToken);
      const publicEvents = await fetchUserPublicEvents(username, activeToken);

      const sortedRepos = [...allRepos].sort((a, b) => {
        if (!a.fork && b.fork) return -1;
        if (a.fork && !b.fork) return 1;
        if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
        return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
      });

      const candidateRepos = sortedRepos.slice(0, 6);
      const analyzedTopRepos = await Promise.all(
        candidateRepos.map(async (r) => {
          try {
            const details = await fetchRepoDetails(username, r.name, r.default_branch || 'main', activeToken);
            return analyzeRepoHealth(r, details);
          } catch {
            return analyzeRepoHealth(r, {
              readmeContent: null,
              languages: {},
              treeFiles: [],
              recentCommits: [],
            });
          }
        })
      );

      const metrics = computeProfileMetrics(user, allRepos, analyzedTopRepos, profileReadme, publicEvents);
      const { totalScore, grade, categoryScores } = computeScore(metrics, analyzedTopRepos);
      const flags = detectFlags(metrics, analyzedTopRepos);
      const rescueSkeleton = generateRescueSkeleton(metrics, analyzedTopRepos);
      const isBlankSlate = allRepos.length === 0;

      return {
        username: user.login,
        userType: isOrg ? 'Organization' : 'User',
        totalScore,
        grade,
        metrics,
        categoryScores,
        flags,
        topRepos: analyzedTopRepos,
        rescueSkeleton,
        isBlankSlate,
      };
    },
    [githubToken]
  );

  const runAnalysis = useCallback(
    async (targetUser: string, chosenIntensity: RoastIntensity = intensity) => {
      const clean = targetUser.trim();
      if (!clean) {
        setInputError('Please enter a GitHub username.');
        return;
      }
      if (!USERNAME_REGEX.test(clean)) {
        setInputError(
          'Invalid username format. GitHub usernames only contain alphanumeric characters and single hyphens.'
        );
        return;
      }

      setInputError(null);
      setApiError(null);
      setLoading(true);
      setFacts(null);
      setNarrative(null);
      setCurrentView('home');
      setShowReportView(true);

      const prior = storedScans.find((s) => s.username.toLowerCase() === clean.toLowerCase());
      setPreviousScore(prior ? prior.score : undefined);

      try {
        const factsResult = await executeAnalysis(clean);
        setFacts(factsResult);
        setLoading(false);
        setNarrativeLoading(true);

        const narrativeResult = generateFallbackNarrative(factsResult, chosenIntensity);
        setNarrative(narrativeResult);
        saveScan(factsResult, narrativeResult.headlineRoast);
      } catch (err: unknown) {
        setLoading(false);
        if (err instanceof GitHubApiError && err.isRateLimit) {
          setApiError({
            code: 'RATE_LIMIT',
            message: err.message,
            resetTime: err.resetTime,
          });
        } else {
          setApiError({
            code: 'ERROR',
            message: err instanceof Error ? err.message : 'An unexpected error occurred while auditing.',
          });
        }
      } finally {
        setNarrativeLoading(false);
      }
    },
    [intensity, storedScans, executeAnalysis]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user') || params.get('username');
    const intensityParam = params.get('intensity') as RoastIntensity | null;
    if (intensityParam && ['gentle', 'medium', 'spicy'].includes(intensityParam)) {
      setIntensity(intensityParam);
    }
    if (userParam) {
      setUsernameInput(userParam);
      runAnalysis(userParam, intensityParam || 'medium');
    }
  }, [runAnalysis]);

  const switchIntensity = (newIntensity: RoastIntensity) => {
    setIntensity(newIntensity);
    if (!facts) return;
    setNarrativeLoading(true);
    setTimeout(() => {
      const narrativeResult = generateFallbackNarrative(facts, newIntensity);
      setNarrative(narrativeResult);
      setNarrativeLoading(false);
    }, 200);
  };

  const handleGenerateProfileReadme = () => {
    if (!facts) return;
    const md = generateProfileReadmeMarkdown(facts);
    setReadmeModalState({
      isOpen: true,
      title: `Profile README for @${facts.username}`,
      subtitle: `Ready to paste in ${facts.username}/${facts.username}/README.md`,
      markdown: md,
      loading: false,
      targetRepoUrl: `https://github.com/${facts.username}/${facts.username}`,
    });
  };

  const handleGenerateRepoReadme = (repoName: string) => {
    if (!facts) return;
    const md = generateRepoReadmeMarkdown(facts, repoName);
    setReadmeModalState({
      isOpen: true,
      title: `README for ${repoName}`,
      subtitle: `Ready to paste in ${facts.username}/${repoName}/README.md`,
      markdown: md,
      loading: false,
      targetRepoUrl: `https://github.com/${facts.username}/${repoName}`,
    });
  };

  const handleSaveProgressToCloud = (completedIds: string[]) => {
    if (!facts) return;
    saveRescueProgressToDatabase(facts.username, completedIds, currentUser?.username || 'anonymous').catch(
      console.error
    );
  };

  const handleBackToHome = () => {
    setShowReportView(false);
    setCurrentView('home');
  };

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200 relative transition-colors ${
        theme === 'dark' ? 'bg-[#0B1020] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#141C2F] border border-[#263247] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        currentView={currentView}
        hasActiveReport={Boolean(facts && showReportView)}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'home' && !facts) setShowReportView(false);
          if (view === 'methodology') setShowMethodologyModal(true);
          if (view === 'database') setShowDatabaseVault(true);
        }}
        onBackToHome={handleBackToHome}
        onOpenDatabaseVault={() => setShowDatabaseVault(true)}
        scanCount={storedScans.length}
        currentUser={currentUser}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        hasGithubToken={Boolean(githubToken)}
        onOpenTokenModal={() => setShowTokenModal(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* VIEW: LOGIN & ACCOUNT */}
        {currentView === 'login' ? (
          <LoginPage
            currentUser={currentUser}
            onLoginSuccess={(user) => {
              handleLoginSuccess(user);
              setCurrentView('home');
            }}
            onLogout={handleLogout}
            storedScans={storedScans}
            onSelectScan={(user) => {
              setUsernameInput(user);
              setCurrentView('home');
              runAnalysis(user);
            }}
            onDeleteScan={handleDeleteScan}
            onClearHistory={handleClearAllHistory}
            onNavigateHome={handleBackToHome}
            onOpenDatabaseVault={() => setShowDatabaseVault(true)}
            isDark={theme === 'dark'}
          />
        ) : currentView === 'battle' ? (
          /* VIEW: ROAST BATTLE */
          <RoastBattle
            onInspectUser={(user) => {
              setUsernameInput(user);
              setCurrentView('home');
              runAnalysis(user);
            }}
            onRunAuditInternal={executeAnalysis}
          />
        ) : (
          <>
            {/* VIEW 1: HOME / LANDING PAGE */}
            {(!showReportView || !facts) && !loading && (
              <LandingPage
                usernameInput={usernameInput}
                setUsernameInput={(val) => {
                  setUsernameInput(val);
                  if (inputError) setInputError(null);
                }}
                intensity={intensity}
                setIntensity={setIntensity}
                inputError={inputError}
                loading={loading}
                onRunAudit={(user) => {
                  const target = user || usernameInput;
                  if (target) {
                    setUsernameInput(target);
                    runAnalysis(target);
                  }
                }}
                facts={facts}
                onResumeAudit={() => setShowReportView(true)}
                githubToken={githubToken}
                onOpenTokenModal={() => setShowTokenModal(true)}
                storedScans={storedScans}
                onSelectScan={(user) => {
                  setUsernameInput(user);
                  runAnalysis(user);
                }}
                onDeleteScan={handleDeleteScan}
                onClearHistory={handleClearAllHistory}
                onOpenLogin={() => setShowLoginModal(true)}
                onOpenBattle={() => setCurrentView('battle')}
                onOpenMethodology={() => setShowMethodologyModal(true)}
                onOpenDatabaseVault={() => setShowDatabaseVault(true)}
                isDark={theme === 'dark'}
              />
            )}

            {/* LOADING STATE */}
            {loading && <LoadingRoast username={usernameInput} />}

            {/* ERROR STATE */}
            {apiError && (
              <div className="max-w-xl mx-auto my-12 bg-[#141C2F] border border-[#263247] p-6 rounded-3xl text-center animate-fadeIn shadow-2xl">
                {apiError.code === 'RATE_LIMIT' || apiError.message.toLowerCase().includes('rate limit') ? (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-[#1C263D] text-cyan-400 border border-[#2E3C5B] flex items-center justify-center mx-auto mb-3">
                      <Key className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-2">GitHub Hourly Rate Limit Reached</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mb-2 leading-relaxed">
                      GitHub limits unauthenticated public IP requests to <strong>60 per hour</strong>.
                    </p>
                    <p className="text-xs text-slate-300 font-mono mb-6 bg-[#0B1020] p-2.5 rounded-xl border border-[#232F46]">
                      Fix this instantly: Add a free personal access token to get <strong>5,000 requests/hr</strong>, or try our instant demo profiles!
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mb-5">
                      <button
                        onClick={() => setShowTokenModal(true)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md border border-slate-200 transition-all cursor-pointer"
                      >
                        <Key className="w-4 h-4 text-slate-950" />
                        <span>Add Free GitHub Token (5k req/hr)</span>
                      </button>
                      <button
                        onClick={() => {
                          setApiError(null);
                          handleBackToHome();
                        }}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1C263D] hover:bg-[#25324E] text-slate-200 text-xs font-semibold cursor-pointer border border-[#2E3C5B]"
                      >
                        Back to Home
                      </button>
                    </div>
                    <div className="pt-4 border-t border-[#232F46]">
                      <div className="text-xs text-slate-400 mb-2 font-medium">Instant demo profiles (always work):</div>
                      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                        {['alex-student-dev', 'priya-fullstack', 'shadcn', 'torvalds'].map((demo) => (
                          <button
                            key={demo}
                            onClick={() => {
                              setApiError(null);
                              setUsernameInput(demo);
                              runAnalysis(demo);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#0B1020] hover:bg-[#1C263D] text-slate-200 font-mono border border-[#232F46] cursor-pointer"
                          >
                            @{demo}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white mb-2">Audit Failed</h3>
                    <p className="text-sm text-rose-200 mb-4">{apiError.message}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setApiError(null);
                          handleBackToHome();
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1C263D] hover:bg-[#25324E] text-white text-xs font-semibold cursor-pointer border border-[#2E3C5B]"
                      >
                        Back to Home
                      </button>
                      <button
                        onClick={() => {
                          setApiError(null);
                          setUsernameInput('alex-student-dev');
                          runAnalysis('alex-student-dev');
                        }}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold border border-slate-200 shadow-sm cursor-pointer"
                      >
                        Try Student Demo Profile
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* VIEW 2: RESULTS DASHBOARD */}
            {facts && showReportView && !loading && (
              <div className="space-y-8 animate-fadeIn pb-12">
                {/* Sticky Top Control Bar */}
                <div
                  className={`sticky top-18 z-30 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 border ${
                    theme === 'dark' ? 'bg-[#0B1020]/90 border-[#263247]' : 'bg-white/95 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBackToHome}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all shadow-md border border-slate-200 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 text-slate-950" />
                      <span>Back to Home</span>
                    </button>
                    <div className={`hidden sm:flex items-center gap-2 pl-2 border-l ${
                      theme === 'dark' ? 'border-[#263247]' : 'border-slate-200'
                    }`}>
                      <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Auditing:</span>
                      <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg border ${
                        theme === 'dark' ? 'text-white bg-[#141C2F] border-[#263247]' : 'text-slate-900 bg-slate-100 border-slate-200'
                      }`}>
                        @{facts.username} ({facts.totalScore}/100)
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 ml-1">
                        <CloudCheck className="w-3.5 h-3.5" />
                        <span>Saved to Database</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDatabaseVault(true)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-[#141C2F] hover:bg-[#1C263D] text-cyan-300 border-[#263247]'
                          : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border-cyan-200'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Database Vault</span>
                    </button>
                    <button
                      onClick={() => runAnalysis(facts.username)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-[#141C2F] hover:bg-[#1C263D] text-slate-200 hover:text-white border-[#263247]'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border-slate-200'
                      }`}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-scan</span>
                    </button>
                    {narrative && (
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold flex items-center gap-1.5 border border-slate-200 shadow-sm transition-all cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share Card</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Identity Bar */}
                <div
                  className={`border rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    theme === 'dark' ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`https://github.com/${facts.username}.png`}
                      alt={facts.username}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 object-cover border-2 border-[#263247] shadow-lg"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          @{facts.username}
                        </h2>
                        <a
                          href={`https://github.com/${facts.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white p-1"
                          title="Open GitHub"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
                        <span>{facts.metrics.publicRepoCount} repos</span>
                        <span>•</span>
                        <span>{facts.metrics.accountAgeYears}y on GitHub</span>
                        <span>•</span>
                        <span>{facts.metrics.totalStars} stars</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FunnySticker emoji="👀" text="Recruiter Is Watching" accent="cyan" />
                    <div className={`flex items-center gap-1 p-1 border rounded-xl text-xs ${
                      theme === 'dark' ? 'bg-[#0B1020] border-[#263247]' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {(['gentle', 'medium', 'spicy'] as RoastIntensity[]).map((int) => (
                        <button
                          key={int}
                          onClick={() => switchIntensity(int)}
                          disabled={narrativeLoading}
                          className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                            intensity === int
                              ? theme === 'dark'
                                ? 'bg-[#1C263D] text-cyan-300 font-bold border border-[#2E3C5B]'
                                : 'bg-white text-slate-900 shadow-sm font-bold'
                              : theme === 'dark'
                              ? 'text-slate-400 hover:text-slate-200'
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {int === 'gentle' ? '🌱' : int === 'medium' ? '⚡' : '🔥'} {int}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score & Category Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className={`lg:col-span-4 border rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center ${
                    theme === 'dark' ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
                  }`}>
                    <ScoreGauge
                      score={facts.totalScore}
                      grade={facts.grade}
                      previousScore={previousScore}
                      isDark={theme === 'dark'}
                    />
                    <div className={`mt-6 pt-4 border-t w-full text-left space-y-2 ${
                      theme === 'dark' ? 'border-[#263247]' : 'border-slate-100'
                    }`}>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Original Repos</span>
                        <span className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{facts.metrics.originalRepoCount}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Active Weeks (6mo)</span>
                        <span className={`font-mono font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{facts.metrics.activeWeeksLast6Months}/26</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400 items-center">
                        <span>Lazy Commits</span>
                        <span className="font-mono text-cyan-300 bg-[#1C263D] px-2 py-0.5 rounded border border-[#2E3C5B] font-bold text-xs">{facts.metrics.overallGenericCommitRate}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Profile README</span>
                        <span className={`font-mono font-bold ${facts.metrics.hasProfileReadme ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {facts.metrics.hasProfileReadme ? 'Present' : 'Not setup'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8">
                    <CategoryBars categoryScores={facts.categoryScores} isDark={theme === 'dark'} />
                  </div>
                </div>

                {/* Narrative Roast & Recruiter View */}
                {narrative && (
                  <>
                    <div className={`border rounded-3xl p-6 shadow-xl relative overflow-hidden ${
                      theme === 'dark' ? 'bg-gradient-to-r from-[#141C2F] via-[#162035] to-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-cyan-300 bg-[#1C263D] px-2.5 py-0.5 rounded text-[11px] font-mono font-medium tracking-wider inline-block uppercase border border-[#2E3C5B]">
                          DEVELOPER DAMAGE REPORT ({intensity.toUpperCase()} MODE)
                        </span>
                        <FunnySticker emoji="💥" text="Damage Dealt" accent="amber" />
                      </div>
                      <h3 className={`text-lg sm:text-xl font-medium tracking-normal leading-relaxed italic ${
                        theme === 'dark' ? 'text-slate-100' : 'text-slate-800'
                      }`}>
                        &ldquo;{narrative.headlineRoast}&rdquo;
                      </h3>
                    </div>

                    <RecruiterView
                      verdict={narrative.recruiterVerdict}
                      greenFlags={narrative.greenFlags}
                      redFlags={narrative.redFlags}
                      isDark={theme === 'dark'}
                    />

                    {/* The Deep Roast */}
                    <div className={`border rounded-3xl p-6 shadow-xl ${
                      theme === 'dark' ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🔥</span>
                          <h3 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            The Deep Roast
                          </h3>
                        </div>
                        <FunnySticker emoji="🪦" text="RIP README" accent="slate" />
                      </div>
                      <div className="space-y-3.5 text-sm sm:text-base leading-relaxed">
                        {narrative.roastParagraphs.map((p, idx) => (
                          <p
                            key={idx}
                            className={`p-4 rounded-2xl border ${
                              theme === 'dark'
                                ? 'bg-[#0B1020]/70 border-[#1E293B] text-slate-300'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Repository Mini-Roasts */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className={`text-lg sm:text-xl font-bold tracking-tight ${
                              theme === 'dark' ? 'text-white' : 'text-slate-900'
                            }`}>
                              Repository Mini-Roasts
                            </h3>
                            <span className="text-[10px] font-mono uppercase bg-[#182238] border border-[#2D3B55] px-2 py-0.5 rounded text-cyan-300 font-semibold">
                              NO MERCY MODE
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Inspected top {facts.topRepos.length} public repos with individual health grades
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {facts.topRepos.map((repo) => {
                          const repoRoast = narrative.repoRoasts.find((r) => r.repo === repo.name);
                          return (
                            <RepoCard
                              key={repo.name}
                              repo={repo}
                              roastItem={repoRoast}
                              onGenerateReadme={handleGenerateRepoReadme}
                              isDark={theme === 'dark'}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Rescue Plan & Career Mentorship */}
                    {!currentUser ? (
                      <GatedSectionCard
                        username={facts.username}
                        onOpenLogin={() => setShowLoginModal(true)}
                        onQuickDemoLogin={handleQuickDemoLogin}
                        isDark={theme === 'dark'}
                      />
                    ) : (
                      <>
                        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                          theme === 'dark'
                            ? 'bg-[#141C2F] border-emerald-800/60 text-slate-200 shadow-md'
                            : 'bg-slate-100 border-slate-200 text-slate-800 shadow-sm'
                        }`}>
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Unlocked for @{currentUser.username} • Cloud Sync Enabled</span>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400">Full Rescue Plan &amp; AI Doubts Unlocked</span>
                        </div>

                        <RescuePlanView
                          rescuePlan={narrative.rescuePlan}
                          username={facts.username}
                          onGenerateProfileReadme={handleGenerateProfileReadme}
                          onSaveProgressToCloud={handleSaveProgressToCloud}
                          isDark={theme === 'dark'}
                        />

                        <AskDoubtSection facts={facts} isDark={theme === 'dark'} />
                      </>
                    )}

                    {/* Bottom Return Banner */}
                    <div className={`border rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 ${
                      theme === 'dark' ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
                    }`}>
                      <div>
                        <h4 className={`font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          Finished reviewing @{facts.username}?
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">Audit another profile or compare head-to-head in a Roast Battle.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={handleBackToHome}
                          className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md border border-slate-200 cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          <ArrowLeft className="w-4 h-4 text-slate-950" />
                          <span>Return to Home Search</span>
                        </button>
                        <button
                          onClick={() => setCurrentView('battle')}
                          className="px-3.5 py-2.5 rounded-xl bg-[#1C263D] hover:bg-[#25324E] text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-[#2E3C5B] cursor-pointer"
                        >
                          <Swords className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Challenge in Battle</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className={`border-t py-8 text-center text-xs font-mono transition-colors ${
        theme === 'dark' ? 'border-[#1E293B] bg-[#0B1020] text-slate-500' : 'border-slate-200 bg-white text-slate-500'
      }`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Roast &amp; Rescue • Cloud Data Storage Enabled</span>
            <FunnySticker emoji="☕" text="Needs More Coffee" accent="amber" />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                handleBackToHome();
                setCurrentView('home');
              }}
              className="hover:text-slate-300 underline cursor-pointer"
            >
              Home
            </button>
            <span>•</span>
            <button
              onClick={() => setShowDatabaseVault(true)}
              className="hover:text-slate-300 underline cursor-pointer text-cyan-400"
            >
              Database Vault
            </button>
            <span>•</span>
            <button
              onClick={() => setShowMethodologyModal(true)}
              className="hover:text-slate-300 underline cursor-pointer"
            >
              Scoring Methodology
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('battle')}
              className="hover:text-slate-300 underline cursor-pointer"
            >
              Roast Battle
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          isDark={theme === 'dark'}
        />
      )}

      {showShareModal && facts && narrative && (
        <ShareModal
          facts={facts}
          narrative={narrative}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {readmeModalState.isOpen && (
        <ReadmeModal
          title={readmeModalState.title}
          subtitle={readmeModalState.subtitle}
          markdown={readmeModalState.markdown}
          loading={readmeModalState.loading}
          onClose={() => setReadmeModalState((prev) => ({ ...prev, isOpen: false }))}
          targetRepoUrl={readmeModalState.targetRepoUrl}
        />
      )}

      {showMethodologyModal && (
        <MethodologyModal onClose={() => setShowMethodologyModal(false)} />
      )}

      {showTokenModal && (
        <TokenModal
          token={githubToken}
          onSaveToken={(t) => {
            setGithubToken(t);
            try {
              localStorage.setItem('roast_github_token', t);
            } catch {
              // Ignore
            }
            showToast('GitHub token saved! 5,000 req/hr enabled');
          }}
          onRemoveToken={() => {
            setGithubToken('');
            try {
              localStorage.removeItem('roast_github_token');
            } catch {
              // Ignore
            }
            showToast('GitHub token removed');
          }}
          onClose={() => setShowTokenModal(false)}
        />
      )}

      {showHistoryDrawer && (
        <RecentScansDrawer
          scans={storedScans}
          onSelectScan={(user) => {
            setUsernameInput(user);
            setCurrentView('home');
            runAnalysis(user);
          }}
          onDeleteScan={handleDeleteScan}
          onClearHistory={handleClearAllHistory}
          onClose={() => setShowHistoryDrawer(false)}
          onOpenDatabaseVault={() => setShowDatabaseVault(true)}
        />
      )}

      {showDatabaseVault && (
        <DatabaseVaultModal
          scans={storedScans}
          onClose={() => setShowDatabaseVault(false)}
          onSelectScan={(user) => {
            setUsernameInput(user);
            setCurrentView('home');
            runAnalysis(user);
          }}
          onDeleteScan={handleDeleteScan}
          onClearAll={handleClearAllHistory}
          onUpdateNotesAndTags={handleUpdateNotesAndTags}
          onAddManualScan={handleAddManualScan}
          isDark={theme === 'dark'}
        />
      )}
    </div>
  );
}
