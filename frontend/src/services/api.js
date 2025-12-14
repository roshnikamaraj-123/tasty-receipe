const API_BASE_URL = '/api';

export const api = {
  async getRecipes(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.maxTime) params.append('maxTime', filters.maxTime);
    if (filters.difficulty) params.append('difficulty', filters.difficulty);
    if (filters.search) params.append('search', filters.search);

    const response = await fetch(`${API_BASE_URL}/recipes?${params}`);
    if (!response.ok) throw new Error('Failed to fetch recipes');
    return response.json();
  },

  async getRecipe(id) {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    if (!response.ok) throw new Error('Failed to fetch recipe');
    return response.json();
  },

  async createRecipe(recipe) {
    const response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe)
    });
    if (!response.ok) throw new Error('Failed to create recipe');
    return response.json();
  },

  async getRecommendations() {
    const response = await fetch(`${API_BASE_URL}/recommendations`);
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    return response.json();
  },

  async getRecommendationsByIngredients(ingredients) {
    const response = await fetch(`${API_BASE_URL}/recommendations/by-ingredients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients })
    });
    if (!response.ok) throw new Error('Failed to get recommendations');
    return response.json();
  },

  async getSettings() {
    const response = await fetch(`${API_BASE_URL}/settings`);
    if (!response.ok) throw new Error('Failed to fetch settings');
    return response.json();
  },

  async updateSettings(settings) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return response.json();
  }
};

