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
import com.example.expressapiandroid.models.RegisterRequest
import com.example.expressapiandroid.models.AuthResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class RegisterActivity : AppCompatActivity() {
    private lateinit var usernameEditText: EditText
    private lateinit var firstNameEditText: EditText
    private lateinit var lastNameEditText: EditText
    private lateinit var emailEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var confirmPasswordEditText: EditText
    private lateinit var registerButton: Button
    private lateinit var loginLink: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        // Initialize views
        usernameEditText = findViewById(R.id.usernameEditText)
        firstNameEditText = findViewById(R.id.firstNameEditText)
        lastNameEditText = findViewById(R.id.lastNameEditText)
        emailEditText = findViewById(R.id.emailEditText)
        passwordEditText = findViewById(R.id.passwordEditText)
        confirmPasswordEditText = findViewById(R.id.confirmPasswordEditText)
        registerButton = findViewById(R.id.registerButton)
        loginLink = findViewById(R.id.loginLink)

        // Setup Retrofit with logging
        val logging = okhttp3.logging.HttpLoggingInterceptor().apply {
            level = okhttp3.logging.HttpLoggingInterceptor.Level.BODY
        }

        val client = okhttp3.OkHttpClient.Builder()
            .addInterceptor(logging)
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val authService = retrofit.create(AuthApiService::class.java)

        // Register button click listener
        registerButton.setOnClickListener {
            val username = usernameEditText.text.toString()
            val firstName = firstNameEditText.text.toString()
            val lastName = lastNameEditText.text.toString()
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()
            val confirmPassword = confirmPasswordEditText.text.toString()

            if (username.isEmpty() || firstName.isEmpty() || lastName.isEmpty() || 
                email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (password != confirmPassword) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val registerRequest = RegisterRequest(username, email, password, firstName, lastName)
            authService.register(registerRequest).enqueue(object : Callback<AuthResponse> {
                override fun onResponse(call: Call<AuthResponse>, response: Response<AuthResponse>) {
                    if (response.isSuccessful) {
                        Toast.makeText(this@RegisterActivity, "Registration successful", Toast.LENGTH_SHORT).show()
                        // Navigate to LoginActivity
                        startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                        finish()
                    } else {
                        try {
                            val errorBody = response.errorBody()?.string()
                            val errorMessage = if (!errorBody.isNullOrEmpty()) {
                                // Parse JSON error message if available
                                val jsonError = org.json.JSONObject(errorBody)
                                jsonError.optString("message", "Registration failed")
                            } else {
                                when (response.code()) {
                                    400 -> "Invalid registration data"
                                    409 -> "Username or email already exists"
                                    500 -> "Server error. Please try again later"
                                    else -> "Registration failed (Error ${response.code()})"
                                }
                            }
                            Toast.makeText(this@RegisterActivity, errorMessage, Toast.LENGTH_LONG).show()
                            Log.e("RegisterActivity", "Error: $errorBody")
                        } catch (e: Exception) {
                            Toast.makeText(this@RegisterActivity, "Registration failed: ${e.message}", Toast.LENGTH_LONG).show()
                            Log.e("RegisterActivity", "Error parsing response", e)
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
                    Toast.makeText(this@RegisterActivity, errorMessage, Toast.LENGTH_LONG).show()
                    Log.e("RegisterActivity", "Network error", t)
                }
            })
        }

        // Login link click listener
        loginLink.setOnClickListener {
            finish() // Go back to LoginActivity
        }
    }
}
