// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the MedicinesList component
const MedicinesList = () => {
  // State to store the medicines, loading state, and search/filter values
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');

  // Fetch medicines from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch medicines from the backend
        const response = await axios.get('http://localhost:8000/admin/medicines/', {withCredentials: true});
        console.log('API response:', response.data);

        // Check if 'medicines' exists in the API response
        if (response.data && response.data.medicines) {
          setMedicines(response.data.medicines);
        } else {
          console.error('No "medicines" found in the API response:', response.data);
        }

        // Set loading to false after fetching data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    // Invoke the fetchData function
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once on mount

  // Filter medicines based on search and filter terms
  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTerm === '' || medicine.medUse.toLowerCase() === filterTerm.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Render loading message while data is being fetched
  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  // Render the MedicinesList component
  return (
    <div className="center-aligned">
      <h1 className="header-text">Medicine List</h1>
      
      {/* Search Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by medicine name"
        />
      </form>

      {/* Filter Form */}
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          placeholder="Filter by Medicinal Use"
        />
      </form>

      {/* Medicines Table */}
      <table className="requests-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Dosage</th>
            <th>Description</th>
            <th>Medicinal Use</th>
            <th>Price</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Export the MedicinesList component
export default MedicinesList;
