import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut, Mail } from 'lucide-react';
import type { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function ProfilePage() {
  const { user, session, signOut } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const token = session?.token;
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const response = await fetch(`${API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody?.error?.message || 'Failed to load profile');
      }

      const { data } = await response.json();
      setProfile(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load profile';
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      addToast('Logged out successfully', 'success');
      navigate('/login');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Logout failed';
      addToast(errorMsg, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="rounded-3xl border border-white/10 bg-slate-900/90 px-8 py-6 text-slate-300 shadow-xl shadow-slate-950/40">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 rounded-[32px] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
        >
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 transition hover:bg-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to notes
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[32px] border border-white/10 bg-slate-900/90 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-sky-300 shadow-lg shadow-sky-500/10">
                <Mail className="h-6 w-6" />
              </div>
              <h1 className="mt-6 text-4xl font-semibold">Profile</h1>
              <p className="mt-3 max-w-md text-slate-300 leading-7">
                View your account details, logout securely, and keep your note experience connected.
              </p>
            </div>
            <div className="rounded-[32px] bg-slate-950/90 p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Email</p>
                  <p className="mt-3 text-xl font-semibold text-white">{profile?.email ?? 'Not available'}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Member since</p>
                  <p className="mt-3 text-xl font-semibold text-white">
                    {profile
                      ? new Date(profile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-5 ring-1 ring-white/10">
                  <p className="text-sm text-slate-400">Account ID</p>
                  <p className="mt-2 break-all text-sm font-medium text-white">{profile?.id ?? '—'}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
