import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/RatingStars';
import RecipeCard from '../components/RecipeCard';
import api from '../services/api';
import { Clock, ChefHat, BookOpen, ChevronRight, ChevronLeft, Maximize2, X, PlusCircle, ArrowLeft, Send } from 'lucide-react';

const RecipeDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedRecipes, setRelatedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comments form state
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentError, setCommentError] = useState('');

  // Interactive step-by-step cooking mode states
  const [cookingMode, setCookingMode] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Fetch recipe, comments, and related recipes
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Recipe details
      const recipeData = await api.recipes.getById(id);
      
      if (!recipeData.success) {
        navigate('/');
        return;
      }
      setRecipe(recipeData.data);

      // 2. Fetch Comments
      const commentsData = await api.comments.getByRecipe(id);
      if (commentsData.success) {
        setComments(commentsData.data);
      }

      // 3. Fetch Related recipes of same flavor profile
      const relatedData = await api.recipes.getAll();
      if (relatedData.success) {
        // Filter out current recipe from related list
        const filtered = relatedData.data.filter((r) => r._id !== id && r.dish === recipeData.data.dish);
        setRelatedRecipes(filtered.slice(0, 3)); // Max 3 items
      }
    } catch (err) {
      console.error('Error fetching recipe details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // Submit comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError('');

    if (!commentText.trim()) {
      setCommentError('Comment text cannot be empty.');
      return;
    }

    try {
      const data = await api.comments.create(id, commentText, commentRating);

      if (data.success) {
        setComments((prev) => [data.data, ...prev]);
        setCommentText('');
        setCommentRating(5);
      }
    } catch (err) {
      setCommentError(err.message || 'Failed to submit comment.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark py-20 px-6 flex flex-col items-center justify-center animate-pulse">
        <div className="h-6 w-20 bg-white/5 rounded mb-6"></div>
        <div className="glass rounded-3xl w-full max-w-4xl h-[500px]"></div>
      </div>
    );
  }

  if (!recipe) return null;

  const imageSrc = recipe.image
    ? recipe.image.startsWith('http')
      ? recipe.image
      : `http://localhost:5000${recipe.image}`
    : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';

  return (
    <div className="min-h-screen bg-brand-dark pb-20 relative">
      {/* Header Cover Banner */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark/60 z-10"></div>
        <img
          src={imageSrc}
          alt={recipe.title}
          className="w-full h-full object-cover blur-sm opacity-30 scale-105"
        />
        
        {/* Visual detail elements */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end max-w-7xl mx-auto px-6 md:px-12 pb-10">
          <Link to="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-accent mb-6 transition-colors duration-200">
            <ArrowLeft className="h-4 w-4" />
            Back to recipes
          </Link>

          <h1 className="text-3xl md:text-5xl font-extrabold font-display text-white mb-4 tracking-tight">
            {recipe.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <Clock className="h-4 w-4 text-brand-accent" />
              <span>{recipe.time} min</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <span className={`h-2.5 w-2.5 rounded-full ${
                recipe.dish === 'Sweet' ? 'bg-pink-400' :
                recipe.dish === 'Spicy' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></span>
              <span>{recipe.dish} Flavor Profile</span>
            </div>
            {recipe.createdBy && (
              <Link to={`/user/${recipe.createdBy._id}`} className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 hover:text-brand-accent transition-colors duration-200">
                <ChefHat className="h-4 w-4 text-brand-fresh" />
                <span>Created by {recipe.createdBy.username}</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main details sections */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Ingredients Checklist & Instructions */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Ingredients Section */}
          <div className="glass rounded-3xl p-6 md:p-8 border border-white/5">
            <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-6 border-b border-white/5 pb-3">
              Ingredients
            </h2>
            <p className="text-xs text-gray-500 mb-4">Click items to check off what you have ready:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-3 group cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id={`ing-${index}`}
                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-brand-accent focus:ring-brand-accent cursor-pointer"
                  />
                  <label
                    htmlFor={`ing-${index}`}
                    className="text-gray-300 text-sm cursor-pointer group-hover:text-white transition-colors duration-150"
                  >
                    {ingredient}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Section */}
          <div className="glass rounded-3xl p-6 md:p-8 border border-white/5">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
              <h2 className="text-xl md:text-2xl font-bold font-display text-white">
                Directions
              </h2>
              <button
                onClick={() => {
                  setActiveStep(0);
                  setCookingMode(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-fresh hover:bg-brand-fresh-hover text-brand-dark rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active-hover"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Cooking Mode
              </button>
            </div>

            <ol className="flex flex-col gap-6">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4 items-start">
                  <span className="flex items-center justify-center h-8 w-8 min-w-8 rounded-full bg-brand-accent/20 text-brand-accent text-sm font-bold border border-brand-accent/30 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-gray-300 text-sm leading-relaxed pt-1">
                    {instruction}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Ratings & comments segment */}
          <div className="glass rounded-3xl p-6 md:p-8 border border-white/5">
            <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-6 border-b border-white/5 pb-3">
              Reviews & Comments
            </h2>

            {/* Comment Form (Logged in only) */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-10 bg-white/5 rounded-2xl p-5 border border-white/5">
                <h3 className="text-sm font-bold text-white mb-4">Leave a Review</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-400">Your Rating:</span>
                  <RatingStars rating={commentRating} interactive={true} onRatingChange={setCommentRating} />
                </div>
                <div className="relative">
                  <textarea
                    rows={4}
                    placeholder="Write a supportive review, question, or adjustments you made..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent resize-none placeholder-gray-600 mb-3"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 active-hover ml-auto"
                  >
                    <Send className="h-4 w-4" />
                    Submit Review
                  </button>
                </div>
                {commentError && <p className="text-xs text-red-400 mt-2">{commentError}</p>}
              </form>
            ) : (
              <div className="mb-10 p-5 bg-white/5 rounded-2xl text-center border border-white/5">
                <p className="text-gray-400 text-sm mb-3">You need to be logged in to leave a review.</p>
                <Link
                  to="/login"
                  className="inline-block px-5 py-2.5 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark rounded-xl text-sm font-bold transition-all duration-200"
                >
                  Log In to Review
                </Link>
              </div>
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="flex flex-col gap-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="bg-white/5 rounded-2xl p-5 border border-white/5 transition-all duration-200 hover:border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-brand-accent/20 border border-brand-accent/30 text-brand-accent font-bold text-xs flex items-center justify-center">
                          {comment.user.username[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-white">{comment.user.username}</span>
                      </div>
                      <RatingStars rating={comment.rating} />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-2">
                      {comment.text}
                    </p>
                    <span className="text-xs text-gray-500 block">
                      Posted on {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-10 text-gray-500 text-sm">No reviews yet. Be the first to leave a review!</p>
            )}
          </div>
        </div>

        {/* Right Column: Related Suggestions */}
        <div className="flex flex-col gap-8">
          <div className="glass rounded-3xl p-6 border border-white/5">
            <h3 className="text-lg font-bold font-display text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-3">
              <BookOpen className="h-5 w-5 text-brand-accent" />
              Try This Out!
            </h3>

            {relatedRecipes.length > 0 ? (
              <div className="flex flex-col gap-6">
                {relatedRecipes.map((relRecipe) => (
                  <RecipeCard key={relRecipe._id} recipe={relRecipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No matching recipes of same flavor type yet.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FULL-SCREEN COOKING MODE OVERLAY */}
      {cookingMode && (
        <div className="fixed inset-0 bg-brand-dark/95 backdrop-blur-md z-50 flex flex-col justify-between p-6 md:p-12">
          {/* Top Panel Controls */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2 text-brand-accent">
              <BookOpen className="h-6 w-6" />
              <span className="text-lg font-bold font-display">{recipe.title}</span>
            </div>
            <button
              onClick={() => setCookingMode(false)}
              className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-full transition-all duration-150 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Central Active Step Display */}
          <div className="flex-grow flex flex-col items-center justify-center max-w-4xl mx-auto text-center py-10">
            <span className="text-brand-accent text-sm font-bold tracking-widest uppercase mb-4">
              Step {activeStep + 1} of {recipe.instructions.length}
            </span>
            <h3 className="text-2xl md:text-4xl text-white font-medium leading-relaxed max-w-3xl">
              {recipe.instructions[activeStep]}
            </h3>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex justify-between items-center border-t border-white/5 pt-6 max-w-4xl mx-auto w-full">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold disabled:opacity-30 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="text-sm text-gray-500">
              {Math.round(((activeStep + 1) / recipe.instructions.length) * 100)}% Complete
            </span>

            {activeStep === recipe.instructions.length - 1 ? (
              <button
                onClick={() => setCookingMode(false)}
                className="flex items-center gap-2 px-6 py-3 bg-brand-fresh hover:bg-brand-fresh-hover text-brand-dark rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer"
              >
                Finish Cooking!
              </button>
            ) : (
              <button
                onClick={() => setActiveStep((prev) => prev + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetail;
