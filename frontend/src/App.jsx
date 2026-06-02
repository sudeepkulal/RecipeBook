import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import RecipeForm from './pages/RecipeForm';
import UserProfile from './pages/UserProfile';
import { Login, Register } from './pages/AuthPages';
import { BookOpen } from 'lucide-react';

// A wrapper component to check user jwt token validation and redirect if invalid/unavailable
function GlobalAuthGuard({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If auth state has resolved (not loading anymore) and there is no authenticated user
    if (!loading && !user) {
      // Protect routes like /create, /edit, and /user profile
      const protectedPaths = ['/create', '/edit', '/user'];
      const isProtected = protectedPaths.some(path => location.pathname.startsWith(path));
      if (isProtected) {
        navigate('/login');
      }
    }
  }, [user, loading, location.pathname, navigate]);

  // Render a beautiful, glassmorphic loading spinner while verifying JWT token
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-brand-dark text-white p-4">
        <div className="relative flex flex-col items-center p-8 rounded-3xl glass border border-white/5 max-w-sm w-full text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin"></div>
          <div className="absolute top-[54px] flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-brand-accent animate-pulse" />
          </div>
          <h3 className="mt-6 text-lg font-bold font-display text-white">RecipeBook</h3>
          <p className="mt-2 text-xs font-semibold tracking-wider text-gray-400 uppercase animate-pulse">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <GlobalAuthGuard>
          <div className="flex flex-col min-h-screen bg-brand-dark text-gray-100 font-sans selection:bg-brand-accent selection:text-brand-dark">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/create" element={<RecipeForm />} />
                <Route path="/edit/:id" element={<RecipeForm />} />
                <Route path="/user/:userId" element={<UserProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </div>
          </div>
        </GlobalAuthGuard>
      </AuthProvider>
    </Router>
  );
}

export default App;

