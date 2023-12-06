import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Define the FailedOrderPage component
const FailedOrderPage = () => {
  // Use useEffect to execute code on component mount
  useEffect(() => {
    const handleFailedOrder = async () => {
      try {
        // Make a POST request to the backend endpoint
        const response = await axios.post('http://localhost:8000/patient/failedOrder', {}, { withCredentials: true });

        // Log the response from the server (optional)
        console.log(response.data);

        // Redirect to the checkout page
        window.location.href = '/patient/checkout';
      } catch (error) {
        // Handle errors (optional)
        console.error(error);
      }
    };

    // Call the function to handle the failed order
    handleFailedOrder();
  }, []); // Run the effect only once on component mount

  return (
    <div>
      <h1>Order Payment Failed</h1>
      <Link to="/patient/checkout">
        <button>Back to Checkout</button>
      </Link>
    </div>
  );
};

export default FailedOrderPage;
