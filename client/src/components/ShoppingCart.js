import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShoppingCart = () => {
  const [shoppingCart, setShoppingCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchShoppingCart = async () => {
      try {
        const response = await axios.get('http://localhost:8000/patient/ShoppingCart', { withCredentials: true });

        if (response.data && response.data.shoppingCart) {
          setShoppingCart(response.data.shoppingCart);
        } else {
          console.error('No "shoppingCart" found in the API response:', response.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching shopping cart data:', error);
        setLoading(false);
      }
    };

    fetchShoppingCart();
  }, []);

  const handleRemoveFromCart = async (medicineName) => {
    try {
      await axios.post('http://localhost:8000/patient/removeFromCart', { medicineName }, { withCredentials: true });

      // Update the state by filtering out the removed item
      setShoppingCart((prevShoppingCart) => prevShoppingCart.filter(item => item.medicineName !== medicineName));

      // Clear any previous error message
      setErrorMessage(null);
    } catch (error) {
      console.error('Error removing item from cart:', error.message);
      // Handle error if needed
    }
  };

  const handleUpdateQuantity = async (medicineName, newQuantity) => {
    try {
      await axios.post('http://localhost:8000/patient/editCartItemQuantity', { medicineName, newQuantity }, { withCredentials: true });

      // Update the state by mapping over the shopping cart and updating the quantity
      setShoppingCart(prevShoppingCart => prevShoppingCart.map(item => {
        if (item.medicineName === medicineName) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      }));

      // Clear any previous error message
      setErrorMessage(null);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage('Insufficient stock');
      } else {
        console.error('Error updating item quantity:', error.message);
        // Handle error if needed
      }
    }
  };

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="center-aligned">
      <h1 className="header-text">Your Shopping Cart</h1>

      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}
      
      <table className="requests-table">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {shoppingCart.map((item) => (
            <tr key={item.medicineName}>
              <td>{item.medicineName}</td>
              <td>
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateQuantity(item.medicineName, e.target.newQuantity.value); }}>
                  <input type="number" name="newQuantity" defaultValue={item.quantity} />
                  <button type="submit" className='accept-button'>Update Quantity</button>
                </form>
              </td>
              <td className="action-cell">
                <button onClick={() => handleRemoveFromCart(item.medicineName)} className='reject-button'>Remove from Cart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/patient/checkout">
        <button>Continue to Checkout</button>
      </Link>
    </div>
  );
  
};

export default ShoppingCart;
