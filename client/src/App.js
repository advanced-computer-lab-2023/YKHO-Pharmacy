// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PatientRegistration from './components/PatientRegistration';
import PharmacistRegistration from './components/PharmacistRegistration';
import AdminHomePage from './components/AdminHomePage';
import RequestsList from './components/RequestsList';
import AddAdministratorForm from './components/AddAdministratorForm';
import PatientHomePage from './components/PatientHomePage';
import PharmacistHomePage from './components/PharmacistHomePage';
import RequestPasswordResetPage from './components/RequestPasswordResetPage';
import EnterOTPPage from './components/EnterOTPPage';
import MedicinesList from './components/MedicinesList';
import GetPharmacist from './components/GetPharmacist';
import GetPatient from './components/GetPatient';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';

const App = () => {
  const [userType, setUserType] = useState(null);

  const handleLogin = (userType) => {
    setUserType(userType);
  };

  const handleLogout = () => {
    setUserType(null);
  };

  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route
              path="/"
              element={userType ? <Navigate to={`/${userType}/home`} /> : <LoginPage onLogin={handleLogin} />}
            />
             <Route path="/register" element={<RegisterPage />} />
             <Route path="/register/patient" element={<PatientRegistration />} />
             <Route path="/register/pharmacist" element={<PharmacistRegistration />} />
             <Route path="/admin/*" element={userType === 'admin' ? <AdminHomePage onLogout={handleLogout} /> : <Navigate to="/" />}>
             <Route path="addadministrator" element={<AddAdministratorForm />} />
             <Route path="getRequests" element={<RequestsList />} />
             <Route path="medicines" element={<MedicinesList />} />
             <Route path="getPharmacist" element={<GetPharmacist />} />
             <Route path="getPatient" element={<GetPatient />} />
            </Route>

            <Route path="/patient/home" element={userType === 'patient' ? <PatientHomePage onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route
              path="/pharmacist/home"
              element={userType === 'pharmacist' ? <PharmacistHomePage onLogout={handleLogout} /> : <Navigate to="/" />}
            />

            {/* Route for Request Password Reset */}
            <Route path="/request-reset" element={<RequestPasswordResetPage />} />
            {/* Route for Entering OTP (adjust the path accordingly) */}
            <Route path="/enter-otp" element={<EnterOTPPage />} />
            <Route path="/resetPassword/:userType" element={<ResetPassword />} />
            <Route path="/changePassword/:userType" element={<ChangePassword />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
