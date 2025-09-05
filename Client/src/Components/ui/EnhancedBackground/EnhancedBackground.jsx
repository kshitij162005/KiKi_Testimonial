import React from 'react';
import './EnhancedBackground.css';

const EnhancedBackground = ({ variant = 'default', children }) => {
  return (
    <div className={`enhanced-background enhanced-background-${variant}`}>
      {/* Animated gradient orbs */}
      <div className="enhanced-background-orbs">
        <div className="enhanced-background-orb enhanced-background-orb-1"></div>
        <div className="enhanced-background-orb enhanced-background-orb-2"></div>
        <div className="enhanced-background-orb enhanced-background-orb-3"></div>
        <div className="enhanced-background-orb enhanced-background-orb-4"></div>
        <div className="enhanced-background-orb enhanced-background-orb-5"></div>
      </div>

      {/* Grid pattern */}
      <div className="enhanced-background-grid"></div>

      {/* Noise texture */}
      <div className="enhanced-background-noise"></div>

      {/* Gradient overlay */}
      <div className="enhanced-background-gradient"></div>

      {/* Content */}
      <div className="enhanced-background-content">
        {children}
      </div>
    </div>
  );
};

export default EnhancedBackground;