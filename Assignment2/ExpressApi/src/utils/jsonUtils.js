/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 30th Jan 2025
 */

const fs = require('fs').promises;
const path = require('path');
const Recipe = require('../models/Recipe');

const recipesFilePath = path.join(__dirname, '../data/recipes.json');

// Watch for changes in the recipes.json file
require('fs').watch(path.dirname(recipesFilePath), async (eventType, filename) => {
    if (filename === 'recipes.json' && eventType === 'change') {
        try {
            // Wait a short time to ensure file writing is complete
            await new Promise(resolve => setTimeout(resolve, 100));
            const recipes = await readRecipesFile();
            await syncToMongoDB(recipes);
        } catch (error) {
            console.error('Error syncing file changes to MongoDB:', error);
        }
    }
});