import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, User, Download, Upload, Search } from 'lucide-react';
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
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchNotes();
  }, [user, navigate]);

  // Filter and sort notes
  useEffect(() => {
    let filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (sortBy === 'date-desc') {
      filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (sortBy === 'date-asc') {
      filtered.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, sortBy]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = (session as any)?.access_token;

      // Try backend API first
      if (token) {
        const response = await fetch(`${API_URL}/api/notes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const { data } = await response.json();
          setNotes(data.notes || []);
          return;
        }
      }

      // Fallback to Supabase
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load notes';
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const token = (session as any)?.access_token;

      // Try backend API first
      if (token) {
        const response = await fetch(`${API_URL}/api/notes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setNotes(notes.filter((n) => n.id !== id));
          addToast('Note deleted successfully', 'success');
          return;
        }
      }

      // Fallback to Supabase
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;
      setNotes(notes.filter((n) => n.id !== id));
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
      
      // Show imported notes (in production, these would be saved to backend)
      addToast(`Imported ${importedNotes.length} notes. Note: These are preview only.`, 'info');
      console.log('Imported notes:', importedNotes);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Import failed';
      addToast(errorMsg, 'error');
    }

    // Reset input
    event.target.value = '';
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-lg transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
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
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => navigate('/editor')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            New Note
          </button>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleExport('json')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              title="Export as JSON"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              title="Export as CSV"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('markdown')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              title="Export as Markdown"
            >
              <Download className="w-4 h-4" />
              Export MD
            </button>

            <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json,.csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-gray-500">Loading notes...</div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              {notes.length === 0 ? 'No notes yet. Create your first note!' : 'No notes match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                  {note.title || 'Untitled'}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                  {note.content ? note.content.substring(0, 150).replace(/<[^>]*>/g, '') : 'No content'}
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  {new Date(note.updated_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/editor/${note.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded transition-colors text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
