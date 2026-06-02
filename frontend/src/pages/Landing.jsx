import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChefHat, Sparkles, Utensils, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-[90vh] bg-brand-dark flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-accent/5 rounded-full filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-brand-fresh/5 rounded-full filter blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6 py-20 max-w-5xl mx-auto">
        {/* Brand Tagline */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 mb-6">
          <Sparkles className="h-4 w-4 text-brand-accent animate-pulse" />
          <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">Welcome to RecipeBook v2</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display text-white mb-6 tracking-tight leading-tight max-w-4xl">
          Craft, Catalog & Share <br />
          <span className="text-gradient">Culinary Masterpieces</span>
        </h1>

        {/* Sub-headline description */}
        <p className="text-gray-400 text-lg sm:text-xl mb-12 max-w-2xl leading-relaxed">
          Join an elite community of food enthusiasts. Log family recipes, curate step-by-step checklists, run interactive cooking sessions, and exchange star-rated reviews.
        </p>

        {/* Dynamic CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20">
          <Link
            to="/register"
            className="px-8 py-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold rounded-xl transition-all duration-200 cursor-pointer active-hover flex items-center justify-center gap-2 group shadow-lg shadow-brand-accent/10"
          >
            Create Free Account
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all duration-200 cursor-pointer active-hover flex items-center justify-center gap-2"
          >
            Sign In
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Feature 1 */}
          <div className="glass rounded-3xl p-8 border border-white/5 text-left active-hover">
            <div className="h-12 w-12 rounded-2xl bg-brand-accent/15 border border-brand-accent/20 text-brand-accent flex items-center justify-center mb-6">
              <Utensils className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 font-display">Interactive Cooking Player</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A minimalist, large-font immersive player that lets you focus on cooking step-by-step without browser clutter.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass rounded-3xl p-8 border border-white/5 text-left active-hover">
            <div className="h-12 w-12 rounded-2xl bg-brand-fresh/15 border border-brand-fresh/20 text-brand-fresh flex items-center justify-center mb-6">
              <ChefHat className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 font-display">Dynamic Ingredient Tags</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Throw away loose-text recipes. Catalog and search ingredients as separate, searchable tags instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass rounded-3xl p-8 border border-white/5 text-left active-hover">
            <div className="h-12 w-12 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-400 flex items-center justify-center mb-6">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3 font-display">Collaborative Reviews</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Rate international dishes, submit kitchen adjustments, and share delicious feedback with fellow chefs.
            </p>
          </div>
        </div>
      </div>

      {/* Landing Footer */}
      <div className="relative z-10 border-t border-white/5 py-8 text-center text-xs text-gray-500 max-w-7xl mx-auto w-full px-6">
        <p>&copy; {new Date().getFullYear()} RecipeBook | Clean MERN Architecture | Powered by React & Tailwind v4</p>
      </div>
    </div>
  );
};

export default Landing;
