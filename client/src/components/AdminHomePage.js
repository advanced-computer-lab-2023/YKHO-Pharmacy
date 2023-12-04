// AdminHomePage.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../App.css';
import '../HomePage.css';
import LogoutButton from './LogoutButton';

const AdminHomePage = ({ onLogout }) => {
  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome Admin</h1>
      </div>
      <div className="home-menu">
          <Link to="/admin/addadministrator" className="home-button">Add Administrator</Link>
          <Link to="/admin/getRequests" className="home-button">Requests</Link>
          <Link to="/admin/medicines" className="home-button">Medicines</Link>
          <Link to="/admin/getPharmacist" className="home-button">Manage Pharmacists</Link>
          <Link to="/admin/getPatient" className="home-button">Manage Patients</Link>
      </div>
      <div>
        <Outlet />
      </div>
      <div>
        <LogoutButton onLogout={onLogout} />
      </div>
      <div className="empty-line"></div>
      <Link to="/changePassword/admin" style={{ color: 'black' }}>Change Password</Link>
        <br></br>
    </div>
  );
};

export default AdminHomePage;
