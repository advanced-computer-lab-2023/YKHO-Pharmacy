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
        <div className="menu-group">
          <Link to="/admin/getPharmacist" className="home-button">Find a Pharmacist</Link>
          <Link to="/admin/removePharmacist" className="home-button">Remove a Pharmacist</Link>
        </div>
        <div className="menu-group">
          <Link to="/admin/getPatient" className="home-button">Find a Patient</Link>
          <Link to="/admin/removePatient" className="home-button">Remove a Patient</Link>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
      <div>
        <LogoutButton onLogout={onLogout} />
      </div>
      <div className="empty-line"></div>
        <Link to="/admin/change-password" style={{ color: 'black' }}>Change Password</Link>
    </div>
  );
};

export default AdminHomePage;
