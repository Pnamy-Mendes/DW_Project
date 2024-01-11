import React from 'react';
import { Link } from 'react-router-dom';



function HomePage() {
  return (
    <div>
      <h1>Welcome to Our E-Commerce Platform</h1>
      <Link to="/products">View Products</Link>
      <br></br>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      {/* Add more components like featured products, etc. here */}
    </div>
  );
}

export default HomePage;
