import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = ({ variant = 'default', children }) => {
  return (
    <div className={`animated-background animated-background-${variant}`}>
      {/* Floating orbs */}
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
        <div className="orb orb-5"></div>
      </div>
      
      {/* Grid pattern */}
      <div className="grid-pattern"></div>
      
      {/* Gradient overlays */}
      <div className="gradient-overlay gradient-overlay-1"></div>
      <div className="gradient-overlay gradient-overlay-2"></div>
      <div className="gradient-overlay gradient-overlay-3"></div>
      
      {/* Content */}
      <div className="animated-background-content">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;