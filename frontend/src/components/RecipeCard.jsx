import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Tag, ChefHat } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  const { _id, title, image, time, dish, createdBy } = recipe;

  // Image source path mapping
  const imageSrc = image
    ? image.startsWith('http')
      ? image
      : `http://localhost:5000${image}`
    : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';

  // Dynamic badge styling based on dish flavor profiles
  const getDishBadgeStyle = (type) => {
    switch (type) {
      case 'Sweet':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'Spicy':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Sour':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden active-hover flex flex-col h-full border border-white/5 group">
      {/* Recipe Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2.5 py-1 font-bold rounded-full border ${getDishBadgeStyle(dish)}`}>
            {dish}
          </span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold font-display text-white mb-2 line-clamp-1 group-hover:text-brand-accent transition-colors duration-200">
          {title}
        </h3>

        <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-brand-accent" />
            <span>{time} min</span>
          </div>
          {createdBy && (
            <div className="flex items-center gap-1">
              <ChefHat className="h-3.5 w-3.5 text-brand-fresh" />
              <span>{createdBy.username}</span>
            </div>
          )}
        </div>

        {/* View Details CTA Button */}
        <div className="mt-auto">
          <Link
            to={`/recipes/${_id}`}
            className="block text-center w-full py-2.5 bg-white/5 hover:bg-brand-accent hover:text-brand-dark rounded-xl text-sm font-semibold transition-all duration-300 border border-white/10 hover:border-brand-accent"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
