/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { computeScore } from '../src/lib/analysis/scoring.ts';
import { detectFlags } from '../src/lib/analysis/flags.ts';
import { generateRescueSkeleton } from '../src/lib/analysis/rescueSkeleton.ts';
import { generateProfileReadmeMarkdown, generateRepoReadmeMarkdown } from '../src/lib/llm/readmeGenerator.ts';
import { ProfileMetrics, RepoAnalysis, FactsBundle } from '../src/types/analysis.ts';

const pass = (msg: string) => console.log(`\x1b[32m✔ PASS (COMPONENTS):\x1b[0m ${msg}`);
const fail = (msg: string) => {
  console.error(`\x1b[31m✖ FAIL (COMPONENTS):\x1b[0m ${msg}`);
  process.exit(1);
};

console.log('\n--- 🧩 RUNNING COMPONENTS & EDGE CASE TEST SUITE ---\n');

// 1. Edge Case: Blank Slate Profile (Zero repos, newly created account)
const blankMetrics: ProfileMetrics = {
  username: 'newbie-dev',
  accountAgeYears: 0.1,
  publicRepoCount: 0,
  forkedRepoCount: 0,
  originalRepoCount: 0,
  hasCustomAvatar: false,
  nameProvided: false,
  bioLength: 0,
  locationProvided: false,
  websiteProvided: false,
  companyProvided: false,
  hasProfileReadme: false,
  profileReadmeLength: 0,
  totalStars: 0,
  totalForks: 0,
  topLanguages: [],
  activeWeeksLast6Months: 0,
  daysSinceLastPush: 999,
  finishRate: 0,
  tutorialHellCount: 0,
  suspiciousGenericReposCount: 0,
  flaggedSecretRepos: [],
  flaggedJunkTreeRepos: [],
  overallGenericCommitRate: 0,
};

const blankRepos: RepoAnalysis[] = [];

const blankResult = computeScore(blankMetrics, blankRepos);
if (blankResult.totalScore >= 0 && blankResult.totalScore <= 35 && (blankResult.grade === 'Blank Canvas' || blankResult.grade === 'Roast-worthy')) {
  pass(`Blank Slate Profile handled gracefully: ${blankResult.totalScore}/100, Grade: ${blankResult.grade}`);
} else {
  fail(`Blank slate profile scoring broken, got score ${blankResult.totalScore} with grade ${blankResult.grade}`);
}

// 2. Rescue Plan for Blank Slate has starter roadmap
const blankRescue = generateRescueSkeleton(blankMetrics, blankRepos);
if (blankRescue.length > 0 && blankRescue.some((item) => item.category === 'profile')) {
  pass(`Blank Slate generates onboarding rescue roadmap (${blankRescue.length} action items)`);
} else {
  fail('Blank slate rescue roadmap missing or empty');
}

// 3. README Generator test for profile
const mockFactsBundle: FactsBundle = {
  username: 'alex-student-dev',
  userType: 'User',
  totalScore: 42,
  grade: 'Roast-worthy',
  metrics: {
    ...blankMetrics,
    username: 'alex-student-dev',
    topLanguages: [{ language: 'TypeScript', bytes: 10000, percentage: 80 }],
  },
  categoryScores: blankResult.categoryScores,
  flags: [],
  topRepos: [],
  rescueSkeleton: blankRescue,
  isBlankSlate: false,
};

const profileReadme = generateProfileReadmeMarkdown(mockFactsBundle);
if (profileReadme.includes('# Hi there, I\'m Alex') || profileReadme.includes('alex-student-dev')) {
  pass('Profile README generator produced valid formatted Markdown');
} else {
  fail('Profile README generator output missing username or header');
}

// 4. Repo README Generator test
const repoReadme = generateRepoReadmeMarkdown(mockFactsBundle, 'cool-project');
if (repoReadme.includes('# cool-project') && repoReadme.includes('Installation') && repoReadme.includes('Getting Started')) {
  pass('Repo README generator produced structured open-source documentation template');
} else {
  fail('Repo README generator output missing sections');
}

console.log('\n\x1b[32m✨ COMPONENT TESTS: ALL 4 TESTS PASSED CLEANLY!\x1b[0m\n');
