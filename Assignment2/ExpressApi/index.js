/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 30th Jan 2025
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
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
