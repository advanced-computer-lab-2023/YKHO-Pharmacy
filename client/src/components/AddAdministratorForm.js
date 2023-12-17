import React, { useState } from 'react';
import axios from 'axios';

const AddAdministratorForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleAddAdministrator = async (event) => {
    event.preventDefault();

    if (!isValidPassword(password)) {
      setPasswordError('Password must contain at least 1 uppercase letter, 1 lowercase letter, no spaces, and at least 1 special symbol.');
      return;
    }

    setPasswordError('');

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError('');

    try {
      const response = await axios.post('http://localhost:8000/admin/addadministrator', {
        username,
        password,
        email,
      }, {withCredentials: true},
      );

      const data = response.data;
      setMessage(data.message);

      // Clear form fields
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (error) {
      console.error(error.response);
      if (error.response && error.response.status === 400) {
        setMessage('Username Already Exists, Try another one.');
      }
    }
  };

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$%^&*])/;
    return regex.test(password);
  };

  const isValidEmail = (email) => {
    // Basic email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="center-aligned">
      <h1 className="header-text">Add Administrator</h1>
      <form onSubmit={handleAddAdministrator}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <div style={{ color: 'red' }}>{passwordError}</div>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <div style={{ color: 'red' }}>{emailError}</div>
        <br />
        <button type="submit">Add Administrator</button>
      </form>
      <p id="message" className='center-aligned'>{message}</p>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default AddAdministratorForm;
