import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';
import { Sparkles, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await register(name.trim(), email.trim(), role);
      if (role === 'student') onNavigate('/onboarding');
      else if (role === 'mentor') onNavigate('/mentor/dashboard');
      else onNavigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Create Your Account
        </h1>
        <p className="text-xs text-slate-500">
          Join the verified university mentorship network.
        </p>
      </div>

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
              Select Role
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  role === 'student'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                🎓 Student
              </button>
              <button
                type="button"
                onClick={() => setRole('mentor')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  role === 'mentor'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                👨‍🏫 Mentor
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Himesh Rajput"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. himesh@mac.du.ac.in"
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
            disabled={loading || !name.trim() || !email.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('/login')}
            className="text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
};
