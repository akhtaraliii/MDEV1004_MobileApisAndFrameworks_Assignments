package com.example.expressapiandroid

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.expressapiandroid.api.RecipeApiService
import com.example.expressapiandroid.api.RecipeResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import kotlinx.coroutines.*

class MainActivity : AppCompatActivity() {
    private var refreshJob: Job? = null
    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: RecipeAdapter
    private lateinit var apiService: RecipeApiService

    companion object {
        private const val TAG = "MainActivity"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        startAutoRefresh()
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize RecyclerView
        recyclerView = findViewById(R.id.recipesRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        adapter = RecipeAdapter(emptyList())
        recyclerView.adapter = adapter

        // Initialize Retrofit with logging
        val logging = okhttp3.logging.HttpLoggingInterceptor().apply {
            level = okhttp3.logging.HttpLoggingInterceptor.Level.BODY
        }
        
        val client = okhttp3.OkHttpClient.Builder()
            .addInterceptor(logging)
            .build()

        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/") // Android emulator localhost
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        apiService = retrofit.create(RecipeApiService::class.java)

        // Fetch recipes
        fetchRecipes()
    }

    private fun fetchRecipes() {
        Log.d(TAG, "Fetching recipes...")
        apiService.getRecipes().enqueue(object : Callback<RecipeResponse> {
            override fun onResponse(call: Call<RecipeResponse>, response: Response<RecipeResponse>) {
                Log.d(TAG, "Response received: ${response.code()}")
                if (response.isSuccessful) {
                    response.body()?.let { recipeResponse ->
                        Log.d(TAG, "Recipes received: ${recipeResponse.results}")
                        runOnUiThread {
                            adapter.updateRecipes(recipeResponse.data)
                            if (recipeResponse.data.isEmpty()) {
                                showError("No recipes found")
                            }
                        }
                    } ?: run {
                        Log.e(TAG, "Response body is null")
                        showError("Error: Empty response")
                    }
                } else {
                    val errorBody = response.errorBody()?.string()
                    Log.e(TAG, "Error response: ${response.code()}, Body: $errorBody")
                    showError("Error: ${response.code()} - $errorBody")
                }
            }

            override fun onFailure(call: Call<RecipeResponse>, t: Throwable) {
                Log.e(TAG, "Network error", t)
                showError("Network error: ${t.message}")
            }
        })
    }

    private fun startAutoRefresh() {
        refreshJob?.cancel() // Cancel any existing job
        refreshJob = CoroutineScope(Dispatchers.Main).launch {
            while (isActive) { // Loop while the coroutine is active
                fetchRecipes()
                delay(5000) // Wait for 5 seconds before next refresh
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        refreshJob?.cancel() // Cancel the refresh job when activity is destroyed
    }

    private fun showError(message: String) {
        Log.e(TAG, "Error: $message")
        runOnUiThread {
            Toast.makeText(this, message, Toast.LENGTH_LONG).show()
        }
    }
}
