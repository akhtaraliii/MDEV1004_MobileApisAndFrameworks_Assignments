package com.example.expressapiandroid.models

data class User(
    val email: String,
    val password: String
)

data class AuthResponse(
    val token: String,
    val message: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val firstName: String,
    val lastName: String
)
