import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Sparkles, ArrowRight, GraduationCap, User, Shield, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, loginAs } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await login(email.trim());
      onNavigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'student' | 'mentor' | 'admin') => {
    setLoading(true);
    try {
      await loginAs(role);
      if (role === 'student') onNavigate('/dashboard');
      else if (role === 'mentor') onNavigate('/mentor/dashboard');
      else onNavigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rethink 26 Hackathon Demo Mode</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome to Mentor Connect AI
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to your account or use the 1-click judge presets below.
        </p>
      </div>

      {/* Demo Credentials Box */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          One-Click Demo Roles:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('student')}
            className="p-2.5 bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 rounded-xl text-center transition-all cursor-pointer shadow-2xs group"
          >
            <GraduationCap className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
            <span className="block text-xs font-bold text-slate-800 group-hover:text-indigo-700">Student</span>
            <span className="text-[10px] text-slate-400">Himesh</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('mentor')}
            className="p-2.5 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-center transition-all cursor-pointer shadow-2xs group"
          >
            <User className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
            <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-700">Mentor</span>
            <span className="text-[10px] text-slate-400">Microsoft</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('admin')}
            className="p-2.5 bg-white hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-xl text-center transition-all cursor-pointer shadow-2xs group"
          >
            <Shield className="w-5 h-5 mx-auto text-amber-600 mb-1" />
            <span className="block text-xs font-bold text-slate-800 group-hover:text-amber-700">Admin</span>
            <span className="text-[10px] text-slate-400">Sakshi</span>
          </button>
        </div>
      </div>

      {/* Standard Email Login Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. student@mentorconnect.demo"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
};
