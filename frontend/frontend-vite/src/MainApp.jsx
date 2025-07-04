import React, { useContext } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import DashBoardDoctor from './components/DashBoardDoctor';

import Dashboard from './components/DashboardNew';
import Login from './components/Login';
import { AuthContext } from './context/AuthContext';
import Patients from './components/Patients';
import Billing from './components/Billing'
import Laboratory from './components/Laboratory';
import InPatientRoom from './components/InPatientRoom';
import AdminPage from './components/AdminPage';
import ReportPage from './components/Reports';
import HelpAbout from './components/HelpAndABout';
import CodingAndBedAssignment from './components/CodingAndBedAssignment';


import UserManagement from './components/UserManagement/UserManagement';
import ForgotPassword from './components/ForgotPassword/ForgotPasswordLayout.jsx';
import ForgotPasswordLayout from './components/ForgotPassword/ForgotPasswordLayout.jsx';
import Step1EnterUserId from './components/ForgotPassword/Step1EnterUserId';
import Step2SecurityQuestion from './components/ForgotPassword/Step2SecurityQuestion.jsx';
import Step3ResetPassword from './components/ForgotPassword/Step3ResetPassword.jsx';
import ForgotPasswordRoutes from './components/ForgotPassword/index.jsx';


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
      <Route path="/forgot-password/*" element={<ForgotPasswordRoutes />}/>
          {/* <Route index element={<Navigate to="enter-id" replace />} />
          <Route path="enter-id" element={<Step1EnterUserId />} />
          <Route path="security-question" element={<Step2SecurityQuestion />} />
          <Route path="reset" element={<Step3ResetPassword />} />
        </Route> */}
      {/* UNPROTECTED ROUTE */}








      {/* AUTHENTICATED ROUTE */}
      <Route element={<ProtectedRoute />}>

      {/* Everything inside layout HAS that NAVBAR */}
        <Route element={<Layout />}>

                      {/* Outlet represents these elements */}
          <Route path="/" element={<Home />} />
          <Route path="/doctor/dashboard" element={<DashBoardDoctor />} /> 
          {/* <Route path="/teller/dashboard" element={<TellerDashboard />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />


          <Route path="/patients/*" element={<Patients />} />
          <Route path="/billing/*" element={<Billing />} />
          <Route path="/laboratory/*" element={<Laboratory />} />
          <Route path="/InPatientRoom/*" element={<InPatientRoom />} />
          <Route path="/coding-bed-assignment" element={<CodingAndBedAssignment />} />

          <Route path="/Admin/*" element={<AdminPage />} />
          <Route path="/Reports/*" element={<ReportPage />} />


          <Route path="/help_about/" element={<HelpAbout />} />
          <Route path="/coding_and_bed_assignment/*" element={<CodingAndBedAssignment />} />








        </Route>

      </Route>
    {/* AUTHENTICATED ROUTE */}

    </Routes>
    //IMAGINARY <ROUTER>
  );
};

export default MainApp;