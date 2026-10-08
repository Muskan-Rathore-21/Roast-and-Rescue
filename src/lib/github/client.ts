import { GitHubUserRaw } from '../../types/analysis.ts';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 15 * 60 * 1000;

export function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs = CACHE_TTL_MS): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

function getAuthHeaders(customToken?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  const token = customToken?.trim();
  if (token && token.length > 0) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export interface RawRepoItem {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  fork: boolean;
  archived: boolean;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  created_at: string;
  size: number;
  homepage: string | null;
  topics?: string[];
  license?: { spdx_id?: string; name?: string } | null;
  has_issues: boolean;
  default_branch: string;
}

export interface RepoDetailsRaw {
  readmeContent: string | null;
  languages: Record<string, number>;
  treeFiles: string[];
  recentCommits: { message: string; date: string }[];
}

export class GitHubApiError extends Error {
  status: number;
  resetTime?: string;
  isRateLimit: boolean;
  constructor(message: string, status: number, resetTime?: string, isRateLimit = false) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
    this.resetTime = resetTime;
    this.isRateLimit = isRateLimit;
  }
}

async function githubFetch<T>(endpoint: string, customToken?: string): Promise<T> {
  const url = endpoint.startsWith('https://') ? endpoint : `https://api.github.com${endpoint}`;
  const response = await fetch(url, {
    headers: getAuthHeaders(customToken),
  });

  const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
  const rateLimitReset = response.headers.get('x-ratelimit-reset');

  if (response.status === 404) {
    throw new GitHubApiError(`GitHub resource not found at ${endpoint}`, 404);
  }

  if (response.status === 403 || response.status === 429) {
    let resetStr = '';
    if (rateLimitReset) {
      const resetDate = new Date(parseInt(rateLimitReset, 10) * 1000);
      resetStr = resetDate.toLocaleTimeString();
    }
    const isRateLimit = rateLimitRemaining === '0' || response.status === 429;
    throw new GitHubApiError(
      isRateLimit
        ? `GitHub API rate limit reached. Resets around ${resetStr || 'soon'}. You can supply a free GitHub Personal Access Token (PAT) to get 5,000 requests/hr, or explore our demo profiles!`
        : `GitHub API request blocked or forbidden (HTTP ${response.status}).`,
      response.status,
      resetStr,
      isRateLimit
    );
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new GitHubApiError(`GitHub API error HTTP ${response.status}: ${errorText}`, response.status);
  }

  return response.json() as Promise<T>;
}

export async function fetchUserProfile(username: string, token?: string): Promise<GitHubUserRaw> {
  const cacheKey = `user:${username.toLowerCase()}`;
  const cached = getCached<GitHubUserRaw>(cacheKey);
  if (cached) return cached;

  const data = await githubFetch<GitHubUserRaw>(`/users/${encodeURIComponent(username)}`, token);
  setCached(cacheKey, data);
  return data;
}

export async function fetchUserRepos(username: string, token?: string): Promise<RawRepoItem[]> {
  const cacheKey = `repos:${username.toLowerCase()}`;
  const cached = getCached<RawRepoItem[]>(cacheKey);
  if (cached) return cached;

  const data = await githubFetch<RawRepoItem[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
    token
  );
  setCached(cacheKey, data);
  return data;
}

export async function fetchProfileReadme(
  username: string,
  token?: string
): Promise<{ exists: boolean; length: number; content: string }> {
  const cacheKey = `profile_readme:${username.toLowerCase()}`;
  const cached = getCached<{ exists: boolean; length: number; content: string }>(cacheKey);
  if (cached) return cached;

  try {
    const res = await githubFetch<{ content: string; encoding: string }>(
      `/repos/${encodeURIComponent(username)}/${encodeURIComponent(username)}/readme`,
      token
    );
    if (res && res.content) {
      const decoded = atob(res.content.replace(/\n/g, ''));
      const result = { exists: true, length: decoded.length, content: decoded };
      setCached(cacheKey, result);
      return result;
    }
  } catch (err: unknown) {
    if (err instanceof GitHubApiError && err.status === 404) {
      const result = { exists: false, length: 0, content: '' };
      setCached(cacheKey, result);
      return result;
    }
  }
  const defaultResult = { exists: false, length: 0, content: '' };
  setCached(cacheKey, defaultResult);
  return defaultResult;
}

export async function fetchRepoDetails(
  owner: string,
  repo: string,
  _defaultBranch = 'main',
  token?: string
): Promise<RepoDetailsRaw> {
  const cacheKey = `repo_details:${owner.toLowerCase()}/${repo.toLowerCase()}`;
  const cached = getCached<RepoDetailsRaw>(cacheKey);
  if (cached) return cached;

  let readmeContent: string | null = null;
  try {
    const res = await githubFetch<{ content: string }>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
      token
    );
    if (res?.content) {
      readmeContent = atob(res.content.replace(/\n/g, ''));
    }
  } catch {
    readmeContent = null;
  }

  const result: RepoDetailsRaw = {
    readmeContent,
    languages: {},
    treeFiles: [],
    recentCommits: [],
  };
  setCached(cacheKey, result);
  return result;
}

export async function fetchUserPublicEvents(
  username: string,
  token?: string
): Promise<Array<{ type: string; created_at: string }>> {
  const cacheKey = `events:${username.toLowerCase()}`;
  const cached = getCached<Array<{ type: string; created_at: string }>>(cacheKey);
  if (cached) return cached;

  try {
    const data = await githubFetch<Array<{ type: string; created_at: string }>>(
      `/users/${encodeURIComponent(username)}/events/public?per_page=30`,
      token
    );
    setCached(cacheKey, data);
    return data;
  } catch {
    return [];
  }
}
