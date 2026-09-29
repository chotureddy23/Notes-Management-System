import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ArrowRight, Lock, Mail, Sparkles, CheckCircle2, Loader2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoExpanded, setDemoExpanded] = useState(false);

  const { login } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      showSuccess('Welcome back! Logged in successfully.');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.message;
      const netMsg = err.message ? `Connection error: ${err.message}` : null;
      setError(
        serverMsg || netMsg || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@smartnotes.com');
    setPassword('password123');
    try {
      setLoading(true);
      setError('');
      await login('demo@smartnotes.com', 'password123');
      showSuccess('Logged in as Demo Student!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not log into demo account.');
    } finally {
      setLoading(false);
    }
  };

  const isDemoLoginEnabled = import.meta.env.VITE_ENABLE_DEMO_LOGIN !== 'false';

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#0B1120]">
      {/* Left Column: Branding & Academic Showcase (Hidden on Mobile) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative text-white p-12 xl:p-16 flex-col justify-between overflow-hidden border-r border-indigo-900/50"
        style={{
          background: 'linear-gradient(135deg, #312E81 0%, #4338CA 45%, #111827 100%)',
        }}
      >
        {/* Subtle geometric background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-sm">
            <BookOpen className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight">SmartNotes</span>
            <span className="block text-[11px] text-indigo-200/80 font-medium">Enterprise Knowledge Base</span>
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Designed for Academic & SaaS Productivity
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
            Your knowledge,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-indigo-300 to-purple-200">
              organized beautifully.
            </span>
          </h1>

          <p className="text-indigo-100/85 text-base leading-relaxed">
            Capture, organize, and access your academic knowledge in one intelligent workspace.
          </p>

          <div className="space-y-3.5 pt-2">
            {[
              'Organize notes by subjects, topics, and categories',
              'Create and edit rich Markdown-based study notes',
              'Quickly search and find important information',
              'Save lecture notes, assignments, and study resources',
              'Access your knowledge securely from anywhere',
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-indigo-100 font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-indigo-200/60 font-medium">
          © {new Date().getFullYear()} SmartNotes Management System. College Project Demonstration Edition.
        </div>
      </div>

      {/* Right Column: Clean Modern SaaS Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 animate-fade-in my-auto">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">SmartNotes</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Welcome back! Please enter your details.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm rounded-xl animate-shake flex items-start justify-between gap-2.5"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                <div className="leading-snug">{error}</div>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-0.5 rounded cursor-pointer transition-colors"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('For demonstration accounts, you can use password123 or reset in demo seeder.');
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-[#263244] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 cursor-pointer"
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-98 flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create account
            </Link>
          </p>

          {/* De-emphasized Demo Login Helper (Can be toggled via VITE_ENABLE_DEMO_LOGIN) */}
          {isDemoLoginEnabled && (
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-gray-50/80 dark:bg-[#111827]/60 border border-gray-200/70 dark:border-[#263244]/70">
                <div
                  className="flex items-center justify-between cursor-pointer select-none"
                  onClick={() => setDemoExpanded(!demoExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                      College Project Demo Account
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Toggle Demo Details"
                  >
                    {demoExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {demoExpanded && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-200/60 dark:border-[#263244]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                      demo@smartnotes.com / password123
                    </p>
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={loading}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-600/10 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white rounded-lg transition-colors active:scale-95 shrink-0 cursor-pointer"
                    >
                      One-Click Demo Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
