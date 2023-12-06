// OrderSuccessPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OrderSuccessPage = () => {
  const [orderId, setOrderId] = useState('Loading...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("emptyCart executing");
        const response = await axios.post('http://localhost:8000/patient/emptyCart', {}, {withCredentials: true});
        const fetchedOrderId = response.data.orderId;
        setOrderId(fetchedOrderId);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []); // Run the effect only once on component mount

  return (
    <div>
      <h1>Order Placed Successfully!</h1>
      <p>Order ID: {orderId}</p>

      <Link to="/patient">
        <button>Home</button>
      </Link>
    </div>
  );
};

export default OrderSuccessPage;
