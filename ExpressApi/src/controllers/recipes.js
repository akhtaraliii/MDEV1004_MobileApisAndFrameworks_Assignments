const fs = require('fs');
const path = require('path');


const getTopRecipes = (req, res) => {
  const dataPath = path.join(__dirname, '../../data/recipes.json');
  
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading data file' });
    }
    
    const recipes = JSON.parse(data);
    res.json(recipes.slice(0, 21));
  });
};

module.exports = { getTopRecipes };
