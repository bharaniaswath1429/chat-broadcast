import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { toast } from 'react-toastify';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            toast.success('Successfully logged-in!')
            localStorage.setItem('userName', response.data.user.username);
            setTimeout(() => {
                navigate('/chat');
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials')
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center login-container">
            <div className="form-container shadow-sm p-4 rounded">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-4">Login</button>
                    <p>Do not have an account? <a href='/signup'>Signup</a></p>
                </form>
            </div>
        </div>
    );
};

export default Login;
