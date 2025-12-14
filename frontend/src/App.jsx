import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import RecipeGrid from './components/RecipeGrid';
import RecipeModal from './components/RecipeModal';
import Filters from './components/Filters';
import SettingsPanel from './components/SettingsPanel';
import AIRecommendations from './components/AIRecommendations';
import { AppProvider } from './context/AppContext';
import './styles/components.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    const handleRecipeClick = (event) => {
      setSelectedRecipe(event.detail);
    };

    window.addEventListener('recipeClick', handleRecipeClick);
    return () => window.removeEventListener('recipeClick', handleRecipeClick);
  }, []);

  return (
    <AppProvider>
      <div className="app">
        <Header 
          onSettingsClick={() => setShowSettings(true)}
          onRecommendationsClick={() => setShowRecommendations(!showRecommendations)}
        />
        
        <main className="main-content">
          <div className="container">
            <Filters />
            
            {showRecommendations && (
              <AIRecommendations onClose={() => setShowRecommendations(false)} />
            )}
            
            <RecipeGrid onRecipeClick={setSelectedRecipe} />
          </div>
        </main>

        {selectedRecipe && (
          <RecipeModal 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)} 
          />
        )}

        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </div>
    </AppProvider>
  );
}

export default App;

