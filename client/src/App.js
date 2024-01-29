import React, { useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import HomePage from './pages/HomePage';
import Products from './pages/Products'; 
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import AdminPanel from './pages/AdminPanel';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Logout from './utils/Logout';
import FileUpload from './components/fileUpload';
import ProductsDemo from './components/ProductManagement'; 

/* import ProductManagement from './components/ProductManagement'; */

function App() {
  const toast = useRef(null);

  // Function to show toast messages
  const showToast = (severity, summary, detail) => {
      toast.current.show({ severity, summary, detail, life: 3000, position: 'top-right' });
  };

  return (
      <Router>
          <Toast ref={toast} />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* <Route path="/admin/products" element={<ProductManagement />} /> */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/login" element={<LoginForm showToast={showToast} />} />
              <Route path="/register" element={<RegisterForm showToast={showToast} />} />  
              <Route path="/logout" element={<Logout />} />
              <Route path="/file" element={<FileUpload />} />
              <Route path="/admin/products" element={<ProductsDemo />} /> 
              {/* Add more routes as needed */}
          </Routes>
      </Router>
  );
}

export default App;