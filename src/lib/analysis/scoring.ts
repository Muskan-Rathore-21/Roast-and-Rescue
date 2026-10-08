import { CategoryScores, ProfileGrade, ProfileMetrics, RepoAnalysis } from '../../types/analysis.ts';

export function computeScore(
  metrics: ProfileMetrics,
  topRepos: RepoAnalysis[]
): { totalScore: number; grade: ProfileGrade; categoryScores: CategoryScores } {
  // 1. Profile Basics (15 pts)
  let basicsScore = 0;
  const basicsBreakdown: string[] = [];

  if (metrics.hasCustomAvatar) {
    basicsScore += 3;
    basicsBreakdown.push('Profile photo set (+3)');
  } else {
    basicsBreakdown.push('Default or missing photo (0/3)');
  }

  if (metrics.nameProvided) {
    basicsScore += 3;
    basicsBreakdown.push('Full name provided (+3)');
  } else {
    basicsBreakdown.push('Missing display name (0/3)');
  }

  if (metrics.bioLength >= 15) {
    basicsScore += 4;
    basicsBreakdown.push('Bio provided (+4)');
  } else if (metrics.bioLength > 0) {
    basicsScore += 3;
    basicsBreakdown.push('Short bio provided (+3)');
  } else if (metrics.totalStars >= 10 || metrics.originalRepoCount >= 3) {
    basicsScore += 3;
    basicsBreakdown.push('Codebase presence establishes identity (+3)');
  } else {
    basicsBreakdown.push('No bio written (0/4)');
  }

  if (metrics.locationProvided) {
    basicsScore += 2;
    basicsBreakdown.push('Location provided (+2)');
  } else if (metrics.totalStars >= 10 || metrics.originalRepoCount >= 3) {
    basicsScore += 1;
    basicsBreakdown.push('Reputation offset (+1)');
  } else {
    basicsBreakdown.push('Location missing (0/2)');
  }

  if (metrics.websiteProvided) {
    basicsScore += 2;
    basicsBreakdown.push('Website or portfolio link (+2)');
  } else if (metrics.originalRepoCount >= 4) {
    basicsScore += 1;
    basicsBreakdown.push('GitHub portfolio self-host (+1)');
  } else {
    basicsBreakdown.push('No portfolio link (0/2)');
  }

  if (metrics.companyProvided || metrics.totalStars >= 10) {
    basicsScore += 1;
    basicsBreakdown.push('Affiliation or public credibility (+1)');
  } else {
    basicsBreakdown.push('No company/affiliation listed (0/1)');
  }

  basicsScore = Math.min(15, basicsScore);

  // 2. Profile README (10 pts)
  let profileReadmeScore = 0;
  const profileReadmeBreakdown: string[] = [];

  if (metrics.hasProfileReadme) {
    if (metrics.profileReadmeLength >= 150) {
      profileReadmeScore = 10;
      profileReadmeBreakdown.push('Rich Profile README with links, skills, and projects (+10/10)');
    } else if (metrics.profileReadmeLength > 30) {
      profileReadmeScore = 8;
      profileReadmeBreakdown.push('Profile README present (+8/10)');
    } else {
      profileReadmeScore = 6;
      profileReadmeBreakdown.push('Profile README is brief (+6/10)');
    }
  } else if (metrics.totalStars >= 20 || metrics.originalRepoCount >= 5) {
    profileReadmeScore = 8;
    profileReadmeBreakdown.push('High repository showcase presence covers profile intro (+8/10)');
  } else if (metrics.originalRepoCount >= 2) {
    profileReadmeScore = 6;
    profileReadmeBreakdown.push('Project showcase establishes profile presence (+6/10)');
  } else {
    profileReadmeScore = 2;
    profileReadmeBreakdown.push('Missing username/username profile README (+2/10)');
  }

  // 3. Project Quality (25 pts)
  let projectQualityScore = 0;
  const projectQualityBreakdown: string[] = [];

  if (topRepos.length === 0) {
    projectQualityBreakdown.push('No public original repositories found (0/25)');
  } else {
    let repoTotal = 0;
    let withDesc = 0;
    let withDemoOrStars = 0;
    let withLicense = 0;

    for (const r of topRepos) {
      let rScore = 0;
      if (r.description && r.description.trim().length > 10) {
        rScore += 5;
        withDesc++;
      } else if (r.description && r.description.trim().length > 0) {
        rScore += 3;
        withDesc++;
      }

      if (r.topics.length > 0) {
        rScore += 3;
      } else if (r.language) {
        rScore += 2;
      }

      if ((r.homepage && r.homepage.trim().length > 5) || r.stars >= 5) {
        rScore += 7;
        withDemoOrStars++;
      } else if (r.stars >= 1 || r.sizeKb > 50) {
        rScore += 6;
        withDemoOrStars++;
      } else if (!r.isFork) {
        rScore += 4;
        withDemoOrStars++;
      }

      if (r.license || r.hasLicenseFile) {
        rScore += 4;
        withLicense++;
      } else if (!r.isFork && r.sizeKb > 20) {
        rScore += 3;
      }

      if (!r.isFork && r.sizeKb > 10) {
        rScore += 6;
      } else if (r.sizeKb > 5) {
        rScore += 4;
      }

      repoTotal += Math.min(25, rScore);
    }

    const avgProjectScore = Math.round(repoTotal / topRepos.length);
    projectQualityScore = Math.min(25, avgProjectScore);
    projectQualityBreakdown.push(`${withDesc}/${topRepos.length} top repos have descriptions`);
    projectQualityBreakdown.push(`${withDemoOrStars}/${topRepos.length} repos have demos, stars, or substantial codebases`);
    projectQualityBreakdown.push(`${withLicense}/${topRepos.length} repos have open-source licenses`);
  }

  // 4. README Quality (20 pts)
  let readmeQualityScore = 0;
  const readmeQualityBreakdown: string[] = [];

  if (topRepos.length === 0) {
    readmeQualityBreakdown.push('No repositories to inspect for documentation (0/20)');
  } else {
    let readmeTotal = 0;
    let withInstall = 0;
    let withMedia = 0;

    for (const r of topRepos) {
      let rScore = 0;
      if (r.readmeLength >= 250) rScore += 5;
      else if (r.readmeLength > 30) rScore += 3;

      if (r.readmeSections.hasTitle || r.readmeSections.hasTechStack || r.stars >= 3) rScore += 4;
      if (r.readmeSections.hasInstall || r.readmeSections.hasUsage || r.stars >= 5) {
        rScore += 5;
        withInstall++;
      } else if (r.hasReadme) {
        rScore += 3;
      }

      if (r.readmeSections.hasScreenshotOrMedia || r.stars >= 10 || r.topics.length > 0) {
        rScore += 3;
        withMedia++;
      } else if (r.hasReadme) {
        rScore += 2;
      }

      if (r.readmeSections.hasFeatures || r.stars >= 3 || r.description) {
        rScore += 3;
      }

      readmeTotal += Math.min(20, rScore);
    }

    const avgReadme = Math.round(readmeTotal / topRepos.length);
    readmeQualityScore = Math.min(20, avgReadme);
    readmeQualityBreakdown.push(`Average repo documentation score: ${readmeQualityScore}/20`);
    readmeQualityBreakdown.push(`${withInstall}/${topRepos.length} repos include setup or usage documentation`);
    readmeQualityBreakdown.push(`${withMedia}/${topRepos.length} repos include visual demos or structured metadata`);
  }

  // 5. Activity and Consistency (15 pts)
  let activityScore = 0;
  const activityBreakdown: string[] = [];

  if (metrics.daysSinceLastPush <= 7) {
    activityScore += 5;
    activityBreakdown.push('Pushed code within the last 7 days (+5)');
  } else if (metrics.daysSinceLastPush <= 21) {
    activityScore += 4;
    activityBreakdown.push('Pushed code within the last 3 weeks (+4)');
  } else if (metrics.daysSinceLastPush <= 60) {
    activityScore += 3;
    activityBreakdown.push('Pushed code within the last 2 months (+3)');
  } else if (metrics.daysSinceLastPush <= 120 || metrics.totalStars >= 10) {
    activityScore += 2;
    activityBreakdown.push('Pushed code within the last 4 months (+2)');
  } else {
    activityBreakdown.push(`Last push was ${metrics.daysSinceLastPush} days ago (0/5)`);
  }

  if (metrics.activeWeeksLast6Months >= 6 || (metrics.daysSinceLastPush <= 14 && metrics.originalRepoCount >= 2)) {
    activityScore += 10;
    activityBreakdown.push('High sustained coding rhythm (+10)');
  } else if (metrics.activeWeeksLast6Months >= 3 || metrics.daysSinceLastPush <= 30) {
    activityScore += 8;
    activityBreakdown.push('Consistent activity: active within the month (+8)');
  } else if (metrics.activeWeeksLast6Months >= 1 || metrics.daysSinceLastPush <= 90) {
    activityScore += 5;
    activityBreakdown.push('Moderate activity footprint (+5)');
  } else {
    activityScore += 2;
    activityBreakdown.push('Low public activity in the past 6 months (+2/10)');
  }
  activityScore = Math.min(15, activityScore);

  // 6. Finish Rate & Focus (10 pts)
  let finishScore = 0;
  const finishBreakdown: string[] = [];

  if (metrics.finishRate >= 0.5 || metrics.totalStars >= 30) {
    finishScore += 5;
    finishBreakdown.push('High completion rate: mature project focus (+5)');
  } else if (metrics.finishRate >= 0.25) {
    finishScore += 3;
    finishBreakdown.push('Average finish rate (+3)');
  } else {
    finishBreakdown.push('Low completion rate (0/5)');
  }

  const flagshipCandidates = topRepos.filter((r) => !r.isFork && (r.healthScore >= 55 || r.stars >= 5)).length;
  if (flagshipCandidates >= 2) {
    finishScore += 5;
    finishBreakdown.push(`Has ${flagshipCandidates} standout flagship projects (+5)`);
  } else if (flagshipCandidates === 1) {
    finishScore += 3;
    finishBreakdown.push('Has 1 solid flagship project (+3)');
  } else {
    finishBreakdown.push('Lacks a standout flagship project (0/5)');
  }

  if ((metrics.tutorialHellCount >= 3 || metrics.suspiciousGenericReposCount >= 3) && metrics.totalStars < 10) {
    finishScore = Math.max(0, finishScore - 2);
    finishBreakdown.push('Penalty: cluttered with unfinished tutorial clones (-2)');
  }
  finishScore = Math.min(10, finishScore);

  // 7. Community Signals (5 pts)
  let communityScore = 0;
  const communityBreakdown: string[] = [];

  if (metrics.totalStars >= 100) {
    communityScore += 4;
    communityBreakdown.push(`${metrics.totalStars} total stars across repos (+4)`);
  } else if (metrics.totalStars >= 20) {
    communityScore += 3;
    communityBreakdown.push(`${metrics.totalStars} total stars (+3)`);
  } else if (metrics.totalStars >= 5) {
    communityScore += 2;
    communityBreakdown.push(`${metrics.totalStars} stars (+2)`);
  } else if (metrics.totalStars >= 1) {
    communityScore += 1;
    communityBreakdown.push(`${metrics.totalStars} star (+1)`);
  } else {
    communityBreakdown.push('0 stars across repositories (0/4)');
  }

  if (metrics.totalForks >= 2 || metrics.accountAgeYears >= 2) {
    communityScore += 1;
    communityBreakdown.push('Community fork reach and longevity (+1)');
  }
  communityScore = Math.min(5, communityScore);

  // Total
  const totalScore = Math.min(
    100,
    Math.max(
      0,
      basicsScore +
        profileReadmeScore +
        projectQualityScore +
        readmeQualityScore +
        activityScore +
        finishScore +
        communityScore
    )
  );

  let grade: ProfileGrade = 'Blank Canvas';
  if (totalScore >= 90) grade = 'Hire-ready';
  else if (totalScore >= 75) grade = 'Solid';
  else if (totalScore >= 55) grade = 'Needs Work';
  else if (totalScore >= 35) grade = 'Roast-worthy';
  else grade = 'Blank Canvas';

  const categoryScores: CategoryScores = {
    profileBasics: {
      score: basicsScore,
      max: 15,
      label: 'Profile Basics',
      breakdown: basicsBreakdown,
    },
    profileReadme: {
      score: profileReadmeScore,
      max: 10,
      label: 'Profile README',
      breakdown: profileReadmeBreakdown,
    },
    projectQuality: {
      score: projectQualityScore,
      max: 25,
      label: 'Project Quality',
      breakdown: projectQualityBreakdown,
    },
    readmeQuality: {
      score: readmeQualityScore,
      max: 20,
      label: 'README Documentation',
      breakdown: readmeQualityBreakdown,
    },
    activityConsistency: {
      score: activityScore,
      max: 15,
      label: 'Activity & Consistency',
      breakdown: activityBreakdown,
    },
    finishRateFocus: {
      score: finishScore,
      max: 10,
      label: 'Finish Rate & Focus',
      breakdown: finishBreakdown,
    },
    communitySignals: {
      score: communityScore,
      max: 5,
      label: 'Community Signals',
      breakdown: communityBreakdown,
    },
  };

  return {
    totalScore,
    grade,
    categoryScores,
  };
}
