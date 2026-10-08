import { ProfileMetrics, RepoAnalysis, RescuePlanItem } from '../../types/analysis.ts';

export function generateRescueSkeleton(
  metrics: ProfileMetrics,
  topRepos: RepoAnalysis[]
): RescuePlanItem[] {
  const plan: RescuePlanItem[] = [];
  let priority = 1;

  // 1. Critical Security Check
  if (metrics.flaggedSecretRepos.length > 0) {
    const targetRepo = metrics.flaggedSecretRepos[0];
    plan.push({
      id: `rescue-secret-${targetRepo}`,
      priority: priority++,
      title: `Sanitize exposed credentials in ${targetRepo}`,
      why: 'Checked-in .env or API credentials are an immediate security hazard and cause instant rejections in technical reviews.',
      steps: [
        'Rotate and invalidate any leaked tokens or database credentials immediately.',
        `In ${targetRepo}, add .env to .gitignore.`,
        'Run `git rm --cached .env` to stop tracking the file without removing local configs.',
        'Push the fix to ensure the repository remains safe.',
      ],
      effort: '15 min',
      impact: 'High',
      category: 'security',
      repoTarget: targetRepo,
    });
  }

  // 2. Profile README
  if (!metrics.hasProfileReadme || metrics.profileReadmeLength < 250) {
    plan.push({
      id: 'rescue-profile-readme',
      priority: priority++,
      title: metrics.hasProfileReadme
        ? 'Supercharge your existing Profile README'
        : 'Launch your GitHub Profile README (username/username)',
      why: 'Recruiters spend 15-30 seconds scanning. Your profile README is the front door that guides their attention to your best work.',
      steps: [
        metrics.hasProfileReadme
          ? `Edit ${metrics.username}/${metrics.username}/README.md.`
          : `Create a public repo named ${metrics.username}/${metrics.username} with a README.md file.`,
        'State in one sentence what you specialize in (e.g., "Full-stack developer building performant web apps").',
        'Add a curated "Featured Projects" section with 2-3 links, 1-line problem statements, and live demos.',
        'Include your direct LinkedIn and contact links.',
      ],
      effort: '15 min',
      impact: 'High',
      category: 'profile',
    });
  }

  // 3. Best Flagship Project Polish
  const bestRepo = [...topRepos].sort((a, b) => b.healthScore - a.healthScore)[0];
  if (bestRepo) {
    const missingItems: string[] = [];
    if (!bestRepo.homepage) missingItems.push('a free deployed demo (Vercel/Render/Netlify)');
    if (!bestRepo.readmeSections.hasScreenshotOrMedia) missingItems.push('a screenshot or GIF preview in README');
    if (!bestRepo.readmeSections.hasInstall) missingItems.push('a 3-step installation/run guide');
    if (!bestRepo.description) missingItems.push('a clear 1-line repo description with keywords');

    if (missingItems.length > 0) {
      plan.push({
        id: `rescue-flagship-${bestRepo.name}`,
        priority: priority++,
        title: `Transform "${bestRepo.name}" into your stellar flagship showcase`,
        why: `Hiring managers look for at least one polished project. Right now ${bestRepo.name} is missing ${missingItems.slice(0, 2).join(' and ')}.`,
        steps: [
          `Deploy ${bestRepo.name} to a free host and set the GitHub "About" website URL.`,
          'Take a clean screenshot or record a 5-second screen recording and embed it at the top of README.md.',
          'Add a "Getting Started" block with copy-pasteable terminal commands.',
          'Add 3-5 relevant topics (e.g. react, typescript, tailwindcss) in the repository settings.',
        ],
        effort: '1 hour',
        impact: 'High',
        category: 'flagship',
        repoTarget: bestRepo.name,
      });
    }
  }

  // 4. Clean up junk artifacts / node_modules
  if (metrics.flaggedJunkTreeRepos.length > 0) {
    const targetRepo = metrics.flaggedJunkTreeRepos[0];
    plan.push({
      id: `rescue-node-modules-${targetRepo}`,
      priority: priority++,
      title: `Purge committed dependency folders from ${targetRepo}`,
      why: 'Checked-in node_modules or venv folders bloat repos to tens of megabytes and signal unfamiliarity with Git conventions.',
      steps: [
        `Navigate to ${targetRepo} and create or update .gitignore to include node_modules/ or venv/.`,
        'Run `git rm -r --cached node_modules` (or venv).',
        'Commit with message "chore: ignore dependency artifacts" and push.',
      ],
      effort: '5 min',
      impact: 'Medium',
      category: 'cleanup',
      repoTarget: targetRepo,
    });
  }

  // 5. Pin & Archive Repos / Tutorial Hell
  if (metrics.tutorialHellCount >= 2 || metrics.suspiciousGenericReposCount >= 2 || metrics.publicRepoCount > 8) {
    plan.push({
      id: 'rescue-curate-repos',
      priority: priority++,
      title: 'Curate your pinned showcase & archive toy clones',
      why: 'Quality beats quantity. Having 15 repos named "test", "todo", or "calculator" dilutes your genuine engineering work.',
      steps: [
        'Pin your 3 best repositories to your profile homepage using "Customize your pins".',
        'Go to repository settings on unfinished tutorials or tests and click "Archive repository".',
        'Ensure every unarchived repo has a descriptive 1-line summary.',
      ],
      effort: '15 min',
      impact: 'Medium',
      category: 'cleanup',
    });
  }

  // 6. Commit Message Quality
  if (metrics.overallGenericCommitRate >= 45) {
    plan.push({
      id: 'rescue-commits',
      priority: priority++,
      title: 'Adopt professional commit message hygiene',
      why: `${metrics.overallGenericCommitRate}% of your recent commits are generic ("update", "fix"). Recruiters scan Git history to evaluate team-readiness.`,
      steps: [
        'Use conventional imperative verbs: "feat: add user authentication", "fix: handle edge case in parser".',
        'Commit in logical chunks rather than 1 giant end-of-day "changes" commit.',
        'Avoid single-word commits like "test", "wip", or "asdf".',
      ],
      effort: '5 min',
      impact: 'Medium',
      category: 'activity',
    });
  }

  return plan.slice(0, 6);
}
