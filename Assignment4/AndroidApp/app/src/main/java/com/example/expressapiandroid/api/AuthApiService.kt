package com.example.expressapiandroid.api

import com.example.expressapiandroid.models.AuthResponse
import com.example.expressapiandroid.models.LoginRequest
import com.example.expressapiandroid.models.RegisterRequest
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApiService {
    @POST("auth/register")
    fun register(@Body request: RegisterRequest): Call<AuthResponse>

    @POST("auth/login")
    fun login(@Body request: LoginRequest): Call<AuthResponse>
}
