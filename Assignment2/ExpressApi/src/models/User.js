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