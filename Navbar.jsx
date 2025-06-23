import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { Outlet } from "react-router-dom";

const Navbar = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "./home.png",
      path: "/dashboard",
    },
    {
      id: "patient",
      label: "Patient Records",
      icon: "./patient.png",
      path: "/patientRecords",
    },

    {
      id: "employee",
      label: "Employee",
      icon: "./employee.png",
      path: "/employeeRecords",
    },
    {
      id: "billing",
      label: "Billing",
      icon: "./bill.png",
      path: "/billing",
    },
    {
      id: "report",
      label: "Report",
      icon: "./report.png",
      path: "/report",
    },
  ];

  const handleMenuClick = (item) => {
    setActiveMenuItem(item.label);
    navigate(item.path);
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* User Profile Section */}
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>
            <img
              src="./user.png"
              alt="User Avatar"
              className={styles.avatarImage}
            />
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Cortina, Clarence C.</div>
            <div className={styles.userRole}>ADMIN</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navigation}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`${styles.menuItem} ${
                activeMenuItem === item.label ? styles.menuItemActive : ""
              }`}
            >
              <span className={styles.menuIcon}>
                <img
                  src={item.icon}
                  alt={`${item.label} icon`}
                  className={styles.menuIconImage}
                />
              </span>
              <span className={styles.menuLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Help & About Section */}
        <div className={styles.helpSection}>
          <button className={styles.helpButton}>
            <span className={styles.helpIcon}>
              <img
                src="./question.png"
                alt="Help icon"
                className={styles.helpIconImage}
              />
            </span>
            <span className={styles.helpLabel}>Help & About</span>
          </button>

          {/* Logout Button moved here */}
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Render sub-pages (dashboard, patients, etc) here */}
      <div className={styles.dashboardContent}>
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
