import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedicinesListPatient = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/patient/medicines', {
          withCredentials: true,
        });
        if (response.data && response.data.medicines) {
          setMedicines(response.data.medicines);
        } else {
          console.error('No "medicines" found in the API response:', response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterTerm === '' || medicine.medUse.toLowerCase() === filterTerm.toLowerCase();
    return matchesSearch && matchesFilter;
  });

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

  const onHandleGetAlternatives = (medicineName) => {
    navigate(`/patient/alternative/${medicineName}`);
  };

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="center-aligned">
      <h1 className="header-text">Medicine List</h1>

      {confirmationMessage && (
        <div className="confirmation-message" style={{ color: 'green' }}>
          {confirmationMessage}
        </div>
      )}

      <form action="/patient/searchMedicines" method="GET">
        <input
          type="text"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by medicine name"
        />
      </form>

      <form action="/patient/medicines/filter" method="get">
        <input
          type="text"
          name="medUse"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          placeholder="Filter by Medicinal Use"
        />
      </form>

      <table className="requests-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Dosage</th>
            <th>Description</th>
            <th>Medicinal Use</th>
            <th>Price</th>
            <th>Stock Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedicines.map((medicine) => (
            <tr key={medicine._id}>
              <td>
                <img
                  src={medicine.image}
                  alt="Medicine"
                  style={{ width: '200px', height: '150px' }}
                />
              </td>
              <td>{medicine.name}</td>
              <td>{medicine.dosage}</td>
              <td>{medicine.description}</td>
              <td>{medicine.medUse}</td>
              <td>{medicine.price}</td>
              <td>{medicine.quantity > 0 ? ('In Stock') : ('Out of Stock')}</td>
              <td className="action-cell">
                {medicine.needPres ? (
                  <span>Prescription Needed</span>
                ) : (
                  <React.Fragment>
                    {medicine.quantity > 0 ? (
                      <button type="button" onClick={() => handleAddToCart(medicine)} className='accept-button'>
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => onHandleGetAlternatives(medicine.name)}
                        className='reject-button'
                      >
                        View Alternative
                      </button>
                    )}
                  </React.Fragment>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicinesListPatient;
