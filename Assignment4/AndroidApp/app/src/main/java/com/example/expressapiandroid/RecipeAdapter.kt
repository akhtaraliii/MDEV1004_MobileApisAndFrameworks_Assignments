package com.example.expressapiandroid

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.GlideException
import com.bumptech.glide.request.RequestListener
import com.bumptech.glide.request.target.Target
import com.example.expressapiandroid.models.Recipe

class RecipeAdapter(
    private val recipes: MutableList<Recipe>,
    private val onEditClick: (Recipe) -> Unit,
    private val onDeleteClick: (Recipe) -> Unit
) : RecyclerView.Adapter<RecipeAdapter.RecipeViewHolder>() {

    companion object {
        private const val TAG = "RecipeAdapter"
    }

    class RecipeViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val imageView: ImageView = itemView.findViewById(R.id.recipeImageView)
        val nameTextView: TextView = itemView.findViewById(R.id.recipeNameTextView)
        val cuisineTextView: TextView = itemView.findViewById(R.id.recipeCuisineTextView)
        val detailsTextView: TextView = itemView.findViewById(R.id.recipeDetailsTextView)
        val descriptionTextView: TextView = itemView.findViewById(R.id.recipeDescriptionTextView)
        val editButton: Button = itemView.findViewById(R.id.editButton)
        val deleteButton: Button = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecipeViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_recipe, parent, false)
        return RecipeViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecipeViewHolder, position: Int) {
        try {
            if (position >= recipes.size) {
                Log.e(TAG, "Position $position is out of bounds for recipes list of size ${recipes.size}")
                return
            }

            val recipe = recipes[position]
            holder.apply {
                nameTextView.text = recipe.recipeName.ifBlank { "Untitled Recipe" }
                cuisineTextView.text = recipe.cuisine.ifBlank { "Unknown Cuisine" }
                detailsTextView.text = buildString {
                    append(recipe.cookingTime.ifBlank { "Unknown" })
                    append(" • ")
                    append(recipe.difficulty.ifBlank { "Unknown" })
                    append(" • Rating: ")
                    append(recipe.averageRating)
                }
                descriptionTextView.text = recipe.description.ifBlank { "No description available" }

                editButton.setOnClickListener { onEditClick(recipe) }
                deleteButton.setOnClickListener { onDeleteClick(recipe) }
            }

            val imageUrl = if (recipe.photoLink.isNotBlank() && !recipe.photoLink.contains("images.app.goo.gl")) {
                recipe.photoLink
            } else {
                "https://source.unsplash.com/featured/?food"
            }

            Glide.with(holder.imageView.context)
                .load(imageUrl)
                .placeholder(android.R.drawable.ic_menu_gallery)
                .error(android.R.drawable.ic_menu_gallery)
                .centerCrop()
                .into(holder.imageView)
        } catch (e: Exception) {
            Log.e(TAG, "Error binding view holder at position $position", e)
            // Set default values in case of error
            holder.apply {
                nameTextView.text = "Error loading recipe"
                cuisineTextView.text = ""
                detailsTextView.text = ""
                descriptionTextView.text = "There was an error loading this recipe."
                editButton.isEnabled = false
                deleteButton.isEnabled = false
            }
            holder.imageView.setImageResource(android.R.drawable.ic_menu_gallery)
        }
    }

    override fun getItemCount() = recipes.size

    fun updateRecipes(newRecipes: List<Recipe>) {
        try {
            recipes.clear()
            recipes.addAll(newRecipes)
            notifyDataSetChanged()
            Log.d(TAG, "Successfully updated recipes: ${recipes.size} items")
        } catch (e: Exception) {
            Log.e(TAG, "Error updating recipes", e)
            throw e
        }
    }
}
