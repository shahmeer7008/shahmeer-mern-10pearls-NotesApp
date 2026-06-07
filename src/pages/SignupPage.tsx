import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export function SignupPage() {
  const { signUp } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password || !confirmPassword) {
        addToast('Please fill in all fields', 'warning');
        setLoading(false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        addToast('Please enter a valid email', 'warning');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        addToast('Password must be at least 6 characters', 'warning');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        addToast('Passwords do not match', 'warning');
        setLoading(false);
        return;
      }

      await signUp(email, password);
      addToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Signup failed';
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl"
      >
        <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-900 to-emerald-700 p-10 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.18),_transparent_50%)]" />
            <div className="relative space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-emerald-200 shadow-lg shadow-emerald-500/10">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">Create your account.</h1>
                <p className="mt-3 max-w-sm text-slate-300 leading-7">
                  Start a premium note-taking experience with real-time sync, modern design, and intuitive workflows.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur-xl">
                  <p className="text-sm text-slate-300">Ready in seconds</p>
                  <p className="mt-2 font-semibold text-white">Fast signup and secure authentication</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur-xl">
                  <p className="text-sm text-slate-300">Beautiful editor</p>
                  <p className="mt-2 font-semibold text-white">Create notes with rich formatting</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 sm:p-12">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900">Sign up</h2>
                <p className="mt-2 text-sm text-slate-500">Create an account and start organizing your thoughts.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>
              <div className="text-center text-sm text-slate-500">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="font-semibold text-emerald-600 hover:text-emerald-700">
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
