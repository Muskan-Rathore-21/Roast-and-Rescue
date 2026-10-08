import { FactsBundle, NarrativeResult, RoastIntensity } from '../../types/analysis.ts';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateFallbackNarrative(facts: FactsBundle, intensity: RoastIntensity): NarrativeResult {
  const { metrics, totalScore, topRepos, isBlankSlate, username } = facts;
  const hash = hashString(username);
  const topLang = metrics.topLanguages[0]?.language || 'TypeScript';
  const topRepo = topRepos[0]?.name || 'main-project';
  const secondRepo = topRepos[1]?.name || 'portfolio-repo';

  if (isBlankSlate || metrics.publicRepoCount === 0) {
    return {
      headlineRoast: `A blank canvas so fresh, even Git doesn't know @${username} is here yet.`,
      recruiterVerdict: {
        impression: 'Maybe',
        summary:
          'There are no public repositories to evaluate yet. A recruiter cannot gauge coding style, but the slate is completely clean to build a high-impact showcase from scratch.',
      },
      greenFlags: ['Clean slate: no legacy bad habits or leaked secrets committed!', 'Ready to build with modern standards'],
      redFlags: ['Zero public repositories available for technical review'],
      roastParagraphs: [
        `@${username}'s GitHub profile is currently the coding equivalent of an empty apartment with one folding chair. It's clean, minimalist, and completely devoid of any evidence that you write software.`,
        "Don't worry though — every senior engineer started with 0 commits. The advantage here is that you don't have to clean up 14 broken tutorial clones from 2023.",
      ],
      repoRoasts: [],
      rescuePlan: facts.rescueSkeleton,
      usedFallback: true,
    };
  }

  const headlinesHighSpicy = [
    `Your code in ${topRepo} is terrifyingly competent, but your social life looks entirely compiled into Git logs.`,
    `Hoarding ${metrics.totalStars} stars across ${metrics.publicRepoCount} repos while ignoring open issues is peak senior engineer behavior.`,
    `A certified 10x developer whose READMEs look like they were typed under hostage duress at 3 AM.`,
    `Clearly knows their ${topLang}, but please go outside and touch some freshly deployed grass.`,
    `You have more stars on GitHub (${metrics.totalStars}) than hours slept this month. Take a vacation.`,
  ];

  const headlinesMedSpicy = [
    `Half-finished ideas in ${topRepo} and commit messages that read like a slow descent into existential dread.`,
    `${metrics.publicRepoCount} repositories, yet looking through them feels like browsing an estate sale for abandoned weekend projects.`,
    `Writing ${topLang} with the passion of an artist and documenting it with the enthusiasm of a tax auditor.`,
    `Your Git commit history is ${metrics.overallGenericCommitRate}% generic — future historians will think your vocabulary is just "update" and "fix".`,
    `Spends 40 hours building ${topRepo} and approximately 4 seconds explaining what it does.`,
  ];

  const headlinesLowSpicy = [
    `A digital graveyard of tutorial clones where ${topRepo} went to be forgotten.`,
    `${metrics.publicRepoCount} repos with names that look like password generator suggestions and zero live links.`,
    `The coding equivalent of leaving all the tools on the floor and none of the finished furniture in the window.`,
    `Your GitHub is playing hard-to-get with recruiters, and unfortunately, it's winning.`,
    `The Git log reads like a Morse code SOS message: "wip", "fix", "asdf", "final_final2".`,
  ];

  const headlinesHighMedium = [
    `Impressive foundations in ${topLang} and real engineering depth in ${topRepo}, held back only by documentation modesty.`,
    `Solid open-source footprint with ${metrics.totalStars} stars — just a couple of polished live demos away from looking senior.`,
    `Strong technical execution across ${metrics.publicRepoCount} repositories that recruiters will genuinely appreciate.`,
    `Proven builder who clearly loves shipping ${topLang}, ready to package their best work into an interview magnet.`,
  ];

  const headlinesMedMedium = [
    `A respectable collection of ${metrics.publicRepoCount} projects begging for live demo links and fewer "fixed stuff" commits.`,
    `Real engineering substance in ${topRepo}, but missing the front-door packaging recruiters need to see in 15 seconds.`,
    `Good grasp of ${topLang}, but your showcase needs curation to separate your best work from toy experiments.`,
    `Solid developer foundation — turning ${topRepo} into a documented flagship will immediately set this profile apart.`,
  ];

  const headlinesLowMedium = [
    `Looks more like a scrapbook of university homework assignments than an active engineer's showcase.`,
    `Early-stage developer profile with good intentions; needs a flagship showcase and fewer abandoned tests.`,
    `A collection of learning repositories in ${topLang} that are ready for graduation into polished portfolio projects.`,
    `Has the spark of a builder; now needs to package ${topRepo} so recruiters immediately understand its value.`,
  ];

  const headlinesGentle = [
    `Promising developer profile with ${metrics.publicRepoCount} repos — just a few README polishes away from standing out.`,
    `Great foundational effort with ${topLang}; curating ${topRepo} as your flagship will make your profile shine.`,
    `Solid start on your software engineering journey with ${metrics.accountAgeYears} years of building!`,
    `Genuine passion for coding shows in your work — a little documentation and packaging will take you far.`,
  ];

  let headline = '';
  let impression: 'Would keep reading' | 'Maybe' | 'Would close tab' = 'Maybe';
  const uniqueSeed = hash + metrics.publicRepoCount * 7 + totalScore * 13 + metrics.totalStars * 3;

  if (intensity === 'spicy') {
    if (totalScore >= 80) {
      headline = headlinesHighSpicy[uniqueSeed % headlinesHighSpicy.length];
      impression = 'Would keep reading';
    } else if (totalScore >= 55) {
      headline = headlinesMedSpicy[uniqueSeed % headlinesMedSpicy.length];
      impression = 'Maybe';
    } else {
      headline = headlinesLowSpicy[uniqueSeed % headlinesLowSpicy.length];
      impression = 'Would close tab';
    }
  } else if (intensity === 'gentle') {
    headline = headlinesGentle[uniqueSeed % headlinesGentle.length];
    impression = totalScore >= 75 ? 'Would keep reading' : 'Maybe';
  } else {
    if (totalScore >= 80) {
      headline = headlinesHighMedium[uniqueSeed % headlinesHighMedium.length];
      impression = 'Would keep reading';
    } else if (totalScore >= 55) {
      headline = headlinesMedMedium[uniqueSeed % headlinesMedMedium.length];
      impression = 'Maybe';
    } else {
      headline = headlinesLowMedium[uniqueSeed % headlinesLowMedium.length];
      impression = totalScore >= 45 ? 'Maybe' : 'Would close tab';
    }
  }

  let recruiterSummary = '';
  if (totalScore >= 80) {
    recruiterSummary = `Skimmed @${username}'s profile in 20 seconds. The avatar, active repositories (${topRepo}, ${secondRepo}), and strong ${topLang} background immediately establish credibility. Would definitely forward to the engineering hiring manager for an interview.`;
  } else if (totalScore >= 55) {
    recruiterSummary = `Shows real coding ability with ${metrics.publicRepoCount} repos over ${metrics.accountAgeYears} years. However, without obvious live demo links, a recruiter has to guess if projects like ${topRepo} actually work. Adding 1-click demos will double callback rates.`;
  } else {
    recruiterSummary = `Immediate 15-second scan: mostly uncurated repos or brief experiments without a personal Profile README. Without a clear flagship project, it blends into generic applicant stacks. Following the rescue plan will fix this quickly.`;
  }

  const paragraphs: string[] = [];
  if (intensity === 'spicy') {
    if (totalScore >= 80) {
      paragraphs.push(
        `@${username} has been on GitHub for ${metrics.accountAgeYears} years and built a formidable fortress of ${metrics.publicRepoCount} repositories with ${metrics.totalStars} stars. Your code architecture is undeniably sharp, but looking at your commit history makes us wonder if you've seen daylight this quarter.`
      );
      paragraphs.push(
        `Projects like ${topRepo} showcase serious technical depth, but your documentation reads like it expects everyone else to possess telepathic debugging abilities. Add a quick diagram or GIF so mere mortals can appreciate what you built.`
      );
    } else {
      paragraphs.push(
        `You've been on GitHub for ${metrics.accountAgeYears} years and accumulated ${metrics.publicRepoCount} repositories, yet looking through them feels like browsing an estate sale for unfinished ideas. Projects like ${topRepo} have potential, but they're wrapped in silence.`
      );
      if (metrics.overallGenericCommitRate >= 40) {
        paragraphs.push(
          `Your Git commit history is ${metrics.overallGenericCommitRate}% generic. Future anthropologists studying your commits will conclude that human communication peaked with "update", "fix", and "asdf".`
        );
      }
    }
    paragraphs.push(
      `The good news? You actually write code in ${topLang}, and fixing these presentation bottlenecks is 10x easier than learning data structures from scratch. Complete the rescue checklist below and watch your profile transform.`
    );
  } else if (intensity === 'gentle') {
    paragraphs.push(
      `@${username} has built a genuine track record with ${metrics.publicRepoCount} repositories across ${metrics.topLanguages.slice(0, 3).map((l) => l.language).join(', ')} over ${metrics.accountAgeYears} years on GitHub.`
    );
    paragraphs.push(
      `Your strongest project, ${topRepo}, shows real initiative. The primary opportunity now is communication: adding clear 1-line problem statements, quickstart setup commands, and deployed live links so reviewers can immediately see your creations in action.`
    );
    paragraphs.push(
      `By spending just 30 to 60 minutes following the prioritized rescue plan below, you'll elevate this profile into a top-tier candidate showcase.`
    );
  } else {
    if (totalScore >= 80) {
      paragraphs.push(
        `With ${metrics.publicRepoCount} repositories and ${metrics.totalStars} stars, @${username} is an established builder. You clearly take pride in shipping real software in ${topLang}, and repositories like ${topRepo} show substantial engineering effort.`
      );
      paragraphs.push(
        `The only thing holding this profile back from looking like a senior staff engineer is packaging: pinning your top 3 curated masterpieces and ensuring every flagship project has a crisp demo link and installation snippet.`
      );
    } else {
      paragraphs.push(
        `With ${metrics.publicRepoCount} repositories over ${metrics.accountAgeYears} years, you clearly love building. However, right now your GitHub looks like a workshop where all the tools are on the floor and none of the finished work is in the display window.`
      );
      if (!metrics.hasProfileReadme) {
        paragraphs.push(
          `You're missing a profile README (${username}/${username}). That's like handing a recruiter a business card with a blank backside. Introduce your tech stack and guide visitors to ${topRepo}!`
        );
      }
    }
    paragraphs.push(
      `The engineering foundation is already here. With the step-by-step rescue plan below, you can upgrade this profile from "promising dev" to "interview-ready hire" in just an afternoon.`
    );
  }

  const repoRoasts = topRepos.slice(0, 6).map((repo) => {
    let roast = '';
    let fix = '';
    if (repo.committedSecretsOrEnv) {
      roast = `This repo has exposed environment files or credentials checked in. Hackers love it; recruiters will run away screaming.`;
      fix = `Add .env to .gitignore, run \`git rm --cached .env\`, and rotate any leaked keys immediately.`;
    } else if (repo.committedNodeModulesOrVenv) {
      roast = `Checked in dependencies like node_modules or venv. Git is for code, not your entire hard drive.`;
      fix = `Add node_modules/ or venv/ to .gitignore and remove the cached folders from Git.`;
    } else if (repo.stars >= 50) {
      roast = `With ${repo.stars} stars, people actually use this! Now keep those open issues from piling up like laundry.`;
      fix = `Add contribution guidelines (CONTRIBUTING.md) and a clear release changelog.`;
    } else if (!repo.hasReadme || repo.readmeLength < 50) {
      roast = `A repository with no README is like a book with a blank cover. Nobody knows what it does or how to run it.`;
      fix = `Write a README with a 1-sentence purpose, tech stack badges, and quickstart commands.`;
    } else if (!repo.homepage && repo.healthScore < 60) {
      roast = `Good concept, but without a live demo link or screenshot, recruiters will spend 3 seconds and skip it.`;
      fix = `Deploy on Vercel/Render and paste the link into the repository "Website" setting.`;
    } else {
      roast = `A well-structured ${repo.language || 'code'} repository with strong fundamentals.`;
      fix = `Add a 5-second demo GIF or screenshot to make the README visually irresistible.`;
    }
    return {
      repo: repo.name,
      roast,
      fix,
    };
  });

  const greenFlags = facts.flags.filter((f) => f.type === 'green').map((f) => `${f.title}: ${f.description}`);
  if (greenFlags.length === 0) {
    greenFlags.push(`Public code available in ${topLang}`);
  }

  const redFlags = facts.flags.filter((f) => f.type === 'red').map((f) => `${f.title}: ${f.description}`);
  if (redFlags.length === 0) {
    redFlags.push('No obvious critical red flags detected!');
  }

  return {
    headlineRoast: headline,
    recruiterVerdict: {
      impression,
      summary: recruiterSummary,
    },
    greenFlags,
    redFlags,
    roastParagraphs: paragraphs,
    repoRoasts,
    rescuePlan: facts.rescueSkeleton,
    usedFallback: true,
  };
}
