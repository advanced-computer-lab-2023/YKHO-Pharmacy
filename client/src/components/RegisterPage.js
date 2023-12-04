// RegisterPage.jsx
import React from 'react';
import '../RegisterPage.css';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2 className='register-h2'>Registration Type</h2>
      <div>
        <button onClick={() => navigate('/register/patient')} className='register-button'>Patient</button>
      </div>
      <div>
        <button onClick={() => navigate('/register/pharmacist')} className='register-button'>Pharmacist</button>
      </div>
    </div>
  );
};

export default RegisterPage;
