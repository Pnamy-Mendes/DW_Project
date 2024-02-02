import React, { useState, useEffect, useContext} from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext'; 
import { Message } from 'primereact/message';
import { Button } from 'primereact/button'; 
import Cookies from 'js-cookie';


import './css/LoginForm.css';
import isAuthenticated from '../utils/isAuthenticated';
import GitHubLogo from '../media/GitHub_Logo_White.png';
import GitHubMark from '../media/github-mark-white.png';
import ConfigContext from './../contexts/ConfigContext' 


function LoginForm({ showToast }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { getApiUrl } = useContext(ConfigContext);
    const apiUrl = getApiUrl();
    const [isOAuthLogin, setIsOAuthLogin] = useState(false); // Track if login is initiated via GitHub

    const handleGitHubLogin = () => {
        setIsOAuthLogin(true); // Set OAuth login to true
        window.location.href = `${apiUrl}:3001/auth/github`;
    };

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/');
        }
        if (!isOAuthLogin && (!username || !password)) {
            const errorParam = searchParams.get('error');
            if (errorParam) {
                setError(decodeURIComponent(errorParam));
                if (showToast) {
                    showToast('error', 'Error', decodeURIComponent(errorParam));
                }
            }
        }
    }, [navigate, searchParams, showToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isOAuthLogin && (!username || !password)) {
            if (!username || !password) {
                const errorMessage = 'Please enter your username and password.';
                setError(errorMessage);
                if (showToast) {
                    showToast('warn', 'Warning', errorMessage);
                }
                return;
            }
        }

        try {
            const response = await axios.post(`${apiUrl}:3001/login`, { username, password }, { withCredentials: true }); 
            const requiredPermissions = ['4']
            const userPermissions = Cookies.get('userPermissions');
            const hasPermission =
                userPermissions &&
                requiredPermissions.every((permission) => userPermissions.includes(permission));
            
            hasPermission ? navigate('/admin/') : navigate('/');
            
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
                if (showToast) {
                    showToast('error', 'Error', error.response.data.message);
                }
            } else {
                setError('An error occurred');
            }
        }
    };
 


    return (
        <div className="login-page">
            <div className="form-container">
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="field" style={{ marginBottom: '1rem' }}> {/* Adjust this value as needed */}
                        <span className="p-float-label">
                            <InputText
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={error ? 'p-invalid login' : 'login'}
                            />
                            <label htmlFor="username">Username</label>
                        </span>
                    </div>
                    <div className="field" style={{ marginBottom: '1rem' }}> {/* Adjust this value as needed */}
                        <span className="p-float-label">
                            <InputText
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={error ? 'p-invalid login' : 'login'}
                            />
                            <label htmlFor="password">Password</label>
                        </span>
                    </div>
                    {error && (
                        <Message severity="error" text={error} />
                    )}
                    <Button type="submit" label="Login" />
                    <Button onClick={handleGitHubLogin} className="github-login-btn">
                        <img src={GitHubMark} alt="GitHub" className="github-logo" />
                        <img src={GitHubLogo} alt="GitHub" className="github-name-logo" />
                        Continue with GitHub
                    </Button>
                    <div className="register-link">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
