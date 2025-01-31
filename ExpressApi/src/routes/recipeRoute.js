/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 30th Jan 2025
 */

const express = require('express'); // Import Express framework
const router = express.Router(); // Create an instance of Express Router
const { getTopRecipes } = require('../controllers/recipes'); // Import the controller function


// Handler for fetching top recipes.
router.get('/', getTopRecipes);

// Export the router to be used in the main application
module.exports = router;