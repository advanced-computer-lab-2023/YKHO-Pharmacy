// RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('Male'); // Default to Male
  const [mobileNumber, setMobileNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState({
    fullName: '',
    mobileNumber: '',
    relation: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate password
    if (!isValidPassword(password)) {
        setPasswordError('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.');
        return;
      }
  
      // Reset password error if validation passes
      setPasswordError('');
  
      // Implement your registration logic here
      try {
      const response = await axios.post('http://localhost:8000/guest/createPatient', {withCredentials: true}, {
        username,
        password,
        name,
        email,
        dateOfBirth,
        gender,
        mobileNumber,
        emergencyContact,
        // Add other registration fields as needed
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        // Registration successful
        navigate(`/`);
        // Redirect to the login page or wherever appropriate
      } else {
        console.error('Registration failed:', response.data);
        setRegistrationError(response.data.message || 'Registration failed. Please try again.'); // Assuming the server sends an error message
      }
    } catch (error) {
        if (error.response && error.response.status === 400) {
        setRegistrationError('Patient with the same username or email already exists');
      } else {
          console.error('Error during registration:', error);
          setRegistrationError('An error occurred during registration. Please try again later.');
          // Handle registration error
      }
    }
  };

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$%^&*])/;
    return regex.test(password);
  };

  return (
    <div>
      <h2 class="center-aligned">Patient Registration</h2>
      <form onSubmit={handleRegister}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
            <br></br>
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="number"
            id="mobileNumber"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        <h2>Emergency Contact</h2>
          <label htmlFor="emergencyContact[fullName]">Full Name:</label>
          <input
            type="text"
            id="emergencyContact[fullName]"
            value={emergencyContact.fullName}
            onChange={(e) => setEmergencyContact({ ...emergencyContact, fullName: e.target.value })}
            required
          />
          <label htmlFor="emergencyContact[mobileNumber]">Mobile Number:</label>
          <input
            type="number"
            id="emergencyContact[mobileNumber]"
            value={emergencyContact.mobileNumber}
            onChange={(e) => setEmergencyContact({ ...emergencyContact, mobileNumber: e.target.value })}
            required
          />
          <label htmlFor="emergencyContact[relation]">Relation to the Patient:</label>
          <input
            type="text"
            id="emergencyContact[relation]"
            value={emergencyContact.relation}
            onChange={(e) => setEmergencyContact({ ...emergencyContact, relation: e.target.value })}
            required
          />
        {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
        <button type="submit">Register</button>
        <br></br>
      </form>
    </div>
  );
};

export default RegisterPage;
