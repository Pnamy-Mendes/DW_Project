import React, { useEffect, useState, useRef } from 'react';
import { ConfigProvider } from './contexts/ConfigContext';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toast } from 'primereact/toast';

import HomePage from './pages/HomePage';
import Products from './pages/Products'; 
import ProductDetail from './pages/ProductDetail';
import CartPage from './components/CartPage';
import AdminPanel from './pages/AdminPanel';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Logout from './utils/Logout';
import FileUpload from './components/fileUpload';
import ProductsDemo from './components/ProductManagement'; 
import ManageUserRelated from './components/ManageUserRelated'; 

function App() {
  const toast = useRef(null);
  const [config, setConfig] = useState({});
  const isProduction = false;

  const getProd = () => {
      return isProduction ? 'http://82.154.212.23':'http://localhost'
  }

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const baseUrl = isProduction ? 'http://82.154.212.23' : 'http://localhost';
        const response = await axios.get(`${baseUrl}:3001/config`);
        setConfig(response.data);
      } catch (error) {
        console.error('Failed to fetch configuration:', error);
      }
    };

    fetchConfig();
  }, [isProduction]);

  /* const getApiUrl = () => {
    if (config && config.apiUrl) {
      return config.apiUrl;
    }
    const fallbackUrl = process.env.REACT_APP_API_BASE_URL || getProd();
    return fallbackUrl;
  }; */
  const getApiUrl = () => {
    const baseUrl = isProduction ? 'http://82.154.212.23' : 'http://localhost';
    return `${baseUrl}`; // Ensure this matches your backend server's URL and port
  };
  

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000, position: 'top-right' });
  };

  // Providing getApiUrl function and config via context
  const configValue = { ...config, getApiUrl };

  return (
    <ConfigProvider /* value={configValue}  */value={{ getApiUrl }}>
      <Router>
        <Toast ref={toast} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<LoginForm showToast={showToast} />} />
          <Route path="/register" element={<RegisterForm showToast={showToast} />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/file" element={<FileUpload />} />
          <Route path="/admin/products" element={<ProductsDemo />} />
          <Route path="/admin/users" element={<ManageUserRelated />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
