const express = require('express');
const router = express.Router();
const { getTopRecipes } = require('../controllers/recipies'); // Import controller

// Define routes
router.get('/', getTopRecipes); // Get top 20 recipes

module.exports = router;