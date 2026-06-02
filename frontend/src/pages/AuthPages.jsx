import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, BookOpen, AlertCircle, Eye, EyeOff } from 'lucide-react';

// ==========================================
// 1. LOGIN COMPONENT
// ==========================================
export const Login = () => {
  const { user, loginUser, error, setError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Clear errors on load
  useEffect(() => {
    setError(null);
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await loginUser(username, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-brand-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {/* Decorative Brand */}
        <Link to="/" className="flex items-center gap-2 text-3xl font-bold font-display text-gradient mb-4">
          <BookOpen className="h-8 w-8 text-brand-accent animate-pulse" />
          RecipeBook
        </Link>
        <h2 className="text-center text-2xl font-bold font-display text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Sign in to view recipes, comment, and upload your own dishes.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass rounded-3xl p-8 border border-white/5 relative">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 text-sm mb-6 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 min-w-5 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Username/Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Username or Email</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="enter username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors duration-150"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-500 hover:text-white focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer active-hover flex items-center justify-center gap-1.5"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Helper redirect */}
          <div className="mt-8 border-t border-white/5 pt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-accent hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. REGISTER COMPONENT
// ==========================================
export const Register = () => {
  const { user, registerUser, error, setError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Clear errors on load
  useEffect(() => {
    setError(null);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFormError('');

    // Client-side validations
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await registerUser(username, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-6 lg:px-8 bg-brand-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {/* Decorative Brand */}
        <Link to="/" className="flex items-center gap-2 text-3xl font-bold font-display text-gradient mb-4">
          <BookOpen className="h-8 w-8 text-brand-accent animate-pulse" />
          RecipeBook
        </Link>
        <h2 className="text-center text-2xl font-bold font-display text-white mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Join RecipeBook to publish recipes and write active reviews.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass rounded-3xl p-8 border border-white/5 relative">
          {(error || formError) && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 text-sm mb-6 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 min-w-5 text-red-400 mt-0.5" />
              <span>{formError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Username Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="choose username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors duration-150"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. food@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors duration-150"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="•••••••• (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-500 hover:text-white focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-white">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3 text-gray-500 hover:text-white focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold text-sm rounded-xl transition-all duration-200 cursor-pointer active-hover flex items-center justify-center gap-1.5"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Helper redirect */}
          <div className="mt-8 border-t border-white/5 pt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-accent hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
