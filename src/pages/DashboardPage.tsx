import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import useRealtimeUpdates from '../hooks/useRealtimeUpdates';
import { Plus, Edit2, Trash2, User, Download, Upload, Search, Sparkles } from 'lucide-react';
import { exportNotesAsJSON, exportNotesAsCSV, exportNotesAsMarkdown, importNotesFromFile } from '../utils/exportImport';
import type { Note } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function DashboardPage() {
  const { user, signOut, session } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');
  const socket = useRealtimeUpdates(session?.token || undefined);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);

      const token = session?.token;
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch(`${API_URL}/api/notes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error?.message || 'Failed to load notes');
      }

      const { data } = await response.json();
      setNotes(data.notes || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load notes';
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [session?.token, addToast]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (!socket) return;

    const refreshNotes = () => fetchNotes();

    socket.on('note:created', refreshNotes);
    socket.on('note:updated', refreshNotes);
    socket.on('note:deleted', refreshNotes);
    socket.on('note:imported', refreshNotes);

    return () => {
      socket.off('note:created', refreshNotes);
      socket.off('note:updated', refreshNotes);
      socket.off('note:deleted', refreshNotes);
      socket.off('note:imported', refreshNotes);
    };
  }, [socket, fetchNotes]);

  const filteredNotes = useMemo(() => {
    let filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (sortBy === 'date-desc') {
      filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (sortBy === 'date-asc') {
      filtered.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
    } else {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  }, [notes, searchQuery, sortBy]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this note permanently?')) return;

    try {
      const token = session?.token;
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error?.message || 'Failed to delete note');
      }

      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
      addToast('Note deleted successfully', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete note';
      addToast(errorMsg, 'error');
    }
  };

  const handleExport = (format: 'json' | 'csv' | 'markdown') => {
    if (filteredNotes.length === 0) {
      addToast('No notes to export', 'warning');
      return;
    }

    try {
      if (format === 'json') {
        exportNotesAsJSON(filteredNotes);
      } else if (format === 'csv') {
        exportNotesAsCSV(filteredNotes);
      } else {
        exportNotesAsMarkdown(filteredNotes);
      }
      addToast(`Notes exported as ${format.toUpperCase()}`, 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Export failed';
      addToast(errorMsg, 'error');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedNotes = await importNotesFromFile(file);
      const token = session?.token;
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch(`${API_URL}/api/notes/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notes: importedNotes }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error?.message || 'Failed to import notes');
      }

      const { data } = await response.json();
      setNotes((currentNotes) => [...data, ...currentNotes]);
      addToast(`Imported ${data.length} notes successfully`, 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Import failed';
      addToast(errorMsg, 'error');
    } finally {
      event.target.value = '';
    }
  };

  const noteCount = filteredNotes.length;
  const lastUpdated = notes.length ? new Date(notes[0].updated_at).toLocaleDateString() : '—';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-x-0 top-0 h-72 bg-indigo-700/30 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8 rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl"
        >
          <div className="flex flex-col-reverse gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Notes workspace</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">Your journal, made beautiful.</h1>
              <p className="mt-3 max-w-2xl text-slate-300 leading-7">
                Quickly create, manage, and search notes with elegant animations, smart actions, and a premium dashboard experience.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-800/90 p-4 text-right ring-1 ring-white/10">
              <p className="text-sm text-slate-400">Signed in as</p>
              <p className="mt-2 text-lg font-semibold text-white">{user?.email ?? 'Unknown'}</p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await signOut();
                    addToast('Logged out successfully', 'success');
                    navigate('/login');
                  } catch (err) {
                    const errorMsg = err instanceof Error ? err.message : 'Logout failed';
                    addToast(errorMsg, 'error');
                  }
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
              >
                <User className="h-4 w-4 text-sky-300" />
                Sign out
              </button>
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-6 xl:grid-cols-[1.75fr_1fr]"
        >
          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Control panel</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Quick actions</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/editor')}
                    className="inline-flex items-center gap-2 rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    <Plus className="h-4 w-4" />
                    New note
                  </button>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-3xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500">
                    <Upload className="h-4 w-4" />
                    Import
                    <input type="file" accept=".json,.csv" onChange={handleImport} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-950/80 p-5 ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Notes</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{notes.length}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5 ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Visible</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{noteCount}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-5 ring-1 ring-white/10">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Latest update</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{lastUpdated}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 rounded-3xl bg-slate-950/80 p-4 text-slate-100">
                  <Sparkles className="h-5 w-5 text-sky-300" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Search notes</p>
                    <p className="mt-1 text-sm text-slate-300">Find ideas, keywords, and lines instantly.</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search notes by title or content..."
                      className="w-full rounded-full border border-white/10 bg-slate-950/80 py-3 pl-12 pr-4 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
                >
                  <option value="date-desc">Newest first</option>
                  <option value="date-asc">Oldest first</option>
                  <option value="title">Title (A-Z)</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleExport('json')}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  <Download className="h-4 w-4" />
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('csv')}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('markdown')}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                  <Download className="h-4 w-4" />
                  Export MD
                </button>
              </div>
            </div>

            {loading ? (
              <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-8 text-center text-slate-400 shadow-xl shadow-slate-950/30">
                Loading notes...
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-12 text-center text-slate-300 shadow-xl shadow-slate-950/30">
                <p className="text-lg font-medium text-white">
                  {notes.length === 0 ? 'No notes yet.' : 'No notes match your search.'}
                </p>
                <p className="mt-2 text-slate-400">Create a new note to get started.</p>
              </div>
            ) : (
              <motion.div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredNotes.map((note) => (
                  <motion.article
                    key={note.id}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                    className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/20"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-sky-300">{note.title || 'Untitled'}</p>
                        <p className="mt-3 max-h-24 overflow-hidden text-sm leading-6 text-slate-300">
                          {note.content
                            ? note.content.replace(/<[^>]*>/g, '').slice(0, 160)
                            : 'No content available. Add rich text to your note.'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                      <span className="rounded-full bg-white/5 px-2 py-1">{note.title?.length || 0} chars</span>
                    </div>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/editor/${note.id}`)}
                        className="inline-flex items-center justify-center gap-2 rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(note.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-3xl border border-red-500 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </section>

          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Note habits</p>
              <h3 className="mt-3 text-xl font-semibold text-white">Keep your ideas organized</h3>
              <p className="mt-3 text-slate-400 leading-7">
                Use search, sort, and smart exports to keep every note at your fingertips. Import existing notes in JSON or CSV and continue instantly.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Profile</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-3xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">Logged in as</p>
                  <p className="mt-2 text-lg font-semibold text-white">{user?.email ?? 'You'}</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full rounded-3xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  View profile
                </button>
              </div>
            </motion.div>
          </aside>
        </motion.div>
      </div>
    </div>
  );
}
