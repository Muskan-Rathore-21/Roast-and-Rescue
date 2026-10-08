import { FlagItem, ProfileMetrics, RepoAnalysis } from '../../types/analysis.ts';

export function detectFlags(metrics: ProfileMetrics, topRepos: RepoAnalysis[]): FlagItem[] {
  const flags: FlagItem[] = [];

  // RED FLAGS (Prioritized)
  // 1. Critical: Secrets / .env
  if (metrics.flaggedSecretRepos.length > 0) {
    flags.push({
      id: 'red-secrets',
      type: 'red',
      severity: 'critical',
      title: 'Committed Secrets or .env Files Detected',
      description: `Repository "${metrics.flaggedSecretRepos[0]}" contains a .env or credentials file. Immediate security risk and interview red flag.`,
      repo: metrics.flaggedSecretRepos[0],
    });
  }

  // 2. Committed node_modules / venv / build artifacts
  if (metrics.flaggedJunkTreeRepos.length > 0) {
    flags.push({
      id: 'red-junk-tree',
      type: 'red',
      severity: 'warning',
      title: 'Dependency Artifacts in Git History',
      description: `Found node_modules, venv, or build binaries committed in "${metrics.flaggedJunkTreeRepos[0]}". Needs a proper .gitignore.`,
      repo: metrics.flaggedJunkTreeRepos[0],
    });
  }

  // 3. Generic commit messages
  if (metrics.overallGenericCommitRate >= 50) {
    flags.push({
      id: 'red-commit-messages',
      type: 'red',
      severity: 'warning',
      title: `${metrics.overallGenericCommitRate}% Low-Effort Commit Messages`,
      description: 'More than half of recent commits use lazy messages like "update", "fix", "asdf", or "wip".',
    });
  }

  // 4. Tutorial Graveyard
  if (metrics.tutorialHellCount >= 3) {
    flags.push({
      id: 'red-tutorial-hell',
      type: 'red',
      severity: 'warning',
      title: 'Tutorial Clone Graveyard',
      description: `Detected ${metrics.tutorialHellCount} generic tutorial repos (todo, calculator, weather). Recruiters filter these out quickly.`,
    });
  }

  // 5. Inactive cooldown
  if (metrics.daysSinceLastPush > 60 && metrics.publicRepoCount > 0) {
    flags.push({
      id: 'red-inactive',
      type: 'red',
      severity: 'warning',
      title: `Inactive for ${metrics.daysSinceLastPush} Days`,
      description: 'No public commits or pushed code in over 2 months. Gives the appearance of an abandoned profile.',
    });
  }

  // 6. Missing Profile README
  if (!metrics.hasProfileReadme) {
    flags.push({
      id: 'red-no-profile-readme',
      type: 'red',
      severity: 'info',
      title: 'Missing GitHub Profile README',
      description: 'No special username/username repository to introduce who you are and what you build.',
    });
  }

  // 7. No live demos on repos
  const reposWithDemo = topRepos.filter((r) => r.homepage && r.homepage.trim().length > 5);
  if (topRepos.length >= 2 && reposWithDemo.length === 0) {
    flags.push({
      id: 'red-no-live-demos',
      type: 'red',
      severity: 'info',
      title: 'Zero Live Demo Links',
      description: 'Recruiters and hiring managers rarely clone and npm run build. Live URLs drastically increase callback rates.',
    });
  }

  // GREEN FLAGS
  // 1. Custom avatar
  if (metrics.hasCustomAvatar) {
    flags.push({
      id: 'green-avatar',
      type: 'green',
      title: 'Distinct Profile Avatar',
      description: 'Replaced the default GitHub identicon, signaling active ownership.',
    });
  }

  // 2. High star count
  if (metrics.totalStars >= 10) {
    flags.push({
      id: 'green-stars',
      type: 'green',
      title: `${metrics.totalStars} GitHub Stars Earned`,
      description: 'Your open-source work has attracted attention and validation from the developer community.',
    });
  }

  // 3. Multi-language polyglot
  if (metrics.topLanguages.length >= 2 && metrics.topLanguages[1].percentage >= 15) {
    flags.push({
      id: 'green-polyglot',
      type: 'green',
      title: `Polyglot Fluency (${metrics.topLanguages[0].language} + ${metrics.topLanguages[1].language})`,
      description: 'Solid balance across multiple programming languages rather than a single tutorial stack.',
    });
  }

  // 4. Standout Flagship Repo
  const standoutRepo = topRepos.find((r) => r.healthScore >= 75);
  if (standoutRepo) {
    flags.push({
      id: 'green-flagship',
      type: 'green',
      title: `Standout Showcase Project: ${standoutRepo.name}`,
      description: `Scored ${standoutRepo.healthScore}/100 with comprehensive documentation, clean structure, and clear metadata.`,
      repo: standoutRepo.name,
    });
  }

  // 5. Active recent contributor
  if (metrics.daysSinceLastPush <= 7 && metrics.activeWeeksLast6Months >= 8) {
    flags.push({
      id: 'green-active-streak',
      type: 'green',
      title: 'Consistent Shipping Cadence',
      description: 'Active across multiple weeks with commits pushed within the last 7 days.',
    });
  }

  return flags;
}
