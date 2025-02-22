/**
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 30th Jan 2025
 */

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const recipeRoutes = require('./src/routes/recipeRoutes');
const authRoutes = require('./src/routes/authRoutes');
const Recipe = require('./src/models/Recipe');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
dotenv.config();