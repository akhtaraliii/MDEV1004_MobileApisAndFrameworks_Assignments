const bcrypt = require('bcryptjs');  
const jwt = require('jsonwebtoken');    
const User = require('../models/models'); 
const config = process.env;             

// Handle new user registration
exports.register = async(req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!(email && password && firstName && lastName)) {
            return res.status(400).send('All fields are required');
        }
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send('User already exists');
        }
        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: encryptedPassword
        });

        const token = jwt.sign(
            { user_id: user._id, email },
            config.TOKEN_KEY,
            { expiresIn: '2h' }
        );
        user.token = token;

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error during registration');
    }
};


exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).send('Email and password are required');
        }

        // Look up their email and verify their password
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            // Password is correct! Create a new token for them
            const token = jwt.sign(
                { user_id: user._id, email },
                config.TOKEN_KEY,
                { expiresIn: '2h' }
            );
            user.token = token;
            return res.status(200).json(user);
        }

        return res.status(400).send('Invalid credentials');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error during login');
    }
};

// Handle dashboard access (only for logged-in users)
exports.dashboard = async (req, res) => {
    try {
        
        const user = await User.findById(req.user.user_id);
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        // Welcome to the dashboard!
        res.status(200).json({ message: `Welcome to the dashboard, ${user.firstName}` });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error accessing dashboard");
    }
};
