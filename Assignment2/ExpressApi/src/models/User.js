/**
 * File name : User.js
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 21 feb 2025
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

// Encrypt the password before saving the user
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    // Generate a salt with a factor of 10
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

//Method to validate password
UserSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User',UserSchema);
module.exports = User;