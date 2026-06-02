import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating, maxStars = 5, onRatingChange, interactive = false }) => {
  const starsArray = Array.from({ length: maxStars }, (_, index) => index + 1);

  return (
    <div className="flex items-center gap-1">
      {starsArray.map((starValue) => {
        const isFilled = starValue <= rating;
        
        return (
          <button
            key={starValue}
            type="button"
            disabled={!interactive}
            onClick={() => onRatingChange && onRatingChange(starValue)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform duration-100' : 'cursor-default'
            } outline-none focus:outline-none`}
          >
            <Star
              className={`h-5 w-5 ${
                isFilled
                  ? 'fill-brand-accent text-brand-accent'
                  : 'text-gray-600 fill-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
