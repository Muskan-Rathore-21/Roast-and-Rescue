import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://edmtuwlsyehfbhtzreax.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  // Default public anon placeholder if not yet populated in secrets
  '';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;

  const url = SUPABASE_PROJECT_URL;
  const key = SUPABASE_ANON_KEY;

  if (url && key && key !== 'MY_SUPABASE_ANON_KEY') {
    try {
      client = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return client;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return null;
}

export const supabase = getSupabaseClient();

export const SUPABASE_SQL_SCHEMA = `-- Supabase Schema for Roast & Rescue Data Storage
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/edmtuwlsyehfbhtzreax/sql/new

-- 1. Table: audit_scans
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

-- Enable Row Level Security (RLS)
ALTER TABLE public.audit_scans ENABLE ROW LEVEL SECURITY;

-- Allow public read of audit scans
CREATE POLICY "Allow public read on audit_scans" 
  ON public.audit_scans FOR SELECT 
  USING (true);

-- Allow public insert of audit scans
CREATE POLICY "Allow public insert on audit_scans" 
  ON public.audit_scans FOR INSERT 
  WITH CHECK (true);

-- Allow updates
CREATE POLICY "Allow update on audit_scans" 
  ON public.audit_scans FOR UPDATE 
  USING (true);

-- Allow delete
CREATE POLICY "Allow delete on audit_scans" 
  ON public.audit_scans FOR DELETE 
  USING (true);

-- 2. Table: battle_records
CREATE TABLE IF NOT EXISTS public.battle_records (
  id TEXT PRIMARY KEY,
  user_a TEXT NOT NULL,
  user_b TEXT NOT NULL,
  score_a INTEGER NOT NULL,
  score_b INTEGER NOT NULL,
  winner TEXT NOT NULL,
  verdict TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.battle_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on battle_records" 
  ON public.battle_records FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert on battle_records" 
  ON public.battle_records FOR INSERT 
  WITH CHECK (true);

-- 3. Table: user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  uid TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'github',
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access on user_profiles" 
  ON public.user_profiles FOR ALL 
  USING (true);

-- 4. Table: rescue_progress
CREATE TABLE IF NOT EXISTS public.rescue_progress (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  user_id TEXT DEFAULT 'anonymous',
  completed_item_ids TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rescue_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access on rescue_progress" 
  ON public.rescue_progress FOR ALL 
  USING (true);
`;
