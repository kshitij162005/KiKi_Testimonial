import React, { useState } from 'react';
import { Clock, Info } from 'lucide-react';
import { cn } from '../../../lib/utils';
import './ComingSoonBadge.css';

const ComingSoonBadge = ({
  feature = 'This feature',
  expectedDate,
  description,
  variant = 'default',
  size = 'medium',
  showTooltip = true,
  className,
  onClick
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const variants = {
    default: 'coming-soon-default',
    subtle: 'coming-soon-subtle',
    prominent: 'coming-soon-prominent'
  };

  const sizes = {
    small: 'coming-soon-sm',
    medium: 'coming-soon-md',
    large: 'coming-soon-lg'
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (showTooltip) {
      setIsTooltipVisible(!isTooltipVisible);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={cn('coming-soon-container', className)}>
      <div
        className={cn(
          'coming-soon-badge',
          variants[variant],
          sizes[size],
          {
            'coming-soon-interactive': onClick || showTooltip,
            'coming-soon-tooltip-active': isTooltipVisible
          }
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role={onClick || showTooltip ? 'button' : 'status'}
        tabIndex={onClick || showTooltip ? 0 : -1}
        aria-label={`${feature} is coming soon${expectedDate ? ` - expected ${expectedDate}` : ''}`}
      >
        <Clock className="coming-soon-icon" />
        <span className="coming-soon-text">Coming Soon</span>
      </div>

      {isTooltipVisible && (showTooltip || description || expectedDate) && (
        <div className="coming-soon-tooltip">
          <div className="coming-soon-tooltip-content">
            <div className="coming-soon-tooltip-header">
              <Info className="w-4 h-4 text-blue-400" />
              <span className="coming-soon-tooltip-title">
                {feature} - Coming Soon
              </span>
            </div>
            
            {description && (
              <p className="coming-soon-tooltip-description">
                {description}
              </p>
            )}
            
            {expectedDate && (
              <div className="coming-soon-tooltip-date">
                <strong>Expected:</strong> {expectedDate}
              </div>
            )}
            
            <div className="coming-soon-tooltip-footer">
              <span className="text-xs text-gray-400">
                We'll notify you when it's ready!
              </span>
            </div>
          </div>
          
          <div className="coming-soon-tooltip-arrow" />
        </div>
      )}
    </div>
  );
};

// Preset configurations for common use cases
export const VideoFeedbackComingSoon = () => (
  <ComingSoonBadge
    feature="Video Feedback"
    description="Collect video testimonials from your customers with our upcoming video recording feature."
    expectedDate="Q2 2024"
    variant="prominent"
  />
);

export const AdvancedAnalyticsComingSoon = () => (
  <ComingSoonBadge
    feature="Advanced Analytics"
    description="Get deeper insights with advanced analytics, custom reports, and data export capabilities."
    expectedDate="Q1 2024"
    variant="default"
  />
);

export const IntegrationsComingSoon = () => (
  <ComingSoonBadge
    feature="Third-party Integrations"
    description="Connect with your favorite tools including Slack, Zapier, and more."
    expectedDate="Coming Soon"
    variant="subtle"
  />
);

export default ComingSoonBadge;