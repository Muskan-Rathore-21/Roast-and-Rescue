import { computeScore } from '../src/lib/analysis/scoring.ts';
import { detectFlags } from '../src/lib/analysis/flags.ts';
import { generateRescueSkeleton } from '../src/lib/analysis/rescueSkeleton.ts';
import { generateFallbackNarrative } from '../src/lib/llm/fallbackRoasts.ts';
import { ProfileMetrics, RepoAnalysis, FactsBundle } from '../src/types/analysis.ts';

// Color logging helpers
const pass = (msg: string) => console.log(`\x1b[32m✔ PASS:\x1b[0m ${msg}`);
const fail = (msg: string) => {
  console.error(`\x1b[31m✖ FAIL:\x1b[0m ${msg}`);
  process.exit(1);
};

console.log('\n--- 🧪 RUNNING ROAST & RESCUE TEST SUITE ---\n');

// 1. Test Messy Profile (Low score, red flags)
const messyMetrics: ProfileMetrics = {
  username: 'messy-student',
  accountAgeYears: 1.5,
  publicRepoCount: 12,
  forkedRepoCount: 4,
  originalRepoCount: 8,
  hasCustomAvatar: true,
  nameProvided: true,
  bioLength: 12,
  locationProvided: false,
  websiteProvided: false,
  companyProvided: false,
  hasProfileReadme: false,
  profileReadmeLength: 0,
  totalStars: 2,
  totalForks: 0,
  topLanguages: [{ language: 'JavaScript', bytes: 50000, percentage: 100 }],
  activeWeeksLast6Months: 3,
  daysSinceLastPush: 45,
  finishRate: 0.15,
  tutorialHellCount: 4,
  suspiciousGenericReposCount: 3,
  flaggedSecretRepos: ['todo-backend'],
  flaggedJunkTreeRepos: ['react-app-test'],
  overallGenericCommitRate: 65,
};

const messyRepos: RepoAnalysis[] = [
  {
    name: 'todo-backend',
    fullName: 'messy-student/todo-backend',
    description: null,
    isFork: false,
    isArchived: false,
    stars: 1,
    forks: 0,
    language: 'JavaScript',
    languages: { JavaScript: 25000 },
    pushedAt: '2026-08-01T00:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
    sizeKb: 300,
    homepage: null,
    topics: [],
    license: null,
    hasIssues: false,
    hasReadme: false,
    readmeLength: 0,
    readmeSections: {
      hasTitle: false,
      hasInstall: false,
      hasUsage: false,
      hasScreenshotOrMedia: false,
      hasTechStack: false,
      hasFeatures: false,
    },
    hasGitignore: false,
    hasLicenseFile: false,
    hasTests: false,
    hasCiWorkflow: false,
    committedSecretsOrEnv: true,
    committedNodeModulesOrVenv: false,
    totalSampledCommits: 10,
    genericCommitCount: 8,
    genericCommitPercentage: 80,
    healthScore: 10,
    healthGrade: 'F',
  },
  {
    name: 'react-app-test',
    fullName: 'messy-student/react-app-test',
    description: 'test',
    isFork: false,
    isArchived: false,
    stars: 0,
    forks: 0,
    language: 'JavaScript',
    languages: { JavaScript: 15000 },
    pushedAt: '2026-07-01T00:00:00Z',
    createdAt: '2026-02-01T00:00:00Z',
    sizeKb: 45000,
    homepage: null,
    topics: [],
    license: null,
    hasIssues: false,
    hasReadme: true,
    readmeLength: 80,
    readmeSections: {
      hasTitle: true,
      hasInstall: false,
      hasUsage: false,
      hasScreenshotOrMedia: false,
      hasTechStack: false,
      hasFeatures: false,
    },
    hasGitignore: false,
    hasLicenseFile: false,
    hasTests: false,
    hasCiWorkflow: false,
    committedSecretsOrEnv: false,
    committedNodeModulesOrVenv: true,
    totalSampledCommits: 5,
    genericCommitCount: 4,
    genericCommitPercentage: 80,
    healthScore: 15,
    healthGrade: 'F',
  },
];

// Test 1: Scoring logic for messy profile
const resultMessy = computeScore(messyMetrics, messyRepos);
if (resultMessy.totalScore <= 60 && (resultMessy.grade === 'Needs Work' || resultMessy.grade === 'Roast-worthy')) {
  pass(`Messy Profile Deterministic Score: ${resultMessy.totalScore}/100 (Grade: ${resultMessy.grade})`);
} else {
  fail(`Expected messy profile score <= 60, got ${resultMessy.totalScore}`);
}

// Test 2: Flag detection
const messyFlags = detectFlags(messyMetrics, messyRepos);
const hasSecretFlag = messyFlags.some((f) => f.id === 'red-secrets');
const hasJunkFlag = messyFlags.some((f) => f.id === 'red-junk-tree');
const hasTutorialFlag = messyFlags.some((f) => f.id === 'red-tutorial-hell');

