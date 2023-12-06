import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateMedicine = () => {
  const [formData, setFormData] = useState({
    image: '',
    name: '',
    dosage: '',
    description: '',
    medUse: '',
    quantity: 0,
    sales: 0,
    price: 0,
    needPres: false,
  });
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to create a new medicine
      await axios.post('http://localhost:8000/pharmacist/createMedicines', formData, {withCredentials: true});
    
      // Check if the response contains a message
      console.log('Medicine created successfully');
      navigate("/pharmacist/medicines");
      
    } catch (error) {
        if (error.response && error.response.status === 404 )
            setMessage('Medicine with the same name already exists');
        
        console.error('Error creating medicine:', error.message);
      // You may want to handle errors, e.g., displaying an error message
    }
  };

  return (
    <div className='center-aligned'>
      <h1>Create Medicine</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="name">Medicine Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="dosage">Dosage:</label>
        <input
          type="text"
          id="dosage"
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea><br />

        <label htmlFor="medUse">Medical Use:</label>
        <input
          type="text"
          id="medUse"
          name="medUse"
          value={formData.medUse}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="0"
          value={formData.quantity}
          onChange={handleChange}
          required
          /><br />

        <label htmlFor="sales">Sales:</label>
        <input
          type="number"
          id="sales"
          name="sales"
          min="0"
          value={formData.sales}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        /><br />

        <label htmlFor="needPres">Prescription Required:</label>
        <input
          type="checkbox"
          id="needPres"
          name="needPres"
          checked={formData.needPres}
          onChange={handleChange}
        /><br />
        {message && <div style={{ color: 'red' }}>{message}</div>}
        <br></br>
        <button type="submit">Create Medicine</button>
      </form>
      <br></br>
    </div>
  );
};

export default CreateMedicine;
