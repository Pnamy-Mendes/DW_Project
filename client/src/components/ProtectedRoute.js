import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import isAuthenticated from './../utils/isAuthenticated';

const ProtectedRoute = ({ children, requiredLevel }) => {
    const userPermissions = Cookies.get('userPermissions');
    const permissionLevels = userPermissions ? userPermissions.split(',').map(Number) : [];
    const hasPermission = permissionLevels.includes(requiredLevel);
    const isLoggedIn = isAuthenticated();
    console.log('hasPermission', hasPermission);
    console.log(userPermissions);
    return hasPermission ? 
        children 
    : 
        isLoggedIn ?
            <Navigate to="/" replace />
        :
            <Navigate to="/login" replace />
    ;
};

export default ProtectedRoute;
