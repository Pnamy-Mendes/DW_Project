const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json()); // For parsing JSON request bodies

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ecomerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Use the auth routes
app.use(authRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
