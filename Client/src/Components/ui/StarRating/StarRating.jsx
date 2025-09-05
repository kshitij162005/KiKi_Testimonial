import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import './StarRating.css';

const StarRating = ({
  value = 0,
  onChange,
  readonly = false,
  size = 'medium',
  showValue = false,
  maxRating = 5,
  allowHalf = false,
  className
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizes = {
    small: { width: 16, height: 16, gap: 2 },
    medium: { width: 20, height: 20, gap: 3 },
    large: { width: 24, height: 24, gap: 4 }
  };

  const currentSize = sizes[size];

  const handleClick = (rating) => {
    if (readonly || !onChange) return;
    onChange(rating);
  };

  const handleMouseEnter = (rating) => {
    if (readonly) return;
    setHoverValue(rating);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(0);
  };

  const getStarValue = (index) => {
    const currentValue = hoverValue || value;
    const starValue = index + 1;
    
    if (currentValue >= starValue) return 'filled';
    if (allowHalf && currentValue >= starValue - 0.5) return 'half';
    return 'empty';
  };

  const StarIcon = ({ filled, half, size }) => (
    <svg
      width={size.width}
      height={size.height}
      viewBox="0 0 24 24"
      className="transition-all duration-200 ease-out"
    >
      <defs>
        <linearGradient id={`half-fill-${Math.random()}`}>
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? '#fbbf24' : half ? `url(#half-fill-${Math.random()})` : 'none'}
        stroke={filled || half ? '#fbbf24' : '#6b7280'}
        strokeWidth="1.5"
        className={filled ? 'filter-glow' : ''}
        style={{
          filter: filled ? 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.6))' : 'none'
        }}
      />
    </svg>
  );

  return (
    <div className={cn('nova-star-rating-container', className)}>
      <div 
        className={cn(
          'nova-star-rating',
          `nova-star-rating-${size}`,
          { 'nova-star-rating-readonly': readonly }
        )}
        style={{ gap: currentSize.gap }}
        role={readonly ? 'img' : 'radiogroup'}
        aria-label={`Rating: ${value} out of ${maxRating} stars`}
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = getStarValue(index);
          const rating = index + 1;
          
          return (
            <button
              key={index}
              type="button"
              className={cn(
                'nova-star-item',
                `nova-star-item-${starValue}`,
                {
                  'nova-star-item-interactive': !readonly,
                  'nova-star-item-readonly': readonly
                }
              )}
              onClick={() => handleClick(rating)}
              onMouseEnter={() => handleMouseEnter(rating)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              aria-label={`Rate ${rating} star${rating !== 1 ? 's' : ''}`}
              role={readonly ? 'presentation' : 'radio'}
              aria-checked={!readonly && value === rating}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: readonly ? 'default' : 'pointer',
                borderRadius: '4px',
                transition: 'all 0.2s ease-out'
              }}
            >
              <StarIcon 
                filled={starValue === 'filled'}
                half={starValue === 'half'}
                size={currentSize}
              />
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className="nova-star-rating-value">
          {value.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
};

// Separate component for displaying aggregate ratings
export const StarDisplay = ({ 
  rating, 
  count, 
  size = 'medium', 
  showCount = true,
  className 
}) => {
  return (
    <div className={cn('nova-star-display', className)}>
      <StarRating 
        value={rating} 
        readonly 
        size={size} 
        allowHalf 
      />
      {showCount && count !== undefined && (
        <span className="nova-star-display-count">
          ({count} review{count !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
};

export default StarRating;