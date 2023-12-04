// Import necessary dependencies
import React, { useState } from 'react';
import axios from 'axios';

// Define the GetPatient component
const GetPatient = () => {
  // State to store the name, message, and patient data
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [patientData, setPatientData] = useState(null);

  // Function to format date in "day/month/year" format
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to fetch patient data
      const response = await axios.post('http://localhost:8000/admin/getPatient', { name }, { withCredentials: true });
      const data = response.data;

      if (data.message) {
        // If there is a message, set the message and clear patient data
        setMessage(data.message);
        setPatientData(null);
      } else {
        // If there is no message, clear any previous message and set patient data
        setMessage('');
        setPatientData(data);
      }

      // Clear the input field
      setName('');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('Patient not found');
        setPatientData(null);
      } else {
        console.error(error);
      }
    }
  };

 // Function to handle remove button click
 const handleRemove = async () => {
    try {
      // Make a POST request to remove the patient
      const response = await axios.post('http://localhost:8000/admin/removePatient', { name }, { withCredentials: true });
      const data = response.data;

      // Display the removal message
      setMessage(data.message);

      // Clear patient data after removal
      setPatientData(null);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage("Type the patient's name above to confirm");
      } else {
        console.error(error);
      }
    }
  };

  // Render the GetPatient component
  return (
    <div className='center-aligned'>
      <h1 className='center-aligned'>Patient</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <button type="submit">Get Patient</button>
      </form>
      <p style={{ color: 'red' }}>{message}</p>
      {patientData && (
        <div>
          <h2>Patient Details</h2>
          <p><strong>Username:</strong> {patientData.username}</p>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Email:</strong> {patientData.email}</p>
          <p><strong>Date of birth:</strong> {formatDate(patientData.dateOfBirth)}</p>
          <p><strong>Gender:</strong> {patientData.gender}</p>
          <p><strong>Mobile Number:</strong> {patientData.mobileNumber}</p>
          <h3>Emergency Contact</h3>
          <p><strong>Full Name:</strong> {patientData.emergencyContact.fullName}</p>
          <p><strong>Mobile Number:</strong> {patientData.emergencyContact.mobileNumber}</p>
          <p><strong>Relation:</strong> {patientData.emergencyContact.relation}</p>
          <button onClick={handleRemove} className='reject-button'>Remove Patient</button>
        </div>
      )}
      <br></br>
    </div>
  );
};

// Export the GetPatient component
export default GetPatient;
