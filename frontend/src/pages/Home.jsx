import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';
import Landing from './Landing';
import { Search, ChevronDown, RefreshCw, Send, HelpCircle } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  if (!user) {
    return <Landing />;
  }

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search filter states
  const [searchType, setSearchType] = useState('name');
  const [searchInput, setSearchInput] = useState('');
  const [difficulty, setDifficulty] = useState('');

  // Feedback states
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState(null);

  // Auto-fill user email in feedback if logged in
  useEffect(() => {
    if (user) {
      setFeedbackEmail(user.email);
    } else {
      setFeedbackEmail('');
    }
  }, [user]);

  // Fetch recipes based on search filters
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      let filters = {};
      
      if (searchType === 'name' && searchInput) {
        filters.title = searchInput;
      } else if (searchType === 'ingredients' && searchInput) {
        filters.ingredients = searchInput;
      }

      if (difficulty) {
        filters.difficulty = difficulty;
      }

      const data = await api.recipes.getAll(filters);
      
      if (data.success) {
        setRecipes(data.data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search on mount and when filters change
  useEffect(() => {
    fetchRecipes();
  }, [difficulty]); // Triggers automatically on difficulty change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecipes();
  };

  // Submit feedback
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackStatus({ type: 'loading', msg: 'Sending feedback...' });
    
    try {
      const subject = user ? `User feedback: ${user.username}` : 'Guest feedback';
      await api.feedback.send(feedbackEmail, subject, feedbackMsg);
      
      setFeedbackStatus({ type: 'success', msg: 'Thank you! Feedback sent successfully.' });
      setFeedbackMsg('');
    } catch (error) {
      setFeedbackStatus({ type: 'error', msg: error.message || 'Failed to connect to backend server.' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark">
      {/* Immersive Hero Header */}
      <section className="relative overflow-hidden py-20 px-6 md:px-12 flex flex-col items-center justify-center text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-brand-dark to-brand-dark">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold font-display text-white mb-6 tracking-tight leading-tight">
            Discover Delicious <span className="text-gradient">Recipes</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Search, upload, and share culinary creations crafted by food lovers around the world.
          </p>

          {/* Unified search bar */}
          <form onSubmit={handleSearchSubmit} className="glass p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 max-w-2xl mx-auto w-full">
            <div className="relative w-full md:w-48">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-4 pr-10 appearance-none font-semibold text-sm focus:outline-none focus:border-brand-accent transition-colors duration-200 cursor-pointer"
              >
                <option value="name">Search by Name</option>
                <option value="ingredients">By Ingredients</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {searchType === 'name' || searchType === 'ingredients' ? (
              <div className="relative w-full flex-grow">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    searchType === 'name'
                      ? 'I want to cook...'
                      : 'Rice, Chicken, Spices (comma separated)...'
                  }
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-colors duration-200"
                />
              </div>
            ) : null}

            <div className="relative w-full md:w-40">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pl-4 pr-10 appearance-none font-semibold text-sm focus:outline-none focus:border-brand-accent transition-colors duration-200 cursor-pointer"
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy (≤ 20 min)</option>
                <option value="Medium">Medium (21-40 min)</option>
                <option value="Hard">Hard (&gt; 40 min)</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active-hover"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Recipes list section */}
      <main className="flex-grow px-6 md:px-12 py-12 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            Explore Recipes
          </h2>
          <button
            onClick={() => {
              setSearchInput('');
              setDifficulty('');
              fetchRecipes();
            }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-accent transition-colors duration-200 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        </div>

        {/* Loading / Results grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass rounded-2xl p-4 flex flex-col gap-4 animate-pulse h-80">
                <div className="bg-white/5 rounded-xl aspect-video w-full"></div>
                <div className="h-6 bg-white/5 rounded w-3/4"></div>
                <div className="h-4 bg-white/5 rounded w-1/2"></div>
                <div className="mt-auto h-10 bg-white/5 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass rounded-3xl max-w-xl mx-auto">
            <p className="text-gray-400 text-lg mb-2 font-semibold">No Recipes Found</p>
            <p className="text-gray-500 text-sm">Try broadening your search inputs or resetting your filters.</p>
          </div>
        )}
      </main>

      {/* Footer Section with Feedback Email */}
      <footer className="bg-brand-dark border-t border-white/5 py-12 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white font-display">About RecipeBook</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              A premium, open-source space to share, catalog, and enjoy tasty dishes from across the globe.
            </p>
          </div>

          {/* Quick links Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white font-display">Links</h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-brand-accent transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors duration-200">Terms of Use</a></li>
            </ul>
          </div>

          {/* Feedback Form Column */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-white font-display flex items-center gap-1.5">
              <HelpCircle className="h-4 w-4 text-brand-accent" />
              Send Feedback
            </h3>
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-2 w-full">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-accent"
              />
              <textarea
                placeholder="Enter your feedback..."
                required
                rows={3}
                value={feedbackMsg}
                onChange={(e) => setFeedbackMsg(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-accent resize-none placeholder-gray-600 mb-3"
              />
              <button
                type="submit"
                className="py-2 px-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                Submit Feedback
              </button>
              {feedbackStatus && (
                <p className={`text-xs mt-1 ${
                  feedbackStatus.type === 'error' ? 'text-red-400' : 
                  feedbackStatus.type === 'success' ? 'text-emerald-400' : 'text-gray-400'
                }`}>
                  {feedbackStatus.msg}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} RecipeBook | Clean MERN Architecture | Powered by React & Tailwind v4</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
