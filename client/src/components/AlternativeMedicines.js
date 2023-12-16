import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AlternativeMedicines = () => {
  const { medicineName } = useParams();
  const [alternatives, setAlternatives] = useState([]);
  const [addedMedicines, setAddedMedicines] = useState([]);

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

        // Update the addedMedicines state
        setAddedMedicines([...addedMedicines, medicine]);

    } catch (error) {
        console.error('Error adding medicine to the shopping cart:', error.message);
        // Handle error if needed
    }
    };

  return (
    <div className="center-aligned">
      <h1 className="header-text">Alternative Medicines for {medicineName}</h1>

      {alternatives.length > 0 ? (
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
          {alternatives
            .filter((medicine) => !medicine.archived) // Filter out archived medicines
            .map((medicine) => (
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
                <td>{medicine.quantity > 0 ? 'In Stock' : 'Out of Stock'}</td>
                <td className="action-cell">
                  {medicine.needPres ? (
                    <span>Prescription Needed</span>
                  ) : (
                    <React.Fragment>
                      {addedMedicines.includes(medicine) ? (
                        <span>Added Successfully</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddToCart(medicine)}
                          className="accept-button"
                        >
                          Add to Cart
                        </button>
                      )}
                      </React.Fragment>
                  )}
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
