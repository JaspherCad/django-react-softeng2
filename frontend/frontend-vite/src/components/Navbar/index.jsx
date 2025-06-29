import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import hospitalLogo from "../../assets/react.svg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import defaultAvatar from "../../assets/default-avatar.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationConfig = {
    Admin: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: <i className="fas fa-home"></i>,
      },
      {
        to: "/patients",
        label: "Patients",
        icon: <i className="fas fa-users"></i>,
      },
      {
        to: "/admin",
        label: "Users",
        icon: <i className="fas fa-user-cog"></i>,
      },
      {
        to: "/billing/lists_transactions",
        label: "Billing",
        icon: <i className="fas fa-file-invoice-dollar"></i>,
      },
      {
        to: "/inpatientroom",
        label: "Rooms",
        icon: <i className="fas fa-procedures"></i>,
      },
      {
        to: "/reports",
        label: "Reports",
        icon: <i className="fas fa-chart-bar"></i>,
      },
      {
        to: "/help_about",
        label: "Help & About",
        icon: <i className="fas fa-question-circle"></i>,
      },
    ],

    Doctor: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: <i className="fas fa-home"></i>,
      },
      {
        to: "/patients",
        label: "Patients",
        icon: <i className="fas fa-users"></i>,
      },
      {
        to: "/laboratory",
        label: "Laboratory",
        icon: <i className="fas fa-file"></i>,
      },
      {
        to: "/help_about",
        label: "Help & About",
        icon: <i className="fas fa-question-circle"></i>,
      },
    ],

    Nurse: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: <i className="fas fa-home"></i>,
      },
      {
        to: "/patients",
        label: "Patients",
        icon: <i className="fas fa-users"></i>,
      },
      {
        to: "/laboratory",
        label: "Laboratory",
        icon: <i className="fas fa-flask"></i>,
      },
      {
        to: "/help_about",
        label: "Help & About",
        icon: <i className="fas fa-question-circle"></i>,
      },
    ],

    Receptionist: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: <i className="fas fa-home"></i>,
      },
      {
        to: "/patients",
        label: "Patients",
        icon: <i className="fas fa-users"></i>,
      },
      {
        to: "/user",
        label: "Users",
        icon: <i className="fas fa-user-cog"></i>,
      },
      {
        to: "/billing/lists_transactions",
        label: "Billing",
        icon: <i className="fas fa-file-invoice-dollar"></i>,
      },
      {
        to: "/inpatientroom",
        label: "Rooms",
        icon: <i className="fas fa-procedures"></i>,
      },

      {
        to: "/help_about",
        label: "Help & About",
        icon: <i className="fas fa-question-circle"></i>,
      },
    ],

    Teller: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: <i className="fas fa-home"></i>,
      },
      {
        to: "/billing/lists_transactions",
        label: "Billing",
        icon: <i className="fas fa-file-invoice-dollar"></i>,
      },
      {
        to: "/inpatientroom",
        label: "Rooms",
        icon: <i className="fas fa-procedures"></i>,
      },
      {
        to: "/help_about",
        label: "Help & About",
        icon: <i className="fas fa-question-circle"></i>,
      },
    ],

    // ... other role configurations
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavLinks = () => {
    if (!user || !user.role) return [];
    return navigationConfig[user.role] || [];
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
        <span className={styles.hamburger}></span>
      </button>
      {/* Mobile Menu Toggle Button */}

      <div
        className={`${isMobileMenuOpen ? styles.sidebarOpen : ""} ${styles.sidebar
          }`}
      >
        {/* Mobile Close Button */}
        <button className={styles.mobileCloseButton} onClick={toggleMobileMenu}>
          ×
        </button>

        {/* <div className={styles.sidebarHeader}>
          {user && (
            <>
              <img src={hospitalLogo} alt="Hospital Logo" className={styles.logo} />
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{user.last_name},  {user.first_name} </h2>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{user.role} </h3>

            </>

          )}

        </div> */}
        <div className={styles.userProfile}>
          {user && (
            <>
              {/* User Profile Section */}
              {/* User Avatar */}
              <div className={styles.avatarContainer}>
                <img
                  src={user.images && user.images.length > 0 && user.images[0].file ? user.images[0].file : defaultAvatar}
                  alt="User Avatar"
                  className={styles.avatar}
                />
              </div>

              {/* User Info */}
              <div className={styles.userInfo}>
                <h2>
                  {user.last_name}, {user.first_name}
                </h2>
                <p className={styles.role}>{user.role}</p>
              </div>
            </>
          )}
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className={styles.navList}>
            {getNavLinks().map((link, index) => (
              <li key={index} className={styles.navItem}>
                <Link
                  to={link.to}
                  className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ""
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className={styles.icon}>{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {user && (
          <div className={styles.sidebarFooter}>
            <button onClick={handleLogout} className={styles.logoutButton}>
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