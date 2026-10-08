import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Search,
  Trash2,
  Download,
  Plus,
  Tag,
  CheckCircle2,
  ExternalLink,
  Edit3,
  Copy,
  Check,
  Code2,
} from 'lucide-react';
import { StoredScan } from '../types/analysis.ts';
import { SUPABASE_PROJECT_URL, SUPABASE_SQL_SCHEMA } from '../lib/supabase.ts';

interface DatabaseVaultModalProps {
  scans: StoredScan[];
  onClose: () => void;
  onSelectScan: (username: string) => void;
  onDeleteScan: (id: string) => void;
  onClearAll: () => void;
  onUpdateNotesAndTags: (id: string, notes: string, tags: string[]) => void;
  onAddManualScan: (scan: StoredScan) => void;
  isDark?: boolean;
}

export const DatabaseVaultModal: React.FC<DatabaseVaultModalProps> = ({
  scans,
  onClose,
  onSelectScan,
  onDeleteScan,
  onClearAll,
  onUpdateNotesAndTags,
  onAddManualScan,
  isDark = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTagsInput, setEditTagsInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // New item form state
  const [newUsername, setNewUsername] = useState('');
  const [newScore, setNewScore] = useState(75);
  const [newNotes, setNewNotes] = useState('');
  const [newTags, setNewTags] = useState('portfolio, candidate');

  // Close on Escape key for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const allTags = Array.from(new Set(scans.flatMap((s) => s.tags || [])));

  const filteredScans = scans.filter((s) => {
    const matchesSearch =
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.headlineRoast && s.headlineRoast.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === 'all' || (s.tags && s.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const handleStartEdit = (scan: StoredScan) => {
    setEditingId(scan.id);
    setEditNotes(scan.notes || '');
    setEditTagsInput((scan.tags || []).join(', '));
  };

  const handleSaveEdit = (id: string) => {
    const parsedTags = editTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onUpdateNotesAndTags(id, editNotes, parsedTags);
    setEditingId(null);
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    let grade: StoredScan['grade'] = 'Needs Work';
    if (newScore >= 90) grade = 'Hire-ready';
    else if (newScore >= 75) grade = 'Solid';
    else if (newScore >= 55) grade = 'Needs Work';
    else if (newScore >= 35) grade = 'Roast-worthy';
    else grade = 'Blank Canvas';

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const record: StoredScan = {
      id: `scan-${newUsername.trim().toLowerCase()}-${Date.now()}`,
      username: newUsername.trim().replace(/^@/, ''),
      avatarUrl: `https://github.com/${newUsername.trim().replace(/^@/, '')}.png`,
      score: Number(newScore) || 50,
      grade,
      scannedAt: new Date().toISOString(),
      headlineRoast: `Custom portfolio database entry for @${newUsername.trim()}`,
      notes: newNotes,
      tags: tagsArray,
      syncedToCloud: true,
    };

    onAddManualScan(record);
    setNewUsername('');
    setNewNotes('');
    setShowAddForm(false);
  };

  const copySqlSchema = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } catch {
      // Ignore
    }
  };

  const exportToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scans, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `supabase-scans-export-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Username', 'Score', 'Grade', 'Date', 'Tags', 'Notes', 'Headline'];
    const rows = scans.map((s) => [
      `"${s.id}"`,
      `"${s.username}"`,
      s.score,
      `"${s.grade}"`,
      `"${s.scannedAt}"`,
      `"${(s.tags || []).join(';')}"`,
      `"${(s.notes || '').replace(/"/g, '""')}"`,
      `"${(s.headlineRoast || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `supabase-scans-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="vault-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl border overflow-hidden ${
          isDark ? 'bg-[#101726] border-[#263247] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Header */}
        <div
          className={`p-5 sm:p-6 border-b flex items-center justify-between gap-4 ${
            isDark ? 'border-[#232F46] bg-[#0E1524]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm"
              aria-hidden="true"
            >
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="vault-modal-title" className="text-xl sm:text-2xl font-black tracking-tight">
                  Supabase Data Storage
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  <span>Connected: edmtuwlsyehfbhtzreax</span>
                </span>
              </div>
              <div className={`text-xs mt-1 flex flex-wrap items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="font-mono text-[11px] text-cyan-300">{SUPABASE_PROJECT_URL}</span>
                <span aria-hidden="true">•</span>
                <span>Cloud sync active for audit scans, battle records, and profiles</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Database Vault dialog"
            className={`p-2 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-[#1C263D]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Supabase Integration Banner */}
        <div
          className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-400">⚡ Supabase Integration:</span>
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              Auto-persisting audits &amp; custom benchmarks to Supabase tables.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSqlSchema(!showSqlSchema)}
              aria-expanded={showSqlSchema}
              className="text-cyan-300 hover:underline flex items-center gap-1 font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md px-1"
            >
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{showSqlSchema ? 'Hide SQL Script' : 'Supabase SQL Setup'}</span>
            </button>
            <span className="text-slate-600" aria-hidden="true">|</span>
            <a
              href="https://supabase.com/dashboard/project/edmtuwlsyehfbhtzreax/editor"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Supabase Project Dashboard in new tab"
              className="text-slate-400 hover:text-white flex items-center gap-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md px-1"
            >
              <span>Supabase Dashboard</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Optional Expandable SQL Schema Box */}
        {showSqlSchema && (
          <div
            className={`p-4 border-b space-y-2 animate-fadeIn ${
              isDark ? 'bg-[#080D1A] border-[#232F46]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-emerald-400">SQL Table Schema (Optional)</span>
                <p className="text-[11px] text-slate-400">
                  Run this in your Supabase SQL Editor if you want dedicated SQL tables (audit_scans, battle_records, etc.) with RLS policies:
                </p>
              </div>
              <button
                onClick={copySqlSchema}
                aria-label="Copy Supabase SQL Schema to clipboard"
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-[#030712] border border-[#1E293B] text-[11px] font-mono text-cyan-200 max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        )}

        {/* Action & Filter Bar */}
        <div
          className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'border-[#232F46] bg-[#141C2F]' : 'border-slate-200 bg-white'
          }`}
        >
          {/* Search box */}
          <div
            className={`relative flex-1 min-w-[220px] rounded-xl border ${
              isDark ? 'bg-[#0B1020] border-[#232F46]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              id="vault-search-input"
              aria-label="Search stored audits by username, notes, or roast"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stored audits by username, notes, roast..."
              className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-xl ${
                isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
              }`}
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              aria-expanded={showAddForm}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm border border-slate-200 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Plus className="w-3.5 h-3.5 text-slate-950" aria-hidden="true" />
              <span>{showAddForm ? 'Hide Form' : 'Add Record'}</span>
            </button>
            <button
              onClick={exportToJson}
              disabled={scans.length === 0}
              aria-label="Export database records as JSON"
              title="Export database records as JSON"
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isDark
                  ? 'bg-[#1C263D] hover:bg-[#25324E] border-[#2E3C5B] text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
              <span>JSON</span>
            </button>
            <button
              onClick={exportToCsv}
              disabled={scans.length === 0}
              aria-label="Export database records as CSV"
              title="Export database records as CSV"
              className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isDark
                  ? 'bg-[#1C263D] hover:bg-[#25324E] border-[#2E3C5B] text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div
            className={`px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto text-xs ${
              isDark ? 'border-[#232F46] bg-[#0E1524]' : 'border-slate-100 bg-slate-50'
            }`}
          >
            <span className={`text-[11px] font-medium mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Filter Tags:
            </span>
            <button
              onClick={() => setSelectedTag('all')}
              aria-pressed={selectedTag === 'all'}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                selectedTag === 'all'
                  ? isDark
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({scans.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                aria-pressed={selectedTag === tag}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  selectedTag === tag
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Tag className="w-3 h-3" aria-hidden="true" />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}

        {/* Add Record Drawer Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateRecord}
            className={`p-4 border-b space-y-3 ${
              isDark ? 'border-[#232F46] bg-[#0E1524]' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="font-bold text-xs text-cyan-400 uppercase tracking-wider">
              Create New Stored Data Record
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="manual-username-input" className="text-[11px] block mb-1 text-slate-300">
                  GitHub Username <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  id="manual-username-input"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. dev-username"
                  required
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isDark ? 'bg-[#141C2F] border-[#263247] text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="manual-score-input" className="text-[11px] block mb-1 text-slate-300">
                  Score (0 - 100)
                </label>
                <input
                  type="number"
                  id="manual-score-input"
                  min="0"
                  max="100"
                  value={newScore}
                  onChange={(e) => setNewScore(Number(e.target.value))}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isDark ? 'bg-[#141C2F] border-[#263247] text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="manual-tags-input" className="text-[11px] block mb-1 text-slate-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="manual-tags-input"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. candidate, react, hired"
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isDark ? 'bg-[#141C2F] border-[#263247] text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
            <div>
              <label htmlFor="manual-notes-input" className="text-[11px] block mb-1 text-slate-300">
                Notes / Qualitative Findings
              </label>
              <textarea
                id="manual-notes-input"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Add notes about this candidate or audit review..."
                rows={2}
                className={`w-full px-3 py-2 text-xs rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isDark ? 'bg-[#141C2F] border-[#263247] text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                Save Record to Cloud
              </button>
            </div>
          </form>
        )}

        {/* Records List Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filteredScans.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Database className="w-10 h-10 mx-auto text-slate-600" aria-hidden="true" />
              <h3 className="font-bold text-base">No Database Records Found</h3>
              <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {searchQuery || selectedTag !== 'all'
                  ? 'No records match your search filters.'
                  : 'Audit any GitHub profile or click "Add Record" to start storing data in your Supabase project.'}
              </p>
            </div>
          ) : (
            filteredScans.map((scan) => {
              const isEditing = editingId === scan.id;
              let scoreColor = 'text-slate-300 border-slate-700 bg-slate-800';
              if (scan.score >= 80) scoreColor = 'text-emerald-400 border-emerald-800/80 bg-emerald-950/40';
              else if (scan.score >= 60) scoreColor = 'text-cyan-400 border-cyan-800/80 bg-cyan-950/40';
              else if (scan.score >= 40) scoreColor = 'text-amber-300 border-amber-800/80 bg-amber-950/40';

              return (
                <div
                  key={scan.id}
                  className={`border rounded-2xl p-4 transition-all ${
                    isDark ? 'bg-[#141C2F] border-[#263247]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={scan.avatarUrl || `https://github.com/${scan.username}.png`}
                        alt={`Avatar for ${scan.username}`}
                        className="w-11 h-11 rounded-2xl bg-slate-800 object-cover border border-[#263247] shrink-0"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base truncate">@{scan.username}</h3>
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${scoreColor}`}>
                            {scan.score}/100 ({scan.grade})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Saved: {new Date(scan.scannedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          onSelectScan(scan.username);
                          onClose();
                        }}
                        aria-label={`View audit report for @${scan.username}`}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        <span>View Audit</span>
                        <ExternalLink className="w-3 h-3 text-slate-950" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => (isEditing ? handleSaveEdit(scan.id) : handleStartEdit(scan))}
                        aria-label={isEditing ? `Save changes for @${scan.username}` : `Edit notes and tags for @${scan.username}`}
                        className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                          isDark
                            ? 'bg-[#1C263D] hover:bg-[#25324E] border-[#2E3C5B] text-slate-200'
                            : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
                        }`}
                        title={isEditing ? 'Save Changes' : 'Edit Notes & Tags'}
                      >
                        {isEditing ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                        ) : (
                          <Edit3 className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                      <button
                        onClick={() => onDeleteScan(scan.id)}
                        aria-label={`Delete record for @${scan.username} from database`}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                        title="Delete from database"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Roast / Headline Snippet */}
                  {scan.headlineRoast && !isEditing && (
                    <div
                      className={`mt-3 p-2.5 rounded-xl text-xs italic ${
                        isDark ? 'bg-[#0B1020]/70 text-slate-300' : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      &ldquo;{scan.headlineRoast}&rdquo;
                    </div>
                  )}

                  {/* Notes & Tags Editor */}
                  {isEditing ? (
                    <div className="mt-3 pt-3 border-t border-[#232F46] space-y-2">
                      <div>
                        <label htmlFor={`edit-tags-${scan.id}`} className="text-[11px] text-slate-300 block mb-1">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          id={`edit-tags-${scan.id}`}
                          value={editTagsInput}
                          onChange={(e) => setEditTagsInput(e.target.value)}
                          placeholder="e.g. senior, python, hired"
                          className={`w-full px-3 py-1.5 text-xs rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                            isDark ? 'bg-[#0B1020] border-[#232F46] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div>
                        <label htmlFor={`edit-notes-${scan.id}`} className="text-[11px] text-slate-300 block mb-1">
                          Notes
                        </label>
                        <textarea
                          id={`edit-notes-${scan.id}`}
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Write candidate review or notes..."
                          rows={2}
                          className={`w-full px-3 py-1.5 text-xs rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                            isDark ? 'bg-[#0B1020] border-[#232F46] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(scan.id)}
                          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(scan.tags || []).map((t) => (
                          <span
                            key={t}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                              isDark
                                ? 'bg-[#1C263D] border-[#2E3C5B] text-cyan-300'
                                : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                      {scan.notes && (
                        <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          <strong>Note:</strong> {scan.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            isDark ? 'border-[#232F46] bg-[#0E1524] text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white">{scans.length}</span>
            <span>total records securely stored in Supabase &amp; Firestore</span>
          </div>
          {scans.length > 0 && (
            <button
              onClick={onClearAll}
              aria-label="Clear all records from database"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear All Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
