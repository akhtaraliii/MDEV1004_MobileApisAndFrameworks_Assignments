package com.example.expressapiandroid.models

import com.google.gson.annotations.SerializedName

data class RecipeResponse(
    @SerializedName("status")
    val status: String = "error",
    
    @SerializedName("message")
    val message: String? = null,
    
    @SerializedName("results")
    val results: Int = 0,
    
    @SerializedName("data")
    val data: Any? = null,
    
    @SerializedName("error")
    val error: String? = null
) {
    val recipeList: List<Recipe>?
        get() = when (data) {
            is List<*> -> data as? List<Recipe>
            is Map<*, *> -> listOf(parseRecipeFromMap(data))
            is Recipe -> listOf(data)
            else -> null
        }
    
    val recipe: Recipe?
        get() = when (data) {
            is Map<*, *> -> parseRecipeFromMap(data)
            is Recipe -> data
            is List<*> -> (data as? List<Recipe>)?.firstOrNull()
            else -> null
        }
    
    private fun parseRecipeFromMap(map: Map<*, *>): Recipe {
        return Recipe(
            id = (map["_id"] as? String) ?: "",
            recipeName = (map["recipeName"] as? String) ?: "",
            cuisine = (map["cuisine"] as? String) ?: "",
            description = (map["description"] as? String) ?: "",
            ingredients = (map["ingredients"] as? List<*>)?.mapNotNull { it as? String } ?: listOf(),
            cookingTime = (map["cookingTime"] as? String) ?: "",
            difficulty = (map["difficulty"] as? String) ?: "",
            photoLink = (map["photoLink"] as? String) ?: "",
            averageRating = (map["averageRating"] as? Number)?.toDouble() ?: 0.0
        )
    }
}
