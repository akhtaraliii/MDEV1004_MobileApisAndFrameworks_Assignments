/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 30th Jan 2025
 */

const fs = require('fs');
const path = require('path');


const getTopRecipes = (req, res) => {
  // Define the path to the recipes data file
  const dataPath = path.join(__dirname, '../../data/recipies.json');
  // Read the JSON file asynchronously
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data file' });
    }
    // Parse the JSON data from the file
    const recipes = JSON.parse(data);
    // Send the parsed recipes as a JSON response
    res.json(recipes);
  });
};
// Export the function to be used in other parts of the application
module.exports = { getTopRecipes };
