// Enable view binding
private lateinit var binding: ActivityMainBinding

// Setup RecyclerView
private fun setupRecyclerView() {
    adapter = RecipeAdapter(
        onItemClick = { recipe -> /* ... */ },
        onEditClick = { recipe -> showEditDialog(recipe) },
        onDeleteClick = { recipe -> showDeleteConfirmation(recipe) }
    )
    binding.recipesRecyclerView.apply {
        layoutManager = LinearLayoutManager(this@MainActivity)
        adapter = this@MainActivity.adapter
        addItemDecoration(DividerItemDecoration(this@MainActivity, DividerItemDecoration.VERTICAL))
    }
}

// Handle nullable recipe ID
private fun updateRecipe(recipe: Recipe) {
    recipe.id?.let { id ->
        updateRecipe(id, recipe)
    }
}

// Add success message
private fun createRecipe(recipe: Recipe) {
    apiService.createRecipe(recipe).enqueue(object : Callback<RecipeResponse> {
        override fun onResponse(...) {
            if (response.isSuccessful) {
                Toast.makeText(this@MainActivity, "Recipe added successfully!", Toast.LENGTH_SHORT).show()
                fetchRecipes()
            }
        }
    })
}