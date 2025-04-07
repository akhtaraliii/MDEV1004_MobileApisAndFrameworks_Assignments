package com.example.expressapiandroid.api

import com.example.expressapiandroid.models.Recipe
import com.example.expressapiandroid.models.RecipeResponse
import retrofit2.Call
import retrofit2.http.*

interface RecipeApiService {
    @GET("recipes")
    fun getRecipes(): Call<RecipeResponse>

    @POST("recipes")
    fun createRecipe(@Body recipe: Recipe): Call<RecipeResponse>

    @PUT("recipes/{id}")
    fun updateRecipe(@Path("id") id: String, @Body recipe: Recipe): Call<RecipeResponse>

    @DELETE("recipes/{id}")
    fun deleteRecipe(@Path("id") id: String): Call<RecipeResponse>
}
