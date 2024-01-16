// src/utils/isAuthenticated.js
import Cookies from 'js-cookie';

const isAuthenticated = () => {
    // Check if the userInfo cookie is set
    return !!Cookies.get('userInfo');
};

export default isAuthenticated;
