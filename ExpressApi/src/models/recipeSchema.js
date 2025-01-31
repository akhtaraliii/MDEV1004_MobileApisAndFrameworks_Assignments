
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  recipeName: { type: String, required: true },
  ingredients: { type: [String], required: true },
  cookingTime: { type: String, required: true },
  difficulty: { type: String, required: true },
  cuisine: { type: String, required: true },
  description: { type: String, required: true },
  photoLink: { type: String, required: true },
  averageRating: { type: Number, required: true }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
