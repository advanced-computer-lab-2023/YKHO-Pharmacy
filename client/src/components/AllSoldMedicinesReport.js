import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllSoldMedicinesReport = () => {
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [medicineNameFilter, setMedicineNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pharmacist/allSoldMedicinesReport', { withCredentials: true });
        setMedicineDetails(response.data.medicineDetails);
      } catch (error) {
        console.error('Error fetching medicine details:', error.message);
      }
    };

    fetchMedicineDetails();
  }, []); // Run the effect only once on component mount

  const handleFilterByName = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/pharmacist/filterMedicinesByName?medicineName=${medicineNameFilter}`, { withCredentials: true });
      setMedicineDetails(response.data.medicineDetails);
    } catch (error) {
      console.error('Error filtering by name:', error.message);
    }
  };

  const handleFilterByDate = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/pharmacist/filterMedicinesByDate?date=${dateFilter}`, { withCredentials: true });
      setMedicineDetails(response.data.medicineDetails);
    } catch (error) {
      console.error('Error filtering by date:', error.message);
    }
  };

  return (
    <div className="center-aligned">
      <h1 className="header-text">All Sold Medicines Report</h1>

      {/* Filter by Medicine Name Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleFilterByName(); }}>
        <label htmlFor="medicineName">Filter by Medicine Name:</label>
        <input
          type="text"
          id="medicineName"
          name="medicineName"
          value={medicineNameFilter}
          onChange={(e) => setMedicineNameFilter(e.target.value)}
          required
        />
        <button type="submit">Filter</button>
      </form>

      {/* Filter by Date Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleFilterByDate(); }}>
        <label htmlFor="date">Filter by Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          required
        />
        <button type="submit">Filter</button>
      </form>

      {medicineDetails.length > 0 ? (
        <table className="requests-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Sales</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {medicineDetails.map((detail) => (
              <tr>
                <td>{detail.medicineName}</td>
                <td>{detail.sales}</td>
                <td>{new Date(detail.orderDate).toLocaleDateString('en-GB')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading....</p>
      )}
    </div>
  );
};

export default AllSoldMedicinesReport;
