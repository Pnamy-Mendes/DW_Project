import React, { useEffect, useState, useRef } from 'react';
import { ConfigProvider } from './contexts/ConfigContext';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import Cookies from 'js-cookie';

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
import { useNavigate } from 'react-router-dom';
import { MegaMenu } from 'primereact/megamenu';
import { Badge } from 'primereact/badge';
import './pages/css/navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const userInfo = Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : null;
  const userPermissions = Cookies.get('userPermissions') ? JSON.parse(Cookies.get('userPermissions')) : [];
  const hasAdminAccess = userPermissions.includes('4');
  const [cartCount, setCartCount] = useState(0);
  const isAuthenticated = Cookies.get('userInfo');

  useEffect(() => {
      const cartItems = Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [];
      setCartCount(cartItems.length);
  }, []);

  const menuItems = [
    {
      label: userInfo ? userInfo.username : 'User',
      icon: 'pi pi-fw pi-user',
      command: () => {},
      items: [
        [
          ...(hasAdminAccess ? [{ label: 'Admin Panel', command: () => navigate('/admin') }] : []),
          { label: 'Logout', command: () => navigate('/logout') }
        ]
      ]
    }
  ];

  // Wrap both the MegaMenu and the cart icon with a div to align them
  return (
    <div>

      {isAuthenticated && <div className="navbar">
        <div className="menu-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <MegaMenu model={menuItems} orientation="horizontal" />
          <Badge value={cartCount} severity="info" className="cart-badge" onClick={() => navigate('/cart')}>
            <i className="pi pi-shopping-cart" style={{ cursor: 'pointer' }}></i>
          </Badge>
        </div>
      </div>}
    </div>
  );
}



function ProtectedRoute({ children, requiredPermissions }) {
  const userPermissions = Cookies.get('userPermissions');
  const hasPermission =
    userPermissions &&
    requiredPermissions.every((permission) => userPermissions.includes(permission)); // Convert to string for comparison
  const isLoggedIn = Cookies.get('userInfo');

    return hasPermission ? 
        children 
    : 
        isLoggedIn ?
            <Navigate to="/" replace />
        :
            <Navigate to="/login" replace />
    ;
}

function App() {
  const toast = useRef(null);
  const [config, setConfig] = useState({});
  const isProduction = false;

  const getProd = () => {
    return isProduction ? 'http://82.154.212.23' : 'http://localhost';
  };

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
    <ConfigProvider /* value={configValue}  */ value={{ getApiUrl }}>
      <Router>
        <Toast ref={toast} />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage showToast={showToast}/>} />
          {/* <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} /> */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<LoginForm showToast={showToast} />} />
          <Route path="/register" element={<RegisterForm showToast={showToast} />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/file" element={<FileUpload />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                requiredPermissions={['4']}
              >
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/products" element={
              <ProtectedRoute
                requiredPermissions={['4']}
              >
                <ProductsDemo />
              </ProtectedRoute>
            } />
          <Route path="/admin/users" element={
              <ProtectedRoute
                requiredPermissions={['5']}
              >
                <ManageUserRelated />
              </ProtectedRoute>
            } />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
