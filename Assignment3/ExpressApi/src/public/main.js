// src/public/main.js - Part 1
const recipesList = document.getElementById('recipesList');
const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
let currentRecipes = [];
let authToken = localStorage.getItem('token');

async function fetchRecipes() {
    try {
        const response = await fetch('/recipes');
        const data = await response.json();
        if (data.status === 'success') {
            currentRecipes = data.data;
            displayRecipes(data.data);
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
    }
}