if (hasSecretFlag && hasJunkFlag && hasTutorialFlag) {
  pass(`Flag Detection correctly caught critical security and hygiene violations (${messyFlags.length} flags total)`);
} else {
  fail('Flag detection missed critical red flags (secrets or node_modules or tutorial hell)!');
}

// Test 3: Rescue plan prioritization
const rescuePlan = generateRescueSkeleton(messyMetrics, messyRepos);
if (rescuePlan.length > 0 && rescuePlan[0].category === 'security') {
  pass(`Rescue Plan prioritizes critical credential vulnerability as priority #1 (${rescuePlan[0].title})`);
} else {
  fail('Rescue plan did not rank security items as top priority');
}

// Test 4: Senior Profile (High score, green flags)
const seniorMetrics: ProfileMetrics = {
  username: 'senior-oss-dev',
  accountAgeYears: 6.2,
  publicRepoCount: 35,
  forkedRepoCount: 5,
  originalRepoCount: 30,
  hasCustomAvatar: true,
  nameProvided: true,
  bioLength: 45,
  locationProvided: true,
  websiteProvided: true,
  companyProvided: true,
  hasProfileReadme: true,
  profileReadmeLength: 600,
  totalStars: 4200,
  totalForks: 380,
  topLanguages: [
    { language: 'TypeScript', bytes: 650000, percentage: 70 },
    { language: 'Rust', bytes: 280000, percentage: 30 },
  ],
  activeWeeksLast6Months: 18,
  daysSinceLastPush: 4,
  finishRate: 0.85,
  tutorialHellCount: 0,
  suspiciousGenericReposCount: 0,
  flaggedSecretRepos: [],
  flaggedJunkTreeRepos: [],
  overallGenericCommitRate: 12,
};

const seniorRepos: RepoAnalysis[] = [
  {
    name: 'fast-router',
    fullName: 'senior-oss-dev/fast-router',
    description: 'High-performance HTTP router for modern TypeScript runtimes',
    isFork: false,
    isArchived: false,
    stars: 2800,
    forks: 240,
    language: 'TypeScript',
    languages: { TypeScript: 120000 },
    pushedAt: '2026-10-04T00:00:00Z',
    createdAt: '2023-01-01T00:00:00Z',
    sizeKb: 1200,
    homepage: 'https://fast-router.dev',
    topics: ['router', 'typescript', 'http', 'performance'],
    license: 'MIT',
    hasIssues: true,
    hasReadme: true,
    readmeLength: 2400,
    readmeSections: {
      hasTitle: true,
      hasInstall: true,
      hasUsage: true,
      hasScreenshotOrMedia: true,
      hasTechStack: true,
      hasFeatures: true,
    },
    hasGitignore: true,
    hasLicenseFile: true,
    hasTests: true,
    hasCiWorkflow: true,
    committedSecretsOrEnv: false,
    committedNodeModulesOrVenv: false,
    totalSampledCommits: 25,
    genericCommitCount: 2,
    genericCommitPercentage: 8,
    healthScore: 95,
    healthGrade: 'A',
  },
];

const resultSenior = computeScore(seniorMetrics, seniorRepos);
if (resultSenior.totalScore >= 80 && (resultSenior.grade === 'Hire-ready' || resultSenior.grade === 'Solid')) {
  pass(`Senior Profile Deterministic Score: ${resultSenior.totalScore}/100 (Grade: ${resultSenior.grade})`);
} else {
  fail(`Expected senior score >= 80, got ${resultSenior.totalScore}`);
}

const seniorFlags = detectFlags(seniorMetrics, seniorRepos);
const hasStarFlag = seniorFlags.some((f) => f.id === 'green-stars');
const hasFlagshipFlag = seniorFlags.some((f) => f.id === 'green-flagship');

if (hasStarFlag && hasFlagshipFlag) {
  pass('Senior Profile detected green highlights (community stars + standout flagship repo)');
} else {
  fail('Senior profile missed green flags');
}

// Test 5: Fallback narrative roast generator
const factsBundle: FactsBundle = {
  username: 'senior-oss-dev',
  userType: 'User',
  totalScore: resultSenior.totalScore,
  grade: resultSenior.grade,
  metrics: seniorMetrics,
  categoryScores: resultSenior.categoryScores,
  flags: seniorFlags,
  topRepos: seniorRepos,
  rescueSkeleton: generateRescueSkeleton(seniorMetrics, seniorRepos),
  isBlankSlate: false,
};

const narrative = generateFallbackNarrative(factsBundle, 'medium');
if (
  narrative.headlineRoast &&
  narrative.recruiterVerdict.summary &&
  narrative.roastParagraphs.length > 0 &&
  narrative.greenFlags.length > 0
) {
  pass(`Narrative roast engine successfully generated headline: "${narrative.headlineRoast.slice(0, 50)}..."`);
} else {
  fail('Narrative generation returned invalid or incomplete payload');
}

console.log('\n\x1b[32m✨ ALL 5 TEST SUITES PASSED CLEANLY!\x1b[0m\n');
