// Import necessary dependencies
import React, { useState } from 'react';
import axios from 'axios';

// Define the GetPharmacist component
const GetPharmacist = () => {
  // State to store the name, message, and pharmacist data
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [pharmacistData, setPharmacistData] = useState(null);

  // Function to format date in "day/month/year" format
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make a POST request to fetch pharmacist data
      const response = await axios.post('http://localhost:8000/admin/getPharmacist', { name }, {withCredentials: true});
      const data = response.data;

      if (data.message) {
        // If there is a message, set the message and clear pharmacist data
        setMessage(data.message);
        setPharmacistData(null);
      } else {
        // If there is no message, clear any previous message and set pharmacist data
        setMessage('');
        setPharmacistData(data);
      }

      // Clear the input field
      setName('');
    } catch (error) {
        if (error.response && error.response.status === 404) {
            setMessage('Pharmacist not found');
            setPharmacistData(null);
        } else {
            console.error(error);
        }
    }
  };

    // Function to handle remove button click
    const handleRemove = async () => {
    try {
      // Make a POST request to remove the patient
      const response = await axios.post('http://localhost:8000/admin/removePharmacist', { name }, { withCredentials: true });
      const data = response.data;

      // Display the removal message
      setMessage(data.message);

      // Clear patient data after removal
      setPharmacistData(null);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage("Type the pharmacist's name above to confirm");
      } else {
        console.error(error);
      }
    }
  };

  // Render the GetPharmacist component
  return (
    <div className='center-aligned'>
      <h1 className='center-aligned'>Pharmacist</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <button type="submit">Pharmacist</button>
      </form>
      <p style={{ color: 'red' }}>{message}</p>
      {pharmacistData && (
        <div>
          <h2>Pharmacist Details</h2>
          <p><strong>Username:</strong> {pharmacistData.username}</p>
          <p><strong>Name:</strong> {pharmacistData.name}</p>
          <p><strong>Email:</strong> {pharmacistData.email}</p>
          <p><strong>Date of birth:</strong> {formatDate(pharmacistData.dateOfBirth)}</p>
          <p><strong>Hourly Rate:</strong> {pharmacistData.hourlyRate}</p>
          <p><strong>Affiliation:</strong> {pharmacistData.affiliation}</p>
          <p><strong>Educational Background:</strong> {pharmacistData.educationalBackground}</p>
          <button onClick={handleRemove} className='reject-button'>Remove Pharmacist</button>
        </div>
      )}
      <br></br>
    </div>
  );
};

// Export the GetPharmacist component
export default GetPharmacist;
