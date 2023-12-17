import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../App.css';
import '../HomePage.css';
import LogoutButton from './LogoutButton';
import axios from 'axios';

const PatientHomePage = ({ onLogout }) => {
  const [walletAmount, setWalletAmount] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        await axios.get("http://localhost:8000/start", {
            withCredentials: true
        }).then((res) => {
            console.log(res.data)
        }
        ).catch((err) => {
            console.log(err);
        })

        const response = await axios.get('http://localhost:8000/patient/wallet', {
          withCredentials: true,
        });

        const data = response.data;
        setWalletAmount(data.walletAmount);
      } catch (error) {
        console.error('Error fetching wallet data:', error.message);
      }
    };

    fetchWalletData();
  }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome Patient</h1>

        <div>
        {walletAmount !== null ? (
          <div>
            <p>Wallet Amount: {walletAmount}</p>
          </div>
        ) : (
          <p>Loading wallet information...</p>
        )}
      </div>

      </div>
      <div className="home-menu">
        <Link to="/patient/shoppingCart" className="home-button">
          Shopping Cart
        </Link>
        <Link to="/patient/medicines" className="home-button">
          Medicines
        </Link>
        <Link to="/patient/orders" className="home-button">
          View Orders
        </Link>
        <Link to="/patient/fileupload" className="home-button">
          Prescriptions Upload
        </Link>
        <Link to="/patient/chat" className="home-button">
          Chat With Pharmacist
        </Link>
      </div>
      <div>
        <Outlet />
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div>
        <LogoutButton onLogout={onLogout} />
      </div>
      <div className="empty-line"></div>
      <Link to="/changePassword/patient" style={{ color: 'black' }}>
        Change Password
      </Link>
      <br></br>
    </div>
  );
};

export default PatientHomePage;
