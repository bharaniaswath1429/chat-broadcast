import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { toast } from 'react-toastify';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/auth/signup', { username, password });
            console.log(response.data.message);
            toast.success('Created Succesfully!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'An error occurred')
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center signup-container">
            <div className="form-container shadow-sm p-4 rounded">
                <h2 className="text-center mb-4">Signup</h2>
                <form onSubmit={handleSignup}>
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
                    <button type="submit" className="btn btn-primary w-100 mb-4">Signup</button>
                    <p>Already have an account? <a href='/'>Login</a></p>
                </form>
            </div>
        </div>
    );
};

export default Signup;

