const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes'); // Import your authRoutes

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true,
};

// Middleware 
app.use(cors(corsOptions));
app.use(express.json()); // For parsing application/json
app.use(cookieParser());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Use authRoutes for authentication
app.use(authRoutes); // Use the routes defined in authRoutes.js

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
