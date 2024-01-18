import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Products from './pages/Products'; 
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import AdminPanel from './pages/AdminPanel';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Logout from './utils/Logout';

import ProductManagement from './components/ProductManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />  
        <Route path="/logout" element={<Logout />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
