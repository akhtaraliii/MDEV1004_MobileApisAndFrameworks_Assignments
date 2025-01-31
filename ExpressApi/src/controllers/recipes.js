/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200568437
 * Date: 30th Jan 2025
 */

const fs = require('fs');
const path = require('path');


const getTopRecipes = (req, res) => {
  const dataPath = path.join(__dirname, '../../data/recipies.json');
  
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data file' });
    }
    
    const recipes = JSON.parse(data);
    res.json(recipes);
  });
};

module.exports = { getTopRecipes };
