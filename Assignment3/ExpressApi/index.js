/**
 * File name : index.js
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 20 March 2025
 */


const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const passport = require('./src/config/passport');
const recipeRoutes = require('./src/routes/recipeRoutes');
const authRoutes = require('./src/routes/authRoutes');
const Recipe = require('./src/models/Recipe');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src/public')));

// Initialize Passport
app.use(passport.initialize());

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return res.status(200).json({});
    }
    next();
});

// Routes
app.use('/recipes', recipeRoutes);
app.use('/auth', authRoutes);

// Function to seed the database
async function seedDatabase() {
  try {
      const recipesPath = path.join(__dirname, 'src/data/recipes.json');
      const recipesData = await fs.readFile(recipesPath, 'utf8');
      const recipes = JSON.parse(recipesData);
      
      // Clear existing recipes
      await Recipe.deleteMany({});
      console.log('Cleared existing recipes');
      
      // Insert new recipes
      await Recipe.insertMany(recipes);
      console.log('Database seeded successfully');
  } catch (error) {
      console.error('Error seeding database:', error);
  }
}

// Watch for changes in recipes.json
const recipesPath = path.join(__dirname, 'src/data/recipes.json');
fs.watch(path.dirname(recipesPath), async (eventType, filename) => {
    if (filename === 'recipes.json' && eventType === 'change') {
        try {
            // Wait a short time to ensure file writing is complete
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('Detected changes in recipes.json');
            await seedDatabase();
        } catch (error) {
            console.error('Error syncing file changes to MongoDB:', error);
        }
    }
});

// MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  
  // Seed database on startup
  await seedDatabase();
  
  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}\n`);
      console.log('API Endpoints:');
      console.log('  Auth:');
      console.log('   POST /auth/register  - Register new user');
      console.log('   POST /auth/login     - Login user');
      console.log('   POST /auth/logout    - Logout user');
      console.log('   GET  /auth/dashboard - Get user dashboard (Protected)\n');
      console.log('  Recipes:');
      console.log('   GET    /recipes     - Get all recipes');
      console.log('   GET    /recipes/:id - Get recipe by ID');
      console.log('   POST   /recipes     - Create new recipe');
      console.log('   PUT    /recipes/:id - Update recipe');
      console.log('   DELETE /recipes/:id - Delete recipe');
  });
}).catch(error => {
  console.error('Error connecting to MongoDB:', error);
});