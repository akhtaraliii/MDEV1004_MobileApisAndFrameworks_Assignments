const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('./src/models/recipeSchema');


dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

  const recipes = [
    {
      recipeName: "Spaghetti Bolognese",
      ingredients: ["spaghetti", "ground beef", "tomato sauce", "garlic", "onion"],
      cookingTime: "45 minutes",
      difficulty: "Medium",
      cuisine: "Italian",
      description: "A classic Italian pasta dish...",
      photoLink: "https://images.app.goo.gl/PuY26PxJjipG3TRJA",
      averageRating: 4.5
    }
  ];

  const importData = async () => {
    try {
      await Recipe.deleteMany(); // Clear existing data
      console.log("Old data deleted");
  
      recipes.forEach((recipe) => {
        if (!recipe.difficulty) {
          console.warn("Warning: Missing difficulty field in:", recipe);
        }
      });
  
      await Recipe.insertMany(recipes);
      console.log("Data Imported Successfully");
      mongoose.connection.close();
    } catch (error) {
      console.error("Error:", error);
      mongoose.connection.close();
    }
  };
  
  importData();