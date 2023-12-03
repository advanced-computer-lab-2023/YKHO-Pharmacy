// LogoutButton.jsx
import React from 'react';
import axios from 'axios';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/logout');
      // Assuming the server will handle session destruction and redirect
      // If needed, you might want to handle client-side cleanup here
      onLogout(); // Invoke the onLogout callback
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle error if necessary
    }
  };

  return (
    <button onClick={handleLogout} className='logout-btn'>Logout</button>
  );
};

export default LogoutButton;
