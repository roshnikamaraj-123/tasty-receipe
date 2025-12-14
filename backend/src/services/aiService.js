const Recipe = require('../models/Recipe');

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.useOpenAI = !!this.openaiApiKey;
  }

  async getRecommendations(userPreferences = {}, favorites = []) {
    // Get all recipes
    const allRecipes = await Recipe.getAll();

    // If OpenAI is available, use it for smarter recommendations
    if (this.useOpenAI) {
      return this.getOpenAIRecommendations(allRecipes, userPreferences, favorites);
    }

    // Otherwise, use rule-based recommendations
    return this.getRuleBasedRecommendations(allRecipes, userPreferences, favorites);
  }

  async getOpenAIRecommendations(recipes, userPreferences, favorites) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: this.openaiApiKey });

      const favoriteNames = favorites.map(f => f.name).join(', ');
      const preferences = JSON.stringify(userPreferences);

      const prompt = `You are a recipe recommendation assistant for bachelors living away from home. 
      Recommend 5 recipes from this list: ${recipes.map(r => r.name).join(', ')}
      
      User preferences: ${preferences}
      Favorite recipes: ${favoriteNames || 'None yet'}
      
      Consider:
      - Easy recipes for beginners
      - Quick cooking times
      - Simple ingredients
      - Bachelor-friendly meals
      
      Return only a JSON array of recipe names, like: ["Recipe 1", "Recipe 2", ...]`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      });

      const response = completion.choices[0].message.content;
      const recommendedNames = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));

      return recipes.filter(r => recommendedNames.includes(r.name)).slice(0, 5);
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback to rule-based
      return this.getRuleBasedRecommendations(recipes, userPreferences, favorites);
    }
  }

  getRuleBasedRecommendations(recipes, userPreferences, favorites) {
    let scored = recipes.map(recipe => {
      let score = 0;

      // Prefer beginner-friendly recipes
      if (recipe.difficulty === 'beginner') score += 10;
      if (recipe.difficulty === 'intermediate') score += 5;

      // Prefer quick recipes
      if (recipe.time <= 15) score += 10;
      else if (recipe.time <= 30) score += 5;

      // Prefer recipes with fewer ingredients
      if (recipe.ingredients.length <= 5) score += 5;

      // Match user preferences
      if (userPreferences.difficulty_preference === recipe.difficulty) score += 8;
      if (userPreferences.max_cooking_time && recipe.time <= userPreferences.max_cooking_time) score += 8;
      if (userPreferences.category && recipe.category === userPreferences.category) score += 5;

      // Consider dietary restrictions
      if (userPreferences.dietary_restrictions) {
        const restrictions = JSON.parse(userPreferences.dietary_restrictions || '[]');
        const tags = recipe.tags.map(t => t.toLowerCase());
        if (restrictions.some(r => tags.includes(r.toLowerCase()))) score += 5;
      }

      // Time-based recommendations
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 11 && recipe.category === 'Breakfast') score += 10;
      if (hour >= 11 && hour < 15 && recipe.category === 'Lunch') score += 10;
      if (hour >= 15 && recipe.category === 'Dinner') score += 10;

      // Avoid recently favorited recipes (variety)
      const isFavorite = favorites.some(f => f.id === recipe.id);
      if (!isFavorite) score += 3;

      return { recipe, score };
    });

    // Sort by score and return top 5
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 5).map(s => s.recipe);
  }

  async suggestRecipeByIngredients(availableIngredients) {
    const allRecipes = await Recipe.getAll();
    
    const scored = allRecipes.map(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
      const available = availableIngredients.map(i => i.toLowerCase());
      
      let matchCount = 0;
      recipeIngredients.forEach(ing => {
        if (available.some(av => ing.includes(av) || av.includes(ing))) {
          matchCount++;
        }
      });

      const matchRatio = matchCount / recipeIngredients.length;
      return { recipe, score: matchRatio };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.filter(s => s.score > 0.3).slice(0, 5).map(s => s.recipe);
  }
}

module.exports = new AIService();

