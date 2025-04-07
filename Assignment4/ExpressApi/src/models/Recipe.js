/**
 * File name : Recipe.js
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 6 April 2025
 */

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
}, { timestamps: false });

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;