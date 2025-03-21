package com.example.expressapiandroid

/**
 * Data class representing a recipe with its essential properties
 */
data class Recipe(
    val recipeName: String,
    val ingredients: List<String>,
    val cookingTime: String,
    val difficulty: String,
    val cuisine: String,
    val description: String,
    val photoLink: String,
    val averageRating: Double
)
