/**
 * File name : passport.js
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 21 feb 2025
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.isValidPassword(password))) {
            return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));