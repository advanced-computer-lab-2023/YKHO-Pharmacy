import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/patient/orders', { withCredentials: true });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Run the effect only once on component mount

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.post('http://localhost:8000/patient/cancelOrder', { orderId }, { withCredentials: true });

      // Assuming you want to refresh the orders after canceling
      if (response.status === 200) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error canceling order:', error.message);
    }
  };


  return (
    <div className="center-aligned">
      <h1 className="header-text">Your Orders</h1>

      <main>
        <section id="orders">
          {orders.length > 0 ? (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Medicine Name</th>
                  <th>Quantity</th>
                  <th>Delivery Address</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  order.shoppingCart.map((item, index) => (
                    <tr key={`${order._id}-${item.medicineName}`}>
                      {index === 0 && (
                        <>
                          <td rowSpan={order.shoppingCart.length}>{order._id}</td>
                          <td rowSpan={order.shoppingCart.length}>{item.medicineName}</td>
                          <td rowSpan={order.shoppingCart.length}>{item.quantity}</td>
                          <td rowSpan={order.shoppingCart.length}>{order.deliveryAdd}</td>
                          <td rowSpan={order.shoppingCart.length}>{order.paymentMethod}</td>
                          <td rowSpan={order.shoppingCart.length}>{order.status}</td>
                          <td rowSpan={order.shoppingCart.length} className="action-cell">
                          {order.status !== 'canceled' && (
                            <button className="reject-button" onClick={() => handleCancelOrder(order._id)}>
                                Cancel Order
                            </button>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          ) : (
            <p>You have no orders.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default OrdersPage;
