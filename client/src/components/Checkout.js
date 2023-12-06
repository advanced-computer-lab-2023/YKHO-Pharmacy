import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [deliveryAdd, setDeliveryAdd] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/patient/getcheckout', { withCredentials: true });

        if (response.data) {
          setDeliveryAdd(response.data.deliveryAdd);
          setShoppingCart(response.data.shoppingCart);

          // Calculate total based on shoppingCart
          const calculatedTotal = response.data.shoppingCart.reduce((acc, item) => {
            const subtotal = item.quantity * item.medicinePrice;
            return acc + subtotal;
          }, 0);
          setTotal(calculatedTotal);
        } else {
          console.error('No data found in the API response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching checkout data:', error);
      }
    };

    fetchCheckoutData();
  }, []);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const newAddress = e.target.newAddress.value;

    try {
      const response = await axios.post('http://localhost:8000/patient/addAddress', { newAddress }, { withCredentials: true });

      if (response.status === 200) {
        e.target.newAddress.value = '';
        setDeliveryAdd(response.data.deliveryAdd);
      } else {
        console.error('Failed to add address:', response.data.message);
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error adding address:', error.message);
      setErrorMessage('An error occurred while adding the address');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        'http://localhost:8000/patient/checkout',
        { deliveryAddress: selectedDeliveryAddress, paymentMethod: selectedPaymentMethod },
        { withCredentials: true }
      );
  
      if (response.status === 201) {
        navigate("patient/");
  
        // Clear the shopping cart on the client side
        setShoppingCart([]);
      } else {
        window.location.href = response.data.url;
      }
    } catch (error) {
      if (error.response && error.response.status === 400)
        setErrorMessage('Insufficient funds in the wallet');
      else
        console.error('Error during checkout:', error.message);
    }
  };
  

  return (
    <div className="checkout-container">
      <h1 className='center-aligned'>Checkout</h1>

      <form onSubmit={handleCheckout} className="checkout-form">
      <div className="form-group">
        <label htmlFor="deliveryAddress">Delivery Address: </label>
        <select
          name="deliveryAddress"
          id="deliveryAddress"
          onChange={(e) => setSelectedDeliveryAddress(e.target.value)}
          required
        >
          <option value="">Select Delivery Address</option>
          {deliveryAdd.map((address) => (
            <option key={address.address} value={address.address}>{address.address}</option>
          ))}
        </select>
        </div>

        <div className="form-group">
        <label htmlFor="paymentMethod">Payment Method: </label>
        <select
          name="paymentMethod"
          id="paymentMethod"
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          required
        >
          <option value="">Select Payment Method</option>
          <option value="wallet">Wallet</option>
          <option value="creditCard">Credit Card</option>
          <option value="cashOnDelivery">Cash on Delivery</option>
        </select>
        </div>

        <table className="medicine-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {shoppingCart.map((item) => (
              <tr key={item.medicineName}>
                <td>{item.medicineName}</td>
                <td>{item.quantity}</td>
                <td>{item.medicinePrice}</td>
                <td>{item.quantity * item.medicinePrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="total-text">Total: {total}</p>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <button type="submit">Checkout</button>
      </form>

      <br />

      {/* Add New Delivery Address Section */}
      <form onSubmit={handleAddAddress} className="add-address-form">
      <div className="form-group">
        <label htmlFor="newAddress">Add New Address:</label>
        <input type="text" name="newAddress" id="newAddress" placeholder="New Address" required />
        </div>
        <button type="submit" className="add-address-button">Add Address</button>
      </form>
    </div>
  );
};

export default Checkout;
