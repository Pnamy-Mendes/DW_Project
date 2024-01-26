import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './css/LoginForm.css';   
import isAuthenticated from '../utils/isAuthenticated';


function RegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [errorField, setErrorField] = useState(''); // New state to track which field caused the error
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/register', { username, email, password }, { withCredentials: true });
            // Handle successful registration...
            navigate('/');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
                setErrorField(error.response.data.errorField); // Assume the server specifies the field in error
            }
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="register-form">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className={errorField === 'username' ? 'error-input' : ''}
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className={errorField === 'email' ? 'error-input' : ''}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Register</button>
                {error && <div className="error-message">{error}</div>}
                <div className="login-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </form>
        </div>
    );
}

export default RegisterForm;