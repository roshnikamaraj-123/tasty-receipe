const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../recipes.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create recipes table
    db.run(`CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      time INTEGER,
      difficulty TEXT,
      servings INTEGER,
      image_url TEXT,
      ingredients TEXT,
      steps TEXT,
      tags TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create user_preferences table
    db.run(`CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dietary_restrictions TEXT,
      cuisine_types TEXT,
      max_cooking_time INTEGER,
      difficulty_preference TEXT,
      theme TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create favorites table
    db.run(`CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    )`);

    // Insert sample recipes if table is empty
    db.get('SELECT COUNT(*) as count FROM recipes', (err, row) => {
      if (err) {
        console.error('Error checking recipes:', err);
        return;
      }
      if (row.count === 0) {
        insertSampleRecipes();
      }
    });
  });
}

function insertSampleRecipes() {
  const sampleRecipes = [
    {
      name: "Masala Omelette",
      category: "Breakfast",
      time: 10,
      difficulty: "beginner",
      servings: 1,
      image_url: "https://images.unsplash.com/photo-1615874959479-df48af5fbad4?w=400",
      ingredients: JSON.stringify(["2 eggs", "1 small onion", "1 green chili", "salt", "pepper", "1 tsp oil"]),
      steps: JSON.stringify([
        "Beat eggs with salt and pepper in a bowl.",
        "Add finely chopped onion and green chili to the egg mixture.",
        "Heat oil in a non-stick pan over medium heat.",
        "Pour the egg mixture into the pan and spread evenly.",
        "Cook for 2-3 minutes until the bottom is golden.",
        "Flip and cook the other side for 1-2 minutes.",
        "Serve hot with bread or roti."
      ]),
      tags: JSON.stringify(["eggs", "quick", "protein", "easy"]),
      description: "Spicy Indian-style omelette, quick and protein-rich. Perfect for a quick breakfast!"
    },
    {
      name: "Tomato Basil Pasta",
      category: "Lunch",
      time: 25,
      difficulty: "beginner",
      servings: 2,
      image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
      ingredients: JSON.stringify(["200g pasta", "2 cups tomatoes", "fresh basil", "olive oil", "salt", "garlic"]),
      steps: JSON.stringify([
        "Bring a large pot of salted water to boil.",
        "Add pasta and cook until al dente (check package instructions).",
        "While pasta cooks, heat olive oil in a pan.",
        "Add minced garlic and sauté for 30 seconds.",
        "Add chopped tomatoes and cook until soft.",
        "Add fresh basil leaves and season with salt.",
        "Drain pasta and add to the sauce.",
        "Toss everything together and serve hot."
      ]),
      tags: JSON.stringify(["pasta", "vegetarian", "italian"]),
      description: "Fresh and light pasta with tomato-basil sauce. Simple yet delicious!"
    },
    {
      name: "Chocolate Mug Cake",
      category: "Dessert",
      time: 5,
      difficulty: "beginner",
      servings: 1,
      image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
      ingredients: JSON.stringify(["4 tbsp flour", "2 tbsp sugar", "2 tbsp cocoa powder", "3 tbsp milk", "1 tbsp oil", "1/4 tsp baking powder"]),
      steps: JSON.stringify([
        "In a microwave-safe mug, mix flour, sugar, cocoa powder, and baking powder.",
        "Add milk and oil, mix well until smooth.",
        "Make sure there are no lumps in the batter.",
        "Microwave on high for 70-90 seconds (time may vary).",
        "Let it cool for 1 minute before eating.",
        "Top with ice cream or whipped cream if desired."
      ]),
      tags: JSON.stringify(["dessert", "quick", "sweet", "microwave"]),
      description: "Single-serve chocolate cake ready in minutes. Perfect for a quick dessert!"
    },
    {
      name: "Veggie Stir Fry",
      category: "Dinner",
      time: 20,
      difficulty: "beginner",
      servings: 2,
      image_url: "https://images.unsplash.com/photo-1563379091339-03246963d29c?w=400",
      ingredients: JSON.stringify(["mixed vegetables (bell peppers, carrots, broccoli)", "soy sauce", "garlic", "ginger", "sesame oil", "salt"]),
      steps: JSON.stringify([
        "Cut all vegetables into bite-sized pieces.",
        "Heat sesame oil in a large wok or pan over high heat.",
        "Add minced garlic and ginger, stir for 30 seconds.",
        "Add vegetables and stir-fry for 5-7 minutes until tender-crisp.",
        "Add soy sauce and salt to taste.",
        "Stir for another minute and serve hot with rice."
      ]),
      tags: JSON.stringify(["vegan", "quick", "healthy", "one-pot"]),
      description: "Fast and healthy mixed vegetable stir fry. Great for a quick dinner!"
    },
    {
      name: "Instant Noodles Upgrade",
      category: "Lunch",
      time: 10,
      difficulty: "beginner",
      servings: 1,
      image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
      ingredients: JSON.stringify(["1 packet instant noodles", "1 egg", "chopped spring onions", "soy sauce", "sesame oil"]),
      steps: JSON.stringify([
        "Boil water in a pot and cook noodles according to package instructions.",
        "While noodles cook, heat a small pan and fry an egg sunny-side up.",
        "Drain noodles and mix with the seasoning packet.",
        "Add a dash of soy sauce and sesame oil.",
        "Top with the fried egg and chopped spring onions.",
        "Serve immediately while hot."
      ]),
      tags: JSON.stringify(["quick", "easy", "budget-friendly", "comfort-food"]),
      description: "Elevate your instant noodles with a simple egg and some extras. Quick and satisfying!"
    },
    {
      name: "Grilled Cheese Sandwich",
      category: "Snack",
      time: 10,
      difficulty: "beginner",
      servings: 1,
      image_url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400",
      ingredients: JSON.stringify(["2 slices bread", "cheese slices", "butter", "optional: tomato slices"]),
      steps: JSON.stringify([
        "Butter one side of each bread slice.",
        "Place cheese (and tomato if using) between the unbuttered sides.",
        "Heat a pan over medium heat.",
        "Place sandwich in pan, buttered side down.",
        "Cook for 3-4 minutes until golden brown.",
        "Flip and cook the other side until golden and cheese is melted.",
        "Cut in half and serve hot."
      ]),
      tags: JSON.stringify(["quick", "comfort-food", "vegetarian", "easy"]),
      description: "Classic grilled cheese sandwich. Simple, quick, and always satisfying!"
    },
    {
      name: "Egg Fried Rice",
      category: "Lunch",
      time: 15,
      difficulty: "beginner",
      servings: 2,
      image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
      ingredients: JSON.stringify(["2 cups cooked rice", "2 eggs", "1 small onion", "soy sauce", "oil", "salt", "pepper", "optional: vegetables"]),
      steps: JSON.stringify([
        "Heat oil in a large pan or wok over high heat.",
        "Add chopped onion and cook until translucent.",
        "Push onions to one side, crack eggs into the pan and scramble.",
        "Add cooked rice and break up any clumps.",
        "Stir-fry for 3-4 minutes until rice is heated through.",
        "Add soy sauce, salt, and pepper to taste.",
        "Mix everything together and serve hot."
      ]),
      tags: JSON.stringify(["quick", "easy", "budget-friendly", "one-pot"]),
      description: "Simple and delicious fried rice. Perfect for using leftover rice!"
    },
    {
      name: "Scrambled Eggs with Toast",
      category: "Breakfast",
      time: 8,
      difficulty: "beginner",
      servings: 1,
      image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400",
      ingredients: JSON.stringify(["2-3 eggs", "butter", "salt", "pepper", "2 slices bread", "optional: cheese, herbs"]),
      steps: JSON.stringify([
        "Crack eggs into a bowl, add salt and pepper, and whisk lightly.",
        "Heat butter in a non-stick pan over medium-low heat.",
        "Pour in eggs and let them set slightly before gently stirring.",
        "Continue stirring until eggs are creamy but not dry.",
        "Toast bread slices until golden.",
        "Serve scrambled eggs on toast, optionally with cheese or herbs."
      ]),
      tags: JSON.stringify(["quick", "protein", "breakfast", "easy"]),
      description: "Classic breakfast that's quick, easy, and protein-packed!"
    },
    {
      name: "Simple Chicken Curry",
      category: "Dinner",
      time: 35,
      difficulty: "intermediate",
      servings: 2,
      image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
      ingredients: JSON.stringify(["300g chicken pieces", "1 onion", "2 tomatoes", "ginger-garlic paste", "curry powder", "oil", "salt", "water"]),
      steps: JSON.stringify([
        "Heat oil in a pot and add sliced onions. Cook until golden.",
        "Add ginger-garlic paste and cook for 1 minute.",
        "Add chopped tomatoes and cook until soft.",
        "Add chicken pieces and cook for 5 minutes until sealed.",
        "Add curry powder, salt, and enough water to cover.",
        "Simmer for 20-25 minutes until chicken is cooked through.",
        "Serve hot with rice or bread."
      ]),
      tags: JSON.stringify(["protein", "comfort-food", "one-pot"]),
      description: "Aromatic and flavorful chicken curry. Perfect for a satisfying dinner!"
    },
    {
      name: "Avocado Toast",
      category: "Breakfast",
      time: 5,
      difficulty: "beginner",
      servings: 1,
      image_url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
      ingredients: JSON.stringify(["1 ripe avocado", "2 slices bread", "salt", "pepper", "lemon juice", "optional: red pepper flakes, feta cheese"]),
      steps: JSON.stringify([
        "Toast bread slices until golden and crispy.",
        "Cut avocado in half, remove pit, and scoop out flesh.",
        "Mash avocado in a bowl with a fork.",
        "Add salt, pepper, and a squeeze of lemon juice.",
        "Spread avocado mixture on toast.",
        "Top with red pepper flakes or feta cheese if desired.",
        "Serve immediately."
      ]),
      tags: JSON.stringify(["quick", "healthy", "vegetarian", "easy"]),
      description: "Healthy and trendy avocado toast. Ready in minutes!"
    }
  ];

  const stmt = db.prepare(`INSERT INTO recipes (name, category, time, difficulty, servings, image_url, ingredients, steps, tags, description) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  sampleRecipes.forEach(recipe => {
    stmt.run(
      recipe.name,
      recipe.category,
      recipe.time,
      recipe.difficulty,
      recipe.servings,
      recipe.image_url,
      recipe.ingredients,
      recipe.steps,
      recipe.tags,
      recipe.description
    );
  });

  stmt.finalize();
  console.log('Sample recipes inserted');
}

module.exports = db;

