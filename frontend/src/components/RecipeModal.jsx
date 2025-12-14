import React, { useState } from 'react';
import '../styles/components.css';

const RecipeModal = ({ recipe, onClose }) => {
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  if (!recipe) return null;

  const handleIngredientToggle = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleShoppingList = () => {
    const unchecked = recipe.ingredients
      .filter((_, index) => !checkedIngredients[index])
      .join('\n');
    
    if (unchecked) {
      const blob = new Blob([unchecked], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${recipe.name}-shopping-list.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <div className="modal-header">
          <div className="modal-image-container">
            <img 
              src={recipe.image_url || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=400&fit=crop'} 
              alt={recipe.name}
              className="modal-image"
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=400&fit=crop';
              }}
            />
          </div>
          <div className="modal-title-section">
            <h2 className="modal-title">{recipe.name}</h2>
            <div className="modal-meta">
              <span className="modal-category">{recipe.category}</span>
              <span className="meta-separator">•</span>
              <span className="modal-time">⏱️ {recipe.time} minutes</span>
              {recipe.servings && (
                <>
                  <span className="meta-separator">•</span>
                  <span className="modal-servings">👥 {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}</span>
                </>
              )}
            </div>
            {recipe.description && (
              <p className="modal-description">{recipe.description}</p>
            )}
          </div>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3 className="section-title">
              <span className="section-icon">🥘</span> Ingredients
            </h3>
            <div className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <label 
                  key={index} 
                  className={`ingredient-item ${checkedIngredients[index] ? 'checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={checkedIngredients[index] || false}
                    onChange={() => handleIngredientToggle(index)}
                    className="ingredient-checkbox"
                  />
                  <span className="ingredient-text">{ingredient}</span>
                </label>
              ))}
            </div>
            <button 
              className="btn btn-secondary shopping-list-btn"
              onClick={handleShoppingList}
            >
              📝 Generate Shopping List
            </button>
          </div>

          <div className="modal-section">
            <h3 className="section-title">
              <span className="section-icon">📋</span> Step-by-Step Instructions
            </h3>
            <div className="steps-container">
              {recipe.steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`step-item ${currentStep === index ? 'active' : ''}`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <p className="step-text">{step}</p>
                    {currentStep === index && (
                      <div className="step-indicator">Current step</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="steps-navigation">
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                ← Previous
              </button>
              <span className="steps-counter">
                Step {currentStep + 1} of {recipe.steps.length}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentStep(Math.min(recipe.steps.length - 1, currentStep + 1))}
                disabled={currentStep === recipe.steps.length - 1}
              >
                Next →
              </button>
            </div>
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="modal-section">
              <h3 className="section-title">Tags</h3>
              <div className="modal-tags">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="tag-chip">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;

