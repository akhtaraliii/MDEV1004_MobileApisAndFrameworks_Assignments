package com.example.expressapiandroid.models

import com.google.gson.annotations.SerializedName

import com.google.gson.annotations.Expose

data class Recipe(
    @SerializedName("_id")
    val id: String? = null,
    @SerializedName("recipeName")
    val recipeName: String = "",
    @SerializedName("cuisine")
    val cuisine: String = "",
    @SerializedName("description")
    val description: String = "",
    @SerializedName("ingredients")
    val ingredients: List<String> = listOf(),
    @SerializedName("cookingTime")
    val cookingTime: String = "",
    @SerializedName("difficulty")
    val difficulty: String = "",
    @SerializedName("photoLink")
    val photoLink: String = "",
    @SerializedName("averageRating")
    val averageRating: Double = 0.0
)
