import React from 'react';
import '../styles/components.css';

const RecipeCard = ({ recipe, onClick }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'var(--success)';
      case 'intermediate': return 'var(--warning)';
      case 'advanced': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    return difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Easy';
  };

  return (
    <article 
      className="recipe-card fade-in"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View recipe: ${recipe.name}. ${recipe.description}. Cooking time: ${recipe.time} minutes. Difficulty: ${recipe.difficulty || 'beginner'}.`}
    >
      <div className="recipe-card-image-container">
        <img 
          src={recipe.image_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop'} 
          alt={recipe.name}
          className="recipe-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=300&fit=crop';
          }}
        />
        <div className="recipe-card-overlay">
          <span 
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(recipe.difficulty) }}
          >
            {getDifficultyLabel(recipe.difficulty)}
          </span>
          <span className="time-badge">
            ⏱️ {recipe.time} min
          </span>
        </div>
      </div>
      
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.name}</h3>
        <div className="recipe-card-meta">
          <span className="recipe-card-category">{recipe.category}</span>
          {recipe.servings && (
            <>
              <span className="meta-separator">•</span>
              <span className="recipe-card-servings">👥 {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
            </>
          )}
        </div>
        <p className="recipe-card-description">{recipe.description}</p>
        
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="recipe-card-tags">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag-chip">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

export default RecipeCard;

