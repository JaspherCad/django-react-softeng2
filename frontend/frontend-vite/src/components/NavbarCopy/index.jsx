import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Navbar.module.css';
import hospitalLogo from '../../assets/react.svg';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  //the state if tru show the sideBar and overlay
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  //CREATE MOBILE APPLICATION
    //create a BUTTONS (X and HAMBURGER) where if clicked,
      //toggle the isMobileMenuOpen where if true show the sideBar and overlay
      //else hide the sideBar and overlay



  const navigationConfig = {
    Admin: [ //use array for us to to .map() functions
      { to: "/dashboard", label: "Dashboard" },
      { to: "/patient-records", label: "Patient Records" },
      { to: "/add-records", label: "Add Records" },
      { to: "/add-users", label: "Add Users" },
      { to: "/user-logs", label: "User Logs" },
      { to: "/reports", label: "Reports" },
      { to: "/help", label: "Help" },
      { to: "/about", label: "About" }
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
    console.log(isMobileMenuOpen);
  };

    

  return (
    <>
    <button 
        className={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
    >
      
        <span className={styles.hamburger}>vParts</span>
    </button>

    {/* <div className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}> */}

      <div className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen:'' }`}>
        <div className={styles.sidebarHeader}>
          <img src={hospitalLogo} alt="Hospital Logo" className={styles.logo} />
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>ACDMH</h2>
        </div>

        <nav>
          <ul className={styles.navList}>
            {getNavLinks().map((link, index) => (
              <li key={index} className={styles.navItem}>
                {/* a href or LINK.. we do LINK */}
                <Link
                  to={link.to}
                  className={`${styles.navLink} ${
                    location.pathname === link.to ? styles.active : ''
                  }`}
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
    </>
    
  );
};

export default Navbar;