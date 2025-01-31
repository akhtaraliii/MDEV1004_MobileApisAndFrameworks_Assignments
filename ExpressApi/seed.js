/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 30th Jan 2025
 */

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
    },
    {
      recipeName: "Chicken Curry",
      ingredients: ["chicken", "curry powder", "onion", "garlic", "tomato"],
      cookingTime: "60 minutes",
      difficulty: "Hard",
      cuisine: "Indian",
      description: "A rich and spicy curry...",
      photoLink: "https://images.app.goo.gl/c8o77yM3R8qMRDuw5",
      averageRating: 4.7
    },
    {
      recipeName: "Vegetable Stir-fry",
      ingredients: ["broccoli", "carrot", "soy sauce", "ginger", "garlic"],
      cookingTime: "30 minutes",
      difficulty: "Easy",
      cuisine: "Asian",
      description: "A healthy vegetable stir-fry...",
      photoLink: "https://images.app.goo.gl/n2S2W1KM4shsypiH6",
      averageRating: 4.2
    },
    {
      recipeName: "Butter Chicken (Murgh Makhani)",
      ingredients: ["Chicken", "Butter", "Cream", "Tomatoes", "Onions", "Garlic", "Ginger","Garam Masala"],
      cookingTime: "50 minutes",
      difficulty: "Hard",
      cuisine: "Indian",
      description: "A rich and creamy tomato-based curry with tender chicken, best served with naan or rice.",
      photoLink: "https://images.app.goo.gl/7VqdZJTaD3wc1Fii7",
      averageRating: 4.8
    },
    {
      recipeName: "Paneer Tikka",
      ingredients: ["Paneer", "Yogurt", "Bell Peppers", "Onions", "Tandoori Spices"],
      cookingTime: "40 minutes",
      difficulty: "Easy",
      cuisine: "Indian",
      description: "Marinated paneer cubes grilled to perfection, served with mint chutney.",
      photoLink: "https://images.app.goo.gl/qiCwbMDotFgFzSs7A",
      averageRating: 4.7
    },
    {
      recipeName: "Dal Tadka",
      ingredients: ["Lentils (Toor Dal)", "Tomatoes", "Garlic", "Cumin", "Mustard Seeds",
      "Ghee"],
      cookingTime: "30 minutes",
      difficulty: "Easy",
      cuisine: "Indian",
      description: "A comforting lentil dish with a flavorful tempering of spices and garlic.",
      photoLink: "https://images.app.goo.gl/3LJxHrBravQHh4bo9",
      averageRating: 4.6
    },
    {
      recipeName: "Chole (Chickpea Curry)",
      ingredients: ["Chickpeas", "Onions", "Tomatoes", "Garlic", "Ginger", "Chole Masala"],
      cookingTime: "45 minutes",
      difficulty: "Medium",
      cuisine: "Indian",
      description: "A hearty and spicy chickpea curry, often served with bhature or rice.",
      photoLink: "https://images.app.goo.gl/htQbL4y2Eza9JB4C7",
      averageRating: 4.7
    },
    {
      recipeName: "Aloo Paratha",
      ingredients: ["Wheat Flour", "Potatoes", "Spices", "Butter", "Green Chilies"],
      cookingTime: "25 minutes",
      difficulty: "Easy",
      cuisine: "Indian",
      description: "A stuﬀed Indian flatbread with a spicy mashed potato filling, served with yogurt or pickle.",
      photoLink: "https://images.app.goo.gl/qGEmiRc79gURZUmb9",
      averageRating: 4.8
    },
    {
      recipeName: "Masala Dosa",
      ingredients: ["Rice", "Urad Dal", "Potatoes", "Mustard Seeds", "Curry Leaves"],
      cookingTime: "1 hour",
      difficulty: "Hard",
      cuisine: "South Indian",
      description: "A crispy fermented rice pancake filled with spiced mashed potatoes, served with chutney and sambar.",
      photoLink: "https://images.app.goo.gl/oXSPAKaaeD55MJF29",
      averageRating: 4.9
    },
    {
      recipeName: "Matar Paneer",
      ingredients: ["Paneer", "Peas", "Tomatoes", "Onions", "Garam Masala", "Cream"],
      cookingTime: "40 minutes",
      difficulty: "Medium",
      cuisine: "Indian",
      description: "A delicious North Indian curry with paneer cubes and green peas in a tomato-based gravy.",
      photoLink: "https://images.app.goo.gl/pL8d8huhmPbWDDta9",
      averageRating: 4.7
    },
    {
      recipeName: "Samosa",
      ingredients: ["Flour", "Potatoes", "Peas", "Spices", "Oil"],
      cookingTime: "50 minutes",
      difficulty: "Medium",
      cuisine: "Indian",
      description: "Crispy fried pastries filled with a spicy potato and pea mixture, served with chutney.",
      photoLink: "https://images.app.goo.gl/cUPDqbP7set2EPMA8",
      averageRating: 4.8
    },
    {
      recipeName: "Rajma (Kidney Bean Curry)",
      ingredients: ["Kidney Beans", "Onions", "Tomatoes", "Garlic", "Ginger", "Spices"],
      cookingTime: "50 minutes",
      difficulty: "Medium",
      cuisine: "Indian",
      description: "A delicious and nutritious curry made with kidney beans in a thick, spicy gravy.",
      photoLink: "https://images.app.goo.gl/Kr5NaWmGybrwh7iJ7",
      averageRating: 4.6
    },
    {
      recipeName: "Bhindi Masala (Okra Stir Fry)",
      ingredients: ["Okra", "Onions", "Tomatoes", "Garlic", "Spices"],
      cookingTime: "30 minutes",
      difficulty: "Easy",
      cuisine: "Indian",
      description: "A simple and flavorful stir-fry made with okra, onions, and aromatic spices.",
      photoLink: "https://images.app.goo.gl/kVocYqBubYT1Dc597",
      averageRating: 4.5
      
    },
    {
      recipeName: "Palak Paneer",
      ingredients: ["Spinach", "Paneer", "Onions", "Tomatoes", "Garlic", "Cream"],
      cookingTime: "40 minutes",
      difficulty: "Medium",
      cuisine: "Indian",
      description: "A creamy spinach curry with soft paneer cubes, best paired with naan or roti.",
      photoLink: "https://images.app.goo.gl/t4UfPrbZad4tMqBu8",
      averageRating: 4.7
    },
    {
      recipeName: "Pani Puri",
      ingredients: ["Semolina", "Flour", "Potatoes", "Chickpeas", "Tamarind", "Mint"],
      cookingTime: "45 minutes",
      difficulty: "Medium",
      cuisine: "Indian",
      description: "Crispy, hollow puris filled with spicy and tangy water, potatoes, and chickpeas.",
      photoLink: "https://images.app.goo.gl/SSkGRD5xuoTKJVJF7",
      averageRating: 4.9
    },
    {
      recipeName: "Baingan Bharta (Smoked Eggplant Curry)",
      ingredients: ["Eggplant", "Tomatoes", "Onions", "Garlic", "Mustard Seeds", "Spices"],
      cookingTime: "35 minutes",
      difficulty: "Medium",
      cuisine: "Indian",
      description: "A smoky-flavored mashed eggplant dish cooked with spices and served with roti.",
      photoLink: "https://images.app.goo.gl/36xsCsAxFEhWHucVA",
      averageRating: 4.6
    },
    {
      recipeName: "Ras Malai",
      ingredients: ["Paneer (Chhena)", "Milk", "Sugar", "Saffron", "Cardamom"],
      cookingTime: "60 minutes",
      difficulty: "Hard",
      cuisine: "Indian",
      description: "Soft paneer dumplings soaked in sweetened saffron milk.",
      photoLink: "https://images.app.goo.gl/5MqR5rTbg7YrT46s6",
      averageRating: 4.9
    },
    {
      recipeName: "Gajar Ka Halwa (Carrot Pudding)",
      ingredients: ["Carrots", "Milk", "Sugar", "Ghee", "Cardamom", "Nuts"],
      cookingTime: "50 minutes",
      difficulty: "Medium",
      cuisine: "Indian",
      description: "A rich and sweet carrot-based dessert, garnished with dry fruits.",
      photoLink: "https://images.app.goo.gl/oyHxT534vtreGhYLA",
      averageRating: 4.8
    },
    {
      recipeName: "Dhokla",
      ingredients: ["Gram Flour (Besan)", "Yogurt", "Turmeric", "Mustard Seeds", "Green Chilies"],
      cookingTime: "30 minutes",
      difficulty: "Medium",
      cuisine: "Gujarati",
      description: "A soft, steamed savory cake made from gram flour, perfect for breakfast or snacks.",
      photoLink: "https://images.app.goo.gl/KjMtWzr5C3g7ZRji7",
      averageRating: 4.7
    },
    {
      recipeName: "Pav Bhaji",
      ingredients: ["Potatoes", "Tomatoes", "Onions", "Capsicum", "Butter", "Pav Bhaji Masala", "Pav (Bread Rolls)"],
      cookingTime: "40 minutes",
      difficulty: "Medium",
      cuisine: "Maharashtrian",
      description: "A spicy and buttery vegetable mash served with toasted pav bread.",
      photoLink: "https://images.app.goo.gl/qXfJJr99jFQttkuZ7",
      averageRating: 4.8
    },
    {
      recipeName: "Chicken Korma",
      ingredients: ["Chicken", "Yogurt", "Onions", "Cashew Paste", "Garam Masala", "Cream"],
      cookingTime: "50 minutes",
      difficulty: "Medium",
      cuisine: "Mughlai",
      description: "A rich and creamy Mughlai-style chicken curry cooked with yogurt and cashews.",
      photoLink: "https://images.app.goo.gl/CWSePBythYtCoSfS7",
      averageRating: 4.7
    },
    {
      recipeName: "Lassi",
      ingredients: ["Yogurt", "Sugar", "Cardamom", "Saffron", "Rose Water"],
      cookingTime: "10 minutes",
      difficulty: "Easy",
      cuisine: "Punjabi",
      description: "A refreshing and creamy yogurt-based drink, available in sweet or salty versions.",
      photoLink: "https://images.app.goo.gl/MjDVtxgJRyWbnRsM7",
      averageRating: 4.9
    },
    {
      recipeName: "Peda (Milk Fudge)",
      ingredients: ["Milk", "Sugar", "Cardamom", "Saffron", "Nuts"],
      cookingTime: "45 minutes",
      difficulty: "Medium",
      cuisine: "Indian",
      description: "A soft and rich milk-based sweet flavored with cardamom and saffron.",
      photoLink: "https://images.app.goo.gl/aTSEoNbZtvnTpH4z8",
      averageRating: 4.7
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