import { useEffect, useState } from 'react';
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

      addToast(
        id ? 'Note updated successfully' : 'Note created successfully',
        'success'
      );
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading note...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Note' : 'New Note'}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-400"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full text-3xl font-bold text-gray-900 focus:outline-none"
            />
          </div>

          <div className="p-4">
            <RichTextEditor 
              content={content}
              onChange={setContent}
              placeholder="Start typing your note..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
