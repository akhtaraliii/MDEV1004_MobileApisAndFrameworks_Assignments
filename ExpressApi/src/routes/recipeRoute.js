/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200568437
 * Date: 30th Jan 2025
 */

const express = require('express');
const router = express.Router();
const { getTopRecipes } = require('../controllers/recipes'); 

// Define routes
router.get('/', getTopRecipes);

module.exports = router;