import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import hospitalLogo from '../../assets/react.svg';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationConfig = {
    Admin: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/patients", label: "View Patients" },
      { to: "/patients/add", label: "Add Patient" },
      { to: "/add-users", label: "Add Users" },
      { to: "/user-logs", label: "User Logs" },
      { to: "/reports", label: "Reports" },
      { to: "/help", label: "Help" },
      { to: "/about", label: "About" }
    ],
    Teller: [
      { to: "/", label: "Billing" },
      { to: "/Dashboard", label: "Services" }
    ]
  
    // ... other role configurations
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user || !user.role) return [];
    return navigationConfig[user.role] || [];
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
      >
        <span className={styles.hamburger}></span>
      </button>
      {/* Mobile Menu Toggle Button */}








      <div className={`${isMobileMenuOpen ? styles.sidebarOpen : ''} ${styles.sidebar}`}>
        {/* Mobile Close Button */}
        <button 
          className={styles.mobileCloseButton}
          onClick={toggleMobileMenu}
        >
          ×
        </button>

        <div className={styles.sidebarHeader}>
          <img src={hospitalLogo} alt="Hospital Logo" className={styles.logo} />
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>ACDMH</h2>
        </div>

        <nav>
          <ul className={styles.navList}>
            {getNavLinks().map((link, index) => (
              <li key={index} className={styles.navItem}>
                <Link
                  to={link.to}
                  className={`${styles.navLink} ${
                    location.pathname === link.to ? styles.active : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {user && (
          <div className={styles.sidebarFooter}>
            <span className={styles.userInfo}>
              {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={toggleMobileMenu}></div>
      )}
    </>
  );
};

export default Navbar; 