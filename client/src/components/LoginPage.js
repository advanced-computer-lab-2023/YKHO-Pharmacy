// LoginPage.jsx
import React from 'react';
import '../App.css';
import LoginForm from './loginForm';
import axios from 'axios';

const LoginPage = ({ onLogin, onLogout }) => {
  
    try {
      axios.get('http://localhost:8000/logout', {withCredentials: true});
      // Assuming the server will handle session destruction and redirect
      // If needed, you might want to handle client-side cleanup here
      onLogout(); // Invoke the onLogout callback
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle error if necessary
    }

  return (
    <div>
      <h1 className="center-aligned">Welcome</h1>
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default LoginPage;
