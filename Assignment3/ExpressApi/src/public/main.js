// DOM Elements
const recipesList = document.getElementById('recipesList');
const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
const modalTitle = document.querySelector('#recipeModal .modal-title');
const modalBody = document.querySelector('#recipeModal .modal-body');

// Keep track of current recipes
let currentRecipes = [];

// Fetch recipes
async function fetchRecipes() {
    try {
        const response = await fetch('/recipes');
        const data = await response.json();
        if (data.status === 'success') {
            currentRecipes = data.data;
            displayRecipes(data.data);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
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

// Show recipe details in modal
function showRecipeDetails(recipeId) {
    const recipe = currentRecipes.find(r => r._id === recipeId);
    if (!recipe) return;

    modalTitle.textContent = recipe.recipeName;
    modalBody.innerHTML = `
        <div class="recipe-details">
            <div class="mb-3">
                <h6>Description</h6>
                <p>${recipe.description || 'No description available'}</p>
            </div>
            <div class="mb-3">
                <h6>Ingredients</h6>
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            <div class="mb-3">
                <h6>Details</h6>
                <ul class="list-unstyled">
                    <li><strong>Cuisine:</strong> ${recipe.cuisine}</li>
                    <li><strong>Difficulty:</strong> ${recipe.difficulty}</li>
                    <li><strong>Cooking Time:</strong> ${recipe.cookingTime}</li>
                    <li><strong>Rating:</strong> ${recipe.averageRating?.toFixed(1) || 'No ratings'}</li>
                </ul>
            </div>
        </div>
    `;
    recipeModal.show();
}

// Initialize
fetchRecipes();
