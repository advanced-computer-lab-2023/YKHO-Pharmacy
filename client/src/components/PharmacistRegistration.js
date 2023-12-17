// PharmacistRegistration.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PharmacistRegistration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [educationalBackground, setEducationalBackground] = useState('');
  const [idFile, setIdFile] = useState(null);
  const [medicalDegreeFile, setMedicalDegreeFile] = useState(null);
  const [workingLicenseFile, setWorkingLicenseFile] = useState(null);
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
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('hourlyRate', hourlyRate);
      formData.append('affiliation', affiliation);
      formData.append('educationalBackground', educationalBackground);
      formData.append('idFile', idFile);
      formData.append('medicalDegreeFile', medicalDegreeFile);
      formData.append('workingLicenseFile', workingLicenseFile);

      const response = await axios.post('http://localhost:8000/guest/createRequest', formData, {withCredentials: true});

      if (response.status === 201) {
        // Registration successful
        navigate('/');
        // Redirect to the login page or wherever appropriate
      } else {
        console.error('Registration failed:', response.data);
        setRegistrationError(response.data.message || 'Registration failed. Please try again.'); // Assuming the server sends an error message
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setRegistrationError('Pharmacist with the same username or email already exists');
      } else {
        console.error('Error during registration:', error);
        setRegistrationError('An error occurred during registration. Please try again later.');
        // Handle registration error
      }
    }
  };

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
    return regex.test(password);
  };

  return (
    <div className="center-aligned">
      <h2 className="header-text">Pharmacist Registration</h2>
      <form onSubmit={handleRegister} encType="multipart/form-data">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '280px' }}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '280px' }}
          />
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '280px' }}
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '280px' }}
          />
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            style={{ width: '280px' }}
          />
        
        <label htmlFor="hourlyRate">Hourly Rate:</label>
        <input
          type="number"
          id="hourlyRate"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          required
          style={{ width: '280px' }}
        />
        <label htmlFor="affiliation">Affiliation:</label>
        <input
          type="text"
          id="affiliation"
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
          required
          style={{ width: '280px' }}
        />
        <label htmlFor="educationalBackground">Educational Background:</label>
        <input
          type="text"
          id="educationalBackground"
          value={educationalBackground}
          onChange={(e) => setEducationalBackground(e.target.value)}
          required
          style={{ width: '280px' }}
        />
        <label htmlFor="idFile">ID File:</label>
        <input
          type="file"
          id="idFile"
          onChange={(e) => setIdFile(e.target.files[0])}
          accept=".pdf, .doc, .docx"
          required
          style={{ width: '280px' }}
        />
        <label htmlFor="medicalDegreeFile">Medical Degree File:</label>
        <input
          type="file"
          id="medicalDegreeFile"
          onChange={(e) => setMedicalDegreeFile(e.target.files[0])}
          accept=".pdf, .doc, .docx"
          required
          style={{ width: '280px' }}
        />
        <label htmlFor="workingLicenseFile">Working License File:</label>
        <input
          type="file"
          id="workingLicenseFile"
          onChange={(e) => setWorkingLicenseFile(e.target.files[0])}
          accept=".pdf, .doc, .docx"
          required
          style={{ width: '280px' }}
        />
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
        <button type="submit">Submit Request</button>
        <br></br>
        <div>
          <button onClick={() => navigate('/register')} className='reject-button'>Back</button>
        </div>
        <br></br>
      </form>
    </div>
  );
};

export default PharmacistRegistration;
