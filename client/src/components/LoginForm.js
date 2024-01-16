import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles.css';   
import { Link } from 'react-router-dom';  
import isAuthenticated from '../utils/isAuthenticated';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const navigate = useNavigate(); // useNavigate hook

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/'); // Adjust the path to where you want to redirect
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', { username, password }, { withCredentials: true });
            // Handle successful login
            navigate('/'); // Redirect to home or previous page
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message); // Set error message from server
            }
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="login-form">
                {/* form inputs and buttons */}
                <input
                    type="text"
                    className="input-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit" className="button">Login</button>
                {error && <div className="error-message">{error}</div>}
                <div className="register-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;