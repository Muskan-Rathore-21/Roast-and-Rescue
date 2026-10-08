import { GitHubUserRaw, ProfileMetrics, RepoAnalysis } from '../../types/analysis.ts';
import { RawRepoItem, RepoDetailsRaw } from '../github/client.ts';

const GENERIC_COMMIT_PATTERNS = [
  /^update\b/i,
  /^fix\b/i,
  /^fixes\b/i,
  /^fixed\b/i,
  /^first commit/i,
  /^initial commit/i,
  /^initial\b/i,
  /^test\b/i,
  /^asdf/i,
  /^changes\b/i,
  /^wip\b/i,
  /^clean\b/i,
  /^commit\b/i,
  /^minor\b/i,
  /^misc\b/i,
  /^temp\b/i,
  /^\.+$/,
];

const TUTORIAL_NAMES = [
  'todo',
  'todo-app',
  'todo-list',
  'calculator',
  'weather-app',
  'tic-tac-toe',
  'portfolio',
  'portfolio-website',
  'counter',
  'clock',
  'quiz',
  'quiz-app',
  'notes-app',
  'ecommerce-mern',
];

const SUSPICIOUS_GENERIC_NAMES = [
  'test',
  'tests',
  'demo',
  'untitled',
  'project1',
  'project-1',
  'my-project',
  'sample',
  'copy',
  'temp',
  'new-repo',
  'code',
  'practice',
  'assignment',
];

export function analyzeRepoHealth(
  repo: RawRepoItem,
  details: RepoDetailsRaw
): RepoAnalysis {
  const readme = details.readmeContent || '';
  const hasReadme = readme.trim().length > 30;
  const readmeLength = readme.length;
  const readmeLower = readme.toLowerCase();

  const readmeSections = {
    hasTitle: /^#\s+.+/m.test(readme) || readme.length > 100,
    hasInstall: /(install|setup|get started|getting started|building|prerequisites|requirements|npm i|pip install|cargo)/i.test(readmeLower),
    hasUsage: /(usage|example|how to use|quickstart|api|commands|demo|guide)/i.test(readmeLower),
    hasScreenshotOrMedia: /(!\[.*?\]\(.*?\)|<img\s+[^>]*src=|\.png|\.jpg|\.jpeg|\.gif|\.svg)/i.test(readme),
    hasTechStack: /(built with|tech stack|technologies|dependencies|written in|stack:)/i.test(readmeLower),
    hasFeatures: /(feature|overview|about|what it does|architecture|highlight|capabilities)/i.test(readmeLower),
  };

  const tree = details.treeFiles;
  const hasGitignore = tree.some((f) => f.toLowerCase() === '.gitignore');
  const hasLicenseFile = tree.some((f) => /^(license|licence|copying)(\..+)?$/i.test(f)) || Boolean(repo.license);
  const hasTests = tree.some((f) => /(test|tests|spec|__tests__|\.test\.|\.spec\.)/i.test(f));
  const hasCiWorkflow = tree.some((f) => f.startsWith('.github/workflows/'));

  // Warnings
  const committedSecretsOrEnv = tree.some((f) =>
    /(^\.env(\.local|\.production|\.development)?$|\.pem$|\.key$|id_rsa|credentials\.json)/i.test(f)
  );
  const committedNodeModulesOrVenv = tree.some((f) =>
    /(node_modules\/|venv\/|\.venv\/|__pycache__\/|target\/debug\/|dist\/bundle\.js)/i.test(f)
  );

  // Commits sample analysis
  const totalSampledCommits = details.recentCommits.length;
  let genericCommitCount = 0;
  for (const c of details.recentCommits) {
    const msg = c.message.trim().split('\n')[0] || '';
    if (msg.length < 5 || GENERIC_COMMIT_PATTERNS.some((p) => p.test(msg))) {
      genericCommitCount++;
    }
  }
  const genericCommitPercentage =
    totalSampledCommits > 0 ? Math.round((genericCommitCount / totalSampledCommits) * 100) : 0;

  // Calculate Health Score (0 - 100)
  let healthScore = 0;
  if (repo.description && repo.description.trim().length > 5) healthScore += 15;
  if (hasReadme) healthScore += 20;
  if (readmeSections.hasInstall || readmeSections.hasUsage) healthScore += 10;
  if (readmeSections.hasScreenshotOrMedia || readmeLength > 600) healthScore += 10;
  if (readmeSections.hasFeatures || readmeSections.hasTechStack || readmeSections.hasTitle) healthScore += 10;

  if (repo.homepage && repo.homepage.trim().length > 5) {
    healthScore += 15;
  } else if (repo.stargazers_count >= 20 || repo.forks_count >= 5) {
    healthScore += 15;
  } else if (repo.stargazers_count >= 5) {
    healthScore += 8;
  }

  if (repo.topics && repo.topics.length > 0) healthScore += 5;
  if (hasLicenseFile) healthScore += 5;
  if (hasGitignore) healthScore += 5;
  if (hasTests || hasCiWorkflow || repo.size > 200) healthScore += 5;

  if (committedSecretsOrEnv) healthScore = Math.max(0, healthScore - 25);
  if (committedNodeModulesOrVenv) healthScore = Math.max(0, healthScore - 20);
  if (genericCommitPercentage > 60) healthScore = Math.max(0, healthScore - 15);

  healthScore = Math.min(100, Math.max(0, healthScore));

  let healthGrade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (healthScore >= 85) healthGrade = 'A';
  else if (healthScore >= 70) healthGrade = 'B';
  else if (healthScore >= 50) healthGrade = 'C';
  else if (healthScore >= 35) healthGrade = 'D';

  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    isFork: repo.fork,
    isArchived: repo.archived,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    languages: details.languages,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    sizeKb: repo.size,
    homepage: repo.homepage,
    topics: repo.topics || [],
    license: repo.license?.spdx_id || repo.license?.name || null,
    hasIssues: repo.has_issues,
    hasReadme,
    readmeLength,
    readmeSections,
    hasGitignore,
    hasLicenseFile,
    hasTests,
    hasCiWorkflow,
    committedSecretsOrEnv,
    committedNodeModulesOrVenv,
    totalSampledCommits,
    genericCommitCount,
    genericCommitPercentage,
    healthScore,
    healthGrade,
  };
}

