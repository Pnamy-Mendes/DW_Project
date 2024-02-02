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
import './pages/css/navbar.css';

function Navbar() {

  const userPermissions = Cookies.get('userPermissions');
  const requiredPermissions = ['4'];
  const hasPermission =
    userPermissions &&
    requiredPermissions.every((permission) => userPermissions.includes(permission)); // Convert to string for comparison 
  const isLoggedIn = Cookies.get('userInfo');
  const navigate = useNavigate(); 
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Retrieve cart count from a normal cookie
    const cartItems = Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [];
    setCartCount(cartItems.length);
}, []);

const items = [
  {
      label: `Cart (${cartCount})`,
      icon: 'pi pi-fw pi-shopping-cart',
      command: () => {
          navigate('/cart');
      }
  },
  ...(userPermissions && userPermissions.includes('4') ? [{
      label: 'Admin Panel',
      icon: 'pi pi-fw pi-cog',
      command: () => {
          navigate('/admin');
      }
  }] : []),
  {
      label: 'Logout',
      icon: 'pi pi-fw pi-sign-out',
      command: () => {
          navigate('/logout');
      }
  }
];

return isLoggedIn ? <MegaMenu model={[{items: [items]}]} orientation="horizontal" /> : null;


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
