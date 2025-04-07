/**
 * File name : seedDatabase.js
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 20 March 2025
 */

const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const recipes = require('../data/recipes.json');  
require('dotenv').config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing recipes
        await Recipe.deleteMany({});
        console.log('Cleared existing recipes');

        // Insert new recipes
        await Recipe.insertMany(recipes);
        console.log('Inserted new recipes');

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
