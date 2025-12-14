import React from 'react';
import RecipeCard from './RecipeCard';
import { useApp } from '../context/AppContext';
import '../styles/components.css';

const RecipeGrid = ({ onRecipeClick }) => {
  const { filteredRecipes, loading, error } = useApp();

  if (loading) {
    return (
      <div className="recipe-grid-container">
        <div className="skeleton-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>⚠️ {error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  if (filteredRecipes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>No recipes found</h3>
        <p>Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="recipe-grid-container">
      <div className="recipe-grid">
        {filteredRecipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => onRecipeClick(recipe)}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipeGrid;

