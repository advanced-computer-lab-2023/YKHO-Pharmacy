import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedicinesListPharm = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pharmacist/medicines/', { withCredentials: true });
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
    const matchesFilter = filterTerm === '' || medicine.medUse.toLowerCase() === filterTerm.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (medicine) => {
    const { name, dosage, description, medUse, price } = medicine;
    navigate(`/pharmacist/editMedicine/${name}/${dosage}/${description}/${medUse}/${price}`);
  };

  const handleArchiveSubmit = async (event, medicine) => {
    event.preventDefault();

    try {
      // Make a POST request to archive/unarchive the medicine
      await axios.post(`http://localhost:8000/pharmacist/archive/${medicine._id}`, {withCredentials: true});
      
      // Reload the page after successful form submission
      setMedicines((prevMedicines) =>
        prevMedicines.map((m) => (m._id === medicine._id ? { ...m, archived: !m.archived } : m))
      );
    } catch (error) {
      console.error('Error archiving/unarchiving medicine:', error.message);
      // Handle error if needed
    }
  };

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="center-aligned">
      <h1 className="header-text">Medicine List</h1>

      <form action="/pharmacist/searchMedicines" method="GET">
        <input
          type="text"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by medicine name"
        />
      </form>

      <form action="/pharmacist/medicines/filter" method="get">
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
            <th>Quantity</th>
            <th>Sales</th>
            <th>Price</th>
            <th>Archive</th>
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
              <td>{medicine.quantity}</td>
              <td>{medicine.sales}</td>
              <td>{medicine.price}</td>
              <td>{medicine.archived ? 'Yes' : 'No'}</td>
              <td className="action-cell">
                <button type="button" onClick={() => handleEdit(medicine)} className='accept-button'>Edit</button>
                <button
                    type="submit"
                    onClick={(event) => handleArchiveSubmit(event, medicine)}
                    className='reject-button'
                    >
                    Toggle Archive
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicinesListPharm;
