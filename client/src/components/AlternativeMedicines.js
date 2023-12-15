import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AlternativeMedicines = () => {
  const { medicineName } = useParams();
  const [alternatives, setAlternatives] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const handleGetAlternativeMedicines = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/patient/medicines/alternative`, {
            params: { medicineName },
            withCredentials: true,
        });

        setAlternatives(response.data.alternatives);
      } catch (error) {
        console.error('Error fetching alternative medicines:', error.message);
      }
    };
    
    // Fetch data when the component mounts
    handleGetAlternativeMedicines();
}, [medicineName]);

const handleAddToCart = async (medicine) => {
    try {
        const { name, price } = medicine;

        // Make a POST request to add the medicine to the shopping cart
        await axios.post('http://localhost:8000/patient/addToCart', {
        medicineName: name,
        medicinePrice: price,
        quantity: 1, // You may adjust the quantity as needed
        }, {
        withCredentials: true,
        });

        // Set confirmation message
        setConfirmationMessage('Medicine added to the shopping cart');

        // Clear confirmation message after a few seconds
        setTimeout(() => {
        setConfirmationMessage('');
        }, 3000);
    } catch (error) {
        console.error('Error adding medicine to the shopping cart:', error.message);
        // Handle error if needed
    }
    };

  return (
    <div className="center-aligned">
      <h1 className="header-text">Alternative Medicines for {medicineName}</h1>

      {confirmationMessage && (
        <div className="confirmation-message" style={{ color: 'green' }}>
          {confirmationMessage}
        </div>
      )}

      {alternatives.length > 0 ? (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Description</th>
              <th>Medicinal Use</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alternatives.map((alternative, index) => (
              <tr key={index}>
                <td>{alternative.name}</td>
                <td>{alternative.dosage}</td>
                <td>{alternative.description}</td>
                <td>{alternative.medUse}</td>
                <td>{alternative.price}</td>
                <td className="action-cell">
                  <button type="button" onClick={() => handleAddToCart(alternative)} className='accept-button'>
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No alternative medicines found for {medicineName}.</p>
      )}
    </div>
  );
};

export default AlternativeMedicines;
