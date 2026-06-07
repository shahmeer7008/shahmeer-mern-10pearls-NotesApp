import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import type { Note } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function EditorPage() {
  const { user, session } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (id) {
      fetchNote();
    } else {
      setLoading(false);
    }
  }, [id, user, navigate]);

  const fetchNote = async () => {
    try {
      const token = session?.token;
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch(`${API_URL}/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error?.message || 'Failed to load note');
      }

      const { data } = await response.json();
      setTitle(data.title);
      setContent(data.content);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load note';
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      addToast('Title is required', 'warning');
      return;
    }

    setSaving(true);

    try {
      const token = session?.token;
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const method = id ? 'PUT' : 'POST';
      const url = id ? `${API_URL}/api/notes/${id}` : `${API_URL}/api/notes`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error?.message || 'Failed to save note');
      }

      addToast(id ? 'Note updated successfully' : 'Note created successfully', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save note';
      addToast(errorMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 px-8 py-6 text-slate-300 shadow-xl shadow-slate-950/40">
          Loading note...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-[32px] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Editor</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">{id ? 'Edit note' : 'New note'}</h1>
              <p className="mt-2 max-w-xl text-slate-400">
                Write with confidence in a clean, distraction-free editor with fast save and beautiful styling.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-900"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save note'}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[32px] border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/40 backdrop-blur-xl"
        >
          <div className="border-b border-white/10 p-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full rounded-3xl border border-white/10 bg-slate-950/80 px-5 py-4 text-3xl font-semibold text-white outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
            />
          </div>
          <div className="min-h-[60vh] p-6">
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your idea, meeting notes, or plan here..."
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
