const db = require('../config/database');

class Recipe {
  static getAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM recipes WHERE 1=1';
      const params = [];

      if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
      }

      if (filters.maxTime) {
        query += ' AND time <= ?';
        params.push(filters.maxTime);
      }

      if (filters.difficulty) {
        query += ' AND difficulty = ?';
        params.push(filters.difficulty);
      }

      if (filters.search) {
        query += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC';

      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
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
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM recipes WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            ...row,
            ingredients: JSON.parse(row.ingredients || '[]'),
            steps: JSON.parse(row.steps || '[]'),
            tags: JSON.parse(row.tags || '[]')
          });
        }
      });
    });
  }

  static create(recipe) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`INSERT INTO recipes (name, category, time, difficulty, servings, image_url, ingredients, steps, tags, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      
      stmt.run(
        recipe.name,
        recipe.category,
        recipe.time,
        recipe.difficulty || 'beginner',
        recipe.servings || 1,
        recipe.image_url || '',
        JSON.stringify(recipe.ingredients || []),
        JSON.stringify(recipe.steps || []),
        JSON.stringify(recipe.tags || []),
        recipe.description || ''
      , function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });

      stmt.finalize();
    });
  }
}

module.exports = Recipe;

