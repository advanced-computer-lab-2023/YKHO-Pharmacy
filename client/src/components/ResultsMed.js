// ResultsMed.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ResultsMed = () => {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming the searchResults are passed through the location state
        const { searchResults } = location.state;

        // You might want to perform additional fetch or processing here if needed
        setSearchResults(searchResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchData();
  }, [location.state]);

  const handleAddToCart = async (medicineName, price) => {
    try {
      // Make a POST request to add the medicine to the shopping cart
      await axios.post('http://localhost:8000/patient/addToCart', {
        medicineName: medicineName,
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
      <h1 className="header-text">Search Results</h1>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Price</th>
            <th>Result</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.slice(1).map((result, index) => (
            <tr key={index}>
              <td>{result.medicineName}</td>
              <td>{result.price}</td>
              <td>{result.result ? 'Found' : 'Not Found'}</td>
              <td className="action-cell">
                {result.result && (
                  <button onClick={() => handleAddToCart(result.medicineName, result.price)} className="accept-button">
                    Add to Cart
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmationMessage && (
        <div className="confirmation-message" style={{ color: 'green' }}>
          {confirmationMessage}
        </div>
      )}

    </div>
  );
};

export default ResultsMed;
