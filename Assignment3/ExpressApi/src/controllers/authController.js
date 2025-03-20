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