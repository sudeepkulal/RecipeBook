import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChefHat, BookOpen, Mail } from 'lucide-react';

const UserProfile = () => {
  const { userId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If the URL is literally '/user/undefined', redirect to the user's correct profile once authenticated
    if (userId === 'undefined') {
      if (!authLoading) {
        if (user) {
          navigate(`/user/${user._id || user.id}`, { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      }
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Chef Profile Details
        const userData = await api.auth.getUserById(userId);
        if (userData.success) {
          setProfileUser(userData.data);
        }

        // 2. Fetch Chef Recipes
        const recipesData = await api.recipes.getByUser(userId);
        if (recipesData.success) {
          setRecipes(recipesData.data);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, user, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-brand-dark py-12 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Return link */}
      <Link to="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-accent mb-8 transition-colors duration-200">
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Profile Header */}
      <div className="glass rounded-3xl p-8 mb-10 border border-white/5 flex flex-col sm:flex-row items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent flex items-center justify-center">
          <ChefHat className="h-10 w-10" />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white mb-1.5">
            Chef {profileUser?.username || 'Chef'}
          </h1>
          {profileUser?.email && (
            <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-1.5 mb-2">
              <Mail className="h-4 w-4 text-brand-accent" />
              <span>{profileUser.email}</span>
            </p>
          )}
          <p className="text-gray-400 text-sm flex items-center justify-center sm:justify-start gap-1.5">
            <BookOpen className="h-4 w-4 text-brand-fresh" />
            <span>{recipes.length} Recipe{recipes.length !== 1 ? 's' : ''} Published</span>
          </p>
        </div>
      </div>

      {/* Recipes list */}
      <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-6 border-b border-white/5 pb-3">
        Chef's Recipes
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
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
        <div className="text-center py-20 glass rounded-3xl max-w-xl mx-auto border border-white/5">
          <p className="text-gray-400 text-lg mb-2">No Recipes Yet</p>
          <p className="text-gray-500 text-sm">This chef hasn't published any culinary cards yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
