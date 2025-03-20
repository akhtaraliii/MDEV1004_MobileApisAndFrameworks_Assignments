/**
 * File name : authController.js
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 21 feb 2025
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerUser = async(req,res)=>{
    const{username,email,password,firstName,lastName} = req.body;
    try{
        if(!username || !email || !password || !firstName || !lastName){
            return res.status(400).json({message:'All fields are required'});
        }
        const newUser = new User({username,firstName,lastName,email,password});
        await newUser.save();
        res.status(201).json({message:'User registered successfully'});
    } catch(error){
        res.status(500).json({message:'Error registering user'});
    }
};

exports.loginUser = async(req,res)=>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user || !(await user.isValidPassword(password))){
            return res.status(401).json({message:'Invalid credentials'});
        }
        
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.TOKEN_KEY,
            { expiresIn: '2h' }
        );
        
        res.status(200).json({
            message:'Login successful',
            token: token
        });
    } catch(error){
        res.status(500).json({message:'Error during login'});
    }
};