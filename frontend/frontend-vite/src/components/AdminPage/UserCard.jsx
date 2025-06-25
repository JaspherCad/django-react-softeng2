// src/components/UserCard.jsx
import React from 'react'
import styles from './UserList.module.css'
import defaultAvatar from '../../assets/default-avatar.jpg'
import axiosInstance from '../../api/axios'
import { useNavigate } from 'react-router-dom'

export default function UserCard({ user }) {
  const navigate = useNavigate()

  const apiHost = axiosInstance.defaults.baseURL.replace(/\/api\/?$/, '')

  const imageUrl = user.images?.[0]?.file
    ?
    user.images[0].file.startsWith('http')
      ? user.images[0].file
      : `${apiHost}${user.images[0].file}`
    : defaultAvatar

  return (
    <div className={styles.userCard}>
      <div className={styles.avatarWrapper}>
        <img
          src={imageUrl}
          alt={`${user.first_name} ${user.last_name}`}
          className={styles.avatar}
          onError={e => { e.currentTarget.src = defaultAvatar }}
        />
      </div>

      <div className={styles.userInfo}>
        <h3 className={styles.userName}>
          {user.first_name} {user.last_name}
        </h3>

        <div className={styles.userDetails}>
          <p><strong>ID:</strong> {user.user_id}</p>
          <p>
            <strong>Role:</strong>{' '}
            <span className={`${styles.badge} ${styles[user.role.toLowerCase()]}`}>
              {user.role}
            </span>
          </p>
          <p><strong>Department:</strong> {user.department}</p>
        </div>

        <div className={styles.userActions}>
          <button 
            className={styles.viewButton}
            onClick={() => navigate(`/admin/${user.id}`)}>
            View Profile
          </button>
          <button className={styles.editButton}>
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
