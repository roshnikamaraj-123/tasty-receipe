import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import RecipeCard from './RecipeCard';
import '../styles/components.css';

const AIRecommendations = ({ onClose }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ingredientMode, setIngredientMode] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [loadingByIngredients, setLoadingByIngredients] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRecommendations();
      setRecommendations(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientSearch = async () => {
    if (!ingredients.trim()) return;

    try {
      setLoadingByIngredients(true);
      setError(null);
      const ingredientList = ingredients.split(',').map(i => i.trim()).filter(Boolean);
      const data = await api.getRecommendationsByIngredients(ingredientList);
      setRecommendations(data);
      setIngredientMode(true);
    } catch (err) {
      setError(err.message);
      console.error('Error getting recommendations:', err);
    } finally {
      setLoadingByIngredients(false);
    }
  };

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <div>
          <h2 className="recommendations-title">✨ AI Recommendations</h2>
          <p className="recommendations-subtitle">
            Personalized recipe suggestions just for you
          </p>
        </div>
        <button 
          className="btn btn-ghost"
          onClick={onClose}
          aria-label="Close recommendations"
        >
          ×
        </button>
      </div>

      <div className="recommendations-tabs">
        <button
          className={`recommendation-tab ${!ingredientMode ? 'active' : ''}`}
          onClick={() => {
            setIngredientMode(false);
            loadRecommendations();
          }}
        >
          🎯 For You
        </button>
        <button
          className={`recommendation-tab ${ingredientMode ? 'active' : ''}`}
          onClick={() => setIngredientMode(true)}
        >
          🥕 By Ingredients
        </button>
      </div>

      {ingredientMode && (
        <div className="ingredient-search-section">
          <div className="ingredient-input-group">
            <input
              type="text"
              className="ingredient-input"
              placeholder="Enter ingredients separated by commas (e.g., eggs, tomatoes, bread)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleIngredientSearch();
                }
              }}
            />
            <button
              className="btn btn-primary"
              onClick={handleIngredientSearch}
              disabled={loadingByIngredients || !ingredients.trim()}
            >
              {loadingByIngredients ? 'Searching...' : 'Find Recipes'}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="recommendations-loading">
          <div className="loading"></div>
          <p>Getting personalized recommendations...</p>
        </div>
      )}

      {error && (
        <div className="recommendations-error">
          <p>⚠️ {error}</p>
          <button className="btn btn-secondary" onClick={loadRecommendations}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && recommendations.length > 0 && (
        <div className="recommendations-grid">
          {recommendations.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => {
                // This will be handled by parent component
                window.dispatchEvent(new CustomEvent('recipeClick', { detail: recipe }));
              }}
            />
          ))}
        </div>
      )}

      {!loading && !error && recommendations.length === 0 && (
        <div className="recommendations-empty">
          <p>No recommendations found. Try adjusting your settings or search by ingredients.</p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;

