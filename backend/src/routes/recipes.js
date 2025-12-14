const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// GET all recipes with optional filters
router.get('/', async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      maxTime: req.query.maxTime ? parseInt(req.query.maxTime) : null,
      difficulty: req.query.difficulty,
      search: req.query.search
    };

    const recipes = await Recipe.getAll(filters);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// GET recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.getById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// POST create new recipe
router.post('/', async (req, res) => {
  try {
    const recipeData = req.body;
    const id = await Recipe.create(recipeData);
    const newRecipe = await Recipe.getById(id);
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

module.exports = router;

