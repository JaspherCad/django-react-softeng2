import React from 'react'
import { Routes, Route } from 'react-router-dom';
import UserList from './UserList';
import UserDetail from './UserDetail';
import Backup from './Backup';


const index = () => {
  return (
    <div className="admin-page">
      <Routes>
        <Route index element={<UserList />} />
        <Route path=":userId" element={<UserDetail />} />
        <Route path="users/:userId" element={<UserDetail />} />
        <Route path="backup" element={<Backup />} />
      </Routes>
    </div>
  );
}

export default index