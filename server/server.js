const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust the path as needed for your User model
const app = express();
const cookieParser = require('cookie-parser');


// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json
app.use(cookieParser());

// MongoDB connection (Replace with your connection string and options)
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Registration route
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        let userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ message: "Username already exists", errorField: 'username' });
        }

        let userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ message: "Email already exists", errorField: 'email' });
        }

        // Create a new user
        user = new User({ username, email, password });
        await user.save();
        res.cookie('userInfo', { userId: newUser._id }, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
        res.status(201).json({ message: "User created successfully" });
        } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && bcrypt.compareSync(password, user.password)) {
            // Authentication successful
            res.cookie('userInfo', { userId: user._id }, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 day expiration
            res.status(200).json({ message: "Login successful" });
        } else {
            // Authentication failed
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
