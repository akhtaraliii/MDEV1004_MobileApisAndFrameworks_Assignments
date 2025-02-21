/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 30th Jan 2025
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const recipeRoutes = require('./src/routes/recipeRoute'); // Import routes

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json()); 


/**
 * Connect to MongoDB database
 * Logs success or failure message
 */
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

/**
 * GET all recipes
 */
app.use('/recipes', recipeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
