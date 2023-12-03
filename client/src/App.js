// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminHomePage from './components/AdminHomePage';
import PatientHomePage from './components/PatientHomePage';
import PharmacistHomePage from './components/PharmacistHomePage';
import AddAdministratorForm from './components/AddAdministratorForm';

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
            <Route path="/admin/*" element={userType === 'admin' ? <AdminHomePage onLogout={handleLogout} /> : <Navigate to="/" />}>
              <Route path="addadministrator" element={<AddAdministratorForm />} />
            </Route>
            <Route path="/patient/home" element={userType === 'patient' ? <PatientHomePage onLogout={handleLogout} /> : <Navigate to="/" />} />
            <Route
              path="/pharmacist/home"
              element={userType === 'pharmacist' ? <PharmacistHomePage onLogout={handleLogout} /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
