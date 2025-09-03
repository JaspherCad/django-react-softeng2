import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import config from '../../config/config';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        total_patients: 0,
        active_members: 0,
        new_patients_last_7_days: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/dashboard/dashboard_totals');
            setDashboardData(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🏥</span>
                    </div>
                </div>
                <div className={styles.loading}>Loading dashboard data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Dashboard</h1>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🏥</span>
                    </div>
                </div>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>🏥</span>
                </div>
            </div>
            
            <div className={styles.cardsContainer}>
                {/* Total Patients Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Total Patients</h3>
                        <div className={styles.cardIcon}>
                            <span className={styles.icon}>👥</span>
                        </div>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.number}>{dashboardData.total_patients}</div>
                        <div className={styles.subtitle}>Admitted patients</div>
                    </div>
                </div>

                {/* Staff on Duty Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>Staff on Duty</h3>
                        <div className={styles.cardIcon}>
                            <span className={styles.icon}>👨‍⚕️</span>
                        </div>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.number}>{dashboardData.active_members}</div>
                        <div className={styles.subtitle}>Currently working</div>
                    </div>
                </div>

                {/* New Patients Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>New Patients</h3>
                        <div className={styles.cardIcon}>
                            <span className={styles.icon}>🆕</span>
                        </div>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.number}>{dashboardData.new_patients_last_7_days}</div>
                        <div className={styles.subtitle}>Newly admitted patients</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
