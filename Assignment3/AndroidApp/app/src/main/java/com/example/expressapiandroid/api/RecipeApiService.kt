package com.example.expressapiandroid.api

import com.example.expressapiandroid.Recipe
import retrofit2.Call
import retrofit2.http.GET

interface RecipeApiService {
    @GET("recipes")
    fun getRecipes(): Call<RecipeResponse>
}
