import React, { useContext } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { AuthContext } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
};

// Layout component for routes that need Navbar and container
const Layout = () => {
  return (
    <>
    <div className='app-layout'>
      <Navbar />
      <div className="container-main">
        <Outlet /> {/* Renders the child route element */}
      </div>
    </div>
    </>
  );
};

const MainApp = () => {
  return ( 
    //IMAGINARY <ROUTER>
    <Routes>

      {/* Public routes */}
      <Route path="/login" element={<Login />} />








      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
    //IMAGINARY <ROUTER>
  );
};

export default MainApp;