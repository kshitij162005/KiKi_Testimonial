import React, { useState } from 'react';
import { cn } from '../../lib/utils';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  size = 'md', 
  readonly = false, 
  showLabel = true,
  className 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const handleStarClick = (starValue) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!readonly) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = (hoverRating || rating) >= star;
          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              className={cn(
                "transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded",
                sizeClasses[size],
                {
                  "text-yellow-400 scale-110": isActive,
                  "text-gray-600 hover:text-yellow-300": !isActive && !readonly,
                  "hover:scale-125 cursor-pointer": !readonly,
                  "cursor-default": readonly
                }
              )}
              onMouseEnter={() => handleStarHover(star)}
              onClick={() => handleStarClick(star)}
              aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            >
              <svg
                className="w-full h-full fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          );
        })}
      </div>
      {showLabel && (
        <span className="text-sm text-gray-400 min-w-[80px]">
          {rating ? `${rating}/5 stars` : 'Rate your experience'}
        </span>
      )}
    </div>
  );
};

export default StarRating;