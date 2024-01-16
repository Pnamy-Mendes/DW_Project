const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); 
const router = express.Router();

// Registration route
router.post('/register', async (req, res) => {   
    try {
        const { username, email, password } = req.body;

        console.log(req.body);

        // Case-insensitive check for existing username using lowercaseUsername
        let userByUsername = await User.findOne({ lowercaseUsername: req.body.username.toLowerCase() });
        if (userByUsername) {
            return res.status(400).json({ message: "Username already exists", errorField: 'username' });
        }

        // Case-insensitive check for existing email
        let userByEmail = await User.findOne({ email: req.body.email.toLowerCase() });
        if (userByEmail) {
            return res.status(400).json({ message: "Email already exists", errorField: 'email' });
        }

        // Create a new user
        const hashedPassword = bcrypt.hashSync(password, 12);
        const newUser = new User({
          username: req.body.username,
          lowercaseUsername: username.toLowerCase(),
          email: req.body.email,
          password: req.body.password
        });
        await newUser.save();

        res.cookie('userInfo', { userId: newUser._id, username: newUser.username, email: newUser.email }, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ message: "User created successfully", user: { id: newUser._id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login route
router.post('/login', async (req, res) => {
    console.log("a");
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && bcrypt.compareSync(password, user.password)) {
            // Authentication successful
            res.cookie('userInfo', { username: user.username, email: user.email }, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
            res.status(200).json({ message: "Login successful", user: { id: user._id, username: user.username } });
        } else {
            // Authentication failed
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
