import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, PlusCircle, User, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 md:px-12 flex justify-between items-center transition-all duration-300">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold font-display text-gradient">
        <BookOpen className="h-7 w-7 text-brand-accent animate-pulse" />
        RecipeBook
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        {user ? (
          <>
            {/* Logged in views */}
            <Link
              to="/create"
              className="flex items-center gap-1.5 text-sm font-semibold hover:text-brand-accent transition-colors duration-200"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Upload Recipe</span>
            </Link>

            <Link
              to={`/user/${user._id || user.id}`}
              className="flex items-center gap-1.5 text-sm font-semibold hover:text-brand-accent transition-colors duration-200"
            >
              <User className="h-4 w-4" />
              <span>{user.username}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <>
            {/* Guest views */}
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm font-semibold hover:text-brand-accent transition-colors duration-200"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 bg-brand-accent hover:bg-brand-accent-hover text-brand-dark rounded-lg active-hover transition-colors duration-200"
            >
              <UserPlus className="h-4 w-4" />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
