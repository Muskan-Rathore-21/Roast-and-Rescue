# 🔥 Roast & Rescue

> **Developer GitHub Portfolio Auditor & Career Rescue Engine**  
> *Objective 100-point deterministic rubric, constructive developer roasts, recruiter 30-second verdict, and persistent cloud database storage via Supabase & Firestore.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20%2B%20Firestore-3ecf8e?logo=supabase)](https://supabase.com/)

---

## 📖 Overview

**Roast & Rescue** is an open-source web application designed to turn developer GitHub profiles into hiring magnets. Instead of arbitrary scores, it runs a **100% deterministic 100-point audit** directly evaluating commit frequency, original vs. forked code, documentation depth, live demo links, and repository security hygiene (flagging exposed `.env` files or bloated `node_modules`).

Pairing rigorous analytics with witty constructive roasts, the app simulates how technical recruiters evaluate candidate portfolios during their initial 30-second skim, generating an actionable, step-by-step remediation roadmap and ready-to-merge README markdown templates.

---

## ✨ Key Features

- **📊 Deterministic 100-Point Rubric**:
  - **Profile Basics (15 pts)**: Custom avatar, full name, descriptive bio, portfolio links, and location.
  - **Profile README (10 pts)**: Presence and substance of special `username/username` repository.
  - **Project Quality (25 pts)**: Repo descriptions, tags, topics, open-source licenses, and live demo links.
  - **README Documentation (20 pts)**: Installation quickstarts, code snippets, visual media, and feature breakdowns.
  - **Activity & Consistency (15 pts)**: Push frequency, active weeks over the last 6 months, and recency of last push.
  - **Finish Rate & Focus (10 pts)**: Ratio of completed repositories vs. abandoned toy tutorial clones.
  - **Community Signals (5 pts)**: Organic stars, forks, and open-source contribution tenure.

- **🔥 Constructive Roasts & Recruiter Glance**:
  - Three intensity modes: `Gentle 🌱`, `Medium ⚡`, and `Spicy 🔥`.
  - Realistic recruiter impression verdict (`Would keep reading`, `Maybe`, `Would close tab`).
  - Clear breakdown of candidate **Green Flags** and prioritized **Red Flags**.

- **🛠️ Actionable Rescue Plan & 1-Click READMEs**:
  - Impact-ranked checklist (High, Medium, Low) to turn red flags into green flags.
  - 1-click tailored `README.md` generator for profile pages and individual repositories.
  - Interactive AI Career Coach for portfolio, resume, and interview guidance.

- **⚔️ 1v1 Developer Roast Battles**:
  - Put any two GitHub usernames head-to-head in an arena duel with automated category showdowns and referee verdicts.

- **💾 Cloud Database Storage (Supabase & Firestore)**:
  - Persistent storage for audits, candidate evaluation notes, custom tags, and battle results.
  - Connected to Supabase (`https://edmtuwlsyehfbhtzreax.supabase.co`).
  - Full data export support (JSON & CSV) and 1-click Supabase SQL migration schema.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti.
- **Database & Storage**:
  - **Supabase**: Relational Postgres persistence (`audit_scans`, `battle_records`, `user_profiles`, `rescue_progress`).
  - **Google Cloud Firestore**: Real-time cloud document sync and backup.
- **Telemetry**: GitHub REST API v3 with automatic rate-limit detection and optional Personal Access Token (5,000 req/hr) support.

---

## 🚀 Quickstart

### Prerequisites
- Node.js (>= 18.x)
- npm or bun

### Installation
\`\`\`bash
# 1. Clone the repository
git clone https://github.com/your-username/roast-and-rescue.git

# 2. Navigate to project root
cd roast-and-rescue

# 3. Install dependencies
npm install

# 4. Configure environment variables
cp .env.example .env

# 5. Start development server
npm run dev
\`\`\`

The app will be running at `http://localhost:3000`.

---

## 🗄️ Supabase Database Schema

To set up your tables in Supabase, run the SQL schema in your [Supabase SQL Editor](https://supabase.com/dashboard/project/edmtuwlsyehfbhtzreax/sql/new):

\`\`\`sql
CREATE TABLE IF NOT EXISTS public.audit_scans (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  avatar_url TEXT,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  grade TEXT NOT NULL,
  headline_roast TEXT,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT DEFAULT 'anonymous',
  is_public BOOLEAN DEFAULT TRUE,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access on audit_scans" ON public.audit_scans FOR ALL USING (true);
\`\`\`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
