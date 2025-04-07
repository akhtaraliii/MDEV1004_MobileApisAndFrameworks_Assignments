/**
 * File name : passport.js
 * Student: Akhtar Ali
 * StudentID: 200568437
 * Student: Harshdeep Singh
 * StudentID: 200612779
 * Date: 6 April 2025
 */

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
require('dotenv').config();

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return done(null, false, { message: 'Invalid username or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return done(null, false, { message: 'Invalid username or password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromHeader('x-access-token'),
        ExtractJwt.fromAuthHeaderAsBearerToken()
    ]),
    secretOrKey: process.env.TOKEN_KEY
};

passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
    try {
        console.log('JWT Payload:', jwt_payload);
        const user = await User.findById(jwt_payload.id);  // Changed from userId to id
        console.log('Found User:', user);
        if (user) {
            return done(null, user);
        }
        return done(null, false, { message: 'User not found in database' });
    } catch (error) {
        console.error('JWT Strategy Error:', error);
        return done(error, false);
    }
}));

module.exports = passport;