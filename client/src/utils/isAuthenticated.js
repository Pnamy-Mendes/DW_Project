// src/utils/isAuthenticated.js
import Cookies from 'js-cookie';

const isAuthenticated = () => {
    // Check if the userInfo cookie is set
    console.log(Cookies.get('userInfo'));
    return !!Cookies.get('userInfo');
};

export default isAuthenticated;
