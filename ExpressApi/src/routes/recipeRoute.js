const express = require('express');
const router = express.Router();
const { getTopRecipes } = require('../controllers/recipies'); 

// Define routes
router.get('/', getTopRecipes);

module.exports = router;