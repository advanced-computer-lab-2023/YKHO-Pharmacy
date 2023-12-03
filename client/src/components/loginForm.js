// LoginForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const { userType } = await response.data;
      if (response.status === 200) {
        onLogin(userType);
        navigate(`/${userType}/home`);
      } else {
        console.error('Login failed:', response.data);
        setLoginError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.status === 401) {
        // Unauthorized (incorrect username or password)
        setLoginError('Incorrect username or password. Please try again.');
      } else {
        // Other errors
        setLoginError('An error occurred during login. Please try again later.');
      }
      setPassword(''); // Clear the password field on error
    }
  };
  

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
      {loginError && <p>{loginError}</p>}
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
      <p>
        <Link to="/request-reset">Forgot Password</Link>
      </p>
    </form>
  );
};

export default LoginForm;
