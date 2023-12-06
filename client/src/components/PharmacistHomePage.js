import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../App.css';
import '../HomePage.css';
import LogoutButton from './LogoutButton';
import axios from 'axios';

const PharmacistHomePage = ({ onLogout }) => {
  const [walletAmount, setWalletAmount] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/pharmacist/wallet', {
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
        <h1>Welcome Pharmacist</h1>

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
        <Link to="/pharmacist/notifications" className="home-button">
          Notifications
        </Link>
        <Link to="/pharmacist/medicines" className="home-button">
          Medicines
        </Link>
        <Link to="/pharmacist/createMedicines" className="home-button">
          Create Medicine
        </Link>
        <Link to="/pharmacist/allSoldMedicinesReport" className="home-button">
          All Sales Report
        </Link>
        <Link to="/pharmacist/totalSalesByMonth" className="home-button">
          Monthly Sales Report
        </Link>
        <Link to="/pharmacist/chat" className="home-button">
          Chat With Patient
        </Link>
      </div>
      <div>
        <Outlet />
      </div>
      
      <div>
        <LogoutButton onLogout={onLogout} />
      </div>
      <div className="empty-line"></div>
      <Link to="/changePassword/pharmacist" style={{ color: 'black' }}>
        Change Password
      </Link>
      <br></br>
    </div>
  );
};

export default PharmacistHomePage;