export function computeProfileMetrics(
  user: GitHubUserRaw,
  allRepos: RawRepoItem[],
  analyzedTopRepos: RepoAnalysis[],
  profileReadme: { exists: boolean; length: number },
  publicEvents: Array<{ type: string; created_at: string }>
): ProfileMetrics {
  const now = new Date();
  const createdDate = new Date(user.created_at);
  const accountAgeYears = Math.max(
    0.1,
    Number(((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1))
  );

  const forkedRepos = allRepos.filter((r) => r.fork);
  const originalRepos = allRepos.filter((r) => !r.fork);

  const hasCustomAvatar = Boolean(user.avatar_url && !user.avatar_url.includes('identicons'));
  const nameProvided = Boolean(user.name && user.name.trim().length > 0);
  const bioLength = user.bio ? user.bio.trim().length : 0;
  const locationProvided = Boolean(user.location && user.location.trim().length > 0);
  const websiteProvided = Boolean(user.blog && user.blog.trim().length > 0);
  const companyProvided = Boolean(user.company && user.company.trim().length > 0);

  let totalStars = 0;
  let totalForks = 0;
  const languageBytesMap: Record<string, number> = {};

  for (const r of allRepos) {
    totalStars += r.stargazers_count;
    totalForks += r.forks_count;
    if (r.language) {
      languageBytesMap[r.language] = (languageBytesMap[r.language] || 0) + (r.size || 10);
    }
  }

  for (const r of analyzedTopRepos) {
    for (const [lang, bytes] of Object.entries(r.languages)) {
      languageBytesMap[lang] = (languageBytesMap[lang] || 0) + bytes;
    }
  }

  const totalBytes = Object.values(languageBytesMap).reduce((acc, v) => acc + v, 0) || 1;
  const topLanguages = Object.entries(languageBytesMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: Math.min(100, Math.round((bytes / totalBytes) * 100)),
    }));

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const activeWeekSet = new Set<string>();
  for (const ev of publicEvents) {
    const d = new Date(ev.created_at);
    if (d >= sixMonthsAgo) {
      const weekNumber = `${d.getFullYear()}-${Math.floor(d.getDate() / 7)}-${d.getMonth()}`;
      activeWeekSet.add(weekNumber);
    }
  }

  for (const r of allRepos) {
    const pushDate = new Date(r.pushed_at);
    if (pushDate >= sixMonthsAgo) {
      const weekNumber = `${pushDate.getFullYear()}-${Math.floor(pushDate.getDate() / 7)}-${pushDate.getMonth()}`;
      activeWeekSet.add(weekNumber);
    }
  }

  const activeWeeksLast6Months = Math.min(26, activeWeekSet.size);

  let daysSinceLastPush = 999;
  if (allRepos.length > 0) {
    const latestPushMs = Math.max(...allRepos.map((r) => new Date(r.pushed_at).getTime()));
    if (latestPushMs > 0) {
      daysSinceLastPush = Math.max(0, Math.floor((now.getTime() - latestPushMs) / (1000 * 60 * 60 * 24)));
    }
  }

  const nonForkCount = originalRepos.length;
  let finishedCount = 0;
  for (const r of originalRepos) {
    if (r.description && r.description.trim().length > 15 && r.size > 20) {
      finishedCount++;
    }
  }
  const finishRate = nonForkCount > 0 ? Number((finishedCount / nonForkCount).toFixed(2)) : 0;

  let tutorialHellCount = 0;
  let suspiciousGenericReposCount = 0;
  for (const r of allRepos) {
    const nameLower = r.name.toLowerCase();
    if (TUTORIAL_NAMES.some((t) => nameLower.includes(t))) {
      tutorialHellCount++;
    }
    if (SUSPICIOUS_GENERIC_NAMES.some((s) => nameLower.includes(s))) {
      suspiciousGenericReposCount++;
    }
  }

  const flaggedSecretRepos = analyzedTopRepos.filter((r) => r.committedSecretsOrEnv).map((r) => r.name);
  const flaggedJunkTreeRepos = analyzedTopRepos.filter((r) => r.committedNodeModulesOrVenv).map((r) => r.name);

  let totalCommitsAnalyzed = 0;
  let totalGenericCommits = 0;
  for (const r of analyzedTopRepos) {
    totalCommitsAnalyzed += r.totalSampledCommits;
    totalGenericCommits += r.genericCommitCount;
  }
  const overallGenericCommitRate =
    totalCommitsAnalyzed > 0 ? Math.round((totalGenericCommits / totalCommitsAnalyzed) * 100) : 0;

  return {
    username: user.login,
    accountAgeYears,
    publicRepoCount: user.public_repos,
    forkedRepoCount: forkedRepos.length,
    originalRepoCount: nonForkCount,
    hasCustomAvatar,
    nameProvided,
    bioLength,
    locationProvided,
    websiteProvided,
    companyProvided,
    hasProfileReadme: profileReadme.exists,
    profileReadmeLength: profileReadme.length,
    totalStars,
    totalForks,
    topLanguages,
    activeWeeksLast6Months,
    daysSinceLastPush,
    finishRate,
    tutorialHellCount,
    suspiciousGenericReposCount,
    flaggedSecretRepos,
    flaggedJunkTreeRepos,
    overallGenericCommitRate,
  };
}
