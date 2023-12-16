// RegisterPage.jsx
import React from 'react';
import '../RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="center-aligned">
      <h2 className='register-h2'>Specify Registration Type</h2>
      <div>
        <button onClick={() => navigate('/register/patient')} className='accept-button'>Patient</button>
      </div>
      <br></br>
      <div>
        <button onClick={() => navigate('/register/pharmacist')} className='accept-button'>Pharmacist</button>
      </div>
      <p style={{ textAlign: 'left' }}>
        <Link to="/">Back to Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
