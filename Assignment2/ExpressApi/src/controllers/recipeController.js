/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 30th Jan 2025
 */

const Recipe = require('../models/Recipe');
const { updateRecipesFile } = require('../utils/jsonUtils');

// Get all recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json({
            status: 'success',
            results: recipes.length,
            data: recipes
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error retrieving recipes',
            error: error.message
        });
    }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
          return res.status(404).json({
              status: 'fail',
              message: 'Recipe not found'
          });
      }
      res.status(200).json({
          status: 'success',
          data: recipe
      });
  } catch (error) {
      res.status(500).json({
          status: 'error',
          message: 'Error retrieving recipe',
          error: error.message
      });
  }
};