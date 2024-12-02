import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLogin.css';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset any previous errors

    try {
      // Sending POST request to the backend login route
      const response = await axios.post('http://localhost:5000/admin/login', { email, password });

      if (response.data.success) {
        // Store the JWT token in localStorage
        localStorage.setItem('adminToken', response.data.token);

        console.log('Login successful, redirecting to /admin/dashboard');
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Error handling if the request fails
      const errorMessage = err.response?.data?.message || 'Server error, please try again later';
      setError(errorMessage);
      console.error('Login error:', err);
    }
  };

  return (
    <div className="admin-login">
      <h2>College Admin Login</h2>
      {error && <p className="error">{error}</p>} {/* Display error message */}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
