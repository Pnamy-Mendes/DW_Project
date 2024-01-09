const express = require('express');
const User = require('../models/User.js'); // Import your user model
const router = express.Router();

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username: username });
    if (user && user.comparePassword(password)) {
      // Login successful
      res.json({ message: "Login successful", user: user });
    } else {
      // Login failed
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
