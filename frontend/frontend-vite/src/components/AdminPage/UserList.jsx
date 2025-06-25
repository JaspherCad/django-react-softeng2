// UserList.jsx
import React, { useEffect, useState } from 'react';
import styles from './UserList.module.css';
import axiosInstance, { SearchHospitalUserApi } from '../../api/axios';
import UserCard from './UserCard';
import Pagination from './Pagination';
import SearchBar from '../AngAtingSeachBarWIthDropDown';
import AddUserModal from './AddUserModal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const PAGE_SIZE = 2;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/users/list', {
          params: {page: currentPage }
        });
        setUsers(response.data.results);
        setTotalItems(response.data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [searchTerm, currentPage]);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>User Management</h1>
      
      <div className={styles.toolbar}>
        <SearchBar
          placeholder="Search users..."
          searchApi={SearchHospitalUserApi}
          onSelectSuggestion={(item) => {
            setSearchTerm(item.user_id);
            setCurrentPage(1);
            setIsDropdownVisible(false);
          }}
          suggestedOutput={['user_id', 'first_name', 'last_name']}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isDropdownVisible={isDropdownVisible}
          setIsDropdownVisible={setIsDropdownVisible}
          maxDropdownHeight="500px"
        />
        
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          + Add New User
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading users...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <div className={styles.userGrid}>
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {showAddModal && (
        <AddUserModal 
          onClose={() => setShowAddModal(false)} 
          onUserAdded={(newUser) => {
            setUsers(prev => [newUser, ...prev]);
            setTotalItems(prev => prev + 1);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default UserList;