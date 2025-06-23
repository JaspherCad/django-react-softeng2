import React from "react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.mainDashboardContent}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <div className={styles.headerActions}>
            <div className={styles.hospitalLogo}>
              <img
                src="./hospital_logo.png"
                alt="Antipolo Centro De Medikal Hospital Logo"
                className={styles.logoImage}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className={styles.dashboardContent}>
        {/* Dashboard Cards */}

        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Patients</h3>
            <span className={styles.cardIcon}>🏥</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardNumber}>24</div>
            <div className={styles.cardSubtext}>Admitted patients</div>
          </div>
        </div>

        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Staff on Duty</h3>
            <span className={styles.cardIcon}>👥</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardNumber}>18</div>
            <div className={styles.cardSubtext}>Currently working</div>
          </div>
        </div>

        <div className={styles.dashboardCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>New Patients</h3>
            <span className={styles.cardIcon}>🚨</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardNumber}>2</div>
            <div className={styles.cardSubtext}>Newly admitted patients</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
