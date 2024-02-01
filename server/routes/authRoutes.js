const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios'); 
const User = require('../models/User');
const TypeUser = require('../models/TypeUser');
const router = express.Router();
const mongoose = require('mongoose');

console.log(process.env.GITHUB_CLIENT_ID);

// Reusable function to set cookie
function setUserInfoCookie(res, user) {
    res.cookie('userInfo', { userId: user._id, username: user.username }, {
        secure: true, 
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'Lax'
    });
}


// Registration route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, name} = req.body;
        console.log(username, email, password, name) 

        // Convert the defaultTypeUserId string to ObjectId
        const defaultTypeUserId = new mongoose.Types.ObjectId('65b6a77f17a2772efba9193b');
        const defaultTypeUser = await TypeUser.findById(defaultTypeUserId);
        /* console.log(defaultTypeUserId)  */

        /* const typeName = 'User'; // Replace with the desired name
        const typeUser = await TypeUser.findOne({ name: typeName });
        console.log(typeUser) */


        if (!defaultTypeUser) {
            return res.status(404).json({ message: "Default defaultTypeUser not found" });
        }

        let userByUsername = await User.findOne({ lowercaseUsername: username.toLowerCase() });
        if (userByUsername) {
            return res.status(400).json({ message: "Username already exists", errorField: 'username' });
        }

        let userByEmail = await User.findOne({ email: email.toLowerCase() });
        if (userByEmail) {
            return res.status(400).json({ message: "Email already exists", errorField: 'email' });
        }

        const hashedPassword = bcrypt.hashSync(password, 12);
        const newUser = new User({
            name,
            username,
            lowercaseUsername: username.toLowerCase(),
            email,
            password: hashedPassword, 
            defaultTypeUser: defaultTypeUser._id
        });
        await newUser.save();

        setUserInfoCookie(res, newUser);
        res.status(201).json({ message: "User created successfully", user: { id: newUser._id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ lowercaseUsername: username.toLowerCase() }); 

        console.log("User found:", user);
        console.log("Received username:", username);
        console.log("Received password:", password);
        
        // Additional debugging
        console.log("Hashed password in the database:", user.password);
        
        const isPasswordMatch = bcrypt.compareSync(password, user.password);
        console.log("Comparison result:", isPasswordMatch);
         

        if (user && bcrypt.compareSync(password, user.password)) {
            setUserInfoCookie(res, user);
            res.status(200).json({ message: "Login successful", user: { id: user._id, username: user.username } });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GitHub OAuth route
router.get('/auth/github', (req, res) => {  
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`;
    res.redirect(url);
});

// GitHub OAuth callback
router.get('/auth/github/callback', async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ message: "Code not found in GitHub OAuth callback" });
        }

        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code
        }, { headers: { Accept: 'application/json' } });

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        });

        // Extracting necessary fields from GitHub response
        const { login, email, name } = userResponse.data;

        // Find or create a user
        let user = await User.findOne({ username: login });
        if (!user) {
            user = new User({
                username: login,
                lowercaseUsername: login.toLowerCase(),
                email,
                name: name || login, // Fallback to GitHub login if name is not available
                githubToken: accessToken,
                password: bcrypt.hashSync(accessToken, 12) // Dummy password for OAuth users
            });
        } else {
            user.githubToken = accessToken;
            user.name = name || user.name; // Update the name if available
        }
        await user.save();

        setUserInfoCookie(res, user);       
        res.redirect('http://localhost:3000/admin/products');
    } catch (error) {
        console.error("Error during GitHub OAuth callback: ", error);
        res.redirect(`http://localhost:3000/login?error=${encodeURIComponent(error.message)}`);
    }
});

module.exports = router;
