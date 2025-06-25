import React from 'react'
import { Routes, Route } from 'react-router-dom';
import UserList from './UserList';
import UserDetail from './UserDetail';


const index = () => {
  return (
    <div className="admin-page">
      <Routes>
        <Route index element={<UserList />} />
        <Route path="/:userId" element={<UserDetail />} />
      </Routes>
    </div>
  );
}

export default index