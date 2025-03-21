package com.example.expressapiandroid

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
