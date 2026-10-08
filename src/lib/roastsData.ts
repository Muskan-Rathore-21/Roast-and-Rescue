export const FUNNY_ROASTS_LIST: string[] = [
  "Your GitHub has more empty repos than a student's motivation after lunch.",
  "404: Commit history not found. Did you actually code this?",
  "Your README is so empty even Google Maps can't find the documentation.",
  "Bro has 47 repositories and somehow all of them are 'coming soon'.",
  "Your commit history has trust issues.",
  "GitHub contribution graph looking like it needs CPR.",
  "Congratulations! Your README has successfully achieved minimalism.",
  "Your code isn't bad. It's just aggressively creative.",
  "Recruiter: 'Tell me about your projects.' You: 'Well... there's this one repo I started in 2023.'",
  "Your repository structure looks like it was designed during a power outage.",
  "Those variable names have seen things.",
  "Your GitHub is giving 'I swear I'll finish this project tomorrow'.",
  "Commit message: 'final_final_REAL_final_v2'. We need to talk.",
  "Your README needs more than a title and three emojis.",
  "Plot twist: the bug was the developer all along.",
  "Your contribution graph is taking a well-deserved vacation.",
  "Your GitHub has enough unfinished projects to qualify as a startup incubator.",
  "git commit -m 'fixed stuff' - narrative storytelling at its peak.",
  "Your node_modules folder is generating its own gravitational pull.",
  "One does not simply clone your repo and run it without 4 unlisted peer dependency warnings.",
];

export interface StickerItem {
  id: string;
  emoji: string;
  label: string;
  accent?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'rose' | 'slate';
}

export const CURATED_STICKERS: StickerItem[] = [
  { id: 'spicy', emoji: '🔥', label: 'Certified Spicy', accent: 'amber' },
  { id: 'code-review', emoji: '🚨', label: 'Code Review Required', accent: 'rose' },
  { id: 'recruiter', emoji: '👀', label: 'Recruiter Is Watching', accent: 'cyan' },
  { id: 'skill-issue', emoji: '💀', label: 'Skill Issue Detected', accent: 'rose' },
  { id: 'works-on-machine', emoji: '💻', label: 'Works On My Machine', accent: 'emerald' },
  { id: 'rip-readme', emoji: '🪦', label: 'RIP README', accent: 'slate' },
  { id: 'coffee', emoji: '☕', label: 'Needs More Coffee', accent: 'amber' },
  { id: 'production', emoji: '⚠️', label: 'Production?!', accent: 'amber' },
  { id: 'ship-it', emoji: '🚀', label: 'Ship It', accent: 'purple' },
  { id: 'fix-this', emoji: '🛠️', label: 'Respectfully... Fix This', accent: 'purple' },
  { id: 'it-works', emoji: '✨', label: 'It Works Somehow', accent: 'cyan' },
  { id: 'bug-magnet', emoji: '🐛', label: 'Bug Magnet', accent: 'rose' },
];
