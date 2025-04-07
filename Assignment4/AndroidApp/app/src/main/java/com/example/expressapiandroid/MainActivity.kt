package com.example.expressapiandroid

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.expressapiandroid.adapters.RecipeAdapter
import com.example.expressapiandroid.api.RecipeApiService
import com.example.expressapiandroid.databinding.ActivityMainBinding
import com.example.expressapiandroid.models.Recipe
import com.example.expressapiandroid.models.RecipeResponse
import kotlinx.coroutines.*
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

/**
 * Main activity that displays a list of recipes fetched from the API,with auto-refresh functionality
 */
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var adapter: RecipeAdapter
    private lateinit var apiService: RecipeApiService
    private var refreshJob: Job? = null

    companion object {
        private const val TAG = "MainActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupRecyclerView()
        setupButtons()

        // Check if user is logged in
        val token = getSharedPreferences("auth", MODE_PRIVATE).getString("token", null)
        if (token == null || token.isEmpty()) {
            Log.d(TAG, "No valid token found, redirecting to login")
            // If not logged in, redirect to login
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
            return
        }
        Log.d(TAG, "Token found, proceeding with initialization")

        // Initialize Retrofit and API service
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }

        val okHttpClient = OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .addInterceptor { chain ->
                val original = chain.request()
                val request = original.newBuilder()
                    .header("Authorization", "Bearer $token")
                    .method(original.method, original.body)
                    .build()
                chain.proceed(request)
            }
            .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .writeTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .build()

        val gson = com.google.gson.GsonBuilder()
            .setLenient()
            .create()
            
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/")
            .addConverterFactory(GsonConverterFactory.create(gson))
            .client(okHttpClient)
            .build()
        apiService = retrofit.create(RecipeApiService::class.java)

        // Fetch recipes
        fetchRecipes()
        
        // Start auto-refresh
        startAutoRefresh()
    }

    // Fetches recipes from the API and updates the RecyclerView
    private fun setupRecyclerView() {
        adapter = RecipeAdapter(
            onItemClick = { recipe ->
                // Show recipe details
                Toast.makeText(this, "Clicked: ${recipe.recipeName}", Toast.LENGTH_SHORT).show()
            },
            onEditClick = { recipe ->
                showEditDialog(recipe)
            },
            onDeleteClick = { recipe ->
                showDeleteConfirmation(recipe)
            }
        )
        
        binding.recipesRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            this.adapter = this@MainActivity.adapter
            addItemDecoration(DividerItemDecoration(this@MainActivity, DividerItemDecoration.VERTICAL))
        }
    }

    private fun setupButtons() {
        binding.addRecipeButton.setOnClickListener {
            showAddDialog()
        }

        binding.logoutButton.setOnClickListener {
            // Clear token and redirect to login
            getSharedPreferences("auth", MODE_PRIVATE).edit().clear().apply()
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
        }
    }

    private fun showAddDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_recipe, null)
        val dialog = androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Add Recipe")
            .setView(dialogView)
            .setPositiveButton("Save") { dialog, _ -> 
                val name = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeNameInput).text.toString()
                val cuisine = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeCuisineInput).text.toString()
                val description = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeDescriptionInput).text.toString()
                val cookingTime = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeCookingTimeInput).text.toString()
                val difficulty = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeDifficultyInput).text.toString()
                val photoLink = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipePhotoLinkInput).text.toString()

                if (name.isBlank() || description.isBlank()) {
                    showError("Name and description are required")
                    return@setPositiveButton
                }

                val ingredients = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeIngredientsInput).text.toString()
                val rating = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeRatingInput).text.toString()

                if (name.isBlank() || cuisine.isBlank() || description.isBlank() || 
                    cookingTime.isBlank() || difficulty.isBlank() || photoLink.isBlank() || ingredients.isBlank()) {
                    showError("All fields except rating are required")
                    return@setPositiveButton
                }

                val ingredientsList = ingredients.split(",").map { it.trim() }.filter { it.isNotEmpty() }
                if (ingredientsList.isEmpty()) {
                    showError("Please add at least one ingredient")
                    return@setPositiveButton
                }

                val ratingValue = rating.toDoubleOrNull() ?: 0.0
                if (ratingValue !in 0.0..5.0) {
                    showError("Rating must be between 0 and 5")
                    return@setPositiveButton
                }

                val newRecipe = Recipe(
                    recipeName = name,
                    cuisine = cuisine,
                    description = description,
                    ingredients = ingredientsList,
                    cookingTime = cookingTime,
                    difficulty = difficulty,
                    photoLink = photoLink,
                    averageRating = ratingValue
                )

                createRecipe(newRecipe)
            }
            .setNegativeButton("Cancel", null)
            .create()

        dialog.show()
    }

    private fun showEditDialog(recipe: Recipe) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_recipe, null)
        val dialog = androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Edit Recipe")
            .setView(dialogView)
            .setPositiveButton("Save") { dialog, _ -> 
                val name = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeNameInput).text.toString()
                val cuisine = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeCuisineInput).text.toString()
                val description = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeDescriptionInput).text.toString()
                val cookingTime = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeCookingTimeInput).text.toString()
                val difficulty = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeDifficultyInput).text.toString()
                val photoLink = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipePhotoLinkInput).text.toString()

                if (name.isBlank() || description.isBlank()) {
                    showError("Name and description are required")
                    return@setPositiveButton
                }

                val ingredients = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeIngredientsInput).text.toString()
                val rating = dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeRatingInput).text.toString()

                if (name.isBlank() || cuisine.isBlank() || description.isBlank() || 
                    cookingTime.isBlank() || difficulty.isBlank() || photoLink.isBlank() || ingredients.isBlank()) {
                    showError("All fields except rating are required")
                    return@setPositiveButton
                }

                val ingredientsList = ingredients.split(",").map { it.trim() }.filter { it.isNotEmpty() }
                if (ingredientsList.isEmpty()) {
                    showError("Please add at least one ingredient")
                    return@setPositiveButton
                }

                val ratingValue = rating.toDoubleOrNull() ?: recipe.averageRating
                if (ratingValue !in 0.0..5.0) {
                    showError("Rating must be between 0 and 5")
                    return@setPositiveButton
                }

                val updatedRecipe = Recipe(
                    id = recipe.id,
                    recipeName = name,
                    cuisine = cuisine,
                    description = description,
                    ingredients = ingredientsList,
                    cookingTime = cookingTime,
                    difficulty = difficulty,
                    photoLink = photoLink,
                    averageRating = ratingValue
                )

                recipe.id?.let { id ->
                    updateRecipe(id, updatedRecipe)
                }
            }
            .setNegativeButton("Cancel", null)
            .create()

        // Pre-fill fields
        dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeNameInput).setText(recipe.recipeName)
        dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeCuisineInput).setText(recipe.cuisine)
        dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeDescriptionInput).setText(recipe.description)
        dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeIngredientsInput).setText(recipe.ingredients.joinToString(", "))
        dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeCookingTimeInput).setText(recipe.cookingTime)
        dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeDifficultyInput).setText(recipe.difficulty)
        dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipePhotoLinkInput).setText(recipe.photoLink)
        dialogView.findViewById<com.google.android.material.textfield.TextInputEditText>(R.id.recipeRatingInput).setText(recipe.averageRating.toString())

        dialog.show()
    }

    private fun showDeleteConfirmation(recipe: Recipe) {
        androidx.appcompat.app.AlertDialog.Builder(this)
            .setTitle("Delete Recipe")
            .setMessage("Are you sure you want to delete ${recipe.recipeName}?")
            .setPositiveButton("Delete") { _, _ ->
                recipe.id?.let { id ->
                    deleteRecipe(id)
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun createRecipe(recipe: Recipe) {
        Log.d(TAG, "Creating recipe: $recipe")
        Log.d(TAG, "Request URL: ${apiService.createRecipe(recipe).request().url}")
        Log.d(TAG, "Request body: $recipe")
        
        apiService.createRecipe(recipe).enqueue(object : Callback<RecipeResponse> {
            override fun onResponse(call: Call<RecipeResponse>, response: Response<RecipeResponse>) {
                Log.d(TAG, "Response code: ${response.code()}")
                Log.d(TAG, "Response headers: ${response.headers()}")
                val errorBody = response.errorBody()?.string()
                Log.d(TAG, "Error body: $errorBody")
                Log.d(TAG, "Response raw: ${response.raw()}")
                
                if (response.isSuccessful) {
                    val recipeResponse = response.body()
                    Log.d(TAG, "Success response body: ${response.body()}")
                    Toast.makeText(this@MainActivity, "Recipe added successfully!", Toast.LENGTH_SHORT).show()
                    fetchRecipes() // Refresh the list
                    Log.d(TAG, "Response data type: ${recipeResponse?.data?.javaClass}")
                    Log.d(TAG, "Response data: ${recipeResponse?.data}")
                    
                    if (recipeResponse?.status == "success") {
                        val newRecipe = recipeResponse.recipe
                        Log.d(TAG, "Parsed recipe: $newRecipe")
                        if (newRecipe != null) {
                            Toast.makeText(this@MainActivity, "Recipe created successfully", Toast.LENGTH_SHORT).show()
                            fetchRecipes()
                        } else {
                            showError("Error: Could not parse created recipe")
                        }
                    } else {
                        showError(recipeResponse?.message ?: "Error creating recipe")
                    }
                } else {
                    showError("Error: ${response.code()} - $errorBody")
                }
            }

            override fun onFailure(call: Call<RecipeResponse>, t: Throwable) {
                Log.e(TAG, "Network error", t)
                showError("Network error: ${t.message}")
            }
        })
    }

    private fun updateRecipe(id: String, recipe: Recipe) {
        if (id.isEmpty()) {
            showError("Recipe ID is required for updating")
            return
        }
        apiService.updateRecipe(id, recipe).enqueue(object : Callback<RecipeResponse> {
            override fun onResponse(call: Call<RecipeResponse>, response: Response<RecipeResponse>) {
                if (response.isSuccessful) {
                    val recipeResponse = response.body()
                    if (recipeResponse?.status == "success") {
                        val updatedRecipe = recipeResponse.recipe
                        if (updatedRecipe != null) {
                            Toast.makeText(this@MainActivity, "Recipe updated successfully", Toast.LENGTH_SHORT).show()
                            fetchRecipes()
                        } else {
                            showError("Error: Could not parse updated recipe")
                        }
                    } else {
                        showError(recipeResponse?.message ?: "Error updating recipe")
                    }
                } else {
                    showError("Error: ${response.code()} - ${response.message()}")
                }
            }

            override fun onFailure(call: Call<RecipeResponse>, t: Throwable) {
                showError("Network error: ${t.message}")
            }
        })
    }

    private fun deleteRecipe(id: String) {
        if (id.isEmpty()) {
            showError("Recipe ID is required for deletion")
            return
        }
        apiService.deleteRecipe(id).enqueue(object : Callback<RecipeResponse> {
            override fun onResponse(call: Call<RecipeResponse>, response: Response<RecipeResponse>) {
                if (response.isSuccessful) {
                    val recipeResponse = response.body()
                    if (recipeResponse?.status == "success") {
                        Toast.makeText(this@MainActivity, "Recipe deleted successfully", Toast.LENGTH_SHORT).show()
                        fetchRecipes()
                    } else {
                        showError(recipeResponse?.message ?: "Error deleting recipe")
                    }
                } else {
                    showError("Error: ${response.code()} - ${response.message()}")
                }
            }

            override fun onFailure(call: Call<RecipeResponse>, t: Throwable) {
                showError("Network error: ${t.message}")
            }
        })
    }

    private fun fetchRecipes() {
        try {
            Log.d(TAG, "Fetching recipes with token: ${getSharedPreferences("auth", MODE_PRIVATE).getString("token", null)}")
            apiService.getRecipes().enqueue(object : Callback<RecipeResponse> {
            override fun onResponse(call: Call<RecipeResponse>, response: Response<RecipeResponse>) {
                Log.d(TAG, "Response received: ${response.code()}")
                if (response.isSuccessful) {
                    val recipeResponse = response.body()
                    if (recipeResponse == null) {
                        Log.e(TAG, "API returned null response body")
                        showError("Error: Server returned an invalid response")
                        return
                    }
                    
                    Log.d(TAG, "API Response - status: ${recipeResponse.status}, results: ${recipeResponse.results}, message: ${recipeResponse.message}")
                    
                    if (recipeResponse.status != "success") {
                        Log.e(TAG, "API returned error status: ${recipeResponse.message}")
                        showError("API Error: ${recipeResponse.message ?: "Unknown error"}")
                        return
                    }

                    Log.d(TAG, "Response data type: ${recipeResponse.data?.javaClass}")
                    Log.d(TAG, "Response data: ${recipeResponse.data}")
                    
                    val recipes = when (val data = recipeResponse.data) {
                        is List<*> -> data.mapNotNull { item ->
                            when (item) {
                                is Recipe -> item
                                is Map<*, *> -> try {
                                    Recipe(
                                        id = (item["_id"] as? String) ?: "",
                                        recipeName = (item["recipeName"] as? String) ?: "",
                                        cuisine = (item["cuisine"] as? String) ?: "",
                                        description = (item["description"] as? String) ?: "",
                                        ingredients = (item["ingredients"] as? List<*>)?.mapNotNull { it as? String } ?: listOf(),
                                        cookingTime = (item["cookingTime"] as? String) ?: "",
                                        difficulty = (item["difficulty"] as? String) ?: "",
                                        photoLink = (item["photoLink"] as? String) ?: "",
                                        averageRating = (item["averageRating"] as? Number)?.toDouble() ?: 0.0
                                    )
                                } catch (e: Exception) {
                                    Log.e(TAG, "Error parsing recipe from map", e)
                                    null
                                }
                                else -> null
                            }
                        }
                        else -> emptyList()
                    }
                    
                    Log.d(TAG, "Recipes received: ${recipes.size} items")
                    if (recipes.isNotEmpty()) {
                        Log.d(TAG, "First recipe: ${recipes.first()}")
                    }

                    runOnUiThread {
                        try {
                            adapter.updateRecipes(recipes.toMutableList())
                            if (recipes.isEmpty()) {
                                showError("No recipes found. Please make sure your API server is running.")
                            }
                        } catch (e: Exception) {
                            Log.e(TAG, "Error updating adapter", e)
                            showError("Error updating recipes: ${e.message}")
                        }
                    }
                } else {
                    val errorBody = response.errorBody()?.string()
                    Log.e(TAG, "Error response: ${response.code()}, Body: $errorBody")
                    val errorMessage = when(response.code()) {
                        401 -> "Authentication failed. Please log in again."
                        403 -> "You don't have permission to access this resource."
                        404 -> "API endpoint not found. Please check if the server is running on the correct port."
                        500 -> "Server error. Please check your API server logs."
                        else -> "Error ${response.code()}: ${errorBody ?: "Unknown error"}"
                    }
                    if (response.code() == 401) {
                        // Clear token and redirect to login
                        getSharedPreferences("auth", MODE_PRIVATE).edit().clear().apply()
                        startActivity(Intent(this@MainActivity, LoginActivity::class.java))
                        finish()
                    } else {
                        showError(errorMessage)
                    }
                }
            }

            override fun onFailure(call: Call<RecipeResponse>, t: Throwable) {
                Log.e(TAG, "Network error", t)
                val errorMessage = when {
                    t.message?.contains("Failed to connect") == true -> "Could not connect to the server. Please ensure your API is running on port 3000."
                    t.message?.contains("timeout") == true -> "Connection timed out. Please check your network connection."
                    else -> "Network error: ${t.message}"
                }
                runOnUiThread {
                    showError(errorMessage)
                }
            }
        })
        } catch (e: Exception) {
            Log.e(TAG, "Error fetching recipes", e)
            showError("Error fetching recipes: ${e.message}")
        }
    }

    // Starts auto-refresh coroutine that fetches recipes every 5 seconds
    private fun startAutoRefresh() {
        refreshJob?.cancel() // Cancel any existing job
        refreshJob = CoroutineScope(Dispatchers.Main).launch {
            while (isActive) { // Loop while the coroutine is active
                fetchRecipes()
                delay(5000) // Wait for 5 seconds before next refresh
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        refreshJob?.cancel() // Cancel the refresh job when activity is destroyed
    }

    // Displays error message to user via Toast
    private fun showError(message: String) {
        Log.e(TAG, "Error: $message")
        if (!isFinishing) {
            runOnUiThread {
                try {
                    Toast.makeText(this@MainActivity, message, Toast.LENGTH_LONG).show()
                } catch (e: Exception) {
                    Log.e(TAG, "Error showing toast", e)
                }
            }
        }
    }
}
