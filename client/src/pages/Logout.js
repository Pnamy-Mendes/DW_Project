// Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      // You can perform any necessary cleanup or logout logic here
      // For example, clear local storage, revoke tokens, etc.
      
      // Redirect to the login page after logout
      navigate('/login');
    };

    handleLogout();
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default Logout;
