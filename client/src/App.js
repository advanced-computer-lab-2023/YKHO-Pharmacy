// App.jsx

import React, { useState, useEffect } from 'react';
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
import MedicinesListPharm from './components/MedicinesListPharm';
import EditMedicine from './components/EditMedicine';
import CreateMedicine from './components/CreateMedicine';
import PharmacistNotifications from './components/PharmacistNotifications';
import MedicinesListPatient from './components/MedicinesListPatient';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import OrderSuccessPage from './components/OrderSuccessPage';
import FailedOrderPage from './components/FailedOrderPage';
import OrdersPage from './components/OrdersPage';
import AllSoldMedicinesReport from './components/AllSoldMedicinesReport';
import TotalSalesByMonth from './components/TotalSalesByMonth';
import TotalSalesByMonthAdmin from './components/TotalSalesByMonthAdmin';
import AlternativeMedicines from './components/AlternativeMedicines';
import FileUpload from './components/FileUpload';
import ResultsMed from './components/ResultsMed';
import ChatPatient from './components/ChatPatient';
import ChatPharm from './components/ChatPharm';

const App = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    // Check for userType in localStorage on component mount
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const handleLogin = (userType) => {
    setUserType(userType);
    // Store userType in localStorage
    localStorage.setItem('userType', userType);
  };

  const handleLogout = () => {
    setUserType(null);
    // Remove userType from localStorage on logout
    localStorage.removeItem('userType');
  };

  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={userType ? <Navigate to={`/${userType}/home`} /> : <LoginPage onLogin={handleLogin} />} />
             <Route path="/register" element={<RegisterPage />} />
             <Route path="/register/patient" element={<PatientRegistration />} />
             <Route path="/register/pharmacist" element={<PharmacistRegistration />} />
             <Route path="/admin/*" element={userType === 'admin' ? <AdminHomePage onLogout={handleLogout} /> : <Navigate to="/" />}>
             <Route path="addadministrator" element={<AddAdministratorForm />} />
             <Route path="getRequests" element={<RequestsList />} />
             <Route path="medicines" element={<MedicinesList />} />
             <Route path="getPharmacist" element={<GetPharmacist />} />
             <Route path="getPatient" element={<GetPatient />} />
             <Route path="totalSalesByMonth" element={<TotalSalesByMonthAdmin />} />
            </Route>

             <Route path="patient/success" element={<OrderSuccessPage />} />
             <Route path="patient/failure" element={<FailedOrderPage />} />
             <Route path="patient/chat" element={<ChatPatient />} />
            <Route path="/patient/*" element={userType === 'patient' ? <PatientHomePage onLogout={handleLogout} /> : <Navigate to="/" />}>
             <Route path="medicines" element={<MedicinesListPatient />} />
             <Route path="orders" element={<OrdersPage />} />
             <Route path="alternative/:medicineName" element={<AlternativeMedicines />} />
             <Route path="shoppingCart" element={<ShoppingCart />} />
             <Route path="checkout" element={<Checkout />} />
             <Route path="fileupload" element={<FileUpload />} />
             <Route path="resultsMed" element={<ResultsMed />} />
            </Route>

             <Route path="pharmacist/chat" element={<ChatPharm />} />
            <Route path="/pharmacist/*" element={userType === 'pharmacist' ? <PharmacistHomePage onLogout={handleLogout} /> : <Navigate to="/" />}>
            <Route path="medicines" element={<MedicinesListPharm />} />
            <Route path="notifications" element={<PharmacistNotifications />} />
            <Route path="createMedicines" element={<CreateMedicine />} />
            <Route path="allSoldMedicinesReport" element={<AllSoldMedicinesReport />} />
            <Route path="totalSalesByMonth" element={<TotalSalesByMonth />} />
            <Route path="editMedicine/:name/:dosage/:description/:medUse/:price" element={<EditMedicine />} />
            </Route>

            {/* Route for Request Password Reset */}
            <Route path="/request-reset" element={<RequestPasswordResetPage />} />
            {/* Route for Entering OTP (adjust the path accordingly) */}
            <Route path="/enter-otp" element={<EnterOTPPage />} />
            <Route path="/resetPassword/:userType" element={<ResetPassword />} />
            <Route path="/changePassword/:userType" element={<ChangePassword />} />
          </Routes>
        </Router>
      </div>
  );
};

export default App;
