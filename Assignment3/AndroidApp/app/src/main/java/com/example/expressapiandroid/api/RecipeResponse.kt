package com.example.expressapiandroid.api

import com.example.expressapiandroid.Recipe

data class RecipeResponse(
    val status: String,
    val results: Int,
    val data: List<Recipe>
)
