// src/components/admin/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserManagement.module.css';
import { FetchUsersAPI, FetchUsersRolesAPI } from '../../api/axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    user_id: '',
    password: '',
    role: 'Receptionist',
    department: '',
    is_active: true,
    is_staff: false
  });
  const [roles, setRoles] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await FetchUsersAPI();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await FetchUsersRolesAPI();
      setRoles(Object.entries(response.data));
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/users/list', newUser);
      setNewUser({ 
        ...newUser, 
        user_id: '', 
        password: '' 
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id, updates) => {
    try {
      await axios.put(`/api/users/${id}`, updates);
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await axios.delete(`/api/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Create User Card */}
      <div className={`${styles.card} ${styles.createUserCard}`}>
        <h2>Create New User</h2>
        <form onSubmit={handleCreateUser} className={styles.userForm}>
          <div className={styles.formGroup}>
            <label>User ID</label>
            <input
              type="text"
              value={newUser.user_id}
              onChange={(e) => setNewUser({...newUser, user_id: e.target.value})}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              {roles.map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Department</label>
            <input
              type="text"
              value={newUser.department}
              onChange={(e) => setNewUser({...newUser, department: e.target.value})}
            />
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.btnPrimary}>
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>

      {/* User List */}
      <div className={`${styles.card} ${styles.userListCard}`}>
        <h2>Existing Users</h2>
        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Staff</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.user_id}</td>
                  <td>{user.role}</td>
                  <td>{user.department}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${user.is_active ? styles.active : styles.inactive}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${user.is_staff ? styles.staff : styles.nonStaff}`}>
                      {user.is_staff ? 'Staff' : 'Non-Staff'}
                    </span>
                  </td>
                  <td className={styles.actionButtons}>
                    <button 
                      className={styles.btnEdit}
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.btnToggle}
                      onClick={() => handleUpdateUser(user.id, { is_active: !user.is_active })}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      className={styles.btnDelete}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className={styles.modalOverlay} onClick={() => setEditingUser(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Edit User - {editingUser.user_id}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUser(editingUser.id, editingUser);
            }}>
              <div className={styles.formGroup}>
                <label>Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  {roles.map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Department</label>
                <input
                  type="text"
                  value={editingUser.department}
                  onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Status</label>
                <div className={styles.toggleSwitch}>
                  <span>Active</span>
                  <input
                    type="checkbox"
                    checked={editingUser.is_active}
                    onChange={(e) => setEditingUser({...editingUser, is_active: e.target.checked})}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Staff Access</label>
                <div className={styles.toggleSwitch}>
                  <span>Allow</span>
                  <input
                    type="checkbox"
                    checked={editingUser.is_staff}
                    onChange={(e) => setEditingUser({...editingUser, is_staff: e.target.checked})}
                  />
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
                <button type="submit" className={styles.btnSave}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;