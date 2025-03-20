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

// Fetch dashboard data
async function fetchDashboard() {
    if (!authToken) return;

    try {
        const response = await fetch('/auth/dashboard', {
            headers: {
                'x-access-token': authToken
            }
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            console.log('Dashboard data:', data.data);
            // Update UI with dashboard data if needed
        } else {
            console.error('Dashboard error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching dashboard:', error);
    }
}

// Display recipes in cards
function displayRecipes(recipes) {
    if (!recipes || recipes.length === 0) {
        recipesList.innerHTML = '<div class="col-12 text-center">No recipes found</div>';
        return;
    }

    recipesList.innerHTML = recipes.map(recipe => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${recipe.recipeName || 'No Title'}</h5>
                    <p class="card-text">${recipe.description || 'No description available'}</p>
                    <div class="mb-2">
                        <strong>Cuisine:</strong> ${recipe.cuisine || 'Not specified'}<br>
                        <strong>Difficulty:</strong> ${recipe.difficulty || 'Not specified'}<br>
                        <strong>Cooking Time:</strong> ${recipe.cookingTime || 'Not specified'}<br>
                        <strong>Rating:</strong> ${recipe.averageRating?.toFixed(1) || 'No ratings'}
                    </div>
                    <button class="btn btn-primary" onclick="showRecipeDetails('${recipe._id}')">View Details</button>
                </div>
            </div>
        </div>
    `).join('');
}