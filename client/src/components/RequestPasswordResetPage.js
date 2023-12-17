// RequestPasswordResetPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RequestPasswordResetPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (event) => {
      event.preventDefault();
      
      try {
      setLoading(true);
      setMessage('');
      
      const response = await axios.post('http://localhost:8000/request-reset', { email }, {withCredentials: true});
      const data = response.data;
      navigate(`/enter-otp`);
      
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Failed to request password reset.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Request Password Reset</h1>


      <form onSubmit={handleFormSubmit}>
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          />
          
          {message && (
            <div style = {{color:'red'}} className='center-aligned'>
              {message.text}
            </div>
          )}
          <br></br>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Requesting...' : 'Request Reset'}
        </button>
      </form>

      <p>
        <Link to="/">Back to Login</Link>
      </p>
    </div>
  );
};

export default RequestPasswordResetPage;
