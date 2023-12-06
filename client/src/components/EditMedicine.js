import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditMedicine = () => {
  const { name, dosage, description, medUse, price } = useParams();

  const [formData, setFormData] = useState({
    name: decodeURIComponent(name || ''),
    dosage: decodeURIComponent(dosage || ''),
    description: decodeURIComponent(description || ''),
    medUse: decodeURIComponent(medUse || ''),
    price: parseFloat(decodeURIComponent(price || 0)),
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to update the medicine data
      await axios.post('http://localhost:8000/pharmacist/editMedicine', formData, {withCredentials: true});
      console.log('Medicine updated successfully');
      navigate("/pharmacist/medicines");
    } catch (error) {
      console.error('Error updating medicine:', error.message);
      // You may want to handle errors, e.g., displaying an error message
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#333' }}>{formData.name}</label><br />

        <label htmlFor="dosage">Dosage:</label>
        <textarea
          id="dosage"
          name="dosage"
          required
          value={formData.dosage}
          onChange={handleChange}
        ></textarea><br />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
        ></textarea><br />

        <label htmlFor="medUse">Medicinal Use:</label>
        <textarea
          id="medUse"
          name="medUse"
          required
          value={formData.medUse}
          onChange={handleChange}
        ></textarea><br />

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          min="0"
          required
          value={formData.price}
          onChange={handleChange}
        /><br />

        <button type="submit">Edit Medicine</button>
      </form>
      <br></br>
    </div>
  );
};

export default EditMedicine;
