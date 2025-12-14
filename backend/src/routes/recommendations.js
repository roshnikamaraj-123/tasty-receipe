const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const Recipe = require('../models/Recipe');
const db = require('../config/database');

// GET AI recommendations
router.get('/', async (req, res) => {
  try {
    // Get user preferences
    const preferences = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM user_preferences ORDER BY updated_at DESC LIMIT 1', (err, row) => {
        if (err) reject(err);
        else resolve(row || {});
      });
    });

    // Get favorites
    const favorites = await new Promise((resolve, reject) => {
      db.all(`
        SELECT r.* FROM recipes r
        INNER JOIN favorites f ON r.id = f.recipe_id
        ORDER BY f.created_at DESC
      `, (err, rows) => {
        if (err) reject(err);
        else {
          const recipes = rows.map(row => ({
            ...row,
            ingredients: JSON.parse(row.ingredients || '[]'),
            steps: JSON.parse(row.steps || '[]'),
            tags: JSON.parse(row.tags || '[]')
          }));
          resolve(recipes);
        }
      });
    });

    const recommendations = await aiService.getRecommendations(preferences, favorites);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// POST get recommendations by ingredients
router.post('/by-ingredients', async (req, res) => {
  try {
    const { ingredients } = req.body;
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }

    const recommendations = await aiService.suggestRecipeByIngredients(ingredients);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting ingredient-based recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;

