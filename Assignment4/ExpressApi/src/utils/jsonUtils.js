/**
 * File name : jsonUtils.js
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 6 April 2025
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

// Read recipes from JSON file
async function readRecipesFile() {
    try {
        const data = await fs.readFile(recipesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading recipes file:', error);
        return [];
    }
}

// Write recipes to JSON file and sync with MongoDB
async function writeRecipesFile(recipes) {
    try {
        // Remove timestamps from each recipe
        const cleanRecipes = recipes.map(recipe => {
            const { createdAt, updatedAt, ...cleanRecipe } = recipe.toObject ? recipe.toObject() : recipe;
            return cleanRecipe;
        });
        
        await fs.writeFile(recipesFilePath, JSON.stringify(cleanRecipes, null, 2), 'utf8');
        
        // Sync with MongoDB
        await syncToMongoDB(cleanRecipes);
    } catch (error) {
        console.error('Error writing recipes file:', error);
    }
}

// Sync data from JSON to MongoDB
async function syncToMongoDB(recipes) {
    try {
        // Clear existing recipes
        await Recipe.deleteMany({});
        
        // Insert new recipes
        await Recipe.insertMany(recipes);
        console.log('Synced recipes to MongoDB successfully');
    } catch (error) {
        console.error('Error syncing to MongoDB:', error);
    }
}

// Update recipes JSON file with current MongoDB data
async function updateRecipesFile() {
    try {
        // Get all recipes from MongoDB
        const recipes = await Recipe.find();
        
        // Write recipes to JSON file
        await writeRecipesFile(recipes);
        console.log('Recipes JSON file updated successfully');
    } catch (error) {
        console.error('Error updating recipes file:', error);
    }
}

module.exports = {
    readRecipesFile,
    writeRecipesFile,
    updateRecipesFile
};