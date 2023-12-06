import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PharmacistNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Make a GET request to fetch notifications from the server
        const response = await axios.get('http://localhost:8000/pharmacist/notifications', {withCredentials: true});
        
        // Update state with the fetched notifications
        setNotifications(response.data.notifications ?? []);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
        // Handle error if needed
      }
    };

    // Invoke the fetchNotifications function
    fetchNotifications();
  }, []); // The empty dependency array ensures the effect runs only once on mount

  return (
    <div className="center-aligned">
      <h1 className="header-text">Notifications</h1>

      {notifications?.length > 0 ? (
        <table className="requests-table">
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification._id}>
                <td>{notification.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p colSpan="12" className="no-requests">No notifications available.</p>
      )}
    </div>
  );
};

export default PharmacistNotifications;
