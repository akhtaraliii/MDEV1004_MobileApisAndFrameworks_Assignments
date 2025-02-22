const User = require('../models/User');
const bcrypt = require('bcrypt');

// Track logged in users
const loggedInUsers = new Map();

exports.registerUser = async(req,res)=>{
    const{username,email,password} = req.body;

    try{
        //validate
        if(!username || !email || !password){
            return res.status(400).json({message:'All fields are required'});
        }

        //check if email is valid
        if(typeof email !=='string' || email.trim() === ''){
            return res.status(400).json({message:'Invalid email address'});
        }

        // Check if username exists
        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({message:'Username is already in use'});
        }

        // Check if email exists
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message:'Email is already in use'});
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password // Password will be hashed by the pre-save middleware
        });

        await newUser.save();
        return res.status(201).json({
            message:'User registered successfully',
            user: {
                username: newUser.username,
                email: newUser.email
            }
        });
    }
    catch(error){
        console.error('Registration error details:', error);
        return res.status(500).json({
            message:'Error registering user',
            error: error.message
        });
    }
}

exports.loginUser = async(req,res)=>{
    const{email,password}=req.body;

    try{
        //Validate
        if(!email || !password){
            return res.status(401).json({message:'All fields are required'});
        }

        //Check for existing user
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message:'Invalid email or password'});
        }

        //Compare password with hashed password
        const isPasswordValid = await user.isValidPassword(password);
        if(!isPasswordValid){
            return res.status(401).json({message:'Invalid email or password'});
        }

        // Add user to logged in users
        loggedInUsers.set(user.email, user);

        //Successful login
        res.status(200).json({
            message:'Login successful',
            userId: user._id,
            email: user.email
        });       
    }
    catch(error){
        console.error('Login error details:', error);
        res.status(500).json({
            message:'Error logging in user',
            error: error.message
        });
    }
}