const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes'); // Import your authRoutes
const productRoutes = require('./routes/productRoutes'); // Import the routes
const categoriesRoutes = require('./routes/categoriesRoutes'); // Import the routes
const userRoutes = require('./routes/userRoutes'); // Import the routes


const app = express();
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true,
};

require('dotenv').config({ path: path.join(__dirname, '../.env') });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Middleware 
app.use(cors(corsOptions));
app.use(express.json()); // For parsing application/json
app.use(cookieParser());
app.use('/api/products', productRoutes); // Use the routes
app.use('/api/categories', categoriesRoutes); // Use the routes 
app.use('/api/users', userRoutes); // Use the routes
app.use(authRoutes); // Use the routes defined in authRoutes.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
