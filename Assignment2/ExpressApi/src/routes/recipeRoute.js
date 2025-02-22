/**
 * File name : recipeRoute.js
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 21 feb 2025
 */


const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Get all recipes
router.get('/', recipeController.getAllRecipes);

// Get recipe by ID
router.get('/:id', recipeController.getRecipeById);

// Create new recipe
router.post('/', recipeController.createRecipe);

// Update recipe
router.put('/:id', recipeController.updateRecipe);

// Delete recipe
router.delete('/:id', recipeController.deleteRecipe);

module.exports = router;