// LoginPage.jsx
import React from 'react';
import '../App.css';
import LoginForm from './loginForm';

const LoginPage = ({ onLogin }) => {
  return (
    <div>
      <h1>Welcome</h1>
      <LoginForm onLogin={onLogin} />
    </div>
  );
};

export default LoginPage;
