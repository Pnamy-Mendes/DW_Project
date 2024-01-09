import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import AdminPanel from './pages/AdminPanel';
import LoginForm from './components/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<LoginForm />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
