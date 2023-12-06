import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { userType } = useParams(); // Get userType from the URL params
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$%^&*])/;
    return regex.test(password);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setMessage({ type: 'error', text: 'New password does not meet the criteria.' });
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8000/${userType}/change-password`, {
        oldPassword,
        newPassword,
      }, {withCredentials: true});

      if (response.status === 200) {
        setMessage({ type: 'success', text: response.data.message });
        navigate(`/${userType}/home`);
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setMessage({ type: 'error', text: 'Incorrect old password' });
      } else {
            console.error('Error changing password:', error.message);
            setMessage({ type: 'error', text: 'An error occurred while changing the password.' });
      }
    }
  };

  return (
    <div className='center-aligned'>
      <h1>Change Password</h1>

      {message && (
        <div style={{ color: 'red' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleChangePassword}>
        <label htmlFor="oldPassword">Old Password:</label>
        <input
          type="password"
          name="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />

        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
