// ChangePassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  // State to store the new password, message, and password validation
  const { userType } = useParams(); // Get userType from the URL params
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Function to handle input change
  const handleInputChange = (e) => {
    const newPasswordValue = e.target.value;
    setNewPassword(newPasswordValue);
  };

  const isValidPassword = (newPassword) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    return regex.test(newPassword);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (!isValidPassword(newPassword)) {
      setMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.');
      return;
    }

    try {
      // Make a POST request to reset the password
      const response = await axios.post(
        `http://localhost:8000/${userType}/resetPassword`,
        { newPassword },
        { withCredentials: true }
      );
      const data = response.data;

      setMessage(data.message);
      setNewPassword('');
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='center-aligned'>
      <h1 className="header-text">Reset Password</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          name="newPassword"
          id="newPasswordInput"
          value={newPassword}
          onChange={handleInputChange}
          required
          style={{ width: '260px' }}
          />

        <div>
          {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
        
        <br></br>
        <button type="submit" disabled={!isValidPassword}>
          Reset
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
