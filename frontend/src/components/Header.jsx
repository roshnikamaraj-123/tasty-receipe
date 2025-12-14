import React from 'react';
import '../styles/components.css';

const Header = ({ onSettingsClick, onRecommendationsClick }) => {
  return (
    <header className="header">
      <div className="container header-content">
        <div className="header-brand">
          <h1 className="brand-title">🍲 Recipe Finder</h1>
          <p className="brand-subtitle">Easy recipes for bachelors</p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-secondary header-btn"
            onClick={onRecommendationsClick}
            aria-label="AI Recommendations"
          >
            <span>✨</span> AI Recommendations
          </button>
          <button 
            className="btn btn-ghost header-btn"
            onClick={onSettingsClick}
            aria-label="Settings"
          >
            <span>⚙️</span> Settings
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

