package com.example.expressapiandroid

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.GlideException
import com.bumptech.glide.request.RequestListener
import com.bumptech.glide.request.target.Target

class RecipeAdapter(private var recipes: List<Recipe>) :
    RecyclerView.Adapter<RecipeAdapter.RecipeViewHolder>() {

    companion object {
        private const val TAG = "RecipeAdapter"
    }

    class RecipeViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val imageView: ImageView = itemView.findViewById(R.id.recipeImageView)
        val nameTextView: TextView = itemView.findViewById(R.id.recipeNameTextView)
        val cuisineTextView: TextView = itemView.findViewById(R.id.recipeCuisineTextView)
        val detailsTextView: TextView = itemView.findViewById(R.id.recipeDetailsTextView)
        val descriptionTextView: TextView = itemView.findViewById(R.id.recipeDescriptionTextView)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecipeViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_recipe, parent, false)
        return RecipeViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecipeViewHolder, position: Int) {
        val recipe = recipes[position]
        Log.d(TAG, "Binding recipe at position $position: ${recipe.recipeName}")
        
        // Load recipe image
        val imageUrl = recipe.photoLink.takeIf { 
            it.isNotBlank() && !it.contains("images.app.goo.gl") 
        } ?: "https://source.unsplash.com/featured/?${recipe.recipeName.replace(" ", "+")}+food"
        
        Log.d(TAG, "Loading image from URL: $imageUrl")
        
        try {
            Glide.with(holder.imageView.context)
                .load(imageUrl)
                .timeout(30000) // 30 seconds timeout
                .placeholder(R.drawable.placeholder_image)
                .error(R.drawable.placeholder_image)
                .centerCrop()
                .listener(object : RequestListener<android.graphics.drawable.Drawable> {
                    override fun onLoadFailed(
                        e: GlideException?,
                        model: Any?,
                        target: Target<android.graphics.drawable.Drawable>,
                        isFirstResource: Boolean
                    ): Boolean {
                        Log.e(TAG, "Failed to load image for ${recipe.recipeName} from $imageUrl: ${e?.message}")
                        // Try loading from Unsplash as fallback if the original URL failed
                        if (!imageUrl.contains("unsplash")) {
                            val fallbackUrl = "https://source.unsplash.com/featured/?${recipe.recipeName.replace(" ", "+")}+food"
                            Log.d(TAG, "Trying fallback URL: $fallbackUrl")
                            Glide.with(holder.imageView.context)
                                .load(fallbackUrl)
                                .timeout(30000)
                                .placeholder(R.drawable.placeholder_image)
                                .error(android.R.drawable.ic_menu_gallery)
                                .centerCrop()
                                .into(holder.imageView)
                        }
                        return false
                    }

                    override fun onResourceReady(
                        resource: android.graphics.drawable.Drawable,
                        model: Any,
                        target: Target<android.graphics.drawable.Drawable>,
                        dataSource: com.bumptech.glide.load.DataSource,
                        isFirstResource: Boolean
                    ): Boolean {
                        Log.d(TAG, "Successfully loaded image for ${recipe.recipeName} from $imageUrl")
                        return false
                    }
                })
                .into(holder.imageView)
        } catch (e: Exception) {
            Log.e(TAG, "Error loading image for ${recipe.recipeName}", e)
            holder.imageView.setImageResource(android.R.drawable.ic_menu_gallery)
        }

        try {
            // Set recipe details
            holder.nameTextView.text = recipe.recipeName
            holder.cuisineTextView.text = recipe.cuisine
            holder.detailsTextView.text = "${recipe.cookingTime} • ${recipe.difficulty} • Rating: ${recipe.averageRating}"
            holder.descriptionTextView.text = recipe.description
        } catch (e: Exception) {
            Log.e(TAG, "Error binding recipe data for ${recipe.recipeName}", e)
        }
    }

    override fun getItemCount(): Int {
        Log.d(TAG, "Recipe count: ${recipes.size}")
        return recipes.size
    }

    fun updateRecipes(newRecipes: List<Recipe>) {
        Log.d(TAG, "Updating recipes. New count: ${newRecipes.size}")
        recipes = newRecipes
        notifyDataSetChanged()
    }
}
