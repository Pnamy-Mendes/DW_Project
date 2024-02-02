const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes'); // Import your authRoutes
const productRoutes = require('./routes/productRoutes'); // Import the routes
const categoriesRoutes = require('./routes/categoriesRoutes'); // Import the routes
const userRoutes = require('./routes/userRoutes'); // Import the routes
const typeUserRoutes = require('./routes/typeUserRoutes'); // Import the routes
const permissionRoutes = require('./routes/permissionRoutes'); // Import the routes
const saleRoutes = require('./routes/saleRoutes'); // Import the routes
const cartRoutes = require('./routes/cartRoutes'); // Import the routesS

require('dotenv').config({ path: path.join(__dirname, '../.env') });
console.log(process.env.REACT_APP_API_BASE_URL+':3000');

const app = express();
const corsOptions = {
    origin: process.env.REACT_APP_API_BASE_URL+':3000', // Replace with your frontend's URL
    credentials: true,
};



// MongoDB connection
mongoose.connect('mongodb://192.168.1.134:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Diogo
/* mongoose.connect('mongodb://82.154.212.23:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:')); */
 

// Middleware 
app.use(cors(corsOptions));
app.use(express.json()); // For parsing application/json
app.use(cookieParser());
app.use('/api/products', productRoutes); // Use the routes
app.use('/api/categories', categoriesRoutes); // Use the routes 
app.use('/api/users', userRoutes); // Use the routes
app.use('/api/typeUser', typeUserRoutes); // Use the routes
app.use('/api/permissions', permissionRoutes); // Use the routes
app.use(authRoutes); // Use the routes defined in authRoutes.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/sales', saleRoutes); // Use the routes
app.use('/api/cart', cartRoutes); // Use the routes


app.get('/config', (req, res) => {
  res.json({
      apiUrl: process.env.REACT_APP_API_BASE_URL,
  });
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
