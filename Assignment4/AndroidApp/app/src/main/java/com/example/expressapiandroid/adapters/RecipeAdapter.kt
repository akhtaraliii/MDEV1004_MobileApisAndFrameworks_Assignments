package com.example.expressapiandroid.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.expressapiandroid.R
import com.example.expressapiandroid.models.Recipe

class RecipeAdapter(
    private val onItemClick: (Recipe) -> Unit,
    private val onEditClick: (Recipe) -> Unit,
    private val onDeleteClick: (Recipe) -> Unit
) : RecyclerView.Adapter<RecipeAdapter.RecipeViewHolder>() {

    private var recipes: MutableList<Recipe> = mutableListOf()

    fun updateRecipes(newRecipes: MutableList<Recipe>) {
        recipes = newRecipes
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecipeViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_recipe, parent, false)
        return RecipeViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecipeViewHolder, position: Int) {
        val recipe = recipes[position]
        holder.bind(recipe)
    }

    override fun getItemCount(): Int = recipes.size

    inner class RecipeViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val nameTextView: TextView = itemView.findViewById(R.id.recipeNameTextView)
        private val descriptionTextView: TextView = itemView.findViewById(R.id.recipeDescriptionTextView)
        private val cuisineTextView: TextView = itemView.findViewById(R.id.recipeCuisineTextView)
        private val detailsTextView: TextView = itemView.findViewById(R.id.recipeDetailsTextView)
        private val recipeImageView: ImageView = itemView.findViewById(R.id.recipeImageView)
        private val editButton: View = itemView.findViewById(R.id.editButton)
        private val deleteButton: View = itemView.findViewById(R.id.deleteButton)

        fun bind(recipe: Recipe) {
            nameTextView.text = recipe.recipeName
            descriptionTextView.text = recipe.description
            cuisineTextView.text = recipe.cuisine
            
            // Load image with proper error handling
            Glide.with(itemView.context)
                .load(recipe.photoLink)
                .placeholder(R.drawable.placeholder_image)
                .error(R.drawable.error_image)
                .centerCrop()
                .into(recipeImageView)
                
            detailsTextView.text = "${recipe.cookingTime} • ${recipe.difficulty} • Rating: ${recipe.averageRating}"

            // Set click listeners
            itemView.setOnClickListener { onItemClick(recipe) }
            editButton.setOnClickListener { onEditClick(recipe) }
            deleteButton.setOnClickListener { onDeleteClick(recipe) }
        }
    }
}
