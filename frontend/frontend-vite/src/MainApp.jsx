import React, { useContext } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DashBoardDoctor from './components/DashBoardDoctor';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { AuthContext } from './context/AuthContext';
import Patients from './components/Patients';
import Billing from './components/Billing'
import Laboratory from './components/Laboratory';
import TellerDashboard from './components/DashBoardTeller';

// Protected Route Component
const ProtectedRoute = () => {
  const { user, authChecked } = useContext(AuthContext);
  const location = useLocation();

  // console.log('Auth state:', { user, authChecked });

  if (!authChecked) {
    return "<LoadingSpinner />;"
  }
  // console.log('Auth state:', { user, authChecked });

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// Layout component for routes that need Navbar and container
const Layout = () => {
  return (
    <>
    {/* USE GRID TO PROPELRY ALIGHN THESe lAYOUT */}
    <div className='app-layout'> 
        <div className="navBarClass">
          <Navbar />
        </div>
        
        <div className="container-main">
          <Outlet /> {/* Renders the child route element */}
        </div>
    </div>
    </>
  );
};








// Here’s a simplified explanation: ROUTE NESTIN!!

// User navigates to /dashboard.

// React Router matches /dashboard with the nested <Route path="/dashboard" element={<Dashboard />} /> inside the <Layout> route.

// <Layout> gets rendered first, then <Outlet /> inside <Layout> gets replaced by the <Dashboard> component.

// So even though <Layout> itself doesn’t have a URL, it gets rendered whenever its child routes (<Home>, <Dashboard>, or <Patients>) are matched.

const MainApp = () => {
  return ( 
    //IMAGINARY <ROUTER>
    <Routes>
      {/* UNPROTECTED ROUTE */}
      <Route path="/login" element={<Login />} />
      {/* UNPROTECTED ROUTE */}

      {/* AUTHENTICATED ROUTE */}
      <Route element={<ProtectedRoute />}>

      {/* Everything inside layout HAS that NAVBAR */}
        <Route element={<Layout />}>

                      {/* Outlet represents these elements */}
          <Route path="/" element={<Home />} />
          <Route path="/doctor/dashboard" element={<DashBoardDoctor />} />
          <Route path="/teller/dashboard" element={<TellerDashboard />} />

          <Route path="/patients/*" element={<Patients />} />
          <Route path="/billing/*" element={<Billing />} />
          <Route path="/laboratory/*" element={<Laboratory />} />



        </Route>

      </Route>
    {/* AUTHENTICATED ROUTE */}

    </Routes>
    //IMAGINARY <ROUTER>
  );
};

export default MainApp;