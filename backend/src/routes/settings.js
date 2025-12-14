const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET user settings
router.get('/', (req, res) => {
  db.get('SELECT * FROM user_preferences ORDER BY updated_at DESC LIMIT 1', (err, row) => {
    if (err) {
      console.error('Error fetching settings:', err);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
    const settings = row || {
      dietary_restrictions: '[]',
      cuisine_types: '[]',
      max_cooking_time: null,
      difficulty_preference: null,
      theme: 'default'
    };

    res.json({
      ...settings,
      dietary_restrictions: JSON.parse(settings.dietary_restrictions || '[]'),
      cuisine_types: JSON.parse(settings.cuisine_types || '[]')
    });
  });
});

// POST update user settings
router.post('/', (req, res) => {
  const {
    dietary_restrictions = [],
    cuisine_types = [],
    max_cooking_time,
    difficulty_preference,
    theme = 'default'
  } = req.body;

  // Check if settings exist
  db.get('SELECT id FROM user_preferences ORDER BY updated_at DESC LIMIT 1', (err, row) => {
    if (err) {
      console.error('Error checking settings:', err);
      return res.status(500).json({ error: 'Failed to save settings' });
    }

    if (row) {
      // Update existing settings
      const stmt = db.prepare(`UPDATE user_preferences SET
        dietary_restrictions = ?,
        cuisine_types = ?,
        max_cooking_time = ?,
        difficulty_preference = ?,
        theme = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`);

      stmt.run(
        JSON.stringify(dietary_restrictions),
        JSON.stringify(cuisine_types),
        max_cooking_time,
        difficulty_preference,
        theme,
        row.id,
        function(updateErr) {
          if (updateErr) {
            console.error('Error updating settings:', updateErr);
            return res.status(500).json({ error: 'Failed to save settings' });
          }
          res.json({ success: true, id: row.id });
        }
      );

      stmt.finalize();
    } else {
      // Insert new settings
      const stmt = db.prepare(`INSERT INTO user_preferences 
        (dietary_restrictions, cuisine_types, max_cooking_time, difficulty_preference, theme)
        VALUES (?, ?, ?, ?, ?)`);

      stmt.run(
        JSON.stringify(dietary_restrictions),
        JSON.stringify(cuisine_types),
        max_cooking_time,
        difficulty_preference,
        theme,
        function(insertErr) {
          if (insertErr) {
            console.error('Error inserting settings:', insertErr);
            return res.status(500).json({ error: 'Failed to save settings' });
          }
          res.json({ success: true, id: this.lastID });
        }
      );

      stmt.finalize();
    }
  });
});

module.exports = router;

