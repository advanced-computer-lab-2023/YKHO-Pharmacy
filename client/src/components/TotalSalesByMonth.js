import React, { useState } from 'react';
import axios from 'axios';

const TotalSalesByMonth = () => {
  const [month, setMonth] = useState('');
  const [totalSales, setTotalSales] = useState(null);

  const handleGetTotalSales = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/pharmacist/salesReport', { month }, { withCredentials: true });
      setTotalSales(response.data.totalSales);
    } catch (error) {
      console.error('Error fetching total sales:', error.message);
    }
  };

  return (
    <div className="center-aligned">
      <h1 className="header-text">Total Sales By Month</h1>

      <form onSubmit={handleGetTotalSales}>
        <label htmlFor="month">Enter Month:</label>
        <input
          type="text"
          id="month"
          name="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        />
        <button type="submit">Get Total Sales</button>
      </form>
      <br></br>

      {totalSales !== null && (
        <p>Total Sales: {totalSales}</p>
      )}
    </div>
  );
};

export default TotalSalesByMonth;
