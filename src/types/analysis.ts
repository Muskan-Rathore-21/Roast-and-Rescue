export type RoastIntensity = 'gentle' | 'medium' | 'spicy';

export interface GitHubUserRaw {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  type: 'User' | 'Organization';
}

export interface RepoAnalysis {
  name: string;
  fullName: string;
  description: string | null;
  isFork: boolean;
  isArchived: boolean;
  stars: number;
  forks: number;
  language: string | null;
  languages: Record<string, number>;
  pushedAt: string;
  createdAt: string;
  sizeKb: number;
  homepage: string | null;
  topics: string[];
  license: string | null;
  hasIssues: boolean;
  hasReadme: boolean;
  readmeLength: number;
  readmeSections: {
    hasTitle: boolean;
    hasInstall: boolean;
    hasUsage: boolean;
    hasScreenshotOrMedia: boolean;
    hasTechStack: boolean;
    hasFeatures: boolean;
  };
  hasGitignore: boolean;
  hasLicenseFile: boolean;
  hasTests: boolean;
  hasCiWorkflow: boolean;
  committedSecretsOrEnv: boolean;
  committedNodeModulesOrVenv: boolean;
  totalSampledCommits: number;
  genericCommitCount: number;
  genericCommitPercentage: number;
  healthScore: number;
  healthGrade: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface ProfileMetrics {
  username: string;
  accountAgeYears: number;
  publicRepoCount: number;
  forkedRepoCount: number;
  originalRepoCount: number;
  hasCustomAvatar: boolean;
  nameProvided: boolean;
  bioLength: number;
  locationProvided: boolean;
  websiteProvided: boolean;
  companyProvided: boolean;
  hasProfileReadme: boolean;
  profileReadmeLength: number;
  totalStars: number;
  totalForks: number;
  topLanguages: { language: string; bytes: number; percentage: number }[];
  activeWeeksLast6Months: number;
  daysSinceLastPush: number;
  finishRate: number;
  tutorialHellCount: number;
  suspiciousGenericReposCount: number;
  flaggedSecretRepos: string[];
  flaggedJunkTreeRepos: string[];
  overallGenericCommitRate: number;
}

export interface CategoryScores {
  profileBasics: { score: number; max: 15; label: string; breakdown: string[] };
  profileReadme: { score: number; max: 10; label: string; breakdown: string[] };
  projectQuality: { score: number; max: 25; label: string; breakdown: string[] };
  readmeQuality: { score: number; max: 20; label: string; breakdown: string[] };
  activityConsistency: { score: number; max: 15; label: string; breakdown: string[] };
  finishRateFocus: { score: number; max: 10; label: string; breakdown: string[] };
  communitySignals: { score: number; max: 5; label: string; breakdown: string[] };
}

export type ProfileGrade = 'Hire-ready' | 'Solid' | 'Needs Work' | 'Roast-worthy' | 'Blank Canvas';

export interface FlagItem {
  id: string;
  type: 'red' | 'green';
  title: string;
  description: string;
  severity?: 'critical' | 'warning' | 'info';
  repo?: string;
}

export interface RescuePlanItem {
  id: string;
  priority: number;
  title: string;
  why: string;
  steps: string[];
  effort: '5 min' | '15 min' | '1 hour' | 'Weekend';
  impact: 'High' | 'Medium' | 'Low';
  category: 'security' | 'profile' | 'flagship' | 'cleanup' | 'activity';
  repoTarget?: string;
}

export interface FactsBundle {
  username: string;
  userType: 'User' | 'Organization';
  totalScore: number;
  grade: ProfileGrade;
  metrics: ProfileMetrics;
  categoryScores: CategoryScores;
  flags: FlagItem[];
  topRepos: RepoAnalysis[];
  rescueSkeleton: RescuePlanItem[];
  isBlankSlate: boolean;
}

export interface RepoRoastItem {
  repo: string;
  roast: string;
  fix: string;
}

export interface NarrativeResult {
  headlineRoast: string;
  recruiterVerdict: {
    impression: 'Would keep reading' | 'Maybe' | 'Would close tab';
    summary: string;
  };
  greenFlags: string[];
  redFlags: string[];
  roastParagraphs: string[];
  repoRoasts: RepoRoastItem[];
  rescuePlan: RescuePlanItem[];
  usedFallback: boolean;
}

export interface StoredScan {
  id: string;
  username: string;
  avatarUrl: string;
  score: number;
  grade: ProfileGrade;
  scannedAt: string;
  headlineRoast?: string;
  notes?: string;
  tags?: string[];
  syncedToCloud?: boolean;
}

export interface BattleRecord {
  id: string;
  userA: string;
  userB: string;
  scoreA: number;
  scoreB: number;
  winner: 'A' | 'B' | 'TIE';
  verdict: string;
  createdAt: string;
}

export interface UserSession {
  username: string;
  name: string;
  email?: string;
  avatarUrl: string;
  provider?: 'github' | 'google' | 'email' | 'demo';
  loggedInAt: string;
}
