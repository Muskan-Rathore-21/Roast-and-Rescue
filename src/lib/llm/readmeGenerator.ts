import { FactsBundle } from '../../types/analysis.ts';

export function generateProfileReadmeMarkdown(facts: FactsBundle): string {
  const username = facts.username;
  const topLangs = facts.metrics.topLanguages.map((l) => l.language).join(', ');
  const featuredRepos = facts.topRepos.slice(0, 3);

  return `# Hi, I'm ${username} 👋
**Full-Stack Developer & Problem Solver**

Passionate about building performant applications and solving real-world challenges.

### 🛠️ Tech Stack & Tools
- **Languages:** ${topLangs || 'TypeScript, JavaScript, Python'}
- **Frameworks & Libraries:** React, Node.js, Express, Tailwind CSS
- **Tools & Platforms:** Git, GitHub Actions, Docker, Cloud Platforms

### 🚀 Featured Projects
${featuredRepos
  .map(
    (repo) => `#### [${repo.name}](https://github.com/${facts.username}/${repo.name})
${repo.description || 'A modern, performant web application.'}
- **Tech:** ${repo.language || 'TypeScript'}
${repo.homepage ? `- **Live Demo:** [${repo.homepage}](${repo.homepage})` : ''}`
  )
  .join('\n\n')}

### 📊 GitHub Highlights
- **Audited Profile Score:** ${facts.totalScore}/100 (${facts.grade})
- **Original Repositories:** ${facts.metrics.originalRepoCount}
- **Stars Earned:** ${facts.metrics.totalStars} ⭐

### 📫 Connect With Me
- [Portfolio / Web](https://github.com/${username})
- [LinkedIn Profile](https://linkedin.com)
- Reach me via GitHub Issues or Discussions

---
*Crafted with [Roast & Rescue](https://github.com)*`;
}

export function generateRepoReadmeMarkdown(facts: FactsBundle, repoName: string): string {
  const repo = facts.topRepos.find((r) => r.name === repoName) || facts.topRepos[0];
  const lang = repo?.language || 'TypeScript / JavaScript';
  const desc = repo?.description || `${repoName} - A modern, performant application.`;

  return `# ${repoName}

> ${desc}

${repo?.homepage ? `[![Live Demo](https://img.shields.io/badge/Demo-Live_Preview-brightgreen)](${repo.homepage})` : ''}
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/${facts.username}/${repoName})](https://github.com/${facts.username}/${repoName}/stargazers)

## 📸 Preview
*(Add a screenshot or animated GIF preview here)*

## ✨ Key Features
- **Modern Architecture:** Built with clean, maintainable ${lang} standards.
- **Fast & Responsive:** Designed for optimal performance across all devices.
- **Extensible:** Modular design for straightforward integrations.

## 🛠️ Tech Stack
- **Primary Language:** ${lang}
- **Runtime / Framework:** Modern Node.js / Browser standards
- **Hosting / Deployment:** ${repo?.homepage ? repo.homepage : 'Vercel / Cloud Run'}

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.x) or equivalent runtime
- Git

### Installation
\`\`\`bash
# 1. Clone repository
git clone https://github.com/${facts.username}/${repoName}.git

# 2. Enter project folder
cd ${repoName}

# 3. Install dependencies
npm install

# 4. Start local development
npm run dev
\`\`\`

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
Distributed under the MIT License. See \`LICENSE\` for more information.`;
}
