import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        Cookies.remove('userInfo'); // Clear the authentication cookie
        Cookies.remove('userPermissions'); // Clear the permissions cookie
        navigate('/login'); // Redirect to the login page
    }, [navigate]);

    return null;
}

export default Logout;