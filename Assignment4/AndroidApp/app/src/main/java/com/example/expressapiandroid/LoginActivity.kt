package com.example.expressapiandroid

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.expressapiandroid.api.AuthApiService
import com.example.expressapiandroid.models.LoginRequest
import com.example.expressapiandroid.models.AuthResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class LoginActivity : AppCompatActivity() {
    private lateinit var emailEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var loginButton: Button
    private lateinit var registerLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Initialize views
        emailEditText = findViewById(R.id.emailEditText)
        passwordEditText = findViewById(R.id.passwordEditText)
        loginButton = findViewById(R.id.loginButton)
        registerLink = findViewById(R.id.registerLink)

        // Setup Retrofit
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val authService = retrofit.create(AuthApiService::class.java)

        // Login button click listener
        loginButton.setOnClickListener {
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val loginRequest = LoginRequest(email, password)
            authService.login(loginRequest).enqueue(object : Callback<AuthResponse> {
                override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                    if (response.isSuccessful) {
                        val authResponse = response.body()
                        // Save token to SharedPreferences
                        getSharedPreferences("auth", MODE_PRIVATE).edit()
                            .putString("token", authResponse?.token)
                            .apply()
                        
                        // Navigate to MainActivity
                        startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                        finish()
                    } else {
                        try {
                            val errorBody = response.errorBody()?.string()
                            val errorMessage = if (!errorBody.isNullOrEmpty()) {
                                // Parse JSON error message if available
                                val jsonError = org.json.JSONObject(errorBody)
                                jsonError.optString("message", "Login failed")
                            } else {
                                when (response.code()) {
                                    400 -> "Invalid email or password"
                                    401 -> "Invalid credentials"
                                    404 -> "User not found"
                                    500 -> "Server error. Please try again later"
                                    else -> "Login failed (Error ${response.code()})"
                                }
                            }
                            Toast.makeText(this@LoginActivity, errorMessage, Toast.LENGTH_LONG).show()
                            Log.e("LoginActivity", "Error: $errorBody")
                        } catch (e: Exception) {
                            Toast.makeText(this@LoginActivity, "Login failed: ${e.message}", Toast.LENGTH_LONG).show()
                            Log.e("LoginActivity", "Error parsing response", e)
                        }
                    }
                }

                override fun onFailure(call: Call<AuthResponse>, t: Throwable) {
                    val errorMessage = when {
                        t is java.net.ConnectException -> "Could not connect to server. Please check your internet connection."
                        t is java.net.SocketTimeoutException -> "Connection timed out. Please try again."
                        t.message?.contains("Certificate") == true -> "SSL Certificate error. Please check your connection."
                        else -> "Network error: ${t.message}"
                    }
                    Toast.makeText(this@LoginActivity, errorMessage, Toast.LENGTH_LONG).show()
                    Log.e("LoginActivity", "Network error", t)
                }
            })
        }

        // Register link click listener
        registerLink.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }
}
