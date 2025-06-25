import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './UserDetail.module.css';
import axiosInstance from '../../api/axios';

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users/${userId}`);
        console.log(response.data)
        setUser(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Get first image or default avatar
  const userProfileImage = user.images?.[0]?.file || '/default-avatar.jpg';

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Viewing Employee #{user.user_id}</h1>

      <div className={styles.actions}>
        <button className={styles.updateButton}>
          <span className="material-symbols-outlined">edit</span> Update
        </button>
      </div>

      <div className={styles.detailCard}>
        <h2 className={styles.detailTitle}>Employee Details</h2>
        <hr className={styles.titleUnderline} />

        <div className={styles.infoGrid}>
          {/* Profile Image */}
          <div className={styles.imageContainer}>
            {user.images?.[0] ?
              (<>
                <img
                  src={`http://localhost:8000${user.images?.[0]?.file}`}
                  alt={`${user.first_name} ${user.last_name}`}
                  className={styles.profileImage}
                />
              </>) :
              (<>
                <img
                  src={'/default-avatar.png'}
                  alt={`${user.first_name} ${user.last_name}`}
                  className={styles.profileImage}
                />
              </>)}

          </div>

          {/* Basic Information */}
          <div className={styles.infoSection}>
            <div className={styles.field}>
              <strong>Name:</strong> {user.first_name} {user.last_name}
            </div>

            <div className={styles.field}>
              <strong>Employee ID:</strong> {user.user_id}
            </div>

            <div className={styles.field}>
              <strong>Role:</strong> {user.role}
            </div>

            <div className={styles.field}>
              <strong>Contact Number:</strong> {user.phone || 'N/A'}
            </div>

            <div className={styles.field}>
              <strong>Department:</strong> {user.department}
            </div>

            <div className={styles.field}>
              <strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}
            </div>

            <div className={styles.field}>
              <strong>Birthdate:</strong> {user.birthdate?.split('-').reverse().join('/') || 'N/A'}
            </div>

            <div className={styles.field}>
              <strong>Address:</strong> {user.address || 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;