import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export function LoginPage() {
  const { signIn } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        addToast('Please fill in all fields', 'warning');
        setLoading(false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        addToast('Please enter a valid email', 'warning');
        setLoading(false);
        return;
      }

      await signIn(email, password);
      addToast('Logged in successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
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
        <div className="grid gap-0 md:grid-cols-[1.2fr_1fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-800 p-10 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_50%)]" />
            <div className="relative space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-sky-300 shadow-lg shadow-sky-500/10">
                <LogIn className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">Welcome back.</h1>
                <p className="mt-3 max-w-sm text-slate-300 leading-7">
                  Securely access your notes with a beautifully crafted experience designed for productivity and calm focus.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur-xl">
                  <p className="text-sm text-slate-300">Fast access</p>
                  <p className="mt-2 font-semibold text-white">Clean interface, instant loading</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur-xl">
                  <p className="text-sm text-slate-300">Secure login</p>
                  <p className="mt-2 font-semibold text-white">JWT auth with modern backend APIs</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-10 sm:p-12">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold text-slate-900">Sign in</h2>
                <p className="mt-2 text-sm text-slate-500">Enter your credentials to continue to your notes dashboard.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {loading ? 'Signing in...' : 'Sign in securely'}
                </button>
              </form>
              <div className="text-center text-sm text-slate-500">
                New here?{' '}
                <button onClick={() => navigate('/signup')} className="font-semibold text-sky-600 hover:text-sky-700">
                  Create an account
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
