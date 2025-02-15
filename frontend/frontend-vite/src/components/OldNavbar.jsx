import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Navigation links configuration based on roles
  const navigationConfig = {
    Admin: [
      { to: "/", label: "Home" },
      { to: "/dashboard", label: "Dashboard" },
      { to: "/users", label: "User Management" },
      { to: "/reports", label: "Reports" },
      { to: "/settings", label: "System Settings" }
    ],
    Doctor: [
      { to: "/", label: "Home" },
      { to: "/patients", label: "My Patients" },
      { to: "/appointments", label: "Appointments" },
      { to: "/medical-records", label: "Medical Records" }
    ],
    Nurse: [
      { to: "/", label: "Home" },
      { to: "/patient-care", label: "Patient Care" },
      { to: "/vitals", label: "Vitals Recording" },
      { to: "/medications", label: "Medications" }
    ],
    Staff: [
      { to: "/", label: "Home" },
      { to: "/appointments", label: "Appointments" },
      { to: "/patient-records", label: "Patient Records" }
    ],
    Teller: [
      { to: "/", label: "Home" },
      { to: "/billing", label: "Billing" },
      { to: "/payments", label: "Payments" },
      { to: "/invoices", label: "Invoices" }
    ]
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get navigation links based on user role
  const getNavLinks = () => {
    if (!user || !user.role) return [];
    return navigationConfig[user.role] || [];
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          ACDMH
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user ? (
              getNavLinks().map((link, index) => (
                <li className="nav-item" key={index}>
                  <Link 
                    to={link.to} 
                    className="nav-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            )}
          </ul>

          {user && (
            <div className="d-flex align-items-center">
              <span className="me-3">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;