/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 30th Jan 2025
 */

const mongoose = require('mongoose');
/**
 * Recipe Schema Definition
 * Represents a recipe with name, ingredients, cooking time, difficulty, cuisine, description, photo, and rating
 */
const recipeSchema = new mongoose.Schema({
  recipeName: { type: String, required: true },
  ingredients: { type: [String], required: true }, // Array of indegredient names
  cookingTime: { type: String, required: true },
  difficulty: { type: String, required: true }, //Ensure difficulty
  cuisine: { type: String, required: true },
  description: { type: String, required: true },
  photoLink: { type: String, required: true }, // URL to recipe image
  averageRating: { type: Number, required: true }
});
/**
 * Recipe Model
 * returns Mongoose model for interacting with recipes collection
 */
const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
