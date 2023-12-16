import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EnterOTPPage = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/verify-otp', { otp }, { withCredentials: true });
      const { userType } = await response.data;

      navigate(`/resetPassword/${userType}`);

      setErrorMessage(null);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            setErrorMessage('Invalid OTP, Try again.');
      } else {
        console.error('Error:', error.message);

        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h1>Enter OTP</h1>

      <form onSubmit={handleFormSubmit}>
        <label htmlFor="otp">OTP:</label>
        <input
          type="text"
          id="otp"
          name="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        
        <button type="submit">Verify OTP</button>
      </form>

      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default EnterOTPPage;
